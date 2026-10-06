import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Mail, Phone, MapPin, ExternalLink, Lock } from 'lucide-react';
import { BRAND } from '../../constants/theme';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Top Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-health), var(--color-primary))'
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Shield size={22} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF' }}>
                Secure<span style={{ color: 'var(--color-accent)' }}>Her</span>
              </span>
            </div>
            <p style={{ color: 'var(--color-accent)', opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {BRAND.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-accent)' }}>
              <Lock size={14} /> Encrypted & Private Data Protection
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Home', 'Features', 'Why SecureHer', 'How It Works'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', transition: 'color 0.2s', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--color-secondary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.8)')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & Health */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Safety & Health
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Emergency SOS', 'Live GPS Sharing', 'Cycle & Period Tracker', 'Mood Journaling', 'Medication Reminders', 'Verified Helplines'].map((item) => (
                <li key={item}>
                  <a
                    href="#safety"
                    style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', transition: 'color 0.2s', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--color-secondary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.8)')}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Emergency Helplines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="var(--color-secondary)" /> National Emergency: <strong>112</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="var(--color-secondary)" /> Women Helpline: <strong>1091</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="var(--color-secondary)" /> support@secureher.org
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          <p>© {new Date().getFullYear()} SecureHer — Final Year Academic Project. Built with safety & care.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
