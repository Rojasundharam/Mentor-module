'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Section, Container } from '@/components/ui/PageLayout';
import Tabs from '@/components/ui/Tabs';
import ApiManagementTab from './components/ApiManagementTab';
import GeneralSettingsTab from './components/GeneralSettingsTab';

export default function SettingsPage() {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent mb-4"></div>
          <p className="text-neutral-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'api-management',
      label: 'API Management',
      icon: '🔌',
      content: <ApiManagementTab />,
    },
    {
      id: 'general',
      label: 'General Settings',
      icon: '⚙️',
      content: <GeneralSettingsTab />,
    },
  ];

  return (
    <Section spacing="md" background="cream">
        <Container>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-brand-green mb-2">
              Settings
            </h1>
            <p className="text-neutral-600">
              Manage your application settings and API integrations
            </p>
          </div>

          <Tabs tabs={tabs} defaultTab="api-management" />
        </Container>
      </Section>
  );
}
