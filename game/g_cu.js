/* CÚ MÈO ĐÊM ÔN THI: game BAY QUA KHE SÁCH (kiểu Flappy). Không có câu hỏi nào.
   Mỗi khe có 3 món ở 3 độ cao khác nhau: nốt nhạc (tai), ngôi sao (mắt), bánh răng (tay chân).
   Bạn chọn món nào bằng cách bay lên cao hay xuống thấp, và món nhặt nhiều nhất cho ra kiểu học. */
window.runGame = function (cfg, H) {
  var COL = { T: '#8FA8FF', V: '#F2C14E', M: '#6FCF97' }, KEYS = ['T', 'V', 'M'], GOAL = 12, NAME = { T: 'Nghe', V: 'Nhìn', M: 'Làm' }, KIND = { T: 'Cú Thính Giác (học bằng tai)', V: 'Cú Thị Giác (học bằng mắt)', M: 'Cú Vận Động (học bằng tay chân)' }, owl;
  function icon(c, t, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(0, 0, 16, 0, 7); c.fill();
    if (t === 'T') { c.fillStyle = COL.T; c.beginPath(); c.ellipse(-3, 6, 5.5, 4.2, -.4, 0, 7); c.fill(); c.fillRect(1.6, -9, 2.6, 15); c.beginPath(); c.moveTo(4, -9); c.quadraticCurveTo(11, -6, 9, 1); c.lineTo(4, -4); c.fill(); }
    else if (t === 'V') { c.fillStyle = COL.V; c.beginPath(); for (var i = 0; i < 10; i++) { var a = Math.PI * i / 5 - Math.PI / 2, r = i % 2 ? 5.4 : 12.5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.fill(); c.fillStyle = '#FFF3C4'; c.beginPath(); c.arc(0, 0, 3, 0, 7); c.fill(); }
    else { c.fillStyle = COL.M; for (var j = 0; j < 8; j++) { c.save(); c.rotate(j * Math.PI / 4); c.fillRect(-2.6, -12.5, 5.2, 7); c.restore(); } c.beginPath(); c.arc(0, 0, 8.6, 0, 7); c.fill(); c.fillStyle = '#143A28'; c.beginPath(); c.arc(0, 0, 3.4, 0, 7); c.fill(); }
    c.restore();
  }
  function drawChar(c, img, x, feetY, dh, sc, rot) { if (!img.complete) { return; } var dw = dh * 120 / 126; c.save(); c.translate(x, feetY); c.rotate(rot || 0); c.scale(sc, sc); c.drawImage(img, -dw / 2, -dh * .93, dw, dh); c.restore(); }
  var TC = {};
  function towerImg(seed) {
    var key = seed % 5; if (TC[key]) { return TC[key]; }
    var cv = document.createElement('canvas'); cv.width = 116; cv.height = 1500; var c = cv.getContext('2d'), cols = ['#C75B5B', '#4F7FD1', '#E0B24A', '#5FAE8A', '#9A6BC9'], y = 0, i = 0;
    while (y < 1500) { var h = 32 + ((key * 7 + i * 5) % 3) * 8, off = ((key + i) % 3) * 4; c.fillStyle = cols[(key + i) % 5]; c.fillRect(off, y, 116 - off, h - 3); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(off + 16, y + h / 2 - 3, 116 - off - 40, 5); y += h; i++; }
    TC[key] = cv; return cv;
  }
  var def = {
    sub: 'Đêm trước kỳ thi, Cú Mèo bay qua thư viện để gom 12 món giúp mình nhớ bài.',
    how: 'Chạm để vỗ cánh, bay qua khe giữa các chồng sách. Mỗi khe có 3 tầng: <b>trên = Nghe</b>, <b>giữa = Nhìn</b>, <b>dưới = Làm</b>. Hãy gom <b>12 món</b> theo cách bạn học dễ nhớ nhất.',
    init: function (k) { owl = owl || k.charImg('owl'); k.S = { y: k.HH * .4, vy: 0, t: 0, obs: [], dist: 0, nextX: 0, gapY: k.HH * .4, inv: 0, slow: 0, last: null, got: 0, counts: { T: 0, V: 0, M: 0 }, seed: 1 }; },
    begin: function (k) { k.el.tally.innerHTML = KEYS.map(function (t) { return '<span style="--c:' + COL[t] + '"><i></i><b id="tc' + t + '">0</b></span>'; }).join(''); k.el.tally.hidden = false; k.legend('Tầng trên <b>Nghe</b> · giữa <b>Nhìn</b> · dưới <b>Làm</b>. Gom 12 món.'); k.S.vy = -200; },
    down: function (k) { if (k.S) { k.S.vy = -240; k.beep(560, .06, 'square', .025); } },
    update: function (k, dt) {
      var S = k.S, W = k.W, gy = k.groundY;
      if (k.mode === 'intro') { S.y = k.HH * .4 + Math.sin(k.T * 2) * 18; return; }
      if (k.mode !== 'play') { return; }
      S.t += dt; k.progress(1 - S.got / GOAL);
      if (S.inv > 0) { S.inv -= dt; } if (S.slow > 0) { S.slow -= dt; }
      var sp = 96 * (S.slow > 0 ? .5 : 1), dx = sp * dt; S.dist += dx;
      S.vy += 640 * dt; S.y += S.vy * dt;
      if (S.y < 30) { S.y = 30; S.vy = 0; } if (S.y > gy - 14) { S.y = gy - 14; S.vy = -190; }
      S.nextX -= dx;
      if (S.nextX <= 0) {
        var gh = 250, lo = 96 + gh / 2, hi = gy - 40 - gh / 2; S.gapY = Math.max(lo, Math.min(hi, S.gapY + (Math.random() - .5) * 150));
                S.obs.push({ x: W + 40, gapY: S.gapY, gh: gh, w: 58, seed: S.seed++, items: [{ t: 'T', dy: -72, got: false }, { t: 'V', dy: 0, got: false }, { t: 'M', dy: 72, got: false }] });
        S.nextX = 240;
      }
      S.obs.forEach(function (o) {
        o.x -= dx;
        if (S.inv <= 0 && Math.abs(o.x + o.w / 2 - 90) < o.w / 2 + 12) {
          if (S.y - 14 < o.gapY - o.gh / 2 || S.y + 12 > o.gapY + o.gh / 2) { S.inv = 1.2; S.slow = .7; S.vy = 80; k.pop(90, S.y - 30, 'Ối!', '#FFB3B3'); k.beep(150, .18, 'sawtooth', .05); }
        }
        o.items.forEach(function (it) {
          if (!it.got && Math.abs(o.x + o.w / 2 - 90) < 24 && Math.abs(o.gapY + it.dy - S.y) < 26) {
            it.got = true; S.counts[it.t]++; S.last = it.t; S.got++; var el = document.getElementById('tc' + it.t); if (el) { el.textContent = S.counts[it.t]; }
            k.burst(90, S.y, COL[it.t], 8, 140); k.pop(90, S.y - 22, '+1', COL[it.t]); k.beep(650 + KEYS.indexOf(it.t) * 110, .08, 'triangle', .05);
          }
        });
      });
      S.obs = S.obs.filter(function (o) { return o.x > -90; });
      if (S.got >= GOAL || S.t >= 90) {
        var best = null, max = -1; KEYS.forEach(function (t) { if (S.counts[t] > max || (S.counts[t] === max && t === S.last)) { max = S.counts[t]; best = t; } });
        k.end(best, 'Bạn gom nhiều nhất tầng <b>' + NAME[best] + '</b> (' + max + '/' + S.got + ' món), nên bạn học tốt nhất kiểu <b>' + KIND[best] + '</b>.');
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, gy = k.groundY, S = k.S;
      var g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0C1633'); g.addColorStop(1, '#2A3A6E'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      c.fillStyle = '#FFF6DC'; k.stars.forEach(function (s) { c.globalAlpha = .4 + .5 * Math.sin(k.T * 2 + s[2]); c.fillRect(s[0], 8 + s[1] * gy * .8, 1.6, 1.6); }); c.globalAlpha = 1;
      c.fillStyle = 'rgba(214,225,255,.18)'; c.beginPath(); c.arc(278, 120, 40, 0, 7); c.fill(); c.fillStyle = '#F4F7FF'; c.beginPath(); c.arc(278, 120, 26, 0, 7); c.fill();
      c.fillStyle = '#16264A'; for (var i = 0; i < 6; i++) { var bx = ((i * 80 - (S.dist || 0) * .2) % (W + 80) + W + 80) % (W + 80) - 40; c.fillRect(bx, gy - 90 - (i % 3) * 26, 46, 140); }
      (S.obs || []).forEach(function (o) {
        var ti = towerImg(o.seed), L1 = o.gapY - o.gh / 2, L2 = gy - (o.gapY + o.gh / 2);
        if (L1 > 0) { c.save(); c.translate(o.x, L1); c.scale(1, -1); c.drawImage(ti, 0, 0, 116, L1 * 2, 0, 0, o.w, L1); c.restore(); }
        if (L2 > 0) { c.drawImage(ti, 0, 0, 116, L2 * 2, o.x, o.gapY + o.gh / 2, o.w, L2); }
        o.items.forEach(function (it) { if (!it.got) { icon(c, it.t, o.x + o.w / 2, o.gapY + it.dy + Math.sin(k.T * 4 + it.dy) * 2, 1.25); c.font = '700 10px "Be Vietnam Pro", system-ui'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText(NAME[it.t], o.x + o.w / 2, o.gapY + it.dy + 29); } });
      });
      c.fillStyle = '#0E1B36'; c.fillRect(0, gy, W, HH); c.fillStyle = '#26406A'; c.fillRect(0, gy, W, 5);
      if (!(S.inv > 0 && Math.floor(S.inv * 14) % 2)) { drawChar(c, owl, 90, (S.y || 200) + 36, 78, 1, Math.max(-.4, Math.min(.5, (S.vy || 0) / 900))); }
    },
    winChar: function (k, cx, cy, sc) { drawChar(k.ctx, owl, cx, cy + 40, 100, Math.max(.01, sc), 0); }
  };
  window.GameKit(cfg, H, def);
};
