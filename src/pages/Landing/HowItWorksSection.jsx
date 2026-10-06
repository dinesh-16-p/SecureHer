import React from 'react';
import { User, Shield, Heart, Users, Bell, ArrowRight, CheckCircle } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';

const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      icon: User,
      title: 'User Registration',
      subtitle: 'Create your private account & set emergency contacts',
      desc: 'Sign up securely, add trusted emergency contacts with priority levels, and grant location permissions for emergency response.'
    },
    {
      num: '02',
      icon: Shield,
      title: 'SecureHer Core Engine',
      subtitle: 'Active protection & health analytics',
      desc: 'The intelligent engine continuously monitors location sharing during emergencies and tracks health patterns privately.'
    },
    {
      num: '03',
      icon: Heart,
      title: 'Safety, Health & Community',
      subtitle: 'Comprehensive feature hub',
      desc: 'Access 1-tap SOS, cycle tracking, mood logs, medication reminders, doctor appointments, and peer support discussions.'
    },
    {
      num: '04',
      icon: Bell,
      title: 'Notifications & Instant Support',
      subtitle: 'Proactive alerts & response',
      desc: 'Receive period estimates, medication reminders, and immediate SOS broadcast alerts sent directly to your contacts.'
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
          badgeText="Simple & Scalable Workflow"
          badgeIcon={CheckCircle}
          badgeVariant="primary"
          title="How SecureHer Operates"
          subtitle="Four structured stages connecting the user to physical safety, wellness analytics, and community emergency dispatch."
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
