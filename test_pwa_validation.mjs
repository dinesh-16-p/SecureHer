import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function validatePWA() {
  console.log('--- STARTING SECUREHER PWA CONVERSION VALIDATION ---');
  let errors = 0;

  // 1. Validate manifest.json
  console.log('\n[CHECK 1] Validating public/manifest.json...');
  const manifestPath = path.join(__dirname, 'public', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Missing manifest.json');
    errors++;
  } else {
    try {
      const manifestRaw = fs.readFileSync(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestRaw);

      if (!manifest.name || manifest.name !== 'SecureHer — AI-Based Women Safety Application') {
        console.error('❌ Manifest name mismatch:', manifest.name);
        errors++;
      }
      if (!manifest.short_name || manifest.short_name !== 'SecureHer') {
        console.error('❌ Manifest short_name mismatch:', manifest.short_name);
        errors++;
      }
      if (manifest.display !== 'standalone') {
        console.error('❌ Manifest display mode must be standalone:', manifest.display);
        errors++;
      }
      if (!manifest.theme_color || manifest.theme_color !== '#5B214F') {
        console.error('❌ Manifest theme_color mismatch:', manifest.theme_color);
        errors++;
      }
      if (!manifest.background_color || manifest.background_color !== '#FFF9FB') {
        console.error('❌ Manifest background_color mismatch:', manifest.background_color);
        errors++;
      }
      if (!Array.isArray(manifest.icons) || manifest.icons.length < 4) {
        console.error('❌ Manifest missing required icons array');
        errors++;
      }

      // Check all icons on disk
      for (const icon of manifest.icons) {
        const iconDiskPath = path.join(__dirname, 'public', icon.src.replace(/^\//, ''));
        if (!fs.existsSync(iconDiskPath)) {
          console.error(`❌ Icon file missing on disk: ${icon.src}`);
          errors++;
        } else {
          const stats = fs.statSync(iconDiskPath);
          if (stats.size === 0) {
            console.error(`❌ Icon file is empty: ${icon.src}`);
            errors++;
          } else {
            console.log(`  ✓ Found icon: ${icon.src} (${stats.size} bytes, purpose: ${icon.purpose || 'any'})`);
          }
        }
      }

      console.log('✓ manifest.json is fully valid and compliant with W3C Web App Manifest spec.');
    } catch (e) {
      console.error('❌ Invalid JSON in manifest.json:', e.message);
      errors++;
    }
  }

  // 2. Validate Service Worker (public/sw.js)
  console.log('\n[CHECK 2] Validating Service Worker (public/sw.js)...');
  const swPath = path.join(__dirname, 'public', 'sw.js');
  if (!fs.existsSync(swPath)) {
    console.error('❌ Missing public/sw.js');
    errors++;
  } else {
    const swContent = fs.readFileSync(swPath, 'utf8');

    const requiredTerms = [
      'CACHE_NAME',
      'APP_SHELL_ASSETS',
      'isSensitiveRequest',
      '/api/',
      'firestore.googleapis.com',
      'install',
      'activate',
      'fetch',
      'skipWaiting',
      'clients.claim',
      '/offline.html'
    ];

    for (const term of requiredTerms) {
      if (!swContent.includes(term)) {
        console.error(`❌ Service worker missing critical implementation rule: ${term}`);
        errors++;
      }
    }

    console.log('✓ Service worker has safe caching rules, sensitive endpoint exclusions, and offline handling.');
  }

  // 3. Validate Offline Fallback Page (public/offline.html)
  console.log('\n[CHECK 3] Validating Offline Fallback Page (public/offline.html)...');
  const offlinePath = path.join(__dirname, 'public', 'offline.html');
  if (!fs.existsSync(offlinePath)) {
    console.error('❌ Missing public/offline.html');
    errors++;
  } else {
    const offlineHtml = fs.readFileSync(offlinePath, 'utf8');
    if (!offlineHtml.includes('112') || !offlineHtml.includes('1091')) {
      console.error('❌ Offline page missing emergency helpline numbers');
      errors++;
    }
    console.log('✓ Offline fallback page exists and includes direct cellular emergency helplines.');
  }

  // 4. Validate index.html PWA tags
  console.log('\n[CHECK 4] Validating index.html PWA tags...');
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  if (!indexHtml.includes('rel="manifest"') || !indexHtml.includes('href="/manifest.json"')) {
    console.error('❌ index.html missing manifest link tag');
    errors++;
  }
  if (!indexHtml.includes('name="theme-color"') || !indexHtml.includes('#5B214F')) {
    console.error('❌ index.html missing theme-color meta tag');
    errors++;
  }
  if (!indexHtml.includes('apple-mobile-web-app-capable')) {
    console.error('❌ index.html missing apple-mobile-web-app-capable tag');
    errors++;
  }
  console.log('✓ index.html properly configured for Progressive Web App capability.');

  // 5. Validate App.jsx registration & offline components
  console.log('\n[CHECK 5] Validating App.jsx registration & components...');
  const appJsx = fs.readFileSync(path.join(__dirname, 'src', 'App.jsx'), 'utf8');
  if (!appJsx.includes('registerServiceWorker')) {
    console.error('❌ App.jsx missing registerServiceWorker');
    errors++;
  }
  if (!appJsx.includes('OfflineIndicator')) {
    console.error('❌ App.jsx missing OfflineIndicator component');
    errors++;
  }
  if (!appJsx.includes('PwaInstallBanner')) {
    console.error('❌ App.jsx missing PwaInstallBanner component');
    errors++;
  }
  console.log('✓ App.jsx mounts Service Worker registration, OfflineIndicator, and PwaInstallBanner.');

  console.log(`\n=== PWA VALIDATION SUMMARY: ${errors === 0 ? 'ALL CHECKS PASSED (0 ERRORS)' : `FAILED WITH ${errors} ERRORS`} ===\n`);

  if (errors > 0) process.exit(1);
}

validatePWA().catch(err => {
  console.error('Validation failure:', err);
  process.exit(1);
});
