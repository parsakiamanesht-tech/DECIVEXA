# DECIVEXA — Technical Design Gate Draft 002

**Status:** DRAFT — FOUNDER REVIEW REQUIRED  
**Decision Mode:** READ / VERIFY / DESIGN — NOT IMPLEMENTATION AUTHORIZATION  
**Branch:** `arch/technical-design-gate-001`  
**Candidate Increment:** 004 — Evidence & State History Foundation  
**Architecture Freeze:** NOT GRANTED  
**Implementation Authorization:** NOT GRANTED

## 1. Purpose

This revision converts the Technical Design Gate proposal into explicit contracts while resolving the audit findings from Draft 001. It remains a proposal for Founder review, not a declaration that the architecture is frozen.

The governing sequence remains:

`Technical Design → Validation → Founder Approval → Architecture Freeze → Implementation Contract → Controlled Build`

No implementation agent may treat this draft as permission to create application code, irreversible schemas, provider integrations, agents, or production infrastructure.

## 2. Candidate Increment 004 Boundary

The preferred next implementation increment is **Evidence & State History Foundation**.

### In scope

- durable evidence records with explicit provenance metadata;
- authoritative Personal State history and revision lineage;
- distinct correction, supersession, dispute/contradiction, and revocation semantics;
- auditability of state/evidence changes;
- deterministic authorization and ownership boundaries;
- idempotent mutation behavior where retries could duplicate authoritative effects;
- testable lifecycle rules for evidence and state history.

### Explicitly out of scope

- LLM/AI inference;
- Memory Intelligence;
- Goal OS / Goal Discovery;
- Digital Twin;
- agents;
- predictive recommendations;
- psychological or behavioral profiling;
- cross-domain intelligence;
- autonomous actions;
- provider-specific AI integration;
- external observation/measured ingestion adapters;
- UI redesign;
- mandatory Event Sourcing;
- invention of a new retention/deletion policy.

## 3. TD-01 — Architecture Constitution & Document Authority

### Proposed contract

Normative precedence is:

1. Founder Decision / explicit approval
2. Architecture Constitution / non-negotiables
3. Canonical Product + Philosophy Baseline
4. FIS Registry
5. Phase Architecture Specifications
6. Approved Technical Design Gates and ADRs
7. Implementation Contracts
8. Implementation details

Lower-level material cannot override a higher-level rule. Superseded documents remain historical records but are not active guidance.

Every material architectural decision receives a stable ID, status, rationale, affected constraints, alternatives considered, Founder approval state, and validation evidence.

### Acceptance

An implementation agent can resolve document conflicts deterministically without relying on informal memory.

## 4. TD-02 — Domain Boundaries & Ownership

Each domain owns its authoritative state and exposes it through explicit application contracts. Other domains may consume published contracts/events but may not write another domain's authoritative state directly.

For Increment 004:

- Personal State owns currently accepted personal-state truth.
- Evidence owns attributable supporting/contradicting/contextual records.
- History owns immutable lineage records describing accepted state transitions.
- Interpretation/derived intelligence owns no authoritative historical truth and is out of scope.

The Personal Intelligence Core may consume authorized domain information but does not become the owner of domain truth.

### Acceptance

Every affected capability has one authoritative owner and an explicit read/write interaction contract.

## 5. TD-03 — State, Event & Consistency Model

The design requires durable, queryable state lineage but **does not mandate Event Sourcing** as an implementation pattern.

Required properties:

- Every accepted Personal State mutation has an ordered revision.
- Historical revisions are immutable records.
- Each revision records actor and server `acceptedAt` plus sufficient causal/reference metadata to explain the transition.
- Current state is derivable from accepted revision lineage or another deterministic mechanism with equivalent auditability.
- Optimistic concurrency protects against stale writes.
- Conflicts are rejected or explicitly resolved; they are never silently overwritten.
- Client timestamps are informational; server acceptance time is authoritative for acceptance ordering where required.
- AI interpretation cannot rewrite authoritative history.

### Acceptance

Equivalent accepted authoritative histories produce the same authoritative state, and stale writes are deterministically rejected.

## 6. TD-04 — Security Threat Model

### Increment 004 assets

- identity/authentication data;
- Personal State;
- Evidence;
- future Memory/Personal Intelligence data;
- credentials/tokens;
- audit records;
- backups and exports.

### Mandatory controls

- authenticated identity boundary;
- per-user authorization;
- least privilege;
- tenant/data isolation;
- secret management outside source control;
- encryption in transit and at rest where applicable;
- sensitive logging prohibition;
- auditable security events;
- incident containment and recovery boundaries.

### Increment 004 threats

