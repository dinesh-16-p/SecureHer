import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Save, X, Shield, Heart, Camera } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';

const ProfilePage = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { emergencyContacts } = useSafety();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    dob: '',
    bloodGroup: 'B+'
  });

  useEffect(() => {
    setForm({
      fullName: userProfile?.fullName || user?.displayName || '',
      email: user?.email || '',
      phone: userProfile?.phone || user?.phoneNumber || '',
      city: userProfile?.city || '',
      dob: userProfile?.dob || '',
      bloodGroup: userProfile?.bloodGroup || 'B+'
    });
  }, [user, userProfile]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateUserProfile({
        fullName: form.fullName,
        phone: form.phone,
        city: form.city,
        dob: form.dob,
        bloodGroup: form.bloodGroup
      });
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const InputRow = ({ label, field, icon: Icon, type = 'text', readOnly = false }) => (
    <div>
      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={16} color="var(--color-secondary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type={type}
          value={form[field] || ''}
          onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
          disabled={!editMode || readOnly}
          style={{
            width: '100%',
            padding: '0.7rem 1rem 0.7rem 2.5rem',
            borderRadius: '10px',
            border: editMode && !readOnly ? '1.5px solid var(--color-secondary)' : '1.5px solid rgba(91,33,79,0.12)',
            background: editMode && !readOnly ? '#fff' : 'rgba(246,221,229,0.15)',
            color: 'var(--color-primary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );

  const initialLetter = (form.fullName || form.email || 'U').charAt(0).toUpperCase();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={User}>My Account</Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          My Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Manage your personal information and account preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Avatar Card */}
        <div>
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: '0 auto'
              }}>
                {userProfile?.profileImage ? (
                  <img src={userProfile.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : initialLetter}
              </div>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem' }}>
              {form.fullName || 'SecureHer User'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>{form.email}</p>

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid rgba(246,221,229,0.6)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Shield size={13} color="var(--color-primary)" /> Safety Circle Status
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: emergencyContacts.length > 0 ? '#2E7D32' : '#D92D3A' }}>
                  {emergencyContacts.length > 0 ? `${emergencyContacts.length} Contact(s)` : 'No Contacts'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid rgba(246,221,229,0.6)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Heart size={13} color="var(--color-secondary)" /> Blood Group
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>{form.bloodGroup}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Card */}
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Personal Information
            </h3>
            {!editMode ? (
              <Button variant="outline" size="sm" icon={Edit3} onClick={() => setEditMode(true)}>Edit</Button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" size="sm" icon={X} onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
                <Button variant="primary" size="sm" icon={Save} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {saved && (
            <div style={{
              background: 'rgba(46,125,50,0.1)', border: '1px solid rgba(46,125,50,0.3)',
              borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
              fontSize: '0.875rem', color: '#2E7D32', fontWeight: 600
            }}>
              ✓ Profile updated successfully in Firestore!
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(217,45,58,0.1)', border: '1px solid rgba(217,45,58,0.3)',
              borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
              fontSize: '0.875rem', color: '#D92D3A', fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <InputRow label="Full Name" field="fullName" icon={User} />
            </div>
            <InputRow label="Email Address" field="email" icon={Mail} readOnly={true} />
            <InputRow label="Phone Number" field="phone" icon={Phone} />
            <InputRow label="City / Location" field="city" icon={MapPin} />
            <InputRow label="Date of Birth" field="dob" icon={Calendar} type="date" />
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
                Blood Group
              </label>
              <select
                value={form.bloodGroup}
                onChange={e => setForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                disabled={!editMode}
                style={{
                  width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                  border: editMode ? '1.5px solid var(--color-secondary)' : '1.5px solid rgba(91,33,79,0.12)',
                  background: editMode ? '#fff' : 'rgba(246,221,229,0.15)',
                  color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem',
                  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
                }}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
