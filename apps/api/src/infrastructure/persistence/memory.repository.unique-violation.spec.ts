import assert from "node:assert/strict";
import test from "node:test";
import { DrizzleMemoryRecordRepository } from "./memory.repository";
import type { DatabaseClient } from "../../persistence/database";

// Scoped repair verification — Founder-authorized concurrency defect fix
// (Memory State Reconciliation + M-2 Scoped Repair). The pre-repair
// isUniqueViolation checked only top-level error.code, the same defect
// class already found and repaired in
// personal-intelligence-relationship-evidence.repository.ts and
// personal-intelligence-relationship-confirmation.repository.ts: Drizzle's
// node-postgres driver wraps the raw pg error (code "23505") under
// error.cause rather than exposing it as error.code directly, which would
// cause a losing concurrent appendLifecycleVersion()/deleteRecordContent()
// call to throw an unhandled DrizzleQueryError instead of returning null.
// These tests exercise appendLifecycleVersion()'s actual catch behavior
// against both error shapes, through a minimal stub DatabaseClient — the
// private isUniqueViolation helper is not exported, so this proves the fix
// through repository behavior, not by reaching into the helper directly.
// appendLifecycleVersion() and deleteRecordContent() share the exact same
// module-level isUniqueViolation function, so this coverage proves the fix
// for both call sites without duplicating the same assertions twice.

function makeStubDb(rejection: unknown): DatabaseClient {
  return {
    insert: () => ({
      select: () => ({
        returning: () => Promise.reject(rejection),
      }),
    }),
  } as unknown as DatabaseClient;
}

const validInput = {
  userId: "user-1",
  recordId: "record-1",
  versionId: "version-2",
  expectedVersion: 1,
  lifecycle: "corrected" as const,
  now: new Date("2026-01-01T00:00:00.000Z"),
};

test("appendLifecycleVersion() returns null when the raw pg error exposes code 23505 directly (error.code)", async () => {
  const repo = new DrizzleMemoryRecordRepository(makeStubDb({ code: "23505" }));

  const result = await repo.appendLifecycleVersion(validInput);

  assert.equal(result, null);
});

test("appendLifecycleVersion() returns null when PostgreSQL's 23505 is wrapped under error.cause.code (Drizzle's DrizzleQueryError shape - the exact defect class found and repaired elsewhere in this repository)", async () => {
  const wrapped = {
    query: "insert into ...",
    params: [],
    cause: { code: "23505", message: "duplicate key value violates unique constraint" },
  };
  const repo = new DrizzleMemoryRecordRepository(makeStubDb(wrapped));

  const result = await repo.appendLifecycleVersion(validInput);

  assert.equal(result, null);
});

test("appendLifecycleVersion() still propagates a database error that is not a unique violation, at the top level", async () => {
  const foreignKeyError = { code: "23503", message: "foreign key violation" };
  const repo = new DrizzleMemoryRecordRepository(makeStubDb(foreignKeyError));

  await assert.rejects(
    () => repo.appendLifecycleVersion(validInput),
    (error: unknown) => error === foreignKeyError,
  );
});

test("appendLifecycleVersion() still propagates a database error that is not a unique violation, wrapped under cause", async () => {
  const wrappedForeignKeyError = { query: "insert into ...", params: [], cause: { code: "23503" } };
  const repo = new DrizzleMemoryRecordRepository(makeStubDb(wrappedForeignKeyError));

  await assert.rejects(
    () => repo.appendLifecycleVersion(validInput),
    (error: unknown) => error === wrappedForeignKeyError,
  );
});

test("appendLifecycleVersion() propagates an error with no code anywhere (defensive: does not assume a cause exists)", async () => {
  const genericError = new Error("connection reset");
  const repo = new DrizzleMemoryRecordRepository(makeStubDb(genericError));

  await assert.rejects(
    () => repo.appendLifecycleVersion(validInput),
    (error: unknown) => error === genericError,
  );
});
