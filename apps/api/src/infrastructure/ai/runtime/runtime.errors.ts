// Normalized AIRuntime boundary errors (Increment 3B).

// Raised when an AITaskRequest fails structural (shape-only) validation
// — never a semantic/natural-language judgment. See runtime.types.ts.
export class InvalidAITaskRequestError extends Error {}

// Raised by any AIRuntime method that would require infrastructure this
// repository does not yet implement or Founder-authorize: obtaining
// authorized context, policy enforcement, risk classification, provider
// execution, or output validation
// (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §3 "AIRuntime"; Increment 3
// Founder Implementation Authorization §9, §11). This error exists so
// the routing-only boundary is explicit and typed rather than silently
// absent or silently bypassed — reaching it must never be mistaken for a
// completed execution step.
export class AIRuntimeExecutionNotAvailableError extends Error {}
