'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";

export default function Home() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-cream via-brand-cream to-brand-yellow">
        <div className="text-center animate-fadeIn">
          <div className="w-20 h-20 mx-auto border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-brand-green font-semibold text-lg">Loading JKKN Mentor...</p>
        </div>
      </div>
    );
  }

  // Show login page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-brand-cream to-brand-yellow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-yellow opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-green opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-slideUp">
        {/* Logo/Icon */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-green to-primary-700 rounded-full mb-4 shadow-lg animate-scaleIn">
            <span className="text-5xl">🎓</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-green mb-2">
            JKKN Mentor
          </h1>
          <p className="text-neutral-600 text-lg">
            Mentor-Mentee Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-brand-green p-6 sm:p-8 animate-slideUp">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-green mb-2">
            Welcome Back
          </h2>
          <p className="text-neutral-600 mb-6">
            Sign in with your MyJKKN account to continue
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-8">
            {[
              { icon: '👥', text: 'Manage mentor-student relationships' },
              { icon: '💬', text: 'Track counseling sessions' },
              { icon: '📊', text: 'Monitor student progress' }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-sm group hover:bg-brand-cream p-2 rounded-lg transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-brand-cream group-hover:bg-brand-yellow flex items-center justify-center flex-shrink-0 transition-colors">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <span className="text-neutral-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={login}
            fullWidth
            iconLeft={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            }
          >
            Login with MyJKKN
          </Button>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secured by MyJKKN OAuth 2.0
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2 animate-fadeIn">
          <p className="text-sm text-neutral-600">
            © 2025 JKKN College of Engineering
          </p>
          <p className="text-xs text-neutral-500">
            Built with modern web technologies
          </p>
        </div>
      </div>
    </div>
  );
}
