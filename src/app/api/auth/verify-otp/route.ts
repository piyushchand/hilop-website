import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { otp, user_id, type } = body;

    if (!otp || !user_id || !type) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', error: 'validation_error' },
        { status: 400 }
      );
    }

    const endpoint = type === 'login' ? '/auth/verify-login' : '/auth/verify-otp';

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        otp,
        user_id,
        ...(type === 'login' ? { is_email_otp: false } : {})
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'OTP verification failed', error: data.error || null },
        { status: response.status }
      );
    }

    const responseData = {
      success: true,
      message: data.message,
      data: {
        token: data.token,
        user: data.user
      }
    };

      // ✅ Create empty response and THEN modify
      const res = new NextResponse(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // ✅ Now set cookies
      if (data.success && data.token) {
        res.cookies.set('accessToken', data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: COOKIE_MAX_AGE,
        });
  
        res.cookies.set('is_authenticated', 'true', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: COOKIE_MAX_AGE,
        });
  
        console.log('✅ Cookies set successfully for user:', data.user?.name || 'Unknown');
        console.log('🍪 Cookie details:', {
          accessToken: '***hidden***',
          is_authenticated: 'true',
          maxAge: COOKIE_MAX_AGE,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }
  
      return res;
    } catch (error) {
      console.error('OTP verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to the server', error: 'connection_error' },
        { status: 500 }
      );
    }
  }
  