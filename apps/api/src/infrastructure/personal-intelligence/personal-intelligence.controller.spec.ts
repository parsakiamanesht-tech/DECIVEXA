import test from "node:test";
import assert from "node:assert/strict";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PersonalIntelligenceController } from "./personal-intelligence.controller";
import { PersonalIntelligenceClaimUseCase } from "../../application/personal-intelligence/personal-intelligence-claim.use-case";
import { PersonalIntelligenceClaimConfirmationUseCase } from "../../application/personal-intelligence/personal-intelligence-claim-confirmation.use-case";
import { PersonalIntelligenceClaimCorrectionUseCase } from "../../application/personal-intelligence/personal-intelligence-claim-correction.use-case";
import { createRequestContext } from "../../context/request-context";
import type { PersonalIntelligenceClaim, PersonalIntelligenceClaimVersion } from "../../core/personal-intelligence/personal-intelligence-claim.model";

const AUTHENTICATED_CONTEXT = createRequestContext("request-1", "user-1");

function fakeUseCase(overrides: Partial<PersonalIntelligenceClaimUseCase> = {}) {
  const calls: Record<string, unknown[]> = {};
  const record = (name: string, args: unknown[]) => {
    calls[name] = calls[name] ?? [];
    calls[name].push(args);
  };

  const fake = {
    findCurrentClaimVersionsForUser: async (...args: unknown[]) => {
      record("findCurrentClaimVersionsForUser", args);
      return [];
    },
    findClaimForUser: async (...args: unknown[]) => {
      record("findClaimForUser", args);
      return null;
    },
    detectChange: async (...args: unknown[]) => {
      record("detectChange", args);
      return [];
    },
    explainModelChange: async (...args: unknown[]) => {
      record("explainModelChange", args);
      return null;
    },
    inspectEvidence: async (...args: unknown[]) => {
      record("inspectEvidence", args);
      return { status: "not_linked" };
    },
    ...overrides,
  };

  return { fake: fake as unknown as PersonalIntelligenceClaimUseCase, calls };
}

// Default fake for PersonalIntelligenceClaimConfirmationUseCase - unused
// by any pre-existing test, but required as the controller's second
// constructor argument since C3's implementation. Overridable per-test
// exactly like fakeUseCase above.
function fakeConfirmationUseCase(overrides: Partial<PersonalIntelligenceClaimConfirmationUseCase> = {}) {
  const calls: Record<string, unknown[]> = {};
  const record = (name: string, args: unknown[]) => {
    calls[name] = calls[name] ?? [];
    calls[name].push(args);
  };

  const fake = {
    recordAction: async (...args: unknown[]) => {
      record("recordAction", args);
      return { status: "claim_version_not_found" };
    },
    getEffectiveConfirmation: async (...args: unknown[]) => {
      record("getEffectiveConfirmation", args);
      return { status: "claim_version_not_found" };
    },
    ...overrides,
  };

  return { fake: fake as unknown as PersonalIntelligenceClaimConfirmationUseCase, calls };
}

// C4 Claim Correction (docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-
// IMPLEMENTATION-INCREMENT-CONTRACT.md). Default fake for
// PersonalIntelligenceClaimCorrectionUseCase - required as the
// controller's third constructor argument. Overridable per-test exactly
// like fakeConfirmationUseCase above.
function fakeCorrectionUseCase(overrides: Partial<PersonalIntelligenceClaimCorrectionUseCase> = {}) {
  const calls: Record<string, unknown[]> = {};
  const record = (name: string, args: unknown[]) => {
    calls[name] = calls[name] ?? [];
    calls[name].push(args);
  };

  const fake = {
    correct: async (...args: unknown[]) => {
      record("correct", args);
      return { status: "claim_version_not_found" };
    },
    ...overrides,
  };

  return { fake: fake as unknown as PersonalIntelligenceClaimCorrectionUseCase, calls };
}

