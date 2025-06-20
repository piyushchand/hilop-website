// src/services/apiService.ts
import { ProductListApiResponse, ProductApiResponse } from '@/types';

// NOTE: No need for axios, Next.js extends the global `fetch` API
// with caching and revalidating capabilities. It's the recommended way.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) throw new Error('API URL is not set in environment variables');

export const getProductList = async (): Promise<ProductListApiResponse> => {
    // We use { cache: 'no-store' } to ensure we always get the latest data.
    // You can also use revalidation options like { next: { revalidate: 3600 } }
    const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });

    if (!res.ok) {
        // This will be caught by the `error.tsx` boundary
        throw new Error('Failed to fetch product list');
    }

    return res.json();
};

export const getProductById = async (productId: string): Promise<ProductApiResponse> => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, { cache: 'no-store' });

    if (!res.ok) {
        // This will activate the `not-found.tsx` if the status is 404
        if (res.status === 404) {
            // You can import and use the `notFound` function from 'next/navigation' here
        }
        throw new Error('Failed to fetch product');
    }

    return res.json();
};