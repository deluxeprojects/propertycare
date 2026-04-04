const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.prokeep.ae';
const SCREENSHOT_DIR = path.join(__dirname, 'qa-screenshots');

// --- Config ---
const ROUTES = [
  '/', '/home-services', '/home-services/guardian', '/home-services/cleaning',
  '/home-services/cleaning/deep-cleaning', '/home-services/ac-services',
  '/areas', '/areas/dubai-marina', '/areas/palm-jumeirah',
  '/care-plans', '/blog', '/about', '/contact', '/login', '/privacy', '/terms'
];
const BREAKPOINTS = [375, 768, 1440];
const A11Y_PAGES = ['/', '/home-services', '/areas', '/areas/dubai-marina', '/care-plans', '/blog', '/about', '/contact'];
const MAX_CRAWL = 150;

// Helpers
function slug(route) {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replace(/\//g, '-');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===================== 1. SCREENSHOTS =====================
async function runScreenshots(browser) {
  console.log('\n=== PHASE 1: Screenshots (16 routes x 3 breakpoints) ===\n');
  const results = [];

  for (const route of ROUTES) {
    for (const width of BREAKPOINTS) {
      const url = `${BASE}${route}`;
      const name = `prod-${slug(route)}-${width}`;
      const file = `${name}.png`;
      const entry = { route, width, file, url, consoleErrors: [], pageErrors: [], failedRequests: [], loadTimeMs: null, status: null };

      let context, page;
      try {
        context = await browser.newContext({ viewport: { width, height: 900 }, ignoreHTTPSErrors: true });
        page = await context.newPage();

        page.on('console', msg => { if (msg.type() === 'error') entry.consoleErrors.push(msg.text()); });
        page.on('pageerror', err => entry.pageErrors.push(err.message));
        page.on('requestfailed', req => entry.failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }));

        const start = Date.now();
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => {
          // fallback: try load event
          return page.goto(url, { waitUntil: 'load', timeout: 30000 });
        });
        entry.loadTimeMs = Date.now() - start;
        entry.status = resp?.status() ?? null;

        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, file), fullPage: true });
        entry.screenshotOk = true;
        console.log(`  [OK] ${name} (${entry.loadTimeMs}ms, status ${entry.status})`);
      } catch (err) {
        entry.screenshotOk = false;
        entry.error = err.message;
        console.log(`  [FAIL] ${name}: ${err.message.slice(0, 120)}`);
      } finally {
        if (context) await context.close().catch(() => {});
      }
      results.push(entry);
    }
  }
  return results;
}

// ===================== 2. ACCESSIBILITY =====================
async function runAccessibility(browser) {
  console.log('\n=== PHASE 2: Accessibility (axe-core on 8 pages) ===\n');
  const results = [];

  for (const route of A11Y_PAGES) {
    const url = `${BASE}${route}`;
    let context, page;
    try {
      context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
      page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
        page.goto(url, { waitUntil: 'load', timeout: 30000 })
      );
      await page.waitForTimeout(500);

      const axeResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();

      const entry = {
        route, url,
        violationCount: axeResults.violations.length,
        violations: axeResults.violations.map(v => ({
          id: v.id, impact: v.impact, description: v.description,
          helpUrl: v.helpUrl,
          nodes: v.nodes.length,
          targets: v.nodes.slice(0, 5).map(n => n.target.join(' '))
        })),
        incompleteCount: axeResults.incomplete.length,
        passCount: axeResults.passes.length
      };
      results.push(entry);
      console.log(`  [OK] ${route}: ${entry.violationCount} violations, ${entry.passCount} passes`);
    } catch (err) {
      results.push({ route, url, error: err.message });
      console.log(`  [FAIL] ${route}: ${err.message.slice(0, 120)}`);
    } finally {
      if (context) await context.close().catch(() => {});
    }
  }
  return results;
}

