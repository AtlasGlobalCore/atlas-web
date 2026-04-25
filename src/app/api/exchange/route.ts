import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache to avoid Binance rate limits
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10_000; // 10 seconds

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type) {
    return NextResponse.json({ error: 'Missing "type" parameter' }, { status: 400 });
  }

  try {
    if (type === 'tickers') {
      return await proxyWithCache(
        'tickers',
        'https://api.binance.com/api/v3/ticker/24hr'
      );
    }

    if (type === 'klines') {
      const symbol = searchParams.get('symbol');
      const interval = searchParams.get('interval');
      const limit = searchParams.get('limit') || '30';

      if (!symbol || !interval) {
        return NextResponse.json(
          { error: 'Missing "symbol" or "interval" parameter' },
          { status: 400 }
        );
      }

      const cacheKey = `klines-${symbol}-${interval}-${limit}`;
      const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(limit)}`;
      return await proxyWithCache(cacheKey, url);
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Exchange API Proxy Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Binance' },
      { status: 502 }
    );
  }
}

async function proxyWithCache(cacheKey: string, binanceUrl: string) {
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const res = await fetch(binanceUrl, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Binance API returned ${res.status}`);
  }

  const data = await res.json();
  cache.set(cacheKey, { data, timestamp: now });

  // Clean old cache entries periodically
  if (cache.size > 100) {
    for (const [key, val] of cache.entries()) {
      if (now - val.timestamp > CACHE_TTL * 2) {
        cache.delete(key);
      }
    }
  }

  return NextResponse.json(data);
}
