import type { AIProvider } from "../provider/ai-provider.interface";

// AIRuntime → Provider Resolution Port (Founder Implementation
// Authorization: "First Controlled Execution, Narrow Test-Only Scope").
//
// Dependency-inversion seam, mirroring context-resolution.port.ts's exact
// pattern: infrastructure/ai owns and depends only on this interface +
// token. RoutingResult (../router/router.types.ts) carries only metadata
// (modelId/providerId/capabilities/limits) - nothing else in this
// repository maps a providerId to a callable AIProvider instance, and
// ModelRegistry/ProviderRegistry deliberately never hold one (see their
// own header comments in ../registry/registry.types.ts). This port is
// the minimal, honest answer to that gap: it resolves a providerId to an
// AIProvider instance without making the registries hold instances,
// without modifying ModelRouter, and without introducing a generalized
// dependency-injection framework.
//
// Production wiring is NOT introduced by this increment: no
// implementation of this port is registered in ai-runtime.module.ts or
// app.module.ts (both remain untouched). Only test-local, in-memory
// implementations exist, inside spec files.
export interface ProviderResolutionPort {
  resolve(providerId: string): Promise<AIProvider | undefined>;
}

export const PROVIDER_RESOLUTION_PORT = Symbol("PROVIDER_RESOLUTION_PORT");
