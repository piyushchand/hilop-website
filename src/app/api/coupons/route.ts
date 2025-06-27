import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Handle POST for 'apply' and 'validate'
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!API_URL) throw new Error('API URL is not set in environment variables');
    
    const body = await req.json();
    const { action, ...rest } = body;

    let endpoint;
    switch (action) {
      case 'validate':
        endpoint = '/coupons/validate';
        break;
      case 'apply':
        endpoint = '/coupons/apply';
        break;
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(rest),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Coupon API error',
      },
      { status: 500 }
    );
  }
}

// Handle DELETE for 'remove'
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!API_URL) throw new Error('API URL is not set in environment variables');

    const res = await fetch(`${API_URL}/coupons/remove`, {
      method: 'DELETE',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Coupon API error',
      },
      { status: 500 }
    );
  }
} 