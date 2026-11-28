/*
 * funnel.js - Phễu bài test của Sophia Nguyễn
 * Việc làm: (1) hiện khối mời để lại Zalo/email dưới kết quả test,
 *           (2) gắn UTM để biết khách đến từ quảng cáo nào,
 *           (3) gửi sự kiện đo lường lên Google Analytics (và Facebook Pixel nếu có ID).
 * Muốn chạy quảng cáo Facebook: dán ID Pixel vào FB_PIXEL_ID bên dưới, rồi lưu và đẩy lên.
 */
(function () {
  'use strict';

  var CFG = {
    FORMSPREE: 'https://formspree.io/f/xvgqdgko',
    FB_PIXEL_ID: '',                       // <-- dán ID Pixel Facebook vào đây (ví dụ '1234567890'); để trống nếu chưa chạy quảng cáo
    REPORT_URL: '/ban-do-nang-luc',
    ZALO: 'https://zalo.me/0977092182'
  };

  var path = (location.pathname || '').replace(/^\//, '').replace(/\.html$/, '') || 'home';

  function safe(fn) { try { return fn(); } catch (e) { /* bỏ qua lỗi đo lường, không làm hỏng bài test */ } }

  function track(name, params) {
    params = params || {};
    params.test_name = path;
    safe(function () { if (window.gtag) window.gtag('event', name, params); });
  }
  function fbTrack(kind, name, params) {
    safe(function () { if (window.fbq) window.fbq(kind, name, params || {}); });
  }

  /* ---------- UTM: nhớ nguồn khách đến ---------- */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
  var utm = {};
  safe(function () {
    var q = new URLSearchParams(location.search), found = false;
    UTM_KEYS.forEach(function (k) { if (q.get(k)) { utm[k] = q.get(k); found = true; } });
    if (found) { sessionStorage.setItem('sf_utm', JSON.stringify(utm)); }
    else {
      var saved = sessionStorage.getItem('sf_utm');
      if (saved) { utm = JSON.parse(saved) || {}; }
    }
  });

  /* ---------- Facebook Pixel (chỉ chạy khi có ID) ---------- */
  if (CFG.FB_PIXEL_ID) {
    safe(function () {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CFG.FB_PIXEL_ID);
      window.fbq('track', 'PageView');
    });
  }

  /* ---------- Giao diện khối mời ---------- */
  var css = '' +
    '.sf-box{max-width:760px;margin:28px auto 8px;background:#fff;border:2px solid #C9A84C;border-radius:20px;padding:26px 24px;box-shadow:0 12px 32px rgba(10,22,40,.10);font-family:Inter,sans-serif;color:#0A1628;text-align:left}' +
    '.sf-box h3{font-family:"Playfair Display",serif;font-size:1.3rem;margin:0 0 8px;color:#0A1628}' +
    '.sf-box p{margin:0 0 14px;color:#4A5A6A;font-size:.95rem;line-height:1.6}' +
    '.sf-box label{display:block;font-weight:600;font-size:.82rem;margin:10px 0 5px}' +
    '.sf-box input[type=text],.sf-box input[type=tel],.sf-box input[type=email]{width:100%;padding:11px 13px;border:1px solid #E8E4DC;border-radius:12px;font:inherit;box-sizing:border-box}' +
    '.sf-box input:focus{outline:2px solid #C9A84C;border-color:#C9A84C}' +
    '.sf-box .sf-consent{display:flex;gap:9px;align-items:flex-start;font-weight:400;font-size:.8rem;color:#4A5A6A;margin-top:14px}' +
    '.sf-box .sf-consent input{margin-top:3px}' +
    '.sf-box button{margin-top:16px;width:100%;background:#C9A84C;color:#0A1628;border:0;border-radius:50px;padding:13px;font-weight:700;font-size:1rem;cursor:pointer}' +
    '.sf-box button:disabled{opacity:.6;cursor:default}' +
    '.sf-box .sf-alt{text-align:center;margin-top:14px;font-size:.88rem;color:#4A5A6A}' +
    '.sf-box .sf-alt a{color:#8a6d1f;font-weight:700;text-decoration:underline}' +
    '.sf-box .sf-msg{margin-top:12px;font-size:.88rem;color:#b3261e;display:none}' +
    '.sf-box .sf-note{margin-top:12px;font-size:.78rem;color:#6b7785;font-style:italic}' +
    '.sf-box .sf-ok{text-align:center;padding:10px 0}' +
    '.sf-primary{display:block;text-align:center;background:#0A1628;color:#fff !important;border-radius:50px;padding:13px;font-weight:700;text-decoration:none;margin:4px 0 18px}' +
    '.sf-sub{font-size:.92rem;font-weight:600;color:#0A1628;margin:6px 0 4px;border-top:1px solid #E8E4DC;padding-top:16px}' +
    '.sf-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0}';

  function injectCss() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }

  function field(label, name, type, required, placeholder) {
    return '<label>' + label + '</label><input type="' + type + '" name="' + name + '"' +
      (required ? ' required' : '') + (placeholder ? ' placeholder="' + placeholder + '"' : '') + '>';
  }

  /* Bài test nào dẫn tới đâu:
     - Test nghề nghiệp (Holland RIASEC) là 1 trong 5 nguồn của Bản đồ Năng lực -> dẫn thẳng sang báo cáo.
     - Nhóm tính cách (MBTI, DISC, phong cách học tập...) là bài riêng, không nằm trong báo cáo -> dẫn sang test nghề nghiệp trước.
     - Test sinh trắc vân tay -> dẫn sang bản demo (vân tay + bản đồ sở trường).
     - Nhóm sức khỏe tinh thần -> dẫn sang tham vấn, KHÔNG quảng cáo báo cáo nghề nghiệp.
     - Nhóm cha mẹ & con (sàng lọc tuổi dậy thì) -> dẫn sang khóa học cho phụ huynh. */
  var TRAIT = ['testmbti', 'testDISC', 'testhoctap', 'testnguyenmau', 'testgiaotiep', 'testgiatricanhan',
               'testdonglucnoitai', 'testtuduysuynghi', 'testtrituecamxuc', 'testhinhanh', 'testnhanvatbian'];
  var WELLBEING = ['testdass21', 'testganbo', 'testkhanangphuchoi', 'testranhgioibanthan', 'testtuchapnhan', 'testtuquantam'];
  var FAMILY = ['testsangloc', 'testtredaythi'];
  var VARIANT = (path === 'testnghenghiep') ? 'career' :
                (path === 'testsinhtracvantay') ? 'fingerprint' :
                (TRAIT.indexOf(path) > -1) ? 'trait' :
                (WELLBEING.indexOf(path) > -1) ? 'wellbeing' :
                (FAMILY.indexOf(path) > -1) ? 'family' : 'default';

  function topHtml() {
    if (VARIANT === 'career') {
      return '<h3>Kết quả này là một trong 5 nguồn của Bản đồ Năng lực</h3>' +
        '<p>Bản đồ Năng lực đối chiếu Holland RIASEC với vân tay, chức năng não bộ, SWOT và đa trí tuệ, chỉ ra chỗ các nguồn khớp và chỗ lệch, rồi lập lộ trình 90 ngày cho riêng bạn.</p>' +
        '<a class="sf-primary" href="' + CFG.REPORT_URL + '" data-sf="primary-report">Xem Bản đồ Năng lực và bảng giá</a>' +
        '<div class="sf-sub">Chưa biết chọn gói nào? Để lại Zalo hoặc email, Sophia nhắn gợi ý gói phù hợp.</div>';
    }
    if (VARIANT === 'trait') {
      return '<h3>Tính cách cho biết bạn là người thế nào, chưa cho biết bạn hợp nghề gì</h3>' +
        '<p>Bước tiếp theo: làm bài test nghề nghiệp Holland RIASEC (khoảng 5-10 phút, miễn phí) để xem thiên hướng nghề của bạn.</p>' +
        '<a class="sf-primary" href="/testnghenghiep" data-sf="primary-next">Làm bài test nghề nghiệp</a>' +
        '<div class="sf-sub">Hoặc để lại Zalo/email, Sophia nhắn gợi ý bước tiếp theo cho bạn.</div>';
    }
    if (VARIANT === 'fingerprint') {
      return '<h3>Vân tay là một nguồn, chưa phải toàn bộ bức tranh</h3>' +
        '<p>Bản demo (399.000đ) đặt nhóm tính cách từ vân tay cạnh bản đồ sở trường, bài tự đánh giá năng lực của chính bạn, để bạn thấy chỗ khớp và chỗ lệch.</p>' +
        '<a class="sf-primary" href="' + CFG.REPORT_URL + '#xem-truoc" data-sf="primary-report">Xem bản demo và bảng giá</a>' +
        '<div class="sf-sub">Chưa biết chọn gói nào? Để lại Zalo hoặc email, Sophia nhắn gợi ý.</div>';
    }
    if (VARIANT === 'wellbeing') {
      return '<h3>Kết quả này là bức tranh của hôm nay, không phải chẩn đoán</h3>' +
        '<p>Nếu bạn muốn có người cùng nhìn lại những điều này, Sophia nhận tham vấn tâm lý 1-1, online hoặc trực tiếp tại TP.HCM (600.000đ/giờ, 15 phút đầu trò chuyện miễn phí).</p>' +
        '<a class="sf-primary" href="/tuvan-tamly1" data-sf="primary-counsel">Tìm hiểu tham vấn tâm lý</a>' +
        '<div class="sf-sub">Hoặc để lại Zalo/email, Sophia nhắn bạn nhẹ nhàng, không bán gì cả.</div>' +
        '<p class="sf-note" style="margin:0 0 14px;font-style:normal">Nếu bạn đang rất tệ hoặc có ý nghĩ làm hại bản thân, hãy gọi cấp cứu 115 hoặc đến cơ sở y tế gần nhất, và nói với một người thân tin cậy ngay hôm nay.</p>';
    }
    if (VARIANT === 'family') {
      return '<h3>Hiểu con là bước đầu, đồng hành cùng con là bước tiếp theo</h3>' +
        '<p>Sophia có các khóa học và tài liệu dành cho cha mẹ về giao tiếp, giáo dục giới tính và kỹ năng an toàn cho con, học online lúc nào cũng được.</p>' +
        '<a class="sf-primary" href="/khoa-hoc" data-sf="primary-course">Xem khóa học cho phụ huynh</a>' +
        '<div class="sf-sub">Hoặc để lại Zalo/email, Sophia nhắn gợi ý phù hợp với độ tuổi của con.</div>';
    }
    return '<h3>Muốn hiểu kết quả này sâu hơn?</h3>' +
      '<p>Để lại Zalo hoặc email. Sophia sẽ nhắn bạn gợi ý bước tiếp theo, miễn phí.</p>';
  }
  function altHtml() {
    return VARIANT === 'default'
      ? '<div class="sf-alt">Muốn một báo cáo đầy đủ hơn? <a href="' + CFG.REPORT_URL + '" data-sf="report">Xem Bản đồ Năng lực &amp; Lộ trình Sự nghiệp</a></div>'
      : '';
  }

  function okHtml() {
    var link = VARIANT === 'wellbeing' ? ['/tuvan-tamly1', 'Tìm hiểu tham vấn tâm lý', 'Sophia sẽ nhắn bạn sớm.'] :
               VARIANT === 'family' ? ['/khoa-hoc', 'Xem khóa học cho phụ huynh', 'Sophia sẽ nhắn bạn sớm.'] :
               [CFG.REPORT_URL, 'Xem Bản đồ Năng lực &amp; Lộ trình Sự nghiệp', 'Sophia sẽ nhắn bạn sớm. Trong lúc chờ, bạn có thể xem Bản đồ Năng lực để biết thêm cách Sophia làm việc.'];
    return '<div class="sf-ok"><h3>Cảm ơn bạn!</h3><p>' + link[2] + '</p>' +
      '<a class="sf-alt" href="' + link[0] + '" style="display:inline-block;font-weight:700;color:#8a6d1f;text-decoration:underline">' + link[1] + '</a></div>';
  }

  function buildBox() {
    var box = document.createElement('div');
    box.className = 'sf-box';
    box.style.display = 'none';
    box.innerHTML =
      '<div class="sf-form-wrap">' +
        topHtml() +
        '<form novalidate>' +
          '<input type="hidden" name="_subject" value="">' +
          '<input type="hidden" name="nguon" value="">' +
          '<input type="hidden" name="ket_qua" value="">' +
          '<input type="text" name="_gotcha" class="sf-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          field('Tên của bạn', 'name', 'text', true) +
          field('Số Zalo hoặc điện thoại', 'phone', 'tel', true) +
          field('Email (không bắt buộc)', 'email', 'email', false) +
          '<label class="sf-consent"><input type="checkbox" name="dong_y_du_lieu" value="yes" required>' +
            '<span>Tôi đồng ý để Sophia dùng thông tin này để liên hệ với tôi về kết quả và các bước tiếp theo.</span></label>' +
          '<button type="submit">Gửi cho Sophia</button>' +
          '<div class="sf-msg" role="alert"></div>' +
        '</form>' +
        altHtml() +
        '<div class="sf-note">Kết quả test chỉ mang tính tham khảo để bạn hiểu mình hơn, không phải chẩn đoán hay lời khẳng định về năng lực.</div>' +
      '</div>';

    var form = box.querySelector('form');
    var msg = box.querySelector('.sf-msg');
    form.querySelector('[name=_subject]').value = 'Lead từ bài test: ' + (document.title.split('|')[0] || path).trim();
    form.querySelector('[name=nguon]').value = path;
    UTM_KEYS.forEach(function (k) {
      if (utm[k]) {
        var h = document.createElement('input'); h.type = 'hidden'; h.name = k; h.value = utm[k]; form.appendChild(h);
      }
    });

    ['report', 'primary-report', 'primary-next', 'primary-counsel', 'primary-course'].forEach(function (k) {
      var el = box.querySelector('[data-sf="' + k + '"]');
      if (el) { el.addEventListener('click', function () { track(k === 'primary-next' ? 'cta_next_test_click' : k === 'primary-counsel' ? 'cta_counsel_click' : k === 'primary-course' ? 'cta_course_click' : 'cta_report_click', { place: 'test_result', test_name: path }); }); }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.style.display = 'none';
      var name = form.elements['name'].value.trim();
      var phone = form.elements['phone'].value.trim();
      var email = form.elements['email'].value.trim();
      if (!name || !phone) { msg.textContent = 'Bạn điền giúp mình tên và số Zalo nhé.'; msg.style.display = 'block'; return; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Email chưa đúng định dạng.'; msg.style.display = 'block'; return; }
      if (!form.elements['dong_y_du_lieu'].checked) { msg.textContent = 'Bạn tích đồng ý để Sophia liên hệ nhé.'; msg.style.display = 'block'; return; }
      var btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Đang gửi...';
      fetch(CFG.FORMSPREE, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) { throw new Error('send failed'); }
          track('generate_lead', { method: 'test_result', test_name: path, campaign: utm.utm_campaign || '', source: utm.utm_source || '' });
          fbTrack('track', 'Lead', { content_name: path });
          box.querySelector('.sf-form-wrap').innerHTML =
            okHtml();
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Gửi cho Sophia';
          msg.innerHTML = 'Chưa gửi được. Bạn nhắn Sophia qua <a href="' + CFG.ZALO + '" target="_blank" rel="noopener" style="color:#8a6d1f;font-weight:700">Zalo</a> giúp mình nhé.';
          msg.style.display = 'block';
        });
    });
    return box;
  }

  /* ---------- Nhận biết khi kết quả hiện ra ---------- */
  function watchResult() {
    var host = document.getElementById('result') || document.getElementById('resultContent');
    if (!host) { return; }
    var anchor = (host.id === 'resultContent') ? (document.getElementById('shareButtons') || host) : host;
    var box = null, completed = false;

    function titleOfResult() {
      // lấy phần đầu của kết quả (có loại tính cách / nhóm nghề) để Sophia biết khách ra kết quả gì
      return host.textContent.replace(/\s+/g, ' ').trim().slice(0, 140);
    }
    function sync() {
      var rt = document.getElementById('res-title');
      var hasResult = host.textContent.trim().length > 20 && (!rt || rt.textContent.trim().length > 0);
      if (hasResult) {
        if (!box) { box = buildBox(); anchor.parentNode.insertBefore(box, anchor.nextSibling); }
        box.style.display = '';
        var kq = box.querySelector('[name=ket_qua]'); if (kq) { kq.value = titleOfResult(); }
        if (!completed) {
          completed = true;
          track('test_complete');
          fbTrack('trackCustom', 'TestComplete', { test: path });
        }
      } else {
        completed = false;
        if (box) { box.style.display = 'none'; }
      }
    }
    new MutationObserver(sync).observe(host, { childList: true, subtree: true, characterData: true });
    sync();
  }

  /* ---------- Sự kiện bắt đầu làm test ---------- */
  function watchStart() {
    var started = false;
    function fire(e) {
      if (started) { return; }
      var t = e.target;
      if (!t || !t.closest) { return; }
      if (t.closest('header, nav, footer, .sf-box')) { return; }
      if (t.matches('input[type=radio], input[type=checkbox], select') || t.closest('.option, .answer, .choice, .opt')) {
        started = true; track('test_start'); fbTrack('trackCustom', 'TestStart', { test: path });
      }
    }
    document.addEventListener('change', fire, true);
    document.addEventListener('click', fire, true);
  }

  /* ---------- Các form Formspree khác (liên hệ, đăng ký báo cáo): gắn UTM + đo lường ---------- */
  function watchOtherForms() {
    var forms = document.querySelectorAll('form[action*="formspree.io"]');
    Array.prototype.forEach.call(forms, function (f) {
      UTM_KEYS.forEach(function (k) {
        if (utm[k] && !f.querySelector('[name=' + k + ']')) {
          var h = document.createElement('input'); h.type = 'hidden'; h.name = k; h.value = utm[k]; f.appendChild(h);
        }
      });
      f.addEventListener('submit', function () {
        safe(function () { if (window.gtag) { window.gtag('event', 'generate_lead', { method: 'form', test_name: path, transport_type: 'beacon' }); } });
        fbTrack('track', 'Lead', { content_name: path });
      });
    });
  }


  /* ---------- Ô "Chơi thử bản trò chơi 1 phút" trên trang test có game tương ứng ---------- */
  var GAME_OF = {
    testDISC: ['hanh-trinh-cua-mam', 'Hành trình của Mầm'],
    testnghenghiep: ['cao-con-o-cho-phien', 'Cáo con ở chợ phiên'],
    testhoctap: ['cu-meo-dem-on-thi', 'Cú Mèo đêm ôn thi'],
    testganbo: ['chim-en-tim-to', 'Chim én tìm tổ'],
    testsangloc: ['gau-me-va-gau-con', 'Gấu mẹ và Gấu con'],
    testmbti: ['thap-manh-ghep', 'Tháp Mảnh Ghép'],
    testtrituecamxuc: ['chai-cam-xuc', 'Chai Cảm Xúc']
  };
  function playCard() {
    var g = GAME_OF[path]; if (!g) { return; }
    var anchor = null;
    ['quizForm', 'quiz', 'questionContainer', 'hollandQuestions'].some(function (id) { anchor = document.getElementById(id); return anchor; });
    if (!anchor) { return; }
    var box = document.createElement('a');
    box.className = 'sf-play';
    box.href = '/' + g[0] + '?utm_source=site&utm_medium=test-page&utm_campaign=play-' + path;
    box.innerHTML = '<span class="sf-play-tx"><b>Chưa muốn đọc nhiều?</b><small>Chơi thử 1 phút: ' + g[1] + '</small></span><span class="sf-play-go">Chơi ngay</span>';
    box.addEventListener('click', function () { track('test_game_click', { game: g[0] }); });
    anchor.parentNode.insertBefore(box, anchor);
    var st = document.createElement('style');
    st.textContent = '.sf-play{display:flex;align-items:center;gap:12px;margin:0 0 18px;padding:12px 14px;border-radius:16px;background:#14213d;color:#fff;text-decoration:none;border:2px solid #ffd166;box-sizing:border-box}' +
      '.sf-play-ic{font-size:30px;flex:none}.sf-play-tx{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.35}.sf-play-tx b{font-size:15px}.sf-play-tx small{font-size:13px;color:#cfd8f0}' +
      '.sf-play-go{flex:none;background:#8ae2b0;color:#0b2b4a;font-weight:700;font-size:14px;padding:8px 12px;border-radius:20px;white-space:nowrap}';
    document.head.appendChild(st);
  }

  function init() {
    injectCss();
    safe(playCard);
    watchResult();
    watchStart();
    watchOtherForms();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
