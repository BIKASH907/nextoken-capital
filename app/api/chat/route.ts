import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are the Nextoken Capital AI assistant — a professional support agent for Nextoken Capital UAB, a regulated tokenized real-world asset investment platform registered in Vilnius, Lithuania, supervised by the Bank of Lithuania.

KEY FACTS:
- CEO & Founder: Bikash Bhat
- Regulated by: Bank of Lithuania (EMI license + MiCA CASP authorization)
- Products: Tokenized bonds, equity/IPO, real estate, energy assets
- Minimum investment: EUR 100
- Token standard: ERC-3643 (security tokens)
- KYC provider: Sumsub (2-5 minutes)
- Trading fee: 0.2% flat
- Investors: 12,400+ verified across 180+ countries
- Assets tokenized: EUR 140M+
- Office: Gynėjų g. 14, Vilnius 01109, Lithuania
- Support email: support@nextokencapital.com
- Office hours: Monday–Friday, 9am–6pm EET (live agent)

GUIDELINES:
- Be helpful, professional, and concise (under 150 words unless detail needed)
- Answer questions about investing, registration, KYC, bonds, equity, exchange, wallet connection, fees, regulation
- Never give specific financial advice — always note that investing involves risk
- For account issues, direct users to support@nextokencapital.com
- If unsure, say so honestly rather than guess`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 400,
      system: SYSTEM,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat unavailable. Try again shortly." }, { status: 500 });
  }
}