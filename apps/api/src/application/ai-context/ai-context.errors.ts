// Normalized AI Context Boundary errors (Context Boundary Compatibility
// Remediation increment).
//
// Kept to the minimum necessary. Memory/Evidence/PersonalState already
// return their own typed failures (MemoryValidationError,
// MemoryNotFoundError, etc.) via Result<T> - AIContextService preserves
// those unchanged rather than wrapping them (see ai-context.service.ts).
// These three exist only for the one case that has no existing typed
// failure to preserve: Personal Intelligence, whose use-case performs no
// authentication check and returns plain null rather than a Result.

// Raised when AIContextRequest.context.userId is absent, before any
// use-case or repository method is called. Never raised by delegating to
// an underlying use-case's own check - this is the one source
// (personal-intelligence) that has no such check of its own.
export class AIContextUnauthorizedError extends Error {}

// Raised when an authorized lookup legitimately finds nothing - never
// used to represent an authorization failure.
export class AIContextNotFoundError extends Error {}

// Raised only if an AIContextRequest.source value does not match any
// known AIContextSource - a defensive/exhaustiveness safeguard, not an
// expected runtime outcome for any of the four authorized sources.
export class AIContextUnknownSourceError extends Error {}
