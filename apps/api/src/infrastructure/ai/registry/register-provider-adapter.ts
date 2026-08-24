import type { AIProvider } from "../provider/ai-provider.interface";
import type { ProviderRegistrationInput } from "./registry.types";

// Builds a ProviderRegistrationInput by snapshotting an existing AIProvider
// adapter's declared, synchronous metadata (getCapabilities()/getLimits()).
// Neither of those accessors performs I/O or invokes the provider, so this
// snapshot is safe to take at registration time without any accidental
// execution (see ai-provider.interface.ts — only `generate`/`stream`/
// `structuredOutput`/`embed`/`healthCheck` touch the network).
//
// This is the intended way to represent the existing AI Provider Adapter
// Foundation (apps/api/src/infrastructure/ai/adapters/) in the registry,
// per this increment's scope: register the existing provider, do not add
// a second one.
export function toProviderRegistrationInput(
  providerId: string,
  adapter: AIProvider,
  eligible: boolean,
): ProviderRegistrationInput {
  return {
    providerId,
    capabilities: adapter.getCapabilities(),
    limits: adapter.getLimits(),
    eligible,
  };
}
