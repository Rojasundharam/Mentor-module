'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar_collapsed');
      return stored === 'true';
    }
    return false;
  });
  const pathname = usePathname();

  // Persist sidebar collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname?.startsWith('/mentor')) return 'Mentor Management';
    if (pathname?.startsWith('/staff')) return 'Staff';
    if (pathname?.startsWith('/institutions')) return 'Institutions';
    if (pathname?.startsWith('/departments')) return 'Departments';
    if (pathname?.startsWith('/programs')) return 'Programs';
    if (pathname?.startsWith('/degrees')) return 'Degrees';
    if (pathname?.startsWith('/courses')) return 'Courses';
    if (pathname?.startsWith('/students')) return 'Students';
    if (pathname?.startsWith('/reports')) return 'Reports';
    if (pathname?.startsWith('/settings')) return 'Settings';
    return 'JKKN Mentor';
  };

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        {/* Top Header Bar */}
        <header
          className={`bg-white border-b-2 border-brand-green fixed top-0 left-0 right-0 z-30 shadow-sm transition-all duration-300 ${
            sidebarCollapsed ? 'lg:left-20' : 'lg:left-80'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button - 44x44px touch target */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-brand-green hover:bg-brand-yellow p-2.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop Sidebar Toggle Button */}
              <button
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex text-brand-green hover:bg-brand-yellow p-2.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] items-center justify-center"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarCollapsed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  )}
                </svg>
              </button>
            </div>

            {/* Page Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-green truncate px-2 flex-1">
              {getPageTitle()}
            </h1>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Notifications - 44x44px touch target */}
              <button
                className="relative text-brand-green hover:bg-brand-yellow p-2.5 rounded-lg transition-colors hidden sm:flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Notifications"
                title="Notifications (Coming Soon)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification Badge */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Search - 44x44px touch target */}
              <button
                className="text-brand-green hover:bg-brand-yellow p-2.5 rounded-lg transition-colors hidden md:flex items-center justify-center min-w-[44px] min-h-[44px]"
                aria-label="Search"
                title="Search (Coming Soon)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile Actions Menu */}
              <button
                className="md:hidden text-brand-green hover:bg-brand-yellow p-2.5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="More options"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        {pathname !== '/dashboard' && (
          <div className="bg-white border-b border-neutral-200 px-4 py-3 lg:px-8 pt-20">
            <Breadcrumbs autoGenerate className="text-sm" />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${pathname === '/dashboard' ? 'pt-20' : ''}`}>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-neutral-200 py-4 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-neutral-600">
            <p>© 2025 JKKN Institutions. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Powered by
              <span className="font-semibold text-brand-green">MyJKKN Auth</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
