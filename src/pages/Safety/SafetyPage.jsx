import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Users, MapPin, PhoneCall, ChevronRight, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const SafetyPage = () => {
  const modules = [
    {
      title: 'Emergency SOS Broadcast',
      path: '/safety/sos',
      icon: AlertTriangle,
      color: 'var(--color-emergency)',
      desc: '1-tap 3-second press-and-hold trigger to dispatch live coordinates and notify emergency contacts.'
    },
    {
      title: 'Emergency Contacts Circle',
      path: '/safety/contacts',
      icon: Users,
      color: 'var(--color-secondary)',
      desc: 'Configure up to 5 priority emergency contacts who receive automatic SMS & email alerts.'
    },
    {
      title: 'Live GPS & Route Sharing',
      path: '/safety/location',
      icon: MapPin,
      color: 'var(--color-primary)',
      desc: 'Share continuous live location links with trusted friends and track route deviations.'
    },
    {
      title: 'Emergency Helplines',
      path: '/safety/helplines',
      icon: PhoneCall,
      color: 'var(--color-health)',
      desc: 'Instant 1-tap direct phone calls to National Emergency (112), Women Helpline (1091), and Police.'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="emergency" icon={Shield}>
          Safety System
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Safety & Emergency Shield
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Configure emergency triggers, location tracking, and verified helplines for 24/7 protection.
        </p>
      </div>

      {/* Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.path} to={m.path} style={{ textDecoration: 'none' }}>
              <Card hoverEffect={true} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-background)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: m.color
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <ChevronRight size={20} color="var(--color-text-light)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  {m.desc}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyPage;
