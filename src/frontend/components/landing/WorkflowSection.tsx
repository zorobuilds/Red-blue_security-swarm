"use client";

import React from "react";
import { Crosshair, Wrench, ShieldCheck, CloudUpload, ArrowRight } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      num: "01",
      name: "Find",
      icon: <Crosshair className="w-5 h-5 text-red-400" />,
      color: "border-red-500/40 text-red-400",
      points: ["Red Team scans and finds vulnerabilities", "Generates exploit proofs"],
    },
    {
      num: "02",
      name: "Fix",
      icon: <Wrench className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/40 text-cyan-400",
      points: ["Blue Team writes secure patches using AI", "Suggests best practices"],
    },
    {
      num: "03",
      name: "Verify",
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/40 text-cyan-400",
      points: ["Automatically tests that the fix works", "Ensures no regressions"],
    },
    {
      num: "04",
      name: "Deploy",
      icon: <CloudUpload className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/40 text-cyan-400",
      points: ["Deploys the verified patch", "Monitors for new threats"],
    },
  ];

  return (
    <section id="workflow" className="py-16 px-6 lg:px-16 border-b border-cyber-border font-mono relative">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-1">
            WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            FIND <span className="text-red-500">→</span> FIX <span className="text-cyan-400">→</span> VERIFY <span className="text-cyan-400">→</span> DEPLOY
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            A complete autonomous security loop powered by collaborative AI agents.
          </p>
        </div>

        {/* 4 Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`p-5 rounded-xl border-2 bg-white/[0.04] backdrop-blur-xl relative group transition-all ${
                idx === 0
                  ? "border-red-500 shadow-[0_0_20px_rgba(255,0,60,0.35)] hover:shadow-[0_0_30px_rgba(255,0,60,0.55)] hover:border-red-400"
                  : "border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:border-cyan-300"
              }`}
            >
              <div className={`hud-corner-tl opacity-90 ${idx === 0 ? "text-red-500" : "text-cyan-400"}`} />
              <div className={`hud-corner-tr opacity-90 ${idx === 0 ? "text-red-500" : "text-cyan-400"}`} />

              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-slate-500">{step.num}</span>
              </div>

              <div className="text-sm font-bold text-white mb-3 tracking-wide">{step.name}</div>

              <ul className="space-y-2 text-xs text-slate-400">
                {step.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 select-none">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Arrow connector for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 items-center justify-center text-slate-400">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
