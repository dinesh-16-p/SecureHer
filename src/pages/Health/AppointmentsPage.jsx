import React, { useState } from 'react';
import { Stethoscope, Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useHealth } from '../../context/HealthContext';

const AppointmentsPage = () => {
  const { appointments, addAppt, removeAppt } = useHealth();

  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    specialty: 'Gynecologist',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: '',
    notes: ''
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.doctor.trim()) return;

    setSubmitting(true);
    try {
      await addAppt(formData);
      setFormData({
        doctor: '',
        specialty: 'Gynecologist',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        location: '',
        notes: ''
      });
      setShowAdd(false);
    } catch (err) {
      console.error('Failed to add appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

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
            Schedule and manage consultations with gynecologists, physicians, and wellness specialists.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Schedule Appointment'}
        </Button>
      </div>

      {showAdd && (
        <Card padding="lg" style={{ marginBottom: '2rem', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Schedule Clinical Consultation
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Doctor / Clinic Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Jenkins"
                required
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Gynecologist"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Time
              </label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Clinic Location / Address
              </label>
              <input
                type="text"
                placeholder="e.g. City Women Care Hospital, 3rd Floor"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Notes / Checklist for Visit
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Discuss recent cycle changes and lab results."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Save Appointment'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {appointments.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(91, 33, 79, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-primary)'
            }}
          >
            <Stethoscope size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Upcoming Appointments
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Schedule your upcoming doctor visits, wellness consultations, or routine checkups.
          </p>
          <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>
            Schedule First Appointment
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {appointments.map((a) => (
            <Card key={a.id} hoverEffect={true} padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Badge variant="secondary">Upcoming</Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} /> {a.time}
                  </span>
                  <button
                    onClick={() => removeAppt(a.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
                {a.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--color-secondary)" /> {a.location}
                  </div>
                )}
              </div>

              {a.notes && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Notes: "{a.notes}"
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
