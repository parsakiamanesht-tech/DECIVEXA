# DECIVEXA Implementation Contract — Increment 004

Status: FOUNDER-APPROVED DESIGN / IMPLEMENTATION CONTRACT CANDIDATE
Scope: Evidence & State History Foundation
Implementation authorization: NOT YET GRANTED

## 1. Contract Authority

This contract is subordinate to the approved DECIVEXA architecture, governance rules, Technical Design Draft 003, Audit 003, Closure Package 001, and Founder Approval artifact. It defines the implementation boundary; it does not authorize changes outside that boundary.

Any material deviation requires a new Founder approval before implementation.

## 2. Objective

Build a deterministic, authenticated, auditable foundation for Evidence and Personal State History so DECIVEXA can preserve what was received/observed, what state was accepted, and how accepted state evolved over time.

The implementation MUST remain AI-independent.

## 3. In Scope

### Evidence
- Create and retrieve user-owned Evidence records.
- Stable logical Evidence identity plus immutable version semantics.
- Provenance preservation and trusted normalization.
- `observedAt` and `acceptedAt` as distinct timestamps.
- Lifecycle states: active, superseded, corrected, revoked, disputed.
- Explicit correction/supersession/revocation/dispute operations.

### State History
- Preserve accepted Personal State revisions.
- Associate accepted state revisions with supporting Evidence lineage.
- Point-in-time history queries.
- Current-state reconstruction from the accepted revision model.
- Deterministic stale-revision conflict behavior.

### Security / Governance
- Authenticated ownership boundary.
- Fail-closed cross-user authorization.
- Explicit actor/service identity for internal operations.
- Client cannot elevate provenance or choose another owner.
- Audit metadata without unnecessary sensitive payload duplication.

### Reliability
- Atomic mutation + required lineage/audit metadata.
- Scoped idempotency keys.
- Deterministic idempotency conflict handling.
- Recovery behavior that does not expose partially committed logical state.

## 4. Explicit Non-Goals

The following are prohibited from this Increment:

- LLM integration
- AI inference
- Memory Intelligence
- semantic memory retrieval/ranking
- Goal Intelligence
- Goal OS implementation
- Digital Twin
- agents or autonomous actions
- recommendations or prediction
- behavioral/psychological inference
- cross-domain intelligence
- UI redesign
- new external integrations
- event-sourcing infrastructure as a mandatory architecture
- unapproved retention periods
- unapproved legal/compliance policy

## 5. Domain Boundaries

Evidence is a supporting record and provenance-bearing fact container.

Personal State is the accepted current state for a user.

History is the deterministic lineage of accepted state revisions.

Evidence MUST NOT autonomously mutate Personal State.

A state revision MAY reference one or more Evidence versions. Removing, revoking, or superseding Evidence MUST NOT silently rewrite accepted historical state.

## 6. Data Invariants

Every persisted user-owned record MUST have an authoritative owner derived from authenticated context.

Evidence logical identity MUST be distinct from Evidence version identity.

Historical versions MUST NOT be overwritten in place.

`observedAt` describes when the underlying observation occurred; `acceptedAt` describes when the system accepted the record into the authoritative model.

Unknown confidence MUST remain unknown; the system MUST NOT manufacture confidence values.

Dispute MUST NOT be resolved automatically from confidence alone.

## 7. Mutation Contract

Every mutation MUST:

1. authenticate the actor;
2. derive the owner from trusted authentication context;
3. authorize the operation;
4. validate revision/idempotency constraints;
5. apply the logical mutation and required lineage atomically;
6. emit auditable metadata;
7. return a deterministic result.

A stale revision MUST fail with explicit conflict semantics.

Reusing an idempotency key with materially different payload MUST fail deterministically.

## 8. API Boundary

API contracts MUST expose only the approved Increment 004 operations. They MUST NOT expose administrative shortcuts that bypass ownership, authorization, provenance, revision, or dispute rules.

Exact route names and DTO shapes are implementation details and MUST be derived from the approved domain contract; introducing unrelated API surface is out of scope.

## 9. Database / Migration Constraints

