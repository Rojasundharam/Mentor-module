import { NextRequest, NextResponse } from 'next/server';
import type { CounselingSession } from '@/lib/types/mentor';

// In-memory storage for counseling sessions (replace with database)
const counselingSessions: Record<string, CounselingSession[]> = {
  'M001': [
    {
      id: 'CS001',
      mentorId: 'M001',
      studentId: 'S001',
      studentName: 'Arun Kumar',
      sessionName: 'Academic Progress Review - Semester 5',
      date: '2025-01-15',
      time: '10:00 AM',
      notes: 'Discuss semester 5 performance and career planning',
      status: 'completed',
      createdAt: '2025-01-10T10:00:00Z',
      feedback: {
        counselingQueries: 'Student inquired about internship opportunities and career paths in AI/ML. Also discussed concerns about project work and time management.',
        actionTaken: 'Provided guidance on internship portals and recommended online courses. Scheduled follow-up session for project mentoring.',
        submittedAt: '2025-01-15T11:30:00Z',
        submittedBy: 'M001',
      },
    },
  ],
};

const allStudents: Record<string, string> = {
  'S001': 'Arun Kumar',
  'S002': 'Priya Raj',
  'S003': 'Karthik Raman',
  'S004': 'Divya Krishnan',
  'S005': 'Rahul Menon',
  'S007': 'Vikram Singh',
};

/**
 * GET /api/mentor/[id]/counseling
 * Get all counseling sessions for a mentor
 *
 * TODO: Replace with actual JKKN API/database call
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mentorId = params.id;
    const sessions = counselingSessions[mentorId] || [];

    // Sort by date (most recent first)
    const sortedSessions = [...sessions].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      sessions: sortedSessions,
    });
  } catch (error) {
    console.error('Error fetching counseling sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counseling sessions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mentor/[id]/counseling
 * Create a new counseling session
 *
 * TODO: Replace with actual JKKN API/database call
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mentorId = params.id;
    const body = await request.json();
    const { studentId, sessionName, date, time, notes, attachment } = body;

    // Validation
    if (!studentId || !sessionName || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new session
    const newSession: CounselingSession = {
      id: `CS${Date.now()}`,
      mentorId,
      studentId,
      studentName: allStudents[studentId] || 'Unknown Student',
      sessionName,
      date,
      time,
      notes: notes || undefined,
      attachment: attachment || undefined,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    // Initialize mentor's sessions if doesn't exist
    if (!counselingSessions[mentorId]) {
      counselingSessions[mentorId] = [];
    }

    // Add session
    counselingSessions[mentorId].push(newSession);

    return NextResponse.json({
      success: true,
      session: newSession,
      message: 'Counseling session created successfully',
    });
  } catch (error) {
    console.error('Error creating counseling session:', error);
    return NextResponse.json(
      { error: 'Failed to create counseling session' },
      { status: 500 }
    );
  }
}
