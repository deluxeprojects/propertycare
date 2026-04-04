const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE = 'http://localhost:3099';
const MAX_PAGES = 100;
const OUTPUT_DIR = path.join(__dirname, 'qa-screenshots');
const REPORT_PATH = path.join(OUTPUT_DIR, 'link-report.json');

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  const visited = new Set();
  const queue = [{ url: '/', source: 'start' }];
  const results = {
    totalLinksFound: 0,
    pagesVisited: 0,
    brokenLinks: [],       // 404s / 5xx
    redirectChains: [],     // 3xx
    externalLinksMissingRel: [],
    anchorIssues: [],
    localhostOrStagingUrls: [],
    nonFunctionalHashLinks: [],
    allVisited: [],
  };

  function normalise(href) {
    try {
      const u = new URL(href, BASE);
      // strip trailing slash for dedup (but keep "/" itself)
      let p = u.pathname.replace(/\/+$/, '') || '/';
      return u.origin === new URL(BASE).origin ? p + u.search : null;
    } catch { return null; }
  }

  function isInternal(href) {
    try {
      const u = new URL(href, BASE);
      return u.origin === new URL(BASE).origin;
    } catch { return false; }
  }

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const { url: rawUrl, source } = queue.shift();
    const normUrl = normalise(rawUrl) || rawUrl;
    if (visited.has(normUrl)) continue;
    visited.add(normUrl);

    const fullUrl = normUrl.startsWith('http') ? normUrl : BASE + normUrl;
    console.log(`[${visited.size}/${MAX_PAGES}] ${fullUrl}`);

    const page = await context.newPage();
    let status = 0;
    let redirected = false;
    let finalUrl = fullUrl;
    const redirectHops = [];

    page.on('response', (resp) => {
      if (resp.url().startsWith(BASE) && resp.request().isNavigationRequest()) {
        redirectHops.push({ url: resp.url(), status: resp.status() });
        status = resp.status();
        finalUrl = resp.url();
        if (resp.status() >= 300 && resp.status() < 400) redirected = true;
      }
    });

    try {
      const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (resp) {
        status = resp.status();
        finalUrl = resp.url();
      }
    } catch (e) {
      status = 0;
      results.brokenLinks.push({ url: fullUrl, source, status: 0, error: e.message.slice(0, 200) });
      await page.close();
      continue;
    }

    results.pagesVisited++;
    results.allVisited.push({ url: normUrl, status, finalUrl });

    if (status >= 400) {
      results.brokenLinks.push({ url: fullUrl, source, status });
    }
    if (redirectHops.length > 1) {
      results.redirectChains.push({ url: fullUrl, source, hops: redirectHops });
    }

    // Gather all links on the page
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]')).map(a => ({
        href: a.getAttribute('href'),
        resolvedHref: a.href,
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel'),
        text: (a.textContent || '').trim().slice(0, 80),
      }));
    });

    results.totalLinksFound += links.length;

    for (const link of links) {
      const { href, resolvedHref, target, rel, text } = link;

      // Check for localhost / staging URLs in href attributes
      if (href && (/localhost/i.test(href) || /staging\./i.test(href)) && !href.startsWith('/') && !href.startsWith('#')) {
        results.localhostOrStagingUrls.push({ page: normUrl, href, text });
      }

      // Check external links with target="_blank" missing rel="noopener noreferrer"
      if (target === '_blank' && !isInternal(resolvedHref)) {
        const relTokens = (rel || '').toLowerCase().split(/\s+/);
        if (!relTokens.includes('noopener') || !relTokens.includes('noreferrer')) {
          results.externalLinksMissingRel.push({ page: normUrl, href, rel: rel || '(none)', text });
        }
      }

      // Check broken anchor links
      if (href && href.startsWith('#') && href.length > 1) {
        const anchorId = href.slice(1);
        const exists = await page.evaluate((id) => !!document.getElementById(id), anchorId);
        if (!exists) {
          results.anchorIssues.push({ page: normUrl, anchor: href, text });
        }
      }

      // Non-functional href="#"
      if (href === '#') {
        results.nonFunctionalHashLinks.push({ page: normUrl, text });
      }

      // Enqueue internal links
      if (isInternal(resolvedHref)) {
        const norm = normalise(resolvedHref);
        if (norm && !visited.has(norm) && !norm.includes('/_next/') && !norm.match(/\.(png|jpg|jpeg|svg|gif|ico|css|js|woff|woff2|ttf|eot|pdf|json|xml|webp)$/i)) {
          queue.push({ url: norm, source: normUrl });
        }
      }
    }

    await page.close();
  }

  // Summary
  const summary = {
    totalLinksFound: results.totalLinksFound,
    pagesVisited: results.pagesVisited,
    brokenLinks: results.brokenLinks,
    redirectChains: results.redirectChains,
    externalLinksMissingRel: results.externalLinksMissingRel,
    anchorIssues: results.anchorIssues,
    localhostOrStagingUrls: results.localhostOrStagingUrls,
    nonFunctionalHashLinks: results.nonFunctionalHashLinks,
    allVisitedUrls: results.allVisited.map(v => `${v.status} ${v.url}`),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2));
  console.log(`\nDone. Report written to ${REPORT_PATH}`);
  console.log(`Pages visited: ${results.pagesVisited}`);
  console.log(`Broken links: ${results.brokenLinks.length}`);
  console.log(`Redirect chains: ${results.redirectChains.length}`);
  console.log(`External missing rel: ${results.externalLinksMissingRel.length}`);
  console.log(`Anchor issues: ${results.anchorIssues.length}`);
  console.log(`Localhost/staging URLs: ${results.localhostOrStagingUrls.length}`);
  console.log(`Non-functional # links: ${results.nonFunctionalHashLinks.length}`);

  await browser.close();
})();
