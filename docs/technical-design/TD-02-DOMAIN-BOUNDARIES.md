# TD-02 — Domain Boundaries & Ownership

**Status:** Proposed technical contract

## Objective

Prevent accidental coupling across DECIVEXA life domains while allowing contextual intelligence to compose information through explicit contracts.

## Domain ownership

Initial authoritative domains:

- Human / Personal Model — identity, values, capabilities, preferences and living model state.
- Goal — goal lifecycle, readiness, ecology and activation.
- Daily / Execution — current actions, routines and execution state.
- Health — health-specific records and derived health state.
- Money — financial records, budgets and financial goals.
- Learning — learning state, skill gaps, mastery and learning activity.
- Relationship / Family — relationship-specific records and state.
- Business / Work — work/business-specific records and state.
- Memory — memory objects, provenance and lifecycle.
- Decision — decision records and decision intelligence.
- Evidence / Integration — imported evidence and connector state.

Cross-cutting intelligence layers do not own domain truth merely because they analyze it.

## Ownership rule

Every authoritative piece of mutable state MUST have exactly one owning domain. Other domains consume projections, contracts or events rather than writing another domain's authoritative state.

## Dependency rules

Allowed:

- read through explicit domain interfaces;
- consume versioned events;
- consume privacy-filtered projections;
- request minimum necessary derived context from Personal Intelligence Core.

Forbidden:

- direct cross-domain writes;
- unrestricted shared database access;
- hidden dependency on another domain's internal schema;
- treating AI output as authoritative domain state.

## Personal Intelligence Core

The Personal Intelligence Core composes context but does not erase domain ownership. It may produce observations, interpretations and recommendations with provenance; authoritative facts remain owned by their source domains.

## Context Fusion

Context Fusion Engine MUST consume explicit, permission-aware context contracts. It MUST NOT become a backdoor to full user-data access.

## Change rule

Moving ownership, introducing a new domain, or creating a forbidden dependency is a material architectural change and requires Founder-approved ADR.

## Acceptance criteria

- Every major capability has one owner.
- Cross-domain access is explicit and least-privileged.
- No domain writes another domain's authoritative state.
- Intelligence layers cannot silently become systems of record.
