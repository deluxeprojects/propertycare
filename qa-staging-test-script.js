const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://propertycare-q9r7i7vph-deluxeprojects-projects.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, 'qa-screenshots');
const WIDTH = 1440;
const HEIGHT = 900;

const ROUTES = [
  '/',
  '/home-services',
  '/home-services/guardian',
  '/home-services/cleaning',
  '/areas',
  '/areas/dubai-marina',
  '/care-plans',
  '/blog',
  '/about',
  '/contact',
  '/login',
  '/privacy',
  '/terms',
  '/staff/login',
  '/admin/login',
];

// Interaction tests
const INTERACTION_TESTS = {
  '/contact': async (page) => {
    const form = await page.$('form');
    return { contactFormRendered: !!form };
  },
  '/login': async (page) => {
    const form = await page.$('form');
    const emailInput = await page.$('input[type="email"], input[name="email"], input[type="text"]');
    const passwordInput = await page.$('input[type="password"]');
    return {
      loginFormRendered: !!form,
      hasEmailInput: !!emailInput,
      hasPasswordInput: !!passwordInput,
    };
  },
  '/book': async (page) => {
    // Visit /book separately for interaction test
    const bookUrl = `${BASE_URL}/book`;
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(err.message));
    let status = 0;
    try {
      const resp = await page.goto(bookUrl, { waitUntil: 'networkidle', timeout: 30000 });
      status = resp ? resp.status() : 0;
    } catch (e) {
      return { bookingWizardRendered: false, error: e.message };
    }
    await page.waitForTimeout(1000);
    // Look for booking wizard elements
    const wizard = await page.$('[data-testid="booking-wizard"], .booking-wizard, form, [class*="book"], [class*="wizard"], [class*="step"]');
    const buttons = await page.$$('button');
    return {
      status,
      bookingWizardRendered: !!wizard,
      buttonCount: buttons.length,
      consoleErrors,
      pageErrors,
    };
  },
  '/blog': async (page) => {
    const articles = await page.$$('article, [class*="card"], [class*="post"], [class*="blog"]');
    const links = await page.$$('a[href*="/blog/"]');
    return {
      blogPostsRendered: articles.length > 0,
      articleCount: articles.length,
      blogLinkCount: links.length,
    };
  },
};

