'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import {
  fetchInstitutions,
  checkApiStatus,
  formatDate,
  type Institution,
  type ApiError,
} from '@/lib/api/jkkn-api';

export default function InstitutionsPage() {
  // API status
  const [isConfigured, setIsConfigured] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Checking API...');

  // Institutions data
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');

  // Check API status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  // Fetch institutions when API is configured
  useEffect(() => {
    if (isConfigured) {
      loadInstitutions(1);
    }
  }, [isConfigured]);

  // Filter institutions based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = institutions.filter((inst) =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.counselling_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInstitutions(filtered);
    } else {
      setFilteredInstitutions(institutions);
    }
  }, [searchQuery, institutions]);

  /**
   * Check API configuration status
   */
  const checkStatus = async () => {
    try {
      const status = await checkApiStatus();
      setIsConfigured(status.configured);
      setStatusMessage(status.message);
    } catch (err: any) {
      setIsConfigured(false);
      setStatusMessage('Failed to check API status');
    }
  };

  /**
   * Load institutions data
   */
  const loadInstitutions = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchInstitutions(page, 10);

      setInstitutions(response.data);
      setFilteredInstitutions(response.data);
      setCurrentPage(response.metadata.page);
      setTotalPages(response.metadata.totalPages);
      setTotal(response.metadata.total);
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch institutions data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadInstitutions(page);
    setSearchQuery(''); // Clear search when changing pages
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-green mb-2">
              JKKN Institutions
            </h1>
            <p className="text-neutral-600">
              Browse and manage institutions from MyJKKN database
            </p>
          </div>
          {isConfigured && (
            <Badge variant="success" size="lg">
              ✓ API Connected
            </Badge>
          )}
        </div>

        {/* API Not Configured Warning */}
        {!isConfigured && (
          <Card variant="bordered">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-lg font-semibold text-yellow-800 mb-1">API Not Configured</p>
                <p className="text-sm text-yellow-700">
                  {statusMessage}. Please add NEXT_PUBLIC_MYJKKN_API_KEY to your .env.local file to view institutions data.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        {isConfigured && (
          <Card variant="default">
            {/* Search and Actions Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, code, or category..."
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadInstitutions(currentPage)}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
              <span className="font-medium text-brand-green">
                {searchQuery ? filteredInstitutions.length : total}
              </span>
              {searchQuery ? 'matching' : 'total'} institutions
              {!searchQuery && (
                <>
                  <span>•</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent mb-4"></div>
                <p className="text-neutral-600 font-medium">Loading institutions...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Error loading data</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Table */}
            {!loading && !error && filteredInstitutions.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brand-cream border-b-2 border-brand-green">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brand-green">
                          Institution Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brand-green">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brand-green">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brand-green">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brand-green">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-brand-green">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredInstitutions.map((institution) => (
                        <tr
                          key={institution.id}
                          className="hover:bg-brand-cream hover:bg-opacity-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <p className="font-medium text-brand-green">
                              {institution.name}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-700 font-mono">
                            {institution.counselling_code}
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-700">
                            {institution.category}
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-700">
                            {institution.institution_type}
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant={institution.is_active ? 'success' : 'default'}
                              size="sm"
                            >
                              {institution.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-600">
                            {formatDate(institution.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {!searchQuery && totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
                    <p className="text-sm text-neutral-600">
                      Showing {institutions.length} of {total} results
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              className={`
                                px-3 py-1 text-sm rounded transition-colors
                                ${currentPage === pageNum
                                  ? 'bg-brand-yellow text-brand-green font-semibold'
                                  : 'text-neutral-700 hover:bg-brand-cream'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                              `}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && !error && filteredInstitutions.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-brand-green mb-2">
                  {searchQuery ? 'No matching institutions' : 'No institutions found'}
                </h3>
                <p className="text-neutral-600">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'No data available from the API'}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
