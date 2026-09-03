import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import type { PersonalIntelligenceClaimRepository } from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import { PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.repository.token";
import type { PersonalIntelligenceClaimConfirmationRepository } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.repository";
import {
  deriveEffectiveConfirmation,
  type PersonalIntelligenceClaimConfirmationAction,
  type PersonalIntelligenceClaimConfirmationEvent,
} from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.model";

// C3 Claim Confirm/Unconfirm (Founder Implementation Authorization,
// reconciling docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-
// IMPLEMENTATION-INCREMENT-CONTRACT.md §3.3). Thin - every fact recorded
// or derived here is produced by the already-existing, already-tested
// PersonalIntelligenceClaimRepository read methods and
// PersonalIntelligenceClaimConfirmationRepository methods. This use-case
// enforces exactly one rule: a confirmation action may target only the
// claim's Current active version - Current (highest `version`) and
// active (lifecycle) are independent facts under Option 2, both
// verified here, before the write (C4 Claim Correction reconciliation,
// docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-IMPLEMENTATION-
// INCREMENT-CONTRACT.md §10). Confirmed/unconfirmed carry exactly the meaning the Contract
// defines: "confirmed" affirms the referenced version's content is
// accurate; "unconfirmed" retracts a prior confirmation - never "false,"
// "wrong," "disputed," or "invalid." Every valid action is recorded as a
// new append-only event, including a redundant one (Founder Decision:
// redundant actions are never deduplicated or suppressed). Never
// modifies ClaimVersion content, provenance, confidence, evidence,
// Context, Temporal Validity, D3 inference, or lifecycle; never triggers
// correction; never invokes AI.
export type RecordClaimConfirmationActionResult =
  | Readonly<{ status: "recorded"; event: PersonalIntelligenceClaimConfirmationEvent }>
  | Readonly<{ status: "claim_version_not_found" }>
  | Readonly<{ status: "not_current_version" }>;

// "not_confirmed" (no event yet - never confirmed) is distinguished from
// "unconfirmed" (an explicit retraction is the latest event) using only
// the already-fetched events array's length - deriveEffectiveConfirmation
// itself is unmodified and still returns a plain boolean; this is a
// presentation-shaping read of already-available data, not new domain
// logic. Matches the three states the UI must be able to show honestly
// (never inventing a fourth).
export type EffectiveConfirmationState = "not_confirmed" | "confirmed" | "unconfirmed";

export type EffectiveConfirmationResult =
  | Readonly<{ status: "found"; state: EffectiveConfirmationState }>
  | Readonly<{ status: "claim_version_not_found" }>;

@Injectable()
export class PersonalIntelligenceClaimConfirmationUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY)
    private readonly claims: PersonalIntelligenceClaimRepository,
    @Inject(PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY)
    private readonly confirmations: PersonalIntelligenceClaimConfirmationRepository,
  ) {}

  // Enforces the Current-AND-active invariant before ever calling
  // recordConfirmationEvent (C4 Claim Correction reconciliation,
  // docs/gates/PERSONAL-INTELLIGENCE-CLAIM-CORRECTION-IMPLEMENTATION-
  // INCREMENT-CONTRACT.md §10, Option 2/D3). Currentness (the highest
  // `version` for this claimId) and `lifecycle === "active"` are two
  // independent facts - a version that is Current but non-active (e.g.
  // revoked) is rejected here exactly like a version that is active but
  // no longer Current (a historical active row): neither alone is
  // sufficient. Both facts are resolved from existing, already-tested
  // reads (findClaimVersionForUser, findCurrentClaimVersionForUser) - no
  // new repository method beyond what C4 already introduces.
  async recordAction(
    userId: string,
    claimId: string,
    version: number,
    action: PersonalIntelligenceClaimConfirmationAction,
  ): Promise<RecordClaimConfirmationActionResult> {
    const claimVersion = await this.claims.findClaimVersionForUser(userId, claimId, version);
    if (!claimVersion) return { status: "claim_version_not_found" };

    const current = await this.claims.findCurrentClaimVersionForUser(userId, claimId);
    if (!current || current.version !== version || claimVersion.lifecycle !== "active") {
      return { status: "not_current_version" };
    }

    const now = new Date();
    const event = await this.confirmations.recordConfirmationEvent({
      eventId: randomUUID(),
      claimId,
      claimVersionId: claimVersion.id,
      userId,
      action,
      occurredAt: now,
      now,
    });
    // event is expected non-null here (ownership already proven above by
    // findClaimVersionForUser); a null result would mean the version was
    // concurrently revoked/replaced between the two calls - reported
    // identically to claim_version_not_found, never thrown.
    return event ? { status: "recorded", event } : { status: "claim_version_not_found" };
  }

  // Read-only. Resolves the effective confirmation state of one exact
  // claim version - identified the same way recordAction identifies it,
  // by (claimId, version) - scoped to the requesting user. Uses the same
  // already-existing, already-tested primitives as the write path:
  // findClaimVersionForUser to resolve the version's own row id, then
  // the repository's version-scoped event query and the pure
  // deriveEffectiveConfirmation derivation.
  async getEffectiveConfirmation(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<EffectiveConfirmationResult> {
    const claimVersion = await this.claims.findClaimVersionForUser(userId, claimId, version);
    if (!claimVersion) return { status: "claim_version_not_found" };

    const events = await this.confirmations.findConfirmationEventsForClaimVersion(userId, claimVersion.id);
    if (events.length === 0) return { status: "found", state: "not_confirmed" };
    return { status: "found", state: deriveEffectiveConfirmation(events) ? "confirmed" : "unconfirmed" };
  }
}
