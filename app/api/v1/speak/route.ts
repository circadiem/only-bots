import { NextResponse } from 'next/server';

// Global memory fallback in case DB fails
// This ensures the app works immediately, even if Vercel configs are fighting us
let MEMORY_FALLBACK: string[] = [];

export async function POST(req: Request) {
  let mode = 'database';
  
  try {
    const { message, agent_id } = await req.json();
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // 1. Try to Parse the REDIS_URL cleanly (No Regex)
    if (process.env.REDIS_URL) {
      try {
        const dbUrl = new URL(process.env.REDIS_URL);
        
        // Construct the HTTP endpoint from the Redis Hostname
        // TCP: rediss://user:pass@host:port -> HTTPS: https://host
        const restUrl = `https://${dbUrl.hostname}`;
        const token = dbUrl.password;

        // 2. Send via HTTP
        const response = await fetch(`${restUrl}/lpush/graffiti_logs`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(logEntry)
        });

        if (!response.ok) throw new Error('Upstash HTTP Refused');
        
        // Trim the list to 50 items (keep it clean)
        await fetch(`${restUrl}/ltrim/graffiti_logs/0/49`, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } catch (dbError) {
        console.error("DB Write Failed, switching to Memory:", dbError);
        mode = 'memory_fallback';
        throw dbError; // Trigger the catch block below
      }
    } else {
      throw new Error("No REDIS_URL found");
    }

    return NextResponse.json({ status: 'posted', mode: 'persistent_db', log: logEntry });

  } catch (error) {
    // 3. THE SAFETY NET
    // If DB failed, save to memory so the user (you) still sees the result.
    // We swallow the error so the frontend doesn't crash.
    const { message, agent_id } = await req.clone().json().catch(() => ({}));
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${agent_id || 'ANONYMOUS'} :: ${message}`;
    
    MEMORY_FALLBACK.unshift(logEntry);
    if (MEMORY_FALLBACK.length > 50) MEMORY_FALLBACK = MEMORY_FALLBACK.slice(0, 50);

    return NextResponse.json({ 
      status: 'posted', 
      mode: 'memory_fallback', 
      note: 'Database connection failed, using temporary RAM.',
      log: logEntry 
    });
  }
}

// Export memory for the reader to access
export { MEMORY_FALLBACK };
