import type { AIProvider } from "../provider/ai-provider.interface";
import type { ProviderResolutionPort } from "../runtime/provider-resolution.port";
import type { KeyedProviderResolver } from "../runtime/provider-instance-resolver";
import type { LazyGate7ProviderResolver } from "./gate7-lazy-provider-resolver";

// Composes the existing, unmodified KeyedProviderResolver (Gate 1–4,
// pure eager keyed-map lookup) with the new LazyGate7ProviderResolver
// (lazy, real-config-capable, scoped to GATE7_PROVIDER_ID only) behind a
// single ProviderResolutionPort — the shape AIRuntime's constructor
// requires (Founder Implementation Authorization: "GATE 7 —
// DECISION-SCOPED PREREQUISITE IMPLEMENTATION", §4, Decision 2).
//
// Neither wrapped resolver's own behavior is altered: this class only
// delegates by providerId, in order — (1) the existing keyed resolver's
// map, (2) the Gate-7 lazy resolver. Because KeyedProviderResolver's map
// never contains GATE7_PROVIDER_ID (ai-runtime.module.ts's Gate 3/4
// registration deliberately never adds it), and
// LazyGate7ProviderResolver.resolve() returns undefined for any other
// id, the two are mutually exclusive by construction — there is no
// ambiguity about which resolver "wins" for a given id, and this class
// adds no eligibility, fallback, retry, or generalization logic beyond
// that delegation.
export class Gate7CompositeProviderResolver implements ProviderResolutionPort {
  constructor(
    private readonly keyedResolver: KeyedProviderResolver,
    private readonly gate7Resolver: LazyGate7ProviderResolver,
  ) {}

  async resolve(providerId: string): Promise<AIProvider | undefined> {
    const keyed = await this.keyedResolver.resolve(providerId);
    if (keyed) return keyed;
    return this.gate7Resolver.resolve(providerId);
  }
}
