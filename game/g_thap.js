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
  var COLS = 6, CELL = 40, X0 = 60, TOPY = 128, TURNS = 12, blk;
  function fit(c, txt, w, base) { var s = base; c.font = '700 ' + s + 'px "Be Vietnam Pro", system-ui'; while (s > 8 && c.measureText(txt).width > w) { s -= .5; c.font = '700 ' + s + 'px "Be Vietnam Pro", system-ui'; } return s; }
  function piece(k, x, y, w, h, L, txt, base, glow) {
    var c = k.ctx;
    if (glow) { c.fillStyle = 'rgba(255,255,255,.28)'; k.rr(x - 4, y - 4, w + 8, h + 8, 12); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,.22)'; k.rr(x, y + 3, w, h, 9); c.fill();
    c.fillStyle = LC[L]; k.rr(x, y, w, h, 9); c.fill();
    c.fillStyle = 'rgba(255,255,255,.38)'; k.rr(x + 3, y + 3, w - 6, h * .32, 6); c.fill();
    if (txt) { fit(c, txt, w - 10, base); c.fillStyle = '#2A2358'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x + w / 2, y + h / 2 + 1); c.textBaseline = 'alphabetic'; }
  }
  function colH(S, col) { for (var r = S.R - 1; r >= 0; r--) { if (S.grid[r][col]) { return r + 1; } } return 0; }
  function nextChoices(S) {
    var d = S.order[S.turn % 4], q = DICH[d][Math.floor(S.turn / 4)], flip = Math.random() < .5;
    var a = { L: q[0], t: q[1] }, b = { L: q[2], t: q[3] };
    S.ch = flip ? [b, a] : [a, b]; S.phase = 'choose';
  }
  var def = {
    sub: 'Mỗi người là một tháp gồm 4 mảnh ghép. Hãy xếp 12 viên gạch, mỗi viên là một lựa chọn của bạn.',
    how: 'Mỗi lượt có <b>2 viên gạch</b>, chạm vào viên <b>giống bạn hơn</b>. Sau đó <b>chạm hoặc kéo</b> tới cột muốn đặt rồi thả tay để gạch rơi. Hàng nào đầy sẽ biến mất.',
    init: function (k) {
      blk = blk || k.charImg('block');
      var R = Math.max(8, Math.floor((k.groundY - TOPY) / CELL)), grid = [];
      for (var r = 0; r < R; r++) { grid.push([null, null, null, null, null, null]); }
      var o = [0, 1, 2, 3]; o.sort(function () { return Math.random() - .5; });
      k.S = { R: R, grid: grid, turn: 0, order: o, phase: 'idle', ch: [], cur: null, cnt: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }, pid: 1, aimDown: false, endT: 0, lastPx: -1, flash: 0 };
    },
    begin: function (k) { nextChoices(k.S); k.legend('Chọn <b>1 trong 2 viên</b> giống bạn hơn.'); k.progress(0); },
    down: function (k) {
      var S = k.S, p = k.ptr;
      if (S.phase === 'choose') {
        if (p.y > TOPY - 6) { return; }
        var i = p.x < k.W / 2 ? 0 : 1, c = S.ch[i];
        S.cur = { L: c.L, t: c.t, col: 2, y: 0 }; S.phase = 'aim'; S.aimDown = false; S.lastPx = p.x;
        k.beep(600, .07, 'triangle', .05); k.legend('Chạm hoặc kéo tới <b>cột muốn đặt</b>, thả tay để rơi.');
      } else if (S.phase === 'aim') { S.aimDown = true; }
    },
    up: function (k) {
      var S = k.S;
      if (S.phase === 'aim' && S.aimDown) {
        S.aimDown = false; S.phase = 'fall';
        var c0 = S.cur.col, h = Math.max(colH(S, c0), colH(S, c0 + 1)); S.cur.tr = h;
        k.legend('');
      }
    },
    update: function (k, dt) {
      var S = k.S; if (k.mode !== 'play') { return; }
      var by = k.groundY - S.R * CELL;
      if (S.phase === 'aim') {
        if (k.ptr.x !== S.lastPx || S.aimDown) { S.cur.col = Math.max(0, Math.min(COLS - 2, Math.round((k.ptr.x - X0) / CELL - 1))); S.lastPx = k.ptr.x; }
        S.cur.y = by - CELL - 8;
      } else if (S.phase === 'fall') {
        var ty = k.groundY - (S.cur.tr + 1) * CELL;
        S.cur.y += 560 * dt;
        if (S.cur.y >= ty) {
          S.cur.y = ty; var c = S.cur, r = c.tr, id = S.pid++;
          if (r >= S.R) { r = S.R - 1; }
          S.grid[r][c.col] = { L: c.L, id: id, h: 0, t: c.t }; S.grid[r][c.col + 1] = { L: c.L, id: id, h: 1 };
          S.cnt[c.L]++; S.turn++; k.progress(S.turn / TURNS);
          k.burst(X0 + (c.col + 1) * CELL, ty + CELL, LC[c.L], 8, 120); k.beep(300 + S.turn * 25, .09, 'square', .035);
          for (var rr = S.R - 1; rr >= 0; rr--) {
            var full = true; for (var cc = 0; cc < COLS; cc++) { if (!S.grid[rr][cc]) { full = false; } }
            if (full) { S.grid.splice(rr, 1); S.grid.push([null, null, null, null, null, null]); k.pop(X0 + COLS * CELL / 2, ty - 6, 'Gọn!', '#fff'); k.burst(X0 + COLS * CELL / 2, ty + CELL / 2, '#fff', 16, 200); k.beep(880, .15, 'triangle', .06); }
          }
          while (colH(S, 0) + colH(S, 1) + colH(S, 2) + colH(S, 3) + colH(S, 4) + colH(S, 5) > 0 && Math.max(colH(S, 0), colH(S, 1), colH(S, 2), colH(S, 3), colH(S, 4), colH(S, 5)) > S.R - 2) { S.grid.shift(); S.grid.push([null, null, null, null, null, null]); }
          S.cur = null;
          if (S.turn >= TURNS) { S.phase = 'done'; S.endT = .8; } else { nextChoices(S); k.legend('Chọn <b>1 trong 2 viên</b> giống bạn hơn.'); }
        }
      } else if (S.phase === 'done') {
        S.endT -= dt;
        if (S.endT <= 0) {
          var code = '', parts = [];
          DICH.forEach(function (d) { var a = d[0][0], b = d[0][2], w = S.cnt[a] > S.cnt[b] ? a : b; code += w; parts.push('<b>' + NM[w] + '</b> ' + S.cnt[w] + '/3'); });
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
      for (var r = 0; r < S.R; r++) {
        for (var cc = 0; cc < COLS; cc++) {
          var cell = S.grid[r][cc]; if (!cell) { continue; }
          var x = X0 + cc * CELL, y = gy - (r + 1) * CELL;
          c.fillStyle = LC[cell.L]; k.rr(x + 1.5, y + 1.5, CELL - 3, CELL - 3, 7); c.fill();
          c.fillStyle = 'rgba(255,255,255,.34)'; k.rr(x + 4, y + 4, CELL - 8, 9, 4); c.fill();
        }
      }
      for (var r2 = 0; r2 < S.R; r2++) {
        for (var c2 = 0; c2 < COLS; c2++) {
          var ce = S.grid[r2][c2]; if (!ce || ce.h !== 0 || !ce.t) { continue; }
          fit(c, ce.t, CELL * 2 - 12, 10); c.fillStyle = '#2A2358'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ce.t, X0 + c2 * CELL + CELL, gy - (r2 + 1) * CELL + CELL / 2 + 3); c.textBaseline = 'alphabetic';
        }
      }
      if (k.mode === 'intro') { var bob = Math.sin(k.T * 2) * 4; if (blk.complete) { c.drawImage(blk, W / 2 - 56, 150 + bob, 112, 118); } return; }
      if (S.phase === 'choose') {
        piece(k, 28, 58, 134, 52, S.ch[0].L, S.ch[0].t, 13, true); piece(k, 198, 58, 134, 52, S.ch[1].L, S.ch[1].t, 13, true);
        c.fillStyle = '#fff'; c.font = '800 12px "Baloo 2", system-ui'; c.textAlign = 'center'; c.fillText('hay', W / 2, 88);
      } else if (S.cur) {
        var cu = S.cur, px = X0 + cu.col * CELL;
        if (S.phase === 'aim') {
          var tr = Math.max(colH(S, cu.col), colH(S, cu.col + 1)), gyy = gy - (tr + 1) * CELL;
          c.strokeStyle = 'rgba(255,255,255,.75)'; c.setLineDash([5, 4]); c.lineWidth = 2; k.rr(px + 2, gyy + 2, CELL * 2 - 4, CELL - 4, 8); c.stroke(); c.setLineDash([]);
          c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(px, by, CELL * 2, gy - by);
        }
        piece(k, px + 1, cu.y, CELL * 2 - 2, CELL - 2, cu.L, cu.t, 11, false);
      }
    },
    winChar: function (k, cx, cy, sc) { var c = k.ctx; if (!blk.complete) { return; } c.save(); c.translate(cx, cy + 40); c.scale(Math.max(.01, sc), Math.max(.01, sc)); c.drawImage(blk, -52, -108, 104, 109); c.restore(); }
  };
  window.GameKit(cfg, H, def);
};
