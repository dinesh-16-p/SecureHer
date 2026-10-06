import React, { useState } from 'react';
import { Bell, AlertTriangle, Heart, Pill, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const NotificationsPage = () => {
  const [items] = useState([
    { id: '1', title: 'System Security Alert', desc: 'Emergency contacts circle verified and ready.', time: '10 mins ago', type: 'sos', unread: true },
    { id: '2', title: 'Cycle Phase Notification', desc: 'You entered Follicular Phase. Check wellness tips.', time: '2 hours ago', type: 'period', unread: true },
    { id: '3', title: 'Medication Reminder', desc: 'Time for daily Multivitamin Complex (08:00 AM).', time: 'Yesterday', type: 'med', unread: false }
  ]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={Bell}>
          Alert Center
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Notifications & Alerts
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Real-time safety notifications, medication reminders, and period estimates.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((n) => (
          <Card key={n.id} hoverEffect={true} padding="md" style={{ borderLeft: n.unread ? '4px solid var(--color-secondary)' : '1px solid rgba(246, 221, 229, 0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  {n.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{n.desc}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{n.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
