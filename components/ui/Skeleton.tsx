import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton Component
 *
 * Loading placeholder that mimics the shape of the content being loaded.
 * Provides a better UX than spinners for content-heavy layouts.
 *
 * @param variant - Shape of the skeleton (text, circular, rectangular, rounded)
 * @param width - Width of the skeleton (CSS value or number for pixels)
 * @param height - Height of the skeleton (CSS value or number for pixels)
 * @param className - Additional custom classes
 * @param animation - Animation type (pulse, wave, none)
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="80%" />
 * <Skeleton variant="circular" width={48} height={48} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 * ```
 */
export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animation = 'pulse'
}: SkeletonProps) {
  const baseStyles = 'bg-neutral-200';

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
    none: ''
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

/**
 * SkeletonCard Component
 *
 * Pre-built skeleton for card layouts (matches mentor card structure)
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-brand-cream rounded-xl border-2 border-brand-green p-6 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <Skeleton variant="circular" width={64} height={64} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="50%" height={16} />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-4">
          <Skeleton variant="rounded" width={120} height={24} />
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2.5">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width="80%" height={14} />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width="60%" height={14} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={60} height={16} />
            </div>
            <Skeleton variant="text" width={50} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SkeletonTable Component
 *
 * Pre-built skeleton for table layouts
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = ''
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-neutral-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={20} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3 border-b border-neutral-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonList Component
 *
 * Pre-built skeleton for list layouts
 */
export function SkeletonList({
  items = 5,
  showAvatar = true,
  className = ''
}: {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonText Component
 *
 * Pre-built skeleton for paragraphs of text
 */
export function SkeletonText({
  lines = 3,
  className = ''
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        return (
          <Skeleton
            key={index}
            variant="text"
            width={isLast ? '75%' : '100%'}
          />
        );
      })}
    </div>
  );
}
