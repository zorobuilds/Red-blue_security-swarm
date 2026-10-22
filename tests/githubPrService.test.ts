import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitHubPrService } from "@/backend/services/githubPrService";

describe("GitHubPrService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fails gracefully when no GitHub token is available", async () => {
    const result = await GitHubPrService.createSecurityPr({
      repo: "owner/repo",
      filePath: "src/auth.ts",
      patchedCode: "export function auth() {}",
      githubToken: "",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("GitHub Token is required");
  });

  it("fails when repo format is invalid", async () => {
    const result = await GitHubPrService.createSecurityPr({
      repo: "invalid-repo-name",
      filePath: "src/auth.ts",
      patchedCode: "export function auth() {}",
      githubToken: "ghp_fake_token",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("Invalid GitHub repository format");
  });
});
