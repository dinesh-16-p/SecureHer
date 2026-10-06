import React from 'react';
import { Stethoscope, Calendar, Clock, MapPin, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const AppointmentsPage = () => {
  const appointments = [
    {
      id: '1',
      doctor: 'Dr. Sarah Jenkins',
      specialty: 'Gynecologist & Wellness Specialist',
      date: 'October 18, 2026',
      time: '10:30 AM',
      location: 'City Women Healthcare Clinic',
      notes: 'Routine annual checkup & cycle review.'
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="primary" icon={Stethoscope}>
            Clinical Care
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Doctor Appointments
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Schedule and track consultations with gynecologists, physicians, and wellness specialists.
          </p>
        </div>
        <Button variant="primary" icon={Plus}>
          Schedule Appointment
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {appointments.map((a) => (
          <Card key={a.id} hoverEffect={true} padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <Badge variant="secondary">Upcoming</Badge>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> {a.time}
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {a.doctor}
            </h3>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '1rem' }}>
              {a.specialty}
            </div>

            <div style={{ backgroundColor: 'var(--color-background)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--color-primary)" /> {a.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-secondary)" /> {a.location}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Notes: "{a.notes}"
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPage;
