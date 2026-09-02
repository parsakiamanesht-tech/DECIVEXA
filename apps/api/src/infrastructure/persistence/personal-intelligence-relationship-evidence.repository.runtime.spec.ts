import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { asc, eq, inArray } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
  personalIntelligenceRelationshipEvidence,
  personalIntelligenceRelationships,
} from "../../persistence/schema/personal-intelligence.schema";
import { DrizzlePersonalIntelligenceRelationshipEvidenceRepository } from "./personal-intelligence-relationship-evidence.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). This file's concurrency
// test is the live-execution counterpart of
// personal-intelligence-relationship-evidence.repository.unique-violation.spec.ts,
// which only simulates a 23505 via a hand-written stub error object and
// cannot prove real concurrent sequence-allocation contention actually
// produces one. Exercises the actual
// DrizzlePersonalIntelligenceRelationshipEvidenceRepository implementation
// unmodified; makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-relationship-evidence.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-relevidence-user-a-${runId}`;
const userBId = `q1-runtime-relevidence-user-b-${runId}`;
const createdClaimIds: string[] = [];
const createdRelationshipIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  if (createdRelationshipIds.length > 0) {
    await db.delete(personalIntelligenceRelationshipEvidence).where(inArray(personalIntelligenceRelationshipEvidence.relationshipId, createdRelationshipIds));
    await db.delete(personalIntelligenceRelationships).where(inArray(personalIntelligenceRelationships.id, createdRelationshipIds));
  }
  if (createdClaimIds.length > 0) {
    await db.delete(personalIntelligenceClaimVersions).where(inArray(personalIntelligenceClaimVersions.claimId, createdClaimIds));
    await db.delete(personalIntelligenceClaims).where(inArray(personalIntelligenceClaims.id, createdClaimIds));
  }
  await db.delete(users).where(inArray(users.id, [userAId, userBId]));
  await pool.end();
});

async function seedClaimVersion(ownerId: string, claimId: string): Promise<string> {
  createdClaimIds.push(claimId);
  const versionId = randomUUID();
  const now = new Date();
  await db.insert(personalIntelligenceClaims).values({
    id: claimId,
    userId: ownerId,
    claimType: "preference",
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(personalIntelligenceClaimVersions).values({
    id: versionId,
    claimId,
    userId: ownerId,
    version: 1,
    valueKind: "text",
    valueText: "seed value",
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
  return versionId;
}

async function seedRelationship(ownerId: string, relationshipId: string): Promise<string> {
  createdRelationshipIds.push(relationshipId);
  const sourceId = await seedClaimVersion(ownerId, `${relationshipId}-source`);
  const targetId = await seedClaimVersion(ownerId, `${relationshipId}-target`);
  await db.insert(personalIntelligenceRelationships).values({
    id: relationshipId,
    userId: ownerId,
    sourceClaimVersionId: sourceId,
    targetClaimVersionId: targetId,
    relationshipType: "related_fact",
    certainty: "certain",
    confirmationState: "not_required",
    provenance: "user_declared",
    createdAt: new Date(),
  });
  return relationshipId;
}

test("create(): ownership enforcement against real PostgreSQL - a relationshipId owned by a different user matches zero rows and returns null", async () => {
  const relationshipId = await seedRelationship(userBId, `q1-runtime-relevidence-ownership-${runId}`);

  const attempt = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    description: "attempted cross-user evidence attachment",
    evidenceVersionId: null,
    provenance: "user_declared",
    now: new Date(),
  });

  assert.equal(attempt, null, "cross-user create() must return null, never attach evidence to another user's Relationship");
});

test("create(): real concurrent contention on sequence allocation for the same relationshipId produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relevidence-concurrency-${runId}`);

  const [first, second] = await Promise.all([
    repo.create({
      id: randomUUID(),
      relationshipId,
      userId: userAId,
      description: "concurrent attempt A",
      evidenceVersionId: null,
      provenance: "system_derived",
      now: new Date(),
    }),
    repo.create({
      id: randomUUID(),
      relationshipId,
      userId: userAId,
      description: "concurrent attempt B",
      evidenceVersionId: null,
      provenance: "system_derived",
      now: new Date(),
    }),
  ]);

  const results = [first, second];
  const winners = results.filter((r) => r !== null);
  assert.equal(winners.length, 1, "exactly one concurrent create() must win under the real unique(relationship_id, sequence) constraint");
  assert.equal(results.filter((r) => r === null).length, 1, "exactly one concurrent create() must be rejected as null");
  assert.equal(winners[0]!.sequence, 1, "the sole winner must have been allocated sequence 1 - the loser's attempted allocation must not have consumed or skipped it");

  const rows = await db
    .select()
    .from(personalIntelligenceRelationshipEvidence)
    .where(eq(personalIntelligenceRelationshipEvidence.relationshipId, relationshipId))
    .orderBy(asc(personalIntelligenceRelationshipEvidence.sequence));
  assert.equal(rows.length, 1, "exactly one relationship-evidence row must exist after the race, not two, not zero");
});

test("create(): sequential creates against the real database allocate strictly increasing sequence numbers via the live coalesce(max(sequence))+1 subquery", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relevidence-sequence-${runId}`);

  const first = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    description: "first",
    evidenceVersionId: null,
    provenance: "user_declared",
    now: new Date(),
  });
  const second = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    description: "second",
    evidenceVersionId: null,
    provenance: "user_declared",
    now: new Date(),
  });
  const third = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    description: "third",
    evidenceVersionId: null,
    provenance: "user_declared",
    now: new Date(),
  });

  assert.equal(first!.sequence, 1);
  assert.equal(second!.sequence, 2);
  assert.equal(third!.sequence, 3);

  const rows = await repo.findEvidenceForRelationship(userAId, relationshipId);
  assert.deepEqual(rows.map((r) => r.sequence), [1, 2, 3]);
});
