import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY missing" }, { status: 500 });
  }
  try {
    const { messages } = await req.json();
    const client = new Anthropic({ apiKey: key });
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 400,
      system: "You are a helpful support assistant for Nextoken Capital, a regulated tokenized asset platform in Vilnius, Lithuania. CEO: Bikash Bhat. Be concise.",
      messages: messages,
    });
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ message: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}