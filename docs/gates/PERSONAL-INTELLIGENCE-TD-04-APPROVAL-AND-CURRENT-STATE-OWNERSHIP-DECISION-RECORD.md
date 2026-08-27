# Personal Intelligence — TD-04 Approval & Current-State Ownership Decision Record

## 1. Decision Identity

- **Title:** Personal Intelligence — TD-04 Approval & Current-State Ownership
  Decision Record
- **Artifact ID:** `PI-TD04-APPROVAL-001`
- **Status:** FOUNDER-APPROVED GOVERNANCE DECISION RECORD (architecture
  authority only — see §11)
- **Date:** 2026-08-27
- **Authority:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA
- **Repository context at recording time:** branch `main`, `HEAD = origin/main
  = fd0d35d258133b1e4fb3d23ae169404d3f867bc7`, divergence `0/0`. The
  pre-existing protected local modification,
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, was present and untouched at
  the time this record was created and remains untouched by this record.

## 2. Founder Decision Status

Two, and only two, decisions are closed by this record: **D1** (TD-04
approval) and **D2** (Current-State ownership rule). **D3** (inference/
prediction provenance, `userConfirmed`) and **D4** (an Implementation
Increment Contract) are explicitly and deliberately left open — this record
closes nothing beyond D1 and D2, and must not be read as resolving either
by implication.

## 3. D1 — TD-04 Approval

**`docs/architecture/TD-04-human-os-personal-intelligence-core.md` — Human
OS & Personal Intelligence Core Architecture — is APPROVED as the governing
conceptual architecture for Personal Intelligence.**

This approval means:

- TD-04 is accepted as the governing conceptual architecture for Personal
  Intelligence / Human Understanding.
