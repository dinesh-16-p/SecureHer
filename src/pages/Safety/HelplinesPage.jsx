import React from 'react';
import { PhoneCall, Shield, AlertTriangle, Building2, HeartHandshake } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const HelplinesPage = () => {
  const helplines = [
    { name: 'National Emergency Number', number: '112', desc: 'Unified 24/7 all-in-one emergency helpline for police, fire & ambulance.', color: 'var(--color-emergency)', category: 'Emergency' },
    { name: 'Women Helpline', number: '1091', desc: 'Dedicated 24/7 national helpline for women facing distress, violence, or danger.', color: 'var(--color-secondary)', category: 'Women Safety' },
    { name: 'National Commission for Women (NCW)', number: '7827170170', desc: 'Domestic violence helpline providing immediate assistance and legal counseling.', color: 'var(--color-primary)', category: 'Legal & Safety' },
    { name: 'Police Control Room', number: '100', desc: 'Immediate local police dispatch and emergency assistance.', color: 'var(--color-primary)', category: 'Police' },
    { name: 'Ambulance Emergency', number: '102 / 108', desc: 'Medical emergency dispatch and paramedic support.', color: 'var(--color-health)', category: 'Medical' },
    { name: 'Cyber Crime Helpline', number: '1930', desc: 'National cyber fraud and online harassment reporting hotline.', color: 'var(--color-health)', category: 'Cyber Safety' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="accent" icon={PhoneCall}>
          Verified Helplines
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Emergency Helplines & Services
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          One-tap direct calling to verified emergency responder services and women support networks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {helplines.map((h, i) => (
          <Card key={i} hoverEffect={true} padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <Badge variant="primary">{h.category}</Badge>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: h.color, fontFamily: 'var(--font-heading)' }}>
                {h.number}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
              {h.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {h.desc}
            </p>

            <a href={`tel:${h.number.split('/')[0].trim()}`} style={{ textDecoration: 'none' }}>
              <Button variant="secondary" fullWidth size="md" icon={PhoneCall}>
                Call {h.number} Now
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HelplinesPage;
