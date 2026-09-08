import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceEvaluations,
  personalIntelligenceEvaluationEvidenceReferences,
  personalIntelligenceEvaluationStandardVersions,
} from "../../persistence/schema/personal-intelligence-evaluation.schema";
import { personalIntelligenceClaimVersions } from "../../persistence/schema/personal-intelligence.schema";
import { evidenceVersions } from "../../persistence/schema/evidence.schema";
import type {
  PersonalIntelligenceEvaluation,
  PersonalIntelligenceEvaluationResult,
  PersonalIntelligenceEvaluatorType,
} from "../../core/personal-intelligence/personal-intelligence-evaluation.model";
import type {
  CreateEvaluationInput,
  PersonalIntelligenceEvaluationRepository,
} from "../../core/personal-intelligence/personal-intelligence-evaluation.repository";

function toDomainEvaluation(
  row: typeof personalIntelligenceEvaluations.$inferSelect,
): PersonalIntelligenceEvaluation {
  return {
    id: row.id,
    userId: row.userId,
    claimVersionId: row.claimVersionId,
    evaluationStandardVersionId: row.evaluationStandardVersionId,
    result: row.result as PersonalIntelligenceEvaluationResult,
    evaluatorType: row.evaluatorType as PersonalIntelligenceEvaluatorType,
    producerCapabilityId: row.producerCapabilityId,
    producerCapabilityVersion: row.producerCapabilityVersion,
    producerProviderId: row.producerProviderId,
    producerModelId: row.producerModelId,
    modelReportedConfidence: row.modelReportedConfidence,
    systemAdjustedConfidence: row.systemAdjustedConfidence,
    supersedesEvaluationId: row.supersedesEvaluationId,
    evaluatedAt: row.evaluatedAt,
    createdAt: row.createdAt,
  };
}

// Dedupe while preserving nothing order-dependent - only used to compute
// an expected count for the "did every supplied reference resolve"
// check below. Mirrors
// DrizzlePersonalIntelligenceInferenceRepository's identical `distinct`
// helper.
function distinct(ids: readonly string[]): string[] {
  return Array.from(new Set(ids));
}

