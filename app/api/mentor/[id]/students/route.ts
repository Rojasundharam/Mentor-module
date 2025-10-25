import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for mentor-student assignments (replace with database)
const mentorStudents: Record<string, string[]> = {
  'M001': ['S001', 'S002', 'S004'],
  'M002': ['S003', 'S005'],
  'M003': ['S007'],
};

const allStudents: Record<string, any> = {
  'S001': {
    id: 'S001',
    name: 'Arun Kumar',
    email: 'arun.kumar@student.jkkn.ac.in',
    rollNumber: '21CS101',
    department: 'Computer Science',
    year: '3rd Year',
  },
  'S002': {
    id: 'S002',
    name: 'Priya Raj',
    email: 'priya.raj@student.jkkn.ac.in',
    rollNumber: '21CS102',
    department: 'Computer Science',
    year: '3rd Year',
  },
  'S003': {
    id: 'S003',
    name: 'Karthik Raman',
    email: 'karthik.raman@student.jkkn.ac.in',
    rollNumber: '21IT101',
    department: 'Information Technology',
    year: '3rd Year',
  },
  'S004': {
    id: 'S004',
    name: 'Divya Krishnan',
    email: 'divya.krishnan@student.jkkn.ac.in',
    rollNumber: '21CS103',
    department: 'Computer Science',
    year: '3rd Year',
  },
  'S005': {
    id: 'S005',
    name: 'Rahul Menon',
    email: 'rahul.menon@student.jkkn.ac.in',
    rollNumber: '22CS101',
    department: 'Computer Science',
    year: '2nd Year',
  },
  'S007': {
    id: 'S007',
    name: 'Vikram Singh',
    email: 'vikram.singh@student.jkkn.ac.in',
    rollNumber: '21EC101',
    department: 'Electronics & Communication',
    year: '3rd Year',
  },
};

/**
 * GET /api/mentor/[id]/students
 * Get all students assigned to a mentor
 *
 * TODO: Replace with actual JKKN API/database call
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
    const studentIds = mentorStudents[mentorId] || [];
    const students = studentIds.map(id => allStudents[id]).filter(Boolean);

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mentor/[id]/students
 * Assign a student to a mentor
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
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Initialize mentor's student list if doesn't exist
    if (!mentorStudents[mentorId]) {
      mentorStudents[mentorId] = [];
    }

    // Check if student is already assigned
    if (mentorStudents[mentorId].includes(studentId)) {
      return NextResponse.json(
        { error: 'Student already assigned to this mentor' },
        { status: 400 }
      );
    }

    // Assign student to mentor
    mentorStudents[mentorId].push(studentId);

    return NextResponse.json({
      success: true,
      message: 'Student assigned successfully',
    });
  } catch (error) {
    console.error('Error assigning student:', error);
    return NextResponse.json(
      { error: 'Failed to assign student' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mentor/[id]/students/[studentId]
 * Remove a student from a mentor
 */
export async function DELETE(
  request: NextRequest,
  context: any
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

    // Extract mentorId and studentId from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const mentorId = pathParts[3]; // /api/mentor/[id]/students/[studentId]
    const studentId = pathParts[5];

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
