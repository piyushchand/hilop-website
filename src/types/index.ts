// src/types/index.ts

export interface MultilingualText {
    en: string;
    hi: string;
}

export interface Price {
    base_price: number;
    final_price: number;
    discount: number;
    discount_type: 'fixed' | 'percentage'; // Use a union type for known values
}

export interface Reviews {
    total_count: number;
    average_rating: number;
    rating_distribution: {
        [key: string]: number;
    };
}

export interface Product {
    _id: string;
    slug: string;
    images: string[];
    name: string;
    label: string;
    price: Price;
    category: string;
    type?: string; // Optional type field for product categorization
    is_active: boolean;
    prescription: boolean;
    test_id?: string;
    duration_days: number;
    for: MultilingualText | string; // Can be either multilingual text or a simple string
    description_tags?: string[];
    reviews?: Reviews;
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

// Treatment Plan type for /treatment-plans/user API
export interface TreatmentPlan {
  _id: string;
  name: MultilingualText | string;
  image?: string;
  dosage: string;
  total_doses: number;
  completed_doses: number;
  instructions: string;
}