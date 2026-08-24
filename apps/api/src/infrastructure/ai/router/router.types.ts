import type { ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";

// Deterministic routing types (Increment 2B).
//
// Deliberately excludes every canonical Model Fitness input that has no
// real data source yet: quality, reliability, privacy_fit,
// region_eligibility, availability, latency_penalty, cost_penalty,
// risk_penalty (DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §12). Adding any
// of those fields here would mean inventing a value for something this
// increment cannot honestly compute — not authorized.

// `requiredCapabilities` only constrains the boolean/flag-shaped fields
// of ProviderCapabilities that the request actually cares about; any
// field left unset is not checked.
export interface RoutingRequirements {
  readonly requiredCapabilities?: Partial<Pick<ProviderCapabilities, "streaming" | "structuredOutput" | "embeddings">>;
  readonly minContextWindow?: number;
  readonly minMaxOutputTokens?: number;
}

export interface RoutingResult {
  readonly modelId: string;
  readonly providerId: string;
  readonly capabilities: ProviderCapabilities;
  readonly limits: ProviderLimits;
}
