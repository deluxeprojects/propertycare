const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3099';

const routes = [
  '/',
  '/home-services',
  '/home-services/guardian',
  '/areas',
  '/care-plans',
  '/blog',
  '/about',
  '/contact',
  '/login',
  '/privacy',
  '/terms',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    pages: [],
    summary: {
      totalPages: 0,
      totalViolations: 0,
      bySeverity: { critical: 0, serious: 0, moderate: 0, minor: 0 },
      violationTypes: {},
    },
  };

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    console.log(`Scanning: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // Extra wait for client-side hydration
      await page.waitForTimeout(1000);

      const results = await new AxeBuilder({ page }).analyze();

      const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
      }));

      report.pages.push({
        route,
        url,
        violationCount: violations.length,
        violations,
      });

      // Update summary
      for (const v of results.violations) {
        if (v.impact) {
          report.summary.bySeverity[v.impact] =
            (report.summary.bySeverity[v.impact] || 0) + 1;
        }
        report.summary.violationTypes[v.id] =
          (report.summary.violationTypes[v.id] || 0) + 1;
        report.summary.totalViolations++;
      }

      console.log(`  -> ${violations.length} violations found`);
    } catch (err) {
      console.error(`  -> ERROR on ${route}: ${err.message}`);
      report.pages.push({
        route,
        url,
        error: err.message,
        violationCount: 0,
        violations: [],
      });
    }
  }

  report.summary.totalPages = report.pages.length;

  const outDir = path.join(__dirname, 'qa-screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'a11y-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${outPath}`);

  await browser.close();
})();
