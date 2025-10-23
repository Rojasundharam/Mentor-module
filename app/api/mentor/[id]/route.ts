import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mentor/[id]
 * Fetch specific mentor details from JKKN API
 *
 * TODO: Replace mock data with actual JKKN API call
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

    // TODO: Replace with actual JKKN API call
    const mockMentors: any = {
      'M001': {
        id: 'M001',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@jkkn.ac.in',
        department: 'Computer Science',
        designation: 'Professor',
        phone: '+91 98765 43210',
        totalStudents: 25,
      },
      'M002': {
        id: 'M002',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@jkkn.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor',
        phone: '+91 98765 43211',
        totalStudents: 20,
      },
      'M003': {
        id: 'M003',
        name: 'Prof. Amit Patel',
        email: 'amit.patel@jkkn.ac.in',
        department: 'Electronics & Communication',
        designation: 'Assistant Professor',
        phone: '+91 98765 43212',
        totalStudents: 18,
      },
    };

    const mentor = mockMentors[mentorId];

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mentor,
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentor details' },
      { status: 500 }
    );
  }
}
