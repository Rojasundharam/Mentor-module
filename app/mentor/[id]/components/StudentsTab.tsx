'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import type { Student } from '@/lib/types/mentor';

interface StudentsTabProps {
  mentorId: string;
}

export default function StudentsTab({ mentorId }: StudentsTabProps) {
  const { accessToken } = useAuth();

  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Student Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [assigning, setAssigning] = useState(false);

  // Fetch assigned students
  useEffect(() => {
    if (!accessToken) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mentor/${mentorId}/students`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAssignedStudents(data.students || []);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [accessToken, mentorId]);

  // Search for students
  const handleSearch = async () => {
    if (!searchQuery.trim() || !accessToken) return;

    try {
      setSearching(true);
      const response = await fetch(
        `/api/students/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out already assigned students
        const assignedIds = assignedStudents.map(s => s.id);
        const available = (data.students || []).filter(
          (s: Student) => !assignedIds.includes(s.id)
        );
        setSearchResults(available);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  // Assign student to mentor
  const handleAssignStudent = async () => {
    if (!selectedStudent || !accessToken) return;

    try {
      setAssigning(true);
      const response = await fetch(`/api/mentor/${mentorId}/students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: selectedStudent.id }),
      });

      if (response.ok) {
        // Add to assigned students list
        setAssignedStudents([...assignedStudents, selectedStudent]);
        // Close modal and reset
        setShowAddModal(false);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error('Failed to assign student:', error);
    } finally {
      setAssigning(false);
    }
  };

  // Remove student from mentor
  const handleRemoveStudent = async (studentId: string) => {
    if (!accessToken) return;

    const confirmed = window.confirm('Are you sure you want to remove this student?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/mentor/${mentorId}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setAssignedStudents(assignedStudents.filter(s => s.id !== studentId));
      }
    } catch (error) {
      console.error('Failed to remove student:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-green border-t-transparent"></div>
        <p className="mt-2 text-neutral-600">Loading students...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-green">
          Assigned Students ({assignedStudents.length})
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Student
        </Button>
      </div>

      {/* Students List */}
      {assignedStudents.length === 0 ? (
        <Card variant="cream">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">👨‍🎓</div>
            <h3 className="text-xl font-semibold text-brand-green mb-2">
              No students assigned yet
            </h3>
            <p className="text-neutral-600 mb-4">
              Click "Add Student" to assign students to this mentor
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedStudents.map((student) => (
            <Card key={student.id} variant="default">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-yellow text-brand-green flex items-center justify-center text-lg font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-brand-green mb-1 truncate">
                    {student.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-2">
                    {student.rollNumber}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="info" size="sm">
                      {student.year}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {student.department}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Remove Button */}
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveStudent(student.id)}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSearchQuery('');
          setSearchResults([]);
          setSelectedStudent(null);
        }}
        title="Add Student"
        size="lg"
      >
        <div className="space-y-4">
          {/* Search Input */}
          <SearchInput
            placeholder="Search by name, roll number, or email..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            loading={searching}
          />

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((student) => (
                <Card
                  key={student.id}
                  variant={selectedStudent?.id === student.id ? 'bordered' : 'default'}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-green flex items-center justify-center font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-brand-green">
                        {student.name}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {student.rollNumber} • {student.year} • {student.department}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {selectedStudent?.id === student.id && (
                      <svg
                        className="w-6 h-6 text-brand-green"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : searchQuery && !searching ? (
            <div className="text-center py-8 text-neutral-600">
              No students found. Try a different search term.
            </div>
          ) : null}

          {/* Action Buttons */}
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setSearchQuery('');
                setSearchResults([]);
                setSelectedStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignStudent}
              disabled={!selectedStudent || assigning}
            >
              {assigning ? 'Assigning...' : 'Assign Student'}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
