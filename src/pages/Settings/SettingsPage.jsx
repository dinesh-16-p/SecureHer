import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Lock, Eye, LogOut, Camera, Mic, MapPin, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';
import {
  requestLocationAccess,
  requestCameraStream,
  requestMicrophoneStream,
  requestNotificationPermission,
  checkAllPermissions
} from '../../services/permissionService';

const SettingsPage = () => {
  const { logout, userProfile } = useAuth();
  const { permissions, refreshPermissions } = useSafety();

  const [loadingPerm, setLoadingPerm] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleTestPermission = async (type) => {
    setLoadingPerm(type);
    setFeedback('');
    try {
      if (type === 'location') {
        await requestLocationAccess();
        setFeedback('Location access granted.');
      } else if (type === 'camera') {
        const stream = await requestCameraStream(true);
        stream.getTracks().forEach((t) => t.stop());
        setFeedback('Camera access granted.');
      } else if (type === 'microphone') {
        const stream = await requestMicrophoneStream();
        stream.getTracks().forEach((t) => t.stop());
        setFeedback('Microphone access granted.');
      } else if (type === 'notifications') {
        const res = await requestNotificationPermission();
        setFeedback(`Notification permission: ${res}`);
      }
      await refreshPermissions();
    } catch (err) {
      setFeedback(`Permission note: ${err.message}`);
    } finally {
      setLoadingPerm(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'granted') {
      return (
        <span style={{ color: '#2E7D32', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <CheckCircle2 size={14} /> Granted
        </span>
      );
    } else if (status === 'denied') {
      return (
        <span style={{ color: 'var(--color-emergency)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={14} /> Denied (Blocked)
        </span>
      );
    } else {
      return (
        <span style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
          Not Requested / Prompt
        </span>
      );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={Settings}>
          System Preferences
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Account & Device Permissions
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Manage device hardware access, notifications, and emergency preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px' }}>
        {/* Device Permissions Status */}
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Hardware & Device Permissions
            </h3>
            <Button variant="ghost" size="sm" icon={RefreshCw} onClick={refreshPermissions}>
              Refresh
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Location */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={20} color="var(--color-secondary)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Location Access</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Required for Live Map and SOS coordinates</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusBadge(permissions.location)}
                <Button variant="outline" size="sm" onClick={() => handleTestPermission('location')} disabled={loadingPerm === 'location'}>
                  {loadingPerm === 'location' ? 'Checking...' : 'Check / Request'}
                </Button>
              </div>
            </div>

            {/* Camera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Camera size={20} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Camera Access</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Required for Incident Evidence Vault</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusBadge(permissions.camera)}
                <Button variant="outline" size="sm" onClick={() => handleTestPermission('camera')} disabled={loadingPerm === 'camera'}>
                  {loadingPerm === 'camera' ? 'Checking...' : 'Check / Request'}
                </Button>
              </div>
            </div>

            {/* Microphone */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mic size={20} color="var(--color-health)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Microphone Access</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Required for audio-enabled evidence recording</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusBadge(permissions.microphone)}
                <Button variant="outline" size="sm" onClick={() => handleTestPermission('microphone')} disabled={loadingPerm === 'microphone'}>
                  {loadingPerm === 'microphone' ? 'Checking...' : 'Check / Request'}
                </Button>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={20} color="var(--color-secondary)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Browser Notifications</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>For medication alerts and SOS broadcast updates</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusBadge(permissions.notifications)}
                <Button variant="outline" size="sm" onClick={() => handleTestPermission('notifications')} disabled={loadingPerm === 'notifications'}>
                  {loadingPerm === 'notifications' ? 'Checking...' : 'Enable Alerts'}
                </Button>
              </div>
            </div>
          </div>

          {feedback && (
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              {feedback}
            </p>
          )}
        </Card>

        {/* PWA & Offline Security Card */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shield size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Progressive Web App (PWA) & Offline Security
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#FFF9FB', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.8)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                Offline Fallback & Helplines
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
                When internet access is lost, SecureHer continues to run the core application shell and displays emergency telephone helplines (112, 1091, 100) that connect directly through cellular telephone carriers without internet.
              </p>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#FFF9FB', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.8)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                Privacy & Cache Security Isolation
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
                The service worker explicitly excludes authenticated API routes, Firestore documents, evidence media, and access tokens from browser storage caches. Your private incidents and account information are never retained in shared cache partitions.
              </p>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#FAF5F8', borderRadius: '8px', borderLeft: '3px solid var(--color-secondary)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                Browser & OS Capabilities Disclosure
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.825rem' }}>
                Web and Progressive Web Applications rely on standard browser APIs (W3C Geolocation, MediaStreams). Continuous background location monitoring and silent background SOS execution when the device is locked or the browser tab is dismissed may be restricted by iOS Safari and Android power management. For active tracking, keep the application open.
              </p>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
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
