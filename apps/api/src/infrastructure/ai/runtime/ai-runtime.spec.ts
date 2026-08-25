import test from "node:test";
import assert from "node:assert/strict";
import { AIRuntime, minimizeContext } from "./ai-runtime";
import {
  AIRuntimeExecutionNotAvailableError,
  ContextResolutionFailedError,
  InvalidAITaskRequestError,
  ProviderResolutionFailedError,
  UnsupportedContextCardinalityError,
} from "./runtime.errors";
import type { ContextResolutionPort, ContextResolutionRequest, ContextResolutionResult } from "./context-resolution.port";
import type { ProviderResolutionPort } from "./provider-resolution.port";
import { PolicyAuthorizationDeniedError } from "../policy/policy.errors";
import { OutputPolicyValidationDeniedError } from "../policy/output-policy-validation";
import { OutputValidationRejectedError } from "../validation/validation.errors";
import { CapabilityRegistry } from "../capability/capability-registry";
import { UnknownCapabilityError, IneligibleCapabilityError } from "../capability/capability.errors";
import type { AICapabilityRegistrationInput } from "../capability/capability.types";
import { ModelRegistry } from "../registry/model-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { ModelRouter } from "../router/model-router";
import { NoEligibleCandidateError } from "../router/router.errors";
import { OpenAiCompatibleProviderAdapter } from "../adapters/openai-compatible-provider.adapter";
import type { OpenAiCompatibleProviderConfig } from "../config/openai-compatible-provider.config";
import { TimeoutError } from "../errors/ai-provider.errors";
import type { AIProvider } from "../provider/ai-provider.interface";
import type { GenerateRequest, GenerateResult, ProviderCapabilities, ProviderLimits } from "../provider/ai-provider.types";
import { createRequestContext } from "../../../context/request-context";

const BASE_CAPABILITIES: ProviderCapabilities = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const BASE_LIMITS: ProviderLimits = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };
const CONTEXT = createRequestContext("request-1", "user-1");

function eligibleCapability(
  capabilityId: string,
  overrides: Partial<AICapabilityRegistrationInput> = {},
): AICapabilityRegistrationInput {
  return {
    capabilityId,
    version: "v1",
    purpose: "test capability",
    inputSchema: null,
    outputSchema: null,
    requiredContext: [],
    privacyClassification: "standard",
    riskClassification: "informational-read-only",
    minimumQualityThreshold: null,
    latencyTargetMs: null,
    costTarget: null,
    allowedExecutionTiers: [],
    validationRequirements: [],
    humanApprovalRequired: false,
    eligible: true,
    ...overrides,
  };
}

// A fake ContextResolutionPort that must never be reached by any
// existing (zero-requiredContext) fixture; when it is reached, it
// records the call and returns a caller-supplied result.
function fakeContextResolutionPort(result: ContextResolutionResult) {
  const calls: ContextResolutionRequest[] = [];
  const port: ContextResolutionPort = {
    resolve: async (request) => {
      calls.push(request);
      return result;
    },
  };
  return { port, calls };
}

function setUp(contextResolutionResult: ContextResolutionResult = { status: "resolution_failure" }, providerResolutionPort?: ProviderResolutionPort) {
  const capabilityRegistry = new CapabilityRegistry();
  const modelRegistry = new ModelRegistry();
  const providerRegistry = new ProviderRegistry();
  providerRegistry.register({
    providerId: "openai-compatible",
    capabilities: BASE_CAPABILITIES,
    limits: BASE_LIMITS,
    eligible: true,
  });
  const modelRouter = new ModelRouter(modelRegistry, providerRegistry);
  const { port: contextResolutionPort, calls: contextResolutionCalls } = fakeContextResolutionPort(contextResolutionResult);
  // providerResolutionPort is AIRuntime's fourth, OPTIONAL constructor
  // dependency (First Controlled Execution increment §2/§9). Omitting it
  // here (as every pre-existing test does, unchanged) exactly mirrors
  // ai-runtime.module.ts's real, untouched production factory, which
  // also supplies only three arguments.
  const runtime = new AIRuntime(capabilityRegistry, modelRouter, contextResolutionPort, providerResolutionPort);
  return { capabilityRegistry, modelRegistry, providerRegistry, modelRouter, runtime, contextResolutionCalls };
}

