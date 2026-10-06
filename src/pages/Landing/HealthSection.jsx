import React from 'react';
import { Heart, Calendar, Smile, Pill, Stethoscope, Clock, Activity, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const HealthSection = () => {
  const healthFeatures = [
    {
      icon: Calendar,
      badge: 'Menstrual Health',
      badgeVariant: 'health',
      title: 'Cycle & Period Tracker',
      description: 'Track cycle length, start and end dates, and view transparent estimates for your upcoming cycle phases.',
      highlights: ['Current cycle day indicator', 'Estimated next period window', 'Historic cycle trend logs']
    },
    {
      icon: Activity,
      badge: 'Phases',
      badgeVariant: 'secondary',
      title: '4-Phase Cycle Insights',
      description: 'Understand the distinct biological shifts across Menstrual, Follicular, Ovulatory, and Luteal phases.',
      highlights: ['Phase-specific wellness tips', 'Energy level awareness', 'Ovulation window estimates']
    },
    {
      icon: Smile,
      badge: 'Emotional Well-Being',
      badgeVariant: 'accent',
      title: '7-Day Mood & Symptom Journal',
      description: 'Log daily emotions (Happy, Calm, Neutral, Stressed, Tired) alongside optional notes to detect patterns over time.',
      highlights: ['7-day mood trend summary', 'Symptom logging', 'Private & encrypted journal']
    },
    {
      icon: Pill,
      badge: 'Reminders',
      badgeVariant: 'primary',
      title: 'Medication & Supplement Logs',
      description: 'Never miss a daily prescription, vitamin, or contraceptive with timely custom notifications and one-tap log entries.',
      highlights: ['Custom time & dosage alerts', 'Taken / Skipped status', 'Daily reminder queue']
    },
    {
      icon: Stethoscope,
      badge: 'Appointments',
      badgeVariant: 'health',
      title: 'Doctor & Specialist Scheduler',
      description: 'Keep track of upcoming gynecologist, general physician, or wellness appointments with doctor notes and calendar sync.',
      highlights: ['Specialist details & venue', 'Pre-visit reminder alerts', 'Historical consultation notes']
    },
    {
      icon: Clock,
      badge: 'Unified View',
      badgeVariant: 'secondary',
      title: 'Holistic Health Calendar',
      description: 'A single unified monthly calendar combining period start dates, mood snapshots, medication status, and appointments.',
      highlights: ['Color-coded event markers', 'Monthly overview grid', 'Filtered daily breakdown']
    }
  ];

  return (
    <section
      id="health"
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-accent)',
        borderBottom: '1px solid var(--color-accent)'
      }}
    >
      <div className="container">
        <SectionHeading
          badgeText="Women's Health"
          badgeIcon={Heart}
          badgeVariant="health"
          title="Comprehensive Health & Cycle Tracking"
          subtitle="Intelligent tools tailored to support physical wellness, emotional balance, and reproductive healthcare."
        />

        {/* Phase Indicator Visual Strip */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            marginBottom: '3.5rem',
            backgroundColor: 'var(--color-health-light)',
            border: '1px solid rgba(155, 107, 143, 0.3)'
          }}
        >
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem', textAlign: 'center' }}>
            Interactive 4-Phase Cycle Monitoring
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}
          >
            {[
              { phase: 'Menstrual Phase', days: 'Days 1–5', color: '#D92D3A', desc: 'Rest & hydration focus' },
              { phase: 'Follicular Phase', days: 'Days 6–13', color: '#C75B7A', desc: 'Rising energy & strength' },
              { phase: 'Ovulation Phase', days: 'Days 14–16', color: '#9B6B8F', desc: 'Peak fertility window' },
              { phase: 'Luteal Phase', days: 'Days 17–28', color: '#5B214F', desc: 'Nurture & calm mood' },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.25rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${p.color}`,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: p.color, textTransform: 'uppercase' }}>
                  {p.days}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0.25rem 0' }}>
                  {p.phase}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {healthFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hoverEffect={true} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-health-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-health)'
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
                  {feat.highlights.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <CheckCircle2 size={15} color="var(--color-health)" /> {item}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthSection;
