/* Рендер сайта из window.CONTENT (data/content.js), переключение темы и языка, галерея. */
(function () {
  'use strict';

  var C = window.CONTENT;
  var S = C.shared;
  var root = document.documentElement;
  var LANGS = ['ru', 'en'];
  var PROJECT_ORDER = ['xabar', 'socd'];

  // ---------- Утилиты ----------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }
  var ICONS = {
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3zM10 13l4-4"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    arrow: '<svg class="stat__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  };

  function fmtMonth(ym, T) {
    if (!ym) return T.ui.present;
    var p = ym.split('-');
    return T.ui.months[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function sectionHead(title) {
    return '<div class="section__head reveal">' +
      '<h2 class="section__title">' + esc(title) + '</h2></div>';
  }
  function youtubeEmbed(url) {
    var m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] : null;
  }

  // ---------- Язык ----------
  function detectLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(q) >= 0) return q;
    var saved = store('lang');
    if (LANGS.indexOf(saved) >= 0) return saved;
    return (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
  }
  var lang = detectLang();

  // ---------- Секции ----------
  function renderHero(T) {
    var x = T.projects.xabar;
    return '' +
      '<a class="chip chip--accent chip--live hero__status reveal" href="#projects"><span class="chip__dot"></span>' +
        esc(x.title) + ' · ' + esc(T.ui.status.dev) + '</a>' +
      '<h1 class="hero__name reveal">' + esc(T.person.name) + '</h1>' +
      '<p class="hero__role reveal">' + T.person.role.split(' · ').map(function (r) {
        return '<span class="nowrap">' + esc(r) + '</span>';
      }).join(' · ') + '</p>' +
      '<p class="hero__tagline reveal">' + esc(T.person.tagline) + '</p>' +
      '<div class="hero__actions reveal">' +
        '<a class="btn btn--primary" href="' + esc(S.files.cv[lang]) + '" target="_blank" rel="noopener">' + ICONS.download + esc(T.ui.downloadCv) + '</a>' +
        '<a class="btn" href="' + esc(S.files.onepager[lang]) + '" target="_blank" rel="noopener">' + ICONS.download + esc(T.ui.downloadOnepager) + '</a>' +
        '<a class="btn" href="' + esc(S.contacts.telegram) + '" target="_blank" rel="noopener">' + ICONS.send + 'Telegram</a>' +
      '</div>' +
      // Плашки — ссылки к разделу, где цифра подтверждается (плавная прокрутка через scroll-behavior)
      '<div class="stats reveal">' + T.stats.map(function (s) {
        var inner = '<div class="stat__value">' + esc(s.value) + '</div><div class="stat__label">' + esc(s.label) + '</div>';
        return s.href
          ? '<a class="stat stat--link" href="' + esc(s.href) + '">' + inner + ICONS.arrow + '</a>'
          : '<div class="stat">' + inner + '</div>';
      }).join('') + '</div>';
  }

  function renderLinks(links, T) {
    // Ссылки без адреса не показываем — появятся, как только url будет заполнен.
    var ready = (links || []).filter(function (l) { return l.url; });
    if (!ready.length) return '';
    return '<div class="links">' + ready.map(function (l) {
      var label = T.ui.linkTypes[l.type] || l.type;
      return '<a class="link" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(label) + ICONS.ext + '</a>';
    }).join('') + '</div>';
  }

  function renderMedia(id, P, t, T) {
    var html = '';
    if (P.video) {
      var embed = youtubeEmbed(P.video);
      html += embed
        ? '<div class="video"><iframe src="' + esc(embed) + '" title="' + esc(t.title + ' — ' + T.ui.video) + '" loading="lazy" allowfullscreen></iframe></div>'
        : '<a class="btn" href="' + esc(P.video) + '" target="_blank" rel="noopener">' + esc(T.ui.video) + ICONS.ext + '</a>';
    }
    if (P.shots && P.shots.length) {
      var btn = function (src, i, cls) {
        return '<button class="' + cls + '" type="button" data-gallery="' + id + '" data-index="' + i + '" ' +
          'aria-label="' + esc(t.title + ' — ' + T.ui.screenshots + ' ' + (i + 1)) + '">' +
          '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async"></button>';
      };
      html += btn(P.shots[0], 0, 'gallery__main');
      if (P.shots.length > 1) {
        html += '<div class="gallery__thumbs">' + P.shots.slice(1, 4).map(function (s, i) {
          return btn(s, i + 1, 'gallery__thumb');
        }).join('') + '</div>';
      }
    }
    return '<div class="gallery">' + html + '</div>';
  }

  function renderProjects(T) {
    var cards = PROJECT_ORDER.map(function (id) {
      var P = S.projects[id], t = T.projects[id];
      var isDev = !P.period.to;
      var status = isDev
        ? '<span class="chip chip--accent chip--live"><span class="chip__dot"></span>' + esc(T.ui.status.dev) + '</span>'
        : '<span class="chip chip--ok"><span class="chip__dot"></span>' + esc(T.ui.status.done) + '</span>';
      var metrics = t.metrics && t.metrics.length
        ? '<div class="metrics">' + t.metrics.map(function (m) {
            return '<div class="metric"><div class="metric__value">' + esc(m.value) + '</div><div class="metric__label">' + esc(m.label) + '</div></div>';
          }).join('') + '</div>'
        : '';
      var row = function (label, items) {
        return items && items.length
          ? '<p class="project__stack"><span class="muted">' + esc(label) + ':</span> ' + items.map(esc).join(' · ') + '</p>'
          : '';
      };
      var stack = row(T.ui.stackLabel, t.stack) + row(T.ui.rolesLabel, t.roles);
      // Сетка карточки: описание | галерея, ниже на всю ширину — цифры, стек, ссылки.
      return '<article class="card project reveal" id="project-' + id + '">' +
        '<div class="project__main">' +
          '<div class="project__top">' + status + '<span class="chip">' + esc(t.kind) + '</span>' +
            '<span class="mono muted">' + esc(fmtMonth(P.period.from, T)) + ' — ' + esc(fmtMonth(P.period.to, T)) + '</span></div>' +
          '<div class="project__heading">' +
            (P.icon ? '<img class="project__icon" src="' + esc(P.icon) + '" alt="" width="52" height="52">' : '') +
            '<h3 class="project__title">' + esc(t.title) + '</h3></div>' +
          '<p class="project__tagline">' + esc(t.tagline) + '</p>' +
          '<p class="project__role"><span class="muted">' + esc(T.ui.role) + ':</span> <b>' + esc(t.role) + '</b></p>' +
          '<ul class="project__list">' + t.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        renderMedia(id, P, t, T) +
        '<div class="project__extra">' +
          metrics + stack +
          (t.note ? '<p class="project__note">' + esc(t.note) + '</p>' : '') +
          renderLinks(P.links, T) +
        '</div>' +
      '</article>';
    });
    return sectionHead(T.ui.nav.projects) + '<div class="projects">' + cards.join('') + '</div>';
  }

  function renderSkills(T) {
    var groups = T.skills.map(function (g) {
      return '<div class="card skills__group reveal"><h3>' + esc(g.title) + '</h3><ul class="skill-list">' +
        g.items.map(function (it) {
          return '<li>' + esc(it.name) + '</li>';
        }).join('') + '</ul></div>';
    }).join('');
    return sectionHead(T.ui.nav.skills) + '<div class="skills">' + groups + '</div>';
  }

  function renderTools(T) {
    var icons = window.TOOL_ICONS || {};
    var tools = (S.tools || []).map(function (tl) {
      // Подписи нет — название в логотипе; для скринридеров и подсказки при наведении — title и sr-only
      return '<li class="tool tool--' + esc(tl.icon) + '" title="' + esc(tl.name) + '">' + (icons[tl.icon] || '') + '<span class="sr-only">' + esc(tl.name) + '</span></li>';
    }).join('');
    return tools ? sectionHead(T.ui.tools) + '<ul class="tools reveal">' + tools + '</ul>' : '';
  }

  function renderPath(T) {
    var tl = T.timeline.slice().reverse().map(function (e) {
      return '<div class="tl"><div class="tl__period mono">' + esc(e.period) + '</div>' +
        '<div class="tl__title">' + esc(e.title) + '</div><p class="tl__text">' + esc(e.text) + '</p></div>';
    }).join('');
    var ach = T.achievements.map(function (a) {
      return '<div class="ach"><span class="ach__year mono">' + esc(a.year) + '</span><span>' + (a.url
        ? '<a class="ach__link" href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.title) + ICONS.ext + '</a>'
        : esc(a.title)) +
        (a.stack ? '<small class="ach__stack">' + esc(a.stack) + '</small>' : '') + '</span></div>';
    }).join('');
    var E = T.education;
    var achTitle = T.cv.headings.achievements, eduTitle = T.cv.headings.education;
    return sectionHead(T.ui.nav.path) +
      '<div class="path">' +
        '<div class="card timeline reveal">' + tl + '</div>' +
        '<div class="path__row">' +
          '<div class="card side reveal" id="achievements"><h3>' + esc(achTitle) + '</h3>' + ach + '</div>' +
          '<div class="card side reveal"><h3>' + esc(eduTitle) + '</h3><div class="edu__school">' + esc(E.school) + '</div>' +
            '<p class="edu__text">' + esc(E.faculty) + '</p><p class="edu__text">' + esc(E.program) + '</p></div>' +
        '</div>' +
      '</div>';
  }

  function renderCollab(T) {
    var team = T.collab.team, inv = T.collab.investors;
    return sectionHead(T.ui.nav.collab) +
      '<div class="collab">' +
        '<div class="card reveal"><h3>' + esc(team.title) + '</h3><p class="collab__text">' + esc(team.text) + '</p>' +
          '<div class="roles" aria-label="' + esc(T.ui.lookingFor) + '">' + team.roles.map(function (r) {
            return '<div class="role"><b>' + esc(r.name) + '</b><span>' + esc(r.text) + '</span></div>';
          }).join('') + '</div>' +
          '<a class="btn btn--primary" href="' + esc(S.contacts.telegram) + '" target="_blank" rel="noopener">' + ICONS.send + esc(T.ui.writeTelegram) + '</a>' +
        '</div>' +
        '<div class="card reveal"><h3>' + esc(inv.title) + '</h3><p class="collab__text">' + esc(inv.text) + '</p>' +
          '<ul class="asks">' + inv.asks.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn" href="' + esc(S.files.onepager[lang]) + '" target="_blank" rel="noopener">' + ICONS.download + esc(T.ui.downloadOnepager) + '</a>' +
        '</div>' +
      '</div>';
  }

  function renderContact(T) {
    var email = S.contacts.email
      ? '<a class="btn" href="mailto:' + esc(S.contacts.email) + '">' + ICONS.mail + esc(S.contacts.email) + '</a>'
      : '';
    return '<div class="card contact reveal">' +
      '<h2 class="contact__title">' + esc(T.contact.title) + '</h2>' +
      '<p class="contact__text">' + esc(T.contact.text) + '</p>' +
      '<div class="contact__actions">' +
        '<a class="btn btn--primary" href="' + esc(S.contacts.telegram) + '" target="_blank" rel="noopener">' + ICONS.send + esc(S.contacts.telegramHandle) + '</a>' +
        email +
        '<a class="btn" href="' + esc(S.files.cv[lang]) + '" target="_blank" rel="noopener">' + ICONS.download + esc(T.ui.downloadCv) + '</a>' +
      '</div></div>';
  }

  function renderFooter(T) {
    return '<span>© ' + new Date().getFullYear() + ' ' + esc(T.person.name) + ' · ' + esc(T.person.location) + '</span>' +
      '<span>' + esc(T.ui.footer) + '</span>';
  }

  // ---------- Сборка ----------
  function render() {
    var T = C[lang];
    root.lang = lang;
    document.title = T.meta.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', T.meta.description);

    if (S.avatar) document.querySelector('.brand__mark').src = S.avatar;
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      el.textContent = get(T, el.getAttribute('data-bind'));
    });
    document.getElementById('top').innerHTML = renderHero(T);
    document.getElementById('projects').innerHTML = renderProjects(T);
    document.getElementById('skills').innerHTML = renderSkills(T);
    document.getElementById('path').innerHTML = renderPath(T);
    document.getElementById('tools').innerHTML = renderTools(T);
    document.getElementById('collab').innerHTML = renderCollab(T);
    document.getElementById('contact').innerHTML = renderContact(T);
    document.getElementById('footer').innerHTML = renderFooter(T);

    var langBtn = document.getElementById('langBtn');
    langBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
    langBtn.setAttribute('aria-label', T.ui.langToggle);
    langBtn.title = T.ui.langToggle;
    var themeBtn = document.getElementById('themeBtn');
    themeBtn.setAttribute('aria-label', T.ui.themeToggle);
    themeBtn.title = T.ui.themeToggle;
    document.querySelectorAll('.lightbox__close, .lightbox__prev, .lightbox__next').forEach(function (b) {
      b.setAttribute('aria-label', T.ui[b.getAttribute('data-lb')]);
    });

    observeReveal();
  }

  // ---------- Тема ----------
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('theme', next);
  });

  document.getElementById('langBtn').addEventListener('click', function () {
    lang = lang === 'ru' ? 'en' : 'ru';
    store('lang', lang);
    var url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    render();
  });

  // ---------- Появление при скролле ----------
  var revealObs = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' })
    : null;
  function observeReveal() {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
      if (revealObs) revealObs.observe(el); else el.classList.add('is-visible');
    });
  }

  // ---------- Подсветка пункта меню ----------
  var navLinks = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach(function (s) { spy.observe(s); });
  }
  var topbar = document.querySelector('.topbar');
  window.addEventListener('scroll', function () {
    topbar.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  // ---------- Lightbox ----------
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('.lightbox__img');
  var lbCount = lb.querySelector('.lightbox__count');
  var lbShots = [], lbIndex = 0;
  function lbShow(i) {
    lbIndex = (i + lbShots.length) % lbShots.length;
    lbImg.src = lbShots[lbIndex];
    lbCount.textContent = (lbIndex + 1) + ' / ' + lbShots.length;
    var multi = lbShots.length > 1;
    lb.querySelector('.lightbox__prev').hidden = !multi;
    lb.querySelector('.lightbox__next').hidden = !multi;
  }
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-gallery]');
    if (g) {
      lbShots = S.projects[g.getAttribute('data-gallery')].shots;
      lbShow(parseInt(g.getAttribute('data-index'), 10));
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
      return;
    }
    var act = e.target.closest('[data-lb]');
    if (act) {
      var a = act.getAttribute('data-lb');
      if (a === 'close') lb.close();
      if (a === 'prev') lbShow(lbIndex - 1);
      if (a === 'next') lbShow(lbIndex + 1);
      return;
    }
    if (e.target === lb) lb.close();
  });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });

  render();
})();
