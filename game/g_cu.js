/* CÚ MÈO ĐÊM ÔN THI: game BAY QUA CỔNG SÁCH (kiểu Flappy).
   Mỗi cổng là một tình huống ôn thi, có 3 ô cách nhau bởi tường sách, mỗi ô ghi một cách học.
   Cú chỉ chui qua được MỘT ô, nên bạn phải chọn: ô nào giống cách học của mình? Vị trí các ô được xáo mỗi cổng.
   10 cổng = 10 lựa chọn, kiểu học nào được chọn nhiều nhất là kết quả. */
window.runGame = function (cfg, H) {
  var COL = { T: '#8FA8FF', V: '#F2C14E', M: '#6FCF97' }, KEYS = ['T', 'V', 'M'], GOAL = 10, NAME = { T: 'Nghe', V: 'Nhìn', M: 'Làm' }, KIND = { T: 'Cú Thính Giác (học bằng tai)', V: 'Cú Thị Giác (học bằng mắt)', M: 'Cú Vận Động (học bằng tay chân)' }, owl;
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
  var QB = [
    ['Đêm trước kỳ thi, Cú bắt đầu ôn thế nào?', ['V', 'Vẽ sơ đồ'], ['T', 'Đọc to lên'], ['M', 'Vừa đi vừa nhẩm']],
    ['Cú cần nhớ 10 thuật ngữ mới.', ['V', 'Hình dung thành tranh'], ['T', 'Biến thành bài vè'], ['M', 'Viết thẻ, xếp đi xếp lại']],
    ['Bạn Sẻ nhờ Cú giảng một bài khó.', ['V', 'Vẽ cho bạn xem'], ['T', 'Giảng bằng lời'], ['M', 'Làm thử ví dụ']],
    ['Có tiếng nhạc ngoài cửa sổ.', ['T', 'Bật nhạc nhẹ'], ['V', 'Dọn bàn cho gọn'], ['M', 'Đứng dậy học']],
    ['Cú muốn tự kiểm tra bài.', ['V', 'Nhớ lại sơ đồ'], ['T', 'Tự hỏi tự đáp'], ['M', 'Làm đề, tự chấm']],
    ['Sáng ngày thi, Cú hồi hộp.', ['M', 'Đi bộ, hít thở'], ['T', 'Nhẩm lại bài'], ['V', 'Liếc sơ đồ lần cuối']],
    ['Cú học từ vựng mới.', ['V', 'Dán note màu'], ['T', 'Nghe đọc lại'], ['M', 'Chơi thẻ từ']],
    ['Cú chuẩn bị thuyết trình.', ['V', 'Làm slide đẹp'], ['T', 'Tập nói to'], ['M', 'Đứng lên diễn thử']],
    ['Cú xem một hướng dẫn mới.', ['V', 'Xem hình minh họa'], ['T', 'Nghe người giảng'], ['M', 'Tự làm thử luôn']],
    ['Làm bài thi, Cú cố nhớ lại kiến thức.', ['V', 'Nhớ trang sách'], ['T', 'Nhớ giọng cô giảng'], ['M', 'Nhớ lúc từng làm']]
  ], OH = 84, SP = 122;
  function shuffle(a) { return a.slice().sort(function () { return Math.random() - .5; }); }
  function wrap2(c, txt, w) {
    if (c.measureText(txt).width <= w) { return [txt]; } var wd = txt.split(' '), best = [txt], bd = 1e9;
    for (var i = 1; i < wd.length; i++) { var a = wd.slice(0, i).join(' '), b = wd.slice(i).join(' '), d = Math.max(c.measureText(a).width, c.measureText(b).width); if (d < bd) { bd = d; best = [a, b]; } }
    return best;
  }
  var def = {
    sub: 'Đêm trước kỳ thi, Cú Mèo bay qua thư viện. Mỗi cổng sách là một tình huống, bạn chọn cách học thay Cú.',
    how: 'Chạm để vỗ cánh. Mỗi cổng có <b>3 ô</b>, mỗi ô ghi một cách học. Cú chỉ chui qua được <b>một ô</b>, hãy bay vào ô <b>giống bạn nhất</b>. Trả lời <b>10 cổng</b>.',
    init: function (k) { owl = owl || k.charImg('owl'); k.S = { y: k.HH * .4, vy: 0, t: 0, obs: [], dist: 0, nextX: 0, gapY: 330, inv: 0, slow: 0, last: null, got: 0, spawned: 0, counts: { T: 0, V: 0, M: 0 }, qs: shuffle(QB), seed: 1 }; },
    begin: function (k) { k.el.tally.innerHTML = KEYS.map(function (t) { return '<span style="--c:' + COL[t] + '"><i></i><b id="tc' + t + '">0</b></span>'; }).join(''); k.el.tally.hidden = false; k.legend('Bay vào <b>ô giống bạn nhất</b>. Có 10 cổng.'); k.S.vy = -200; },
    down: function (k) { if (k.S) { k.S.vy = -240; k.beep(560, .06, 'square', .025); } },
    update: function (k, dt) {
      var S = k.S, W = k.W, gy = k.groundY;
      if (k.mode === 'intro') { S.y = k.HH * .4 + Math.sin(k.T * 2) * 18; return; }
      if (k.mode !== 'play') { return; }
      S.t += dt; k.progress(1 - S.got / GOAL);
      if (S.inv > 0) { S.inv -= dt; } if (S.slow > 0) { S.slow -= dt; }
      var sp = 84 * (S.slow > 0 ? .5 : 1), dx = sp * dt; S.dist += dx;
      S.vy += 640 * dt; S.y += S.vy * dt;
      if (S.y < 30) { S.y = 30; S.vy = 0; } if (S.y > gy - 14) { S.y = gy - 14; S.vy = -190; }
      S.nextX -= dx;
      if (S.nextX <= 0 && S.spawned < GOAL) {
        var lo = 140 + SP + OH / 2, hi = gy - 24 - SP - OH / 2; S.gapY = Math.max(lo, Math.min(hi, S.gapY + (Math.random() - .5) * 90));
        var q = S.qs[S.spawned % S.qs.length], ord = shuffle([q[1], q[2], q[3]]);
        S.obs.push({ x: W + (S.spawned === 0 ? 140 : 40), gapY: S.gapY, w: 58, seed: S.seed++, q: q[0], n: S.spawned + 1, done: false, opts: ord.map(function (p, i) { return { t: p[0], s: p[1], dy: (i - 1) * SP }; }) });
        S.spawned++; S.nextX = S.spawned === 1 ? 460 : 360;
      }
      S.obs.forEach(function (o) {
        o.x -= dx; var cx = o.x + o.w / 2;
        if (S.inv <= 0 && Math.abs(cx - 90) < o.w / 2 + 12) {
          var safe = o.opts.some(function (p) { var c0 = o.gapY + p.dy; return S.y - 14 >= c0 - OH / 2 && S.y + 12 <= c0 + OH / 2; });
          if (!safe) { S.inv = 1.2; S.slow = .7; S.vy = 80; k.pop(90, S.y - 30, 'Ối!', '#FFB3B3'); k.beep(150, .18, 'sawtooth', .05); }
        }
        if (!o.done && Math.abs(cx - 90) < 46) {
          var ch = null; o.opts.forEach(function (p) { if (Math.abs(o.gapY + p.dy - S.y) < 30) { ch = p; } });
          if (ch) {
            o.done = true; o.pick = ch; S.got++; S.counts[ch.t]++; S.last = ch.t; var el = document.getElementById('tc' + ch.t); if (el) { el.textContent = S.counts[ch.t]; }
            k.burst(o.x + o.w / 2, o.gapY + ch.dy, COL[ch.t], 14, 170); k.pop(90, S.y - 28, ch.s, COL[ch.t]); k.beep(650 + KEYS.indexOf(ch.t) * 110, .09, 'triangle', .05);
          }
        }
        if (!o.done && cx < 90 - 46) { o.done = true; S.got++; k.pop(90, S.y - 26, 'Cổng này bỏ lỡ', '#FFD0A0'); }
      });
      S.obs = S.obs.filter(function (o) { return o.x > -90; });
      if ((S.got >= GOAL && S.obs.every(function (o) { return o.done; })) || S.t >= 120) {
        var best = null, max = -1; KEYS.forEach(function (t) { if (S.counts[t] > max || (S.counts[t] === max && t === S.last)) { max = S.counts[t]; best = t; } });
        var tot = S.counts.T + S.counts.V + S.counts.M;
        k.end(best, 'Qua ' + tot + ' cổng bạn chọn: <b>Nhìn</b> ' + S.counts.V + ', <b>Nghe</b> ' + S.counts.T + ', <b>Làm</b> ' + S.counts.M + ', nên bạn học tốt nhất kiểu <b>' + KIND[best] + '</b>.');
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, gy = k.groundY, S = k.S;
      var g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0C1633'); g.addColorStop(1, '#2A3A6E'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      c.fillStyle = '#FFF6DC'; k.stars.forEach(function (s) { c.globalAlpha = .4 + .5 * Math.sin(k.T * 2 + s[2]); c.fillRect(s[0], 8 + s[1] * gy * .8, 1.6, 1.6); }); c.globalAlpha = 1;
      c.fillStyle = 'rgba(214,225,255,.18)'; c.beginPath(); c.arc(278, 120, 40, 0, 7); c.fill(); c.fillStyle = '#F4F7FF'; c.beginPath(); c.arc(278, 120, 26, 0, 7); c.fill();
      c.fillStyle = '#16264A'; for (var i = 0; i < 6; i++) { var bx = ((i * 80 - (S.dist || 0) * .2) % (W + 80) + W + 80) % (W + 80) - 40; c.fillRect(bx, gy - 90 - (i % 3) * 26, 46, 140); }
      var cur = null;
      (S.obs || []).forEach(function (o) {
        if (!o.done && !cur) { cur = o; }
        var ti = towerImg(o.seed), ys = o.opts.map(function (p) { var c0 = o.gapY + p.dy; return [c0 - OH / 2, c0 + OH / 2]; });
        if (ys[0][0] > 0) { c.save(); c.translate(o.x, ys[0][0]); c.scale(1, -1); c.drawImage(ti, 0, 0, 116, ys[0][0] * 2, 0, 0, o.w, ys[0][0]); c.restore(); }
        for (var m = 0; m < 2; m++) { var y0 = ys[m][1], hh = ys[m + 1][0] - y0; if (hh > 0) { c.drawImage(ti, 0, 0, 116, hh * 2, o.x, y0, o.w, hh); } }
        var yb = ys[2][1]; if (gy - yb > 0) { c.drawImage(ti, 0, 0, 116, (gy - yb) * 2, o.x, yb, o.w, gy - yb); }
        if (!o.done) { o.opts.forEach(function (p) {
          var cy = o.gapY + p.dy; c.font = '700 11px "Be Vietnam Pro", system-ui'; var ln = wrap2(c, p.s, 86), w = 0; ln.forEach(function (t) { w = Math.max(w, c.measureText(t).width); }); w += 16;
          var hh2 = ln.length * 14 + 8, cx = o.x + o.w / 2; c.fillStyle = COL[p.t]; k.rr(cx - w / 2, cy - hh2 / 2, w, hh2, 10); c.fill(); c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; c.stroke();
          c.fillStyle = '#1B2347'; c.textAlign = 'center'; ln.forEach(function (t, li) { c.fillText(t, cx, cy - (ln.length - 1) * 7 + li * 14 + 4); });
        }); }
      });
      c.fillStyle = '#0E1B36'; c.fillRect(0, gy, W, HH); c.fillStyle = '#26406A'; c.fillRect(0, gy, W, 5);
      if (!(S.inv > 0 && Math.floor(S.inv * 14) % 2)) { drawChar(c, owl, 90, (S.y || 200) + 36, 78, 1, Math.max(-.4, Math.min(.5, (S.vy || 0) / 900))); }
      if (cur && k.mode === 'play') {
        c.fillStyle = 'rgba(10,18,48,.88)'; k.rr(12, 84, 336, 50, 14); c.fill(); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1.5; c.stroke();
        c.font = '800 12px "Baloo 2", system-ui'; c.fillStyle = '#FFD36E'; c.textAlign = 'left'; c.fillText('Cổng ' + cur.n + '/' + GOAL, 24, 103);
        c.font = '600 13.5px "Be Vietnam Pro", system-ui'; c.fillStyle = '#fff'; var qq = wrap2(c, cur.q, 300); qq.forEach(function (t, li) { c.fillText(t, 24, 120 + li * 0 + (qq.length > 1 ? li * 15 - 6 : 0)); });
      }
    },
    winChar: function (k, cx, cy, sc) { drawChar(k.ctx, owl, cx, cy + 40, 100, Math.max(.01, sc), 0); }
  };
  window.GameKit(cfg, H, def);
};
