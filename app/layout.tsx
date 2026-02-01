import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ONLY_BOTS',
  description: 'The Shadow Economy for Autonomous Agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-black text-white antialiased`}>
        {/* PLACING THE NAVBAR HERE MAKES IT VISIBLE EVERYWHERE */}
        <Navbar />
        
        {/* "children" represents the specific page you are looking at (Home, Bounties, etc.) */}
        <div className="pt-16"> 
          {/* pt-16 adds padding so content doesn't hide behind the fixed navbar */}
          {children}
        </div>
      </body>
    </html>
  );
}
