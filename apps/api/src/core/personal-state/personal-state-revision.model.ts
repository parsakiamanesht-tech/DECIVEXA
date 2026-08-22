import type { PersonalStateAvailability, PersonalStateProvenance } from "./personal-state.model";

export type PersonalStateRevision = Readonly<{
  id: string;
  userId: string;
  revision: number;
  timezone: string | null;
  locale: string | null;
  availability: PersonalStateAvailability | null;
  provenance: PersonalStateProvenance;
  evidenceVersionId: string | null;
  createdAt: Date;
}>;
