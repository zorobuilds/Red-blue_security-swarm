"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert, Wifi, Cpu, Lock } from "lucide-react";
import { useCyberArena } from "@/frontend/hooks/useCyberArenaState";

interface PacketLog {
  id: string;
  time: string;
  proto: "TCP" | "HTTP" | "TLS" | "SQL";
  src: string;
  dst: string;
  payload: string;
  anomalyScore: number;
  blocked: boolean;
}

export function TrafficAnomalyPanel() {
  const phase = useCyberArena((s) => s.phase);
  const red = useCyberArena((s) => s.red);
  const blue = useCyberArena((s) => s.blue);

  const [packets, setPackets] = useState<PacketLog[]>([]);
  const [anomalyLevel, setAnomalyLevel] = useState<number>(12);

  useEffect(() => {
    // Generate streaming packets based on current arena phase
    const interval = setInterval(() => {
      const isAttacking = phase === "RED_ANALYSIS" || phase === "BLUE_PATCH";
      const isBlocked = phase === "VERIFYING" || phase === "COMPLETED";

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${Math.floor(
        now.getMilliseconds() / 100
      )}`;

      const attackPayloads = [
        "GET /auth?user=admin'-- HTTP/1.1",
        "POST /api/exec cmd=cat+/etc/passwd",
        "CONNECT 169.254.169.254:80",
        "SYN 10.0.4.15:3306 [SQL_INJECTION]",
        "PAYLOAD: ' UNION SELECT null, password_hash FROM users --",
      ];

      const normalPayloads = [
        "GET /static/styles.css HTTP/1.1",
        "POST /api/telemetry [HEALTHCHECK_OK]",
        "TLSv1.3 Handshake ClientHello [ECDHE-RSA]",
        "GET /api/session/verify HTTP/1.1",
        "ACK seq 49102 ack 84920 win 65535",
      ];

      const samplePayload = isAttacking
        ? attackPayloads[Math.floor(Math.random() * attackPayloads.length)]
        : normalPayloads[Math.floor(Math.random() * normalPayloads.length)];

      const calculatedAnomaly = isAttacking
        ? Math.floor(75 + Math.random() * 24)
        : isBlocked
        ? Math.floor(5 + Math.random() * 10)
        : Math.floor(10 + Math.random() * 18);

      setAnomalyLevel(calculatedAnomaly);

      const newPacket: PacketLog = {
        id: Math.random().toString(36).slice(2, 9),
        time: timeStr,
        proto: isAttacking ? "SQL" : "TCP",
        src: isAttacking ? "198.51.100.44:54321" : "192.168.1.105:443",
        dst: "10.0.0.1:3000",
        payload: samplePayload,
        anomalyScore: calculatedAnomaly,
        blocked: isBlocked || (isAttacking && Boolean(blue?.patchedCode)),
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 19)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [phase, red, blue]);

  return (
    <div className="flex flex-col h-full bg-cyber-terminal font-mono text-xs border border-cyber-border rounded overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-cyber-border text-[11px]">
        <div className="flex items-center gap-2 text-cyber-blue font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>TRAFFIC & ANOMALY PACKET MONITOR</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span>eBPF Filter: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Anomaly:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                anomalyLevel > 60
                  ? "bg-cyber-red/20 text-cyber-red border border-cyber-red/40"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {anomalyLevel}% {anomalyLevel > 60 ? "THREAT DETECTED" : "NORMAL"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto space-y-1.5">
        {packets.length === 0 && (
          <div className="text-slate-500 p-4 text-center">Listening for network packets...</div>
        )}
        {packets.map((pkt) => (
          <div
            key={pkt.id}
            className={`p-2 rounded border text-[11px] flex items-center justify-between gap-2 transition-all ${
              pkt.blocked
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : pkt.anomalyScore > 60
                ? "bg-cyber-red/10 border-cyber-red/40 text-cyber-red"
                : "bg-slate-900/40 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] text-slate-500 shrink-0">{pkt.time}</span>
              <span className="px-1 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-slate-300 shrink-0">
                {pkt.proto}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                {pkt.src} &rarr; {pkt.dst}
              </span>
              <span className="font-mono text-slate-200 truncate">{pkt.payload}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {pkt.blocked ? (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  <Lock className="w-2.5 h-2.5" />
                  INTERCEPTED
                </span>
              ) : pkt.anomalyScore > 60 ? (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-cyber-red/20 text-cyber-red font-bold border border-cyber-red/40">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  FLAGGED ({pkt.anomalyScore}%)
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">CLEAN</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
