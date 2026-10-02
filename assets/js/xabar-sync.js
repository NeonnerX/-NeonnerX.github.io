/*
 * Данные проекта XABAR берутся с сайта XABAR (xabargame.github.io/data/content.js — источник правды).
 * Подключение (index.html, print/cv.html) — до data/content.js этого сайта:
 *   <script src="https://xabargame.github.io/data/content.js"></script>
 *   <script>window.XABAR_CONTENT = window.CONTENT; window.CONTENT = undefined;</script>
 *   <script src="data/content.js"></script>
 *   <script src="assets/js/xabar-sync.js"></script>
 * Общие поля проекта (описание, роль, ссылки, медиа, команда, запрос, one-pager) заменяются данными XABAR.
 * Личное (пункты резюме, стек, роли, хронология) остаётся в data/content.js.
 * Если сайт XABAR недоступен, используются локальные значения из data/content.js — держите их актуальными.
 */
(function () {
  'use strict';

  var BASE = 'https://xabargame.github.io/'; // совпадает с адресом в <script src> выше
  var X = window.XABAR_CONTENT, C = window.CONTENT;
  delete window.XABAR_CONTENT;
  if (!X || !X.shared || !C) return;

  // Пути в content.js XABAR относительные — делаем абсолютными относительно его сайта.
  function abs(p) { return p && !/^(https?:)?\/\//.test(p) ? BASE + p : p; }
  function setIf(obj, key, v) { if (v != null && v !== '') obj[key] = v; }

  var XS = X.shared, P = C.shared.projects.xabar;
  setIf(P, 'icon', abs(XS.icon));
  if (XS.period && XS.period.from) P.period.from = XS.period.from;
  if (XS.links) P.links = (XS.site ? [{ type: 'site', url: XS.site }] : []).concat(XS.links);
  if (XS.shots && XS.shots.length) P.shots = XS.shots.map(abs);
  if (XS.video != null) P.video = XS.video;

  ['ru', 'en'].forEach(function (lang) {
    var XT = X[lang], T = C[lang];
    if (!XT || !T) return;
    if (XS.files && XS.files.onepager && XS.files.onepager[lang]) C.shared.files.onepager[lang] = abs(XS.files.onepager[lang]);

    var t = T.projects.xabar;
    if (XT.hero) setIf(t, 'tagline', XT.hero.tagline);
    if (XT.founder) setIf(t, 'role', XT.founder.role);

    var team = T.collab.team, inv = T.collab.investors;
    if (XT.team) {
      setIf(team, 'title', XT.team.title);
      setIf(team, 'text', XT.team.text);
      if (XT.team.roles && XT.team.roles.length) team.roles = XT.team.roles;
    }
    if (XT.partners) {
      setIf(inv, 'title', XT.partners.title);
      setIf(inv, 'text', XT.partners.text);
    }
    if (XT.onepager && XT.onepager.ask && XT.onepager.ask.length) inv.asks = XT.onepager.ask;

    // Подписи для новых типов ссылок, которых нет в словаре этого сайта
    var lt = T.ui.linkTypes, xlt = (XT.ui && XT.ui.linkTypes) || {};
    Object.keys(xlt).forEach(function (k) { if (!lt[k]) lt[k] = xlt[k]; });
  });

  window.XABAR_SYNCED = true;
})();
