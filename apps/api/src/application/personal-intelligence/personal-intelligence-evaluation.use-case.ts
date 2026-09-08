import { Inject, Injectable } from "@nestjs/common";
import { PERSONAL_INTELLIGENCE_EVALUATION_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-evaluation.repository.token";
import type {
  CreateEvaluationInput,
  PersonalIntelligenceEvaluationRepository,
} from "../../core/personal-intelligence/personal-intelligence-evaluation.repository";
import type { PersonalIntelligenceEvaluation } from "../../core/personal-intelligence/personal-intelligence-evaluation.model";

// Derivation Trace / Provenance — Increment 1 (Founder Implementation
// Authorization). Pure delegation to the repository, exactly matching
// the established PersonalIntelligenceInferenceUseCase style.
//
// Single-Claim scope only (FD-DT-03): this use-case never accepts more
// than one ClaimVersion per Evaluation, and no method here performs any
// cross-Claim aggregation, matching, or Hypothesis/Relationship
// behavior. Correction/supersession (Contract §14) is represented by
// calling create() again with `supersedesEvaluationId` set — there is
// no separate "update" or "correct" method, because an Evaluation is
// never mutated once created.
@Injectable()
export class PersonalIntelligenceEvaluationUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_EVALUATION_REPOSITORY)
    private readonly repository: PersonalIntelligenceEvaluationRepository,
  ) {}

  create(input: CreateEvaluationInput): Promise<PersonalIntelligenceEvaluation> {
    return this.repository.create(input);
  }

  findEvaluationForUser(
    userId: string,
    evaluationId: string,
  ): Promise<PersonalIntelligenceEvaluation | null> {
    return this.repository.findEvaluationForUser(userId, evaluationId);
  }

  findEvidenceReferencesForUser(userId: string, evaluationId: string): Promise<readonly string[]> {
    return this.repository.findEvidenceReferencesForUser(userId, evaluationId);
  }

  findEvaluationsForClaimVersionForUser(
    userId: string,
    claimVersionId: string,
  ): Promise<PersonalIntelligenceEvaluation[]> {
    return this.repository.findEvaluationsForClaimVersionForUser(userId, claimVersionId);
  }
}
