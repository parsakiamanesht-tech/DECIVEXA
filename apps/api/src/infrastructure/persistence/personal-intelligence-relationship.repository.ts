import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceClaimVersions,
  personalIntelligenceRelationships,
} from "../../persistence/schema/personal-intelligence.schema";
import type {
  PersonalIntelligenceRelationship,
  PersonalIntelligenceRelationshipCertainty,
  PersonalIntelligenceRelationshipConfirmationState,
  PersonalIntelligenceRelationshipProvenance,
  PersonalIntelligenceRelationshipType,
} from "../../core/personal-intelligence/personal-intelligence-relationship.model";
import type {
  CreateRelationshipInput,
  PersonalIntelligenceRelationshipRepository,
} from "../../core/personal-intelligence/personal-intelligence-relationship.repository";

function toDomainRelationship(
  row: typeof personalIntelligenceRelationships.$inferSelect,
): PersonalIntelligenceRelationship {
  return {
    id: row.id,
    userId: row.userId,
    sourceClaimVersionId: row.sourceClaimVersionId,
    targetClaimVersionId: row.targetClaimVersionId,
    relationshipType: row.relationshipType as PersonalIntelligenceRelationshipType,
    certainty: row.certainty as PersonalIntelligenceRelationshipCertainty,
    confirmationState: row.confirmationState as PersonalIntelligenceRelationshipConfirmationState,
    provenance: row.provenance as PersonalIntelligenceRelationshipProvenance,
    createdAt: row.createdAt,
  };
}

// Aliased handles onto personal_intelligence_claim_versions so the source
// and target ownership checks can be expressed as two distinct range
// tables in the same statement - mirrors the exact self-join technique
// already proven by newerClaimVersion in
// DrizzlePersonalIntelligenceClaimRepository.
const sourceClaimVersion = alias(personalIntelligenceClaimVersions, "source_claim_version");
const targetClaimVersion = alias(personalIntelligenceClaimVersions, "target_claim_version");

export class DrizzlePersonalIntelligenceRelationshipRepository
  implements PersonalIntelligenceRelationshipRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Ownership of BOTH sourceClaimVersionId and targetClaimVersionId is
  // verified atomically via a single INSERT ... SELECT ... WHERE,
  // mirroring the exact technique already proven by
  // DrizzlePersonalIntelligenceClaimRepository.create's inference/evidence
  // branches and DrizzlePersonalIntelligenceClaimConfirmationRepository
  // .recordConfirmationEvent: the SELECT only produces a source row when a
  // ClaimVersion matching (id = sourceClaimVersionId AND userId = userId)
  // AND a ClaimVersion matching (id = targetClaimVersionId AND userId =
  // userId) both actually exist - a mismatch on either yields zero source
  // rows, so nothing is inserted and null is returned, never a thrown
  // error for this case. Every column, including relationshipType/
  // certainty/confirmationState, is taken directly from the caller's
  // input (Always Explicit) - there is no reference anywhere in this
  // projection to any other Relationship's data, and no UPDATE statement
  // exists anywhere in this class: the row this method inserts is never
  // touched again by any method here.
  async create(
    input: CreateRelationshipInput,
  ): Promise<PersonalIntelligenceRelationship | null> {
    const [row] = await this.db
      .insert(personalIntelligenceRelationships)
      .select((qb) =>
        qb
          .select({
            id: sql<string>`${input.id}`.as("id"),
            userId: sql<string>`${input.userId}`.as("user_id"),
            sourceClaimVersionId: sourceClaimVersion.id,
            targetClaimVersionId: targetClaimVersion.id,
            relationshipType: sql<string>`${input.relationshipType}`.as("relationship_type"),
            certainty: sql<string>`${input.certainty}`.as("certainty"),
            confirmationState: sql<string>`${input.confirmationState}`.as("confirmation_state"),
            provenance: sql<string>`${input.provenance}`.as("provenance"),
            createdAt: sql<Date>`${input.now}`.as("created_at"),
          })
          .from(sourceClaimVersion)
          .innerJoin(targetClaimVersion, sql`true`)
          .where(
            and(
              eq(sourceClaimVersion.id, input.sourceClaimVersionId),
              eq(sourceClaimVersion.userId, input.userId),
              eq(targetClaimVersion.id, input.targetClaimVersionId),
              eq(targetClaimVersion.userId, input.userId),
            ),
          ),
      )
      .returning();

    return row ? toDomainRelationship(row) : null;
  }

  async findRelationshipForUser(
    userId: string,
    relationshipId: string,
  ): Promise<PersonalIntelligenceRelationship | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceRelationships)
      .where(
        and(
          eq(personalIntelligenceRelationships.id, relationshipId),
          eq(personalIntelligenceRelationships.userId, userId),
        ),
      )
      .limit(1);

    return row ? toDomainRelationship(row) : null;
  }
}
