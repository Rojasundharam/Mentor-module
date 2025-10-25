import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/students/search?q=query
 * Search for students from JKKN API
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

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        students: [],
      });
    }

    // Get API key from environment (server-side only)
    const apiKey = process.env.NEXT_PUBLIC_MYJKKN_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_MYJKKN_BASE_URL || 'https://www.jkkn.ai/api';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'MyJKKN API key not configured',
          details: 'Please add NEXT_PUBLIC_MYJKKN_API_KEY to .env.local'
        },
        { status: 500 }
      );
    }

    console.log('[Student Search] Searching for students with query:', query);

    // Fetch students from JKKN API with large limit to get all students
    const url = `${baseUrl}/api-management/students?page=1&limit=1000`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Add cache control for better performance
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error('[Student Search] JKKN API Error:', response.status, response.statusText);
      return NextResponse.json(
        {
          error: 'Failed to fetch students from JKKN API',
          details: `${response.status} ${response.statusText}`
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const students = data.data || [];

    console.log('[Student Search] Fetched', students.length, 'students from JKKN API');

    // Filter students based on search query
    const filteredStudents = students.filter((student: any) => {
      // Construct full name from first_name and last_name
      const firstName = student.first_name || student.firstName || '';
      const lastName = student.last_name || student.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim().toLowerCase();

      // Get roll number with fallbacks
      const rollNumber = (student.roll_number || student.rollNumber || student.roll_no || '').toLowerCase();

      // Get email
      const email = (student.email || '').toLowerCase();

      // Get department name
      let departmentName = '';
      if (typeof student.department === 'object' && student.department !== null) {
        departmentName = (student.department.name || student.department.department_name || '').toLowerCase();
      } else if (typeof student.department === 'string') {
        departmentName = student.department.toLowerCase();
      } else if (student.department_name) {
        departmentName = student.department_name.toLowerCase();
      }

      // Search in name, roll number, email, or department
      return fullName.includes(query) ||
             rollNumber.includes(query) ||
             email.includes(query) ||
             departmentName.includes(query);
    });

    console.log('[Student Search] Found', filteredStudents.length, 'matching students');

    // Transform to expected format
    const transformedStudents = filteredStudents.map((student: any) => {
      // Extract department name
      let departmentName = 'Unknown Department';
      if (typeof student.department === 'object' && student.department !== null) {
        departmentName = student.department.name || student.department.department_name || 'Unknown Department';
      } else if (typeof student.department === 'string') {
        departmentName = student.department;
      } else if (student.department_name) {
        departmentName = student.department_name;
      }

      return {
        id: student.id || student.student_id,
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.email || 'Unknown',
        rollNumber: student.roll_number || student.rollNumber || student.roll_no || 'N/A',
        email: student.email || '',
        department: departmentName,
        year: student.year || student.current_year || student.academic_year || '',
      };
    });

    return NextResponse.json({
      success: true,
      students: transformedStudents,
    });
  } catch (error) {
    console.error('[Student Search] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to search students',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
