import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Edit2, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, userProfile } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={User}>
          Account Details
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Manage your personal information, emergency settings, and security profile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div style={{ gridColumn: 'span 12 / span 4' }} className="prof-avatar-col">
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '5.5rem',
                height: '5.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '2.25rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {(userProfile?.fullName || 'User').charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {userProfile?.fullName || 'User'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              {user?.email || 'user@example.com'}
            </p>
            <Badge variant="secondary" icon={Shield}>
              {userProfile?.authProvider === 'google' ? 'Google Auth Verified' : 'Encrypted Password Auth'}
            </Badge>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12 / span 8' }} className="prof-info-col">
          <Card padding="lg">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Personal Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>FULL NAME</label>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', padding: '0.5rem 0', borderBottom: '1px solid rgba(246, 221, 229, 0.6)' }}>
                  {userProfile?.fullName || 'Not configured'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>EMAIL ADDRESS</label>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', padding: '0.5rem 0', borderBottom: '1px solid rgba(246, 221, 229, 0.6)' }}>
                  {user?.email || 'Not configured'}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>PHONE NUMBER</label>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', padding: '0.5rem 0', borderBottom: '1px solid rgba(246, 221, 229, 0.6)' }}>
                  {userProfile?.phone || 'Add phone number'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
