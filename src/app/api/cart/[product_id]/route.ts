import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

const GUEST_CART_COOKIE = 'guestCart';
const GUEST_CART_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

interface GuestCartItem {
  product_id: string;
  quantity: number;
  [key: string]: unknown;
}

// Make getGuestCart async
async function getGuestCart(): Promise<GuestCartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(GUEST_CART_COOKIE);
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie.value) as GuestCartItem[];
  } catch {
    return [];
  }
}

// Make setGuestCart async
async function setGuestCart(cart: GuestCartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE, JSON.stringify(cart), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: GUEST_CART_MAX_AGE,
    path: '/',
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    // Extract product_id from the URL
    const product_id = req.nextUrl.pathname.split('/').pop();
    if (!product_id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is missing', error: 'bad_request' },
        { status: 400 }
      );
    }
    if (!accessToken) {
      // Guest cart logic
      const guestCart = await getGuestCart();
      const updatedCart = guestCart.filter((item) => item.product_id !== product_id);
      await setGuestCart(updatedCart);
      return NextResponse.json({ success: true, message: 'Removed from cart', data: { items: updatedCart } }, { status: 200 });
    }
    const backendRes = await fetch(`${API_URL}/cart/${product_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove product from cart',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    // Extract product_id from the URL
    const product_id = req.nextUrl.pathname.split('/').pop();
    if (!product_id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is missing', error: 'bad_request' },
        { status: 400 }
      );
    }
    const body = await req.json();
    if (!accessToken) {
      // Guest cart logic
      const guestCart = await getGuestCart();
      const idx = guestCart.findIndex((item) => item.product_id === product_id);
      if (idx > -1) {
        // Update quantity (and any other fields if needed)
        guestCart[idx].quantity = body.quantity ?? guestCart[idx].quantity;
        if (body.months_quantity !== undefined) {
          guestCart[idx].months_quantity = body.months_quantity;
        }
      }
      await setGuestCart(guestCart);
      return NextResponse.json({ success: true, message: 'Cart updated', data: { items: guestCart } }, { status: 200 });
    }
    const backendRes = await fetch(`${API_URL}/cart/${product_id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product in cart',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
