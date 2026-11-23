/* Bộ máy chung cho cả series trò chơi. Nội dung nằm ở games.js.
   Trang trò chơi chỉ cần: <main class="stage" id="stage"></main>, đặt window.GAME_ID = 'mam' | 'cao' | 'cu' | 'en' | 'gau' | 'hub'. */
(function () {
  'use strict';
  var SITE = 'https://sophianguyen.com.vn';
  var NS = 'http://www.w3.org/2000/svg';
  var GAMES = window.GAMES, ORDER = window.GAME_ORDER, ID = window.GAME_ID || 'mam';
  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function track(name, params) { try { if (window.gtag) { var p = params || {}; p.game = ID; window.gtag('event', name, p); } } catch (e) {} }

  /* ---------------------------------------------------------------- Hình vẽ nhân vật */
  var BODY = {
    sprout: { body: '#8FE3B0', belly: '#BDF3D2', feet: '#4FAE7C' },
    fox: { body: '#F08A3E', belly: '#FFE6C8', feet: '#C9672A' },
    owl: { body: '#A98767', belly: '#EBD9BE', feet: '#F2B53C' },
    bird: { body: '#5B8DE0', belly: '#EAF2FF', feet: '#F5A93A' },
    bear: { body: '#B27A4E', belly: '#E9CFA8', feet: '#8E5C36' }
  };
  function behind(kind, c) {
    if (kind === 'fox') {
      return '<path d="M92 120 C 122 118 126 80 108 70 C 112 92 100 100 88 104Z" fill="' + c.body + '"/><path d="M108 70 C 114 76 118 84 117 92 C 112 86 109 80 108 70Z" fill="#fff"/>' +
        '<polygon points="26,70 32,30 58,54" fill="' + c.body + '"/><polygon points="94,70 88,30 62,54" fill="' + c.body + '"/>' +
        '<polygon points="33,60 35,40 49,54" fill="#3B2A22"/><polygon points="87,60 85,40 71,54" fill="#3B2A22"/>';
    }
    if (kind === 'owl') {
      return '<polygon points="28,68 30,36 54,56" fill="' + c.body + '"/><polygon points="92,68 90,36 66,56" fill="' + c.body + '"/>' +
        '<ellipse cx="27" cy="104" rx="10" ry="22" fill="#8A6B4D" transform="rotate(12 27 104)"/><ellipse cx="93" cy="104" rx="10" ry="22" fill="#8A6B4D" transform="rotate(-12 93 104)"/>';
    }
    if (kind === 'bird') {
      return '<polygon points="84,118 116,132 112,112" fill="#3F6FC4"/><path d="M54 58 C 52 46 58 40 64 44 C 62 48 63 52 66 58Z" fill="#3F6FC4"/>';
    }
    if (kind === 'bear') {
      return '<circle cx="30" cy="64" r="13" fill="' + c.body + '"/><circle cx="90" cy="64" r="13" fill="' + c.body + '"/>' +
        '<circle cx="30" cy="65" r="6.5" fill="' + c.belly + '"/><circle cx="90" cy="65" r="6.5" fill="' + c.belly + '"/>';
    }
    return '';
  }
  function front(kind, c) {
    if (kind === 'fox') {
      return '<ellipse cx="60" cy="110" rx="22" ry="17" fill="' + c.belly + '"/><ellipse cx="60" cy="100" rx="4.6" ry="3.2" fill="#2A1B18"/>';
    }
    if (kind === 'owl') {
      return '<circle cx="47" cy="90" r="13.4" fill="#F6E7C6"/><circle cx="73" cy="90" r="13.4" fill="#F6E7C6"/>';
    }
    if (kind === 'bird') {
      return '<ellipse cx="88" cy="108" rx="9" ry="19" fill="#3F6FC4" transform="rotate(-10 88 108)"/>';
    }
    if (kind === 'bear') {
      return '<ellipse cx="60" cy="108" rx="18" ry="14" fill="' + c.belly + '"/><ellipse cx="60" cy="101" rx="5.2" ry="3.6" fill="#2A1B18"/>';
    }
    return '<ellipse cx="54" cy="108" rx="20" ry="24" fill="' + c.belly + '" opacity=".65"/>';
  }
  function beak(kind) {
    if (kind === 'owl') { return '<polygon points="55,98 65,98 60,109" fill="#F2B53C"/>'; }
    if (kind === 'bird') { return '<polygon points="53,99 67,99 60,110" fill="#F5A93A"/>'; }
    return '';
  }
  /* id: gắn thêm vào để nhiều nhân vật trên cùng trang (trang chủ) không trùng id */
  function extraThumb(kind) {
    var face = '<circle cx="48" cy="92" r="4.2" fill="#14213D"/><circle cx="72" cy="92" r="4.2" fill="#14213D"/><circle cx="49.4" cy="90.6" r="1.3" fill="#fff"/><circle cx="73.4" cy="90.6" r="1.3" fill="#fff"/><path d="M52 102 Q60 110 68 102" stroke="#14213D" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="38" cy="100" rx="5" ry="3" fill="#FF9FA8" opacity=".7"/><ellipse cx="82" cy="100" rx="5" ry="3" fill="#FF9FA8" opacity=".7"/>';
    var body = kind === 'block'
      ? '<rect x="28" y="124" width="64" height="20" rx="5" fill="#9FB0FF"/><rect x="34" y="104" width="64" height="20" rx="5" fill="#FFD36E"/><rect x="26" y="52" width="68" height="52" rx="10" fill="#FF9A8B"/>'
      : '<rect x="50" y="34" width="20" height="18" rx="4" fill="#E8F1FF"/><rect x="46" y="30" width="28" height="8" rx="3" fill="#B084FF"/><path d="M50 50 Q26 62 26 92 L26 134 Q26 146 38 146 L82 146 Q94 146 94 134 L94 92 Q94 62 70 50Z" fill="#E8F1FF" opacity=".9"/><path d="M28 112 L92 112 L92 134 Q92 144 82 144 L38 144 Q28 144 28 134Z" fill="#5C9BFF"/><path d="M28 112 L60 104 L92 112 L92 120 L28 120Z" fill="#FFD84D"/>';
    return '<svg viewBox="0 24 120 126" aria-hidden="true"><ellipse cx="60" cy="148" rx="30" ry="4" fill="rgba(0,0,0,.2)"/><g class="bob">' + body + face + '</g></svg>';
  }
  function charSVG(kind, uid, withParts) {
    if (kind === 'block' || kind === 'bottle') { return extraThumb(kind); }
    var c = BODY[kind], eyeFront = kind === 'owl';
    var hasMouth = kind !== 'owl' && kind !== 'bird';
    var s = '<svg viewBox="' + (withParts ? '0 -52 120 202' : '0 24 120 126') + '" aria-hidden="true"' + (uid ? ' id="' + uid + 'Svg"' : '') + '>' +
      '<ellipse cx="60" cy="141" rx="28" ry="5" fill="rgba(0,0,0,.28)"/><g class="bob">' +
      behind(kind, c) +
      '<ellipse cx="45" cy="137" rx="10" ry="5.4" fill="' + c.feet + '"/><ellipse cx="75" cy="137" rx="10" ry="5.4" fill="' + c.feet + '"/>';
    if (kind === 'sprout' && withParts) {
      s += '<g class="sprout" id="sprout"><path id="stem" d="M60 60 L60 46" stroke="#4FAE7C" stroke-width="4.5" stroke-linecap="round" fill="none"/><g id="leaves"></g></g>';
    }
    if (withParts) { s += '<g class="reward" id="reward"></g>'; }
    s += '<ellipse cx="60" cy="98" rx="35" ry="41" fill="' + c.body + '"/>' + front(kind, c) + beak(kind) +
      '<circle cx="47" cy="90" r="8.4" fill="#fff"/><circle cx="73" cy="90" r="8.4" fill="#fff"/>' +
      '<circle ' + (uid ? '' : '') + 'class="pl" cx="48" cy="91" r="4.3" fill="#14213D"/><circle class="pr" cx="74" cy="91" r="4.3" fill="#14213D"/>' +
      '<circle cx="49.5" cy="89" r="1.4" fill="#fff"/><circle cx="75.5" cy="89" r="1.4" fill="#fff"/>' +
      (kind === 'owl' || kind === 'bird' ? '' : '<ellipse cx="36" cy="104" rx="5.4" ry="3.2" fill="#FF9FA8" opacity=".7"/><ellipse cx="84" cy="104" rx="5.4" ry="3.2" fill="#FF9FA8" opacity=".7"/>') +
      (hasMouth ? '<path class="mouth" d="M52 106 Q60 113 68 106" stroke="#14213D" stroke-width="2.6" fill="none" stroke-linecap="round"/>' : '<path class="mouth" d="M52 106 Q60 113 68 106" fill="none" style="display:none"/>') +
      '</g></svg>';
    return s;
  }

  /* ---------------------------------------------------------------- Phần thưởng (hình kết quả) */
  function poly(n, r1, r2, fill) {
    var p = [];
    for (var i = 0; i < n * 2; i++) {
      var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1;
      p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1));
    }
    return '<polygon points="' + p.join(' ') + '" fill="' + fill + '"/>';
  }
  function shapeSVG(sh) {
    var h = '', i;
    switch (sh.kind) {
      case 'petals':
        for (i = 0; i < sh.n; i++) { h += '<ellipse cx="0" cy="' + (-sh.d) + '" rx="' + sh.rx + '" ry="' + sh.ry + '" fill="' + (i % 2 ? sh.c2 : sh.c) + '" transform="rotate(' + (i * 360 / sh.n) + ')"/>'; }
        return h + '<circle r="' + sh.r + '" fill="' + sh.core + '"/>';
      case 'gear':
        for (i = 0; i < sh.n; i++) { h += '<rect x="-3.8" y="-' + (sh.r + 5) + '" width="7.6" height="11" rx="2" fill="' + sh.c + '" transform="rotate(' + (i * 360 / sh.n) + ')"/>'; }
        return h + '<circle r="' + sh.r + '" fill="' + sh.c + '"/><circle r="7" fill="' + sh.core + '"/>';
      case 'sparkle':
        return '<path d="M0 -27 C 3 -9 9 -3 27 0 C 9 3 3 9 0 27 C -3 9 -9 3 -27 0 C -9 -3 -3 -9 0 -27Z" fill="' + sh.c + '"/><circle r="6" fill="' + sh.core + '"/>';
      case 'heart':
        return '<path d="M0 22 C -32 2 -24 -26 -9 -22 C -3 -20 0 -15 0 -12 C 0 -15 3 -20 9 -22 C 24 -26 32 2 0 22Z" fill="' + sh.c + '"/><ellipse cx="-11" cy="-10" rx="5" ry="3.4" fill="' + sh.core + '" transform="rotate(-30 -11 -10)"/>';
      case 'star':
        return poly(sh.n, sh.r1, sh.r2, sh.c) + '<circle r="6.5" fill="' + sh.core + '"/>';
      case 'hex':
        return poly(6, 24, 24, sh.c).replace(/ fill=/, ' transform="rotate(30)" fill=') + poly(6, 14, 14, sh.c2 || sh.c).replace(/ fill=/, ' transform="rotate(30)" fill=') + '<circle r="6" fill="' + sh.core + '"/>';
      case 'ring':
        return '<circle r="21" fill="none" stroke="' + sh.c + '" stroke-width="7"/><circle r="10" fill="' + (sh.c2 || sh.c) + '"/><circle r="4.2" fill="' + sh.core + '"/>';
      case 'moon':
        return '<path d="M8 -24 A 25 25 0 1 0 8 24 A 19 19 0 1 1 8 -24Z" fill="' + sh.c + '"/><circle cx="14" cy="-2" r="4" fill="' + sh.core + '"/>';
    }
    return '';
  }

  /* ---------------------------------------------------------------- Màu trời, đồi (nội suy 7 mốc) */
  function hx(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function lerp(a, b, t) { var x = hx(a), y = hx(b), o = [], i; for (i = 0; i < 3; i++) { o.push(Math.round(x[i] + (y[i] - x[i]) * t)); } return 'rgb(' + o.join(',') + ')'; }

  /* ---------------------------------------------------------------- Dựng trang chủ chọn trò */
  var CARD = { mam: ['#BDF3D2', '#8FD8B0'], cao: ['#FFD3A6', '#F4A261'], cu: ['#C9C2F0', '#9D93D8'], en: ['#BCD8FF', '#86B1EE'], gau: ['#FFD6C2', '#E9A98E'], thap: ['#FFD9B8', '#FF9A8B'], chai: ['#DCCBFF', '#9D8DEB'] };
  function hub() {
    var g0 = GAMES.mam;
    stage.className = 'stage pick'; stage.style.setProperty('--ph', '86%');
    stage.setAttribute('aria-label', 'Các trò chơi tính cách của Sophia Nguyễn');
    stage.innerHTML = '<div class="sun" style="--sunUp:-6cqw"></div>' + scenery() +
      '<div class="hud"><span class="name">Trò chơi tính cách</span></div>' +
      '<section class="panel" id="panel"><div class="stack"><h1 class="title" style="font-size:7.4cqw">Hôm nay bạn muốn chạy cùng ai?</h1>' +
      '<p class="sub" style="font-size:3.6cqw">Mỗi trò chơi khác nhau, chỉ vài phút, cuối trò nhân vật sẽ cho bạn biết bạn là ai.</p></div>' +
      '<div class="pick-list" id="list"></div></section>' +
      '<div class="brand"><span>Sophia Nguyễn</span><b>sophianguyen.com.vn</b></div>';
    applySky(g0, 4);
    var list = $('list');
    ORDER.forEach(function (k) {
      var g = GAMES[k], a = document.createElement('a');
      a.className = 'pick-card'; a.href = g.url; var cc = CARD[k]; a.style.setProperty('--c1', cc[0]); a.style.setProperty('--c2', cc[1]);
      a.innerHTML = charSVG(g.char.kind, null, false) + '<span><b>' + g.hud + '</b><small>' + g.title + '</small></span>';
      a.onclick = function () { track('hub_pick', { pick: k }); };
      list.appendChild(a);
    });
  }
  function scenery() {
    return '<svg class="stars" viewBox="0 0 360 320" preserveAspectRatio="none" aria-hidden="true"><g fill="#FFF6DC"><circle cx="30" cy="60" r="1.6"/><circle cx="88" cy="34" r="1.2"/><circle cx="140" cy="88" r="1.8"/><circle cx="196" cy="42" r="1.3"/><circle cx="250" cy="96" r="1.5"/><circle cx="318" cy="52" r="1.8"/><circle cx="62" cy="128" r="1.1"/><circle cx="226" cy="150" r="1.2"/><circle cx="330" cy="150" r="1.1"/><circle cx="116" cy="170" r="1.4"/></g></svg>' +
      '<svg class="hills" viewBox="0 0 360 160" preserveAspectRatio="none" aria-hidden="true"><g id="gFar"><path class="far" d="M-40 40 C 30 6 100 8 150 30 C 210 54 270 4 400 28 L400 160 L-40 160Z"/></g><g id="gNear"><path class="near" d="M-40 58 C 50 28 120 30 190 50 C 250 66 320 32 400 48 L400 160 L-40 160Z"/></g><path class="gnd" d="M-40 66 C 80 54 150 60 210 62 C 280 64 330 56 400 60 L400 160 L-40 160Z"/></svg>';
  }
  function applySky(g, n) {
    var t = Math.min(n, 6) / 6, st = stage.style, s = g.sky[Math.min(n, 6)];
    st.setProperty('--skyTop', s[0]); st.setProperty('--skyBot', s[1]);
    st.setProperty('--hillFar', lerp(g.hills.far[0], g.hills.far[1], t));
    st.setProperty('--hillNear', lerp(g.hills.near[0], g.hills.near[1], t));
    st.setProperty('--ground', lerp(g.hills.ground[0], g.hills.ground[1], t));
    st.setProperty('--sunUp', g.sunUp[Math.min(n, 6)] + 'cqw'); st.setProperty('--stars', g.stars[Math.min(n, 6)]);
  }

  /* ---------------------------------------------------------------- Trò chơi: giao cho play.js */
  function game(cfg) {
    window.runGame(cfg, { charSVG: charSVG, shapeSVG: shapeSVG, hx: hx, track: track });
  }

  if (ID === 'hub') { hub(); } else { game(GAMES[ID]); }
})();
