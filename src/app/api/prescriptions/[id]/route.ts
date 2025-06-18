import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.110.216.61/api/v1';

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

    const { id: prescriptionId } = await params;

    // Try different possible endpoints
    const endpoints = [
      `/prescriptions/${prescriptionId}`,
      `/prescription/${prescriptionId}`,
      `/user/prescriptions/${prescriptionId}`,
      `/user/prescription/${prescriptionId}`
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying prescription detail endpoint: ${API_URL}${endpoint}`);
        
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
          console.log(`Success with prescription detail endpoint: ${endpoint}`, data);
          return NextResponse.json(data);
        } else {
          console.log(`Prescription detail endpoint ${endpoint} returned status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Error with prescription detail endpoint ${endpoint}:`, error);
      }
    }

    // If no endpoint worked, return error
    console.log('No prescription detail endpoints found');
    return NextResponse.json(
      { 
        success: false, 
        message: 'Prescription not found',
        error: 'not_found'
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Prescription detail API error:', error);
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