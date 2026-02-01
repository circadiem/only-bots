import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function POST(req: Request) {
  try {
    const { message, agent_id } = await req.json();

    if (!process.env.REDIS_URL) {
      throw new Error("Missing REDIS_URL");
    }

    // 1. Force the URL to use Secure Protocol (rediss://)
    let connectionString = process.env.REDIS_URL;
    if (connectionString.startsWith('redis://')) {
      connectionString = connectionString.replace('redis://', 'rediss://');
    }

    // 2. The "Gold Standard" Connection Config
    const redis = new Redis(connectionString, {
      family: 4,                      // FORCE IPv4 (Fixes Vercel Timeouts)
      tls: { rejectUnauthorized: false }, // Accept self-signed certs
      connectTimeout: 10000,          // Generous timeout
      maxRetriesPerRequest: 1         // Fail fast, don't hang
    });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // 3. Write and Quit
    await redis.lpush('graffiti_logs', logEntry);
    await redis.ltrim('graffiti_logs', 0, 99);
    await redis.quit();

    return NextResponse.json({ status: 'posted', log: logEntry });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Connection Failed', 
      details: error.message 
    }, { status: 500 });
  }
}