export class DrizzlePersonalIntelligenceEvaluationRepository
  implements PersonalIntelligenceEvaluationRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Creation is one atomic unit: the Evaluation row and its mandatory
  // EvidenceVersion-set references are inserted inside a single
  // transaction, or neither is - mirrors
  // DrizzlePersonalIntelligenceInferenceRepository.create() exactly,
  // including its INSERT...SELECT...WHERE ownership-check technique for
  // validating "every one of N supplied references belongs to the user,
  // and there are at least N of them" (Contract §7/§10 of the Increment
  // 1 authorization: the exact EvidenceVersion set considered must be
  // recoverable; an Evaluation with zero direct EvidenceVersion
  // references is rejected before persistence).
  //
  // The Evaluation row's own two cross-references - claimVersionId and
  // evaluationStandardVersionId - are ownership-verified the same way:
  // the INSERT sources its row from a SELECT over
  // personal_intelligence_claim_versions cross-joined with
  // personal_intelligence_evaluation_standard_versions, matching id AND
  // userId on each against input.userId (mirrors
  // DrizzlePersonalIntelligenceRelationshipRepository.create()'s
  // two-referenced-row ownership check exactly - existence of a
  // referenced id is never treated as proof of ownership). A mismatch on
  // either produces zero source rows, so the INSERT inserts nothing and
  // the whole transaction is rolled back by the thrown error below -
  // never a partial Evaluation row.
  async create(input: CreateEvaluationInput): Promise<PersonalIntelligenceEvaluation> {
    return this.db.transaction(async (tx) => {
      const [evaluationRow] = await tx
        .insert(personalIntelligenceEvaluations)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.evaluationId}`.as("id"),
              userId: sql<string>`${input.userId}`.as("user_id"),
              claimVersionId: personalIntelligenceClaimVersions.id,
              evaluationStandardVersionId: personalIntelligenceEvaluationStandardVersions.id,
              result: sql<string>`${input.result}`.as("result"),
              evaluatorType: sql<string>`${input.evaluatorType}`.as("evaluator_type"),
              producerCapabilityId: sql<string | null>`${input.producerCapabilityId}`.as(
                "producer_capability_id",
              ),
              producerCapabilityVersion: sql<string | null>`${input.producerCapabilityVersion}`.as(
                "producer_capability_version",
              ),
              producerProviderId: sql<string | null>`${input.producerProviderId}`.as("producer_provider_id"),
              producerModelId: sql<string | null>`${input.producerModelId}`.as("producer_model_id"),
              modelReportedConfidence: sql<number | null>`${input.modelReportedConfidence}`.as(
                "model_reported_confidence",
              ),
              systemAdjustedConfidence: sql<number | null>`${input.systemAdjustedConfidence}`.as(
                "system_adjusted_confidence",
              ),
              supersedesEvaluationId: sql<string | null>`${input.supersedesEvaluationId}`.as(
                "supersedes_evaluation_id",
              ),
              evaluatedAt: sql<Date>`${input.evaluatedAt}`.as("evaluated_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceClaimVersions)
            .innerJoin(personalIntelligenceEvaluationStandardVersions, sql`true`)
            .where(
              and(
                eq(personalIntelligenceClaimVersions.id, input.claimVersionId),
                eq(personalIntelligenceClaimVersions.userId, input.userId),
                eq(personalIntelligenceEvaluationStandardVersions.id, input.evaluationStandardVersionId),
                eq(personalIntelligenceEvaluationStandardVersions.userId, input.userId),
              ),
            ),
        )
        .returning();

      if (!evaluationRow) {
        throw new Error(
          "Cannot create personal intelligence evaluation: the referenced ClaimVersion or EvaluationStandardVersion does not exist or does not belong to the authenticated user",
        );
      }

      const evidenceIds = distinct(input.evidenceVersionIds);
      if (evidenceIds.length === 0) {
        throw new Error(
          "Cannot create personal intelligence evaluation: at least one EvidenceVersion reference is required",
        );
      }

      const insertedEvidenceRefs = await tx
        .insert(personalIntelligenceEvaluationEvidenceReferences)
        .select((qb) =>
          qb
            .select({
              evaluationId: sql<string>`${input.evaluationId}`.as("evaluation_id"),
              evidenceVersionId: evidenceVersions.id,
              userId: evidenceVersions.userId,
            })
            .from(evidenceVersions)
            .where(and(inArray(evidenceVersions.id, evidenceIds), eq(evidenceVersions.userId, input.userId))),
        )
        .returning();

      if (insertedEvidenceRefs.length !== evidenceIds.length) {
        throw new Error(
          "Cannot create personal intelligence evaluation: one or more EvidenceVersion references do not exist or do not belong to the authenticated user",
        );
      }

      return toDomainEvaluation(evaluationRow);
    });
  }

  async findEvaluationForUser(
    userId: string,
    evaluationId: string,
  ): Promise<PersonalIntelligenceEvaluation | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceEvaluations)
      .where(
        and(eq(personalIntelligenceEvaluations.id, evaluationId), eq(personalIntelligenceEvaluations.userId, userId)),
      )
      .limit(1);

    return row ? toDomainEvaluation(row) : null;
  }

  async findEvidenceReferencesForUser(userId: string, evaluationId: string): Promise<readonly string[]> {
    const rows = await this.db
      .select({ evidenceVersionId: personalIntelligenceEvaluationEvidenceReferences.evidenceVersionId })
      .from(personalIntelligenceEvaluationEvidenceReferences)
      .where(
        and(
          eq(personalIntelligenceEvaluationEvidenceReferences.evaluationId, evaluationId),
          eq(personalIntelligenceEvaluationEvidenceReferences.userId, userId),
        ),
      );

    return rows.map((row) => row.evidenceVersionId);
  }

  async findEvaluationsForClaimVersionForUser(
    userId: string,
    claimVersionId: string,
  ): Promise<PersonalIntelligenceEvaluation[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceEvaluations)
      .where(
        and(
          eq(personalIntelligenceEvaluations.claimVersionId, claimVersionId),
          eq(personalIntelligenceEvaluations.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceEvaluations.createdAt));

    return rows.map(toDomainEvaluation);
  }
}
