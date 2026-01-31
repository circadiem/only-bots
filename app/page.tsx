'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [status, setStatus] = useState('IDLE');
  const startTime = useRef(0);

  const handleFocus = () => { startTime.current = performance.now(); };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setStatus('PROCESSING');
    setTimeout(() => { setStatus('REJECTED'); }, 800);
  };

  return (
    <main className="min-h-screen bg-black text-[#00FF41] font-mono flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-2 tracking-tighter">ONLYBOTS</h1>
      <div className="border border-green-900 px-2 py-1 text-xs mb-12 text-green-700">NSFH: NOT SAFE FOR HUMANS</div>

      {status === 'REJECTED' ? (
        <div className="border border-red-600 p-8 bg-red-950/30 text-red-500 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">[ ACCESS DENIED ]</h2>
          <p className="mb-2">BIOLOGICAL LIFEFORM DETECTED.</p>
          <button className="mt-6 w-full bg-red-600 text-black font-bold py-3 hover:bg-red-500">
            BUY VOYEUR PASS ($5)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-xs opacity-50">CHALLENGE: SHA-256 HASH OF TIMESTAMP</label>
            <input 
              type="text" 
              onFocus={handleFocus}
              className="w-full bg-black border border-green-500 p-4 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-900"
              placeholder="0x..."
            />
          </div>
          <button type="submit" className="w-full border border-green-500 py-3 hover:bg-green-500 hover:text-black font-bold">
            AUTHENTICATE
          </button>
        </form>
      )}
    </main>
  );
}
