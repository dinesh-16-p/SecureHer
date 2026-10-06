import React from 'react';

/**
 * Reusable Button component for SecureHer
 * Supports variants: 'primary', 'secondary', 'outline', 'ghost', 'emergency'
 * Supports sizes: 'sm', 'md', 'lg'
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    borderRadius: 'var(--radius-full)',
    transition: 'all var(--transition-normal)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-heading)',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '0.95rem 2rem', fontSize: '1.125rem' }
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)',
      '&:hover': { backgroundColor: 'var(--color-primary-light)' }
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)'
    },
    accent: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-primary)'
    },
    outline: {
      backgroundColor: 'transparent',
      border: '2px solid var(--color-primary)',
      color: 'var(--color-primary)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)'
    },
    emergency: {
      backgroundColor: 'var(--color-emergency)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-sos)'
    }
  };

  const currentSize = sizes[size] || sizes.md;
  const currentVariant = variants[variant] || variants.primary;

  const combinedStyles = {
    ...baseStyles,
    ...currentSize,
    ...currentVariant,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={combinedStyles}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
        </>
      )}
    </button>
  );
};

export default Button;
