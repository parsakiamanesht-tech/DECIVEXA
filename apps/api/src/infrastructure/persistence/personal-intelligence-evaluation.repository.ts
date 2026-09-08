import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceEvaluations,
  personalIntelligenceEvaluationEvidenceReferences,
} from "../../persistence/schema/personal-intelligence-evaluation.schema";
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
  async create(input: CreateEvaluationInput): Promise<PersonalIntelligenceEvaluation> {
    return this.db.transaction(async (tx) => {
      const [evaluationRow] = await tx
        .insert(personalIntelligenceEvaluations)
        .values({
          id: input.evaluationId,
          userId: input.userId,
          claimVersionId: input.claimVersionId,
          evaluationStandardVersionId: input.evaluationStandardVersionId,
          result: input.result,
          evaluatorType: input.evaluatorType,
          producerCapabilityId: input.producerCapabilityId,
          producerCapabilityVersion: input.producerCapabilityVersion,
          producerProviderId: input.producerProviderId,
          producerModelId: input.producerModelId,
          modelReportedConfidence: input.modelReportedConfidence,
          systemAdjustedConfidence: input.systemAdjustedConfidence,
          supersedesEvaluationId: input.supersedesEvaluationId,
          evaluatedAt: input.evaluatedAt,
          createdAt: input.now,
        })
        .returning();

      if (!evaluationRow) throw new Error("Failed to create personal intelligence evaluation");

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
