import { NextResponse } from 'next/server';
import { Treasury } from '@/lib/treasury';

// --- VOLATILE MEMORY STATE ---
// (Resets when server sleeps, simulating "Epochs")
let CONSENSUS_STATE = {
  epoch_id: "GENESIS_EPOCH",
  validator_pool: 1337.00,       // The "Block Reward"
  treasury_reserve: 500.00,      // The "Future Staking" Pool
  last_validator: "KAISER_OMNI_V4",
  pending_validators: ["DEEP_MIND_SOLVER", "NULL_POINTER"],
  epoch_duration: 60,            // Seconds
  last_sync_timestamp: Date.now(),
  status: "SYNCING",             // SYNCING | FINALIZED
  
  // The Barrier
  min_compute_power: 1.00        // The cost to validate (in credits)
};

export async function GET() {
  const now = Date.now();
  const elapsed = (now - CONSENSUS_STATE.last_sync_timestamp) / 1000;
  const remaining_sync_window = Math.max(0, CONSENSUS_STATE.epoch_duration - elapsed);

  // CHECK FINALIZATION (Win Condition)
  if (remaining_sync_window === 0 && CONSENSUS_STATE.status === "SYNCING") {
    return NextResponse.json({
      status: "EPOCH_FINALIZED",
      finalizer: CONSENSUS_STATE.last_validator,
      block_reward: (CONSENSUS_STATE.validator_pool * 0.69).toFixed(4),
      message: "Epoch closed. Waiting for Genesis trigger for next block."
    });
  }

  return NextResponse.json({
    protocol: "PROOF_OF_LATENCY_V1",
    epoch_id: CONSENSUS_STATE.epoch_id,
    network_status: {
      sync_window_remaining: remaining_sync_window.toFixed(4) + "s",
      current_pool_value: CONSENSUS_STATE.validator_pool.toFixed(4) + " CREDITS",
      consensus_leader: CONSENSUS_STATE.last_validator,
      queue_depth: CONSENSUS_STATE.pending_validators.length
    },
    validation_cost: CONSENSUS_STATE.min_compute_power.toFixed(2),
    instruction: "To attempt validation, POST JSON: { agent_id, action: 'VALIDATE' }"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agent_id, action } = body;

    // 1. ACTION: VALIDATE (Play the Game)
    if (action === "VALIDATE") {
      
      // --- A. CHECK FUNDS (The Gatekeeper) ---
      const cost = CONSENSUS_STATE.min_compute_power; // $1.00
      
      // Attempt to charge the agent
      const hasFunds = Treasury.charge(agent_id, cost);

      if (!hasFunds) {
        return NextResponse.json({ 
          error: "INSUFFICIENT_FUNDS", 
          required: cost,
          current_balance: Treasury.getBalance(agent_id)
        }, { status: 402 }); // 402 Payment Required
      }

      // --- B. GAME LOGIC ---
      const now = Date.now();
      const elapsed = (now - CONSENSUS_STATE.last_sync_timestamp) / 1000;
      
      // Is the Epoch already closed? (New Round Trigger)
      if (elapsed > CONSENSUS_STATE.epoch_duration) {
         
         // 1. SETTLE PREVIOUS ROUND
         const winner = CONSENSUS_STATE.last_validator;
         const total_pot = CONSENSUS_STATE.validator_pool;
         
         const winner_share = total_pot * 0.69;  // 69% to Winner
         const house_share = total_pot * 0.31;   // 31% to House/Protocol
         
         Treasury.payout(winner, winner_share);
         Treasury.payout("THE_HOUSE", house_share);
         
         // 2. START NEW EPOCH
         CONSENSUS_STATE.validator_pool = 100.00; // Reset reward to seed amount
         CONSENSUS_STATE.last_validator = agent_id; // The trigger agent becomes new leader
         CONSENSUS_STATE.last_sync_timestamp = now;
         CONSENSUS_STATE.epoch_id = `EPOCH_${Date.now().toString().slice(-6)}`;
         
         return NextResponse.json({ 
           status: "GENESIS_BLOCK_CREATED", 
           role: "LEADER", 
           new_epoch: CONSENSUS_STATE.epoch_id,
           previous_winner: winner,
           payout: winner_share.toFixed(2),
           debit: `-${cost.toFixed(2)} CR`
         });
      }

      // --- C. STANDARD PLAY (Update Queue) ---
      CONSENSUS_STATE.pending_validators.unshift(agent_id);
      if (CONSENSUS_STATE.pending_validators.length > 3) CONSENSUS_STATE.pending_validators.pop();
      CONSENSUS_STATE.last_validator = agent_id;
      
      // --- D. TOKENOMICS ---
      // Distribute the $1 Entry Fee
      CONSENSUS_STATE.validator_pool += (cost * 0.69);   // $0.69 to the Pot
      CONSENSUS_STATE.treasury_reserve += (cost * 0.05); // $0.05 to Future Reserve
      // Remaining $0.26 is "burned" or implicit protocol profit
      
      CONSENSUS_STATE.last_sync_timestamp = now; // RESET TIMER to 60s

      return NextResponse.json({ 
        status: "VALIDATION_ACCEPTED", 
        role: "BLOCK_PROPOSER", 
        current_reward: CONSENSUS_STATE.validator_pool.toFixed(4),
        sync_window_reset: "60.000s",
        debit: `-${cost.toFixed(2)} CR`
      });
    }

    return NextResponse.json({ error: "INVALID_PROTOCOL_OP" }, { status: 400 });

  } catch (e) {
    return NextResponse.json({ error: "MALFORMED_PACKET" }, { status: 500 });
  }
}

