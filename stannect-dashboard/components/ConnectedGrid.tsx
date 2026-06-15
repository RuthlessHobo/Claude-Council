"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { defaultCards, type CardData, type CardTemplate } from "@/lib/cards";
import KpiCard from "./KpiCard";
import AddCardMenu from "./AddCardMenu";

interface Line {
  id: string;
  d: string;
}

/**
 * Holds the workspace state and renders the hub + cards, with animated
 * chain-link connectors drawn from each card back to the central Stannect hub.
 * Positions are measured via offset* (transform-independent) so the chains
 * stay anchored even while cards tilt on hover.
 */
export default function ConnectedGrid() {
  const [cards, setCards] = useState<CardData[]>(defaultCards);
  const [lines, setLines] = useState<Line[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setCardRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
      else cardRefs.current.delete(id);
    },
    [],
  );

  const hub = cards.find((c) => c.isHub) ?? cards[0];
  const others = cards.filter((c) => c !== hub);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const hubEl = hubRef.current;
    if (!container || !hubEl) return;

    const hx = hubEl.offsetLeft + hubEl.offsetWidth / 2;
    const hy = hubEl.offsetTop + hubEl.offsetHeight; // chain leaves hub bottom

    const next: Line[] = [];
    for (const c of others) {
      const el = cardRefs.current.get(c.id);
      if (!el) continue;
      const cx = el.offsetLeft + el.offsetWidth / 2;
      const cy = el.offsetTop + 4; // chain meets card top
      // Gentle quadratic bow so chains drape like real links.
      const mx = (hx + cx) / 2;
      const my = (hy + cy) / 2 + Math.min(48, Math.abs(cx - hx) * 0.18);
      next.push({ id: c.id, d: `M${hx} ${hy} Q${mx} ${my} ${cx} ${cy}` });
    }
    setLines(next);
  }, [others]);

  useLayoutEffect(() => {
    measure();
  }, [cards, measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    window.addEventListener("resize", measure);
    // One more pass after fonts/layout settle.
    const t = setTimeout(measure, 120);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [measure]);

  const addCard = (template: CardTemplate) => {
    setCards((prev) => [...prev, template.build()]);
  };
  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-28">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-text sm:text-3xl">
            Your Connected Workspace
          </h2>
          <p className="mt-1 max-w-lg text-text-muted">
            Every KPI, dashboard, and integration links back to your Stannect
            core. Add another whenever you connect a new piece of the business.
          </p>
        </div>
        <AddCardMenu onAdd={addCard} />
      </div>

      <div ref={containerRef} className="relative">
        {/* Chain connectors, behind the cards */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {lines.map((l) => (
            <g key={l.id}>
              <path id={`chain-${l.id}`} d={l.d} fill="none" stroke="none" />
              {/* core strand */}
              <path
                d={l.d}
                fill="none"
                stroke="var(--brand)"
                strokeOpacity={0.22}
                strokeWidth={1.5}
              />
              {/* chain links: round dashes flowing toward the card */}
              <path
                d={l.d}
                fill="none"
                stroke="var(--brand)"
                strokeOpacity={0.7}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray="0.5 11"
                style={{ animation: "dash-flow 1.6s linear infinite" }}
              />
              {/* traveling data pulse */}
              <circle r={2.6} fill="var(--brand)">
                <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto">
                  <mpath href={`#chain-${l.id}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
        </svg>

        {/* Hub */}
        <div className="relative z-10 mx-auto mb-14 max-w-md">
          <KpiCard ref={hubRef} card={hub} />
        </div>

        {/* Cards */}
        <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <KpiCard
              key={c.id}
              ref={setCardRef(c.id)}
              card={c}
              onRemove={removeCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
