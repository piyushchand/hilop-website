import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function DELETE(
  req: NextRequest,
  context: { params: { product_id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found', error: 'unauthorized' },
        { status: 401 }
      );
    }
    const { product_id } = context.params;
    const backendRes = await fetch(`${API_URL}/cart/${product_id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
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