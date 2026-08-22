import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
  PersonalIntelligenceLifecycle,
  PersonalIntelligenceProvenance,
  PersonalIntelligenceValueKind,
} from "./personal-intelligence-claim.model";

export type CreateClaimInput = Readonly<{
  claimId: string;
  versionId: string;
  userId: string;
  claimType: PersonalIntelligenceClaimType;
  valueKind: PersonalIntelligenceValueKind;
  valueText: string;
  provenance: PersonalIntelligenceProvenance;
  confidence: number;
  evidenceVersionId: string | null;
  observedAt: Date;
  acceptedAt: Date;
  now: Date;
}>;

export type AppendClaimCorrectionInput = Readonly<{
  userId: string;
  claimId: string;
  versionId: string;
  expectedVersion: number;
  valueKind: PersonalIntelligenceValueKind;
  valueText: string;
  provenance: PersonalIntelligenceProvenance;
  confidence: number;
  lifecycle: PersonalIntelligenceLifecycle;
  evidenceVersionId: string | null;
  observedAt: Date;
  acceptedAt: Date;
  now: Date;
}>;

export interface PersonalIntelligenceClaimRepository {
  findClaimForUser(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaim | null>;
  findClaimVersionForUser(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<PersonalIntelligenceClaimVersion | null>;
  findActiveClaimVersionsForUser(
    userId: string,
    claimType?: PersonalIntelligenceClaimType,
  ): Promise<PersonalIntelligenceClaimVersion[]>;
  create(input: CreateClaimInput): Promise<PersonalIntelligenceClaimVersion>;
  appendCorrection(
    input: AppendClaimCorrectionInput,
  ): Promise<PersonalIntelligenceClaimVersion | null>;
}
