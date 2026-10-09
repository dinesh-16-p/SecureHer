import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Heart, Users, Sparkles, LogIn, UserPlus } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '#features' },
    { label: 'Safety Hub', path: '#safety' },
    { label: 'Trusted Journey', path: '#journey' },
    { label: 'Community', path: '#community' },
    { label: 'About', path: '#about' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      }}
      className="glass-nav"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(91, 33, 79, 0.25)'
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: 'var(--color-primary)'
              }}
            >
              Secure<span style={{ color: 'var(--color-secondary)' }}>Her</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '600',
                fontSize: '0.95rem',
                color: 'var(--color-text)',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-secondary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-text)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth CTAs (Desktop) */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem'
          }}
          className="desktop-auth"
        >
          <Link to="/login">
            <Button variant="ghost" size="sm" icon={LogIn}>
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" icon={UserPlus}>
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            padding: '0.5rem',
            cursor: 'pointer'
          }}
          className="mobile-toggle-btn"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: '4.5rem',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-accent)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--color-primary)',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(246, 221, 229, 0.4)',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link to="/login" style={{ width: '100%' }}>
              <Button variant="outline" fullWidth icon={LogIn}>
                Login
              </Button>
            </Link>
            <Link to="/signup" style={{ width: '100%' }}>
              <Button variant="primary" fullWidth icon={UserPlus}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS for desktop showing nav */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
