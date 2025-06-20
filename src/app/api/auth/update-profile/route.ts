import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    const contentType = request.headers.get('content-type') || '';

    let body;

    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      const jsonData = await request.json();
      body = JSON.stringify(jsonData);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken.value}` }),
    };

    if (!contentType.includes('multipart/form-data')) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: headers,
      credentials: 'include',
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to update profile: ${response.status}`,
          error: 'profile_update_failed'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the updated user data from the backend
    return NextResponse.json({
      success: true,
      message: data.message || 'Profile updated successfully',
      data: data.data || data.user || data // Handle different response formats
    });
  } catch (error) {
    console.error('Profile update error:', error);
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