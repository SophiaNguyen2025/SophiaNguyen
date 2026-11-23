/* Khung dùng chung (KHÔNG phải luật chơi): khung màn hình dọc, canvas, màn mở đầu, màn kết quả, âm thanh, vòng lặp.
   Mỗi game có file riêng (g_cao.js, g_cu.js, g_en.js, g_gau.js) tự định nghĩa luật chơi, hình vẽ và cách tính kết quả. */
window.GameKit = function (cfg, H, def) {
  'use strict';
  var SITE = 'https://sophianguyen.com.vn';
  var UTM = '?utm_source=game&utm_medium=social&utm_campaign=game-' + cfg.id;
  var stage = document.getElementById('stage');
  var $ = function (id) { return document.getElementById(id); };
  var BRAND = 23;
  stage.setAttribute('aria-label', 'Trò chơi ' + cfg.hud);
  stage.innerHTML =
    '<canvas class="cv" id="cv" aria-label="Màn chơi"></canvas>' +
    '<div class="hud"><span class="name">' + cfg.hud + '</span><div class="pips"></div>' +
    '<button class="snd" id="snd" type="button" aria-pressed="false" aria-label="Bật âm thanh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path id="sndOn" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" hidden/></svg></button></div>' +
    '<div class="tbar" id="tbar" hidden><i id="tbi"></i></div>' +
    '<div class="hint" id="hint" hidden></div>' +
    '<div class="tally" id="tally" hidden></div><div class="legend" id="legend" hidden></div>' +
    '<section class="panel" id="panel" aria-live="polite"></section>' +
    '<div class="brand"><span>Sophia Nguyễn</span><b>sophianguyen.com.vn</b></div>';
  var cv = $('cv'), ctx = cv.getContext('2d'), panel = $('panel');
  var k = { cfg: cfg, ctx: ctx, W: 360, HH: 640, T: 0, mode: 'intro', parts: [], pops: [], ptr: { x: 180, y: 300, down: false }, el: { tally: $('tally'), hint: $('hint') }, S: {} };
  var scale = 1, audio = null, soundOn = false, raf = 0, last = 0, timers = [], rewardIm = null, winT = 0;

  function resize() {
    var r = stage.getBoundingClientRect(), dpr = Math.min(1.5, window.devicePixelRatio || 1);
    scale = r.width / k.W; k.HH = r.height / scale;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    k.groundY = Math.min(k.HH - BRAND - 70, k.HH * .78); k.panelTop = k.HH - BRAND - Math.min(.72 * k.HH, 146 * k.W / 100);
  }
  window.addEventListener('resize', resize); resize();
  try { document.fonts.load('700 12px "Be Vietnam Pro"'); document.fonts.load('800 14px "Baloo 2"'); } catch (e) {}

  /* ---- tiện ích ---- */
  k.later = function (fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; };
  k.track = H.track;
  k.svgImg = function (svg) { var im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return im; };
  k.charImg = function (kind, swaps) {
    var s = H.charSVG(kind, null, false).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="252" ');
    (swaps || []).forEach(function (p) { s = s.split(p[0]).join(p[1]); });
    return k.svgImg(s);
  };
  k.beep = function (f, d, type, vol) {
    if (!soundOn) { return; }
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var o = audio.createOscillator(), g = audio.createGain(); o.type = type || 'sine'; o.frequency.value = f; g.gain.value = vol || .06; o.connect(g); g.connect(audio.destination);
      var t = audio.currentTime; g.gain.setValueAtTime(vol || .06, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d);
    } catch (e) {}
  };
  k.rr = function (x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  k.css = function (a, al) { return 'rgba(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ',' + (al == null ? 1 : al) + ')'; };
  k.burst = function (x, y, c, n, sp) { for (var i = 0; i < (n || 10); i++) { k.parts.push({ x: x, y: y, vx: (Math.random() - .5) * (sp || 160), vy: -Math.random() * (sp || 160) * .8, life: .7, c: c, r: 2.4 }); } };
  k.pop = function (x, y, text, col) { k.pops.push({ x: x, y: y, t: 0, text: text, c: col || '#fff' }); };
  k.progress = function (p) { $('tbar').hidden = false; $('tbi').style.width = Math.max(0, Math.min(1, p)) * 100 + '%'; };
  k.legend = function (t) { var l = $('legend'); l.innerHTML = t || ''; l.hidden = !t; };
  k.hint = function (t, ms) { var h = $('hint'); h.textContent = t; h.hidden = !t; if (t && ms) { k.later(function () { h.hidden = true; }, ms); } };
  k.stars = []; (function () { var s = 11; for (var i = 0; i < 46; i++) { s = (s * 9301 + 49297) % 233280; var a = s / 233280; s = (s * 9301 + 49297) % 233280; k.stars.push([a * k.W, s / 233280, i]); } })();

  $('snd').addEventListener('click', function (e) {
    e.stopPropagation(); soundOn = !soundOn; this.setAttribute('aria-pressed', soundOn); this.setAttribute('aria-label', soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'); $('sndOn').hidden = !soundOn; k.beep(660, .12);
  });

  /* ---- điều khiển ---- */
  function pt(e) { var r = cv.getBoundingClientRect(); k.ptr.x = (e.clientX - r.left) / scale; k.ptr.y = (e.clientY - r.top) / scale; }
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); pt(e); k.ptr.down = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} if (k.mode === 'play' && def.down) { def.down(k); } });
  cv.addEventListener('pointermove', function (e) { pt(e); });
  var rel = function () { if (k.ptr.down) { k.ptr.down = false; if (k.mode === 'play' && def.up) { def.up(k); } } };
  cv.addEventListener('pointerup', rel); cv.addEventListener('pointercancel', rel);
  window.addEventListener('keydown', function (e) {
    if (k.mode !== 'play') { return; }
    if (e.code === 'ArrowLeft') { k.ptr.x = Math.max(20, k.ptr.x - 24); } else if (e.code === 'ArrowRight') { k.ptr.x = Math.min(340, k.ptr.x + 24); }
    else if (e.code === 'Space' && !e.repeat) { e.preventDefault(); k.ptr.down = true; if (def.down) { def.down(k); } }
  });
  window.addEventListener('keyup', function (e) { if (e.code === 'Space' && k.ptr.down) { k.ptr.down = false; if (def.up && k.mode === 'play') { def.up(k); } } });

  /* ---- màn hình ---- */
  k.intro = function () {
    timers.forEach(clearTimeout); timers = []; k.mode = 'intro'; k.parts = []; k.pops = []; k.T = 0; winT = 0;
    stage.classList.remove('run', 'done'); k.legend(''); $('tbar').hidden = true; $('tally').hidden = true; $('hint').hidden = true;
    def.init(k);
    panel.innerHTML =
      '<div class="stack" style="margin-top:2cqw"><h1 class="title">' + cfg.title + '</h1><p class="sub">' + def.sub + '</p>' +
      '<p class="how"><b>Cách chơi</b> ' + def.how + '</p></div>' +
      '<div class="stack" style="margin-top:auto"><button class="btn main" id="go" type="button">Chơi ngay</button>' +
      (cfg.noHub ? '' : '<a class="linkbtn" href="/tro-choi">Chọn nhân vật khác</a>') + '</div>';
    $('go').onclick = k.start;
  };
  k.start = function () {
    stage.classList.add('run'); k.mode = 'play'; k.T = 0; k.H = H; H.track('game_start', { mode: 'play' }); k.beep(523, .12);
    if (def.begin) { def.begin(k); }
  };
  k.end = function (key, stat) {
    if (k.mode !== 'play') { return; }
    var t = cfg.types[key], L = cfg.labels, c2 = cfg.cta2fn ? cfg.cta2fn(key) : cfg.cta2;
    k.mode = 'win'; winT = 0; k.winKey = key;
    H.track('game_complete', { result: key, mode: 'play' });
    rewardIm = k.svgImg('<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="-34 -34 68 68">' + H.shapeSVG(t.shape) + '</svg>');
    [523, 659, 784, 1047].forEach(function (f, i) { k.later(function () { k.beep(f, .28, 'triangle', .07); }, i * 130); });
    for (var i = 0; i < 30; i++) { k.parts.push({ x: k.W / 2 + (Math.random() - .5) * 80, y: k.panelTop * .5, vx: (Math.random() - .5) * 240, vy: -60 - Math.random() * 200, life: 1.4, c: ['#F5B82E', '#F08AB0', '#6FB8F2', '#8FD3A0'][i % 4], r: 2.8 }); }
    k.later(function () {
      stage.classList.add('done'); stage.classList.remove('run'); k.legend(''); $('tbar').hidden = true; $('tally').hidden = true; $('hint').hidden = true;
      panel.innerHTML = '<div class="res stack">' +
        '<div class="tag">' + cfg.lead + '</div><h2>' + t.name + (t.who ? '<br><span style="font-size:.62em;font-weight:700;color:var(--leaf)">' + t.who + '</span>' : '') + '</h2>' +
        '<dl><div><dt>' + L.s + '</dt><dd>' + t.s + '</dd></div><div><dt>' + L.p + '</dt><dd>' + t.p + '</dd></div>' + (t.f ? '<div><dt>' + L.f + '</dt><dd>' + t.f + '</dd></div>' : '') + '</dl>' +
        '<p class="note">' + (stat ? stat + ' ' : '') + cfg.note + (cfg.noPeek ? '' : ' <a id="peek" href="' + SITE + '/ban-do-nang-luc#xem-truoc' + UTM + '" target="_blank" rel="noopener">Xem mẫu báo cáo thật của Sophia</a>') + '</p></div>' +
        '<div class="stack" style="margin-top:auto">' + (cfg.cta.hook ? '<p class="hook">' + cfg.cta.hook + '</p>' : '') +
        '<a class="btn main" id="cta" href="' + SITE + cfg.cta.href + UTM + '" target="_blank" rel="noopener">' + cfg.cta.label + '</a>' +
        (c2 ? '<a class="btn ghost" id="cta2" href="' + (c2.href.indexOf('/mbti/') === 0 ? '' : SITE) + c2.href + UTM + '" target="_blank" rel="noopener">' + c2.label + '</a>' : '') +
        '<div class="row2"><button class="btn ghost" id="again" type="button">Chơi lại</button>' + (cfg.noHub ? '<button class="btn ghost" id="share" type="button">Chia sẻ cho bố mẹ</button>' : '<a class="btn ghost" href="/tro-choi">Trò khác</a>') + '</div></div>';
      $('cta').onclick = function () { H.track('game_cta_click', { result: key }); };
      if (c2) { $('cta2').onclick = function () { H.track('game_cta2_click', { result: key }); }; }
      if ($('peek')) { $('peek').onclick = function () { H.track('game_report_peek_click', { result: key }); }; }
      if ($('share')) {
        $('share').onclick = function () {
          H.track('game_share'); var u = SITE + cfg.url + '?utm_source=share&utm_medium=social&utm_campaign=game-' + cfg.id, b = this;
          if (navigator.share) { navigator.share({ title: cfg.hud, text: cfg.shareText || cfg.hud, url: u }).catch(function () {}); return; }
          try { navigator.clipboard.writeText((cfg.shareText ? cfg.shareText + ' ' : '') + u).then(function () { b.textContent = 'Đã chép liên kết'; }, function () { b.textContent = u; }); } catch (e) { b.textContent = u; }
        };
      }
      $('again').onclick = k.intro;
    }, 1500);
  };

  /* ---- vòng lặp ---- */
  function overlayWin() {
    var cx = k.W / 2, cy = k.panelTop - 56, bob = Math.sin(winT * 3) * 3, sc = Math.min(1, winT * 2.2);
    ctx.fillStyle = 'rgba(8,14,30,' + (.42 * Math.min(1, winT * 2)) + ')'; ctx.fillRect(0, 0, k.W, k.HH);
    if (def.winChar) { def.winChar(k, cx, cy + bob, sc); }
    if (rewardIm && rewardIm.complete) { var e = 1 + Math.sin(Math.min(1, winT * 1.6) * Math.PI) * .28, sz = 84 * Math.min(1, winT * 1.6) * e; ctx.save(); ctx.translate(cx, cy - 84 + bob); ctx.rotate(Math.sin(winT * 2) * .06); ctx.drawImage(rewardIm, -sz / 2, -sz / 2, sz, sz); ctx.restore(); }
  }
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(.05, ((ts - last) / 1000) || 0); last = ts; k.T += dt; k.dt = dt;
    if (k.mode === 'win') { winT += dt; }
    var _t0 = performance.now(); def.update(k, dt);
    k.parts.forEach(function (p) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; }); k.parts = k.parts.filter(function (p) { return p.life > 0; });
    k.pops.forEach(function (p) { p.t += dt; }); k.pops = k.pops.filter(function (p) { return p.t < .9; });
    ctx.save(); def.draw(k);
    k.parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2)); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); });
    ctx.globalAlpha = 1; ctx.font = '800 15px "Baloo 2", system-ui'; ctx.textAlign = 'center';
    k.pops.forEach(function (p) { ctx.globalAlpha = 1 - p.t / .9; ctx.fillStyle = p.c; ctx.fillText(p.text, p.x, p.y - p.t * 40); }); ctx.globalAlpha = 1;
    if (k.mode === 'win') { overlayWin(); }
    ctx.restore(); k.perf = (k.perf || 0) * .9 + (performance.now() - _t0) * .1;
  }
  window.__game = { cfg: cfg, k: k, state: function () { return k.S; } };
  k.intro(); raf = requestAnimationFrame(frame);
  return k;
};
