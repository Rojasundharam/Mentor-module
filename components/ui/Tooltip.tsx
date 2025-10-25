'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Tooltip Component
 *
 * Provides contextual help text on hover/focus
 *
 * @param content - Tooltip text or content to display
 * @param children - Element to attach tooltip to
 * @param position - Tooltip position relative to element (default: top)
 * @param delay - Delay before showing tooltip in ms (default: 200)
 * @param className - Additional CSS classes
 * @param disabled - Disable tooltip
 */
export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-900'
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium text-white
            bg-neutral-900 rounded-lg shadow-lg
            whitespace-nowrap max-w-xs
            pointer-events-none
            animate-fadeIn
            ${positionClasses[position]}
            ${className}
          `}
          style={{
            // Prevent tooltip from going off-screen
            maxWidth: position === 'left' || position === 'right' ? '200px' : '300px'
          }}
        >
          {/* Tooltip Content */}
          <div className="relative z-10">
            {content}
          </div>

          {/* Tooltip Arrow */}
          <div
            className={`
              absolute w-0 h-0
              border-4
              ${arrowClasses[position]}
            `}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Simple Tooltip Wrapper for Icon Buttons
 * Convenience component for common use case
 */
export function TooltipIconButton({
  tooltip,
  children,
  onClick,
  className = '',
  ariaLabel
}: {
  tooltip: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        className={`
          text-brand-green hover:text-neutral-600 p-2.5
          bg-transparent border-0
          transition-colors min-w-[44px] min-h-[44px]
          flex items-center justify-center
          ${className}
        `}
        aria-label={ariaLabel}
        type="button"
      >
        {children}
      </button>
    </Tooltip>
  );
}
