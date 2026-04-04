const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3099';
const SCREENSHOT_DIR = path.join(__dirname, 'qa-screenshots');
const WIDTHS = [375, 768, 1440];
const ROUTES = [
  { path: '/', slug: 'home' },
  { path: '/home-services', slug: 'home-services' },
  { path: '/home-services/guardian', slug: 'home-services-guardian' },
  { path: '/areas', slug: 'areas' },
  { path: '/care-plans', slug: 'care-plans' },
  { path: '/blog', slug: 'blog' },
  { path: '/book', slug: 'book' },
  { path: '/about', slug: 'about' },
  { path: '/contact', slug: 'contact' },
  { path: '/login', slug: 'login' },
  { path: '/privacy', slug: 'privacy' },
  { path: '/terms', slug: 'terms' },
  { path: '/staff/login', slug: 'staff-login' },
  { path: '/admin/login', slug: 'admin-login' },
];

(async () => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const report = [];
  let totalScreenshots = 0;

  for (const route of ROUTES) {
    const entry = {
      route: route.path,
      consoleErrors: [],
      pageErrors: [],
      failedRequests: [],
      breakpoints: {},
    };

    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        ignoreHTTPSErrors: true,
      });
      const page = await context.newPage();

      const errors = [];
      const pageErrs = [];
      const failedReqs = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        pageErrs.push(err.message || String(err));
      });
      page.on('requestfailed', (req) => {
        failedReqs.push({ url: req.url(), failure: req.failure()?.errorText || 'unknown' });
      });

      const url = `${BASE_URL}${route.path}`;
      let loadTimeMs = null;
      let status = 'ok';

      try {
        const startTime = Date.now();
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const elapsed = Date.now() - startTime;

        // Try to get navigation timing from the browser
        try {
          const navTiming = await page.evaluate(() => {
            const entries = performance.getEntriesByType('navigation');
            if (entries.length > 0) {
              const nav = entries[0];
              return nav.loadEventEnd - nav.startTime;
            }
            return null;
          });
          loadTimeMs = navTiming && navTiming > 0 ? Math.round(navTiming) : elapsed;
        } catch {
          loadTimeMs = elapsed;
        }

        if (response && response.status() >= 400) {
          status = `HTTP ${response.status()}`;
        }

        // Wait a bit for any lazy-loaded content
        await page.waitForTimeout(500);

        const filename = `${route.slug}-${width}.png`;
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, filename),
          fullPage: true,
        });
        totalScreenshots++;
      } catch (err) {
        status = `error: ${err.message}`;
        // Still try to take a screenshot on error
        try {
          const filename = `${route.slug}-${width}.png`;
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, filename),
            fullPage: true,
          });
          totalScreenshots++;
        } catch { /* ignore */ }
      }

      entry.breakpoints[width] = {
        loadTimeMs,
        status,
      };

      // Merge errors (dedupe across breakpoints by accumulating)
      entry.consoleErrors.push(...errors.map((e) => ({ width, message: e })));
      entry.pageErrors.push(...pageErrs.map((e) => ({ width, message: e })));
      entry.failedRequests.push(...failedReqs.map((r) => ({ width, ...r })));

      await context.close();
    }

    report.push(entry);
    console.log(`Done: ${route.path}`);
  }

  await browser.close();

  const reportData = {
    generatedAt: new Date().toISOString(),
    totalScreenshots,
    totalRoutes: ROUTES.length,
    breakpoints: WIDTHS,
    pages: report,
  };

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'report.json'),
    JSON.stringify(reportData, null, 2)
  );

  console.log(`\nDone. ${totalScreenshots} screenshots saved to ${SCREENSHOT_DIR}`);
  console.log(`Report written to ${path.join(SCREENSHOT_DIR, 'report.json')}`);
})();
