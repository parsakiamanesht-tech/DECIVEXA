import assert from "node:assert/strict";
import test from "node:test";
import { deriveEffectiveConfirmation } from "./personal-intelligence-claim-confirmation.model";
import type { PersonalIntelligenceClaimConfirmationEvent } from "./personal-intelligence-claim-confirmation.model";

function makeEvent(
  overrides: Partial<PersonalIntelligenceClaimConfirmationEvent> = {},
): PersonalIntelligenceClaimConfirmationEvent {
  return {
    id: "event-1",
    claimId: "claim-1",
    claimVersionId: "claim-version-1",
    userId: "user-a",
    sequence: 1,
    action: "confirmed",
    occurredAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

test("deriveEffectiveConfirmation returns false for an empty history (never confirmed by default)", () => {
  assert.equal(deriveEffectiveConfirmation([]), false);
});

test("deriveEffectiveConfirmation returns true after a single 'confirmed' event", () => {
  const events = [makeEvent({ sequence: 1, action: "confirmed" })];
  assert.equal(deriveEffectiveConfirmation(events), true);
});

test("deriveEffectiveConfirmation returns false after 'confirmed' is followed by 'unconfirmed'", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "unconfirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmation(events), false);
});

test("deriveEffectiveConfirmation returns true again after 'unconfirmed' is followed by a re-'confirmed'", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "unconfirmed" }),
    makeEvent({ id: "event-3", sequence: 3, action: "confirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmation(events), true);
});

test("deriveEffectiveConfirmation is determined by sequence, not array position", () => {
  const first = makeEvent({ sequence: 1, action: "confirmed" });
  const second = makeEvent({ id: "event-2", sequence: 2, action: "unconfirmed" });

  assert.equal(deriveEffectiveConfirmation([first, second]), false);
  assert.equal(deriveEffectiveConfirmation([second, first]), false);
});

test("deriveEffectiveConfirmation never mutates the input array", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "unconfirmed" }),
  ];
  const snapshot = events.map((e) => ({ ...e }));

  deriveEffectiveConfirmation(events);

  assert.deepEqual(events, snapshot);
});

test("deriveEffectiveConfirmation treats a redundant repeated 'confirmed' event as a harmless no-op", () => {
  const events = [
    makeEvent({ sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", sequence: 2, action: "confirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmation(events), true);
});

// A confirmation event's claimVersionId identity is not consulted by this
// pure function - the derivation trusts its caller to have already scoped
// `events` to exactly one ClaimVersion's history (Contract §3.3.1: a
// confirmation of one ClaimVersion must never silently carry forward to a
// later version). This test documents that contract explicitly: events
// naming two different claimVersionIds are still combined by sequence
// alone here, because scoping is the caller's responsibility, not this
// function's.
test("deriveEffectiveConfirmation documents that it does not filter by claimVersionId - callers must pre-scope events", () => {
  const events = [
    makeEvent({ claimVersionId: "claim-version-1", sequence: 1, action: "confirmed" }),
    makeEvent({ id: "event-2", claimVersionId: "claim-version-2", sequence: 2, action: "unconfirmed" }),
  ];
  assert.equal(deriveEffectiveConfirmation(events), false);
});
