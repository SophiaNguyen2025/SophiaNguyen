/* CHIM ÉN TÌM TỔ: game KHOẢNG CÁCH giữa hai chú chim trong cơn bão. Không có câu hỏi, không có đáp án "đúng".
   Giữ ngón tay: Én bay lại gần bạn đồng hành. Thả ra: Én lùi xa. Cách bạn giữ khoảng cách là kết quả. */
window.runGame = function (cfg, H) {
  var DUR = 40, en, bong;
  function drawChar(c, img, x, feetY, dh, sc, flip) { if (!img.complete) { return; } var dw = dh * 120 / 126; c.save(); c.translate(x, feetY); c.scale((flip ? -1 : 1) * sc, sc); c.drawImage(img, -dw / 2, -dh * .93, dw, dh); c.restore(); }
  var def = {
    sub: 'Giữa cơn bão, Én (bạn) và Chích Bông bay cùng nhau. Thỉnh thoảng Chích Bông bay ra xa.',
    how: 'Bạn là chú chim <b>xanh</b>. <b>Giữ</b> ngón tay để bay lại gần Chích Bông (chim cam), <b>thả</b> ra thì bay xa. Không có cách đúng hay sai, cứ làm theo cảm giác. Kết quả dựa trên cách bạn <b>bay theo hay để bạn đi</b>.',
    init: function (k) {
      en = en || k.charImg('bird'); bong = bong || k.charImg('bird', [['#5B8DE0', '#F2A53A'], ['#3F6FC4', '#D9822B']]);
      k.S = { ex: 70, vx: 0, fx: 220, fT: 230, fTimer: 3, wind: 0, windT: 6, t: 0, close: 0, mid: 0, far: 0, holdT: 0, wd: 0, ch: 0, wdT: 0, wdHold: 0, wdCounted: false, toggles: 0, lastHold: false, lastToggle: -1, flash: 0, flashT: 5, drops: [], hearts: 0 };
      for (var i = 0; i < 70; i++) { k.S.drops.push({ x: Math.random() * 380, y: Math.random() * 700, v: 380 + Math.random() * 160 }); }
    },
    begin: function (k) { k.legend('<b>Giữ</b> = bay lại gần · <b>Thả</b> = bay xa'); },
    update: function (k, dt) {
      var S = k.S, W = k.W;
      S.drops.forEach(function (d) { d.y += d.v * dt; d.x -= d.v * .22 * dt; if (d.y > k.HH) { d.y = -10; d.x = Math.random() * 400; } });
      if (S.flash > 0) { S.flash -= dt * 2.2; }
      if (k.mode === 'intro') { S.ex = 140 + Math.sin(k.T * 1.3) * 40; S.fx = 230 + Math.sin(k.T * .9) * 30; return; }
      if (k.mode !== 'play') { return; }
      S.t += dt; k.progress(1 - S.t / DUR);
      var hold = k.ptr.down;
      if (hold !== S.lastHold && S.t - S.lastToggle > .12) { S.toggles++; S.lastToggle = S.t; S.lastHold = hold; }
      if (hold) { S.holdT += dt; }
      if (S.wdT > 0) { S.wdT -= dt; if (hold) { S.wdHold += dt; if (S.wdHold > .8 && !S.wdCounted) { S.wdCounted = true; S.ch++; } } }
      /* bạn đồng hành: lúc ở gần, lúc bận bay ra xa */
      S.fTimer -= dt;
      if (S.fTimer <= 0) {
        var away = Math.random() < .38; if (away) { S.wd++; S.wdT = 3; S.wdHold = 0; S.wdCounted = false; k.pop(S.fx, k.HH * .3, 'Chích Bông bay xa…', '#FFD9A8'); } S.fT = away ? (S.ex > 180 ? 40 + Math.random() * 40 : 290 + Math.random() * 40) : 60 + Math.random() * 240; S.fTimer = 2.6 + Math.random() * 2.2;
      }
      S.fx += (S.fT - S.fx) * Math.min(1, dt * .9);
      /* gió */
      S.windT -= dt; if (S.windT <= 0) { S.wind = (Math.random() < .5 ? -1 : 1) * (90 + Math.random() * 60); S.windT = 5 + Math.random() * 4; S.flash = 1; k.beep(90, .5, 'sawtooth', .04); }
      S.wind *= Math.max(0, 1 - dt * 1.6);
      var dir = Math.sign(S.fx - S.ex) || 1, away2 = -dir;
      if (hold) { S.vx += dir * 340 * dt; } else { S.vx += away2 * 125 * dt; }
      S.vx += S.wind * dt * 2; S.vx *= Math.max(0, 1 - 2.2 * dt);
      S.ex += S.vx * dt; if (S.ex < 34) { S.ex = 34; S.vx = 0; } if (S.ex > 326) { S.ex = 326; S.vx = 0; }
      var d = Math.abs(S.fx - S.ex);
      if (d < 55) { S.close += dt; } else if (d > 150) { S.far += dt; } else { S.mid += dt; }
      if (d < 55 && Math.floor(S.t * 2) !== Math.floor((S.t - dt) * 2)) { S.hearts++; k.burst((S.ex + S.fx) / 2, k.HH * .32, '#FF9FB0', 2, 40); }
      if (S.t >= DUR) {
        var sw = S.toggles / DUR, cf = S.close / DUR, ff = S.far / DUR, hf = S.holdT / DUR, key;
        var chase = S.wd >= 2 && S.ch / S.wd >= .8;
        if (sw > 1.1) { key = 'D'; } else if (cf > .6 || hf > .72 || (chase && hf > .5)) { key = 'B'; } else if (ff > .45 || hf < .15) { key = 'C'; } else { key = 'A'; }
        k.S.stats = { sw: sw, cf: cf, ff: ff, hf: hf };
        k.end(key, 'Bạn ở sát Chích Bông ' + Math.round(cf * 100) + '% thời gian, bay theo ' + S.ch + '/' + S.wd + ' lần Chích Bông bay xa, và đổi ý (giữ/thả) ' + S.toggles + ' lần. Kết quả được tính từ đúng những điều này.');
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, S = k.S, by = HH * .38, gy = k.groundY;
      var g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2B3150'); g.addColorStop(1, '#5A5F86'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      for (var i = 0; i < 4; i++) { c.fillStyle = 'rgba(30,34,60,' + (.45 - i * .06) + ')'; var cx0 = ((i * 130 - k.T * (10 + i * 4)) % (W + 200) + W + 200) % (W + 200) - 100; c.beginPath(); c.arc(cx0, 60 + i * 36, 50, 0, 7); c.arc(cx0 + 46, 50 + i * 36, 62, 0, 7); c.arc(cx0 + 100, 66 + i * 36, 48, 0, 7); c.fill(); }
      c.fillStyle = '#1E2540'; c.beginPath(); c.moveTo(0, gy - 30); for (var x = 0; x <= W; x += 20) { c.lineTo(x, gy - 40 - Math.sin(x / 40) * 18); } c.lineTo(W, HH); c.lineTo(0, HH); c.fill();
      var dist = Math.abs((S.fx || 0) - (S.ex || 0)), ex = S.ex || 100, fx = S.fx || 220, ey = by + Math.sin(k.T * 3) * 6, fy = by + Math.sin(k.T * 2.6 + 1) * 6;
      /* sợi ấm giữa hai chú chim */
      var warm = Math.max(0, 1 - dist / 230);
      if (warm > 0) { var gl = c.createRadialGradient((ex + fx) / 2, by, 4, (ex + fx) / 2, by, 40 + 90 * warm); gl.addColorStop(0, 'rgba(255,205,140,' + (.6 * warm) + ')'); gl.addColorStop(1, 'rgba(255,205,140,0)'); c.fillStyle = gl; c.beginPath(); c.arc((ex + fx) / 2, by, 40 + 90 * warm, 0, 7); c.fill(); }
      c.strokeStyle = 'rgba(255,230,190,' + (.1 + .5 * warm) + ')'; c.lineWidth = 2; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(ex, ey - 24); c.lineTo(fx, fy - 24); c.stroke(); c.setLineDash([]);
      drawChar(c, bong, fx, fy + 34, 76, 1, fx > ex);
      drawChar(c, en, ex, ey + 34, 76, 1, fx < ex);
      c.fillStyle = '#fff'; c.font = '800 12px "Baloo 2", system-ui'; c.textAlign = 'center'; c.fillText('Bạn', ex, ey - 44); c.beginPath(); c.moveTo(ex - 5, ey - 38); c.lineTo(ex + 5, ey - 38); c.lineTo(ex, ey - 31); c.fill();
      /* mưa + sét */
      c.strokeStyle = 'rgba(190,205,255,.45)'; c.lineWidth = 1.2; c.beginPath(); (S.drops || []).forEach(function (d) { c.moveTo(d.x, d.y); c.lineTo(d.x + 5, d.y + 13); }); c.stroke();
      if (S.flash > 0) { c.fillStyle = 'rgba(255,255,255,' + (S.flash * .5) + ')'; c.fillRect(0, 0, W, HH); }
    },
    winChar: function (k, cx, cy, sc) { var c = k.ctx; drawChar(c, en, cx - 34, cy + 40, 90, Math.max(.01, sc), false); drawChar(c, bong, cx + 34, cy + 40, 90, Math.max(.01, sc), true); }
  };
  window.GameKit(cfg, H, def);
};
