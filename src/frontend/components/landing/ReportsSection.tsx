"use client";

import React from "react";
import { FileText, Download, CheckCircle2, ShieldCheck, GitPullRequest, ArrowRight } from "lucide-react";

export function ReportsSection() {
  const reportsFeatures = [
    {
      title: "CWE Vulnerability Telemetry",
      desc: "Detailed classification with CWE identifiers, confidence metrics, and pinpointed line ranges.",
      tag: "TRACE ANALYSIS",
    },
    {
      title: "Playwright Proof-of-Exploit",
      desc: "Reproducible automated browser traces and payload payloads proving vulnerability in sandbox.",
      tag: "ATTACK PROOF",
    },
    {
      title: "1-Click GitHub Pull Requests",
      desc: "Automated patch branch generation with verified unit and regression test passes.",
      tag: "VERIFIED FIX",
    },
  ];

  return (
    <section id="reports" className="py-16 px-6 lg:px-16 border-b border-cyber-border font-mono relative scroll-mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-bold block mb-1">
              AUDIT & COMPLIANCE // CVE MITIGATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              EXECUTIVE <span className="text-cyan-400">AUDIT REPORTS</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evidence-based security reports generated with CWE proofs, reproducible exploit traces, and verified patches.
            </p>
          </div>

          <a
            href="#dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/60 bg-white/[0.04] backdrop-blur-xl text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] font-bold text-xs tracking-wider transition-all self-start md:self-auto"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Generate In Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportsFeatures.map((rf, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border-2 border-cyan-500/60 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all relative group"
            >
              <div className="hud-corner-tl opacity-90 text-cyan-400" />
              <div className="hud-corner-tr opacity-90 text-cyan-400" />

              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold tracking-widest inline-block mb-3">
                {rf.tag}
              </span>

              <h3 className="text-sm font-bold text-white mb-2 tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{rf.title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{rf.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
