import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Enhanced Button Component
 *
 * A versatile button component following the modern design system.
 * Features: loading states, icons, full-width option, multiple variants
 *
 * @param variant - Button style variant (primary, secondary, outline, ghost, danger)
 * @param size - Button size (sm, md, lg)
 * @param children - Button content
 * @param onClick - Click handler function
 * @param disabled - Disabled state
 * @param loading - Loading state with spinner
 * @param type - HTML button type
 * @param fullWidth - Full width button
 * @param iconLeft - Icon to display on the left
 * @param iconRight - Icon to display on the right
 * @param className - Additional custom classes
 * @param ariaLabel - Accessibility label
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '',
  ariaLabel
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-colors-smooth
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${fullWidth ? 'w-full' : ''}
  `.trim().replace(/\s+/g, ' ');

  const variants = {
    primary: 'bg-brand-yellow text-brand-green hover:bg-accent-400 focus:ring-brand-yellow active:bg-accent-500 shadow-sm hover:shadow-md',
    secondary: 'bg-brand-green text-brand-cream hover:bg-primary-700 focus:ring-brand-green active:bg-primary-800 shadow-sm hover:shadow-md',
    outline: 'border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-cream focus:ring-brand-green bg-transparent',
    ghost: 'text-brand-green hover:bg-brand-cream focus:ring-brand-green bg-transparent',
    danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 active:bg-error-700 shadow-sm hover:shadow-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3.5 text-lg min-h-[52px]'
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="flex-shrink-0" aria-hidden="true">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="flex-shrink-0" aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
