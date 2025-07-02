import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found', error: 'unauthorized' },
        { status: 401 }
      );
    }

    // ✅ Extract product_id from the URL
    const product_id = req.nextUrl.pathname.split('/').pop();

    if (!product_id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is missing', error: 'bad_request' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${API_URL}/cart/${product_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove product from cart',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found', error: 'unauthorized' },
        { status: 401 }
      );
    }

    // Extract product_id from the URL
    const product_id = req.nextUrl.pathname.split('/').pop();
    if (!product_id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is missing', error: 'bad_request' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const backendRes = await fetch(`${API_URL}/cart/${product_id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product in cart',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
