/* CHAI CẢM XÚC: game RÓT NƯỚC XẾP MÀU (kiểu Water Sort).
   5 cảm xúc (5 màu) đang lẫn lộn trong 7 chai. Chạm một chai để nhấc lên, chạm chai khác để rót.
   Chỉ rót được lên cùng màu hoặc vào chai trống. Xong khi mỗi chai chỉ còn một màu.
   Kết quả KHÔNG hỏi gì cả: lấy từ cách bạn chơi (nhanh hay chậm, rót nhầm, rót ngược, làm lại). */
window.runGame = function (cfg, H) {
  var CAP = 4, UH = 27, BW = 48, BH = CAP * UH + 12, NCOL = 5, NB = 7;
  var COL = ['#FFD84D', '#5C9BFF', '#FF6B6B', '#B084FF', '#5FD3A0'], NAME = ['Vui', 'Buồn', 'Giận', 'Sợ', 'Bình yên'];
  var XS = [[60, 140, 220, 300], [100, 180, 260]], Y1 = 150, Y2 = 150 + BH + 56, RESET = { x: 124, y: 0, w: 112, h: 34 }, bot;
  function bpos(i) { return i < 4 ? { x: XS[0][i], y: Y1 } : { x: XS[1][i - 4], y: Y2 }; }
  function top(b) { return b.length ? b[b.length - 1] : -1; }
  function run(b) { var n = 0, t = top(b); for (var i = b.length - 1; i >= 0 && b[i] === t; i--) { n++; } return n; }
  function can(S, a, b) { var A = S.b[a], B = S.b[b]; return a !== b && A.length > 0 && B.length < CAP && (B.length === 0 || top(B) === top(A)); }
  function useful(S, a, b) { if (!can(S, a, b)) { return false; } var A = S.b[a]; return !(S.b[b].length === 0 && run(A) === A.length); }
  function gen() {
    for (var tries = 0; tries < 50; tries++) {
      var u = [], b = [], i, j; for (var c = 0; c < NCOL; c++) { for (var n = 0; n < CAP; n++) { u.push(c); } }
      for (i = u.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); var t = u[i]; u[i] = u[j]; u[j] = t; }
      for (i = 0; i < NCOL; i++) { b.push(u.slice(i * CAP, i * CAP + CAP)); } b.push([], []);
      var solved = 0; b.forEach(function (x) { if (x.length === CAP && x.every(function (v) { return v === x[0]; })) { solved++; } });
      if (solved === 0) { return b; }
    }
    return b;
  }
  function face(c, t, x, y) {
    c.fillStyle = '#2B2350'; c.strokeStyle = '#2B2350'; c.lineWidth = 1.6; c.lineCap = 'round';
    if (t === 4) { c.beginPath(); c.arc(x - 6, y - 1, 2.4, .1 * Math.PI, .9 * Math.PI); c.stroke(); c.beginPath(); c.arc(x + 6, y - 1, 2.4, .1 * Math.PI, .9 * Math.PI); c.stroke(); }
    else { c.beginPath(); c.arc(x - 6, y - 1, 1.9, 0, 7); c.fill(); c.beginPath(); c.arc(x + 6, y - 1, 1.9, 0, 7); c.fill(); }
    c.beginPath();
    if (t === 0) { c.arc(x, y + 1, 5, .15 * Math.PI, .85 * Math.PI); }
    else if (t === 1) { c.arc(x, y + 8, 5, 1.15 * Math.PI, 1.85 * Math.PI); }
    else if (t === 2) { c.moveTo(x - 9, y - 6); c.lineTo(x - 3, y - 3); c.moveTo(x + 9, y - 6); c.lineTo(x + 3, y - 3); c.moveTo(x - 4, y + 5); c.lineTo(x + 4, y + 5); }
    else if (t === 3) { c.ellipse(x, y + 5, 2.6, 3.2, 0, 0, 7); }
    else { c.arc(x, y + 2, 3.6, .2 * Math.PI, .8 * Math.PI); }
    c.stroke();
  }
  function hit(S, p) {
    for (var i = 0; i < NB; i++) { var q = bpos(i); if (Math.abs(p.x - q.x) <= BW / 2 + 12 && p.y >= q.y - 22 && p.y <= q.y + BH + 10) { return i; } }
    return -1;
  }
  var def = {
    sub: 'Năm cảm xúc đang lẫn lộn trong các chai. Hãy giúp chúng về đúng chỗ, theo cách của bạn.',
    how: 'Chạm một chai để <b>nhấc lên</b>, chạm chai khác để <b>rót</b>. Chỉ rót được lên <b>cùng màu</b> hoặc vào <b>chai trống</b>. Xong khi mỗi chai chỉ còn <b>một màu</b>.',
    init: function (k) {
      bot = bot || k.charImg('bottle'); var b = gen(); RESET.y = Y2 + BH + 22;
      k.S = { b: b, init: b.map(function (x) { return x.slice(); }), sel: -1, lift: [0, 0, 0, 0, 0, 0, 0], moves: 0, invalid: 0, backs: 0, resets: 0, last: null, anim: null, t: 0, shake: 0, stuck: false, endT: 0, over: false, pos: bpos };
    },
    begin: function (k) {
      var S = k.S; k.legend(COL.map(function (c, i) { return '<span style="color:' + c + '">●</span> ' + NAME[i]; }).join(' · ')); k.progress(0);
    },
    down: function (k) {
      var S = k.S, p = k.ptr; if (S.over || S.anim) { return; }
      if (p.x >= RESET.x && p.x <= RESET.x + RESET.w && p.y >= RESET.y && p.y <= RESET.y + RESET.h) {
        S.b = S.init.map(function (x) { return x.slice(); }); S.sel = -1; S.resets++; S.last = null; S.stuck = false; k.hint('', 0); k.pop(180, RESET.y - 6, 'Làm lại từ đầu', '#fff'); k.beep(330, .12); return;
      }
      var i = hit(S, p); if (i < 0) { return; }
      if (S.sel < 0) { if (S.b[i].length) { S.sel = i; k.beep(520, .05, 'triangle', .04); } return; }
      if (S.sel === i) { S.sel = -1; return; }
      var a = S.sel;
      if (can(S, a, i)) {
        var n = Math.min(run(S.b[a]), CAP - S.b[i].length), col = top(S.b[a]);
        for (var m = 0; m < n; m++) { S.b[i].push(S.b[a].pop()); }
        S.moves++; if (S.last && S.last.f === i && S.last.t === a) { S.backs++; } S.last = { f: a, t: i };
        S.anim = { f: a, t: i, c: col, T: .3 }; S.sel = -1;
        var pa = bpos(i); k.burst(pa.x, pa.y + 4, COL[col], 6, 110); k.beep(420 + col * 70, .1, 'sine', .05);
        var sorted = true; S.b.forEach(function (x) { if (x.length && !(x.length === CAP && x.every(function (v) { return v === x[0]; }))) { sorted = false; } });
        if (sorted) { S.over = true; S.endT = .9; }
        else {
          var any = false; for (var u = 0; u < NB; u++) { for (var w = 0; w < NB; w++) { if (useful(S, u, w)) { any = true; } } }
          S.stuck = !any; if (S.stuck) { k.hint('Hết nước đi rồi. Bấm Làm lại nhé.', 0); }
        }
      } else {
        if (S.b[i].length) { S.invalid++; S.shake = .3; k.beep(150, .14, 'sawtooth', .04); S.sel = i; } else { S.sel = -1; }
      }
    },
    update: function (k, dt) {
      var S = k.S;
      if (k.mode === 'intro') { return; }
      if (k.mode !== 'play') { return; }
      if (!S.over) { S.t += dt; }
      if (S.anim) { S.anim.T -= dt; if (S.anim.T <= 0) { S.anim = null; } }
      if (S.shake > 0) { S.shake -= dt; }
      for (var i = 0; i < NB; i++) { var tg = S.sel === i ? 14 : 0; S.lift[i] += (tg - S.lift[i]) * Math.min(1, dt * 18); }
      var done = 0; S.b.forEach(function (x) { if (x.length === CAP && x.every(function (v) { return v === x[0]; })) { done++; } }); k.progress(done / NCOL);
      if (S.over) {
        S.endT -= dt;
        if (S.endT <= 0) {
          S.over = false; var avg = S.t / Math.max(1, S.moves), key;
          if (S.resets >= 1) { key = 'T'; }
          else if (avg < 1.4) { key = 'N'; }
          else if (S.invalid >= 3 || S.backs >= 2) { key = 'T'; }
          else if (S.moves <= 26 && S.invalid <= 2) { key = 'P'; }
          else { key = 'C'; }
          var secs = Math.round(S.t);
          k.end(key, 'Bạn xong sau <b>' + S.moves + '</b> lần rót (' + secs + ' giây, trung bình ' + avg.toFixed(1) + ' giây mỗi lần), rót nhầm <b>' + S.invalid + '</b> lần, rót ngược <b>' + S.backs + '</b> lần, làm lại <b>' + S.resets + '</b> lần.');
        }
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, S = k.S, gy = k.groundY;
      var g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#1F3A5F'); g.addColorStop(1, '#5B4B9A'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
      c.fillStyle = '#FFF6DC'; k.stars.forEach(function (s) { c.globalAlpha = .25 + .5 * Math.sin(k.T * 2 + s[2]); c.fillRect(s[0], 8 + s[1] * gy * .8, 1.6, 1.6); }); c.globalAlpha = 1;
      c.fillStyle = 'rgba(255,255,255,.07)'; k.rr(24, Y1 + BH - 10, W - 48, 14, 7); c.fill(); k.rr(64, Y2 + BH - 10, W - 128, 14, 7); c.fill();
      if (k.mode === 'intro') { var bob = Math.sin(k.T * 2) * 4; if (bot.complete) { c.drawImage(bot, W / 2 - 56, 150 + bob, 112, 118); } return; }
      for (var i = 0; i < NB; i++) {
        var q = bpos(i), x = q.x, y = q.y - S.lift[i], b = S.b[i], sh = (S.shake > 0 && S.sel === i) ? Math.sin(S.shake * 90) * 3 : 0; x += sh;
        c.fillStyle = 'rgba(255,255,255,.10)'; k.rr(x - BW / 2, y, BW, BH, 14); c.fill();
        for (var u = 0; u < b.length; u++) {
          var uy = y + BH - 6 - (u + 1) * UH; c.fillStyle = COL[b[u]]; k.rr(x - BW / 2 + 4, uy + 1, BW - 8, UH - 2, u === 0 ? 10 : 5); c.fill();
          face(c, b[u], x, uy + UH / 2);
        }
        c.strokeStyle = S.sel === i ? '#fff' : 'rgba(255,255,255,.55)'; c.lineWidth = S.sel === i ? 3 : 2; k.rr(x - BW / 2, y, BW, BH, 14); c.stroke();
        c.fillStyle = S.sel === i ? '#fff' : 'rgba(255,255,255,.55)'; k.rr(x - BW / 2 - 3, y - 6, BW + 6, 8, 3); c.fill();
      }
      if (S.anim) {
        var a = bpos(S.anim.f), d = bpos(S.anim.t), p = 1 - S.anim.T / .3; c.strokeStyle = COL[S.anim.c]; c.lineWidth = 6; c.lineCap = 'round'; c.globalAlpha = Math.sin(Math.min(1, p) * Math.PI);
        c.beginPath(); c.moveTo(a.x, a.y - 14); c.quadraticCurveTo((a.x + d.x) / 2, Math.min(a.y, d.y) - 50, d.x, d.y + 6); c.stroke(); c.globalAlpha = 1;
      }
      c.fillStyle = S.stuck ? '#FFB84D' : 'rgba(255,255,255,.18)'; k.rr(RESET.x, RESET.y, RESET.w, RESET.h, 17); c.fill();
      c.fillStyle = S.stuck ? '#3A2A00' : '#fff'; c.font = '700 13px "Be Vietnam Pro", system-ui'; c.textAlign = 'center'; c.fillText('Làm lại', RESET.x + RESET.w / 2, RESET.y + 22);
    },
    winChar: function (k, cx, cy, sc) { var c = k.ctx; if (!bot.complete) { return; } c.save(); c.translate(cx, cy + 40); c.scale(Math.max(.01, sc), Math.max(.01, sc)); c.drawImage(bot, -52, -108, 104, 109); c.restore(); }
  };
  window.GameKit(cfg, H, def);
};
