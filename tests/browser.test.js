import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let server, browser, base;
before(async () => {
  server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname.replace(/^\/everyday-strong\/?/, '')) || 'index.html';
    const file = path.resolve(root, relative);
    if (!file.startsWith(`${root}${path.sep}`)) { res.writeHead(403).end(); return; }
    try {
      const body = await readFile(file);
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml' }[path.extname(file)] || 'text/plain';
      res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/everyday-strong/`;
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
});
after(async () => { await browser?.close(); if (server) await new Promise(resolve => server.close(resolve)); });

test('mobile: explore, log, reload, move a session, back up and restore', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.goto(base);
  await page.locator('#app[aria-busy="false"]').waitFor();
  assert.match(await page.title(), /52-Week Home Workout/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://dmoliveira.github.io/everyday-strong/');
  assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), 'https://dmoliveira.github.io/everyday-strong/assets/social.png');
  assert.equal((await page.request.get(`${base}sitemap.xml`)).status(), 200);
  assert.equal((await page.request.get(`${base}assets/social.png`)).status(), 200);
  assert.equal(await page.locator('.exercise-card').count(), 6);
  assert.match(await page.locator('#week-overview').innerText(), /Foundation/);
  if (process.env.SCREENSHOT_PATH) await page.screenshot({ path: process.env.SCREENSHOT_PATH, fullPage: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(dimensions.scroll <= dimensions.width, `Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#week-select').selectOption('14');
  assert.match(await page.locator('#week-overview').innerText(), /Build/);
  await page.locator('#week-select').selectOption('13');
  assert.match(await page.locator('#week-overview').innerText(), /EASY \/ REVIEW/);
  await page.locator('#week-select').selectOption('1');
  const first = page.locator('.exercise-card').first();
  await first.locator('summary').click();
  await first.locator('[data-log-field="variation"]').fill('Sturdy chair');
  await first.locator('[data-log-field="discomfort"]').selectOption('none');
  await first.getByRole('button', { name: '+ Add a set' }).click();
  assert.equal(await first.locator('[data-set-field="value"]').first().evaluate(node => document.activeElement === node), true);
  await first.locator('[data-set-field="value"]').first().fill('12');
  await first.locator('[data-set-field="rir"]').first().fill('3');
  await first.getByRole('button', { name: 'Repeat last set' }).click();
  assert.equal(await first.locator('[data-set]').count(), 2);
  assert.equal(await first.locator('[data-set-field="value"]').last().inputValue(), '12');
  await first.locator('[data-action="done"]').check();
  await page.reload();
  await page.locator('#app[aria-busy="false"]').waitFor();
  assert.equal(await first.locator('[data-action="done"]').isChecked(), true);
  await first.locator('summary').click();
  assert.equal(await first.locator('[data-log-field="variation"]').inputValue(), 'Sturdy chair');
  assert.equal(await first.locator('[data-set]').count(), 2);
  await first.locator('[data-log-field="skipped"]').check();
  assert.equal(await first.locator('[data-action="done"]').isChecked(), false);
  await first.locator('[data-log-field="skipped"]').uncheck();
  for (let i = 0; i < 6; i++) await page.locator('.exercise-card').nth(i).locator('[data-action="done"]').check();
  assert.match(await page.locator('#progress-summary').innerText(), /1\s+strength sessions completed/);
  await page.locator('#session-date').fill('2026-01-06');
  await page.locator('#day-tabs [data-select-day="B"]').click();
  await page.locator('#session-date').fill('2026-01-07');
  assert.match(await page.locator('#spacing-warning').innerText(), /recovery/i);
  const cardio = page.locator('[data-cardio="bike"]');
  await cardio.locator('summary').click();
  await cardio.locator('[data-cardio-field="minutes"]').fill('20');
  await cardio.locator('[data-cardio-field="done"]').check();
  assert.match(await page.locator('#progress-summary').innerText(), /20\s+cardio minutes logged/);
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#export-json').click()]);
  const backup = JSON.parse(await readFile(await download.path(), 'utf8'));
  assert.equal(backup.data.cardio['1:bike'].minutes, '20');
  assert.equal(backup.data.scheduled['1:B'], '2026-01-07');
  const key = Object.keys(backup.data.exerciseLogs)[0];
  backup.data.exerciseLogs[key].variation = '<img src=x onerror="window.__xss=1">';
  backup.data.exerciseLogs[key].notes = '=HYPERLINK("https://example.org")';
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-json').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await page.locator('#day-tabs [data-select-day="A"]').click();
  await page.locator('.exercise-card').first().locator('summary').click();
  assert.equal(await page.locator('.exercise-card').first().locator('[data-log-field="variation"]').inputValue(), '<img src=x onerror="window.__xss=1">');
  assert.equal(await page.locator('img[src="x"]').count(), 0);
  assert.equal(await page.evaluate(() => window.__xss), undefined);
  const [csvDownload] = await Promise.all([page.waitForEvent('download'), page.locator('#export-csv').click()]);
  const csv = await readFile(await csvDownload.path(), 'utf8');
  assert.match(csv, /"'=HYPERLINK\(""https:\/\/example\.org""\)"/);
  assert.deepEqual(errors, []);
  assert.ok(requests.every(url => url.startsWith(base)), `Unexpected external request: ${requests.join(', ')}`);
  await context.close();
});

