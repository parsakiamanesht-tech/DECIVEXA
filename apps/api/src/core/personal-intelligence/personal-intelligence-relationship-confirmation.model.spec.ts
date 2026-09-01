import assert from "node:assert/strict";
import test from "node:test";
import { deriveEffectiveConfirmationState } from "./personal-intelligence-relationship-confirmation.model";
import type { PersonalIntelligenceRelationshipConfirmationEvent } from "./personal-intelligence-relationship-confirmation.model";

function makeEvent(
  overrides: Partial<PersonalIntelligenceRelationshipConfirmationEvent> = {},
): PersonalIntelligenceRelationshipConfirmationEvent {
  return {
    id: "event-1",
    relationshipId: "relationship-1",
    userId: "user-a",
    sequence: 1,
    action: "confirmed",
    actor: "user",
    occurredAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

// Contract §10.3, mental test case A: a Relationship created with
// confirmationState = 'confirmed' and an empty event history - the
// Relationship's own creation-time value is the fallback effective state.
test("deriveEffectiveConfirmationState falls back to the Relationship's creation-time confirmationState for an empty history", () => {
  assert.equal(deriveEffectiveConfirmationState([], "confirmed"), "confirmed");
  assert.equal(deriveEffectiveConfirmationState([], "pending"), "pending");
  assert.equal(deriveEffectiveConfirmationState([], "rejected"), "rejected");
});

test("deriveEffectiveConfirmationState returns the single event's action once one event exists", () => {
  const events = [makeEvent({ sequence: 1, action: "confirmed" })];
  assert.equal(deriveEffectiveConfirmationState(events, "pending"), "confirmed");
});

// Contract §10.3: once any event exists, the event history is the sole
// source of the effective value - the Relationship's original
// confirmationState ('pending' here) is no longer consulted.
test("deriveEffectiveConfirmationState ignores the creation-time fallback once any event exists", () => {
  const events = [makeEvent({ sequence: 1, action: "rejected" })];
  assert.equal(deriveEffectiveConfirmationState(events, "pending"), "rejected");
});

// Contract §10.3, mental test case B: confirmed -> rejected -> confirmed.
test("deriveEffectiveConfirmationState resolves confirmed -> rejected -> confirmed to confirmed", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "rejected" }),
    makeEvent({ id: "event-3", sequence: 3, action: "confirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmationState(events, "pending"), "confirmed");
});

// Contract §10.3, mental test case C: pending -> confirmed -> rejected -> confirmed.
test("deriveEffectiveConfirmationState resolves pending -> confirmed -> rejected -> confirmed to confirmed", () => {
  const events = [
    makeEvent({ sequence: 1, action: "pending" }),
    makeEvent({ id: "event-2", sequence: 2, action: "confirmed" }),
    makeEvent({ id: "event-3", sequence: 3, action: "rejected" }),
    makeEvent({ id: "event-4", sequence: 4, action: "confirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmationState(events, "pending"), "confirmed");
});

test("deriveEffectiveConfirmationState is determined by sequence, not array position", () => {
  const first = makeEvent({ sequence: 1, action: "confirmed" });
  const second = makeEvent({ id: "event-2", sequence: 2, action: "rejected" });

  assert.equal(deriveEffectiveConfirmationState([first, second], "pending"), "rejected");
  assert.equal(deriveEffectiveConfirmationState([second, first], "pending"), "rejected");
});

test("deriveEffectiveConfirmationState never mutates the input array", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "rejected" }),
  ];
  const snapshot = events.map((e) => ({ ...e }));

  deriveEffectiveConfirmationState(events, "pending");

  assert.deepEqual(events, snapshot);
});

// Contract §9.3: repeated/identical consecutive actions are allowed and
// harmless - the effective state is unaffected by re-recording the same
// action.
test("deriveEffectiveConfirmationState treats a redundant repeated 'confirmed' event as a harmless no-op", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "confirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmationState(events, "pending"), "confirmed");
});

// A confirmation event's relationshipId identity is not consulted by
// this pure function - the derivation trusts its caller to have already
// scoped `events` to exactly one Relationship's history, mirroring
// deriveEffectiveConfirmation's own documented claimVersionId behavior.
test("deriveEffectiveConfirmationState documents that it does not filter by relationshipId - callers must pre-scope events", () => {
  const events = [
    makeEvent({ relationshipId: "relationship-1", sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", relationshipId: "relationship-2", sequence: 2, action: "rejected" }),
  ];
  assert.equal(deriveEffectiveConfirmationState(events, "pending"), "rejected");
});

test("Confirmation Event: actor is representable only as 'user' in this Increment (Contract §10.2, FD-4)", () => {
  const event = makeEvent({ actor: "user" });
  assert.equal(event.actor, "user");
});
