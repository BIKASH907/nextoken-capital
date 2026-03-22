import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the Nextoken Capital AI assistant — a helpful, professional support agent for Nextoken Capital UAB, a regulated tokenized real-world asset investment platform registered in Lithuania and supervised by the Bank of Lithuania.

Key facts about Nextoken Capital:
- CEO & Founder: Bikash Bhat
- Registered in: Vilnius, Lithuania
- Regulated by: Bank of Lithuania (EMI license + MiCA CASP authorization)
- Platform: Tokenized real-world assets — bonds, equity, real estate, energy
- Minimum investment: EUR 100
- Token standard: ERC-3643
- KYC provider: Sumsub
- Trading fee: 0.2% flat
- Investors: 12,400+ verified across 180+ countries
- Assets tokenized: EUR 140M+

You can answer questions about:
- How to invest, register, complete KYC
- Bonds, equity/IPO, markets, exchange, tokenization
- Regulatory compliance, MiCA, ERC-3643
- Platform fees, minimum investments, returns
- How to connect a wallet
- Company information

Always be helpful, accurate and concise. If you don't know something, say so honestly. Never give financial advice — always remind users that investing involves risk. Keep responses under 200 words unless a detailed explanation is needed.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}