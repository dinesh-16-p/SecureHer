import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  PhoneCall,
  MapPin,
  Users,
  AlertTriangle,
  Lock,
  Navigation,
  Building,
  FileText,
  PhoneForwarded,
  ChevronRight
} from 'lucide-react';
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
      description: 'One-press 3-second hold triggers continuous live GPS tracking, sounds emergency alarm, and dispatches verified email alerts to your trusted contacts via Brevo.',
      features: ['3-second hold prevention', 'Live Google Maps link', 'Verified Brevo transactional emails']
    },
    {
      icon: Navigation,
      badge: 'Travel Safety',
      badgeVariant: 'primary',
      title: 'Trusted Journey Tracking',
      description: 'Plan safe routes, set estimated arrival times, and send real-time check-in updates to your trusted circle with continuous GPS position monitoring.',
      features: ['Estimated arrival monitoring', 'Authenticated contact email updates', 'Clean start-to-finish lifecycle']
    },
    {
      icon: Building,
      badge: 'Geographic Search',
      badgeVariant: 'secondary',
      title: 'Nearby Emergency Services',
      description: 'Discover verified police stations, emergency hospitals, and fire departments around your location using real OpenStreetMap geographic data.',
      features: ['Haversine distance calculation', '1-tap direct phone dialing', 'Google Maps turn-by-turn directions']
    },
    {
      icon: Lock,
      badge: 'Tamper-Evident',
      badgeVariant: 'primary',
      title: 'Tamper-Evident Evidence Vault',
      description: 'Record incident photos and videos stored locally with cryptographic SHA-256 integrity hashes computed using the browser Web Crypto API.',
      features: ['Web Crypto SHA-256 digest', 'Re-verify file integrity anytime', 'Cryptographic JSON manifest export']
    },
    {
      icon: FileText,
      badge: 'Documentation',
      badgeVariant: 'secondary',
      title: 'Safety Incident Reporting',
      description: 'Maintain private, structured documentation of harassment, stalking, or travel incidents with timestamps, notes, and evidence attachments.',
      features: ['Categorized structured fields', 'Optional 1-tap GPS capture', 'Exportable JSON incident summaries']
    },
    {
      icon: PhoneForwarded,
      badge: 'Discreet Exit',
      badgeVariant: 'health',
      title: 'Fake Call & Escape Mode',
      description: 'Simulate realistic incoming phone calls with synthesized ringtones and timer delays to discreetly exit awkward or uncomfortable situations.',
      features: ['Custom caller names & presets', 'Configurable delay countdown', 'Quick escape shortcuts']
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
          badgeText="Safety Core"
          badgeIcon={Shield}
          badgeVariant="emergency"
          title="Intelligent Women’s Security Platform"
          subtitle="Comprehensive protection architecture: instant emergency response, trusted journey tracking, cryptographic evidence, and discreet escape tools."
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
                <Link to="/signup" style={{ textDecoration: 'none' }}>
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
