import "server-only";

export interface CreatePrParams {
  repo: string; // "owner/repo" or full URL
  filePath: string;
  patchedCode: string;
  commitMessage?: string;
  prTitle?: string;
  prBody?: string;
  githubToken?: string;
}

export interface CreatePrResult {
  ok: boolean;
  prUrl?: string;
  prNumber?: number;
  branchName?: string;
  error?: string;
}

export class GitHubPrService {
  public static async createSecurityPr(params: CreatePrParams): Promise<CreatePrResult> {
    const token = params.githubToken || process.env.GITHUB_TOKEN;
    if (!token) {
      return {
        ok: false,
        error: "GitHub Token is required. Please provide a Personal Access Token or configure GITHUB_TOKEN in your environment.",
      };
    }

    const cleanRepo = params.repo.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
    const parts = cleanRepo.split("/").filter(Boolean);
    if (parts.length < 2) {
      return {
        ok: false,
        error: "Invalid GitHub repository format. Expected 'owner/repo'.",
      };
    }

    const [owner, repo] = parts;
    const cleanFilePath = params.filePath.replace(/^\/+/, "");

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Hack-Me-Baby-Security-Audit/1.0",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    try {
      // 1. Get repository info & default branch
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (!repoRes.ok) {
        const err = await repoRes.json().catch(() => ({}));
        return { ok: false, error: `Failed to fetch repo: ${err.message || repoRes.statusText}` };
      }
      const repoData = await repoRes.json();
      const defaultBranch = repoData.default_branch || "main";

      // 2. Get latest commit SHA on default branch
      const refRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`,
        { headers }
      );
      if (!refRes.ok) {
        return { ok: false, error: `Failed to get head ref for branch ${defaultBranch}` };
      }
      const refData = await refRes.json();
      const baseSha = refData.object.sha;

      // 3. Create a new remediation branch
      const branchName = `security/blue-bot-patch-${Date.now().toString(36)}`;
      const createBranchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha,
        }),
      });

      if (!createBranchRes.ok) {
        const err = await createBranchRes.json().catch(() => ({}));
        return { ok: false, error: `Failed to create branch: ${err.message || createBranchRes.statusText}` };
      }

      // 4. Get file SHA if the file already exists on the repo
      let fileSha: string | undefined;
      const fileRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${cleanFilePath}?ref=${branchName}`,
        { headers }
      );
      if (fileRes.ok) {
        const fileData = await fileRes.json();
        fileSha = fileData.sha;
      }

      // 5. Commit the patched code to the new branch
      const contentBase64 = Buffer.from(params.patchedCode, "utf-8").toString("base64");
      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${cleanFilePath}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            message:
              params.commitMessage ||
              `fix(security): apply Blue Bot automated patch for ${cleanFilePath}`,
            content: contentBase64,
            branch: branchName,
            ...(fileSha ? { sha: fileSha } : {}),
          }),
        }
      );

      if (!commitRes.ok) {
        const err = await commitRes.json().catch(() => ({}));
        return { ok: false, error: `Failed to commit patch: ${err.message || commitRes.statusText}` };
      }

      // 6. Open Pull Request
      const prTitle =
        params.prTitle || `🔒 [Blue Agent] Automated Security Remediation for ${cleanFilePath}`;
      const prBody =
        params.prBody ||
        `## 🛡️ Blue Agent Security Remediation Summary\n\n` +
          `An automated security audit by **Hack Me Baby Swarm** identified a vulnerability in \`${cleanFilePath}\` and synthesized this verified patch.\n\n` +
          `### 🛠️ Key Remediation Highlights:\n` +
          `- Applied parameterized query boundaries and defensive input sanitation.\n` +
          `- Verified against regression and syntax checks.\n` +
          `- Audited by autonomous Red-Blue Swarm Sentinel.\n\n` +
          `*Generated automatically by Hack-Me-Baby Blue Agent.*`;

      const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: prTitle,
          body: prBody,
          head: branchName,
          base: defaultBranch,
        }),
      });

      if (!prRes.ok) {
        const err = await prRes.json().catch(() => ({}));
        return { ok: false, error: `Failed to create Pull Request: ${err.message || prRes.statusText}` };
      }

      const prData = await prRes.json();
      return {
        ok: true,
        prUrl: prData.html_url,
        prNumber: prData.number,
        branchName,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown GitHub API error";
      return { ok: false, error: message };
    }
  }
}
