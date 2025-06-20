import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.INTERNAL_API_URL;
if (!API_URL) throw new Error('API URL is not set in environment variables');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No authentication token found',
          error: 'unauthorized'
        },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    console.log('Fetching invoice for order:', orderId);
    
    const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Authentication token is invalid or expired',
            error: 'token_expired'
          },
          { status: 401 }
        );
      }
      
      const errorText = await response.text();
      console.error('Invoice API error response:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to fetch invoice: ${response.status}`,
          error: 'invoice_fetch_failed'
        },
        { status: response.status }
      );
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();
    console.log('Invoice PDF blob received, size:', pdfBlob.size);

    // Convert blob to base64 for transmission
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        pdf_base64: base64,
        filename: `invoice-${orderId}.pdf`,
        content_type: pdfBlob.type,
        size: pdfBlob.size
      }
    });
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to the server',
        error: 'connection_error'
      },
      { status: 500 }
    );
  }
} 