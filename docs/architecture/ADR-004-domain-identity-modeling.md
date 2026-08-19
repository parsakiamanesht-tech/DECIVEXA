# ADR-004 — Domain & Identity Modeling Foundation

- Status: Accepted
- Phase: Increment 004-A
- Scope: Core domain and identity modeling only

## Context

DECIVEXA needs a stable domain foundation before module-specific persistence is introduced. The foundation must support future Goal, Daily, Discipline, Review, Memory, Human Understanding, Decision Intelligence, and AI capabilities without coupling identity or ownership to any single module.

## Decisions

### 1. Identity is Core

User identity belongs to the DECIVEXA Core boundary. Modules must not own or redefine the canonical user identity.

### 2. Ownership is explicit

Persisted domain resources will have an explicit owner reference. Ownership is a Core concern and must not be inferred from module-specific fields.

### 3. Entity identity is implementation-independent

Domain entity identifiers must remain stable independently of the PostgreSQL/Drizzle implementation. The persistence layer is an adapter, not the source of domain identity semantics.

### 4. System timestamps are UTC

Persisted system timestamps use UTC. User timezone is user/context configuration and must not be scattered across domain entities.

### 5. Auditability is a boundary

Material domain changes must remain auditable. A future audit/event implementation may be centralized; individual modules must not create incompatible audit mechanisms.

### 6. Module boundaries remain explicit

Goal OS, Daily OS, Discipline OS, Review OS, Health OS, Money OS, Memory, Human Understanding, Decision Intelligence, and DECIVEXA AI remain separate module concerns. This ADR does not authorize their implementation or schema creation.

### 7. No domain tables in Increment 004-A

This ADR establishes modeling rules only. It does not create Goal, Memory, Review, AI, or other domain tables.

## Consequences

- Core identity and ownership can be reused by every future module.
- Persistence remains replaceable behind repository contracts.
- Future Memory and Intelligence systems can reference stable identity without redefining it.
- Module-specific schema work requires its own design/implementation gate.

## Non-goals

This ADR does not define Goal schemas, event storage, Memory architecture, Digital Twin models, AI data models, or module-specific aggregates.

## Verification

The implementation must preserve the existing PostgreSQL + Drizzle persistence foundation and must not introduce domain tables as part of this ADR.
