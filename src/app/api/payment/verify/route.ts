import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found', error: 'unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Forward the verification payload to the correct backend endpoint
    const response = await fetch(`https://api.hilop.com/api/v1/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Payment verification failed', error: data.error || null },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to verify payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 