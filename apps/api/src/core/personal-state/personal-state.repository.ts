import type { PersonalState, PersonalStateAvailability, PersonalStateProvenance } from "./personal-state.model";

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
  }): Promise<PersonalState>;
  updateForUser(userId: string, expectedRevision: number, patch: PersonalStatePatch, now: Date): Promise<PersonalState | undefined>;
}
