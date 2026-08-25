import type { AIProvider } from "../provider/ai-provider.interface";
import type { ProviderResolutionPort } from "./provider-resolution.port";

// KeyedProviderResolver (Founder Implementation Authorization: "Provider
// Resolution Architecture / Gate 1 Only").
//
// The approved Provider Resolution architecture (Option A — Founder
// Architecture Decision: "Provider Resolution Lifecycle & Production
// Wiring") is a small, dedicated keyed-map resolver implementing the
// existing ProviderResolutionPort (./provider-resolution.port.ts)
// unchanged. This class is exactly that, and nothing more.
//
// Gate 1 scope only: this file implements pure keyed lookup over an
// already-built ReadonlyMap<string, AIProvider> supplied at
// construction. It does not construct, register, select, or invoke any
// AIProvider; it performs no eligibility, fallback, retry, health, or
// lifecycle logic; it never throws ProviderResolutionFailedError — that
// conversion is, and remains, AIRuntime.execute()'s responsibility (see
// ../runtime/ai-runtime.ts, unmodified by this gate). No DI wiring, no
// production provider map, and no production AIProvider instance are
// introduced here — those are separately gated (Provider Resolution
// Architecture Gate 2 / Provider-Model Registration Authorization,
// neither authorized by this increment).
export class KeyedProviderResolver implements ProviderResolutionPort {
  constructor(private readonly providers: ReadonlyMap<string, AIProvider>) {}

  async resolve(providerId: string): Promise<AIProvider | undefined> {
    return this.providers.get(providerId);
  }
}