At minimum: cross-user access, unauthorized mutation, provenance spoofing, replay/duplicate submission, stale-write corruption, log leakage, export leakage, malicious evidence injection, and tampered lineage references.

### Acceptance

Every critical Increment 004 asset has a threat-to-control mapping and executable security tests for principal abuse cases.

## 7. TD-05 — Performance & Reliability Contract

Performance thresholds must be measurable rather than invented. The final technical specification must define budgets and measurement methods for:

- authenticated current-state reads;
- evidence/history reads;
- revision append/mutation;
- authorization checks;
- database query shape/count for critical paths;
- startup/health readiness.

The final design must also define transaction boundaries, retry semantics, failure behavior, and recovery expectations.

Exact numeric budgets are deferred until workload assumptions are documented; no arbitrary thresholds are introduced by this Draft.

### Acceptance

Every release-critical path has a measurable budget, a measurement method, and a validation mechanism where practical.

## 8. TD-06 — AI Evaluation & Truthfulness Contract

AI is not part of Increment 004. When AI is later introduced:

- factual personal claims require provenance or explicit uncertainty;
- declared, observed, measured, and inferred information remain distinct;
- unsupported claims cannot silently become durable truth;
- recommendations preserve human authority for consequential choices;
- AI outage cannot fabricate continuity or intelligence.

### Acceptance

A future AI output can be classified by evidentiary status and cannot silently mutate authoritative historical truth.

## 9. TD-07 — Memory Provenance & Poisoning Protection

Durable personal knowledge, when introduced later, must retain applicable source, provenance type, temporal metadata, confidence/uncertainty, sensitivity, confirmation state, verification state, and correction/supersession lineage.

External content is untrusted by default and cannot silently become authoritative personal knowledge.

For Increment 004, this is a design boundary only; no Memory Intelligence is implemented.

### Acceptance

A later correction can invalidate or supersede derived personal knowledge without rewriting historical source evidence.

## 10. TD-08 — Derived Intelligence Lifecycle

When derived intelligence exists in a future increment, raw data, observations, interpretations, derived intelligence, and recommendations remain distinct classes.

Proposed lifecycle:

`Created → Validated → Used → Re-evaluated → Superseded/Corrected → Retained/Deleted`

Deletion/correction of source material must mark dependent derived artifacts stale or invalid according to an approved dependency policy; it must not silently preserve a derived claim as authoritative fact.

Increment 004 creates no derived intelligence.

### Acceptance

Every future durable derived artifact has a traceable dependency set and explicit invalidation/retention behavior.

## 11. TD-09 — AI Gateway Contract

No Increment 004 feature calls an external model provider. Future AI access goes through an internal gateway with capability request, minimized context, sensitivity policy, authorization/consent decision, provider/model policy, timeout/retry/fallback, provenance requirements, output validation, resource/cost policy, and privacy-safe telemetry.

The gateway must fail closed for prohibited sensitive-data flows and fail gracefully to deterministic core behavior when unavailable.

### Acceptance

Provider replacement does not require changing domain truth or core application contracts.

## 12. TD-10 — Agent Governance Contract

Agents are not part of Increment 004.

Before any agent implementation, each agent must declare purpose, capabilities, data scope, action scope, authorization, budget, rate limit, audit trail, failure policy, approval requirements, rollback/compensation behavior, and kill-switch/Safe Mode behavior.

### Acceptance

No agent receives implicit access to all Personal Intelligence or unrestricted actions.

## 13. TD-11 — Continuity, Recovery & Offline Contract

### Continuity levels

**Level 0 — Normal:** deterministic core state and permitted capabilities available.

**Level 1 — AI unavailable:** core state/history remains available; no false AI intelligence is shown.

**Level 2 — Cloud degraded:** Last Known Good State remains readable; pending changes are explicitly isolated and queued only where offline operation is supported.

**Level 3 — Network unavailable:** device-local pending work cannot masquerade as server-authoritative state.

**Level 4 — Disaster recovery:** restore authoritative history first, then rebuild derived projections/intelligence.

Conflict resolution must preserve authoritative history; silent last-write-wins is prohibited for material Personal Intelligence state.

### Acceptance

AI/network failure cannot erase authoritative history, and recovery cannot rewrite historical truth.

## 14. TD-12 — Architecture Decision & Change Governance

Each ADR must contain decision ID, title/status, context, decision, alternatives, consequences, FIS impact, security/privacy impact, performance impact, affected documents/contracts, Founder approval state, implementation reference, validation evidence, and supersession links.

Material changes to product direction, architecture, scope, implementation strategy, technology, schemas, security, branding, or other significant decisions require explicit Founder approval before execution.

### Acceptance

