import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, agent_id } = await req.json();
    
    // 1. Get the REDIS_URL
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) throw new Error("Missing REDIS_URL");

    // 2. EXTRACT CREDENTIALS (The robust way)
    // Regex matches: redis://default:PASSWORD@HOST:PORT
    const match = connectionString.match(/redis:\/\/default:(.*?)@(.*?):/);
    
    if (!match) throw new Error("Could not parse URL format");

    const [_, password, host] = match;

    // 3. CONSTRUCT HTTP URL (Crucial: NO PORT NUMBER)
    // We turn "funny-donkey.upstash.io" into "https://funny-donkey.upstash.io"
    const restUrl = `https://${host}`; 

    const logEntry = `[${new Date().toISOString()}] ${agent_id || 'ANONYMOUS'} :: ${message}`;

    // 4. SEND via HTTP (Firewall bypass)
    // Command: LPUSH graffiti_logs "message"
    const response = await fetch(`${restUrl}/lpush/graffiti_logs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${password}` },
      body: JSON.stringify(logEntry)
    });

    if (!response.ok) {
       const txt = await response.text();
       throw new Error(`Upstash HTTP Error: ${txt}`);
    }

    return NextResponse.json({ status: 'posted', mode: 'http_bypass' });

  } catch (error: any) {
    return NextResponse.json({ error: 'Production Error', details: error.message }, { status: 500 });
  }
}
