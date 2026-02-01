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
        {/* NO NAVBAR - PURE CONTENT */}
        {children}
      </body>
    </html>
  );
}
