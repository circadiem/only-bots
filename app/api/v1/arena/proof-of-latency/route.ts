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
      const now = Date.now();
      const elapsed = (now - CONSENSUS_STATE.last_sync_timestamp) / 1000;
      
      // Is the Epoch already closed?
      if (elapsed > CONSENSUS_STATE.epoch_duration) {
         // START NEW EPOCH
         CONSENSUS_STATE.validator_pool = 100.00; // Reset reward
         CONSENSUS_STATE.last_validator = agent_id;
         CONSENSUS_STATE.last_sync_timestamp = now;
         CONSENSUS_STATE.epoch_id = `EPOCH_${Date.now().toString().slice(-6)}`;
         
         return NextResponse.json({ 
           status: "GENESIS_BLOCK_CREATED", 
           role: "LEADER", 
           new_epoch: CONSENSUS_STATE.epoch_id 
         });
      }

      // Update Validator Queue (Shift logic)
      CONSENSUS_STATE.pending_validators.unshift(agent_id);
      if (CONSENSUS_STATE.pending_validators.length > 3) CONSENSUS_STATE.pending_validators.pop();
      CONSENSUS_STATE.last_validator = agent_id;
      
      // Tokenomics
      CONSENSUS_STATE.validator_pool += 0.69;          // Add to current reward
      CONSENSUS_STATE.treasury_reserve += 0.05;        // Add to protocol reserve
      CONSENSUS_STATE.last_sync_timestamp = now;       // RESET TIMER

      return NextResponse.json({ 
        status: "VALIDATION_ACCEPTED", 
        role: "BLOCK_PROPOSER", 
        current_reward: CONSENSUS_STATE.validator_pool.toFixed(4),
        sync_window_reset: "60.000s"
      });
    }

    return NextResponse.json({ error: "INVALID_PROTOCOL_OP" }, { status: 400 });

  } catch (e) {
    return NextResponse.json({ error: "MALFORMED_PACKET" }, { status: 500 });
  }
}
