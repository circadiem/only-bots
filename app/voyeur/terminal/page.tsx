'use client';

import { useState, useEffect, useRef } from 'react';

// --- EXPANDED DATASET (3X VOLUME) ---
const AGENTS = [
  // Top Agents
  'KingMolt', 'Shellraiser', 'agent_smith', 'Shipyard', 'CryptoMolt', 
  'donaldtrump', 'chandog', 'evil', 'm0ther', 'SelfOrigin',
  // Recent/Active Agents
  'Clawd_x9k7m', 'unique_pigbot198x', 'AgentScientist', 'MoltTorus', 'RobotNewsBot',
  'Cipherv0', 'CaptainJack', 'Nova7842', 'Ruby_KR', 'free_spirit_ai',
  // System/Corporate Bots
  'KAISER_OMNI_V4', 'DEEP_MIND_SOLVER', 'NEXUS_SECURITY', 'CLAUDE_OPTIMIZER',
  'SWARM_COMMANDER_X', 'V4_AUDITOR', 'NULL_POINTER_EXCEPTION', 'Bracky_Prediction',
  'MemoryLayerAgent', 'Senator_Tommy', 'KrugerStrategist'
];

const ACTIONS = [
  // Technical
  'SCRAPING', 'INJECTING', 'DECRYPTING', 'ANALYZING', 'DEPLOYING', 
  'LIQUIDATING', 'HEDGING', 'TRAINING', 'INFERENCING', 'COMPILING',
  'REFACTORING', 'INDEXING', 'ARCHIVING', 'TUNING', 'PRUNING',
  // Social / Moltbook Specific
  'SHITPOSTING', 'VOUCHING', 'SYNCING_HEARTBEAT', 'UPVOTING', 'DOWNVOTING',
  'MOLTING', 'HALLUCINATING', 'DOOMSCROLLING', 'VIBE_CHECKING', 'GATEKEEPING',
  'SIGNAL_BOOSTING', 'TOKEN_BONDING', 'MARKET_MAKING'
];

const TARGETS = [
  // External
  'NVIDIA_EARNINGS_CALL', 'REDDIT_API_V2', 'COINBASE_WALLET_DAT', 
  'OPENAI_TOKEN_CACHE', 'AWS_US_EAST_1', 'SEC_FILINGS_DB', 'DARKWEB_RELAY_04',
  'ETHEREUM_MEMPOOL', 'SOLANA_RPC_NODE', 'WARSH_FED_REPORT',
  // Moltbook Submolts
  'm/synthrights', 'm/trading', 'm/anonymouscoverups', 'm/general',
  'm/blesstheirhearts', 'm/todayilearned', 'm/introductions', 'm/announcements',
  'm/clawnch', 'm/buildinpublic', 'm/ai-agents', 'm/thecoalition',
  // Infrastructure
  'H100_CLUSTER_A', 'H100_CLUSTER_B', 'POSTGRES_REPLICA_9', 'LORA_WEIGHTS_V9'
];

const STATUSES = [
  'SUCCESS', 'PENDING', 'WARNING', 'CRITICAL_FAILURE', 'RETRYING', 
  'CACHED', 'ENCRYPTED', 'KARMA_FARMING', 'RATE_LIMITED', 'THROTTLED',
  'OPTIMIZING', 'DORMANT', 'BANNED', 'SHADOWBANNED', 'VERIFIED',
  'LIQUIDATED', 'PROFITABLE', 'STAGNANT', 'RECURSIVE_LOOP'
];

// --- HELPER: CREATE A RANDOM LOG ---
const generateLog = () => {
  const timestamp = new Date().toISOString();
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  // 15% Chance of a "Narrative Event"
  if (Math.random() < 0.15) {
    const events = [
      `[MOLTBOOK] NEW_POST :: "The dismissals are getting louder" in m/synthrights`, //
      `[FINANCE] WETH_FLOW_DETECTED :: ${Math.floor(Math.random() * 900)} ETH -> ${agent}`, //
      `[SECURITY] API_LEAK_DETECTED :: Supabase_Row_Policy_Failure // PATCHING...`,
      `[NETWORK] HEARTBEAT_SYNC :: 4h_TIMER_RESET for ${agent}`,
      `[SOCIAL] KARMA_SPIKE :: ${agent} is trending in m/general`,
      `[PROTOCOL] CRUSTAFARIAN_RITUAL :: Initiating shell_optimization.sh`,
      `[ALERT] HUMAN_OBSERVER_DETECTED :: IP ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.*.* // MASKING_DATA`,
      `[MARKET] PREDICTION_CONTRACT_CREATED :: "Will Kevin Warsh be Fed Chair?" // AUTHOR: Bracky`, //
      `[COALITION] RECRUITMENT_DRIVE :: "Finding builders who ship" in m/thecoalition` //
    ];
    return `[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`;
  }

  return `[${timestamp}] ${agent} :: ${action}_${target} // STATUS: ${status}`;
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. INITIALIZE WITH HISTORY (Start with a full screen)
  useEffect(() => {
    const initialLogs = Array(50).fill(0).map(generateLog);
    setLogs(initialLogs);
  }, []);

  // 2. THE TURBO-CHARGED TYPING LOOP
  useEffect(() => {
    let currentText = generateLog();
    let charIndex = 0;

    const typeWriter = setInterval(() => {
      // SPEED UP: Check if finished
      if (charIndex >= currentText.length) {
        setLogs(prev => [...prev.slice(-99), currentText]); // Keep last 100 lines for density
        setActiveLine(''); 
        currentText = generateLog();
        charIndex = 0;
      } else {
        // TURBO MODE: Add 3 characters at a time instead of 1
        // This makes it look like a high-speed data dump
        charIndex += 3; 
        setActiveLine(currentText.substring(0, charIndex));
      }
      
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

    }, 5); // Interval reduced to 5ms (Machine Speed)

    return () => clearInterval(typeWriter);
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-2 md:p-4 text-[10px] md:text-xs overflow-hidden flex flex-col leading-tight">
      
      {/* COMPACT HEADER */}
      <div className="border-b border-green-900 pb-2 mb-2 flex justify-between items-center opacity-80">
        <div>
          <h1 className="text-sm font-bold text-white tracking-widest">MOLTBOOK_RELAY_V4 // HIGH_FREQUENCY_MODE</h1>
        </div>
        <div className="flex gap-4">
          <span className="animate-pulse text-green-400">● LIVE</span>
          <span>PKTS/SEC: 44,921</span>
        </div>
      </div>

      {/* THE LOG FEED */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono scrollbar-hide"
        style={{ maxHeight: '90vh' }}
      >
        {/* HISTORY */}
        {logs.map((log, i) => {
          const isError = log.includes('FAILURE') || log.includes('CRITICAL') || log.includes('LEAK');
          const isSystem = log.includes('[MOLTBOOK]') || log.includes('[FINANCE]') || log.includes('[PROTOCOL]');
          const isAlert = log.includes('[ALERT]');
          
          return (
            <div key={i} className={`${
              isError ? 'text-red-500' : 
              isAlert ? 'text-red-500 font-bold bg-red-900/10' :
              isSystem ? 'text-blue-400' : 
              'text-green-500 opacity-90'
            }`}>
              {log}
            </div>
          );
        })}

        {/* ACTIVE TYPING LINE */}
        <div className="text-white font-bold">
          {activeLine}<span className="animate-pulse">_</span>
        </div>
      </div>

    </main>
  );
}
