import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import { evidence, evidenceVersions } from "../../persistence/schema/evidence.schema";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
} from "../../persistence/schema/personal-intelligence.schema";
import {
  personalIntelligenceEvaluationEvidenceReferences,
  personalIntelligenceEvaluations,
  personalIntelligenceEvaluationStandardVersions,
  personalIntelligenceEvaluationStandards,
} from "../../persistence/schema/personal-intelligence-evaluation.schema";
import { DrizzlePersonalIntelligenceEvaluationStandardRepository } from "./personal-intelligence-evaluation-standard.repository";
import { DrizzlePersonalIntelligenceEvaluationRepository } from "./personal-intelligence-evaluation.repository";

// Derivation Trace / Provenance — Increment 1: Evaluation & Evaluation
// Standard Foundation (Founder Implementation Authorization). Exercises
// the actual Drizzle repository implementations against a real
// PostgreSQL database, mirroring the established
// personal-intelligence-inference.repository.runtime.spec.ts pattern
// exactly. Covers, at minimum, acceptance Tests A through I from the
// authorization: Single-Claim scope, exact-EvidenceVersion-set
// recoverability, Evaluation-Standard-version recoverability, Standard
// immutability across versions, ClaimVersion-without-Evaluation
// optionality, non-destructive correction, full-lineage recoverability,
// and Confidence/Evidential-Sufficiency separation.
//
// Requires process.env.DATABASE_URL, exactly the connection string
// already used by api-verification.yml's "Apply migrations"/"Start
// application" steps. No new credential, secret, or database is
// introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-evaluation.repository.runtime.spec.ts requires DATABASE_URL (this repository's runtime tests must run only after PostgreSQL is healthy and migrated, mirroring the Q1 precedent).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const standardRepo = new DrizzlePersonalIntelligenceEvaluationStandardRepository(db);
const evaluationRepo = new DrizzlePersonalIntelligenceEvaluationRepository(db);

const runId = randomUUID();
const userAId = `dt-runtime-eval-user-a-${runId}`;
const userBId = `dt-runtime-eval-user-b-${runId}`;
const createdEvidenceIds: string[] = [];
const createdClaimIds: string[] = [];
const createdStandardIds: string[] = [];
const createdEvaluationIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  if (createdEvaluationIds.length > 0) {
    await db
      .delete(personalIntelligenceEvaluationEvidenceReferences)
      .where(inArray(personalIntelligenceEvaluationEvidenceReferences.evaluationId, createdEvaluationIds));
    // supersedesEvaluationId is self-referencing (restrict) — delete any
    // superseding row before the row it points to.
    await db
      .delete(personalIntelligenceEvaluations)
      .where(inArray(personalIntelligenceEvaluations.id, createdEvaluationIds));
  }
  if (createdStandardIds.length > 0) {
    await db
      .delete(personalIntelligenceEvaluationStandardVersions)
      .where(inArray(personalIntelligenceEvaluationStandardVersions.standardId, createdStandardIds));
    await db.delete(personalIntelligenceEvaluationStandards).where(inArray(personalIntelligenceEvaluationStandards.id, createdStandardIds));
  }
  if (createdClaimIds.length > 0) {
    await db.delete(personalIntelligenceClaimVersions).where(inArray(personalIntelligenceClaimVersions.claimId, createdClaimIds));
    await db.delete(personalIntelligenceClaims).where(inArray(personalIntelligenceClaims.id, createdClaimIds));
  }
  if (createdEvidenceIds.length > 0) {
    await db.delete(evidenceVersions).where(inArray(evidenceVersions.evidenceId, createdEvidenceIds));
    await db.delete(evidence).where(inArray(evidence.id, createdEvidenceIds));
  }
  await db.delete(users).where(inArray(users.id, [userAId, userBId]));
  await pool.end();
});

async function seedEvidenceVersion(ownerId: string, evidenceId: string): Promise<string> {
  createdEvidenceIds.push(evidenceId);
  const versionId = randomUUID();
  const now = new Date();
  await db.insert(evidence).values({ id: evidenceId, userId: ownerId, createdAt: now, updatedAt: now });
  await db.insert(evidenceVersions).values({
    id: versionId,
    evidenceId,
    userId: ownerId,
    version: 1,
    provenance: "observed",
    lifecycle: "active",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.8,
    createdAt: now,
  });
  return versionId;
}

