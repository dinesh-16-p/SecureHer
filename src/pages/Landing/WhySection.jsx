import React from 'react';
import { ShieldAlert, HeartHandshake, EyeOff, Cpu, BellRing, Lock } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';

const WhySection = () => {
  const pillars = [
    {
      icon: ShieldAlert,
      title: 'Unified Safety & Health',
      description: 'Women no longer need separate apps for emergency response and reproductive health. SecureHer integrates both seamlessly.',
      color: 'var(--color-primary)'
    },
    {
      icon: Cpu,
      title: 'Intelligent AI Assistance',
      description: 'Advanced risk evaluation and intelligent anomaly detection keep emergency contacts informed before situations escalate.',
      color: 'var(--color-secondary)'
    },
    {
      icon: EyeOff,
      title: 'Privacy First Architecture',
      description: 'Your health data and location history are strictly private. Zero third-party data tracking or selling.',
      color: 'var(--color-health)'
    },
    {
      icon: BellRing,
      title: 'Instant 1-Tap SOS Dispatch',
      description: 'Hold the emergency SOS button for 2-3 seconds to broadcast live coordinates and alert trusted emergency contacts.',
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
          title="Designed for Total Peace of Mind"
          subtitle="Combining advanced emergency protection with comprehensive wellness tracking, built exclusively for modern women."
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
