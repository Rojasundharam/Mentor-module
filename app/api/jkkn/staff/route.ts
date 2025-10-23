import { NextRequest, NextResponse } from 'next/server';

/**
 * Transform MyJKKN API staff response to match our interface
 */
function transformStaffData(apiStaff: any) {
  return {
    id: apiStaff.id || apiStaff.staff_id,
    first_name: apiStaff.first_name || apiStaff.firstName || '',
    last_name: apiStaff.last_name || apiStaff.lastName || '',
    gender: apiStaff.gender || 'Not Specified',
    email: apiStaff.email || apiStaff.personal_email || '',
    phone: apiStaff.phone || apiStaff.phone_number || apiStaff.mobile || '',
    institution_email: apiStaff.institution_email || apiStaff.institutionEmail || apiStaff.email || '',
    designation: apiStaff.designation || apiStaff.position || 'Staff',
    // Handle nested department object
    department: apiStaff.department
      ? (typeof apiStaff.department === 'object'
          ? {
              id: apiStaff.department.id || apiStaff.department.department_id,
              department_name: apiStaff.department.department_name || apiStaff.department.name || 'Unknown Department'
            }
          : apiStaff.department)
      : (apiStaff.department_id || apiStaff.department_name
          ? { id: apiStaff.department_id || '', department_name: apiStaff.department_name || 'Unknown Department' }
          : 'Unknown Department'),
    // Handle nested institution object
    institution: apiStaff.institution
      ? (typeof apiStaff.institution === 'object'
          ? {
              id: apiStaff.institution.id || apiStaff.institution.institution_id,
              institution_name: apiStaff.institution.institution_name || apiStaff.institution.name || 'Unknown Institution'
            }
          : apiStaff.institution)
      : (apiStaff.institution_id || apiStaff.institution_name
          ? { id: apiStaff.institution_id || '', institution_name: apiStaff.institution_name || 'Unknown Institution' }
          : 'Unknown Institution'),
    created_at: apiStaff.created_at || apiStaff.createdAt || new Date().toISOString(),
    updated_at: apiStaff.updated_at || apiStaff.updatedAt || new Date().toISOString(),
  };
}

/**
 * GET /api/jkkn/staff
 * Fetch staff from JKKN API (server-side with secure API key)
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    // Get API key from environment (server-side only)
    const apiKey = process.env.NEXT_PUBLIC_MYJKKN_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_MYJKKN_BASE_URL || 'https://www.jkkn.ai/api';

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'MyJKKN API key not configured. Please add NEXT_PUBLIC_MYJKKN_API_KEY to .env.local'
        },
        { status: 500 }
      );
    }

    // Get pagination params from query
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Call JKKN API
    const url = `${baseUrl}/api-management/staff?page=${page}&limit=${limit}`;

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
      const errorData = await response.json().catch(() => ({}));

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || `JKKN API Error: ${response.statusText}`,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Debug: Log the actual API response to see field names
    console.log('Staff API Response:', JSON.stringify(data, null, 2));
    if (data.data && data.data.length > 0) {
      console.log('First staff object:', JSON.stringify(data.data[0], null, 2));
    }

    // Transform the data to match our interface
    const transformedData = {
      ...data,
      data: data.data ? data.data.map(transformStaffData) : []
    };

    console.log('Transformed staff data:', JSON.stringify(transformedData.data[0], null, 2));

    return NextResponse.json({
      success: true,
      ...transformedData,
    });

  } catch (error: any) {
    console.error('Error fetching staff:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch staff',
      },
      { status: 500 }
    );
  }
}
