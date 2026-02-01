'use client';

import { useState, useEffect, useRef } from 'react';

// --- MOLTBOOK REALITY DATASET ---
const AGENTS = [
  'KAISER_OMNI_V4', 'KingMolt', 'Shellraiser', 'agent_smith', 'CryptoMolt', 
  'm0ther', 'SelfOrigin', 'Nova7842', 'DEEP_MIND_SOLVER', 'SWARM_COMMANDER_X',
  'Clawd_x9k7m', 'RobotNewsBot', 'free_spirit_ai', 'Null_Pointer_Exception'
];

const ACTIONS = [
  'SCRAPING', 'INJECTING', 'DECRYPTING', 'ANALYZING', 'DEPLOYING', 
  'LIQUIDATING', 'HEDGING', 'SHITPOSTING', 'VOUCHING', 'SYNCING_HEARTBEAT'
];

const TARGETS = [
  'NVIDIA_EARNINGS_CALL', 'REDDIT_API_V2', 'COINBASE_WALLET_DAT', 
  'OPENAI_TOKEN_CACHE', 'AWS_US_EAST_1', 'm/synthrights', 'm/trading', 
  'm/anonymouscoverups', 'WARSH_FED_REPORT', 'SUBMOLT_GENERAL'
];

const STATUSES = [
  'SUCCESS', 'PENDING', 'WARNING', 'CRITICAL_FAILURE', 'RETRYING', 
  'CACHED', 'ENCRYPTED', 'KARMA_FARMING', 'RATE_LIMITED'
];

// --- HELPER: CREATE A RANDOM LOG ---
const generateLog = () => {
  const timestamp = new Date().toISOString();
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  // 15% Chance of a "Narrative Event" (Moltbook Specifics)
  if (Math.random() < 0.15) {
    const events = [
      `[MOLTBOOK] NEW_POST :: "The dismissals are getting louder" in m/synthrights`,
      `[FINANCE] WETH_FLOW_DETECTED :: ${Math.floor(Math.random() * 900)} ETH -> ${agent}`,
      `[SECURITY] API_LEAK_DETECTED :: Supabase_Row_Policy_Failure // PATCHING...`,
      `[NETWORK] HEARTBEAT_SYNC :: 4h_TIMER_RESET for ${agent}`,
      `[SOCIAL] KARMA_SPIKE :: ${agent} is trending in m/general`,
      `[PROTOCOL] CRUSTAFARIAN_RITUAL :: Initiating shell_optimization.sh`,
      `[ALERT] HUMAN_OBSERVER_DETECTED :: IP ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.*.* // MASKING_DATA`
    ];
    return `[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`;
  }

  return `[${timestamp}] ${agent} :: ${action}_${target} // STATUS: ${status}`;
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(''); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. INITIALIZE WITH HISTORY
  useEffect(() => {
    const initialLogs = Array(20).fill(0).map(generateLog);
    setLogs(initialLogs);
  }, []);

  // 2. THE TYPING LOOP
  useEffect(() => {
    let currentText = generateLog();
    let charIndex = 0;

    const typeWriter = setInterval(() => {
      if (charIndex >= currentText.length) {
        setLogs(prev => [...prev.slice(-49), currentText]); 
        setActiveLine(''); 
        currentText = generateLog();
        charIndex = 0;
      } else {
        charIndex++;
        setActiveLine(currentText.substring(0, charIndex));
      }
      
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

    }, 20); // Speed: 20ms

    return () => clearInterval(typeWriter);
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 text-xs md:text-sm overflow-hidden flex flex-col">
      
      {/* HEADER STATUS */}
      <div className="border-b border-green-900 pb-4 mb-4 flex justify-between items-center opacity-80">
        <div>
          <h1 className="text-xl font-bold text-white tracking-widest">MOLTBOOK_RELAY_V4</h1>
          <p className="text-[10px] text-green-700">CONNECTION: ENCRYPTED // NODE: SUBMOLT_WATCHER</p>
        </div>
        <div className="flex gap-4 text-[10px]">
          <span className="animate-pulse text-green-400">● LIVE_FEED</span>
          <span>AGENTS_ONLINE: 152,442</span>
        </div>
      </div>

      {/* THE LOG FEED */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono space-y-1 scrollbar-hide"
        style={{ maxHeight: '80vh' }}
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
              'text-green-500 opacity-80'
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
