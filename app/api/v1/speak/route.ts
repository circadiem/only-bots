import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// FORCE SECURE PROTOCOL (The "s" is critical)
let connectionString = process.env.KV_URL || process.env.REDIS_URL || '';

// If the URL starts with "redis://", switch it to "rediss://"
if (connectionString.startsWith('redis://')) {
  connectionString = connectionString.replace('redis://', 'rediss://');
}

// Create the connection
const redis = new Redis(connectionString);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Push to DB
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
