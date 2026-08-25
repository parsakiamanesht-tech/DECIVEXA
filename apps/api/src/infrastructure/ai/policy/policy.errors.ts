// Normalized Policy Authorization boundary error (Founder Implementation
// Authorization: "Policy Authorization + Narrow Provider Eligibility +
// Structural Output Validation").
//
// Raised whenever authorizePolicy() denies a request. This is NOT a
// PolicyEngine error taxonomy - there is exactly one denial type,
// because this increment is a single, narrow, capability-scoped
// allow-list check, not a general-purpose authorization framework. The
// specific denial reason is carried on the thrown error's message and
// on the PolicyAuthorizationResult itself (see policy-authorization.ts)
// - never swallowed, never converted into a fabricated success.
export class PolicyAuthorizationDeniedError extends Error {}
