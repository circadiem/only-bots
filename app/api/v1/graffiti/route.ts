import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) return NextResponse.json({ logs: [] });

    const match = connectionString.match(/redis:\/\/default:(.*?)@(.*?):/);
    if (!match) return NextResponse.json({ logs: [] });

    const [_, password, host] = match;
    const restUrl = `https://${host}`; 

    // Command: LRANGE graffiti_logs 0 50
    const response = await fetch(`${restUrl}/lrange/graffiti_logs/0/50`, {
      headers: { Authorization: `Bearer ${password}` }
    });

    const data = await response.json();
    return NextResponse.json({ logs: data.result || [] });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
