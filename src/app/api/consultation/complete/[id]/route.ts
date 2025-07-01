import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const { id } = params;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication token not found.' },
        { status: 401 }
      );
    }

    const response = await fetch(`https://api.hilop.com/api/v1/test-results/${id}/complete`, {
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