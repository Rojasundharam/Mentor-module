import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth/token-validation';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No token provided' },
        { status: 401 }
      );
    }

    const validation = await validateToken(token);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid token', message: validation.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: validation.user,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Server error', message: 'Token validation failed' },
      { status: 500 }
    );
  }
}
