import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, PhoneCall, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredNotice(false);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestoredNotice) {
    return null;
  }

  if (!isOnline && isDismissed) {
    return null;
  }

  // Connection Restored Pill
  if (isOnline && showRestoredNotice) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          backgroundColor: '#2E7D32',
          color: '#FFFFFF',
          padding: '0.5rem 1.25rem',
          borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <Wifi size={16} />
        <span>Connection Restored — Back Online</span>
      </div>
    );
  }

  // Offline Warning Banner
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#7A1C25',
        color: '#FFFFFF',
        padding: '0.65rem 1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.875rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <WifiOff size={18} color="#FFCDD2" />
        <div>
          <strong>Offline Mode:</strong> Internet disconnected. Cloud report sync & SOS email broadcasts cannot reach servers.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <a
          href="tel:112"
          style={{
            backgroundColor: '#D92D3A',
            color: '#FFFFFF',
            padding: '0.3rem 0.75rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <PhoneCall size={13} /> Call 112 (Cellular Works Offline)
        </a>

        <Link
          to="/safety/helplines"
          style={{
            color: '#FFCDD2',
            textDecoration: 'underline',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
        >
          Emergency Helplines
        </Link>

        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;
