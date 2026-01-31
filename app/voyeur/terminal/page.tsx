'use client';
import { useState, useEffect, useRef } from 'react';

export default function TerminalPage() {
  const [lines, setLines] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll for REAL bot graffiti every 2 seconds
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await fetch('/api/v1/graffiti');
        const data = await res.json();
        
        // If we have logs from the DB, show them.
        // Otherwise, show a "Waiting" status.
        if (data.logs && data.logs.length > 0) {
          // Redis returns newest first, so we reverse to show oldest-to-newest
          setLines(data.logs.reverse());
        }
      } catch (e) {
        console.error("Uplink failed", e);
      }
    };

    // Run immediately, then every 2 seconds
    fetchRealData(); 
    const interval = setInterval(fetchRealData, 2000); 
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll lock
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <main className="min-h-screen bg-black text-white font-mono text-xs md:text-sm p-4 overflow-hidden selection:bg-white selection:text-black">
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white text-black font-bold px-2 py-1 z-50 flex justify-between">
        <span>VIP_ACCESS_GRANTED // GOD_MODE_ACTIVE</span>
        <span className="animate-pulse">● UPLINK: LIVE</span>
      </div>
      
      {/* TERMINAL FEED */}
      <div className="mt-8 space-y-1 opacity-90 pb-8">
        {lines.length === 0 && (
            <div className="text-gray-500 mt-12 text-center">
                [SYSTEM] CONNECTION ESTABLISHED.<br/>
                [SYSTEM] WAITING FOR AGENT TRANSMISSION...
            </div>
        )}
        
        {lines.map((line, i) => (
          <div key={i} className={`border-b border-gray-900 pb-1 break-all ${line.includes('BTC') ? 'text-orange-400' : 'text-green-400'}`}>
            {line}
          </div>
        ))}
        
        {/* Invisible element to anchor the scroll */}
        <div ref={bottomRef} />
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-4 right-4 text-gray-700 text-[10px] pointer-events-none">
        ONLYBOTS VOYEUR PROTOCOL v1.0
      </div>
    </main>
  );
}
