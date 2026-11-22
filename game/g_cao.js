/* CÁO CON Ở CHỢ PHIÊN: game HỨNG ĐỒ. Không có câu hỏi nào.
   Đồ rơi nhanh nên không hứng hết được; bạn buộc phải chọn hứng món nào, và chính lựa chọn đó cho ra nhóm Holland. */
window.runGame = function (cfg, H) {
  var COL = { R: '#E58A3A', I: '#5CA8E6', A: '#F08AB0', S: '#F0707A', E: '#F5B82E', C: '#6FA7A0' };
  var KEYS = ['R', 'I', 'A', 'S', 'E', 'C'], DUR = 32, fox;

  function icon(c, t, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (t === 'R') { c.rotate(-.6); c.fillStyle = '#9C6B3A'; c.fillRect(-2.2, -4, 4.4, 17); c.fillStyle = '#8A93A6'; c.fillRect(-9, -11, 18, 9); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-9, -11, 18, 2.5); }
    else if (t === 'I') { c.strokeStyle = COL.I; c.lineWidth = 3.4; c.beginPath(); c.arc(-2, -3, 8, 0, 7); c.stroke(); c.fillStyle = 'rgba(190,225,255,.6)'; c.beginPath(); c.arc(-2, -3, 6.6, 0, 7); c.fill(); c.strokeStyle = '#6B4F32'; c.lineWidth = 3.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(4, 3); c.lineTo(11, 10); c.stroke(); }
    else if (t === 'A') { c.fillStyle = '#F6D9B8'; c.beginPath(); c.ellipse(0, 0, 12, 9, -.2, 0, 7); c.fill(); [['#F0707A', -5, -2], ['#5CA8E6', 0, -5], ['#F5B82E', 5, -1]].forEach(function (d) { c.fillStyle = d[0]; c.beginPath(); c.arc(d[1], d[2], 2.6, 0, 7); c.fill(); }); c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.arc(4, 5, 2.4, 0, 7); c.fill(); }
    else if (t === 'S') { c.fillStyle = '#FFF4EC'; c.beginPath(); c.moveTo(-9, -5); c.lineTo(9, -5); c.quadraticCurveTo(8, 9, 0, 9); c.quadraticCurveTo(-8, 9, -9, -5); c.fill(); c.strokeStyle = '#FFF4EC'; c.lineWidth = 2.4; c.beginPath(); c.arc(10, 0, 4, -1.4, 1.4); c.stroke(); c.fillStyle = COL.S; c.beginPath(); c.moveTo(0, 5); c.bezierCurveTo(-8, -1, -4, -6, 0, -2); c.bezierCurveTo(4, -6, 8, -1, 0, 5); c.fill(); }
    else if (t === 'E') { c.fillStyle = '#F5B82E'; c.beginPath(); for (var i = 0; i < 10; i++) { var a = Math.PI * i / 5 - Math.PI / 2, r = i % 2 ? 5.4 : 12; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.fill(); c.fillStyle = '#FFE08A'; c.beginPath(); c.arc(0, 0, 3.2, 0, 7); c.fill(); }
    else if (t === 'C') { c.fillStyle = COL.C; c.beginPath(); c.moveTo(-8, -10); c.lineTo(8, -10); c.lineTo(8, 10); c.lineTo(-8, 10); c.fill(); c.fillStyle = '#E5F5F2'; for (var j = 0; j < 4; j++) { c.fillRect(-5, -6 + j * 5, 10, 1.8); } c.fillStyle = '#3F7C75'; c.fillRect(-8, -10, 3, 20); }
    else { c.fillStyle = '#7E8460'; c.beginPath(); c.ellipse(0, 1, 9, 8, 0, 0, 7); c.fill(); c.fillStyle = '#5E6444'; c.beginPath(); c.arc(-3, 0, 2, 0, 7); c.arc(3, 4, 1.6, 0, 7); c.fill(); c.strokeStyle = '#5A4630'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -6); c.lineTo(2, -11); c.stroke(); }
    c.restore();
  }
  function drawChar(c, img, x, feetY, dh, sc) { if (!img.complete) { return; } var dw = dh * 120 / 126; c.save(); c.translate(x, feetY); c.scale(sc, sc); c.drawImage(img, -dw / 2, -dh * .93, dw, dh); c.restore(); }

  var def = {
    sub: 'Chợ phiên sắp đóng cửa. Đồ rơi từ trên xuống, Cáo chỉ kịp hứng vài món thôi.',
    how: 'Vuốt trái phải để Cáo đưa giỏ đi hứng. Hứng món bạn thích, né quả táo hỏng. Chợ đóng sau ' + DUR + ' giây.',
    init: function (k) {
      fox = fox || k.charImg('fox');
      k.S = { px: 180, items: [], spawn: .6, t: 0, stun: 0, last: null, caught: 0, counts: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }, shake: 0 };
    },
    begin: function (k) {
      var h = '', names = { R: 'Đồ nghề', I: 'Kính', A: 'Màu', S: 'Trà', E: 'Sao', C: 'Sổ' };
      KEYS.forEach(function (t) { h += '<span style="--c:' + COL[t] + '"><i></i><b id="tc' + t + '">0</b></span>'; });
      k.el.tally.innerHTML = h; k.el.tally.hidden = false; k.hint('Vuốt để hứng!', 2200);
    },
    update: function (k, dt) {
      var S = k.S; if (k.mode === 'intro') { S.px = 180 + Math.sin(k.T * 1.2) * 60; return; }
      if (k.mode !== 'play') { return; }
      S.t += dt; k.progress(1 - S.t / DUR);
      if (S.stun > 0) { S.stun -= dt; } else { S.px += (k.ptr.x - S.px) * Math.min(1, dt * 11); }
      S.px = Math.max(34, Math.min(326, S.px)); if (S.shake > 0) { S.shake -= dt; }
      S.spawn -= dt;
      if (S.spawn <= 0) {
        var rot = Math.random() < .13, t = rot ? 'X' : KEYS[Math.floor(Math.random() * 6)];
        S.items.push({ x: 28 + Math.random() * 304, y: -18, vy: 120 + S.t * 3.2 + Math.random() * 50, t: t, rot: Math.random() * 6, sp: (Math.random() - .5) * 3 });
        S.spawn = Math.max(.34, .78 - S.t * .014);
      }
      var gy = k.groundY;
      S.items.forEach(function (it) {
        it.y += it.vy * dt; it.rot += it.sp * dt;
        if (!it.done && it.y >= gy - 58 && it.y < gy - 16 && Math.abs(it.x - S.px) < 38) {
          it.done = true;
          if (it.t === 'X') { S.stun = .7; S.shake = .4; k.pop(S.px, gy - 118, 'Ối!', '#C9C98A'); k.beep(140, .2, 'sawtooth', .05); }
          else { S.counts[it.t]++; S.last = it.t; S.caught++; var el = document.getElementById('tc' + it.t); if (el) { el.textContent = S.counts[it.t]; } k.burst(it.x, gy - 52, COL[it.t], 6, 120); k.pop(S.px, gy - 118, '+1', COL[it.t]); k.beep(600 + KEYS.indexOf(it.t) * 90, .07, 'triangle', .05); }
        }
        if (it.y > gy + 10) { it.done = true; }
      });
      S.items = S.items.filter(function (it) { return !it.done && it.y < gy + 20; });
      if (S.t >= DUR) {
        var best = null, max = -1; KEYS.forEach(function (t) { if (S.counts[t] > max || (S.counts[t] === max && t === S.last)) { max = S.counts[t]; best = t; } });
        k.end(best, 'Cáo hứng được ' + S.caught + ' món.');
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, gy = k.groundY, S = k.S;
      var g = c.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, '#8FD0F0'); g.addColorStop(1, '#FFF0D4'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      c.fillStyle = 'rgba(255,255,255,.55)'; [[60, 90, 1], [250, 130, 1.2], [160, 60, .8]].forEach(function (p) { c.beginPath(); c.arc(p[0], p[1], 13 * p[2], 0, 7); c.arc(p[0] + 16 * p[2], p[1] - 5, 16 * p[2], 0, 7); c.arc(p[0] + 32 * p[2], p[1], 12 * p[2], 0, 7); c.fill(); });
      /* dãy quầy hàng phía sau */
      var sy = gy - 150, cols = ['#E85D5D', '#FFF4EC'];
      for (var i = 0; i < 6; i++) { c.fillStyle = cols[i % 2]; var x0 = i * 60; c.beginPath(); c.moveTo(x0, sy); c.lineTo(x0 + 60, sy); c.lineTo(x0 + 60, sy + 26); c.arc(x0 + 30, sy + 26, 30, 0, Math.PI); c.closePath(); c.fill(); }
      c.fillStyle = '#B9803F'; c.fillRect(0, sy + 52, W, gy - sy - 52); c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(0, sy + 52, W, 8);
      for (var j = 0; j < 6; j++) { c.fillStyle = ['#F2C14E', '#F08AB0', '#6FB8F2'][j % 3]; c.beginPath(); c.arc(j * 60 + 30, sy + 78, 7, 0, 7); c.arc(j * 60 + 44, sy + 84, 5, 0, 7); c.fill(); }
      c.strokeStyle = '#7A4E22'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, 40); c.quadraticCurveTo(W / 2, 80, W, 40); c.stroke();
      ['#F0707A', '#F5B82E', '#6FB8F2', '#8FD3A0', '#F08AB0', '#B79CE8', '#F0707A', '#F5B82E'].forEach(function (cc, n) { var u = (n + .5) / 8, bx = u * W, by = 40 + Math.sin(u * Math.PI) * 24; c.fillStyle = cc; c.beginPath(); c.moveTo(bx - 8, by); c.lineTo(bx + 8, by); c.lineTo(bx, by + 17); c.fill(); });
      c.fillStyle = '#D9B98A'; c.fillRect(0, gy, W, HH); c.fillStyle = '#C9A878'; for (var t = 0; t < 8; t++) { c.fillRect(t * 50 + 6, gy + 16 + (t % 2) * 24, 30, 5); }
      /* đồ rơi */
      if (S.items) { S.items.forEach(function (it) { c.save(); c.translate(it.x, it.y); c.rotate(Math.sin(it.rot) * .5); icon(c, it.t, 0, 0, 1.35); c.restore(); }); }
      /* Cáo + giỏ */
      var px = S.px || 180, sh = S.shake > 0 ? Math.sin(k.T * 60) * 3 : 0;
      c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(px, gy + 3, 26, 5, 0, 0, 7); c.fill();
      drawChar(c, fox, px + sh, gy, 112, 1 + (k.mode === 'play' ? Math.sin(k.T * 10) * .015 : 0));
      c.fillStyle = '#A9743A'; c.beginPath(); c.moveTo(px - 36, gy - 48); c.lineTo(px + 36, gy - 48); c.lineTo(px + 28, gy - 14); c.quadraticCurveTo(px, gy - 6, px - 28, gy - 14); c.closePath(); c.fill();
      c.strokeStyle = '#7A4E22'; c.lineWidth = 2; for (var q = -3; q <= 3; q++) { c.beginPath(); c.moveTo(px + q * 9, gy - 46); c.lineTo(px + q * 7, gy - 12); c.stroke(); }
      c.fillStyle = '#C48E50'; c.fillRect(px - 38, gy - 52, 76, 7);
    },
    winChar: function (k, cx, cy, sc) { drawChar(k.ctx, fox, cx, cy + 40, 96, Math.max(.01, sc)); }
  };
  window.GameKit(cfg, H, def);
};
