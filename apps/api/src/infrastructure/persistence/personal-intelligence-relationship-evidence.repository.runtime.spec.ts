import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
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

// Founder-authorized test-design correction (forensic audit of CI Run
// #359): the prior version of this test used Promise.all() to launch two
// concurrent create() calls and asserted exactly one must win. That
// assertion was non-deterministic - it depends on whether the two calls'
// single-statement, unlocked `coalesce((select max(sequence)...), 0) + 1`
// read phases genuinely overlap at the database engine level, which
// Promise.all() does not guarantee (both calls may legitimately succeed
// with distinct, non-colliding sequence numbers if the second's read
// happens after the first has already committed - exactly what CI Run
// #359 observed: two valid rows, sequence 1 and 2, no data corruption).
// The repository's own comment on this method describes the
// unique(relationship_id, sequence) index as a backstop against two
// concurrent calls computing the same next sequence - a conditional
// guarantee for an actual collision, not a claim that every concurrent
// invocation collides. This test proves that conditional backstop
// deterministically, by forcing the exact collision directly at the SQL
// level instead of hoping Promise.all() produces one.
test("personal_intelligence_relationship_evidence_relationship_id_sequence_unique: PostgreSQL's unique(relationship_id, sequence) index deterministically rejects a second row explicitly colliding on the same sequence, proving the documented backstop invariant without depending on Promise.all() timing", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relevidence-collision-${runId}`);

  const first = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    description: "uncontended first insert",
    evidenceVersionId: null,
    provenance: "system_derived",
    now: new Date(),
  });
  assert.ok(first, "expected the first, uncontended create() to succeed");
  assert.equal(first!.sequence, 1);

  // Deliberately forces the exact tuple the first row above already
  // occupies - (relationship_id, sequence=1) - via a raw insert that
  // bypasses the repository's own sequence-computation entirely. This
  // proves the real PostgreSQL constraint itself, not a probabilistic
  // race.
  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_relationship_evidence
            (id, relationship_id, user_id, sequence, description, evidence_version_id, provenance, created_at)
            values (${randomUUID()}, ${relationshipId}, ${userAId}, 1, 'deliberately colliding second insert', null, 'system_derived', now())`,
      ),
    (error: unknown) => {
      const pgError = error as { code?: string; cause?: { code?: string } };
      const code = pgError.code ?? pgError.cause?.code;
      assert.equal(code, "23505", `expected PostgreSQL unique-violation (23505) on the deliberately duplicated (relationship_id, sequence) pair, got ${code}`);
      return true;
    },
  );

  const rows = await db
    .select()
    .from(personalIntelligenceRelationshipEvidence)
    .where(and(eq(personalIntelligenceRelationshipEvidence.relationshipId, relationshipId), eq(personalIntelligenceRelationshipEvidence.sequence, 1)))
    .orderBy(asc(personalIntelligenceRelationshipEvidence.sequence));
  assert.equal(rows.length, 1, "exactly one row may exist at (relationship_id, sequence=1) - the rejected duplicate must not have been persisted");
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
