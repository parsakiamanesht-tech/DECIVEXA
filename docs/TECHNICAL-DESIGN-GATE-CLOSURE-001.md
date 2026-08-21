# DECIVEXA Technical Design Gate — Closure Package 001

Status: DESIGN-CLOSURE CANDIDATE / NOT APPROVED
Scope: Increment 004 — Evidence & State History Foundation

## Purpose

This document closes the remaining design-closure items identified by Technical Design Gate Audit 003. It is a design artifact only. It does not authorize implementation, schema creation, migration, or merge.

## 1. Performance Specification

Performance is specified as measurable budgets rather than premature infrastructure commitments.

- Reads and writes MUST be measured separately.
- Baseline workload MUST cover: single-user current-state read, single-user append/update, historical-range query, evidence lookup, and concurrent mutation conflict.
- The verification environment MUST record database version, runtime version, dataset size, and concurrency level.
- No production SLO is declared by this artifact. Thresholds become implementation acceptance criteria only after empirical baseline measurement and Founder approval.
- No architectural decision may be justified by an unmeasured performance assumption.

## 2. Authorization / Service Identity

- User-owned Evidence and Personal State mutations require authenticated user context.
- The authenticated subject is the authoritative owner boundary; client-supplied owner identifiers MUST NOT override it.
- System/internal actors MUST be represented explicitly when used.
- Authorization MUST be evaluated before mutation.
- Cross-user reads and writes MUST fail closed.
- Provenance claims supplied by clients MUST be normalized/enforced by the trusted application boundary.

## 3. Retention and Erasure

- Retention periods are NOT invented by Increment 004.
- Personal data deletion MUST be distinguished from immutable operational security/audit records where legally and technically required.
- User-visible personal records MUST support an explicit deletion/erasure state where applicable.
- Erasure MUST NOT silently rewrite historical truth; instead, the system records the minimum necessary tombstone/audit fact required to explain the deletion.
- Legal/compliance requirements override product defaults and require Founder-approved policy before implementation.

## 4. Evidence ↔ Personal State Lineage

Evidence and Personal State remain separate bounded concepts.

- Evidence records what was received/observed and its provenance.
- Personal State represents the currently accepted user state.
- A state revision MAY reference one or more Evidence records as supporting lineage.
- Evidence MUST NOT automatically mutate Personal State.
- A state revision MUST remain understandable without requiring an AI interpretation layer.
- Removing or superseding Evidence MUST not silently fabricate or rewrite the provenance of an already accepted state revision.

## 5. Evidence Identity and Versioning

- Evidence identity answers: "which logical evidence item is this?"
- Evidence version answers: "which immutable representation/version of that item is this?"
- Correction creates a new version or explicit superseding record; raw historical versions are not overwritten.
- Revocation invalidates use without pretending the original record never existed.
- Dispute records disagreement without automatically selecting a winner.

## 6. Historical and Dispute Semantics

The system MUST distinguish:

- active
- superseded
- corrected
- revoked
- disputed

A disputed record remains unresolved until an authorized deterministic resolution action occurs. The system MUST NOT infer resolution from confidence alone.

Historical queries MUST be explicit about whether they request:

1. accepted current state,
2. state at a point in time,
3. evidence as originally received,
4. latest non-revoked evidence version.

## 7. Transaction and Idempotency Rules

- A state mutation and its lineage/audit record MUST commit atomically where they form one logical operation.
- Partial success MUST NOT expose a state revision without its required lineage metadata.
- Idempotency keys are scoped to the authenticated actor and mutation operation.
- Repeating an identical accepted request MUST return the same logical outcome.
- Reusing an idempotency key with materially different payload MUST fail deterministically.
- Stale revision updates MUST fail with explicit conflict semantics, preserving Increment 003 behavior.

## 8. Security and Privacy Invariants

- No client may select another user's subject/owner identifier.
- No client may elevate provenance authority.
- Authentication and authorization failures MUST fail closed.
- Sensitive Evidence MUST inherit explicit access-control requirements; no implicit broad read access is allowed.
- Logs and audit records MUST avoid unnecessary sensitive payload duplication.

## 9. Regression Invariants from Increment 003

Increment 004 MUST preserve:

- authenticated Personal State access,
- owner isolation,
- revision conflict protection,
- provenance enforcement,
- duplicate-registration behavior,
- invalid-token rejection,
- current-state read/write semantics already verified on main.

Any change to these invariants requires a new Founder-approved scope decision.

## 10. ADR Closure Set

Before implementation, the following ADRs MUST exist or be explicitly marked not applicable by Founder-approved decision:

- ADR-001: Evidence Identity and Versioning
- ADR-002: Evidence ↔ State Lineage
- ADR-003: State History and Conflict Semantics
- ADR-004: Authorization and Service Identity
- ADR-005: Retention, Erasure and Audit Boundary
- ADR-006: Transaction and Idempotency Boundary
- ADR-007: Historical Query Semantics
- ADR-008: Dispute / Revocation Semantics

ADRs are design decisions, not implementation instructions. They MUST record alternatives considered, rejected options, consequences, and migration/reversal implications.

## 11. Test Matrix Closure

Before implementation acceptance, verification MUST cover:

- ownership isolation
- unauthorized access
- provenance enforcement
- evidence versioning
- correction
- supersession
- revocation
- dispute
- point-in-time history
- idempotency replay
- idempotency conflict
- stale revision conflict
- transaction atomicity
- erasure behavior
- Increment 003 regression suite

## 12. Non-Goals

This closure package does not authorize:

- AI inference
- LLM integration
- Memory Intelligence
- Goal Intelligence
- Digital Twin
- agents
- autonomous recommendations
- behavioral or psychological inference
- UI redesign
- cross-domain intelligence

## Gate Decision

Current status: **DESIGN-CLOSURE CANDIDATE**.

Required next step: Founder review of this closure package and the associated Technical Design Draft 003 / Audit 003. Only explicit Founder approval may promote the design to Implementation Contract / Architecture Freeze eligibility.

No application code, schema, migration, or production configuration is authorized by this document.
