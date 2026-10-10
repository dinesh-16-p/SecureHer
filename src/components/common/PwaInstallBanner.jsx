import React, { useState, useEffect } from 'react';
import { Download, X, Shield, Smartphone } from 'lucide-react';
import Button from './Button';
import { isRunningStandalone, isInstallPromptDismissed, dismissInstallPrompt } from '../../services/pwa/pwaService';

const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If already installed or recently dismissed, skip
    if (isRunningStandalone() || isInstallPromptDismissed()) {
      return;
    }

    const handleBeforeInstall = (e) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If app gets installed, hide banner
    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      } else {
        // User dismissed system prompt
        dismissInstallPrompt();
        setIsVisible(false);
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
      setIsVisible(false);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9998,
        maxWidth: '420px',
        width: 'calc(100% - 40px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(199, 91, 122, 0.3)',
        boxShadow: '0 12px 36px rgba(91, 33, 79, 0.16)',
        padding: '1.25rem',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/icon-192.png"
            alt="SecureHer App Icon"
            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              Install SecureHer
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Progressive Web App
            </span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '0.2rem'
          }}
          title="Dismiss install recommendation"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: '0.825rem', color: 'var(--color-text)', lineHeight: '1.45', margin: '0 0 1rem 0' }}>
        Add SecureHer to your home screen for instant 1-tap SOS activation, full-screen view, and offline emergency helpline access.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          Not Now
        </Button>
        <Button variant="primary" size="sm" icon={Smartphone} onClick={handleInstallClick}>
          Install App
        </Button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
