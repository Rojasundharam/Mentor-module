import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mentor/list
 * Fetch all mentors from JKKN API
 *
 * TODO: Replace mock data with actual JKKN API call
 * Example: const response = await fetch('https://api.jkkn.ai/staff?role=mentor', {
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 */
export async function GET(request: NextRequest) {
  try {
    // Get authorization token from header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Replace with actual JKKN API call
    // For now, returning mock data
    const mockMentors = [
      {
        id: 'M001',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@jkkn.ac.in',
        department: 'Computer Science',
        designation: 'Professor',
        phone: '+91 98765 43210',
        totalStudents: 25,
      },
      {
        id: 'M002',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@jkkn.ac.in',
        department: 'Information Technology',
        designation: 'Associate Professor',
        phone: '+91 98765 43211',
        totalStudents: 20,
      },
      {
        id: 'M003',
        name: 'Prof. Amit Patel',
        email: 'amit.patel@jkkn.ac.in',
        department: 'Electronics & Communication',
        designation: 'Assistant Professor',
        phone: '+91 98765 43212',
        totalStudents: 18,
      },
      {
        id: 'M004',
        name: 'Dr. Lakshmi Iyer',
        email: 'lakshmi.iyer@jkkn.ac.in',
        department: 'Mechanical Engineering',
        designation: 'Professor',
        phone: '+91 98765 43213',
        totalStudents: 22,
      },
      {
        id: 'M005',
        name: 'Prof. Suresh Reddy',
        email: 'suresh.reddy@jkkn.ac.in',
        department: 'Civil Engineering',
        designation: 'Associate Professor',
        phone: '+91 98765 43214',
        totalStudents: 15,
      },
    ];

    return NextResponse.json({
      success: true,
      mentors: mockMentors,
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
}
