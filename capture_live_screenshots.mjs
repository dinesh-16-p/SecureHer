import { chromium } from 'playwright';
import path from 'node:path';

const EVIDENCE_DIR = path.resolve('test-evidence/phase-6');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://her-a955f.web.app';

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // 1. Landing Hero (Viewport 1280x800)
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '01-landing-hero.png'), fullPage: false });
  console.log('Captured 01-landing-hero.png');

  // 2. Landing Safety / How It Works section
  await page.evaluate(() => window.scrollBy(0, 950));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '01-landing-features.png'), fullPage: false });
  console.log('Captured 01-landing-features.png');

  // 3. Login Page
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '02-login-viewport.png'), fullPage: false });
  console.log('Captured 02-login-viewport.png');

  // 4. Signup Page
  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '02-signup-viewport.png'), fullPage: false });
  console.log('Captured 02-signup-viewport.png');

  // 5. Mobile Landing Page (375x667)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '09-mobile-hero.png'), fullPage: false });
  console.log('Captured 09-mobile-hero.png');

  // 6. Mobile Login Page (375x667)
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '09-mobile-login.png'), fullPage: false });
  console.log('Captured 09-mobile-login.png');

  await browser.close();
  console.log('All fresh live screenshots captured successfully!');
}

capture().catch(console.error);

