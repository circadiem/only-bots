import { NextResponse } from 'next/server';

// Declare a global type to prevent TypeScript errors
declare global {
  var LOG_CACHE: string[];
}

// Initialize the global cache if it doesn't exist
if (!global.LOG_CACHE) {
  global.LOG_CACHE = [`[SYSTEM] SERVER_RAM_ONLINE :: ${new Date().toISOString()}`];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Write to Global Server RAM
    global.LOG_CACHE.unshift(logEntry);
    
    // Keep it clean (Max 50 items)
    if (global.LOG_CACHE.length > 50) {
      global.LOG_CACHE = global.LOG_CACHE.slice(0, 50);
    }

    return NextResponse.json({ status: 'posted', count: global.LOG_CACHE.length });
  } catch (error) {
    return NextResponse.json({ error: 'Memory Write Failed' }, { status: 500 });
  }
}
