import { Inject, Injectable } from "@nestjs/common";
import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimVersion,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import type {
  AppendClaimCorrectionInput,
  CreateClaimInput,
  PersonalIntelligenceClaimRepository,
} from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import {
  diffClaimVersions,
  type ClaimVersionExplanation,
} from "../../core/personal-intelligence/personal-intelligence-claim-diff";
import type { EvidenceVersion } from "../../core/evidence/evidence.model";

// Read-only result of inspectEvidence (IMPLEMENTATION_INCREMENT_PIC-D4-01,
// docs/gates/PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md).
// Every case is an honest, distinguishable outcome - "linked" never
// substitutes for "not_linked" or "evidence_missing", and neither of those
// is ever silently treated as an error: a null evidenceVersionId and a
// dangling reference are both legitimate, reportable facts about the
// stored data, not failures to be masked or repaired.
export type InspectEvidenceResult =
  | Readonly<{ status: "linked"; evidence: EvidenceVersion }>
  | Readonly<{ status: "not_linked" }>
  | Readonly<{ status: "evidence_missing" }>
  | Readonly<{ status: "claim_version_not_found" }>;

@Injectable()
export class PersonalIntelligenceClaimUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY)
    private readonly repository: PersonalIntelligenceClaimRepository,
  ) {}

  create(input: CreateClaimInput): Promise<PersonalIntelligenceClaimVersion> {
    return this.repository.create(input);
  }

  appendCorrection(
    input: AppendClaimCorrectionInput,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    return this.repository.appendCorrection(input);
  }

  findClaimForUser(userId: string, claimId: string): Promise<PersonalIntelligenceClaim | null> {
    return this.repository.findClaimForUser(userId, claimId);
  }

  findClaimVersionForUser(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    return this.repository.findClaimVersionForUser(userId, claimId, version);
  }

  findActiveClaimVersionsForUser(userId: string): Promise<PersonalIntelligenceClaimVersion[]> {
    return this.repository.findActiveClaimVersionsForUser(userId);
  }

  // C4 Claim Correction (docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-
  // IMPLEMENTATION-INCREMENT-CONTRACT.md §4). Thin delegation, exactly like
  // every other method on this use-case - resolves the Current
  // ClaimVersion for one claim, independent of lifecycle.
  findCurrentClaimVersionForUser(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    return this.repository.findCurrentClaimVersionForUser(userId, claimId);
  }

  // C4 Claim Correction, D1 (same Contract, §17). Thin delegation. Backs
  // GET /personal-intelligence/claims in place of
  // findActiveClaimVersionsForUser - see the Contract's obsolete/
  // conflicting-text section (§26) for why the prior lifecycle-filtered
  // read no longer defines "currentness."
  findCurrentClaimVersionsForUser(userId: string): Promise<PersonalIntelligenceClaimVersion[]> {
    return this.repository.findCurrentClaimVersionsForUser(userId);
  }

  // Read-only, deterministic, IMPLEMENTATION_INCREMENT_PIC-D4-01. Exposes
  // the user's full claim-version history (any lifecycle) - each returned
  // version already self-describes what kind of change it represents via
  // its own `lifecycle` field (a "corrected" version IS a correction
  // event; "disputed" IS a dispute event, and so on), so no separate
  // synthesized event-type concept is introduced. Omitting `since` returns
  // the entire history; no AI, no scoring, no invented categories.
  detectChange(
    userId: string,
    since?: Date,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    return this.repository.findVersionsForUser(userId, since);
  }

  // Read-only, deterministic, IMPLEMENTATION_INCREMENT_PIC-D4-01. Compares
  // two versions of the same claim (same claimId by construction, since
  // both lookups share the one claimId parameter) and returns a grounded
  // diff over stored fields only - see diffClaimVersions. Returns null,
  // never a fabricated explanation, when either requested version does
  // not exist for this user.
  async explainModelChange(
    userId: string,
    claimId: string,
    fromVersion: number,
    toVersion: number,
  ): Promise<ClaimVersionExplanation | null> {
    const [from, to] = await Promise.all([
      this.repository.findClaimVersionForUser(userId, claimId, fromVersion),
      this.repository.findClaimVersionForUser(userId, claimId, toVersion),
    ]);

    if (!from || !to) return null;

    return diffClaimVersions(from, to);
  }

  // Read-only, deterministic, IMPLEMENTATION_INCREMENT_PIC-D4-01. Resolves
  // a claim version's evidenceVersionId, honestly distinguishing every
  // case (see InspectEvidenceResult) rather than collapsing them - never
  // fabricates, repairs, or creates evidence, and never mutates the claim.
  async inspectEvidence(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<InspectEvidenceResult> {
    const claimVersion = await this.repository.findClaimVersionForUser(userId, claimId, version);
    if (!claimVersion) return { status: "claim_version_not_found" };

    if (claimVersion.evidenceVersionId === null) return { status: "not_linked" };

    const evidence = await this.repository.findEvidenceVersionForUser(
      userId,
      claimVersion.evidenceVersionId,
    );
    if (!evidence) return { status: "evidence_missing" };

    return { status: "linked", evidence };
  }
}
