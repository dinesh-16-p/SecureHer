import React, { useState } from 'react';
import { MapPin, Navigation, Share2, Shield, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const LocationPage = () => {
  const [sharing, setSharing] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={MapPin}>
          Live Geolocation
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Live Location & Geofence Guard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Monitor your position, share real-time trip links with family, and configure safe route boundaries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div style={{ gridColumn: 'span 12 / span 8' }} className="loc-map-col">
          <Card padding="none" style={{ overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: '#EAE6EB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <MapPin size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                GPS Location Engine Active
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
                Coordinates: 28.6139° N, 77.2090° E (Accuracy ~10m)
              </p>
            </div>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Sharing Status: {sharing ? 'ACTIVE LINK' : 'OFFLINE'}
              </span>
              <Button
                variant={sharing ? 'emergency' : 'secondary'}
                size="sm"
                icon={Share2}
                onClick={() => setSharing(!sharing)}
              >
                {sharing ? 'Stop Sharing' : 'Share Live Trip Link'}
              </Button>
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12 / span 4' }} className="loc-info-col">
          <Card padding="lg">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Location Controls
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>SAFETY ZONE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>Home Boundary</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Safe Radius: 500m</span>
              </div>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-health)' }}>AUTOMATIC ALERTS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>Route Anomaly Guard</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Notifies circle on deviance</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
