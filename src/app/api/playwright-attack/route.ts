import { NextRequest, NextResponse } from "next/server";
import { PlaywrightAttackerService } from "@/backend/services/playwrightAttackerService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, customPayload } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid 'url' parameter." },
        { status: 400 }
      );
    }

    const result = await PlaywrightAttackerService.executeAutonomousAttack({
      url: url.trim(),
      customPayload: typeof customPayload === "string" ? customPayload.trim() : undefined,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
