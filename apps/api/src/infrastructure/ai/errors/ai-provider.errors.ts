// Normalized provider-boundary errors
// (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §9 "Provider Adapter Rules",
// DECIVEXA_AI_FAILURE_AND_RESILIENCE_MATRIX_V1.md §2 "Failure Matrix").
//
// A concrete adapter must translate every provider-specific/HTTP failure
// into exactly one of these types. No provider-specific error object may
// cross the adapter boundary.

// Generic fallback for a provider-side failure that does not map to any
// more specific normalized error below.
export class ProviderError extends Error {}

export class ProviderUnavailableError extends ProviderError {}
export class TimeoutError extends ProviderError {}
export class RateLimitedError extends ProviderError {}
export class AuthenticationFailedError extends ProviderError {}
export class InvalidResponseError extends ProviderError {}
export class InvalidRequestError extends ProviderError {}

// Local misconfiguration (missing/invalid endpoint, timeout, etc.) is not
// a provider-side failure, so it is kept distinct from the ProviderError
// family above.
export class ProviderConfigurationError extends Error {}
