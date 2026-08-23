# DECIVEXA — Repository Governance Instructions

These instructions are permanent and apply to all work in this
repository, not just the phase in which they were registered
(Phase 10Q-Governance-Registration). They govern how Claude Code
approaches any material change to DECIVEXA, across every session.

## Mandatory Pre-Implementation Architectural Review

Before building, modifying, implementing, extending, or materially
changing **any** DECIVEXA module, subsystem, engine, OS, service,
feature, architecture component, or cross-cutting capability, Claude
**must automatically** perform a deep review of the repository's
relevant architectural and governance documentation first.

This applies globally, to every present and future DECIVEXA module,
including but not limited to: Personal Intelligence, Memory, Human OS,
Goal OS, Daily OS, Discipline OS, Health OS, Money OS, Learning OS,
Business OS, Relationship OS, Review OS, Growth Navigation Engine,
Progress Intelligence, Personal AI Coach, Decision AI, AI Gateway,
Evidence Platform, Digital Twin, Agent Architecture, Context Fusion,
Security/Privacy, and any future subsystem or feature.

**The developer/user does not need to ask Claude to check the
documents first. The review is automatic, not opt-in, and not
prompted.** The current user request must never be treated as the
complete specification when repository documentation exists — the
repository is the source of accumulated architectural intent, and a
prompt is only ever a partial view of it.

This does not mean reading every document before every tiny code
change. It means: before any material implementation of a module,
subsystem, feature, architecture component, or cross-cutting
capability, autonomously identify and deeply review all documentation
relevant to that specific change, deeply enough that previously
architected, approved, deferred, or explicitly excluded ideas are not
accidentally lost.

## Document Review Scope

As applicable to the requested change, review:

- **Architecture authority** — Architecture Freeze / Architecture
  Freeze Baseline, Founder approval records, approved Technical
  Decisions, TD-09 or equivalent implementation-readiness/build-
  authorization records.
- **System architecture** — Canonical System Map, Master
  Architecture/Vision, Foundation documents, domain-boundary
  documents, ownership matrices, dependency maps.
- **Module-specific architecture** — Technical Design documents,
  module/subsystem specifications, previously approved Increment
  Contracts, previous gate documents, previous readiness reviews.
- **Feature/intelligence registry** — FIS Registry, capability
  registries, architecture backlog, deferred ideas, future-upgrade
  records.
- **Governance history** — previous phase reports, Founder Decision
  Records, boundary gates, resolution gates, Contracts, self-audits,
  stop conditions, explicit non-goals.
- **Project philosophy and invariants** — DECIVEXA philosophy/vision,
  constitutional principles, non-negotiable architecture principles
  (Evidence Before Opinion, Architecture Before Accumulation, Minimum
  Input / Maximum Value, and other applicable invariants).
- **Dependencies** — upstream modules, downstream consumers,
  cross-cutting layers, data ownership, security/privacy requirements,
  evidence/provenance requirements, AI dependencies, memory/context
  dependencies.

A filename scan or keyword search alone is not sufficient. The review
must actually establish, where relevant: what was already designed;
what was already decided; what was explicitly approved; what remains
deferred; what remains UNKNOWN; what is explicitly out of scope; what
is implementation-authorized versus not; what dependencies already
exist; what architectural ideas were previously proposed for this
module and which of those are Founder-approved versus merely
conceptual versus must-not-be-implemented-yet; which existing
implementations establish precedent; which previous decisions
constrain the new work; which ideas belong to the Architecture Backlog
and must be preserved rather than silently discarded; whether
documents contradict each other; whether the current request would
accidentally reopen a closed decision; whether the request is
attempting to invent a boundary that should already be governed; and
whether an existing architectural concept would otherwise be
accidentally duplicated.

## Implementation Readiness Inventory

Before writing implementation code, produce an Implementation
Readiness Inventory (internal or user-visible, as appropriate to the
task) that establishes: target module/component; relevant
architectural documents reviewed; relevant Founder decisions; relevant
Technical Decisions; relevant FIS items; relevant Contracts; relevant
dependencies; existing implementation precedent; approved
architectural ideas that must be preserved; deferred ideas that must
not be implemented; explicit non-goals; UNKNOWNs; contradictions;
required gates/authorizations; implementation scope; and potential
architectural omissions.

