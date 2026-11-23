import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const EVIDENCE_DIR = path.resolve('test-evidence/phase-6');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://her-a955f.web.app';

async function main() {
  console.log('🚀 Launching real Google Chrome (v155.0.8059.39)...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('response', resp => {
    if (!resp.ok() && resp.status() >= 400) {
      networkErrors.push({ url: resp.url(), status: resp.status() });
    }
  });

  console.log(`\n--- TEST 1: Landing Page Navigation (${BASE_URL}) ---`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '01-landing-page.png'), fullPage: true });
  console.log('📸 Captured 01-landing-page.png');

  console.log(`\n--- TEST 2: Login Page Navigation (${BASE_URL}/login) ---`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '02-authentication-login.png'), fullPage: true });
  console.log('📸 Captured 02-authentication-login.png');

  console.log(`\n--- TEST 3: Signup Page Navigation (${BASE_URL}/signup) ---`);
  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '02-authentication-signup.png'), fullPage: true });
  console.log('📸 Captured 02-authentication-signup.png');

  console.log(`\n--- TEST 4: Form Validation Check (Blank submit on Login) ---`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  // Try to submit login without entering credentials
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '02-form-validation.png'), fullPage: true });
    console.log('📸 Captured 02-form-validation.png');
  }

  console.log(`\n--- TEST 5: Protected Route Guard (${BASE_URL}/dashboard unauthenticated) ---`);
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  console.log(`Resulting URL when accessing /dashboard without auth: ${currentUrl}`);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '03-protected-route-redirect.png'), fullPage: true });
  console.log('📸 Captured 03-protected-route-redirect.png');

  console.log(`\n--- TEST 6: Mobile Viewport Rendering (Landing Page) ---`);
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '09-mobile-viewport-landing.png'), fullPage: true });
  console.log('📸 Captured 09-mobile-viewport-landing.png');

  console.log(`\n--- TEST 7: Mobile Viewport Rendering (Login Page) ---`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '09-mobile-viewport-login.png'), fullPage: true });
  console.log('📸 Captured 09-mobile-viewport-login.png');

  console.log('\n--- BROWSER CONSOLE LOGS & NETWORK STATUS ---');
  console.log(`Console logs recorded: ${consoleLogs.length}`);
  console.log(`Network HTTP >=400 errors recorded: ${networkErrors.length}`);
  if (networkErrors.length > 0) {
    console.log('Network errors:', networkErrors);
  }

  await browser.close();
  console.log('\n✅ Public flow testing completed.');
}

main().catch(err => {
  console.error('Error during browser testing:', err);
  process.exit(1);
});