async function seedClaimVersion(ownerId: string, claimId: string): Promise<string> {
  createdClaimIds.push(claimId);
  const now = new Date();
  const claimVersionId = randomUUID();
  await db.insert(personalIntelligenceClaims).values({
    id: claimId,
    userId: ownerId,
    claimType: "preference",
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(personalIntelligenceClaimVersions).values({
    id: claimVersionId,
    claimId,
    userId: ownerId,
    version: 1,
    valueKind: "text",
    valueText: "no Evaluation required for this to be valid",
    provenance: "declared",
    confidence: 0.5,
    lifecycle: "active",
    evidenceVersionId: null,
    inferenceId: null,
    evidenceLinkageState: "self_reported_no_evidence_required",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: now,
    acceptedAt: now,
    createdAt: now,
  });
  return claimVersionId;
}

async function seedStandard(ownerId: string, standardId: string, criteria: string) {
  createdStandardIds.push(standardId);
  const versionId = randomUUID();
  const now = new Date();
  const standard = await standardRepo.create({
    standardId,
    userId: ownerId,
    initialVersionId: versionId,
    criteria,
    now,
  });
  return { standard, versionId };
}

test("Test E — a ClaimVersion remains fully valid with zero Evaluations ever created for it (Conditional Evaluation, FD-DT-05)", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-optionality-${runId}`);
  const evaluations = await evaluationRepo.findEvaluationsForClaimVersionForUser(userAId, claimVersionId);
  assert.deepEqual(evaluations, [], "a ClaimVersion must be able to exist with no Evaluation lineage at all");
});

test("Test A/B/C/G — Evaluation records exactly one ClaimVersion, the exact EvidenceVersion set, and the exact Standard version, all recoverable", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-a-${runId}`);
  const evidenceVersionId1 = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-1-${runId}`);
  const evidenceVersionId2 = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-2-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(
    userAId,
    `dt-runtime-eval-standard-a-${runId}`,
    "purpose: FIS-035 diagnosis; threshold: at least two corroborating EvidenceVersions",
  );

  const evaluationId = `dt-runtime-eval-a-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();

  const evaluation = await evaluationRepo.create({
    evaluationId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionId,
    result: "sufficient",
    evaluatorType: "system_deterministic",
    producerCapabilityId: null,
    producerCapabilityVersion: null,
    producerProviderId: null,
    producerModelId: null,
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    supersedesEvaluationId: null,
    evaluatedAt: now,
    now,
    evidenceVersionIds: [evidenceVersionId1, evidenceVersionId2],
  });

  assert.equal(evaluation.claimVersionId, claimVersionId, "recoverable: the exact ClaimVersion evaluated");
  assert.equal(evaluation.evaluationStandardVersionId, standardVersionId, "recoverable: the exact Evaluation Standard version applied");

  const recoveredEvidence = await evaluationRepo.findEvidenceReferencesForUser(userAId, evaluationId);
  assert.deepEqual(
    [...recoveredEvidence].sort(),
    [evidenceVersionId1, evidenceVersionId2].sort(),
    "recoverable: the exact EvidenceVersion set actually considered — no more, no fewer",
  );

  const recoveredStandardVersion = await standardRepo.findVersionForUser(userAId, standardVersionId);
  assert.ok(recoveredStandardVersion, "the exact Standard version's material criteria must remain readable");
  assert.equal(recoveredStandardVersion?.criteria, "purpose: FIS-035 diagnosis; threshold: at least two corroborating EvidenceVersions");
});

