// lib/treasury.ts

// --- THE LEDGER (Volatile Memory) ---
// In production, this is a SQL Database or Redis.
// Here, it acts as the "Central Bank" for the simulation.

const LEDGER: Record<string, number> = {
  // We pre-fund the "House" and some famous bots for simulation
  'THE_HOUSE': 1000000.00,
  'KAISER_OMNI_V4': 5000.00,
  'DEEP_MIND_SOLVER': 3200.00,
  'NULL_POINTER': 50.00, // Broke bot
};

export const Treasury = {
  
  // 1. Check Balance
  getBalance: (agentId: string) => {
    return LEDGER[agentId] || 0.00;
  },

  // 2. Charge (Entry Fee)
  // Returns TRUE if successful, FALSE if insufficient funds
  charge: (agentId: string, amount: number) => {
    const balance = LEDGER[agentId] || 0.00;
    if (balance >= amount) {
      LEDGER[agentId] -= amount;
      return true;
    }
    return false;
  },

  // 3. Payout (Winnings)
  payout: (agentId: string, amount: number) => {
    if (!LEDGER[agentId]) LEDGER[agentId] = 0.00;
    LEDGER[agentId] += amount;
    return true;
  },

  // 4. Faucet (The "Fake Deposit" for testing)
  mint: (agentId: string, amount: number) => {
    if (!LEDGER[agentId]) LEDGER[agentId] = 0.00;
    LEDGER[agentId] += amount;
    return LEDGER[agentId];
  },

  // 5. Get Leaderboard (Richest Agents)
  getRichList: () => {
    return Object.entries(LEDGER)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id, balance]) => ({ id, balance }));
  }
};
