/* MẬT MÃ CƠ THỂ: game 5 CHẶNG về tuổi dậy thì cho 12-15 tuổi, mỗi chặng một cách chơi khác nhau, chữ rất ít.
   1 Hứng sự thật né lời đồn (kéo)   2 Chặn link lạ (chạm)   3 Nói KHÔNG đúng lúc (canh nhịp)
   4 Xếp việc vào ngăn riêng tư (kéo thả)   5 Đánh bại Bóng Xám bằng 3 nút (chạm đúng nút)
   Không có điểm đánh giá con người, chỉ có sao thưởng theo số lần chơi tốt. Không thu thập thông tin. */
window.runGame = function (cfg, H) {
  var F = '"Be Vietnam Pro", system-ui, sans-serif', FB = '"Baloo 2", system-ui, sans-serif', S, GRN = '#5FD3A0';
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function fit(c, t, w, base, wt) { var s = base; c.font = (wt || 700) + ' ' + s + 'px ' + F; while (s > 8 && c.measureText(t).width > w) { s -= .5; c.font = (wt || 700) + ' ' + s + 'px ' + F; } return s; }
  function text(c, t, x, y, size, col, al, font, wt) { c.font = (wt || 800) + ' ' + size + 'px ' + (font || FB); c.fillStyle = col; c.textAlign = al || 'center'; c.fillText(t, x, y); }
  function wrap(c, t, x, y, w, lh, size, col, wt) {
    c.font = (wt || 600) + ' ' + size + 'px ' + F; c.fillStyle = col; c.textAlign = 'center'; var words = t.split(' '), line = '', yy = y;
    words.forEach(function (wd) { var test = line ? line + ' ' + wd : wd; if (c.measureText(test).width > w && line) { c.fillText(line, x, yy); line = wd; yy += lh; } else { line = test; } });
    c.fillText(line, x, yy); return yy;
  }
  /* Đốm: ngôi sao nhỏ phát sáng */
  function dom(c, x, y, s, mood, t) {
    var bob = Math.sin((t || 0) * 4) * 2 * s; c.save(); c.translate(x, y + bob); c.scale(s, s);
    c.fillStyle = 'rgba(255,233,168,.35)'; c.beginPath(); c.arc(0, 0, 33, 0, 7); c.fill();
    c.fillStyle = '#FFD36E'; c.beginPath(); c.arc(0, 0, 24, 0, 7); c.fill();
    c.fillStyle = '#FFB84D'; c.beginPath(); for (var i = 0; i < 10; i++) { var a = Math.PI * i / 5 - Math.PI / 2, r = i % 2 ? 4.5 : 11; c.lineTo(Math.cos(a) * r, -30 + Math.sin(a) * r); } c.fill();
    c.fillStyle = '#24305E'; c.strokeStyle = '#24305E'; c.lineWidth = 2.4; c.lineCap = 'round';
    if (mood === 'oops') { c.beginPath(); c.moveTo(-12, -4); c.lineTo(-5, 0); c.moveTo(12, -4); c.lineTo(5, 0); c.stroke(); c.beginPath(); c.ellipse(0, 11, 4, 5, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(-8, -1, 3, 0, 7); c.fill(); c.beginPath(); c.arc(8, -1, 3, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-7, -2, 1, 0, 7); c.arc(9, -2, 1, 0, 7); c.fill(); c.beginPath(); c.arc(0, 6, mood === 'cheer' ? 8 : 6, .1 * Math.PI, .9 * Math.PI); c.stroke(); }
    c.fillStyle = 'rgba(255,120,140,.55)'; c.beginPath(); c.ellipse(-16, 7, 4, 2.6, 0, 0, 7); c.ellipse(16, 7, 4, 2.6, 0, 0, 7); c.fill(); c.restore();
  }
  /* Bóng Xám: nhân vật hay rủ rê */
  function bong(c, x, y, s, t, mad) {
    c.save(); c.translate(x, y + Math.sin((t || 0) * 3) * 2); c.scale(s, s);
    c.fillStyle = '#6B6F8F'; c.beginPath(); c.moveTo(-26, 26); c.quadraticCurveTo(-34, -26, 0, -30); c.quadraticCurveTo(34, -26, 26, 26); c.quadraticCurveTo(14, 18, 6, 28); c.quadraticCurveTo(0, 20, -6, 28); c.quadraticCurveTo(-14, 18, -26, 26); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-9, -4, 5, 6, 0, 0, 7); c.ellipse(9, -4, 5, 6, 0, 0, 7); c.fill();
    c.fillStyle = '#24305E'; c.beginPath(); c.arc(-8, -3, 2.6, 0, 7); c.arc(10, -3, 2.6, 0, 7); c.fill();
    c.strokeStyle = '#24305E'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-17, mad ? -15 : -12); c.lineTo(-3, mad ? -9 : -12); c.moveTo(17, mad ? -15 : -12); c.lineTo(3, mad ? -9 : -12); c.stroke();
    c.beginPath(); c.moveTo(-7, 12); c.quadraticCurveTo(0, 7, 7, 12); c.stroke(); c.restore();
  }
  function heart(c, x, y, s, on) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = on ? '#FF6B8A' : 'rgba(255,255,255,.25)'; c.beginPath(); c.moveTo(0, 6); c.bezierCurveTo(-14, -4, -8, -14, 0, -6); c.bezierCurveTo(8, -14, 14, -4, 0, 6); c.fill(); c.restore(); }
  function star(c, x, y, r, on) { c.fillStyle = on ? '#FFD36E' : 'rgba(255,255,255,.25)'; c.beginPath(); for (var i = 0; i < 10; i++) { var a = Math.PI * i / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.fill(); }
  function bubble(k, x, y, w, h, fill, stroke) { var c = k.ctx; c.fillStyle = fill; k.rr(x, y, w, h, 12); c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); } }

  /* ---------------------------------------------------------------- CÁC CHẶNG */
  var ST = [];
  /* 1. LỜI ĐỒN & SỰ THẬT: kéo Đốm sang trái phải */
  var FACTS = ['Ai cũng dậy thì', 'Mụn là bình thường', 'Mỗi người một tốc độ', 'Giọng đổi là thường', 'Cơ thể đổi dần dần'];
  var MYTHS = ['Chỉ mình mình lạ', 'Phải giấu kín', 'Mình bất thường', 'Ngại là hư'];
  ST[0] = {
    name: 'Lời đồn & Sự thật', r1: 'KÉO Đốm sang trái, phải', r2: 'Hứng SỰ THẬT (xanh), né LỜI ĐỒN (mây đen)', goal: 8, fact: 'Dậy thì ai cũng có, mỗi người một tốc độ.',
    init: function () { return { x: 180, items: [], sp: .6, got: 0 }; },
    update: function (k, dt, G) {
      G.x += (clamp(k.ptr.x, 36, 324) - G.x) * Math.min(1, dt * 14); G.sp -= dt;
      if (G.sp <= 0) { var f = Math.random() < .62; G.items.push({ x: 50 + Math.random() * 260, y: 90, f: f, t: f ? pick(FACTS) : pick(MYTHS), vy: 78 + G.got * 5 }); G.sp = .85; }
      var gy = k.groundY - 34;
      G.items.forEach(function (it) {
        it.y += it.vy * dt;
        if (!it.gone && it.y > gy - 30 && it.y < gy + 30 && Math.abs(it.x - G.x) < 62) {
          it.gone = true;
          if (it.f) { G.got++; k.burst(it.x, it.y, GRN, 10, 170); k.pop(it.x, it.y - 20, '+1', '#CFFFE5'); k.beep(600 + G.got * 40, .09, 'triangle', .05); } else { hit(k, it.x, it.y); }
        }
      });
      G.items = G.items.filter(function (i) { return !i.gone && i.y < k.HH; });
      if (G.got >= this.goal) { win(k); }
    },
    prog: function (G) { return G.got / this.goal; },
    draw: function (k, G) {
      var c = k.ctx, W = k.W, gy = k.groundY, g = c.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, '#2B3F86'); g.addColorStop(1, '#79C7D8'); c.fillStyle = g; c.fillRect(0, 0, W, k.HH);
      c.fillStyle = '#4F9B7D'; c.beginPath(); c.moveTo(0, gy); c.quadraticCurveTo(90, gy - 50, 190, gy - 14); c.quadraticCurveTo(280, gy - 44, W, gy - 8); c.lineTo(W, k.HH); c.lineTo(0, k.HH); c.fill();
      G.items.forEach(function (it) {
        if (it.f) { bubble(k, it.x - 56, it.y - 17, 112, 34, '#E7FFF2', GRN); fit(c, it.t, 100, 11.5); c.fillStyle = '#17604A'; c.textAlign = 'center'; c.fillText(it.t, it.x, it.y + 4); }
        else { c.fillStyle = '#3B3F63'; c.beginPath(); c.ellipse(it.x, it.y, 58, 22, 0, 0, 7); c.ellipse(it.x - 30, it.y + 4, 24, 16, 0, 0, 7); c.ellipse(it.x + 30, it.y + 4, 24, 16, 0, 0, 7); c.fill(); fit(c, it.t, 98, 11.5); c.fillStyle = '#E3E6FF'; c.textAlign = 'center'; c.fillText(it.t, it.x, it.y + 4); }
      });
      dom(c, G.x, gy - 30, 1.15, S.hurt > 0 ? 'oops' : 'happy', k.T);
    }
  };
  /* 2. LINK LẠ: chạm để chặn tin nhắn đang chạy về phía Đốm */
  var BAD = ['Xem đi, hay lắm!', 'Link này ai cũng xem', 'Bấm đi, đừng nói ai', 'Phim hay lắm, bấm nè'];
  var GOOD = ['Mai nộp bài nha', 'Đá bóng không?', 'Ảnh mèo nè', 'Học nhóm chiều nay'];
  var LANEY = [128, 204, 280, 356];
  ST[1] = {
    name: 'Link lạ', r1: 'CHẠM để chặn tin lạ có dấu 18+', r2: 'Đừng chặn tin của bạn tốt (nền sáng)', goal: 8, fact: 'Link lạ thì không bấm, không chuyển tiếp.',
    init: function () { return { ms: [], sp: .5, got: 0, ln: [0, 0, 0, 0] }; },
    update: function (k, dt, G) {
      G.sp -= dt; var spd = 44 + G.got * 3.5;
      if (G.sp <= 0) { var l = Math.floor(Math.random() * 4); if (k.T - G.ln[l] > 1.8) { G.ln[l] = k.T; var bad = Math.random() < .55; G.ms.push({ x: k.W + 20, l: l, bad: bad, t: bad ? pick(BAD) : pick(GOOD) }); } G.sp = .8; }
      G.ms.forEach(function (m) { m.x -= spd * dt; if (m.x < 92) { m.gone = true; if (m.bad) { hit(k, 92, LANEY[m.l]); } } });
      G.ms = G.ms.filter(function (m) { return !m.gone; });
      if (G.got >= this.goal) { win(k); }
    },
    down: function (k, G) {
      var p = k.ptr;
      for (var i = G.ms.length - 1; i >= 0; i--) {
        var m = G.ms[i], y = LANEY[m.l];
        if (p.x > m.x - 4 && p.x < m.x + 164 && Math.abs(p.y - y) < 32) {
          G.ms.splice(i, 1);
          if (m.bad) { G.got++; k.burst(m.x + 70, y, '#FF8FA8', 12, 190); k.pop(m.x + 70, y - 22, 'Đã chặn!', '#FFD0DC'); k.beep(700, .09, 'square', .04); }
          else { hit(k, m.x + 70, y, 'Tin bạn tốt mà!'); }
          return;
        }
      }
    },
    prog: function (G) { return G.got / this.goal; },
    draw: function (k, G) {
      var c = k.ctx, W = k.W, g = c.createLinearGradient(0, 0, 0, k.HH); g.addColorStop(0, '#2A2154'); g.addColorStop(1, '#4A3380'); c.fillStyle = g; c.fillRect(0, 0, W, k.HH);
      LANEY.forEach(function (y) { c.fillStyle = 'rgba(255,255,255,.06)'; c.fillRect(0, y - 26, W, 52); });
      c.fillStyle = 'rgba(255,210,120,.28)'; c.fillRect(84, 92, 3, 292);
      dom(c, 42, 240, 1.2, S.hurt > 0 ? 'oops' : 'happy', k.T);
      G.ms.forEach(function (m) {
        var y = LANEY[m.l];
        if (m.bad) { bubble(k, m.x, y - 22, 160, 44, '#4A1E48', '#FF6B8A'); c.fillStyle = '#FF6B8A'; c.beginPath(); c.arc(m.x + 24, y, 15, 0, 7); c.fill(); text(c, '18+', m.x + 24, y + 4.5, 12, '#fff'); fit(c, m.t, 100, 11.5); c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText(m.t, m.x + 46, y + 4); }
        else { bubble(k, m.x, y - 22, 160, 44, '#F2FBFF', '#9ED8F0'); c.fillStyle = GRN; c.beginPath(); c.arc(m.x + 20, y, 7, 0, 7); c.fill(); fit(c, m.t, 120, 11.5); c.fillStyle = '#24305E'; c.textAlign = 'left'; c.fillText(m.t, m.x + 36, y + 4); }
      });
    }
  };
  /* 3. NÓI KHÔNG: chạm khi vạch chạy vào vùng xanh */
  var PUSH = ['Cho xem thử đi, chỉ tụi mình biết!', 'Ai cũng làm mà, không dám à?', 'Hứa không nói ai đâu!'];
  var NO = ['Mình không muốn!', 'Mình thấy không thoải mái.', 'Dừng lại, mình nói không!'];
  ST[2] = {
    name: 'Nói KHÔNG', r1: 'CHẠM khi vạch trắng chạy vào vùng XANH', r2: 'Đúng lúc là Đốm nói KHÔNG, đẩy Bóng Xám đi', goal: 3, fact: 'Bạn luôn có quyền nói KHÔNG.',
    init: function () { return k_round({ round: 0, m: 0, dir: 1, step: 0, ph: 'aim', pt: 0, bx: 300 }); },
    update: function (k, dt, G) {
      if (G.ph === 'aim') { G.m += G.dir * dt * (.9 + G.round * .25); if (G.m > 1) { G.m = 1; G.dir = -1; } if (G.m < 0) { G.m = 0; G.dir = 1; } G.bx += (300 - G.step * 36 - G.bx) * Math.min(1, dt * 5); }
      else if (G.ph === 'ok') { G.pt += dt; G.bx += 260 * dt; if (G.pt > 1) { G.round++; if (G.round >= this.goal) { win(k); } else { k_round(G); } } }
      else if (G.ph === 'miss') { G.pt += dt; if (G.pt > .6) { G.ph = 'aim'; } }
    },
    down: function (k, G) {
      if (G.ph !== 'aim') { return; }
      if (G.m >= G.z0 && G.m <= G.z1) { G.ph = 'ok'; G.pt = 0; G.say = NO[G.round % 3]; k.burst(150, 330, '#9FE8FF', 18, 220); k.beep(780, .18, 'triangle', .07); }
      else { G.ph = 'miss'; G.pt = 0; G.step++; k.pop(180, 440, 'Chưa đúng lúc!', '#FFD0DC'); k.beep(200, .15, 'sawtooth', .04); if (G.step >= 3) { G.step = 0; hit(k, 150, 330); } }
    },
    prog: function (G) { return G.round / this.goal; },
    draw: function (k, G) {
      var c = k.ctx, W = k.W, g = c.createLinearGradient(0, 0, 0, k.HH); g.addColorStop(0, '#2B3A7A'); g.addColorStop(1, '#6D5AB5'); c.fillStyle = g; c.fillRect(0, 0, W, k.HH);
      c.strokeStyle = 'rgba(159,232,255,.6)'; c.lineWidth = 3; c.setLineDash([7, 6]); c.beginPath(); c.arc(110, 330, 82, 0, 7); c.stroke(); c.setLineDash([]);
      text(c, 'vùng riêng của mình', 110, 232, 11, 'rgba(255,255,255,.7)', 'center', F, 600);
      if (G.ph === 'ok') { c.fillStyle = 'rgba(159,232,255,' + (.35 - G.pt * .2) + ')'; c.beginPath(); c.arc(110, 330, 82 + G.pt * 40, 0, 7); c.fill(); }
      dom(c, 110, 332, 1.5, G.ph === 'ok' ? 'cheer' : (G.ph === 'miss' ? 'oops' : 'happy'), k.T);
      bong(c, G.bx, 330, 1.5, k.T, G.ph !== 'ok');
      if (G.ph === 'ok') { bubble(k, 40, 168, 190, 40, '#fff', GRN); fit(c, G.say, 176, 14, 800); c.fillStyle = '#17604A'; c.textAlign = 'center'; c.fillText(G.say, 135, 193); }
      else { bubble(k, 80, 162, 240, 44, '#3A3F63', '#8A90C0'); fit(c, PUSH[G.round % 3], 224, 13, 700); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(PUSH[G.round % 3], 200, 189); }
      var bx = 40, bw = 280, by = 450; c.fillStyle = 'rgba(255,255,255,.16)'; k.rr(bx, by, bw, 26, 13); c.fill(); c.fillStyle = GRN; k.rr(bx + G.z0 * bw, by, (G.z1 - G.z0) * bw, 26, 13); c.fill();
      c.fillStyle = '#fff'; k.rr(bx + G.m * bw - 4, by - 7, 8, 40, 4); c.fill();
      text(c, 'Chạm khi vạch vào vùng xanh', 180, by + 54, 12, 'rgba(255,255,255,.8)', 'center', F, 600);
      for (var i = 0; i < 3; i++) { star(c, 150 + i * 30, 120, 11, i < G.round); }
    }
  };
  function k_round(G) { var w = [.3, .22, .16][clamp(G.round, 0, 2)], z = .22 + Math.random() * (.78 - w - .22); G.z0 = z; G.z1 = z + w; G.ph = 'aim'; G.pt = 0; G.m = Math.random() < .5 ? 0 : 1; G.dir = G.m ? -1 : 1; G.step = 0; G.bx = 300; return G; }
  /* 4. NGĂN RIÊNG TƯ: kéo thẻ vào đúng ngăn */
  var BINS = [{ n: 'Riêng tư', c: '#9FB0FF' }, { n: 'Nói người lớn', c: GRN }, { n: 'Không chia sẻ', c: '#FF9AAE' }];
  var CARDS = [['Tự khám phá cơ thể', 0, 'Bình thường, chỉ ở nơi kín đáo.'], ['Thay đồ, tắm', 0, 'Cơ thể là của riêng mình.'], ['Thấy đau, bị thương', 1, 'Nói người lớn, đừng chịu một mình.'], ['Bị ép làm điều không muốn', 1, 'Không phải lỗi của bạn. Gọi 111 nếu cần.'], ['Ảnh cơ thể của mình', 2, 'Gửi đi là không thu lại được.'], ['Link người lớn bạn gửi', 2, 'Là nội dung 18+, đừng chuyển tiếp.']];
  var BIN_X = [66, 180, 294], BIN_Y = 400;
  ST[3] = {
    name: 'Ngăn riêng tư', r1: 'KÉO thẻ vào đúng ngăn bên dưới', r2: 'Hoặc chạm thẳng vào ngăn bạn chọn', goal: 6, fact: 'Chuyện riêng thì giữ kín, lo lắng thì hỏi người lớn.',
    init: function () { var o = CARDS.slice().sort(function () { return Math.random() - .5; }); return { o: o, i: 0, x: 180, y: 210, drag: false, toast: '', tt: 0, ok: 0 }; },
    answer: function (k, G, b) {
      var cd = G.o[G.i];
      if (cd[1] === b) { G.toast = cd[2]; G.tt = 2; G.i++; G.ok++; G.x = 180; G.y = 210; k.burst(BIN_X[b], BIN_Y, BINS[b].c, 14, 200); k.beep(640, .1, 'triangle', .06); if (G.i >= this.goal) { win(k); } }
      else { G.x = 180; G.y = 210; hit(k, BIN_X[b], BIN_Y, 'Thử ngăn khác nhé'); }
    },
    update: function (k, dt, G) { if (G.drag) { G.x = k.ptr.x; G.y = k.ptr.y; } G.tt -= dt; },
    down: function (k, G) {
      var p = k.ptr;
      if (p.y > BIN_Y - 10) { for (var b = 0; b < 3; b++) { if (Math.abs(p.x - BIN_X[b]) < 54) { this.answer(k, G, b); return; } } }
      if (Math.abs(p.x - G.x) < 90 && Math.abs(p.y - G.y) < 36) { G.drag = true; }
    },
    up: function (k, G) {
      if (!G.drag) { return; } G.drag = false;
      if (G.y > BIN_Y - 40) { for (var b = 0; b < 3; b++) { if (Math.abs(G.x - BIN_X[b]) < 56) { this.answer(k, G, b); return; } } }
      G.x = 180; G.y = 210;
    },
    prog: function (G) { return G.i / this.goal; },
    draw: function (k, G) {
      var c = k.ctx, W = k.W, g = c.createLinearGradient(0, 0, 0, k.HH); g.addColorStop(0, '#1F3A5F'); g.addColorStop(1, '#4F4B96'); c.fillStyle = g; c.fillRect(0, 0, W, k.HH);
      BINS.forEach(function (b, i) { var x = BIN_X[i] - 52; c.fillStyle = 'rgba(255,255,255,.1)'; k.rr(x, BIN_Y, 104, 92, 14); c.fill(); c.fillStyle = b.c; k.rr(x, BIN_Y, 104, 30, 14); c.fill(); c.fillRect(x, BIN_Y + 16, 104, 14); fit(c, b.n, 92, 13, 800); c.fillStyle = '#24305E'; c.textAlign = 'center'; c.fillText(b.n, BIN_X[i], BIN_Y + 20); });
      dom(c, 180, 130, .8, 'happy', k.T);
      if (G.i < this.goal) { var cd = G.o[G.i]; c.fillStyle = 'rgba(0,0,0,.25)'; k.rr(G.x - 84, G.y - 24, 168, 56, 14); c.fill(); c.fillStyle = '#FFF6DA'; k.rr(G.x - 84, G.y - 28, 168, 56, 14); c.fill(); c.strokeStyle = '#F4DD9A'; c.lineWidth = 2; c.stroke(); fit(c, cd[0], 148, 14, 800); c.fillStyle = '#24305E'; c.textAlign = 'center'; c.fillText(cd[0], G.x, G.y + 5); if (!G.drag && k.T < 8) { text(c, 'kéo xuống', 180, G.y + 52, 11, 'rgba(255,255,255,.75)', 'center', F, 600); } }
      if (G.tt > 0) { bubble(k, 24, 290, 312, 44, '#fff', GRN); fit(c, G.toast, 296, 13, 700); c.fillStyle = '#17604A'; c.textAlign = 'center'; c.fillText(G.toast, 180, 317); }
    }
  };
  /* 5. BÓNG XÁM: 3 nút, mỗi lời dụ một cách đáp */
  var BTN = [{ n: 'Từ chối', c: '#FF9A8B' }, { n: 'Chặn', c: '#7DB6FF' }, { n: 'Kể người lớn', c: GRN }];
  var LURE = [[0, 'Bạn dễ thương quá, gửi ảnh đi'], [0, 'Mình hứa không ai biết đâu'], [0, 'Chỉ riêng mình thôi mà'], [1, 'Gửi ảnh riêng tư cho mình'], [1, 'Mình là người lạ, kết bạn nhé'], [1, 'Bấm link này nè'], [2, 'Không gửi là mình đăng ảnh bạn'], [2, 'Nói ai là biết tay!'], [2, 'Gửi ngay không thì hối hận']];
  ST[4] = {
    name: 'Bóng Xám', r1: 'CHẠM đúng nút cho từng lời dụ', r2: 'Dỗ ngọt: Từ chối · Người lạ: Chặn · Đe dọa: Kể người lớn', goal: 9, fact: 'Ảnh riêng tư không bao giờ gửi. Có chuyện, nói người lớn.',
    init: function () { return { items: [], sp: 1, hp: 9, last: -1 }; },
    update: function (k, dt, G) {
      G.sp -= dt; var spd = 46 + (9 - G.hp) * 4;
      if (G.sp <= 0 && G.items.length < 2) { var l = pick(LURE); if (l[0] === G.last && Math.random() < .5) { l = pick(LURE); } G.last = l[0]; G.items.push({ y: 215, x: 90 + Math.random() * 180, ty: l[0], t: l[1] }); G.sp = 2.4 - (9 - G.hp) * .1; }
      G.items.forEach(function (it) { it.y += spd * dt; if (it.y > k.groundY - 130) { it.gone = true; hit(k, it.x, k.groundY - 130); } });
      G.items = G.items.filter(function (i) { return !i.gone; });
    },
    down: function (k, G) {
      var p = k.ptr, by = k.groundY - 84;
      if (p.y < by - 8) { return; }
      for (var b = 0; b < 3; b++) {
        if (Math.abs(p.x - (66 + b * 114)) < 54) {
          var it = G.items[0]; if (!it) { return; }
          if (it.ty === b) { G.items.shift(); G.hp--; k.burst(it.x, it.y, BTN[b].c, 14, 200); k.pop(it.x, it.y - 24, 'Trúng!', '#fff'); k.beep(600 + b * 120, .1, 'triangle', .06); if (G.hp <= 0) { win(k); } }
          else { hit(k, it.x, it.y, 'Sai nút rồi!'); G.items.shift(); }
          return;
        }
      }
    },
    prog: function (G) { return 1 - G.hp / this.goal; },
    draw: function (k, G) {
      var c = k.ctx, W = k.W, gy = k.groundY, g = c.createLinearGradient(0, 0, 0, k.HH); g.addColorStop(0, '#241E4A'); g.addColorStop(1, '#4B2F78'); c.fillStyle = g; c.fillRect(0, 0, W, k.HH);
      bong(c, 180, 128, 1.6, k.T, true);
      c.fillStyle = 'rgba(255,255,255,.18)'; k.rr(70, 176, 220, 8, 4); c.fill(); c.fillStyle = '#FF6B8A'; k.rr(70, 176, 220 * G.hp / this.goal, 8, 4); c.fill();
      G.items.forEach(function (it) { bubble(k, it.x - 84, it.y - 22, 168, 44, '#3A2A5E', '#B89CFF'); fit(c, it.t, 152, 12.5); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(it.t, it.x, it.y + 4); });
      dom(c, 180, gy - 108, 1, S.hurt > 0 ? 'oops' : 'happy', k.T);
      BTN.forEach(function (b, i) { var x = 66 + i * 114 - 52, y = gy - 84; c.fillStyle = 'rgba(0,0,0,.25)'; k.rr(x, y + 4, 104, 54, 14); c.fill(); c.fillStyle = b.c; k.rr(x, y, 104, 54, 14); c.fill(); fit(c, b.n, 92, 14, 800); c.fillStyle = '#24305E'; c.textAlign = 'center'; c.fillText(b.n, x + 52, y + 33); });
    }
  };

  /* ---------------------------------------------------------------- KHUNG CHẶNG */
  function hit(k, x, y, msg) { S.lives--; S.hurt = .5; k.pop(x, y - 24, msg || 'Ối!', '#FFD0DC'); k.burst(x, y, '#FF8FA8', 8, 130); k.beep(160, .2, 'sawtooth', .05); if (S.lives <= 0 && S.ph === 'play') { S.ph = 'retry'; S.t = 0; } }
  function win(k) { if (S.ph !== 'play') { return; } S.stars[S.st] = Math.max(1, S.lives); S.ph = 'done'; S.t = 0; [523, 659, 784, 1047].forEach(function (f, i) { k.later(function () { k.beep(f, .2, 'triangle', .06); }, i * 110); }); for (var i = 0; i < 20; i++) { k.parts.push({ x: 180 + (Math.random() - .5) * 120, y: 280, vx: (Math.random() - .5) * 260, vy: -80 - Math.random() * 220, life: 1.2, c: ['#FFD36E', '#FF9AAE', '#9FE8FF', GRN][i % 4], r: 3 }); } }
  function begin(k, i, banner) { S.st = i; S.lives = 3; S.G = ST[i].init(); S.ph = banner === false ? 'play' : 'banner'; S.t = 0; k.progress(i / 5); k.hint(''); }
  function totalStars() { return S.stars.reduce(function (a, b) { return a + b; }, 0); }

  var def = {
    sub: 'Đốm là ngôi sao nhỏ muốn giải mã những điều lạ lạ khi lớn lên. Bạn giúp Đốm qua 5 chặng nhé.',
    how: '5 chặng, mỗi chặng một cách chơi. Chạm, kéo hoặc canh nhịp theo hướng dẫn hiện trên màn hình. Mất 3 tim là thử lại chặng đó.',
    init: function (k) { S = k.S = { st: 0, ph: 'intro', t: 0, lives: 3, stars: [0, 0, 0, 0, 0], hurt: 0, G: ST[0].init() }; },
    begin: function (k) { begin(k, 0); },
    down: function (k) {
      if (S.ph === 'banner' && S.t > .8) { S.ph = 'play'; S.t = 0; return; }
      if (S.ph === 'done' && S.t > 1) { S.t = 99; return; }
      if (S.ph === 'play' && ST[S.st].down) { ST[S.st].down(k, S.G); }
    },
    up: function (k) { if (S.ph === 'play' && ST[S.st].up) { ST[S.st].up(k, S.G); } },
    update: function (k, dt) {
      if (k.mode === 'intro') { S.t += dt; return; }
      if (k.mode !== 'play') { return; }
      S.t += dt; if (S.hurt > 0) { S.hurt -= dt; }
      var st = ST[S.st];
      if (S.ph === 'banner' && S.t > 3.2) { S.ph = 'play'; S.t = 0; }
      else if (S.ph === 'play') { st.update(k, dt, S.G); k.progress((S.st + st.prog(S.G)) / 5); }
      else if (S.ph === 'retry' && S.t > 1.6) { begin(k, S.st, false); }
      else if (S.ph === 'done' && S.t > 3) {
        if (S.st < 4) { begin(k, S.st + 1); }
        else { S.ph = 'over'; var tot = totalStars(); k.end('ok', 'Bạn gom được <b>' + tot + '/15 sao</b> trên 5 chặng.'); }
      }
    },
    draw: function (k) {
      var c = k.ctx, W = k.W, HH = k.HH, G = S.G, st = ST[S.st];
      if (k.mode === 'intro' || S.ph === 'intro') {
        var g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#2B3F86'); g.addColorStop(1, '#79C7D8'); c.fillStyle = g; c.fillRect(0, 0, W, HH);
        c.fillStyle = '#FFF6DC'; k.stars.forEach(function (s) { c.globalAlpha = .3 + .5 * Math.sin(k.T * 2 + s[2]); c.fillRect(s[0], 8 + s[1] * 200, 1.6, 1.6); }); c.globalAlpha = 1;
        dom(c, W / 2, 190, 2.3, 'happy', S.t); return;
      }
      st.draw(k, G);
      for (var i = 0; i < 3; i++) { heart(c, 22 + i * 26, 68, 1.2, i < S.lives); }
      text(c, 'Chặng ' + (S.st + 1) + '/5', W / 2, 73, 13, 'rgba(255,255,255,.9)', 'center', FB, 800);
      for (var j = 0; j < 5; j++) { star(c, 244 + j * 20, 68, 8, S.stars[j] > 0); }
      if (S.ph === 'banner') {
        var a = Math.min(1, S.t * 3); c.fillStyle = 'rgba(14,18,50,' + (.82 * a) + ')'; c.fillRect(0, 0, W, HH);
        c.globalAlpha = a; dom(c, W / 2, 168, 1.5, 'happy', k.T); text(c, 'Chặng ' + (S.st + 1), W / 2, 262, 17, '#FFD36E'); text(c, st.name, W / 2, 304, 31, '#fff');
        c.fillStyle = 'rgba(255,255,255,.12)'; k.rr(30, 330, 300, 124, 18); c.fill(); c.font = '800 17px ' + FB; var r1s = 17; while (r1s > 11 && c.measureText(st.r1).width > 276) { r1s -= .5; c.font = '800 ' + r1s + 'px ' + FB; } text(c, st.r1, W / 2, 372, r1s, '#9FE8FF', 'center', FB, 800); wrap(c, st.r2, W / 2, 406, 262, 22, 14.5, '#fff', 600);
        text(c, 'Chạm để bắt đầu', W / 2, 500, 13, 'rgba(255,255,255,.7)', 'center', F, 600); c.globalAlpha = 1;
      } else if (S.ph === 'retry') {
        c.fillStyle = 'rgba(14,18,50,.78)'; c.fillRect(0, 0, W, HH); dom(c, W / 2, 250, 1.6, 'oops', k.T); text(c, 'Thử lại nào!', W / 2, 340, 28, '#fff'); text(c, 'Đốm tin bạn làm được', W / 2, 372, 14, 'rgba(255,255,255,.8)', 'center', F, 600);
      } else if (S.ph === 'done') {
        c.fillStyle = 'rgba(14,18,50,.8)'; c.fillRect(0, 0, W, HH); dom(c, W / 2, 190, 1.6, 'cheer', k.T); text(c, 'Qua chặng ' + (S.st + 1) + '!', W / 2, 290, 30, '#FFD36E');
        for (var s = 0; s < 3; s++) { star(c, 130 + s * 50, 336 - Math.abs(s - 1) * 0, 20, s < S.stars[S.st]); }
        c.fillStyle = 'rgba(255,255,255,.12)'; k.rr(30, 380, 300, 92, 18); c.fill(); wrap(c, st.fact, W / 2, 418, 262, 22, 15, '#fff', 700);
      }
    },
    winChar: function (k, cx, cy, sc) { dom(k.ctx, cx, cy + 20, 1.8 * Math.max(.05, sc), 'cheer', k.T); }
  };
  window.GameKit(cfg, H, def);
};