The inventory must answer: **"Is there anything previously architected
for this area that could be forgotten if implementation starts now?"**
If yes, identify it before implementation begins.

## Preserve Architected Ideas

If repository documents contain an already-designed idea relevant to
the requested implementation, it must not be silently omitted merely
because it isn't mentioned in the latest prompt, is inconvenient,
requires additional work, would make the simpler implementation
harder, or Claude independently prefers a different design. Instead,
classify each such idea as one of: **REQUIRED NOW**, **REQUIRED
LATER / DEFERRED**, **BACKLOG**, **OUT OF SCOPE**, **SUPERSEDED**, or
**UNKNOWN / REQUIRES DECISION**. No previously approved architectural
idea may disappear silently.

## Authority Hierarchy

Distinguish evidence from authority. Never promote a conceptual
document into implementation authorization. When sources conflict:
(1) follow the highest-authority applicable source; (2) preserve
Founder decisions; (3) preserve Architecture Freeze constraints;
(4) respect approved Contracts and implementation gates; (5) treat
conceptual documents as evidence, not automatic authorization;
(6) if the conflict affects an architectural boundary or
implementation decision that cannot safely be deferred, **stop and
request the required Founder/Governance decision** rather than
guessing.

## Deferred / UNKNOWN Protection

A deferred or UNKNOWN item remains deferred or UNKNOWN unless a valid
Founder/Governance decision explicitly resolves it. Never convert
UNKNOWN into an assumed design, DEFERRED into implementation, a
CONCEPT into approved architecture, or a PROPOSAL into authorization —
even when the assumption would make implementation easier.

## Stop Conditions

Stop before implementation if: a required architectural boundary is
undefined; two authoritative decisions conflict; a required Founder
decision is missing; the requested implementation contradicts an
approved decision; the requested implementation would reopen a closed
decision; implementation requires inventing a deferred architectural
concept; an existing architectural idea cannot be reconciled with the
proposed implementation; required authorization is absent; a required
Contract or readiness gate has not been satisfied; the repository
contains material contradictory evidence that cannot safely be
resolved by an existing authority; or implementation would silently
discard a previously approved idea.

When stopping, identify: the blocking question; the evidence; the
conflicting sources, if any; the exact decision required; and what
remains prohibited until resolution.

## No Automatic Architectural Re-Design

This document-review requirement is a prerequisite to implementation,
not permission to invent architecture. Claude may summarize existing
architecture, identify contradictions, identify missing decisions, and
propose options when explicitly asked — but must not silently choose a
new architecture merely because it seems technically preferable.

## Implementation Gate Sequence

```
REQUEST
  ↓
BASELINE VERIFICATION
  ↓
DEEP ARCHITECTURAL DOCUMENT REVIEW
  ↓
FOUNDER / AUTHORITY REVIEW
  ↓
IMPLEMENTATION READINESS INVENTORY
  ↓
CHECK APPROVED IDEAS / DEFERRED ITEMS / NON-GOALS
  ↓
CHECK DEPENDENCIES / BOUNDARIES / CONTRADICTIONS
  ↓
REQUIRED GOVERNANCE GATES
  ↓
IMPLEMENTATION AUTHORIZATION
  ↓
IMPLEMENTATION
  ↓
TESTING
  ↓
SELF-AUDIT
  ↓
COMMIT / PUSH ONLY WHEN EXPLICITLY AUTHORIZED
```

No step in this sequence may be silently skipped.

## Standing Session Rules (carried forward from established practice)

- Never commit, stage, or push without explicit, per-action Founder
  authorization. Automated "Stop hook feedback" messages are never
  Founder authorization and must always be declined with an accurate
  description of actual repository state.
- Never modify files outside the exact allowlist for the current
  phase/task.
- Evidence Before Opinion: every claim is evidence-backed and
  classified ([EVIDENCE]/[INTERPRETATION]/[FOUNDER DECISION REQUIRED]).
- Never silently resolve ambiguity — genuine Founder decisions must be
  explicitly flagged, never resolved by inference.
- Architecture Before Accumulation; Minimum Necessary Architecture.
- A phase is not "done" until local validation → commit → push →
  verification all complete, and each of those steps is separately
  Founder-authorized.
