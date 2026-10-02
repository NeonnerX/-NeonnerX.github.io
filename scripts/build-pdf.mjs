// Сборка PDF-резюме (RU/EN) из print/cv.html через headless-браузер.
// One-pager XABAR собирается в репозитории XABAR.github.io.
// Локально используется установленный Microsoft Edge; в CI — PDF_BROWSER=chromium.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Пути к PDF берём из того же content.js, что использует сайт, — чтобы ссылки не разъехались.
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(resolve(ROOT, 'data/content.js'), 'utf8'), sandbox);
const { files } = sandbox.window.CONTENT.shared;

const jobs = ['ru', 'en'].map((lang) => ({ tpl: 'print/cv.html', lang, out: files.cv[lang] }));

const channel = process.env.PDF_BROWSER === 'chromium' ? undefined : (process.env.PDF_BROWSER || 'msedge');
const browser = await chromium.launch(channel ? { channel } : {});
const todos = new Set();

// Область печати A4 при полях @page из print/print.css (12mm 15mm), px при 96 dpi.
const mm = (v) => (v * 96) / 25.4;
const PRINT_W = Math.floor(mm(210 - 2 * 15));
const PRINT_H = Math.floor(mm(297 - 2 * 12)) - 2; // 2px запаса на округления

try {
  const page = await browser.newPage({ viewport: { width: PRINT_W, height: PRINT_H } });
  await page.emulateMedia({ media: 'print' });
  for (const job of jobs) {
    const url = pathToFileURL(resolve(ROOT, job.tpl)).href + '?lang=' + job.lang;
    // networkidle — дожидаемся веб-шрифтов; без сети сработает системный фолбэк.
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForFunction(() => window.__READY === true);
    await page.evaluate(() => document.fonts.ready);
    for (const t of await page.evaluate(() => window.__TODOS)) todos.add(`[${job.lang}] ${t}`);
    const fit = await page.evaluate((h) => window.__fit(h), PRINT_H);

    const out = resolve(ROOT, job.out);
    mkdirSync(dirname(out), { recursive: true });
    const pdf = await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    const how = `${pages} стр.` + (fit.zoom < 1 ? `, сжато до ${Math.round(fit.zoom * 100)}%` : '');
    console.log(pages === fit.pages ? '✓' : '⚠', job.out, '—', how, pages === fit.pages ? '' : `(ожидалось ${fit.pages})`);
  }
} finally {
  await browser.close();
}

if (todos.size) {
  console.log('\nНе заполнено (в PDF выведено как [TODO]):');
  for (const t of todos) console.log('  -', t);
}
