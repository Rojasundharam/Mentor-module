'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Show nothing while redirecting
  if (!loading && !user) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent mb-4"></div>
            <p className="text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      label: 'Total Mentors',
      value: '5',
      icon: '👥',
      color: 'bg-blue-100 text-blue-700',
      change: '+2 this month',
    },
    {
      label: 'Active Students',
      value: '8',
      icon: '📚',
      color: 'bg-green-100 text-brand-green',
      change: '+3 this week',
    },
    {
      label: 'Counseling Sessions',
      value: '1',
      icon: '💬',
      color: 'bg-yellow-100 text-yellow-700',
      change: '1 scheduled',
    },
    {
      label: 'Pending Feedback',
      value: '0',
      icon: '📝',
      color: 'bg-purple-100 text-purple-700',
      change: 'All clear',
    },
  ];

  const quickActions = [
    {
      title: 'Browse Mentors',
      description: 'View and manage mentor directory',
      icon: '👥',
      href: '/mentor',
      color: 'bg-brand-green',
    },
    {
      title: 'Assign Students',
      description: 'Assign students to mentors',
      icon: '➕',
      href: '/mentor',
      color: 'bg-brand-yellow text-brand-green',
    },
    {
      title: 'Create Session',
      description: 'Schedule a counseling session',
      icon: '💬',
      href: '/mentor',
      color: 'bg-blue-600',
    },
  ];

  const recentActivity = [
    {
      type: 'session',
      message: 'Counseling session created for Arun Kumar',
      time: '2 hours ago',
      icon: '💬',
    },
    {
      type: 'assignment',
      message: 'Divya Krishnan assigned to Dr. Rajesh Kumar',
      time: '5 hours ago',
      icon: '✅',
    },
    {
      type: 'feedback',
      message: 'Feedback submitted for Academic Progress Review',
      time: '1 day ago',
      icon: '📝',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-brand-green via-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 lg:p-10 text-brand-cream shadow-lg">
          <div className="max-w-3xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Welcome back, {user?.full_name}! 👋
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-90">
                  Manage your mentor-mentee relationships, track counseling sessions, and monitor student progress all in one place.
                </p>
              </div>
              {/* Decorative illustration */}
              <div className="hidden lg:block">
                <svg className="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="primary"
                onClick={() => router.push('/mentor')}
                iconLeft={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                className="sm:w-auto"
              >
                View Mentors
              </Button>
              <Button
                variant="outline"
                onClick={() => alert('Feature coming soon!')}
                className="bg-white bg-opacity-20 border-brand-cream text-brand-cream hover:bg-opacity-30 sm:w-auto"
              >
                View Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h3 className="text-xl font-bold text-brand-green mb-4 px-1">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                variant="default"
                className="hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-sm font-medium text-neutral-600 mb-2">{stat.label}</p>
                <p className="text-3xl lg:text-4xl font-bold text-brand-green mb-2">{stat.value}</p>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <svg className="w-3 h-3 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {stat.change}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-brand-green mb-4 px-1">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                variant="bordered"
                hoverable
                onClick={() => router.push(action.href)}
              >
                <div className={`w-14 h-14 rounded-xl ${action.color} ${action.color.includes('text') ? 'bg-brand-yellow' : 'text-white'} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {action.icon}
                </div>
                <h4 className="text-lg font-bold text-brand-green mb-2">
                  {action.title}
                </h4>
                <p className="text-sm text-neutral-600 mb-6">
                  {action.description}
                </p>
                <div className="flex items-center text-brand-green font-semibold text-sm group-hover:gap-2 transition-all">
                  Get started
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-brand-green mb-4 px-1">Recent Activity</h3>
            <Card variant="default" padding="none">
              <div className="divide-y divide-neutral-200">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 sm:p-5 hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-cream flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-neutral-700 mb-1 font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="p-8 text-center text-neutral-500">
                    <svg className="w-16 h-16 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Getting Started Card */}
          <div>
            <h3 className="text-xl font-bold text-brand-green mb-4 px-1">Getting Started</h3>
            <Card variant="cream" className="sticky top-4">
              <div className="space-y-5">
                {[
                  { icon: '🎯', step: 1, title: 'Browse Mentors', desc: 'Select a mentor from the directory' },
                  { icon: '👥', step: 2, title: 'Assign Students', desc: 'Connect students with their mentors' },
                  { icon: '💬', step: 3, title: 'Track Progress', desc: 'Create sessions and monitor development' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-brand-green mb-1 flex items-center gap-2">
                        <span className="text-xs bg-brand-yellow text-brand-green w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.step}</span>
                        {item.title}
                      </h4>
                      <p className="text-sm text-neutral-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-neutral-300">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push('/mentor')}
                    fullWidth
                    iconRight={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    }
                  >
                    Start Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
