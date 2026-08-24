// Normalized, provider-agnostic types for the AI Provider Adapter Foundation.
//
// These types must never carry a provider-specific shape. Every concrete
// adapter is responsible for translating its provider's wire format into
// exactly these types (and vice versa for requests) at the adapter boundary.
//
// Scope: infrastructure-only. Nothing here may be imported by, or import
// from, any domain/application module (see architecture ADR-001,
// DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §§3-4).

export type ProviderMessageRole = "system" | "user" | "assistant";

export interface ProviderMessage {
  readonly role: ProviderMessageRole;
  readonly content: string;
}

export interface GenerateRequest {
  readonly model: string;
  readonly messages: readonly ProviderMessage[];
  readonly maxOutputTokens?: number;
  readonly temperature?: number;
}

export interface GenerateUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
}

export interface GenerateResult {
  readonly text: string;
  readonly finishReason: string;
  readonly usage?: GenerateUsage;
}

export interface GenerateChunk {
  readonly delta: string;
  readonly done: boolean;
}

export interface StructuredRequest extends GenerateRequest {
  readonly schema: Record<string, unknown>;
}

export interface StructuredResult {
  readonly data: unknown;
}

export interface EmbedRequest {
  readonly model: string;
  readonly input: readonly string[];
}

export interface EmbedResult {
  readonly vectors: readonly (readonly number[])[];
}

export interface ProviderHealth {
  readonly available: boolean;
  readonly latencyMs: number | null;
  readonly errorSignal: string | null;
}

export interface ProviderCapabilities {
  readonly streaming: boolean;
  readonly structuredOutput: boolean;
  readonly embeddings: boolean;
  readonly contextWindow: number | null;
}

export interface ProviderLimits {
  readonly maxOutputTokens: number | null;
  readonly maxInputTokens: number | null;
  readonly requestsPerMinute: number | null;
}
