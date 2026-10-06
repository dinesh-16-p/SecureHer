import React from 'react';
import Badge from './Badge';

/**
 * Reusable SectionHeading component
 */
const SectionHeading = ({
  badgeText,
  badgeIcon,
  badgeVariant = 'secondary',
  title,
  subtitle,
  center = true,
  className = ''
}) => {
  return (
    <div
      style={{
        textAlign: center ? 'center' : 'left',
        marginBottom: '3rem',
        maxWidth: center ? '720px' : '100%',
        margin: center ? '0 auto 3.5rem auto' : '0 0 3.5rem 0'
      }}
      className={className}
    >
      {badgeText && (
        <div style={{ marginBottom: '0.75rem' }}>
          <Badge variant={badgeVariant} icon={badgeIcon}>
            {badgeText}
          </Badge>
        </div>
      )}
      
      <h2
        style={{
          fontSize: '2.25rem',
          fontWeight: '800',
          color: 'var(--color-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}
      >
        {title}
      </h2>
      
      {subtitle && (
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-muted)',
            lineHeight: '1.6'
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
