"use client";

import React from "react";
import { Zap, Shield, Box, Activity } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Autonomous Red Team",
      desc: "Discovers vulnerabilities using advanced AI agents and safe exploitation techniques.",
      icon: <Zap className="w-5 h-5 text-red-500" />,
      border: "border-red-500/40 hover:border-red-500",
      accent: "bg-red-500/10",
    },
    {
      title: "Autonomous Blue Team",
      desc: "Generates secure patches, follows best practices, and verifies the fixes automatically.",
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      border: "border-cyan-500/40 hover:border-cyan-500",
      accent: "bg-cyan-500/10",
    },
    {
      title: "Isolated Execution",
      desc: "All exploits and tests run in isolated environments to ensure safety.",
      icon: <Box className="w-5 h-5 text-purple-400" />,
      border: "border-purple-500/40 hover:border-purple-500",
      accent: "bg-purple-500/10",
    },
    {
      title: "Continuous Monitoring",
      desc: "Keeps scanning, patching, and verifying 24/7 — even after deployment.",
      icon: <Activity className="w-5 h-5 text-pink-400" />,
      border: "border-pink-500/40 hover:border-pink-500",
      accent: "bg-pink-500/10",
    },
  ];

  return (
    <section id="scenarios" className="py-16 px-6 lg:px-16 border-b border-cyber-border font-mono relative scroll-mt-16">
      <div id="features" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-1">
            KEY FEATURES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            MORE THAN <span className="text-red-500">A SCANNER</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            A complete AI-driven security platform, from attack to automated remediation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border-2 bg-white/[0.04] backdrop-blur-xl relative group transition-all ${
                i === 0
                  ? "border-red-500/80 shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:border-red-400 hover:shadow-[0_0_30px_rgba(255,0,60,0.5)]"
                  : "border-cyan-500/70 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.45)]"
              }`}
            >
              <div className={`hud-corner-tl opacity-90 ${i === 0 ? "text-red-500" : "text-cyan-400"}`} />
              <div className={`hud-corner-tr opacity-90 ${i === 0 ? "text-red-500" : "text-cyan-400"}`} />

              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.accent} border border-white/10`}>
                {f.icon}
              </div>

              <h3 className="text-sm font-bold text-white mb-2 tracking-wide">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
