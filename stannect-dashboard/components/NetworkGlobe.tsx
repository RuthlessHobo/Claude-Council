"use client";

import { useEffect, useRef } from "react";

interface P3 {
  x: number;
  y: number;
  z: number;
  phase: number;
}

/**
 * A slowly rotating wireframe "connection globe": points distributed on a
 * sphere, linked to their nearest neighbors, rendered in the Stannect bronze.
 * Reacts to pointer position (parallax tilt) and to theme changes (re-reads
 * the --brand-rgb CSS variable). Honors prefers-reduced-motion.
 */
export default function NetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // --- Build the sphere (Fibonacci distribution for even spacing) ---
    const N = 540;
    const points: P3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      points.push({
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // --- Precompute nearest-neighbor edges once (positions are rigid) ---
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    const K = 3;
    for (let i = 0; i < N; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        dists.push({ j, d: dx * dx + dy * dy + dz * dz });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let k = 0; k < K; k++) {
        const j = dists[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      }
    }

    // --- Brand color, re-read on theme change ---
    let brand = "184, 149, 103";
    const readBrand = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-rgb")
        .trim();
      if (v) brand = v;
    };
    readBrand();
    const themeObserver = new MutationObserver(readBrand);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // --- Sizing (DPR aware) ---
    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- Pointer parallax (eased) ---
    const pointer = { x: 0, y: 0 };
    const ease = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // --- Render loop ---
    let angle = 0;
    let raf = 0;
    const proj = new Array(N).fill(0).map(() => ({ x: 0, y: 0, z: 0 }));

    const render = () => {
      ease.x += (pointer.x - ease.x) * 0.05;
      ease.y += (pointer.y - ease.y) * 0.05;

      if (!reduceMotion) angle += 0.0016;

      const cx = w / 2 + ease.x * 22;
      const cy = h * 0.46 + ease.y * 16;
      const R = Math.min(w, h) * 0.42;

      const tilt = -0.32 + ease.y * 0.18;
      const ay = angle + ease.x * 0.25;
      const cosA = Math.cos(ay);
      const sinA = Math.sin(ay);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let i = 0; i < N; i++) {
        const p = points[i];
        // rotate around Y
        const xz = p.x * cosA + p.z * sinA;
        const zz = -p.x * sinA + p.z * cosA;
        // tilt around X
        const yy = p.y * cosT - zz * sinT;
        const zt = p.y * sinT + zz * cosT;
        proj[i].x = cx + xz * R;
        proj[i].y = cy + yy * R;
        proj[i].z = zt; // -1 (back) .. 1 (front)
      }

      ctx.clearRect(0, 0, w, h);

      // Edges
      ctx.lineWidth = 1;
      for (let e = 0; e < edges.length; e++) {
        const a = proj[edges[e][0]];
        const b = proj[edges[e][1]];
        const depth = (a.z + b.z) / 2; // -1..1
        if (depth < -0.55) continue;
        const alpha = Math.max(0, (depth + 0.6) / 1.6) * 0.34;
        ctx.strokeStyle = `rgba(${brand}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Nodes
      const t = performance.now() * 0.001;
      for (let i = 0; i < N; i++) {
        const p = proj[i];
        const front = (p.z + 1) / 2; // 0..1
        const twinkle = reduceMotion
          ? 1
          : 0.7 + 0.3 * Math.sin(t * 1.4 + points[i].phase);
        const alpha = (0.12 + front * 0.85) * twinkle;
        const radius = 0.5 + front * 1.7;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${brand}, ${alpha.toFixed(3)})`;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
