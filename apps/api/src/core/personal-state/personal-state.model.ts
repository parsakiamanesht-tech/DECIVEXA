export const PERSONAL_STATE_PROVENANCE = ["declared", "observed"] as const;
export type PersonalStateProvenance = (typeof PERSONAL_STATE_PROVENANCE)[number];

export const PERSONAL_STATE_AVAILABILITY = ["available", "limited", "unavailable"] as const;
export type PersonalStateAvailability = (typeof PERSONAL_STATE_AVAILABILITY)[number];

export interface PersonalState {
  readonly id: string;
  readonly userId: string;
  readonly timezone: string | null;
  readonly locale: string | null;
  readonly availability: PersonalStateAvailability | null;
  readonly provenance: PersonalStateProvenance;
  readonly revision: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
