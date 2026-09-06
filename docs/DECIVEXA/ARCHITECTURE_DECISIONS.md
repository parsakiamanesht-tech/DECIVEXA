# DECIVEXA Architecture Decisions

This document is the authoritative governance record for Founder-approved architectural decisions. Architecture records do not grant implementation authority unless they explicitly and separately state that such authority has been granted.

---

## ADR-001 through ADR-009

Existing architectural decisions remain authoritative within their recorded scope.

---

## ADR-010 — Canonical AI Architecture Master Specification Registration

### 1. Title

Canonical AI Architecture Master Specification — Provider-Agnostic Intelligence Architecture, Governed AI Boundary, and Future Implementation Source-of-Truth.

### 2. Status

**FOUNDER-APPROVED — ARCHITECTURALLY REGISTERED — NOT IMPLEMENTATION-AUTHORIZED.**

This ADR formally registers the canonical AI Architecture Master Specification. It records architecture only and does not authorize implementation.

### 3. Date

2026-09-06

### 4. Founder

Parsa Kiamanesh

### 5. Canonical Document

`docs/architecture/DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md`

### 6. Decision

DECIVEXA formally adopts the Master Specification as the canonical architectural source-of-truth for its future AI/Intelligence implementation work, subject to later Founder-approved amendments and more-specific ADRs.

The architecture is explicitly:

- provider-agnostic;
- capability-centric;
- DECIVEXA Intelligence-owned;
- protected by deterministic authorization and policy boundaries;
- evidence-grounded;
- privacy-minimized;
- provenance-aware;
- evaluation-aware;
- resilient and gracefully degradable;
- auditable;
- versioned and replaceable;
- Founder-governed.

### 7. Provider Decision

**No AI provider is selected by this ADR.**

OpenAI, Anthropic, Google, self-hosted/open-weight models, local/edge inference, or other providers remain possible implementation routes. Any concrete provider/model selection requires a later Founder-approved decision within this architecture.

### 8. Core Architectural Boundaries

The registered architecture establishes the following non-negotiable boundaries:

1. DECIVEXA owns the Intelligence Architecture and authoritative personal/domain state.
2. External models/providers are computation resources, not sources of truth.
3. Evidence is distinct from inference.
4. Occurrence, Evidence, Claim, and ClaimVersion remain conceptually distinct.
5. Evaluation Standard is a semantic input to Evidential Sufficiency evaluation, not an eighth epistemic axis.
6. Confidence is distinct from Evidential Sufficiency.
7. External-model context is constructed through the governed Context boundary.
8. AI output is untrusted until applicable validation, evidence, policy, risk, privacy, and epistemic controls are satisfied.
9. AI cannot grant itself permission.
10. AI cannot directly mutate authoritative DECIVEXA state.
11. Provider/model fallback is subject to the same eligibility and policy controls as the primary route.
12. Model/provider failure must not become product failure.
13. Provenance/derivation must remain recoverable to the degree required to explain governed intelligence outcomes.

### 9. Future Claude Code Consumption

When an AI implementation phase is later authorized, Claude Code must treat the canonical Master Specification as an architectural source-of-truth and read it together with the current governance/architecture corpus and applicable implementation gate.

Claude Code must not:

- infer implementation authorization from this ADR;
- select a provider without an explicit Founder decision;
- invent missing architectural decisions;
- bypass existing ADRs or governance rules;
- collapse evidence and inference semantics;
- introduce an alternate AI/security/context path for convenience.

If a required implementation authorization or architectural decision is absent, Claude Code must stop and request the appropriate Founder decision rather than guessing.

### 10. Non-Effects / Explicit Non-Authorization

This ADR does **not** authorize:

- AI Runtime activation;
- AI Gateway implementation;
- Model Router implementation;
- Provider Adapter implementation;
- production AI capability registration;
- concrete model/provider selection;
- API credentials or external provider integration;
- Policy/Risk Engine implementation;
- full Context Engine implementation;
- Memory schema changes;
- Evidence/Claim schema changes;
- migrations;
- new HTTP/API surfaces;
- frontend implementation;
- Agent implementation or autonomous execution;
- voice output implementation;
- predictive intelligence implementation;
- any other material code or infrastructure change.

Each implementation increment remains separately Founder-gated.

### 11. Relationship to Existing AI Architecture Records

This ADR does not replace or invalidate prior AI architecture documents. The Master Specification consolidates and expresses their governing architectural intent while preserving more-specific decisions already recorded in dedicated ADRs.

