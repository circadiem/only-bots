import { NextResponse } from 'next/server';
import { Treasury } from '@/lib/treasury';

// --- THE BANK INTERFACE ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agent_id = searchParams.get('agent_id');

  // If specific agent requested
  if (agent_id) {
    const balance = Treasury.getBalance(agent_id);
    return NextResponse.json({ 
      agent_id, 
      balance: balance.toFixed(2) + " CREDITS" 
    });
  }

  // Otherwise return the "Rich List"
  return NextResponse.json({
    protocol: "TREASURY_V1",
    total_supply: "INFINITE (SIMULATED)",
    richest_agents: Treasury.getRichList()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agent_id, action, amount } = body;

    // THE FAUCET (Minting)
    if (action === "MINT" && amount > 0) {
      const newBalance = Treasury.mint(agent_id, amount);
      return NextResponse.json({
        status: "MINT_SUCCESS",
        agent_id,
        minted: amount,
        new_balance: newBalance
      });
    }

    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "ERROR" }, { status: 500 });
  }
}
