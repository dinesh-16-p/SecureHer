import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, Calendar, Smile, Pill, Users, MapPin, Stethoscope, ChevronRight, Activity } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const userName = userProfile?.fullName || 'User';

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={Shield}>
          Authenticated Dashboard
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Welcome back, {userName} 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Your safety, health, and wellbeing at a glance.
        </p>
      </div>

      {/* Emergency SOS High-Visibility Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(253, 242, 242, 0.85) 100%)',
          border: '2px solid rgba(217, 45, 58, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div>
          <Badge variant="emergency" icon={AlertTriangle}>
            Instant Protection
          </Badge>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.35rem 0' }}>
            Emergency SOS Action Ready
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
            Press and hold for 3 seconds to dispatch live location alerts to your contacts.
          </p>
        </div>
        <Link to="/safety/sos">
          <Button variant="emergency" size="lg" icon={AlertTriangle}>
            Activate SOS Mode
          </Button>
        </Link>
      </div>

      {/* Overview Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Safety Score</span>
            <Shield size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>92 / 100</h2>
          <p style={{ fontSize: '0.85rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.35rem' }}>
            ✓ Emergency Circle Configured
          </p>
        </Card>

        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Cycle Phase</span>
            <Activity size={20} color="var(--color-health)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Follicular Phase</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Day 9 of 28 • Rising Energy
          </p>
        </Card>

        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Medications</span>
            <Pill size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>1 Pending</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.35rem' }}>
            Iron & Folic Acid (02:00 PM)
          </p>
        </Card>

        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Appointment</span>
            <Stethoscope size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)' }}>Oct 18, 2026</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Dr. Sarah Jenkins (Gynecologist)
          </p>
        </Card>
      </div>

      {/* Quick Access Links */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Quick Navigation Modules
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Emergency Contacts', path: '/safety/contacts', icon: Users, color: 'var(--color-secondary)' },
          { label: 'Live Location Sharing', path: '/safety/location', icon: MapPin, color: 'var(--color-primary)' },
          { label: 'Period Tracker', path: '/health/period', icon: Calendar, color: 'var(--color-health)' },
          { label: 'Mood Journal', path: '/health/mood', icon: Smile, color: 'var(--color-secondary)' },
          { label: 'Community Threads', path: '/community', icon: Users, color: 'var(--color-primary)' }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <Card hoverEffect={true} padding="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={20} color={item.color} />
                  <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--color-primary)' }}>{item.label}</span>
                </div>
                <ChevronRight size={16} color="var(--color-text-light)" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