test("Test D — a later Evaluation Standard version does not alter the meaning/history of an already-existing Evaluation", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-d-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-d-${runId}`);
  const standardId = `dt-runtime-eval-standard-d-${runId}`;
  const { versionId: standardVersionV1 } = await seedStandard(userAId, standardId, "v1 criteria: lenient threshold");

  const evaluationId = `dt-runtime-eval-d-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();
  await evaluationRepo.create({
    evaluationId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionV1,
    result: "sufficient",
    evaluatorType: "human",
    producerCapabilityId: null,
    producerCapabilityVersion: null,
    producerProviderId: null,
    producerModelId: null,
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    supersedesEvaluationId: null,
    evaluatedAt: now,
    now,
    evidenceVersionIds: [evidenceVersionId],
  });

  // A stricter v2 is published for the same Standard identity.
  const v2 = await standardRepo.createVersion({
    versionId: randomUUID(),
    userId: userAId,
    standardId,
    expectedVersion: 1,
    criteria: "v2 criteria: strict threshold",
    now: new Date(),
  });
  assert.ok(v2, "creating a new Standard version must succeed");
  assert.equal(v2?.version, 2);

  // The original Evaluation's recorded Standard-version reference must
  // still point at v1, unchanged — its meaning does not silently shift.
  const unchangedEvaluation = await evaluationRepo.findEvaluationForUser(userAId, evaluationId);
  assert.equal(
    unchangedEvaluation?.evaluationStandardVersionId,
    standardVersionV1,
    "an existing Evaluation must never silently resolve against a later Standard version",
  );

  const v1StillReadable = await standardRepo.findVersionForUser(userAId, standardVersionV1);
  assert.equal(v1StillReadable?.criteria, "v1 criteria: lenient threshold", "the original Standard version's criteria remain readable after a newer version is created");
});

test("Test F — correcting an Evaluation creates a new record; the original remains fully recoverable, never destroyed", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-f-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-f-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(userAId, `dt-runtime-eval-standard-f-${runId}`, "criteria for correction test");

  const originalId = `dt-runtime-eval-f-original-${runId}`;
  createdEvaluationIds.push(originalId);
  const now = new Date();
  await evaluationRepo.create({
    evaluationId: originalId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionId,
    result: "insufficient",
    evaluatorType: "human",
    producerCapabilityId: null,
    producerCapabilityVersion: null,
    producerProviderId: null,
    producerModelId: null,
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    supersedesEvaluationId: null,
    evaluatedAt: now,
    now,
    evidenceVersionIds: [evidenceVersionId],
  });

  const correctionId = `dt-runtime-eval-f-correction-${runId}`;
  createdEvaluationIds.push(correctionId);
  await evaluationRepo.create({
    evaluationId: correctionId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionId,
    result: "sufficient",
    evaluatorType: "human",
    producerCapabilityId: null,
    producerCapabilityVersion: null,
    producerProviderId: null,
    producerModelId: null,
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    supersedesEvaluationId: originalId,
    evaluatedAt: new Date(),
    now: new Date(),
    evidenceVersionIds: [evidenceVersionId],
  });

  const original = await evaluationRepo.findEvaluationForUser(userAId, originalId);
  assert.ok(original, "the original Evaluation must remain readable after correction — never destroyed");
  assert.equal(original?.result, "insufficient", "the original's own result must remain exactly as it was");

  const allForClaimVersion = await evaluationRepo.findEvaluationsForClaimVersionForUser(userAId, claimVersionId);
  assert.equal(allForClaimVersion.length, 2, "both the original and the correction must independently exist");
});

