# ADR-004: Migration Governance

## Status
Accepted

## Date
2026-08-21

## Context
DECIVEXA needs a deterministic relationship between persistence schema, migration artifacts, database application, and verification. The current API exposes generation and migration commands, but the architectural contract must remain explicit as the schema grows.

## Decision
Database evolution follows this canonical lifecycle:

```text
Schema source
    ↓
Migration artifact
    ↓
Review
    ↓
Apply
    ↓
Verification
```

Migration artifacts are reviewed as part of the change that requires them. A migration is not created merely for an architectural/documentation change when the database schema is unchanged.

Schema changes must remain explicit and reproducible. CI verification must not silently replace migration governance.

## Consequences
CORE-FOUNDATION-01 introduces no database schema change and therefore requires no new migration artifact. Future schema changes must include their migration evidence in the corresponding implementation Gate and PR.

## Scope Guardrail
This ADR does not authorize database redesign, migration tooling replacement, or new persistence capabilities.
