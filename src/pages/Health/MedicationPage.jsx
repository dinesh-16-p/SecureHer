import React, { useState } from 'react';
import { Pill, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const MedicationPage = () => {
  const [meds, setMeds] = useState([
    { id: '1', name: 'Multivitamin Complex', dosage: '1 Tablet', time: '08:00 AM', status: 'Taken' },
    { id: '2', name: 'Iron & Folic Acid', dosage: '1 Capsule', time: '02:00 PM', status: 'Pending' }
  ]);

  const toggleStatus = (id) => {
    setMeds(meds.map((m) => (m.id === id ? { ...m, status: m.status === 'Taken' ? 'Pending' : 'Taken' } : m)));
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="health" icon={Pill}>
          Prescription Logs
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Medication & Supplement Reminders
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Set custom dosage alerts, track daily intake, and view prescription schedules.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {meds.map((m) => (
          <Card key={m.id} hoverEffect={true} padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-health-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-health)'
                }}
              >
                <Pill size={22} />
              </div>
              <Badge variant={m.status === 'Taken' ? 'primary' : 'secondary'}>
                {m.status}
              </Badge>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              {m.name}
            </h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Dosage: {m.dosage} • Time: {m.time}
            </div>

            <Button
              variant={m.status === 'Taken' ? 'outline' : 'secondary'}
              fullWidth
              size="sm"
              icon={m.status === 'Taken' ? CheckCircle2 : Clock}
              onClick={() => toggleStatus(m.id)}
            >
              {m.status === 'Taken' ? 'Mark Pending' : 'Mark Taken'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicationPage;
