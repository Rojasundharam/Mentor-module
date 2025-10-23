import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for mentor-student assignments (same as parent route)
const mentorStudents: Record<string, string[]> = {
  'M001': ['S001', 'S002', 'S004'],
  'M002': ['S003', 'S005'],
  'M003': ['S007'],
};

/**
 * DELETE /api/mentor/[id]/students/[studentId]
 * Remove a student from a mentor
 *
 * TODO: Replace with actual JKKN API/database call
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; studentId: string } }
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

    const { id: mentorId, studentId } = params;

    if (!mentorStudents[mentorId]) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    // Remove student from mentor's list
    mentorStudents[mentorId] = mentorStudents[mentorId].filter(
      id => id !== studentId
    );

    return NextResponse.json({
      success: true,
      message: 'Student removed successfully',
    });
  } catch (error) {
    console.error('Error removing student:', error);
    return NextResponse.json(
      { error: 'Failed to remove student' },
      { status: 500 }
    );
  }
}
