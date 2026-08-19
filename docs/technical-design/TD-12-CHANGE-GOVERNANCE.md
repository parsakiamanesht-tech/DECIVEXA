# TD-12 — Architecture Decision & Change Governance

**Status:** Proposed technical contract

## Objective

Prevent architectural drift and preserve Founder-controlled, auditable evolution.

## ADR lifecycle

Every material architecture decision uses an `ADR-NNN` record with status:

`proposed → accepted → superseded/rejected`

Required content:

- context/problem;
- decision;
- alternatives;
- consequences;
- FIS impact;
- security/privacy impact;
- performance impact;
- affected domains/contracts;
- Founder approval;
- supersession links;
- validation evidence.

## Material change

Material changes include product direction, architecture, scope, implementation strategy, technology choices, schemas, security/privacy boundaries, AI behavior, agent authority, major UX contracts and other changes that can alter the canonical system.

These changes MUST NOT be executed without explicit Founder approval.

## Traceability

Every accepted material decision MUST be traceable:

`Founder Decision → ADR → Technical Contract → Specification → Implementation → Validation`

## Deferred work

Rejected or deferred ideas remain discoverable in the Architecture Backlog with status and reason. Backlog presence does not imply implementation authorization.

## FIS impact

A change MUST identify affected FIS entries and whether it strengthens, weakens or changes their contracts. A conflict with a Non-Negotiable FIS principle blocks implementation until resolved.

## Gate interaction

TD-12 is the final governance layer for the Technical Design Gate. Architecture Freeze cannot be granted while material decisions lack an approved decision trail.

## Acceptance criteria

- Material changes require Founder approval.
- Every decision has a stable ID and status.
- Superseded decisions remain auditable.
- FIS/security/privacy/performance impacts are explicit.
- Implementation can be traced back to approved architecture decisions.
