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

async function enrichGuestCartItems(guestCart: GuestCartItem[]) {
  // Fetch product details for each item and merge
  const enriched = await Promise.all(
    guestCart.map(async (item) => {
      try {
        const res = await fetch(`${API_URL}/products/${item.product_id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        if (!data.success || !data.data) throw new Error('Invalid product data');
        const product = data.data;
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          discounted_unit_price: product.price.final_price,
          images: product.images,
          category: product.category,
          months_quantity: item.months_quantity ?? 1,
          item_total: product.price.final_price * item.quantity,
        };
      } catch {
        // If product fetch fails, return a minimal placeholder
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          name: { en: 'Unknown', hi: 'Unknown' },
          price: { base_price: 0, final_price: 0, discount: 0, discount_type: 'fixed' },
          discounted_unit_price: 0,
          images: [],
          category: '',
          months_quantity: 1,
          item_total: 0,
        };
      }
    })
  );
  return enriched;
}

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

async function setGuestCart(cart: GuestCartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE, JSON.stringify(cart), {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: GUEST_CART_MAX_AGE,
    path: '/',
  });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      // Guest cart logic
      const guestCart = await getGuestCart();
      const enrichedCart = await enrichGuestCartItems(guestCart);
      // Calculate subtotal and item_count for guest cart
      const subtotal = enrichedCart.reduce((sum, item) => sum + (item.item_total || 0), 0);
      const item_count = enrichedCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      return NextResponse.json({ success: true, data: { items: enrichedCart, subtotal, item_count } }, { status: 200 });
    }

    // Fetch cart from the real backend API
    const res = await fetch(`${API_URL}/cart`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch cart',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const body = await req.json();

    if (!accessToken) {
      // Guest cart logic
      const guestCart = await getGuestCart();
      const idx = guestCart.findIndex((item) => item.product_id === body.product_id);
      if (idx > -1) {
        guestCart[idx].quantity = (guestCart[idx].quantity || 1) + (body.quantity || 1);
      } else {
        guestCart.push({ ...body, quantity: body.quantity || 1 });
      }
      await setGuestCart(guestCart);
      return NextResponse.json({ success: true, message: 'Added to cart!', data: { items: guestCart } }, { status: 200 });
    }

    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}