- Schema changes MUST be limited to Evidence and State History foundations.
- Existing Increment 003 Personal State behavior MUST remain compatible.
- Migrations MUST be forward-applicable in CI and locally.
- Migration generation MUST be deterministic and reviewable.
- No destructive migration is permitted without explicit Founder approval.
- No data backfill with invented historical facts is permitted.

## 10. Acceptance Criteria

Implementation is acceptable only when all are true:

### Functional
- authenticated user can create/retrieve owned Evidence;
- Evidence version lineage is preserved;
- correction, supersession, revocation and dispute semantics are deterministic;
- accepted Personal State revisions remain queryable historically;
- Evidence lineage can be inspected without AI interpretation;
- current state remains consistent with the accepted revision model.

### Security
- unauthenticated mutation/read is rejected where protected;
- cross-user access is rejected;
- owner cannot be selected from an untrusted request field;
- client cannot elevate provenance;
- invalid/tampered credentials fail closed.

### Consistency
- stale revision mutation fails deterministically;
- required state + lineage records are atomic;
- idempotent replay produces one logical outcome;
- idempotency payload conflict fails deterministically.

### Regression
All Increment 003 verified behaviors remain green, including Personal State authentication, ownership isolation, revision conflict protection, provenance enforcement and invalid-token rejection.

### Verification
CI MUST verify:
- typecheck;
- architecture/workspace tests;
- migration generation/application;
- supported PostgreSQL version;
- build;
- runtime startup;
- Evidence lifecycle;
- history queries;
- authorization isolation;
- provenance enforcement;
- idempotency;
- stale revision conflict;
- transaction/atomicity behavior;
- Increment 003 regression suite.

## 11. Test Matrix

Minimum test classes:

- Evidence create/read ownership
- Evidence version creation
- Correction
- Supersession
- Revocation
- Dispute
- Point-in-time history
- Current-state reconstruction
- Cross-user isolation
- Missing/invalid/tampered authentication
- Provenance normalization
- Stale revision
- Idempotent replay
- Idempotency payload conflict
- Atomic mutation failure/recovery
- Erasure/tombstone boundary
- Regression against Increment 003

## 12. Observability / Evidence

The implementation MUST produce sufficient CI/runtime evidence to prove the acceptance criteria without exposing unnecessary sensitive payloads.

Verification artifacts SHOULD include status codes, deterministic identifiers where safe, migration evidence, and failure-case evidence. Secrets and credentials MUST NOT be uploaded.

## 13. Rollback / Recovery

Rollback MUST preserve database integrity and avoid silently deleting accepted historical truth.

If an implementation defect is discovered:
- stop further rollout;
- preserve evidence of the failing state;
- revert application behavior through a reviewed change;
- use a corrective migration only when necessary and explicitly reviewed;
- never invent historical data to repair lineage.

## 14. Performance

No production SLO is invented by this contract.

CI/verification MUST measure the agreed workload categories from the Design Closure Package. Any production threshold must be based on measured evidence and Founder-approved decision.

## 15. Implementation Order

1. Freeze the approved contract and ADR set.
2. Define schemas/entities within the approved domain boundary.
3. Define repository/service boundaries.
4. Implement deterministic mutation rules.
5. Implement authorization/provenance enforcement.
6. Implement migrations.
7. Implement API boundaries.
8. Add unit/integration/architecture tests.
9. Run full CI verification.
10. Perform final diff/scope review.
11. Open a Draft PR for Founder review.

No step may introduce an unapproved architectural capability.

## 16. Exit Gate

Increment 004 implementation may be considered complete only after:

- all acceptance criteria pass;
- full CI is green;
- regression suite is green;
- security boundaries are verified;
- migration is verified;
- evidence artifact is produced;
- final scope audit passes;
- Founder approves the implementation PR for merge.

## 17. Current Gate Decision

**IMPLEMENTATION CONTRACT CANDIDATE — AWAITING EXPLICIT IMPLEMENTATION AUTHORIZATION**

This document is intentionally not an authorization to code. Implementation begins only after Founder explicitly approves this contract for execution.
