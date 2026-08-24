import {
  AuthenticationFailedError,
  InvalidRequestError,
  InvalidResponseError,
  ProviderError,
  ProviderUnavailableError,
  RateLimitedError,
  TimeoutError,
} from "../errors/ai-provider.errors";
import {
  resolveOpenAiCompatibleProviderConfig,
  type OpenAiCompatibleProviderConfig,
} from "../config/openai-compatible-provider.config";
import type { AIProvider } from "../provider/ai-provider.interface";
import type {
  GenerateRequest,
  GenerateResult,
  ProviderCapabilities,
  ProviderHealth,
  ProviderLimits,
} from "../provider/ai-provider.types";

// Concrete provider adapter targeting a generic OpenAI-compatible HTTP
// contract (DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §13; Founder decision:
// "an OpenAI-compatible self-hosted/open-weight inference endpoint, used
// through a provider adapter abstraction" — no vendor SDK, no hard-coded
// production URL, no production infrastructure decision implied).
//
// This adapter is infrastructure-only: it is not wired into any
// module/controller/domain code in this increment and remains unreachable
// from any existing execution path.
type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

const DEFAULT_FETCH: FetchLike = (input, init) => fetch(input, init);

export class OpenAiCompatibleProviderAdapter implements AIProvider {
  private readonly config: OpenAiCompatibleProviderConfig;
  private readonly fetchImpl: FetchLike;

  // `fetchImpl` defaults to the platform's native `fetch` (no new
  // dependency). Accepting it as a constructor parameter lets tests
  // substitute deterministic, local behavior instead of performing a real
  // network call.
  constructor(
    config: OpenAiCompatibleProviderConfig = resolveOpenAiCompatibleProviderConfig(),
    fetchImpl: FetchLike = DEFAULT_FETCH,
  ) {
    this.config = config;
    this.fetchImpl = fetchImpl;
  }

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    const raw = await this.request("/chat/completions", {
      model: request.model,
      messages: request.messages,
      max_tokens: request.maxOutputTokens,
      temperature: request.temperature,
    });
    return normalizeGenerateResponse(raw);
  }

  async healthCheck(): Promise<ProviderHealth> {
    const startedAt = Date.now();
    try {
      await this.request("/models", undefined, "GET");
      return { available: true, latencyMs: Date.now() - startedAt, errorSignal: null };
    } catch (error) {
      return {
        available: false,
        latencyMs: Date.now() - startedAt,
        errorSignal: error instanceof Error ? error.constructor.name : "UnknownError",
      };
    }
  }

  // Only capabilities this adapter/target contract actually supports are
  // declared — no capability is fabricated (Founder decision §12).
  getCapabilities(): ProviderCapabilities {
    return {
      streaming: false,
      structuredOutput: false,
      embeddings: false,
      contextWindow: null,
    };
  }

  // The generic OpenAI-compatible contract does not authoritatively expose
  // limits; conservative (unknown) defaults are returned rather than a
  // fabricated number (Founder decision §13).
  getLimits(): ProviderLimits {
    return { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };
  }

  private async request(path: string, body: unknown, method: "GET" | "POST" = "POST"): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.config.endpoint}${path}`, {
        method,
        headers: {
          "content-type": "application/json",
          ...(this.config.apiKey ? { authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Provider request timed out after ${this.config.timeoutMs}ms`);
      }
      // Deliberately no interpolation of `error` here: it may carry
      // transport-level detail (e.g. a URL with an embedded credential)
      // that must never appear in a normalized error message.
      throw new ProviderUnavailableError("Provider request failed: network error");
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 400) {
      throw new InvalidRequestError("Provider rejected the request as invalid");
    }
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationFailedError("Provider authentication failed");
    }
    if (response.status === 429) {
      throw new RateLimitedError("Provider rate limit exceeded");
    }
    if (response.status >= 500) {
      throw new ProviderUnavailableError(`Provider returned server error (status ${response.status})`);
    }
    if (!response.ok) {
      throw new ProviderError(`Provider returned unexpected status ${response.status}`);
    }

    try {
      return await response.json();
    } catch {
      throw new InvalidResponseError("Provider returned a malformed response body");
    }
  }
}

function normalizeGenerateResponse(raw: unknown): GenerateResult {
  if (!isRecord(raw) || !Array.isArray(raw.choices) || raw.choices.length === 0) {
    throw new InvalidResponseError("Provider response did not contain a valid choices array");
  }

  const choice = raw.choices[0];
  if (!isRecord(choice) || !isRecord(choice.message) || typeof choice.message.content !== "string") {
    throw new InvalidResponseError("Provider response choice did not contain textual content");
  }

  const finishReason = typeof choice.finish_reason === "string" ? choice.finish_reason : "unknown";
  const usage = isRecord(raw.usage)
    ? {
        inputTokens: toFiniteNumber(raw.usage.prompt_tokens),
        outputTokens: toFiniteNumber(raw.usage.completion_tokens),
      }
    : undefined;

  // `usage` is only included as a key when actually present, so a result
  // never carries a spurious `usage: undefined` field.
  return { text: choice.message.content, finishReason, ...(usage ? { usage } : {}) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toFiniteNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
