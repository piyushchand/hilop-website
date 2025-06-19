import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.110.216.61/api/v1';

export async function GET() {
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

    console.log('Fetching orders from external API');
    
    const response = await fetch(`${API_URL}/orders`, {
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
      console.error('Orders API error response:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to fetch orders: ${response.status}`,
          error: 'orders_fetch_failed'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Orders API response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Orders fetch error:', error);
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