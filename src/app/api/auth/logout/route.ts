import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear both authentication cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('is_authenticated');
    
    // Optionally notify the backend about logout
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
    } catch (error) {
      // Log but don't fail if backend logout fails
      console.error('Backend logout error:', error);
    }

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to logout',
        error: 'server_error'
      },
      { status: 500 }
    );
  }
} 