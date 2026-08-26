// Normalized Gate-7 provider-security boundary errors (Founder
// Implementation Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE
// IMPLEMENTATION", FD-5). Distinct from ../errors/ai-provider.errors.ts
// (real provider/HTTP failures) and
// ../config/openai-compatible-provider.config.ts's ProviderConfigurationError
// (missing/invalid base configuration value): these describe a Gate-7
// construction-time or transport-time security-control rejection only,
// never a provider-side failure and never a policy/risk decision.
export class Gate7UntrustedEndpointError extends Error {}
export class Gate7InsecureSchemeError extends Error {}
export class Gate7PrivateDestinationError extends Error {}
export class Gate7RequestTooLargeError extends Error {}
export class Gate7ResponseTooLargeError extends Error {}
