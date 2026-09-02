import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { inArray, sql } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
  personalIntelligenceRelationships,
} from "../../persistence/schema/personal-intelligence.schema";
import { DrizzlePersonalIntelligenceRelationshipRepository } from "./personal-intelligence-relationship.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). This repository's only
// existing coverage is personal-intelligence-relationship.structural.spec.ts,
// which is static source-text grep and says so explicitly in its own test
// name: "runtime atomicity itself is not verifiable without a live
// database" (line 102). This file is that live-database counterpart.
// Exercises the actual DrizzlePersonalIntelligenceRelationshipRepository
// implementation unmodified; makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-relationship.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzlePersonalIntelligenceRelationshipRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-relationship-user-a-${runId}`;
const userBId = `q1-runtime-relationship-user-b-${runId}`;
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

test("create(): ownership of BOTH sourceClaimVersionId and targetClaimVersionId is verified against real relational data - a target owned by a different user matches zero rows and returns null (the exact invariant the repository's own structural test names as unverifiable without a live database)", async () => {
  const sourceId = await seedClaimVersion(userAId, `q1-runtime-relationship-source-${runId}`);
  const foreignTargetId = await seedClaimVersion(userBId, `q1-runtime-relationship-foreign-target-${runId}`);

  const relationshipId = `q1-runtime-relationship-ownership-${runId}`;
  const attempt = await repo.create({
    id: relationshipId,
    userId: userAId,
    sourceClaimVersionId: sourceId,
    targetClaimVersionId: foreignTargetId,
    relationshipType: "related_fact",
    certainty: "certain",
    confirmationState: "not_required",
    provenance: "user_declared",
    now: new Date(),
  });

  assert.equal(attempt, null, "a Relationship spanning two different users' ClaimVersions must never be created, even when the caller's own userId is correct");

  const found = await repo.findRelationshipForUser(userAId, relationshipId);
  assert.equal(found, null, "no Relationship row may exist under this id after a rejected cross-user create()");
});

test("create(): a genuine same-user Relationship persists and round-trips exactly through real PostgreSQL", async () => {
  const sourceId = await seedClaimVersion(userAId, `q1-runtime-relationship-valid-source-${runId}`);
  const targetId = await seedClaimVersion(userAId, `q1-runtime-relationship-valid-target-${runId}`);

  const relationshipId = `q1-runtime-relationship-valid-${runId}`;
  createdRelationshipIds.push(relationshipId);
  const created = await repo.create({
    id: relationshipId,
    userId: userAId,
    sourceClaimVersionId: sourceId,
    targetClaimVersionId: targetId,
    relationshipType: "refinement",
    certainty: "uncertain",
    confirmationState: "pending",
    provenance: "ai_hypothesis",
    now: new Date(),
  });

  assert.ok(created, "expected a same-user Relationship to be created successfully");
  assert.equal(created!.relationshipType, "refinement");
  assert.equal(created!.certainty, "uncertain");
  assert.equal(created!.confirmationState, "pending");

  const found = await repo.findRelationshipForUser(userAId, relationshipId);
  assert.ok(found);
  assert.equal(found!.sourceClaimVersionId, sourceId);
  assert.equal(found!.targetClaimVersionId, targetId);
});

test("personal_intelligence_relationships_relationship_type_check: PostgreSQL itself rejects a relationship_type outside the five Founder-formalized values, independent of any application-code validation", async () => {
  const sourceId = await seedClaimVersion(userAId, `q1-runtime-relationship-checkconstraint-source-${runId}`);
  const targetId = await seedClaimVersion(userAId, `q1-runtime-relationship-checkconstraint-target-${runId}`);
  const relationshipId = `q1-runtime-relationship-checkconstraint-${runId}`;

  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_relationships
            (id, user_id, source_claim_version_id, target_claim_version_id, relationship_type, certainty, confirmation_state, provenance, created_at)
            values (${relationshipId}, ${userAId}, ${sourceId}, ${targetId}, 'same_claim', 'certain', 'not_required', 'user_declared', now())`,
      ),
    (error: unknown) => {
      const pgError = error as { code?: string; cause?: { code?: string } };
      const code = pgError.code ?? pgError.cause?.code;
      assert.equal(code, "23514", `expected PostgreSQL check-violation (23514) for the deliberately-excluded 'same_claim' value, got ${code}`);
      return true;
    },
  );
});
