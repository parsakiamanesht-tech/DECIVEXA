import { apiFetch } from "./api";

// Increment 006 / ADR-002: Web/Product Integration Boundary.
// Consumes exactly the two existing, unmodified backend endpoints
// authorized by docs/IMPLEMENTATION_INCREMENT_006_CONTRACT.md §J.
// These types mirror the existing backend response shapes as-is
// (apps/api/src/core/personal-state/personal-state.model.ts and
// personal-state-revision.model.ts) - nothing is invented here.

export type PersonalStateAvailability = "available" | "limited" | "unavailable";
export type PersonalStateProvenance = "declared" | "observed";

export type PersonalState = {
  id: string;
  userId: string;
  timezone: string | null;
  locale: string | null;
  availability: PersonalStateAvailability | null;
  provenance: PersonalStateProvenance;
  revision: number;
  createdAt: string;
  updatedAt: string;
};

export type PersonalStateRevision = {
  id: string;
  userId: string;
  revision: number;
  timezone: string | null;
  locale: string | null;
  availability: PersonalStateAvailability | null;
  provenance: PersonalStateProvenance;
  evidenceVersionId: string | null;
  createdAt: string;
};

// GET /personal-state - no parameters, no caller-supplied user id.
// The authenticated owner is derived entirely server-side from the
// existing Authorization header already attached by apiFetch.
export function getPersonalState(): Promise<PersonalState> {
  return apiFetch<PersonalState>("/personal-state");
}

// GET /personal-state/history - same ownership model as above.
// Returns the existing bare PersonalStateRevision[]; this file performs
// no re-ordering, filtering, or interpretation of the result.
export function getPersonalStateHistory(): Promise<PersonalStateRevision[]> {
  return apiFetch<PersonalStateRevision[]>("/personal-state/history");
}
