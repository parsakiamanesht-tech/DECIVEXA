import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import { memoryRecords, memoryRecordVersions } from "../../persistence/schema/memory.schema";
import { DrizzleMemoryRecordRepository } from "./memory.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). Every assertion below
// requires a real PostgreSQL 18 connection - none of it can be proven by
// memory.repository.unique-violation.spec.ts (a stub DatabaseClient that
// only simulates a rejected .returning() promise) or by static/structural
// inspection. Exercises the actual DrizzleMemoryRecordRepository
// implementation unmodified; makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "memory.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzleMemoryRecordRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-memory-user-a-${runId}`;
const userBId = `q1-runtime-memory-user-b-${runId}`;
const createdRecordIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  if (createdRecordIds.length > 0) {
    await db.delete(memoryRecordVersions).where(inArray(memoryRecordVersions.recordId, createdRecordIds));
    await db.delete(memoryRecords).where(inArray(memoryRecords.id, createdRecordIds));
  }
  await db.delete(users).where(inArray(users.id, [userAId, userBId]));
  await pool.end();
});

test("appendLifecycleVersion: ownership enforcement against real PostgreSQL - a mismatched userId matches zero rows and returns null", async () => {
  const recordId = `q1-runtime-memory-ownership-${runId}`;
  createdRecordIds.push(recordId);
  const now = new Date();

  await repo.create({
    recordId,
    versionId: randomUUID(),
    userId: userAId,
    provenance: "observed",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.9,
    valueKind: "content",
    value: "original content",
    now,
  });

  const attempt = await repo.appendLifecycleVersion({
    recordId,
    versionId: randomUUID(),
    userId: userBId,
    expectedVersion: 1,
    lifecycle: "corrected",
    now: new Date(),
  });
  assert.equal(attempt, null, "cross-user appendLifecycleVersion must return null, never leak or mutate another user's memory record");

  const stillV1 = await repo.findVersionForUser(userAId, recordId, 2);
  assert.equal(stillV1, null);
});

test("appendLifecycleVersion: real concurrent contention on the same expectedVersion produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted", async () => {
  const recordId = `q1-runtime-memory-concurrency-${runId}`;
  createdRecordIds.push(recordId);
  const now = new Date();

  await repo.create({
    recordId,
    versionId: randomUUID(),
    userId: userAId,
    provenance: "observed",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.5,
    valueKind: "content",
    value: "v1",
    now,
  });

  const [first, second] = await Promise.all([
    repo.appendLifecycleVersion({
      recordId,
      versionId: randomUUID(),
      userId: userAId,
      expectedVersion: 1,
      lifecycle: "corrected",
      now: new Date(),
    }),
    repo.appendLifecycleVersion({
      recordId,
      versionId: randomUUID(),
      userId: userAId,
      expectedVersion: 1,
      lifecycle: "corrected",
      now: new Date(),
    }),
  ]);

  const results = [first, second];
  assert.equal(results.filter((r) => r !== null).length, 1, "exactly one concurrent append must win under the real unique(record_id, version) constraint");
  assert.equal(results.filter((r) => r === null).length, 1, "exactly one concurrent append must be rejected as null, not throw, not silently duplicate");

  const allVersions = await db.select().from(memoryRecordVersions).where(eq(memoryRecordVersions.recordId, recordId));
  assert.equal(allVersions.length, 2);
});

test("deleteRecordContent: content is genuinely nulled on every existing version row in the real database, not merely a soft-delete flag on the newest one", async () => {
  const recordId = `q1-runtime-memory-delete-${runId}`;
  createdRecordIds.push(recordId);
  const now = new Date();

  await repo.create({
    recordId,
    versionId: randomUUID(),
    userId: userAId,
    provenance: "observed",
    observedAt: now,
    acceptedAt: now,
    confidence: 0.5,
    valueKind: "content",
    value: "sensitive original content",
    now,
  });
  const v2 = await repo.appendLifecycleVersion({
    recordId,
    versionId: randomUUID(),
    userId: userAId,
    expectedVersion: 1,
    lifecycle: "active",
    now: new Date(),
  });
  assert.ok(v2, "expected the version-2 append to succeed as the setup step for this test");

  const deleted = await repo.deleteRecordContent({
    recordId,
    versionId: randomUUID(),
    userId: userAId,
    expectedVersion: 2,
    now: new Date(),
  });
  assert.ok(deleted);
  assert.equal(deleted!.valueKind, null);
  assert.equal(deleted!.value, null);

  // The invariant under test: EVERY prior version row, not only the new
  // "current" one, must have had its content nulled by the real UPDATE
  // issued inside deleteRecordContent's transaction - this can only be
  // observed by reading the actual rows back from PostgreSQL.
  const allVersions = await db
    .select()
    .from(memoryRecordVersions)
    .where(eq(memoryRecordVersions.recordId, recordId));
  assert.equal(allVersions.length, 3, "expected exactly three version rows: v1, v2, and the deletion version");
  for (const row of allVersions) {
    assert.equal(row.valueKind, null, `expected version ${row.version} to have its valueKind nulled`);
    assert.equal(row.value, null, `expected version ${row.version} to have its value nulled`);
  }
});
