import assert from "node:assert/strict";
import test from "node:test";
import { DrizzlePersonalIntelligenceRelationshipEvidenceRepository } from "./personal-intelligence-relationship-evidence.repository";
import type { DatabaseClient } from "../../persistence/database";

// Scoped repair verification — Founder-authorized concurrency defect fix.
// Runtime verification against real PostgreSQL proved that a losing
// concurrent RelationshipEvidence.create() call throws an unhandled
// DrizzleQueryError instead of returning null, because Drizzle's
// node-postgres driver wraps the raw pg error (code "23505") under
// error.cause rather than exposing it as error.code directly. These tests
// exercise create()'s actual catch behavior against both error shapes,
// through a minimal stub DatabaseClient - the private isUniqueViolation
// helper is not exported, so this proves the fix through repository
// behavior, not by reaching into the helper directly.

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
  id: "evidence-1",
  relationshipId: "relationship-1",
  userId: "user-1",
  description: "concurrent race test",
  evidenceVersionId: null,
  provenance: "user_declared" as const,
  now: new Date("2026-01-01T00:00:00.000Z"),
};

test("create() returns null when the raw pg error exposes code 23505 directly (error.code)", async () => {
  const repo = new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(
    makeStubDb({ code: "23505" }),
  );

  const result = await repo.create(validInput);

  assert.equal(result, null);
});

test("create() returns null when PostgreSQL's 23505 is wrapped under error.cause.code (Drizzle's DrizzleQueryError shape - the exact defect found during runtime verification)", async () => {
  const wrapped = {
    query: "insert into ...",
    params: [],
    cause: { code: "23505", message: "duplicate key value violates unique constraint" },
  };
  const repo = new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(makeStubDb(wrapped));

  const result = await repo.create(validInput);

  assert.equal(result, null);
});

test("create() still propagates a database error that is not a unique violation, at the top level", async () => {
  const foreignKeyError = { code: "23503", message: "foreign key violation" };
  const repo = new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(
    makeStubDb(foreignKeyError),
  );

  await assert.rejects(() => repo.create(validInput), (error: unknown) => error === foreignKeyError);
});

test("create() still propagates a database error that is not a unique violation, wrapped under cause", async () => {
  const wrappedForeignKeyError = { query: "insert into ...", params: [], cause: { code: "23503" } };
  const repo = new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(
    makeStubDb(wrappedForeignKeyError),
  );

  await assert.rejects(
    () => repo.create(validInput),
    (error: unknown) => error === wrappedForeignKeyError,
  );
});

test("create() propagates an error with no code anywhere (defensive: does not assume a cause exists)", async () => {
  const genericError = new Error("connection reset");
  const repo = new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(
    makeStubDb(genericError),
  );

  await assert.rejects(() => repo.create(validInput), (error: unknown) => error === genericError);
});
