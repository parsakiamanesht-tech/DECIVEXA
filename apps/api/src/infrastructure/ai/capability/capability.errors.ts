// Normalized Capability Registry boundary errors (Increment 3A).
//
// Distinct from ../registry/registry.errors.ts (model/provider lookup)
// and ../errors/ai-provider.errors.ts (provider adapter/HTTP failures):
// these describe a capability lookup outcome only, never a provider,
// policy, or risk decision.
export class UnknownCapabilityError extends Error {}
export class IneligibleCapabilityError extends Error {}
