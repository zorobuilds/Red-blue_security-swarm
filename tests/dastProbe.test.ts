import { describe, it, expect } from "vitest";
import { DastProbeService } from "@/backend/services/dastProbeService";

describe("DastProbeService", () => {
  it("rejects private IPs and localhost to prevent SSRF", async () => {
    const result = await DastProbeService.runProbe({ url: "http://127.0.0.1:8080/admin" });
    expect(result.online).toBe(false);
    expect(result.findings[0].type).toBe("NETWORK_BOUNDARY");
  });

  it("rejects cloud metadata IPs (169.254.169.254)", async () => {
    const result = await DastProbeService.runProbe({ url: "http://169.254.169.254/latest/meta-data/" });
    expect(result.online).toBe(false);
    expect(result.findings[0].type).toBe("NETWORK_BOUNDARY");
  });
});
