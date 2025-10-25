'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Section, Container, Hero } from '@/components/ui/PageLayout';
import Card from '@/components/ui/Card';
import SearchInput from '@/components/ui/SearchInput';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState, NoSearchResults } from '@/components/ui/EmptyState';
import type { Mentor } from '@/lib/types/mentor';

export default function MentorListingPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch mentors from JKKN API based on search query
  const searchMentors = async (query: string) => {
    if (!accessToken || !query.trim()) {
      setMentors([]);
      setHasSearched(false);
      return;
    }

    try {
      console.log('[MentorPage] Searching for mentors with query:', query);
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await fetch(`/api/mentor/list?search=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('[MentorPage] API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[MentorPage] API error response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to fetch mentors');
      }

      const data = await response.json();
      console.log('[MentorPage] Received mentors:', {
        count: data.mentors?.length,
        total: data.total,
      });

      setMentors(data.mentors || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search mentors';
      console.error('[MentorPage] Error searching mentors:', errorMessage);
      setError(errorMessage);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search - only search after user stops typing for 500ms
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMentors([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      searchMentors(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, accessToken]);

  const handleMentorClick = (mentorId: string) => {
    router.push(`/mentor/${mentorId}`);
  };

  return (
    <>
      <Hero
        title="Mentor Directory"
        subtitle="Connect with faculty mentors to manage student counseling, guidance, and academic progress"
        alignment="left"
        background="white"
        noPadding={true}
      />

      <Section spacing="md" background="cream" className="!pt-0">
        <Container className="!px-4 md:!px-6 lg:!px-8">
          {/* Search Bar and View Toggle */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <SearchInput
                placeholder="Search mentors by name, email, department..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:max-w-xl"
              />

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-brand-green p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-brand-yellow text-brand-green'
                      : 'text-neutral-600 hover:bg-brand-cream'
                  }`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center gap-2 ${
                    viewMode === 'table'
                      ? 'bg-brand-yellow text-brand-green'
                      : 'text-neutral-600 hover:bg-brand-cream'
                  }`}
                  aria-label="Table view"
                  aria-pressed={viewMode === 'table'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <ErrorState
              title="Failed to load mentors"
              message={error}
              onRetry={() => window.location.reload()}
            />
          )}

          {/* Initial State - No Search */}
          {!hasSearched && !loading && !error && (
            <Card variant="bordered" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center">
                  <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-green mb-3">
                  Search for Mentors
                </h3>
                <p className="text-neutral-600 mb-2">
                  Use the search bar above to find faculty mentors by name, email, department, or designation.
                </p>
                <p className="text-sm text-neutral-500">
                  Results will appear from the JKKN database as you type.
                </p>
              </div>
            </Card>
          )}

          {/* No Results After Search */}
          {hasSearched && !loading && !error && mentors.length === 0 && (
            <NoSearchResults
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          )}

          {/* Mentors Content */}
          {!loading && !error && mentors.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-neutral-600">
                  Found <span className="font-semibold text-brand-green">{mentors.length}</span> mentor{mentors.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                  <Card
                    key={mentor.id}
                    variant="bordered"
                    hoverable
                    className="cursor-pointer transition-all flex flex-col h-full group relative"
                    onClick={() => handleMentorClick(mentor.id)}
                  >
                    {/* Card Content */}
                    <div className="flex flex-col h-full">
                      {/* Avatar and Basic Info */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {mentor.avatar ? (
                            <img
                              src={mentor.avatar}
                              alt={mentor.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-brand-green ring-2 ring-brand-yellow ring-offset-2"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-brand-yellow text-brand-green flex items-center justify-center text-2xl font-bold border-2 border-brand-green shadow-sm">
                              {mentor.name ? mentor.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) : '?'}
                            </div>
                          )}
                        </div>

                        {/* Mentor Basic Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-brand-green mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
                            {mentor.name}
                          </h3>

                          <p className="text-sm text-neutral-600 mb-2 line-clamp-1 font-medium">
                            {mentor.designation}
                          </p>
                        </div>
                      </div>

                      {/* Department Badge */}
                      <div className="mb-4">
                        <Badge variant="success" size="sm" className="inline-flex">
                          {mentor.department}
                        </Badge>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2.5 text-sm text-neutral-700 mb-4">
                        <div className="flex items-center gap-2.5">
                          <svg
                            className="w-4 h-4 flex-shrink-0 text-brand-green"
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
                          <span className="truncate">{mentor.email}</span>
                        </div>

                        {mentor.phone && (
                          <div className="flex items-center gap-2.5">
                            <svg
                              className="w-4 h-4 flex-shrink-0 text-brand-green"
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
                            <span className="font-medium">{mentor.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Student Count and View Details - Footer */}
                      <div className="mt-auto pt-4 border-t border-neutral-200">
                        <div className="flex items-center justify-between">
                          {mentor.totalStudents !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                              <svg
                                className="w-5 h-5 flex-shrink-0 text-brand-green"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                              <span className="font-bold text-brand-green text-base">
                                {mentor.totalStudents}
                              </span>
                              <span className="text-neutral-600">
                                {mentor.totalStudents === 1 ? 'Student' : 'Students'}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center text-brand-green font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            View
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <DataTable
                  columns={[
                    {
                      key: 'name',
                      label: 'Name',
                      sortable: true,
                      render: (mentor) => (
                        <div className="flex items-center gap-3">
                          {mentor.avatar ? (
                            <img
                              src={mentor.avatar}
                              alt={mentor.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-brand-green"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-green flex items-center justify-center text-lg font-bold border-2 border-brand-green">
                              {mentor.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                          <span className="font-semibold text-brand-green">{mentor.name}</span>
                        </div>
                      ),
                    },
                    {
                      key: 'designation',
                      label: 'Designation',
                      sortable: true,
                    },
                    {
                      key: 'department',
                      label: 'Department',
                      sortable: true,
                      render: (mentor) => (
                        <Badge variant="success" size="sm">
                          {mentor.department}
                        </Badge>
                      ),
                    },
                    {
                      key: 'email',
                      label: 'Email',
                      hideOnMobile: true,
                      mobileLabel: 'Email',
                    },
                    {
                      key: 'totalStudents',
                      label: 'Students',
                      sortable: true,
                      render: (mentor) => (
                        <span className="font-semibold text-brand-green">
                          {mentor.totalStudents || 0}
                        </span>
                      ),
                    },
                  ]}
                  data={mentors}
                  keyExtractor={(mentor) => mentor.id}
                  onRowClick={(mentor) => handleMentorClick(mentor.id)}
                  hoverable
                />
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
