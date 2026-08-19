# ADR-005 — Ownership & Resource Boundary

- Status: Accepted
- Phase: Increment 005-A
- Scope: Core ownership semantics and resource boundary only

## Context

DECIVEXA now has a verified Core Identity foundation. Future domain resources will need a stable answer to two different questions: who owns a resource, and who is authorized to act on it. These concepts must remain separate so that future authorization, sharing, collaboration, privacy, export, and deletion capabilities do not distort the Core identity model.

ADR-004 establishes Identity as Core and states that persisted domain resources will have an explicit owner reference. fileciteturn192file0L2-L2

## Decisions

### 1. Ownership is a Core concern

Ownership semantics belong to the Core boundary. Modules must not invent independent ownership models for their resources.

### 2. Domain resources reference the canonical owner

When a domain resource is introduced, its persistence model will reference the canonical Core User identity through an explicit `ownerId` relationship. The relationship is added to the resource, not to the User table as a self-ownership field.

### 3. User is the identity root, not a generic resource container

The Core User entity remains the canonical identity root. It will not accumulate module-specific resource collections or artificial ownership metadata.

### 4. Ownership is distinct from authorization

Ownership answers "which identity owns this resource?" Authorization answers "which identity may perform this action?" ADR-005 defines only ownership. RBAC, permissions, sharing, collaboration, and access policies are out of scope.

### 5. No premature ownership table

A generic `ownership` or `resource_owners` table will not be introduced merely to anticipate future modules. Ownership will be represented directly on a concrete domain resource when that resource is actually modeled.

### 6. Single-owner foundation

The current foundation assumes one canonical owner per domain resource. Future multi-owner, delegated, shared, or collaborative semantics require a separate architectural decision and must not be simulated through ad-hoc fields.

### 7. Privacy and lifecycle compatibility

Ownership references must remain compatible with future data export, deletion, privacy, and audit requirements. Implementations must avoid ownership structures that make lifecycle operations ambiguous.

## Consequences

- Every future owned domain resource has one canonical owner reference.
- Core identity remains small and stable.
- Authorization can evolve independently of ownership.
- Sharing and collaboration can be introduced later without forcing a premature generic resource model.

## Non-goals

This ADR does not implement authorization/RBAC, sharing, collaboration, permissions, Goal schemas, Memory schemas, AI schemas, audit-event storage, or privacy workflows.

## Implementation Gate

Increment 005-C/005-D may introduce an `ownerId` only alongside the first concrete domain resource that requires ownership. No standalone ownership schema is authorized by this ADR.
