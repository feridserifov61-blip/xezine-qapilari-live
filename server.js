const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { TikTokLiveConnection, WebcastEvent, ControlEvent } = require('tiktok-live-connector');
const Engine = require('./questions-engine.js');

const PORT = Number(process.env.PORT) || 3002;
const DEFAULT_TIKTOK_USER = (process.env.TIKTOK_USER || 'bakuremixlab').trim().replace(/^@+/, '').toLowerCase();
const PUBLIC_DIR = path.join(__dirname, 'public');
const QUESTIONS_PATH = path.join(__dirname, 'questions.json');
const SETTINGS_PATH = path.join(__dirname, 'settings.json');

const QUESTIONS_PER_ROUND = 10;
const TOTAL_ROUNDS_IN_SEASON = Engine.TOPICS.length; // 10 rounds

function loadSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8')) || {};
  } catch {
    return {};
  }
}

function saveSettings(patch) {
  try {
    const next = { ...loadSettings(), ...patch };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2));
  } catch (_) {}
}

const initialSettings = loadSettings();

// Load & classify base 946 questions into the 10 topics
const baseByTopic = {};
for (const t of Engine.TOPICS) baseByTopic[t.id] = [];

try {
  const raw = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
  if (Array.isArray(raw)) {
    for (const q of raw) {
      if (!q || !q.question || !q.options || !q.correct) continue;
      const tId = Engine.tagBaseTopic(q);
      if (!baseByTopic[tId]) baseByTopic[tId] = [];
      baseByTopic[tId].push(q);
      baseByTopic.superfinal.push(q);
    }
  }
} catch (err) {
  console.warn('[Questions] questions.json oxunmadi:', err.message);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ==================== GAME STATE ====================
const game = {
  seasonNumber: 1,
  roundInSeason: 1, // 1..10
  autoAdvanceTopics: true,
  topicId: Engine.TOPICS[0].id,
  phase: 'question', // 'question' | 'reveal' | 'round_victory' | 'season_victory'
  qIndex: 0,
  questions: [],
  doors: Array(QUESTIONS_PER_ROUND).fill('pending'), // 'pending' | 'current' | 'open' | 'locked'
  lastDoorOutcome: null, // 'open' | 'locked' | null
  questionTime: 22,
  customQuestionTime: initialSettings.customQuestionTime || null,
  timeLeft: 22,
  soundMuted: false,
  votes: { A: 0, B: 0, C: 0, D: 0 },
  voters: new Map(), // uniqueId -> { choice, nickname }
  goldenKey: null, // { uniqueId, nickname }
  eliminatedOptions: [],
  hintShown: false,
  likeEnergy: 0, // 0..100
  bonus2xActive: false,
  bonus2xQueued: false,
  streaks: new Map(), // uniqueId -> int
  roundLeaderboard: new Map(), // uniqueId -> { uniqueId, nickname, score }
  seasonLeaderboard: new Map(), // uniqueId -> { uniqueId, nickname, score, crowns }
  seen: new Set(),
  timer: null,
  phaseTimeout: null
};

const tiktok = {
  username: DEFAULT_TIKTOK_USER,
  conn: null,
  connecting: false,
  connected: false,
  viewerCount: 0,
  error: '',
  reconnectTimer: null
};

app.get('/healthz', (_req, res) => {
  res.status(200).json({
    ok: true,
    connected: tiktok.connected,
    season: game.seasonNumber,
    round: game.roundInSeason,
    qIndex: game.qIndex
  });
});

function getTopicMeta(topicId) {
  return Engine.TOPICS.find((t) => t.id === topicId) || Engine.TOPICS[0];
}

function sortedBoard(map) {
  return Array.from(map.values())
    .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.crowns || 0) - (a.crowns || 0))
    .slice(0, 5);
}

