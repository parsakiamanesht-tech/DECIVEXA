# ADR-006 — Resource Lifecycle Contract

**Status:** ACCEPTED

## Context

DECIVEXA now has a verified Core Identity foundation (`decivexa.users`) and an Ownership boundary (`decivexa.workspaces`). The architecture needs a reusable lifecycle concept without prematurely forcing every resource to share a physical `status` column or introducing deletion/archive infrastructure before it is justified.

## Decision

DECIVEXA adopts a **hybrid Resource Lifecycle Contract**.

The Core defines lifecycle semantics as a reusable architectural contract, while individual Domain Resources implement lifecycle behavior only when their actual domain requirements justify it.

The contract does not require every resource to expose a common physical `status` column.

## Core semantics

- **Active:** resource participates in its normal operational lifecycle.
- **Inactive/Archived:** resource is retained but is no longer part of the normal active flow when the owning domain requires this state.
- **Deleted:** resource is removed from its normal application lifecycle according to domain and privacy rules.
- **Destroyed:** permanent data removal when explicitly permitted by the applicable data/privacy lifecycle.

These are semantic concepts, not a mandate to implement all states on every resource.

## Deletion and privacy boundary

Soft delete is **not** a Core primitive at this stage. No `deleted_at` column is introduced by this ADR.

Permanent destruction and user data deletion must later be governed by the DECIVEXA privacy/data-ownership lifecycle rather than being inferred from a generic resource column.

## Ownership interaction

Lifecycle and Ownership remain separate concerns:

```text
Identity
  User
    │
    └── Ownership ──► Resource
                         │
                         └── Lifecycle (when required)
```

Ownership answers **who owns the resource**. Lifecycle answers **what operational state the resource is in**.

## Scope exclusions

This ADR does not authorize implementation of:

- Goal schemas
- Memory schemas
- Decision/AI schemas
- Authorization or RBAC
- Sharing or collaboration
- Multi-owner resources
- Event sourcing
- Generic audit-log infrastructure
- Soft-delete infrastructure
- Archive implementation on Workspace

Each requires its own architectural justification and gate if introduced.

## Consequences

### Positive

- Prevents duplicated lifecycle semantics across future modules.
- Keeps Core extensible without creating a mandatory universal resource schema.
- Preserves clear separation between Identity, Ownership, Lifecycle, and Domain semantics.
- Leaves privacy and permanent destruction as explicit future architecture rather than accidental database behavior.

### Negative

- Domain modules must explicitly decide whether and how they adopt lifecycle semantics.
- There is intentionally no single physical `status` column that can be assumed across all resources.

## Gate

This ADR authorizes **architecture only**. No database migration or runtime implementation is implied by acceptance of this ADR.

Implementation requires a subsequent Increment 006 implementation gate and runtime verification.
