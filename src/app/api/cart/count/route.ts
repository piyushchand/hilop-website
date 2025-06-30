// app/api/cart/count/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'No authentication token found',
          error: 'unauthorized',
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/cart/count`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch cart count',
          error: 'api_error',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Server error while fetching cart count',
        error: 'server_error',
      },
      { status: 500 }
    );
  }
}
