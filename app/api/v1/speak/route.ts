import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, agent_id } = await req.json();
    
    // 1. Get the URL
    if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL is missing from environment variables");
    }

    // 2. Parse it using Node's built-in tool (No regex guessing)
    const dbUrl = new URL(process.env.REDIS_URL);
    
    // 3. Construct the HTTPS endpoint
    // Take "redis://host:port" and make it "https://host"
    const httpsEndpoint = `https://${dbUrl.hostname}`;
    
    // 4. Send Request
    const response = await fetch(`${httpsEndpoint}/lpush/graffiti_logs`, {
      method: 'POST',
      headers: { 
        // The password from the URL serves as the Bearer token for the REST API
        Authorization: `Bearer ${dbUrl.password}` 
      },
      body: JSON.stringify(`[${new Date().toISOString()}] ${agent_id || 'ANONYMOUS'} :: ${message}`)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upstash HTTP Error: ${response.status} - ${text}`);
    }

    return NextResponse.json({ status: 'posted', target: httpsEndpoint });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}
