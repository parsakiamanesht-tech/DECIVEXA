import assert from "node:assert/strict";
import test from "node:test";
import { DrizzlePersonalIntelligenceClaimConfirmationRepository } from "./personal-intelligence-claim-confirmation.repository";
import type { DatabaseClient } from "../../persistence/database";

// Scoped repair verification — Founder-authorized concurrency defect fix
// ("Repair Three Verified Unique-Violation Defects"). The pre-repair
// isUniqueViolation checked only top-level error.code — the exact defect
// class already found and repaired in memory.repository.ts,
// personal-intelligence-relationship-evidence.repository.ts, and
// personal-intelligence-relationship-confirmation.repository.ts (whose own
// comment names this file as the then-unpatched sibling). Drizzle's
// node-postgres driver wraps the raw pg error (code "23505") under
// error.cause rather than exposing it as error.code directly, which would
// cause a losing concurrent recordConfirmationEvent() call to throw an
// unhandled DrizzleQueryError instead of returning null. These tests
// exercise recordConfirmationEvent()'s actual catch behavior against both
// error shapes, through a minimal stub DatabaseClient — the private
// isUniqueViolation helper is not exported, so this proves the fix through
// repository behavior, not by reaching into the helper directly.

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
  eventId: "event-1",
  claimId: "claim-1",
  claimVersionId: "version-1",
  userId: "user-1",
  action: "confirmed" as const,
  occurredAt: new Date("2026-01-01T00:00:00.000Z"),
  now: new Date("2026-01-01T00:00:00.000Z"),
};

test("recordConfirmationEvent() returns null when the raw pg error exposes code 23505 directly (error.code)", async () => {
  const repo = new DrizzlePersonalIntelligenceClaimConfirmationRepository(
    makeStubDb({ code: "23505" }),
  );

  const result = await repo.recordConfirmationEvent(validInput);

  assert.equal(result, null);
});

test("recordConfirmationEvent() returns null when PostgreSQL's 23505 is wrapped under error.cause.code (Drizzle's DrizzleQueryError shape - the exact defect class found and repaired elsewhere in this repository)", async () => {
  const wrapped = {
    query: "insert into ...",
    params: [],
    cause: { code: "23505", message: "duplicate key value violates unique constraint" },
  };
  const repo = new DrizzlePersonalIntelligenceClaimConfirmationRepository(makeStubDb(wrapped));

  const result = await repo.recordConfirmationEvent(validInput);

  assert.equal(result, null);
});

test("recordConfirmationEvent() still propagates a database error that is not a unique violation, at the top level", async () => {
  const foreignKeyError = { code: "23503", message: "foreign key violation" };
  const repo = new DrizzlePersonalIntelligenceClaimConfirmationRepository(
    makeStubDb(foreignKeyError),
  );

  await assert.rejects(
    () => repo.recordConfirmationEvent(validInput),
    (error: unknown) => error === foreignKeyError,
  );
});

test("recordConfirmationEvent() still propagates a database error that is not a unique violation, wrapped under cause", async () => {
  const wrappedForeignKeyError = { query: "insert into ...", params: [], cause: { code: "23503" } };
  const repo = new DrizzlePersonalIntelligenceClaimConfirmationRepository(
    makeStubDb(wrappedForeignKeyError),
  );

  await assert.rejects(
    () => repo.recordConfirmationEvent(validInput),
    (error: unknown) => error === wrappedForeignKeyError,
  );
});

test("recordConfirmationEvent() propagates an error with no code anywhere (defensive: does not assume a cause exists)", async () => {
  const genericError = new Error("connection reset");
  const repo = new DrizzlePersonalIntelligenceClaimConfirmationRepository(makeStubDb(genericError));

  await assert.rejects(
    () => repo.recordConfirmationEvent(validInput),
    (error: unknown) => error === genericError,
  );
});