// A test-local, in-memory-only AIProvider fake (Founder Implementation
// Authorization §8: "an equivalent test-local fake AIProvider"). Never
// performs I/O; records every GenerateRequest it receives so tests can
// assert on the exact provider-facing payload (privacy boundary tests
// M/N below).
function fakeProvider(generateImpl: (request: GenerateRequest) => Promise<GenerateResult>) {
  const calls: GenerateRequest[] = [];
  const provider: AIProvider = {
    generate: async (request) => {
      calls.push(request);
      return generateImpl(request);
    },
    healthCheck: async () => ({ available: true, latencyMs: 0, errorSignal: null }),
    getCapabilities: () => BASE_CAPABILITIES,
    getLimits: () => BASE_LIMITS,
  };
  return { provider, calls };
}

// A test-local, in-memory ProviderResolutionPort implementation (Founder
// Implementation Authorization §9: "The test implementation may use an
// in-memory map... This map must exist only in test infrastructure").
// Never registered anywhere in production (ai-runtime.module.ts and
// app.module.ts remain untouched).
function fakeProviderResolutionPort(providers: Record<string, AIProvider>): { port: ProviderResolutionPort; calls: string[] } {
  const calls: string[] = [];
  const port: ProviderResolutionPort = {
    resolve: async (providerId) => {
      calls.push(providerId);
      return providers[providerId];
    },
  };
  return { port, calls };
}

// A. deterministic routing result
//
// Uses "personal-state.interpret" (rather than an arbitrary placeholder
// id) because the Policy Authorization boundary added by the Policy
// Authorization / Provider Eligibility / Output Validation increment
// authorizes exactly that one capability id — this and several other
// pre-existing tests below were updated to use it for exactly that
// reason (a narrow, expected consequence of the new Founder-authorized
// pipeline step, not a broadening of what each test verifies).
test("route returns the same result for the same request", async () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const first = await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });
  const second = await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.deepEqual(first, second);
});

// B. capability resolution occurs (an ineligible capability blocks
// routing even though a fully eligible model exists — proving the
// Runtime actually consults the CapabilityRegistry rather than skipping
// straight to model selection)
test("route rejects a registered but ineligible capability before consulting the Router", async () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("retired-capability", { eligible: false }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.route({ capabilityId: "retired-capability", candidateModelIds: ["model-a"], context: CONTEXT }),
    IneligibleCapabilityError,
  );
});

// C. unknown capability produces a dedicated typed error
test("route throws UnknownCapabilityError for an unregistered capability", async () => {
  const { modelRegistry, runtime } = setUp();
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.route({ capabilityId: "does-not-exist", candidateModelIds: ["model-a"], context: CONTEXT }),
    UnknownCapabilityError,
  );
});

// structural: malformed request shape produces a dedicated typed error
test("route throws InvalidAITaskRequestError for a structurally invalid request", async () => {
  const { runtime } = setUp();

  await assert.rejects(
    () => runtime.route({ capabilityId: "", candidateModelIds: ["model-a"], context: CONTEXT }),
    InvalidAITaskRequestError,
  );
  await assert.rejects(
    () => runtime.route({ capabilityId: "goal-clarification", candidateModelIds: [], context: CONTEXT }),
    InvalidAITaskRequestError,
  );
});

// D. RoutingRequirements are derived from capability metadata only, and
// honestly: no field of AICapabilityRegistrationInput currently maps to
// a technical routing constraint, so a capability with strict-looking
// declarative metadata (high quality threshold, tight latency/cost
// targets) must not silently exclude a model that a fabricated mapping
// would have rejected.
test("routing requirements derived from a capability never fabricate a technical constraint", async () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(
    eligibleCapability("personal-state.interpret", {
      minimumQualityThreshold: 0.99,
      latencyTargetMs: 1,
      costTarget: 0,
    }),
  );
  // A minimally-capable model (no streaming/structured output/embeddings,
  // no declared context window or output-token limit) must still be
  // selectable — proving the strict-looking capability metadata above
  // was not turned into an invented RoutingRequirements constraint.
  modelRegistry.register({ modelId: "minimal-model", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const result = await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["minimal-model"], context: CONTEXT });

  assert.equal(result.modelId, "minimal-model");
});

