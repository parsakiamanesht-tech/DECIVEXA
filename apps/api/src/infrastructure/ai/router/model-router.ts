import type { ModelRegistry } from "../registry/model-registry";
import type { ModelRegistryEntry, ProviderRegistryEntry } from "../registry/registry.types";
import type { ProviderRegistry } from "../registry/provider-registry";
import { NoEligibleCandidateError } from "./router.errors";
import type { RoutingRequirements, RoutingResult } from "./router.types";
import type { ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";

// Deterministic, metadata-only selection component (Increment 2B).
//
// Given an explicit set of candidate model IDs and a set of requirements,
// selects one registered, eligible (model AND its associated provider),
// capability/limit-compatible pair — using only data already present in
// ModelRegistry/ProviderRegistry (Increment 1 + 2A). This class does not
// enumerate the registries' full contents: no list()/keys() method exists
// on either registry, and none was added to support this increment —
// callers supply the candidate model IDs they want considered.
//
// Explicitly out of scope (DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §12,
// DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §§10-11): the full canonical
// Model Fitness formula (quality/reliability/privacy_fit/
// region_eligibility/availability/latency_penalty/cost_penalty/
// risk_penalty — none of these have a real data source yet) and the full
// canonical Fallback Rules (which require re-evaluating policy/risk that
// does not exist yet). This Router performs no network I/O, no provider
// execution, and no health polling — selection is pure computation over
// already-registered metadata.
//
// A returned selection means only "this registered model/provider
// satisfies the currently available selection constraints" — it is never
// authorization to execute anything (ADR-007 §7: "AI cannot grant itself
// permission").
export class ModelRouter {
  constructor(
    private readonly modelRegistry: ModelRegistry,
    private readonly providerRegistry: ProviderRegistry,
  ) {}

  select(candidateModelIds: readonly string[], requirements: RoutingRequirements = {}): RoutingResult {
    const matches: RoutingResult[] = [];

    for (const modelId of candidateModelIds) {
      const model = this.tryGetEligibleModel(modelId);
      if (!model) continue;

      const provider = this.tryGetEligibleProvider(model.providerId);
      if (!provider) continue;

      if (!satisfiesRequirements(model.capabilities, model.limits, requirements)) continue;

      matches.push({
        modelId: model.modelId,
        providerId: model.providerId,
        capabilities: model.capabilities,
        limits: model.limits,
      });
    }

    if (matches.length === 0) {
      throw new NoEligibleCandidateError(
        "No registered, eligible, capability-compatible candidate satisfies the given requirements",
      );
    }

    // Deterministic tie-break: stable ascending sort by modelId — based
    // only on already-registered metadata, never on candidate-array
    // order, vendor preference, or any not-yet-available scoring input.
    matches.sort((a, b) => (a.modelId < b.modelId ? -1 : a.modelId > b.modelId ? 1 : 0));
    return matches[0];
  }

  // Both eligibility checks (unknown vs. ineligible) already live in the
  // registries (Increment 1); the Router only needs "is this a usable
  // candidate," so both outcomes are treated identically here: excluded,
  // never thrown onward as an execution failure.
  private tryGetEligibleModel(modelId: string): ModelRegistryEntry | undefined {
    try {
      return this.modelRegistry.get(modelId);
    } catch {
      return undefined;
    }
  }

  private tryGetEligibleProvider(providerId: string): ProviderRegistryEntry | undefined {
    try {
      return this.providerRegistry.get(providerId);
    } catch {
      return undefined;
    }
  }
}

function satisfiesRequirements(
  capabilities: ProviderCapabilities,
  limits: ProviderLimits,
  requirements: RoutingRequirements,
): boolean {
  if (requirements.requiredCapabilities) {
    for (const [key, value] of Object.entries(requirements.requiredCapabilities) as Array<
      [keyof NonNullable<RoutingRequirements["requiredCapabilities"]>, boolean | undefined]
    >) {
      if (value === undefined) continue;
      if (capabilities[key] !== value) return false;
    }
  }
  if (requirements.minContextWindow !== undefined) {
    if (capabilities.contextWindow === null || capabilities.contextWindow < requirements.minContextWindow) return false;
  }
  if (requirements.minMaxOutputTokens !== undefined) {
    if (limits.maxOutputTokens === null || limits.maxOutputTokens < requirements.minMaxOutputTokens) return false;
  }
  return true;
}
