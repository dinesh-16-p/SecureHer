import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Shield, AlertTriangle, Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Topbar = ({ setMobileOpen }) => {
  const { userProfile } = useAuth();
  const userName = userProfile?.fullName || 'User';

  return (
    <header
      style={{
        height: '4.5rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(246, 221, 229, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      {/* Left Mobile Menu Toggle & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMobileOpen && setMobileOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
          className="mobile-sidebar-toggle"
        >
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Status:
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#2E7D32', backgroundColor: 'rgba(46, 125, 50, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2E7D32' }} /> Protected
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Quick SOS Trigger */}
        <Link to="/safety/sos">
          <Button variant="emergency" size="sm" icon={AlertTriangle}>
            SOS Mode
          </Button>
        </Link>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          style={{
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: '50%',
            backgroundColor: 'var(--color-background)',
            border: '1px solid rgba(246, 221, 229, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            position: 'relative',
            textDecoration: 'none'
          }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary)'
            }}
          />
        </Link>

        {/* Profile Avatar */}
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="topbar-user-name" style={{ display: 'none', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2 }}>
              {userName}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>View Profile</span>
          </div>
        </Link>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .topbar-user-name { display: flex !important; }
          .mobile-sidebar-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
