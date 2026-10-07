import React, { useState } from 'react';
import { Smile, Frown, Meh, Heart, Plus, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useHealth } from '../../context/HealthContext';

const MoodPage = () => {
  const { moods, logMood } = useHealth();

  const [selectedMood, setSelectedMood] = useState('Happy');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const moodOptions = [
    { label: 'Happy', emoji: '😊', color: '#2E7D32' },
    { label: 'Calm', emoji: '😌', color: '#0288D1' },
    { label: 'Neutral', emoji: '😐', color: '#ED6C02' },
    { label: 'Stressed', emoji: '😰', color: '#C75B7A' },
    { label: 'Tired', emoji: '😴', color: '#9B6B8F' },
    { label: 'Sad', emoji: '😔', color: '#5B214F' }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logMood({
        mood: selectedMood,
        emoji: selectedEmoji,
        note: note.trim(),
        date: new Date().toISOString().split('T')[0]
      });
      setNote('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to log mood:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="accent" icon={Smile}>
          Emotional Well-Being
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Mood & Symptom Journal
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Record your daily emotional states and notes securely in your authenticated health vault.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Logger */}
        <div style={{ gridColumn: 'span 12 / span 7' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              How are you feeling today?
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {moodOptions.map((m) => (
                  <div
                    key={m.label}
                    onClick={() => {
                      setSelectedMood(m.label);
                      setSelectedEmoji(m.emoji);
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: selectedMood === m.label ? 'var(--color-accent)' : 'var(--color-background)',
                      border: selectedMood === m.label ? `2px solid ${m.color}` : '1px solid rgba(246, 221, 229, 0.6)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{m.emoji}</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>{m.label}</span>
                  </div>
                ))}
              </div>

              <textarea
                placeholder="Optional notes, symptoms, or thoughts (e.g. Mild headache, energetic, good workout)..."
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(246, 221, 229, 0.9)',
                  outline: 'none',
                  marginBottom: '1rem',
                  fontFamily: 'inherit'
                }}
              />

              <Button type="submit" variant="primary" fullWidth size="md" icon={Plus} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Today\'s Mood Entry'}
              </Button>
            </form>

            {savedSuccess && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2E7D32', fontSize: '0.875rem', fontWeight: 700 }}>
                <CheckCircle2 size={16} /> Mood entry recorded successfully!
              </div>
            )}
          </Card>
        </div>

        {/* History / Trends */}
        <div style={{ gridColumn: 'span 12 / span 5' }}>
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Recent Journal Entries
            </h3>

            {moods.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No mood entries recorded yet. Select an emotion on the left to save your first snapshot.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                {moods.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-background)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid rgba(246, 221, 229, 0.6)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        {m.emoji} {m.mood}
                      </div>
                      {m.note && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>"{m.note}"</div>}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{m.date}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
