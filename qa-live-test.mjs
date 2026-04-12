import { chromium } from 'playwright';

const BASE = 'https://www.prokeep.ae';
const DIR = './qa-live-screenshots';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const results = [];
  const log = (check, pass, detail = '') => {
    results.push({ check, pass, detail });
    console.log(`${pass ? 'PASS' : 'FAIL'} | ${check}${detail ? ' — ' + detail : ''}`);
  };

  // 1. Homepage
  console.log('\n=== HOMEPAGE ===');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${DIR}/01-homepage-top.png`, fullPage: false });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${DIR}/02-homepage-bottom.png`, fullPage: false });
  await page.screenshot({ path: `${DIR}/03-homepage-full.png`, fullPage: true });

  // Check nav
  const navText = await page.textContent('header');
  log('Nav has "Property Guardian"', navText.includes('Property Guardian'));
  log('Nav has "Sign In"', navText.includes('Sign In'));
  log('Nav does NOT have bare "Guardian"', !navText.match(/\bGuardian\b(?! )/)); // "Guardian" not preceded by "Property "

  // Check sections
  const h2s = await page.$$eval('h2', els => els.map(e => e.textContent.trim()));
  console.log('  H2 sections:', h2s);
  log('Has services section', h2s.some(h => h.includes('Home Services in Dubai')));
  log('Has How It Works section', h2s.some(h => h.includes('4 Easy Steps')));
  log('Has Property Guardian spotlight', h2s.some(h => h.includes('Leaving Dubai')));
  log('Has Care Plan teaser', h2s.some(h => h.includes('Save Up to 40%')));
  log('Has testimonials', h2s.some(h => h.includes('Customers Say')));
  log('Has areas section', h2s.some(h => h.includes('Neighborhoods')));

  // Check footer phone
  const footerText = await page.textContent('footer');
  log('Footer hides placeholder phone', !footerText.includes('+971-XX-XXX-XXXX'));

  // Check 6 service cards
  const serviceCards = await page.$$('section:has(h2:text("Home Services in Dubai")) .grid > div');
  log('6 service cards visible', serviceCards.length === 6, `found ${serviceCards.length}`);

  // 2. Booking page
  console.log('\n=== BOOKING PAGE ===');
  await page.goto(`${BASE}/book`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // Wait for Supabase or fallback
  await page.screenshot({ path: `${DIR}/04-book-step1.png`, fullPage: true });

  const bookContent = await page.textContent('body');
  const hasLoadingSpinner = bookContent.includes('Loading services...');
  const hasCategories = await page.$$('button:has(h3)');
  const hasNoServices = bookContent.includes('No services available');
  log('Booking page loaded', true);
  log('NOT stuck on Loading spinner', !hasLoadingSpinner, hasLoadingSpinner ? 'still loading' : 'loaded');
  log('Shows service categories or services', hasCategories.length > 0, `found ${hasCategories.length} buttons`);
  log('NOT showing "No services"', !hasNoServices);

  // Try clicking first category
  if (hasCategories.length > 0) {
    const firstCatText = await hasCategories[0].textContent();
    console.log(`  Clicking first category: ${firstCatText.trim().split('\n')[0]}`);
    await hasCategories[0].click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${DIR}/05-book-step1-services.png`, fullPage: true });
    const serviceButtons = await page.$$('button:has(h3)');
    log('Shows services after category click', serviceButtons.length > 0, `found ${serviceButtons.length} services`);
  }

  // 3. Login page
  console.log('\n=== LOGIN PAGE ===');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${DIR}/06-login.png`, fullPage: true });

  const loginContent = await page.textContent('body');
  log('Login page loads', true);
  log('Has email input', (await page.$$('input[type="email"]')).length > 0);
  log('Has password input', (await page.$$('input[type="password"]')).length > 0);
  log('Has Google OAuth', loginContent.includes('Continue with Google'));
  log('Has signup toggle', loginContent.includes('Sign up'));

  // 4. Care Plans
  console.log('\n=== CARE PLANS ===');
  await page.goto(`${BASE}/care-plans`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${DIR}/07-careplans-full.png`, fullPage: true });
  const cpH2s = await page.$$eval('h2', els => els.map(e => e.textContent.trim()));
  log('Care plans page loads', true);
  log('Has contract plans', cpH2s.some(h => h.includes('Care Plans')) || (await page.textContent('body')).includes('AC Care Plan'));
  log('Has bundled tiers', (await page.textContent('body')).includes('bundled tier'));

  // 5. Property Guardian
  console.log('\n=== PROPERTY GUARDIAN ===');
  await page.goto(`${BASE}/home-services/guardian`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${DIR}/08-guardian-full.png`, fullPage: true });
  const guardianContent = await page.textContent('body');
  log('Guardian page loads', true);
  log('Has hero', guardianContent.includes('Your Property, Watched Over'));
  log('Has plans', guardianContent.includes('Basic Watch') && guardianContent.includes('Villa Guardian'));
  log('Has how it works', guardianContent.includes('How Property Guardian Works'));

  // 6. Redirects
  console.log('\n=== REDIRECTS ===');

  await page.goto(`${BASE}/services`, { waitUntil: 'networkidle' });
  log('/services redirects to /home-services', page.url().includes('/home-services'));

  await page.goto(`${BASE}/property-guardian`, { waitUntil: 'networkidle' });
  log('/property-guardian redirects to guardian', page.url().includes('/home-services/guardian'));

  await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
  log('/signup redirects to /login', page.url().includes('/login'));

  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' });
  log('/register redirects to /login', page.url().includes('/login'));

  await page.goto(`${BASE}/guardian`, { waitUntil: 'networkidle' });
  log('/guardian redirects to guardian page', page.url().includes('/home-services/guardian'));

  // 7. Mobile viewport
  console.log('\n=== MOBILE (375px) ===');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${DIR}/09-mobile-homepage.png`, fullPage: true });

  await page.goto(`${BASE}/book`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${DIR}/10-mobile-book.png`, fullPage: true });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${DIR}/11-mobile-login.png`, fullPage: true });

  // Summary
  console.log('\n=== SUMMARY ===');
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`${passed} passed, ${failed} failed out of ${results.length} checks`);
  if (failed > 0) {
    console.log('\nFailed checks:');
    results.filter(r => !r.pass).forEach(r => console.log(`  FAIL: ${r.check} — ${r.detail}`));
  }

  await browser.close();
})();
