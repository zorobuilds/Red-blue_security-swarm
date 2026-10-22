"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VulnerableDemoContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [reflectedHtml, setReflectedHtml] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      // Intentionally vulnerable DOM reflection for security testing
      setReflectedHtml(q);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReflectedHtml(query);
    // If payload contains script/img with alert or onerror, simulate execution
    if (query.includes("alert") || query.includes("onerror")) {
      const match = query.match(/alert\(['"](.*?)['"]\)/);
      const msg = match ? match[1] : "PWNED_BY_RED_AGENT";
      setTimeout(() => {
        window.alert(msg);
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="border-b border-red-500/40 pb-4">
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/40">
            TEST TARGET: INSECURE WEB APPLICATION
          </span>
          <h1 className="text-2xl font-black mt-2">Vulnerable Demo Portal v1.0</h1>
          <p className="text-xs text-slate-400 mt-1">
            Built-in staging app for testing autonomous Playwright penetration vectors.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200">Search Products & Records</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Search Query:</label>
              <input
                type="text"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search catalog or users..."
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs transition-colors"
            >
              Search Database
            </button>
          </form>

          {reflectedHtml && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded">
              <span className="text-xs text-slate-500 block mb-1">Search Results for:</span>
              {/* Intentionally rendering raw HTML to demonstrate DOM XSS */}
              <div
                className="text-sm text-yellow-300 font-sans"
                dangerouslySetInnerHTML={{ __html: reflectedHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VulnerableDemoPage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono text-xs text-slate-500">Loading demo portal...</div>}>
      <VulnerableDemoContent />
    </Suspense>
  );
}
