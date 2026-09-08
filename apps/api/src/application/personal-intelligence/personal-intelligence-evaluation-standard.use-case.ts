import { Inject, Injectable } from "@nestjs/common";
import { PERSONAL_INTELLIGENCE_EVALUATION_STANDARD_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-evaluation-standard.repository.token";
import type {
  CreateEvaluationStandardInput,
  CreateEvaluationStandardVersionInput,
  PersonalIntelligenceEvaluationStandardRepository,
} from "../../core/personal-intelligence/personal-intelligence-evaluation-standard.repository";
import type {
  PersonalIntelligenceEvaluationStandard,
  PersonalIntelligenceEvaluationStandardVersion,
} from "../../core/personal-intelligence/personal-intelligence-evaluation-standard.model";

// Derivation Trace / Provenance — Increment 1 (Founder Implementation
// Authorization). Pure delegation to the repository, exactly matching
// the established PersonalIntelligenceInferenceUseCase style: all
// persistence/ownership/concurrency handling lives in the repository,
// not duplicated here.
@Injectable()
export class PersonalIntelligenceEvaluationStandardUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_EVALUATION_STANDARD_REPOSITORY)
    private readonly repository: PersonalIntelligenceEvaluationStandardRepository,
  ) {}

  create(input: CreateEvaluationStandardInput): Promise<PersonalIntelligenceEvaluationStandard> {
    return this.repository.create(input);
  }

  findStandardForUser(
    userId: string,
    standardId: string,
  ): Promise<PersonalIntelligenceEvaluationStandard | null> {
    return this.repository.findStandardForUser(userId, standardId);
  }

  createVersion(
    input: CreateEvaluationStandardVersionInput,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion | null> {
    return this.repository.createVersion(input);
  }

  findVersionForUser(
    userId: string,
    versionId: string,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion | null> {
    return this.repository.findVersionForUser(userId, versionId);
  }

  findVersionHistoryForUser(
    userId: string,
    standardId: string,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion[]> {
    return this.repository.findVersionHistoryForUser(userId, standardId);
  }
}
