"use client";

import React from "react";
import { Database, Cpu, Terminal, FlaskConical } from "lucide-react";
import { useCyberArena } from "@/frontend/hooks/useCyberArenaState";
import { useCapabilities } from "@/frontend/hooks/useCapabilities";
import { isActivePhase } from "@/frontend/state/phaseMachine";
import { ALL_PRESET_SNIPPETS } from "@/shared/presets/snippets";

function Row({ label, value, tone = "text-slate-200" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex justify-between gap-2 text-slate-400">
      <span>{label}</span>
      <span className={`font-bold text-right ${tone}`}>{value}</span>
    </div>
  );
}

export function Sidebar() {
  const presetId = useCyberArena((s) => s.target.presetId);
  const loadPreset = useCyberArena((s) => s.loadPreset);
  const phase = useCyberArena((s) => s.phase);
  const mode = useCyberArena((s) => s.mode);
  const findingCount = useCyberArena((s) => s.red?.findings.length);
  const verification = useCyberArena((s) => s.verification);
  const caps = useCapabilities();
  const running = isActivePhase(phase);

  return (
    <aside className="w-64 border-r-2 border-cyan-500/50 bg-white/[0.02] backdrop-blur-xl p-4 hidden lg:flex flex-col gap-6 shrink-0 z-20 overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider font-bold">
          <Database className="w-3.5 h-3.5 text-cyber-blue" aria-hidden />
          <span>Preset Scenarios</span>
        </div>
        <div className="flex flex-col gap-2">
          {ALL_PRESET_SNIPPETS.map((preset) => {
            const isSelected = presetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id)}
                disabled={running}
                aria-pressed={isSelected}
                className={`text-left p-2.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? "bg-cyan-500/10 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                    : "border border-cyan-500/40 bg-white/[0.03] backdrop-blur-md text-slate-300 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:text-white"
                }`}
              >
                <div className="font-semibold text-slate-200">{preset.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{preset.category}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug">{preset.verificationNote}</div>
              </button>
            );
          })}
          {presetId === null && (
            <div className="p-2.5 rounded border border-cyber-blue/60 text-[11px] font-mono text-slate-300">
              Custom code loaded — detached from presets. Live mode only.
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-cyber-red" aria-hidden />
          <span>Run Telemetry</span>
        </div>
        <div className="p-3 rounded border border-slate-800 bg-slate-900/60 font-mono text-xs space-y-1.5">
          <Row label="Mode:" value={mode === "DEMO" ? "DEMO (simulation)" : "LIVE"} tone={mode === "DEMO" ? "text-cyber-warning" : "text-cyber-blue"} />
          <Row label="State:" value={phase} tone="text-cyber-neon" />
          <Row label="Findings:" value={findingCount === undefined ? "—" : String(findingCount)} tone="text-cyber-red" />
          <Row label="Verification:" value={verification ? verification.status : "—"} />
        </div>
      </div>

      <div className="mt-auto border-t border-slate-800/80 pt-4 text-[11px] font-mono text-slate-500 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyber-blue" aria-hidden />
          Live model: {caps ? (caps.live.configured ? caps.live.model : "not configured") : "…"}
        </div>
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3 h-3 text-cyber-warning" aria-hidden />
          Fixture runner: {caps ? (caps.verifier.fixtureExecution ? "available" : "unavailable") : "…"}
        </div>
      </div>
    </aside>
  );
}
