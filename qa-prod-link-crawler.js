const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.prokeep.ae';
const MAX_PAGES = 150;
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });

  const visited = new Set();
  const queue = ['/'];
  const report = { generated: new Date().toISOString(), internalLinks: [], brokenLinks: [], externalLinksWithoutRel: [], totalCrawled: 0 };

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const route = queue.shift();
    if (visited.has(route)) continue;
    visited.add(route);

    const page = await context.newPage();
    const url = `${BASE}${route}`;
    let status = null;

    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      status = resp?.status();
    } catch (_) {
      try {
        const resp = await page.goto(url, { waitUntil: 'load', timeout: 15000 });
        status = resp?.status();
      } catch (e) {
        status = 'timeout';
      }
    }

    report.internalLinks.push({ url: route, status });
    if (status === 404) report.brokenLinks.push({ url: route, status });

    // Extract links
    try {
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.href,
          rel: a.getAttribute('rel') || '',
          isExternal: false,
        }));
      });

      for (const link of links) {
        try {
          const parsed = new URL(link.href);
          if (parsed.hostname === 'www.prokeep.ae' || parsed.hostname === 'prokeep.ae') {
            const p = parsed.pathname.replace(/\/$/, '') || '/';
            if (!visited.has(p) && !queue.includes(p)) queue.push(p);
          } else if (parsed.protocol.startsWith('http')) {
            // External link - check rel
            if (!link.rel.includes('noopener') && !link.rel.includes('noreferrer')) {
              report.externalLinksWithoutRel.push({ from: route, href: link.href, rel: link.rel });
            }
          }
        } catch (_) {}
      }
    } catch (_) {}

    console.log(`  [crawl] ${route} — ${status} (visited: ${visited.size}, queue: ${queue.length})`);
    await page.close();
  }

  report.totalCrawled = visited.size;

  // Deduplicate external links without rel
  const seen = new Set();
  report.externalLinksWithoutRel = report.externalLinksWithoutRel.filter(l => {
    const key = `${l.from}|${l.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  await browser.close();
  fs.writeFileSync(path.join(OUT_DIR, 'prod-link-report.json'), JSON.stringify(report, null, 2));
  console.log(`\nLink report written. ${report.totalCrawled} pages crawled, ${report.brokenLinks.length} broken.`);
})();
