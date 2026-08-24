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

// Increment 007 / ADR-003: Web write exposure. Both functions below
// consume the existing, unmodified POST/PATCH /personal-state contract
// exactly - no new request/response semantics are invented here, and
// no caller-supplied user id is ever included (ownership is derived
// entirely server-side, same as the read functions above).

export type PersonalStateWriteInput = {
  timezone?: string | null;
  locale?: string | null;
  availability?: PersonalStateAvailability | null;
};

// POST /personal-state - idempotent: if the authenticated user already
// has a Personal State, the backend returns it unchanged rather than
// erroring or overwriting it.
export function initializePersonalState(input: PersonalStateWriteInput): Promise<PersonalState> {
  return apiFetch<PersonalState>("/personal-state", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// PATCH /personal-state - optimistic concurrency: `revision` must equal
// the currently stored revision or the backend responds 409 (surfaced
// by apiFetch as an ApiError with status 409). This function does not
// resolve conflicts itself - the caller is responsible for supplying
// the current revision and handling a conflict response.
export function updatePersonalState(
  input: PersonalStateWriteInput & { revision: number },
): Promise<PersonalState> {
  return apiFetch<PersonalState>("/personal-state", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