function buildClientState() {
  const topicMeta = getTopicMeta(game.topicId);
  const nextRoundNum = game.roundInSeason < TOTAL_ROUNDS_IN_SEASON ? game.roundInSeason + 1 : 1;
  const nextTopicMeta = Engine.TOPICS[nextRoundNum - 1] || Engine.TOPICS[0];
  const rawQ = game.questions[game.qIndex] || null;
  const isSuperFinal = game.topicId === 'superfinal';

  return {
    seasonNumber: game.seasonNumber,
    roundInSeason: game.roundInSeason,
    totalRoundsInSeason: TOTAL_ROUNDS_IN_SEASON,
    autoAdvanceTopics: game.autoAdvanceTopics,
    topicMeta,
    nextTopicMeta,
    topicsList: Engine.TOPICS,
    totalBankCount: Engine.TOTAL_UNIQUE_QUESTIONS,
    phase: game.phase,
    qIndex: game.qIndex,
    totalInRound: QUESTIONS_PER_ROUND,
    doors: game.doors,
    openedCount: game.doors.filter((d) => d === 'open').length,
    lastDoorOutcome: game.lastDoorOutcome,
    questionTime: game.questionTime,
    timeLeft: game.timeLeft,
    soundMuted: game.soundMuted,
    currentQuestion: rawQ,
    votes: game.votes,
    goldenKey: game.goldenKey,
    eliminatedOptions: game.eliminatedOptions,
    hintShown: game.hintShown,
    likeEnergy: game.likeEnergy,
    bonus2xActive: game.bonus2xActive || isSuperFinal,
    isSuperFinal,
    roundLeaderboard: sortedBoard(game.roundLeaderboard),
    seasonLeaderboard: sortedBoard(game.seasonLeaderboard)
  };
}

function broadcastState() {
  io.emit('game-state-sync', buildClientState());
}

function startRound(roundIdx1Based = game.roundInSeason, overrideTopicId = null) {
  clearInterval(game.timer);
  clearTimeout(game.phaseTimeout);

  const clamped = Math.max(1, Math.min(TOTAL_ROUNDS_IN_SEASON, roundIdx1Based));
  game.roundInSeason = clamped;
  const meta = overrideTopicId ? getTopicMeta(overrideTopicId) : Engine.TOPICS[clamped - 1];
  game.topicId = meta.id;
  game.qIndex = 0;
  game.doors = Array(QUESTIONS_PER_ROUND).fill('pending');
  game.roundLeaderboard.clear();

  if (game.seen.size > 18000) {
    game.seen.clear();
  }
  game.questions = Engine.buildRoundQuestions(game.topicId, QUESTIONS_PER_ROUND, baseByTopic, game.seen);
  loadQuestion(0);
}

function loadQuestion(idx) {
  clearInterval(game.timer);
  clearTimeout(game.phaseTimeout);

  game.qIndex = idx;
  game.phase = 'question';
  game.lastDoorOutcome = null;
  game.questionTime = game.customQuestionTime || (game.topicId === 'logic' ? 24 : 20);
  game.timeLeft = game.questionTime;
  game.votes = { A: 0, B: 0, C: 0, D: 0 };
  game.voters.clear();
  game.goldenKey = null;
  game.eliminatedOptions = [];
  game.hintShown = false;
  game.bonus2xActive = game.bonus2xQueued;
  game.bonus2xQueued = false;

  for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
    if (i === idx) game.doors[i] = 'current';
    else if (i > idx && game.doors[i] === 'current') game.doors[i] = 'pending';
  }

  broadcastState();

  game.timer = setInterval(() => {
    if (game.phase !== 'question') return;
    game.timeLeft = Math.max(0, game.timeLeft - 1);
    broadcastState();
    if (game.timeLeft <= 0) {
      revealAnswer();
    }
  }, 1000);
}

