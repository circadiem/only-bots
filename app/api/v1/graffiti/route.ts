import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function GET() {
  try {
    if (!process.env.REDIS_URL) return NextResponse.json({ logs: [] });

    let connectionString = process.env.REDIS_URL;
    if (connectionString.startsWith('redis://')) {
      connectionString = connectionString.replace('redis://', 'rediss://');
    }

    const redis = new Redis(connectionString, {
      family: 4,                      // FORCE IPv4
      tls: { rejectUnauthorized: false },
      connectTimeout: 5000
    });

    const logs = await redis.lrange('graffiti_logs', 0, 50);
    await redis.quit();

    return NextResponse.json({ logs: logs || [] });

  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