// ===================== 3. LINK CRAWL =====================
async function runLinkCrawl(browser) {
  console.log('\n=== PHASE 3: Link Crawl (up to 150 pages) ===\n');
  const visited = new Set();
  const queue = ['/'];
  const pageResults = [];
  const externalLinks = [];
  const brokenLinks = [];

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });

  while (queue.length > 0 && visited.size < MAX_CRAWL) {
    const route = queue.shift();
    if (visited.has(route)) continue;
    visited.add(route);

    const url = `${BASE}${route}`;
    const page = await context.newPage();
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null);
      const status = resp?.status() ?? 0;

      if (status >= 400) {
        brokenLinks.push({ url, status, foundOn: 'crawl' });
      }

      // Extract links
      const links = await page.$$eval('a[href]', anchors => anchors.map(a => ({
        href: a.getAttribute('href'),
        rel: a.getAttribute('rel') || '',
        text: (a.textContent || '').trim().slice(0, 80)
      }))).catch(() => []);

      const internalNew = [];
      for (const link of links) {
        const href = link.href;
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;

        try {
          const parsed = new URL(href, BASE);
          if (parsed.hostname === 'www.prokeep.ae' || parsed.hostname === 'prokeep.ae') {
            const path = parsed.pathname.replace(/\/$/, '') || '/';
            if (!visited.has(path) && !queue.includes(path)) {
              internalNew.push(path);
              queue.push(path);
            }
          } else {
            externalLinks.push({
              href: parsed.href,
              rel: link.rel,
              foundOn: route,
              hasNoopener: link.rel.includes('noopener'),
              hasNoreferrer: link.rel.includes('noreferrer'),
              hasNofollow: link.rel.includes('nofollow'),
              text: link.text
            });
          }
        } catch (_) {}
      }

      pageResults.push({ route, status, linksFound: links.length, newInternal: internalNew.length });
      if (visited.size % 10 === 0 || visited.size <= 5) {
        console.log(`  Crawled ${visited.size} pages, queue: ${queue.length}`);
      }
    } catch (err) {
      pageResults.push({ route, error: err.message.slice(0, 200) });
    } finally {
      await page.close().catch(() => {});
    }
  }

  await context.close().catch(() => {});

  // Check a sample of external links for status
  console.log(`  Checking ${Math.min(externalLinks.length, 30)} external links...`);
  const extContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const extPage = await extContext.newPage();
  const checkedExternal = [];
  const uniqueExternal = [...new Map(externalLinks.map(l => [l.href, l])).values()].slice(0, 30);

  for (const ext of uniqueExternal) {
    try {
      const resp = await extPage.goto(ext.href, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => null);
      checkedExternal.push({ ...ext, status: resp?.status() ?? 0 });
    } catch (e) {
      checkedExternal.push({ ...ext, status: 0, error: e.message.slice(0, 100) });
    }
  }
  await extContext.close().catch(() => {});

  console.log(`  Crawl complete: ${visited.size} pages, ${externalLinks.length} external links found`);

  return {
    pagesVisited: visited.size,
    pages: pageResults,
    brokenLinks,
    externalLinks: externalLinks.length,
    externalLinkDetails: externalLinks,
    checkedExternal,
    missingRelAttributes: externalLinks.filter(l => !l.hasNoopener || !l.hasNoreferrer)
  };
}

// ===================== 4. FORM VERIFICATION =====================
async function runFormVerification(browser) {
  console.log('\n=== PHASE 4: Form Verification ===\n');
  const results = {};

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });

  // /contact
  try {
    const page = await context.newPage();
    await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
      page.goto(`${BASE}/contact`, { waitUntil: 'load', timeout: 30000 })
    );
    await page.waitForTimeout(1000);

    const fields = {};
    for (const field of ['name', 'email', 'phone', 'message']) {
      const selector = `input[name*="${field}" i], input[placeholder*="${field}" i], textarea[name*="${field}" i], textarea[placeholder*="${field}" i], input[id*="${field}" i], textarea[id*="${field}" i], input[type="${field}" i]`;
      const el = await page.$(selector);
      fields[field] = !!el;
      if (!el) {
        // Broader search: try label text
        const byLabel = await page.$(`label:has-text("${field}") + input, label:has-text("${field}") + textarea`).catch(() => null);
        if (byLabel) fields[field] = true;
      }
    }
    // Also try type=email for email
    if (!fields.email) {
      fields.email = !!(await page.$('input[type="email"]'));
    }
    if (!fields.phone) {
      fields.phone = !!(await page.$('input[type="tel"]'));
    }
    const formEl = await page.$('form');
    results.contact = { formFound: !!formEl, fields, ok: Object.values(fields).every(Boolean) };
    console.log(`  /contact: form=${!!formEl}, fields=${JSON.stringify(fields)}`);
    await page.close();
  } catch (err) {
    results.contact = { error: err.message };
    console.log(`  /contact FAIL: ${err.message.slice(0, 120)}`);
  }

  // /login
  try {
    const page = await context.newPage();
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
      page.goto(`${BASE}/login`, { waitUntil: 'load', timeout: 30000 })
    );
    await page.waitForTimeout(1000);

    const emailField = await page.$('input[type="email"], input[name*="email" i], input[id*="email" i], input[placeholder*="email" i]');
    const passwordField = await page.$('input[type="password"], input[name*="password" i]');
    const formEl = await page.$('form');
    results.login = { formFound: !!formEl, emailField: !!emailField, passwordField: !!passwordField, ok: !!emailField && !!passwordField };
    console.log(`  /login: form=${!!formEl}, email=${!!emailField}, password=${!!passwordField}`);
    await page.close();
  } catch (err) {
    results.login = { error: err.message };
    console.log(`  /login FAIL: ${err.message.slice(0, 120)}`);
  }

  // /book
  try {
    const page = await context.newPage();
    await page.goto(`${BASE}/book`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() =>
      page.goto(`${BASE}/book`, { waitUntil: 'load', timeout: 30000 })
    );
    await page.waitForTimeout(1000);

    const status = (await page.evaluate(() => document.title)) || '';
    const wizard = await page.$('[class*="wizard" i], [class*="booking" i], [class*="stepper" i], [id*="wizard" i], [id*="booking" i], form');
    const inputs = await page.$$('input, select, textarea');
    const buttons = await page.$$('button');
    results.book = {
      pageTitle: status,
      wizardFound: !!wizard,
      inputCount: inputs.length,
      buttonCount: buttons.length,
      ok: inputs.length > 0
    };
    console.log(`  /book: wizard=${!!wizard}, inputs=${inputs.length}, buttons=${buttons.length}`);
    await page.close();
  } catch (err) {
    results.book = { error: err.message };
    console.log(`  /book FAIL: ${err.message.slice(0, 120)}`);
  }

  await context.close().catch(() => {});
  return results;
}

