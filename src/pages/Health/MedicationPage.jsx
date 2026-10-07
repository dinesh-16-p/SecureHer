import React, { useState } from 'react';
import { Pill, Plus, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useHealth } from '../../context/HealthContext';

const MedicationPage = () => {
  const { medications, addMed, toggleMed, removeMed } = useHealth();

  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '1 Tablet',
    time: '08:00 AM'
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      await addMed(formData);
      setFormData({ name: '', dosage: '1 Tablet', time: '08:00 AM' });
      setShowAdd(false);
    } catch (err) {
      console.error('Failed to add medication:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="health" icon={Pill}>
            Prescription Logs
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Medication & Supplement Tracker
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Set custom dosage schedules, track daily intake, and view active prescription reminders.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Medication'}
        </Button>
      </div>

      {showAdd && (
        <Card padding="lg" style={{ marginBottom: '2rem', border: '2px solid var(--color-health)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            New Prescription / Supplement
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Medication Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Iron & Folic Acid"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Dosage
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Tablet, 500mg"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Reminder Time
              </label>
              <input
                type="text"
                placeholder="e.g. 08:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Medication'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {medications.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-health-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-health)'
            }}
          >
            <Pill size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Medications Scheduled
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Keep track of vitamins, contraceptives, or prescriptions by adding your first daily reminder.
          </p>
          <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>
            Add First Medication
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {medications.map((m) => (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant={m.status === 'Taken' ? 'primary' : 'secondary'}>
                    {m.status || 'Pending'}
                  </Badge>
                  <button
                    onClick={() => removeMed(m.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
                onClick={() => toggleMed(m.id, m.status)}
              >
                {m.status === 'Taken' ? 'Mark Pending' : 'Mark Taken'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationPage;
