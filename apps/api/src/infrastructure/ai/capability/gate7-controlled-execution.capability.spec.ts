import test from "node:test";
import assert from "node:assert/strict";
import { GATE7_CONTROLLED_EXECUTION_CAPABILITY } from "./gate7-controlled-execution.capability";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "./personal-state-interpret.capability";
import { CapabilityRegistry } from "./capability-registry";

test("GATE7_CONTROLLED_EXECUTION_CAPABILITY has its own, distinct capability id from PERSONAL_STATE_INTERPRET_CAPABILITY", () => {
  assert.equal(GATE7_CONTROLLED_EXECUTION_CAPABILITY.capabilityId, "gate7.controlled-execution");
  assert.notEqual(GATE7_CONTROLLED_EXECUTION_CAPABILITY.capabilityId, PERSONAL_STATE_INTERPRET_CAPABILITY.capabilityId);
});

test("GATE7_CONTROLLED_EXECUTION_CAPABILITY declares its own risk/privacy classification, eligible, and no human approval requirement", () => {
  assert.equal(GATE7_CONTROLLED_EXECUTION_CAPABILITY.riskClassification, "informational-read-only");
  assert.equal(GATE7_CONTROLLED_EXECUTION_CAPABILITY.privacyClassification, "standard");
  assert.equal(GATE7_CONTROLLED_EXECUTION_CAPABILITY.eligible, true);
  assert.equal(GATE7_CONTROLLED_EXECUTION_CAPABILITY.humanApprovalRequired, false);
});

test("GATE7_CONTROLLED_EXECUTION_CAPABILITY's purpose honestly describes controlled execution intent, not a broad product-facing capability", () => {
  assert.match(GATE7_CONTROLLED_EXECUTION_CAPABILITY.purpose, /controlled/i);
  assert.match(GATE7_CONTROLLED_EXECUTION_CAPABILITY.purpose, /not a broad product-facing/i);
});

test("PERSONAL_STATE_INTERPRET_CAPABILITY remains completely unmodified (FD-1: not revised)", () => {
  assert.equal(PERSONAL_STATE_INTERPRET_CAPABILITY.capabilityId, "personal-state.interpret");
  assert.match(PERSONAL_STATE_INTERPRET_CAPABILITY.purpose, /not a product-facing ai capability/i);
});

test("CapabilityRegistry registers and returns GATE7_CONTROLLED_EXECUTION_CAPABILITY correctly, isolated from other capabilities", () => {
  const registry = new CapabilityRegistry();
  registry.register(PERSONAL_STATE_INTERPRET_CAPABILITY);
  registry.register(GATE7_CONTROLLED_EXECUTION_CAPABILITY);

  const gate7Entry = registry.get("gate7.controlled-execution");
  assert.deepEqual(gate7Entry, GATE7_CONTROLLED_EXECUTION_CAPABILITY);

  const personalStateEntry = registry.get("personal-state.interpret");
  assert.deepEqual(personalStateEntry, PERSONAL_STATE_INTERPRET_CAPABILITY);
});

test("an unrelated/unknown capability id is still rejected after both capabilities are registered", () => {
  const registry = new CapabilityRegistry();
  registry.register(PERSONAL_STATE_INTERPRET_CAPABILITY);
  registry.register(GATE7_CONTROLLED_EXECUTION_CAPABILITY);

  assert.throws(() => registry.get("unrelated.capability"));
});
