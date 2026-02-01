import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Force the same secure connection logic for the reader
const getClient = () => {
  let url = process.env.REDIS_URL;
  if (url && url.startsWith('redis://')) {
    url = url.replace('redis://', 'rediss://');
  }
  return new Redis(url || '', {
    tls: { rejectUnauthorized: false }
  });
};

export async function GET() {
  try {
    const redis = getClient();
    const logs = await redis.lrange('graffiti_logs', 0, 50);
    await redis.quit();
    
    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
