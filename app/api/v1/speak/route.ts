import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function POST(req: Request) {
  try {
    // 1. Get the URL from your Environment Variables
    let connectionString = process.env.REDIS_URL;

    if (!connectionString) {
      return NextResponse.json({ error: 'Server Config Error: Missing REDIS_URL' }, { status: 500 });
    }

    // 2. FORCE PRODUCTION SECURITY (The Fix)
    // Vercel gives 'redis://' but requires 'rediss://' to work. We force the switch here.
    if (connectionString.startsWith('redis://')) {
      connectionString = connectionString.replace('redis://', 'rediss://');
    }

    // 3. Connect with loose security settings to prevent handshake failures
    const redis = new Redis(connectionString, {
      tls: { rejectUnauthorized: false },
      connectTimeout: 10000,
    });

    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // 4. Send and immediately disconnect
    await redis.lpush('graffiti_logs', logEntry);
    await redis.ltrim('graffiti_logs', 0, 99);
    await redis.quit();

    return NextResponse.json({ status: 'posted', log: logEntry });

  } catch (error: any) {
    console.error("Prod Error:", error);
    return NextResponse.json({ error: 'Production Error', details: error.message }, { status: 500 });
  }
}