// E. ModelRouter.select() is invoked exactly once per Runtime invocation
test("route invokes ModelRouter.select exactly once", async () => {
  const { capabilityRegistry, modelRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  let selectCalls = 0;
  const originalSelect = modelRouter.select.bind(modelRouter);
  modelRouter.select = (...args: Parameters<typeof originalSelect>) => {
    selectCalls += 1;
    return originalSelect(...args);
  };

  await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.equal(selectCalls, 1);
});

// F. Runtime returns the Router selection without rewriting Router
// behavior (including propagating the Router's own NoEligibleCandidateError)
test("route returns exactly what ModelRouter.select would return for the same candidates", async () => {
  const { capabilityRegistry, modelRegistry, providerRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const directResult = new ModelRouter(modelRegistry, providerRegistry).select(["model-a"]);
  const runtimeResult = await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.deepEqual(runtimeResult, directResult);
});

test("route propagates ModelRouter's NoEligibleCandidateError unchanged", async () => {
  const { capabilityRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));

  await assert.rejects(
    () => runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["unknown-model"], context: CONTEXT }),
    NoEligibleCandidateError,
  );
});

// G-L, R. no provider execution (generate/stream/structuredOutput/embed/
// healthCheck) and no network I/O anywhere in the routing pipeline
test("route never invokes any provider adapter method, including healthCheck", async () => {
  let calls = 0;
  const config: OpenAiCompatibleProviderConfig = { endpoint: "http://localhost:8000/v1", apiKey: null, timeoutMs: 1000 };
  const adapter = new OpenAiCompatibleProviderAdapter(config, async () => {
    calls += 1;
    throw new Error("should never be called by AIRuntime routing");
  });

  const { capabilityRegistry, modelRegistry, providerRegistry, runtime } = setUp();
  providerRegistry.register({
    providerId: "tracked-provider",
    capabilities: adapter.getCapabilities(),
    limits: adapter.getLimits(),
    eligible: true,
  });
  modelRegistry.register({
    modelId: "tracked-model",
    providerId: "tracked-provider",
    eligible: true,
    capabilities: adapter.getCapabilities(),
    limits: adapter.getLimits(),
  });
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));

  await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["tracked-model"], context: CONTEXT });

  assert.equal(calls, 0);
});

// M. no authorization/approval field exists in the Runtime result
test("route's result carries only routing-selection metadata, never an authorization/approval field", async () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const result = await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.deepEqual(Object.keys(result).sort(), ["capabilities", "limits", "modelId", "providerId"]);
});

// N. Runtime performs no policy decision
// O. Runtime performs no risk decision
// P. Runtime performs no Memory/domain/application access
// S. no HTTP/API exposure
// T. ModelRouter's public contract remains unchanged
//
// Structural: this file and ai-runtime.ts import only from
// ../capability/**, ../registry/**, ../router/**, ../provider/**,
// ../adapters/**, ../config/**, ./runtime.types|errors,
// ./context-resolution.port, and ../../../context/request-context (the
// one Founder-sanctioned exception, Runtime Context Resolution
// increment Decision 3) — never from core/, application/, or domain/,
// and never from a PolicyEngine/RiskEngine module (neither exists in
// the repository). No controller or route is created anywhere in this
// increment. ModelRouter is constructed and called here with its
// existing, unmodified constructor/select signature (see the "F" tests
// above) — model-router.ts, router.types.ts, and router.errors.ts are
// not modified by this increment, and ../router/model-router.spec.ts's
// own suite remains the regression authority for Router behavior.
// Verified via the boundary/security audit in the implementation
// report, not re-asserted here as further runtime tests since there is
// nothing else to invoke.

// Q. the execution boundary produces a dedicated, typed error rather
// than silently continuing when no ProviderResolutionPort is supplied —
// exactly the production case, since ai-runtime.module.ts's real
// factory still constructs AIRuntime with only three arguments (First
// Controlled Execution increment §2/§9: "production wiring MUST NOT be
// added"). execute() is now async (its signature changed from `(): never`
// to `(request): Promise<GenerateResult>`), so this is asserted with
// assert.rejects rather than a synchronous assert.throws.
test("execute rejects with AIRuntimeExecutionNotAvailableError when no ProviderResolutionPort is configured (the production case) and never completes execution", async () => {
  const { runtime } = setUp();

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    AIRuntimeExecutionNotAvailableError,
  );
});

// --- Runtime Context Resolution increment ---

