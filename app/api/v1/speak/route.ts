import { NextResponse } from 'next/server';
export async function POST() {
  // Fake success so the client doesn't crash
  return NextResponse.json({ status: 'posted', note: 'SIMULATION_MODE' });
}
