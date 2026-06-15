"use client";

import { useEffect, useRef, useState } from "react";

export interface Parallax {
  /** Normalized pointer offset from viewport center, range roughly -1..1. */
  x: number;
  y: number;
}

/**
 * Tracks the pointer relative to the viewport center and returns a smoothed,
 * rAF-coalesced offset. Used to drive depth/parallax on hero layers.
 * No-ops (stays at 0,0) when the user prefers reduced motion.
 */
export function useParallax(): Parallax {
  const [offset, setOffset] = useState<Parallax>({ x: 0, y: 0 });
  const target = useRef<Parallax>({ x: 0, y: 0 });
  const current = useRef<Parallax>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    const tick = () => {
      // Ease toward the target so motion feels weighted, not jittery.
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      setOffset({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return offset;
}
