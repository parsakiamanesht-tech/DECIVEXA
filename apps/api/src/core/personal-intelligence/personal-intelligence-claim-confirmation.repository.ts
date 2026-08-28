import type {
  PersonalIntelligenceClaimConfirmationAction,
  PersonalIntelligenceClaimConfirmationEvent,
} from "./personal-intelligence-claim-confirmation.model";

export type RecordClaimConfirmationEventInput = Readonly<{
  eventId: string;
  claimId: string;
  claimVersionId: string;
  userId: string;
  action: PersonalIntelligenceClaimConfirmationAction;
  occurredAt: Date;
  now: Date;
}>;

export interface PersonalIntelligenceClaimConfirmationRepository {
  // Atomically verifies that claimVersionId both belongs to claimId and is
  // owned by userId, then appends exactly one new event with the next
  // sequence for that claimId. Returns null when that ownership fact does
  // not hold (wrong claim, wrong claim version, wrong user) - never
  // throws for that case, mirroring appendCorrection's null-on-mismatch
  // convention elsewhere in this module.
  recordConfirmationEvent(
    input: RecordClaimConfirmationEventInput,
  ): Promise<PersonalIntelligenceClaimConfirmationEvent | null>;
  // Full confirmation history for one exact ClaimVersion, ordered oldest
  // first - the set deriveEffectiveConfirmation expects as input.
  findConfirmationEventsForClaimVersion(
    userId: string,
    claimVersionId: string,
  ): Promise<PersonalIntelligenceClaimConfirmationEvent[]>;
  // Full confirmation history for a Claim across every one of its
  // versions, ordered oldest first - the cross-version audit trail
  // (Contract §3.3.2 "audit/history behavior").
  findConfirmationEventsForClaim(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaimConfirmationEvent[]>;
}
