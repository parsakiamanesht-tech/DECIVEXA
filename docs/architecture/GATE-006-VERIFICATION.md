# GATE-006 — Workspace Resource Lifecycle Verification

**Status:** VERIFIED / CLOSED

## Scope

Increment 006 establishes a minimal, reusable Resource Lifecycle capability without expanding DECIVEXA into Goal, Memory, AI, authorization, sharing, or collaboration domains.

## Architectural decisions

- ADR-006 adopts a Hybrid Resource Lifecycle Contract.
- Workspace is the first lifecycle implementation resource.
- Lifecycle semantics are `active` and `archived`.
- Allowed transitions are `active -> archived` and `archived -> active`.
- Lifecycle does not change resource identity or ownership.
- Delete, Destroy, universal Soft Delete, Lifecycle History, Event Sourcing, and universal Audit Log remain outside this gate.

## Persistence implementation

Migration `0002_yielding_orphan.sql` adds:

- `lifecycle_state TEXT NOT NULL DEFAULT 'active'`
- a CHECK constraint allowing only `active` and `archived`

Existing ownership remains intact:

- `workspaces.owner_id -> decivexa.users.id`
- `ON DELETE RESTRICT`

Migration chain remains versioned and additive:

1. `0000_late_hellfire_club.sql` — users foundation
2. `0001_burly_steel_serpent.sql` — workspaces and ownership
3. `0002_yielding_orphan.sql` — workspace lifecycle

Previous migrations were not rewritten.

## Runtime verification

The `DECIVEXA API Verification` GitHub Actions workflow completed successfully after the `0002` migration was generated and incorporated.

This verifies the migration/runtime path against PostgreSQL and confirms the Increment 006 implementation passes the project's existing verification pipeline.

## Gate decision

Increment 006 is closed as runtime-verified.

Any future lifecycle capability beyond the current active/archived contract requires a new architectural decision and implementation gate.
