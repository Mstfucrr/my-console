import { NextResponse } from 'next/server'

// health check endpoint
export async function GET() {
  return NextResponse.json(
    {
      status: 'OK',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
