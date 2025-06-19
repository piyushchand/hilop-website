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

    // Try different possible endpoints
    const endpoints = [
      '/prescriptions',
      '/user/prescriptions',
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${API_URL}${endpoint}`);
        
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken.value}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Success with endpoint: ${endpoint}`, data);
          return NextResponse.json(data);
        } else {
          console.log(`Endpoint ${endpoint} returned status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Error with endpoint ${endpoint}:`, error);
      }
    }

    // If no endpoint worked, return empty prescription list
    console.log('No prescription endpoints found, returning empty list');
    return NextResponse.json({
      success: true,
      count: 0,
      data: []
    });

  } catch (error) {
    console.error('Prescription API error:', error);
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