test('same-origin legacy migration preserves ticks and check-ins', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    if (!localStorage.getItem('homefit52_v1')) localStorage.setItem('homefit52_v1', JSON.stringify({ done: { '1_A_0': true }, logs: { 1: { notes: 'My old notes' } }, startDate: '' }));
  });
  const page = await context.newPage();
  await page.goto(base);
  await page.locator('#app[aria-busy="false"]').waitFor();
  assert.equal(await page.locator('.exercise-card').first().locator('[data-action="done"]').isChecked(), true);
  await page.locator('.legacy-checkins summary').click();
  assert.match(await page.locator('.legacy-checkins').innerText(), /My old notes/);
  assert.ok(await page.evaluate(() => localStorage.getItem('homefit52_v1')));
  assert.ok(await page.evaluate(() => localStorage.getItem('everyday_strong_v2')));
  await context.close();
});

test('unavailable browser storage is reported and does not prevent using the plan', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }));
  const page = await context.newPage();
  await page.goto(base);
  await page.locator('#app[aria-busy="false"]').waitFor();
  assert.match(await page.locator('#storage-status').innerText(), /unavailable|could not be read/i);
  assert.equal(await page.locator('#storage-notice').isVisible(), true);
  await page.locator('.exercise-card').first().locator('[data-action="done"]').check();
  assert.equal(await page.locator('.exercise-card').first().locator('[data-action="done"]').isChecked(), true);
  await context.close();
});

test('logged sets produce an explainable, revocable progression suggestion', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base);
  await page.locator('#app[aria-busy="false"]').waitFor();
  for (const week of ['1', '2']) {
    await page.locator('#week-select').selectOption(week);
    const first = page.locator('.exercise-card').first();
    await first.locator('summary').click();
    await first.locator('[data-log-field="variation"]').fill('chair');
    await first.locator('[data-log-field="discomfort"]').selectOption('none');
    await first.getByRole('button', { name: '+ Add a set' }).click();
    await first.locator('[data-set-field="value"]').fill('12');
    await first.locator('[data-set-field="rir"]').fill('3');
    await first.locator('[data-action="done"]').check();
  }
  const first = page.locator('.exercise-card').first();
  assert.match(await first.locator('.tip').innerText(), /weeks 1 and 2/i);
  await first.locator('[data-log-field="discomfort"]').selectOption('yes');
  assert.equal(await first.locator('.tip').count(), 0);
  await context.close();
});

test('mobile page has no automatically detectable WCAG 2 A/AA violations', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base);
  await page.locator('#app[aria-busy="false"]').waitFor();
  await page.locator('.exercise-card').first().locator('summary').click();
  await page.locator('.exercise-card').first().getByRole('button', { name: '+ Add a set' }).click();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  assert.deepEqual(result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => node.target) })), []);
  await context.close();
});
