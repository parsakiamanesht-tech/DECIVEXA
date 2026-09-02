import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { and, eq, inArray, sql } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import {
  personalIntelligenceClaimConfirmationEvents,
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
} from "../../persistence/schema/personal-intelligence.schema";
import { DrizzlePersonalIntelligenceClaimConfirmationRepository } from "./personal-intelligence-claim-confirmation.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). This repository's only
// existing coverage is
// personal-intelligence-claim-confirmation.repository.unique-violation.spec.ts,
// a stub DatabaseClient that only simulates a rejected .returning()
// promise - it cannot evaluate the real three-way ownership WHERE clause
// (claimVersionId = ? AND claimId = ? AND userId = ?) against genuine
// relational data. Exercises the actual
// DrizzlePersonalIntelligenceClaimConfirmationRepository implementation
// unmodified; makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-claim-confirmation.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzlePersonalIntelligenceClaimConfirmationRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-claimconfirm-user-a-${runId}`;
const userBId = `q1-runtime-claimconfirm-user-b-${runId}`;
const createdClaimIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  if (createdClaimIds.length > 0) {
    await db.delete(personalIntelligenceClaimConfirmationEvents).where(inArray(personalIntelligenceClaimConfirmationEvents.claimId, createdClaimIds));
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

test("recordConfirmationEvent: ownership enforcement against real PostgreSQL - a claimVersionId owned by a different user matches zero rows and returns null", async () => {
  const claimId = `q1-runtime-claimconfirm-ownership-${runId}`;
  const versionId = await seedClaimVersion(userBId, claimId);

  const attempt = await repo.recordConfirmationEvent({
    eventId: randomUUID(),
    claimId,
    claimVersionId: versionId,
    userId: userAId,
    action: "confirmed",
    occurredAt: new Date(),
    now: new Date(),
  });

  assert.equal(attempt, null, "cross-user recordConfirmationEvent must return null, never confirm another user's ClaimVersion");
});

test("recordConfirmationEvent: a claimVersionId that genuinely belongs to a DIFFERENT claim (real cross-claim mismatch, same user) matches zero rows and returns null", async () => {
  const realClaimId = `q1-runtime-claimconfirm-realclaim-${runId}`;
  const otherClaimId = `q1-runtime-claimconfirm-otherclaim-${runId}`;
  await seedClaimVersion(userAId, realClaimId);
  const otherVersionId = await seedClaimVersion(userAId, otherClaimId);

  // otherVersionId genuinely exists and genuinely belongs to userA - but
  // not under realClaimId. This proves the three-way WHERE clause
  // (claimVersionId AND claimId AND userId all matching) is evaluated as
  // a single real conjunction, not three independently-satisfiable checks
  // - a fact a stub DatabaseClient cannot represent.
  const attempt = await repo.recordConfirmationEvent({
    eventId: randomUUID(),
    claimId: realClaimId,
    claimVersionId: otherVersionId,
    userId: userAId,
    action: "confirmed",
    occurredAt: new Date(),
    now: new Date(),
  });

  assert.equal(attempt, null, "a ClaimVersion belonging to a different Claim must be rejected even though it belongs to the correct user");
});

// Founder-authorized test-design correction (forensic audit of CI Run
// #359): the prior version of this test used Promise.all() to launch two
// concurrent recordConfirmationEvent() calls and asserted exactly one must
// win. That assertion was non-deterministic - it depends on whether the
// two calls' single-statement, unlocked
// `coalesce((select max(sequence)...), 0) + 1` read phases genuinely
// overlap at the database engine level, which Promise.all() does not
// guarantee (both calls may legitimately succeed with distinct,
// non-colliding sequence numbers if the second's read happens after the
// first has already committed - exactly what CI Run #359 observed: two
// valid rows, sequence 1 and 2, no data corruption). The repository's own
// comment on this method describes the unique(claim_id, sequence) index
// as "the database-enforced backstop against two concurrent calls
// computing the same next sequence" - a conditional guarantee for an
// actual collision, not a claim that every concurrent invocation
// collides. This test proves that conditional backstop deterministically,
// by forcing the exact collision directly at the SQL level instead of
// hoping Promise.all() produces one.
test("personal_intelligence_claim_confirmation_events_claim_id_sequence_unique: PostgreSQL's unique(claim_id, sequence) index deterministically rejects a second row explicitly colliding on the same sequence, proving the documented backstop invariant without depending on Promise.all() timing", async () => {
  const claimId = `q1-runtime-claimconfirm-collision-${runId}`;
  const versionId = await seedClaimVersion(userAId, claimId);

  const first = await repo.recordConfirmationEvent({
    eventId: randomUUID(),
    claimId,
    claimVersionId: versionId,
    userId: userAId,
    action: "confirmed",
    occurredAt: new Date(),
    now: new Date(),
  });
  assert.ok(first, "expected the first, uncontended recordConfirmationEvent to succeed");
  assert.equal(first!.sequence, 1);

  // Deliberately forces the exact tuple the first row above already
  // occupies - (claim_id, sequence=1) - via a raw insert that bypasses
  // the repository's own sequence-computation entirely. This proves the
  // real PostgreSQL constraint itself, not a probabilistic race.
  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_claim_confirmation_events
            (id, claim_id, claim_version_id, user_id, sequence, action, occurred_at, created_at)
            values (${randomUUID()}, ${claimId}, ${versionId}, ${userAId}, 1, 'confirmed', now(), now())`,
      ),
    (error: unknown) => {
      const pgError = error as { code?: string; cause?: { code?: string } };
      const code = pgError.code ?? pgError.cause?.code;
      assert.equal(code, "23505", `expected PostgreSQL unique-violation (23505) on the deliberately duplicated (claim_id, sequence) pair, got ${code}`);
      return true;
    },
  );

  const rows = await db
    .select()
    .from(personalIntelligenceClaimConfirmationEvents)
    .where(and(eq(personalIntelligenceClaimConfirmationEvents.claimId, claimId), eq(personalIntelligenceClaimConfirmationEvents.sequence, 1)));
  assert.equal(rows.length, 1, "exactly one row may exist at (claim_id, sequence=1) - the rejected duplicate must not have been persisted");
});
