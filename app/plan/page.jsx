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

        {error && (
          <div className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {itinerary && (
          <div className="mt-6 border border-slate-300 bg-white p-5 whitespace-pre-wrap">
            {itinerary}
          </div>
        )}
      </div>
    </div>
  );
}

