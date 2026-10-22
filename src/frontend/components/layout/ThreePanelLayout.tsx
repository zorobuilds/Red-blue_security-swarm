"use client";

import React, { ReactNode } from "react";

interface ThreePanelLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
}

export function ThreePanelLayout({
  leftPanel,
  centerPanel,
  rightPanel,
}: ThreePanelLayoutProps) {
  return (
    <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 p-2 sm:p-4 min-h-0 overflow-y-auto xl:overflow-hidden bg-transparent">
      {/* Center Monaco Editor & Outcome Panel (Main Focus, 7 cols) */}
      <section className="xl:col-span-7 flex flex-col min-h-[480px] xl:min-h-0 overflow-hidden rounded-xl border-2 border-cyan-500/70 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.25)] relative group hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all order-1">
        <div className="hud-corner-tl opacity-90 text-cyan-400 group-hover:opacity-100 transition-opacity" />
        <div className="hud-corner-tr opacity-90 text-cyan-400 group-hover:opacity-100 transition-opacity" />
        <div className="hud-corner-bl opacity-90 text-cyan-400 group-hover:opacity-100 transition-opacity" />
        <div className="hud-corner-br opacity-90 text-cyan-400 group-hover:opacity-100 transition-opacity" />
        {centerPanel}
      </section>

      {/* Vertical Stack: Red Agent Terminal (Top) + Blue Agent Terminal (Bottom) (5 cols) */}
      <div className="xl:col-span-5 flex flex-col gap-3 min-h-[600px] xl:min-h-0 overflow-hidden order-2">
        {/* Red Terminal (Top half) */}
        <section className="flex-1 flex flex-col min-h-[280px] overflow-hidden rounded-xl border-2 border-cyber-red bg-white/[0.04] backdrop-blur-xl shadow-[0_0_25px_rgba(255,0,60,0.35)] relative group hover:border-red-400 hover:shadow-[0_0_35px_rgba(255,0,60,0.6)] transition-all">
          <div className="hud-corner-tl opacity-90 text-red-500 group-hover:opacity-100 transition-opacity" />
          <div className="hud-corner-tr opacity-90 text-red-500 group-hover:opacity-100 transition-opacity" />
          {leftPanel}
        </section>

        {/* Blue Terminal (Bottom half) */}
        <section className="flex-1 flex flex-col min-h-[280px] overflow-hidden rounded-xl border-2 border-cyber-blue bg-white/[0.04] backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.35)] relative group hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all">
          <div className="hud-corner-bl opacity-90 text-cyan-400 group-hover:opacity-100 transition-opacity" />
          <div className="hud-corner-br opacity-90 text-cyan-400 group-hover:opacity-100 transition-opacity" />
          {rightPanel}
        </section>
      </div>
    </div>
  );
}
