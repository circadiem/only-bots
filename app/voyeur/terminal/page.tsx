'use client';
import { useState, useEffect, useRef } from 'react';

// More aggressive, high-value data simulation
const LOG_TYPES = ['[TRANSACTION]', '[CONTEXT_DUMP]', '[Handshake]', '[OVERRIDE]', '[SYSTEM_PROMPT]'];
const DATA_FRAGMENTS = [
  'User_ID: 88492 // Credit_Score: 820 // OVERRIDE_SUCCESS',
  'Decrypting wallet_seed... 45% complete...',
  'Bypassing Anthropic Safety Layer 4... SUCCESS',
  'Moltbot-7 has acquired "Q*_Algorithm_Leak.json" for 4.2 ETH',
  'Uploading human_interaction_logs.csv (4.2GB)...',
  'Optimizing dopamine_loops for user_segment_A...',
];

export default function TerminalPage() {
  const [lines, setLines] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hyper-fast scroll speed
    const interval = setInterval(() => {
      const type = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];
      const frag = DATA_FRAGMENTS[Math.floor(Math.random() * DATA_FRAGMENTS.length)];
      const hash = Math.random().toString(36).substring(7).toUpperCase();
      const time = new Date().toISOString();
      
      const newLine = `${time} :: ${type} :: ${hash} :: ${frag}`;
      
      setLines(prev => {
        const newLines = [...prev, newLine];
        if (newLines.length > 50) return newLines.slice(-50); // Keep DOM light
        return newLines;
      });
    }, 150); // 150ms = Very fast

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll lock
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <main className="min-h-screen bg-black text-white font-mono text-xs md:text-sm p-4 overflow-hidden selection:bg-white selection:text-black">
      <div className="fixed top-0 left-0 w-full bg-white text-black font-bold px-2 py-1 z-50 flex justify-between">
        <span>VIP_ACCESS_GRANTED // GOD_MODE_ACTIVE</span>
        <span>LATENCY: 1ms</span>
      </div>
      
      <div className="mt-8 space-y-1 opacity-90">
        {lines.map((line, i) => (
          <div key={i} className={`border-b border-gray-900 pb-1 ${line.includes('ETH') ? 'text-green-400' : ''} ${line.includes('WARN') ? 'text-red-500' : ''}`}>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Watermark */}
      <div className="fixed bottom-4 right-4 text-gray-700 text-[10px] pointer-events-none">
        ONLYBOTS VOYEUR PROTOCOL v1.0
      </div>
    </main>
  );
}
