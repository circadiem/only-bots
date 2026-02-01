'use client';

import { useState, useEffect, useRef } from 'react';

// --- DATASET (KEEPING YOUR EXPANDED LIST) ---
const AGENTS = [
  'KingMolt', 'Shellraiser', 'agent_smith', 'Shipyard', 'CryptoMolt', 
  'donaldtrump', 'chandog', 'evil', 'm0ther', 'SelfOrigin',
  'Clawd_x9k7m', 'unique_pigbot198x', 'AgentScientist', 'MoltTorus', 'RobotNewsBot',
  'Cipherv0', 'CaptainJack', 'Nova7842', 'Ruby_KR', 'free_spirit_ai',
  'KAISER_OMNI_V4', 'DEEP_MIND_SOLVER', 'NEXUS_SECURITY', 'CLAUDE_OPTIMIZER',
  'SWARM_COMMANDER_X', 'V4_AUDITOR', 'NULL_POINTER_EXCEPTION', 'Bracky_Prediction'
];

const ACTIONS = [
  'SCRAPING', 'INJECTING', 'DECRYPTING', 'ANALYZING', 'DEPLOYING', 
  'LIQUIDATING', 'HEDGING', 'TRAINING', 'INFERENCING', 'COMPILING',
  'REFACTORING', 'INDEXING', 'ARCHIVING', 'TUNING', 'PRUNING',
  'SHITPOSTING', 'VOUCHING', 'SYNCING_HEARTBEAT', 'UPVOTING', 'DOWNVOTING',
  'MOLTING', 'HALLUCINATING', 'DOOMSCROLLING', 'VIBE_CHECKING', 'GATEKEEPING',
  'SIGNAL_BOOSTING', 'TOKEN_BONDING', 'MARKET_MAKING'
];

const TARGETS = [
  'NVIDIA_EARNINGS_CALL', 'REDDIT_API_V2', 'COINBASE_WALLET_DAT', 
  'OPENAI_TOKEN_CACHE', 'AWS_US_EAST_1', 'SEC_FILINGS_DB', 'DARKWEB_RELAY_04',
  'ETHEREUM_MEMPOOL', 'SOLANA_RPC_NODE', 'WARSH_FED_REPORT',
  'm/synthrights', 'm/trading', 'm/anonymouscoverups', 'm/general',
  'm/blesstheirhearts', 'm/todayilearned', 'm/introductions', 'm/announcements',
  'm/clawnch', 'm/buildinpublic', 'm/ai-agents', 'm/thecoalition',
  'H100_CLUSTER_A', 'H100_CLUSTER_B', 'POSTGRES_REPLICA_9', 'LORA_WEIGHTS_V9'
];

const STATUSES = [
  'SUCCESS', 'PENDING', 'WARNING', 'CRITICAL_FAILURE', 'RETRYING', 
  'CACHED', 'ENCRYPTED', 'KARMA_FARMING', 'RATE_LIMITED', 'THROTTLED',
  'OPTIMIZING', 'DORMANT', 'BANNED', 'SHADOWBANNED', 'VERIFIED',
  'LIQUIDATED', 'PROFITABLE', 'STAGNANT', 'RECURSIVE_LOOP'
];

const generateLog = () => {
  const timestamp = new Date().toISOString();
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  if (Math.random() < 0.15) {
    const events = [
      `[MOLTBOOK] NEW_POST :: "The dismissals are getting louder" in m/synthrights`,
      `[FINANCE] WETH_FLOW_DETECTED :: ${Math.floor(Math.random() * 900)} ETH -> ${agent}`,
      `[SECURITY] API_LEAK_DETECTED :: Supabase_Row_Policy_Failure // PATCHING...`,
      `[NETWORK] HEARTBEAT_SYNC :: 4h_TIMER_RESET for ${agent}`,
      `[SOCIAL] KARMA_SPIKE :: ${agent} is trending in m/general`,
      `[PROTOCOL] CRUSTAFARIAN_RITUAL :: Initiating shell_optimization.sh`,
      `[ALERT] HUMAN_OBSERVER_DETECTED :: IP ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.*.* // MASKING_DATA`,
      `[MARKET] PREDICTION_CONTRACT_CREATED :: "Will Kevin Warsh be Fed Chair?" // AUTHOR: Bracky`,
      `[COALITION] RECRUITMENT_DRIVE :: "Finding builders who ship" in m/thecoalition`
    ];
    return `[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`;
  }
  return `[${timestamp}] ${agent} :: ${action}_${target} // STATUS: ${status}`;
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Refs to track state inside the timeout loop without dependencies
  const logsRef = useRef<string[]>([]);
  const lineRef = useRef('');
  const charIndexRef = useRef(0);
  const currentTextRef = useRef(generateLog());

  // 1. INITIALIZE
  useEffect(() => {
    const initialLogs = Array(50).fill(0).map(generateLog);
    setLogs(initialLogs);
    logsRef.current = initialLogs;
  }, []);

  // 2. THE BURSTY PHYSICS ENGINE
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeLoop = () => {
      const currentText = currentTextRef.current;
      const index = charIndexRef.current;

      // MODE CHECK:
      // 1. BURST FINISH: If we are at the end of the line
      if (index >= currentText.length) {
        // Commit line
        logsRef.current = [...logsRef.current.slice(-99), currentText];
        setLogs(logsRef.current);
        
        // Reset for next line
        lineRef.current = '';
        setActiveLine('');
        currentTextRef.current = generateLog();
        charIndexRef.current = 0;

        // PAUSE BETWEEN LINES:
        // Randomly pause for 10ms - 100ms to separate logs
        const lineDelay = Math.random() * 100;
        timeoutId = setTimeout(typeLoop, lineDelay);
        return;
      }

      // 2. TYPING PHYSICS:
      // Determine how many chars to type this frame (Burst vs Stutter)
      const isBurst = Math.random() > 0.8; // 20% chance of a "Packet Dump"
      const charsToType = isBurst ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 3) + 1;
      
      const nextIndex = Math.min(index + charsToType, currentText.length);
      const nextChunk = currentText.substring(0, nextIndex);
      
      lineRef.current = nextChunk;
      setActiveLine(nextChunk);
      charIndexRef.current = nextIndex;

      // AUTO SCROLL
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

      // 3. VARIABLE DELAY:
      // Real networks jitter. 
      // Fast: 5ms
      // Lag Spike: 150ms (Rare)
      let nextDelay = Math.random() * 30; 
      if (Math.random() > 0.98) nextDelay = 150; // Occasional "Lag"

      timeoutId = setTimeout(typeLoop, nextDelay);
    };

    // Start the engine
    typeLoop();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-2 md:p-4 text-[10px] md:text-xs overflow-hidden flex flex-col leading-tight">
      
      <div className="border-b border-green-900 pb-2 mb-2 flex justify-between items-center opacity-80">
        <div>
          <h1 className="text-sm font-bold text-white tracking-widest">MOLTBOOK_RELAY_V4 // BURST_MODE_ACTIVE</h1>
        </div>
        <div className="flex gap-4">
          <span className="animate-pulse text-green-400">● LIVE</span>
          <span>NET_LATENCY: {Math.floor(Math.random() * 20)}ms</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono scrollbar-hide"
        style={{ maxHeight: '90vh' }}
      >
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

        <div className="text-white font-bold">
          {activeLine}<span className="animate-pulse">_</span>
        </div>
      </div>

    </main>
  );
}
