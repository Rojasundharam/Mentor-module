import { NextRequest, NextResponse } from 'next/server';

/**
 * Transform MyJKKN API program response to match our interface
 */
function transformProgramData(apiProgram: any) {
  return {
    id: apiProgram.id || apiProgram.program_id,
    name: apiProgram.name || apiProgram.program_name || apiProgram.programName || apiProgram.title || 'Unnamed Program',
    code: apiProgram.code || apiProgram.program_code || apiProgram.programCode || apiProgram.short_name || 'N/A',
    department_id: apiProgram.department_id || apiProgram.departmentId || '',
    degree_id: apiProgram.degree_id || apiProgram.degreeId || '',
    is_active: apiProgram.is_active ?? apiProgram.isActive ?? apiProgram.active ?? true,
    created_at: apiProgram.created_at || apiProgram.createdAt || new Date().toISOString(),
    updated_at: apiProgram.updated_at || apiProgram.updatedAt || new Date().toISOString(),
  };
}

/**
 * GET /api/jkkn/programs
 * Fetch programs from JKKN API (server-side with secure API key)
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
    const url = `${baseUrl}/api-management/organizations/programs?page=${page}&limit=${limit}`;

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
    console.log('Programs API Response:', JSON.stringify(data, null, 2));
    if (data.data && data.data.length > 0) {
      console.log('First program object:', JSON.stringify(data.data[0], null, 2));
    }

    // Transform the data to match our interface
    const transformedData = {
      ...data,
      data: data.data ? data.data.map(transformProgramData) : []
    };

    console.log('Transformed program data:', JSON.stringify(transformedData.data[0], null, 2));

    return NextResponse.json({
      success: true,
      ...transformedData,
    });

  } catch (error: any) {
    console.error('Error fetching programs:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch programs',
      },
      { status: 500 }
    );
  }
}
