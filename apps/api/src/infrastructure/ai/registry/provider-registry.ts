import { IneligibleProviderError, UnknownProviderError } from "./registry.errors";
import type { ProviderRegistrationInput, ProviderRegistryEntry } from "./registry.types";

// Deterministic provider metadata store (Increment 1).
//
// Given the same registered configuration, the same lookup always
// produces the same result. This class performs no ranking, scoring,
// fallback selection, routing, or provider execution — those belong to
// Increment 2 (Model Router) and later. Registration and lookup never
// invoke a provider adapter.
export class ProviderRegistry {
  private readonly providers = new Map<string, ProviderRegistryEntry>();

  register(input: ProviderRegistrationInput): void {
    this.providers.set(input.providerId, { ...input });
  }

  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  // Returns the entry only if it is registered AND eligible; otherwise
  // throws a specific, distinguishable error so callers can tell "does
  // not exist" apart from "exists but is not eligible."
  get(providerId: string): ProviderRegistryEntry {
    const entry = this.providers.get(providerId);
    if (!entry) {
      throw new UnknownProviderError(`Provider "${providerId}" is not registered`);
    }
    if (!entry.eligible) {
      throw new IneligibleProviderError(`Provider "${providerId}" is registered but not eligible`);
    }
    return entry;
  }
}
