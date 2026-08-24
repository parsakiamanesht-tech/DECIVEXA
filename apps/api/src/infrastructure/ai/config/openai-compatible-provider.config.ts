import { ProviderConfigurationError } from "../errors/ai-provider.errors";

// Configuration for the OpenAI-compatible provider adapter.
//
// Per Founder decision (AI Provider Adapter Foundation gate): configuration
// is read via `process.env.<NAME>` (mirroring the existing
// `AccessTokenService` convention), never hard-coded, and no production
// secret or endpoint is required for this increment. `endpoint` must be
// externally configured — no default production URL is assumed.
const DEFAULT_TIMEOUT_MS = 30_000;

export interface OpenAiCompatibleProviderConfig {
  readonly endpoint: string;
  readonly apiKey: string | null;
  readonly timeoutMs: number;
}

// `env` defaults to the real `process.env` so production/normal usage
// reads configuration exactly the way the Founder decision requires.
// Accepting it as a parameter (rather than reading `process.env` inline)
// only exists so tests can supply a deterministic, isolated env-like
// object instead of mutating global process state.
export function resolveOpenAiCompatibleProviderConfig(
  env: NodeJS.ProcessEnv = process.env,
): OpenAiCompatibleProviderConfig {
  const endpoint = env.AI_PROVIDER_ENDPOINT?.trim();
  if (!endpoint) {
    throw new ProviderConfigurationError("AI_PROVIDER_ENDPOINT is required and must not be empty");
  }

  const timeoutRaw = env.AI_PROVIDER_TIMEOUT_MS;
  const timeoutMs = timeoutRaw === undefined ? DEFAULT_TIMEOUT_MS : Number(timeoutRaw);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new ProviderConfigurationError("AI_PROVIDER_TIMEOUT_MS must be a positive number when set");
  }

  // Optional: the self-hosted/OpenAI-compatible target may not require
  // authentication at all. No authentication requirement is invented if
  // the value is absent.
  const apiKeyRaw = env.AI_PROVIDER_API_KEY?.trim();
  const apiKey = apiKeyRaw ? apiKeyRaw : null;

  return { endpoint, apiKey, timeoutMs };
}
