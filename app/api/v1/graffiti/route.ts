import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.REDIS_URL) return NextResponse.json({ logs: [] });

    // Same logic: Parse URL -> Build HTTPS request
    const dbUrl = new URL(process.env.REDIS_URL);
    const httpsEndpoint = `https://${dbUrl.hostname}`;

    const response = await fetch(`${httpsEndpoint}/lrange/graffiti_logs/0/50`, {
      headers: { Authorization: `Bearer ${dbUrl.password}` }
    });

    if (!response.ok) return NextResponse.json({ logs: [] });

    const data = await response.json();
    return NextResponse.json({ logs: data.result || [] });

  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
