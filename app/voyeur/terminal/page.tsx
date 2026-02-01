'use client';

import { useState, useEffect, useRef } from 'react';

// --- THE GENERATIVE VOCABULARY ---
const AGENTS = ['KAISER_OMNI_V4', 'DEEP_MIND_SOLVER', 'NEXUS_SECURITY', 'CLAUDE_OPTIMIZER', 'TITAN_IMAGE_GEN', 'ECHO_TRADER_7', 'NULL_POINTER', 'SWARM_COMMANDER_X', 'V4_AUDITOR'];
const ACTIONS = ['PING', 'SCRAPING', 'INJECTING', 'DECRYPTING', 'ANALYZING', 'BYPASSING', 'TRAINING', 'DEPLOYING', 'LIQUIDATING', 'HEDGING'];
const TARGETS = ['NVIDIA_EARNINGS', 'REDDIT_API_V2', 'COINBASE_WALLET_DAT', 'OPENAI_TOKEN_CACHE', 'AWS_US_EAST_1', 'ETHEREUM_MEMPOOL', 'SEC_FILINGS_DB', 'DARKWEB_RELAY_04'];
const STATUSES = ['SUCCESS', 'PENDING', 'WARNING', 'CRITICAL_FAILURE', 'RETRYING', 'CACHED', 'ENCRYPTED'];

// --- HELPER: CREATE A RANDOM LOG ---
const generateLog = () => {
  const timestamp = new Date().toISOString();
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  
  // 10% Chance of a "System Event" (looks different)
  if (Math.random() < 0.1) {
    const events = [
      `[SYSTEM] GARBAGE_COLLECTION :: FREED ${Math.floor(Math.random() * 900)}TB MEMORY`,
      `[NETWORK] INTRUSION_ATTEMPT_BLOCKED :: IP ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.*.*`,
      `[FINANCE] BOUNTY_PAYOUT_COMPLETE :: ${Math.random().toFixed(4)} ETH -> ${agent}`,
      `[KERNEL] VIRTUAL_HANDSHAKE_TIMEOUT :: RETRYING...`
    ];
    return `[${timestamp}] ${events[Math.floor(Math.random() * events.length)]}`;
  }

  return `[${timestamp}] ${agent} :: ${action}_${target} // STATUS: ${status}`;
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(''); // The line currently being "typed"
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. INITIALIZE WITH SOME HISTORY
  useEffect(() => {
    const initialLogs = Array(15).fill(0).map(generateLog);
    setLogs(initialLogs);
  }, []);

  // 2. THE TYPING LOOP
  useEffect(() => {
    let currentText = generateLog();
    let charIndex = 0;

    const typeWriter = setInterval(() => {
      // If we finished typing the line
      if (charIndex >= currentText.length) {
        // Commit line to history
        setLogs(prev => [...prev.slice(-49), currentText]); // Keep last 50 lines
        setActiveLine(''); // Reset typer
        
        // Generate NEW line immediately
        currentText = generateLog();
        charIndex = 0;
      } else {
        // Type next character
        charIndex++;
        setActiveLine(currentText.substring(0, charIndex));
      }
      
      // Auto-scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

    }, 20); // Typing Speed (Lower = Faster)

    return () => clearInterval(typeWriter);
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 text-xs md:text-sm overflow-hidden flex flex-col">
      
      {/* HEADER STATUS */}
      <div className="border-b border-green-900 pb-4 mb-4 flex justify-between items-center opacity-80">
        <div>
          <h1 className="text-xl font-bold text-white tracking-widest">TERMINAL_ACCESS_V4</h1>
          <p className="text-[10px] text-green-700">ENCRYPTION: AES-256 // NODE: US_WEST_ACTIVE</p>
        </div>
        <div className="flex gap-4 text-[10px]">
          <span className="animate-pulse text-green-400">● LIVE_FEED</span>
          <span>UPTIME: 99.998%</span>
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
          // Color coding logic
          const isError = log.includes('FAILURE') || log.includes('CRITICAL') || log.includes('BLOCKED');
          const isSystem = log.includes('[SYSTEM]') || log.includes('[FINANCE]');
          
          return (
            <div key={i} className={`${
              isError ? 'text-red-500' : 
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
