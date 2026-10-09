import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Users,
  MapPin,
  ChevronRight,
  Camera,
  Navigation,
  Building,
  Lock,
  FileText,
  PhoneForwarded,
  PhoneCall,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';
import { subscribeJourneys, subscribeIncidentReports } from '../../services/firebase/firestoreService';

const DashboardPage = () => {
  const { userProfile, user } = useAuth();
  const { emergencyContacts, currentLocation } = useSafety();

  const [activeJourney, setActiveJourney] = useState(null);
  const [incidentCount, setIncidentCount] = useState(0);
  const [evidenceCount, setEvidenceCount] = useState(0);

  const userName = userProfile?.fullName || user?.displayName || 'User';

  // Subscribe to active journey
  useEffect(() => {
    if (!user?.uid) return;
    const unsubJourneys = subscribeJourneys(user.uid, (journeys) => {
      const active = journeys.find((j) => j.status === 'active' || j.status === 'paused');
      setActiveJourney(active || null);
    });

    const unsubIncidents = subscribeIncidentReports(user.uid, (reports) => {
      setIncidentCount(reports.length);
    });

    try {
      const stored = JSON.parse(localStorage.getItem('secureher_evidence_vault') || '[]');
      setEvidenceCount(stored.length);
    } catch (e) {
      setEvidenceCount(0);
    }

    return () => {
      unsubJourneys();
      unsubIncidents();
    };
  }, [user?.uid]);

  // Calculate dynamic Safety Readiness Score
  let safetyScore = 50;
  if (emergencyContacts.length >= 1) safetyScore += 25;
  if (emergencyContacts.length >= 2) safetyScore += 10;
  if (currentLocation) safetyScore += 15;

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={Shield}>
          Security Dashboard
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Welcome back, {userName} 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Your real-time protection overview, travel tracking, and private evidence records.
        </p>
      </div>

      {/* Emergency SOS High-Visibility Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(253, 242, 242, 0.95) 100%)',
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
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', margin: 0 }}>
            {emergencyContacts.length > 0
              ? `Connected to ${emergencyContacts.length} trusted emergency contact(s) with live GPS dispatch via Brevo.`
              : 'No emergency contacts configured yet. Add contacts to enable instant email dispatches.'}
          </p>
        </div>
        <Link to="/safety/sos" style={{ textDecoration: 'none' }}>
          <Button variant="emergency" size="lg" icon={AlertTriangle}>
            Open SOS Dispatch
          </Button>
        </Link>
      </div>

      {/* Security Overview Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Safety Score */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Safety Readiness
            </span>
            <Shield size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{safetyScore} / 100</h2>
          <p style={{ fontSize: '0.85rem', color: emergencyContacts.length > 0 ? '#2E7D32' : 'var(--color-emergency)', fontWeight: 600, marginTop: '0.35rem' }}>
            {emergencyContacts.length > 0
              ? `✓ ${emergencyContacts.length} Contact(s) Configured`
              : '⚠️ Configure emergency contacts'}
          </p>
        </Card>

        {/* Active Journey Status */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Trusted Journey
            </span>
            <Navigation size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {activeJourney ? activeJourney.title : 'No Active Journey'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: activeJourney ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: 600, marginTop: '0.35rem' }}>
            {activeJourney
              ? `📍 To: ${activeJourney.destinationLabel} (Exp: ${activeJourney.expectedArrivalAt || 'N/A'})`
              : 'Plan & share safe travel progress'}
          </p>
        </Card>

        {/* Evidence Vault Records */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Evidence Vault
            </span>
            <Lock size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {evidenceCount} Sealed {evidenceCount === 1 ? 'Item' : 'Items'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.35rem' }}>
            🔒 SHA-256 Tamper-Evident Local Storage
          </p>
        </Card>

        {/* Incident Reports */}
        <Card hoverEffect={true}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Incident Records
            </span>
            <FileText size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {incidentCount} Logged
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
            Private recordkeeping & documentation
          </p>
        </Card>
      </div>

      {/* Security Modules Quick Grid */}
      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Security Features & Tools
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Trusted Journey Tracking', path: '/safety/journey', icon: Navigation, color: 'var(--color-primary)' },
          { label: 'Nearby Emergency Services', path: '/safety/nearby', icon: Building, color: 'var(--color-secondary)' },
          { label: 'Evidence Vault & Hashing', path: '/safety/evidence-history', icon: Lock, color: 'var(--color-primary)' },
          { label: 'Incident Evidence Camera', path: '/safety/evidence', icon: Camera, color: 'var(--color-emergency)' },
          { label: 'Safety Incident Reports', path: '/safety/incidents', icon: FileText, color: 'var(--color-secondary)' },
          { label: 'Fake Call & Escape Mode', path: '/safety/fake-call', icon: PhoneForwarded, color: 'var(--color-health)' },
          { label: 'Emergency Contacts', path: '/safety/contacts', icon: Users, color: 'var(--color-secondary)' },
          { label: 'Live Location & Map', path: '/safety/location', icon: MapPin, color: 'var(--color-primary)' },
          { label: 'Emergency Helplines', path: '/safety/helplines', icon: PhoneCall, color: 'var(--color-health)' }
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
