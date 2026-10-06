import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Smile, Pill, Stethoscope, Clock, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const HealthPage = () => {
  const modules = [
    { title: 'Period Tracker', path: '/health/period', icon: Calendar, color: 'var(--color-secondary)', desc: 'Log start/end dates, view current cycle day, and track 4 cycle phases.' },
    { title: 'Health Calendar', path: '/health/calendar', icon: Clock, color: 'var(--color-primary)', desc: 'Unified calendar showing periods, mood notes, medications, and doctor visits.' },
    { title: 'Mood & Symptom Journal', path: '/health/mood', icon: Smile, color: 'var(--color-health)', desc: 'Track 7-day emotional trends, stress markers, and symptoms privately.' },
    { title: 'Medication Reminders', path: '/health/medication', icon: Pill, color: 'var(--color-secondary)', desc: 'Manage daily prescription logs, contraceptive reminders, and vitamins.' },
    { title: 'Doctor Appointments', path: '/health/appointments', icon: Stethoscope, color: 'var(--color-primary)', desc: 'Schedule specialist consultations, gynecologist visits, and pre-visit notes.' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="health" icon={Heart}>
          Wellness Hub
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Women's Health & Cycle Tracking
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Personalized reproductive health monitoring, mood analysis, medication logs, and clinical appointment management.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.path} to={m.path} style={{ textDecoration: 'none' }}>
              <Card hoverEffect={true} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-health-light)',
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
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HealthPage;
