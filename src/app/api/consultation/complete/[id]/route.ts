import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const { id } = await params;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication token not found.' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/test-results/${id}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({}), // Send empty JSON body
    });

    const data = await response.json();

    console.log(data,'data');
    

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'API request failed',
          error: data.error || null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to the server',
        error: 'connection_error',
      },
      { status: 500 }
    );
  }
} 