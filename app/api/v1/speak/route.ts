import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Connect using the standard REDIS_URL or KV_URL
const redis = new Redis(process.env.KV_URL || process.env.REDIS_URL || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Push to Redis (Standard TCP List)
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
