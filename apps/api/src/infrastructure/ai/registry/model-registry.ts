import { IneligibleModelError, UnknownModelError } from "./registry.errors";
import type { ModelRegistrationInput, ModelRegistryEntry } from "./registry.types";

// Deterministic model metadata store (Increment 1).
//
// A model entry records the provider it is associated with (`providerId`)
// as plain metadata; this registry does not itself validate that the
// associated provider exists or is eligible in a ProviderRegistry — that
// kind of cross-registry resolution is a Model Router (Increment 2)
// concern, not a Registry one, per the v1 scope boundary for this
// increment. Registration and lookup never invoke a provider adapter.
export class ModelRegistry {
  private readonly models = new Map<string, ModelRegistryEntry>();

  register(input: ModelRegistrationInput): void {
    this.models.set(input.modelId, { ...input });
  }

  has(modelId: string): boolean {
    return this.models.has(modelId);
  }

  get(modelId: string): ModelRegistryEntry {
    const entry = this.models.get(modelId);
    if (!entry) {
      throw new UnknownModelError(`Model "${modelId}" is not registered`);
    }
    if (!entry.eligible) {
      throw new IneligibleModelError(`Model "${modelId}" is registered but not eligible`);
    }
    return entry;
  }
}
