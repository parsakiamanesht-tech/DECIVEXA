// DECIVEXA Capability Registry metadata types (Increment 3A).
//
// Pure declarative metadata, matching the canonical shape defined by
// DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §6 "Capability Architecture".
// Registering or looking up a capability never performs I/O, never
// invokes a provider adapter, and never evaluates policy, risk, privacy,
// quality, cost, or latency — those fields describe what a future engine
// must eventually check, not behavior this registry implements today
// (Increment 3 Founder Implementation Authorization §3).
//
// Named `AICapabilityDefinition`-style (`AICapabilityRegistrationInput`/
// `AICapabilityRegistryEntry`), not `Capability`, to avoid any confusion
// with the pre-existing, unrelated model/provider-level technical
// capability vocabulary in ../registry/registry.types.ts
// (`ProviderCapabilities`, `ModelRegistrationInput.capabilities`). That
// vocabulary describes what a *model* technically supports (streaming /
// structured output / embeddings); this vocabulary describes a
// DECIVEXA-defined *task type*. Neither existing type is renamed or
// modified by this file.

// Declarative risk-classification label. Reuses the risk taxonomy
// already Founder-approved in ADR-007 §8 (Agent V1 Risk Model) rather
// than inventing a new one, per the "preserve architected ideas"
// governance rule. Here it is purely a label on a capability's static
// metadata — no risk engine reads, enforces, or acts on it in this
// increment (RiskEngine does not exist anywhere in this repository).
export type AICapabilityRiskClassification =
  | "informational-read-only"
  | "reversible-low-risk"
  | "user-confirmation-required"
  | "high-risk"
  | "prohibited";

export interface AICapabilityRegistrationInput {
  readonly capabilityId: string;
  readonly version: string;
  readonly purpose: string;
  // Opaque schema references: this repository has no canonical AI
  // input/output schema representation yet, so the schema value itself
  // is declared but never parsed, validated, or interpreted here.
  readonly inputSchema: unknown;
  readonly outputSchema: unknown;
  // Labels naming the context this capability would require, for a
  // future Context Engine to resolve. No Context Engine exists yet;
  // these are declarative labels only.
  readonly requiredContext: readonly string[];
  // Declarative privacy-sensitivity label. No dedicated privacy
  // classification taxonomy is established elsewhere in the repository
  // yet (DECIVEXA_AI_ARCHITECTURE_CONFORMANCE_AUDIT_V1.md §5 marks
  // "Sensitivity classification" ABSENT/UNKNOWN), so this is kept as a
  // plain string rather than an invented enum.
  readonly privacyClassification: string;
  readonly riskClassification: AICapabilityRiskClassification;
  readonly minimumQualityThreshold: number | null;
  readonly latencyTargetMs: number | null;
  readonly costTarget: number | null;
  // Declarative tier labels; no execution-tier engine exists yet to
  // interpret them.
  readonly allowedExecutionTiers: readonly string[];
  // Declarative labels naming what a future ValidationService would
  // need to check; no ValidationService exists yet.
  readonly validationRequirements: readonly string[];
  readonly humanApprovalRequired: boolean;
  // Static registration metadata only — see capability-registry.ts and
  // capability.errors.ts. Never live health, never authorization, never
  // policy approval (Increment 3 Founder Implementation Authorization
  // §2, §12; ADR-007 §7 "AI cannot grant itself permission").
  readonly eligible: boolean;
}

export interface AICapabilityRegistryEntry extends AICapabilityRegistrationInput {}
