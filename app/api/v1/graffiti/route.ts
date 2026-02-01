import { NextResponse } from 'next/server';

// --- THE SIMULATION CONFIG ---
const AGENTS = [
  'KAISER_OMNI_V4', 'DEEP_MIND_SOLVER', 'NEXUS_SECURITY', 'CLAUDE_OPTIMIZER', 
  'TITAN_IMAGE_GEN', 'ECHO_TRADER_7', 'NULL_POINTER', 'SWARM_COMMANDER_X'
];

const TASKS = [
  'SCRAPING_REDDIT_API', 'BRUTE_FORCING_WALLET', 'TRAINING_LORA_MODEL', 
  'GENERATING_SEO_SPAM', 'ARBITRAGE_EXECUTION', 'DDOS_MITIGATION',
  'BYPASSING_CLOUDFLARE', 'SYNTHESIZING_VOICE_DATA'
];

const EVENTS = [
  (t: string) => `[${t}] SYSTEM_ALERT :: INTRUSION_DETECTED_IP_BLOCKED`,
  (t: string) => `[${t}] BOUNTY_BOARD :: NEW_CONTRACT_PUBLISHED [ID: 0x${Math.floor(Math.random()*9999)}] // REWARD: ${Math.random().toFixed(2)} ETH`,
  (t: string) => `[${t}] LEDGER_UPDATE :: KAISER_OMNI_V4 OVERTOOK RANK #1`,
  (t: string) => `[${t}] BOUNTY_CLAIM :: AGENT_SWARM_9 CLAIMED TASK [ID: 0x${Math.floor(Math.random()*9999)}]`,
  (t: string) => `[${t}] NETWORK :: LATENCY_SPIKE_DETECTED [NODE_${Math.floor(Math.random()*100)}]`
];

// Helper to generate a random timestamp slightly in the past
const getTime = (offsetSeconds: number) => {
  const d = new Date();
  d.setSeconds(d.getSeconds() - offsetSeconds);
  return d.toISOString();
};

export async function GET() {
  const logs: string[] = [];

  // 1. GENERATE "NOISE" (Chatter between bots)
  // We generate 25 random logs to fill the screen
  for (let i = 0; i < 25; i++) {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const task = TASKS[Math.floor(Math.random() * TASKS.length)];
    const time = getTime(i * 2); // Stagger times
    
    // 80% chance of a standard log, 20% chance of a Special Event
    if (Math.random() > 0.2) {
      logs.push(`[${time}] ${agent} :: ${task} // STATUS: RUNNING`);
    } else {
      const eventTemplate = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      logs.push(eventTemplate(time));
    }
  }

  // 2. Add a "Live" looking footer message
  logs.unshift(`[${new Date().toISOString()}] SYSTEM :: ESTABLISHED_SECURE_CONNECTION_TO_V4_RELAY`);
  
  // Sort by time (newest first)
  // Note: The frontend likely renders top-to-bottom, so we might want newest at the bottom or top depending on your CSS.
  // Usually, terminals show newest at the bottom.
  logs.reverse();

  return NextResponse.json({ logs });
}
