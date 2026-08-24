// AIRuntime routing-only skeleton types (Increment 3B).
//
// Deliberately minimal: this increment's authorized pipeline is
// normalize task shape → resolve capability → derive RoutingRequirements
// → ModelRouter.select() → return the routing result (Increment 3
// Founder Implementation Authorization §4). Nothing here may imply
// context authorization, policy evaluation, risk evaluation, or
// execution — see runtime.errors.ts for the dedicated boundary error
// that guards against silently implying those steps happened.

export interface AITaskRequest {
  readonly capabilityId: string;
  readonly candidateModelIds: readonly string[];
}

// Structurally identical to AITaskRequest today because normalization in
// this increment is shape-validation only (Founder Implementation
// Authorization §5: "structural normalization only" — no
// natural-language interpretation, no semantic inference). Kept as a
// distinct type to preserve the documented pipeline boundary between
// "raw request" and "normalized task" for if/when normalization gains
// real behavior in a future, separately authorized increment.
export interface NormalizedAITask {
  readonly capabilityId: string;
  readonly candidateModelIds: readonly string[];
}
