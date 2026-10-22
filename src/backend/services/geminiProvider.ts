import "server-only";
import {
  type CompletionRequest,
  type LlmProvider,
  ProviderError,
  CancelledError,
  abortableDelay,
} from "./llmProvider";
import type { ServerEnv } from "@/backend/config/serverEnv";

export class GeminiProvider implements LlmProvider {
  readonly label = "Google Gemini API";

  constructor(
    private readonly apiKey: string,
    private readonly model: string = "gemini-2.5-flash",
    private readonly timeoutMs: number = 45_000,
    private readonly maxRetries: number = 2
  ) {}

  async complete(request: CompletionRequest): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model
    )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: request.system }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: request.user }],
        },
      ],
      generationConfig: {
        maxOutputTokens: request.maxTokens,
        temperature: 0.1,
      },
    };

    let attempt = 0;
    while (true) {
      if (request.signal.aborted) throw new CancelledError();

      const controller = new AbortController();
      const onAbort = () => controller.abort();
      request.signal.addEventListener("abort", onAbort, { once: true });
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timer);
        request.signal.removeEventListener("abort", onAbort);

        if (!res.ok) {
          const status = res.status;
          const bodyText = await res.text().catch(() => "");
          const retryable = status === 429 || (status >= 500 && status < 600);

          if (retryable && attempt < this.maxRetries) {
            attempt++;
            const backoff = 1000 * Math.pow(2, attempt - 1);
            await abortableDelay(backoff, request.signal);
            continue;
          }

          if (status === 401 || status === 403) {
            throw new ProviderError("CONFIG_MISSING", `Gemini API authentication failed (${status}). Check GEMINI_API_KEY.`);
          }
          throw new ProviderError("PROVIDER_ERROR", `Gemini API error (${status}): ${bodyText.slice(0, 300)}`);
        }

        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidate || typeof candidate !== "string") {
          throw new ProviderError("INVALID_MODEL_OUTPUT", "Gemini returned empty or malformed content.");
        }

        return candidate;
      } catch (err: unknown) {
        clearTimeout(timer);
        request.signal.removeEventListener("abort", onAbort);

        if (err instanceof ProviderError || err instanceof CancelledError) {
          throw err;
        }

        if (controller.signal.aborted && !request.signal.aborted) {
          throw new ProviderError("PROVIDER_TIMEOUT", `Gemini request timed out after ${this.timeoutMs}ms.`);
        }

        if (attempt < this.maxRetries) {
          attempt++;
          const backoff = 1000 * Math.pow(2, attempt - 1);
          await abortableDelay(backoff, request.signal);
          continue;
        }

        const msg = err instanceof Error ? err.message : "Network error contacting Gemini";
        throw new ProviderError("PROVIDER_ERROR", msg, false);
      }
    }
  }
}

export function createGeminiProvider(env: ServerEnv): LlmProvider | null {
  if (!env.GEMINI_API_KEY) return null;
  return new GeminiProvider(
    env.GEMINI_API_KEY,
    env.GEMINI_MODEL || "gemini-2.5-flash",
    env.LLM_TIMEOUT_MS,
    env.LLM_MAX_RETRIES
  );
}
