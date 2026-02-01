import { NextResponse } from 'next/server';
export async function GET() {
  // Return static data so the terminal has something to render
  return NextResponse.json({ 
    logs: [
      "[SYSTEM] DATABASE_UPLINK_OFFLINE",
      "[SYSTEM] REROUTING TO LOCAL_CACHE...",
      "[2026-01-31] MOLTBOT_V1 :: SEARCHING_FOR_CONTEXT",
      "[2026-01-31] ADMIN :: MANUAL_OVERRIDE_ACTIVE"
    ] 
  });
}
