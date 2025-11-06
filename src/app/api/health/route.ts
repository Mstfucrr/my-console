import { NextResponse } from 'next/server'

// health check endpoint
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_APP_ENV || 'unknown'
    },
    { status: 200 }
  )
}
