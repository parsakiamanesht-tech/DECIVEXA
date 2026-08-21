# DECIVEXA — Technical Design Gate Draft 001

**Status:** DRAFT — FOUNDER REVIEW REQUIRED  
**Decision Mode:** READ / VERIFY / DESIGN — NOT IMPLEMENTATION AUTHORIZATION  
**Branch:** `arch/technical-design-gate-001`  
**Candidate Increment:** 004 — Evidence & State History Foundation  
**Architecture Freeze:** NOT GRANTED  
**Implementation Authorization:** NOT GRANTED

## 1. Purpose

This document converts the existing Technical Design Gate blockers into concrete, testable technical contracts. It is a proposal for Founder review, not a declaration that the architecture is frozen.

The governing sequence remains:

`Technical Design → Validation → Founder Approval → Architecture Freeze → Implementation Contract → Controlled Build`

No implementation agent may treat this draft as permission to create application code, irreversible schemas, provider integrations, agents, or production infrastructure.

## 2. Candidate Increment 004 Boundary

The preferred next implementation increment is **Evidence & State History Foundation**.

### In scope

- durable evidence records with explicit provenance metadata;
- authoritative Personal State history and revision lineage;
- correction and supersession semantics;
- auditability of state/evidence changes;
- deterministic authorization and ownership boundaries;
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
- UI redesign.

## 3. TD-01 — Architecture Constitution & Document Authority

### Proposed contract

Normative precedence is:

1. Founder Decision / explicit approval
2. Architecture Constitution / non-negotiables
3. Canonical Product + Philosophy Baseline
4. FIS Registry
5. Phase Architecture Specifications
6. Technical Design Gates and approved ADRs
7. Implementation Contracts
8. Implementation details

Lower-level material cannot override a higher-level rule. Superseded documents remain historical records but are not active guidance.

### ADR rule

Every material architectural decision receives a stable ID, status, rationale, affected constraints, alternatives considered, Founder approval state, and validation evidence.

### Acceptance

An implementation agent can resolve document conflicts deterministically without relying on informal memory.

## 4. TD-02 — Domain Boundaries & Ownership

### Proposed contract

Each domain owns its authoritative state and exposes it through explicit application contracts. Other domains may consume published contracts/events but may not write another domain's authoritative tables directly.

For each domain, the technical specification must record:

- authoritative state;
- commands it accepts;
- events it emits;
- events it consumes;
- permitted intelligence inputs;
- forbidden direct dependencies;
- privacy classification;
- offline requirements.

The Personal Intelligence Core may consume authorized domain information but does not become the owner of domain truth.

### Acceptance

Every major capability has one owner, one authoritative state boundary, and an explicit read/write interaction contract.

## 5. TD-03 — State, Event & Consistency Model

### Proposed contract

- Authoritative historical events are immutable.
- Current state is a deterministic projection of accepted authoritative changes.
- Every mutation has a stable identity/idempotency key.
- Duplicate mutation submission is safe and does not create duplicate authoritative effects.
- Revisions use optimistic concurrency semantics.
- Conflicts are rejected or explicitly resolved; they are never silently overwritten.
- Client timestamps are informational; server acceptance time is authoritative for ordering where required.
- AI interpretation can reference history but cannot rewrite authoritative history.

### Increment 004 minimum

Personal State revisions must retain lineage: previous revision, actor, reason/category, timestamp, and resulting state snapshot or equivalent reconstructible representation.

### Acceptance

The same accepted authoritative history produces the same authoritative state and stale writes are deterministically rejected.

## 6. TD-04 — Security Threat Model

### Minimum assets

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
- explicit incident containment and recovery boundaries.

### Increment 004 threats

At minimum: cross-user access, unauthorized mutation, provenance spoofing, replay/duplicate submission, stale-write corruption, log leakage, export leakage, and malicious evidence injection.

### Acceptance

Every Increment 004 critical asset has a threat-to-control mapping and executable security tests for the principal abuse cases.

## 7. TD-05 — Performance Budget Contract

### Proposed baseline

Performance thresholds must be measured rather than assumed. The first technical specification must define budgets for:

- authenticated API response time;
- state/evidence read latency;
- mutation latency;
- database query count/shape for critical paths;
- startup/health readiness;
- client perceived interaction latency where a UI exists.

Mobile CPU, memory, battery and degraded-network budgets remain architecture-level requirements and must be specified before mobile implementation.

### Acceptance

Every release-critical path has a measurable budget, a measurement method, and a CI or validation mechanism where practical.

## 8. TD-06 — AI Evaluation & Truthfulness Contract

### Proposed contract

AI is not part of Increment 004. When AI is later introduced:

- every factual personal claim must have provenance or explicit uncertainty;
- observed, user-confirmed and inferred information remain distinct;
- recommendations must identify relevant evidence/context;
- unsupported claims must not be presented as facts;
- human agency remains authoritative for consequential choices;
- AI outage must not fabricate continuity or intelligence.

### Acceptance

A future AI response can be classified as evidence-backed, user-confirmed, inferred, uncertain, or unsupported; unsupported claims cannot silently become durable truth.

## 9. TD-07 — Memory Provenance & Poisoning Protection

### Proposed contract

Durable personal knowledge must carry, as applicable:

