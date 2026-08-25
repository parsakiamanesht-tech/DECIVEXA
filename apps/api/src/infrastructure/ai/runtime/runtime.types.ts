import type { RequestContext } from "../../../context/request-context";

// AIRuntime routing-only skeleton types (Increment 3B; extended by the
// Runtime Context Resolution increment).
//
// This increment's authorized pipeline is normalize task shape →
// resolve capability → obtain (at most one, declaratively-required)
// context → derive RoutingRequirements → ModelRouter.select() → return
// the routing result. Nothing here may imply policy evaluation, risk
// evaluation, or provider execution — see runtime.errors.ts for the
// dedicated boundary error that guards against silently implying those
// steps happened.

export interface AITaskRequest {
  readonly capabilityId: string;
  readonly candidateModelIds: readonly string[];
  // Runtime Identity (Founder-approved Model A): the caller supplies the
  // existing, unmodified RequestContext — the sole identity mechanism in
  // this repository. No second identity/session/execution-context
  // abstraction is introduced.
  readonly context: RequestContext;
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
  readonly context: RequestContext;
}
