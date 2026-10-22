"use client";

import React, { useMemo } from "react";
import { ArrowRight, Play, ShieldAlert, Shield, Check, Flame } from "lucide-react";

export function HeroSection() {
  // Dynamic floating glitch blocks on the right side
  const glitchBlocks = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      top: `${(i * 2.7) % 95}%`,
      right: `${2 + ((i * 7) % 55)}%`,
      width: `${20 + ((i * 13) % 60)}px`,
      height: `${3 + (i % 6)}px`,
      color:
        i % 4 === 0
          ? "rgba(0, 240, 255, 0.9)"
          : i % 4 === 1
          ? "rgba(255, 0, 127, 0.9)"
          : i % 4 === 2
          ? "rgba(157, 78, 221, 0.85)"
          : "rgba(255, 255, 255, 0.75)",
      delay: `${(i * 0.09) % 2.5}s`,
      duration: `${1.3 + (i % 3)}s`,
    }));
  }, []);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-between px-6 lg:px-16 py-12 overflow-hidden border-b border-cyber-border">
      {/* Background Poster Image with Moving Glitch Effect - Extra Bright & Vibrant */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/glitch-bg.jpg"
          alt="Glitch Reality Artwork"
          className="w-full h-full object-cover object-center opacity-100 contrast-115 brightness-130 saturate-125 glitch-image-tear scale-105"
        />
        {/* Light directional gradient to retain readability without darkening artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/30" />

        {/* Moving Horizontal Glitch Scan Bar */}
        <div className="absolute inset-x-0 h-1 bg-cyan-400/90 animate-glitch-bar blur-sm" />

        {/* Ambient CRT Scanlines */}
        <div className="absolute inset-0 scanlines-overlay opacity-20" />

        {/* Animated Digital Glitch Blocks */}
        {glitchBlocks.map((b) => (
          <div
            key={b.id}
            className="absolute rounded-none animate-pixelFloat"
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
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Typography, Taglines & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 block uppercase">
              AUTONOMOUS RED-BLUE
            </span>
            <span className="text-[11px] font-mono tracking-widest text-slate-400 block uppercase">
              PENETRATION & REMEDIATION SWARM
            </span>
          </div>

          {/* Glitching Title with real chromatic displacement */}
          <div className="space-y-1 select-none">
            <h1
              data-text="GLITCH"
              className="text-6xl sm:text-7xl xl:text-8xl font-black tracking-wider text-white glitch-text-moving block font-mono"
            >
              GLITCH
            </h1>
            <h1
              data-text="REALITY"
              className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-widest text-slate-100 block font-mono opacity-90"
            >
              REALITY
            </h1>
          </div>

          {/* Poster Framed Badge */}
          <div className="inline-block px-4 py-2 rounded border border-white/20 bg-black/60 backdrop-blur-md shadow-2xl">
            <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-slate-200 uppercase">
              NOT EVERYTHING YOU SEE IS <span className="text-cyber-red font-bold text-shadow-red">REAL</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-xl leading-relaxed">
            AI-powered offensive and defensive agents that find vulnerabilities, write fixes, verify them, and deploy automatically.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded bg-cyber-red hover:bg-cyber-red-glow text-black font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(255,0,60,0.6)]"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#dashboard"
              className="flex items-center gap-2 px-5 py-3 rounded border border-slate-700 bg-black/60 hover:border-slate-500 text-slate-200 font-mono text-xs tracking-wider transition-all hover:bg-slate-900"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
              <span>Watch Demo</span>
            </a>
          </div>

          {/* Metrics / Key Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-md font-mono">
            <div>
              <div className="text-2xl font-black text-white">97%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Auto-Fix Success</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">10x</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Faster Remediation</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">24/7</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Autonomous Operation</div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Cyber HUD Cards with Highlighted Glowing Borders & Blurry Transparent Glass */}
        <div className="lg:col-span-5 flex flex-col gap-4 xl:pl-6 font-mono">
          {/* Card 1: Red Team Offensive AI */}
          <div className="p-4 rounded-xl border-2 border-red-500 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,60,0.4)] relative group hover:shadow-[0_0_30px_rgba(255,0,60,0.65)] hover:border-red-400 transition-all">
            <div className="hud-corner-tl opacity-90 text-red-500" />
            <div className="hud-corner-tr opacity-90 text-red-500" />
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-red-500/20 border border-red-500/60 text-red-400 shadow-[0_0_10px_rgba(255,0,60,0.3)]">
                <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] font-black text-red-400 tracking-wider flex items-center gap-1.5">
                  <span>RED TEAM // OFFENSIVE AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                </div>
                <div className="text-[11px] text-slate-200 mt-0.5">
                  Finds vulnerabilities and exploits them safely.
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Blue Team Defensive AI */}
          <div className="p-4 rounded-xl border-2 border-cyan-400 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] relative group hover:shadow-[0_0_30px_rgba(0,240,255,0.65)] hover:border-cyan-300 transition-all">
            <div className="hud-corner-tl opacity-90 text-cyan-400" />
            <div className="hud-corner-tr opacity-90 text-cyan-400" />
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-cyan-500/20 border border-cyan-400/60 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-[11px] font-black text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <span>BLUE TEAM // DEFENSIVE AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="text-[11px] text-slate-200 mt-0.5">
                  Writes fixes, verifies and deploys them.
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Fully Autonomous Checkpoints */}
          <div className="p-5 rounded-xl border-2 border-cyan-500/80 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] relative group hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
            <div className="hud-corner-bl opacity-90 text-cyan-400" />
            <div className="hud-corner-br opacity-90 text-cyan-400" />
            <div className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-black">FULLY AUTONOMOUS</span>
            </div>

            <div className="space-y-2 text-xs text-slate-100 font-semibold">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Identify</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exploit (safe environment)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate Fix</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verify Fix</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deploy to production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