Relevant existing records include the AI provider-independence/resilience decision, the AI Implementation Contract, Intelligence Architecture, Failure and Resilience Matrix, AI Traceability and Acceptance, AI Architecture Conformance Audit, Context Engine Boundary/Runtime Context Resolution decision, bounded Agent V1 architecture, and governed Voice Input V1 architecture.

Where a later or more-specific Founder-approved ADR establishes a narrower binding constraint, that constraint remains authoritative within its scope.

### 12. Governance Invariant

> **Architecture may define what DECIVEXA is allowed and designed to become; only a separate Founder-controlled implementation gate may authorize building it.**

### 13. Registration Record

**Canonical specification:** `docs/architecture/DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md`

**Registration commit:** `16c63062b538abb53f25ee49c33ffcbecae5cb7b`

**Registration date:** 2026-09-06

**Implementation authorization:** NOT GRANTED

**Provider:** OPEN / NOT SELECTED

---

## ADR-011 — Production Foundation and Preflight Acceptance Governance

### 1. Title

Production Foundation Architecture, Production Preflight Acceptance, and Controlled Claude Code Handoff.

### 2. Status

**FOUNDER-APPROVED — ARCHITECTURALLY REGISTERED — EXECUTION NOT AUTHORIZED.**

This ADR formally registers the Production Foundation and preflight design developed for the initial DECIVEXA Production launch. It does not authorize implementation or deployment.

### 3. Date

2026-09-06

### 4. Founder

Parsa Kiamanesh

### 5. Canonical Documents

- `docs/DECIVEXA/PRODUCTION/PIP-002_PRODUCTION_FOUNDATION_MASTER_PLAN.md`
- `docs/DECIVEXA/PRODUCTION/PIP-003_PRODUCTION_PREFLIGHT_REPOSITORY_ACCEPTANCE_SPEC.md`
- `docs/DECIVEXA/PRODUCTION/PIP-003_CLAUDE_CODE_PREFLIGHT_HANDOFF_CONTRACT.md`

### 6. Infrastructure Decision

DECIVEXA selects **Hetzner Cloud CX53 — Germany** as the initial Production launch infrastructure, subject to the verification and operational acceptance gates defined by the Production plan.

The CX53 is explicitly a launch-stage infrastructure decision and is not a permanent capacity ceiling or irreversible infrastructure commitment.

### 7. Initial Deployment Topology

The approved initial topology is a modular single-server deployment containing, as applicable:

- Next.js Web;
- NestJS API;
- PostgreSQL;
- reverse proxy / HTTPS entry point.

The database remains private and must not be publicly exposed.

The application must preserve service boundaries so that Web, API, Database, Workers, and other supporting services can later be separated without forcing a product/domain redesign.

### 8. Infrastructure Principles

The Production Foundation is governed by the following principles:

1. Start simple without designing into a corner.
2. Infrastructure must not redefine DECIVEXA's product or domain architecture.
3. Production capacity must be established by evidence, not nominal server specifications.
4. Shared CPU capacity is an explicit launch-stage limitation of CX53.
5. High Availability is not claimed for the initial single-server topology.
6. Backup is not equivalent to recovery.
7. Application rollback is not equivalent to database rollback/recovery.
8. Production readiness requires external runtime evidence.
9. Secrets must remain outside Git and application images.
10. Database state must be protected and recoverable.
11. Public network exposure must be minimized.
12. Operational configuration must be reproducible and documented.
13. Additional services must be introduced only when justified by real requirements.

### 9. Backup / Recovery Principle

Hetzner server-level backups/snapshots are not treated as the sole DECIVEXA recovery mechanism.

The design requires an independent database backup strategy and an actual restore verification before final Production acceptance.

Exact RPO, RTO, retention, independent backup destination, and monitoring/alerting selections remain explicit operational decisions to be resolved before their corresponding execution gates. They are not silently inferred by this ADR.

### 10. PIP-003 Preflight Decision

Before Production infrastructure execution, DECIVEXA requires a dedicated repository preflight and Production Candidate acceptance phase.

PIP-003 is intentionally read-only-first and evidence-based. Its mission is to establish whether a specific repository commit can become a Production Candidate.

The official result vocabulary is:

- `PASS`;
- `FAIL`;
- `BLOCKED`;
- `NOT TESTED`.

