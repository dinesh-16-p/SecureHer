import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Users,
  MapPin,
  PhoneCall,
  ChevronRight,
  Camera,
  Lock,
  Navigation,
  Building,
  FileText,
  PhoneForwarded
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const SafetyPage = () => {
  const modules = [
    {
      title: 'Emergency SOS Broadcast',
      path: '/safety/sos',
      icon: AlertTriangle,
      color: 'var(--color-emergency)',
      desc: '1-tap instant trigger with alarm and live GPS dispatch via verified Brevo transactional emails.'
    },
    {
      title: 'Trusted Journey Tracking',
      path: '/safety/journey',
      icon: Navigation,
      color: 'var(--color-primary)',
      desc: 'Plan travel, track live progress with arrival estimates, and dispatch check-ins to trusted contacts.'
    },
    {
      title: 'Nearby Emergency Services',
      path: '/safety/nearby',
      icon: Building,
      color: 'var(--color-secondary)',
      desc: 'Discover verified police stations, hospitals, and fire departments with 1-tap call & directions.'
    },
    {
      title: 'Tamper-Evident Evidence Vault',
      path: '/safety/evidence-history',
      icon: Lock,
      color: 'var(--color-primary)',
      desc: 'Photo/video recordings with Web Crypto SHA-256 integrity verification and cryptographic manifests.'
    },
    {
      title: 'Incident Evidence Camera',
      path: '/safety/evidence',
      icon: Camera,
      color: 'var(--color-emergency)',
      desc: 'User-controlled discreet camera with cryptographic timestamping and GPS watermarking.'
    },
    {
      title: 'Safety Incident Reporting',
      path: '/safety/incidents',
      icon: FileText,
      color: 'var(--color-secondary)',
      desc: 'Structured personal recordkeeping for harassment, stalking, or travel incidents with exportable JSON.'
    },
    {
      title: 'Fake Call & Escape Mode',
      path: '/safety/fake-call',
      icon: PhoneForwarded,
      color: 'var(--color-health)',
      desc: 'Simulated incoming call with ringtone audio and quick shortcuts to discreetly exit awkward situations.'
    },
    {
      title: 'Emergency Contacts Circle',
      path: '/safety/contacts',
      icon: Users,
      color: 'var(--color-secondary)',
      desc: 'Configure priority emergency contacts who receive automatic live GPS email alerts during an SOS.'
    },
    {
      title: 'Live Location & Map Styles',
      path: '/safety/location',
      icon: MapPin,
      color: 'var(--color-primary)',
      desc: 'Real-time GPS coordinate acquisition, accuracy gauge, and 6 MapTiler map layer styles.'
    },
    {
      title: 'Emergency Helplines',
      path: '/safety/helplines',
      icon: PhoneCall,
      color: 'var(--color-health)',
      desc: 'Direct phone dialing for National Emergency (112), Women Helpline (1091), and Police.'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="emergency" icon={Shield}>
          Security Core
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Safety & Security Hub
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Comprehensive AI-powered women's security modules: emergency dispatches, journey tracking, evidence vault, and discreet escape tools.
        </p>
      </div>

      {/* Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.path} to={m.path} style={{ textDecoration: 'none' }}>
              <Card hoverEffect={true} padding="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: m.color
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <ChevronRight size={20} color="var(--color-text-light)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                    {m.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyPage;
