import test from "node:test";
import assert from "node:assert/strict";
import { PersonalIntelligenceClaimConfirmationUseCase } from "./personal-intelligence-claim-confirmation.use-case";
import type { PersonalIntelligenceClaimRepository } from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import type { PersonalIntelligenceClaimConfirmationRepository } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.repository";
import type { PersonalIntelligenceClaimVersion } from "../../core/personal-intelligence/personal-intelligence-claim.model";
import type { PersonalIntelligenceClaimConfirmationEvent } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.model";

// C3 Claim Confirm/Unconfirm (Founder Implementation Authorization,
// reconciling docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-
// TAXONOMY-IMPLEMENTATION-INCREMENT-CONTRACT.md §3.3). Exercises
// PersonalIntelligenceClaimConfirmationUseCase against fake repositories
// only - neither underlying repository is modified or re-tested here;
// that coverage already exists (personal-intelligence-claim-confirmation
// .repository.unique-violation.spec.ts, .repository.runtime.spec.ts).

function claimVersion(overrides: Partial<PersonalIntelligenceClaimVersion> = {}): PersonalIntelligenceClaimVersion {
  return {
    id: "version-row-1",
    claimId: "claim-1",
    version: 1,
    userId: "user-1",
    valueKind: "text",
    valueText: "Europe/Paris",
    provenance: "declared",
    confidence: 1,
    lifecycle: "active",
    evidenceVersionId: null,
    inferenceId: null,
    evidenceLinkageState: "self_reported_no_evidence_required",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date("2026-01-01T00:00:00.000Z"),
    acceptedAt: new Date("2026-01-01T00:00:00.000Z"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function confirmationEvent(
  overrides: Partial<PersonalIntelligenceClaimConfirmationEvent> = {},
): PersonalIntelligenceClaimConfirmationEvent {
  return {
    id: "event-1",
    claimId: "claim-1",
    claimVersionId: "version-row-1",
    userId: "user-1",
    sequence: 1,
    action: "confirmed",
    occurredAt: new Date("2026-01-01T00:00:00.000Z"),
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

// C4 Claim Correction (docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-
// IMPLEMENTATION-INCREMENT-CONTRACT.md §10): findCurrentClaimVersionForUser
// defaults to the same single version findClaimVersionForUser returns, so
// every pre-existing test (a single-version claim where that version is
// both the requested target and Current) continues to exercise the
// Current-AND-active rule unchanged. Tests that need a Current/target
// mismatch override findCurrentClaimVersionForUser explicitly.
function fakeClaims(overrides: Partial<PersonalIntelligenceClaimRepository> = {}) {
  return {
    findClaimVersionForUser: async () => claimVersion(),
    findCurrentClaimVersionForUser: async () => claimVersion(),
    ...overrides,
  } as unknown as PersonalIntelligenceClaimRepository;
}

function fakeConfirmations(overrides: Partial<PersonalIntelligenceClaimConfirmationRepository> = {}) {
  const calls: Record<string, unknown[]> = {};
  const record = (name: string, args: unknown[]) => {
    calls[name] = calls[name] ?? [];
    calls[name].push(args);
  };

  const fake = {
    recordConfirmationEvent: async (...args: unknown[]) => {
      record("recordConfirmationEvent", args);
      return confirmationEvent();
    },
    findConfirmationEventsForClaimVersion: async (...args: unknown[]) => {
      record("findConfirmationEventsForClaimVersion", args);
      return [];
    },
    findConfirmationEventsForClaim: async () => [],
    ...overrides,
  };

  return { fake: fake as unknown as PersonalIntelligenceClaimConfirmationRepository, calls };
}

test("recordAction on the current active version records a 'confirmed' event", async () => {
  const claims = fakeClaims({ findClaimVersionForUser: async () => claimVersion({ lifecycle: "active" }) });
  const { fake: confirmations, calls } = fakeConfirmations({
    recordConfirmationEvent: async (...args: unknown[]) => {
      calls.recordConfirmationEvent = [args];
      return confirmationEvent({ action: "confirmed" });
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.recordAction("user-1", "claim-1", 1, "confirmed");

  assert.equal(result.status, "recorded");
  assert.equal(calls.recordConfirmationEvent.length, 1);
  const args = calls.recordConfirmationEvent[0] as unknown[];
  const input = args[0] as { claimVersionId: string; action: string };
  assert.equal(input.claimVersionId, "version-row-1");
  assert.equal(input.action, "confirmed");
});

test("recordAction on the current active version records an 'unconfirmed' event", async () => {
  const claims = fakeClaims({ findClaimVersionForUser: async () => claimVersion({ lifecycle: "active" }) });
  const { fake: confirmations, calls } = fakeConfirmations({
    recordConfirmationEvent: async (...args: unknown[]) => {
      calls.recordConfirmationEvent = [args];
      return confirmationEvent({ action: "unconfirmed" });
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.recordAction("user-1", "claim-1", 1, "unconfirmed");

  assert.equal(result.status, "recorded");
  const args = calls.recordConfirmationEvent[0] as unknown[];
  const input = args[0] as { action: string };
  assert.equal(input.action, "unconfirmed");
});

test("recordAction against a nonexistent/unowned claim version returns 'claim_version_not_found' and never writes an event", async () => {
  const claims = fakeClaims({ findClaimVersionForUser: async () => null });
  const { fake: confirmations, calls } = fakeConfirmations({
    recordConfirmationEvent: async (...args: unknown[]) => {
      calls.recordConfirmationEvent = [args];
      throw new Error("must not be called");
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.recordAction("user-1", "claim-1", 99, "confirmed");

  assert.deepEqual(result, { status: "claim_version_not_found" });
  assert.equal(calls.recordConfirmationEvent, undefined);
});

// Current-active-version invariant (Founder Decision, mandatory) -
// enforced entirely here, before recordConfirmationEvent is ever called.
for (const lifecycle of ["superseded", "corrected", "revoked", "disputed"] as const) {
  test(`recordAction against a '${lifecycle}' (non-active) version returns 'not_current_version' and never writes an event`, async () => {
    const claims = fakeClaims({ findClaimVersionForUser: async () => claimVersion({ lifecycle }) });
    const { fake: confirmations, calls } = fakeConfirmations({
      recordConfirmationEvent: async (...args: unknown[]) => {
        calls.recordConfirmationEvent = [args];
        throw new Error("must not be called");
      },
    });
    const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

    const result = await useCase.recordAction("user-1", "claim-1", 1, "confirmed");

    assert.deepEqual(result, { status: "not_current_version" });
    assert.equal(calls.recordConfirmationEvent, undefined);
  });
}

// C4 Claim Correction reconciliation (docs/gates/PERSONAL-INTELLIGENCE-
// CLAIM-CORRECTION-IMPLEMENTATION-INCREMENT-CONTRACT.md §10, Option
// 2/D3): the case the lifecycle loop above cannot exercise -
// currentness and activeness are independent axes, so a version that
// IS active but is no longer Current (a historical active row, e.g.
// superseded by a later correction) must be rejected too, not only a
// Current-but-non-active one.
test("recordAction against a historical 'active' version (not Current) returns 'not_current_version' and never writes an event", async () => {
  const claims = fakeClaims({
    findClaimVersionForUser: async () => claimVersion({ version: 1, lifecycle: "active" }),
    findCurrentClaimVersionForUser: async () => claimVersion({ version: 2, lifecycle: "active" }),
  });
  const { fake: confirmations, calls } = fakeConfirmations({
    recordConfirmationEvent: async (...args: unknown[]) => {
      calls.recordConfirmationEvent = [args];
      throw new Error("must not be called");
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.recordAction("user-1", "claim-1", 1, "confirmed");

  assert.deepEqual(result, { status: "not_current_version" });
  assert.equal(calls.recordConfirmationEvent, undefined);
});

// The positive counterpart: the current, active version of a claim that
// also has older/other versions must remain confirmable - proves the
// new currentness check does not over-reject.
test("recordAction against the Current active version succeeds even when the claim has other, non-Current versions", async () => {
  const claims = fakeClaims({
    findClaimVersionForUser: async () => claimVersion({ version: 3, lifecycle: "active" }),
    findCurrentClaimVersionForUser: async () => claimVersion({ version: 3, lifecycle: "active" }),
  });
  const { fake: confirmations, calls } = fakeConfirmations({
    recordConfirmationEvent: async (...args: unknown[]) => {
      calls.recordConfirmationEvent = [args];
      return confirmationEvent({ action: "confirmed" });
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.recordAction("user-1", "claim-1", 3, "confirmed");

  assert.equal(result.status, "recorded");
  assert.equal(calls.recordConfirmationEvent.length, 1);
});

// Founder Decision: redundant actions are always recorded as real new
// events, never deduplicated or suppressed.
test("a redundant confirm (already confirmed) still records a second, real event", async () => {
  const claims = fakeClaims();
  let recordCount = 0;
  const { fake: confirmations } = fakeConfirmations({
    recordConfirmationEvent: async () => {
      recordCount += 1;
      return confirmationEvent({ id: `event-${recordCount}`, sequence: recordCount, action: "confirmed" });
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const first = await useCase.recordAction("user-1", "claim-1", 1, "confirmed");
  const second = await useCase.recordAction("user-1", "claim-1", 1, "confirmed");

  assert.equal(recordCount, 2);
  assert.equal(first.status, "recorded");
  assert.equal(second.status, "recorded");
  assert.notEqual((first as { event: { id: string } }).event.id, (second as { event: { id: string } }).event.id);
});

test("a redundant unconfirm (already unconfirmed) still records an additional, real event", async () => {
  const claims = fakeClaims();
  let recordCount = 0;
  const { fake: confirmations } = fakeConfirmations({
    recordConfirmationEvent: async () => {
      recordCount += 1;
      return confirmationEvent({ id: `event-${recordCount}`, sequence: recordCount, action: "unconfirmed" });
    },
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  await useCase.recordAction("user-1", "claim-1", 1, "unconfirmed");
  await useCase.recordAction("user-1", "claim-1", 1, "unconfirmed");

  assert.equal(recordCount, 2);
});

test("getEffectiveConfirmation returns 'not_confirmed' when no confirmation event exists yet", async () => {
  const claims = fakeClaims();
  const { fake: confirmations } = fakeConfirmations({
    findConfirmationEventsForClaimVersion: async () => [],
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.getEffectiveConfirmation("user-1", "claim-1", 1);

  assert.deepEqual(result, { status: "found", state: "not_confirmed" });
});

test("getEffectiveConfirmation returns 'confirmed' when the latest event is 'confirmed' (deterministic, via deriveEffectiveConfirmation)", async () => {
  const claims = fakeClaims();
  const { fake: confirmations } = fakeConfirmations({
    findConfirmationEventsForClaimVersion: async () => [
      confirmationEvent({ sequence: 1, action: "confirmed" }),
      confirmationEvent({ id: "event-2", sequence: 2, action: "unconfirmed" }),
      confirmationEvent({ id: "event-3", sequence: 3, action: "confirmed" }),
    ],
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.getEffectiveConfirmation("user-1", "claim-1", 1);

  assert.deepEqual(result, { status: "found", state: "confirmed" });
});

// Distinguishes "not_confirmed" (no event ever) from "unconfirmed" (an
// explicit retraction is the latest event) - both are honest, distinct
// states; deriveEffectiveConfirmation itself only returns a boolean, so
// this proves the use-case correctly adds the event-count distinction
// without modifying that pure function.
test("getEffectiveConfirmation returns 'unconfirmed', distinct from 'not_confirmed', when the latest event is an explicit retraction", async () => {
  const claims = fakeClaims();
  const { fake: confirmations } = fakeConfirmations({
    findConfirmationEventsForClaimVersion: async () => [
      confirmationEvent({ sequence: 1, action: "confirmed" }),
      confirmationEvent({ id: "event-2", sequence: 2, action: "unconfirmed" }),
    ],
  });
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.getEffectiveConfirmation("user-1", "claim-1", 1);

  assert.deepEqual(result, { status: "found", state: "unconfirmed" });
});

test("getEffectiveConfirmation against a nonexistent/unowned claim version returns 'claim_version_not_found'", async () => {
  const claims = fakeClaims({ findClaimVersionForUser: async () => null });
  const { fake: confirmations } = fakeConfirmations();
  const useCase = new PersonalIntelligenceClaimConfirmationUseCase(claims, confirmations);

  const result = await useCase.getEffectiveConfirmation("user-1", "claim-1", 99);

  assert.deepEqual(result, { status: "claim_version_not_found" });
});
