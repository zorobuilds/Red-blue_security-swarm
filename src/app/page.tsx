"use client";

import React from "react";
import { LandingNavbar } from "@/frontend/components/landing/LandingNavbar";
import { HeroSection } from "@/frontend/components/landing/HeroSection";
import { WorkflowSection } from "@/frontend/components/landing/WorkflowSection";
import { DashboardSection } from "@/frontend/components/landing/DashboardSection";
import { FeaturesSection } from "@/frontend/components/landing/FeaturesSection";
import { ReportsSection } from "@/frontend/components/landing/ReportsSection";
import { TechStackSection } from "@/frontend/components/landing/TechStackSection";
import { GlitchBackgroundFX } from "@/frontend/components/animations/GlitchBackgroundFX";

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 cyber-grid relative selection:bg-cyan-500 selection:text-black">
      {/* Glitch Reality Background Artwork Layer across full page */}
      <GlitchBackgroundFX />

      {/* Top Navbar with Dynamic Active Scroll-Spy Highlighting */}
      <LandingNavbar />

      {/* Hero Section (Home) */}
      <HeroSection />

      {/* Workflow Section (Platform: FIND -> FIX -> VERIFY -> DEPLOY) */}
      <WorkflowSection />

      {/* Scenarios (Key Features & Agent Scenarios) */}
      <FeaturesSection />

      {/* Live Operation View (Platform Dashboard) */}
      <DashboardSection />

      {/* Executive Security Reports */}
      <ReportsSection />

      {/* Supported Tech Stacks & Documentation (Docs) */}
      <TechStackSection />

      {/* Subtle Cyberpunk Footer */}
      <footer className="border-t border-slate-900 bg-black/90 py-8 px-6 text-center font-mono text-[11px] text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">GLITCH.REALITY // AUTONOMOUS SECURITY SWARM</span>
          </div>
          <div className="text-slate-500">
            SYSTEM STATUS: <span className="text-emerald-400 font-bold">OPERATIONAL</span> · 24/7 RED-BLUE ENGINE
          </div>
        </div>
      </footer>
    </div>
  );
}
