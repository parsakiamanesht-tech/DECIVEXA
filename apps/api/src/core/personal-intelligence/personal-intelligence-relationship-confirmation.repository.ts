import type {
  PersonalIntelligenceRelationshipConfirmationAction,
  PersonalIntelligenceRelationshipConfirmationActor,
  PersonalIntelligenceRelationshipConfirmationEvent,
} from "./personal-intelligence-relationship-confirmation.model";

export type CreateRelationshipConfirmationEventInput = Readonly<{
  id: string;
  userId: string;
  relationshipId: string;
  action: PersonalIntelligenceRelationshipConfirmationAction;
  // Always Explicit (Contract §10.2): sourced from the caller, never a
  // hardcoded default inside the repository — even though this
  // Increment's domain currently admits only "user".
  actor: PersonalIntelligenceRelationshipConfirmationActor;
  occurredAt: Date;
  now: Date;
}>;

export interface PersonalIntelligenceRelationshipConfirmationRepository {
  // Atomically verifies that relationshipId belongs to userId and that
  // the Relationship's own (immutable, creation-time) confirmationState
  // is not 'not_required' (Contract §12), then appends exactly one new
  // Confirmation Event with the next sequence for that relationshipId.
  // Returns null when an ownership or eligibility fact does not hold —
  // never throws for that case, mirroring recordConfirmationEvent's/
  // RelationshipEvidence.create's null-on-mismatch convention.
  // Append-only: no UPDATE path exists anywhere in this interface or its
  // implementation.
  create(
    input: CreateRelationshipConfirmationEventInput,
  ): Promise<PersonalIntelligenceRelationshipConfirmationEvent | null>;
  // Full confirmation history for one Relationship, ordered oldest first
  // — mirrors findEvidenceForRelationship's/
  // findConfirmationEventsForClaim's read shape exactly.
  findConfirmationEventsForRelationship(
    userId: string,
    relationshipId: string,
  ): Promise<PersonalIntelligenceRelationshipConfirmationEvent[]>;
}
