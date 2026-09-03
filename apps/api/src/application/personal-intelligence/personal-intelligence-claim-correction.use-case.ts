import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import type { PersonalIntelligenceClaimRepository } from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import type { PersonalIntelligenceClaimVersion } from "../../core/personal-intelligence/personal-intelligence-claim.model";

// C4 Claim Correction (Founder Implementation Authorization, reconciling
// docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-IMPLEMENTATION-
// INCREMENT-CONTRACT.md). Implements the Contract's §7 application-layer
// assembly sequence exactly: resolve the target version and verify
// ownership; resolve Current; verify expectedVersion == Current.version;
// build the complete repository input, preserving every unchanged
// substantive field read from Current (Contract §6.2 - provenance,
// evidenceVersionId, evidenceLinkageState, inferenceId, effectiveFrom,
// effectiveTo, situationSetting, timeOfDay, valueKind); fix
// lifecycle = "active" (§2.6) and observedAt/acceptedAt/now to the
// correction write event's own time (§2.7); call the existing, unmodified
// appendCorrection. The repository does not inherit or copy fields
// implicitly at any point - every field this use case passes to
// appendCorrection is a value explicitly held here, either freshly
// supplied by the client (valueText, confidence), read from Current and
// re-supplied verbatim, or fixed by this C4 rule. Never mutates the prior
// version (appendCorrection itself is insert-only). Never transfers or
// creates a confirmation event for the new version.
export type RecordClaimCorrectionInput = Readonly<{
  valueText: string;
  confidence: number;
}>;

export type RecordClaimCorrectionResult =
  | Readonly<{ status: "created"; version: PersonalIntelligenceClaimVersion }>
  | Readonly<{ status: "claim_version_not_found" }>
  | Readonly<{ status: "stale" }>;

@Injectable()
export class PersonalIntelligenceClaimCorrectionUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY)
    private readonly claims: PersonalIntelligenceClaimRepository,
  ) {}

  // Contract §7/§19/§20. `expectedVersion` identifies exactly which
  // version the client believes is Current - resolved first via
  // findClaimVersionForUser, which is userId-scoped and returns null for
  // a nonexistent OR not-owned version alike (the same ownership-blind
  // convention every other read/write path in this domain already uses,
  // so a request against another user's claim is indistinguishable from
  // one against a claim that does not exist at all - Contract §3/§19).
  // Only once that existence/ownership check has passed is currentness
  // evaluated: a mismatch between expectedVersion and the claim's actual
  // Current version is staleness, a distinct failure mode from
  // not-found/not-owned (Contract §9/§19), safe to distinguish because it
  // is only ever reached after ownership is already established.
  async correct(
    userId: string,
    claimId: string,
    expectedVersion: number,
    input: RecordClaimCorrectionInput,
  ): Promise<RecordClaimCorrectionResult> {
    const target = await this.claims.findClaimVersionForUser(userId, claimId, expectedVersion);
    if (!target) return { status: "claim_version_not_found" };

    const current = await this.claims.findCurrentClaimVersionForUser(userId, claimId);
    // current is expected non-null here - target's own existence above
    // already proves at least one version exists for this claim/user. A
    // version-number mismatch means expectedVersion is not (or is no
    // longer) Current - the Contract's staleness case, not an
    // existence/ownership failure.
    if (!current || current.version !== expectedVersion) {
      return { status: "stale" };
    }

    const now = new Date();
    const created = await this.claims.appendCorrection({
      userId,
      claimId,
      versionId: randomUUID(),
      expectedVersion,
      // valueKind (Contract §6.3): preserved from Current, never exposed
      // as a client-editable field for C4 v1 - avoids a correction
      // silently changing the claim's represented value type as an
      // unintended side effect of only editing valueText.
      valueKind: current.valueKind,
      valueText: input.valueText,
      // provenance (Contract §13): preserved from Current, explicitly
      // re-supplied rather than inherited by the repository. Never
      // automatically converted declared <-> observed.
      provenance: current.provenance,
      confidence: input.confidence,
      // C4 application-layer rule (Contract §2.6/§9): every
      // C4-originated correction produces an "active" version. This is a
      // value this use case supplies explicitly - the repository
      // contract (AppendClaimCorrectionInput.lifecycle) remains
      // caller-discretionary and is not changed to enforce this.
      lifecycle: "active",
      // Evidence linkage (Contract §14): preserved together from
      // Current, satisfying the 1:1 coupling check constraint
      // automatically since both values are copied from a row that
      // already satisfies it.
      evidenceVersionId: current.evidenceVersionId,
      evidenceLinkageState: current.evidenceLinkageState,
      // Inference linkage (Contract §15): preserved from Current,
      // subject to appendCorrection's own existing ownership
      // re-verification.
      inferenceId: current.inferenceId,
      // Temporal Validity (Contract §12): preserved from Current, not
      // redefined or newly validated for overlap.
      effectiveFrom: current.effectiveFrom,
      effectiveTo: current.effectiveTo,
      // Context (Contract §11): preserved from Current, no Context
      // Capture or new context semantics introduced.
      situationSetting: current.situationSetting,
      timeOfDay: current.timeOfDay,
      // observedAt/acceptedAt/now (Contract §2.7): represent this
      // correction write event and default to the current write time -
      // no new temporal semantic introduced.
      observedAt: now,
      acceptedAt: now,
      now,
    });

    // A concurrent correction won the race between the currentness check
    // above and this write (Contract §20) - reported identically to a
    // stale request, never thrown as an unhandled exception.
    return created ? { status: "created", version: created } : { status: "stale" };
  }
}
