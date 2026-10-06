import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Users,
  MapPin,
  PhoneCall,
  Heart,
  Calendar,
  Smile,
  Pill,
  Stethoscope,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navSections = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Safety',
      items: [
        { label: 'Safety & SOS', path: '/safety', icon: Shield, exact: true },
        { label: 'Emergency Contacts', path: '/safety/contacts', icon: Users },
        { label: 'Live Location', path: '/safety/location', icon: MapPin },
        { label: 'Helplines', path: '/safety/helplines', icon: PhoneCall }
      ]
    },
    {
      title: 'Health',
      items: [
        { label: 'Health Tracker', path: '/health', icon: Heart, exact: true },
        { label: 'Period Tracker', path: '/health/period', icon: Calendar },
        { label: 'Health Calendar', path: '/health/calendar', icon: Calendar },
        { label: 'Mood Journal', path: '/health/mood', icon: Smile },
        { label: 'Medications', path: '/health/medication', icon: Pill },
        { label: 'Appointments', path: '/health/appointments', icon: Stethoscope }
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Community', path: '/community', icon: MessageSquare },
        { label: 'Notifications', path: '/notifications', icon: Bell }
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid rgba(246, 221, 229, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        overflowY: 'auto'
      }}
      className={`app-sidebar ${mobileOpen ? 'open' : ''}`}
    >
      <div>
        {/* Brand Header */}
        <div
          style={{
            padding: '1.5rem 1.25rem',
            borderBottom: '1px solid rgba(246, 221, 229, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Shield size={20} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Secure<span style={{ color: 'var(--color-secondary)' }}>Her</span>
          </span>
        </div>

        {/* Navigation Sections */}
        <div style={{ padding: '1rem 0.75rem' }}>
          {navSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-light)',
                  padding: '0 0.75rem',
                  marginBottom: '0.35rem'
                }}
              >
                {sec.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: active ? 700 : 600,
                        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        backgroundColor: active ? 'var(--color-accent)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        borderLeft: active ? '3px solid var(--color-secondary)' : '3px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={18} color={active ? 'var(--color-secondary)' : 'var(--color-text-muted)'} />
                        <span>{item.label}</span>
                      </div>
                      {active && <ChevronRight size={14} color="var(--color-secondary)" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Action */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(246, 221, 229, 0.6)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-emergency)',
            backgroundColor: 'rgba(217, 45, 58, 0.06)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
