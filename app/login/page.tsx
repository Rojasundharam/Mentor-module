'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already logged in
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-cream">
        <div className="text-center">
          {/* Animated spinner with brand colors */}
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-green border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-lg font-semibold text-brand-green">
            Loading Mentor Module...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-brand-cream">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-200 rounded-full opacity-30 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary-200 rounded-full opacity-20 blur-3xl"></div>

        {/* Floating education icons background */}
        <div className="absolute top-20 left-[10%] text-primary-300 opacity-20">
          <svg className="w-16 h-16 animate-float-slow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
        </div>
        <div className="absolute top-32 right-[15%] text-accent-400 opacity-25">
          <svg className="w-12 h-12 animate-float" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.89l7-3.11V12z"/>
          </svg>
        </div>
        <div className="absolute bottom-24 left-[20%] text-primary-300 opacity-15">
          <svg className="w-20 h-20 animate-float-delayed" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `linear-gradient(var(--color-brand-green) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-brand-green) 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }}>
      </div>

      {/* Main login card */}
      <div className="relative w-full max-w-md mx-4 animate-fadeIn">
        {/* Card container with shadow */}
        <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-brand-green p-8 sm:p-12">
          {/* Accent top border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-yellow px-8 py-2 rounded-full shadow-lg">
            <p className="text-sm font-bold text-brand-green tracking-wider">EDUCATION PORTAL</p>
          </div>

          <div className="relative z-10 mt-4">
            {/* Logo/Icon area */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full bg-brand-yellow animate-ping opacity-20"></div>

                {/* Icon container - Graduation cap for education */}
                <div className="relative bg-brand-green p-5 rounded-2xl shadow-xl">
                  <svg
                    className="w-14 h-14 text-brand-cream"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Title section */}
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-brand-green">
                Mentor Module
              </h1>
              <p className="text-gray-700 text-lg font-medium mb-2">
                Welcome to Learning
              </p>
              <p className="text-gray-600 text-sm">
                Sign in with your MyJKKN account to access your courses
              </p>
            </div>

            {/* Login button */}
            <button
              onClick={login}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-yellow hover:bg-accent-400 text-brand-green font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] overflow-hidden border-2 border-brand-green"
              aria-label="Sign in with MyJKKN account"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {/* Key Icon */}
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>

              <span className="relative z-10">Sign in with MyJKKN</span>

              {/* Arrow icon */}
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Educational Features */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="text-center group cursor-default">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200 border border-primary-300">
                  <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-semibold">Interactive Learning</p>
              </div>

              <div className="text-center group cursor-default">
                <div className="w-12 h-12 mx-auto mb-3 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-200 border border-accent-400">
                  <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-semibold">Expert Mentors</p>
              </div>

              <div className="text-center group cursor-default">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200 border border-primary-300">
                  <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-700 font-semibold">Certified Courses</p>
              </div>
            </div>

            {/* Footer text */}
            <p className="mt-8 text-center text-xs text-gray-600">
              By signing in, you agree to our{' '}
              <a href="#" className="text-brand-green hover:text-primary-700 underline font-medium transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-green hover:text-primary-700 underline font-medium transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Powered by badge */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
            <span>Powered by</span>
            <span className="font-bold text-brand-green">
              MyJKKN
            </span>
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(8deg);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
