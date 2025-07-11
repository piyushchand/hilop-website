import { NextRequest, NextResponse } from 'next/server';

interface ApiTreatmentPlan {
  _id: string;
  user_id: string;
  product_id: {
    _id: string;
    images: string[];
    name: {
      en: string;
      hi: string;
    };
    description: {
      en: string;
      hi: string;
    };
    price: {
      base_price: number;
      final_price: number;
      discount: number;
      discount_type: string;
    };
  };
  test_result_id: {
    _id: string;
    test_id: string;
  };
  total_count: number;
  purchased_count: number;
  image_url: string | null;
  dosage_schedule: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function GET(req: NextRequest) {
  try {
    // Get the token from the request cookies or headers
    const authHeader = req.headers.get('authorization') || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      // Try to get from cookies (if SSR)
      const cookie = req.cookies.get('accessToken');
      if (cookie) token = cookie.value;
    }
    if (!token) {
      return NextResponse.json({ success: false, message: 'No auth token' }, { status: 401 });
    }
    const apiRes = await fetch(`${API_URL}/treatment-plans/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!apiRes.ok) {
      return NextResponse.json(
        { success: false, message: `API error: ${apiRes.status}` },
        { status: apiRes.status }
      );
    }
    
    const data = await apiRes.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    // Transform the data to match our expected structure
    if (data.success && Array.isArray(data.data)) {
      const transformedPlans = data.data.map((plan: ApiTreatmentPlan) => {
        const product = plan.product_id;
        return {
          _id: plan._id,
          name: product?.name?.en || product?.name?.hi || 'Unnamed Product',
          image: product?.images?.[0] || '/images/product.png',
          dosage: plan.dosage_schedule || 'Not specified',
          total_doses: plan.total_count || 0,
          completed_doses: plan.purchased_count || 0,
          instructions: product?.description?.en || product?.description?.hi || 'No instructions available'
        };
      });
      
      console.log('Transformed plans:', transformedPlans);
      
      return NextResponse.json({
        success: true,
        data: transformedPlans
      });
    }
    
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error: unknown) {
    console.error('Treatment plans fetch error:', error);
    let message = 'Failed to fetch plans';
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
