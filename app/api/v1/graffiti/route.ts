import { NextResponse } from 'next/server';

// Access the SAME global variable
declare global {
  var LOG_CACHE: string[];
}

export async function GET() {
  // Return whatever is in RAM
  return NextResponse.json({ 
    logs: global.LOG_CACHE || [] 
  });
}
