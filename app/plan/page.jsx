"use client";
import React, { useState } from "react";

export default function PlanPage() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("Local + tourist mix");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");
    // ---------- ICS helpers ----------
  function toICSDate(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  }

  function parseStartDate(input) {
    // Try YYYY-MM-DD
    const iso = (input || "").match(/(\d{4}-\d{2}-\d{2})/);
    if (iso) return new Date(`${iso[1]}T00:00:00`);

    // Try Month Day[, Year] (e.g., Nov 10 or November 10, 2025)
    const md = (input || "").match(/([A-Za-z]{3,9})\s+(\d{1,2})(?:,\s*(\d{4}))?/);
    if (md) {
      const year = md[3] ? parseInt(md[3], 10) : new Date().getFullYear();
      return new Date(`${md[1]} ${md[2]}, ${year} 00:00:00`);
    }

    // Fallback: tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function buildICS(itineraryText, datesInput) {
    const start = parseStartDate(datesInput || "");
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(
      now.getUTCHours()
    )}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

    // Split itinerary into days by lines starting with "Day X"
    const lines = (itineraryText || "").split("\n");
    const days = [];
    let current = null;
    for (const line of lines) {
      const m = line.match(/^Day\s+(\d+)/i);
      if (m) {
        if (current) days.push(current);
        current = { title: line.trim(), lines: [] };
      } else {
        if (!current) current = { title: "Trip", lines: [] };
        current.lines.push(line);
      }
    }
    if (current) days.push(current);
    if (days.length === 0) days.push({ title: "Trip", lines });

    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TravelAIgent//MVP//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

    for (let i = 0; i < days.length; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dtstart = toICSDate(d);
      const dend = new Date(d);
      dend.setDate(d.getDate() + 1);
      const dtend = toICSDate(dend);

      const uid = `trip-${dtstart}-${i}@travelaigent`;
      const summary = days[i].title.replace(/[,;]/g, " ");
      const desc = days[i].lines.join("\\n").replace(/[\r\n]+/g, "\\n").replace(/[,;]/g, " ");

      ics += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
SUMMARY:${summary}
DTSTART;VALUE=DATE:${dtstart}
DTEND;VALUE=DATE:${dtend}
DESCRIPTION:${desc}
END:VEVENT
`;
    }

    ics += `END:VCALENDAR`;
    return ics;
  }

  function exportToCalendar() {
    if (!itinerary) return;
    const ics = buildICS(itinerary, dates);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travelaigent-itinerary.ics";
    a.click();
    URL.revokeObjectURL(url);
  }
  // ---------- end ICS helpers ----------


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setItinerary("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, dates, budget, style }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate itinerary.");
      }

      const data = await res.json();
      setItinerary(data.itinerary || "");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Plan a Trip (Demo)</h1>
        <p className="text-slate-600 mt-2">
          Enter details and TravelAIgent will create a simple 3-day itinerary.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            className="rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Destination (e.g., Barcelona)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />

          <input
            className="rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Dates (e.g., Nov 10–13)"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />

          <input
            className="rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Budget (e.g., $1000)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <select
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option>Local + tourist mix</option>
            <option>Mostly local</option>
            <option>Touristy highlights</option>
            <option>Adventure/Outdoors</option>
            <option>Luxury/Relaxed</option>
            <option>Nightlife focused</option>
            <option>Family friendly</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
          >
            {loading ? "Generating..." : "Generate My Trip"}
          </button>
        </form>
        {/* Mix & Match (swap a single slot) */}
<div className="mt-8 rounded-2xl border border-slate-200 p-4">
  <div className="text-sm font-medium mb-2">Mix & Match (swap one slot)</div>
  <SwapSlot onResult={(text) => {
    const el = document.getElementById("swap-results");
    if (el) el.textContent = text || "No alternatives returned.";
  }} />
  <pre id="swap-results" className="mt-3 text-sm whitespace-pre-wrap text-slate-700" />
</div>


        {error && (
          <div className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {itinerary && (
  <div className="mt-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 whitespace-pre-wrap">
      {itinerary}
    </div>

    <div className="mt-3 flex items-center gap-3 flex-wrap">
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(itinerary);
            alert("Itinerary copied!");
          } catch {
            alert("Could not copy. (Some browsers block clipboard on http)");
          }
        }}
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
      >
        Copy itinerary
      </button>

      <button
        onClick={exportToCalendar}
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
      >
        Export to Calendar (.ics)
      </button>

      <a
        href="https://forms.gle/RAiZ6S1Yj1wT2gzCA"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-700 underline"
      >
        Was this useful? Tell us →
      </a>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
function SwapSlot({ onResult }) {
  const [slotHint, setSlotHint] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Read current form values so we reuse destination/dates/budget/style
  function readFormValues() {
    const destination = document.querySelector('input[placeholder="Destination (e.g., Barcelona)"]')?.value || "";
    const dates = document.querySelector('input[placeholder="Dates (e.g., Nov 10–13)"]')?.value || "";
    const budget = document.querySelector('input[placeholder="Budget (e.g., $1000)"]')?.value || "";
    const style = document.querySelector("select")?.value || "Local + tourist mix";
    return { destination, dates, budget, style };
  }

  async function doSwap() {
    setLoading(true); setError("");
    try {
      const { destination, dates, budget, style } = readFormValues();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, dates, budget, style, slotHint }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Swap failed");
      const data = await res.json();
      onResult?.(data.itinerary || "");
    } catch (e) {
      setError(e.message || "Swap failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <input
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        value={slotHint}
        onChange={(e) => setSlotHint(e.target.value)}
        placeholder='e.g., "Day 2 — Evening" or "Day 1 — Morning"'
      />
      <button
        onClick={doSwap}
        disabled={loading}
        className="justify-self-start rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 disabled:opacity-60"
      >
        {loading ? "Finding alternatives…" : "Find alternatives for this slot"}
      </button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}


