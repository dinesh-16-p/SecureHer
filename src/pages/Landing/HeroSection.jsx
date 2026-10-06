import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Users, Sparkles, ArrowRight, Activity, Lock, PhoneCall } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const HeroSection = () => {
  return (
    <section
      style={{
        paddingTop: '8.5rem',
        paddingBottom: '5.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 80% 20%, rgba(246, 221, 229, 0.45) 0%, rgba(255, 249, 251, 1) 70%)',
      }}
    >
      {/* Soft Background Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(199, 91, 122, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155, 107, 143, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left Text Column */}
          <div style={{ gridColumn: 'span 12 / span 12' }} className="hero-text-col">
            <Badge variant="secondary" icon={Sparkles} className="animate-pulse-glow">
              Next-Gen AI Women Safety & Health Platform
            </Badge>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: '1.15',
                marginTop: '1.25rem',
                marginBottom: '1.25rem',
                color: 'var(--color-primary)'
              }}
            >
              Your Safety. <br />
              <span className="gradient-text">Your Health.</span> <br />
              <span style={{ color: 'var(--color-secondary)' }}>Your Community.</span>
            </h1>

            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--color-text-muted)',
                lineHeight: '1.65',
                maxWidth: '560px',
                marginBottom: '2.5rem'
              }}
            >
              One intelligent platform designed to help women stay safer, healthier, and connected with 24/7 emergency response, AI danger detection, and personalized cycle tracking.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <Link to="/signup">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Get Started
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" icon={Sparkles}>
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Quick Stat Highlights */}
            <div
              style={{
                display: 'flex',
                gap: '2.5rem',
                marginTop: '3.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(246, 221, 229, 0.8)'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                  1-Tap
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Instant Emergency SOS
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-secondary)', lineHeight: 1 }}>
                  100%
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Encrypted & Private
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-health)', lineHeight: 1 }}>
                  AI-Powered
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Safety & Cycle Support
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Card Showcase */}
          <div style={{ gridColumn: 'span 12 / span 12' }} className="hero-visual-col">
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto'
              }}
            >
              {/* Main Card */}
              <div
                className="glass-card animate-float"
                style={{
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, var(--color-background) 100%)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div
                  style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 8px 24px rgba(199, 91, 122, 0.3)'
                  }}
                >
                  <Shield size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                  SecureHer Ecosystem
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
                  Intelligent threat detection, emergency alert broadcasting, and holistic healthcare monitoring in one seamless app.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <Badge variant="primary" icon={Lock}>256-Bit Protection</Badge>
                  <Badge variant="health" icon={Activity}>Cycle Sync</Badge>
                </div>
              </div>

              {/* Floating Pill 1: SOS Badge */}
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  left: '-1.5rem',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-sos)',
                  borderLeft: '4px solid var(--color-emergency)'
                }}
              >
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217, 45, 58, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-emergency)'
                  }}
                >
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Emergency SOS</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-emergency)' }}>Active & Ready</div>
                </div>
              </div>

              {/* Floating Pill 2: Health Monitor */}
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '-1rem',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid var(--color-health)'
                }}
              >
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(155, 107, 143, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-health)'
                  }}
                >
                  <Heart size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cycle Status</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>Follicular Phase (Day 9)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-text-col { grid-column: span 7 / span 7 !important; }
          .hero-visual-col { grid-column: span 5 / span 5 !important; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
