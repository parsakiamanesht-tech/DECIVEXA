import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
  PersonalIntelligenceEvidenceLinkageState,
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
  // PIC Claim Ontology / Taxonomy Option 2 (Implementation Increment
  // Contract §3.1). Caller-declared; the database enforces the mandatory
  // 1:1 coupling with evidenceVersionId ("linked" iff non-null) via a
  // check constraint - an inconsistent combination is rejected at write
  // time, not silently accepted or silently corrected.
  evidenceLinkageState: PersonalIntelligenceEvidenceLinkageState;
  // D3 Inference → Claim Promotion Write Path (Implementation Increment
  // Contract, docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-*).
  // Caller-declared, always explicit (never defaulted/inherited). The
  // database enforces ownership (the referenced Inference must belong to
  // the same userId) via the same atomic pattern already used for
  // evidenceVersionId. Referencing an Inference is a provenance/causal
  // linkage only - it never confirms the Claim, never confirms the
  // Inference, never changes provenance/confidence/lifecycle, and is not
  // gated by the Inference's own lifecycle status (Contract §5.F,
  // Founder-approved: any status - proposed/confirmed/rejected/disputed/
  // stale - may be referenced).
  inferenceId: string | null;
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
  // See CreateClaimInput.evidenceLinkageState - same coupling requirement
  // applies to every appended correction.
  evidenceLinkageState: PersonalIntelligenceEvidenceLinkageState;
  // See CreateClaimInput.inferenceId. Always taken fresh from this input -
  // never copied, inherited, or carried forward from the prior version
  // implicitly (Contract §5.G/§8): a caller who wants the correction to
  // remain associated with the same Inference must pass that same
  // inferenceId again; omitting it (passing null) disassociates the new
  // version even if the prior version had one.
  inferenceId: string | null;
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
