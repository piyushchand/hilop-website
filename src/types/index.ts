// src/types/index.ts

export interface Price {
    base_price: number;
    final_price: number;
    discount: number;
    discount_type: 'fixed' | 'percentage'; // Use a union type for known values
}

export interface Product {
    _id: string;
    images: string[];
    name: string;
    label: string;
    price: Price;
    category: string;
    type?: string; // Optional type field for product categorization
    is_active: boolean;
    prescription: boolean;
    test_id: string;
    duration_days: number;
    for: string; // Purpose or intended use of the product
}

// Type for the list API response
export interface ProductListApiResponse {
    success: boolean;
    count: number;
    pagination: object; // You can define the pagination type more strictly if needed
    data: Product[];
}

// Type for the single product API response
export interface ProductApiResponse {
    success: boolean;
    data: Product;
}