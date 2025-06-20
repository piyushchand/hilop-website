import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.INTERNAL_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

// GET all addresses
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

    const response = await fetch(`${API_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
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
      console.error('Backend error response:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to fetch addresses: ${response.status}`,
          error: 'addresses_fetch_failed'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || data
    });
  } catch (error) {
    console.error('Addresses fetch error:', error);
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

// POST new address
export async function POST(request: Request) {
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

    const body = await request.json();

    const response = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to create address',
          error: data.error || null
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data
    });
  } catch (error) {
    console.error('Address creation error:', error);
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