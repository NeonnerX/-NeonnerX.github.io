// Собирает горизонтальные логотипы инструментов в assets/js/tool-icons.js
// с обрезкой viewBox по фактическим границам (замер в браузере со шрифтами сайта).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [,, nm, root] = process.argv;
const dev = (f) => readFileSync(`${nm}/devicon/icons/${f}`, 'utf8');
const si = (f) => readFileSync(`${nm}/simple-icons/icons/${f}`, 'utf8');
const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/g, '');

// Unity — монохромный бренд: весь логотип цветом текста
const unity = inner(dev('unity/unity-original-wordmark.svg'))
  .replace(/fill="(#4c4c4c|gray)"/g, 'fill="currentColor"')
  .replace(/<path(?![^>]*fill=)/g, '<path fill="currentColor"');

// Blender — знак в фирменных цветах, надпись (#235785, правая часть) помечаем wm-text
let blender = inner(dev('blender/blender-original-wordmark.svg'));
const bParts = blender.split('fill="#235785"');
// второе вхождение #235785 — надпись (первое — зрачок знака)
blender = bParts[0] + 'fill="#235785"' + bParts[1] + 'class="wm-text" fill="#235785"' + bParts.slice(2).join('fill="#235785"');

// Trello — знак с градиентом, надпись #293856 → wm-text; уникальный id градиента
const trello = inner(dev('trello/trello-original-wordmark.svg'))
  .replace(/id="a"/g, 'id="trello-wm-grad"').replace(/url\(#a\)/g, 'url(#trello-wm-grad)')
  .replace('fill="#293856"', 'class="wm-text" fill="#293856"');

// C# — официального горизонтального знака нет: знак + надпись шрифтом сайта
const csharp = inner(dev('csharp/csharp-original.svg')) +
  '<text x="146" y="64" dominant-baseline="central" font-family="Manrope, sans-serif" font-weight="800" font-size="78" fill="currentColor">C#</text>';

// GitHub — у devicon wordmark вертикальный; собираем горизонтальный: знак Invertocat + надпись
const ghPath = si('github.svg').match(/ d="([^"]+)"/)[1];
const github = `<path fill="currentColor" transform="scale(5.3333)" d="${ghPath}"/>` +
  '<text x="150" y="64" dominant-baseline="central" font-family="Manrope, sans-serif" font-weight="700" font-size="76" fill="currentColor">GitHub</text>';

// Claude Code — знак (пиксельный персонаж) в фирменном цвете #D97757 + надпись; горизонтального знака в наборах нет
const ccPath = si('claudecode.svg').match(/ d="([^"]+)"/)[1];
const claudecode = `<path fill="#D97757" transform="scale(5.3333)" d="${ccPath}"/>` +
  '<text x="150" y="64" dominant-baseline="central" font-family="Manrope, sans-serif" font-weight="700" font-size="76" fill="currentColor">Claude Code</text>';

const parts = { unity, csharp, blender, github, trello, claudecode };
// Запас справа для логотипов с надписью шрифтом: getBBox может недомерить последнюю букву
const padRight = { csharp: 12, github: 16, claudecode: 16 };

const b = await chromium.launch({ channel: 'msedge' });
const page = await b.newPage();
const fonts = pathToFileURL(`${root}/assets/fonts/fonts.css`).href;
let html = `<link rel="stylesheet" href="${fonts}">`;
for (const [k, body] of Object.entries(parts)) html += `<svg id="${k}" width="2000" height="400" viewBox="0 0 1000 200" style="color:#000">${body}</svg>`;
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const boxes = await page.evaluate((keys) => Object.fromEntries(keys.map(k => {
  const r = document.getElementById(k).getBBox(); return [k, [r.x, r.y, r.width, r.height]];
})), Object.keys(parts));
await b.close();

const fmt = (n) => +n.toFixed(2);
let js = `/*
 * Горизонтальные логотипы (знак + название) инструментов. Генерируется скриптом из пакетов:
 *   Devicon (MIT) — Unity, Blender, Trello (wordmark), знак C#;
 *   Simple Icons (CC0 1.0) — знаки GitHub и Claude Code.
 * У C# нет официального горизонтального товарного знака, у GitHub в наборах только вертикальный,
 * у Claude Code — только знак, —
 * для них знак дополнен названием шрифтом сайта.
 * Unity и GitHub — монохромные бренды (currentColor); у Blender и Trello надпись (.wm-text)
 * в тёмной теме перекрашивается в цвет текста, знаки остаются в фирменных цветах.
 * Товарные знаки принадлежат их владельцам и используются только для обозначения применяемых инструментов.
 */
window.TOOL_ICONS = {\n`;
for (const [k, body] of Object.entries(parts)) {
  const [x, y, w0, h] = boxes[k];
  const w = w0 + (padRight[k] || 0);
  const svg = `<svg viewBox="${fmt(x)} ${fmt(y)} ${fmt(w)} ${fmt(h)}" aria-hidden="true">${body.replace(/\s*\n\s*/g, ' ').trim()}</svg>`;
  js += `  ${k}: '${svg.replace(/'/g, '"')}',\n`;
  console.log(k, boxes[k].map(fmt).join(' '), 'aspect', fmt(w / h));
}
js += '};\n';
writeFileSync(`${root}/assets/js/tool-icons.js`, js, 'utf8');
