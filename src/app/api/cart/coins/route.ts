import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Await cookies() as per Next.js 14+ API
    const cookiesList = await cookies();
    const token = cookiesList.get('token');
    const isAuthenticated = cookiesList.get('is_authenticated');

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Forward the request to your backend API with proper headers
    const response = await fetch("https://api.hilop.com/api/v1/cart/coins", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token?.value || ''}`,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      // Forward the error status and message from the backend
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "Failed to update coins usage" 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating coins:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coins usage" },
      { status: 500 }
    );
  }
} 