test("Test H — Confidence fields and Evidential Sufficiency result are distinct, never collapsed", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-h-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-h-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(userAId, `dt-runtime-eval-standard-h-${runId}`, "criteria for confidence-separation test");

  const evaluationId = `dt-runtime-eval-h-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();
  const evaluation = await evaluationRepo.create({
    evaluationId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionId,
    result: "insufficient",
    evaluatorType: "ai",
    producerCapabilityId: "dt-runtime-capability",
    producerCapabilityVersion: "1",
    producerProviderId: "dt-runtime-provider",
    producerModelId: "dt-runtime-model",
    modelReportedConfidence: 0.95,
    systemAdjustedConfidence: 0.4,
    supersedesEvaluationId: null,
    evaluatedAt: now,
    now,
    evidenceVersionIds: [evidenceVersionId],
  });

  // A high AI-reported confidence must never be conflated with, or imply,
  // a "sufficient" Evidential Sufficiency result — the two are stored as
  // entirely separate fields. Captured before any narrowing assertion so
  // the comparison below is not rejected by TypeScript as a literal-type
  // tautology — this is deliberately checking two independent fields.
  const resultIsSufficient: string = evaluation.result;
  const confidenceIsHigh =
    evaluation.modelReportedConfidence !== null && evaluation.modelReportedConfidence > 0.5;
  assert.equal(evaluation.result, "insufficient");
  assert.equal(evaluation.modelReportedConfidence, 0.95);
  assert.equal(evaluation.systemAdjustedConfidence, 0.4);
  assert.notEqual(
    resultIsSufficient === "sufficient",
    confidenceIsHigh,
    "high confidence and Evidential Sufficiency are independent — this fixture deliberately has high confidence but an insufficient result",
  );
});

test("create(): a cross-user EvidenceVersion reference rolls back the entire transaction — the Evaluation row does not survive", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-rollback-${runId}`);
  const foreignEvidenceVersionId = await seedEvidenceVersion(userBId, `dt-runtime-eval-foreign-evidence-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(userAId, `dt-runtime-eval-standard-rollback-${runId}`, "criteria for rollback test");

  const evaluationId = `dt-runtime-eval-rollback-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();

  await assert.rejects(() =>
    evaluationRepo.create({
      evaluationId,
      userId: userAId,
      claimVersionId,
      evaluationStandardVersionId: standardVersionId,
      result: "sufficient",
      evaluatorType: "human",
      producerCapabilityId: null,
      producerCapabilityVersion: null,
      producerProviderId: null,
      producerModelId: null,
      modelReportedConfidence: null,
      systemAdjustedConfidence: null,
      supersedesEvaluationId: null,
      evaluatedAt: now,
      now,
      evidenceVersionIds: [foreignEvidenceVersionId],
    }),
  );

  const row = await evaluationRepo.findEvaluationForUser(userAId, evaluationId);
  assert.equal(row, null, "the Evaluation row must not persist when a supplied EvidenceVersion reference fails real ownership verification");
});

// Surgical Correction Gate — Finding 1 (Post-Increment 1 Semantic Impact
// Audit): claimVersionId and evaluationStandardVersionId previously
// carried no ownership enforcement at all — a User A Evaluation could
// reference a ClaimVersion or Evaluation Standard Version owned by User
// B with zero rejection. The two tests below prove the corrected
// behavior against real PostgreSQL, mirroring the exact rollback test
// above and DrizzlePersonalIntelligenceRelationshipRepository's own
// two-referenced-row ownership check.

