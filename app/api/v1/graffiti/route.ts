import { NextResponse } from 'next/server';
import { MEMORY_FALLBACK } from '../speak/route';

export async function GET() {
  try {
    let logs: string[] = [];

    // 1. Try fetching from DB
    if (process.env.REDIS_URL) {
      try {
        const dbUrl = new URL(process.env.REDIS_URL);
        const restUrl = `https://${dbUrl.hostname}`;
        const token = dbUrl.password;

        const response = await fetch(`${restUrl}/lrange/graffiti_logs/0/50`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          logs = data.result || [];
        }
      } catch (e) {
        console.error("DB Read Failed", e);
      }
    }

    // 2. If DB returned nothing (or failed), merge with Memory Fallback
    // This ensures that if we switched to memory mode, you still see your logs.
    if (logs.length === 0 && MEMORY_FALLBACK.length > 0) {
      logs = MEMORY_FALLBACK;
    }

    return NextResponse.json({ logs: logs });
  } catch (error) {
    // Ultimate fallback: Empty list (no crash)
    return NextResponse.json({ logs: [] });
  }
}
