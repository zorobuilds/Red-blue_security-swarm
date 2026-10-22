import { getAuditRuntime } from "@/backend/services/runtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Reports what the server can do without revealing any credential values. */
export async function GET() {
  try {
    const { env, runner } = getAuditRuntime();
    const availability = await runner.availability();
    const providerLabel = env.NVIDIA_API_KEY
      ? "NVIDIA Nemotron (NIM)"
      : env.GEMINI_API_KEY
      ? "Google Gemini API"
      : env.HF_TOKEN
      ? "Hugging Face Inference Providers"
      : "Not Configured";
    const activeModel = env.NVIDIA_API_KEY
      ? env.NVIDIA_MODEL
      : env.GEMINI_API_KEY
      ? env.GEMINI_MODEL
      : env.HF_MODEL;
    const isLiveConfigured = Boolean(env.NVIDIA_API_KEY || env.GEMINI_API_KEY || env.HF_TOKEN);

    return Response.json({
      live: {
        configured: isLiveConfigured,
        provider: providerLabel,
        model: activeModel,
      },
      verifier: {
        fixtureExecution: availability.ok,
        detail: availability.ok ? runner.name : availability.reason,
      },
      github: {
        configured: Boolean(env.GITHUB_TOKEN),
      },
    });
  } catch {
    return Response.json({ error: { code: "INTERNAL", message: "Server configuration is invalid." } }, { status: 500 });
  }
}