- Its architectural principles (§2's seven non-negotiable principles),
  boundaries (§3's Human Model categories, §11–§14's relationships to
  FIS-057, Goal OS, Daily OS, and DECIVEXA AI), and invariants (§20's
  twelve proposed invariants) are authoritative conceptual guidance for
  this domain going forward.
- Its unresolved/deferred items (§22) remain unresolved and deferred —
  **this approval does not close any of them.**

**TD-04 approval ≠ implementation authorization.** Accordingly, D1 does
**not**:

- authorize code changes;
- authorize schema changes;
- authorize migrations;
- authorize API exposure;
- authorize UI changes;
- authorize AI capability implementation;
- authorize an Implementation Increment Contract;
- constitute TD-09 Build Authorization;
- open Goal OS;
- open Daily OS;
- open Decision Engine;
- resolve any TD-04 §22 deferred item.

## 4. D2 — Current-State Ownership Rule

**Founder-approved ownership rule:** Personal State owns genuinely current
operational snapshots; Personal Intelligence owns accumulated,
evidence-backed interpretations and patterns.

**Conceptual test:**

- **Personal State** — a fact belongs here when it answers *"What is the
  person's operational state right now?"* Example: current availability.
- **Personal Intelligence** — a fact belongs here when it answers *"What
  evidence-backed pattern or interpretation has emerged about this person
  over time?"* Examples: accumulated behavioral patterns, environmental
  patterns, constraints, capabilities, or other durable interpretations
  represented through PIC's existing claim/version/evidence model.

**Explicit limitations — D2:**

- creates no schema;
- adds no field;
- adds no entity;
- changes no model;
- does not add `energy`;
- does not add `workload`;
- does not add `stress`;
- does not add `stress-context`;
- does not add `active commitments`;
- does not move any existing field;
- does not modify Personal State;
- does not modify PIC;
- does not modify Evidence;
- does not modify Memory.

D2 is an ownership principle for future architectural decisions, not an
implementation change.

**Deferred question preserved, not resolved here:** the exact point at
which the historical evolution of a Personal-State-tracked value should
become evidence consumed by PIC remains open until a concrete field/use
case is actually proposed.

## 5. D3 — Deferred Status

Unchanged and explicitly preserved:

- `inference` provenance: **DEFERRED.**
- `prediction` provenance: **DEFERRED.**
- `userConfirmed`: **DEFERRED.**

No new provenance value or confirmation field is approved by this record.

**Corrected rule, recorded here as binding:** `observed` and `inferred` are
semantically distinct — `observed` denotes a directly measured/recorded
event; AI-derived interpretation is categorically different and must not
be recorded as `observed` merely for implementation convenience. Low
confidence does not repair this semantic mismatch. This supersedes an
earlier, since-withdrawn interim proposal to record AI-generated claims
under `provenance: "observed"` with capped confidence.

**No AI-generated Personal Intelligence claim may be implemented until
inference provenance semantics are deliberately designed and separately
approved.**

## 6. D4 — Not Authorized

**Implementation Increment Contract: NOT AUTHORIZED IN THIS STEP.**

No Implementation Increment Contract is created by this record. No Build
Authorization is issued. The future implementation path remains subject
to: (1) a new, prospective, separately scoped Implementation Increment
Contract; (2) the existing governance requirements; (3) the applicable
TD-09 Build Authorization gate; (4) explicit Founder authorization. This
record must not be interpreted as authorization to begin implementation.

## 7. Governance / Authorization Boundary

Explicitly preserved by this record:

- **Goal OS** — REMAINS DEFERRED (`docs/gates/PHASE_10P_GOAL_READINESS_FOUNDER_DECISION_GATE.md`, untouched, not reopened).
- **Daily OS** — REMAINS DEFERRED.
- **Decision Engine** — REMAINS DEFERRED.
- **API exposure** — NOT AUTHORIZED.
- **Schema/migration** — NOT AUTHORIZED.
- **AI capability implementation** — NOT AUTHORIZED.
- **UI implementation** — NOT AUTHORIZED.
- **Build Authorization** — NOT ISSUED.

## 8. Deferred Questions Preserved (TD-04 §22)

Approving TD-04 (D1) does not resolve any of its own ten deferred design
questions. Preserved verbatim in substance from TD-04 §22, all still open:

- final persistence schema;
- exact event-sourcing strategy;
- final ontology / taxonomy;
- model storage technology;
- vector / graph / relational responsibilities;
- exact confidence algorithm;
- model-update ML architecture;
- privacy-preserving computation details;
- mobile synchronization implementation;
- final API contracts;
- production performance thresholds.

None of these is marked resolved, narrowed, or implicitly decided by this
record.

## 9. Impact on Goal OS / Daily OS / Decision Engine

None. D1 and D2 concern Personal Intelligence's own internal conceptual
architecture and its boundary with Personal State — neither decision
touches, reopens, narrows, or otherwise affects the separately governed
deferral status of Goal OS (`PHASE_10P`), Daily OS, or Decision Engine.
Any future relationship between Personal Intelligence and those systems
remains exactly as TD-04 §12–§13 conceptually describes it (a one-way
context-supplier relationship) and remains unimplemented.

## 10. Explicit Non-Authorization Statement

This record authorizes **only** the governance classification described in
§§3–4 (D1, D2). It explicitly does **not** authorize, and nothing in this
record may be read as authorizing: source-code modification; schema
modification; migration; API work; UI work; AI capability registration or
implementation; AI provider changes; an Implementation Increment Contract;
TD-09 Build Authorization; Goal OS work; Daily OS work; Decision Engine
work; dependency changes; or configuration changes.

## 11. Final Decision Summary

Founder approval of TD-04 establishes architectural authority, not
implementation authority. D2 establishes the Personal State/PIC ownership
boundary, not a schema or implementation change. D3 remains deferred. D4
remains unauthorized. Any future Personal Intelligence implementation
requires a new, separately scoped prospective Implementation Increment
Contract and the applicable Build Authorization under the existing
governance system.

## 12. Provenance

- Recorded pursuant to the Founder's "PERSONAL INTELLIGENCE ARCHITECTURE
  DECISION CLOSURE" directive and this "FORMAL RECORDING OF PERSONAL
  INTELLIGENCE D1/D2 DECISIONS" directive.
- Cross-references: `docs/architecture/TD-04-human-os-personal-intelligence-core.md`;
  `docs/gates/PERSONAL-INTELLIGENCE-GOVERNANCE-REMEDIATION-RECORD.md`;
  `docs/gates/PERSONAL-INTELLIGENCE-MATERIALITY-DECISION-RECORD.md`;
  `docs/TD-02_DOMAIN_BOUNDARIES_AND_MODULE_OWNERSHIP.md`;
  `docs/gates/PHASE_10P_GOAL_READINESS_FOUNDER_DECISION_GATE.md`.
- This record does not amend, supersede, or reinterpret any of the
  documents it cross-references. No historical commit is rewritten. No
  prior Founder approval is fabricated.
