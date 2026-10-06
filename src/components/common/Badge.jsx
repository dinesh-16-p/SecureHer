import React from 'react';

/**
 * Reusable Badge component
 */
const Badge = ({ children, variant = 'primary', icon: Icon, className = '' }) => {
  const styles = {
    primary: { bg: 'rgba(91, 33, 79, 0.1)', color: 'var(--color-primary)' },
    secondary: { bg: 'rgba(199, 91, 122, 0.12)', color: 'var(--color-secondary)' },
    health: { bg: 'rgba(155, 107, 143, 0.15)', color: 'var(--color-health)' },
    emergency: { bg: 'rgba(217, 45, 58, 0.12)', color: 'var(--color-emergency)' },
    accent: { bg: 'var(--color-accent)', color: 'var(--color-primary)' }
  };

  const curr = styles[variant] || styles.primary;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{
        backgroundColor: curr.bg,
        color: curr.color,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        letterSpacing: '0.05em',
        gap: '0.35rem'
      }}
    >
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
};

export default Badge;
