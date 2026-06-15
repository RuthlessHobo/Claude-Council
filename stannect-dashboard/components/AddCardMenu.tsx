"use client";

import { useEffect, useRef, useState } from "react";
import { cardTemplates, type CardTemplate } from "@/lib/cards";
import { iconForKind, PlusIcon } from "./icons";

const kindForKey = (key: string) =>
  key === "dashboard"
    ? "dashboard"
    : key === "integration"
      ? "integration"
      : "kpi";

export default function AddCardMenu({
  onAdd,
}: {
  onAdd: (template: CardTemplate) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-heading text-sm font-medium text-bg shadow-card transition-transform hover:scale-[1.03] active:scale-95"
      >
        <PlusIcon width={18} height={18} />
        Add card
      </button>

      {open && (
        <div
          role="menu"
          className="card-surface absolute right-0 z-30 mt-3 w-72 origin-top-right animate-fade-up rounded-2xl p-2 shadow-card"
        >
          <p className="px-3 pb-2 pt-1 text-xs uppercase tracking-wider text-text-muted">
            Connect something new
          </p>
          {cardTemplates.map((t) => (
            <button
              key={t.key}
              role="menuitem"
              type="button"
              onClick={() => {
                onAdd(t);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand/10"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand"
                style={{ background: "var(--brand-10)" }}
              >
                {iconForKind(kindForKey(t.key), { width: 18, height: 18 })}
              </span>
              <span>
                <span className="block font-heading text-sm font-medium text-text">
                  {t.label}
                </span>
                <span className="block text-xs text-text-muted">
                  {t.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
