import React, { useState } from 'react';
import { Bell, AlertTriangle, Heart, Pill, CheckCircle2, Shield, Activity, X, Check } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Emergency Circle Verified',
    desc: 'Your emergency contacts circle has been configured and verified. SOS alerts are ready.',
    time: '10 mins ago',
    type: 'sos',
    unread: true,
    icon: Shield,
    color: 'var(--color-primary)'
  },
  {
    id: '2',
    title: 'Cycle Phase: Follicular',
    desc: 'You have entered your Follicular phase (Day 9). Rising estrogen — expect higher energy levels.',
    time: '2 hours ago',
    type: 'period',
    unread: true,
    icon: Activity,
    color: 'var(--color-health)'
  },
  {
    id: '3',
    title: 'Medication Reminder',
    desc: 'Time for your daily Multivitamin Complex. Tap to mark as taken.',
    time: '6 hours ago',
    type: 'med',
    unread: true,
    icon: Pill,
    color: 'var(--color-secondary)'
  },
  {
    id: '4',
    title: 'Doctor Appointment Tomorrow',
    desc: 'Reminder: Dr. Sarah Jenkins (Gynecologist) appointment at 11:00 AM — Apollo Clinic.',
    time: 'Yesterday',
    type: 'appointment',
    unread: false,
    icon: Heart,
    color: '#C75B7A'
  },
  {
    id: '5',
    title: 'Community Reply',
    desc: 'Sneha R. replied to your thread: "Safe Route Home — Banjara Hills". 3 new replies.',
    time: '2 days ago',
    type: 'community',
    unread: false,
    icon: CheckCircle2,
    color: '#2E7D32'
  },
  {
    id: '6',
    title: 'Safety Tip of the Week',
    desc: 'Share your live location with a trusted contact before evening commutes. Enable it in Safety → Location.',
    time: '3 days ago',
    type: 'tip',
    unread: false,
    icon: AlertTriangle,
    color: 'var(--color-primary)'
  }
];

const typeLabels = {
  sos: 'Emergency',
  period: 'Health',
  med: 'Medication',
  appointment: 'Appointment',
  community: 'Community',
  tip: 'Safety Tip'
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filters = ['all', 'sos', 'period', 'med', 'appointment', 'community'];

  const visible = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="primary" icon={Bell}>Alert Center</Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Notifications & Alerts
            {unreadCount > 0 && (
              <span style={{
                marginLeft: '0.75rem',
                fontSize: '1rem',
                background: 'var(--color-secondary)',
                color: '#fff',
                borderRadius: '100px',
                padding: '0.15rem 0.65rem',
                verticalAlign: 'middle',
                fontWeight: 700
              }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Real-time safety alerts, health notifications, and medication reminders.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={Check} onClick={markAllRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              border: filter === f ? 'none' : '1.5px solid rgba(91,33,79,0.2)',
              background: filter === f ? 'var(--color-primary)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {f === 'all' ? 'All Alerts' : typeLabels[f] || f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {visible.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <Bell size={40} color="var(--color-text-light)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>No notifications in this category.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visible.map(n => {
            const Icon = n.icon;
            return (
              <Card
                key={n.id}
                hoverEffect={true}
                padding="md"
                style={{
                  borderLeft: n.unread ? '4px solid var(--color-secondary)' : '4px solid transparent',
                  background: n.unread ? 'linear-gradient(to right, rgba(199,91,122,0.04), #fff)' : '#fff',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px',
                    background: `${n.color}15`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon size={20} color={n.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                          {n.title}
                        </h4>
                        {n.unread && (
                          <span style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: 'var(--color-secondary)', display: 'inline-block'
                          }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>{n.time}</span>
                        {n.unread && (
                          <button onClick={() => markRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', padding: '2px' }} title="Mark as read">
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={() => dismiss(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', padding: '2px' }} title="Dismiss">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{n.desc}</p>
                    <span style={{
                      marginTop: '0.5rem',
                      display: 'inline-block',
                      padding: '0.1rem 0.6rem',
                      borderRadius: '100px',
                      background: `${n.color}15`,
                      color: n.color,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {typeLabels[n.type] || n.type}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
