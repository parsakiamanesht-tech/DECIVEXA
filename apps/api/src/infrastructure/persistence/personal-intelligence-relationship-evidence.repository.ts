import { and, asc, eq, exists, sql } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import { evidenceVersions } from "../../persistence/schema/evidence.schema";
import {
  personalIntelligenceRelationshipEvidence,
  personalIntelligenceRelationships,
} from "../../persistence/schema/personal-intelligence.schema";
import type { PersonalIntelligenceRelationshipEvidence } from "../../core/personal-intelligence/personal-intelligence-relationship-evidence.model";
import type { PersonalIntelligenceRelationshipProvenance } from "../../core/personal-intelligence/personal-intelligence-relationship.model";
import type {
  CreateRelationshipEvidenceInput,
  PersonalIntelligenceRelationshipEvidenceRepository,
} from "../../core/personal-intelligence/personal-intelligence-relationship-evidence.repository";

function toDomainRelationshipEvidence(
  row: typeof personalIntelligenceRelationshipEvidence.$inferSelect,
): PersonalIntelligenceRelationshipEvidence {
  return {
    id: row.id,
    relationshipId: row.relationshipId,
    userId: row.userId,
    sequence: row.sequence,
    description: row.description,
    evidenceVersionId: row.evidenceVersionId,
    provenance: row.provenance as PersonalIntelligenceRelationshipProvenance,
    createdAt: row.createdAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

export class DrizzlePersonalIntelligenceRelationshipEvidenceRepository
  implements PersonalIntelligenceRelationshipEvidenceRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Ownership and event-target validity are enforced by a single atomic
  // INSERT ... SELECT ... WHERE, mirroring
  // DrizzlePersonalIntelligenceClaimConfirmationRepository
  // .recordConfirmationEvent exactly: the SELECT only produces a source
  // row when a Relationship matching (id = relationshipId AND userId =
  // userId) actually exists, plus (when evidenceVersionId is supplied) a
  // correlated EXISTS requiring it to belong to the same user - the same
  // ownership fact enforced on ClaimVersion's own evidenceVersionId
  // elsewhere in this codebase. `sequence` is allocated as
  // current-max(sequence)-for-this-relationshipId plus one, via a scalar
  // subquery, exactly mirroring recordConfirmationEvent's own sequence
  // allocation. The unique(relationship_id, sequence) index is the
  // database-enforced backstop against two concurrent calls computing the
  // same next sequence: the losing insert fails with a unique-violation,
  // caught below and reported as null. No UPDATE statement exists
  // anywhere in this class - every row this method inserts is never
  // touched again.
  async create(
    input: CreateRelationshipEvidenceInput,
  ): Promise<PersonalIntelligenceRelationshipEvidence | null> {
    try {
      const [row] = await this.db
        .insert(personalIntelligenceRelationshipEvidence)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.id}`.as("id"),
              relationshipId: personalIntelligenceRelationships.id,
              userId: personalIntelligenceRelationships.userId,
              sequence: sql<number>`coalesce((select max(${personalIntelligenceRelationshipEvidence.sequence}) from ${personalIntelligenceRelationshipEvidence} where ${personalIntelligenceRelationshipEvidence.relationshipId} = ${input.relationshipId}), 0) + 1`.as(
                "sequence",
              ),
              description: sql<string>`${input.description}`.as("description"),
              evidenceVersionId: sql<string | null>`${input.evidenceVersionId}`.as(
                "evidence_version_id",
              ),
              provenance: sql<string>`${input.provenance}`.as("provenance"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceRelationships)
            .where(
              and(
                eq(personalIntelligenceRelationships.id, input.relationshipId),
                eq(personalIntelligenceRelationships.userId, input.userId),
                input.evidenceVersionId
                  ? exists(
                      qb
                        .select({ one: sql`1` })
                        .from(evidenceVersions)
                        .where(
                          and(
                            eq(evidenceVersions.id, input.evidenceVersionId),
                            eq(evidenceVersions.userId, input.userId),
                          ),
                        ),
                    )
                  : undefined,
              ),
            ),
        )
        .returning();

      return row ? toDomainRelationshipEvidence(row) : null;
    } catch (error) {
      if (isUniqueViolation(error)) return null;
      throw error;
    }
  }

  async findEvidenceForRelationship(
    userId: string,
    relationshipId: string,
  ): Promise<PersonalIntelligenceRelationshipEvidence[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceRelationshipEvidence)
      .where(
        and(
          eq(personalIntelligenceRelationshipEvidence.relationshipId, relationshipId),
          eq(personalIntelligenceRelationshipEvidence.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceRelationshipEvidence.sequence));

    return rows.map(toDomainRelationshipEvidence);
  }
}
