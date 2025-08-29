import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Quick sanity: do we have the key?
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY. Check .env.local and restart." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { destination = "", dates = "", budget = "", style = "" } = body;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userPrompt = `
Create a concise 3-day itinerary.

Destination: ${destination || "anywhere"}
Dates: ${dates || "flexible"}
Budget: ${budget || "reasonable"}
Style: ${style || "Local + tourist mix"}

Format:
Day 1 — Morning / Afternoon / Evening
Day 2 — Morning / Afternoon / Evening
Day 3 — Morning / Afternoon / Evening
Add 3 optional Mix & Match ideas at the end.
    `.trim();

    // Try preferred model; if it fails, fallback
    let itinerary = "";
    try {
      const r1 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are a helpful, practical travel planner." },
          { role: "user", content: userPrompt },
        ],
      });
      itinerary = r1.choices?.[0]?.message?.content || "";
    } catch (e) {
      console.warn("gpt-4o-mini failed, trying gpt-4o…", e?.message);
      const r2 = await client.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are a helpful, practical travel planner." },
          { role: "user", content: userPrompt },
        ],
      });
      itinerary = r2.choices?.[0]?.message?.content || "";
    }

    if (!itinerary) {
      throw new Error("Empty itinerary from OpenAI.");
    }

    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error("Generate API error:", err?.message || err);
    return NextResponse.json(
      { error: `Failed to generate itinerary: ${err?.message || "unknown error"}` },
      { status: 500 }
    );
  }
}

