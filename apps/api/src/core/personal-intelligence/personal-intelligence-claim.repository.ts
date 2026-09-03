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
  // Temporal Validity axis (Implementation Increment Contract,
  // docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md
  // §6, Option A - Always Explicit, Founder-approved). Required,
  // non-optional, `Date | null` - the caller must always make an
  // explicit choice; `null` means only "not established," never
  // "always"/"now". Never defaulted or inherited by this input type
  // itself (it has no "previous version" to inherit from - full
  // explicit replacement is the only shape this field has ever had).
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  // Claim-level Context (Implementation Increment Contract,
  // docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md
  // §12, Always Explicit). Required, non-optional, `string | null` -
  // caller must always make an explicit choice; `null` means only "not
  // established". No new sovereignty field - governed by this row's
  // existing provenance/inferenceId/confirmation apparatus (Contract §7).
  situationSetting: string | null;
  timeOfDay: string | null;
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
  // See CreateClaimInput.effectiveFrom/.effectiveTo (Option A - Always
  // Explicit). Always taken fresh from this input on every correction -
  // NEVER copied, inherited, or carried forward from the prior version's
  // effectiveFrom/effectiveTo, structurally identical to how inferenceId
  // already behaves above. A caller who wants the correction to keep the
  // same temporal window must pass those same values again explicitly;
  // omitting either (passing null) clears it on the new version even if
  // the prior version had a known value.
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  // See CreateClaimInput.situationSetting/.timeOfDay. Always taken fresh
  // from this input on every correction - NEVER copied, inherited, or
  // carried forward from the prior version's Context, structurally
  // identical to how effectiveFrom/effectiveTo and inferenceId already
  // behave above. A caller who wants the correction to keep the same
  // Context must pass those same values again explicitly; omitting
  // either (passing null) clears it on the new version even if the prior
  // version had a known value.
  situationSetting: string | null;
  timeOfDay: string | null;
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
  // C4 Claim Correction (docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-
  // IMPLEMENTATION-INCREMENT-CONTRACT.md §4/§17/§22). Resolves the Current
  // ClaimVersion for one claim - the row with the maximum `version` for
  // (userId, claimId), independent of `lifecycle`. Distinct responsibility
  // from findClaimVersionForUser (exact-version lookup by a caller-supplied
  // version number) and from findActiveClaimVersionsForUser (lifecycle
  // filter, not recency). Returns null only when the claim has no version
  // at all for this user (nonexistent or not owned - the same
  // ownership-blind null convention every other read method here uses).
  findCurrentClaimVersionForUser(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaimVersion | null>;
  // C4 Claim Correction, D1 (same Contract, §17). Resolves the Current
  // ClaimVersion for every claim the user owns - one row per claimId, the
  // row with the maximum `version`, independent of `lifecycle`. Replaces
  // findActiveClaimVersionsForUser as the backing read for
  // GET /personal-intelligence/claims: `lifecycle = active` no longer
  // defines currentness (Option 2), so a Current-but-non-active version is
  // still returned here - never silently omitted or replaced by an older
  // active version.
  findCurrentClaimVersionsForUser(
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
