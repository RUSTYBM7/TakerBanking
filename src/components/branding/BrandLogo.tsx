/**
 * Orbitpay Finance - Centralized Brand Logo Component
 *
 * Single source of truth for all logo usage throughout the application.
 * Import and use this component instead of inline images for consistent branding.
 */

import React from 'react';

// Using the OrbitPay corporate banner image as the main logo
export const BRAND_LOGO_URL = '/assets/images/corporate-banner.jpg';

export interface BrandLogoProps {
  variant?: 'header' | 'nav' | 'hero' | 'footer' | 'auth' | 'card' | 'modal' | 'settings' | 'compact' | 'full';
  className?: string;
  onDark?: boolean;
  style?: React.CSSProperties;
}

const variantClasses = {
  header: 'h-10 md:h-12 lg:h-14 w-auto',
  nav: 'h-8 md:h-10 w-auto',
  hero: 'h-16 md:h-20 lg:h-24 w-auto',
  footer: 'h-8 md:h-10 w-auto opacity-90',
  auth: 'h-12 md:h-14 w-auto',
  card: 'h-8 w-auto',
  modal: 'h-10 w-auto',
  settings: 'h-10 w-auto',
  compact: 'h-8 w-auto',
  full: 'h-12 md:h-14 w-auto',
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  onDark = false,
  style,
}) => {
  return (
    <img
      src={BRAND_LOGO_URL}
      alt="Orbitpay Finance"
      className={`
        object-contain object-left
        ${variantClasses[variant]}
        ${onDark ? 'brightness-110 contrast-105' : ''}
        ${className}
      `}
      style={{
        maxWidth: '280px',
        ...style,
      }}
    />
  );
};

/**
 * Logo-only icon (for cards, receipts, etc.)
 */
export const BrandIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    aria-label="Orbitpay"
  >
    <rect x="4" y="4" width="40" height="40" rx="8" fill="#111d35" />
    <path
      d="M12 36L20 12h4l8 24h-4l-2-6h-8l-2 6h-4zm6-10h6l-3-9-3 9z"
      fill="#A8E6CF"
    />
    <path
      d="M14 16h4M14 24h4M14 32h4"
      stroke="#A8E6CF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Full logo with icon and text
 */
export const BrandMark: React.FC<{
  variant?: 'light' | 'dark';
  showIcon?: boolean;
  className?: string;
}> = ({ variant = 'dark', showIcon = true, className = '' }) => {
  const textColor = variant === 'dark' ? '#111d35' : '#ffffff';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <svg viewBox="0 0 48 48" className="h-8 w-auto">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#111d35" />
          <path
            d="M12 36L20 12h4l8 24h-4l-2-6h-8l-2 6h-4zm6-10h6l-3-9-3 9z"
            fill="#A8E6CF"
          />
        </svg>
      )}
      <div className="flex flex-col">
        <span
          className="text-lg font-bold tracking-tight leading-none"
          style={{ color: textColor }}
        >
          Orbitpay
        </span>
        <span
          className="text-xs font-medium tracking-wider uppercase leading-none"
          style={{ color: textColor, opacity: 0.7 }}
        >
          Finance
        </span>
      </div>
    </div>
  );
};

export default BrandLogo;