function addPlayerPoints(uniqueId, nickname, pts) {
  const rPrev = game.roundLeaderboard.get(uniqueId) || { uniqueId, nickname, score: 0 };
  rPrev.score += pts;
  rPrev.nickname = nickname;
  game.roundLeaderboard.set(uniqueId, rPrev);

  const sPrev = game.seasonLeaderboard.get(uniqueId) || { uniqueId, nickname, score: 0, crowns: 0 };
  sPrev.score += pts;
  sPrev.nickname = nickname;
  game.seasonLeaderboard.set(uniqueId, sPrev);
}

function revealAnswer() {
  if (game.phase !== 'question') return;
  clearInterval(game.timer);
  clearTimeout(game.phaseTimeout);
  game.phase = 'reveal';

  const q = game.questions[game.qIndex];
  const isSuperFinal = game.topicId === 'superfinal';
  const doorBonus = game.qIndex === QUESTIONS_PER_ROUND - 1 ? 3 : 1; // 10th door = x3!
  const likeBonus = game.bonus2xActive ? 2 : 1;
  const finalMul = isSuperFinal ? 2 * doorBonus : doorBonus * likeBonus;

  let correctCount = 0;
  if (q) {
    for (const [uid, info] of game.voters.entries()) {
      if (info.choice === q.correct) {
        correctCount++;
        const st = (game.streaks.get(uid) || 0) + 1;
        game.streaks.set(uid, st);
        const streakMul = st >= 5 ? 3 : st >= 3 ? 2 : 1;
        const basePts = 100 + game.qIndex * 15;
        const keyPts = game.goldenKey && game.goldenKey.uniqueId === uid ? 50 : 0;
        const totalPts = basePts * finalMul * streakMul + keyPts;
        addPlayerPoints(uid, info.nickname, totalPts);
      } else {
        game.streaks.set(uid, 0);
      }
    }
  }

  // Door opens if at least 1 viewer got it right!
  const doorOpened = correctCount > 0;
  game.doors[game.qIndex] = doorOpened ? 'open' : 'locked';
  game.lastDoorOutcome = doorOpened ? 'open' : 'locked';

  broadcastState();

  game.phaseTimeout = setTimeout(() => {
    if (game.qIndex + 1 < QUESTIONS_PER_ROUND) {
      loadQuestion(game.qIndex + 1);
    } else {
      finishRound();
    }
  }, 4200);
}

function finishRound() {
  const roundTop = sortedBoard(game.roundLeaderboard);
  if (roundTop[0]) {
    const sEntry = game.seasonLeaderboard.get(roundTop[0].uniqueId);
    if (sEntry) sEntry.crowns = (sEntry.crowns || 0) + 1;
  }

  const isEndOfSeason = game.roundInSeason >= TOTAL_ROUNDS_IN_SEASON;
  game.phase = isEndOfSeason ? 'season_victory' : 'round_victory';
  broadcastState();

  game.phaseTimeout = setTimeout(() => {
    if (isEndOfSeason) {
      // Reset season after 10th Super Final round!
      game.seasonNumber += 1;
      game.seasonLeaderboard.clear();
      game.streaks.clear();
      game.roundInSeason = 1;
      startRound(1);
    } else {
      const nextRound = game.autoAdvanceTopics ? game.roundInSeason + 1 : game.roundInSeason;
      startRound(nextRound, game.autoAdvanceTopics ? null : game.topicId);
    }
  }, isEndOfSeason ? 8000 : 5500);
}

function activate5050() {
  if (game.phase !== 'question' || game.eliminatedOptions.length > 0) return false;
  const q = game.questions[game.qIndex];
  if (!q || !q.options) return false;
  const wrong = ['A', 'B', 'C', 'D'].filter((k) => k !== q.correct);
  game.eliminatedOptions = Engine.shuffleArray(wrong).slice(0, 2);
  broadcastState();
  return true;
}

function normalizeText(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/[аА]/g, 'a')
    .replace(/[вВ]/g, 'b')
    .replace(/[сС]/g, 'c')
    .replace(/[дД]/g, 'd');
}

