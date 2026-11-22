(() => {
  const params = new URLSearchParams(window.location.search);
  const isOverlay = params.get('overlay') === '1' || params.get('obs') === '1';
  if (isOverlay) document.body.classList.add('obs-mode');

  // ==================== VAULT & MODERN WEBAUDIO ENGINE ====================
  const SoundEngine = {
    ctx: null,
    muted: false,
    master: null,
    reverbIn: null,

    ensureCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          const comp = this.ctx.createDynamicsCompressor();
          comp.threshold.value = -18;
          comp.ratio.value = 3.5;
          const master = this.ctx.createGain();
          master.gain.value = 0.88;
          master.connect(comp);
          comp.connect(this.ctx.destination);

          const len = Math.floor(this.ctx.sampleRate * 1.9);
          const buf = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
          for (let c = 0; c < 2; c++) {
            const d = buf.getChannelData(c);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
          }
          const conv = this.ctx.createConvolver();
          conv.buffer = buf;
          const wet = this.ctx.createGain();
          wet.gain.value = 0.28;
          conv.connect(wet);
          wet.connect(master);
          this.master = master;
          this.reverbIn = conv;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },

    tone(freq, dur, opts = {}) {
      if (this.muted) return;
      const ctx = this.ensureCtx();
      if (!ctx || !this.master) return;
      const { type = 'sine', vol = 0.08, delay = 0, glide = null, wet = true } = opts;
      const t = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(this.master);
      if (wet && this.reverbIn) g.connect(this.reverbIn);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    },

    playOpenQuestion() {
      [587.33, 739.99, 880, 1174.66].forEach((f, i) => this.tone(f, 0.55, { delay: i * 0.055, vol: 0.055 }));
    },

    playTick(urgent) {
      if (urgent) {
        this.tone(1280, 0.06, { vol: 0.045, glide: 980, wet: false });
        this.tone(72, 0.18, { vol: 0.2, glide: 46, wet: false });
      } else {
        this.tone(1020, 0.05, { vol: 0.038, glide: 800, wet: false });
      }
    },

    playDoorOpen() {
      // Lock clicks + heavy vault slide + bright chord
      this.tone(1400, 0.04, { vol: 0.06, wet: false });
      this.tone(1750, 0.04, { delay: 0.09, vol: 0.06, wet: false });
      this.tone(130, 0.45, { delay: 0.15, vol: 0.15, glide: 65, wet: false });
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.95, { delay: 0.2 + i * 0.06, vol: 0.07 }));
    },

    playDoorLocked() {
      this.tone(330, 0.24, { type: 'triangle', vol: 0.09, glide: 220 });
      this.tone(220, 0.35, { type: 'triangle', delay: 0.14, vol: 0.09, glide: 170 });
    },

    playGoldenKey() {
      [1046.5, 1318.5, 1568].forEach((f, i) => this.tone(f, 0.4, { delay: i * 0.05, vol: 0.045 }));
    },

    playVictory(isSeason) {
      const notes = isSeason
        ? [[392, 0], [523.25, 0.12], [659.25, 0.24], [783.99, 0.38], [1046.5, 0.5], [1318.5, 0.62]]
        : [[440, 0], [554.37, 0.12], [659.25, 0.24], [880, 0.38]];
      notes.forEach(([f, d]) => this.tone(f, 1.1, { type: 'triangle', delay: d, vol: 0.075 }));
    }
  };

  window.addEventListener('pointerdown', () => SoundEngine.ensureCtx(), { once: true });
  window.addEventListener('keydown', () => SoundEngine.ensureCtx(), { once: true });

  // ==================== DOM ====================
  const el = {
    stage: document.getElementById('stage9x16'),
    topicIcon: document.getElementById('topicIcon'),
    topicName: document.getElementById('topicName'),
    seasonBadge: document.getElementById('seasonBadge'),
    bankPill: document.getElementById('bankPill'),
    timerWrap: document.getElementById('timerWrap'),
    timerFg: document.getElementById('timerFg'),
    timerVal: document.getElementById('timerVal'),
    doorsTrack: document.getElementById('doorsTrack'),
    vaultStage: document.getElementById('vaultStage'),
    vaultReward: document.getElementById('vaultReward'),
    energyLbl: document.getElementById('energyLbl'),
    energyFill: document.getElementById('energyFill'),
    keyPill: document.getElementById('keyPill'),
    qTag: document.getElementById('qTag'),
    bonusBadge: document.getElementById('bonusBadge'),
    questionText: document.getElementById('questionText'),
    hintBar: document.getElementById('hintBar'),
    tickerRow: document.getElementById('tickerRow'),
    livePill: document.getElementById('livePill'),
    lbRows: document.getElementById('lbRows'),
    stageOverlay: document.getElementById('stageOverlay'),
    ovIcon: document.getElementById('ovIcon'),
    ovTitle: document.getElementById('ovTitle'),
    ovSub: document.getElementById('ovSub'),
    ovPodium: document.getElementById('ovPodium'),
    ovNext: document.getElementById('ovNext'),
    // Host Panel
    connChip: document.getElementById('connChip'),
    autoTopicToggle: document.getElementById('autoTopicToggle'),
    topicsGrid: document.getElementById('topicsGrid'),
    btnStartRound: document.getElementById('btnStartRound'),
    btnReveal: document.getElementById('btnReveal'),
    btnNextQ: document.getElementById('btnNextQ'),
    btn5050: document.getElementById('btn5050'),
    btnHint: document.getElementById('btnHint'),
    btnResetSeason: document.getElementById('btnResetSeason'),
    btnMute: document.getElementById('btnMute'),
    btnTestDoor: document.getElementById('btnTestDoor'),
    timeSelect: document.getElementById('timeSelect'),
    tiktokInput: document.getElementById('tiktokInput'),
    btnConnect: document.getElementById('btnConnect'),
    btnDisconnect: document.getElementById('btnDisconnect'),
    tiktokStatus: document.getElementById('tiktokStatus'),
    btnSim5: document.getElementById('btnSim5'),
    obsUrlInput: document.getElementById('obsUrlInput'),
    btnCopyUrl: document.getElementById('btnCopyUrl')
  };

  if (el.obsUrlInput) {
    el.obsUrlInput.value = `${window.location.origin}${window.location.pathname}?overlay=1`;
  }

  let prevPhase = null;
  let prevQId = null;
  let prevTime = null;
  let topicsBuilt = false;

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function burstConfetti(count = 45) {
    if (!el.stage) return;
    const cols = ['#f5c542', '#38bdf8', '#22c55e', '#f43f5e', '#ffffff'];
    const layer = document.createElement('div');
    layer.className = 'fx-confetti-layer';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'fx-confetti';
      d.style.left = `${Math.random() * 100}%`;
      d.style.width = `${6 + Math.random() * 6}px`;
      d.style.height = `${8 + Math.random() * 7}px`;
      d.style.background = cols[i % cols.length];
      d.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
      d.style.animationDelay = `${Math.random() * 0.4}s`;
      layer.appendChild(d);
    }
    el.stage.appendChild(layer);
    setTimeout(() => layer.remove(), 3800);
  }

  // ==================== SOCKET.IO ====================
  const socket = io({ transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    if (el.connChip) el.connChip.textContent = 'Canlı Sinxron';
  });

  socket.on('tiktok-status', (st) => {
    if (el.tiktokStatus) {
      el.tiktokStatus.textContent = st.connected
        ? `🟢 @${st.username} • ${st.viewerCount || 0} izləyici`
        : st.connecting
          ? `⏳ @${st.username} qoşulur...`
          : `⚪ ${st.error || 'Qoşulmayıb'}`;
    }
    if (el.livePill) {
      el.livePill.textContent = st.connected
        ? `🔴 @${st.username} • ${st.viewerCount || 0}`
        : '● CANLI HAZIR';
    }
  });

  socket.on('vote-ticker', (evt) => {
    if (!el.tickerRow || !evt) return;
    const empty = el.tickerRow.querySelector('.ticker-empty');
    if (empty) empty.remove();
    const pill = document.createElement('span');
    pill.className = `ticker-pill${evt.gotKey ? ' key' : ''}`;
    const streakTxt = evt.streak >= 2 ? ` 🔥${evt.streak + 1}` : '';
    const keyTxt = evt.gotKey ? '🔑 ' : '';
    pill.textContent = `${keyTxt}${evt.nickname} → ${evt.choice}${streakTxt}`;
    el.tickerRow.prepend(pill);
    while (el.tickerRow.children.length > 5) {
      el.tickerRow.removeChild(el.tickerRow.lastChild);
    }
    if (evt.gotKey && !SoundEngine.muted) SoundEngine.playGoldenKey();
  });

  socket.on('gift-event', (g) => {
    if (!el.tickerRow || !g) return;
    const pill = document.createElement('span');
    pill.className = 'ticker-pill key';
    pill.textContent = `🎁 ${g.nickname}: ${g.giftName}${g.activated5050 ? ' (50:50 Lazer!)' : ''}`;
    el.tickerRow.prepend(pill);
  });

  socket.on('game-state-sync', (state) => {
    if (!state) return;
    if (state.soundMuted !== undefined) SoundEngine.muted = !!state.soundMuted;

    const q = state.currentQuestion;
    const qIdNow = q ? q.id : null;

    if (!SoundEngine.muted) {
      SoundEngine.ensureCtx();
      if (state.phase === 'question' && qIdNow !== prevQId) {
        SoundEngine.playOpenQuestion();
      } else if (state.phase === 'question' && prevTime !== null && state.timeLeft < prevTime && state.timeLeft > 0 && state.timeLeft <= 10) {
        SoundEngine.playTick(state.timeLeft <= 5);
      } else if (state.phase === 'reveal' && prevPhase !== 'reveal') {
        if (state.lastDoorOutcome === 'open') SoundEngine.playDoorOpen();
        else SoundEngine.playDoorLocked();
      } else if ((state.phase === 'round_victory' || state.phase === 'season_victory') && prevPhase !== state.phase) {
        SoundEngine.playVictory(state.phase === 'season_victory');
      }
    }

    const topic = state.topicMeta || {};
    if (el.stage && topic.theme) el.stage.dataset.theme = topic.theme;
    if (el.topicIcon) el.topicIcon.textContent = topic.icon || '🔐';
    if (el.topicName) el.topicName.textContent = topic.name || 'Xəzinə Qapıları';
    if (el.seasonBadge) {
      el.seasonBadge.textContent = `MÖVSÜM ${state.seasonNumber} • TUR ${state.roundInSeason}/${state.totalRoundsInSeason}`;
    }
    if (el.bankPill && state.totalBankCount) {
      el.bankPill.textContent = `♾️ ${state.totalBankCount.toLocaleString()}+ Sual`;
    }

    // Build topic buttons once in host panel
    if (!topicsBuilt && el.topicsGrid && Array.isArray(state.topicsList)) {
      topicsBuilt = true;
      el.topicsGrid.innerHTML = state.topicsList.map((t) =>
        `<button class="topic-btn" data-topic="${t.id}">${t.round}. ${t.icon} ${t.name}</button>`
      ).join('');
      el.topicsGrid.querySelectorAll('.topic-btn').forEach((btn) => {
        btn.addEventListener('click', () => socket.emit('switch-topic', { topicId: btn.dataset.topic }));
      });
    }
    document.querySelectorAll('.topic-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.topic === topic.id);
    });
    if (el.autoTopicToggle) el.autoTopicToggle.checked = !!state.autoAdvanceTopics;

    // Timer
    const totalT = state.questionTime || 20;
    const leftT = state.timeLeft || 0;
    if (el.timerVal) el.timerVal.textContent = leftT;
    if (el.timerFg) el.timerFg.style.strokeDashoffset = 157.08 * (1 - Math.max(0, Math.min(1, leftT / totalT)));
    if (el.timerWrap) el.timerWrap.classList.toggle('urgent', state.phase === 'question' && leftT <= 5);

    // 10 Doors track
    if (el.doorsTrack && Array.isArray(state.doors)) {
      el.doorsTrack.innerHTML = state.doors.map((st, idx) => {
        const icon = st === 'open' ? '🔓' : st === 'locked' ? '🔒' : idx === 9 ? '👑' : '🚪';
        return `<div class="door-node ${st}"><span>${icon}</span><span>${idx + 1}</span></div>`;
      }).join('');
    }

    // Vault Door state
    if (el.vaultStage) {
      const isOpen = state.phase === 'reveal' && state.lastDoorOutcome === 'open';
      const isLocked = state.phase === 'reveal' && state.lastDoorOutcome === 'locked';
      el.vaultStage.classList.toggle('is-open', isOpen);
      el.vaultStage.classList.toggle('is-locked', isLocked);
      if (isOpen && prevPhase !== 'reveal') burstConfetti(state.qIndex === 9 ? 70 : 35);
      if (el.vaultReward) {
        el.vaultReward.textContent = state.qIndex === 9 ? '👑 BÖYÜK SEYF AÇILDI! (×3)' : `🔓 QAPI ${state.qIndex + 1} AÇILDI!`;
      }
    }

    // Like energy & Golden key
    if (el.energyLbl) el.energyLbl.textContent = `❤️ Seyf Enerjisi: ${Math.min(100, state.likeEnergy || 0)}%`;
    if (el.energyFill) el.energyFill.style.width = `${Math.min(100, state.likeEnergy || 0)}%`;
    if (el.keyPill) {
      el.keyPill.textContent = state.goldenKey
        ? `🔑 İlk: ${state.goldenKey.nickname}`
        : '🔑 İlk tapan +50';
    }

    // Question card
    if (el.qTag) el.qTag.textContent = `QAPI ${(state.qIndex || 0) + 1} / 10 • ${topic.doorStyle || ''}`;
    if (el.bonusBadge) el.bonusBadge.classList.toggle('hidden', !state.bonus2xActive);
    if (el.questionText) el.questionText.textContent = q ? q.question : 'Sual hazırlanır...';

    if (el.hintBar) {
      if (state.hintShown && q && q.hint) {
        el.hintBar.classList.remove('hidden');
        el.hintBar.textContent = `💡 İpucu: ${q.hint}`;
      } else {
        el.hintBar.classList.add('hidden');
      }
    }

    // Options
    const votes = state.votes || { A: 0, B: 0, C: 0, D: 0 };
    const totalVotes = votes.A + votes.B + votes.C + votes.D;
    const elim = state.eliminatedOptions || [];
    ['A', 'B', 'C', 'D'].forEach((k) => {
      const btn = document.getElementById(`opt${k}`);
      const txt = document.getElementById(`text${k}`);
      const pct = document.getElementById(`pct${k}`);
      const fill = document.getElementById(`fill${k}`);
      if (txt) txt.textContent = q && q.options ? (q.options[k] || '—') : '—';
      const p = totalVotes > 0 ? Math.round(((votes[k] || 0) / totalVotes) * 100) : 0;
      if (pct) pct.textContent = `${p}%`;
      if (fill) fill.style.width = `${p}%`;
      if (btn) {
        btn.classList.toggle('eliminated', elim.includes(k));
        btn.classList.toggle('correct', state.phase === 'reveal' && q && q.correct === k);
        btn.classList.toggle('dimmed', state.phase === 'reveal' && q && q.correct !== k);
      }
    });

    // Leaderboard
    if (el.lbRows) {
      const lb = state.seasonLeaderboard || [];
      if (lb.length === 0) {
        el.lbRows.innerHTML = '<div class="lb-empty">İlk qapı açılandan sonra xallar yığılacaq</div>';
      } else {
        el.lbRows.innerHTML = lb.slice(0, 3).map((p, idx) => {
          const m = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
          return `<div class="lb-row"><span>${m} ${escapeHtml(p.nickname)}</span><span>👑${p.crowns || 0} • ${p.score} xal</span></div>`;
        }).join('');
      }
    }

    if (el.btnMute) el.btnMute.textContent = state.soundMuted ? '🔇 Səs Bağlıdır' : '🔊 Səs Açıqdır';

    // Round / Season Overlay
    if (el.stageOverlay) {
      if (state.phase === 'round_victory' || state.phase === 'season_victory') {
        const isSeason = state.phase === 'season_victory';
        el.stageOverlay.classList.remove('hidden');
        el.ovIcon.textContent = isSeason ? '👑' : '🏆';
        el.ovTitle.textContent = isSeason
          ? `MÖVSÜM ${state.seasonNumber} ÇEMPİONLARI!`
          : `TUR ${state.roundInSeason} BİTDİ!`;
        el.ovSub.textContent = isSeason
          ? '10 turluq böyük mövsüm tamamlandı!'
          : `Açılan qapılar: ${state.openedCount} / 10`;

        const board = isSeason ? (state.seasonLeaderboard || []) : (state.roundLeaderboard || []);
        el.ovPodium.innerHTML = board.slice(0, 3).map((p, idx) => {
          const m = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
          return `<div class="ov-row"><span>${m} ${escapeHtml(p.nickname)}</span><span>${p.score} xal</span></div>`;
        }).join('') || '<div class="ov-row"><span>Növbəti tura hazırlaşın!</span><span>🚀</span></div>';

        const nt = state.nextTopicMeta || {};
        el.ovNext.textContent = isSeason
          ? `🔄 Mövsüm ${state.seasonNumber + 1} sıfırdan başlayır...`
          : `⏳ Növbəti Mövzu: ${nt.icon || ''} ${nt.name || ''}`;
        if (prevPhase !== state.phase) burstConfetti(85);
      } else {
        el.stageOverlay.classList.add('hidden');
      }
    }

    prevPhase = state.phase;
    prevQId = qIdNow;
    prevTime = state.timeLeft;
  });

  // ==================== HOST CONTROLS ====================
  if (el.autoTopicToggle) el.autoTopicToggle.addEventListener('change', (e) => socket.emit('toggle-auto-topic', { enabled: e.target.checked }));
  if (el.btnStartRound) el.btnStartRound.addEventListener('click', () => socket.emit('start-round'));
  if (el.btnReveal) el.btnReveal.addEventListener('click', () => socket.emit('reveal-answer'));
  if (el.btnNextQ) el.btnNextQ.addEventListener('click', () => socket.emit('next-question'));
  if (el.btn5050) el.btn5050.addEventListener('click', () => socket.emit('use-5050'));
  if (el.btnHint) el.btnHint.addEventListener('click', () => socket.emit('use-hint'));
  if (el.btnResetSeason) el.btnResetSeason.addEventListener('click', () => socket.emit('reset-season'));
  if (el.btnMute) {
    el.btnMute.addEventListener('click', () => {
      SoundEngine.muted = !SoundEngine.muted;
      socket.emit('toggle-sound', { muted: SoundEngine.muted });
    });
  }
  if (el.btnTestDoor) el.btnTestDoor.addEventListener('click', () => { SoundEngine.ensureCtx(); SoundEngine.playDoorOpen(); });
  if (el.timeSelect) el.timeSelect.addEventListener('change', (e) => socket.emit('set-question-time', { seconds: Number(e.target.value) }));
  if (el.btnConnect) el.btnConnect.addEventListener('click', () => socket.emit('connect-tiktok', { username: el.tiktokInput.value.trim() }));
  if (el.btnDisconnect) el.btnDisconnect.addEventListener('click', () => socket.emit('disconnect-tiktok'));
  if (el.btnSim5) el.btnSim5.addEventListener('click', () => socket.emit('simulate-vote', { count: 5 }));
  document.querySelectorAll('[data-num]').forEach((b) => {
    b.addEventListener('click', () => socket.emit('manual-chat', { nickname: 'Aparıcı_Test', comment: b.dataset.num }));
  });
  if (el.btnCopyUrl && el.obsUrlInput) {
    el.btnCopyUrl.addEventListener('click', () => {
      navigator.clipboard?.writeText(el.obsUrlInput.value).catch(() => {});
      el.btnCopyUrl.textContent = '✅ Kopyalandı!';
      setTimeout(() => { el.btnCopyUrl.textContent = '📋 Kopyala'; }, 1500);
    });
  }
})();
