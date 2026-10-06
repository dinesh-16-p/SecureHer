import React from 'react';

/**
 * Reusable Card component for SecureHer
 */
const Card = ({
  children,
  className = '',
  hoverEffect = true,
  bordered = true,
  padding = 'lg',
  onClick,
  style = {}
}) => {
  const paddings = {
    none: '0',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-card)',
    borderRadius: 'var(--radius-lg)',
    padding: paddings[padding] || paddings.lg,
    border: bordered ? '1px solid rgba(246, 221, 229, 0.7)' : 'none',
    boxShadow: 'var(--shadow-md)',
    transition: hoverEffect ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  return (
    <div
      className={`secureher-card ${hoverEffect ? 'hoverable' : ''} ${className}`}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
