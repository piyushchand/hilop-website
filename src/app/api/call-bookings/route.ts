import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    console.log('Access Token:', '/call-bookings', accessToken?.value);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken.value}`;
    }

    // Forward the booking request to the external API
    const response = await fetch(`${API_URL}/call-bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    console.log('Response Status:', body);

    const data = await response.json();
    console.log('Response Data:', response);
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