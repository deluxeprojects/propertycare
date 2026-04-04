const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.prokeep.ae';
const ROUTES = [
  '/',
  '/home-services',
  '/home-services/guardian',
  '/home-services/cleaning',
  '/home-services/cleaning/deep-cleaning',
  '/home-services/ac-services',
  '/areas',
  '/areas/dubai-marina',
  '/areas/palm-jumeirah',
  '/care-plans',
  '/blog',
  '/about',
  '/contact',
  '/login',
  '/privacy',
  '/terms',
];
const WIDTHS = [375, 768, 1440];
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

function slug(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const report = { generated: new Date().toISOString(), pages: [] };

  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const entry = { route, width, consoleErrors: [], pageErrors: [], failedRequests: [], loadTimeMs: null, screenshot: null, status: null };
      const context = await browser.newContext({ viewport: { width, height: 900 }, ignoreHTTPSErrors: true });
      const page = await context.newPage();

      page.on('console', msg => { if (msg.type() === 'error') entry.consoleErrors.push(msg.text()); });
      page.on('pageerror', err => entry.pageErrors.push(err.message));
      page.on('requestfailed', req => entry.failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }));

      const url = `${BASE}${route}`;
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        entry.status = resp?.status();
      } catch (e) {
        try {
          const resp = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
          entry.status = resp?.status();
        } catch (e2) {
          entry.status = 'timeout';
          entry.pageErrors.push(e2.message);
        }
      }

      try {
        const navEntry = await page.evaluate(() => {
          const entries = performance.getEntriesByType('navigation');
          if (entries.length) return entries[0].loadEventEnd - entries[0].startTime;
          return null;
        });
        entry.loadTimeMs = navEntry ? Math.round(navEntry) : null;
      } catch (_) {}

      const fname = `prod-${slug(route)}-${width}.png`;
      try {
        await page.screenshot({ path: path.join(OUT_DIR, fname), fullPage: true, timeout: 30000 });
        entry.screenshot = fname;
      } catch (e) {
        entry.screenshot = null;
        entry.pageErrors.push('Screenshot failed: ' + e.message);
      }

      report.pages.push(entry);
      console.log(`  [done] ${route} @ ${width}px — status ${entry.status}, load ${entry.loadTimeMs}ms`);
      await context.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT_DIR, 'prod-report.json'), JSON.stringify(report, null, 2));
  console.log(`\nReport written. ${report.pages.length} entries.`);
})();
