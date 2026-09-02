import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import { evidence, evidenceVersions } from "../../persistence/schema/evidence.schema";
import {
  personalIntelligenceInferenceEvidenceReferences,
  personalIntelligenceInferenceLifecycleEvents,
  personalIntelligenceInferences,
} from "../../persistence/schema/personal-intelligence-inference.schema";
import { DrizzlePersonalIntelligenceInferenceRepository } from "./personal-intelligence-inference.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). This repository has NO
// existing spec file of any kind (no structural, no unique-violation) -
// the runtime coverage below is this repository's first test coverage of
// any form. Exercises the actual
// DrizzlePersonalIntelligenceInferenceRepository implementation
// unmodified; makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-inference.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzlePersonalIntelligenceInferenceRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-inference-user-a-${runId}`;
const userBId = `q1-runtime-inference-user-b-${runId}`;
const createdEvidenceIds: string[] = [];
const createdInferenceIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  if (createdInferenceIds.length > 0) {
    await db.delete(personalIntelligenceInferenceLifecycleEvents).where(inArray(personalIntelligenceInferenceLifecycleEvents.inferenceId, createdInferenceIds));
    await db.delete(personalIntelligenceInferenceEvidenceReferences).where(inArray(personalIntelligenceInferenceEvidenceReferences.inferenceId, createdInferenceIds));
    await db.delete(personalIntelligenceInferences).where(inArray(personalIntelligenceInferences.id, createdInferenceIds));
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

test("create(): a cross-user EvidenceVersion reference rolls back the ENTIRE transaction against real PostgreSQL - the already-inserted Inference row does not survive (Invariant 4/Contract §I - not reproducible without live execution across multiple real tables)", async () => {
  const foreignEvidenceVersionId = await seedEvidenceVersion(userBId, `q1-runtime-inference-foreign-evidence-${runId}`);
  const inferenceId = `q1-runtime-inference-rollback-${runId}`;
  createdInferenceIds.push(inferenceId);
  const now = new Date();

  await assert.rejects(() =>
    repo.create({
      inferenceId,
      userId: userAId,
      claimType: "preference",
      valueKind: "text",
      valueText: "attempted cross-user grounding",
      generatedAt: now,
      now,
      producerCapabilityId: "q1-runtime-capability",
      producerCapabilityVersion: "1",
      producerProviderId: "q1-runtime-provider",
      producerModelId: "q1-runtime-model",
      modelReportedConfidence: null,
      systemAdjustedConfidence: null,
      evidenceVersionIds: [foreignEvidenceVersionId],
      claimContextIds: [],
      initialLifecycleEventId: randomUUID(),
    }),
  );

  const inferenceRow = await repo.findInferenceForUser(userAId, inferenceId);
  assert.equal(inferenceRow, null, "the Inference row must not persist when a supplied EvidenceVersion reference fails real ownership verification - proof of real transactional atomicity across evidence_versions and personal_intelligence_inferences");

  const lifecycleRows = await db
    .select()
    .from(personalIntelligenceInferenceLifecycleEvents)
    .where(eq(personalIntelligenceInferenceLifecycleEvents.inferenceId, inferenceId));
  assert.equal(lifecycleRows.length, 0, "no initial 'proposed' lifecycle-history row may survive the rollback either");
});

test("transitionLifecycle: real concurrent contention on the same expectedFromStatus produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted", async () => {
  const evidenceVersionId = await seedEvidenceVersion(userAId, `q1-runtime-inference-own-evidence-${runId}`);
  const inferenceId = `q1-runtime-inference-concurrency-${runId}`;
  createdInferenceIds.push(inferenceId);
  const now = new Date();

  await repo.create({
    inferenceId,
    userId: userAId,
    claimType: "preference",
    valueKind: "text",
    valueText: "genuine grounded inference",
    generatedAt: now,
    now,
    producerCapabilityId: "q1-runtime-capability",
    producerCapabilityVersion: "1",
    producerProviderId: "q1-runtime-provider",
    producerModelId: "q1-runtime-model",
    modelReportedConfidence: 0.7,
    systemAdjustedConfidence: null,
    evidenceVersionIds: [evidenceVersionId],
    claimContextIds: [],
    initialLifecycleEventId: randomUUID(),
  });

  const [first, second] = await Promise.all([
    repo.transitionLifecycle({
      inferenceId,
      userId: userAId,
      lifecycleEventId: randomUUID(),
      expectedFromStatus: "proposed",
      toStatus: "confirmed",
      transitionedAt: new Date(),
      now: new Date(),
    }),
    repo.transitionLifecycle({
      inferenceId,
      userId: userAId,
      lifecycleEventId: randomUUID(),
      expectedFromStatus: "proposed",
      toStatus: "rejected",
      transitionedAt: new Date(),
      now: new Date(),
    }),
  ]);

  const results = [first, second];
  assert.equal(results.filter((r) => r !== null).length, 1, "exactly one concurrent transition must win under the real unique(inference_id, sequence) constraint");
  assert.equal(results.filter((r) => r === null).length, 1, "exactly one concurrent transition must be rejected as null");

  const allEvents = await db
    .select()
    .from(personalIntelligenceInferenceLifecycleEvents)
    .where(eq(personalIntelligenceInferenceLifecycleEvents.inferenceId, inferenceId));
  assert.equal(allEvents.length, 2, "exactly two lifecycle-history rows must exist - the initial 'proposed' entry plus exactly one successful transition");
});

test("transitionLifecycle: ownership enforcement against real PostgreSQL - a mismatched userId matches zero rows and returns null", async () => {
  const evidenceVersionId = await seedEvidenceVersion(userAId, `q1-runtime-inference-ownership-evidence-${runId}`);
  const inferenceId = `q1-runtime-inference-ownership-${runId}`;
  createdInferenceIds.push(inferenceId);
  const now = new Date();

  await repo.create({
    inferenceId,
    userId: userAId,
    claimType: "preference",
    valueKind: "text",
    valueText: "owned by user A",
    generatedAt: now,
    now,
    producerCapabilityId: "q1-runtime-capability",
    producerCapabilityVersion: "1",
    producerProviderId: "q1-runtime-provider",
    producerModelId: "q1-runtime-model",
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
    evidenceVersionIds: [evidenceVersionId],
    claimContextIds: [],
    initialLifecycleEventId: randomUUID(),
  });

  const attempt = await repo.transitionLifecycle({
    inferenceId,
    userId: userBId,
    lifecycleEventId: randomUUID(),
    expectedFromStatus: "proposed",
    toStatus: "confirmed",
    transitionedAt: new Date(),
    now: new Date(),
  });
  assert.equal(attempt, null, "cross-user transitionLifecycle must return null, never mutate another user's inference lifecycle");
});
