import type {
  PersonalIntelligenceEvaluation,
  PersonalIntelligenceEvaluationResult,
  PersonalIntelligenceEvaluatorType,
} from "./personal-intelligence-evaluation.model";

export type CreateEvaluationInput = Readonly<{
  evaluationId: string;
  userId: string;
  claimVersionId: string;
  evaluationStandardVersionId: string;
  result: PersonalIntelligenceEvaluationResult;
  evaluatorType: PersonalIntelligenceEvaluatorType;
  producerCapabilityId: string | null;
  producerCapabilityVersion: string | null;
  producerProviderId: string | null;
  producerModelId: string | null;
  modelReportedConfidence: number | null;
  systemAdjustedConfidence: number | null;
  supersedesEvaluationId: string | null;
  evaluatedAt: Date;
  now: Date;
  // Recoverability (Contract §4 item 2 / §7 of the Increment 1
  // authorization): the exact EvidenceVersion set actually considered.
  // Rejected (before persisting anything) if empty, or if any entry does
  // not resolve to an EvidenceVersion owned by `userId` — mirrors D3
  // Invariant 4 exactly.
  evidenceVersionIds: readonly string[];
}>;

export interface PersonalIntelligenceEvaluationRepository {
  create(input: CreateEvaluationInput): Promise<PersonalIntelligenceEvaluation>;

  findEvaluationForUser(
    userId: string,
    evaluationId: string,
  ): Promise<PersonalIntelligenceEvaluation | null>;

  findEvidenceReferencesForUser(userId: string, evaluationId: string): Promise<readonly string[]>;

  // All Evaluations ever created for a given ClaimVersion, in creation
  // order — includes both an original Evaluation and any Evaluation(s)
  // that later supersede it (Contract §14: correction never erases the
  // original; both remain independently readable).
  findEvaluationsForClaimVersionForUser(
    userId: string,
    claimVersionId: string,
  ): Promise<PersonalIntelligenceEvaluation[]>;
}
