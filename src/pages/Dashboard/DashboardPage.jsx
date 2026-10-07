import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, Calendar, Smile, Pill, Users, MapPin, Stethoscope, ChevronRight, Activity, Camera } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';
import { useHealth } from '../../context/HealthContext';

const DashboardPage = () => {
  const { userProfile, user } = useAuth();
  const { emergencyContacts, currentLocation } = useSafety();
  const { cycleSummary, medications, appointments } = useHealth();

  const userName = userProfile?.fullName || user?.displayName || 'User';

  // Calculate pending medications
  const pendingMeds = medications.filter((m) => m.status !== 'Taken');
  const nextAppt = appointments.length > 0 ? appointments[0] : null;

  // Calculate Safety Score dynamically
  let safetyScore = 50;
  if (emergencyContacts.length >= 1) safetyScore += 30;
  if (emergencyContacts.length >= 2) safetyScore += 10;
  if (currentLocation) safetyScore += 10;

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
          Your safety shield, reproductive cycle, and wellness schedule at a glance.
        </p>
      </div>

      {/* Emergency SOS High-Visibility Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(253, 242, 242, 0.9) 100%)',
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
            {emergencyContacts.length > 0
              ? `Connected to ${emergencyContacts.length} trusted emergency contact(s) with live GPS dispatch.`
              : 'No emergency contacts configured yet. Add contacts to enable instant email dispatches.'}
          </p>
        </div>
        <Link to="/safety/sos">
          <Button variant="emergency" size="lg" icon={AlertTriangle}>
            Open SOS Dispatch
          </Button>
        </Link>
      </div>

      {/* Dynamic Overview Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Safety Score */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Safety Score</span>
            <Shield size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{safetyScore} / 100</h2>
          <p style={{ fontSize: '0.85rem', color: emergencyContacts.length > 0 ? '#2E7D32' : 'var(--color-emergency)', fontWeight: 600, marginTop: '0.35rem' }}>
            {emergencyContacts.length > 0
              ? `✓ ${emergencyContacts.length} Contact(s) Configured`
              : '⚠️ Add emergency contacts'}
          </p>
        </Card>

        {/* Cycle Phase */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Cycle Phase</span>
            <Activity size={20} color="var(--color-health)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {cycleSummary.hasData ? cycleSummary.phase : 'No Cycle Logged'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            {cycleSummary.hasData
              ? `Day ${cycleSummary.currentDay} of ${cycleSummary.cycleLength} • Next: ${cycleSummary.nextPeriodDate}`
              : 'Log period date to calculate phase'}
          </p>
        </Card>

        {/* Medications */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Medications</span>
            <Pill size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {pendingMeds.length > 0 ? `${pendingMeds.length} Pending` : 'All Taken'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.35rem' }}>
            {pendingMeds.length > 0
              ? `${pendingMeds[0].name} (${pendingMeds[0].time})`
              : `${medications.length} active prescriptions`}
          </p>
        </Card>

        {/* Appointments */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Appointment</span>
            <Stethoscope size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {nextAppt ? nextAppt.date : 'No Appointments'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            {nextAppt ? `${nextAppt.doctor} (${nextAppt.specialty})` : 'Schedule consultation'}
          </p>
        </Card>
      </div>

      {/* Quick Access Navigation Modules */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Quick Navigation Modules
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Emergency Contacts', path: '/safety/contacts', icon: Users, color: 'var(--color-secondary)' },
          { label: 'Live Location & Map', path: '/safety/location', icon: MapPin, color: 'var(--color-primary)' },
          { label: 'Evidence Camera', path: '/safety/evidence', icon: Camera, color: 'var(--color-emergency)' },
          { label: 'Period Tracker', path: '/health/period', icon: Calendar, color: 'var(--color-health)' },
          { label: 'Health Calendar', path: '/health/calendar', icon: Heart, color: 'var(--color-secondary)' },
          { label: 'Mood Journal', path: '/health/mood', icon: Smile, color: 'var(--color-primary)' },
          { label: 'Community Threads', path: '/community', icon: Users, color: 'var(--color-secondary)' }
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
