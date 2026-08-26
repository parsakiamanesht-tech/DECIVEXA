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
import { toProviderRegistrationInput } from "../ai/registry/register-provider-adapter";
import { ModelRouter } from "../ai/router/model-router";
import { OpenAiCompatibleProviderAdapter } from "../ai/adapters/openai-compatible-provider.adapter";
import { GATE7_CONTROLLED_EXECUTION_CAPABILITY } from "../ai/capability/gate7-controlled-execution.capability";
import { GATE7_MODEL_ID, GATE7_PROVIDER_ID } from "../ai/gate7/gate7-identifiers";
import { LazyGate7ProviderResolver } from "../ai/gate7/gate7-lazy-provider-resolver";
import { Gate7CompositeProviderResolver } from "../ai/gate7/gate7-composite-provider-resolver";

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
// (personal-state.interpret).
//
// Gate 3 (Founder Implementation Authorization: "GATE 3 — METADATA
// REGISTRATION ONLY"): ModelRegistry/ProviderRegistry are now seeded
// with exactly one provider metadata entry and one model metadata
// entry, registered via the existing, already-tested
// toProviderRegistrationInput() snapshot mechanism
// (../ai/registry/register-provider-adapter.ts) - metadata
// registration only, using the repository's existing abstractions
// unchanged. The OpenAiCompatibleProviderAdapter instance constructed
// below exists solely to snapshot its synchronous, side-effect-free
// getCapabilities()/getLimits() accessors (see that file's own header
// comment: "Neither of those accessors performs I/O or invokes the
// provider"; register-provider-adapter.spec.ts asserts exactly this
// pattern with zero fetch calls) - it is never stored, never passed to
// KeyedProviderResolver (whose production map was still empty as of
// this gate; Gate 4, below, later populated it with a separate,
// independent AIProvider instance - a distinct, separately authorized
// concern from this metadata-only instance), and .generate()/
// .healthCheck() are never called on it.
// Its config is an explicit, hard-coded, credential-free literal;
// resolveOpenAiCompatibleProviderConfig() is never called, so no
// AI_PROVIDER_ENDPOINT/AI_PROVIDER_API_KEY/AI_PROVIDER_TIMEOUT_MS
// environment variable is read anywhere in this path (Gate 3 §7). The
// registered modelId ("decivexa-infra-validation-placeholder-model")
// matches AIRuntimeController's existing, unmodified CANDIDATE_MODEL_IDS
// literal exactly - without that match, route() would still fail even
// with metadata registered, since the controller (forbidden file, not
// touched by this gate) only ever requests that one candidate id. A
// real call now correctly returns a real RoutingResult instead of
// NoEligibleCandidateError - infrastructure/metadata wiring only:
// AIRuntime.execute() is still never invoked from anywhere in this
// module or its controller, and no AIProvider instance is ever resolved
// or invoked as a result of this registration.
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
// AIRuntime's constructor signature, its optional-dependency guard, and
// its route()/execute() behavior are all untouched by this gate; the
// previously recorded "optional fourth AIRuntime dependency"
// architectural risk was later closed by Gate 2b (constructor parameter
// made required).
//
// Gate 4 (Founder Implementation Authorization: "GATE 4 — PROVIDER
// INSTANCE CONSTRUCTION + RESOLVER MAP POPULATION"): KeyedProviderResolver's
// production map is no longer empty - it now contains exactly one
// AIProvider instance, keyed "openai-compatible", constructed below
// with the same explicit, hard-coded, credential-free config literal
// pattern Gate 3 already established for its (separate, independent)
// metadata-snapshot instance above. resolveOpenAiCompatibleProviderConfig()
// is never called here either, so no AI_PROVIDER_ENDPOINT/
// AI_PROVIDER_API_KEY/AI_PROVIDER_TIMEOUT_MS environment variable is
// read. KeyedProviderResolver itself (../ai/runtime/provider-instance-resolver.ts)
// is completely unmodified - still pure keyed lookup, Gate 1. This
// establishes provider instance construction + provider resolution
// enablement only, NOT execution authorization: nothing in this module
// calls .generate()/.healthCheck(), and AIRuntime.execute() remains
// unreachable from any controller (AIRuntimeController, unmodified,
// still exposes only route()). ModelRouter.select() still fails first
// for any candidate other than the one Gate 3 registered, and even for
// that one, execute() is simply never invoked by anything in this
// module or its controller.
//
// Gate 7 (Founder Implementation Authorization: "GATE 7 — DECISION-SCOPED
// PREREQUISITE IMPLEMENTATION"): CapabilityRegistry now also seeds
// GATE7_CONTROLLED_EXECUTION_CAPABILITY (FD-1(B) - a new, distinct
// capability; PERSONAL_STATE_INTERPRET_CAPABILITY remains completely
// unmodified). ModelRouter's registries now also carry a SECOND,
// independent metadata-only provider/model pair keyed by
// GATE7_PROVIDER_ID/GATE7_MODEL_ID (../ai/gate7/gate7-identifiers.ts),
// constructed with the same credential-free inert literal pattern Gate 3
// established - the existing Gate 3/4 "openai-compatible" entries are
// untouched. AIRuntime's fourth constructor argument is now a
// Gate7CompositeProviderResolver (../ai/gate7/gate7-composite-provider-resolver.ts)
// instead of a directly-injected KeyedProviderResolver: it delegates to
// the existing, completely unmodified KeyedProviderResolver for any
// providerId already in its map (still just "openai-compatible", still
// eagerly populated with the same Gate 4 inert instance), and to the new
// LazyGate7ProviderResolver (../ai/gate7/gate7-lazy-provider-resolver.ts)
// for GATE7_PROVIDER_ID only. LazyGate7ProviderResolver performs zero
// configuration reads at construction/bootstrap time (FD-3(B): lazy
// resolution) - resolveOpenAiCompatibleProviderConfig() and the Gate-7
// FD-5 security checks are only ever called from inside its resolve(),
// which nothing in this module or its controller invokes. AI_PROVIDER_*
// and every AI_PROVIDER_GATE7_* environment variable therefore remain
// unread by this module exactly as before. No credential is introduced,
// no real network call occurs, and execute() remains unreachable from
// any controller in this repository - this gate closes prerequisite
// architectural gaps only; State D remains CLOSED.
@Module({
  imports: [AuthModule, AIContextModule],
  controllers: [AIRuntimeController],
  providers: [
    {
      provide: CapabilityRegistry,
      useFactory: () => {
        const registry = new CapabilityRegistry();
        registry.register(PERSONAL_STATE_INTERPRET_CAPABILITY);
        registry.register(GATE7_CONTROLLED_EXECUTION_CAPABILITY);
        return registry;
      },
    },
    {
      provide: ModelRouter,
      useFactory: () => {
        const modelRegistry = new ModelRegistry();
        const providerRegistry = new ProviderRegistry();

        const providerId = "openai-compatible";
        const metadataOnlyAdapter = new OpenAiCompatibleProviderAdapter({
          endpoint: "unused-metadata-snapshot-only",
          apiKey: null,
          timeoutMs: 1,
        });
        const providerRegistrationInput = toProviderRegistrationInput(providerId, metadataOnlyAdapter, true);
        providerRegistry.register(providerRegistrationInput);
        modelRegistry.register({
          modelId: "decivexa-infra-validation-placeholder-model",
          providerId,
          eligible: true,
          capabilities: providerRegistrationInput.capabilities,
          limits: providerRegistrationInput.limits,
        });

        // Gate 7: a second, independent metadata-only provider/model
        // pair, isolated to GATE7_PROVIDER_ID/GATE7_MODEL_ID. Same
        // credential-free inert literal pattern as above; this adapter
        // instance is also never stored and never has .generate()/
        // .healthCheck() called on it - metadata snapshot only.
        const gate7MetadataOnlyAdapter = new OpenAiCompatibleProviderAdapter({
          endpoint: "unused-gate7-metadata-snapshot-only",
          apiKey: null,
          timeoutMs: 1,
        });
        const gate7ProviderRegistrationInput = toProviderRegistrationInput(GATE7_PROVIDER_ID, gate7MetadataOnlyAdapter, true);
        providerRegistry.register(gate7ProviderRegistrationInput);
        modelRegistry.register({
          modelId: GATE7_MODEL_ID,
          providerId: GATE7_PROVIDER_ID,
          eligible: true,
          capabilities: gate7ProviderRegistrationInput.capabilities,
          limits: gate7ProviderRegistrationInput.limits,
        });

        return new ModelRouter(modelRegistry, providerRegistry);
      },
    },
    {
      provide: KeyedProviderResolver,
      useFactory: () => {
        const resolvableProvider = new OpenAiCompatibleProviderAdapter({
          endpoint: "unused-provider-resolution-only",
          apiKey: null,
          timeoutMs: 1,
        });
        return new KeyedProviderResolver(new Map([["openai-compatible", resolvableProvider]]));
      },
    },
    // Gate 7: LazyGate7ProviderResolver has an all-defaulted constructor
    // (env defaults to process.env, fetchImpl defaults to the platform
    // fetch - see gate7-lazy-provider-resolver.ts), so NestJS's bare-class
    // provider shorthand instantiates it with zero eager configuration
    // reads, exactly like the existing bare-class providers elsewhere in
    // this repository.
    LazyGate7ProviderResolver,
    {
      provide: Gate7CompositeProviderResolver,
      useFactory: (keyedResolver: KeyedProviderResolver, gate7Resolver: LazyGate7ProviderResolver) =>
        new Gate7CompositeProviderResolver(keyedResolver, gate7Resolver),
      inject: [KeyedProviderResolver, LazyGate7ProviderResolver],
    },
    {
      provide: AIRuntime,
      useFactory: (
        capabilityRegistry: CapabilityRegistry,
        modelRouter: ModelRouter,
        contextResolutionPort: ContextResolutionPort,
        providerResolutionResolver: Gate7CompositeProviderResolver,
      ) => new AIRuntime(capabilityRegistry, modelRouter, contextResolutionPort, providerResolutionResolver),
      inject: [CapabilityRegistry, ModelRouter, CONTEXT_RESOLUTION_PORT, Gate7CompositeProviderResolver],
    },
  ],
})
export class AIRuntimeModule {}
