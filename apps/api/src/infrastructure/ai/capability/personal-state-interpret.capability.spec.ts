import test from "node:test";
import assert from "node:assert/strict";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "./personal-state-interpret.capability";

// Acceptance criteria A/B (Founder Authorization §12): capability
// registration shape and requiredContext exactness.

test("PERSONAL_STATE_INTERPRET_CAPABILITY has the exact Founder-authorized identity", () => {
  assert.equal(PERSONAL_STATE_INTERPRET_CAPABILITY.capabilityId, "personal-state.interpret");
  assert.equal(PERSONAL_STATE_INTERPRET_CAPABILITY.version, "1.0");
  assert.equal(PERSONAL_STATE_INTERPRET_CAPABILITY.eligible, true);
});

test("PERSONAL_STATE_INTERPRET_CAPABILITY.requiredContext is exactly [\"personal-state\"]", () => {
  assert.deepEqual(PERSONAL_STATE_INTERPRET_CAPABILITY.requiredContext, ["personal-state"]);
});

test("PERSONAL_STATE_INTERPRET_CAPABILITY's purpose text does not claim to be a product-facing AI capability (governance label, Founder Authorization §15)", () => {
  assert.match(PERSONAL_STATE_INTERPRET_CAPABILITY.purpose, /infrastructure|wiring|validation/i);
  assert.doesNotMatch(PERSONAL_STATE_INTERPRET_CAPABILITY.purpose, /first ai capability/i);
});
