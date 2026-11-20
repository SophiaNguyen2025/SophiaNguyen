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
    '.sf-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0}';

  function injectCss() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }

  function field(label, name, type, required, placeholder) {
    return '<label>' + label + '</label><input type="' + type + '" name="' + name + '"' +
      (required ? ' required' : '') + (placeholder ? ' placeholder="' + placeholder + '"' : '') + '>';
  }

  function buildBox() {
    var box = document.createElement('div');
    box.className = 'sf-box';
    box.style.display = 'none';
    box.innerHTML =
      '<div class="sf-form-wrap">' +
        '<h3>Muốn hiểu kết quả này sâu hơn?</h3>' +
        '<p>Để lại Zalo hoặc email. Sophia sẽ nhắn bạn giải thích kết quả và gợi ý bước tiếp theo, miễn phí.</p>' +
        '<form novalidate>' +
          '<input type="hidden" name="_subject" value="">' +
          '<input type="hidden" name="nguon" value="">' +
          '<input type="hidden" name="ket_qua" value="">' +
          '<input type="text" name="_gotcha" class="sf-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          field('Tên của bạn', 'name', 'text', true) +
          field('Số Zalo hoặc điện thoại', 'phone', 'tel', true) +
          field('Email (không bắt buộc)', 'email', 'email', false) +
          '<label class="sf-consent"><input type="checkbox" name="dong_y_du_lieu" value="yes" required>' +
            '<span>Tôi đồng ý để Sophia dùng thông tin này để liên hệ và gửi giải thích kết quả cho tôi.</span></label>' +
          '<button type="submit">Nhận giải thích từ Sophia</button>' +
          '<div class="sf-msg" role="alert"></div>' +
        '</form>' +
        '<div class="sf-alt">Muốn một báo cáo đầy đủ hơn? <a href="' + CFG.REPORT_URL + '" data-sf="report">Xem Bản đồ Năng lực &amp; Lộ trình Sự nghiệp</a></div>' +
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

    box.querySelector('[data-sf=report]').addEventListener('click', function () { track('cta_report_click', { place: 'test_result' }); });

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
          track('generate_lead', { method: 'test_result' });
          fbTrack('track', 'Lead', { content_name: path });
          box.querySelector('.sf-form-wrap').innerHTML =
            '<div class="sf-ok"><h3>Cảm ơn bạn!</h3><p>Sophia sẽ nhắn bạn sớm. Trong lúc chờ, bạn có thể xem Bản đồ Năng lực để biết thêm cách Sophia làm việc.</p>' +
            '<a class="sf-alt" href="' + CFG.REPORT_URL + '" style="display:inline-block;font-weight:700;color:#8a6d1f;text-decoration:underline">Xem Bản đồ Năng lực &amp; Lộ trình Sự nghiệp</a></div>';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Nhận giải thích từ Sophia';
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
      var hasResult = host.textContent.trim().length > 20;
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

  function init() {
    injectCss();
    watchResult();
    watchStart();
    watchOtherForms();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
