"use client";

import React from "react";
import { ShieldAlert, Play, RotateCcw, Volume2, VolumeX, Square, GitBranch, Activity, Chrome } from "lucide-react";
import { useCyberArena } from "@/frontend/hooks/useCyberArenaState";
import { useAgentStream } from "@/frontend/hooks/useAgentStream";
import { ALL_PRESET_SNIPPETS, isPresetId } from "@/shared/presets/snippets";
import { ModeToggle } from "./ModeToggle";
import { PhaseBadge } from "./PhaseBadge";

export function Header() {
  const presetId = useCyberArena((s) => s.target.presetId);
  const loadPreset = useCyberArena((s) => s.loadPreset);
  const resetArena = useCyberArena((s) => s.resetArena);
  const soundEnabled = useCyberArena((s) => s.soundEnabled);
  const toggleSound = useCyberArena((s) => s.toggleSound);
  const isTrafficPanelOpen = useCyberArena((s) => s.isTrafficPanelOpen);
  const toggleTrafficPanel = useCyberArena((s) => s.toggleTrafficPanel);
  const setRepoModalOpen = useCyberArena((s) => s.setRepoModalOpen);
  const setPlaywrightModalOpen = useCyberArena((s) => s.setPlaywrightModalOpen);
  const { isRunning, startAudit, cancelAudit } = useAgentStream();

  return (
    <header className="min-h-16 border-b border-cyber-border/70 bg-black/30 backdrop-blur-md px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30 font-mono text-xs relative">
      {/* Brand & Glitch Typography from Poster */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldAlert className="w-6 h-6 text-cyber-red animate-flicker" aria-hidden />
            <div className="absolute inset-0 bg-cyber-red/20 blur-md -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-widest text-slate-100 glitch-title select-none">
                GLITCH<span className="text-cyber-blue">.</span>REALITY
              </h1>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-cyber-red/20 border border-cyber-red/40 text-cyber-red font-bold tracking-widest">
                v2.0
              </span>
            </div>
            <div className="text-[9px] text-slate-500 tracking-wider flex items-center gap-2">
              <span className="hidden md:inline">NOT EVERYTHING YOU SEE IS <b className="text-cyber-red font-black">REAL</b></span>
              <span className="text-slate-600 hidden md:inline">·</span>
              <span className="text-cyber-blue">RED//BLUE WAR ROOM</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 border-l border-slate-800/80 pl-4" aria-live="polite">
          <span className="text-slate-500 tracking-widest text-[10px]">THREAT STATUS:</span>
          <PhaseBadge />
        </div>
      </div>

      {/* Control Actions & Navigation */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPlaywrightModalOpen(true)}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyber-red/50 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red hover:text-black transition-all shadow-[0_0_12px_rgba(255,0,60,0.2)] disabled:opacity-40"
          title="Launch autonomous Playwright Chromium attacker"
        >
          <Chrome className="w-3.5 h-3.5" aria-hidden />
          <span className="font-bold tracking-wider">Browser Attacker</span>
        </button>

        <button
          onClick={() => setRepoModalOpen(true)}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:border-cyber-blue hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all disabled:opacity-40"
          title="Load a file from a GitHub repo or check a URL's headers"
        >
          <GitBranch className="w-3.5 h-3.5 text-cyber-blue" aria-hidden />
          <span className="hidden sm:inline font-bold tracking-wider">URL Ingest</span>
        </button>

        <ModeToggle />

        <select
          value={presetId ?? ""}
          disabled={isRunning}
          onChange={(e) => isPresetId(e.target.value) && loadPreset(e.target.value)}
          aria-label="Preset scenario"
          className="bg-slate-900/90 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyber-blue text-xs disabled:opacity-50 max-w-[12rem]"
        >
          {presetId === null && <option value="">Custom code</option>}
          {ALL_PRESET_SNIPPETS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button
          onClick={toggleTrafficPanel}
          title={isTrafficPanelOpen ? "Hide Traffic & Anomaly Monitor" : "Show Traffic & Anomaly Monitor"}
          aria-label="Toggle Traffic Monitor"
          className={`p-1.5 rounded border transition-all ${
            isTrafficPanelOpen
              ? "border-cyber-blue bg-cyber-blue/20 text-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.4)]"
              : "border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
          }`}
        >
          <Activity className="w-4 h-4" />
        </button>

        <button
          onClick={toggleSound}
          title={soundEnabled ? "Mute audio" : "Enable audio"}
          aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
          className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyber-blue" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={resetArena}
          disabled={isRunning}
          title="Reset to the default preset"
          aria-label="Reset to the default preset"
          className="p-1.5 rounded border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {isRunning ? (
          <button
            onClick={cancelAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-bold bg-cyber-red/20 text-cyber-red border border-cyber-red hover:bg-cyber-red hover:text-black transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" aria-hidden />
            <span>CANCEL</span>
          </button>
        ) : (
          <button
            onClick={startAudit}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded font-bold bg-cyber-red text-black border border-cyber-red hover:bg-cyber-red-glow shadow-red-glow tracking-wider transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden />
            <span>PLAY DEMO</span>
          </button>
        )}
      </div>
    </header>
  );
}
