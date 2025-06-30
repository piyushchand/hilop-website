import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body; // This is the idToken from Firebase Auth

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "Missing token", error: "validation_error" },
        { status: 400 }
      );
    }

    // Proxy the request to your backend's Firebase authentication endpoint
    const response = await fetch(`${API_URL}/auth/firebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Google login failed",
          error: data.error || null,
        },
        { status: response.status }
      );
    }

    const responseData = {
      success: true,
      message: data.message,
      data: {
        token: data.token,
        user: data.user,
      },
    };

    const res = new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    if (data.success && data.token) {
      res.cookies.set("accessToken", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });

      res.cookies.set("is_authenticated", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }

    return res;
  } catch (error) {
    console.error("Google login proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to the server",
        error: "connection_error",
      },
      { status: 500 }
    );
  }
}