// Zero-context capability: no acquisition attempted, deterministic,
// port never invoked.
test("route does not invoke the context resolution port for a zero-requiredContext capability", async () => {
  const { capabilityRegistry, modelRegistry, runtime, contextResolutionCalls } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: [] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.deepEqual(contextResolutionCalls, []);
});

// One-context capability, port resolves successfully: routing proceeds.
test("route invokes the context resolution port exactly once for a one-requiredContext capability and proceeds on success", async () => {
  const { capabilityRegistry, modelRegistry, runtime, contextResolutionCalls } = setUp({
    status: "resolved",
    context: { label: "personal-state", data: { id: "ps1" } },
  });
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const result = await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.equal(result.modelId, "model-a");
  assert.equal(contextResolutionCalls.length, 1);
  assert.deepEqual(contextResolutionCalls[0], { context: CONTEXT, label: "personal-state", selector: null });
});

// RequestContext is forwarded to the port unchanged (same reference).
test("route forwards RequestContext to the context resolution port unchanged", async () => {
  const { capabilityRegistry, modelRegistry, runtime, contextResolutionCalls } = setUp({
    status: "resolved",
    context: { label: "memory", data: {} },
  });
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["memory"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.strictEqual(contextResolutionCalls[0]?.context, CONTEXT);
});

// Every non-"resolved" port outcome fails deterministically and is never
// converted into a successful routing result.
for (const failingResult of [
  { status: "unsupported_label", label: "goal-state" },
  { status: "missing_selector", label: "memory" },
  { status: "not_found" },
  { status: "unauthorized" },
  { status: "resolution_failure" },
] as const) {
  test(`route throws ContextResolutionFailedError and never selects a model when the port returns "${failingResult.status}"`, async () => {
    const { capabilityRegistry, modelRegistry, runtime } = setUp(failingResult);
    capabilityRegistry.register(eligibleCapability("goal-clarification", { requiredContext: ["memory"] }));
    modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

    await assert.rejects(
      () => runtime.route({ capabilityId: "goal-clarification", candidateModelIds: ["model-a"], context: CONTEXT }),
      ContextResolutionFailedError,
    );
  });
}

// More than one requiredContext item is explicitly unsupported, never
// silently narrowed to "process only the first item."
test("route throws UnsupportedContextCardinalityError for a capability declaring more than one requiredContext item, without invoking the port", async () => {
  const { capabilityRegistry, modelRegistry, runtime, contextResolutionCalls } = setUp();
  capabilityRegistry.register(
    eligibleCapability("multi-context-capability", { requiredContext: ["memory", "evidence"] }),
  );
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.route({ capabilityId: "multi-context-capability", candidateModelIds: ["model-a"], context: CONTEXT }),
    UnsupportedContextCardinalityError,
  );
  assert.deepEqual(contextResolutionCalls, []);
});

// Structural: AIRuntime never references AIContextService, any use-case,
// or a repository directly — it depends only on the port contract.
// Mirrors the established convention in
// foundation/resource-persistence-boundaries.spec.ts (process.cwd()-
// relative path, no import.meta).
test("ai-runtime.ts never imports AIContextService, a use-case, or a repository", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(
    join(process.cwd(), "src", "infrastructure", "ai", "runtime", "ai-runtime.ts"),
    "utf8",
  );
  const forbidden = ["AIContextService", "UseCase", "Repository", "application/ai-context"];
  for (const symbol of forbidden) {
    assert.equal(source.includes(symbol), false, `ai-runtime.ts must not reference ${symbol}`);
  }
});

// --- Policy Authorization / Provider Eligibility / Output Validation increment ---
//
// authorizePolicy() itself is unit-tested exhaustively in
// ../policy/policy-authorization.spec.ts (every denial reason, and the
// authorized case, in isolation). The tests below prove the integration:
// that AIRuntime.route() actually calls it, in the right pipeline
// position, and that a denial stops the pipeline before ModelRouter (and
// therefore before any execute()/provider call, since nothing after a
// thrown error runs).

