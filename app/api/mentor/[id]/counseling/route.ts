import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import type { CounselingSession } from '@/lib/types/mentor';

/**
 * GET /api/mentor/[id]/counseling
 * Get all counseling sessions for a mentor from Supabase
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: mentorId } = await params;

    // Fetch sessions from Supabase with student details and feedback
    const { data: sessions, error } = await supabaseAdmin
      .from('counseling_sessions')
      .select(`
        *,
        student:students!student_id (
          id,
          name,
          roll_number,
          email
        ),
        feedback:session_feedback!session_id (
          id,
          counseling_queries,
          action_taken,
          submitted_by,
          submitted_at
        )
      `)
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Counseling API] Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch counseling sessions', details: error.message },
        { status: 500 }
      );
    }

    // Transform data to match frontend interface
    const transformedSessions: CounselingSession[] = (sessions || []).map((session: any) => ({
      id: session.id,
      mentorId: session.mentor_id,
      studentId: session.student_id,
      studentName: session.student?.name || 'Unknown Student',
      sessionName: session.session_name,
      date: session.date,
      time: session.time,
      notes: session.notes || undefined,
      attachment: session.attachment_url || undefined,
      status: session.status,
      feedback: session.feedback ? {
        counselingQueries: session.feedback.counseling_queries,
        actionTaken: session.feedback.action_taken,
        submittedAt: session.feedback.submitted_at,
        submittedBy: session.feedback.submitted_by || '',
      } : undefined,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    }));

    console.log(`[Counseling API] Found ${transformedSessions.length} sessions for mentor ${mentorId}`);

    return NextResponse.json({
      success: true,
      sessions: transformedSessions,
    });
  } catch (error) {
    console.error('[Counseling API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counseling sessions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mentor/[id]/counseling
 * Create a new counseling session in Supabase
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: mentorId } = await params;
    const body = await request.json();
    const { studentId, sessionName, date, time, notes, attachment } = body;

    // Validation
    if (!studentId || !sessionName || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, sessionName, date, time' },
        { status: 400 }
      );
    }

    // Get student details
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, name, roll_number')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('[Counseling API] Student not found:', studentError);
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Insert new session into Supabase
    const { data: newSession, error: insertError } = await supabaseAdmin
      .from('counseling_sessions')
      .insert({
        mentor_id: mentorId,
        student_id: studentId,
        session_name: sessionName,
        date: date,
        time: time,
        notes: notes || null,
        attachment_url: attachment || null,
        status: 'scheduled',
        created_by: mentorId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Counseling API] Error creating session:', insertError);
      return NextResponse.json(
        { error: 'Failed to create counseling session', details: insertError.message },
        { status: 500 }
      );
    }

    // Transform to frontend interface
    const transformedSession: CounselingSession = {
      id: newSession.id,
      mentorId: newSession.mentor_id,
      studentId: newSession.student_id,
      studentName: student.name,
      sessionName: newSession.session_name,
      date: newSession.date,
      time: newSession.time,
      notes: newSession.notes || undefined,
      attachment: newSession.attachment_url || undefined,
      status: newSession.status,
      createdAt: newSession.created_at,
      updatedAt: newSession.updated_at,
    };

    console.log(`[Counseling API] Created session ${newSession.id} for mentor ${mentorId}`);

    return NextResponse.json({
      success: true,
      session: transformedSession,
      message: 'Counseling session created successfully',
    });
  } catch (error) {
    console.error('[Counseling API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create counseling session' },
      { status: 500 }
    );
  }
}
