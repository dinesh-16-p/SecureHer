import React, { useState } from 'react';
import { Calendar, Heart, Activity, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useHealth } from '../../context/HealthContext';

const PeriodTrackerPage = () => {
  const { periods, cycleSummary, logPeriod, removePeriod, loading } = useHealth();

  const [showLogModal, setShowLogModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    cycleLength: 28,
    periodLength: 5,
    flow: 'Medium',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate) return;

    setSubmitting(true);
    try {
      await logPeriod(formData);
      setShowLogModal(false);
      setFormData({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        cycleLength: 28,
        periodLength: 5,
        flow: 'Medium',
        notes: ''
      });
    } catch (err) {
      console.error('Failed to log period:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this period log?')) {
      await removePeriod(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="health" icon={Calendar}>
            Cycle Management
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Period & Cycle Tracker
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Log your menstrual dates to synchronize your dynamic cycle phase, health calendar, and dashboard.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowLogModal(!showLogModal)}>
          {showLogModal ? 'Cancel' : 'Log Period Date'}
        </Button>
      </div>

      {showLogModal && (
        <Card padding="lg" style={{ marginBottom: '2rem', border: '2px solid var(--color-secondary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Log Period Details
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Period Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Period End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Avg Cycle Length (Days)
              </label>
              <input
                type="number"
                min="20"
                max="45"
                value={formData.cycleLength}
                onChange={(e) => setFormData({ ...formData, cycleLength: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Flow Intensity
              </label>
              <select
                value={formData.flow}
                onChange={(e) => setFormData({ ...formData, flow: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', background: '#fff', outline: 'none' }}
              >
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="outline" onClick={() => setShowLogModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Period Entry'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Main Cycle Status Card */}
        <div style={{ gridColumn: 'span 12 / span 7' }}>
          <Card padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                  CURRENT CYCLE STATUS
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {cycleSummary.hasData ? cycleSummary.phase : 'No Period Logged Yet'}
                </h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {cycleSummary.hasData
                    ? `Cycle Day ${cycleSummary.currentDay} of ${cycleSummary.cycleLength}`
                    : 'Log your first period start date to calculate your cycle summary.'}
                </span>
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

            {cycleSummary.hasData ? (
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Estimated Next Period:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{cycleSummary.nextPeriodDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Estimated Ovulation Window:</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>
                    {cycleSummary.ovulationStart} – {cycleSummary.ovulationEnd}
                  </strong>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--color-background)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  Not enough cycle history yet. Click "Log Period Date" above to begin tracking.
                </p>
              </div>
            )}

            <Button variant="primary" icon={Plus} size="md" onClick={() => setShowLogModal(true)}>
              Log Period Date
            </Button>
          </Card>
        </div>

        {/* Phase Breakdown Card */}
        <div style={{ gridColumn: 'span 12 / span 5' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Cycle Phases
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Menstrual Phase', days: 'Days 1–5', active: cycleSummary.phase === 'Menstrual Phase', color: '#D92D3A' },
                { name: 'Follicular Phase', days: 'Days 6–13', active: cycleSummary.phase === 'Follicular Phase', color: '#C75B7A' },
                { name: 'Ovulation Phase', days: 'Days 14–16', active: cycleSummary.phase === 'Ovulation Phase', color: '#9B6B8F' },
                { name: 'Luteal Phase', days: 'Days 17–28', active: cycleSummary.phase === 'Luteal Phase', color: '#5B214F' }
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
                  <span style={{ fontSize: '0.9rem', fontWeight: p.active ? 800 : 600, color: 'var(--color-primary)' }}>
                    {p.name} {p.active && '✓ (Active)'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.days}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* History Table */}
      {periods.length > 0 && (
        <Card padding="lg">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Logged Period History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {periods.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid rgba(246, 221, 229, 0.6)'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                    Started: {p.startDate}
                  </strong>
                  {p.endDate && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>Ended: {p.endDate}</span>}
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Cycle: {p.cycleLength} days • Flow: {p.flow}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PeriodTrackerPage;
