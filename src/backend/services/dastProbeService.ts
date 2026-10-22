import "server-only";
import { assertPublicHttpUrl } from "./outboundUrlGuard";

export interface DastProbeTarget {
  url: string;
  testVectors?: Array<"xss" | "sqli" | "cors" | "headers" | "traversal">;
}

export interface DastProbeFinding {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  vector: string;
  payload: string;
  evidence: string;
  remediation: string;
}

export interface DastProbeResult {
  targetUrl: string;
  online: boolean;
  statusCode?: number;
  durationMs: number;
  findings: DastProbeFinding[];
  testedVectorsCount: number;
}

export class DastProbeService {
  public static async runProbe(params: DastProbeTarget): Promise<DastProbeResult> {
    const startTime = Date.now();
    let validatedUrl: URL;

    try {
      validatedUrl = await assertPublicHttpUrl(params.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid URL";
      return {
        targetUrl: params.url,
        online: false,
        durationMs: Date.now() - startTime,
        findings: [
          {
            id: "DAST-000",
            type: "NETWORK_BOUNDARY",
            severity: "HIGH",
            title: "Host Inaccessible / Blocked by Boundary Guard",
            vector: "NETWORK",
            payload: "N/A",
            evidence: msg,
            remediation: "Ensure the target host is a valid, publicly routable domain.",
          },
        ],
        testedVectorsCount: 0,
      };
    }

    const findings: DastProbeFinding[] = [];
    let statusCode: number | undefined;

    try {
      // Base probe
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const baseRes = await fetch(validatedUrl.toString(), {
        method: "GET",
        headers: { "User-Agent": "Hack-Me-Baby-DAST-Scanner/1.0" },
        redirect: "manual",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      statusCode = baseRes.status;
      const headers = baseRes.headers;

      // 1. Header validations
      if (!headers.get("content-security-policy")) {
        findings.push({
          id: "DAST-001",
          type: "MISSING_CSP",
          severity: "HIGH",
          title: "Missing Content-Security-Policy (CSP)",
          vector: "HTTP Response Headers",
          payload: "N/A",
          evidence: `HTTP ${baseRes.status} without 'Content-Security-Policy' header`,
          remediation: "Configure a robust Content-Security-Policy (e.g. default-src 'self').",
        });
      }

      if (validatedUrl.protocol === "https:" && !headers.get("strict-transport-security")) {
        findings.push({
          id: "DAST-002",
          type: "MISSING_HSTS",
          severity: "MEDIUM",
          title: "Missing Strict-Transport-Security (HSTS)",
          vector: "Transport Security",
          payload: "N/A",
          evidence: "Missing 'Strict-Transport-Security' header over HTTPS",
          remediation: "Enable HSTS header with 'max-age=31536000; includeSubDomains'.",
        });
      }

      if (headers.get("access-control-allow-origin") === "*") {
        findings.push({
          id: "DAST-003",
          type: "PERMISSIVE_CORS",
          severity: "HIGH",
          title: "Permissive Wildcard CORS Access",
          vector: "Access-Control-Allow-Origin",
          payload: "*",
          evidence: `Access-Control-Allow-Origin: *`,
          remediation: "Restrict Access-Control-Allow-Origin to authorized explicit origins.",
        });
      }

      // 2. Reflected XSS Probe
      try {
        const xssToken = `hacked_${Math.random().toString(36).slice(2, 7)}`;
        const xssProbeUrl = new URL(validatedUrl.toString());
        xssProbeUrl.searchParams.set("q", `<script>${xssToken}</script>`);

        const xssCtrl = new AbortController();
        const xssTimeout = setTimeout(() => xssCtrl.abort(), 4000);
        const xssRes = await fetch(xssProbeUrl.toString(), {
          method: "GET",
          headers: { "User-Agent": "Hack-Me-Baby-DAST-Scanner/1.0" },
          redirect: "manual",
          signal: xssCtrl.signal,
        });
        clearTimeout(xssTimeout);

        const xssBody = await xssRes.text().catch(() => "");
        if (xssBody.includes(`<script>${xssToken}</script>`)) {
          findings.push({
            id: "DAST-004",
            type: "REFLECTED_XSS",
            severity: "CRITICAL",
            title: "Reflected Cross-Site Scripting (XSS)",
            vector: "GET Query Parameter ?q=",
            payload: `<script>${xssToken}</script>`,
            evidence: `Raw unsanitized script tag reflected verbatim in response body`,
            remediation: "HTML-encode dynamic user inputs before rendering into DOM templates.",
          });
        }
      } catch {
        // Continue
      }

      // 3. SQLi Error Fingerprint Probe
      try {
        const sqliProbeUrl = new URL(validatedUrl.toString());
        sqliProbeUrl.searchParams.set("id", "1' OR '1'='1");

        const sqliCtrl = new AbortController();
        const sqliTimeout = setTimeout(() => sqliCtrl.abort(), 4000);
        const sqliRes = await fetch(sqliProbeUrl.toString(), {
          method: "GET",
          headers: { "User-Agent": "Hack-Me-Baby-DAST-Scanner/1.0" },
          redirect: "manual",
          signal: sqliCtrl.signal,
        });
        clearTimeout(sqliTimeout);

        const sqliBody = await sqliRes.text().catch(() => "");
        const sqlErrorPatterns = /syntax error|sql syntax|sqlite3::|unclosed quotation mark|pg_query/i;
        if (sqlErrorPatterns.test(sqliBody)) {
          findings.push({
            id: "DAST-005",
            type: "SQLI_ERROR_DISCLOSURE",
            severity: "CRITICAL",
            title: "SQL Error-Based Information Leakage",
            vector: "GET Query Parameter ?id=",
            payload: "1' OR '1'='1",
            evidence: "Database syntax error string detected in response body.",
            remediation: "Use parameterized queries and suppress verbose DB error details in production.",
          });
        }
      } catch {
        // Continue
      }

      return {
        targetUrl: validatedUrl.toString(),
        online: true,
        statusCode,
        durationMs: Date.now() - startTime,
        findings,
        testedVectorsCount: 5,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Target request timed out or was unreachable";
      return {
        targetUrl: validatedUrl.toString(),
        online: false,
        durationMs: Date.now() - startTime,
        findings: [
          {
            id: "DAST-TIMEOUT",
            type: "TIMEOUT_OR_UNREACHABLE",
            severity: "LOW",
            title: "Target Endpoint Unreachable",
            vector: "HTTP Connection",
            payload: "N/A",
            evidence: msg,
            remediation: "Verify endpoint status and network availability.",
          },
        ],
        testedVectorsCount: 1,
      };
    }
  }
}
