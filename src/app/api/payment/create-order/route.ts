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
        { 
          success: false, 
          message: 'No authentication token found',
          error: 'unauthorized'
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Payment create-order request body:', body);

    // Defensive: Check for required fields
    if (!body.shipping_address_id) {
      console.error('Missing shipping_address_id in payment request');
      return NextResponse.json(
        { success: false, message: 'Shipping address ID is required.' },
        { status: 400 }
      );
    }
    if (typeof body.total_amount !== 'number' || isNaN(body.total_amount)) {
      console.error('Missing or invalid total_amount in payment request');
      return NextResponse.json(
        { success: false, message: 'Total amount is required and must be a number.' },
        { status: 400 }
      );
    }

    console.log('Address ID received:', body.shipping_address_id);
    console.log('Total amount:', body.total_amount);

    // Call the backend payment API
    const response = await fetch(`${API_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({
        address_id: body.shipping_address_id,
        total_amount: body.total_amount
      }),
    });

    const data = await response.json();
    console.log('Backend payment API response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to create payment order',
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
    console.error('Payment create-order error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create payment order',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 