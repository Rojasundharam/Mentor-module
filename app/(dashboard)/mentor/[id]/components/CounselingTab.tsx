'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { TextArea } from '@/components/ui/Input';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import type { CounselingSession, Student } from '@/lib/types/mentor';

interface CounselingTabProps {
  mentorId: string;
}

export default function CounselingTab({ mentorId }: CounselingTabProps) {
  const { accessToken, user } = useAuth();

  const [sessions, setSessions] = useState<CounselingSession[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Session Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    sessionName: '',
    date: '',
    time: '',
    notes: '',
    attachment: ''
  });

  // View Session Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    counselingQueries: '',
    actionTaken: ''
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Fetch sessions and students
  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sessions
        const sessionsRes = await fetch(`/api/mentor/${mentorId}/counseling`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        // Fetch assigned students
        const studentsRes = await fetch(`/api/mentor/${mentorId}/students`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (sessionsRes.ok) {
          const data = await sessionsRes.json();
          setSessions(data.sessions || []);
        }

        if (studentsRes.ok) {
          const data = await studentsRes.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, mentorId]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Create new session
  const handleCreateSession = async () => {
    if (!accessToken || !formData.studentId || !formData.sessionName || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch(`/api/mentor/${mentorId}/counseling`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSessions([data.session, ...sessions]);
        setShowCreateModal(false);
        // Reset form
        setFormData({
          studentId: '',
          sessionName: '',
          date: '',
          time: '',
          notes: '',
          attachment: ''
        });
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setCreating(false);
    }
  };

  // View session details
  const handleViewSession = (session: CounselingSession) => {
    setSelectedSession(session);
    setShowViewModal(true);
    // Pre-fill feedback if exists
    if (session.feedback) {
      setFeedbackData({
        counselingQueries: session.feedback.counselingQueries,
        actionTaken: session.feedback.actionTaken
      });
    } else {
      setFeedbackData({
        counselingQueries: '',
        actionTaken: ''
      });
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!accessToken || !selectedSession || !feedbackData.counselingQueries || !feedbackData.actionTaken) {
      alert('Please fill in all feedback fields');
      return;
    }

    try {
      setSubmittingFeedback(true);
      const response = await fetch(
        `/api/mentor/${mentorId}/counseling/${selectedSession.id}/feedback`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update session in list
        setSessions(sessions.map(s =>
          s.id === selectedSession.id ? data.session : s
        ));
        setSelectedSession(data.session);
        alert('Feedback submitted successfully');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-green border-t-transparent"></div>
        <p className="mt-2 text-neutral-600">Loading counseling sessions...</p>
      </div>
    );
  }

  const selectedStudent = students.find(s => s.id === formData.studentId);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-brand-green">
          Counseling Sessions ({sessions.length})
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          disabled={students.length === 0}
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
          Create Session
        </Button>
      </div>

      {/* No Students Warning */}
      {students.length === 0 && (
        <Card variant="cream" className="mb-6">
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-brand-green font-medium mb-2">No Students Assigned</p>
            <p className="text-neutral-600">
              Please assign students first before creating counseling sessions.
            </p>
          </div>
        </Card>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card variant="cream">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-brand-green mb-2">
              No counseling sessions yet
            </h3>
            <p className="text-neutral-600">
              Create your first counseling session with a student
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} variant="default" className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">💬</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-brand-green mb-1">
                        {session.sessionName}
                      </h3>
                      <p className="text-neutral-600 mb-2">
                        Student: <span className="font-medium text-brand-green">{session.studentName}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant={
                            session.status === 'completed' ? 'success' :
                            session.status === 'scheduled' ? 'info' : 'default'
                          }
                          size="sm"
                        >
                          {session.status.toUpperCase()}
                        </Badge>
                        {session.feedback && (
                          <Badge variant="success" size="sm">
                            ✓ Feedback Submitted
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-brand-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(session.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-brand-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {session.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewSession(session)}
                  className="self-start lg:self-center"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Session Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Counseling Session"
        size="lg"
      >
        <div className="space-y-4">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">
              Select Student <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-colors bg-white"
              required
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.rollNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Session Name */}
          <Input
            label="Session Name"
            placeholder="e.g., Academic Progress Review, Career Guidance"
            value={formData.sessionName}
            onChange={(e) => handleInputChange('sessionName', e.target.value)}
            required
          />

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
            <Input
              type="time"
              label="Time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <TextArea
            label="Notes / Remarks"
            placeholder="Add any notes, agenda items, or discussion topics for this session..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
          />

          {/* Attachment */}
          <Input
            label="Attachment (URL)"
            placeholder="https://example.com/document.pdf"
            value={formData.attachment}
            onChange={(e) => handleInputChange('attachment', e.target.value)}
            helperText="Optional: Add a link to any supporting documents or materials"
          />

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSession}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Session'}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* View Session Modal with Feedback Form */}
      {selectedSession && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Session Details & Feedback"
          size="xl"
        >
          <div className="space-y-6">
            {/* Session Information */}
            <Card variant="cream">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">💬</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-brand-green mb-2">
                    {selectedSession.sessionName}
                  </h3>
                  <Badge
                    variant={
                      selectedSession.status === 'completed' ? 'success' :
                      selectedSession.status === 'scheduled' ? 'info' : 'default'
                    }
                  >
                    {selectedSession.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-brand-green mb-1">Student</p>
                  <p className="text-neutral-700">{selectedSession.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-green mb-1">Date</p>
                  <p className="text-neutral-700">
                    {new Date(selectedSession.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-green mb-1">Time</p>
                  <p className="text-neutral-700">{selectedSession.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-green mb-1">Created</p>
                  <p className="text-neutral-700">
                    {new Date(selectedSession.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedSession.notes && (
                <div className="mb-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm font-medium text-brand-green mb-2">Notes</p>
                  <p className="text-neutral-700 whitespace-pre-wrap">{selectedSession.notes}</p>
                </div>
              )}

              {selectedSession.attachment && (
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm font-medium text-brand-green mb-2">Attachment</p>
                  <a
                    href={selectedSession.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:text-primary-700 hover:underline flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    View Attachment
                  </a>
                </div>
              )}
            </Card>

            {/* Feedback Form */}
            <div>
              <h3 className="text-xl font-bold text-brand-green mb-4 flex items-center gap-2">
                <span>📝</span>
                Session Feedback
              </h3>

              {selectedSession.feedback ? (
                <Card variant="bordered">
                  <div className="space-y-4">
                    <div className="bg-brand-cream p-4 rounded-lg">
                      <p className="text-sm font-semibold text-brand-green mb-2">
                        Counseling Queries
                      </p>
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {selectedSession.feedback.counselingQueries}
                      </p>
                    </div>
                    <div className="bg-brand-cream p-4 rounded-lg">
                      <p className="text-sm font-semibold text-brand-green mb-2">
                        Action Taken
                      </p>
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {selectedSession.feedback.actionTaken}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-200 text-sm text-neutral-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submitted on {new Date(selectedSession.feedback.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card variant="default">
                  <div className="space-y-4">
                    <p className="text-neutral-600 mb-4">
                      Please provide feedback for this counseling session:
                    </p>

                    <TextArea
                      label="Counseling Queries"
                      placeholder="What queries, concerns, or issues were discussed during the session?"
                      value={feedbackData.counselingQueries}
                      onChange={(e) => setFeedbackData(prev => ({
                        ...prev,
                        counselingQueries: e.target.value
                      }))}
                      rows={4}
                      required
                    />

                    <TextArea
                      label="Action Taken"
                      placeholder="What actions, recommendations, or solutions were provided?"
                      value={feedbackData.actionTaken}
                      onChange={(e) => setFeedbackData(prev => ({
                        ...prev,
                        actionTaken: e.target.value
                      }))}
                      rows={4}
                      required
                    />

                    <Button
                      variant="primary"
                      onClick={handleSubmitFeedback}
                      disabled={submittingFeedback || !feedbackData.counselingQueries || !feedbackData.actionTaken}
                      className="w-full"
                    >
                      {submittingFeedback ? 'Submitting Feedback...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
