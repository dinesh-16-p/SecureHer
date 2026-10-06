import React from 'react';
import { Settings, Shield, Bell, Lock, Eye, LogOut } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
  const { logout } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={Settings}>
          System Preferences
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Account & Privacy Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Configure emergency alert preferences, location privacy, and notification channels.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px' }}>
        <Card padding="lg">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Privacy & Permissions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>GPS Location Tracking</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Share coordinates only when SOS is active</div>
              </div>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Community Anonymity</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Default to posting anonymously in public threads</div>
              </div>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Notification Preferences
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Emergency SMS Broadcast</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Send high-priority SMS alerts during SOS</div>
              </div>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Medication & Cycle Reminders</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Daily push alerts for prescriptions</div>
              </div>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-emergency)', marginBottom: '1rem' }}>
            Account Actions
          </h3>
          <Button variant="emergency" icon={LogOut} onClick={logout}>
            Log Out of SecureHer
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
