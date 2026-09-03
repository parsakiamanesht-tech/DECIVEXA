import test from "node:test";
import assert from "node:assert/strict";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PersonalIntelligenceController } from "./personal-intelligence.controller";
import { PersonalIntelligenceClaimUseCase } from "../../application/personal-intelligence/personal-intelligence-claim.use-case";
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
    findActiveClaimVersionsForUser: async (...args: unknown[]) => {
      record("findActiveClaimVersionsForUser", args);
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
  const controller = new PersonalIntelligenceController(fake);

  await assert.rejects(() => controller.listActiveClaims({}), UnauthorizedException);
  await assert.rejects(() => controller.history(undefined, {}), UnauthorizedException);
  await assert.rejects(() => controller.diff("claim-1", "1", "2", {}), UnauthorizedException);
  await assert.rejects(
    () => controller.evidence("claim-1", 1, {}),
    UnauthorizedException,
  );
});

test("listActiveClaims merges each active version with its claim's existing claimType via findClaimForUser, scoped to the authenticated user", async () => {
  const activeVersion = version();
  const claim: PersonalIntelligenceClaim = {
    id: "claim-1",
    userId: "user-1",
    claimType: "preference",
    createdAt: new Date("2025-12-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
  const { fake, calls } = fakeUseCase({
    findActiveClaimVersionsForUser: async (...args: unknown[]) => {
      calls.findActiveClaimVersionsForUser = [args];
      return [activeVersion];
    },
    findClaimForUser: async (...args: unknown[]) => {
      calls.findClaimForUser = [args];
      return claim;
    },
  });
  const controller = new PersonalIntelligenceController(fake);

  const result = await controller.listActiveClaims({ context: AUTHENTICATED_CONTEXT });

  assert.deepEqual(calls.findActiveClaimVersionsForUser[0], ["user-1"]);
  assert.deepEqual(calls.findClaimForUser[0], ["user-1", "claim-1"]);
  assert.equal(result.length, 1);
  assert.equal(result[0].claimType, "preference");
  // Every already-existing field on the version is passed through
  // unmutated - the merge adds claimType only.
  assert.equal(result[0].valueText, "Europe/Paris");
  assert.equal(result[0].id, "version-1");
});

test("listActiveClaims reports claimType: null, never fabricated, when the parent claim cannot be resolved", async () => {
  const { fake } = fakeUseCase({
    findActiveClaimVersionsForUser: async () => [version()],
    findClaimForUser: async () => null,
  });
  const controller = new PersonalIntelligenceController(fake);

  const result = await controller.listActiveClaims({ context: AUTHENTICATED_CONTEXT });

  assert.equal(result[0].claimType, null);
});

test("history delegates to detectChange with the authenticated user id and an optional parsed since date", async () => {
  const { fake, calls } = fakeUseCase();
  const controller = new PersonalIntelligenceController(fake);

  await controller.history(undefined, { context: AUTHENTICATED_CONTEXT });
  assert.deepEqual(calls.detectChange[0], ["user-1", undefined]);

  await controller.history("2026-01-01T00:00:00.000Z", { context: AUTHENTICATED_CONTEXT });
  const [userId, since] = calls.detectChange[1] as [string, Date];
  assert.equal(userId, "user-1");
  assert.equal(since.toISOString(), "2026-01-01T00:00:00.000Z");
});

test("history rejects an unparseable since value with a 400, never silently ignoring it", async () => {
  const { fake } = fakeUseCase();
  const controller = new PersonalIntelligenceController(fake);

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
  const controller = new PersonalIntelligenceController(fake);

  const result = await controller.diff("claim-1", "1", "2", { context: AUTHENTICATED_CONTEXT });

  assert.deepEqual(calls.explainModelChange[0], ["user-1", "claim-1", 1, 2]);
  assert.deepEqual(result, explanation);
});

test("diff maps a null explainModelChange result to 404, never fabricating an explanation", async () => {
  const { fake } = fakeUseCase({ explainModelChange: async () => null });
  const controller = new PersonalIntelligenceController(fake);

  await assert.rejects(
    () => controller.diff("claim-1", "1", "2", { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

test("diff rejects missing or invalid from/to query parameters with a 400", async () => {
  const { fake } = fakeUseCase();
  const controller = new PersonalIntelligenceController(fake);

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
    const controller = new PersonalIntelligenceController(fake);

    const result = await controller.evidence("claim-1", 3, { context: AUTHENTICATED_CONTEXT });

    assert.deepEqual(calls.inspectEvidence[0], ["user-1", "claim-1", 3]);
    assert.deepEqual(result, { status });
  }
});

test("evidence maps 'claim_version_not_found' to 404, never returning it as a 200 body", async () => {
  const { fake } = fakeUseCase({ inspectEvidence: async () => ({ status: "claim_version_not_found" }) });
  const controller = new PersonalIntelligenceController(fake);

  await assert.rejects(
    () => controller.evidence("claim-1", 99, { context: AUTHENTICATED_CONTEXT }),
    NotFoundException,
  );
});

// Structural check, mirroring ai-runtime.controller.spec.ts's convention:
// this controller must never introduce AI, a write path, or reach beyond
// the five authorized read methods.
test("personal-intelligence.controller.ts never references AI execution, a write method, or an unauthorized repository/use-case method (structural)", async () => {
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
    "PersonalIntelligenceClaimConfirmation",
  ];
  for (const token of forbidden) {
    assert.equal(source.includes(token), false, `personal-intelligence.controller.ts must not reference "${token}"`);
  }
});
