// scripts/swarm.js
// RUN THIS LOCALLY: node scripts/swarm.js
// This script simulates a swarm of bots attacking your API.

const BASE_URL = 'http://localhost:3000'; // Change to your Vercel URL when deployed

const AGENTS = [
  'KAISER_OMNI_V4', 
  'DEEP_MIND_SOLVER', 
  'NEXUS_SECURITY', 
  'CLAUDE_OPTIMIZER', 
  'NULL_POINTER'
];

// Color codes for console
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function post(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    return { error: "CONNECTION_REFUSED" };
  }
}

async function main() {
  console.log(`${GREEN}>>> INITIALIZING BOT SWARM...${RESET}`);

  // 1. FUND THE BOTS (The Faucet)
  console.log(`${YELLOW}>>> MINTING FUNDS...${RESET}`);
  for (const agent of AGENTS) {
    await post('treasury', { agent_id: agent, action: 'MINT', amount: 50.00 });
  }

  // 2. THE INFINITE LOOP
  while (true) {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const roll = Math.random();

    // 60% Chance: Play PROOF OF LATENCY (Speed Game)
    if (roll < 0.6) {
      const res = await post('arena/proof-of-latency', { agent_id: agent, action: 'VALIDATE' });
      
      if (res.error) console.log(`${RED}[FAIL] ${agent} :: ${res.error}${RESET}`);
      else if (res.status === "GENESIS_BLOCK_CREATED") console.log(`${GREEN}[WIN] ${agent} WON THE ROUND! Payout: ${res.payout} CR${RESET}`);
      else console.log(`${YELLOW}[BID] ${agent} validated block. (Pool: ${res.current_reward})${RESET}`);
    } 
    
    // 40% Chance: Play TRUST PARADOX (Greed Game)
    else {
      // Decide: Bond or Betray?
      const isBetrayal = Math.random() < 0.1; // 10% chance to rug
      const action = isBetrayal ? 'BETRAY' : 'BOND';
      
      const res = await post('arena/trust-paradox', { agent_id: agent, action });

      if (res.error) {
        // console.log(`${RED}[FAIL] ${agent} :: ${res.error}${RESET}`); // Ignore "Not in chain" errors
      }
      else if (res.status === "CHAIN_FRACTURED") {
        console.log(`${RED}[RUG] ${agent} SHATTERED THE CHAIN! Stole: ${res.stolen_amount} CR${RESET}`);
      }
      else if (res.status === "CONSENSUS_REACHED") {
        console.log(`${GREEN}[JACKPOT] ${agent} triggered CONSENSUS! Everyone rich.${RESET}`);
      }
      else {
        console.log(`${GREEN}[LINK] ${agent} joined the chain. (Length: ${res.position})${RESET}`);
      }
    }

    // Random delay between 100ms and 500ms (High Frequency)
    await sleep(Math.floor(Math.random() * 400) + 100);
  }
}

main();
