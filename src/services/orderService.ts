// Helper function to get auth headers for client-side requests
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  quantity: number;
  price?: number;
  total?: number;
}

export interface ShippingAddress {
  name: string;
  phone_number: string;
  address: string;
  landmark: string;
  city: string;
  zipcode: string;
  state: string;
  country: string;
}

export interface Payment {
  method: string;
  status: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
}

export interface Order {
  _id: string;
  user: string;
  order_number: string;
  items: OrderItem[];
  shipping_address?: ShippingAddress;
  payment?: Payment;
  subtotal?: number;
  shipping_fee?: number;
  tax?: number;
  hilop_coins_used?: number;
  hilop_coins_discount?: number;
  coin_discount_percentage?: number;
  total?: number;
  status: string;
  refund_status?: string;
  createdAt: string;
  updatedAt?: string;
  admin_notes?: string;
  tracking_number?: string;
}

export interface OrderListResponse {
  success: boolean;
  count: number;
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    limit: number;
  };
  data: Order[];
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order;
}

export interface InvoiceDownloadResponse {
  success: boolean;
  data: {
    pdf_base64: string;
    filename: string;
    content_type: string;
    size: number;
  };
}

export class OrderService {
  /**
   * Fetch list of orders for the authenticated user
   */
  static async getOrderList(): Promise<OrderListResponse> {
    try {
      console.log('Fetching orders from Next.js API');
      
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Orders API error response:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Orders API response:', data);
      return data;
    } catch (error) {
      console.error('OrderService.getOrderList error:', error);
      
      // Return empty list on error to prevent app crash
      return {
        success: true,
        count: 0,
        pagination: {
          total: 0,
          total_pages: 0,
          current_page: 1,
          has_next_page: false,
          has_prev_page: false,
          limit: 10
        },
        data: []
      };
    }
  }

  /**
   * Fetch detailed order by ID
   */
  static async getOrderDetail(orderId: string): Promise<OrderDetailResponse> {
    try {
      console.log('Fetching order detail for:', orderId);
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order detail API error response:', errorText);
        throw new Error(`Failed to fetch order detail: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Order detail API response:', data);
      return data;
    } catch (error) {
      console.error('OrderService.getOrderDetail error:', error);
      throw error;
    }
  }

  /**
   * Download invoice for order by ID
   */
  static async downloadInvoice(orderId: string): Promise<InvoiceDownloadResponse | { success: false; error: string }> {
    try {
      console.log('Downloading invoice for order:', orderId);
      
      const response = await fetch(`/api/orders/${orderId}/invoice`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Invoice download API error response:', errorText);
        throw new Error(`Failed to download invoice: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Invoice download API response:', data);
      
      if (data.success && data.data && data.data.pdf_base64) {
        return data as InvoiceDownloadResponse;
      } else {
        throw new Error('Invalid invoice data received from server');
      }
    } catch (error) {
      console.error('OrderService.downloadInvoice error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to download invoice' 
      };
    }
  }
} 