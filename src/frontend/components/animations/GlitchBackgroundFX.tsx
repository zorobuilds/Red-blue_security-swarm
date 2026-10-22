"use client";

import React, { useMemo } from "react";

export function GlitchBackgroundFX() {
  const glitchBlocks = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${(i * 2.3) % 95}%`,
      right: `${2 + ((i * 7) % 55)}%`,
      width: `${20 + ((i * 13) % 65)}px`,
      height: `${3 + (i % 6)}px`,
      color:
        i % 4 === 0
          ? "rgba(0, 240, 255, 0.9)"
          : i % 4 === 1
          ? "rgba(255, 0, 127, 0.9)"
          : i % 4 === 2
          ? "rgba(157, 78, 221, 0.8)"
          : "rgba(255, 255, 255, 0.75)",
      delay: `${(i * 0.08) % 2.5}s`,
      duration: `${1.2 + (i % 3)}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Glitch Reality Poster Artwork - Fixed in background across entire app */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/glitch-bg.jpg"
        alt="Glitch Reality Artwork"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-100 contrast-115 brightness-130 saturate-125"
      />

      {/* Subtle screen border vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-20 pointer-events-none" />

      {/* HUD Frame Corner Markers (┌ ┐ └ ┘) */}
      <div className="absolute top-3 left-3 text-slate-300 font-mono text-base tracking-tighter opacity-80 z-10">┌</div>
      <div className="absolute top-3 right-3 text-slate-300 font-mono text-base tracking-tighter opacity-80 z-10">┐</div>
      <div className="absolute bottom-3 left-3 text-slate-300 font-mono text-base tracking-tighter opacity-80 z-10">└</div>
      <div className="absolute bottom-3 right-3 text-slate-300 font-mono text-base tracking-tighter opacity-80 z-10">┘</div>

      {/* Crosshairs & HUD Tech Markers */}
      <div className="absolute top-4 right-10 flex flex-col items-end gap-0.5 text-[9px] font-mono text-slate-400 tracking-widest opacity-80 select-none z-10">
        <span>✕</span>
        <span>✕</span>
        <span>✕</span>
      </div>

      <div className="absolute top-20 left-4 hidden 2xl:flex flex-col gap-1 text-[9px] font-mono text-slate-300 tracking-wider opacity-75 select-none z-10">
        <span className="text-[10px] text-cyan-400 font-bold">✕</span>
        <span>REALITY</span>
        <span>IS</span>
        <span>OVERRATED</span>
        <span className="tracking-widest text-pink-500">····</span>
      </div>

      <div className="absolute bottom-4 left-6 hidden sm:flex items-center gap-2 text-[9px] font-mono text-slate-400 tracking-widest opacity-70 select-none z-10">
        <span>LOADING...</span>
        <div className="w-16 h-1.5 border border-slate-600 bg-slate-900/80 overflow-hidden relative">
          <div className="w-1/3 h-full bg-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Dynamic Animated Glitch Pixels */}
      {glitchBlocks.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-none animate-pixelFloat z-10"
          style={{
            top: b.top,
            right: b.right,
            width: b.width,
            height: b.height,
            backgroundColor: b.color,
            animationDelay: b.delay,
            animationDuration: b.duration,
            boxShadow: `0 0 10px ${b.color}`,
          }}
        />
      ))}

      {/* Subtle Scanlines */}
      <div className="absolute inset-0 scanlines-overlay opacity-20" />
    </div>
  );
}
