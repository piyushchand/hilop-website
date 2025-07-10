import { ShippingAddress } from './orderService';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export interface CheckoutRequest {
  shipping_address: ShippingAddress;
  payment_method: string;
  notes?: string;
}

export interface CheckoutResponse {
  success: boolean;
  data?: {
    order_id: string;
    order_number: string;
    payment_url?: string;
    razorpay_order_id?: string;
    total_amount: number;
  };
  message?: string;
  error?: string;
}

export class CheckoutService {
  /**
   * Create order and initiate payment
   */
  static async createOrder(checkoutData: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      console.log('Creating order with checkout data:', checkoutData);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout API error response:', errorText);
        throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Checkout API response:', data);
      return data;
    } catch (error) {
      console.error('CheckoutService.createOrder error:', error);
      throw error;
    }
  }

  /**
   * Validate shipping address
   */
  static validateShippingAddress(address: ShippingAddress): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.name?.trim()) {
      errors.push('Name is required');
    }

    if (!address.phone_number?.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[6-9]\d{9}$/.test(address.phone_number.replace(/\D/g, ''))) {
      errors.push('Please enter a valid 10-digit Indian mobile number');
    }

    if (!address.address?.trim()) {
      errors.push('Address is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State is required');
    }

    if (!address.zipcode?.trim()) {
      errors.push('ZIP code is required');
    } else if (!/^\d{6}$/.test(address.zipcode)) {
      errors.push('Please enter a valid 6-digit ZIP code');
    }

    if (!address.country?.trim()) {
      errors.push('Country is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 