// ===================== MAIN =====================
(async () => {
  console.log(`\nProkeep.ae Production QA Test Suite`);
  console.log(`Base: ${BASE}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  try {
    // Phase 1: Screenshots
    const screenshotResults = await runScreenshots(browser);
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'prod-report.json'),
      JSON.stringify({ generatedAt: new Date().toISOString(), screenshots: screenshotResults }, null, 2)
    );
    console.log(`\n  >> Saved prod-report.json (${screenshotResults.length} entries)`);

    // Phase 2: Accessibility
    const a11yResults = await runAccessibility(browser);
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'prod-a11y-report.json'),
      JSON.stringify({ generatedAt: new Date().toISOString(), pages: a11yResults }, null, 2)
    );
    console.log(`  >> Saved prod-a11y-report.json`);

    // Phase 3: Link Crawl
    const linkResults = await runLinkCrawl(browser);
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'prod-link-report.json'),
      JSON.stringify({ generatedAt: new Date().toISOString(), ...linkResults }, null, 2)
    );
    console.log(`  >> Saved prod-link-report.json`);

    // Phase 4: Form Verification
    const formResults = await runFormVerification(browser);
    // Append form results to prod-report.json
    const report = JSON.parse(fs.readFileSync(path.join(SCREENSHOT_DIR, 'prod-report.json'), 'utf8'));
    report.forms = formResults;
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'prod-report.json'), JSON.stringify(report, null, 2));
    console.log(`  >> Updated prod-report.json with form results`);

    // Summary
    console.log('\n========== SUMMARY ==========');
    const okScreenshots = screenshotResults.filter(s => s.screenshotOk).length;
    const failScreenshots = screenshotResults.filter(s => !s.screenshotOk).length;
    const totalConsoleErrors = screenshotResults.reduce((s, r) => s + r.consoleErrors.length, 0);
    const totalPageErrors = screenshotResults.reduce((s, r) => s + r.pageErrors.length, 0);
    const totalFailedReqs = screenshotResults.reduce((s, r) => s + r.failedRequests.length, 0);
    const avgLoad = Math.round(screenshotResults.filter(s => s.loadTimeMs).reduce((s, r) => s + r.loadTimeMs, 0) / screenshotResults.filter(s => s.loadTimeMs).length);

    console.log(`Screenshots: ${okScreenshots}/${screenshotResults.length} OK, ${failScreenshots} failed`);
    console.log(`Console errors: ${totalConsoleErrors}, Page errors: ${totalPageErrors}, Failed requests: ${totalFailedReqs}`);
    console.log(`Avg load time: ${avgLoad}ms`);

    const totalViolations = a11yResults.reduce((s, r) => s + (r.violationCount || 0), 0);
    console.log(`Accessibility: ${totalViolations} total violations across ${a11yResults.length} pages`);

    console.log(`Link crawl: ${linkResults.pagesVisited} pages, ${linkResults.brokenLinks.length} broken, ${linkResults.externalLinks} external`);
    console.log(`External links missing rel attrs: ${linkResults.missingRelAttributes.length}`);
    console.log(`Forms: contact=${formResults.contact?.ok}, login=${formResults.login?.ok}, book=${formResults.book?.ok}`);
    console.log(`\nCompleted: ${new Date().toISOString()}`);

  } finally {
    await browser.close();
  }
})();
