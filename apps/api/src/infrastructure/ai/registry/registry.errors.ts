// Normalized registry-boundary errors (Increment 1).
//
// Distinct from the provider adapter errors in ../errors/ai-provider.errors.ts:
// these describe a registry lookup outcome, never a provider/HTTP failure.
// Eligibility is metadata only — it is never treated as, or convertible
// into, action authorization (see ADR-007 §7: "AI cannot grant itself
// permission").

export class UnknownProviderError extends Error {}
export class UnknownModelError extends Error {}
export class IneligibleProviderError extends Error {}
export class IneligibleModelError extends Error {}
