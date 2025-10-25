import { NextRequest, NextResponse } from 'next/server';

/**
 * Transform MyJKKN API program response to match our interface
 */
function transformProgramData(apiProgram: any) {
  // Try multiple field variations for code
  let code = apiProgram.code ||
             apiProgram.program_code ||
             apiProgram.programCode ||
             apiProgram.short_name ||
             apiProgram.shortName ||
             apiProgram.abbreviation ||
             apiProgram.program_abbreviation ||
             '';

  // If still empty, try to extract from program_id if it looks like a code
  if (!code && apiProgram.program_id && typeof apiProgram.program_id === 'string') {
    // Check if program_id looks like a code (e.g., "BED-10", "CSE-01")
    const match = apiProgram.program_id.match(/^([A-Z]{2,5}-?\d+)/);
    if (match) {
      code = match[1];
    }
  }

  // If still empty, try to extract from id
  if (!code && apiProgram.id && typeof apiProgram.id === 'string') {
    const match = apiProgram.id.match(/^([A-Z]{2,5}-?\d+)/);
    if (match) {
      code = match[1];
    }
  }

  // Last resort: use first 8 chars of ID or "N/A"
  if (!code) {
    const fallbackId = apiProgram.program_id || apiProgram.id;
    code = fallbackId ? String(fallbackId).substring(0, 8).toUpperCase() : 'N/A';
  }

  return {
    id: apiProgram.id || apiProgram.program_id,
    name: apiProgram.name || apiProgram.program_name || apiProgram.programName || apiProgram.title || 'Unnamed Program',
    code: code,
    department_id: apiProgram.department_id || apiProgram.departmentId || apiProgram.department?.id || '',
    degree_id: apiProgram.degree_id || apiProgram.degreeId || apiProgram.degree?.id || '',
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
    console.log('=== PROGRAMS API RESPONSE DEBUG ===');
    console.log('Response top-level keys:', Object.keys(data));
    console.log('Full response structure:', JSON.stringify(data, null, 2));

    if (data.data && data.data.length > 0) {
      console.log('First program object keys:', Object.keys(data.data[0]));
      console.log('First program object:', JSON.stringify(data.data[0], null, 2));

      // Log each field individually to see what's available
      const firstProgram = data.data[0];
      console.log('Field values:');
      Object.keys(firstProgram).forEach(key => {
        console.log(`  ${key}:`, firstProgram[key]);
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
    const transformedPrograms = data.data ? data.data.map(transformProgramData) : [];

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
                       transformedPrograms.length; // Use actual data length as fallback

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

    console.log('Transformed program data (first item):', JSON.stringify(transformedPrograms[0], null, 2));
    console.log('Final Metadata:', JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      data: transformedPrograms,
      metadata: metadata,
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
