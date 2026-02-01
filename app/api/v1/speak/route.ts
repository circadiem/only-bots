import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// 1. Paste your raw URL here (keep the quotes!)
const RAW_URL = "redis://default:YfhcJcUbCBxsWAqIyKUetY6vXuKowXqQ@redis-14288.c11.us-east-1-3.ec2.cloud.redislabs.com:14288";

// 2. We force the 's' for security (rediss://)
const secureUrl = RAW_URL.startsWith('redis://') 
  ? RAW_URL.replace('redis://', 'rediss://') 
  : RAW_URL;

// 3. Connect with explicit TLS settings
const redis = new Redis(secureUrl, {
  tls: { rejectUnauthorized: false }, // Trust the connection
  maxRetriesPerRequest: 1             // Fail fast if it breaks
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Test connection by PINGing first
    await redis.ping();

    // Push the log
    await redis.lpush('graffiti_logs', logEntry);
    await redis.ltrim('graffiti_logs', 0, 99);

    return NextResponse.json({ status: 'posted', log: logEntry });
  } catch (error: any) {
    console.error("DB Error:", error);
    return NextResponse.json({ 
      error: 'Connection Failed', 
      details: error.message,
      // Print the first 10 chars of URL to verify we have it (safe log)
      debug_url_start: secureUrl.substring(0, 15) + "..." 
    }, { status: 500 });
  }
}
