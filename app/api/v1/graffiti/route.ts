import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.KV_URL || process.env.REDIS_URL || '');

export async function GET() {
  try {
    const logs = await redis.lrange('graffiti_logs', 0, 50);
    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}

