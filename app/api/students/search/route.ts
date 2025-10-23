import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/students/search?q=query
 * Search for students from JKKN API
 *
 * TODO: Replace mock data with actual JKKN API call
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    // TODO: Replace with actual JKKN API call
    const mockStudents = [
      {
        id: 'S001',
        name: 'Arun Kumar',
        email: 'arun.kumar@student.jkkn.ac.in',
        rollNumber: '21CS101',
        department: 'Computer Science',
        year: '3rd Year',
      },
      {
        id: 'S002',
        name: 'Priya Raj',
        email: 'priya.raj@student.jkkn.ac.in',
        rollNumber: '21CS102',
        department: 'Computer Science',
        year: '3rd Year',
      },
      {
        id: 'S003',
        name: 'Karthik Raman',
        email: 'karthik.raman@student.jkkn.ac.in',
        rollNumber: '21IT101',
        department: 'Information Technology',
        year: '3rd Year',
      },
      {
        id: 'S004',
        name: 'Divya Krishnan',
        email: 'divya.krishnan@student.jkkn.ac.in',
        rollNumber: '21CS103',
        department: 'Computer Science',
        year: '3rd Year',
      },
      {
        id: 'S005',
        name: 'Rahul Menon',
        email: 'rahul.menon@student.jkkn.ac.in',
        rollNumber: '22CS101',
        department: 'Computer Science',
        year: '2nd Year',
      },
      {
        id: 'S006',
        name: 'Sneha Iyer',
        email: 'sneha.iyer@student.jkkn.ac.in',
        rollNumber: '22CS102',
        department: 'Computer Science',
        year: '2nd Year',
      },
      {
        id: 'S007',
        name: 'Vikram Singh',
        email: 'vikram.singh@student.jkkn.ac.in',
        rollNumber: '21EC101',
        department: 'Electronics & Communication',
        year: '3rd Year',
      },
      {
        id: 'S008',
        name: 'Anjali Nair',
        email: 'anjali.nair@student.jkkn.ac.in',
        rollNumber: '21CS104',
        department: 'Computer Science',
        year: '3rd Year',
      },
    ];

    // Filter students based on search query
    const filteredStudents = mockStudents.filter((student) =>
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query)
    );

    return NextResponse.json({
      success: true,
      students: filteredStudents,
    });
  } catch (error) {
    console.error('Error searching students:', error);
    return NextResponse.json(
      { error: 'Failed to search students' },
      { status: 500 }
    );
  }
}
