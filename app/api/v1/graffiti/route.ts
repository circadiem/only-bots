import { NextResponse } from 'next/server';
import Redis from 'ioredis';

let connectionString = process.env.KV_URL || process.env.REDIS_URL || '';

if (connectionString.startsWith('redis://')) {
  connectionString = connectionString.replace('redis://', 'rediss://');
}

const redis = new Redis(connectionString);

export async function GET() {
  try {
    const logs = await redis.lrange('graffiti_logs', 0, 50);
    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