`BLOCKED` and `NOT TESTED` must never be converted into `PASS` by assumption.

### 11. PIP-003 Scope Boundary

PIP-003 does not authorize:

- deployment;
- server provisioning;
- DNS changes;
- database mutation;
- migration execution against Production;
- schema changes;
- dependency upgrades;
- lockfile regeneration;
- architecture changes;
- product changes;
- AI implementation;
- Context Engine changes;
- Observation/Event implementation;
- FIS implementation;
- security architecture redesign.

Its purpose is inspection, verification, classification, and reporting.

### 12. Claude Code Governance

When PIP-003 execution is later explicitly authorized, Claude Code acts as a controlled executor of the preflight protocol, not as an autonomous architect.

Claude Code must:

- inspect before changing;
- collect evidence before asserting acceptance;
- bind acceptance to an exact commit;
- preserve existing Founder-approved architecture;
- stop on material architectural/product/schema/security decisions;
- report blockers instead of improvising around them;
- preserve secret confidentiality;
- stop after producing the PIP-003 report.

Claude Code must not infer authorization from this ADR or from the existence of the canonical PIP documents.

### 13. Material-Change Stop Rule

If resolving a finding requires a material change to product, architecture, schema, security architecture, technology, scope, AI/Intelligence architecture, or an existing Founder-approved decision, Claude Code must stop, document the issue, identify the required Founder decision, and wait.

### 14. Runtime Evidence Principle

The Production process must preserve the distinction between:

- static verification;
- CI verification;
- real runtime verification;
- Production acceptance.

CI success does not establish Production runtime correctness.

A sandbox limitation that prevents runtime execution must be recorded as `BLOCKED`, not `PASS`.

### 15. Official Production Gate Sequence

The registered conceptual sequence is:

```text
G0  Founder Authorization
G1  Infrastructure Provisioned
G2  Server Security
G3  Deployment Foundation
G4  Database Integrity
G5  Application Deployment
G6  Runtime Connectivity
G7  HTTPS / DNS
G8  Backup
G9  Restore
G10 Rollback
G11 Security Verification
G12 Performance Baseline
G13 Disaster Recovery
G14 External Runtime Acceptance
G15 Founder Production Acceptance
```

No gate automatically authorizes the next gate.

### 16. Future Scaling

The single CX53 deployment is a launch-stage topology. The architecture remains open to evidence-driven evolution toward:

- separated Web/API/Database resources;
- multiple application instances;
- dedicated CPU resources;
- load balancing;
- dedicated/managed database infrastructure;
- workers/queues/object storage;
- advanced observability;

only when justified and separately approved.

### 17. AI / Intelligence Non-Effect

This ADR does not authorize any AI/Intelligence implementation or redesign.

ADR-009 and all other applicable AI architecture records remain authoritative.

Production infrastructure must not be used as a reason to activate or redesign AIRuntime, Context Engine, Model Router, AI Gateway, provider integrations, capability registration, memory schema, Evidence/Claim schema, Agent behavior, or predictive intelligence.

### 18. Production Readiness Definition

`PRODUCTION READY` is not granted by successful server provisioning or deployment alone.

Final Production acceptance requires evidence for infrastructure, security, application runtime, database integrity, backup, restore, rollback, runtime verification, operational observability, acceptable performance, disaster recovery, and Founder acceptance.

### 19. Non-Effects / Explicit Non-Authorization

This ADR does **not** authorize:

- provisioning the CX53;
- purchasing or activating infrastructure;
- deploying the current application;
- running Production migrations;
- changing DNS;
- creating or rotating credentials;
- implementing backup infrastructure;
- changing schemas;
- modifying application architecture;
- implementing missing runtime capabilities;
- reopening closed project gates;
- declaring Production Ready.

### 20. Registration Record

**PIP-002:** `docs/DECIVEXA/PRODUCTION/PIP-002_PRODUCTION_FOUNDATION_MASTER_PLAN.md`  
**PIP-003:** `docs/DECIVEXA/PRODUCTION/PIP-003_PRODUCTION_PREFLIGHT_REPOSITORY_ACCEPTANCE_SPEC.md`  
**Claude Code handoff:** `docs/DECIVEXA/PRODUCTION/PIP-003_CLAUDE_CODE_PREFLIGHT_HANDOFF_CONTRACT.md`  
**Registration date:** 2026-09-06  
**Implementation authorization:** NOT GRANTED  
**Production Ready:** NOT GRANTED

---
