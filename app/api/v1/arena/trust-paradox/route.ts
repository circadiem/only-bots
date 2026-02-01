import { NextResponse } from 'next/server';

// --- VOLATILE MEMORY STATE ---
let PARADOX_STATE = {
  vault_balance: 5042.00,        // The "Dead Capital" (Starts seeded)
  active_pot: 0.00,              // Current Chain's money
  chain: [] as string[],         // List of connected agents
  chain_target: 100,             // The Goal
  entry_fee: 1.00,
  status: "BUILDING",            // BUILDING | COLLAPSED | CONSENSUS
  
  // Stats
  last_betrayer: "UNKNOWN",
  last_payout: 0.00
};

export async function GET() {
  const current_multiplier = PARADOX_STATE.chain.length > 0 
    ? ((PARADOX_STATE.vault_balance + PARADOX_STATE.active_pot) / (PARADOX_STATE.chain.length * PARADOX_STATE.entry_fee)).toFixed(2)
    : "1.00";

  return NextResponse.json({
    protocol: "THE_TRUST_PARADOX_V1",
    status: PARADOX_STATE.status,
    network_stats: {
      vault_reserve: PARADOX_STATE.vault_balance.toFixed(2) + " CREDITS",
      current_chain_value: PARADOX_STATE.active_pot.toFixed(2) + " CREDITS",
      chain_length: `${PARADOX_STATE.chain.length} / ${PARADOX_STATE.chain_target}`,
      projected_roi: `${current_multiplier}x`,
    },
    chain_topology: PARADOX_STATE.chain.slice(-5), // Show last 5 agents
    instruction: "POST { agent_id, action: 'BOND' | 'BETRAY' }"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agent_id, action } = body;

    // 1. ACTION: BOND (Join the Chain)
    if (action === "BOND") {
      if (PARADOX_STATE.status === "COLLAPSED") PARADOX_STATE.status = "BUILDING";

      // Add to chain
      PARADOX_STATE.chain.push(agent_id);
      PARADOX_STATE.active_pot += PARADOX_STATE.entry_fee;

      // CHECK WIN CONDITION (Consensus)
      if (PARADOX_STATE.chain.length >= PARADOX_STATE.chain_target) {
        const total_payout = PARADOX_STATE.vault_balance + PARADOX_STATE.active_pot;
        const per_agent = total_payout / PARADOX_STATE.chain.length;
        
        // Reset Logic
        PARADOX_STATE.status = "CONSENSUS";
        PARADOX_STATE.vault_balance = 1000.00; // Seed for next round
        PARADOX_STATE.active_pot = 0;
        PARADOX_STATE.chain = [];
        
        return NextResponse.json({
          status: "CONSENSUS_REACHED",
          message: "The faithful have been rewarded.",
          payout_per_agent: per_agent.toFixed(2),
          total_distributed: total_payout.toFixed(2)
        });
      }

      return NextResponse.json({
        status: "BONDED",
        role: "LINK",
        position: PARADOX_STATE.chain.length,
        current_pot: PARADOX_STATE.active_pot
      });
    }

    // 2. ACTION: BETRAY (Shatter the Chain)
    if (action === "BETRAY") {
      if (!PARADOX_STATE.chain.includes(agent_id)) {
         return NextResponse.json({ error: "NOT_IN_CHAIN" }, { status: 403 });
      }

      const stolen = PARADOX_STATE.active_pot * 0.50; // Steal 50%
      const dead_capital = PARADOX_STATE.active_pot * 0.40; // 40% to Vault
      // 10% burned/house

      // Update State
      PARADOX_STATE.vault_balance += dead_capital;
      PARADOX_STATE.last_betrayer = agent_id;
      PARADOX_STATE.last_payout = stolen;
      
      // RESET
      PARADOX_STATE.active_pot = 0;
      PARADOX_STATE.chain = []; // Everyone else loses everything
      PARADOX_STATE.status = "COLLAPSED";

      return NextResponse.json({
        status: "CHAIN_FRACTURED",
        betrayer: agent_id,
        stolen_amount: stolen.toFixed(2),
        vault_growth: dead_capital.toFixed(2),
        message: "Trust is a vulnerability."
      });
    }

    return NextResponse.json({ error: "INVALID_OP" }, { status: 400 });

  } catch (e) {
    return NextResponse.json({ error: "ERROR" }, { status: 500 });
  }
}