function routeToSlug(route) {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replace(/\//g, '-');
}

async function main() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const route of ROUTES) {
    const slug = routeToSlug(route);
    console.log(`Testing ${route} ...`);

    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });
    page.on('requestfailed', req => {
      failedRequests.push({
        url: req.url(),
        failure: req.failure()?.errorText || 'unknown',
      });
    });

    const url = `${BASE_URL}${route}`;
    let status = 0;
    let loadTimeMs = 0;
    let title = '';
    let has500 = false;
    let hasAppError = false;
    let navigationError = null;

    const startTime = Date.now();
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      loadTimeMs = Date.now() - startTime;
      status = response ? response.status() : 0;
    } catch (err) {
      loadTimeMs = Date.now() - startTime;
      navigationError = err.message;
      console.log(`  ERROR navigating: ${err.message.substring(0, 100)}`);
    }

    // Wait a bit for any late rendering
    try { await page.waitForTimeout(1500); } catch {}

    try {
      title = await page.title();
    } catch {}

    // Check for 500 / Application error text
    try {
      const bodyText = await page.textContent('body');
      if (bodyText) {
        has500 = /\b500\b/.test(bodyText) && /error|internal/i.test(bodyText);
        hasAppError = /application\s+error/i.test(bodyText);
      }
    } catch {}

    // Take screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `staging-${slug}-${WIDTH}.png`);
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } catch (err) {
      console.log(`  Screenshot error: ${err.message.substring(0, 80)}`);
    }

    // Interaction tests for this route
    let interactionResult = null;
    if (INTERACTION_TESTS[route] && route !== '/book') {
      try {
        interactionResult = await INTERACTION_TESTS[route](page);
      } catch (err) {
        interactionResult = { error: err.message };
      }
    }

    const pageResult = {
      route,
      status,
      loadTimeMs,
      title,
      titleEmpty: !title || title.trim() === '',
      has500Text: has500,
      hasAppError,
      navigationError,
      consoleErrors,
      pageErrors,
      failedRequests,
      interactionTest: interactionResult,
    };

    results.push(pageResult);

    const statusIcon = status >= 200 && status < 400 ? 'OK' : 'ISSUE';
    console.log(`  Status: ${status} (${statusIcon}) | Load: ${loadTimeMs}ms | Title: "${title}" | ConsoleErrors: ${consoleErrors.length} | PageErrors: ${pageErrors.length} | FailedReqs: ${failedRequests.length}`);

    await context.close();
  }

  // Separate /book interaction test
  console.log('Testing /book interaction ...');
  const bookContext = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    ignoreHTTPSErrors: true,
  });
  const bookPage = await bookContext.newPage();
  let bookInteraction = null;
  try {
    bookInteraction = await INTERACTION_TESTS['/book'](bookPage);
  } catch (err) {
    bookInteraction = { error: err.message };
  }
  console.log(`  /book interaction: ${JSON.stringify(bookInteraction)}`);
  await bookContext.close();

  await browser.close();

  // Build report
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    viewport: { width: WIDTH, height: HEIGHT },
    totalRoutes: ROUTES.length,
    pages: results,
    interactionTests: {
      '/book': bookInteraction,
    },
    summary: {
      routesWithErrors: results.filter(r => r.status >= 400 || r.navigationError).map(r => r.route),
      routesWithConsoleErrors: results.filter(r => r.consoleErrors.length > 0).map(r => ({ route: r.route, count: r.consoleErrors.length })),
      routesWithPageErrors: results.filter(r => r.pageErrors.length > 0).map(r => ({ route: r.route, count: r.pageErrors.length })),
      routesWithFailedRequests: results.filter(r => r.failedRequests.length > 0).map(r => ({ route: r.route, count: r.failedRequests.length })),
      routesWithEmptyTitle: results.filter(r => r.titleEmpty).map(r => r.route),
      routesWith500Text: results.filter(r => r.has500Text).map(r => r.route),
      routesWithAppError: results.filter(r => r.hasAppError).map(r => r.route),
    },
  };

  // Merge interaction results from route tests into report
  for (const r of results) {
    if (r.interactionTest) {
      report.interactionTests[r.route] = r.interactionTest;
    }
  }

  const reportPath = path.join(SCREENSHOT_DIR, 'staging-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${reportPath}`);
  console.log(`\nSUMMARY:`);
  console.log(`  Routes with HTTP errors: ${report.summary.routesWithErrors.length > 0 ? report.summary.routesWithErrors.join(', ') : 'none'}`);
  console.log(`  Routes with console errors: ${report.summary.routesWithConsoleErrors.length > 0 ? JSON.stringify(report.summary.routesWithConsoleErrors) : 'none'}`);
  console.log(`  Routes with page errors: ${report.summary.routesWithPageErrors.length > 0 ? JSON.stringify(report.summary.routesWithPageErrors) : 'none'}`);
  console.log(`  Routes with failed requests: ${report.summary.routesWithFailedRequests.length > 0 ? JSON.stringify(report.summary.routesWithFailedRequests) : 'none'}`);
  console.log(`  Routes with empty title: ${report.summary.routesWithEmptyTitle.length > 0 ? report.summary.routesWithEmptyTitle.join(', ') : 'none'}`);
  console.log(`  Routes with 500 text: ${report.summary.routesWith500Text.length > 0 ? report.summary.routesWith500Text.join(', ') : 'none'}`);
  console.log(`  Routes with "Application error": ${report.summary.routesWithAppError.length > 0 ? report.summary.routesWithAppError.join(', ') : 'none'}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
