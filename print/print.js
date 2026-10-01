/*
 * Рендер PDF-документов (резюме и one-pager) из window.CONTENT.
 * Документ выбирается атрибутом <body data-doc="cv|onepager">, язык — параметром ?lang=ru|en.
 * Незаполненные поля (null) выводятся как [TODO] и собираются в window.__TODOS для scripts/build-pdf.mjs.
 */
(function () {
  'use strict';

  var C = window.CONTENT, S = C.shared;
  var q = new URLSearchParams(location.search).get('lang');
  var lang = q === 'en' ? 'en' : 'ru';
  var T = C[lang];
  window.__TODOS = [];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function val(v, what) {
    if (v == null || v === '') {
      window.__TODOS.push(what);
      return '<span class="todo">[TODO]</span>';
    }
    return esc(v);
  }
  function fmtMonth(ym) {
    if (!ym) return T.ui.present;
    var p = ym.split('-');
    return T.ui.months[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function list(items) {
    return '<ul>' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
  }
  function h(title) { return '<h2>' + esc(title) + '</h2>'; }
  function stripUrl(u) { return u.replace(/^https?:\/\//, '').replace(/\/$/, ''); }

  function contactsLine() {
    var c = S.contacts, parts = [];
    parts.push('<a href="' + esc(c.telegram) + '">Telegram ' + esc(c.telegramHandle) + '</a>');
    if (c.email) parts.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>');
    if (c.site) parts.push('<a href="https://' + esc(stripUrl(c.site)) + '">' + esc(stripUrl(c.site)) + '</a>');
    parts.push(esc(T.person.location));
    return parts.map(function (x) { return '<span class="nw">' + x + '</span>'; }).join('<span class="sep">·</span>');
  }

  // ---------- Резюме ----------
  function renderCv() {
    var H = T.cv.headings;
    var exp = ['xabar', 'socd'].map(function (id) {
      var P = S.projects[id], t = T.projects[id];
      var metrics = t.metrics && t.metrics.length
        ? '<p class="metrics">' + t.metrics.map(function (m) { return '<b>' + esc(m.value) + '</b> ' + esc(m.label); }).join(' · ') + '</p>'
        : '';
      return '<div class="job">' +
        '<div class="job__head"><h3>' + esc(t.title) + ' <span class="job__kind">— ' + esc(t.kind) + '</span></h3>' +
          '<span class="job__period">' + esc(fmtMonth(P.period.from)) + ' — ' + esc(fmtMonth(P.period.to)) + '</span></div>' +
        '<p class="job__role">' + esc(t.role) + '</p>' +
        '<p class="job__desc">' + esc(t.tagline) + '</p>' +
        list(t.bullets) + metrics +
        (t.stack && t.stack.length ? '<p class="stack"><span class="muted">' + esc(T.ui.stackLabel) + ':</span> ' + t.stack.map(esc).join(' · ') + '</p>' : '') +
        (t.roles && t.roles.length ? '<p class="stack"><span class="muted">' + esc(T.ui.rolesLabel) + ':</span> ' + t.roles.map(esc).join(' · ') + '</p>' : '') +
        (t.note ? '<p class="note">' + esc(t.note) + '</p>' : '') +
      '</div>';
    }).join('');
    var e = T.cv.earlier;
    exp += '<div class="job"><div class="job__head"><h3>' + esc(e.title) + '</h3><span class="job__period">' + esc(e.period) + '</span></div>' +
      '<p class="job__desc">' + esc(e.text) + '</p></div>';

    var skills = T.skills.map(function (g) {
      return '<div class="skillrow"><span class="muted">' + esc(g.title) + ':</span> ' + g.items.map(function (s) {
        return esc(s.name);
      }).join(', ') + '</div>';
    }).join('') + (S.tools && S.tools.length
      ? '<div class="skillrow"><span class="muted">' + esc(T.ui.tools) + ':</span> ' + S.tools.map(function (tl) { return esc(tl.name); }).join(', ') + '</div>'
      : '');

    var ach = '<ul>' + T.achievements.map(function (a) { var t = a.url ? '<a href="' + esc(a.url) + '">' + esc(a.title) + '</a>' : esc(a.title);
      return '<li>' + t + ' <span class="muted">(' + esc(a.year) + ')</span></li>'; }).join('') + '</ul>';
    var E = T.education;

    return '' +
      '<header class="head">' +
        '<div><h1>' + esc(T.person.fullName) + '</h1><p class="role">' + esc(T.person.role) + '</p></div>' +
        '<p class="contacts">' + contactsLine() + '</p>' +
      '</header>' +
      '<section>' + h(H.summary) + '<p>' + esc(T.person.summary) + '</p></section>' +
      '<section>' + h(H.experience) + exp + '</section>' +
      '<section>' + h(H.skills) + skills + '</section>' +
      '<section class="cols">' +
        '<div>' + h(H.achievements) + ach + '</div>' +
        '<div>' + h(H.education) + '<p><b>' + esc(E.school) + '</b></p><p>' + esc(E.faculty) + '</p><p class="muted">' + esc(E.program) + '</p></div>' +
      '</section>';
  }

  // ---------- One-pager ----------
  function renderOnepager() {
    var O = T.onepager, H = O.headings;
    var facts = '<table class="facts">' + O.facts.map(function (f) {
      return '<tr><th>' + esc(f.label) + '</th><td>' + val(f.value, 'onepager.facts: ' + f.label) + '</td></tr>';
    }).join('') + '</table>';
    var ask = list(O.ask) + (O.askAmount !== undefined
      ? '<p class="ask-amount"><b>' + esc(H.amount) + ':</b> ' + val(O.askAmount, 'onepager.askAmount') + '</p>' : '');
    var roles = T.collab.team.roles.map(function (r) { return esc(r.name); }).join(', ');

    return '' +
      '<header class="op-head">' +
        '<p class="eyebrow">' + esc(O.subtitle) + '</p>' +
        '<h1>XABAR</h1>' +
        '<p class="lead">' + esc(O.concept) + '</p>' +
      '</header>' +
      '<div class="op-grid">' +
        '<div class="op-main">' +
          '<section>' + h(H.usp) + list(O.usp) + '</section>' +
          '<section>' + h(H.status) + '<p>' + val(O.status, 'onepager.status') + '</p></section>' +
          '<section>' + h(H.founder) + '<p>' + esc(O.founder) + '</p>' +
            '<p class="muted small">' + esc(T.ui.lookingFor) + ': ' + roles + '.</p></section>' +
          '<section class="ask">' + h(H.ask) + ask + '</section>' +
          '<section>' + h(H.contacts) + '<p>' + contactsLine() + '</p></section>' +
        '</div>' +
        '<aside class="op-side">' +
          '<section>' + h(H.facts) + facts + '</section>' +
          '<section class="track">' + '<p class="eyebrow">' + esc(H.track) + '</p>' +
            '<p class="small">' + esc(O.trackNote) + '</p>' +
            T.projects.socd.metrics.map(function (m) { return '<p><b>' + esc(m.value) + '</b> <span class="muted">' + esc(m.label) + '</span></p>'; }).join('') +
            '<p class="muted small">' + esc(T.projects.socd.note) + '</p>' +
          '</section>' +
        '</aside>' +
      '</div>';
  }

  document.documentElement.lang = lang;
  var doc = document.body.getAttribute('data-doc');
  document.title = doc === 'cv' ? T.person.name + ' — ' + T.cv.title : T.onepager.title;
  document.getElementById('doc').innerHTML = doc === 'cv' ? renderCv() : renderOnepager();

  // ---------- Подгонка под страницы A4 ----------
  // Вызывается из scripts/build-pdf.mjs в print-режиме при ширине области печати; pageH — высота области печати, px.
  // Перелив на вторую страницу до FIT_MAX_OVERFLOW — документ сжимается (zoom не ниже FIT_MIN_ZOOM) в одну страницу.
  // Иначе — две страницы: разрыв перед блоком (раздел, проект), при котором страницы заполнены равномернее всего.
  var FIT_MAX_OVERFLOW = 0.3, FIT_MIN_ZOOM = 0.92;
  window.__fit = function (pageH) {
    var d = document.getElementById('doc');
    function height() { return d.getBoundingClientRect().height; }
    function setZoom(z) { d.style.zoom = z; d.style.width = (100 / z) + '%'; }

    var H = height();
    if (H <= pageH) return { pages: 1, zoom: 1 };
    if ((H - pageH) / pageH <= FIT_MAX_OVERFLOW) {
      for (var i = 1; i <= Math.round((1 - FIT_MIN_ZOOM) * 100); i++) {
        setZoom(1 - i / 100);
        if (height() <= pageH) return { pages: 1, zoom: 1 - i / 100 };
      }
      setZoom(1);
    }

    document.body.classList.add('two-pages');
    H = height();
    if (H > pageH * 2) return { pages: Math.ceil(H / pageH), zoom: 1 };
    var top = d.getBoundingClientRect().top, best = null, bestCost = Infinity;
    d.querySelectorAll('section, .job').forEach(function (el) {
      var prev = el.previousElementSibling;
      if (!prev || prev.tagName === 'H2') return; // не отрываем блок от заголовка раздела
      var y = el.getBoundingClientRect().top - top;
      var cost = Math.max(y, H - y);              // заполненность более полной из двух страниц
      if (cost < bestCost) { bestCost = cost; best = el; }
    });
    if (best) { best.style.breakBefore = 'page'; best.style.marginTop = '0'; }
    return { pages: 2, zoom: 1 };
  };
  window.__READY = true;
})();
