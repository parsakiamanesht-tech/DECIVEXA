import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AIContextModule } from "../../application/ai-context/ai-context.module";
import { CONTEXT_RESOLUTION_PORT, type ContextResolutionPort } from "../ai/runtime/context-resolution.port";
import { AIRuntime } from "../ai/runtime/ai-runtime";
import { AIRuntimeController } from "../ai/runtime/ai-runtime.controller";
import { KeyedProviderResolver } from "../ai/runtime/provider-instance-resolver";
import { CapabilityRegistry } from "../ai/capability/capability-registry";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "../ai/capability/personal-state-interpret.capability";
import { ModelRegistry } from "../ai/registry/model-registry";
import { ProviderRegistry } from "../ai/registry/provider-registry";
import { ModelRouter } from "../ai/router/model-router";

// AI Infrastructure / AIRuntime Production-Wiring Validation module
// (Founder Authorization: "AI INFRASTRUCTURE / AIRUNTIME PRODUCTION-WIRING
// VALIDATION - PERSONAL STATE - ROUTE-ONLY").
//
// Design note (why this module lives OUTSIDE infrastructure/ai/, not
// inside it): ADR-009's zero-import rule forbids infrastructure/ai/ from
// directly importing application/. Making AIRuntime a real NestJS
// provider requires binding CONTEXT_RESOLUTION_PORT, which only
// application/ai-context/AIContextModule exports. Rather than violate
// the zero-import rule (by having a file under infrastructure/ai/ import
// AIContextModule) or modify AIContextModule itself (not authorized),
// this wiring lives in its own sibling directory - exactly the same
// relationship app.module.ts already has to AIContextModule. Every file
// physically under infrastructure/ai/ (ai-runtime.ts, ai-runtime.controller.ts,
// capability-registry.ts, model-router.ts, etc.) remains completely free
// of any application/ import; only this module - outside that
// boundary - performs the composition.
//
// CapabilityRegistry is seeded with exactly one capability
// (personal-state.interpret). ModelRegistry/ProviderRegistry are
// deliberately left unseeded: registering a model/provider is not
// authorized by this increment. A real call therefore correctly and
// honestly throws NoEligibleCandidateError (mapped to a 503 by
// AIRuntimeController) until a future, separately authorized increment
// registers an approved model/provider - this is expected behavior for
// an infrastructure-validation-only increment, not a defect.
//
// AIRuntime.execute() is never invoked from anywhere in this module or
// its controller. No PolicyEngine, RiskEngine, selector, or provider
// wiring is introduced. ai-runtime.ts, capability-registry.ts, and
// model-router.ts remain completely unmodified - AIRuntime/
// CapabilityRegistry/ModelRouter are wired via factory providers rather
// than @Injectable()/class providers, so no decorator changes were
// needed to any of those three existing, tested files.
//
// Gate 2a (Founder Authorization Amendment: "GATE 2A — RESOLVE
// STRUCTURAL TEST CONFLICT"): wires the already-implemented
// KeyedProviderResolver (Gate 1) into production DI as AIRuntime's
// fourth, still-OPTIONAL constructor argument. Bound by its own
// concrete class, not a Symbol token - it lives inside
// infrastructure/ai/ (unlike CONTEXT_RESOLUTION_PORT's implementation,
// which lives across the ADR-009 zero-import boundary in
// application/ai-context/ and therefore needs a token), exactly
// mirroring how CapabilityRegistry/ModelRouter are already bound above.
// Constructed with an empty, immutable Map: no AIProvider instance is
// constructed, no provider/model is registered, and execute() remains
// unreachable from any controller - this gate establishes wiring only.
// AIRuntime's constructor signature, its optional-dependency guard, and
// its route()/execute() behavior are all untouched by this gate; the
// previously recorded "optional fourth AIRuntime dependency"
// architectural risk remains explicitly OPEN.
@Module({
  imports: [AuthModule, AIContextModule],
  controllers: [AIRuntimeController],
  providers: [
    {
      provide: CapabilityRegistry,
      useFactory: () => {
        const registry = new CapabilityRegistry();
        registry.register(PERSONAL_STATE_INTERPRET_CAPABILITY);
        return registry;
      },
    },
    {
      provide: ModelRouter,
      useFactory: () => new ModelRouter(new ModelRegistry(), new ProviderRegistry()),
    },
    {
      provide: KeyedProviderResolver,
      useFactory: () => new KeyedProviderResolver(new Map()),
    },
    {
      provide: AIRuntime,
      useFactory: (
        capabilityRegistry: CapabilityRegistry,
        modelRouter: ModelRouter,
        contextResolutionPort: ContextResolutionPort,
        providerResolutionResolver: KeyedProviderResolver,
      ) => new AIRuntime(capabilityRegistry, modelRouter, contextResolutionPort, providerResolutionResolver),
      inject: [CapabilityRegistry, ModelRouter, CONTEXT_RESOLUTION_PORT, KeyedProviderResolver],
    },
  ],
})
export class AIRuntimeModule {}
