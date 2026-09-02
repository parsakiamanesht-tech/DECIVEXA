import { and, asc, eq, sql } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceClaimVersions,
  personalIntelligenceClaimConfirmationEvents,
} from "../../persistence/schema/personal-intelligence.schema";
import type {
  PersonalIntelligenceClaimConfirmationAction,
  PersonalIntelligenceClaimConfirmationEvent,
} from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.model";
import type {
  PersonalIntelligenceClaimConfirmationRepository,
  RecordClaimConfirmationEventInput,
} from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.repository";

function toDomainConfirmationEvent(
  row: typeof personalIntelligenceClaimConfirmationEvents.$inferSelect,
): PersonalIntelligenceClaimConfirmationEvent {
  return {
    id: row.id,
    claimId: row.claimId,
    claimVersionId: row.claimVersionId,
    userId: row.userId,
    sequence: row.sequence,
    action: row.action as PersonalIntelligenceClaimConfirmationAction,
    occurredAt: row.occurredAt,
    createdAt: row.createdAt,
  };
}

function hasUniqueViolationCode(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    (value as { code?: unknown }).code === "23505"
  );
}

// PostgreSQL's own error (code "23505") is what the concurrent-loser branch
// below must recognize, but Drizzle's node-postgres driver wraps it in a
// DrizzleQueryError whose own properties are only { query, params, cause } -
// the raw pg error, and its code, live at error.cause, not on the thrown
// error itself. Checking both shapes keeps this working whether the error
// arrives as the raw pg error (error.code) or Drizzle's wrapper
// (error.cause.code), without assuming either shape or that a "cause"
// property exists at all. Mirrors the identical fix already established in
// memory.repository.ts, personal-intelligence-relationship-evidence.repository.ts,
// and personal-intelligence-relationship-confirmation.repository.ts.
function isUniqueViolation(error: unknown): boolean {
  if (hasUniqueViolationCode(error)) return true;
  const cause = typeof error === "object" && error !== null && "cause" in error
    ? (error as { cause?: unknown }).cause
    : undefined;
  return hasUniqueViolationCode(cause);
}

export class DrizzlePersonalIntelligenceClaimConfirmationRepository
  implements PersonalIntelligenceClaimConfirmationRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Ownership and event-target validity are enforced by a single atomic
  // INSERT ... SELECT ... WHERE, mirroring the pattern already proven by
  // DrizzlePersonalIntelligenceClaimRepository.appendCorrection and
  // DrizzlePersonalIntelligenceInferenceRepository.transitionLifecycle:
  //   - the SELECT only produces a source row when a ClaimVersion matching
  //     (id = claimVersionId AND claimId = claimId AND userId = userId)
  //     actually exists - this simultaneously proves the caller owns the
  //     claim, owns the version, and that the version genuinely belongs to
  //     the claim it is being confirmed under. A mismatch on any one of
  //     those three facts yields zero source rows, so nothing is inserted
  //     and null is returned - never a thrown error for this case.
  //   - `sequence` is allocated as current-max(sequence)-for-this-claimId
  //     plus one, via a scalar subquery, rather than the
  //     "match-one-specific-expected-row" technique D3's lifecycle events
  //     use - confirmation has no fixed prior-state graph to match against
  //     (a Claim may be confirmed, unconfirmed, and reconfirmed freely), so
  //     there is no single "expected" row to key off. The
  //     unique(claimId, sequence) index is the database-enforced backstop
  //     against two concurrent calls computing the same next sequence: the
  //     losing insert fails with a unique-violation, caught below and
  //     reported as null, exactly like appendCorrection's existing
  //     isUniqueViolation handling.
  async recordConfirmationEvent(
    input: RecordClaimConfirmationEventInput,
  ): Promise<PersonalIntelligenceClaimConfirmationEvent | null> {
    try {
      const [row] = await this.db
        .insert(personalIntelligenceClaimConfirmationEvents)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.eventId}`.as("id"),
              claimId: sql<string>`${input.claimId}`.as("claim_id"),
              claimVersionId: personalIntelligenceClaimVersions.id,
              userId: personalIntelligenceClaimVersions.userId,
              sequence: sql<number>`coalesce((select max(${personalIntelligenceClaimConfirmationEvents.sequence}) from ${personalIntelligenceClaimConfirmationEvents} where ${personalIntelligenceClaimConfirmationEvents.claimId} = ${input.claimId}), 0) + 1`.as(
                "sequence",
              ),
              action: sql<string>`${input.action}`.as("action"),
              occurredAt: sql<Date>`${input.occurredAt}`.as("occurred_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceClaimVersions)
            .where(
              and(
                eq(personalIntelligenceClaimVersions.id, input.claimVersionId),
                eq(personalIntelligenceClaimVersions.claimId, input.claimId),
                eq(personalIntelligenceClaimVersions.userId, input.userId),
              ),
            ),
        )
        .returning();

      return row ? toDomainConfirmationEvent(row) : null;
    } catch (error) {
      if (isUniqueViolation(error)) return null;
      throw error;
    }
  }

  async findConfirmationEventsForClaimVersion(
    userId: string,
    claimVersionId: string,
  ): Promise<PersonalIntelligenceClaimConfirmationEvent[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceClaimConfirmationEvents)
      .where(
        and(
          eq(personalIntelligenceClaimConfirmationEvents.claimVersionId, claimVersionId),
          eq(personalIntelligenceClaimConfirmationEvents.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceClaimConfirmationEvents.sequence));

    return rows.map(toDomainConfirmationEvent);
  }

  async findConfirmationEventsForClaim(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaimConfirmationEvent[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceClaimConfirmationEvents)
      .where(
        and(
          eq(personalIntelligenceClaimConfirmationEvents.claimId, claimId),
          eq(personalIntelligenceClaimConfirmationEvents.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceClaimConfirmationEvents.sequence));

    return rows.map(toDomainConfirmationEvent);
  }
}
