'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Section, Container } from '@/components/ui/PageLayout';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Mentor } from '@/lib/types/mentor';
import StudentsTab from './components/StudentsTab';
import CounselingTab from './components/CounselingTab';
import AttendanceTab from './components/AttendanceTab';
import ExamResultsTab from './components/ExamResultsTab';

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();

  const mentorId = params.id as string;
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch mentor details
  useEffect(() => {
    if (!accessToken || !mentorId) return;

    const fetchMentor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mentor/${mentorId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch mentor details');
        }

        const data = await response.json();
        setMentor(data.mentor);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mentor');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [accessToken, mentorId]);

  if (loading) {
    return (
      <Section background="cream">
        <Container>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">Loading mentor details...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !mentor) {
    return (
      <Section background="cream">
        <Container>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error || 'Mentor not found'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/mentor')}
              className="mt-4"
            >
              Back to Mentors
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const tabs = [
    {
      id: 'students',
      label: 'Students',
      icon: '👥',
      badge: mentor.totalStudents,
      content: <StudentsTab mentorId={mentorId} />
    },
    {
      id: 'counseling',
      label: 'Counseling',
      icon: '💬',
      content: <CounselingTab mentorId={mentorId} />
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: '📅',
      content: <AttendanceTab mentorId={mentorId} />
    },
    {
      id: 'exam-results',
      label: 'Exam Results',
      icon: '📊',
      content: <ExamResultsTab mentorId={mentorId} />
    }
  ];

  return (
    <Section spacing="md" background="cream">
        <Container>
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/mentor')}
            className="mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Mentors
          </Button>

          {/* Mentor Profile Card */}
          <Card variant="bordered" className="mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {mentor.avatar ? (
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-brand-green"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-brand-yellow text-brand-green flex items-center justify-center text-4xl font-bold border-4 border-brand-green">
                    {mentor.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Mentor Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-brand-green mb-2">
                      {mentor.name}
                    </h1>
                    <p className="text-lg text-neutral-600 mb-3">
                      {mentor.designation}
                    </p>
                    <Badge variant="info">
                      {mentor.department}
                    </Badge>
                  </div>

                  {mentor.totalStudents !== undefined && (
                    <div className="text-center bg-brand-cream border-2 border-brand-green rounded-lg px-6 py-3">
                      <div className="text-3xl font-bold text-brand-green">
                        {mentor.totalStudents}
                      </div>
                      <div className="text-sm text-neutral-600">
                        Total Students
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-600">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-brand-green flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{mentor.email}</span>
                  </div>

                  {mentor.phone && (
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-brand-green flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{mentor.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs tabs={tabs} defaultTab="students" />
        </Container>
      </Section>
  );
}
