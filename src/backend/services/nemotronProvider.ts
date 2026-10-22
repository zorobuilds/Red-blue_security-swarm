import "server-only";
import {
  type CompletionRequest,
  type LlmProvider,
  ProviderError,
  CancelledError,
  abortableDelay,
} from "./llmProvider";
import type { ServerEnv } from "@/backend/config/serverEnv";

export class NemotronProvider implements LlmProvider {
  readonly label = "NVIDIA Nemotron (NIM)";

  constructor(
    private readonly apiKey: string,
    private readonly model: string = "nvidia/llama-3.1-nemotron-70b-instruct",
    private readonly baseUrl: string = "https://integrate.api.nvidia.com/v1",
    private readonly timeoutMs: number = 45_000,
    private readonly maxRetries: number = 2
  ) {}

  async complete(request: CompletionRequest): Promise<string> {
    const url = `${this.baseUrl.replace(/\/+$/, "")}/chat/completions`;

    const payload = {
      model: this.model,
      messages: [
        { role: "system", content: request.system },
        { role: "user", content: request.user },
      ],
      temperature: 0.1,
      max_tokens: request.maxTokens,
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
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
            throw new ProviderError(
              "CONFIG_MISSING",
              `NVIDIA Nemotron API authentication failed (${status}). Check NVIDIA_API_KEY.`
            );
          }
          throw new ProviderError(
            "PROVIDER_ERROR",
            `NVIDIA API error (${status}): ${bodyText.slice(0, 300)}`
          );
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new ProviderError("INVALID_MODEL_OUTPUT", "Nemotron returned empty content.");
        }

        return content;
      } catch (err: unknown) {
        clearTimeout(timer);
        request.signal.removeEventListener("abort", onAbort);

        if (err instanceof ProviderError || err instanceof CancelledError) {
          throw err;
        }

        if (controller.signal.aborted && !request.signal.aborted) {
          throw new ProviderError(
            "PROVIDER_TIMEOUT",
            `Nemotron request timed out after ${this.timeoutMs}ms.`
          );
        }

        if (attempt < this.maxRetries) {
          attempt++;
          const backoff = 1000 * Math.pow(2, attempt - 1);
          await abortableDelay(backoff, request.signal);
          continue;
        }

        const msg = err instanceof Error ? err.message : "Network error contacting NVIDIA Nemotron";
        throw new ProviderError("PROVIDER_ERROR", msg, false);
      }
    }
  }
}

export function createNemotronProvider(env: ServerEnv): LlmProvider | null {
  const apiKey = env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;
  return new NemotronProvider(
    apiKey,
    env.NVIDIA_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct",
    env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
    env.LLM_TIMEOUT_MS,
    env.LLM_MAX_RETRIES
  );
}
