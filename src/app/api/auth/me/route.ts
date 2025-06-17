import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not authenticated',
          error: 'no_token'
        },
        { status: 401 }
      );
    }

    // Verify token with backend
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear invalid token
      const nextResponse = NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Invalid session',
          error: data.error || 'invalid_token'
        },
        { status: response.status }
      );
      nextResponse.cookies.delete('auth_token');
      return nextResponse;
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      token: token.value
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify session',
        error: 'server_error'
      },
      { status: 500 }
    );
  }
} 