import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Code required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens with MyJKKN Auth Server
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          api_key: process.env.API_KEY,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    // Log complete JKKN authentication response to see all available user fields
    console.log('========================================');
    console.log('JKKN Authentication - Full Response:');
    console.log('========================================');
    console.log(JSON.stringify(data, null, 2));
    console.log('========================================');
    console.log('User Data Fields:');
    console.log('========================================');
    if (data.user) {
      console.log('User Object:', JSON.stringify(data.user, null, 2));
      console.log('Available Fields:', Object.keys(data.user));
    }
    console.log('========================================');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Token exchange failed' },
      { status: 500 }
    );
  }
}
