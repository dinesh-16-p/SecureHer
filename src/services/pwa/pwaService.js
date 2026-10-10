/**
 * SecureHer PWA Service
 * Manages service worker lifecycle, offline detection, and install prompt integration.
 */

const DISMISS_DURATION_DAYS = 14;

/**
 * Registers the Service Worker safely in supported browsers
 */
export function registerServiceWorker(onUpdateAvailable) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                if (typeof onUpdateAvailable === 'function') {
                  onUpdateAvailable(registration);
                }
              }
            }
          });
        });
      })
      .catch((err) => {
        console.warn('ServiceWorker registration note:', err);
      });
  });
}

/**
 * Checks if the application is currently running as an installed PWA
 */
export function isRunningStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Checks if the user has recently dismissed the install prompt
 */
export function isInstallPromptDismissed() {
  if (typeof window === 'undefined') return true;
  try {
    const dismissedUntil = localStorage.getItem('secureher_pwa_dismissed_until');
    if (!dismissedUntil) return false;
    return Date.now() < parseInt(dismissedUntil, 10);
  } catch {
    return false;
  }
}

/**
 * Records a dismissal of the install prompt for DISMISS_DURATION_DAYS
 */
export function dismissInstallPrompt() {
  try {
    const until = Date.now() + DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem('secureher_pwa_dismissed_until', String(until));
  } catch {
    // Ignore localStorage errors
  }
}
