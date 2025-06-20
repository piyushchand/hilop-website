import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No authentication token found',
          error: 'unauthorized'
        },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    console.log('Fetching order detail for:', orderId);
    
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Authentication token is invalid or expired',
            error: 'token_expired'
          },
          { status: 401 }
        );
      }
      
      const errorText = await response.text();
      console.error('Order detail API error response:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to fetch order detail: ${response.status}`,
          error: 'order_detail_fetch_failed'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Order detail API response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Order detail fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to the server',
        error: 'connection_error'
      },
      { status: 500 }
    );
  }
} 