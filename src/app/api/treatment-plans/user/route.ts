import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the token from the request cookies or headers
    const authHeader = req.headers.get('authorization') || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      // Try to get from cookies (if SSR)
      const cookie = req.cookies.get('accessToken');
      if (cookie) token = cookie.value;
    }
    if (!token) {
      return NextResponse.json({ success: false, message: 'No auth token' }, { status: 401 });
    }
    const apiRes = await fetch('https://api.hilop.com/api/v1/treatment-plans/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error: unknown) {
    let message = 'Failed to fetch plans';
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
