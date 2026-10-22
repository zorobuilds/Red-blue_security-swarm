"use client";

import React, { useState } from "react";
import { ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { ArenaDashboard } from "@/frontend/components/ArenaDashboard";

export function DashboardSection() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <section id="dashboard" className="py-16 px-4 sm:px-6 lg:px-12 border-b border-cyber-border font-mono relative">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-1">
              PLATFORM DASHBOARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              REAL-TIME <span className="text-red-500">OPERATION VIEW</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Monitor Red Team attacks, Blue Team fixes, and system status in real time.
            </p>
          </div>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-red-500/50 bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-black font-bold text-xs tracking-wider transition-all self-start md:self-auto"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <span>Open Full Dashboard</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Embedded Dashboard Container */}
        <div className={`relative transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-50 p-2 bg-black/50 backdrop-blur-xl" : "w-full"}`}>
          <div className="relative rounded-2xl border-2 border-cyan-500/80 bg-white/[0.02] backdrop-blur-xl shadow-[0_0_35px_rgba(0,240,255,0.25)] hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(0,240,255,0.35)] transition-all overflow-hidden">
            {/* Outer HUD corner accents */}
            <div className="hud-corner-tl opacity-90 text-cyan-400" />
            <div className="hud-corner-tr opacity-90 text-cyan-400" />
            <div className="hud-corner-bl opacity-90 text-cyan-400" />
            <div className="hud-corner-br opacity-90 text-cyan-400" />

            <div className={isFullScreen ? "h-[calc(100vh-16px)]" : "h-[750px] xl:h-[820px]"}>
              <ArenaDashboard embedded />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
