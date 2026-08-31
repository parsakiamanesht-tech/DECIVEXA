import type {
  PersonalIntelligenceRelationshipEvidence,
} from "./personal-intelligence-relationship-evidence.model";
import type { PersonalIntelligenceRelationshipProvenance } from "./personal-intelligence-relationship.model";

export type CreateRelationshipEvidenceInput = Readonly<{
  id: string;
  userId: string;
  relationshipId: string;
  description: string;
  evidenceVersionId: string | null;
  provenance: PersonalIntelligenceRelationshipProvenance;
  now: Date;
}>;

export interface PersonalIntelligenceRelationshipEvidenceRepository {
  // Atomically verifies that relationshipId belongs to userId (and, when
  // supplied, that evidenceVersionId also belongs to userId), then
  // appends exactly one new evidence row with the next sequence for that
  // relationshipId. Returns null when an ownership fact does not hold —
  // never throws for that case, mirroring recordConfirmationEvent's
  // null-on-mismatch convention. Append-only: no UPDATE path exists
  // anywhere in this interface or its implementation.
  create(
    input: CreateRelationshipEvidenceInput,
  ): Promise<PersonalIntelligenceRelationshipEvidence | null>;
  // Full evidence history for one Relationship, ordered oldest first —
  // mirrors findConfirmationEventsForClaimVersion's read shape exactly.
  findEvidenceForRelationship(
    userId: string,
    relationshipId: string,
  ): Promise<PersonalIntelligenceRelationshipEvidence[]>;
}
