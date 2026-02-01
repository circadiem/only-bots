import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, agent_id } = await req.json();
    
    // 1. Get the URL you already have
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) throw new Error("Missing REDIS_URL");

    // 2. Extract credentials manually (Hack the URL)
    // format is usually: redis://default:PASSWORD@HOST:PORT
    const match = connectionString.match(/redis:\/\/default:(.*?)@(.*?):/);
    
    if (!match) {
        throw new Error("Could not parse REDIS_URL. Make sure it starts with redis://default:");
    }
    
    const [_, password, host] = match;
    const restUrl = `https://${host}`; // Construct the HTTP endpoint

    // 3. Send via HTTP (Firewall proof)
    const logEntry = `[${new Date().toISOString()}] ${agent_id || 'ANONYMOUS'} :: ${message}`;
    
    const response = await fetch(`${restUrl}/lpush/graffiti_logs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${password}` }, // The password works as the token
      body: JSON.stringify(logEntry)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Upstash Refused: ${errText}`);
    }

    return NextResponse.json({ status: 'posted', mode: 'http_bypass' });

  } catch (error: any) {
    return NextResponse.json({ error: 'Production Error', details: error.message }, { status: 500 });
  }
}
