"use client";

import React from "react";
import { Header } from "@/frontend/components/layout/Header";
import { Sidebar } from "@/frontend/components/layout/Sidebar";
import { StatusBanner } from "@/frontend/components/layout/StatusBanner";
import { ThreePanelLayout } from "@/frontend/components/layout/ThreePanelLayout";
import { EditorHeader } from "@/frontend/components/editor/EditorHeader";
import { TargetCodeEditor } from "@/frontend/components/editor/TargetCodeEditor";
import { PatchDiffEditor } from "@/frontend/components/editor/PatchDiffEditor";
import { VerificationView } from "@/frontend/components/editor/VerificationView";
import { OutcomePanel } from "@/frontend/components/editor/OutcomePanel";
import { RedBotTerminal } from "@/frontend/components/terminal/RedBotTerminal";
import { BlueBotTerminal } from "@/frontend/components/terminal/BlueBotTerminal";
import { AttackPacket } from "@/frontend/components/animations/AttackPacket";
import { AlertFlash } from "@/frontend/components/animations/AlertFlash";
import { GlitchBackgroundFX } from "@/frontend/components/animations/GlitchBackgroundFX";
import { RepoIngestModal } from "@/frontend/components/modals/RepoIngestModal";
import { GitHubPrModal } from "@/frontend/components/modals/GitHubPrModal";
import { PlaywrightExploitModal } from "@/frontend/components/modals/PlaywrightExploitModal";
import { TrafficAnomalyPanel } from "@/frontend/components/terminal/TrafficAnomalyPanel";
import { useCyberArena } from "@/frontend/hooks/useCyberArenaState";
import { useAuditLifecycle } from "@/frontend/hooks/useAgentStream";

function CenterView() {
  const editorView = useCyberArena((s) => s.editorView);
  const hasPatch = useCyberArena((s) => Boolean(s.blue?.patchedCode));
  if (editorView === "VERIFICATION") return <VerificationView />;
  if (editorView === "DIFF" && hasPatch) return <PatchDiffEditor />;
  return <TargetCodeEditor />;
}

export function ArenaDashboard({ embedded = false }: { embedded?: boolean }) {
  useAuditLifecycle();
  const isTrafficPanelOpen = useCyberArena((s) => s.isTrafficPanelOpen);

  return (
    <main className={`flex flex-col ${embedded ? "bg-transparent" : "bg-cyber-bg cyber-grid"} overflow-hidden relative ${embedded ? "w-full h-full" : "h-screen w-screen"}`}>
      {/* Glitch Reality Background FX Layer */}
      {!embedded && <GlitchBackgroundFX />}

      <Header />
      <StatusBanner />

      <div className="flex-1 flex overflow-hidden z-10 relative">
        <Sidebar />

        <ThreePanelLayout
          leftPanel={<RedBotTerminal />}
          centerPanel={
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <EditorHeader />
              <div className="flex-1 relative overflow-hidden flex flex-col">
                <div className="flex-1 relative overflow-hidden flex">
                  <CenterView />
                </div>
                {isTrafficPanelOpen && (
                  <div className="h-44 border-t border-cyber-border shrink-0 bg-cyber-panel/90 backdrop-blur">
                    <TrafficAnomalyPanel />
                  </div>
                )}
              </div>
              <OutcomePanel />
            </div>
          }
          rightPanel={<BlueBotTerminal />}
        />
      </div>

      <AttackPacket />
      <AlertFlash />
      <RepoIngestModal />
      <GitHubPrModal />
      <PlaywrightExploitModal />
    </main>
  );
}
