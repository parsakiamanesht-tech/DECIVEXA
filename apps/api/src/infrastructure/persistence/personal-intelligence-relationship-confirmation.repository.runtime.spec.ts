import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
  personalIntelligenceRelationshipConfirmationEvents,
  personalIntelligenceRelationships,
  type PersonalIntelligenceRelationshipConfirmationState,
} from "../../persistence/schema/personal-intelligence.schema";
import { DrizzlePersonalIntelligenceRelationshipConfirmationRepository } from "./personal-intelligence-relationship-confirmation.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). This file's guard test
// (a 'not_required' Relationship must reject every confirmation event) and
// concurrency test are the live-execution counterparts of
// personal-intelligence-relationship-confirmation.repository.unique-violation.spec.ts,
// which only simulates a 23505 via a hand-written stub error object and
// cannot evaluate the real `ne(confirmationState, 'not_required')` WHERE
// clause against genuine relational data. Exercises the actual
// DrizzlePersonalIntelligenceRelationshipConfirmationRepository
// implementation unmodified; makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-relationship-confirmation.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzlePersonalIntelligenceRelationshipConfirmationRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-relconfirm-user-a-${runId}`;
const userBId = `q1-runtime-relconfirm-user-b-${runId}`;
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
    await db.delete(personalIntelligenceRelationshipConfirmationEvents).where(inArray(personalIntelligenceRelationshipConfirmationEvents.relationshipId, createdRelationshipIds));
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

async function seedRelationship(
  ownerId: string,
  relationshipId: string,
  confirmationState: PersonalIntelligenceRelationshipConfirmationState,
): Promise<string> {
  createdRelationshipIds.push(relationshipId);
  const sourceId = await seedClaimVersion(ownerId, `${relationshipId}-source`);
  const targetId = await seedClaimVersion(ownerId, `${relationshipId}-target`);
  await db.insert(personalIntelligenceRelationships).values({
    id: relationshipId,
    userId: ownerId,
    sourceClaimVersionId: sourceId,
    targetClaimVersionId: targetId,
    relationshipType: "related_fact",
    certainty: "uncertain",
    confirmationState,
    provenance: "ai_hypothesis",
    createdAt: new Date(),
  });
  return relationshipId;
}

test("create(): a 'not_required' Relationship rejects every confirmation event against real PostgreSQL - the real ne(confirmation_state, 'not_required') WHERE clause matches zero rows and returns null", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-notrequired-${runId}`, "not_required");

  const attempt = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "confirmed",
    actor: "user",
    occurredAt: new Date(),
    now: new Date(),
  });

  assert.equal(attempt, null, "a Relationship created with confirmationState='not_required' must reject every confirmation event, even from its genuine owner");
});

test("create(): ownership enforcement against real PostgreSQL - a relationshipId owned by a different user matches zero rows and returns null", async () => {
  const relationshipId = await seedRelationship(userBId, `q1-runtime-relconfirm-ownership-${runId}`, "pending");

  const attempt = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "confirmed",
    actor: "user",
    occurredAt: new Date(),
    now: new Date(),
  });

  assert.equal(attempt, null, "cross-user create() must return null, never record a confirmation event against another user's Relationship");
});

test("create(): real concurrent contention on sequence allocation for the same relationshipId produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-concurrency-${runId}`, "pending");

  const [first, second] = await Promise.all([
    repo.create({
      id: randomUUID(),
      relationshipId,
      userId: userAId,
      action: "confirmed",
      actor: "user",
      occurredAt: new Date(),
      now: new Date(),
    }),
    repo.create({
      id: randomUUID(),
      relationshipId,
      userId: userAId,
      action: "rejected",
      actor: "user",
      occurredAt: new Date(),
      now: new Date(),
    }),
  ]);

  const results = [first, second];
  assert.equal(results.filter((r) => r !== null).length, 1, "exactly one concurrent create() must win under the real unique(relationship_id, sequence) constraint");
  assert.equal(results.filter((r) => r === null).length, 1, "exactly one concurrent create() must be rejected as null");

  const rows = await db
    .select()
    .from(personalIntelligenceRelationshipConfirmationEvents)
    .where(eq(personalIntelligenceRelationshipConfirmationEvents.relationshipId, relationshipId));
  assert.equal(rows.length, 1, "exactly one confirmation-event row must exist after the race");
});
