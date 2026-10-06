import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, UserPlus, ArrowLeft, Phone } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuth, parseAuthError } from '../../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    agreedTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!formData.agreedTerms) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await googleLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative'
      }}
    >
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-primary)',
          fontWeight: 600,
          textDecoration: 'none'
        }}
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Create Your SecureHer Account
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Set up your profile and configure emergency protection
          </p>
        </div>

        <Card padding="lg">
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(217, 45, 58, 0.1)',
                border: '1px solid var(--color-emergency)',
                color: 'var(--color-emergency)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(246, 221, 229, 0.9)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: 'var(--color-background)'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(246, 221, 229, 0.9)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: 'var(--color-background)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(246, 221, 229, 0.9)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: 'var(--color-background)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(246, 221, 229, 0.9)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: 'var(--color-background)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(246, 221, 229, 0.9)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: 'var(--color-background)'
                  }}
                />
              </div>
            </div>

            {/* Emergency Contact Information Section */}
            <div style={{ borderTop: '1px solid rgba(246, 221, 229, 0.7)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-emergency)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={16} /> Initial Emergency Contact Circle
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  name="emergencyContactName"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Emergency Contact Name *"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(246, 221, 229, 0.9)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: 'var(--color-background)'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    required
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="Contact Phone Number *"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(246, 221, 229, 0.9)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: 'var(--color-background)'
                    }}
                  />
                  <input
                    type="email"
                    name="emergencyContactEmail"
                    required
                    value={formData.emergencyContactEmail}
                    onChange={handleChange}
                    placeholder="Contact Email Address *"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(246, 221, 229, 0.9)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: 'var(--color-background)'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="agreedTerms"
                name="agreedTerms"
                checked={formData.agreedTerms}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="agreedTerms" style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} icon={UserPlus}>
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--color-text-light)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, borderTop: '1px solid rgba(246, 221, 229, 0.8)' }} />
            <span style={{ padding: '0 0.75rem', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, borderTop: '1px solid rgba(246, 221, 229, 0.8)' }} />
          </div>

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            fullWidth
            size="lg"
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '0.5rem' }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </Button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(246, 221, 229, 0.6)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
