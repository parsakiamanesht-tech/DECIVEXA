import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
  PersonalIntelligenceLifecycle,
  PersonalIntelligenceProvenance,
  PersonalIntelligenceValueKind,
} from "./personal-intelligence-claim.model";
import type { EvidenceVersion } from "../evidence/evidence.model";

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
  // Read-only, IMPLEMENTATION_INCREMENT_PIC-D4-01
  // (docs/gates/PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md).
  // Returns every version row (any lifecycle - active, superseded,
  // corrected, revoked, disputed) for this user, optionally scoped to
  // those created after `since`, ordered oldest-first. Unlike
  // findActiveClaimVersionsForUser, this deliberately does not filter by
  // lifecycle: detectChange needs to observe the full history, not only
  // the current state.
  findVersionsForUser(
    userId: string,
    since?: Date,
  ): Promise<PersonalIntelligenceClaimVersion[]>;
  // Read-only, IMPLEMENTATION_INCREMENT_PIC-D4-01. Resolves an existing
  // EvidenceVersion by its own id, scoped to the requesting user -
  // mirrors the ownership-check pattern already used by create() and
  // appendCorrection() above, exposed here as an explicit read for
  // inspectEvidence. Never writes to Evidence.
  findEvidenceVersionForUser(
    userId: string,
    evidenceVersionId: string,
  ): Promise<EvidenceVersion | null>;
}
