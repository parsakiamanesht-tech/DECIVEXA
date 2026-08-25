import test from "node:test";
import assert from "node:assert/strict";
import { UnauthorizedException } from "@nestjs/common";
import { AIRuntimeController } from "./ai-runtime.controller";
import { AIRuntime } from "./ai-runtime";
import { ContextResolutionFailedError } from "./runtime.errors";
import { NoEligibleCandidateError } from "../router/router.errors";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "../capability/personal-state-interpret.capability";
import { createRequestContext } from "../../../context/request-context";

const AUTHENTICATED_CONTEXT = createRequestContext("request-1", "user-1");

// A fake AIRuntime that deliberately has no `execute` method at all -
// if the controller ever called `.execute(...)`, this would throw
// "this.aiRuntime.execute is not a function", proving by construction
// that the route-only path never reaches it (Founder Authorization
// §12.F "the route-only path does not invoke execute()").
function fakeAIRuntime(routeImpl: (request: unknown) => Promise<unknown>) {
  const calls: unknown[] = [];
  const fake = {
    route: async (request: unknown) => {
      calls.push(request);
      return routeImpl(request);
    },
  };
  return { fake: fake as unknown as AIRuntime, calls };
}

test("routeInterpret requires authentication (Founder Authorization §12.E)", async () => {
  const { fake } = fakeAIRuntime(async () => {
    throw new Error("route() must never be called for an unauthenticated request");
  });
  const controller = new AIRuntimeController(fake);

  await assert.rejects(() => controller.routeInterpret({}), UnauthorizedException);
  await assert.rejects(() => controller.routeInterpret({ context: createRequestContext("request-2") }), UnauthorizedException);
});

test("routeInterpret calls AIRuntime.route() with exactly the Founder-authorized capability id and the caller's RequestContext, and returns an honest infrastructure/routing result", async () => {
  const routingResult = { modelId: "m1", providerId: "p1", capabilities: {}, limits: {} };
  const { fake, calls } = fakeAIRuntime(async () => routingResult);
  const controller = new AIRuntimeController(fake);

  const result = await controller.routeInterpret({ context: AUTHENTICATED_CONTEXT });

  assert.equal(calls.length, 1);
  assert.equal((calls[0] as { capabilityId: string }).capabilityId, PERSONAL_STATE_INTERPRET_CAPABILITY.capabilityId);
  assert.deepEqual((calls[0] as { context: unknown }).context, AUTHENTICATED_CONTEXT);
  assert.ok(Array.isArray((calls[0] as { candidateModelIds: unknown }).candidateModelIds));

  assert.equal(result.capabilityId, "personal-state.interpret");
  assert.equal(result.stage, "routed");
  assert.deepEqual(result.routing, routingResult);
  // Governance label (Founder Authorization §15): the response must not
  // read as product-facing AI output.
  assert.match(result.note, /no ai output was generated/i);
});

test("routeInterpret maps NoEligibleCandidateError (no model registered) to a 503, never fabricating a routing result", async () => {
  const { fake } = fakeAIRuntime(async () => {
    throw new NoEligibleCandidateError("no eligible candidate");
  });
  const controller = new AIRuntimeController(fake);

  await assert.rejects(
    () => controller.routeInterpret({ context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 503);
      return true;
    },
  );
});

test("routeInterpret maps ContextResolutionFailedError to a 400, never fabricating a routing result", async () => {
  const { fake } = fakeAIRuntime(async () => {
    throw new ContextResolutionFailedError("context resolution failed");
  });
  const controller = new AIRuntimeController(fake);

  await assert.rejects(
    () => controller.routeInterpret({ context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
});

// Structural (shape-only) check, mirroring the convention already
// established by ai-runtime.spec.ts and foundation/resource-persistence-
// boundaries.spec.ts: read the source directly and assert the forbidden
// symbols never appear as an import specifier or a method call.
test("ai-runtime.controller.ts never references execute(), a provider adapter, or the Context Resolution implementation directly (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "runtime", "ai-runtime.controller.ts"), "utf8");

  // Substring-match only the actual call pattern, not prose - the file's
  // own explanatory comments legitimately discuss "AIRuntime.execute()"
  // by name (mirroring the false-positive lesson already documented in
  // ai-context.service.spec.ts from an earlier increment in this
  // session).
  assert.equal(source.includes("aiRuntime.execute("), false, "ai-runtime.controller.ts must never call aiRuntime.execute(");
  const importLines = source.match(/^import .*$/gm) ?? [];
  const forbiddenSpecifiers = ["OpenAiCompatibleProviderAdapter", "ai-provider", "ContextResolutionAdapter", "AIContextService", "application/ai-context"];
  for (const line of importLines) {
    for (const forbidden of forbiddenSpecifiers) {
      assert.equal(line.includes(forbidden), false, `ai-runtime.controller.ts must not import ${forbidden}: "${line}"`);
    }
  }
});
