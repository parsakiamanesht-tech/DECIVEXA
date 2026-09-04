import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { and, eq, inArray, sql } from "drizzle-orm";
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
test("personal_intelligence_relationship_confirmation_events_relationship_id_sequence_unique: PostgreSQL's unique(relationship_id, sequence) index deterministically rejects a second row explicitly colliding on the same sequence, proving the documented backstop invariant without depending on Promise.all() timing", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-collision-${runId}`, "pending");

  const first = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "confirmed",
    actor: "user",
    occurredAt: new Date(),
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
        sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
            (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
            values (${randomUUID()}, ${relationshipId}, ${userAId}, 1, 'confirmed', 'user', now(), now())`,
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
    .from(personalIntelligenceRelationshipConfirmationEvents)
    .where(and(eq(personalIntelligenceRelationshipConfirmationEvents.relationshipId, relationshipId), eq(personalIntelligenceRelationshipConfirmationEvents.sequence, 1)));
  assert.equal(rows.length, 1, "exactly one row may exist at (relationship_id, sequence=1) - the rejected duplicate must not have been persisted");
});

// Founder-authorized coverage closure ("MIGRATION 0015 — REMAINING RUNTIME
// COVERAGE CLOSURE"), following the PostgreSQL 18 CI Evidence
// Reconciliation Audit's finding that 5 of the 9 required runtime
// behaviors had no implementing test at all for this table. Adds exactly:
// full multi-event sequence progression, read ordering, the three live
// CHECK-constraint rejections (action/actor/sequence), and a deterministic
// timestamp round-trip - no other behavior. Reuses the existing
// seedRelationship/seedClaimVersion helpers and the existing raw-SQL-insert
// pattern already established by the forced-collision test above; no new
// production code, repository method, schema, or migration is introduced.

function extractPgErrorCode(error: unknown): string | undefined {
  const pgError = error as { code?: string; cause?: { code?: string } };
  return pgError.code ?? pgError.cause?.code;
}

