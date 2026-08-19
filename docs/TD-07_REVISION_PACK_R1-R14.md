# TD-07 Revision Pack R1–R14

## Purpose
Close the findings from TD-07 Technical Review without changing the approved DECIVEXA architecture.

## R1 — Module Contracts
Every first-class OS/module must have explicit responsibility, inputs, outputs, owned state, dependencies, permissions, failure behavior, and non-responsibilities. No module may silently absorb another module's authority.

## R2 — Core vs Intelligence Boundary
Deterministic Core owns authoritative user state, deterministic rules, transactions, history, user controls, and essential continuity. Intelligence owns inference, prediction, synthesis, recommendations, and adaptive interpretation. Intelligence may propose; Core validates and commits authoritative state changes.

## R3 — Decision OS Responsibility
Decision OS is the orchestration and decision-governance layer for consequential choices. It consumes context and intelligence artifacts, compares options, exposes trade-offs and uncertainty, preserves user agency, and creates versioned decision records. It does not own every domain's operational state.

## R4 — DECIVEXA AI Contract
DECIVEXA AI is the product intelligence layer behind an AI Gateway. It is provider-independent, policy-bound, context-minimized, auditable, and incapable of directly mutating authoritative state. AI outputs are typed intelligence artifacts with provenance and confidence metadata.

## R5 — Context Fusion Governance
Context Fusion may combine cross-domain context only for an explicit purpose and only after policy evaluation. It must minimize context, respect sensitivity/consent boundaries, record provenance, and expose uncertainty. Cross-domain availability is not equivalent to cross-domain permission.

## R6 — Architecture Non-Goals
TD-07 does not freeze a specific cloud provider, framework, database engine, queue, cache, AI model/provider, mobile framework, deployment topology, or final UI visual system. These are implementation decisions constrained by the frozen contracts.

## R7 — Implementation Acceptance Matrix
Each frozen architectural contract must map to implementation evidence and verification tests before a related implementation phase can pass. No implementation feature is complete solely because code exists.

## R8 — Security Boundary vs Verification
Architecture defines required security properties; later security verification proves them. Security controls must cover data classification, authorization, consent/policy enforcement, encryption, key management, retention/deletion, audit integrity, external AI/data egress, and compartmentalization. OWASP ASVS 5.0 requires sensitive-data classification and documented protection requirements as architectural/documentation controls. 

## R9 — Performance & Continuity Acceptance
Performance and continuity remain architectural acceptance criteria. Each implementation phase must measure responsiveness, resource usage, background workload isolation, degraded operation, offline behavior, synchronization, and recovery according to a later technical performance specification.

## R10 — Change Control
After Freeze, any material change requires a Change Record identifying affected contracts, rationale, risk, compatibility impact, migration/recovery impact, and explicit Founder approval before implementation. Emergency security changes may use a documented emergency path but must be reviewed afterward.

## R11 — Architecture Baseline
The Architecture Freeze must receive a unique immutable baseline identifier and version. All implementation contracts, decisions, revisions, and recovery artifacts must reference that baseline.

## R12 — Architecture Backlog
Deferred ideas remain outside the frozen architecture unless explicitly promoted. Promotion requires impact analysis against the frozen contracts and Founder approval. The backlog is not permission to implement.

## R13 — Recovery / Rollback Contract
Every implementation increment must have a recoverable state, migration/rollback strategy where applicable, and identifiable last-known-good baseline. AI failure, provider failure, and partial service failure must not corrupt authoritative user history.

## R14 — Founder Approval Record
Architecture Freeze requires an explicit Founder approval record referencing the exact baseline version. Approval authorizes the frozen architecture, not arbitrary future changes. Material changes remain Founder-controlled.

## Freeze Conditions
TD-07 may move to FULL PASS only when:
1. R1–R14 are accepted;
2. the complete baseline is internally consistent;
3. no unresolved architecture-level contradiction remains;
4. the Founder approval record is available;
5. the baseline identifier is immutable and referenced by downstream implementation work.

## Governing Principles
- Evidence Before Opinion.
- User agency remains authoritative.
- AI augments but does not own authoritative state.
- Security and privacy are architectural properties.
- Performance and continuity are architectural properties.
- No silent history rewriting.
- No fabricated intelligence.
- Minimum necessary context.
- Founder-controlled material change governance.
