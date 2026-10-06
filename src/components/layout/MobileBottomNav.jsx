import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, Heart, Users, User, AlertTriangle } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Safety', path: '/safety', icon: Shield },
    { label: 'SOS', path: '/safety/sos', icon: AlertTriangle, isSos: true },
    { label: 'Health', path: '/health', icon: Heart },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4rem',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(246, 221, 229, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        boxShadow: '0 -4px 16px rgba(91, 33, 79, 0.08)'
      }}
      className="mobile-bottom-nav"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

        if (item.isSos) {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-emergency)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-1.25rem',
                boxShadow: 'var(--shadow-sos)',
                textDecoration: 'none'
              }}
            >
              <AlertTriangle size={20} />
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontSize: '0.7rem',
              fontWeight: active ? 700 : 500,
              textDecoration: 'none',
              gap: '0.2rem'
            }}
          >
            <Icon size={20} color={active ? 'var(--color-secondary)' : 'var(--color-text-muted)'} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <style>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default MobileBottomNav;
