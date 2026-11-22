/* Bộ máy chung cho cả series trò chơi. Nội dung nằm ở games.js.
   Trang trò chơi chỉ cần: <main class="stage" id="stage"></main>, đặt window.GAME_ID = 'mam' | 'cao' | 'cu' | 'en' | 'gau' | 'hub'. */
(function () {
  'use strict';
  var SITE = 'https://sophianguyen.com.vn';
  var NS = 'http://www.w3.org/2000/svg';
  var GAMES = window.GAMES, ORDER = window.GAME_ORDER, ID = window.GAME_ID || 'mam';
  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function track(name, params) { try { if (window.gtag) { var p = params || {}; p.game = ID; window.gtag('event', name, p); } } catch (e) {} }

  /* ---------------------------------------------------------------- Hình vẽ nhân vật */
  var BODY = {
    sprout: { body: '#8FE3B0', belly: '#BDF3D2', feet: '#4FAE7C' },
    fox: { body: '#F08A3E', belly: '#FFE6C8', feet: '#C9672A' },
    owl: { body: '#A98767', belly: '#EBD9BE', feet: '#F2B53C' },
    bird: { body: '#5B8DE0', belly: '#EAF2FF', feet: '#F5A93A' },
    bear: { body: '#B27A4E', belly: '#E9CFA8', feet: '#8E5C36' }
  };
  function behind(kind, c) {
    if (kind === 'fox') {
      return '<path d="M92 120 C 122 118 126 80 108 70 C 112 92 100 100 88 104Z" fill="' + c.body + '"/><path d="M108 70 C 114 76 118 84 117 92 C 112 86 109 80 108 70Z" fill="#fff"/>' +
        '<polygon points="26,70 32,30 58,54" fill="' + c.body + '"/><polygon points="94,70 88,30 62,54" fill="' + c.body + '"/>' +
        '<polygon points="33,60 35,40 49,54" fill="#3B2A22"/><polygon points="87,60 85,40 71,54" fill="#3B2A22"/>';
    }
    if (kind === 'owl') {
      return '<polygon points="28,68 30,36 54,56" fill="' + c.body + '"/><polygon points="92,68 90,36 66,56" fill="' + c.body + '"/>' +
        '<ellipse cx="27" cy="104" rx="10" ry="22" fill="#8A6B4D" transform="rotate(12 27 104)"/><ellipse cx="93" cy="104" rx="10" ry="22" fill="#8A6B4D" transform="rotate(-12 93 104)"/>';
    }
    if (kind === 'bird') {
      return '<polygon points="84,118 116,132 112,112" fill="#3F6FC4"/><path d="M54 58 C 52 46 58 40 64 44 C 62 48 63 52 66 58Z" fill="#3F6FC4"/>';
    }
    if (kind === 'bear') {
      return '<circle cx="30" cy="64" r="13" fill="' + c.body + '"/><circle cx="90" cy="64" r="13" fill="' + c.body + '"/>' +
        '<circle cx="30" cy="65" r="6.5" fill="' + c.belly + '"/><circle cx="90" cy="65" r="6.5" fill="' + c.belly + '"/>';
    }
    return '';
  }
  function front(kind, c) {
    if (kind === 'fox') {
      return '<ellipse cx="60" cy="110" rx="22" ry="17" fill="' + c.belly + '"/><ellipse cx="60" cy="100" rx="4.6" ry="3.2" fill="#2A1B18"/>';
    }
    if (kind === 'owl') {
      return '<circle cx="47" cy="90" r="13.4" fill="#F6E7C6"/><circle cx="73" cy="90" r="13.4" fill="#F6E7C6"/>';
    }
    if (kind === 'bird') {
      return '<ellipse cx="88" cy="108" rx="9" ry="19" fill="#3F6FC4" transform="rotate(-10 88 108)"/>';
    }
    if (kind === 'bear') {
      return '<ellipse cx="60" cy="108" rx="18" ry="14" fill="' + c.belly + '"/><ellipse cx="60" cy="101" rx="5.2" ry="3.6" fill="#2A1B18"/>';
    }
    return '<ellipse cx="54" cy="108" rx="20" ry="24" fill="' + c.belly + '" opacity=".65"/>';
  }
  function beak(kind) {
    if (kind === 'owl') { return '<polygon points="55,98 65,98 60,109" fill="#F2B53C"/>'; }
    if (kind === 'bird') { return '<polygon points="53,99 67,99 60,110" fill="#F5A93A"/>'; }
    return '';
  }
  /* id: gắn thêm vào để nhiều nhân vật trên cùng trang (trang chủ) không trùng id */
  function charSVG(kind, uid, withParts) {
    var c = BODY[kind], eyeFront = kind === 'owl';
    var hasMouth = kind !== 'owl' && kind !== 'bird';
    var s = '<svg viewBox="' + (withParts ? '0 -52 120 202' : '0 24 120 126') + '" aria-hidden="true"' + (uid ? ' id="' + uid + 'Svg"' : '') + '>' +
      '<ellipse cx="60" cy="141" rx="28" ry="5" fill="rgba(0,0,0,.28)"/><g class="bob">' +
      behind(kind, c) +
      '<ellipse cx="45" cy="137" rx="10" ry="5.4" fill="' + c.feet + '"/><ellipse cx="75" cy="137" rx="10" ry="5.4" fill="' + c.feet + '"/>';
    if (kind === 'sprout' && withParts) {
      s += '<g class="sprout" id="sprout"><path id="stem" d="M60 60 L60 46" stroke="#4FAE7C" stroke-width="4.5" stroke-linecap="round" fill="none"/><g id="leaves"></g></g>';
    }
    if (withParts) { s += '<g class="reward" id="reward"></g>'; }
    s += '<ellipse cx="60" cy="98" rx="35" ry="41" fill="' + c.body + '"/>' + front(kind, c) + beak(kind) +
      '<circle cx="47" cy="90" r="8.4" fill="#fff"/><circle cx="73" cy="90" r="8.4" fill="#fff"/>' +
      '<circle ' + (uid ? '' : '') + 'class="pl" cx="48" cy="91" r="4.3" fill="#14213D"/><circle class="pr" cx="74" cy="91" r="4.3" fill="#14213D"/>' +
      '<circle cx="49.5" cy="89" r="1.4" fill="#fff"/><circle cx="75.5" cy="89" r="1.4" fill="#fff"/>' +
      (kind === 'owl' || kind === 'bird' ? '' : '<ellipse cx="36" cy="104" rx="5.4" ry="3.2" fill="#FF9FA8" opacity=".7"/><ellipse cx="84" cy="104" rx="5.4" ry="3.2" fill="#FF9FA8" opacity=".7"/>') +
      (hasMouth ? '<path class="mouth" d="M52 106 Q60 113 68 106" stroke="#14213D" stroke-width="2.6" fill="none" stroke-linecap="round"/>' : '<path class="mouth" d="M52 106 Q60 113 68 106" fill="none" style="display:none"/>') +
      '</g></svg>';
    return s;
  }

  /* ---------------------------------------------------------------- Phần thưởng (hình kết quả) */
  function poly(n, r1, r2, fill) {
    var p = [];
    for (var i = 0; i < n * 2; i++) {
      var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1;
      p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1));
    }
    return '<polygon points="' + p.join(' ') + '" fill="' + fill + '"/>';
  }
  function shapeSVG(sh) {
    var h = '', i;
    switch (sh.kind) {
      case 'petals':
        for (i = 0; i < sh.n; i++) { h += '<ellipse cx="0" cy="' + (-sh.d) + '" rx="' + sh.rx + '" ry="' + sh.ry + '" fill="' + (i % 2 ? sh.c2 : sh.c) + '" transform="rotate(' + (i * 360 / sh.n) + ')"/>'; }
        return h + '<circle r="' + sh.r + '" fill="' + sh.core + '"/>';
      case 'gear':
        for (i = 0; i < sh.n; i++) { h += '<rect x="-3.8" y="-' + (sh.r + 5) + '" width="7.6" height="11" rx="2" fill="' + sh.c + '" transform="rotate(' + (i * 360 / sh.n) + ')"/>'; }
        return h + '<circle r="' + sh.r + '" fill="' + sh.c + '"/><circle r="7" fill="' + sh.core + '"/>';
      case 'sparkle':
        return '<path d="M0 -27 C 3 -9 9 -3 27 0 C 9 3 3 9 0 27 C -3 9 -9 3 -27 0 C -9 -3 -3 -9 0 -27Z" fill="' + sh.c + '"/><circle r="6" fill="' + sh.core + '"/>';
      case 'heart':
        return '<path d="M0 22 C -32 2 -24 -26 -9 -22 C -3 -20 0 -15 0 -12 C 0 -15 3 -20 9 -22 C 24 -26 32 2 0 22Z" fill="' + sh.c + '"/><ellipse cx="-11" cy="-10" rx="5" ry="3.4" fill="' + sh.core + '" transform="rotate(-30 -11 -10)"/>';
      case 'star':
        return poly(sh.n, sh.r1, sh.r2, sh.c) + '<circle r="6.5" fill="' + sh.core + '"/>';
      case 'hex':
        return poly(6, 24, 24, sh.c).replace(/ fill=/, ' transform="rotate(30)" fill=') + poly(6, 14, 14, sh.c2 || sh.c).replace(/ fill=/, ' transform="rotate(30)" fill=') + '<circle r="6" fill="' + sh.core + '"/>';
      case 'ring':
        return '<circle r="21" fill="none" stroke="' + sh.c + '" stroke-width="7"/><circle r="10" fill="' + (sh.c2 || sh.c) + '"/><circle r="4.2" fill="' + sh.core + '"/>';
      case 'moon':
        return '<path d="M8 -24 A 25 25 0 1 0 8 24 A 19 19 0 1 1 8 -24Z" fill="' + sh.c + '"/><circle cx="14" cy="-2" r="4" fill="' + sh.core + '"/>';
    }
    return '';
  }

  /* ---------------------------------------------------------------- Màu trời, đồi (nội suy 7 mốc) */
  function hx(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function lerp(a, b, t) { var x = hx(a), y = hx(b), o = [], i; for (i = 0; i < 3; i++) { o.push(Math.round(x[i] + (y[i] - x[i]) * t)); } return 'rgb(' + o.join(',') + ')'; }

  /* ---------------------------------------------------------------- Dựng trang chủ chọn trò */
  function hub() {
    var g0 = GAMES.mam;
    stage.className = 'stage pick'; stage.style.setProperty('--ph', '86%');
    stage.setAttribute('aria-label', 'Các trò chơi tính cách của Sophia Nguyễn');
    stage.innerHTML = '<div class="sun" style="--sunUp:-6cqw"></div>' + scenery() +
      '<div class="hud"><span class="name">Trò chơi tính cách</span></div>' +
      '<section class="panel" id="panel"><div class="stack"><h1 class="title" style="font-size:7.4cqw">Chọn một nhân vật để chơi cùng</h1>' +
      '<p class="sub" style="font-size:3.6cqw">Mỗi trò chơi chỉ một phút. Cuối trò, bạn nhận một kết quả vui và một bài test miễn phí để hiểu mình rõ hơn.</p></div>' +
      '<div class="pick-list" id="list"></div></section>' +
      '<div class="brand"><span>Sophia Nguyễn</span><b>sophianguyen.com.vn</b></div>';
    applySky(g0, 4);
    var list = $('list');
    ORDER.forEach(function (k) {
      var g = GAMES[k], a = document.createElement('a');
      a.className = 'pick-card'; a.href = g.url;
      a.innerHTML = charSVG(g.char.kind, null, false) + '<span><b>' + g.hud + '</b><small>' + g.leadsTo + '</small></span>';
      a.onclick = function () { track('hub_pick', { pick: k }); };
      list.appendChild(a);
    });
  }
  function scenery() {
    return '<svg class="stars" viewBox="0 0 360 320" preserveAspectRatio="none" aria-hidden="true"><g fill="#FFF6DC"><circle cx="30" cy="60" r="1.6"/><circle cx="88" cy="34" r="1.2"/><circle cx="140" cy="88" r="1.8"/><circle cx="196" cy="42" r="1.3"/><circle cx="250" cy="96" r="1.5"/><circle cx="318" cy="52" r="1.8"/><circle cx="62" cy="128" r="1.1"/><circle cx="226" cy="150" r="1.2"/><circle cx="330" cy="150" r="1.1"/><circle cx="116" cy="170" r="1.4"/></g></svg>' +
      '<svg class="hills" viewBox="0 0 360 160" preserveAspectRatio="none" aria-hidden="true"><g id="gFar"><path class="far" d="M-40 40 C 30 6 100 8 150 30 C 210 54 270 4 400 28 L400 160 L-40 160Z"/></g><g id="gNear"><path class="near" d="M-40 58 C 50 28 120 30 190 50 C 250 66 320 32 400 48 L400 160 L-40 160Z"/></g><path class="gnd" d="M-40 66 C 80 54 150 60 210 62 C 280 64 330 56 400 60 L400 160 L-40 160Z"/></svg>';
  }
  function applySky(g, n) {
    var t = Math.min(n, 6) / 6, st = stage.style, s = g.sky[Math.min(n, 6)];
    st.setProperty('--skyTop', s[0]); st.setProperty('--skyBot', s[1]);
    st.setProperty('--hillFar', lerp(g.hills.far[0], g.hills.far[1], t));
    st.setProperty('--hillNear', lerp(g.hills.near[0], g.hills.near[1], t));
    st.setProperty('--ground', lerp(g.hills.ground[0], g.hills.ground[1], t));
    st.setProperty('--sunUp', g.sunUp[Math.min(n, 6)] + 'cqw'); st.setProperty('--stars', g.stars[Math.min(n, 6)]);
  }

  /* ---------------------------------------------------------------- Trò chơi */
  function game(cfg) {
    var KEYS = Object.keys(cfg.types), N = cfg.stations.length;
    var UTM = '?utm_source=game&utm_medium=social&utm_campaign=game-' + cfg.id;
    var kind = cfg.char.kind;
    var S, audio = null, soundOn = false, panel, hero, mouth, pl, pr;

    stage.setAttribute('aria-label', 'Trò chơi ' + cfg.hud);
    stage.innerHTML = '<div class="sun' + (cfg.celestial === 'moon' ? ' moon' : '') + '" id="sun" aria-hidden="true"></div>' + scenery() +
      '<div class="hud"><span class="name">' + cfg.hud + '</span><div class="pips" id="pips" aria-hidden="true"></div>' +
      '<button class="snd" id="snd" type="button" aria-pressed="false" aria-label="Bật âm thanh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path id="sndOn" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" hidden/></svg></button></div>' +
      '<div class="hero" id="hero" aria-hidden="true">' + charSVG(kind, null, true) + '</div>' +
      '<section class="panel" id="panel" aria-live="polite"></section>' +
      '<div class="brand"><span>Sophia Nguyễn</span><b>sophianguyen.com.vn</b></div>';
    panel = $('panel'); hero = $('hero');
    mouth = hero.querySelector('.mouth'); pl = hero.querySelector('.pl'); pr = hero.querySelector('.pr');

    function later(fn, ms) { var t = setTimeout(fn, ms); S.timers.push(t); return t; }
    function clearTimers() { S.timers.forEach(clearTimeout); S.timers = []; }
    function fresh() { var sc = {}; KEYS.forEach(function (k) { sc[k] = 0; }); return { i: 0, score: sc, last: null, clip: false, busy: false, timers: [], aim: null, done: false }; }
    S = fresh();

    /* âm thanh (mặc định tắt) */
    function beep(f, d, type, vol) {
      if (!soundOn) { return; }
      try {
        audio = audio || new (window.AudioContext || window.webkitAudioContext)();
        var o = audio.createOscillator(), g = audio.createGain();
        o.type = type || 'sine'; o.frequency.value = f; g.gain.value = vol || .06; o.connect(g); g.connect(audio.destination);
        var t = audio.currentTime; g.gain.setValueAtTime(vol || .06, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d);
      } catch (e) {}
    }
    function jingle() { [523, 659, 784, 1047].forEach(function (f, i) { later(function () { beep(f, .28, 'triangle', .07); }, i * 130); }); }
    $('snd').addEventListener('click', function () {
      soundOn = !soundOn; this.setAttribute('aria-pressed', soundOn); this.setAttribute('aria-label', soundOn ? 'Tắt âm thanh' : 'Bật âm thanh');
      $('sndOn').hidden = !soundOn; beep(660, .12);
    });

    /* cảnh */
    var LEAVES = [[60, 54, -22, 1], [60, 48, 202, 1], [60, 40, -34, 1.12], [60, 33, 214, 1.12], [60, 25, -48, 1.22], [60, 18, 228, 1.22]];
    function drawLeaves(n) {
      if (kind !== 'sprout') { return; }
      var g = $('leaves'); g.innerHTML = '';
      LEAVES.forEach(function (l, idx) {
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', 'M0 0 C 8 -11 24 -10 30 0 C 24 10 8 11 0 0Z'); p.setAttribute('fill', idx % 2 ? '#6FD39A' : '#8FE3B0'); p.setAttribute('class', 'leaf');
        p.setAttribute('transform', 'translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ') scale(' + (idx < n ? l[3] : 0) + ')'); g.appendChild(p);
      });
      $('stem').setAttribute('d', 'M60 60 L60 ' + (62 - (6 + n * 7.5)));
    }
    function mood(m) {
      mouth.setAttribute('d', m === 'o' ? 'M55 108 Q60 114 65 108 Q60 104 55 108Z' : m === 'big' ? 'M49 104 Q60 120 71 104Z' : 'M52 106 Q60 113 68 106');
      mouth.setAttribute('fill', m === 'o' || m === 'big' ? '#14213D' : 'none');
    }
    function look(dx) { pl.setAttribute('cx', 48 + dx); pr.setAttribute('cx', 74 + dx); }
    function pips() {
      var box = $('pips'); box.innerHTML = '';
      for (var i = 0; i < N; i++) { var e = document.createElement('i'); if (i <= S.i || S.done) { e.className = 'on'; } box.appendChild(e); }
    }
    function walk(ms, cb) {
      hero.classList.add('walk'); mood('big');
      var far = $('gFar'), near = $('gNear'), sh = (S.i % 2 ? 1 : -1);
      far.style.transform = 'translateX(' + (sh * 14) + 'px)'; near.style.transform = 'translateX(' + (sh * 26) + 'px)';
      for (var s = 0; s < 4; s++) { later(function () { beep(300 + Math.random() * 90, .07, 'square', .02); }, s * 260); }
      later(function () { hero.classList.remove('walk'); mood('smile'); cb(); }, reduce ? 50 : ms);
    }
    function typeInto(el, text, done) {
      var i = 0, speed = S.clip ? 26 : 20; el.textContent = '';
      if (reduce) { el.textContent = text; done(); return; }
      (function step() {
        el.textContent = text.slice(0, ++i); if (i % 3 === 0) { beep(700, .03, 'square', .012); }
        if (i < text.length) { later(step, speed); } else { done(); }
      })();
    }

    /* màn hình */
    function intro() {
      clearTimers(); S = fresh();
      stage.classList.remove('done'); applySky(cfg, 0); drawLeaves(0); mood('smile'); look(0); pips();
      $('reward').innerHTML = '';
      panel.innerHTML =
        '<div class="stack" style="margin-top:2cqw"><h1 class="title">' + cfg.title + '</h1><p class="sub">' + cfg.sub + '</p></div>' +
        '<div class="stack" style="margin-top:auto"><button class="btn main" id="go" type="button">Bắt đầu</button>' +
        '<button class="btn ghost" id="auto" type="button">Tự chạy để quay clip</button>' +
        '<a class="linkbtn" href="/tro-choi">Chọn nhân vật khác</a></div>';
      $('go').onclick = function () { start(false); };
      $('auto').onclick = function () { start(true); };
    }
    function start(clip) {
      S.clip = clip; S.aim = clip ? KEYS[Math.floor(Math.random() * KEYS.length)] : null;
      beep(523, .12); track('game_start', { mode: clip ? 'auto' : 'play' }); station(0);
    }
    function station(n) {
      S.i = n; S.busy = false; pips(); applySky(cfg, n); drawLeaves(n); mood('smile'); look(0);
      var st = cfg.stations[n], order = st.o.slice().sort(function () { return Math.random() - .5; });
      panel.innerHTML = '<div class="chip">Trạm ' + (n + 1) + '/' + N + '  ·  ' + st.name + '</div><p class="say" id="say"></p><div class="opts" id="opts"></div>';
      var opts = $('opts');
      order.forEach(function (o) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = o.t; b.dataset.k = o.k;
        b.onclick = function () { choose(b, o); }; opts.appendChild(b);
      });
      mood('o'); look(-2);
      typeInto($('say'), st.say, function () {
        mood('smile'); look(0); requestAnimationFrame(function () { opts.classList.add('show'); });
        if (S.clip) {
          later(function () {
            var pick = order.filter(function (o) { return o.k === S.aim; })[0];
            if (!pick || Math.random() < .25) { pick = order[Math.floor(Math.random() * order.length)]; }
            var btn = Array.prototype.filter.call(opts.children, function (b) { return b.textContent === pick.t; })[0];
            choose(btn, pick);
          }, 2300);
        }
      });
    }
    function choose(btn, o) {
      if (S.busy) { return; } S.busy = true;
      S.score[o.k]++; S.last = o.k; btn.classList.add('picked'); $('opts').classList.add('lock');
      hero.classList.remove('hop'); void hero.offsetWidth; hero.classList.add('hop'); mood('big'); look(3); beep(660, .1, 'triangle', .06);
      later(function () { hero.classList.remove('hop'); }, 650);
      later(function () {
        if (S.i + 1 < N) { S.i++; applySky(cfg, S.i); drawLeaves(S.i); pips(); walk(1300, function () { station(S.i); }); }
        else { finish(); }
      }, 900);
    }
    function winner() {
      var best = null, max = -1;
      KEYS.forEach(function (k) { if (S.score[k] > max || (S.score[k] === max && k === S.last)) { max = S.score[k]; best = k; } });
      return best;
    }
    function buildReward(t) {
      var y = cfg.char.rewardY, sc = cfg.char.rewardScale || 1, h = '';
      if (kind === 'sprout') { h += '<path d="M60 62 L60 8" stroke="#4FAE7C" stroke-width="4.5" stroke-linecap="round"/>'; }
      h += '<g transform="translate(60 ' + y + ') scale(' + sc + ')">' + shapeSVG(t.shape) + '</g>';
      var r = $('reward'); r.innerHTML = h; r.style.transformOrigin = '60px ' + (y + 52) + 'px';
    }
    function finish() {
      var k = winner(), t = cfg.types[k], L = cfg.labels;
      S.done = true; buildReward(t); drawLeaves(6); applySky(cfg, 6); pips(); mood('big'); look(0); stage.classList.add('done'); jingle();
      track('game_complete', { result: k, mode: S.clip ? 'auto' : 'play' });
      later(function () {
        panel.innerHTML = '<div class="res stack">' +
          '<div class="tag">' + cfg.lead + '</div><h2>' + t.name + '<br><span style="font-size:.62em;font-weight:700;color:var(--leaf)">' + t.who + '</span></h2>' +
          '<dl><div><dt>' + L.s + '</dt><dd>' + t.s + '</dd></div><div><dt>' + L.p + '</dt><dd>' + t.p + '</dd></div><div><dt>' + L.f + '</dt><dd>' + t.f + '</dd></div></dl>' +
          '<p class="note">' + cfg.note + '</p></div>' +
          '<div class="stack" style="margin-top:auto"><a class="btn main" id="cta" href="' + SITE + cfg.cta.href + UTM + '" target="_blank" rel="noopener">' + cfg.cta.label + '</a>' +
          (cfg.cta2 ? '<a class="btn ghost" id="cta2" href="' + SITE + cfg.cta2.href + UTM + '" target="_blank" rel="noopener">' + cfg.cta2.label + '</a>' : '') +
          '<div class="row2"><button class="btn ghost" id="again" type="button">Chơi lại</button><a class="btn ghost" href="/tro-choi">Trò khác</a></div></div>';
        $('cta').onclick = function () { track('game_cta_click', { result: k }); };
        if (cfg.cta2) { $('cta2').onclick = function () { track('game_cta2_click', { result: k }); }; }
        $('again').onclick = intro;
      }, reduce ? 50 : 1100);
    }
    panel.addEventListener('click', function (e) {
      var say = $('say'); if (!say || e.target !== say || S.clip) { return; }
      clearTimers(); say.textContent = cfg.stations[S.i].say; var o = $('opts'); if (o) { o.classList.add('show'); } mood('smile'); look(0);
    });

    /* cho trang kiểm thử */
    window.__game = { cfg: cfg, state: function () { return S; } };
    intro();
  }

  if (ID === 'hub') { hub(); } else { game(GAMES[ID]); }
})();
