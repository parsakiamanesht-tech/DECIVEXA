import test from "node:test";
import assert from "node:assert/strict";
import { KeyedProviderResolver } from "./provider-instance-resolver";
import type { AIProvider } from "../provider/ai-provider.interface";
import type {
  GenerateRequest,
  GenerateResult,
  ProviderCapabilities,
  ProviderHealth,
  ProviderLimits,
} from "../provider/ai-provider.types";

// Hand-written fake AIProvider — never a concrete adapter, never real
// network I/O, per this session's established test-grade-provider
// convention. Records nothing beyond what these tests need: identity
// verification and "was generate() ever called" (it must never be).
function fakeProvider(): AIProvider {
  let generateCalls = 0;
  return {
    async generate(_request: GenerateRequest): Promise<GenerateResult> {
      generateCalls += 1;
      return { text: "unused", finishReason: "stop" };
    },
    async healthCheck(): Promise<ProviderHealth> {
      return { available: true, latencyMs: null, errorSignal: null };
    },
    getCapabilities(): ProviderCapabilities {
      return { streaming: false, structuredOutput: false, embeddings: false, contextWindow: null };
    },
    getLimits(): ProviderLimits {
      return { maxOutputTokens: null, maxInputTokens: null, requestsPerMinute: null };
    },
    // Exposed only for this spec's own assertions (test 7 below) — not
    // part of the AIProvider interface.
    get _generateCallCount() {
      return generateCalls;
    },
  } as AIProvider & { readonly _generateCallCount: number };
}

test("KeyedProviderResolver resolves a mapped providerId", async () => {
  const provider = fakeProvider();
  const resolver = new KeyedProviderResolver(new Map([["provider-a", provider]]));

  const resolved = await resolver.resolve("provider-a");

  assert.ok(resolved);
});

test("KeyedProviderResolver returns the exact same AIProvider reference supplied in the map", async () => {
  const provider = fakeProvider();
  const resolver = new KeyedProviderResolver(new Map([["provider-a", provider]]));

  const resolved = await resolver.resolve("provider-a");

  assert.equal(resolved, provider);
});

test("KeyedProviderResolver returns undefined for an unmapped providerId", async () => {
  const resolver = new KeyedProviderResolver(new Map());

  const resolved = await resolver.resolve("unmapped-provider");

  assert.equal(resolved, undefined);
});

test("KeyedProviderResolver does not throw for an unmapped providerId", async () => {
  const resolver = new KeyedProviderResolver(new Map());

  await assert.doesNotReject(() => resolver.resolve("unmapped-provider"));
});

test("KeyedProviderResolver resolves multiple provider IDs independently from the same map", async () => {
  const providerA = fakeProvider();
  const providerB = fakeProvider();
  const resolver = new KeyedProviderResolver(
    new Map([
      ["provider-a", providerA],
      ["provider-b", providerB],
    ]),
  );

  const resolvedA = await resolver.resolve("provider-a");
  const resolvedB = await resolver.resolve("provider-b");
  const resolvedMissing = await resolver.resolve("provider-c");

  assert.equal(resolvedA, providerA);
  assert.equal(resolvedB, providerB);
  assert.equal(resolvedMissing, undefined);
});

test("KeyedProviderResolver never invokes AIProvider.generate() (structural: pure lookup, no network operation)", async () => {
  const provider = fakeProvider() as AIProvider & { readonly _generateCallCount: number };
  const resolver = new KeyedProviderResolver(new Map([["provider-a", provider]]));

  await resolver.resolve("provider-a");
  await resolver.resolve("unmapped-provider");

  assert.equal(provider._generateCallCount, 0);
});

// Structural: this narrow boundary must never reference a concrete
// provider adapter, a registry, application/, core/,
// infrastructure/persistence, or any NestJS DI decorator/import — Gate 1
// authorizes pure keyed lookup only, no production wiring.
test("provider-instance-resolver.ts imports nothing forbidden and introduces no DI wiring (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(
    join(process.cwd(), "src", "infrastructure", "ai", "runtime", "provider-instance-resolver.ts"),
    "utf8",
  );
  const importLines = source.match(/^import .*$/gm) ?? [];
  const forbidden = [
    "application/",
    "core/",
    "infrastructure/persistence",
    "ModelRegistry",
    "ProviderRegistry",
    "registry.types",
    "OpenAiCompatibleProviderAdapter",
    "@nestjs",
  ];
  for (const line of importLines) {
    for (const symbol of forbidden) {
      assert.equal(line.includes(symbol), false, `provider-instance-resolver.ts must not import ${symbol}: "${line}"`);
    }
  }
  assert.equal(source.includes("@Injectable"), false, "provider-instance-resolver.ts must not be a NestJS DI provider in this gate");
  // The resolver's own code (never its documentation comments) must
  // never import or throw ProviderResolutionFailedError — that
  // conversion remains AIRuntime.execute()'s responsibility.
  assert.equal(source.includes("import") && source.includes("ProviderResolutionFailedError") && importLines.some((line) => line.includes("ProviderResolutionFailedError")), false, "provider-instance-resolver.ts must not import ProviderResolutionFailedError");
  assert.equal(source.includes("throw new ProviderResolutionFailedError"), false, "provider-instance-resolver.ts must never throw ProviderResolutionFailedError itself");
  assert.equal(source.includes("fetch("), false, "provider-instance-resolver.ts must perform no network operation");
});
