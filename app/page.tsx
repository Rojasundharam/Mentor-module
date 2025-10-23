'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Root Page - Smart Redirect
 *
 * This page handles automatic routing based on authentication status:
 * - Unauthenticated users → /login (beautiful login page)
 * - Authenticated users → /dashboard (main app)
 */
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Authenticated user - go to dashboard
        router.push('/dashboard');
      } else {
        // Unauthenticated user - go to login page
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state during redirect
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-cream via-brand-cream to-brand-yellow">
      <div className="text-center animate-fadeIn">
        {/* Animated spinner */}
        <div className="w-20 h-20 mx-auto border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-4"></div>

        {/* Loading text */}
        <p className="text-brand-green font-semibold text-lg">
          Loading JKKN Mentor...
        </p>

        {/* Subtitle */}
        <p className="text-neutral-600 text-sm mt-2">
          Redirecting you to the right place
        </p>
      </div>
    </div>
  );
}
