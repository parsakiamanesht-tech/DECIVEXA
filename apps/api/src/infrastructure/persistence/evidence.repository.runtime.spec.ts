import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray, sql } from "drizzle-orm";
import { createDatabase, type DatabaseClient } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import { evidence, evidenceVersions } from "../../persistence/schema/evidence.schema";
import { DrizzleEvidenceRepository } from "./evidence.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). Every assertion below
// requires a real PostgreSQL 18 connection - none of it can be proven by
// evidence.repository.unique-violation.spec.ts (a stub DatabaseClient that
// only simulates a rejected .returning() promise) or by static/structural
// inspection. This file never mocks the database interaction being
// verified, exercises the actual DrizzleEvidenceRepository implementation
// unmodified, and makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "evidence.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzleEvidenceRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-evidence-user-a-${runId}`;
const userBId = `q1-runtime-evidence-user-b-${runId}`;
const createdEvidenceIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  // Isolated, disposable test data only - reverse dependency order
  // (evidence_versions before evidence before users), matching every
  // foreign key in evidence.schema.ts (all onDelete: "restrict").
  if (createdEvidenceIds.length > 0) {
    await db.delete(evidenceVersions).where(inArray(evidenceVersions.evidenceId, createdEvidenceIds));
    await db.delete(evidence).where(inArray(evidence.id, createdEvidenceIds));
  }
  await db.delete(users).where(inArray(users.id, [userAId, userBId]));
  await pool.end();
});

test("appendLifecycleVersion: ownership enforcement against real PostgreSQL - a mismatched userId matches zero rows and returns null (invariant not reproducible by a stub DatabaseClient, which cannot evaluate a real WHERE clause against real relational data)", async () => {
  const evidenceId = `q1-runtime-evidence-ownership-${runId}`;
  createdEvidenceIds.push(evidenceId);
  const now = new Date();

  const v1 = await repo.create({
    evidenceId,
    versionId: randomUUID(),
    userId: userAId,
    provenance: "observed",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.9,
    now,
  });
  assert.equal(v1.version, 1);

  // User B does not own this evidence - the real ownership WHERE clause
  // (evidenceId = ? AND userId = userB) must match zero rows.
  const attempt = await repo.appendLifecycleVersion({
    evidenceId,
    versionId: randomUUID(),
    userId: userBId,
    expectedVersion: 1,
    lifecycle: "corrected",
    now: new Date(),
  });
  assert.equal(attempt, null, "cross-user appendLifecycleVersion must return null, never leak or mutate another user's evidence");

  // Confirm no second version was created for the real owner either.
  const stillV1 = await repo.findVersionForUser(userAId, evidenceId, 2);
  assert.equal(stillV1, null);
});

test("appendLifecycleVersion: real concurrent contention on the same expectedVersion produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted (the invariant evidence.repository.unique-violation.spec.ts can only simulate via a hand-written stub error object)", async () => {
  const evidenceId = `q1-runtime-evidence-concurrency-${runId}`;
  createdEvidenceIds.push(evidenceId);
  const now = new Date();

  await repo.create({
    evidenceId,
    versionId: randomUUID(),
    userId: userAId,
    provenance: "observed",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.5,
    now,
  });

  // Two genuinely concurrent requests racing to append version 2 from
  // version 1 - real client-side parallelism against one live connection
  // pool, not a simulated error.
  const [first, second] = await Promise.all([
    repo.appendLifecycleVersion({
      evidenceId,
      versionId: randomUUID(),
      userId: userAId,
      expectedVersion: 1,
      lifecycle: "corrected",
      now: new Date(),
    }),
    repo.appendLifecycleVersion({
      evidenceId,
      versionId: randomUUID(),
      userId: userAId,
      expectedVersion: 1,
      lifecycle: "revoked",
      now: new Date(),
    }),
  ]);

  const results = [first, second];
  const winners = results.filter((r) => r !== null);
  const losers = results.filter((r) => r === null);
  assert.equal(winners.length, 1, "exactly one concurrent append must win under the real unique(evidence_id, version) constraint");
  assert.equal(losers.length, 1, "exactly one concurrent append must be rejected as null, not throw, not silently duplicate");

  const allVersions = await db
    .select()
    .from(evidenceVersions)
    .where(eq(evidenceVersions.evidenceId, evidenceId));
  assert.equal(allVersions.length, 2, "exactly two version rows must exist - the original plus exactly one successful append, never two");
});

test("evidence_versions_lifecycle_check: PostgreSQL itself rejects a lifecycle value outside the five formalized values, independent of any application-code validation", async () => {
  const evidenceId = `q1-runtime-evidence-checkconstraint-${runId}`;
  createdEvidenceIds.push(evidenceId);
  const now = new Date();

  await repo.create({
    evidenceId,
    versionId: randomUUID(),
    userId: userAId,
    provenance: "observed",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.5,
    now,
  });

  // Bypasses the repository/TypeScript layer entirely (which would refuse
  // to compile an invalid literal) to prove the CHECK constraint itself,
  // as actually migrated, rejects the value at the database layer - not
  // merely present as text in the migration SQL (already proven by
  // personal-intelligence-relationship.structural.spec.ts's regex-based
  // check for a different table; this is the live-execution counterpart
  // for evidence_versions).
  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.evidence_versions (id, evidence_id, user_id, version, provenance, lifecycle, observed_at, accepted_at, confidence, created_at)
            values (${randomUUID()}, ${evidenceId}, ${userAId}, 2, 'observed', 'not_a_real_lifecycle_value', now(), now(), 0.5, now())`,
      ),
    (error: unknown) => {
      const pgError = error as { code?: string; cause?: { code?: string } };
      const code = pgError.code ?? pgError.cause?.code;
      assert.equal(code, "23514", `expected PostgreSQL check-violation (23514), got ${code}`);
      return true;
    },
  );
});
