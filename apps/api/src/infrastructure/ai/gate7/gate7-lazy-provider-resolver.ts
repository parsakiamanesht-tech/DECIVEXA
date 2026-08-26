import { OpenAiCompatibleProviderAdapter } from "../adapters/openai-compatible-provider.adapter";
import type { AIProvider } from "../provider/ai-provider.interface";
import type { ProviderResolutionPort } from "../runtime/provider-resolution.port";
import { GATE7_PROVIDER_ID } from "./gate7-identifiers";
import { resolveGate7ProviderConfig } from "./gate7-provider-config";
import { createBoundedFetch, type Gate7FetchLike } from "./gate7-provider-security";

// Gate-7-specific ProviderResolutionPort implementation (Founder
// Implementation Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE
// IMPLEMENTATION", §4, Decision 2).
//
// Scoped to exactly GATE7_PROVIDER_ID — resolve() returns undefined for
// any other providerId, exactly like KeyedProviderResolver does for an
// unmapped key, so this class never becomes a general-purpose dynamic
// provider factory for unrelated capabilities.
//
// Lazy per FD-3(B): resolveGate7ProviderConfig() — which itself calls
// resolveOpenAiCompatibleProviderConfig() and the FD-5 construction-time
// security checks — is called only inside resolve(), never in this
// class's constructor. Constructing this resolver (including NestJS
// instantiating it at application bootstrap) performs zero configuration
// reads and zero AI_PROVIDER_*/Gate-7-env-var reads. A missing or invalid
// configuration value (base or Gate-7-specific) surfaces only when
// resolve() is actually invoked, as a typed error
// (ProviderConfigurationError or a Gate7*Error) — never at boot, and
// never leaking a credential value in its message.
//
// KeyedProviderResolver (../runtime/provider-instance-resolver.ts) is not
// modified or replaced by this class — it remains a completely separate,
// pure keyed-map lookup; see gate7-composite-provider-resolver.ts for how
// the two are composed behind a single ProviderResolutionPort.
export class LazyGate7ProviderResolver implements ProviderResolutionPort {
  constructor(
    private readonly env: NodeJS.ProcessEnv = process.env,
    private readonly fetchImpl: Gate7FetchLike = defaultFetch,
  ) {}

  async resolve(providerId: string): Promise<AIProvider | undefined> {
    if (providerId !== GATE7_PROVIDER_ID) return undefined;

    const { base, limits } = resolveGate7ProviderConfig(this.env);
    const boundedFetch = createBoundedFetch(this.fetchImpl, limits);
    return new OpenAiCompatibleProviderAdapter(base, boundedFetch);
  }
}

function defaultFetch(input: string, init: RequestInit): Promise<Response> {
  return fetch(input, init);
}
