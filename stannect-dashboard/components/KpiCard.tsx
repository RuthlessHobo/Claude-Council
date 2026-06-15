"use client";

import { forwardRef, useRef, type PointerEvent } from "react";
import type { CardData } from "@/lib/cards";
import { iconForKind, PlusIcon } from "./icons";

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;
  const w = 100;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / span) * h;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-7 w-full"
      aria-hidden="true"
    >
      <path d={area} fill="var(--brand-10)" />
      <path
        d={line}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const accentVar = (n?: 1 | 2 | 3) =>
  n === 2 ? "var(--accent-2)" : n === 3 ? "var(--accent-3)" : "var(--accent-1)";

interface Props {
  card: CardData;
  onRemove?: (id: string) => void;
}

/**
 * A frosted, opaque KPI / dashboard / integration card. Tilts subtly toward
 * the pointer for depth. The root element is forwarded so the grid can measure
 * its center and draw the chain connector back to the hub.
 */
const KpiCard = forwardRef<HTMLDivElement, Props>(function KpiCard(
  { card, onRemove },
  ref,
) {
  const tiltRaf = useRef<number | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (tiltRaf.current) cancelAnimationFrame(tiltRaf.current);
    tiltRaf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-2px)`;
    });
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (tiltRaf.current) cancelAnimationFrame(tiltRaf.current);
    el.style.transform = "";
  };

  const isHub = card.isHub;
  const primary = card.metrics[0];
  const rest = card.metrics.slice(1);

  return (
    <div
      ref={ref}
      data-card-id={card.id}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={[
        "card-surface group relative animate-fade-up rounded-2xl p-5 transition-shadow duration-300",
        "shadow-card hover:shadow-glow",
        isHub
          ? "ring-1 ring-brand/40"
          : "",
      ].join(" ")}
      style={{ transitionProperty: "transform, box-shadow", willChange: "transform" }}
    >
      {/* accent rule */}
      <span
        aria-hidden
        className="absolute left-5 right-5 top-0 h-px"
        style={{ background: accentVar(card.accent) }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-brand"
            style={{ background: "var(--brand-10)" }}
          >
            {iconForKind(card.kind, { width: 20, height: 20 })}
          </span>
          <div>
            <h3 className="font-heading text-base font-semibold leading-tight text-text">
              {card.title}
            </h3>
            {card.subtitle && (
              <p className="text-xs uppercase tracking-wider text-text-muted">
                {card.subtitle}
              </p>
            )}
          </div>
        </div>

        {onRemove && !isHub && (
          <button
            type="button"
            onClick={() => onRemove(card.id)}
            aria-label={`Remove ${card.title}`}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <PlusIcon
              width={18}
              height={18}
              className="rotate-45 text-text-muted hover:text-brand"
            />
          </button>
        )}
      </div>

      {primary && (
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="font-heading text-3xl font-semibold leading-none text-text">
              {primary.value}
            </div>
            <div className="mt-1 text-xs text-text-muted">{primary.label}</div>
          </div>
          {primary.delta && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                color:
                  primary.direction === "down"
                    ? "var(--text-muted)"
                    : "var(--brand)",
                background: "var(--brand-10)",
              }}
            >
              {primary.direction === "down" ? "▼" : "▲"} {primary.delta}
            </span>
          )}
        </div>
      )}

      {card.trend && <Sparkline data={card.trend} />}

      {(rest.length > 0 || card.status) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3 text-xs">
          {rest.map((m) => (
            <span key={m.label} className="text-text-muted">
              {m.label}:{" "}
              <span className="font-medium text-text">{m.value}</span>
              {m.delta && (
                <span
                  className="ml-1"
                  style={{
                    color:
                      m.direction === "down"
                        ? "var(--text-muted)"
                        : "var(--brand)",
                  }}
                >
                  {m.direction === "down" ? "▼" : "▲"}
                  {m.delta}
                </span>
              )}
            </span>
          ))}
          {card.status && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-text-muted">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand" />
              {card.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default KpiCard;
