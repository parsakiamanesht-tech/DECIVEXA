// Zone-3 AI Gateway — OpenAI provider adapter (Increment 020, implementing
// the Increment 019 Founder-approved provider decision: OpenAI, vendor
// SaaS, existing OpenAI-compatible protocol, Secret Manager credential,
// no fallback).
//
// This is a fresh, independent implementation of the already-approved,
// already-tested `GatewayProvider` interface (Increment 014) — it does
// NOT import apps/api's OpenAiCompatibleProviderAdapter or any other
// apps/api module (non-interference, Increment 014 §5/§22). The request/
// response normalization pattern is structurally informed by that
// adapter's already-proven shape (read-only reference during this
// increment's adversarial review) but reimplemented independently against
// this Gateway's own, narrower, opaque-`input` contract.
//
// Never introduces retry, fallback, or a second provider path (Increment
// 010 Decision 1 / Increment 019 B4, unchanged). Never adds its own
// timeout — the orchestration layer's single, combined, locked 30s
// withTimeout() (transport-limits.ts) already bounds this adapter's
// entire generate() call plus response consumption; a second, competing
// timeout value here would be an unauthorized new number.
import type { GatewayProvider, GatewayProviderRequest, GatewayProviderResponse } from "./provider-adapter.interface";
import type { CredentialSource } from "./credential-source.port";
import type { OpenAiGatewayProviderConfig } from "./openai-gateway-provider.config";
import { MalformedProviderResponseError, ProviderTransportError } from "../errors/gateway.errors";

// The capability-specific payload this adapter expects `request.input` to
// carry. Never imposed on the orchestration layer (which treats `input`
// as opaque, per provider-adapter.interface.ts) — validated only here, at
// the one place that must actually interpret it to build a real OpenAI
// request.
interface OpenAiGatewayInput {
  readonly messages: ReadonlyArray<{ readonly role: "system" | "user" | "assistant"; readonly content: string }>;
  readonly maxOutputTokens?: number;
  readonly temperature?: number;
}

function isOpenAiGatewayInput(value: unknown): value is OpenAiGatewayInput {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.messages) || candidate.messages.length === 0) return false;
  return candidate.messages.every(
    (m) =>
      typeof m === "object" &&
      m !== null &&
      typeof (m as Record<string, unknown>).role === "string" &&
      typeof (m as Record<string, unknown>).content === "string",
  );
}

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;
const DEFAULT_FETCH: FetchLike = (input, init) => fetch(input, init);

export class OpenAiGatewayProvider implements GatewayProvider {
  constructor(
    private readonly config: OpenAiGatewayProviderConfig,
    private readonly credentialSource: CredentialSource,
    private readonly fetchImpl: FetchLike = DEFAULT_FETCH,
  ) {}

  async generate(request: GatewayProviderRequest): Promise<GatewayProviderResponse> {
    if (!isOpenAiGatewayInput(request.input)) {
      // Not the provider's fault, but discoverable only here (the
      // orchestration layer never interprets `input`) — the closest
      // existing, non-invented GatewayErrorCode for "this request could
      // not be transported to the provider in a form it accepts."
      throw new ProviderTransportError("Gateway request input did not match the OpenAI provider's expected shape");
    }

    // The credential is resolved fresh for this call and is never logged,
    // never attached to an error, and never returned — mirrors the
    // existing CredentialSource contract's own non-exposure guarantee.
    const credential = await this.credentialSource.resolve();
    if (!credential) {
      throw new ProviderTransportError("No provider credential is currently available");
    }

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.config.endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${credential}`,
        },
        body: JSON.stringify({
          model: request.modelId,
          messages: request.input.messages,
          // KNOWN COMPATIBILITY CAVEAT (surfaced by this increment's
          // adversarial review, not silently resolved): OpenAI's
          // Chat Completions API accepts `max_tokens` for its
          // established chat-model families; some newer reasoning-model
          // families reject it in favor of `max_completion_tokens`.
          // Since no specific OpenAI model has been Founder-selected yet
          // (Increment 019 B1 chose the vendor, not a model), this
          // adapter uses `max_tokens` — the broadest-compatible,
          // longest-established field name — and does not attempt to
          // guess a model-specific alternative. If a reasoning-model
          // family is ever selected, this is a known, pre-flagged gap
          // requiring a follow-up change, not a defect discovered later.
          ...(request.input.maxOutputTokens !== undefined ? { max_tokens: request.input.maxOutputTokens } : {}),
          ...(request.input.temperature !== undefined ? { temperature: request.input.temperature } : {}),
        }),
      });
    } catch {
      // Deliberately no interpolation of the caught error: it may carry
      // transport-level detail (e.g. a URL) that must never cross the
      // Zone-2 boundary — mirrors apps/api's own adapter precedent.
      throw new ProviderTransportError("OpenAI provider request failed: network error");
    }

    if (!response.ok) {
      // The Gateway's own closed error vocabulary (errors/gateway.errors.ts)
      // has no distinct code for provider-side 401/429/5xx — all
      // non-timeout, non-malformed-response provider failures map to the
      // single existing `provider_transport_error` code (narrower than
      // apps/api's own richer taxonomy; not expanded here).
      throw new ProviderTransportError(`OpenAI provider returned unexpected status ${response.status}`);
    }

    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      throw new MalformedProviderResponseError("OpenAI provider response was not valid JSON");
    }

    const normalized = normalize(raw);
    const bytes = new TextEncoder().encode(JSON.stringify(normalized));
    return { chunks: singleChunk(bytes) };
  }
}

// Normalizes OpenAI's own response shape into a DECIVEXA-owned output —
// never a raw passthrough (INV-024 / TD-09 acceptance criteria). Reuses
// the same normalization pattern apps/api's adapter already established
// (read-only reference), reimplemented independently.
function normalize(raw: unknown): { text: string; finishReason: string; usage?: { inputTokens: number; outputTokens: number } } {
  if (!isRecord(raw) || !Array.isArray(raw.choices) || raw.choices.length === 0) {
    throw new MalformedProviderResponseError("OpenAI provider response did not contain a valid choices array");
  }
  const choice = raw.choices[0];
  if (!isRecord(choice) || !isRecord(choice.message) || typeof choice.message.content !== "string") {
    throw new MalformedProviderResponseError("OpenAI provider response choice did not contain textual content");
  }

  const finishReason = typeof choice.finish_reason === "string" ? choice.finish_reason : "unknown";
  const usage = isRecord(raw.usage)
    ? { inputTokens: toFiniteNumber(raw.usage.prompt_tokens), outputTokens: toFiniteNumber(raw.usage.completion_tokens) }
    : undefined;

  return { text: choice.message.content, finishReason, ...(usage ? { usage } : {}) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toFiniteNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function singleChunk(bytes: Uint8Array): AsyncIterable<Uint8Array> {
  return (async function* () {
    yield bytes;
  })();
}
