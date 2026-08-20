import assert from "node:assert/strict";
import test from "node:test";
import { asResourceId } from "./resource.identity";
import { createResourceReference } from "./resource.reference";
import { ResourceResolver } from "./resource.resolver";

test("resolves a supported resource", async () => {
  const resource = { id: "workspace-1" };
  const resolver = new ResourceResolver({
    workspace: async () => resource,
  });

  const result = await resolver.resolve(
    createResourceReference("workspace", asResourceId("workspace-1")),
  );

  assert.deepEqual(result, { status: "resolved", resource });
});

test("returns not_found for a valid missing resource", async () => {
  const resolver = new ResourceResolver({
    workspace: async () => undefined,
  });

  const result = await resolver.resolve(
    createResourceReference("workspace", asResourceId("missing")),
  );

  assert.deepEqual(result, { status: "not_found" });
});

test("returns unsupported_resource_type without querying a strategy", async () => {
  let called = false;
  const resolver = new ResourceResolver({
    workspace: async () => {
      called = true;
      return undefined;
    },
  });

  const result = await resolver.resolve(
    createResourceReference("goal", asResourceId("goal-1")),
  );

  assert.deepEqual(result, {
    status: "unsupported_resource_type",
    resourceType: "goal",
  });
  assert.equal(called, false);
});

test("returns invalid_reference before invoking a strategy", async () => {
  let called = false;
  const resolver = new ResourceResolver({
    workspace: async () => {
      called = true;
      return undefined;
    },
  });

  const result = await resolver.resolve({
    resourceType: "workspace",
    resourceId: asResourceId(""),
  });

  assert.deepEqual(result, { status: "invalid_reference" });
  assert.equal(called, false);
});

test("translates infrastructure failures without exposing persistence errors", async () => {
  const resolver = new ResourceResolver({
    workspace: async () => {
      throw new Error("database connection details must not escape");
    },
  });

  const result = await resolver.resolve(
    createResourceReference("workspace", asResourceId("workspace-1")),
  );

  assert.deepEqual(result, {
    status: "resolution_failure",
    reason: "infrastructure",
  });
});
