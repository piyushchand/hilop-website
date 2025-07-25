import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API URL is not set in environment variables');
}

export async function POST(req: NextRequest) {
  try {
    // Get accessToken from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      console.warn("No token found in cookies.");
      return NextResponse.json(
        {
          success: false,
          message: 'No authentication token found',
          error: 'unauthorized',
        },
        { status: 401 }
      );
    }

    // Read the incoming request body
    const body = await req.json();
    console.log("Received checkout request with body:", body);

    // Expected structure:
    // {
    //   "shipping_address_id": "some_id",
    //   "payment_method": "cod",
    //   "notes": "optional"
    // }

    // Make the backend call to your main API
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Response from backend /orders:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to create order',
          error: data.error || null,
        },
        { status: response.status }
      );
    }

    // Successfully placed order
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process checkout',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
