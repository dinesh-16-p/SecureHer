import React, { useState } from 'react';
import { Calendar, Heart, Activity, Plus, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const PeriodTrackerPage = () => {
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriodStart, setLastPeriodStart] = useState('2026-09-28');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="health" icon={Calendar}>
          Cycle Management
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Period & Cycle Tracker
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Monitor your menstrual phases, log period start/end dates, and view estimated upcoming windows.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Main Status Card */}
        <div style={{ gridColumn: 'span 12 / span 7' }} className="period-main-col">
          <Card padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>CURRENT STATUS</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>Follicular Phase</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Cycle Day 9 of 28</span>
              </div>
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-health-light)',
                  color: 'var(--color-health)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Activity size={32} />
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-background)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Estimated Next Period:</span>
                <strong style={{ color: 'var(--color-primary)' }}>October 26, 2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Ovulation Window:</span>
                <strong style={{ color: 'var(--color-secondary)' }}>Oct 11 – Oct 14</strong>
              </div>
            </div>

            <Button variant="primary" icon={Plus} size="md">
              Log Period Start Date
            </Button>
          </Card>
        </div>

        {/* Phase Breakdown Card */}
        <div style={{ gridColumn: 'span 12 / span 5' }} className="period-phase-col">
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Cycle Phases
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Menstrual Phase', days: 'Days 1–5', active: false, color: '#D92D3A' },
                { name: 'Follicular Phase', days: 'Days 6–13 (Current)', active: true, color: '#C75B7A' },
                { name: 'Ovulation Phase', days: 'Days 14–16', active: false, color: '#9B6B8F' },
                { name: 'Luteal Phase', days: 'Days 17–28', active: false, color: '#5B214F' }
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: p.active ? 'var(--color-accent)' : 'var(--color-background)',
                    borderLeft: `4px solid ${p.color}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: p.active ? 700 : 600, color: 'var(--color-primary)' }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.days}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PeriodTrackerPage;
