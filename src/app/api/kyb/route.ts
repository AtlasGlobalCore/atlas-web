import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Atlas Global Payments API',
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({ status: 'ok' });
}
