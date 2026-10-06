import React from 'react';
import { Shield, AlertTriangle, Heart, Calendar, Smile, Pill, Users, Bell, User, Settings, LogOut } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', display: 'flex' }}>
      {/* Sidebar Placeholder */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-accent)',
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2.5rem' }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield size={20} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              Secure<span style={{ color: 'var(--color-secondary)' }}>Her</span>
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Dashboard', icon: Shield, active: true },
              { label: 'Safety & SOS', icon: AlertTriangle },
              { label: 'Health Tracker', icon: Heart },
              { label: 'Community', icon: Users },
              { label: 'Notifications', icon: Bell },
              { label: 'Profile', icon: User },
              { label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: item.active ? 'var(--color-accent)' : 'transparent',
                    color: item.active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: item.active ? 700 : 600,
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>

        <Button variant="ghost" icon={LogOut} onClick={logout} fullWidth>
          Log Out
        </Button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              Good Day, {user?.fullName || 'User'} 👋
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Your safety and wellbeing at a glance.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}
            >
              <Bell size={20} />
            </div>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {(user?.fullName || 'U').charAt(0)}
            </div>
          </div>
        </div>

        {/* Dashboard Grid Placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card hoverEffect={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Safety Score</span>
              <Shield size={20} color="var(--color-secondary)" />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>88 / 100</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginTop: '0.5rem' }}>
              ✓ 2 Emergency contacts configured
            </p>
          </Card>

          <Card hoverEffect={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Cycle Status</span>
              <Heart size={20} color="var(--color-health)" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>Follicular Phase</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Estimated Day 9 of 28
            </p>
          </Card>

          <Card hoverEffect={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Emergency SOS</span>
              <AlertTriangle size={20} color="var(--color-emergency)" />
            </div>
            <Button variant="emergency" fullWidth size="md" icon={AlertTriangle}>
              Hold SOS Button
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
