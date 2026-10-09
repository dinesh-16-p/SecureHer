import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const CtaSection = () => {
  return (
    <section
      style={{
        padding: '6.5rem 0',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #3F1437 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Blur Spheres */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          backgroundColor: 'rgba(199, 91, 122, 0.25)',
          filter: 'blur(60px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          backgroundColor: 'rgba(155, 107, 143, 0.2)',
          filter: 'blur(60px)'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '780px' }}>
        <Badge variant="secondary" icon={Sparkles}>
          Join Thousands of Protected Women Today
        </Badge>

        <h2
          style={{
            fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: '1.2',
            margin: '1.5rem 0 1.25rem 0',
            letterSpacing: '-0.02em'
          }}
        >
          Take control of your personal security.
        </h2>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--color-accent)',
            opacity: 0.9,
            lineHeight: '1.65',
            marginBottom: '2.5rem'
          }}
        >
          Experience 24/7 instant emergency protection, live trusted journey tracking, tamper-evident evidence verification, and an active peer safety community.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <Link to="/signup">
            <Button variant="secondary" size="lg" icon={UserPlus}>
              Create Account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right" style={{ color: '#FFFFFF', borderColor: 'var(--color-accent)' }}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