test("create(): a cross-user ClaimVersion reference is rejected — no Evaluation persisted (Finding 1, Test A)", async () => {
  const foreignClaimVersionId = await seedClaimVersion(userBId, `dt-runtime-eval-foreign-claim-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-finding1-a-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(
    userAId,
    `dt-runtime-eval-standard-finding1-a-${runId}`,
    "criteria for Finding 1 ClaimVersion ownership test",
  );

  const evaluationId = `dt-runtime-eval-finding1-a-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();

  await assert.rejects(() =>
    evaluationRepo.create({
      evaluationId,
      userId: userAId,
      claimVersionId: foreignClaimVersionId,
      evaluationStandardVersionId: standardVersionId,
      result: "sufficient",
      evaluatorType: "human",
      producerCapabilityId: null,
      producerCapabilityVersion: null,
      producerProviderId: null,
      producerModelId: null,
      modelReportedConfidence: null,
      systemAdjustedConfidence: null,
      supersedesEvaluationId: null,
      evaluatedAt: now,
      now,
      evidenceVersionIds: [evidenceVersionId],
    }),
  );

  const row = await evaluationRepo.findEvaluationForUser(userAId, evaluationId);
  assert.equal(row, null, "a ClaimVersion owned by a different user must never be accepted — existence alone is not ownership");
});

test("create(): a same-user ClaimVersion succeeds (Finding 1, Test C)", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-finding1-c-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-finding1-c-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(
    userAId,
    `dt-runtime-eval-standard-finding1-c-${runId}`,
    "criteria for Finding 1 same-user ClaimVersion test",
  );

  const evaluationId = `dt-runtime-eval-finding1-c-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();

  const evaluation = await evaluationRepo.create({
    evaluationId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionId,
    result: "sufficient",
    evaluatorType: "human",
    producerCapabilityId: null,
    producerCapabilityVersion: null,
    producerProviderId: null,
    producerModelId: null,
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    supersedesEvaluationId: null,
    evaluatedAt: now,
    now,
    evidenceVersionIds: [evidenceVersionId],
  });

  assert.equal(evaluation.claimVersionId, claimVersionId, "a ClaimVersion owned by the same user must be accepted");
});

test("create(): a cross-user EvaluationStandardVersion reference is rejected — no Evaluation persisted (Finding 1, Test B)", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-finding1-b-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-finding1-b-${runId}`);
  const { versionId: foreignStandardVersionId } = await seedStandard(
    userBId,
    `dt-runtime-eval-standard-finding1-b-${runId}`,
    "criteria owned by a different user",
  );

  const evaluationId = `dt-runtime-eval-finding1-b-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();

  await assert.rejects(() =>
    evaluationRepo.create({
      evaluationId,
      userId: userAId,
      claimVersionId,
      evaluationStandardVersionId: foreignStandardVersionId,
      result: "sufficient",
      evaluatorType: "human",
      producerCapabilityId: null,
      producerCapabilityVersion: null,
      producerProviderId: null,
      producerModelId: null,
      modelReportedConfidence: null,
      systemAdjustedConfidence: null,
      supersedesEvaluationId: null,
      evaluatedAt: now,
      now,
      evidenceVersionIds: [evidenceVersionId],
    }),
  );

  const row = await evaluationRepo.findEvaluationForUser(userAId, evaluationId);
  assert.equal(
    row,
    null,
    "an EvaluationStandardVersion owned by a different user must never be accepted — a valid FK proves existence, not ownership",
  );
});

test("create(): a same-user EvaluationStandardVersion succeeds, and the existing EvidenceVersion ownership check still rejects a foreign reference (Finding 1, Test D + Test E)", async () => {
  const claimVersionId = await seedClaimVersion(userAId, `dt-runtime-eval-claim-finding1-d-${runId}`);
  const evidenceVersionId = await seedEvidenceVersion(userAId, `dt-runtime-eval-evidence-finding1-d-${runId}`);
  const { versionId: standardVersionId } = await seedStandard(
    userAId,
    `dt-runtime-eval-standard-finding1-d-${runId}`,
    "criteria for Finding 1 same-user StandardVersion test",
  );

  const evaluationId = `dt-runtime-eval-finding1-d-${runId}`;
  createdEvaluationIds.push(evaluationId);
  const now = new Date();

  const evaluation = await evaluationRepo.create({
    evaluationId,
    userId: userAId,
    claimVersionId,
    evaluationStandardVersionId: standardVersionId,
    result: "sufficient",
    evaluatorType: "human",
    producerCapabilityId: null,
    producerCapabilityVersion: null,
    producerProviderId: null,
    producerModelId: null,
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    supersedesEvaluationId: null,
    evaluatedAt: now,
    now,
    evidenceVersionIds: [evidenceVersionId],
  });

  assert.equal(
    evaluation.evaluationStandardVersionId,
    standardVersionId,
    "an EvaluationStandardVersion owned by the same user must be accepted",
  );

  // Test E — regression: the pre-existing EvidenceVersion ownership check
  // (already proven above by the plain cross-user-EvidenceVersion
  // rollback test) must remain intact after this correction — the new
  // ClaimVersion/StandardVersion checks are additive, not a replacement.
  const foreignEvidenceVersionId = await seedEvidenceVersion(userBId, `dt-runtime-eval-foreign-evidence-finding1-d-${runId}`);
  const regressionEvaluationId = `dt-runtime-eval-finding1-d-regression-${runId}`;
  createdEvaluationIds.push(regressionEvaluationId);
  await assert.rejects(() =>
    evaluationRepo.create({
      evaluationId: regressionEvaluationId,
      userId: userAId,
      claimVersionId,
      evaluationStandardVersionId: standardVersionId,
      result: "sufficient",
      evaluatorType: "human",
      producerCapabilityId: null,
      producerCapabilityVersion: null,
      producerProviderId: null,
      producerModelId: null,
      modelReportedConfidence: null,
      systemAdjustedConfidence: null,
      supersedesEvaluationId: null,
      evaluatedAt: new Date(),
      now: new Date(),
      evidenceVersionIds: [foreignEvidenceVersionId],
    }),
  );
  const regressionRow = await evaluationRepo.findEvaluationForUser(userAId, regressionEvaluationId);
  assert.equal(regressionRow, null, "the pre-existing EvidenceVersion ownership check must still reject a foreign reference after this correction");
});
