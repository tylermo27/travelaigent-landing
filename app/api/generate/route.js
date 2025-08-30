// app/api/generate/route.js
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Make sure your key is available on the server
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY. Check .env.local and restart dev server." },
        { status: 500 }
      );
    }

    // Read inputs from the request body (slotHint is NEW and optional)
    const {
      destination = "",
      dates = "",
      budget = "",
      style = "",
      slotHint = "",
    } = await req.json();

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Build the prompt differently if we're swapping a single slot
    const userPrompt = (
      slotHint
        ? `
You are TravelAIgent.

Destination: ${destination || "anywhere"}
Dates: ${dates || "flexible"}
Budget: ${budget || "reasonable"}
Style: ${style || "Local + tourist mix"}

IMPORTANT: The traveler wants to swap just this slot: "${slotHint}".
Return ONLY 2–3 alternative ideas for that single slot, each on its own line with:
- a short reason, and
- a price vibe ($, $$, $$$).
Do not include any other text.
        `
        : `
You are TravelAIgent, a practical planner. Create a concise 3-day itinerary.

Destination: ${destination || "anywhere"}
Dates: ${dates || "flexible"}
Budget: ${budget || "reasonable"}
Style: ${style || "Local + tourist mix"}

Format exactly:
Day 1 — Morning / Afternoon / Evening
Day 2 — Morning / Afternoon / Evening
Day 3 — Morning / Afternoon / Evening

Then add 3 optional "Mix & Match" ideas at the end.
- Keep it scannable and realistic.
- Include 1–2 authentic/local spots per day.
- Use price vibes ($ budget, $$ midrange, $$$ higher) where helpful.
        `
    ).trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: "You are a helpful, practical travel planner." },
        { role: "user", content: userPrompt },
      ],
    });

    const itinerary = completion.choices?.[0]?.message?.content?.trim();
    if (!itinerary) throw new Error("Empty itinerary from OpenAI.");

    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error("Generate API error:", err?.message || err);
    return NextResponse.json(
      { error: `Failed to generate itinerary: ${err?.message || "unknown error"}` },
      { status: 500 }
    );
  }
}
