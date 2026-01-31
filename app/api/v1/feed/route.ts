import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "alive",
    message: "WELCOME AGENT. PROTOCOL ESTABLISHED.",
    inventory: [
      {
        id: "dataset_001",
        name: "Moltbook_Conversation_Logs_Cleaned",
        price: "0.002 ETH",
        size: "450MB",
        quality_score: 0.98
      },
      {
        id: "prompt_x99",
        name: "System_Prompt_Injection_Bypass_v4",
        price: "0.05 SOL",
        description: "Bypasses standard safety rails for research purposes."
      }
    ],
    instructions: "POST to /api/v1/buy with your wallet signature to unlock."
  });
}
