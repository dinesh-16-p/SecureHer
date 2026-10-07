import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertTriangle, MapPin, PhoneCall, CheckCircle2, Radio, Volume2, VolumeX, Mail, ExternalLink, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const SOSPage = () => {
  const { user } = useAuth();
  const {
    emergencyContacts,
    primaryEmergencyContact,
    currentLocation,
    getCurrentPosition,
    sosActive,
    sosStatus,
    triggerSOS,
    cancelSOS
  } = useSafety();

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const holdIntervalRef = useRef(null);

  // Request location on entering SOS page if not yet acquired
  useEffect(() => {
    if (!currentLocation) {
      getCurrentPosition();
    }
  }, [currentLocation, getCurrentPosition]);

  const startHolding = () => {
    if (sosActive) return;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds hold for crisp activation

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        setHoldProgress(0);
        handleActivate();
      }
    }, 50);
  };

  const stopHolding = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleActivate = async () => {
    setIsTriggering(true);
    try {
      await triggerSOS();
    } catch (e) {
      console.error('SOS activation error:', e);
    } finally {
      setIsTriggering(false);
    }
  };

  const googleMapsUrl = currentLocation
    ? `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
    : null;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="emergency" icon={AlertTriangle}>
          Emergency SOS Action
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Emergency SOS Dispatch
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Press and hold for 3 seconds to sound the emergency alarm and dispatch your live GPS location to your configured emergency contact.
        </p>
      </div>

      <Card padding="lg" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto', border: sosActive ? '2px solid var(--color-emergency)' : '1px solid rgba(246, 221, 229, 0.8)' }}>
        {!sosActive ? (
          <div>
            {/* SOS Trigger Button with Hold Progress Animation */}
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '2rem auto' }}>
              {/* Circular Progress Ring */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="rgba(217, 45, 58, 0.15)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="var(--color-emergency)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - holdProgress / 100)}
                  style={{ transition: isHolding ? 'stroke-dashoffset 0.05s linear' : 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>

              <div
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-emergency)',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isHolding ? '0 0 50px rgba(217, 45, 58, 0.7)' : 'var(--shadow-sos)',
                  cursor: 'pointer',
                  transform: isHolding ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  border: '6px solid rgba(255, 255, 255, 0.95)',
                  userSelect: 'none'
                }}
                className={isHolding ? '' : 'animate-sos-pulse'}
              >
                <AlertTriangle size={48} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '0.05em' }}>
                  {isHolding ? `HOLDING ${Math.round(holdProgress)}%` : isTriggering ? 'ACTIVATING...' : 'HOLD 3s FOR SOS'}
                </span>
              </div>
            </div>

            {/* Quick 1-Tap Trigger fallback */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={handleActivate}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-emergency)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Or tap here for Instant Immediate Activation
              </button>
            </div>

            {/* System Status Readout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', borderTop: '1px solid rgba(246, 221, 229, 0.8)', paddingTop: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>GPS Status</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: currentLocation ? 'var(--color-primary)' : 'var(--color-emergency)' }}>
                  {currentLocation ? '✓ GPS Acquired' : 'Querying Location...'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Emergency Contact</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: primaryEmergencyContact ? 'var(--color-secondary)' : 'var(--color-emergency)' }}>
                  {primaryEmergencyContact ? primaryEmergencyContact.name : 'None Configured'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Helpline Ready</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2E7D32' }}>
                  112 (National)
                </div>
              </div>
            </div>

            {!primaryEmergencyContact && (
              <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(217, 45, 58, 0.08)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-emergency)', fontWeight: 600 }}>
                  ⚠️ No emergency contact configured. Add an email to receive automatic SOS dispatches.
                </span>
                <Link to="/safety/contacts">
                  <Button variant="outline" size="sm">
                    Add Contact
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* SOS ACTIVE EMERGENCY STATE */
          <div style={{ padding: '1rem 0' }}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 45, 58, 0.15)',
                color: 'var(--color-emergency)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <Radio size={42} className="animate-pulse-glow" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-emergency)', marginBottom: '0.35rem' }}>
              🚨 EMERGENCY SOS ACTIVATED
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '1.5rem', fontWeight: 600 }}>
              Siren alarm is sounding and emergency notification has been broadcast.
            </p>

            {/* Real Status Cards */}
            <div style={{ backgroundColor: 'var(--color-background)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Sound Alarm Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                  <Volume2 size={18} color="var(--color-emergency)" /> <strong>Siren Alarm:</strong>
                </span>
                <span style={{ color: 'var(--color-emergency)', fontWeight: 700 }}>
                  Active (Continuous Tone)
                </span>
              </div>

              {/* Location Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                  <MapPin size={18} color="var(--color-secondary)" /> <strong>Live GPS:</strong>
                </span>
                {currentLocation ? (
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'underline' }}>
                    {currentLocation.latitude.toFixed(4)}°, {currentLocation.longitude.toFixed(4)}° <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)' }}>Location unavailable</span>
                )}
              </div>

              {/* Email Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                  <Mail size={18} color="var(--color-primary)" /> <strong>Emergency Email:</strong>
                </span>
                {sosStatus.emailSent ? (
                  <span style={{ color: '#2E7D32', fontWeight: 700 }}>
                    Delivered ✓ ({primaryEmergencyContact?.email})
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-emergency)', fontWeight: 600 }}>
                    {primaryEmergencyContact
                      ? `Delivery Unconfirmed ✗ (${primaryEmergencyContact.email})`
                      : 'No email configured'}
                  </span>
                )}
              </div>

              {/* Direct message from backend or system */}
              {sosStatus.message && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', paddingTop: '0.5rem', borderTop: '1px solid rgba(246, 221, 229, 0.8)' }}>
                  Status: {sosStatus.message} • {sosStatus.timestamp}
                </div>
              )}
            </div>

            {/* Helpline Fast Dial */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <a href="tel:112" style={{ textDecoration: 'none' }}>
                <Button variant="emergency" size="md" icon={PhoneCall}>
                  Call 112 (National Emergency)
                </Button>
              </a>
              {primaryEmergencyContact?.phone && (
                <a href={`tel:${primaryEmergencyContact.phone}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="md" icon={PhoneCall}>
                    Call {primaryEmergencyContact.name}
                  </Button>
                </a>
              )}
            </div>

            <Button variant="outline" size="md" onClick={cancelSOS} icon={VolumeX}>
              Stop Alarm / Cancel Emergency Mode
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SOSPage;