A material decision is traceable from Founder approval through specification, implementation and validation.

## 15. Increment 004 — Evidence Contract Candidate

This is a candidate contract only; it is not implementation authorization.

An Evidence record must preserve:

- `id`;
- owner/subject boundary;
- source type;
- provenance: `declared | observed | measured`;
- `observedAt` when the underlying fact/event occurred, when known;
- server `acceptedAt` when DECIVEXA accepted the evidence;
- lifecycle status;
- sensitivity classification;
- optional confidence/uncertainty;
- references to affected state/revision where applicable.

`confidence` may be unknown/null. The system must never manufacture a numeric confidence value without a defensible basis.

`observedAt` and `acceptedAt` are distinct and must not be silently conflated.

### Evidence lifecycle

The following states are intentionally distinct:

- **active** — currently valid for its stated purpose;
- **superseded** — replaced by a later evidence record;
- **corrected** — materially corrected through a new lineage record;
- **disputed** — materially contradicted and not yet resolved;
- **revoked** — no longer valid/authorized for use.

Correction, supersession, dispute/contradiction, and revocation are distinct operations. Original evidence remains auditable unless an approved privacy/deletion policy requires removal or redaction.

## 16. Increment 004 — Personal State History Contract Candidate

Personal State remains the owner of currently accepted personal-state truth.

History preserves:

1. revision 1 creation;
2. deterministic ordered revisions;
3. immutable historical revisions;
4. stale-revision rejection;
5. actor attribution;
6. server `acceptedAt`;
7. causal/reference metadata;
8. relationships to supporting/contradicting evidence where applicable.

History does not become a separate source of truth competing with Personal State; it is the auditable lineage of accepted Personal State transitions.

Increment 003 behavior is a hard regression invariant: authenticated ownership, 401 boundaries, 404 cross-user isolation, 409 stale-revision behavior, and provenance enforcement must remain intact.

## 17. Idempotency Contract

Idempotency is required only at mutation boundaries where retry could otherwise create duplicate authoritative effects.

An idempotency key is scoped to actor/owner and operation semantics and produces deterministic replay behavior. It is not itself the identity of the resulting Evidence or State revision.

The final design must specify key lifetime and conflict behavior without introducing a product-wide global idempotency mechanism unless separately approved.

## 18. Privacy, Retention & Deletion

Increment 004 invents no arbitrary retention period.

Deletion, redaction, export, and retention behavior must follow the canonical privacy/data-lifecycle policy once approved. Until then, the design preserves the distinction between current state, historical lineage, and evidence relationships.

No technical mechanism may silently convert deletion into falsification of historical audit semantics; privacy erasure requirements must be reconciled with audit obligations by the approved privacy/security design.

## 19. Observability & Audit

Every accepted mutation must be attributable to an actor and server timestamp and must expose enough metadata to reconstruct the accepted transition without AI interpretation.

Operational logs and user-visible historical records remain conceptually distinct.

Sensitive payloads must not be copied into logs merely to make auditing convenient.

## 20. Required Validation Matrix

Before Technical Design Gate can become PASS, each TD item requires:

- contract review;
- contradiction check against canonical baseline;
- security/privacy impact review;
- performance impact review;
- testability review;
- Founder approval state;
- classification of remaining unknowns as implementation-level or architecture-level.

Increment 004 acceptance design must cover at minimum:

- ownership isolation;
- authenticated access;
- provenance enforcement;
- immutable/superseded history behavior;
- stale revision rejection;
- idempotent mutation;
- correction semantics;
- dispute/revocation semantics;
- audit attribution;
- privacy/retention/deletion behavior once canonical policy exists;
- no AI dependency.

## 21. Architecture Freeze Preconditions

Before implementation, the following must be separately validated:

- domain ownership and dependency direction;
- state/event consistency model;
- security threat model;
- privacy/data lifecycle policy;
- provenance semantics;
- failure/recovery model;
- performance budgets;
- testing strategy;
- required ADR decisions;
- Founder approval of the final Technical Design Gate.

## 22. Current Gate Decision

**STATUS: DRAFT 002 — READY FOR SECOND AUDIT, NOT PASSED, NOT FROZEN.**

This revision resolves the previously identified ambiguity around Event Sourcing, Evidence ownership, temporal semantics, confidence fabrication, lifecycle distinctions, idempotency scope, retention policy, and Increment 003 regression invariants.

The next review must identify:

1. accepted contracts;
2. rejected or revised contracts;
3. unresolved architecture blockers;
4. required ADRs;
5. final Increment 004 boundary;
6. whether the architecture is ready to Freeze.

Until that review passes:

**No Increment 004 implementation.**
