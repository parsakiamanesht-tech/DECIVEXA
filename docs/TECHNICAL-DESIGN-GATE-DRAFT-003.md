# DECIVEXA — Technical Design Gate Draft 003

**Status:** DRAFT — NOT FROZEN / NOT IMPLEMENTATION AUTHORIZATION  
**Candidate Increment:** 004 — Evidence & State History Foundation  
**Branch:** `arch/technical-design-gate-001`  
**Decision Mode:** READ / VERIFY / DESIGN  
**Founder approval:** REQUIRED before Freeze or implementation

---

## 1. Purpose

Define the minimum implementation-safe technical contract for Increment 004 without selecting unnecessary implementation technologies and without introducing AI, Memory Intelligence, Goal Intelligence, agents, prediction, or autonomous decision-making.

Increment 004 extends the verified Increment 003 Personal State foundation with durable evidence lineage and state history. It must preserve every Increment 003 invariant.

---

## 2. Non-Negotiable Architectural Rules

1. Founder decisions and approved architecture outrank technical implementation details.
2. Evidence Before Opinion.
3. Personal State remains the authoritative current user state.
4. Evidence is supporting provenance, not an alternate owner of Personal State.
5. Historical truth is never rewritten by later interpretation.
6. AI is not required for storage, retrieval, revision, correction, audit, or recovery.
7. User ownership and cross-user isolation remain mandatory.
8. Client input cannot promote its own provenance from `declared` to `observed` or `measured`.
9. No implementation technology is mandated unless required by a contract.
10. Material architectural changes require explicit Founder approval.

---

## 3. Scope

### In scope

- Evidence record identity and lifecycle
- Evidence versioning
- State revision lineage
- Accepted-at versus observed-at timestamps
- Correction and supersession
- Dispute representation
- Authorization boundaries
- Mutation idempotency
- Historical queries
- Audit records
- Privacy/erasure semantics
- Performance budgets for the deterministic path
- Regression protection for Increment 003

### Explicitly out of scope

- LLM/AI inference
- Memory Intelligence
- Living Human Model inference
- Goal OS
- Goal Discovery
- Digital Twin
- Agents
- Autonomous actions
- Predictive recommendations
- Behavioral or psychological inference
- UI redesign
- External provider integration
- Cross-domain intelligence

---

## 4. Domain Ownership

### Personal State

Owns the current authoritative state for the authenticated user.

It may:
- create current state,
- update state with optimistic revision protection,
- read current state,
- expose current revision metadata.

It must not:
- infer facts,
- assign `observed` or `measured` provenance from arbitrary client claims,
- directly own evidence source records.

### Evidence

Owns evidence records and their provenance metadata.

It may:
- create evidence through an authorized source boundary,
- record provenance and timestamps,
- version/correct/supersede evidence,
- represent unresolved disputes,
- expose evidence history.

It must not:
- silently mutate Personal State,
- convert an inference into a fact,
- become a recommendation engine.

### History/Audit

Owns immutable lineage metadata needed to explain accepted mutations. It is not a second source of domain truth.

---

## 5. Evidence Identity and Version Model

An evidence **identity** represents the logical evidence item. An evidence **version** represents one immutable content/provenance state of that item.

Required conceptual fields:

- `evidenceId`
- `version`
- `subjectId`
- `sourceType`
- `sourceId` when applicable
- `provenance`
- `observedAt`
- `acceptedAt`
- `status`
- `sensitivity`
- `createdBy`
- `createdAt`
- `supersedesVersion` when applicable
- `correctionOfVersion` when applicable

New corrections do not overwrite an old evidence version. They create a new version linked to the prior version.

---

## 6. Provenance Contract

Minimum provenance vocabulary for this increment:

- `declared` — supplied by the user or an explicitly trusted declaration boundary
- `observed` — produced by an authorized observation source
- `measured` — produced by an authorized measurement source

Client payload fields must never be trusted as proof of `observed` or `measured`.

Every provenance value must have an attributable source boundary.

---

## 7. Time Semantics

`observedAt` means when the underlying fact/event was observed or measured.

`acceptedAt` means when DECIVEXA accepted that evidence into its authoritative evidence store.