function version(overrides: Partial<PersonalIntelligenceClaimVersion> = {}): PersonalIntelligenceClaimVersion {
  return {
    id: "version-1",
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

// Every endpoint requires authentication (mirrors EvidenceController /
// PersonalStateController / AIRuntimeController convention exactly).
test("every endpoint requires authentication", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(() => controller.listActiveClaims({}), UnauthorizedException);
  await assert.rejects(() => controller.history(undefined, {}), UnauthorizedException);
  await assert.rejects(() => controller.diff("claim-1", "1", "2", {}), UnauthorizedException);
  await assert.rejects(
    () => controller.evidence("claim-1", 1, {}),
    UnauthorizedException,
  );
  await assert.rejects(() => controller.getConfirmation("claim-1", 1, {}), UnauthorizedException);
  await assert.rejects(
    () => controller.recordConfirmation("claim-1", 1, { action: "confirmed" }, {}),
    UnauthorizedException,
  );
  await assert.rejects(
    () => controller.correctClaim("claim-1", 1, { valueText: "x", confidence: 1 }, {}),
    UnauthorizedException,
  );
});

test("listActiveClaims merges each Current version with its claim's existing claimType via findClaimForUser, scoped to the authenticated user", async () => {
  const currentVersion = version();
  const claim: PersonalIntelligenceClaim = {
    id: "claim-1",
    userId: "user-1",
    claimType: "preference",
    createdAt: new Date("2025-12-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
  const { fake, calls } = fakeUseCase({
    findCurrentClaimVersionsForUser: async (...args: unknown[]) => {
      calls.findCurrentClaimVersionsForUser = [args];
      return [currentVersion];
    },
    findClaimForUser: async (...args: unknown[]) => {
      calls.findClaimForUser = [args];
      return claim;
    },
  });
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const result = await controller.listActiveClaims({ context: AUTHENTICATED_CONTEXT });

  assert.deepEqual(calls.findCurrentClaimVersionsForUser[0], ["user-1"]);
  assert.deepEqual(calls.findClaimForUser[0], ["user-1", "claim-1"]);
  assert.equal(result.length, 1);
  assert.equal(result[0].claimType, "preference");
  // Every already-existing field on the version is passed through
  // unmutated - the merge adds claimType only.
  assert.equal(result[0].valueText, "Europe/Paris");
  assert.equal(result[0].id, "version-1");
});

// C4 Claim Correction, D1: a Current version whose lifecycle is
// non-active must still be returned by this endpoint, never omitted and
// never silently replaced by an older active version - proves the
// controller performs no lifecycle filtering of its own on top of
// whatever findCurrentClaimVersionsForUser returns.
test("listActiveClaims returns a Current version even when its lifecycle is non-active, never omitting or substituting it", async () => {
  const currentNonActive = version({ id: "version-2", version: 2, lifecycle: "revoked" });
  const { fake } = fakeUseCase({
    findCurrentClaimVersionsForUser: async () => [currentNonActive],
    findClaimForUser: async () => ({
      id: "claim-1",
      userId: "user-1",
      claimType: "preference",
      createdAt: new Date("2025-12-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    }),
  });
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const result = await controller.listActiveClaims({ context: AUTHENTICATED_CONTEXT });

  assert.equal(result.length, 1);
  assert.equal(result[0].version, 2);
  assert.equal(result[0].lifecycle, "revoked");
});

test("listActiveClaims reports claimType: null, never fabricated, when the parent claim cannot be resolved", async () => {
  const { fake } = fakeUseCase({
    findCurrentClaimVersionsForUser: async () => [version()],
    findClaimForUser: async () => null,
  });
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const result = await controller.listActiveClaims({ context: AUTHENTICATED_CONTEXT });

  assert.equal(result[0].claimType, null);
});

test("history delegates to detectChange with the authenticated user id and an optional parsed since date", async () => {
  const { fake, calls } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await controller.history(undefined, { context: AUTHENTICATED_CONTEXT });
  assert.deepEqual(calls.detectChange[0], ["user-1", undefined]);

  await controller.history("2026-01-01T00:00:00.000Z", { context: AUTHENTICATED_CONTEXT });
  const [userId, since] = calls.detectChange[1] as [string, Date];
  assert.equal(userId, "user-1");
  assert.equal(since.toISOString(), "2026-01-01T00:00:00.000Z");
});

test("history rejects an unparseable since value with a 400, never silently ignoring it", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.history("not-a-date", { context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
});

test("diff delegates to explainModelChange with the authenticated user id, claimId, and parsed version numbers", async () => {
  const explanation = { claimId: "claim-1", fromVersion: version({ version: 1 }), toVersion: version({ version: 2 }), changedFields: ["confidence"] as const };
  const { fake, calls } = fakeUseCase({
    explainModelChange: async (...args: unknown[]) => {
      calls.explainModelChange = [args];
      return explanation;
    },
  });
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const result = await controller.diff("claim-1", "1", "2", { context: AUTHENTICATED_CONTEXT });

  assert.deepEqual(calls.explainModelChange[0], ["user-1", "claim-1", 1, 2]);
  assert.deepEqual(result, explanation);
});

test("diff maps a null explainModelChange result to 404, never fabricating an explanation", async () => {
  const { fake } = fakeUseCase({ explainModelChange: async () => null });
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.diff("claim-1", "1", "2", { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

test("diff rejects missing or invalid from/to query parameters with a 400", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.diff("claim-1", undefined, "2", { context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
  await assert.rejects(
    () => controller.diff("claim-1", "not-a-number", "2", { context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
});

test("evidence delegates to inspectEvidence with the authenticated user id, claimId, and version, and returns 'not_linked'/'evidence_missing' as distinct 200 results, never merged or hidden", async () => {
  for (const status of ["not_linked", "evidence_missing"] as const) {
    const { fake, calls } = fakeUseCase({
      inspectEvidence: async (...args: unknown[]) => {
        calls.inspectEvidence = [args];
        return { status };
      },
    });
    const { fake: fakeConfirmation } = fakeConfirmationUseCase();
    const { fake: fakeCorrection } = fakeCorrectionUseCase();
    const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

    const result = await controller.evidence("claim-1", 3, { context: AUTHENTICATED_CONTEXT });

    assert.deepEqual(calls.inspectEvidence[0], ["user-1", "claim-1", 3]);
    assert.deepEqual(result, { status });
  }
});

test("evidence maps 'claim_version_not_found' to 404, never returning it as a 200 body", async () => {
  const { fake } = fakeUseCase({ inspectEvidence: async () => ({ status: "claim_version_not_found" }) });
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.evidence("claim-1", 99, { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

// --- C3 Claim Confirm/Unconfirm (Founder Implementation Authorization) ---

test("getConfirmation delegates to getEffectiveConfirmation with the authenticated user id, claimId, and version, and returns the state as-is", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation, calls } = fakeConfirmationUseCase({
    getEffectiveConfirmation: async (...args: unknown[]) => {
      calls.getEffectiveConfirmation = [args];
      return { status: "found", state: "confirmed" };
    },
  });
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const result = await controller.getConfirmation("claim-1", 1, { context: AUTHENTICATED_CONTEXT });

  assert.deepEqual(calls.getEffectiveConfirmation[0], ["user-1", "claim-1", 1]);
  assert.deepEqual(result, { status: "found", state: "confirmed" });
});

test("getConfirmation maps 'claim_version_not_found' to 404, never returning it as a 200 body", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.getConfirmation("claim-1", 99, { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

test("recordConfirmation delegates to recordAction with the authenticated user id, claimId, version, and parsed action, for both 'confirmed' and 'unconfirmed'", async () => {
  for (const action of ["confirmed", "unconfirmed"] as const) {
    const event = {
      id: "event-1",
      claimId: "claim-1",
      claimVersionId: "version-1",
      userId: "user-1",
      sequence: 1,
      action,
      occurredAt: new Date("2026-01-01T00:00:00.000Z"),
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    const { fake } = fakeUseCase();
    const { fake: fakeConfirmation, calls } = fakeConfirmationUseCase({
      recordAction: async (...args: unknown[]) => {
        calls.recordAction = [args];
        return { status: "recorded", event };
      },
    });
    const { fake: fakeCorrection } = fakeCorrectionUseCase();
    const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

    const result = await controller.recordConfirmation("claim-1", 1, { action }, { context: AUTHENTICATED_CONTEXT });

    assert.deepEqual(calls.recordAction[0], ["user-1", "claim-1", 1, action]);
    assert.deepEqual(result, event);
  }
});

// Founder Decision: redundant actions are always recorded, never
// deduplicated or suppressed. This test proves the controller places no
// dedup/idempotency logic of its own in front of recordAction - two
// identical calls both reach the use-case and both return a "recorded"
// result, exactly as a fake use-case that never deduplicates would
// produce.
test("recordConfirmation never deduplicates a redundant action - two identical calls both reach recordAction and both return 'recorded'", async () => {
  const { fake } = fakeUseCase();
  let callCount = 0;
  const { fake: fakeConfirmation, calls } = fakeConfirmationUseCase({
    recordAction: async (...args: unknown[]) => {
      callCount += 1;
      calls.recordAction = calls.recordAction ?? [];
      calls.recordAction.push(args);
      return {
        status: "recorded",
        event: {
          id: `event-${callCount}`,
          claimId: "claim-1",
          claimVersionId: "version-1",
          userId: "user-1",
          sequence: callCount,
          action: "confirmed",
          occurredAt: new Date("2026-01-01T00:00:00.000Z"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      };
    },
  });
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const first = await controller.recordConfirmation("claim-1", 1, { action: "confirmed" }, { context: AUTHENTICATED_CONTEXT });
  const second = await controller.recordConfirmation("claim-1", 1, { action: "confirmed" }, { context: AUTHENTICATED_CONTEXT });

  assert.equal(callCount, 2);
  assert.equal(first.id, "event-1");
  assert.equal(second.id, "event-2");
});

test("recordConfirmation rejects an invalid action with a 400, never calling recordAction", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation, calls } = fakeConfirmationUseCase({
    recordAction: async (...args: unknown[]) => {
      calls.recordAction = [args];
      throw new Error("must not be called for an invalid action");
    },
  });
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.recordConfirmation("claim-1", 1, { action: "wrong" }, { context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
  assert.equal(calls.recordAction, undefined);
});

test("recordConfirmation maps 'claim_version_not_found' to 404, never fabricating an event", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase({
    recordAction: async () => ({ status: "claim_version_not_found" }),
  });
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.recordConfirmation("claim-1", 99, { action: "confirmed" }, { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

test("recordConfirmation maps 'not_current_version' to 409, never silently accepting a confirmation on a non-active version", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase({
    recordAction: async () => ({ status: "not_current_version" }),
  });
  const { fake: fakeCorrection } = fakeCorrectionUseCase();
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.recordConfirmation("claim-1", 1, { action: "confirmed" }, { context: AUTHENTICATED_CONTEXT }),
    ConflictException,
  );
});

// --- C4 Claim Correction (Founder Implementation Authorization,
// docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-IMPLEMENTATION-
// INCREMENT-CONTRACT.md) ---

test("correctClaim delegates to correction.correct with the authenticated user id, claimId, path version, and the minimal body, returning the created version", async () => {
  const created = version({ id: "version-2", version: 2, valueText: "Corrected value", confidence: 0.8 });
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection, calls } = fakeCorrectionUseCase({
    correct: async (...args: unknown[]) => {
      calls.correct = [args];
      return { status: "created", version: created };
    },
  });
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  const result = await controller.correctClaim(
    "claim-1",
    1,
    { valueText: "Corrected value", confidence: 0.8 },
    { context: AUTHENTICATED_CONTEXT },
  );

  assert.deepEqual(calls.correct[0], ["user-1", "claim-1", 1, { valueText: "Corrected value", confidence: 0.8 }]);
  assert.deepEqual(result, created);
});

test("correctClaim rejects a missing/empty valueText with a 400, never calling correct", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection, calls } = fakeCorrectionUseCase({
    correct: async (...args: unknown[]) => {
      calls.correct = [args];
      throw new Error("must not be called for invalid input");
    },
  });
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.correctClaim("claim-1", 1, { valueText: "", confidence: 0.5 }, { context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
  await assert.rejects(
    () => controller.correctClaim("claim-1", 1, { valueText: undefined, confidence: 0.5 }, { context: AUTHENTICATED_CONTEXT }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 400);
      return true;
    },
  );
  assert.equal(calls.correct, undefined);
});

test("correctClaim rejects a confidence value outside [0, 1], or a non-number, with a 400, never calling correct", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection, calls } = fakeCorrectionUseCase({
    correct: async (...args: unknown[]) => {
      calls.correct = [args];
      throw new Error("must not be called for invalid input");
    },
  });
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  for (const confidence of [-0.1, 1.1, "0.5" as unknown as number, undefined as unknown as number]) {
    await assert.rejects(
      () => controller.correctClaim("claim-1", 1, { valueText: "x", confidence }, { context: AUTHENTICATED_CONTEXT }),
      (error: unknown) => {
        assert.equal((error as { status?: number }).status, 400);
        return true;
      },
    );
  }
  assert.equal(calls.correct, undefined);
});

test("correctClaim maps 'claim_version_not_found' to 404, never fabricating a version", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase({
    correct: async () => ({ status: "claim_version_not_found" }),
  });
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.correctClaim("claim-1", 99, { valueText: "x", confidence: 0.5 }, { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

test("correctClaim maps 'stale' to 409, never silently creating a version against a non-Current target", async () => {
  const { fake } = fakeUseCase();
  const { fake: fakeConfirmation } = fakeConfirmationUseCase();
  const { fake: fakeCorrection } = fakeCorrectionUseCase({
    correct: async () => ({ status: "stale" }),
  });
  const controller = new PersonalIntelligenceController(fake, fakeConfirmation, fakeCorrection);

  await assert.rejects(
    () => controller.correctClaim("claim-1", 1, { valueText: "x", confidence: 0.5 }, { context: AUTHENTICATED_CONTEXT }),
    ConflictException,
  );
});

// Structural check, mirroring ai-runtime.controller.spec.ts's convention:
// this controller must never introduce AI or reach directly into the
// repository's write methods or into Relationship/Matching territory -
// every write goes through a use-case (PersonalIntelligenceClaimCorrectionUseCase.correct,
// PersonalIntelligenceClaimConfirmationUseCase.recordAction), never
// PersonalIntelligenceClaimRepository.appendCorrection/.create directly.
test("personal-intelligence.controller.ts never references AI execution or an unauthorized repository/use-case method (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(
    join(process.cwd(), "src", "infrastructure", "personal-intelligence", "personal-intelligence.controller.ts"),
    "utf8",
  );

  const forbidden = [
    "AIRuntime",
    ".execute(",
    "OpenAI",
    ".create(",
    ".appendCorrection(",
    "PersonalIntelligenceRelationship",
  ];
  for (const token of forbidden) {
    assert.equal(source.includes(token), false, `personal-intelligence.controller.ts must not reference "${token}"`);
  }
});
