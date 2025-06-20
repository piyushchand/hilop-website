import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the orders API endpoint
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.110.216.61/api/v1';
    
    console.log('Testing orders API endpoint:', `${API_URL}/orders`);
    
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Orders API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Orders API error:', errorText);
      
      return NextResponse.json({
        success: false,
        message: `API returned status ${response.status}`,
        error: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('Orders API response data:', data);

    return NextResponse.json({
      success: true,
      message: 'Orders API is accessible',
      data: data
    });
  } catch (error) {
    console.error('Test orders API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to orders API',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 