These timestamps are intentionally distinct.

If `observedAt` is unknown, it remains unknown; the system must not fabricate a timestamp.

---

## 8. Evidence Lifecycle

```text
Created
  ↓
Accepted
  ↓
Active
  ├── Corrected → new version
  ├── Superseded → linked replacement
  ├── Disputed → unresolved conflict state
  └── Revoked/Erased → unavailable under retention/privacy policy
```

Lifecycle transitions must be explicit and auditable.

No lifecycle transition may silently rewrite prior historical truth.

---

## 9. Correction, Supersession, Dispute and Revocation

These concepts are distinct:

- **Correction:** a later version states that an earlier representation was inaccurate.
- **Supersession:** a newer evidence item replaces the operational relevance of an older item without asserting that the old item was false.
- **Dispute:** two or more evidence items conflict and no authoritative resolution has been established.
- **Revocation/Erasure:** the system must no longer expose or retain the evidence under the applicable privacy/retention policy.

Unresolved disputes must remain unresolved. The system must not invent a winner.

---

## 10. Personal State ↔ Evidence Relationship

Evidence may support a Personal State revision, but evidence does not automatically become Personal State.

A state mutation must record sufficient lineage to answer:

> Which accepted evidence, if any, supported this state revision?

A state revision may also be user-declared without supporting evidence; this must remain explicitly declared rather than artificially promoted.

Removing or correcting evidence must not silently rewrite a historical state revision. It may cause a later validation or correction workflow in a future increment, but such derived intelligence is out of scope here.

---

## 11. State History Contract

Each accepted Personal State mutation produces a new logical revision.

Required semantics:

```text
revision N
   ↓ accepted mutation
revision N+1
```

Prior revisions remain queryable according to authorization and retention policy.

The current state is the latest accepted revision, not a separately maintained competing truth.

Stale revision writes must fail with the existing optimistic concurrency behavior established by Increment 003.

---

## 12. Dispute and Conflict Semantics

Conflict resolution is deterministic at the storage boundary:

1. Preserve both conflicting evidence records.
2. Mark the relationship as disputed.
3. Do not select a winner without an explicit authoritative rule.
4. Do not convert recency alone into truth.
5. Do not ask an LLM to resolve the conflict in this increment.

A future intelligence layer may reason over disputes but cannot mutate historical evidence merely by generating an interpretation.

---

## 13. Authorization Matrix

| Operation | Owner | Other user | Internal deterministic service | AI/Agent |
|---|---|---|---|---|
| Read own state | Allow | Deny | Allow under purpose boundary | Deny by default |
| Write own declared state | Allow | Deny | Allow under explicit contract | Deny |
| Read own evidence | Allow | Deny | Allow under purpose boundary | Deny by default |
| Create observed/measured evidence | Only through authorized source boundary | Deny | Allow only for registered source | Deny |
| Read another user's evidence | Deny | Deny | Only with explicit service authorization | Deny |
| Delete/erase own data | Allow subject to policy | Deny | Execute policy | Deny |
| Read audit metadata | Limited to own authorized scope | Deny | Allow | Deny by default |

Authorization must be evaluated server-side.

---

## 14. Idempotency

Idempotency applies at mutation boundaries that may be retried.

An idempotency key represents one intended mutation for one authenticated subject and endpoint contract.

Semantics:

- same key + same request fingerprint → return the original accepted result
- same key + different request fingerprint → reject as conflict
- expired/reclaimed keys must not silently create duplicate logical mutations within the defined retention window

Exact persistence duration is a later operational decision and must be documented before implementation.

---

## 15. Transaction Boundaries

A mutation that changes authoritative state and its required lineage metadata must commit atomically.

The minimum invariant is:

> A successful state mutation cannot exist without its required revision lineage, and lineage cannot claim a successful state mutation that was rolled back.

Evidence creation that is independent of a state mutation may commit independently.

Cross-domain distributed transactions are out of scope.

---

## 16. Historical Query Semantics

The system must distinguish:

- current state,
- state as-of a revision,
- state as-of a timestamp when supported,
- evidence history for one logical evidence identity,
- audit history for accepted mutations.

