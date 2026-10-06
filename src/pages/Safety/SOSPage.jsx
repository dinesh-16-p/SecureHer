import React, { useState } from 'react';
import { Shield, AlertTriangle, MapPin, PhoneCall, CheckCircle2, Radio } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const SOSPage = () => {
  const [active, setActive] = useState(false);
  const [holding, setHolding] = useState(false);

  const handleActivate = () => {
    setActive(true);
  };

  const handleDeactivate = () => {
    setActive(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="emergency" icon={AlertTriangle}>
          Emergency SOS Action
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Emergency SOS Dispatch
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Press & hold the emergency button for 3 seconds to broadcast your live GPS location to your circle.
        </p>
      </div>

      <Card padding="lg" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        {!active ? (
          <div>
            <div
              onMouseDown={() => setHolding(true)}
              onMouseUp={() => {
                setHolding(false);
                handleActivate();
              }}
              onTouchStart={() => setHolding(true)}
              onTouchEnd={() => {
                setHolding(false);
                handleActivate();
              }}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-emergency)',
                color: '#FFFFFF',
                margin: '2rem auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: holding ? '0 0 45px rgba(217, 45, 58, 0.6)' : 'var(--shadow-sos)',
                cursor: 'pointer',
                transform: holding ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 0.2s ease',
                border: '6px solid rgba(255, 255, 255, 0.9)'
              }}
              className="animate-sos-pulse"
            >
              <AlertTriangle size={48} />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '0.05em' }}>
                {holding ? 'HOLDING...' : 'HOLD 3s SOS'}
              </span>
            </div>

            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Prevents accidental activations. Press and hold to initiate emergency alert broadcasting.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center', borderTop: '1px solid rgba(246, 221, 229, 0.8)', paddingTop: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>GPS Status</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>Location Ready</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Contacts</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-secondary)' }}>Configured</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Helplines</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2E7D32' }}>Active (112)</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '1rem 0' }}>
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 45, 58, 0.12)',
                color: 'var(--color-emergency)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}
            >
              <Radio size={36} className="animate-pulse-glow" />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-emergency)', marginBottom: '0.5rem' }}>
              🚨 SOS ACTIVATED
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Emergency alert dispatched to your contacts. Live location sharing is active.
            </p>

            <div style={{ backgroundColor: 'var(--color-background)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                <CheckCircle2 size={18} color="var(--color-emergency)" /> <strong>Location:</strong> Sharing Live Coordinates
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                <CheckCircle2 size={18} color="var(--color-emergency)" /> <strong>Contacts:</strong> Alert Dispatched via Cloud
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                <CheckCircle2 size={18} color="var(--color-emergency)" /> <strong>Direct Calling:</strong> 112 Ready
              </div>
            </div>

            <Button variant="outline" size="md" onClick={handleDeactivate}>
              Cancel / Stop Emergency Mode
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SOSPage;
