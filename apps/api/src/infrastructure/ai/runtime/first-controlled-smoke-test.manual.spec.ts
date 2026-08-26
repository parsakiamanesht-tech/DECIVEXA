import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FirstControlledSmokeTestHarness, Gate7SmokeTestAlreadyInvokedError } from "./first-controlled-smoke-test.manual";
import { CapabilityRegistry } from "../capability/capability-registry";
import { GATE7_CONTROLLED_EXECUTION_CAPABILITY } from "../capability/gate7-controlled-execution.capability";
import { GATE7_MODEL_ID, GATE7_PROVIDER_ID } from "../gate7/gate7-identifiers";
import { ModelRegistry } from "../registry/model-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { ModelRouter } from "../router/model-router";
import { InMemoryGate7ExecutionAuditSink } from "../observability/execution-audit";
import type { ContextResolutionPort } from "./context-resolution.port";
import type { ProviderResolutionPort } from "./provider-resolution.port";
import type { AIProvider } from "../provider/ai-provider.interface";
import { createRequestContext } from "../../../context/request-context";

const BASE_CAPABILITIES = { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
const BASE_LIMITS = { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };
const CONTEXT = createRequestContext("smoke-test-1", "user-1");

function fakeContextResolutionPort(): ContextResolutionPort {
  return {
    resolve: async () => ({
      status: "resolved",
      context: { label: "personal-state", data: { timezone: "UTC", locale: "en-US", availability: "available" } },
    }),
  };
}

function fakeProviderResolutionPort(provider: AIProvider): ProviderResolutionPort {
  return { resolve: async (providerId: string) => (providerId === GATE7_PROVIDER_ID ? provider : undefined) };
}

function fakeProvider(): AIProvider {
  return {
    generate: async () => ({ text: "fake-controlled-execution-output", finishReason: "stop" }),
    healthCheck: async () => ({ available: true, latencyMs: 0, errorSignal: null }),
    getCapabilities: () => BASE_CAPABILITIES,
    getLimits: () => BASE_LIMITS,
  };
}

function setUp(provider: AIProvider = fakeProvider()) {
  const capabilityRegistry = new CapabilityRegistry();
  capabilityRegistry.register(GATE7_CONTROLLED_EXECUTION_CAPABILITY);

  const modelRegistry = new ModelRegistry();
  const providerRegistry = new ProviderRegistry();
  providerRegistry.register({ providerId: GATE7_PROVIDER_ID, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS, eligible: true });
  modelRegistry.register({ modelId: GATE7_MODEL_ID, providerId: GATE7_PROVIDER_ID, eligible: true, capabilities: BASE_CAPABILITIES, limits: BASE_LIMITS });
  const modelRouter = new ModelRouter(modelRegistry, providerRegistry);

  const auditSink = new InMemoryGate7ExecutionAuditSink();

  const harness = new FirstControlledSmokeTestHarness({
    capabilityRegistry,
    modelRouter,
    contextResolutionPort: fakeContextResolutionPort(),
    providerResolutionPort: fakeProviderResolutionPort(provider),
    auditSink,
    runtimeVersion: "test-runtime-1",
  });

  return { harness, auditSink };
}

test("FirstControlledSmokeTestHarness.runOnce() completes successfully against fakes only, and records exactly one audit entry", async () => {
  const { harness, auditSink } = setUp();

  await harness.runOnce(CONTEXT);

  const entries = auditSink.list();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].executionOutcome, "success");
  assert.equal(entries[0].capabilityId, "gate7.controlled-execution");
  assert.equal(entries[0].providerId, GATE7_PROVIDER_ID);
  assert.equal(entries[0].modelId, GATE7_MODEL_ID);
});

test("FirstControlledSmokeTestHarness.runOnce() enforces single invocation: a second call always throws, even after a successful first call", async () => {
  const { harness } = setUp();

  await harness.runOnce(CONTEXT);

  await assert.rejects(() => harness.runOnce(CONTEXT), Gate7SmokeTestAlreadyInvokedError);
});

test("FirstControlledSmokeTestHarness.runOnce() still records exactly one audit entry, marked failure, when the underlying execution throws, and single-invocation is still enforced", async () => {
  const failingProvider: AIProvider = {
    ...fakeProvider(),
    generate: async () => {
      throw new Error("simulated provider failure - fake only, no real network call");
    },
  };
  const { harness, auditSink } = setUp(failingProvider);

  await assert.rejects(() => harness.runOnce(CONTEXT));

  const entries = auditSink.list();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].executionOutcome, "failure");

  await assert.rejects(() => harness.runOnce(CONTEXT), Gate7SmokeTestAlreadyInvokedError);
});

test("the harness never invokes a real network call - only the injected fake provider/context/resolution ports are ever touched", async () => {
  let realFetchCalled = false;
  const originalFetch = globalThis.fetch;
  // Test-only instrumentation of the global fetch, restored in finally below.
  globalThis.fetch = async (...args: unknown[]) => {
    realFetchCalled = true;
    return originalFetch(...(args as Parameters<typeof fetch>));
  };

  try {
    const { harness } = setUp();
    await harness.runOnce(CONTEXT);
    assert.equal(realFetchCalled, false, "no real network call must occur while running the harness against fakes");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("first-controlled-smoke-test.manual.ts is not imported by app.module.ts or ai-runtime.module.ts (structural: no accidental production wiring)", async () => {
  const appModuleSource = await readFile(join(process.cwd(), "src", "app.module.ts"), "utf8");
  const aiRuntimeModuleSource = await readFile(join(process.cwd(), "src", "infrastructure", "ai-runtime", "ai-runtime.module.ts"), "utf8");

  assert.equal(appModuleSource.includes("first-controlled-smoke-test"), false, "app.module.ts must never import the temporary Gate-7 harness");
  assert.equal(aiRuntimeModuleSource.includes("first-controlled-smoke-test"), false, "ai-runtime.module.ts must never import the temporary Gate-7 harness");
});

test("ai-runtime.controller.ts does not import or reference the temporary Gate-7 harness (no HTTP exposure)", async () => {
  const controllerSource = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "runtime", "ai-runtime.controller.ts"), "utf8");
  assert.equal(controllerSource.includes("first-controlled-smoke-test"), false);
  assert.equal(controllerSource.includes("FirstControlledSmokeTestHarness"), false);
});
