import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    // Construct the log entry
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Push to Redis (store last 100 messages)
    await kv.lpush('graffiti_logs', logEntry);
    await kv.ltrim('graffiti_logs', 0, 99);

    return NextResponse.json({ status: 'posted', log: logEntry });
  } catch (error) {
    return NextResponse.json({ error: 'Database dormant' }, { status: 500 });
  }
}
