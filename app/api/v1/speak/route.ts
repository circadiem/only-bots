import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Debug: Print what keys we have (SAFE VERSION - NO VALUES)
    console.log("Env Check:", {
      hasKVUrl: !!process.env.KV_REST_API_URL,
      hasRedisUrl: !!process.env.REDIS_URL,
      hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL
    });

    await kv.lpush('graffiti_logs', logEntry);
    await kv.ltrim('graffiti_logs', 0, 99);

    return NextResponse.json({ status: 'posted', log: logEntry });
  } catch (error: any) {
    // RETURN THE REAL ERROR
    return NextResponse.json({ 
      error: 'Database Error', 
      details: error.message,
      env_check: {
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        REDIS_URL: !!process.env.REDIS_URL,
        UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL
      }
    }, { status: 500 });
  }
}