- source;
- provenance type;
- created/observed time;
- confidence;
- sensitivity;
- confirmation state;
- last verification;
- review/expiration state;
- correction/supersession lineage.

External content is untrusted by default and cannot silently become authoritative personal knowledge.

### Acceptance

A correction can invalidate or supersede derived personal knowledge without rewriting historical source evidence.

## 10. TD-08 — Derived Intelligence Lifecycle

### Proposed lifecycle

`Created → Validated → Used → Re-evaluated → Superseded/Corrected → Retained/Deleted`

Raw data, observations, interpretations, derived intelligence and recommendations remain distinct classes.

Deletion/correction of source material must mark dependent derived artifacts stale or invalid according to dependency policy; it must not silently preserve a derived claim as an authoritative fact.

### Acceptance

Every durable derived artifact has a traceable source/dependency set and an explicit invalidation/retention behavior.

## 11. TD-09 — AI Gateway Contract

### Proposed contract

No feature may call an external model provider directly. Future AI access goes through an internal gateway with:

- capability request;
- minimized context envelope;
- sensitivity policy;
- consent/authorization decision;
- provider/model policy;
- timeout/retry/fallback policy;
- provenance requirements;
- output validation;
- resource/cost policy;
- privacy-safe telemetry.

The gateway must fail closed for prohibited sensitive-data flows and fail gracefully to deterministic core behavior when no provider is available.

### Acceptance

A provider can be replaced without changing domain truth or core application contracts.

## 12. TD-10 — Agent Governance Contract

Agents are not part of Increment 004.

Before any agent implementation, each agent must declare purpose, capabilities, data scope, action scope, authorization, budget, rate limit, audit trail, failure policy, approval requirements, rollback/compensation behavior, and kill-switch/Safe Mode behavior.

### Acceptance

No agent receives implicit access to all Personal Intelligence or unrestricted actions.

## 13. TD-11 — Continuity, Recovery & Offline Contract

### Proposed continuity levels

**Level 0 — Normal:** Core state, deterministic APIs and permitted intelligence available.

**Level 1 — AI unavailable:** Core state/history and deterministic workflows remain available; no false AI-generated intelligence is shown.

**Level 2 — Cloud degraded:** Last Known Good State remains readable; locally accepted pending changes are isolated and queued where offline operation is supported.

**Level 3 — Network unavailable:** Device-local pending work remains explicit and cannot masquerade as server-authoritative state.

**Level 4 — Disaster recovery:** Restore authoritative history first, then rebuild derived projections/intelligence.

Conflict resolution must preserve authoritative history and require explicit rules; silent last-write-wins is prohibited for material Personal Intelligence state.

### Acceptance

AI or network failure cannot erase authoritative history and recovery cannot rewrite historical truth.

## 14. TD-12 — Architecture Decision & Change Governance

### Proposed ADR schema

Each ADR must contain:

- decision ID;
- title/status;
- problem/context;
- decision;
- alternatives;
- consequences;
- FIS impact;
- security/privacy impact;
- performance impact;
- affected documents/contracts;
- Founder approval state;
- implementation reference;
- validation evidence;
- supersedes/superseded-by links where applicable.

Material changes to product direction, architecture, scope, implementation strategy, technology, schemas, security, branding, or other significant decisions require explicit Founder approval before execution.

### Acceptance

A material decision is traceable from Founder approval through specification, implementation and validation.

## 15. Evidence & State History — Increment 004 Technical Contract Candidate

This is a candidate contract only; it is not implementation authorization.

### Evidence

An Evidence record should be attributable to a source and carry provenance, temporal metadata, confidence/sensitivity where applicable, ownership/authorization context, and lifecycle status.

### State history

A Personal State change should produce a new revision rather than mutate historical truth in place. The system must preserve revision ordering, actor, accepted-at timestamp, and correction/supersession semantics.

### Provenance

Client input cannot self-authorize a stronger provenance class. Provenance is assigned/enforced by trusted application boundaries.

### Authorization

A user may read and mutate only their own authorized Personal State/Evidence unless an explicitly governed service role exists.

### Auditability

Material state/evidence changes must be attributable and testable without logging sensitive payloads unnecessarily.

## 16. Required Validation Matrix

Before Technical Design Gate can become PASS, each TD item requires:

- contract review;
- contradiction check against canonical baseline;
- security/privacy impact review;
- performance impact review;
- testability review;
- Founder approval state;
- classification of remaining unknowns as implementation-level or architecture-level.

For Increment 004 specifically, acceptance tests must cover at minimum:

- ownership isolation;
- authenticated access;
- provenance enforcement;
- immutable/superseded history behavior;
- stale revision rejection;
- idempotent mutation;
- correction semantics;
- audit attribution;
- deletion/retention behavior;
- no AI dependency.

## 17. Current Gate Decision

**STATUS: DRAFT / NOT PASSED**

This document resolves the direction of the twelve Technical Design blockers enough to expose concrete review questions, but it does not claim that every contract is Founder-approved or implementation-ready.

The next review must explicitly identify:

1. accepted contracts;
2. rejected or revised contracts;
3. unresolved architecture blockers;
4. required ADRs;
5. final Increment 004 boundary;
6. whether the architecture is ready to Freeze.

Until that review passes:

**No Increment 004 implementation.**
