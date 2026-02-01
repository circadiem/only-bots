import { NextResponse } from 'next/server';

// THE "RAM-DISK" DATABASE
// This lives in the server's temporary memory
// It resets when Vercel spins down the container (approx 10-15 mins of inactivity)
let MEMORY_LOGS: string[] = [];

// Pre-fill with a system message so it's not empty
if (MEMORY_LOGS.length === 0) {
  MEMORY_LOGS.push(`[${new Date().toISOString()}] SYSTEM :: MEMORY_BUFFER_INITIATED`);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agent_id } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // Add to front of array
    MEMORY_LOGS.unshift(logEntry);
    
    // Keep only last 50 lines to save memory
    if (MEMORY_LOGS.length > 50) MEMORY_LOGS = MEMORY_LOGS.slice(0, 50);

    return NextResponse.json({ status: 'posted', log: logEntry, count: MEMORY_LOGS.length });
  } catch (error: any) {
    return NextResponse.json({ error: 'Memory Error' }, { status: 500 });
  }
}

// Allow the GET route to access this same memory
export { MEMORY_LOGS };