Historical queries are read-only and cannot mutate current state.

Authorization and privacy filters apply equally to current and historical reads.

---

## 17. Privacy and Erasure

Privacy erasure and audit integrity are separate concerns.

When user data is erased:

- user-owned content must be removed or rendered inaccessible according to the applicable retention policy;
- audit records must retain only the minimum metadata legally and architecturally permitted;
- audit metadata must not become a covert copy of erased personal content;
- no design in this increment may assume indefinite immutable retention of personal content.

Exact retention periods require a later approved policy decision.

---

## 18. Security Contract

Required controls include:

- authenticated access for protected resources,
- server-side authorization,
- cross-user isolation,
- provenance enforcement,
- input validation,
- tampered-token rejection,
- auditability of privileged mutations,
- sensitive-field minimization,
- no secret material in source control,
- no client-controlled trust escalation.

Increment 003 security tests remain mandatory regression tests.

---

## 19. Performance Budgets

This increment must preserve interaction-first behavior.

Required measured categories before implementation approval:

- current-state read latency,
- state mutation latency,
- evidence append latency,
- historical query latency,
- database query count for common reads,
- memory growth under bounded history workloads.

No numeric threshold is invented here. Thresholds must be approved in the Technical Performance Specification before implementation.

---

## 20. Increment 003 Regression Invariants

The following are immutable acceptance invariants for Increment 004:

1. Personal State creation succeeds for an authenticated owner.
2. Initial revision is `1`.
3. Successful update increments revision exactly once.
4. Stale revision returns `409`.
5. Cross-user access remains isolated (`404`/equivalent contract).
6. Missing authentication remains `401`.
7. Tampered token remains `401`.
8. Client-provided `provenance=observed` cannot promote a declaration.
9. Duplicate registration remains `409`.
10. Wrong password remains `401`.
11. Existing migration/build/typecheck/architecture verification remains green.

Any regression blocks the Increment 004 gate.

---

## 21. Observability and Audit

Every accepted mutation that materially changes authoritative state must have sufficient metadata to establish:

- actor,
- subject,
- operation,
- timestamp,
- resulting revision,
- relevant evidence lineage where applicable,
- success/failure outcome.

Logs must not become a secondary uncontrolled personal-data store.

---

## 22. Recovery

The deterministic system must remain usable during AI/provider outage.

For database transaction failure:
- mutation is reported as failed,
- partial authoritative state must not be exposed as successful.

For application restart:
- committed history remains available,
- in-flight uncommitted mutations are not treated as committed.

Offline client synchronization is not implemented in Increment 004; its future contract must preserve revision and idempotency semantics.

---

## 23. ADR Requirements

Before implementation, the following decisions must exist as explicit ADRs:

- ADR-001: Evidence identity/version model
- ADR-002: Evidence lifecycle and dispute semantics
- ADR-003: Personal State/history relationship
- ADR-004: Authorization boundary
- ADR-005: Mutation idempotency
- ADR-006: Privacy/erasure and audit separation
- ADR-007: Historical query semantics
- ADR-008: Performance budgets

No implementation agent may silently replace an approved ADR with a different architecture.

---

## 24. Acceptance Criteria for Technical Design Gate

The design gate can only move to Founder Review when:

- all ten R-01–R-10 findings are explicitly resolved,
- no contradiction exists with the Architecture Validation Gate,
- Increment 003 regression invariants are preserved,
- no out-of-scope intelligence capability has entered the contract,
- security and privacy boundaries are explicit,
- evidence/history semantics are deterministic,
- ADR list is complete,
- implementation technology choices are limited to what the contracts actually require.

---

## 25. Gate Decision

**Current decision: CONDITIONAL — DESIGN MATURING**

This document is a technical-design proposal only.

It does **not** authorize:

- schema creation,
- migration creation,
- API implementation,
- AI implementation,
- Memory Intelligence,
- Goal OS work,
- agent work,
- architecture freeze,
- merge to `main`.

Required sequence remains:

```text
Technical Design
      ↓
Audit
      ↓
Founder Approval
      ↓
Architecture Freeze
      ↓
Implementation Contract
      ↓
Implementation
      ↓
Verification
```
