import React from 'react';
import { ShieldAlert, Navigation, EyeOff, Lock, BellRing, Building } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';

const WhySection = () => {
  const pillars = [
    {
      icon: ShieldAlert,
      title: 'Dedicated Security Focus',
      description: 'Engineered solely for women’s safety with zero clutter: fast emergency dispatch, trusted travel tracking, and private recordkeeping.',
      color: 'var(--color-primary)'
    },
    {
      icon: Navigation,
      title: 'Trusted Journey Tracking',
      description: 'Continuous travel updates, arrival estimations, and automated check-ins keep your trusted circle informed during transit.',
      color: 'var(--color-secondary)'
    },
    {
      icon: Lock,
      title: 'Tamper-Evident Evidence',
      description: 'Web Crypto SHA-256 integrity verification guarantees that incident recordings cannot be modified undetected.',
      color: 'var(--color-health)'
    },
    {
      icon: BellRing,
      title: 'Instant 1-Tap SOS Dispatch',
      description: 'Hold the emergency SOS button for 3 seconds to broadcast live GPS coordinates via verified Brevo email dispatchers.',
      color: 'var(--color-emergency)'
    }
  ];

  return (
    <section
      id="why-secureher"
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-accent)',
        borderBottom: '1px solid var(--color-accent)'
      }}
    >
      <div className="container">
        <SectionHeading
          badgeText="Why SecureHer?"
          badgeIcon={Lock}
          badgeVariant="primary"
          title="Engineered for Real-World Security"
          subtitle="Combining rapid emergency dispatch, verified geographic safety data, and cryptographic evidence preservation."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}
        >
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} hoverEffect={true} padding="lg">
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--color-primary)'
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
