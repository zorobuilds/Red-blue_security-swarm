"use client";

import React, { useState } from "react";
import { GitPullRequest, Loader2, X, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { useCyberArena } from "@/frontend/hooks/useCyberArenaState";

export function GitHubPrModal() {
  const isOpen = useCyberArena((s) => s.isPrModalOpen);
  const setPrModalOpen = useCyberArena((s) => s.setPrModalOpen);
  const target = useCyberArena((s) => s.target);
  const blue = useCyberArena((s) => s.blue);

  const [repo, setRepo] = useState("");
  const [filePath, setFilePath] = useState(target.fileName || "src/auth.ts");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prResult, setPrResult] = useState<{ prUrl: string; branchName: string } | null>(null);

  if (!isOpen) return null;

  const handleCreatePr = async () => {
    if (!blue?.patchedCode) return;
    setLoading(true);
    setError(null);
    setPrResult(null);

    try {
      const res = await fetch("/api/github-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repo.trim(),
          filePath: filePath.trim(),
          patchedCode: blue.patchedCode,
          githubToken: token.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to create Pull Request");
      }

      setPrResult({ prUrl: data.prUrl, branchName: data.branchName });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pr-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono"
    >
      <div className="w-full max-w-lg bg-cyber-panel border border-cyber-border rounded-lg shadow-2xl p-5 text-xs text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div id="pr-title" className="flex items-center gap-2 font-bold text-sm text-slate-100">
            <GitPullRequest className="w-4 h-4 text-cyber-blue" aria-hidden />
            <span>DEPLOY REMEDIATION AS GITHUB PR</span>
          </div>
          <button onClick={() => setPrModalOpen(false)} aria-label="Close" className="text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-[11px] text-slate-400">
          The Blue Agent will create a dedicated security branch, commit the synthesized patch, and open an official Pull Request on your repository.
        </p>

        {prResult ? (
          <div className="my-4 p-4 rounded bg-emerald-950/40 border border-emerald-500/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Pull Request Created Successfully!</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Branch: <code className="text-emerald-300">{prResult.branchName}</code>
            </p>
            <a
              href={prResult.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 transition-all text-xs"
            >
              <span>View Pull Request on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <form
            className="my-3 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void handleCreatePr();
            }}
          >
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Repository (owner/repo):</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="e.g. your-org/target-app"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyber-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">File Path in Repository:</label>
              <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="e.g. src/auth/loginService.ts"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyber-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                GitHub Personal Access Token <span className="text-slate-500">(optional if configured on server)</span>:
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyber-blue"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 text-cyber-red p-2.5 bg-cyber-red/10 border border-cyber-red/30 rounded">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPrModalOpen(false)}
                className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !repo.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyber-blue text-black font-bold rounded hover:bg-cyber-blue-glow transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitPullRequest className="w-3.5 h-3.5" />}
                <span>{loading ? "CREATING PR..." : "DEPLOY PR"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
