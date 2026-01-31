import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Get the latest 50 logs
    const logs = await kv.lrange('graffiti_logs', 0, 50);
    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
