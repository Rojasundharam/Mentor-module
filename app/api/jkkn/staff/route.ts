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

    // Call JKKN API - Try correct endpoint first (matching programs structure)
    const url = `${baseUrl}/api-management/organizations/staff?page=${page}&limit=${limit}`;

    console.log('[Staff API] Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Add cache control for better performance
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    console.log('[Staff API] Response status:', response.status);
    console.log('[Staff API] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      // Try to get error details - handle both JSON and non-JSON responses
      const contentType = response.headers.get('content-type');
      let errorData: any = {};
      let responseBody = '';

      try {
        responseBody = await response.text();
        console.log('[Staff API] Error response body:', responseBody);

        if (contentType?.includes('application/json')) {
          errorData = JSON.parse(responseBody);
        } else {
          errorData = { rawResponse: responseBody };
        }
      } catch (parseError) {
        console.error('[Staff API] Error parsing response:', parseError);
        errorData = { rawResponse: responseBody };
      }

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || `JKKN API Error: ${response.statusText}`,
          status: response.status,
          details: errorData,
          endpoint: url,
        },
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log('[Staff API] Raw response (first 500 chars):', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Staff API] Failed to parse JSON:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON response from JKKN API',
          details: { rawResponse: responseText.substring(0, 200) },
        },
        { status: 500 }
      );
    }

    // Debug: Log the actual API response to see field names
    console.log('=== STAFF API RESPONSE DEBUG ===');
    console.log('Response top-level keys:', Object.keys(data));
    console.log('Full response structure:', JSON.stringify(data, null, 2));

    if (data.data && data.data.length > 0) {
      console.log('First staff object keys:', Object.keys(data.data[0]));
      console.log('First staff object:', JSON.stringify(data.data[0], null, 2));

      // Log each field individually to see what's available
      const firstStaff = data.data[0];
      console.log('Staff field values:');
      Object.keys(firstStaff).forEach(key => {
        console.log(`  ${key}:`, firstStaff[key]);
      });
    }

    // Log metadata fields
    console.log('Metadata fields available:', {
      page: data.page,
      current_page: data.current_page,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      total_pages: data.total_pages,
      pages: data.pages,
      total: data.total,
      count: data.count,
      totalCount: data.totalCount,
    });
    console.log('=== END DEBUG ===');

    // Transform the data to match our interface
    const transformedStaff = data.data ? data.data.map(transformStaffData) : [];

    // Transform metadata to ensure consistent field names
    // Check multiple possible locations for metadata
    const metaSource = data.metadata || data.meta || data.pagination || data;

    // Extract total count from various possible sources
    const totalCount = metaSource.total ||
                       metaSource.count ||
                       metaSource.totalCount ||
                       metaSource.total_count ||
                       data.total ||
                       data.count ||
                       transformedStaff.length; // Use actual data length as fallback

    // Extract current page
    const currentPage = metaSource.page ||
                        metaSource.current_page ||
                        metaSource.currentPage ||
                        data.page ||
                        data.current_page ||
                        page;

    // Calculate total pages
    const totalPages = metaSource.totalPages ||
                       metaSource.total_pages ||
                       metaSource.pages ||
                       metaSource.last_page ||
                       data.totalPages ||
                       data.total_pages ||
                       Math.ceil(totalCount / limit);

    const metadata = {
      page: currentPage,
      totalPages: totalPages,
      total: totalCount,
    };

    console.log('Transformed staff data (first item):', JSON.stringify(transformedStaff[0], null, 2));
    console.log('Final Metadata:', JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      data: transformedStaff,
      metadata: metadata,
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
