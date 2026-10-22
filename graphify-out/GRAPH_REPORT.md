# Graph Report - Hack-Me-Baby-  (2026-10-14)

## Corpus Check
- Corpus is ~30,641 words - fits in a single context window. You may not need a graph.

## Summary
- 582 nodes · 1351 edges · 25 communities (21 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Cyber Dashboard UI & Visualizations
- Red & Blue Agent Core Logic
- SSE Pipeline & Audit Stream Handler
- Duel Playground & Verification
- Server Environment & LLM Providers
- Development Tooling & Linters
- Playwright Attacker & DAST Probing
- TypeScript Types & Declarations
- Client Audit Stream Consumer
- Frontend UI Dependencies
- Preset Vulnerability Scenarios
- War-Room Bot Terminals
- SQLi Sandboxed Test Harness
- GitHub Automated PR Deployer
- CI/CD Code Security Scanner
- ESLint Configuration
- Root Application Layout
- Next.js Build Config
- Tailwind Theme Styling Config

## God Nodes (most connected - your core abstractions)
1. `useCyberArena` - 54 edges
2. `isActivePhase()` - 19 edges
3. `SupportedLanguage` - 18 edges
4. `IsolatedRunner` - 17 edges
5. `compilerOptions` - 16 edges
6. `LlmProvider` - 14 edges
7. `ProviderError` - 13 edges
8. `verifyPatch()` - 13 edges
9. `getAuditRuntime()` - 12 edges
10. `RedResult` - 12 edges

## Surprising Connections (you probably didn't know these)
- `verify()` --calls--> `verifyPatch()`  [EXTRACTED]
  tests/verification.test.ts → src/backend/verification/verifyPatch.ts
- `run()` --calls--> `streamAudit()`  [EXTRACTED]
  tests/auditStreamClient.test.ts → src/frontend/services/auditStreamClient.ts
- `live()` --calls--> `runLiveAudit()`  [EXTRACTED]
  tests/pipeline.test.ts → src/backend/services/auditService.ts
- `live()` --calls--> `createEventStream()`  [EXTRACTED]
  tests/pipeline.test.ts → src/backend/sse/streamHandler.ts
- `begin()` --calls--> `snapshotFromState()`  [EXTRACTED]
  tests/arenaStore.test.ts → src/frontend/services/auditRunner.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "Cyber Dashboard UI & Visualizations"
Cohesion: 0.06
Nodes (58): AlertFlash(), AttackPacket(), ArenaDashboard(), CenterView(), EditorHeader(), TABS, PatchDiffEditor(), TargetCodeEditor() (+50 more)

### Community 1 - "Red & Blue Agent Core Logic"
Cohesion: 0.07
Nodes (49): dynamic, jsonError(), POST(), runtime, runBluePatch(), validateBlueOutput(), BLUE_BOT_SYSTEM_PROMPT, buildBlueUserPrompt() (+41 more)

### Community 2 - "SSE Pipeline & Audit Stream Handler"
Cohesion: 0.07
Nodes (53): Emit, isCancellation(), toRunError(), VerifyStage, OutcomePanel(), FindingCard(), buildAuditReport(), ArenaActions (+45 more)

### Community 3 - "Duel Playground & Verification"
Cohesion: 0.07
Nodes (52): DuelSchema, dynamic, POST(), runtime, DuelInput, runDuelProbe(), getJson(), GITHUB_HEADERS (+44 more)

### Community 4 - "Server Environment & LLM Providers"
Cohesion: 0.08
Nodes (35): dynamic, GET(), runtime, EnvSchema, readServerEnv(), ServerEnv, createGeminiProvider(), GeminiProvider (+27 more)

### Community 5 - "Development Tooling & Linters"
Cohesion: 0.06
Nodes (34): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+26 more)

### Community 6 - "Playwright Attacker & DAST Probing"
Cohesion: 0.09
Nodes (24): dynamic, POST(), runtime, dynamic, POST(), runtime, dynamic, IngestScanSchema (+16 more)

### Community 7 - "TypeScript Types & Declarations"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, ./src/backend/*, ./src/frontend/* (+24 more)

### Community 8 - "Client Audit Stream Consumer"
Cohesion: 0.10
Nodes (21): AuditClientError, ErrorBodySchema, errorFromResponse(), streamAudit(), streamError(), StreamOptions, AuditRequest, ErrorCodeSchema (+13 more)

### Community 9 - "Frontend UI Dependencies"
Cohesion: 0.07
Nodes (29): clsx, framer-motion, @huggingface/inference, lucide-react, @monaco-editor/react, dependencies, clsx, framer-motion (+21 more)

### Community 10 - "Preset Vulnerability Scenarios"
Cohesion: 0.23
Nodes (11): DEMO_SCENARIOS, rceScenario, sqliScenario, ssrfScenario, DemoScenario, ModelRedOutput, DEFAULT_PRESET_ID, PRESET_IDS (+3 more)

### Community 11 - "War-Room Bot Terminals"
Cohesion: 0.21
Nodes (9): DuelPanel(), TerminalHeader(), TerminalHeaderProps, formatTime(), TerminalLogLine(), DuelRequest, DuelResponseSchema, sendDuelProbe() (+1 more)

### Community 12 - "SQLi Sandboxed Test Harness"
Cohesion: 0.31
Nodes (10): attempt(), CASES, describe(), loadModule(), main(), makeDb(), meets(), USERS (+2 more)

### Community 13 - "GitHub Automated PR Deployer"
Cohesion: 0.27
Nodes (6): dynamic, POST(), runtime, CreatePrParams, CreatePrResult, GitHubPrService

### Community 14 - "CI/CD Code Security Scanner"
Cohesion: 0.33
Nodes (3): allIssues, Issue, srcDir

## Knowledge Gaps
- **157 isolated node(s):** `extends`, `next/core-web-vitals`, `nextConfig`, `name`, `version` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useCyberArena` connect `Cyber Dashboard UI & Visualizations` to `SSE Pipeline & Audit Stream Handler`, `War-Room Bot Terminals`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `SupportedLanguage` connect `Duel Playground & Verification` to `Preset Vulnerability Scenarios`, `Red & Blue Agent Core Logic`, `SSE Pipeline & Audit Stream Handler`, `War-Room Bot Terminals`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `nextConfig` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cyber Dashboard UI & Visualizations` be split into smaller, more focused modules?**
  _Cohesion score 0.06228281208233093 - nodes in this community are weakly interconnected._
- **Should `Red & Blue Agent Core Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.07075873827791987 - nodes in this community are weakly interconnected._
- **Should `SSE Pipeline & Audit Stream Handler` be split into smaller, more focused modules?**
  _Cohesion score 0.068997668997669 - nodes in this community are weakly interconnected._
- **Should `Duel Playground & Verification` be split into smaller, more focused modules?**
  _Cohesion score 0.0670762928827445 - nodes in this community are weakly interconnected._