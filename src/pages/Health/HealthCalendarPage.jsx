import React from 'react';
import { Calendar, Clock, Heart, Pill, Stethoscope, Smile } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const HealthCalendarPage = () => {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={Calendar}>
          Unified Schedule
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Health & Wellness Calendar
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Unified monthly schedule combining period estimates, mood snapshots, medication reminders, and doctor appointments.
        </p>
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            October 2026
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.825rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D92D3A' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D92D3A' }} /> Period
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-secondary)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} /> Ovulation
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-health)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-health)' }} /> Medication
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} /> Doctor Visit
            </span>
          </div>
        </div>

        {/* Calendar Grid Representation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            textAlign: 'center'
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-muted)', padding: '0.5rem 0' }}>
              {day}
            </div>
          ))}

          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
            const isPeriod = date >= 1 && date <= 5;
            const isOvulation = date >= 11 && date <= 14;
            const hasDoctor = date === 18;
            const hasMed = date % 2 === 0;

            return (
              <div
                key={date}
                style={{
                  minHeight: '65px',
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isPeriod ? '1px solid #D92D3A' : isOvulation ? '1px solid var(--color-secondary)' : '1px solid rgba(246, 221, 229, 0.6)'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textAlign: 'right' }}>
                  {date}
                </span>
                <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center' }}>
                  {isPeriod && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D92D3A' }} />}
                  {isOvulation && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />}
                  {hasDoctor && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                  {hasMed && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-health)' }} />}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default HealthCalendarPage;
