import { and, asc, eq, ne, sql } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceRelationshipConfirmationEvents,
  personalIntelligenceRelationships,
} from "../../persistence/schema/personal-intelligence.schema";
import type {
  PersonalIntelligenceRelationshipConfirmationAction,
  PersonalIntelligenceRelationshipConfirmationActor,
  PersonalIntelligenceRelationshipConfirmationEvent,
} from "../../core/personal-intelligence/personal-intelligence-relationship-confirmation.model";
import type {
  CreateRelationshipConfirmationEventInput,
  PersonalIntelligenceRelationshipConfirmationRepository,
} from "../../core/personal-intelligence/personal-intelligence-relationship-confirmation.repository";

function toDomainConfirmationEvent(
  row: typeof personalIntelligenceRelationshipConfirmationEvents.$inferSelect,
): PersonalIntelligenceRelationshipConfirmationEvent {
  return {
    id: row.id,
    relationshipId: row.relationshipId,
    userId: row.userId,
    sequence: row.sequence,
    action: row.action as PersonalIntelligenceRelationshipConfirmationAction,
    actor: row.actor as PersonalIntelligenceRelationshipConfirmationActor,
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

// Corrected shape (Contract §14) — must NOT copy C3's current, defective
// isUniqueViolation (top-level error.code only; personal-intelligence-
// claim-confirmation.repository.ts still has that unpatched defect,
// documented but deliberately not repaired by this increment). Drizzle's
// node-postgres driver wraps PostgreSQL errors in a DrizzleQueryError
// whose own properties are only { query, params, cause } — the raw pg
// error, and its code, live at error.cause, not on the thrown error
// itself. This mirrors the fix already proven and merged in
// personal-intelligence-relationship-evidence.repository.ts exactly:
// checking both shapes, defensively, without assuming a "cause" property
// exists.
function isUniqueViolation(error: unknown): boolean {
  if (hasUniqueViolationCode(error)) return true;
  const cause = typeof error === "object" && error !== null && "cause" in error
    ? (error as { cause?: unknown }).cause
    : undefined;
  return hasUniqueViolationCode(cause);
}

export class DrizzlePersonalIntelligenceRelationshipConfirmationRepository
  implements PersonalIntelligenceRelationshipConfirmationRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Ownership and eligibility are enforced by a single atomic
  // INSERT ... SELECT ... WHERE (Contract §12), mirroring
  // DrizzlePersonalIntelligenceClaimConfirmationRepository
  // .recordConfirmationEvent and
  // DrizzlePersonalIntelligenceRelationshipEvidenceRepository.create
  // exactly: the SELECT only produces a source row when a Relationship
  // matching (id = relationshipId AND userId = userId AND
  // confirmationState <> 'not_required') actually exists — a mismatch on
  // ownership, or a 'not_required'-created Relationship, yields zero
  // source rows, so nothing is inserted and null is returned, never a
  // thrown error for this case. `sequence` is allocated as
  // current-max(sequence)-for-this-relationshipId plus one, via a scalar
  // subquery, exactly mirroring every other append-only table in this
  // codebase. The unique(relationship_id, sequence) index is the
  // database-enforced backstop against two concurrent calls computing
  // the same next sequence: the losing insert fails with a
  // unique-violation, caught below and reported as null. `action` and
  // `actor` are always sourced from the caller's input (Always
  // Explicit), never a hardcoded default. No UPDATE statement exists
  // anywhere in this class — every row this method inserts is never
  // touched again.
  async create(
    input: CreateRelationshipConfirmationEventInput,
  ): Promise<PersonalIntelligenceRelationshipConfirmationEvent | null> {
    try {
      const [row] = await this.db
        .insert(personalIntelligenceRelationshipConfirmationEvents)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.id}`.as("id"),
              relationshipId: personalIntelligenceRelationships.id,
              userId: personalIntelligenceRelationships.userId,
              sequence: sql<number>`coalesce((select max(${personalIntelligenceRelationshipConfirmationEvents.sequence}) from ${personalIntelligenceRelationshipConfirmationEvents} where ${personalIntelligenceRelationshipConfirmationEvents.relationshipId} = ${input.relationshipId}), 0) + 1`.as(
                "sequence",
              ),
              action: sql<string>`${input.action}`.as("action"),
              actor: sql<string>`${input.actor}`.as("actor"),
              occurredAt: sql<Date>`${input.occurredAt}`.as("occurred_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceRelationships)
            .where(
              and(
                eq(personalIntelligenceRelationships.id, input.relationshipId),
                eq(personalIntelligenceRelationships.userId, input.userId),
                ne(personalIntelligenceRelationships.confirmationState, "not_required"),
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

  async findConfirmationEventsForRelationship(
    userId: string,
    relationshipId: string,
  ): Promise<PersonalIntelligenceRelationshipConfirmationEvent[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceRelationshipConfirmationEvents)
      .where(
        and(
          eq(personalIntelligenceRelationshipConfirmationEvents.relationshipId, relationshipId),
          eq(personalIntelligenceRelationshipConfirmationEvents.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceRelationshipConfirmationEvents.sequence));

    return rows.map(toDomainConfirmationEvent);
  }
}