test("route throws PolicyAuthorizationDeniedError and never calls ModelRouter.select for a capability id other than personal-state.interpret", async () => {
  const { capabilityRegistry, modelRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("some-other-capability"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  let selectCalls = 0;
  const originalSelect = modelRouter.select.bind(modelRouter);
  modelRouter.select = (...args: Parameters<typeof originalSelect>) => {
    selectCalls += 1;
    return originalSelect(...args);
  };

  await assert.rejects(
    () => runtime.route({ capabilityId: "some-other-capability", candidateModelIds: ["model-a"], context: CONTEXT }),
    PolicyAuthorizationDeniedError,
  );
  assert.equal(selectCalls, 0, "ModelRouter.select must never be reached after a policy denial");
});

test("route throws PolicyAuthorizationDeniedError and never calls ModelRouter.select for an unauthenticated request", async () => {
  const { capabilityRegistry, modelRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });
  const unauthenticatedContext = createRequestContext("request-unauth");

  let selectCalls = 0;
  const originalSelect = modelRouter.select.bind(modelRouter);
  modelRouter.select = (...args: Parameters<typeof originalSelect>) => {
    selectCalls += 1;
    return originalSelect(...args);
  };

  await assert.rejects(
    () => runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: unauthenticatedContext }),
    PolicyAuthorizationDeniedError,
  );
  assert.equal(selectCalls, 0);
});

test("route throws PolicyAuthorizationDeniedError and never calls ModelRouter.select for a risk classification other than informational-read-only", async () => {
  const { capabilityRegistry, modelRegistry, modelRouter, runtime } = setUp();
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { riskClassification: "high-risk" }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  let selectCalls = 0;
  const originalSelect = modelRouter.select.bind(modelRouter);
  modelRouter.select = (...args: Parameters<typeof originalSelect>) => {
    selectCalls += 1;
    return originalSelect(...args);
  };

  await assert.rejects(
    () => runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    PolicyAuthorizationDeniedError,
  );
  assert.equal(selectCalls, 0);
});

// Policy Authorization runs after Context Resolution (matching the
// documented pipeline order, Founder Implementation Authorization §7):
// a context-resolution failure is still reported as
// ContextResolutionFailedError, never masked by a policy denial that
// would otherwise also apply to the same request.
test("a context resolution failure is reported before Policy Authorization ever runs", async () => {
  const { capabilityRegistry, modelRegistry, runtime } = setUp({ status: "not_found" });
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.route({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    ContextResolutionFailedError,
  );
});

// No execute()/provider call can occur after a policy denial, because
// nothing runs after the thrown error - this is proven structurally
// (below) and by construction: every "never calls ModelRouter.select"
// assertion above already implies execute() and the provider adapter,
// which are only reachable even further downstream, were never reached
// either.

test("policy-authorization.ts and its wiring into ai-runtime.ts never reference AIRuntime.execute or a provider adapter (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const runtimeSource = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "runtime", "ai-runtime.ts"), "utf8");
  const policySource = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "policy", "policy-authorization.ts"), "utf8");
  assert.equal(runtimeSource.includes("this.execute("), false, "route() must never call execute()");
  for (const source of [runtimeSource, policySource]) {
    assert.equal(source.includes("OpenAiCompatibleProviderAdapter"), false, "must not reference the provider adapter");
  }
});

// --- First Controlled Execution increment ---
//
// Founder Implementation Authorization: "First Controlled Execution,
// Narrow Test-Only Scope". All provider instances below are test-local
// (a hand-written fakeProvider(), or the real OpenAiCompatibleProviderAdapter
// constructed with a fake fetchImpl per the existing established test
// convention) — never a real network call, never a real credential, and
// never registered anywhere in production (see the ai-runtime.module.ts
// structural test at the end of this section).

const FULL_PERSONAL_STATE_DATA = {
  id: "ps-1",
  userId: "user-1",
  timezone: "UTC",
  locale: "en-US",
  availability: "available",
  provenance: "declared",
  revision: 3,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
};

// A. + L. successful execution through a test-grade provider, passing
// both structural and output Policy Validation.
test("execute: successful personal-state.interpret execution through a test-grade provider, passing both validation stages", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "interpreted", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  const result = await runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.deepEqual(result, { text: "interpreted", finishReason: "stop" });
  assert.equal(providerCalls.length, 1);
  // Provider resolution is keyed by the routed providerId, not modelId.
  assert.deepEqual(resolutionCalls, ["openai-compatible"]);
});

