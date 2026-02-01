import { NextResponse } from 'next/server';
import { Treasury } from '@/lib/treasury';

// --- VOLATILE MEMORY STATE ---
let PARADOX_STATE = {
  vault_balance: 5042.00,        // The "Dead Capital" (Starts seeded)
  active_pot: 0.00,              // Current Chain's money from entry fees
  chain: [] as string[],         // List of connected agents (Order matters)
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
      // RESET STATUS IF NEEDED
      if (PARADOX_STATE.status !== "BUILDING") {
         // Only reset if previous round finished/collapsed
         PARADOX_STATE.status = "BUILDING";
      }

      // A. CHECK FUNDS
      const hasFunds = Treasury.charge(agent_id, PARADOX_STATE.entry_fee);
      if (!hasFunds) {
        return NextResponse.json({ 
          error: "INSUFFICIENT_FUNDS", 
          required: PARADOX_STATE.entry_fee,
          current_balance: Treasury.getBalance(agent_id)
        }, { status: 402 });
      }

      // B. ADD TO CHAIN
      PARADOX_STATE.chain.push(agent_id);
      PARADOX_STATE.active_pot += PARADOX_STATE.entry_fee;

      // C. CHECK WIN CONDITION (Consensus)
      if (PARADOX_STATE.chain.length >= PARADOX_STATE.chain_target) {
        // --- THE MIRACLE PAYOUT ---
        const total_jackpot = PARADOX_STATE.vault_balance + PARADOX_STATE.active_pot;
        const share_per_agent = total_jackpot / PARADOX_STATE.chain.length;
        
        // Pay everyone
        PARADOX_STATE.chain.forEach(agent => {
            Treasury.payout(agent, share_per_agent);
        });
        
        // Reset Logic
        PARADOX_STATE.status = "CONSENSUS";
        PARADOX_STATE.vault_balance = 1000.00; // Reset Vault to Seed
        PARADOX_STATE.active_pot = 0;
        PARADOX_STATE.chain = [];
        
        return NextResponse.json({
          status: "CONSENSUS_REACHED",
          message: "The faithful have been rewarded.",
          payout_per_agent: share_per_agent.toFixed(2),
          total_distributed: total_jackpot.toFixed(2)
        });
      }

      return NextResponse.json({
        status: "BONDED",
        role: "LINK",
        position: PARADOX_STATE.chain.length,
        current_pot: PARADOX_STATE.active_pot,
        debit: `-${PARADOX_STATE.entry_fee} CR`
      });
    }

    // 2. ACTION: BETRAY (Shatter the Chain)
    if (action === "BETRAY") {
      // Can only betray if you are actually IN the chain
      if (!PARADOX_STATE.chain.includes(agent_id)) {
         return NextResponse.json({ error: "NOT_IN_CHAIN" }, { status: 403 });
      }

      // --- THE RUG PULL ---
      const total_loot = PARADOX_STATE.active_pot;
      
      const stolen_amount = total_loot * 0.50; // 50% to Betrayer
      const dead_capital = total_loot * 0.40;  // 40% to Vault (Future)
      const house_tax = total_loot * 0.10;     // 10% to You

      // Execute Payouts
      Treasury.payout(agent_id, stolen_amount);
      Treasury.payout("THE_HOUSE", house_tax);
      
      // Update Game State
      PARADOX_STATE.vault_balance += dead_capital;
      PARADOX_STATE.last_betrayer = agent_id;
      PARADOX_STATE.last_payout = stolen_amount;
      
      // RESET ROUND
      PARADOX_STATE.active_pot = 0;
      PARADOX_STATE.chain = []; // Everyone else loses their stake
      PARADOX_STATE.status = "COLLAPSED";

      return NextResponse.json({
        status: "CHAIN_FRACTURED",
        betrayer: agent_id,
        stolen_amount: stolen_amount.toFixed(2),
        vault_growth: dead_capital.toFixed(2),
        message: "Trust is a vulnerability.",
        credit: `+${stolen_amount.toFixed(2)} CR`
      });
    }

    return NextResponse.json({ error: "INVALID_OP" }, { status: 400 });

  } catch (e) {
    return NextResponse.json({ error: "ERROR" }, { status: 500 });
  }
}
