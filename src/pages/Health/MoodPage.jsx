import React, { useState } from 'react';
import { Smile, Frown, Meh, Heart, Plus, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const MoodPage = () => {
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [note, setNote] = useState('');

  const moods = [
    { label: 'Happy', emoji: '😊', color: '#2E7D32' },
    { label: 'Calm', emoji: '😌', color: '#0288D1' },
    { label: 'Neutral', emoji: '😐', color: '#ED6C02' },
    { label: 'Stressed', emoji: '😰', color: '#C75B7A' },
    { label: 'Tired', emoji: '😴', color: '#9B6B8F' },
    { label: 'Sad', emoji: '😔', color: '#5B214F' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="accent" icon={Smile}>
          Emotional Well-Being
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          7-Day Mood & Symptom Journal
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Track daily emotional balance, symptom patterns, and stress factors in a private journal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div style={{ gridColumn: 'span 12 / span 7' }} className="mood-log-col">
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              How are you feeling today?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {moods.map((m) => (
                <div
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: selectedMood === m.label ? 'var(--color-accent)' : 'var(--color-background)',
                    border: selectedMood === m.label ? `2px solid ${m.color}` : '1px solid rgba(246, 221, 229, 0.6)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{m.emoji}</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>{m.label}</span>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Optional notes or symptoms (e.g. Mild headache, high energy)..."
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

            <Button variant="primary" fullWidth size="md" icon={Plus}>
              Save Mood Entry
            </Button>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12 / span 5' }} className="mood-summary-col">
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              7-Day Trend Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-background)'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>{day}</span>
                  <span style={{ fontSize: '0.9rem' }}>{i % 2 === 0 ? '😊 Happy' : '😌 Calm'}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
