import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// FORCE TLS
const connectionString = process.env.KV_URL || process.env.REDIS_URL || '';
const redis = new Redis(connectionString, {
  tls: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const logs = await redis.lrange('graffiti_logs', 0, 50);
    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
