import { IneligibleCapabilityError, UnknownCapabilityError } from "./capability.errors";
import type { AICapabilityRegistrationInput, AICapabilityRegistryEntry } from "./capability.types";

// Deterministic DECIVEXA capability metadata store (Increment 3A).
//
// Mirrors the established ProviderRegistry/ModelRegistry discipline
// (../registry/provider-registry.ts, ../registry/model-registry.ts):
// given the same registered configuration, the same lookup always
// produces the same result. Registration and lookup perform no network
// I/O, no provider execution, no AI Runtime execution, and no policy,
// risk, or authorization decision of any kind.
export class CapabilityRegistry {
  private readonly capabilities = new Map<string, AICapabilityRegistryEntry>();

  register(input: AICapabilityRegistrationInput): void {
    this.capabilities.set(input.capabilityId, { ...input });
  }

  has(capabilityId: string): boolean {
    return this.capabilities.has(capabilityId);
  }

  // Returns the entry only if it is registered AND eligible; otherwise
  // throws a specific, distinguishable error, matching the
  // Unknown/Ineligible discipline already established for providers and
  // models. `eligible` remains static registration metadata only — see
  // capability.types.ts.
  get(capabilityId: string): AICapabilityRegistryEntry {
    const entry = this.capabilities.get(capabilityId);
    if (!entry) {
      throw new UnknownCapabilityError(`Capability "${capabilityId}" is not registered`);
    }
    if (!entry.eligible) {
      throw new IneligibleCapabilityError(`Capability "${capabilityId}" is registered but not eligible`);
    }
    return entry;
  }
}
