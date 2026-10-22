import { NextRequest, NextResponse } from "next/server";
import { GitHubPrService } from "@/backend/services/githubPrService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repo, filePath, patchedCode, commitMessage, prTitle, prBody, githubToken } = body;

    if (!repo || !filePath || !patchedCode) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: repo, filePath, and patchedCode are required." },
        { status: 400 }
      );
    }

    const result = await GitHubPrService.createSecurityPr({
      repo,
      filePath,
      patchedCode,
      commitMessage,
      prTitle,
      prBody,
      githubToken,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
