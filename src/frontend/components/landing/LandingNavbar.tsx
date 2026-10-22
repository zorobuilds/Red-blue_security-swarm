"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  targetId: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#hero", targetId: "hero" },
  { label: "Platform", href: "#workflow", targetId: "workflow" },
  { label: "Scenarios", href: "#scenarios", targetId: "scenarios" },
  { label: "Dashboard", href: "#dashboard", targetId: "dashboard" },
  { label: "Reports", href: "#reports", targetId: "reports" },
  { label: "Docs", href: "#tech", targetId: "tech" },
];

export function LandingNavbar() {
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      // If at the bottom of the page, activate the last nav item (Docs)
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70;
      if (isAtBottom) {
        setActiveSection("tech");
        return;
      }

      // Check which section intersects the active navbar reference line (~140px down from viewport top)
      const navReferenceY = 140;
      let matchedId = NAV_ITEMS[0].targetId;

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navReferenceY && rect.bottom > navReferenceY) {
            matchedId = item.targetId;
            break;
          }
        }
      }

      setActiveSection(matchedId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 64;
      const targetY = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      setActiveSection(targetId);
    }
  };

  return (
    <nav className="w-full border-b border-cyber-border/80 bg-black/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-40 sticky top-0 font-mono text-xs">
      {/* Brand */}
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, "hero")}
        className="flex items-center gap-3 group transition-transform hover:scale-105"
      >
        <div className="relative">
          <ShieldAlert className="w-5 h-5 text-cyber-red animate-flicker" />
          <div className="absolute inset-0 bg-cyber-red/30 blur-md -z-10" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-sm tracking-widest text-white">
            GLITCH<span className="text-cyber-blue">.</span>REALITY
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-red/20 border border-cyber-red/40 text-cyber-red font-bold">
            v2.0
          </span>
        </div>
      </a>

      {/* Nav Links with Dynamic Lit-Up State on Scroll & Click */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.targetId;
          return (
            <a
              key={item.targetId}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.targetId)}
              className={`relative py-1 transition-all ${
                isActive
                  ? "text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
                  : "text-slate-400 hover:text-slate-200 font-medium"
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#00f0ff] rounded-full" />
              )}
            </a>
          );
        })}
      </div>

      {/* Action */}
      <div>
        <a
          href="#dashboard"
          onClick={(e) => handleNavClick(e, "dashboard")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-cyber-red/60 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red hover:text-black font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(255,0,60,0.25)]"
        >
          <span>Launch Platform</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </nav>
  );
}
