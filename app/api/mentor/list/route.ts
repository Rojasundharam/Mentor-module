import { NextRequest, NextResponse } from 'next/server';
import { fetchStaff, type StaffMember } from '@/lib/api/jkkn-api';

/**
 * GET /api/mentor/list
 * Fetch mentors from JKKN API
 * Filters staff members by designation (faculty, professors, etc.)
 *
 * Query params:
 * - search: string (optional) - Search query for filtering
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

    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('search') || '';

    // Designations that qualify as mentors (faculty members)
    const mentorDesignations = [
      'professor',
      'associate professor',
      'assistant professor',
      'lecturer',
      'senior lecturer',
      'hod',
      'head of department',
      'dean',
      'principal',
      'faculty',
      'teaching faculty',
      'associate dean',
      'assistant dean',
    ];

    // Helper function to check if designation qualifies as mentor
    const isMentorDesignation = (designation: string): boolean => {
      const lowerDesignation = designation.toLowerCase().trim();
      return mentorDesignations.some(md => lowerDesignation.includes(md));
    };

    // Helper function to extract department name from staff member
    const getDepartmentName = (department: any): string => {
      if (typeof department === 'string') return department;
      return department?.department_name || department?.name || 'N/A';
    };

    // Fetch staff from JKKN API - optimized to fetch 1 page for speed
    let allMentors: any[] = [];
    const pageLimit = 100; // Get 100 per page (sufficient for most searches)

    try {
      console.log(`Fetching staff from JKKN API for search: "${searchQuery}"`);
      const response = await fetchStaff(1, pageLimit);

      if (!response.data || response.data.length === 0) {
        console.log('No staff data returned from API');
        return NextResponse.json({
          success: true,
          mentors: [],
          total: 0,
          message: 'No staff members found in the database',
        });
      }

      console.log(`Received ${response.data.length} staff members from API`);

      // Filter staff members who are mentors
      allMentors = response.data.filter((staff: StaffMember) =>
        staff.designation && isMentorDesignation(staff.designation)
      );

      console.log(`Filtered to ${allMentors.length} faculty mentors`);
    } catch (err) {
      console.error('Error fetching staff from JKKN API:', err);
      return NextResponse.json(
        {
          error: 'Failed to fetch staff from JKKN API',
          details: err instanceof Error ? err.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Transform staff data to mentor format
    let mentors = allMentors.map((staff: StaffMember) => ({
      id: staff.id,
      name: `${staff.first_name} ${staff.last_name}`.trim(),
      email: staff.email || staff.institution_email,
      department: getDepartmentName(staff.department),
      designation: staff.designation,
      phone: staff.phone || '',
      avatar: null,
      totalStudents: 0, // TODO: Get from database if available
    }));

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const beforeFilter = mentors.length;

      mentors = mentors.filter((mentor: any) =>
        mentor.name.toLowerCase().includes(query) ||
        mentor.email.toLowerCase().includes(query) ||
        mentor.department.toLowerCase().includes(query) ||
        mentor.designation.toLowerCase().includes(query)
      );

      console.log(`Search filtered: ${beforeFilter} → ${mentors.length} mentors matching "${searchQuery}"`);
    }

    console.log(`✅ Returning ${mentors.length} mentors from JKKN API`);

    return NextResponse.json({
      success: true,
      mentors: mentors,
      total: mentors.length,
      searched: searchQuery.trim() !== '',
      searchQuery: searchQuery,
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
}
