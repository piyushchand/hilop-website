import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Always use the live API endpoint
const LIVE_API_URL = 'https://api.hilop.com/api/v1/call-bookings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication token not found.' },
        { status: 401 }
      );
    }
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
    // Always send to the live API
    const response = await fetch(LIVE_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error forwarding booking:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 