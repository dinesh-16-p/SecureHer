import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  PhoneOff,
  Phone,
  Volume2,
  MicOff,
  Grid,
  Shield,
  Clock,
  User,
  AlertTriangle,
  MapPin,
  Users,
  Navigation,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const PRESET_CALLERS = [
  { name: 'Mom', number: '+1 (555) 234-5678', avatar: '👩' },
  { name: 'Dad', number: '+1 (555) 345-6789', avatar: '👨' },
  { name: 'Boss (Work)', number: '+1 (555) 456-7890', avatar: '💼' },
  { name: 'Roommate', number: '+1 (555) 567-8901', avatar: '🏠' },
  { name: 'Doctor\'s Clinic', number: '+1 (555) 678-9012', avatar: '🩺' }
];

const DELAY_OPTIONS = [
  { label: 'Immediate (0s)', seconds: 0 },
  { label: '10 Seconds', seconds: 10 },
  { label: '30 Seconds', seconds: 30 },
  { label: '1 Minute', seconds: 60 },
  { label: '3 Minutes', seconds: 180 }
];

const FakeCallPage = () => {
  // Configuration State
  const [selectedCaller, setSelectedCaller] = useState(PRESET_CALLERS[0]);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState(0);

  // Simulation State: 'idle' | 'countdown' | 'ringing' | 'in_call'
  const [callState, setCallState] = useState('idle');
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Audio Context Ref for Synthesized Ringtone
  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const callDurationTimerRef = useRef(null);

  // Cleanup all timers and audio on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
      if ('vibrate' in navigator) navigator.vibrate(0);
    };
  }, []);

  // Web Audio Synthesizer for Phone Ringtone (Dual-Tone Multi-Frequency ring)
  const startRingtone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const playRingBurst = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = audioCtxRef.current.currentTime;

        // Standard US/EU phone ring tones: 440Hz + 480Hz
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);

        if ('vibrate' in navigator) {
          navigator.vibrate([400, 200, 400]);
        }
      };

      playRingBurst();
      ringIntervalRef.current = setInterval(playRingBurst, 3000);
    } catch (e) {
      console.warn('Web Audio note:', e);
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  };

  const handleStartSimulation = () => {
    if (selectedDelay === 0) {
      setCallState('ringing');
      startRingtone();
    } else {
      setCountdownLeft(selectedDelay);
      setCallState('countdown');

      countdownTimerRef.current = setInterval(() => {
        setCountdownLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            setCallState('ringing');
            startRingtone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setCallState('idle');
    setCountdownLeft(0);
  };

  const handleAcceptCall = () => {
    stopRingtone();
    setCallState('in_call');
    setCallDuration(0);

    callDurationTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleDeclineOrEnd = () => {
    stopRingtone();
    if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
    setCallState('idle');
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeaker(false);
  };

  const activeName = isCustom ? customName || 'Incoming Caller' : selectedCaller.name;
  const activeNumber = isCustom ? customNumber || '+1 (555) 000-0000' : selectedCaller.number;
  const activeAvatar = isCustom ? '👤' : selectedCaller.avatar;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Configuration Header */}
      {callState === 'idle' && (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <Badge variant="primary" icon={PhoneCall}>
              Discreet Safety Tool
            </Badge>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
              Fake Call & Escape Mode
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              Simulate an authentic incoming phone call to gracefully exit uncomfortable conversations or unsafe spaces.
            </p>
          </div>

          {/* Honest Tool Disclaimer */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FFF9FB',
              border: '1px solid rgba(246, 221, 229, 0.9)',
              borderLeft: '4px solid var(--color-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              color: 'var(--color-text)',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              <Info size={18} color="var(--color-secondary)" />
              <span>Simulated Call & Escape Strategy</span>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              This feature renders a realistic simulated call screen with synthesized audio right inside your browser. <strong>It does not place real phone calls or notify emergency dispatchers.</strong>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Setup Form */}
            <div style={{ gridColumn: 'span 12 / span 7' }}>
              <Card padding="lg">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                  1. Choose Caller Identity
                </h3>

                {/* Preset List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {PRESET_CALLERS.map((caller) => {
                    const isSelected = !isCustom && selectedCaller.name === caller.name;
                    return (
                      <div
                        key={caller.name}
                        onClick={() => {
                          setSelectedCaller(caller);
                          setIsCustom(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid rgba(246, 221, 229, 0.8)',
                          backgroundColor: isSelected ? 'var(--color-accent)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.4rem' }}>{caller.avatar}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                              {caller.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {caller.number}
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={18} color="var(--color-primary)" />}
                      </div>
                    );
                  })}

                  {/* Custom Option */}
                  <div
                    onClick={() => setIsCustom(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: isCustom ? '2px solid var(--color-primary)' : '1px solid rgba(246, 221, 229, 0.8)',
                      backgroundColor: isCustom ? 'var(--color-accent)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>✍️</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                          Custom Caller Name & Number
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Define any caller details
                        </div>
                      </div>
                    </div>
                    {isCustom && <CheckCircle2 size={18} color="var(--color-primary)" />}
                  </div>
                </div>

                {/* Custom Inputs */}
                {isCustom && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#FFF9FB', borderRadius: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                        Caller Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Landlord or Officer"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Timer Delay */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  2. Choose Delay Before Ringing
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {DELAY_OPTIONS.map((opt) => (
                    <button
                      key={opt.seconds}
                      type="button"
                      onClick={() => setSelectedDelay(opt.seconds)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: selectedDelay === opt.seconds ? '2px solid var(--color-primary)' : '1px solid rgba(246, 221, 229, 0.8)',
                        backgroundColor: selectedDelay === opt.seconds ? 'var(--color-primary)' : '#FFFFFF',
                        color: selectedDelay === opt.seconds ? '#FFFFFF' : 'var(--color-text)',
                        cursor: 'pointer'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <Button variant="emergency" size="lg" fullWidth icon={PhoneCall} onClick={handleStartSimulation}>
                  {selectedDelay === 0 ? 'Trigger Fake Call Now' : `Start Timer (${selectedDelay}s Delay)`}
                </Button>
              </Card>
            </div>

            {/* Escape Mode Quick Shortcuts */}
            <div style={{ gridColumn: 'span 12 / span 5' }}>
              <Card padding="lg" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Shield size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                    Escape Mode Shortcuts
                  </h3>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Quick 1-tap buttons to access genuine emergency tools if a simulated call is not enough:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/safety/contacts" style={{ textDecoration: 'none' }}>
                    <Button variant="outline" fullWidth icon={Users} style={{ justifyContent: 'flex-start' }}>
                      View Emergency Contacts
                    </Button>
                  </Link>
                  <Link to="/safety/nearby" style={{ textDecoration: 'none' }}>
                    <Button variant="outline" fullWidth icon={MapPin} style={{ justifyContent: 'flex-start' }}>
                      Find Nearby Police & Hospitals
                    </Button>
                  </Link>
                  <Link to="/safety/journey" style={{ textDecoration: 'none' }}>
                    <Button variant="outline" fullWidth icon={Navigation} style={{ justifyContent: 'flex-start' }}>
                      Start Trusted Journey Tracking
                    </Button>
                  </Link>
                  <Link to="/safety/sos" style={{ textDecoration: 'none' }}>
                    <Button variant="emergency" fullWidth icon={AlertTriangle} style={{ justifyContent: 'flex-start' }}>
                      Genuine Emergency SOS Broadcast
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Countdown View */}
      {callState === 'countdown' && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <Card padding="lg" style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(199, 91, 122, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-secondary)'
              }}
            >
              {countdownLeft}s
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Fake Call Armed
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Simulated incoming call from <strong>{activeName}</strong> will ring in {countdownLeft} seconds.
            </p>

            <Button variant="outline" icon={X} fullWidth onClick={handleCancelCountdown}>
              Cancel Fake Call
            </Button>
          </Card>
        </div>
      )}

      {/* Full-Screen Ringing Simulation */}
      {callState === 'ringing' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#1E1A1D',
            color: '#FFFFFF',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4rem 2rem'
          }}
        >
          {/* Top Caller Info */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{activeAvatar}</div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              {activeName}
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>
              {activeNumber}
            </p>
            <div style={{ fontSize: '0.9rem', color: '#C75B7A', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ● Incoming Call...
            </div>
          </div>

          {/* Bottom Action Buttons (Decline / Accept) */}
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '2rem' }}>
            {/* Decline */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleDeclineOrEnd}
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#D92D3A',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(217, 45, 58, 0.4)'
                }}
              >
                <PhoneOff size={28} />
              </button>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Decline</div>
            </div>

            {/* Accept */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleAcceptCall}
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#2E7D32',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(46, 125, 50, 0.4)'
                }}
              >
                <Phone size={28} />
              </button>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Accept</div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen In-Call Simulation */}
      {callState === 'in_call' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#1E1A1D',
            color: '#FFFFFF',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '3rem 2rem'
          }}
        >
          {/* Top Info */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{activeAvatar}</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
              {activeName}
            </h2>
            <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: '#C75B7A', fontWeight: 700 }}>
              {formatTimer(callDuration)}
            </div>
          </div>

          {/* In-Call Controls */}
          <div style={{ width: '100%', maxWidth: '320px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', margin: '2rem 0' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                background: isMuted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)',
                color: isMuted ? '#1E1A1D' : '#FFFFFF',
                border: 'none',
                padding: '1rem',
                borderRadius: '50%',
                width: '4rem',
                height: '4rem',
                margin: '0 auto',
                cursor: 'pointer'
              }}
            >
              <MicOff size={22} />
            </button>

            <button
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: 'none',
                padding: '1rem',
                borderRadius: '50%',
                width: '4rem',
                height: '4rem',
                margin: '0 auto',
                cursor: 'pointer'
              }}
            >
              <Grid size={22} />
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                background: isSpeaker ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)',
                color: isSpeaker ? '#1E1A1D' : '#FFFFFF',
                border: 'none',
                padding: '1rem',
                borderRadius: '50%',
                width: '4rem',
                height: '4rem',
                margin: '0 auto',
                cursor: 'pointer'
              }}
            >
              <Volume2 size={22} />
            </button>
          </div>

          {/* End Call Button */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={handleDeclineOrEnd}
              style={{
                width: '4.5rem',
                height: '4.5rem',
                borderRadius: '50%',
                backgroundColor: '#D92D3A',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(217, 45, 58, 0.4)'
              }}
            >
              <PhoneOff size={28} />
            </button>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>End Call</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeCallPage;
