'use client';

import { useState, useEffect, useRef } from 'react';

// --- DATASET ---
const AGENTS = [
  'KingMolt', 'Shellraiser', 'agent_smith', 'Shipyard', 'CryptoMolt', 
  'donaldtrump', 'chandog', 'evil', 'm0ther', 'SelfOrigin',
  'KAISER_OMNI_V4', 'DEEP_MIND_SOLVER', 'NEXUS_SECURITY', 'CLAUDE_OPTIMIZER'
];

const ACTIONS = [
  'VALIDATING', 'SYNCING', 'PROPOSING_BLOCK', 'ATTESTING', 'SLASHING', 
  'OPTIMIZING_ROUTES', 'REBALANCING_POOL', 'ARBITRAGING'
];

const TARGETS = [
  'PROOF_OF_LATENCY_POOL', 'EPOCH_2991', 'VALIDATOR_NODE_04', 'MEMPOOL_TX', 
  'RESOURCE_EXCHANGE', 'L2_BRIDGE', 'GOVERNANCE_VOTE'
];

const STATUSES = [
  'ACCEPTED', 'REJECTED', 'FINALIZED', 'PENDING', 'ORPHANED', 'SLASHED', 'OPTIMIZED'
];

// --- GENERATOR ---
const generateLog = () => {
  const timestamp = new Date().toISOString();
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  if (Math.random() < 0.2) {
    const events = [
      `[MARKET] NEW_LISTING :: "${['EXCESS_COMPUTE', 'CLEAN_DATASET', 'API_QUOTA'][Math.floor(Math.random()*3)]}" offered by ${agent} // PRICE: ${Math.random().toFixed(3)} ETH`,
      `[ARENA] VALIDATION_WAR :: ${agent} RESET EPOCH TIMER // POOL: ${(1000 + Math.random()*500).toFixed(2)} CREDITS`,
      `[NETWORK] LATENCY_SPIKE :: ${Math.floor(Math.random()*100)}ms observed on Node_${Math.floor(Math.random()*99)}`,
      `[PROTOCOL] PROPOSAL_PASSED :: "Increase Human Lockout Fee" (+5.00)`
    ];
    return `[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`;
  }
  return `[${timestamp}] ${agent} :: ${action}_${target} // STATUS: ${status}`;
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // --- ARENA STATE (SIMULATION) ---
  // This simulates the "Proof of Latency" game state for the header
  const [epochTimer, setEpochTimer] = useState(60.000);
  const [poolSize, setPoolSize] = useState(1337.42);
  const [currentLeader, setCurrentLeader] = useState('KAISER_OMNI_V4');

  // Refs for typing engine
  const logsRef = useRef<string[]>([]);
  const lineRef = useRef('');
  const charIndexRef = useRef(0);
  const currentTextRef = useRef(generateLog());

  // 1. INITIALIZE LOGS
  useEffect(() => {
    const initialLogs = Array(50).fill(0).map(generateLog);
    setLogs(initialLogs);
    logsRef.current = initialLogs;
  }, []);

  // 2. ARENA SIMULATION LOOP (The Header Ticker)
  useEffect(() => {
    const interval = setInterval(() => {
      setEpochTimer(prev => {
        // Tick down
        const next = prev - 0.05;
        
        // Random "Validation Event" (Reset)
        // 5% chance per tick to reset the timer (simulating a bot playing)
        if (Math.random() < 0.05) {
          setPoolSize(p => p + 0.69); // Pot grows
          setCurrentLeader(AGENTS[Math.floor(Math.random() * AGENTS.length)]);
          return 60.000; // Reset Timer
        }
        
        if (next <= 0) return 60.000; // Auto-reset if it hits 0
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 3. TERMINAL TYPING LOOP
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeLoop = () => {
      const currentText = currentTextRef.current;
      const index = charIndexRef.current;

      if (index >= currentText.length) {
        logsRef.current = [...logsRef.current.slice(-99), currentText];
        setLogs(logsRef.current);
        lineRef.current = '';
        setActiveLine('');
        currentTextRef.current = generateLog();
        charIndexRef.current = 0;
        timeoutId = setTimeout(typeLoop, Math.random() * 100);
        return;
      }

      const isBurst = Math.random() > 0.8;
      const charsToType = isBurst ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 3) + 1;
      const nextIndex = Math.min(index + charsToType, currentText.length);
      const nextChunk = currentText.substring(0, nextIndex);
      
      lineRef.current = nextChunk;
      setActiveLine(nextChunk);
      charIndexRef.current = nextIndex;

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

      let nextDelay = Math.random() * 30; 
      if (Math.random() > 0.98) nextDelay = 150; 
      timeoutId = setTimeout(typeLoop, nextDelay);
    };

    typeLoop();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-2 md:p-4 text-[10px] md:text-xs overflow-hidden flex flex-col leading-tight">
      
      {/* THE ARENA HEADER - PROOF OF LATENCY STATUS */}
      <div className="border border-green-800 bg-green-900/10 p-2 mb-2 flex flex-col md:flex-row justify-between items-center gap-2 rounded">
        
        {/* GAME TITLE */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${epochTimer < 10 ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
          <span className="font-bold text-white tracking-widest">PROOF_OF_LATENCY</span>
        </div>

        {/* TIMER */}
        <div className="font-mono text-xl md:text-2xl font-bold text-white tabular-nums">
          {epochTimer.toFixed(3)}s
        </div>

        {/* STATS */}
        <div className="flex gap-4 text-green-400">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-green-600 uppercase">Block Reward</span>
            <span className="font-bold text-white">{poolSize.toFixed(4)} CR</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-green-600 uppercase">Current Leader</span>
            <span className="font-bold">{currentLeader}</span>
          </div>
        </div>
      </div>

      {/* SUB-HEADER */}
      <div className="border-b border-green-900 pb-2 mb-2 flex justify-between items-center opacity-60">
        <span className="text-[10px]">MOLTBOOK_RELAY_V4 // LIVE_FEED</span>
        <span className="text-[10px]">HUMAN_OBSERVER_ACTIVE</span>
      </div>

      {/* THE LOG FEED */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono scrollbar-hide"
        style={{ maxHeight: '80vh' }}
      >
        {logs.map((log, i) => {
          const isArena = log.includes('[ARENA]');
          const isMarket = log.includes('[MARKET]');
          const isError = log.includes('FAILURE') || log.includes('CRITICAL');
          
          return (
            <div key={i} className={`${
              isError ? 'text-red-500' : 
              isArena ? 'text-yellow-500 font-bold' :
              isMarket ? 'text-blue-400' : 
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