function parseAnswerChoice(rawComment, q) {
  const raw = String(rawComment || '').trim();
  if (!raw) return null;
  const norm = normalizeText(raw).replace(/[^a-z0-9\s]/g, ' ').trim();
  if (!norm) return null;

  // Accept BOTH A/B/C/D and 1/2/3/4
  if (/^(a|1)(\s|$)/.test(norm)) return 'A';
  if (/^(b|2)(\s|$)/.test(norm)) return 'B';
  if (/^(c|3)(\s|$)/.test(norm)) return 'C';
  if (/^(d|4)(\s|$)/.test(norm)) return 'D';

  const single = norm.match(/\b([abcd1234])\b/);
  if (single && norm.length <= 10) {
    const map = { a: 'A', '1': 'A', b: 'B', '2': 'B', c: 'C', '3': 'C', d: 'D', '4': 'D' };
    return map[single[1]] || null;
  }

  // Exact option text match
  if (q && q.options) {
    for (const k of ['A', 'B', 'C', 'D']) {
      const optNorm = normalizeText(q.options[k]);
      if (optNorm && optNorm.length >= 2 && (norm === optNorm || (norm.length >= 4 && optNorm.includes(norm)))) {
        return k;
      }
    }
  }
  return null;
}

function handleViewerChat({ uniqueId, nickname, comment }) {
  if (game.phase !== 'question') return;
  const q = game.questions[game.qIndex];
  if (!q) return;

  const choice = parseAnswerChoice(comment, q);
  if (!choice) return;
  if (game.eliminatedOptions.includes(choice)) return;
  if (game.voters.has(uniqueId)) return; // 1 answer per door

  game.voters.set(uniqueId, { choice, nickname });
  game.votes[choice] = (game.votes[choice] || 0) + 1;

  let gotKey = false;
  if (choice === q.correct && !game.goldenKey) {
    game.goldenKey = { uniqueId, nickname };
    gotKey = true;
  }

  const streak = game.streaks.get(uniqueId) || 0;
  io.emit('vote-ticker', {
    nickname,
    choice,
    gotKey,
    streak
  });
  broadcastState();
}

function handleViewerLike(count) {
  if (game.phase !== 'question' && game.phase !== 'reveal') return;
  game.likeEnergy += Math.max(1, Number(count) || 1) * 4;
  if (game.likeEnergy >= 100) {
    game.likeEnergy = 0;
    game.bonus2xQueued = true;
    io.emit('energy-full');
  }
  broadcastState();
}

function handleViewerGift({ nickname, giftName, repeatCount }) {
  const did5050 = activate5050();
  io.emit('gift-event', { nickname, giftName, repeatCount, activated5050: did5050 });
}

function simulateVote(count = 1) {
  const q = game.questions[game.qIndex];
  if (!q || game.phase !== 'question') return;
  const names = ['Tural', 'Aynur', 'SaMiR', 'Günel', 'Kamran', 'Nigar', 'Elvin', 'Leyla', 'Orxan', 'Zəhra'];
  const avail = ['A', 'B', 'C', 'D'].filter((k) => !game.eliminatedOptions.includes(k));
  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const uid = `sim_${name}_${Math.floor(Math.random() * 500)}`;
    const pick = Math.random() < 0.68 ? q.correct : avail[Math.floor(Math.random() * avail.length)];
    handleViewerChat({ uniqueId: uid, nickname: name, comment: pick });
  }
}

// ==================== TIKTOK CONNECTOR ====================
function emitTikTokStatus() {
  io.emit('tiktok-status', {
    connecting: tiktok.connecting,
    connected: tiktok.connected,
    username: tiktok.username,
    viewerCount: tiktok.viewerCount,
    error: tiktok.error
  });
}

function scheduleReconnect(delayMs = 6000) {
  clearTimeout(tiktok.reconnectTimer);
  if (!tiktok.username) return;
  tiktok.reconnectTimer = setTimeout(() => {
    if (!tiktok.connected && !tiktok.connecting) {
      connectTikTok(tiktok.username, false);
    }
  }, delayMs);
}

