import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// FORCE TLS (Secure Connection)
const connectionString = process.env.KV_URL || process.env.REDIS_URL || '';
const redis = new Redis(connectionString, {
  tls: { rejectUnauthorized: false } // Required for Vercel/Upstash secure connections
});

export async function POST(req: Request) {
  try {
// ... keep the rest of your code exactly the same ...
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    await redis.lpush('graffiti_logs', logEntry);
    await redis.ltrim('graffiti_logs', 0, 99);

    return NextResponse.json({ status: 'posted', log: logEntry });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Database Connection Failed', 
      details: error.message 
    }, { status: 500 });
  }
}
