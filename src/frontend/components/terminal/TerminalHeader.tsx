"use client";

import React, { ReactNode } from "react";

interface TerminalHeaderProps {
  title: string;
  agentRole: "RED" | "BLUE";
  statusText: string;
  icon: ReactNode;
}

export function TerminalHeader({
  title,
  agentRole,
  statusText,
  icon,
}: TerminalHeaderProps) {
  const isRed = agentRole === "RED";

  return (
    <div
      className={`h-10 px-4 border-b flex items-center justify-between shrink-0 font-mono text-xs bg-black/20 backdrop-blur-sm ${
        isRed
          ? "border-cyber-red/30 text-cyber-red"
          : "border-cyber-blue/30 text-cyber-blue"
      }`}
    >
      <div className="flex items-center gap-2 font-bold tracking-wider">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full animate-ping ${
            isRed ? "bg-cyber-red" : "bg-cyber-blue"
          }`}
        />
        <span className="text-[10px] text-slate-300 uppercase font-semibold">
          {statusText}
        </span>
      </div>
    </div>
  );
}