// B. + O. wrong / unregistered capability cannot reach provider resolution or invocation.
test("execute: a capability id other than personal-state.interpret is rejected before any provider is resolved", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "x", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(undefined, providerResolutionPort);
  capabilityRegistry.register(eligibleCapability("some-other-capability"));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "some-other-capability", candidateModelIds: ["model-a"], context: CONTEXT }),
    PolicyAuthorizationDeniedError,
  );
  assert.equal(resolutionCalls.length, 0);
  assert.equal(providerCalls.length, 0);
});

test("execute: an unregistered capability id is rejected before any provider is resolved", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "x", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { runtime } = setUp(undefined, providerResolutionPort);

  await assert.rejects(
    () => runtime.execute({ capabilityId: "does-not-exist", candidateModelIds: ["model-a"], context: CONTEXT }),
    UnknownCapabilityError,
  );
  assert.equal(resolutionCalls.length, 0);
  assert.equal(providerCalls.length, 0);
});

// C. + D. policy denial (missing authenticated user) prevents provider resolution/invocation.
test("execute: a missing authenticated user is rejected before any provider is resolved", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "x", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });
  const unauthenticatedContext = createRequestContext("request-unauth");

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: unauthenticatedContext }),
    PolicyAuthorizationDeniedError,
  );
  assert.equal(resolutionCalls.length, 0);
  assert.equal(providerCalls.length, 0);
});

// E. wrong risk classification is rejected before any provider is resolved.
test("execute: a risk classification other than informational-read-only is rejected before any provider is resolved", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "x", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"], riskClassification: "high-risk" }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    PolicyAuthorizationDeniedError,
  );
  assert.equal(resolutionCalls.length, 0);
  assert.equal(providerCalls.length, 0);
});

// F. + G. ineligible model / ineligible provider are rejected by the
// existing, unmodified ModelRouter eligibility filtering, before any
// provider is resolved.
test("execute: an ineligible model is rejected by ModelRouter before any provider is resolved", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "x", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: false, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    NoEligibleCandidateError,
  );
  assert.equal(resolutionCalls.length, 0);
  assert.equal(providerCalls.length, 0);
});

test("execute: an ineligible provider is rejected by ModelRouter before any provider is resolved", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "x", finishReason: "stop" }));
  const { port: providerResolutionPort, calls: resolutionCalls } = fakeProviderResolutionPort({ "ineligible-provider": provider });
  const { capabilityRegistry, modelRegistry, providerRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  providerRegistry.register({ providerId: "ineligible-provider", capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS, eligible: false });
  modelRegistry.register({ modelId: "model-b", providerId: "ineligible-provider", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-b"], context: CONTEXT }),
    NoEligibleCandidateError,
  );
  assert.equal(resolutionCalls.length, 0);
  assert.equal(providerCalls.length, 0);
});

// H. provider-instance resolution failure is typed and deterministic.
test("execute: a provider resolution failure (no AIProvider instance for the routed providerId) is typed and deterministic", async () => {
  const { port: providerResolutionPort } = fakeProviderResolutionPort({});
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    ProviderResolutionFailedError,
  );
});

// I. provider timeout/error propagates through the existing, real,
// unmodified adapter's normalized error model — exercised with a fake
// fetchImpl (the established test convention), never real network I/O.
test("execute: a provider timeout propagates through the existing adapter's typed error, unmodified", async () => {
  const config: OpenAiCompatibleProviderConfig = { endpoint: "http://localhost:8000/v1", apiKey: null, timeoutMs: 1000 };
  const adapter = new OpenAiCompatibleProviderAdapter(config, async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    throw abortError;
  });
  const { port: providerResolutionPort } = fakeProviderResolutionPort({ "openai-compatible": adapter });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    TimeoutError,
  );
});

// J. a malformed provider result is rejected by the existing, unmodified
// structural Output Validation.
test("execute: a malformed provider result is rejected by structural Output Validation", async () => {
  const { provider } = fakeProvider(async () => ({ text: "", finishReason: "stop" }));
  const { port: providerResolutionPort } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    OutputValidationRejectedError,
  );
});

// K. output Policy Validation rejection, after structural validation
// already succeeded.
test("execute: output Policy Validation denies when humanApprovalRequired is true, after structural validation already succeeded", async () => {
  const { provider } = fakeProvider(async () => ({ text: "interpreted", finishReason: "stop" }));
  const { port: providerResolutionPort } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"], humanApprovalRequired: true }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await assert.rejects(
    () => runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT }),
    OutputPolicyValidationDeniedError,
  );
});

