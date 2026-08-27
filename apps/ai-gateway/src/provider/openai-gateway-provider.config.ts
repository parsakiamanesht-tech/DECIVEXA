// Zone-3 AI Gateway — OpenAI provider configuration (Increment 020,
// implementing the Increment 019 Founder-approved provider decision:
// OpenAI, vendor SaaS, OpenAI-compatible protocol).
//
// Non-secret configuration only. The credential (API key) is deliberately
// NOT read here or from any environment variable — Increment 016 Decision
// B requires the production credential to be resolved exclusively through
// the CredentialSource port (Secret Manager, at deployment time), never as
// a plain environment variable. This file mirrors that same non-default,
// fail-closed discipline apps/api's own openai-compatible-provider.config.ts
// established for its endpoint, but is an independent implementation — no
// import from apps/api, per the non-interference constraint (Increment
// 014 §5/§22).
//
// No production endpoint is hardcoded (not even OpenAI's own well-known
// public URL) — matching the existing, repeated precedent throughout this
// lineage that no production infrastructure value is ever assumed by
// source code.
export interface OpenAiGatewayProviderConfig {
  readonly endpoint: string;
}

export class OpenAiGatewayProviderConfigurationError extends Error {}

export function resolveOpenAiGatewayProviderConfig(
  env: NodeJS.ProcessEnv = process.env,
): OpenAiGatewayProviderConfig {
  const endpoint = env.OPENAI_PROVIDER_ENDPOINT?.trim();
  if (!endpoint) {
    throw new OpenAiGatewayProviderConfigurationError("OPENAI_PROVIDER_ENDPOINT is required and must not be empty");
  }
  if (!endpoint.startsWith("https://")) {
    // Defense-in-depth only, not a caller-input check (this value is
    // server-owned configuration, never derived from a Gateway request) —
    // generalizes the spirit of apps/api's gate7-provider-security.ts
    // assertHttpsScheme without importing it (Increment 009 §D.9).
    throw new OpenAiGatewayProviderConfigurationError("OPENAI_PROVIDER_ENDPOINT must use https://");
  }

  return { endpoint };
}