test("create(): sequential creates against the real database allocate strictly increasing sequence numbers for the same relationship (1 -> 2 -> 3)", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-progression-${runId}`, "pending");

  const first = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "pending",
    actor: "user",
    occurredAt: new Date(),
    now: new Date(),
  });
  assert.ok(first, "expected the first create() to succeed");
  assert.equal(first!.sequence, 1);

  const second = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "confirmed",
    actor: "user",
    occurredAt: new Date(),
    now: new Date(),
  });
  assert.ok(second, "expected the second create() to succeed");
  assert.equal(second!.sequence, 2);

  const third = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "rejected",
    actor: "user",
    occurredAt: new Date(),
    now: new Date(),
  });
  assert.ok(third, "expected the third create() to succeed");
  assert.equal(third!.sequence, 3);
});

test("findConfirmationEventsForRelationship(): returns events in sequence ASC order against real PostgreSQL, independent of insertion order", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-ordering-${runId}`, "pending");

  const idForSeq3 = randomUUID();
  const idForSeq1 = randomUUID();
  const idForSeq2 = randomUUID();
  const now = new Date();

  // Deliberately inserted out of natural (ascending-sequence) order via a
  // raw insert - bypassing the repository's own next-sequence computation
  // entirely, exactly like the forced-collision test above - so this
  // proves findConfirmationEventsForRelationship's real ORDER BY sequence
  // ASC clause, not merely that it returns rows in whatever order they
  // were inserted.
  await db.execute(
    sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
        (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
        values (${idForSeq3}, ${relationshipId}, ${userAId}, 3, 'rejected', 'user', ${now}, ${now})`,
  );
  await db.execute(
    sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
        (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
        values (${idForSeq1}, ${relationshipId}, ${userAId}, 1, 'pending', 'user', ${now}, ${now})`,
  );
  await db.execute(
    sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
        (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
        values (${idForSeq2}, ${relationshipId}, ${userAId}, 2, 'confirmed', 'user', ${now}, ${now})`,
  );

  const events = await repo.findConfirmationEventsForRelationship(userAId, relationshipId);

  assert.deepEqual(events.map((event) => event.sequence), [1, 2, 3], "expected ascending sequence order regardless of insertion order");
  assert.deepEqual(events.map((event) => event.id), [idForSeq1, idForSeq2, idForSeq3], "expected the row inserted second (sequence=1) to be returned first, proving ORDER BY sequence rather than insertion order");
});

test("personal_intelligence_relationship_confirmation_events_action_check: PostgreSQL itself rejects an action value outside ('pending','confirmed','rejected'), independent of any application-code validation", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-actioncheck-${runId}`, "pending");
  const invalidId = randomUUID();
  const now = new Date();

  // 'not_required' is deliberately chosen: it is a genuine value of the
  // shared confirmationState vocabulary but is explicitly never a valid
  // Confirmation Event action (personal-intelligence-relationship-confirmation.model.ts's
  // own comment: "not_required is never a valid event action") - a value
  // definitely outside this column's CHECK vocabulary, not an arbitrary
  // typo.
  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
            (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
            values (${invalidId}, ${relationshipId}, ${userAId}, 1, 'not_required', 'user', ${now}, ${now})`,
      ),
    (error: unknown) => {
      const code = extractPgErrorCode(error);
      assert.equal(code, "23514", `expected PostgreSQL check_violation (23514) for an invalid action, got ${code}`);
      return true;
    },
  );

  const rows = await db
    .select()
    .from(personalIntelligenceRelationshipConfirmationEvents)
    .where(eq(personalIntelligenceRelationshipConfirmationEvents.id, invalidId));
  assert.equal(rows.length, 0, "the rejected row must not have been persisted");
});

test("personal_intelligence_relationship_confirmation_events_actor_check: PostgreSQL itself rejects an actor value outside ('user'), independent of any application-code validation", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-actorcheck-${runId}`, "pending");
  const invalidId = randomUUID();
  const now = new Date();

  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
            (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
            values (${invalidId}, ${relationshipId}, ${userAId}, 1, 'confirmed', 'system', ${now}, ${now})`,
      ),
    (error: unknown) => {
      const code = extractPgErrorCode(error);
      assert.equal(code, "23514", `expected PostgreSQL check_violation (23514) for an invalid actor, got ${code}`);
      return true;
    },
  );

  const rows = await db
    .select()
    .from(personalIntelligenceRelationshipConfirmationEvents)
    .where(eq(personalIntelligenceRelationshipConfirmationEvents.id, invalidId));
  assert.equal(rows.length, 0, "the rejected row must not have been persisted");
});

test("personal_intelligence_relationship_confirmation_events_sequence_check: PostgreSQL itself rejects a sequence value below 1, independent of any application-code validation", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-sequencecheck-${runId}`, "pending");
  const invalidId = randomUUID();
  const now = new Date();

  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_relationship_confirmation_events
            (id, relationship_id, user_id, sequence, action, actor, occurred_at, created_at)
            values (${invalidId}, ${relationshipId}, ${userAId}, 0, 'confirmed', 'user', ${now}, ${now})`,
      ),
    (error: unknown) => {
      const code = extractPgErrorCode(error);
      assert.equal(code, "23514", `expected PostgreSQL check_violation (23514) for a sequence below 1, got ${code}`);
      return true;
    },
  );

  const rows = await db
    .select()
    .from(personalIntelligenceRelationshipConfirmationEvents)
    .where(eq(personalIntelligenceRelationshipConfirmationEvents.id, invalidId));
  assert.equal(rows.length, 0, "the rejected row must not have been persisted");
});

test("create(): occurredAt and createdAt survive a real PostgreSQL round-trip at millisecond precision", async () => {
  const relationshipId = await seedRelationship(userAId, `q1-runtime-relconfirm-timestamp-${runId}`, "pending");

  // A deterministic timestamp with a non-trivial, non-zero millisecond
  // component - not "new Date()" at assertion time - so a truncation or
  // timezone-normalization defect would be caught rather than accidentally
  // passing because the value happened to align to a round second.
  const occurredAt = new Date("2026-03-17T08:42:19.437Z");
  const now = new Date("2026-03-17T08:42:20.918Z");

  const created = await repo.create({
    id: randomUUID(),
    relationshipId,
    userId: userAId,
    action: "confirmed",
    actor: "user",
    occurredAt,
    now,
  });
  assert.ok(created, "expected create() to succeed");

  // Read back through a genuinely separate SELECT (findConfirmationEventsForRelationship),
  // not merely the INSERT...RETURNING result already held in `created` -
  // proving a real application-value -> INSERT -> SELECT -> application-value
  // round trip.
  const readBack = (await repo.findConfirmationEventsForRelationship(userAId, relationshipId))[0];
  assert.ok(readBack, "expected exactly one persisted event to be readable back");

  // PostgreSQL `timestamp with time zone` stores microsecond precision -
  // strictly finer than JavaScript's Date (millisecond precision) - so no
  // precision loss is expected in either direction; comparing exact
  // getTime() values is the correct assertion, not a normalized/truncated
  // one.
  assert.equal(readBack!.occurredAt.getTime(), occurredAt.getTime(), "occurredAt must round-trip exactly at millisecond precision");
  assert.equal(readBack!.createdAt.getTime(), now.getTime(), "createdAt must round-trip exactly at millisecond precision");
});