// M. + N. the provider-facing payload contains exactly
// timezone/locale/availability and never id/userId/revision/provenance/
// createdAt/updatedAt.
test("execute: the provider-facing payload contains only timezone/locale/availability, and never id/userId/revision/provenance/createdAt/updatedAt", async () => {
  const { provider, calls: providerCalls } = fakeProvider(async () => ({ text: "interpreted", finishReason: "stop" }));
  const { port: providerResolutionPort } = fakeProviderResolutionPort({ "openai-compatible": provider });
  const { capabilityRegistry, modelRegistry, runtime } = setUp(
    { status: "resolved", context: { label: "personal-state", data: FULL_PERSONAL_STATE_DATA } },
    providerResolutionPort,
  );
  capabilityRegistry.register(eligibleCapability("personal-state.interpret", { requiredContext: ["personal-state"] }));
  modelRegistry.register({ modelId: "model-a", providerId: "openai-compatible", eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });

  await runtime.execute({ capabilityId: "personal-state.interpret", candidateModelIds: ["model-a"], context: CONTEXT });

  assert.equal(providerCalls.length, 1);
  const message = providerCalls[0]?.messages[0];
  assert.equal(message?.role, "user");
  const payload = JSON.parse(message!.content) as Record<string, unknown>;
  assert.deepEqual(Object.keys(payload).sort(), ["availability", "locale", "timezone"]);
  assert.equal(payload.timezone, FULL_PERSONAL_STATE_DATA.timezone);
  assert.equal(payload.locale, FULL_PERSONAL_STATE_DATA.locale);
  assert.equal(payload.availability, FULL_PERSONAL_STATE_DATA.availability);
  for (const forbidden of ["id", "userId", "revision", "provenance", "createdAt", "updatedAt"]) {
    assert.equal(Object.prototype.hasOwnProperty.call(payload, forbidden), false, `payload must not contain ${forbidden}`);
  }
});

// Direct unit coverage of minimizeContext() itself, independent of the
// full execute() pipeline.
test("minimizeContext narrows personal-state data to exactly {timezone, locale, availability}", () => {
  const minimized = minimizeContext("personal-state", FULL_PERSONAL_STATE_DATA);
  assert.deepEqual(minimized, { timezone: "UTC", locale: "en-US", availability: "available" });
});

test("minimizeContext leaves any other context label's data unchanged (pass-through) — no other context type is expanded or narrowed", () => {
  const data = { anything: "goes" };
  assert.deepEqual(minimizeContext("memory", data), data);
});

// P. + Q. no real network I/O and no provider credential/endpoint
// reading occurs anywhere in ai-runtime.ts.
test("ai-runtime.ts never performs real network I/O and never reads AI_PROVIDER_ENDPOINT, AI_PROVIDER_API_KEY, or process.env (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "runtime", "ai-runtime.ts"), "utf8");
  const forbidden = ["fetch(", "AI_PROVIDER_ENDPOINT", "AI_PROVIDER_API_KEY", "process.env", "OpenAiCompatibleProviderAdapter"];
  for (const symbol of forbidden) {
    assert.equal(source.includes(symbol), false, `ai-runtime.ts must not reference ${symbol}`);
  }
});

// R. + S. no production model/provider registration is introduced
// anywhere, and ai-runtime.module.ts (the production wiring file) is
// untouched by this increment — it still constructs AIRuntime with
// exactly three arguments.
test("ai-runtime.ts never registers a model or provider itself (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "runtime", "ai-runtime.ts"), "utf8");
  assert.equal(source.includes(".register("), false, "ai-runtime.ts must never call .register(");
});

test("ai-runtime.module.ts (production wiring) remains untouched by this increment — still constructs AIRuntime with exactly three arguments and registers no model/provider (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai-runtime", "ai-runtime.module.ts"), "utf8");
  assert.match(source, /new AIRuntime\(capabilityRegistry, modelRouter, contextResolutionPort\)/, "production wiring must still construct AIRuntime with exactly three arguments");
  assert.equal(source.includes("modelRegistry.register("), false, "production wiring must not register a model");
  assert.equal(source.includes("providerRegistry.register("), false, "production wiring must not register a provider");
  assert.equal(source.includes("ProviderResolutionPort"), false, "production wiring must not reference ProviderResolutionPort");
});
