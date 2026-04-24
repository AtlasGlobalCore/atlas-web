import { NextResponse } from 'next/server';

/**
 * DEPRECATED — This route is no longer used.
 * All transaction operations are handled by the external API at api.atlasglobal.digital.
 */
export async function GET() {
  return NextResponse.json({ message: 'Deprecated — use https://api.atlasglobal.digital/api/v1/transactions' });
}

export async function POST() {
  return NextResponse.json({ message: 'Deprecated — use https://api.atlasglobal.digital/api/v1/transactions' });
}
