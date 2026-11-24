/* THÁP MẢNH GHÉP: game XẾP GẠCH (kiểu Tetris, nhưng bạn tự chọn gạch).
   Mỗi lượt có 2 viên gạch ghi 2 lựa chọn đời thường. Bạn chọn viên giống mình hơn, rồi chạm vào cột muốn đặt.
   12 lượt = 4 cặp mảnh ghép x 3 câu. Mảnh nào bạn chọn nhiều hơn trong từng cặp sẽ thành chữ cái của tháp (ví dụ INFP). */
window.runGame = function (cfg, H) {
  var LC = { E: '#FF9A8B', I: '#9FB0FF', S: '#72D3C2', N: '#C9A6FF', T: '#FFD36E', F: '#FFADCB', J: '#8DBBFF', P: '#9BE59F' };
  var NM = { E: 'Hướng ngoại', I: 'Hướng nội', S: 'Thực tế', N: 'Trực giác', T: 'Lý trí', F: 'Cảm xúc', J: 'Kế hoạch', P: 'Linh hoạt' };
  var DICH = [
    [['E', 'Tiệc đông vui', 'I', 'Góc yên tĩnh'], ['E', 'Rủ cả nhóm', 'I', 'Đi một mình'], ['E', 'Nói ra liền', 'I', 'Nghĩ kỹ đã']],
    [['S', 'Việc thực tế', 'N', 'Ý tưởng mới'], ['S', 'Chi tiết nhỏ', 'N', 'Bức tranh lớn'], ['S', 'Cách cũ ổn', 'N', 'Thử cách lạ']],
    [['T', 'Lý lẽ rõ ràng', 'F', 'Cảm xúc mọi người'], ['T', 'Công bằng', 'F', 'Thấu hiểu'], ['T', 'Nói thẳng', 'F', 'Nói nhẹ nhàng']],
    [['J', 'Lên kế hoạch', 'P', 'Tuỳ cơ ứng biến'], ['J', 'Xong việc sớm', 'P', 'Nước đến chân'], ['J', 'Lịch rõ ràng', 'P', 'Cứ thoải mái']]
  ];
  var COLS = 6, CELL = 40, X0 = 60, TOPY = 128, TURNS = 12, TOPAIM = 100, blk;
  /* Hình dạng gạch: [cột, hàng] với hàng 0 ở dưới cùng */
  var SHAPES = [[[0, 0], [1, 0]], [[0, 0], [1, 0], [2, 0]], [[0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[0, 0], [1, 0], [2, 0], [0, 1]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 0], [3, 0]]];
  function norm(cs) { var mx = 99, my = 99; cs.forEach(function (c) { mx = Math.min(mx, c[0]); my = Math.min(my, c[1]); }); return cs.map(function (c) { return [c[0] - mx, c[1] - my]; }); }
  function rot(cs) { return norm(cs.map(function (c) { return [c[1], -c[0]]; })); }
  function dims(cs) { var w = 0, h = 0; cs.forEach(function (c) { w = Math.max(w, c[0] + 1); h = Math.max(h, c[1] + 1); }); return [w, h]; }
  function fit(c, txt, w, base) { var s = base; c.font = '700 ' + s + 'px "Be Vietnam Pro", system-ui'; while (s > 8 && c.measureText(txt).width > w) { s -= .5; c.font = '700 ' + s + 'px "Be Vietnam Pro", system-ui'; } return s; }
  function two(c, txt, w, base) {
    c.font = '700 ' + base + 'px "Be Vietnam Pro", system-ui'; if (c.measureText(txt).width <= w) { return [txt]; }
    var wd = txt.split(' '), best = null, bd = 1e9;
    for (var i = 1; i < wd.length; i++) { var a = wd.slice(0, i).join(' '), b = wd.slice(i).join(' '), d = Math.abs(c.measureText(a).width - c.measureText(b).width); if (d < bd) { bd = d; best = [a, b]; } }
    return best || [txt];
  }
  function cellBox(k, x, y, L, a) { var c = k.ctx; c.globalAlpha = a || 1; c.fillStyle = LC[L]; k.rr(x + 1.5, y + 1.5, CELL - 3, CELL - 3, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.34)'; k.rr(x + 4, y + 4, CELL - 8, 9, 4); c.fill(); c.globalAlpha = 1; }
  function colH(S, col) { for (var r = S.R - 1; r >= 0; r--) { if (S.grid[r][col]) { return r + 1; } } return 0; }
  function baseRow(S, cs, col) { var r = 0; cs.forEach(function (c) { r = Math.max(r, colH(S, col + c[0]) - c[1]); }); return r; }
  function pickShape() { return norm(SHAPES[Math.floor(Math.random() * SHAPES.length)]); }
  function nextChoices(S) {
    var d = S.order[S.turn % 4], q = DICH[d][Math.floor(S.turn / 4)], flip = Math.random() < .5;
    var a = { L: q[0], t: q[1], cs: pickShape() }, b = { L: q[2], t: q[3], cs: pickShape() };
    S.ch = flip ? [b, a] : [a, b]; S.phase = 'choose';
  }
  var RB = { x: 306, y: 82, r: 25 };
  var def = {
    sub: 'Mỗi người là một tháp gồm 4 mảnh ghép. Hãy xếp 12 mảnh gạch, mỗi mảnh là một lựa chọn của bạn.',
    how: 'Mỗi lượt có <b>2 mảnh gạch</b> hình khác nhau, chạm vào mảnh <b>giống bạn hơn</b>. Bấm <b>Xoay</b> để đổi hướng, <b>kéo</b> tới chỗ muốn đặt rồi thả tay. Đủ một hàng là hàng biến mất.',
    init: function (k) {
      blk = blk || k.charImg('block');
      var R = Math.max(8, Math.floor((k.groundY - TOPY) / CELL)), grid = [];
      for (var r = 0; r < R; r++) { grid.push([null, null, null, null, null, null]); }
      var o = [0, 1, 2, 3]; o.sort(function () { return Math.random() - .5; });
      k.S = { R: R, grid: grid, turn: 0, order: o, phase: 'idle', ch: [], cur: null, cnt: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }, pid: 1, aimDown: false, endT: 0, lastPx: -1 };
    },
    begin: function (k) { nextChoices(k.S); k.legend('Chọn <b>1 trong 2 mảnh</b> giống bạn hơn.'); k.progress(0); },
    down: function (k) {
      var S = k.S, p = k.ptr;
      if (S.phase === 'choose') {
        if (p.y > TOPY - 6) { return; }
        var i = p.x < k.W / 2 ? 0 : 1, c = S.ch[i];
        S.cur = { L: c.L, t: c.t, cs: c.cs, col: Math.floor((COLS - dims(c.cs)[0]) / 2), y: 0 }; S.phase = 'aim'; S.aimDown = false; S.lastPx = p.x;
        k.beep(600, .07, 'triangle', .05); k.legend('Bấm <b>Xoay</b> nếu cần, <b>kéo</b> tới chỗ đặt rồi thả tay.');
      } else if (S.phase === 'aim') {
        if ((p.x - RB.x) * (p.x - RB.x) + (p.y - RB.y) * (p.y - RB.y) < (RB.r + 8) * (RB.r + 8)) {
          S.cur.cs = rot(S.cur.cs); S.cur.col = Math.max(0, Math.min(COLS - dims(S.cur.cs)[0], S.cur.col)); S.aimDown = false; k.beep(520, .05, 'square', .03); return;
        }
        S.aimDown = true;
      }
    },
    up: function (k) {
      var S = k.S;
      if (S.phase === 'aim' && S.aimDown) { S.aimDown = false; S.phase = 'fall'; S.cur.tr = baseRow(S, S.cur.cs, S.cur.col); k.legend(''); }
    },
    update: function (k, dt) {
      var S = k.S; if (k.mode !== 'play') { return; }
      if (S.phase === 'aim') {
        var d = dims(S.cur.cs);
        if (k.ptr.x !== S.lastPx || S.aimDown) { S.cur.col = Math.max(0, Math.min(COLS - d[0], Math.round((k.ptr.x - X0) / CELL - d[0] / 2))); S.lastPx = k.ptr.x; }
        S.cur.y = TOPAIM + (d[1] - 1) * CELL;
      } else if (S.phase === 'fall') {
        var cu = S.cur, ty = k.groundY - (cu.tr + 1) * CELL;
        cu.y += 560 * dt;
        if (cu.y >= ty) {
          var id = S.pid++, ys = k.groundY - cu.tr * CELL;
          cu.cs.forEach(function (c) { var r = Math.min(S.R - 1, cu.tr + c[1]); S.grid[r][cu.col + c[0]] = { L: cu.L, id: id }; });
          S.cnt[cu.L]++; S.turn++; k.progress(S.turn / TURNS);
          var dd = dims(cu.cs); k.burst(X0 + (cu.col + dd[0] / 2) * CELL, ys - CELL, LC[cu.L], 10, 130); k.beep(300 + S.turn * 25, .09, 'square', .035);
          for (var rr = S.R - 1; rr >= 0; rr--) {
            var full = true; for (var cc = 0; cc < COLS; cc++) { if (!S.grid[rr][cc]) { full = false; } }
            if (full) { S.grid.splice(rr, 1); S.grid.push([null, null, null, null, null, null]); k.pop(X0 + COLS * CELL / 2, k.groundY - (rr + 1) * CELL, 'Gọn!', '#fff'); k.burst(X0 + COLS * CELL / 2, k.groundY - (rr + .5) * CELL, '#fff', 16, 200); k.beep(880, .15, 'triangle', .06); }
          }
          while (Math.max(colH(S, 0), colH(S, 1), colH(S, 2), colH(S, 3), colH(S, 4), colH(S, 5)) > S.R - 3) { S.grid.shift(); S.grid.push([null, null, null, null, null, null]); }
          S.cur = null;
          if (S.turn >= TURNS) { S.phase = 'done'; S.endT = .8; } else { nextChoices(S); k.legend('Chọn <b>1 trong 2 mảnh</b> giống bạn hơn.'); }
        }
      } else if (S.phase === 'done') {
        S.endT -= dt;
        if (S.endT <= 0) {
          var code = '', parts = [];
          DICH.forEach(function (dc) { var a = dc[0][0], b = dc[0][2], w = S.cnt[a] > S.cnt[b] ? a : b; code += w; parts.push('<b>' + NM[w] + '</b> ' + S.cnt[w] + '/3'); });
          S.phase = 'over';
          k.end(code, 'Bạn đã chọn ' + parts.join(', ') + ', nên tháp của bạn là <b>' + code + '</b>.');
        }
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, S = k.S, gy = k.groundY, bw = COLS * CELL, by = gy - S.R * CELL;
      var g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#3B2F7A'); g.addColorStop(1, '#8A55B8'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      c.fillStyle = '#FFF6DC'; k.stars.forEach(function (s) { c.globalAlpha = .3 + .5 * Math.sin(k.T * 2 + s[2]); c.fillRect(s[0], 8 + s[1] * gy * .8, 1.6, 1.6); }); c.globalAlpha = 1;
      c.fillStyle = 'rgba(255,255,255,.10)'; k.rr(X0 - 6, by - 6, bw + 12, S.R * CELL + 12, 12); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 1; c.beginPath();
      for (var i = 1; i < COLS; i++) { c.moveTo(X0 + i * CELL, by); c.lineTo(X0 + i * CELL, gy); }
      for (var j = 1; j < S.R; j++) { c.moveTo(X0, by + j * CELL); c.lineTo(X0 + bw, by + j * CELL); }
      c.stroke();
      c.fillStyle = '#2A2060'; c.fillRect(0, gy, W, HH); c.fillStyle = '#5A43A6'; c.fillRect(0, gy, W, 5);
      for (var r = 0; r < S.R; r++) { for (var cc = 0; cc < COLS; cc++) { var cell = S.grid[r][cc]; if (cell) { cellBox(k, X0 + cc * CELL, gy - (r + 1) * CELL, cell.L); } } }
      if (k.mode === 'intro') { var bob = Math.sin(k.T * 2) * 4; if (blk.complete) { c.drawImage(blk, W / 2 - 56, 150 + bob, 112, 118); } return; }
      if (S.phase === 'choose') {
        [0, 1].forEach(function (n) {
          var ch = S.ch[n], x = 16 + n * 174, y = 52, w = 154, h = 70, d = dims(ch.cs), cs = 14, mw = 4 * cs, ox = x + 8 + (mw - d[0] * cs) / 2, oy = y + h / 2 + d[1] * cs / 2;
          c.fillStyle = 'rgba(255,255,255,.2)'; k.rr(x, y, w, h, 14); c.fill(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.stroke();
          ch.cs.forEach(function (q) { c.fillStyle = LC[ch.L]; k.rr(ox + q[0] * cs + 1, oy - (q[1] + 1) * cs + 1, cs - 2, cs - 2, 3); c.fill(); });
          var lines = two(c, ch.t, 76, 12.5); c.font = '700 12.5px "Be Vietnam Pro", system-ui'; c.fillStyle = '#fff'; c.textAlign = 'left';
          lines.forEach(function (ln, li) { c.fillText(ln, x + 74, y + h / 2 + 4 - (lines.length - 1) * 8 + li * 16); });
        });
        c.fillStyle = '#fff'; c.font = '800 12px "Baloo 2", system-ui'; c.textAlign = 'center'; c.fillText('hay', W / 2 - 4, 92);
      } else if (S.cur) {
        var cu = S.cur, d2 = dims(cu.cs), px = X0 + cu.col * CELL;
        if (S.phase === 'aim') {
          var tr = baseRow(S, cu.cs, cu.col);
          c.strokeStyle = 'rgba(255,255,255,.8)'; c.setLineDash([5, 4]); c.lineWidth = 2;
          cu.cs.forEach(function (q) { k.rr(px + q[0] * CELL + 3, gy - (tr + q[1] + 1) * CELL + 3, CELL - 6, CELL - 6, 8); c.stroke(); }); c.setLineDash([]);
        }
        cu.cs.forEach(function (q) { cellBox(k, px + q[0] * CELL, cu.y - q[1] * CELL, cu.L); });
        var topY = cu.y - (d2[1] - 1) * CELL, lw = 0; c.font = '700 12px "Be Vietnam Pro", system-ui'; lw = c.measureText(cu.t).width + 18;
        var lx = Math.max(6, Math.min(W - 66 - lw, px + d2[0] * CELL / 2 - lw / 2)), ly = Math.max(56, topY - 30);
        c.fillStyle = 'rgba(255,255,255,.95)'; k.rr(lx, ly, lw, 24, 12); c.fill(); c.fillStyle = '#2A2358'; c.textAlign = 'center'; c.fillText(cu.t, lx + lw / 2, ly + 16);
        if (S.phase === 'aim') {
          c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.arc(RB.x, RB.y, RB.r, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.arc(RB.x, RB.y - 3, 9, .3, Math.PI * 1.6); c.stroke();
          c.fillStyle = '#fff'; c.beginPath(); c.moveTo(RB.x + 9, RB.y - 12); c.lineTo(RB.x + 16, RB.y - 4); c.lineTo(RB.x + 4, RB.y - 4); c.fill();
          c.font = '800 11px "Baloo 2", system-ui'; c.textAlign = 'center'; c.fillText('Xoay', RB.x, RB.y + 17);
        }
      }
    },
    winChar: function (k, cx, cy, sc) { var c = k.ctx; if (!blk.complete) { return; } c.save(); c.translate(cx, cy + 40); c.scale(Math.max(.01, sc), Math.max(.01, sc)); c.drawImage(blk, -52, -108, 104, 109); c.restore(); }
  };
  window.GameKit(cfg, H, def);
};
