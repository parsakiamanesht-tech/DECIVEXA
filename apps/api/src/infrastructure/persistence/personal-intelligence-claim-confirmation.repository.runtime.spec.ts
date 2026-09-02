import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray } from "drizzle-orm";
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

test("recordConfirmationEvent: real concurrent contention on sequence allocation for the same claimId produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted", async () => {
  const claimId = `q1-runtime-claimconfirm-concurrency-${runId}`;
  const versionId = await seedClaimVersion(userAId, claimId);

  const [first, second] = await Promise.all([
    repo.recordConfirmationEvent({
      eventId: randomUUID(),
      claimId,
      claimVersionId: versionId,
      userId: userAId,
      action: "confirmed",
      occurredAt: new Date(),
      now: new Date(),
    }),
    repo.recordConfirmationEvent({
      eventId: randomUUID(),
      claimId,
      claimVersionId: versionId,
      userId: userAId,
      action: "unconfirmed",
      occurredAt: new Date(),
      now: new Date(),
    }),
  ]);

  const results = [first, second];
  assert.equal(results.filter((r) => r !== null).length, 1, "exactly one concurrent recordConfirmationEvent must win under the real unique(claim_id, sequence) constraint");
  assert.equal(results.filter((r) => r === null).length, 1, "exactly one concurrent recordConfirmationEvent must be rejected as null");

  const rows = await db
    .select()
    .from(personalIntelligenceClaimConfirmationEvents)
    .where(eq(personalIntelligenceClaimConfirmationEvents.claimId, claimId));
  assert.equal(rows.length, 1, "exactly one confirmation-event row must exist after the race");
});
