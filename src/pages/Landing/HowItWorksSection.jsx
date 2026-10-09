import React from 'react';
import { User, Shield, Navigation, Bell, CheckCircle } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';

const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      icon: User,
      title: 'User Setup & Circle',
      subtitle: 'Create account & set emergency contacts',
      desc: 'Sign up securely, add trusted emergency contacts with priority levels, and configure location access for emergency dispatches.'
    },
    {
      num: '02',
      icon: Navigation,
      title: 'Trusted Journey Tracking',
      subtitle: 'Plan safe routes & live check-ins',
      desc: 'Share live progress with trusted contacts, track arrival estimations, and dispatch safe arrival status with 1-tap.'
    },
    {
      num: '03',
      icon: Shield,
      title: 'Tamper-Evident Vault',
      subtitle: 'Cryptographic SHA-256 integrity',
      desc: 'Record photos and videos sealed with browser Web Crypto SHA-256 hashes and document safety incidents privately.'
    },
    {
      num: '04',
      icon: Bell,
      title: 'Instant SOS & Response',
      subtitle: 'Verified Brevo email dispatches',
      desc: 'Activate Emergency SOS with a 3-second hold to dispatch live GPS coordinates and access verified nearby police/hospitals.'
    }
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-accent)',
        borderBottom: '1px solid var(--color-accent)'
      }}
    >
      <div className="container">
        <SectionHeading
          badgeText="Simple & Reliable Workflow"
          badgeIcon={CheckCircle}
          badgeVariant="primary"
          title="How SecureHer Operates"
          subtitle="Four structured stages connecting the user to physical safety, travel tracking, and emergency alert dispatch."
        />

        {/* Workflow Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            position: 'relative'
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} hoverEffect={true} padding="lg" style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.25rem',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  {step.num}
                </div>

                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    marginBottom: '1.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Icon size={22} />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  {step.title}
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>
                  {step.subtitle}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  {step.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
