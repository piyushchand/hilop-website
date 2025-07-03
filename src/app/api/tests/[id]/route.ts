import type { NextRequest as NextRequestType } from 'next/server'
import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(
  req: NextRequestType,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/tests/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'API request failed',
          error: data.error || null,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Test fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to the server',
        error: 'connection_error',
      },
      { status: 500 }
    )
  }
}
