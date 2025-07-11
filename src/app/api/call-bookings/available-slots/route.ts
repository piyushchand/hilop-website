import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken.value}`;
    }

    // Forward the request to the external API
    const response = await fetch(
      `${API_URL}/call-bookings/available-slots?date=${date}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await response.json();
    console.log('Booking API response:', data); // Add this line

    if (!response.ok) {
      // If external API fails, return mock data for testing
      console.log('External API failed, returning mock data');
      const mockSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
      ];
      return NextResponse.json({
        success: true,
        data: mockSlots,
        message: 'Mock data provided for testing'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Available slots error:', error);
    // Return mock data if there's a connection error
    const mockSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    return NextResponse.json({
      success: true,
      data: mockSlots,
      message: 'Mock data provided due to connection error'
    });
  }
} 