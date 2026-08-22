import type { PersonalState, PersonalStateAvailability, PersonalStateProvenance } from "./personal-state.model";
import type { PersonalStateRevision } from "./personal-state-revision.model";

export interface PersonalStatePatch {
  readonly timezone?: string | null;
  readonly locale?: string | null;
  readonly availability?: PersonalStateAvailability | null;
  readonly provenance?: PersonalStateProvenance;
}

export interface PersonalStateRepository {
  findByUserId(userId: string): Promise<PersonalState | undefined>;
  create(input: {
    id: string;
    userId: string;
    timezone: string | null;
    locale: string | null;
    availability: PersonalStateAvailability | null;
    provenance: PersonalStateProvenance;
    now: Date;
    // Optional lineage to the Evidence that supports this initial accepted
    // state. Defaults to null - most callers (including the existing
    // PersonalStateUseCase) never need to pass this.
    evidenceVersionId?: string | null;
  }): Promise<PersonalState>;
  // evidenceVersionId is optional and defaults to null when omitted, so
  // existing call sites (e.g. PersonalStateUseCase.update) remain valid
  // without any change.
  updateForUser(
    userId: string,
    expectedRevision: number,
    patch: PersonalStatePatch,
    now: Date,
    evidenceVersionId?: string | null,
  ): Promise<PersonalState | undefined>;
  // Read-only access to the immutable, append-only history of accepted
  // PersonalState revisions for a user, ordered ascending by revision.
  // This is not a write path - revisions are only ever produced as a side
  // effect of create/updateForUser succeeding.
  findRevisionsForUser(userId: string): Promise<PersonalStateRevision[]>;
}
