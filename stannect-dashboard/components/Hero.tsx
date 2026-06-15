"use client";

import NetworkGlobe from "./NetworkGlobe";
import { useParallax } from "@/lib/useParallax";

export default function Hero() {
  const p = useParallax();

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      {/* Connection globe, deepest layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${p.x * -14}px, ${p.y * -10}px, 0)`,
        }}
      >
        <NetworkGlobe />
      </div>

      {/* Warm wash so the globe melts into the page */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 46%, transparent 0%, var(--bg) 86%)",
        }}
      />

      {/* Headline, foreground parallax layer */}
      <div
        className="relative z-10 px-6 text-center"
        style={{
          transform: `translate3d(${p.x * 10}px, ${p.y * 8}px, 0)`,
        }}
      >
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-text-muted">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand" />
          Staying connected
        </span>
        <h1 className="font-heading text-5xl font-semibold leading-[1.05] text-text sm:text-7xl">
          Where your business
          <br />
          meets{" "}
          <span className="text-brand">automation</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
          One connected workspace for every KPI, dashboard, and integration —
          all linked through your Stannect core.
        </p>
        <a
          href="#workspace"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-heading text-sm font-medium text-bg shadow-card transition-transform hover:scale-[1.03] active:scale-95"
        >
          Open your workspace
        </a>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted">
        <span className="block h-9 w-5 rounded-full border border-border">
          <span className="mx-auto mt-1.5 block h-2 w-0.5 animate-pulse-soft rounded-full bg-brand" />
        </span>
      </div>
    </section>
  );
}
