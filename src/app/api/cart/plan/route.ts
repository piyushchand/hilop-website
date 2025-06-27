import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface Plan {
  _id: string;
  name: string;
  months: number;
  discount: number;
  discount_type: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { plan_id } = await request.json();

    if (!plan_id) {
      return NextResponse.json(
        { success: false, message: "Plan ID is required" },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // First verify the plan exists and is active
    const planResponse = await fetch(`${API_URL}/plans`);
    const planData = await planResponse.json();
    
    if (!planData.success) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch plans" },
        { status: 500 }
      );
    }

    const plan = planData.data.find((p: Plan) => p._id === plan_id);
    
    if (!plan || !plan.is_active) {
      return NextResponse.json(
        { success: false, message: "Plan not found or is inactive" },
        { status: 404 }
      );
    }

    // Update cart with the selected plan
    const cartResponse = await fetch(`${API_URL}/cart/plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({ plan_id }),
    });

    const cartData = await cartResponse.json();

    if (!cartData.success) {
      return NextResponse.json(
        { success: false, message: cartData.message || "Failed to update cart plan" },
        { status: cartResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Plan updated successfully",
      data: cartData.data,
    });

  } catch (error) {
    console.error("Error updating cart plan:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 