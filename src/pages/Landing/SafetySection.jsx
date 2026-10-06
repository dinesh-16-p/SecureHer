import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, MapPin, Users, AlertTriangle, Cpu, Radio, ChevronRight } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const SafetySection = () => {
  const safetyFeatures = [
    {
      icon: AlertTriangle,
      badge: 'High Priority',
      badgeVariant: 'emergency',
      title: 'Emergency SOS Broadcast',
      description: 'One-press 3-second hold triggers continuous live GPS tracking, alerts your primary emergency contacts, and logs evidence snapshot.',
      features: ['2-3s hold prevention', 'Live location link via SMS', 'Automatic emergency log']
    },
    {
      icon: Users,
      badge: 'Contacts',
      badgeVariant: 'secondary',
      title: 'Trusted Emergency Circle',
      description: 'Manage up to 5 prioritized emergency contacts who get instant push notifications and SMS alerts whenever you activate SOS.',
      features: ['Priority ordering (1st, 2nd, 3rd)', 'Instant SMS & push notifications', 'One-tap direct phone call']
    },
    {
      icon: MapPin,
      badge: 'Real-Time GPS',
      badgeVariant: 'primary',
      title: 'Live Location & Geofencing',
      description: 'Share your trip live with family or set safe route boundaries. Receive proactive alerts if you stray off course.',
      features: ['Precision GPS updates', 'Shareable web link', 'Safe arrival confirmation']
    },
    {
      icon: PhoneCall,
      badge: 'Helplines',
      badgeVariant: 'accent',
      title: 'Verified Emergency Helplines',
      description: 'Instant one-tap direct calling to National Emergency (112), Women Helpline (1091), Police, Ambulance, and Legal Aid.',
      features: ['Pre-configured regional numbers', 'No dialing needed', '24/7 availability']
    },
    {
      icon: Cpu,
      badge: 'AI Detection',
      badgeVariant: 'health',
      title: 'AI Danger & Anomaly Guard',
      description: 'Built-in intelligent safety module prepared for real-time risk assessment, anomaly detection, and automated evidence capturing.',
      features: ['Acoustic danger detection architecture', 'Automated photo capture ready', 'Smart risk score']
    },
    {
      icon: Radio,
      badge: 'Evidence',
      badgeVariant: 'secondary',
      title: 'Cloud Evidence Vault',
      description: 'Securely records photo and audio snippets during emergency mode and uploads them directly to encrypted cloud storage.',
      features: ['Secure audio/photo capture', 'Encrypted Firebase storage', 'Tamper-proof log']
    }
  ];

  return (
    <section
      id="safety"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-background)',
        position: 'relative'
      }}
    >
      <div className="container">
        <SectionHeading
          badgeText="Safety First"
          badgeIcon={Shield}
          badgeVariant="emergency"
          title="Instant Emergency SOS & AI Safety Shield"
          subtitle="Empowering women with immediate response tools, real-time tracking, and automated emergency alert systems."
        />

        {/* SOS Interactive Demonstration Banner */}
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            marginBottom: '4rem',
            background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(253, 242, 242, 0.7) 100%)',
            border: '2px solid rgba(217, 45, 58, 0.2)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            <div style={{ gridColumn: 'span 12 / span 7' }} className="sos-banner-left">
              <Badge variant="emergency" icon={AlertTriangle}>
                Core Emergency Feature
              </Badge>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.75rem 0' }}>
                Press & Hold Emergency SOS Button
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Designed to prevent accidental triggers while guaranteeing rapid activation when seconds count. In emergency mode, your exact GPS coordinates are dispatched instantly to your contacts.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/signup">
                  <Button variant="emergency" size="md" icon={Shield}>
                    Setup Emergency Contacts
                  </Button>
                </Link>
              </div>
            </div>

            {/* Simulated SOS Button Preview */}
            <div
              style={{ gridColumn: 'span 12 / span 5', textAlign: 'center' }}
              className="sos-banner-right"
            >
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-emergency)',
                  color: '#FFFFFF',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sos)',
                  cursor: 'pointer',
                  border: '6px solid rgba(255, 255, 255, 0.8)',
                  transition: 'transform 0.2s ease'
                }}
                className="animate-sos-pulse"
              >
                <Shield size={38} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.25rem', letterSpacing: '0.05em' }}>
                  HOLD 3s SOS
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.85rem' }}>
                Press & hold for 2–3 seconds to broadcast emergency status
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {safetyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hoverEffect={true} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-background)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <Badge variant={feat.badgeVariant}>{feat.badge}</Badge>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {feat.description}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid rgba(246, 221, 229, 0.6)', paddingTop: '1rem' }}>
                  {feat.features.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .sos-banner-left { grid-column: span 7 / span 7 !important; }
          .sos-banner-right { grid-column: span 5 / span 5 !important; }
        }
      `}</style>
    </section>
  );
};

export default SafetySection;
