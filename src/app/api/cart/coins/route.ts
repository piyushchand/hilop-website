import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "No authentication token found", error: 'unauthorized' },
        { status: 401 }
      );
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) throw new Error('API URL is not set in environment variables');
    const response = await fetch(`${API_URL}/cart/coins`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating coins:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coins usage" },
      { status: 500 }
    );
  }
} 