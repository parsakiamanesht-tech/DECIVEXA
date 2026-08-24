import type {
  EmbedRequest,
  EmbedResult,
  GenerateChunk,
  GenerateRequest,
  GenerateResult,
  ProviderCapabilities,
  ProviderHealth,
  ProviderLimits,
  StructuredRequest,
  StructuredResult,
} from "./ai-provider.types";

// Provider-agnostic abstraction (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md
// §3 "AIProvider", §9 "Provider Adapter Rules";
// DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §13 "Provider Adapter Contract").
//
// A concrete adapter must isolate all provider-specific detail behind this
// interface: no provider-specific request/response/error type may cross
// this boundary. `generate`, `healthCheck`, `getCapabilities`, and
// `getLimits` are the required minimum. `stream`, `structuredOutput`, and
// `embed` are optional/capability-aware — an adapter declares support for
// them via `getCapabilities()` and only implements what its target
// actually supports.
export interface AIProvider {
  generate(request: GenerateRequest): Promise<GenerateResult>;
  healthCheck(): Promise<ProviderHealth>;
  getCapabilities(): ProviderCapabilities;
  getLimits(): ProviderLimits;
  stream?(request: GenerateRequest): AsyncIterable<GenerateChunk>;
  structuredOutput?(request: StructuredRequest): Promise<StructuredResult>;
  embed?(request: EmbedRequest): Promise<EmbedResult>;
}
