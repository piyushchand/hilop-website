import { NextResponse } from 'next/server';

export async function GET() {
  // Return an empty JSON object for Chrome DevTools
  return NextResponse.json({}, { status: 200 });
} 