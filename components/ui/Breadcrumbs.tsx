'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  autoGenerate?: boolean;
}

/**
 * Breadcrumbs Component
 *
 * Navigation component showing the current page's location in the site hierarchy.
 * Can auto-generate from URL or use custom items.
 *
 * @param items - Array of breadcrumb items
 * @param separator - Custom separator element (defaults to chevron)
 * @param className - Additional custom classes
 * @param autoGenerate - Auto-generate breadcrumbs from URL path
 *
 * @example
 * ```tsx
 * // Manual items
 * <Breadcrumbs items={[
 *   { label: 'Home', href: '/' },
 *   { label: 'Mentors', href: '/mentor' },
 *   { label: 'Details' }
 * ]} />
 *
 * // Auto-generate from URL
 * <Breadcrumbs autoGenerate />
 * ```
 */
export default function Breadcrumbs({
  items,
  separator,
  className = '',
  autoGenerate = false
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return [];

    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      )}
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;

      // Format label: capitalize and replace hyphens with spaces
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = autoGenerate ? generateBreadcrumbs() : (items || []);

  if (breadcrumbItems.length === 0) return null;

  const defaultSeparator = (
    <svg
      className="w-4 h-4 text-neutral-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2 flex-wrap">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Separator */}
              {index > 0 && (
                <span className="flex items-center" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}

              {/* Breadcrumb Item */}
              {isLast || !item.href ? (
                <span
                  className="flex items-center gap-1.5 text-brand-green font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="truncate max-w-[200px] sm:max-w-none">{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-brand-green transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 rounded px-1 -mx-1"
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="truncate max-w-[200px] sm:max-w-none">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * BreadcrumbSkeleton Component
 *
 * Loading skeleton for breadcrumbs
 */
export function BreadcrumbSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex items-center space-x-2 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <div className="w-4 h-4 bg-neutral-200 rounded" />
          )}
          <div className="h-4 bg-neutral-200 rounded" style={{ width: `${Math.random() * 50 + 50}px` }} />
        </div>
      ))}
    </div>
  );
}
