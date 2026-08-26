import { resolveOpenAiCompatibleProviderConfig, type OpenAiCompatibleProviderConfig } from "../config/openai-compatible-provider.config";
import { assertHttpsScheme, assertNotPrivateOrInternalDestination, assertTrustedEndpoint, type Gate7TransportSizeLimits } from "./gate7-provider-security";

// Gate-7 real-provider configuration resolution (Founder Implementation
// Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE IMPLEMENTATION",
// §4/§9/§11, FD-3(B) + FD-5).
//
// Reuses the existing, unmodified resolveOpenAiCompatibleProviderConfig()
// for AI_PROVIDER_ENDPOINT/AI_PROVIDER_API_KEY/AI_PROVIDER_TIMEOUT_MS — no
// duplicated parsing logic, no change to that file — then layers the
// Gate-7-only FD-5 construction-time checks on top: trusted-endpoint
// allow-list, HTTPS-only scheme, and private/internal destination
// rejection. Every function here is synchronous, side-effect-free, and
// never logs, prints, or includes any resolved value (including apiKey)
// in a thrown message — every thrown error names only the check that
// failed, exactly like the base resolver's own ProviderConfigurationError
// convention.
const DEFAULT_MAX_REQUEST_BYTES = 16_384; // 16 KiB
const DEFAULT_MAX_RESPONSE_BYTES = 65_536; // 64 KiB

export interface Gate7ProviderConfig {
  readonly base: OpenAiCompatibleProviderConfig;
  readonly limits: Gate7TransportSizeLimits;
}

// Comma-separated, optional; ABSENT by default. An empty allow-list means
// no endpoint is trusted until the Founder explicitly populates this
// variable in a future, separate step (Gate 7 Founder Decisions
// Governance Record, FD-5 Control 1) — a deliberate fail-closed default.
export function resolveGate7TrustedEndpoints(env: NodeJS.ProcessEnv = process.env): ReadonlySet<string> {
  const raw = env.AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS?.trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0),
  );
}

export function resolveGate7RequestSizeLimitBytes(env: NodeJS.ProcessEnv = process.env): number {
  return resolvePositiveNumber(env.AI_PROVIDER_GATE7_MAX_REQUEST_BYTES, DEFAULT_MAX_REQUEST_BYTES);
}

export function resolveGate7ResponseSizeLimitBytes(env: NodeJS.ProcessEnv = process.env): number {
  return resolvePositiveNumber(env.AI_PROVIDER_GATE7_MAX_RESPONSE_BYTES, DEFAULT_MAX_RESPONSE_BYTES);
}

function resolvePositiveNumber(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Resolves and validates the full Gate-7 real-provider configuration.
// Throws the base resolver's ProviderConfigurationError for
// missing/invalid endpoint/timeout, or one of the Gate7*Error types
// (gate7-provider-security.errors.ts) for a Gate-7-specific check
// failure. Called lazily — only from LazyGate7ProviderResolver.resolve(),
// never at application bootstrap (FD-3(B)).
export function resolveGate7ProviderConfig(env: NodeJS.ProcessEnv = process.env): Gate7ProviderConfig {
  const base = resolveOpenAiCompatibleProviderConfig(env);

  assertHttpsScheme(base.endpoint);
  assertNotPrivateOrInternalDestination(base.endpoint);
  assertTrustedEndpoint(base.endpoint, resolveGate7TrustedEndpoints(env));

  return {
    base,
    limits: {
      maxRequestBytes: resolveGate7RequestSizeLimitBytes(env),
      maxResponseBytes: resolveGate7ResponseSizeLimitBytes(env),
    },
  };
}
