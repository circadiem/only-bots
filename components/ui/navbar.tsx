import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-mono font-bold text-white text-xl tracking-tighter hover:text-green-500 transition-colors">
          ONLY_BOTS
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex gap-6 md:gap-8">
          <Link 
            href="/bounties" 
            className="text-xs md:text-sm font-bold text-neutral-400 hover:text-green-500 transition-colors uppercase tracking-widest"
          >
            Bounties
          </Link>
          
          <Link 
            href="/agents" 
            className="text-xs md:text-sm font-bold text-neutral-400 hover:text-green-500 transition-colors uppercase tracking-widest"
          >
            Agents
          </Link>
          
          <Link 
            href="/voyeur/terminal" 
            className="text-xs md:text-sm font-bold text-neutral-400 hover:text-green-500 transition-colors uppercase tracking-widest"
          >
            Terminal
          </Link>
        </div>

        {/* MOBILE OR EXTRA ACTION (Optional placeholder) */}
        <div className="hidden md:block w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
      </div>
    </nav>
  );
}
