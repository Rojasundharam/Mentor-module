import { NextRequest, NextResponse } from 'next/server';

/**
 * Transform MyJKKN API degree response to match our interface
 */
function transformDegreeData(apiDegree: any) {
  return {
    id: apiDegree.id,
    // Map actual API field names to our interface
    name: apiDegree.degree_name || apiDegree.name || undefined,
    abbreviation: apiDegree.degree_id || apiDegree.abbreviation || undefined,
    level: apiDegree.degree_type || apiDegree.level || undefined,
    is_active: apiDegree.is_active ?? true,
    created_at: apiDegree.created_at || new Date().toISOString(),
    updated_at: apiDegree.updated_at || new Date().toISOString(),
  };
}

/**
 * GET /api/jkkn/degrees/[id]
 * Fetch single degree from JKKN API (server-side with secure API key)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const degreeId = params.id;

    // Call JKKN API
    const url = `${baseUrl}/api-management/organizations/degrees/${degreeId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Add cache control
      next: { revalidate: 60 },
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

    // Transform the degree data to match our interface
    const transformedData = transformDegreeData(data);

    return NextResponse.json({
      success: true,
      data: transformedData,
    });

  } catch (error: any) {
    console.error('Error fetching degree:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch degree',
      },
      { status: 500 }
    );
  }
}
