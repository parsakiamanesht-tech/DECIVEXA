import assert from "node:assert/strict";
import test from "node:test";
import { deriveEffectiveStatus } from "./personal-intelligence-inference.model";
import type { PersonalIntelligenceInferenceLifecycleEvent } from "./personal-intelligence-inference.model";

function makeEvent(
  overrides: Partial<PersonalIntelligenceInferenceLifecycleEvent> = {},
): PersonalIntelligenceInferenceLifecycleEvent {
  return {
    id: "event-1",
    inferenceId: "inference-1",
    userId: "user-a",
    sequence: 1,
    fromStatus: null,
    toStatus: "proposed",
    transitionedAt: new Date("2026-01-01T00:00:00Z"),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

test("deriveEffectiveStatus returns null for an empty history (data-integrity signal, never a fabricated status)", () => {
  assert.equal(deriveEffectiveStatus([]), null);
});

test("deriveEffectiveStatus returns 'proposed' for a fresh inference with only the initial entry", () => {
  const events = [makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" })];
  assert.equal(deriveEffectiveStatus(events), "proposed");
});

test("deriveEffectiveStatus returns the toStatus of the highest-sequence entry after one transition", () => {
  const events = [
    makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" }),
    makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: "confirmed" }),
  ];
  assert.equal(deriveEffectiveStatus(events), "confirmed");
});

test("deriveEffectiveStatus is independent of array order - it is determined by sequence, not position", () => {
  const initial = makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" });
  const transition = makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: "disputed" });

  assert.equal(deriveEffectiveStatus([initial, transition]), "disputed");
  assert.equal(deriveEffectiveStatus([transition, initial]), "disputed");
});

test("deriveEffectiveStatus never mutates the input array", () => {
  const events = [
    makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" }),
    makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: "rejected" }),
  ];
  const snapshot = events.map((e) => ({ ...e }));

  deriveEffectiveStatus(events);

  assert.deepEqual(events, snapshot);
});

for (const terminal of ["confirmed", "rejected", "disputed", "stale"] as const) {
  test(`deriveEffectiveStatus reports '${terminal}' correctly as the effective status once reached`, () => {
    const events = [
      makeEvent({ sequence: 1, fromStatus: null, toStatus: "proposed" }),
      makeEvent({ id: "event-2", sequence: 2, fromStatus: "proposed", toStatus: terminal }),
    ];
    assert.equal(deriveEffectiveStatus(events), terminal);
  });
}
