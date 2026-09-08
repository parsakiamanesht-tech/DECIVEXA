import type {
  PersonalIntelligenceEvaluationStandard,
  PersonalIntelligenceEvaluationStandardVersion,
} from "./personal-intelligence-evaluation-standard.model";

export type CreateEvaluationStandardInput = Readonly<{
  standardId: string;
  userId: string;
  initialVersionId: string;
  criteria: string;
  now: Date;
}>;

export type CreateEvaluationStandardVersionInput = Readonly<{
  versionId: string;
  userId: string;
  standardId: string;
  // Optimistic-concurrency guard, mirroring
  // DrizzleEvidenceRepository.appendLifecycleVersion exactly: the version
  // number the caller believes is current. The new row is only inserted
  // when this still matches the actual current max version and no newer
  // version has appeared concurrently.
  expectedVersion: number;
  criteria: string;
  now: Date;
}>;

export interface PersonalIntelligenceEvaluationStandardRepository {
  // Creates the Standard identity row together with its first version,
  // atomically (mirrors the Evidence/create() and
  // PersonalIntelligenceInference/create() precedent of inserting an
  // identity row and its initial dependent row in one transaction).
  create(
    input: CreateEvaluationStandardInput,
  ): Promise<PersonalIntelligenceEvaluationStandard>;

  findStandardForUser(
    userId: string,
    standardId: string,
  ): Promise<PersonalIntelligenceEvaluationStandard | null>;

  // Appends a new, immutable version for an existing Standard. Never
  // updates or deletes a prior version (Contract §9 "Historical
  // stability"). Returns null when the Standard does not exist or is
  // not owned by `userId` — mirrors the ownership-check discipline
  // already used throughout this codebase's other appendCorrection-style
  // operations.
  createVersion(
    input: CreateEvaluationStandardVersionInput,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion | null>;

  findVersionForUser(
    userId: string,
    versionId: string,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion | null>;

  findVersionHistoryForUser(
    userId: string,
    standardId: string,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion[]>;
}
