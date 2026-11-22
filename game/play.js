/* Trò chơi chạy nhảy 1 chạm (kiểu Mario). Nhân vật tự chạy, chạm màn hình để nhảy.
   Mỗi "cổng" là một hàng khối đáp án lơ lửng: nhảy lên đụng khối nào là chọn đáp án đó.
   Nội dung nằm ở games.js + shorts.js, hình vẽ nhân vật nằm ở engine.js. */
window.runGame = function (cfg, H) {
  'use strict';
  var SITE = 'https://sophianguyen.com.vn';
  var UTM = '?utm_source=game&utm_medium=social&utm_campaign=game-' + cfg.id;
  var stage = document.getElementById('stage');
  var N = cfg.stations.length, KEYS = Object.keys(cfg.types);
  var $ = function (id) { return document.getElementById(id); };

  /* Thế giới riêng của từng game: vật cản + thứ để nhặt */
  var WORLD = {
    mam: { obs: 'rock', coin: 'drop', coinName: 'giọt sương', col: '#7FD6F5' },
    cao: { obs: 'crate', coin: 'coin', coinName: 'đồng xu', col: '#F5B82E' },
    cu: { obs: 'books', coin: 'star', coinName: 'ngôi sao', col: '#FFE27A' },
    en: { obs: 'thorn', coin: 'feather', coinName: 'chiếc lông vũ', col: '#BFD8FF' },
    gau: { obs: 'toy', coin: 'heart', coinName: 'trái tim', col: '#FF9FB0' }
  }[cfg.id];
  var BLOCK_COL = ['#F5B82E', '#F08AB0', '#6FB8F2', '#8FD3A0'];

  /* ---------------------------------------------------------------- DOM */
  stage.setAttribute('aria-label', 'Trò chơi ' + cfg.hud);
  stage.innerHTML =
    '<canvas class="cv" id="cv" aria-label="Màn chơi"></canvas>' +
    '<div class="hud"><span class="name">' + cfg.hud + '</span><div class="pips" id="pips" aria-hidden="true"></div>' +
    '<button class="snd" id="snd" type="button" aria-pressed="false" aria-label="Bật âm thanh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path id="sndOn" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" hidden/></svg></button></div>' +
    '<div class="qbox" id="qbox" hidden></div>' +
    '<div class="hint" id="hint" hidden>Chạm màn hình để nhảy</div>' +
    '<div class="coins" id="coins" style="--coin:' + WORLD.col + '" hidden><i></i><b id="coinN">0</b></div>' +
    '<section class="panel" id="panel" aria-live="polite"></section>' +
    '<div class="brand"><span>Sophia Nguyễn</span><b>sophianguyen.com.vn</b></div>';
  var cv = $('cv'), ctx = cv.getContext('2d'), panel = $('panel');
  var W = 360, HH = 640, groundY = 480, scale = 1, PX = 92, BRAND = 23;

  function resize() {
    var r = stage.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    scale = r.width / W; HH = r.height / scale;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    groundY = Math.min(HH - BRAND - 78, HH * .74);
  }
  window.addEventListener('resize', resize); resize();
  try { document.fonts.load('700 12px "Be Vietnam Pro"'); document.fonts.load('800 14px "Baloo 2"'); } catch (e) {}

  /* ---------------------------------------------------------------- Hình ảnh */
  function svgImg(svg, cb) { var im = new Image(); im.onload = function () { cb && cb(im); }; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return im; }
  var charSvg = H.charSVG(cfg.char.kind, null, false).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="252" ');
  if (cfg.char.kind === 'sprout') {
    charSvg = charSvg.replace('<ellipse cx="60" cy="98"', '<path d="M60 60 L60 44" stroke="#4FAE7C" stroke-width="4.5" stroke-linecap="round"/><path d="M60 46 C 68 36 82 38 86 46 C 78 54 66 54 60 46Z" fill="#8FE3B0"/><path d="M60 46 C 52 36 38 38 34 46 C 42 54 54 54 60 46Z" fill="#6FD39A"/><ellipse cx="60" cy="98"');
  }
  var charIm = svgImg(charSvg), rewardIm = null;

  /* ---------------------------------------------------------------- Âm thanh */
  var audio = null, soundOn = false;
  function beep(f, d, type, vol) {
    if (!soundOn) { return; }
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var o = audio.createOscillator(), g = audio.createGain(); o.type = type || 'sine'; o.frequency.value = f; g.gain.value = vol || .06; o.connect(g); g.connect(audio.destination);
      var t = audio.currentTime; g.gain.setValueAtTime(vol || .06, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d);
    } catch (e) {}
  }
  $('snd').addEventListener('click', function (e) {
    e.stopPropagation(); soundOn = !soundOn; this.setAttribute('aria-pressed', soundOn); this.setAttribute('aria-label', soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'); $('sndOn').hidden = !soundOn; beep(660, .12);
  });

  /* ---------------------------------------------------------------- Trạng thái */
  var S, T = 0, last = 0, raf = 0, timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function fresh() {
    var sc = {}; KEYS.forEach(function (k) { sc[k] = 0; });
    return { mode: 'intro', gi: 0, score: sc, last: null, clip: false, aim: null, coins: 0, speed: 70, dist: 0, stumble: 0, inv: 0,
      z: 0, vz: 0, jumps: 0, hold: false, obs: [], coin: [], blocks: [], parts: [], pops: [], sectionLeft: 380, nextObs: 140, picked: null, afterT: 0,
      goalX: -999, misses: 0, camOff: 0, winT: 0, reward: 0, warm: 0 };
  }
  S = fresh();

  /* màu trời */
  function rgbOf(c) { var h = H.hx(c); return h; }
  function mixA(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function skyTarget(n) {
    n = Math.min(n, 6); var t = n / 6, g = cfg;
    return { top: rgbOf(g.sky[n][0]), bot: rgbOf(g.sky[n][1]), far: mixA(rgbOf(g.hills.far[0]), rgbOf(g.hills.far[1]), t), near: mixA(rgbOf(g.hills.near[0]), rgbOf(g.hills.near[1]), t),
      gnd: mixA(rgbOf(g.hills.ground[0]), rgbOf(g.hills.ground[1]), t), sun: g.sunUp[n], stars: g.stars[n] };
  }
  var SK = skyTarget(0), SKT = SK;
  function cloneSky(s) { return { top: s.top.slice(), bot: s.bot.slice(), far: s.far.slice(), near: s.near.slice(), gnd: s.gnd.slice(), sun: s.sun, stars: s.stars }; }
  SK = cloneSky(SK);
  function easeSky(dt) {
    var k = Math.min(1, dt * 1.6);
    ['top', 'bot', 'far', 'near', 'gnd'].forEach(function (n) { for (var i = 0; i < 3; i++) { SK[n][i] += (SKT[n][i] - SK[n][i]) * k; } });
    SK.sun += (SKT.sun - SK.sun) * k; SK.stars += (SKT.stars - SK.stars) * k;
  }
  function css(a, al) { return 'rgba(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ',' + (al == null ? 1 : al) + ')'; }
  function setSky(n) { SKT = skyTarget(n); }

  /* ---------------------------------------------------------------- Giao diện */
  function pips() { var b = $('pips'); b.innerHTML = ''; for (var i = 0; i < N; i++) { var e = document.createElement('i'); if (i < S.gi || S.mode === 'win') { e.className = 'on'; } b.appendChild(e); } }
  function qshow(chip, text) { var q = $('qbox'); q.hidden = false; q.innerHTML = '<span>' + chip + '</span><p>' + text + '</p>'; q.classList.remove('in'); void q.offsetWidth; q.classList.add('in'); }
  function qhide() { $('qbox').hidden = true; }
  function coinsUi() { $('coinN').textContent = S.coins; }
  function track(n, p) { H.track(n, p); }

  function intro() {
    clearTimers(); S = fresh(); setSky(0); SK = cloneSky(SKT);
    stage.classList.remove('run', 'done'); qhide(); $('hint').hidden = true; $('coins').hidden = true; pips(); coinsUi();
    panel.innerHTML =
      '<div class="stack" style="margin-top:2cqw"><h1 class="title">' + cfg.title + '</h1><p class="sub">' + cfg.sub + '</p>' +
      '<p class="how"><b>Cách chơi</b> Chạm để nhảy. Nhặt ' + WORLD.coinName + ', né vật cản, rồi nhảy lên đụng khối đáp án bạn chọn.</p></div>' +
      '<div class="stack" style="margin-top:auto"><button class="btn main" id="go" type="button">Chơi ngay</button>' +
      '<button class="btn ghost" id="auto" type="button">Xem thử (tự chơi)</button>' +
      '<a class="linkbtn" href="/tro-choi">Chọn nhân vật khác</a></div>';
    $('go').onclick = function () { start(false); };
    $('auto').onclick = function () { start(true); };
  }
  function start(clip) {
    S.clip = clip; S.aim = KEYS[Math.floor(Math.random() * KEYS.length)]; S.mode = 'run'; S.speed = 0; S.warm = 0;
    stage.classList.add('run'); $('coins').hidden = false; $('hint').hidden = clip; if (!clip) { later(function () { $('hint').hidden = true; }, 4200); }
    track('game_start', { mode: clip ? 'auto' : 'play' }); beep(523, .12); pips();
  }

  /* ---------------------------------------------------------------- Điều khiển */
  function jump() {
    if (S.mode === 'intro' || S.mode === 'win' || S.clip && !S._bot) { return; }
    if (S.jumps >= 2) { return; }
    S.vz = S.jumps === 0 ? 610 : 530; S.jumps++; S.hold = true; beep(S.jumps === 1 ? 520 : 700, .09, 'square', .03);
    for (var i = 0; i < 4; i++) { S.parts.push({ x: PX, y: 0, z: S.z, vx: -40 - Math.random() * 40, vz: 40 + Math.random() * 60, life: .35, c: 'rgba(255,255,255,.6)', r: 2 }); }
    $('hint').hidden = true;
  }
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); if (!S.clip) { jump(); } });
  window.addEventListener('pointerup', function () { S.hold = false; });
  window.addEventListener('keydown', function (e) { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); if (!e.repeat && !S.clip) { jump(); } } });
  window.addEventListener('keyup', function (e) { if (e.code === 'Space' || e.code === 'ArrowUp') { S.hold = false; } });

  /* ---------------------------------------------------------------- Sinh vật cản, vật nhặt, cổng */
  function spawnObstacle() {
    var x = W + 40, o = { x: x, w: 36, h: WORLD.obs === 'books' ? 40 : 34, k: WORLD.obs };
    S.obs.push(o);
    var kind = Math.random();
    if (kind < .65) { /* vòng cung vật nhặt phía trên vật cản */
      for (var i = 0; i < 5; i++) { var a = i / 4; S.coin.push({ x: x - 40 + a * 80, y: 52 + Math.sin(a * Math.PI) * 60, got: false, ph: i }); }
    } else { for (var j = 0; j < 4; j++) { S.coin.push({ x: x + 70 + j * 24, y: 26, got: false, ph: j }); } }
    S.nextObs = 210 + Math.random() * 120;
  }
  function startGate() {
    S.mode = 'gate'; S.picked = null; S.misses = S.misses || 0;
    var st = cfg.stations[S.gi];
    qshow('Cổng ' + (S.gi + 1) + '/' + N + '  ·  ' + st.name, st.say);
    spawnRow();
  }
  function spawnRow() {
    var st = cfg.stations[S.gi], bw = 98, gap = 14, n = st.o.length, x0 = W + 90;
    S.blocks = [];
    for (var i = 0; i < n; i++) { S.blocks.push({ x: x0 + i * (bw + gap), w: bw, h: 52, k: st.o[i].k, label: (st.sh && st.sh[i]) || st.o[i].t, col: BLOCK_COL[i % 4], bump: 0, fade: 1, hit: false }); }
  }
  function pick(b) {
    S.picked = b; b.hit = true; b.bump = .28; S.score[b.k]++; S.last = b.k; S.mode = 'after'; S.afterT = 1.5; S.vz = -120; S.hold = false;
    track('gate_pick', { gate: S.gi + 1, pick: b.k }); beep(784, .16, 'triangle', .07);
    for (var i = 0; i < 16; i++) { S.parts.push({ x: b.x + b.w / 2, y: 0, z: 108, vx: (Math.random() - .5) * 160, vz: 50 + Math.random() * 140, life: .8, c: b.col, r: 2.6 }); }
    qshow('Bạn chọn', b.label);
    S.pops.push({ x: b.x + b.w / 2, z: 130, t: 0, text: '+1' });
  }

  /* ---------------------------------------------------------------- Cập nhật */
  var BZ = 114; /* đáy khối (cao so với mặt đất) */
  function update(dt) {
    T += dt; easeSky(dt);
    var m = S.mode, ts;
    ts = m === 'run' ? 150 + S.gi * 7 : m === 'gate' ? 118 : m === 'after' ? 150 : m === 'finish' ? 150 : m === 'intro' ? 55 : 0;
    if (m === 'run' && S.warm < 1) { S.warm += dt; ts *= S.warm; }
    S.speed += (ts - S.speed) * Math.min(1, dt * 3);
    if (S.stumble > 0) { S.stumble -= dt; } if (S.inv > 0) { S.inv -= dt; }
    var dx = S.speed * dt * (S.stumble > 0 ? .5 : 1);
    S.dist += dx;

    /* vật lý nhảy */
    var g = (S.hold && S.vz > 0) ? 760 : 1750;
    if (S.z > 0 || S.vz !== 0) { S.vz -= g * dt; S.z += S.vz * dt; if (S.z <= 0) { S.z = 0; S.vz = 0; S.jumps = 0; } }

    /* dịch chuyển thực thể */
    S.obs.forEach(function (o) { o.x -= dx; }); S.coin.forEach(function (c) { c.x -= dx; }); S.blocks.forEach(function (b) { b.x -= dx; if (b.bump > 0) { b.bump -= dt; } if (b.hit === false && S.picked) { b.fade = Math.max(0, b.fade - dt * 2.5); } });
    S.obs = S.obs.filter(function (o) { return o.x > -80; }); S.coin = S.coin.filter(function (c) { return c.x > -60 && !c.got; });
    if (S.goalX > -900) { S.goalX -= dx; }

    /* nhặt */
    S.coin.forEach(function (c) {
      if (!c.got && Math.abs(c.x - PX) < 24 && Math.abs((c.y) - (S.z + 28)) < 36) {
        c.got = true; S.coins++; coinsUi(); beep(900 + (S.coins % 5) * 80, .06, 'triangle', .04);
        for (var i = 0; i < 4; i++) { S.parts.push({ x: c.x, y: 0, z: c.y, vx: (Math.random() - .5) * 90, vz: 40 + Math.random() * 60, life: .4, c: WORLD.col, r: 2 }); }
      }
    });
    /* va chạm vật cản */
    if (S.inv <= 0 && (m === 'run' || m === 'after' || m === 'finish')) {
      S.obs.forEach(function (o) {
        if (S.inv <= 0 && Math.abs(o.x - PX) < (o.w * .5 + 9) && S.z < o.h - 4) {
          S.inv = 1.3; S.stumble = .7; S.vz = 260; S.z = Math.max(S.z, 1); S.jumps = 1; beep(150, .18, 'sawtooth', .05);
          var lose = Math.min(S.coins, 3); S.coins -= lose; coinsUi();
          for (var i = 0; i < lose; i++) { S.parts.push({ x: PX, y: 0, z: 30, vx: 40 + Math.random() * 80, vz: 120 + Math.random() * 100, life: .8, c: WORLD.col, r: 2.4 }); }
          S.pops.push({ x: PX, z: 70, t: 0, text: lose ? '−' + lose : 'Ối!' });
        }
      });
    }

    /* các chế độ */
    if (m === 'run') {
      S.sectionLeft -= dx; S.nextObs -= dx;
      if (S.nextObs <= 0 && S.sectionLeft > 300) { spawnObstacle(); }
      if (S.sectionLeft <= 0 && !S.obs.some(function (o) { return o.x > PX - 12; })) { startGate(); }
    } else if (m === 'gate') {
      S.blocks.forEach(function (b) {
        if (S.picked || b.hit) { return; }
        var near = Math.abs(b.x + b.w / 2 - PX) < b.w / 2 + 6;
        if (near && S.vz > 0 && S.z + 62 >= BZ) { pick(b); }
      });
      var lastB = S.blocks[S.blocks.length - 1];
      if (!S.picked && lastB && lastB.x + lastB.w < PX - 40) {
        S.misses++; spawnRow(); qshow('Nhảy lên!', 'Chạm để nhảy lên đụng khối đáp án bạn chọn. Cổng ' + (S.gi + 1) + ': ' + cfg.stations[S.gi].say);
      }
    } else if (m === 'after') {
      S.afterT -= dt;
      if (S.afterT <= 0) {
        qhide(); S.gi++; pips(); setSky(S.gi);
        if (S.gi < N) { S.mode = 'run'; S.sectionLeft = 560; S.nextObs = 120; }
        else { S.mode = 'finish'; S.goalX = W + 280; }
      }
    } else if (m === 'finish') {
      if (S.goalX <= PX + 6) { win(); }
    } else if (m === 'win') {
      S.winT += dt; S.reward = Math.min(1, S.reward + dt * 1.6);
      var pnl = Math.min(.72 * HH, 146 * (W / 100)), top = HH - BRAND - pnl;
      var target = Math.max(0, groundY - (top - 20)); S.camOff += (target - S.camOff) * Math.min(1, dt * 3.2);
      if (S.z === 0 && S.winT < 1.2 && S.jumps === 0) { S.vz = 340; S.jumps = 1; S.z = 1; }
    }

    if (S.clip) { bot(); }

    /* hạt, chữ nổi */
    S.parts.forEach(function (p) { p.life -= dt; p.x += p.vx * dt; p.z += p.vz * dt; p.vz -= 520 * dt; });
    S.parts = S.parts.filter(function (p) { return p.life > 0; });
    S.pops.forEach(function (p) { p.t += dt; }); S.pops = S.pops.filter(function (p) { return p.t < .9; });
  }

  /* tự chơi (để xem thử / quay clip) */
  function bot() {
    S._bot = true;
    if (S.z === 0 && S.vz === 0) {
      var need = S.obs.some(function (o) { var d = o.x - PX; return d > 8 && d < 58 + S.speed * .12; });
      if (need) { jump(); }
      if (S.mode === 'gate' && !S.picked) {
        var tgt = S.blocks.filter(function (b) { return b.k === S.aim; })[0] || S.blocks[0];
        if (S.gi % 3 === 1 && S.blocks.length > 2) { tgt = S.blocks[(S.gi + 1) % S.blocks.length]; }
        var d2 = tgt.x + tgt.w / 2 - PX; if (d2 < 30 && d2 > -30) { jump(); }
      }
    } else if (S.jumps === 1 && S.vz < -50 && S.obs.some(function (o) { return Math.abs(o.x - PX) < 26 && S.z < 40; })) { jump(); }
    S.hold = S.vz > 0; S._bot = false;
  }

  /* ---------------------------------------------------------------- Chiến thắng + kết quả */
  function winner() {
    var best = null, max = -1;
    KEYS.forEach(function (k) { if (S.score[k] > max || (S.score[k] === max && k === S.last)) { max = S.score[k]; best = k; } });
    return best;
  }
  function win() {
    S.mode = 'win'; S.winT = 0; S.reward = 0; S.jumps = 0;
    var k = winner(), t = cfg.types[k], L = cfg.labels;
    track('game_complete', { result: k, mode: S.clip ? 'auto' : 'play', coins: S.coins });
    var sh = t.shape, svg = '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="-34 -34 68 68">' + H.shapeSVG(sh) + '</svg>';
    rewardIm = svgImg(svg); pips();
    [523, 659, 784, 1047].forEach(function (f, i) { later(function () { beep(f, .28, 'triangle', .07); }, i * 130); });
    for (var i = 0; i < 30; i++) { S.parts.push({ x: PX + (Math.random() - .5) * 60, y: 0, z: 60 + Math.random() * 40, vx: (Math.random() - .5) * 220, vz: 120 + Math.random() * 220, life: 1.4, c: BLOCK_COL[i % 4], r: 2.8 }); }
    later(function () {
      stage.classList.add('done'); stage.classList.remove('run');
      panel.innerHTML = '<div class="res stack">' +
        '<div class="tag">' + cfg.lead + '</div><h2>' + t.name + '<br><span style="font-size:.62em;font-weight:700;color:var(--leaf)">' + t.who + '</span></h2>' +
        '<dl><div><dt>' + L.s + '</dt><dd>' + t.s + '</dd></div><div><dt>' + L.p + '</dt><dd>' + t.p + '</dd></div><div><dt>' + L.f + '</dt><dd>' + t.f + '</dd></div></dl>' +
        '<p class="note">Bạn nhặt được ' + S.coins + ' ' + WORLD.coinName + '. ' + cfg.note + '</p></div>' +
        '<div class="stack" style="margin-top:auto">' + (cfg.cta.hook ? '<p class="hook">' + cfg.cta.hook + '</p>' : '') +
        '<a class="btn main" id="cta" href="' + SITE + cfg.cta.href + UTM + '" target="_blank" rel="noopener">' + cfg.cta.label + '</a>' +
        (cfg.cta2 ? '<a class="btn ghost" id="cta2" href="' + SITE + cfg.cta2.href + UTM + '" target="_blank" rel="noopener">' + cfg.cta2.label + '</a>' : '') +
        '<div class="row2"><button class="btn ghost" id="again" type="button">Chơi lại</button><a class="btn ghost" href="/tro-choi">Trò khác</a></div></div>';
      $('cta').onclick = function () { track('game_cta_click', { result: k }); };
      if (cfg.cta2) { $('cta2').onclick = function () { track('game_cta2_click', { result: k }); }; }
      $('again').onclick = intro;
    }, 1500);
  }

  /* ---------------------------------------------------------------- Vẽ */
  var STARS = []; (function () { var s = 7; for (var i = 0; i < 46; i++) { s = (s * 9301 + 49297) % 233280; var a = s / 233280; s = (s * 9301 + 49297) % 233280; STARS.push([a * W, s / 233280, i]); } })();
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function hill(color, base, amp, f1, f2, par) {
    ctx.fillStyle = css(color); ctx.beginPath(); ctx.moveTo(-10, groundY + 4);
    for (var x = -10; x <= W + 10; x += 8) { var u = x + S.dist * par; ctx.lineTo(x, base - amp - Math.sin(u / f1) * amp * .55 - Math.sin(u / f2) * amp * .22); }
    ctx.lineTo(W + 10, groundY + 4); ctx.closePath(); ctx.fill();
  }
  function drawSky() {
    var gr = ctx.createLinearGradient(0, 0, 0, groundY); gr.addColorStop(0, css(SK.top)); gr.addColorStop(1, css(SK.bot));
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH + 4);
    if (SK.stars > .02) {
      ctx.fillStyle = '#FFF6DC';
      STARS.forEach(function (s) { ctx.globalAlpha = SK.stars * (.45 + .55 * Math.sin(T * 2 + s[2])); ctx.fillRect(s[0], 10 + s[1] * groundY * .55, 1.6, 1.6); });
      ctx.globalAlpha = 1;
    }
  }
  function drawSun() {
    var y = groundY - 30 - (SK.sun + 30) * 3.3, x = W * .72;
    if (y > groundY + 60) { return; }
    if (cfg.celestial === 'moon') {
      var gm = ctx.createRadialGradient(x - 6, y - 6, 4, x, y, 34); gm.addColorStop(0, '#FFFFFF'); gm.addColorStop(.7, '#E8EEFF'); gm.addColorStop(1, 'rgba(214,225,255,0)');
      ctx.fillStyle = gm; ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.fill();
    } else {
      var gs = ctx.createRadialGradient(x, y, 6, x, y, 56); gs.addColorStop(0, 'rgba(255,240,190,.95)'); gs.addColorStop(.35, 'rgba(255,214,140,.55)'); gs.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(x, y, 56, 0, 7); ctx.fill();
      ctx.fillStyle = '#FFF1C4'; ctx.beginPath(); ctx.arc(x, y, 21, 0, 7); ctx.fill();
    }
  }
  function drawClouds() {
    var a = .38 * (1 - Math.min(1, SK.stars * 1.2)); if (a < .03) { return; }
    ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
    for (var i = 0; i < 5; i++) {
      var x = ((i * 150 - S.dist * .07 - T * 4) % (W + 160) + (W + 160)) % (W + 160) - 80, y = groundY * .2 + i * 27 + (i % 2) * 14;
      ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.arc(x + 14, y - 5, 15, 0, 7); ctx.arc(x + 30, y, 11, 0, 7); ctx.fill();
    }
  }
  function drawGround() {
    ctx.fillStyle = css(SK.gnd); ctx.fillRect(0, groundY, W, HH);
    var top = [Math.min(255, SK.gnd[0] + 38), Math.min(255, SK.gnd[1] + 38), Math.min(255, SK.gnd[2] + 30)];
    ctx.fillStyle = css(top); ctx.fillRect(0, groundY, W, 7);
    ctx.fillStyle = css([SK.gnd[0] * .8, SK.gnd[1] * .8, SK.gnd[2] * .8]);
    for (var x = -((S.dist) % 44); x < W; x += 44) { ctx.fillRect(x, groundY + 22, 18, 4); ctx.fillRect(x + 22, groundY + 46, 12, 4); ctx.fillRect(x + 8, groundY + 72, 16, 4); ctx.fillRect(x + 30, groundY + 98, 10, 4); }
  }
  function drawObs(o) {
    var x = o.x, y = groundY;
    ctx.save(); ctx.translate(x, y); ctx.scale(1.2, 1.2);
    if (o.k === 'rock') { ctx.fillStyle = '#8A93A6'; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.quadraticCurveTo(-16, -22, -4, -26); ctx.quadraticCurveTo(12, -30, 15, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.ellipse(-4, -17, 5, 3, -.5, 0, 7); ctx.fill(); }
    else if (o.k === 'crate') { ctx.fillStyle = '#B9803F'; rr(-14, -28, 28, 28, 3); ctx.fill(); ctx.strokeStyle = '#7A4E22'; ctx.lineWidth = 2.4; ctx.strokeRect(-12, -26, 24, 24); ctx.beginPath(); ctx.moveTo(-12, -26); ctx.lineTo(12, -2); ctx.moveTo(12, -26); ctx.lineTo(-12, -2); ctx.stroke(); }
    else if (o.k === 'books') { var cs = ['#D9645B', '#5B8DE0', '#F2C14E']; for (var i = 0; i < 3; i++) { ctx.fillStyle = cs[i]; rr(-15 + (i % 2) * 3, -11 * (i + 1), 28, 10, 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-12 + (i % 2) * 3, -11 * (i + 1) + 4, 22, 2); } }
    else if (o.k === 'thorn') { ctx.fillStyle = '#4C8F6C'; for (var j = 0; j < 4; j++) { ctx.beginPath(); ctx.moveTo(-15 + j * 8, 0); ctx.lineTo(-11 + j * 8, -26 + (j % 2) * 6); ctx.lineTo(-7 + j * 8, 0); ctx.fill(); } ctx.fillStyle = '#3B7457'; ctx.fillRect(-16, -4, 32, 4); }
    else { var tc = ['#F0707A', '#6FB8F2', '#F5C84A']; ctx.fillStyle = tc[0]; rr(-15, -14, 15, 14, 2); ctx.fill(); ctx.fillStyle = tc[1]; rr(0, -14, 15, 14, 2); ctx.fill(); ctx.fillStyle = tc[2]; rr(-8, -28, 16, 14, 2); ctx.fill(); }
    ctx.restore();
  }
  function drawCoin(c) {
    var y = groundY - c.y + Math.sin(T * 5 + c.ph) * 2, x = c.x; ctx.save(); ctx.translate(x, y);
    var k = WORLD.coin;
    if (k === 'coin') { ctx.fillStyle = '#F5B82E'; ctx.beginPath(); ctx.ellipse(0, 0, 8 * Math.abs(Math.cos(T * 3 + c.ph)) + 1.6, 8, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#FFE08A'; ctx.beginPath(); ctx.ellipse(0, 0, 3, 5, 0, 0, 7); ctx.fill(); }
    else if (k === 'star') { ctx.fillStyle = '#FFE27A'; ctx.beginPath(); for (var i = 0; i < 10; i++) { var a = Math.PI * i / 5 - Math.PI / 2, r = i % 2 ? 4 : 9; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.fill(); }
    else if (k === 'heart') { ctx.fillStyle = '#FF7C92'; ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-14, -2, -9, -12, -3, -9); ctx.lineTo(0, -6); ctx.lineTo(3, -9); ctx.bezierCurveTo(9, -12, 14, -2, 0, 8); ctx.fill(); }
    else if (k === 'feather') { ctx.rotate(-.7); ctx.fillStyle = '#CFE0FF'; ctx.beginPath(); ctx.ellipse(0, 0, 4.4, 10, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#7FA6E8'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 11); ctx.stroke(); }
    else { ctx.fillStyle = '#7FD6F5'; ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(9, 0, 6, 5); ctx.quadraticCurveTo(0, 12, -6, 5); ctx.quadraticCurveTo(-9, 0, 0, -10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(-2, 1, 1.6, 3, 0, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function wrap(text, maxW) {
    var words = text.split(' '), lines = [], cur = '';
    words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else { cur = t; } });
    lines.push(cur); return lines;
  }
  function drawBlock(b) {
    var bob = b.bump > 0 ? -Math.sin(b.bump / .28 * Math.PI) * 10 : Math.sin(T * 2.4 + b.x * .02) * 1.6;
    var y = groundY - BZ - b.h + bob, x = b.x; if (x > W + 20 || x + b.w < -20) { return; }
    ctx.save(); ctx.globalAlpha = b.fade; ctx.translate(0, 0);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; rr(x + 2, y + 5, b.w, b.h, 9); ctx.fill();
    ctx.fillStyle = b.col; rr(x, y, b.w, b.h, 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.28)'; rr(x + 3, y + 3, b.w - 6, 7, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(20,33,61,.35)'; ctx.lineWidth = 2; rr(x + 1, y + 1, b.w - 2, b.h - 2, 8); ctx.stroke();
    ctx.fillStyle = '#14213D'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '700 12.5px "Be Vietnam Pro", system-ui, sans-serif';
    var ls = wrap(b.label, b.w - 12); if (ls.length > 2) { ls = [ls[0], ls.slice(1).join(' ')]; }
    var ly = y + b.h / 2 + 2 - (ls.length - 1) * 8; ls.forEach(function (l, i) { ctx.fillText(l, x + b.w / 2, ly + i * 16); });
    if (b.hit) { ctx.fillStyle = '#14213D'; ctx.beginPath(); ctx.arc(x + b.w - 11, y + 11, 8, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + b.w - 15, y + 11); ctx.lineTo(x + b.w - 12, y + 14); ctx.lineTo(x + b.w - 7, y + 8); ctx.stroke(); }
    ctx.restore();
  }
  function drawGoal() {
    if (S.goalX < -100 || S.goalX > W + 60) { return; }
    var x = S.goalX; ctx.fillStyle = '#F6F2EA'; ctx.fillRect(x - 2, groundY - 150, 4, 150);
    ctx.fillStyle = '#F5B82E'; ctx.beginPath(); ctx.arc(x, groundY - 152, 6, 0, 7); ctx.fill();
    ctx.fillStyle = BLOCK_COL[1]; ctx.beginPath(); ctx.moveTo(x + 2, groundY - 146); ctx.lineTo(x + 52, groundY - 128 + Math.sin(T * 6) * 3); ctx.lineTo(x + 2, groundY - 108); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '800 11px "Baloo 2", system-ui'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('ĐÍCH', x + 8, groundY - 127);
  }
  function drawPlayer() {
    var z = S.z, dh = 74, dw = dh * 120 / 126, bob = S.mode === 'win' ? 0 : (z === 0 ? Math.abs(Math.sin(T * 13)) * 3 : 0), run = z === 0 && S.speed > 30;
    var sy = 1, sx = 1; if (z > 0) { sy = 1 + Math.min(.12, Math.abs(S.vz) / 5000); sx = 1 / sy; } else if (run) { sy = 1 + Math.sin(T * 13) * .035; sx = 1 / sy; }
    var feetY = groundY - z; ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,' + (.28 - Math.min(.2, z / 500)) + ')'; ctx.beginPath(); ctx.ellipse(PX, groundY + 3, 22 - Math.min(8, z / 20), 5, 0, 0, 7); ctx.fill();
    if (S.inv > 0 && Math.floor(S.inv * 14) % 2) { ctx.globalAlpha = .45; }
    ctx.translate(PX, feetY + 1 - bob); ctx.scale(sx, sy); ctx.rotate(z > 0 ? Math.max(-.18, Math.min(.18, -S.vz / 3500)) : (run ? Math.sin(T * 13) * .035 : 0));
    if (charIm.complete && charIm.naturalWidth) { ctx.drawImage(charIm, -dw / 2, -dh * .93, dw, dh); }
    else { ctx.fillStyle = '#8FE3B0'; ctx.beginPath(); ctx.ellipse(0, -24, 20, 24, 0, 0, 7); ctx.fill(); }
    ctx.restore();
    if (S.mode === 'win' && rewardIm && rewardIm.complete) {
      var k = S.reward, e = 1 + Math.sin(k * Math.PI) * .28, sz = 64 * k * e;
      ctx.save(); ctx.translate(PX, groundY - z - 96 - Math.sin(T * 3) * 2); ctx.rotate(Math.sin(T * 2) * .06); ctx.drawImage(rewardIm, -sz / 2, -sz / 2, sz, sz); ctx.restore();
    }
  }
  function drawParts() {
    S.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2)); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, groundY - p.z, p.r, 0, 7); ctx.fill(); });
    ctx.globalAlpha = 1;
    ctx.font = '800 15px "Baloo 2", system-ui'; ctx.textAlign = 'center';
    S.pops.forEach(function (p) { ctx.globalAlpha = 1 - p.t / .9; ctx.fillStyle = '#fff'; ctx.fillText(p.text, p.x, groundY - p.z - p.t * 40); });
    ctx.globalAlpha = 1;
  }
  function draw() {
    ctx.save(); drawSky(); drawSun(); drawClouds();
    ctx.translate(0, -S.camOff);
    hill(SK.far, groundY - 30, 46, 52, 21, .15); hill(SK.near, groundY - 8, 30, 38, 15, .38);
    drawGround(); drawGoal();
    S.obs.forEach(drawObs); S.coin.forEach(drawCoin);
    drawPlayer(); S.blocks.forEach(drawBlock); drawParts();
    ctx.restore();
  }

  function frame(ts) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(.05, ((ts - last) / 1000) || 0); last = ts;
    update(dt); draw();
  }
  window.__game = { cfg: cfg, state: function () { return S; }, pickAll: function () { return S.mode; } };
  intro(); raf = requestAnimationFrame(frame);
};
