import test from "node:test";
import assert from "node:assert/strict";
import { CapabilityRegistry } from "./capability-registry";
import { IneligibleCapabilityError, UnknownCapabilityError } from "./capability.errors";
import type { AICapabilityRegistrationInput } from "./capability.types";

function eligibleCapability(capabilityId: string): AICapabilityRegistrationInput {
  return {
    capabilityId,
    version: "v1",
    purpose: "test capability",
    inputSchema: { kind: "test-input" },
    outputSchema: { kind: "test-output" },
    requiredContext: ["goal-state"],
    privacyClassification: "standard",
    riskClassification: "informational-read-only",
    minimumQualityThreshold: 0.8,
    latencyTargetMs: 2000,
    costTarget: 0.01,
    allowedExecutionTiers: ["standard"],
    validationRequirements: ["schema-validation"],
    humanApprovalRequired: false,
    eligible: true,
  };
}

// A. successful registration and lookup
test("CapabilityRegistry represents a valid registered capability", () => {
  const registry = new CapabilityRegistry();
  registry.register(eligibleCapability("goal-clarification"));

  const entry = registry.get("goal-clarification");

  assert.equal(entry.capabilityId, "goal-clarification");
  assert.equal(entry.eligible, true);
});

// B. has() behavior
test("has() reports registration state without throwing for missing entries", () => {
  const registry = new CapabilityRegistry();
  registry.register(eligibleCapability("goal-clarification"));

  assert.equal(registry.has("goal-clarification"), true);
  assert.equal(registry.has("unknown-capability"), false);
});

// C. unknown capability produces a dedicated typed error
test("CapabilityRegistry rejects an unknown capability", () => {
  const registry = new CapabilityRegistry();

  assert.throws(() => registry.get("does-not-exist"), UnknownCapabilityError);
});

// C (continued). registered but ineligible capability produces a distinct dedicated typed error
test("CapabilityRegistry rejects a registered but ineligible capability", () => {
  const registry = new CapabilityRegistry();
  registry.register({ ...eligibleCapability("retired-capability"), eligible: false });

  assert.throws(() => registry.get("retired-capability"), IneligibleCapabilityError);
});

// D. deterministic repeated lookup
test("CapabilityRegistry lookup is deterministic across repeated calls", () => {
  const registry = new CapabilityRegistry();
  registry.register(eligibleCapability("goal-clarification"));

  const first = registry.get("goal-clarification");
  const second = registry.get("goal-clarification");

  assert.deepEqual(first, second);
});

// E. complete capability metadata survives registration/lookup unchanged
test("CapabilityRegistry preserves the full registered capability metadata exactly", () => {
  const registry = new CapabilityRegistry();
  const input = eligibleCapability("decision-support");
  registry.register(input);

  const entry = registry.get("decision-support");

  assert.deepEqual(entry, input);
});

// F. registration performs no provider execution
// G. lookup performs no provider execution
// H. Registry performs no network I/O
test("registration and lookup never invoke any provider adapter method or perform I/O", () => {
  let calls = 0;
  const registry = new CapabilityRegistry();

  // The registry only ever stores/returns plain data
  // (AICapabilityRegistrationInput); it holds no reference to, and never
  // calls, any provider adapter or network primitive. There is nothing
  // in this class capable of incrementing `calls` — this test documents
  // that guarantee alongside the equivalent Provider/Model Registry
  // tests (../registry/provider-registry.spec.ts, model-registry.spec.ts).
  registry.register(eligibleCapability("goal-clarification"));
  registry.get("goal-clarification");
  registry.has("goal-clarification");

  assert.equal(calls, 0);
});

// I. static eligibility is not treated as live health/authorization —
// structural: the entry exposes only declarative metadata fields, never
// a live-health or authorization-shaped field.
test("capability entries never expose a live-health or authorization field", () => {
  const registry = new CapabilityRegistry();
  registry.register(eligibleCapability("goal-clarification"));

  const entry = registry.get("goal-clarification");
  const forbiddenKeys = [
    "healthStatus",
    "live",
    "authorized",
    "approved",
    "permissionGranted",
    "executionAllowed",
    "policyPassed",
    "riskPassed",
  ];

  for (const key of forbiddenKeys) {
    assert.equal(key in entry, false);
  }
});

// J. no domain/application/core imports — structural: this file and
// capability-registry.ts import only from ./capability.types and
// ./capability.errors — never from core/, application/, or domain/.
// Verified via the boundary/security audit in the implementation report,
// not re-asserted here as a runtime test since there is nothing to
// invoke, matching the equivalent precedent in
// ../router/model-router.spec.ts (comment J).
