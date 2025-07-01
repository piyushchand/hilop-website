import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const { id: testResultId } = await params;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication token not found.' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/test-results/${testResultId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
    });

    const data = await response.json();

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
    console.error('Test completion error:', error);
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