/* GẤU MẸ VÀ GẤU CON: game TẬP ĐI XE ĐẠP (giữ thăng bằng).
   Xe của Gấu Con nghiêng trái phải. Chạm bên TRÁI hoặc PHẢI màn hình để Gấu Mẹ đỡ xe, thả tay để Gấu Con tự đạp.
   Gấu Con càng được tự đạp lúc an toàn thì càng tự tin (thanh Tự tin), nhưng nếu thả sai lúc thì ngã.
   Không có câu hỏi: kết quả lấy từ cách bạn đỡ (đỡ nhiều hay ít, đỡ sớm hay muộn, đỡ liên tục hay chạm lia lịa). */
window.runGame = function (cfg, H) {
  var DUR = 45, A = 6.8, U = 15, bear;
  function drawChar(c, img, x, feetY, dh, sc) { if (!img.complete) { return; } var dw = dh * 120 / 126; c.save(); c.translate(x, feetY); c.scale(sc, sc); c.drawImage(img, -dw / 2, -dh * .93, dw, dh); c.restore(); }
  function wheel(c, x, y, r, rot) {
    c.strokeStyle = '#2A2F55'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.lineWidth = 1.5; c.strokeStyle = '#8A90B8';
    for (var i = 0; i < 4; i++) { var a = rot + i * Math.PI / 4; c.beginPath(); c.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.stroke(); }
  }
  function cub(c, rot, down) {
    wheel(c, -28, -18, 18, rot); wheel(c, 28, -18, 18, rot);
    c.strokeStyle = '#FF7C92'; c.lineWidth = 4.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-28, -18); c.lineTo(-6, -46); c.lineTo(18, -46); c.lineTo(28, -18); c.moveTo(-6, -46); c.lineTo(2, -18); c.lineTo(28, -18); c.stroke();
    c.strokeStyle = '#2A2F55'; c.lineWidth = 3; c.beginPath(); c.moveTo(18, -46); c.lineTo(22, -62); c.lineTo(32, -62); c.stroke(); c.fillStyle = '#2A2F55'; k_rr(c, -16, -54, 20, 6, 3);
    var px = Math.cos(rot * 2) * 6, py = Math.sin(rot * 2) * 6;
    c.strokeStyle = '#8A5A3A'; c.lineWidth = 5; c.beginPath(); c.moveTo(-4, -56); c.lineTo(2 + px, -22 + py); c.stroke();
    c.fillStyle = '#FFD36E'; c.beginPath(); c.ellipse(-6, -66, 11, 14, 0, 0, 7); c.fill();
    c.strokeStyle = '#8A5A3A'; c.lineWidth = 5; c.beginPath(); c.moveTo(-2, -70); c.lineTo(26, -64); c.stroke();
    c.fillStyle = '#B27A4E'; c.beginPath(); c.arc(-2, -88, 14, 0, 7); c.arc(-12, -99, 5.5, 0, 7); c.arc(8, -99, 5.5, 0, 7); c.fill();
    c.fillStyle = '#E8B98A'; c.beginPath(); c.ellipse(2, -85, 7, 5.5, 0, 0, 7); c.fill();
    c.fillStyle = '#14213D'; c.beginPath(); c.arc(-5, -91, 1.9, 0, 7); c.arc(5, -91, 1.9, 0, 7); c.fill();
    c.strokeStyle = '#14213D'; c.lineWidth = 1.6; c.beginPath();
    if (down) { c.arc(0, -78, 4, 1.15 * Math.PI, 1.85 * Math.PI); } else { c.arc(0, -84, 4, .15 * Math.PI, .85 * Math.PI); } c.stroke();
    c.fillStyle = '#FF7C92'; c.beginPath(); c.moveTo(-10, -100); c.lineTo(10, -100); c.lineTo(8, -104); c.lineTo(-8, -104); c.fill();
  }
  function k_rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fill(); }
  var def = {
    sub: 'Gấu Con đang tập đi xe đạp. Bạn là Gấu Mẹ chạy phía sau, và chỉ bạn quyết định đỡ hay thả.',
    how: 'Xe nghiêng bên nào thì <b>chạm phía đối diện</b> để đẩy lại. <b>Thả tay</b> để Gấu Con tự đạp, thanh <b>Tự tin</b> sẽ lớn dần. Thả sai lúc thì Gấu Con ngã. Giữ xe đi đủ <b>45 giây</b>.',
    init: function (k) { bear = bear || k.charImg('bear'); k.S = { t: 0, th: .05, w: 0, sk: .28, falls: 0, fallT: 0, fallSide: 1, assist: 0, early: 0, presses: 0, holdSince: 0, lastU: 0, rev: 0, dist: 0, mx: 70, u: 0, safeT: 0, msg: '', msgT: 0 }; },
    begin: function (k) { k.legend('Xe nghiêng <b>phải</b> thì chạm <b>trái</b>, nghiêng trái thì chạm phải. Thả tay để Gấu Con tự đạp.'); },
    down: function (k) { var S = k.S; S.presses++; },
    update: function (k, dt) {
      var S = k.S;
      if (k.mode === 'intro') { S.t += dt; S.th = Math.sin(k.T * 1.5) * .09; S.dist += 40 * dt; return; }
      if (k.mode !== 'play') { return; }
      S.t += dt; k.progress(1 - S.t / DUR); if (S.msgT > 0) { S.msgT -= dt; }
      var u = 0;
      if (S.fallT > 0) { S.fallT -= dt; if (S.fallT <= 0) { S.th = 0; S.w = 0; S.msg = ''; } }
      else {
        if (k.ptr.down) { u = k.ptr.x < k.W / 2 ? -1 : 1; }
        if (u !== 0) { S.assist += dt; if (Math.abs(S.th) < .22) { S.early += dt; } if (S.lastU !== 0 && u !== S.lastU) { S.rev++; } }
        if (u !== 0) { S.lastU = u; }
        S.u = u;
        for (var i = 0; i < 2; i++) {
          var h = dt / 2, n = Math.sin(S.t * 1.7) * .9 + Math.sin(S.t * 3.1 + 1) * .6;
          var al = A * S.th + n * 1.4 - S.sk * (9 * S.th + 2.4 * S.w) + u * U;
          S.w += al * h; S.th += S.w * h;
        }
        S.dist += 70 * dt;
        if (u === 0 && Math.abs(S.th) < .5) { S.sk = Math.min(1, S.sk + .019 * dt); S.safeT += dt; } else if (u !== 0) { S.sk = Math.min(1, S.sk + .002 * dt); }
        if (Math.abs(S.th) > .95) {
          S.falls++; S.fallT = 1.3; S.fallSide = S.th > 0 ? 1 : -1; S.sk = Math.min(1, S.sk + .02); S.msg = 'Ui da!'; S.msgT = 1.3;
          k.pop(180, k.groundY - 150, 'Ui da!', '#FFB3B3'); k.beep(150, .25, 'sawtooth', .06); k.burst(180, k.groundY - 10, '#E9D3A8', 10, 140);
        }
      }
      S.mx += ((u !== 0 ? 118 : 70) - S.mx) * Math.min(1, dt * 6);
      if (S.t >= DUR) {
        var T = DUR, a = S.assist / T, early = S.early / Math.max(.1, S.assist), rate = S.presses / T, hold = S.assist / Math.max(1, S.presses), key;
        if (a < .08) { key = 'K'; } else if (rate > 1.4 && hold < .45) { key = 'B'; } else if (a > .45) { key = 'D'; } else { key = 'H'; }
        k.end(key, 'Bạn đỡ xe <b>' + Math.round(a * 100) + '%</b> thời gian (<b>' + Math.round(early * 100) + '%</b> là lúc xe còn vững), chạm <b>' + S.presses + '</b> lần, Gấu Con ngã <b>' + S.falls + '</b> lần và cuối cùng tự tin <b>' + Math.round(S.sk * 100) + '%</b>.');
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, gy = k.groundY, S = k.S, bx = 215, d = S.dist;
      var g = c.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, '#8FD3F4'); g.addColorStop(1, '#FFF1DC'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      var gs = c.createRadialGradient(290, 120, 6, 290, 120, 60); gs.addColorStop(0, 'rgba(255,245,200,.95)'); gs.addColorStop(1, 'rgba(255,215,150,0)'); c.fillStyle = gs; c.beginPath(); c.arc(290, 120, 60, 0, 7); c.fill(); c.fillStyle = '#FFF6DA'; c.beginPath(); c.arc(290, 120, 18, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.85)'; for (var i = 0; i < 4; i++) { var cx = ((i * 150 - d * .08) % (W + 160) + W + 160) % (W + 160) - 60, cy = 150 + (i % 2) * 40; c.beginPath(); c.ellipse(cx, cy, 34, 12, 0, 0, 7); c.ellipse(cx + 20, cy - 8, 22, 12, 0, 0, 7); c.fill(); }
      c.fillStyle = '#B9DDA0'; c.beginPath(); c.moveTo(0, gy - 70); for (var x = 0; x <= W; x += 20) { c.lineTo(x, gy - 90 - Math.sin(x / 60 + d * .0012) * 18); } c.lineTo(W, gy); c.lineTo(0, gy); c.fill();
      for (var t = 0; t < 5; t++) { var tx = ((t * 120 - d * .5) % (W + 140) + W + 140) % (W + 140) - 40; c.fillStyle = '#8A5A3A'; c.fillRect(tx - 4, gy - 80, 8, 50); c.fillStyle = '#6FB86A'; c.beginPath(); c.arc(tx, gy - 92, 26, 0, 7); c.fill(); }
      c.fillStyle = '#7FB36E'; c.fillRect(0, gy - 30, W, 40); c.fillStyle = '#D9C7A0'; c.fillRect(0, gy - 8, W, HH); c.fillStyle = '#C9B48A'; c.fillRect(0, gy - 8, W, 4);
      c.fillStyle = 'rgba(255,255,255,.7)'; for (var m = 0; m < 8; m++) { var mx = ((m * 70 - d) % (W + 70) + W + 70) % (W + 70) - 40; c.fillRect(mx, gy + 28, 36, 5); }
      /* Gấu Mẹ */
      var run = Math.sin(k.T * 9) * 3; c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(S.mx, gy + 12, 34, 6, 0, 0, 7); c.fill(); drawChar(c, bear, S.mx, gy + 12 + (S.u !== 0 ? 0 : run * .5), 120, 1);
      /* Gấu Con + xe */
      c.save(); c.translate(bx, gy + 10);
      if (S.fallT > 0) { var f = 1 - Math.max(0, S.fallT) / 1.3; c.rotate(S.fallSide * Math.min(1.45, 1.05 + f * .5)); c.translate(0, 8); }
      else { c.rotate(S.th); }
      cub(c, d * .06, S.fallT > 0); c.restore();
      if (S.u !== 0 && S.fallT <= 0) { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 4; c.lineCap = 'round'; var hx = bx + S.u * -60; c.beginPath(); c.moveTo(hx - S.u * 16, gy - 60); c.lineTo(hx + S.u * 8, gy - 60); c.stroke(); c.beginPath(); c.moveTo(hx + S.u * 8 - S.u * 7, gy - 68); c.lineTo(hx + S.u * 8, gy - 60); c.lineTo(hx + S.u * 8 - S.u * 7, gy - 52); c.stroke(); }
      if (k.mode === 'play') {
        /* thanh Tự tin */
        var bw = 210, bxx = 20, byy = 70; c.fillStyle = 'rgba(0,0,0,.28)'; k_rr2(c, bxx - 6, byy - 20, bw + 12, 40, 10); c.fillStyle = '#fff'; c.font = '700 11.5px "Be Vietnam Pro", system-ui'; c.textAlign = 'left'; c.fillText('Tự tin của Gấu Con', bxx, byy - 6);
        c.fillStyle = 'rgba(255,255,255,.3)'; k.rr(bxx, byy + 2, bw, 10, 5); c.fill(); c.fillStyle = S.sk > .67 ? '#6FD99A' : '#FFD36E'; k.rr(bxx, byy + 2, Math.max(8, bw * S.sk), 10, 5); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; c.beginPath(); c.moveTo(bxx + bw * .67, byy); c.lineTo(bxx + bw * .67, byy + 14); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.18)'; k.rr(0, gy - 150, 56, 180, 0); c.fill(); k.rr(W - 56, gy - 150, 56, 180, 0); c.fill();
        c.fillStyle = 'rgba(255,255,255,.85)'; c.font = '800 24px "Baloo 2", system-ui'; c.textAlign = 'center'; c.fillText('←', 28, gy - 56); c.fillText('→', W - 28, gy - 56);
      }
    },
    winChar: function (k, cx, cy, sc) { drawChar(k.ctx, bear, cx, cy + 44, 112, Math.max(.01, sc)); }
  };
  function k_rr2(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fill(); }
  window.GameKit(cfg, H, def);
};
