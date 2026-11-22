/* GẤU MẸ VÀ GẤU CON: game THẢ DIỀU. Không có câu hỏi.
   Giữ ngón tay để kéo dây về, thả ra để dây thả dài. Gió đổi liên tục.
   Dây căng quá thì đứt, chùng quá thì diều rơi. Cách bạn cầm dây là kết quả. */
window.runGame = function (cfg, H) {
  var DUR = 40, SMAX = 320, bear;
  function drawChar(c, img, x, feetY, dh, sc) { if (!img.complete) { return; } var dw = dh * 120 / 126; c.save(); c.translate(x, feetY); c.scale(sc, sc); c.drawImage(img, -dw / 2, -dh * .93, dw, dh); c.restore(); }
  function windAt(t, S) { return Math.max(0, Math.min(1, .5 + Math.sin(t * .8) * .22 + Math.sin(t * 2.1 + 1) * .12 + S.gust)); }
  var def = {
    sub: 'Gấu Con là chiếc diều. Bạn là Gấu Mẹ giữ dây, và gió hôm nay đổi liên tục.',
    how: '<b>Giữ</b> ngón tay để kéo dây về, <b>thả</b> để dây dài ra. Gió mạnh thì dây cần dài hơn. Giữ vạch dây trong <b>vùng xanh</b> để diều bay cao và nhặt được sao. Dây căng quá sẽ đứt, chùng quá diều sẽ rơi.',
    init: function (k) { bear = bear || k.charImg('bear'); k.S = { t: 0, s: 150, gust: 0, gustT: 5, stars: [], spawn: 1, joy: 0, sumDelta: 0, tightT: 0, looseT: 0, inT: 0, toggles: 0, lastHold: false, lastToggle: -1, tens: 0, sag: 0, snapT: 0, fallT: 0, kx: 200, ky: 300, hold: 0, tail: 0 }; },
    begin: function (k) { k.legend('<b>Giữ</b> = kéo dây về · <b>Thả</b> = dây dài ra. Giữ vạch trong <b>vùng xanh</b>.'); },
    update: function (k, dt) {
      var S = k.S, hx = 70, hy = k.groundY - 66;
      var w = windAt(S.t, S), D = SMAX * (.34 + .56 * w);
      if (k.mode === 'intro') { S.t += dt; S.s = 170 + Math.sin(k.T) * 20; D = SMAX * (.34 + .56 * windAt(S.t, S)); }
      if (k.mode === 'play') {
        S.t += dt; k.progress(1 - S.t / DUR);
        var hold = k.ptr.down;
        if (hold !== S.lastHold && S.t - S.lastToggle > .12) { S.toggles++; S.lastToggle = S.t; S.lastHold = hold; }
        if (hold) { S.hold += dt; S.s -= 125 * dt; } else { S.s += 58 * dt; }
        S.s = Math.max(60, Math.min(SMAX, S.s));
        S.gustT -= dt; if (S.gustT <= 0) { S.gust = .28 * (Math.random() < .5 ? -1 : 1); S.gustT = 5 + Math.random() * 3; k.beep(180, .3, 'sine', .03); }
        S.gust *= Math.max(0, 1 - dt * .45);
        S.sumDelta += (S.s - D) / SMAX * dt; var dl = (S.s - D) / SMAX; if (dl < -.1) { S.tightT += dt; } else if (dl > .1) { S.looseT += dt; } else { S.inT += dt; }
        /* dây căng / chùng */
        var tens = Math.max(0, (D - S.s) / (SMAX * .3)), sag = Math.max(0, (S.s - D) / (SMAX * .26));
        if (S.snapT <= 0 && S.fallT <= 0) {
          S.tens = tens > .95 ? S.tens + dt : Math.max(0, S.tens - dt); S.sag = sag > .95 ? S.sag + dt : Math.max(0, S.sag - dt);
          if (S.tens > 1.5) { S.snapT = 2; S.tens = 0; S.joy = Math.max(0, S.joy - 2); k.pop(S.kx, S.ky, 'Đứt dây!', '#FF9FB0'); k.beep(120, .3, 'sawtooth', .06); }
          if (S.sag > 1.7) { S.fallT = 2; S.sag = 0; S.joy = Math.max(0, S.joy - 2); k.pop(S.kx, S.ky, 'Diều rơi!', '#FF9FB0'); k.beep(110, .35, 'sawtooth', .06); }
        }
        if (S.snapT > 0) { S.snapT -= dt; if (S.snapT <= 0) { S.s = Math.min(S.s, D * .8); } } if (S.fallT > 0) { S.fallT -= dt; if (S.fallT <= 0) { S.s = Math.min(S.s, D * .9); } }
        S.spawn -= dt; if (S.spawn <= 0) { S.stars.push({ x: 380, y: hy - 70 - Math.random() * 210, got: false }); S.spawn = 1.3 + Math.random() * .8; }
      }
      /* vị trí diều */
      var r, theta = .95 + .22 * (w - .5) + Math.sin(S.t * 1.3) * .05;
      if (S.snapT > 0) { r = S.s + (2 - S.snapT) * 150; theta = .6; } else if (S.fallT > 0) { r = 50; theta = .12; } else { r = S.s <= D ? S.s : Math.max(50, D - (S.s - D) * .7); }
      S.kx += ((hx + r * Math.cos(theta)) - S.kx) * Math.min(1, dt * 7); S.ky += ((hy - r * Math.sin(theta)) - S.ky) * Math.min(1, dt * 7);
      S.w = w; S.D = D; S.tail += dt * (6 + w * 8);
      if (k.mode === 'play') {
        S.stars.forEach(function (st) { st.x -= 34 * dt; if (!st.got && S.snapT <= 0 && S.fallT <= 0 && Math.hypot(st.x - S.kx, st.y - S.ky) < 28) { st.got = true; S.joy++; k.burst(st.x, st.y, '#FFE27A', 10, 150); k.pop(st.x, st.y - 10, '+1', '#FFE27A'); k.beep(800 + (S.joy % 5) * 90, .08, 'triangle', .05); } });
        S.stars = S.stars.filter(function (st) { return !st.got && st.x > -20; });
        if (S.t >= DUR) {
          var sw = S.toggles / DUR, tf = S.tightT / DUR, lf = S.looseT / DUR, inf = S.inT / DUR, key;
          if (lf > tf && lf > .32) { key = 'K'; } else if (tf > lf && tf > .32) { key = sw > .7 ? 'D' : 'B'; } else { key = 'H'; }
          k.end(key, 'Bạn giữ dây đúng mức ' + Math.round(inf * 100) + '% thời gian, quá chặt ' + Math.round(tf * 100) + '%, quá lỏng ' + Math.round(lf * 100) + '%, và đổi tay (giữ/thả) ' + S.toggles + ' lần. Kết quả được tính từ đúng những điều này.');
        }
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, gy = k.groundY, S = k.S, hx = 70, hy = gy - 66;
      var g = c.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, '#F7B98E'); g.addColorStop(.55, '#FFDDB8'); g.addColorStop(1, '#FFF1DC'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      var sx = 290, sy = gy - 190; var gs = c.createRadialGradient(sx, sy, 6, sx, sy, 64); gs.addColorStop(0, 'rgba(255,245,200,.95)'); gs.addColorStop(1, 'rgba(255,215,150,0)'); c.fillStyle = gs; c.beginPath(); c.arc(sx, sy, 64, 0, 7); c.fill();
      c.fillStyle = '#FFF6DA'; c.beginPath(); c.arc(sx, sy, 20, 0, 7); c.fill();
      var wv = S.w || .5; c.strokeStyle = 'rgba(255,255,255,' + (.2 + wv * .3) + ')'; c.lineWidth = 1.4; c.beginPath();
      for (var i = 0; i < 7; i++) { var wx = ((i * 71 - k.T * (60 + wv * 140)) % (W + 120) + W + 120) % (W + 120) - 60, wy = 70 + i * 44; c.moveTo(wx, wy); c.quadraticCurveTo(wx + 20, wy - 6, wx + 44, wy); } c.stroke();
      c.fillStyle = '#9CCB86'; c.beginPath(); c.moveTo(0, gy - 20); for (var x = 0; x <= W; x += 20) { c.lineTo(x, gy - 28 - Math.sin(x / 50) * 12); } c.lineTo(W, HH); c.lineTo(0, HH); c.fill();
      c.fillStyle = '#7FB36E'; c.fillRect(0, gy, W, HH);
      c.strokeStyle = '#6AA05B'; c.lineWidth = 1.6; for (var gx = 6; gx < W; gx += 12) { c.beginPath(); c.moveTo(gx, gy + 2); c.lineTo(gx + 4 + wv * 8, gy - 10); c.stroke(); }
      (S.stars || []).forEach(function (st) { c.fillStyle = '#FFE27A'; c.beginPath(); for (var j = 0; j < 10; j++) { var a = Math.PI * j / 5 - Math.PI / 2, r = j % 2 ? 5 : 11; c.lineTo(st.x + Math.cos(a) * r, st.y + Math.sin(a) * r); } c.fill(); });
      /* dây */
      var kx = S.kx || 200, ky = S.ky || 300, hxx = hx + 20, hyy = hy - 2, tens = Math.max(0, ((S.D || 0) - (S.s || 0)) / (SMAX * .3)), slack = Math.max(0, ((S.s || 0) - (S.D || 0)) / (SMAX * .26));
      c.strokeStyle = tens > .7 ? '#E0505E' : slack > .6 ? '#C9A24A' : '#FFFFFF'; c.lineWidth = 1.8 + tens * 1.4;
      if (S.snapT > 0) { c.setLineDash([4, 8]); }
      c.beginPath(); c.moveTo(hxx, hyy); c.quadraticCurveTo((hxx + kx) / 2, (hyy + ky) / 2 + 8 + slack * 70, kx, ky + 16); c.stroke(); c.setLineDash([]);
      /* diều Gấu Con */
      c.save(); c.translate(kx, ky); c.rotate(.25 + Math.sin(k.T * 3) * .08 * (1 + wv));
      c.strokeStyle = '#FF7C92'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(0, 22); for (var tn = 1; tn <= 5; tn++) { c.lineTo(Math.sin(S.tail + tn) * 8, 22 + tn * 12); } c.stroke();
      c.fillStyle = '#F2A0C0'; c.beginPath(); c.moveTo(0, -30); c.lineTo(24, 0); c.lineTo(0, 24); c.lineTo(-24, 0); c.closePath(); c.fill();
      c.fillStyle = '#E87AA4'; c.beginPath(); c.moveTo(0, -30); c.lineTo(24, 0); c.lineTo(0, 0); c.closePath(); c.fill(); c.beginPath(); c.moveTo(0, 24); c.lineTo(-24, 0); c.lineTo(0, 0); c.closePath(); c.fill();
      c.fillStyle = '#B27A4E'; c.beginPath(); c.arc(0, -2, 11, 0, 7); c.arc(-9, -12, 4.6, 0, 7); c.arc(9, -12, 4.6, 0, 7); c.fill();
      c.fillStyle = '#14213D'; c.beginPath(); c.arc(-4, -4, 1.7, 0, 7); c.arc(4, -4, 1.7, 0, 7); c.fill(); c.beginPath(); c.arc(0, 1, 3.4, .2, Math.PI - .2); c.strokeStyle = '#14213D'; c.lineWidth = 1.4; c.stroke();
      c.restore();
      c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(hx, gy + 3, 30, 5, 0, 0, 7); c.fill();
      drawChar(c, bear, hx, gy, 112, 1);
      var gx = 14, gw = 150, gyy = 62, wd = S.w || 0, dd = (S.D || 0) / SMAX, ss = (S.s || 0) / SMAX; c.fillStyle = 'rgba(0,0,0,.28)'; k.rr(gx - 6, gyy - 18, gw + 12, 70, 8); c.fill(); c.fillStyle = '#fff'; c.font = '700 10.5px "Be Vietnam Pro", system-ui'; c.textAlign = 'left'; c.fillText('Gió', gx, gyy - 6); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(gx, gyy, gw, 7); c.fillStyle = '#fff'; c.fillRect(gx, gyy, gw * wd, 7); c.fillStyle = '#fff'; c.fillText('Dây (giữ trong vùng xanh)', gx, gyy + 24); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(gx, gyy + 30, gw, 8); c.fillStyle = 'rgba(111,207,151,.9)'; c.fillRect(gx + gw * Math.max(0, dd - .1), gyy + 30, gw * .2, 8); var off = Math.abs(ss - dd) > .1; c.fillStyle = off ? '#FF6B7A' : '#fff'; c.fillRect(gx + gw * ss - 2, gyy + 26, 4, 16);
      var joy = S.joy || 0; c.fillStyle = 'rgba(255,255,255,.9)'; c.font = '800 15px "Baloo 2", system-ui'; c.textAlign = 'left'; c.fillText('★ ' + joy, 14, k.HH - 40);
    },
    winChar: function (k, cx, cy, sc) { drawChar(k.ctx, bear, cx, cy + 44, 112, Math.max(.01, sc)); }
  };
  window.GameKit(cfg, H, def);
};
