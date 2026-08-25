// Normalized AIRuntime boundary errors (Increment 3B; extended by the
// Runtime Context Resolution increment).

// Raised when an AITaskRequest fails structural (shape-only) validation
// — never a semantic/natural-language judgment. See runtime.types.ts.
export class InvalidAITaskRequestError extends Error {}

// Raised when a capability's single required context item cannot be
// resolved — i.e. the ContextResolutionPort returned any status other
// than "resolved" (unsupported label, missing selector, not found,
// unauthorized, or a residual resolution failure). AIRuntime never
// converts a non-"resolved" outcome into success and never fabricates a
// substitute context — see context-resolution.port.ts.
export class ContextResolutionFailedError extends Error {}

// Raised when a capability declares more than one requiredContext item.
// Multi-context resolution (ordering, aggregation, parallel/sequential
// acquisition, deduplication, partial availability) is explicitly out of
// scope for this increment (Founder Implementation Authorization §11) —
// this error makes that boundary explicit and typed rather than silently
// processing only the first declared item.
export class UnsupportedContextCardinalityError extends Error {}

// Raised by any AIRuntime method that would require infrastructure this
// repository does not yet implement or Founder-authorize: obtaining
// authorized context, policy enforcement, risk classification, provider
// execution, or output validation
// (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §3 "AIRuntime"; Increment 3
// Founder Implementation Authorization §9, §11). This error exists so
// the routing-only boundary is explicit and typed rather than silently
// absent or silently bypassed — reaching it must never be mistaken for a
// completed execution step. Also raised by execute() when no
// ProviderResolutionPort was supplied to this AIRuntime instance (the
// production wiring case — First Controlled Execution increment §2/§9:
// production AIRuntime construction intentionally omits one).
export class AIRuntimeExecutionNotAvailableError extends Error {}

// Raised when ProviderResolutionPort.resolve() cannot find an AIProvider
// instance for a routed providerId (First Controlled Execution
// increment). This is a resolution-boundary failure, never a
// provider-execution failure — the provider itself was never reached.
export class ProviderResolutionFailedError extends Error {}
