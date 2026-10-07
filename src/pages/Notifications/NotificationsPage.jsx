import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Heart, Pill, CheckCircle2, Shield, Activity, X, Check } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { subscribeNotifications, markNotificationAsRead } from '../../services/firebase/firestoreService';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeNotifications(
      user.uid,
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      (err) => {
        console.warn('Notifications subscription note:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    if (!user) return;
    try {
      await markNotificationAsRead(user.uid, id);
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    notifications.forEach((n) => {
      if (!n.read) markNotificationAsRead(user.uid, n.id);
    });
  };

  const filters = ['all', 'emergency', 'health', 'system'];

  const visible = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="primary" icon={Bell}>
            Alert Center
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Notifications & Alerts
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: '0.75rem',
                  fontSize: '1rem',
                  background: 'var(--color-secondary)',
                  color: '#fff',
                  borderRadius: '100px',
                  padding: '0.15rem 0.65rem',
                  verticalAlign: 'middle',
                  fontWeight: 700
                }}
              >
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Real-time safety alerts, emergency dispatches, and health notifications.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={Check} onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {filters.map((f) => (
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
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading notifications...</p>
        </Card>
      ) : visible.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Bell size={44} color="var(--color-secondary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
            You're all caught up
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            No unread safety alerts or notifications in your queue.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visible.map((n) => (
            <Card
              key={n.id}
              hoverEffect={true}
              padding="md"
              style={{
                borderLeft: !n.read ? '4px solid var(--color-secondary)' : '4px solid transparent',
                background: !n.read ? 'linear-gradient(to right, rgba(199,91,122,0.04), #fff)' : '#fff',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(91,33,79,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Shield size={20} color="var(--color-primary)" />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-secondary)', display: 'inline-block' }} />
                      )}
                    </div>
                    {!n.read && (
                      <button onClick={() => handleMarkRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', padding: '2px' }} title="Mark as read">
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
