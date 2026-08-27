// Zone-3 AI Gateway — typed error taxonomy (Increment 014 Phase A/§17).
//
// Mirrors the repository's established convention (apps/api's
// ai-provider.errors.ts / runtime.errors.ts / gate7-provider-security.errors.ts):
// every failure category is its own distinguishable class, never a raw
// `Error` thrown directly, and no error's `message` may ever contain a
// credential, endpoint, raw provider payload, or stack detail beyond
// what Node's own Error.stack already carries (never logged/serialized
// across the Zone-2 boundary — see errorCodeFor() below).
//
// This file is independent of apps/api's error taxonomy — no import,
// no shared base class — per Increment 014 §10/§11's non-interference
// constraint. The *pattern* is reused; nothing is reused by reference.

export class GatewayError extends Error {}

// --- Request-boundary failures (never reach provider execution) ---
export class MalformedRequestError extends GatewayError {}
export class RequestTooLargeError extends GatewayError {}
export class UnauthorizedCapabilityError extends GatewayError {}

// --- Workload authentication/authorization (INV-006 / INV-007) ---
export class WorkloadAuthenticationFailedError extends GatewayError {}
export class WorkloadAuthorizationDeniedError extends GatewayError {}

// --- Request-limit enforcement (fail-closed, per Zone-2 workload identity) ---
export class RateLimitExceededError extends GatewayError {}
export class ConcurrencyExhaustedError extends GatewayError {}

// --- Provider-boundary failures (provider execution attempted) ---
export class ProviderTimeoutError extends GatewayError {}
export class ProviderTransportError extends GatewayError {}
export class ProviderResponseTooLargeError extends GatewayError {}
export class MalformedProviderResponseError extends GatewayError {}

// --- Audit boundary (Increment 011 Decision 3 / Increment 013 §F: fail closed) ---
export class AuditPersistenceFailedError extends GatewayError {}

// --- Fallback for anything not covered by a more specific type above ---
export class UnexpectedGatewayError extends GatewayError {}

// Stable, caller-safe identifiers — the ONLY representation of a failure
// ever allowed to cross the Zone-2 boundary (§8/§17: never a stack
// trace, never a raw provider error, never an internal detail). Never
// promoted to carry additional context beyond this fixed vocabulary.
export type GatewayErrorCode =
  | "malformed_request"
  | "request_too_large"
  | "unauthorized_capability"
  | "authentication_failed"
  | "authorization_denied"
  | "rate_limit_exceeded"
  | "concurrency_exhausted"
  | "provider_timeout"
  | "provider_transport_error"
  | "provider_response_too_large"
  | "malformed_provider_response"
  | "audit_persistence_failed"
  | "unexpected_error";

// Pure, total mapping — every GatewayError subclass maps to exactly one
// code; anything else (a defensive catch-all) maps to "unexpected_error"
// rather than leaking the raw error's message/stack across the boundary.
export function errorCodeFor(error: unknown): GatewayErrorCode {
  if (error instanceof MalformedRequestError) return "malformed_request";
  if (error instanceof RequestTooLargeError) return "request_too_large";
  if (error instanceof UnauthorizedCapabilityError) return "unauthorized_capability";
  if (error instanceof WorkloadAuthenticationFailedError) return "authentication_failed";
  if (error instanceof WorkloadAuthorizationDeniedError) return "authorization_denied";
  if (error instanceof RateLimitExceededError) return "rate_limit_exceeded";
  if (error instanceof ConcurrencyExhaustedError) return "concurrency_exhausted";
  if (error instanceof ProviderTimeoutError) return "provider_timeout";
  if (error instanceof ProviderTransportError) return "provider_transport_error";
  if (error instanceof ProviderResponseTooLargeError) return "provider_response_too_large";
  if (error instanceof MalformedProviderResponseError) return "malformed_provider_response";
  if (error instanceof AuditPersistenceFailedError) return "audit_persistence_failed";
  return "unexpected_error";
}
