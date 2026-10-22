import { NextRequest, NextResponse } from "next/server";
import { DastProbeService } from "@/backend/services/dastProbeService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ ok: false, error: "Missing or invalid 'url' parameter." }, { status: 400 });
    }

    const result = await DastProbeService.runProbe({ url });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
