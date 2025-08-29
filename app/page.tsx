import React from "react";
import { ArrowRight, Compass, Sparkles, Map, Stars, CalendarRange, Users, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">T</div>
            <span className="font-semibold tracking-tight">TravelAIgent</span>
          </div>
          <a
            href="https://forms.gle/RAiZ6S1Yj1wT2gzCA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 transition"
          >
            Join waitlist <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4 pt-14 pb-10 md:pt-24 md:pb-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-600 bg-slate-100 rounded-full px-3 py-1 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Early Access
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              The AI travel agent that plans <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">everything</span> for you.
            </h1>
            <p className="mt-4 text-lg text-slate-700 max-w-prose">
              Tell us your <strong>budget</strong>, <strong>dates</strong>, and <strong>vibe</strong>. TravelAIgent researches hidden local gems, builds a smart daily itinerary, and keeps it all booked in one place—backed by reviews from real travelers.
            </p>

            <div id="waitlist" className="mt-6">
              <a
                href="https://forms.gle/RAiZ6S1Yj1wT2gzCA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition shadow-sm"
              >
                Join the Waitlist <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-2 text-xs text-slate-500">No spam. Just launch updates & early invites.</p>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-30 bg-gradient-to-tr from-slate-200 to-slate-50" />
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl p-5 md:p-6 grid gap-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Your Barcelona Week</div>
                <div className="text-xs text-slate-500">Smart Itinerary</div>
              </div>
              <div className="grid gap-3">
                <CardRow icon={<Compass className="h-4 w-4" />} title="Hidden tapas crawl" meta="Local favorite · 1.2k saves" />
                <CardRow icon={<Map className="h-4 w-4" />} title="Bunkers del Carmel at sunrise" meta="Scenic · Reviewed by 247 travelers" />
                <CardRow icon={<Stars className="h-4 w-4" />} title="Flamenco night in Gràcia" meta="Authentic · Budget-friendly" />
                <CardRow icon={<CalendarRange className="h-4 w-4" />} title="Auto‑booked flights & hotel" meta="Kept in one place" />
                <CardRow icon={<Users className="h-4 w-4" />} title="Community reviews" meta="See tips from travelers like you" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-4 text-center">
          <Stat label="Minutes saved per trip" value="8–12 hrs" />
          <Stat label="Hidden gems found" value="> 10k" />
          <Stat label="Planned by your vibe" value="Budget → Luxury" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <Feature
          icon={<Sparkles className="h-5 w-5" />}
          title="All‑in‑one planning & booking"
          body="Flights, stays, transport, and experiences—planned in minutes and kept in one place."
        />
        <Feature
          icon={<Compass className="h-5 w-5" />}
          title="Local gems, not just top‑10s"
          body="TravelAIgent sifts social content & reviews to surface spots loved by locals, not tour buses."
        />
        <Feature
          icon={<Map className="h-5 w-5" />}
          title="Smart itinerary that adapts"
          body="Rainy day? Low‑energy morning? Plans reshuffle automatically to fit your day."
        />
        <Feature
          icon={<Users className="h-5 w-5" />}
          title="Community‑powered trust"
          body="See reviews from travelers like you. Mix & match from a vetted pool of places that already delivered."
        />
      </section>

      {/* How it works */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">How it works</h2>
          <ol className="grid md:grid-cols-4 gap-6 list-decimal pl-6">
            <Step n={1} title="Tell your vibe & budget" text="Local vs touristy, chill vs adventure, solo vs group—your rules." />
            <Step n={2} title="We research & curate" text="AI scans deals, maps, and social to build a tailored plan." />
            <Step n={3} title="Customize with reviews" text="Swap items in/out using community‑approved picks." />
            <Step n={4} title="Book in one place" text="Flights, stays, activities—stored neatly in your trip." />
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">FAQ</h2>
        <div className="grid gap-6">
          <FAQ q="Is this a travel planner or a booking site?" a="Both. TravelAIgent plans a personalized itinerary and lets you book it all in one place." />
          <FAQ q="Where do the hidden gems come from?" a="We analyze public content and traveler feedback to highlight authentic local spots, then continuously improve recommendations with community reviews." />
          <FAQ q="How do I join the beta?" a="Add your email on the waitlist form. We'll invite early users in waves and prioritize thoughtful feedback." />
          <FAQ q="Is my data private?" a="Yes. We use your preferences only to plan your trip. No resale of personal data." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TravelAIgent. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Privacy‑first</span>
            <a href="https://forms.gle/RAiZ6S1Yj1wT2gzCA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-slate-900">Join waitlist <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CardRow({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3 hover:bg-slate-50 transition">
      <div className="mt-0.5 text-slate-700">{icon}</div>
      <div>
        <div className="font-medium leading-tight">{title}</div>
        <div className="text-xs text-slate-500">{meta}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 text-slate-700 mb-2">{icon}<span className="text-sm font-semibold">{title}</span></div>
      <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="text-xs text-slate-500">Step {n}</div>
      <div className="font-semibold mt-1">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{text}</div>
    </li>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="font-medium">{q}</div>
      <div className="text-sm text-slate-600 mt-1">{a}</div>
    </div>
  );
}
