"use client";

import React from "react";
import { Terminal, Cpu, Database, Server, Layers, Globe } from "lucide-react";

export function TechStackSection() {
  const techs = [
    { name: "Node.js", color: "text-emerald-400" },
    { name: "Python", color: "text-yellow-400" },
    { name: "React", color: "text-cyan-400" },
    { name: "Next.js", color: "text-white" },
    { name: "Docker", color: "text-blue-400" },
    { name: "AWS", color: "text-amber-500" },
    { name: "MongoDB", color: "text-emerald-500" },
    { name: "PostgreSQL", color: "text-sky-400" },
    { name: "Nginx", color: "text-green-400" },
    { name: "Linux", color: "text-orange-400" },
  ];

  return (
    <section id="tech" className="py-16 px-6 lg:px-16 font-mono relative">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-[10px] tracking-widest text-red-500 uppercase font-bold block mb-1">
            SUPPORTED TECHNOLOGIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            TEST ACROSS <span className="text-red-500">REAL-WORLD ENVIRONMENTS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Works with modern stacks, web frameworks, and cloud platforms.
          </p>
        </div>

        {/* Tech Badges Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {techs.map((t, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-lg border border-cyan-500/60 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_15px_rgba(0,240,255,0.18)] hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] flex items-center gap-2 text-xs font-bold text-slate-200 transition-all hover:scale-105"
            >
              <span className={`w-2 h-2 rounded-full ${t.color.replace("text-", "bg-")}`} />
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