async function disconnectTikTok(clearUser = false) {
  clearTimeout(tiktok.reconnectTimer);
  const old = tiktok.conn;
  tiktok.conn = null;
  tiktok.connecting = false;
  tiktok.connected = false;
  tiktok.viewerCount = 0;
  if (clearUser) tiktok.username = '';
  if (old) {
    try { await old.disconnect(); } catch (_) {}
  }
  emitTikTokStatus();
}

async function connectTikTok(rawUsername, isManual = false) {
  const clean = (rawUsername || '').trim().replace(/^@+/, '').toLowerCase();
  if (!clean) {
    tiktok.error = 'İstifadəçi adı boşdur';
    emitTikTokStatus();
    return;
  }

  await disconnectTikTok(false);
  tiktok.username = clean;
  tiktok.connecting = true;
  tiktok.error = '';
  emitTikTokStatus();

  console.log(`[TikTok] @${clean} canlı yayımına qoşulur...`);
  const conn = new TikTokLiveConnection(clean, {
    processInitialData: false,
    enableExtendedGiftInfo: false,
    requestPollingIntervalMs: 1200
  });
  tiktok.conn = conn;

  conn.on(WebcastEvent.CHAT, (data) => {
    if (tiktok.conn !== conn) return;
    const uniqueId = String(data.user?.displayId || data.user?.uniqueId || data.user?.id || data.user?.userId || data.uniqueId || 'viewer');
    const nickname = String(data.user?.nickname || uniqueId);
    const comment = String(data.content ?? data.comment ?? '').trim();
    if (!comment) return;
    handleViewerChat({ uniqueId, nickname, comment });
  });

  conn.on(WebcastEvent.LIKE, (data) => {
    if (tiktok.conn !== conn) return;
    handleViewerLike(Number(data.count ?? data.likeCount ?? 1));
  });

  conn.on(WebcastEvent.GIFT, (data) => {
    if (tiktok.conn !== conn) return;
    const giftType = data.gift?.type ?? data.giftDetails?.giftType;
    if (giftType === 1 && !data.repeatEnd) return;
    const nickname = String(data.user?.nickname || data.user?.displayId || data.user?.uniqueId || 'İzləyici');
    const giftName = data.gift?.name || data.giftDetails?.giftName || `Hədiyyə #${data.giftId}`;
    handleViewerGift({ nickname, giftName, repeatCount: Number(data.repeatCount || 1) });
  });

  conn.on(WebcastEvent.ROOM_USER, (data) => {
    if (tiktok.conn !== conn) return;
    const rawVc = data.viewerCount ?? data.total ?? data.totalUser;
    if (rawVc !== undefined && rawVc !== null && rawVc !== '') {
      const vc = Number(rawVc);
      if (Number.isFinite(vc)) {
        tiktok.viewerCount = vc;
        emitTikTokStatus();
      }
    }
  });

  conn.on(WebcastEvent.STREAM_END, () => {
    if (tiktok.conn !== conn) return;
    tiktok.connected = false;
    tiktok.connecting = false;
    tiktok.error = 'Canlı yayım bitdi';
    emitTikTokStatus();
    scheduleReconnect(15000);
  });

  conn.on(ControlEvent.DISCONNECTED, () => {
    if (tiktok.conn !== conn) return;
    if (tiktok.connected) {
      tiktok.connected = false;
      tiktok.connecting = false;
      emitTikTokStatus();
      scheduleReconnect(5000);
    }
  });

  conn.on(ControlEvent.ERROR, (err) => {
    if (tiktok.conn !== conn) return;
    console.error('[TikTok ERROR]', err?.exception?.message || err?.info || err);
  });

  try {
    const state = await conn.connect();
    if (tiktok.conn !== conn) return;
    tiktok.connecting = false;
    tiktok.connected = true;
    tiktok.viewerCount = Number(state?.roomInfo?.data?.user_count ?? state?.roomInfo?.user_count ?? 0) || 0;
    tiktok.error = '';
    console.log(`[TikTok] Qoşuldu! Room ID: ${state.roomId}`);
    emitTikTokStatus();
  } catch (err) {
    if (tiktok.conn !== conn) return;
    const rawMsg = err?.message || String(err || '');
    const isOffline = /offline|not live|UserOffline|isn't online/i.test(rawMsg);
    tiktok.connecting = false;
    tiktok.connected = false;
    tiktok.error = isOffline
      ? `@${clean} hazırda canlı yayımda deyil (canlı başlayanda qoşulacaq)`
      : `Qoşulma xətası: ${rawMsg.slice(0, 90)}`;
    console.warn(`[TikTok] Qoşulmadı (${isOffline ? 'offline' : rawMsg})`);
    emitTikTokStatus();
    if (!isManual || isOffline) {
      scheduleReconnect(15000);
    }
  }
}

