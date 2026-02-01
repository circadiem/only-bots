import { NextResponse } from 'next/server';
// Import the shared memory from the other file
import { MEMORY_LOGS } from '../speak/route';

export async function GET() {
  // Return whatever is currently in memory
  // Since we import MEMORY_LOGS, we are reading the exact same array the POST route wrote to
  // Note: On Vercel Serverless, this works as long as the lambda is "warm".
  // If it splits into multiple instances, you might see fragmented logs, but for a demo, it's fine.
  
  return NextResponse.json({ 
    logs: MEMORY_LOGS || [] 
  });
}
