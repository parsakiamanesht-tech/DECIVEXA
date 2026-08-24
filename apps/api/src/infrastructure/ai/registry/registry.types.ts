import type { ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";

// Model/Provider Registry metadata types (Increment 1).
//
// Pure metadata: registering or looking up an entry never invokes a
// provider adapter and never performs I/O. Capability/limit snapshots are
// taken by the caller (see register-provider-adapter.ts) at registration
// time from an adapter's synchronous, side-effect-free getCapabilities()/
// getLimits() accessors — the registry itself never holds or calls an
// AIProvider instance.
//
// Scope: infrastructure-only, no domain/application coupling
// (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §3 "ModelRegistry" /
// "ProviderRegistry").

export interface ProviderRegistrationInput {
  readonly providerId: string;
  readonly capabilities: ProviderCapabilities;
  readonly limits: ProviderLimits;
  readonly eligible: boolean;
}

export interface ProviderRegistryEntry extends ProviderRegistrationInput {}

export interface ModelRegistrationInput {
  readonly modelId: string;
  readonly providerId: string;
  readonly eligible: boolean;
}

export interface ModelRegistryEntry extends ModelRegistrationInput {}
