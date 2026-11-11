import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

// Run after npm run build. External analytics, avatars and comments are isolated.
const origin = 'http://127.0.0.1:4322';
const server = spawn(process.execPath, ['node_modules/astro/astro.js', 'preview', '--host', '127.0.0.1', '--port', '4322'], {
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: 'ignore'
});
let browser;
const errors = [];
const measurements = [];
let routeChecks = 0;
const output = 'docs/responsive';
const sizes = [[320,740],[375,812],[390,844],[600,900],[601,900],[680,900],[681,900],
  [768,1024],[980,900],[981,900],[1024,768],[1180,900],[1181,900],[1440,900],[1920,1080]];
const routes = ['/', '/page/2/', '/category/Retrospective/', '/category/Retrospective/page/2/',
  '/DBA/MySQL%20Version%20Up.md.html/', '/Full-Stack/Legacy%20API%20%EB%A6%AC%ED%8C%A9%ED%86%A0%EB%A7%81.md.html/'];
const shotWidths = new Set([375,768,1024,1440]);
const checkWidth = async (page, label) => {
  const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(width.document <= width.viewport + 1, `${label}: document overflow ${JSON.stringify(width)}`);
  return width;
};
async function visit(page, route) {
  const response = await page.goto(origin + route);
  assert.equal(response.status(), 200, route);
  await page.evaluate(() => document.fonts.ready);
}
async function htmlRoutes(dir = 'dist', prefix = '') {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(...await htmlRoutes(`${dir}/${entry.name}`, `${prefix}/${entry.name}`));
    else if (entry.name === 'index.html') result.push(`${prefix}/`);
  }
  return result;
}
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    if (attempt === 99) throw new Error('Preview server did not start');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await mkdir(`${output}/screenshots`, { recursive: true });

  for (const [width,height] of sizes) {
    await page.setViewportSize({width,height});
    for (const route of routes) {
      await visit(page, route);
      await checkWidth(page, `${width} ${route}`);
      routeChecks++;
      console.log(`PASS ${width} ${route}`);
      if (route === '/') {
        const layout = await page.evaluate(() => ({
          categoryHeight: document.querySelector('.category').getBoundingClientRect().height,
          postsTop: document.querySelector('.posts').getBoundingClientRect().top,
          columns: getComputedStyle(document.querySelector('.home-grid')).gridTemplateColumns,
          cardColumns: getComputedStyle(document.querySelector('.card')).gridTemplateColumns
        }));
        measurements.push({width,height,...layout});
        if (width <= 980) assert.ok(layout.categoryHeight < 180, 'Compact category navigation');
        for (const selector of ['[data-search-open]', '[data-theme-toggle]', '.pager a']) {
          const box = await page.locator(selector).first().boundingBox();
          assert.ok(box.width >= 44 && box.height >= 44, `${selector}: touch target`);
        }
      }
      if (route.includes('MySQL')) {
        const details = page.locator('.toc details');
        assert.equal(await details.getAttribute('open') !== null, width > 1180);
        if (width <= 1180) {
          assert.ok(await page.locator('.toc').evaluate(el => el.getBoundingClientRect().top) < await page.locator('article').evaluate(el => el.getBoundingClientRect().top));
          await details.locator('summary').click();
        }
        await page.locator('.toc a').first().click();
        assert.ok(new URL(page.url()).hash.length > 1, 'TOC anchor');
        await page.evaluate(() => scrollTo(0,0));
        if (width <= 1180) await details.locator('summary').click();
      }
      if (shotWidths.has(width) && (route === '/' || route.includes('MySQL'))) {
        await page.screenshot({path:`${output}/screenshots/after-${route === '/' ? 'home' : 'article'}-${width}.png`});
      }
    }

    // Search, keyboard focus containment, close button, theme and navigation.
    await visit(page, '/');
    await page.locator('[data-search-open]').click();
    await page.locator('[data-search-input]').fill('retrospective');
    await page.waitForSelector('[data-search-results] a');
    assert.ok((await page.locator('[data-search-results] a').first().boundingBox()).height >= 44, 'Search result touch target');
    const bounds = await page.locator('.search-box').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width + 1 && bounds.y + bounds.height <= height + 1, 'Search fits viewport');
    await page.locator('[data-search-close]').focus();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('[data-search-results] a').last().evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('[data-search-close]').evaluate(el => el === document.activeElement), true);
    if (width === 375) await page.screenshot({path:`${output}/screenshots/after-search-375.png`});
    await page.locator('[data-search-close]').click();
    assert.equal(await page.locator('[data-search-open]').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.keyboard.press('/');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-search-overlay]').evaluate(el => el.hidden), true);
    const theme = await page.locator('html').getAttribute('data-theme');
    await page.locator('[data-theme-toggle]').click();
    assert.notEqual(await page.locator('html').getAttribute('data-theme'), theme);
    if (width === 375) await page.screenshot({path:`${output}/screenshots/after-home-dark-375.png`});
    await page.reload();
    assert.notEqual(await page.locator('html').getAttribute('data-theme'), theme);
    await page.locator('[data-theme-toggle]').click();
    await page.locator('.pager a').nth(1).click();
    assert.equal(new URL(page.url()).pathname, '/page/2/');
    await page.locator('.category a').first().click();
    assert.ok(new URL(page.url()).pathname.startsWith('/category/'));
  }

  // Every generated route at small and wide sizes: catches content-dependent regressions.
  const allRoutes = await htmlRoutes();
  for (const width of [375,1440]) {
    await page.setViewportSize({width,height:900});
    for (const route of allRoutes) {
      await visit(page, route);
      await checkWidth(page, `${width} ${route}`);
      routeChecks++;
    }
  }

  // Stress fixture on real article, separate from authored content.
  await page.setViewportSize({width:320,height:740});
  await visit(page, routes[4]);
  await page.evaluate(() => {
    document.querySelector('.article-header h1').textContent = 'LongTitle'.repeat(60);
    document.querySelector('.article-content').insertAdjacentHTML('beforeend',
      `<pre><code>${'very_long_code_'.repeat(100)}</code></pre><table><tbody><tr>${'<td>long_unbroken_cell_'.concat('x'.repeat(200),'</td>').repeat(8)}</tr></tbody></table>`);
  });
  await checkWidth(page, 'Long title/code/table stress');
  for (const selector of ['pre', 'table']) {
    const scrollable = await page.locator(`.article-content ${selector}`).last().evaluate(el => {
      el.scrollLeft = 100;
      return el.scrollLeft > 0 && el.scrollWidth > el.clientWidth;
    });
    assert.ok(scrollable, `${selector} scrolls internally`);
  }
  // Short landscape viewport and 200% equivalent CSS viewport.
  await page.setViewportSize({width:667,height:320});
  await visit(page, '/');
  await page.locator('[data-search-open]').click();
  await page.locator('[data-search-input]').fill('retrospective');
  await page.waitForSelector('[data-search-results] a');
  const shortBox = await page.locator('.search-box').boundingBox();
  assert.ok(shortBox.y + shortBox.height <= 321, 'Landscape search fits');
  await checkWidth(page, 'Landscape search');
  await page.locator('[data-search-close]').click();
  await page.setViewportSize({width:720,height:450});
  await visit(page, routes[4]);
  await checkWidth(page, '1440x900 at 200% equivalent CSS viewport');
  assert.deepEqual(errors, [], 'Uncaught browser errors');
  const result = { browser: await browser.version(), representativeViewports: sizes, representativeRoutes: routes,
    generatedRoutes: allRoutes.length, routeChecks, uncaughtErrors: errors, measurements,
    passed: ['document overflow', 'compact categories', '44px primary controls', 'TOC layout and anchors',
      'search results and viewport containment', 'Tab/Shift+Tab and focus restore', 'Escape and shortcut',
      'theme persistence', 'pagination/category links', 'long title/code/table stress', 'short landscape search', '200% equivalent reflow'],
    limitations: ['Chromium only; no physical iOS/Android or virtual keyboard.',
      'External requests (analytics, avatar, giscus and remote article assets) blocked to isolate local layout.'] };
  await writeFile(`${output}/results.json`, JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