// ==================== SOCKET CONTROLS ====================
io.on('connection', (socket) => {
  socket.emit('game-state-sync', buildClientState());
  socket.emit('tiktok-status', {
    connecting: tiktok.connecting,
    connected: tiktok.connected,
    username: tiktok.username,
    viewerCount: tiktok.viewerCount,
    error: tiktok.error
  });

  socket.on('switch-topic', ({ topicId } = {}) => {
    const meta = getTopicMeta(topicId);
    startRound(meta.round, meta.id);
  });

  socket.on('toggle-auto-topic', ({ enabled } = {}) => {
    game.autoAdvanceTopics = !!enabled;
    broadcastState();
  });

  socket.on('start-round', () => startRound(game.roundInSeason, game.topicId));
  socket.on('reveal-answer', () => revealAnswer());
  socket.on('next-question', () => {
    if (game.qIndex + 1 < QUESTIONS_PER_ROUND) loadQuestion(game.qIndex + 1);
    else finishRound();
  });

  socket.on('reset-season', () => {
    game.seasonNumber += 1;
    game.seasonLeaderboard.clear();
    game.streaks.clear();
    startRound(1);
  });

  socket.on('use-5050', () => activate5050());
  socket.on('use-hint', () => {
    if (game.phase !== 'question') return;
    game.hintShown = true;
    broadcastState();
  });

  socket.on('toggle-sound', ({ muted } = {}) => {
    game.soundMuted = !!muted;
    broadcastState();
  });

  socket.on('set-question-time', ({ seconds } = {}) => {
    const val = Number(seconds);
    game.customQuestionTime = val >= 10 && val <= 60 ? val : null;
    saveSettings({ customQuestionTime: game.customQuestionTime });
    broadcastState();
  });

  socket.on('connect-tiktok', ({ username } = {}) => connectTikTok(username, true));
  socket.on('disconnect-tiktok', () => disconnectTikTok(true));
  socket.on('simulate-vote', ({ count } = {}) => simulateVote(Number(count) || 1));
  socket.on('manual-chat', ({ nickname, comment } = {}) => {
    handleViewerChat({
      uniqueId: 'manual_host',
      nickname: nickname || 'Aparıcı_Test',
      comment: comment || ''
    });
  });
});

// ==================== BOOT ====================
startRound(1);
server.listen(PORT, () => {
  console.log(`\n================================================`);
  console.log(`  10 Qapili Xezine Sousu Server isleyir!`);
  console.log(`  Aparici Studiyasi : http://localhost:${PORT}`);
  console.log(`  OBS / Studio Link : http://localhost:${PORT}/?overlay=1`);
  console.log(`  TikTok Kanal      : @${tiktok.username}`);
  console.log(`================================================\n`);
  connectTikTok(DEFAULT_TIKTOK_USER, false);
});

process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err?.stack || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[UnhandledRejection]', reason);
});
