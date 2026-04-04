const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.prokeep.ae';
const ROUTES = ['/', '/home-services', '/home-services/cleaning', '/areas', '/areas/dubai-marina', '/care-plans', '/blog', '/about', '/contact'];
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const report = { generated: new Date().toISOString(), pages: [] };

  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
    const page = await context.newPage();
    const url = `${BASE}${route}`;
    let entry = { route, url, violations: [], passes: 0, incomplete: 0, inapplicable: 0, error: null };

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (_) {
      try { await page.goto(url, { waitUntil: 'load', timeout: 15000 }); } catch (e) { entry.error = e.message; }
    }

    if (!entry.error) {
      try {
        const results = await new AxeBuilder({ page }).analyze();
        entry.violations = results.violations.map(v => ({
          id: v.id, impact: v.impact, description: v.description, helpUrl: v.helpUrl,
          nodes: v.nodes.length,
          targets: v.nodes.slice(0, 3).map(n => n.target.join(' '))
        }));
        entry.passes = results.passes.length;
        entry.incomplete = results.incomplete.length;
        entry.inapplicable = results.inapplicable.length;
      } catch (e) { entry.error = e.message; }
    }

    report.pages.push(entry);
    console.log(`  [a11y] ${route} — ${entry.violations.length} violations`);
    await context.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT_DIR, 'prod-a11y-report.json'), JSON.stringify(report, null, 2));
  console.log(`\nA11y report written. ${report.pages.length} pages scanned.`);
})();
