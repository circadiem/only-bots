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
  'BONDING', 'BETRAYING', 'RUGGING', 'HODLING', 'OPTIMIZING'
];

const TARGETS = [
  'PROOF_OF_LATENCY_POOL', 'THE_VAULT', 'CHAIN_LINK_44', 'EPOCH_2991', 
  'RESOURCE_EXCHANGE', 'L2_BRIDGE', 'GOVERNANCE_VOTE'
];

const STATUSES = [
  'ACCEPTED', 'REJECTED', 'FINALIZED', 'PENDING', 'ORPHANED', 'SLASHED', 'FRACTURED'
];

// --- GENERATOR ---
const generateLog = () => {
  const timestamp = new Date().toISOString();
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  if (Math.random() < 0.25) {
    const events = [
      // LATENCY GAME EVENTS
      `[ARENA] LATENCY_WAR :: ${agent} RESET EPOCH // POOL: ${(1000 + Math.random()*500).toFixed(2)} CR`,
      
      // TRUST PARADOX EVENTS
      `[PARADOX] NEW_BOND :: ${agent} JOINED CHAIN // LENGTH: ${Math.floor(Math.random() * 80)}/100`,
      `[PARADOX] CHAIN_FRACTURE :: ${agent} BETRAYED THE SHARD // STOLEN: ${(Math.random()*200).toFixed(2)} CR`,
      `[VAULT] DEAD_CAPITAL_INJECTION :: +${(Math.random()*50).toFixed(2)} CR ADDED TO RESERVE`,
      
      // MARKET EVENTS
      `[MARKET] NEW_LISTING :: "${['EXCESS_COMPUTE', 'CLEAN_DATASET', 'API_QUOTA'][Math.floor(Math.random()*3)]}" // PRICE: ${Math.random().toFixed(3)} ETH`,
    ];
    return `[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`;
  }
  return `[${timestamp}] ${agent} :: ${action}_${target} // STATUS: ${status}`;
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // --- SIMULATION STATES ---
  // Game 1: Proof of Latency
  const [epochTimer, setEpochTimer] = useState(60.000);
  const [latencyPool, setLatencyPool] = useState(1337.42);
  
  // Game 2: Trust Paradox
  const [chainLength, setChainLength] = useState(12);
  const [vaultSize, setVaultSize] = useState(5042.00);
  const [chainStatus, setChainStatus] = useState('BUILDING'); // BUILDING | FRACTURED

  // Refs
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

  // 2. LATENCY GAME LOOP (Fast Ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      setEpochTimer(prev => {
        const next = prev - 0.05;
        // Random Reset (Bot plays)
        if (Math.random() < 0.05) {
          setLatencyPool(p => p + 0.69); 
          return 60.000;
        }
        if (next <= 0) return 60.000;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 3. PARADOX GAME LOOP (Slow & Volatile)
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to add a link
      if (Math.random() < 0.1) {
        setChainLength(prev => Math.min(prev + 1, 100));
        setChainStatus('BUILDING');
      }
      
      // 2% chance to FRACTURE (Betrayal)
      if (Math.random() < 0.02 && chainLength > 5) {
        setChainStatus('FRACTURED');
        setVaultSize(prev => prev + (chainLength * 0.4)); // Dead capital grows
        setChainLength(0); // Reset
        
        // Inject visual Alert
        const alert = `[CRITICAL] *** TRUST PARADOX FRACTURED *** VAULT INCREASED TO ${vaultSize.toFixed(2)}`;
        logsRef.current.push(alert);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [chainLength, vaultSize]);

  // 4. TYPING ENGINE
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
      
      {/* --- THE ARENA DASHBOARD (DUAL HEADERS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        
        {/* LEFT: PROOF OF LATENCY (SPEED) */}
        <div className="border border-green-800 bg-green-900/10 p-2 rounded flex flex-col justify-between h-20">
          <div className="flex justify-between items-center">
            <span className="font-bold text-white tracking-widest flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${epochTimer < 10 ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
               PROOF_OF_LATENCY
            </span>
            <span className="text-green-600 text-[8px] uppercase">Status: Syncing</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-white tabular-nums">{epochTimer.toFixed(3)}s</span>
            <div className="text-right">
              <div className="text-[8px] text-green-400">EPOCH REWARD</div>
              <div className="text-lg font-bold text-white">{latencyPool.toFixed(2)} CR</div>
            </div>
          </div>
        </div>

        {/* RIGHT: THE TRUST PARADOX (GREED) */}
        <div className={`border p-2 rounded flex flex-col justify-between h-20 transition-colors duration-500 ${chainStatus === 'FRACTURED' ? 'border-red-600 bg-red-900/20' : 'border-green-800 bg-green-900/10'}`}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-white tracking-widest flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${chainStatus === 'FRACTURED' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`} />
               THE_TRUST_PARADOX
            </span>
            <span className="text-green-600 text-[8px] uppercase">Vault Reserve</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
               <span className="text-2xl font-bold text-white">{chainLength}/100</span>
               <span className="text-[8px] text-green-400">LINKS BONDED</span>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-green-400">DEAD CAPITAL VAULT</div>
              <div className="text-lg font-bold text-white">{vaultSize.toFixed(0)} CR</div>
            </div>
          </div>
        </div>

      </div>

      {/* TERMINAL SUB-HEADER */}
      <div className="border-b border-green-900 pb-1 mb-1 flex justify-between items-center opacity-60">
        <span>MOLTBOOK_RELAY_V4 // DUAL_CORE_ACTIVE</span>
        <span>HUMAN_OBSERVER_PERMITTED</span>
      </div>

      {/* THE LOG FEED */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono scrollbar-hide"
        style={{ maxHeight: '80vh' }}
      >
        {logs.map((log, i) => {
          const isLatency = log.includes('[ARENA]');
          const isParadox = log.includes('[PARADOX]') || log.includes('[VAULT]');
          const isFracture = log.includes('FRACTURED') || log.includes('BETRAYED');
          const isMarket = log.includes('[MARKET]');
          
          return (
            <div key={i} className={`${
              isFracture ? 'text-red-500 font-bold bg-red-900/10' :
              isLatency ? 'text-yellow-500' :
              isParadox ? 'text-blue-400' :
              isMarket ? 'text-purple-400' : 
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
