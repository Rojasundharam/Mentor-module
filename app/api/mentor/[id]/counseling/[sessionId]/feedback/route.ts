import { NextRequest, NextResponse } from 'next/server';
import type { CounselingSession } from '@/lib/types/mentor';

// In-memory storage (same reference as parent route)
const counselingSessions: Record<string, CounselingSession[]> = {
  'M001': [],
};

/**
 * POST /api/mentor/[id]/counseling/[sessionId]/feedback
 * Submit feedback for a counseling session
 *
 * TODO: Replace with actual JKKN API/database call
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; sessionId: string } }
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

    const { id: mentorId, sessionId } = params;
    const body = await request.json();
    const { counselingQueries, actionTaken } = body;

    // Validation
    if (!counselingQueries || !actionTaken) {
      return NextResponse.json(
        { error: 'Missing required feedback fields' },
        { status: 400 }
      );
    }

    // Find the session
    if (!counselingSessions[mentorId]) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    const sessionIndex = counselingSessions[mentorId].findIndex(
      s => s.id === sessionId
    );

    if (sessionIndex === -1) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update session with feedback
    counselingSessions[mentorId][sessionIndex].feedback = {
      counselingQueries,
      actionTaken,
      submittedAt: new Date().toISOString(),
      submittedBy: mentorId,
    };

    // Update status to completed
    counselingSessions[mentorId][sessionIndex].status = 'completed';
    counselingSessions[mentorId][sessionIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      session: counselingSessions[mentorId][sessionIndex],
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
