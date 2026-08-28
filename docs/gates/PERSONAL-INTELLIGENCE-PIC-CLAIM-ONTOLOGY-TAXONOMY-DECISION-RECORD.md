# Personal Intelligence — PIC Claim Ontology / Taxonomy Decision Record

## 1. Decision Identity

- **Title:** PIC Claim Ontology / Taxonomy — Architectural Decision Record
- **Artifact ID:** `PI-ONTOLOGY-ARCHITECTURE-001`
- **Status:** **FOUNDER-APPROVED ARCHITECTURE — IMPLEMENTATION NOT
  AUTHORIZED**
- **Date:** 2026-08-28
- **Authority:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA
- **Repository context at recording time:** branch `main`,
  `HEAD = origin/main = 232f786c20bda062c4bd5b3646c28889496c6015`,
  divergence `0/0`. The protected pre-existing modification,
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, was present and untouched
  at the time this record was created and remains untouched by it.

This document records architecture. **It is not an Implementation
Contract. It is not implementation authorization. It does not authorize
schema changes, enum changes, migrations, code changes, API changes,
AI/LLM changes, or any runtime behavior.** A separate, future
Founder-approved Implementation Contract and TD-09 Build Authorization
are required before any implementation may begin.

**Legend used throughout this record**, per the Founder's explicit
instruction not to blur these categories:

- **[FOUNDER-APPROVED ARCHITECTURE]** — decided by this record.
- **[FUTURE DESIGN PROPOSAL]** — surfaced, not decided; a future,
  separate Design Track/Founder decision would settle it.
- **[DEFERRED QUESTION]** — explicitly left open, not to be silently
  resolved by any future implementation.
- **[IMPLEMENTATION REQUIREMENT]** — a constraint a future implementation
  must satisfy, not itself an implementation.

## 2. Provenance

Recorded pursuant to two Founder directives: "PIC Claim Ontology /
Taxonomy — Design Decision & Architectural Refinement" (which produced
the Design Decision Package this record formalizes) and this immediately
following "Founder Architectural Decision — PIC Claim Ontology /
Taxonomy" directive, which approves Option 2 from that package. The prior
"PIC Claim Ontology / Taxonomy — Design Audit" (this session, chat-only,
not independently committed) is the originating analysis both later
turns built on.

## 3. Founder Decision — Canonical Statement

**[FOUNDER-APPROVED ARCHITECTURE]** **OPTION 2 — Layered Domain Taxonomy
+ Explicit Axis Set — is the approved conceptual architecture for the
future PIC Claim Ontology / Taxonomy.** This is architecture approval
only. Implementation is not authorized by this record.

## 4. Layered Domain / Category Axis

**[FOUNDER-APPROVED ARCHITECTURE]** PIC Claim domain classification shall
conceptually consist of two layers:

1. A **top-level Human Model category**, traceable to
   `docs/architecture/TD-04-human-os-personal-intelligence-core.md` §3
   (Identity & Values, Capabilities, Behavioral Patterns, Current State,
   Preferences & Context, Development & Risk Intelligence).
2. A **fine-grained domain/sub-type**, for which the existing nine
   `claimType` values (`identity_attribute, value, preference, capability,
   constraint, environment_context, strength, weakness, behavior_pattern`)
   are the **starting vocabulary — not discarded** — to be formally
   mapped/reconciled against the top-level categories.

**[DEFERRED QUESTION]** The final semantic placement of `strength` and
`weakness` — whether they remain independent fine-grained sub-types or
become a qualitative-characteristic dimension attached to another
domain (e.g., a capability or behavioral pattern) — is explicitly **not
decided by this record**. Any future placement must remain traceable to
this record and to whatever future ontology documentation formally
resolves it.

## 5. Orthogonal Axes — Foundational Invariant

**[FOUNDER-APPROVED ARCHITECTURE]** The ontology shall preserve, as a
foundational architectural invariant, the separation of exactly these
seven dimensions — none collapsible into another, none inferable from
another:

1. Domain / Category
2. Epistemic Type
3. Provenance
4. Lifecycle
5. Confidence
6. Temporal Validity
7. User Confirmation

In particular, **[FOUNDER-APPROVED ARCHITECTURE]**:

- confidence must not imply epistemic status;
- provenance must not imply confidence;
- lifecycle must not imply truth;
- temporal validity must not imply confidence;
- user confirmation must not transform an inference into an observed
  fact;
- AI-generated inference must remain structurally distinguishable from
  declared or observed information.

## 6. Epistemic Type vs. Provenance

**[FOUNDER-APPROVED ARCHITECTURE]** Epistemic Type and Provenance are
related but not interchangeable and must remain conceptually distinct.
The conceptual epistemic range remains aligned with
`docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §12 (`stated | observed | measured
| inferred`). **D3's existing structural separation of Inference from
Claim remains authoritative and unaltered** — an Inference is not to be
converted into an ordinary Claim merely by assigning it a provenance
value, and the semantic collapse between `observed` and `inferred`,
already rejected by D2's "corrected rule"
(`docs/gates/PERSONAL-INTELLIGENCE-TD-04-APPROVAL-AND-CURRENT-STATE-OWNERSHIP-DECISION-RECORD.md`
§5), is not reintroduced here.

## 7. User Confirmation

**[FOUNDER-APPROVED ARCHITECTURE]**

- **For Claims:** user confirmation is an independent semantic dimension,
  orthogonal to epistemic type, provenance, confidence, lifecycle,
  temporal validity, and domain/category. A future PIC Claim
  implementation may require a confirmation representation comparable in
  semantic purpose to Memory's existing `userConfirmed` field
  (`apps/api/src/core/memory/memory-record.model.ts`).
- **For D3 Inferences:** confirmation is conceptually an event/interaction
  concern, not a mechanism that changes the Inference's epistemic
  identity — consistent with D3 §21's append-only lifecycle-event
  architecture, which already represents `confirmed`/`rejected`/
  `disputed` as lifecycle-history events rather than mutable fields.
- User confirmation must never silently promote `inferred → observed` or
  `inferred → declared`, and must never make an Inference equivalent to
  an independently observed fact.

**[IMPLEMENTATION REQUIREMENT, future]** Whatever confirmation
representation is eventually implemented for Claims must not become a
field that any AI-generation pathway can set.

## 8. Evidence Linkage State

**[FOUNDER-APPROVED ARCHITECTURE]** The ontology shall explicitly
distinguish three conceptual cases, currently indistinguishable in the
implemented schema:

1. A Claim has linked Evidence.
2. A Claim is intentionally self-reported, designed to exist without
   supporting external Evidence.
3. A Claim currently has no Evidence linkage but is expected to receive
   one later.

**[DEFERRED QUESTION]** The future representation mechanism for these
three cases is not decided by this record and must not be implemented
yet.

## 9. Subject / Attribute / Value

**[FOUNDER-APPROVED ARCHITECTURE]** The ontology recognizes Subject
("what person/entity is this about"), Attribute/Domain ("what
characteristic is being described"), and Value ("what is being
asserted") as conceptually distinct — required to support a future
Cross-Claim Matching capability. **This does not authorize Cross-Claim
Matching implementation.** No matching algorithm, similarity score,
ranking algorithm, automatic merge, or conflict resolver is authorized by
this record.

## 10. Temporal Validity

**[FOUNDER-APPROVED ARCHITECTURE]** The ontology shall conceptually
distinguish: when a record was created; when something was observed;
when it was accepted/recorded; when the asserted fact became effective;
when it ceased being effective; when it was superseded/corrected/
invalidated. At minimum, the future ontology must preserve the
distinction between *when something was known/observed* and *when the
underlying fact was actually valid*.

**The previously identified Personal State temporal asymmetry
(`observedAt`/`acceptedAt` absent from `personal_states`/
`personal_state_revisions`) remains untouched and is not modified,
narrowed, or resolved by this record.**

## 11. Lifecycle

**[FOUNDER-APPROVED ARCHITECTURE]** Lifecycle remains conceptually
separate from domain classification and epistemic type. **PIC, Evidence,
and Memory lifecycle vocabularies must not be merged, renamed, migrated,
or changed merely for apparent consistency, and not without a separate,
future Founder-approved implementation/design decision** that first
explicitly analyzes their semantic differences (PIC/Evidence currently
share `active|superseded|corrected|revoked|disputed`; Memory uses
`active|corrected|deleted` — a narrower, independently-authored set).

## 12. Contradiction / Refinement — Deferred, Not Rejected

**[FOUNDER-APPROVED ARCHITECTURE — as a recognition, not an
implementation]** Contradiction, refinement, temporal change, contextual
variation, and source disagreement are recognized as distinct future
relationship semantics. **[DEFERRED QUESTION]** None is implemented now;
no relation table is created now; no Pattern entity is created now. This
is **Option 2, not Option 3** — the decision not to implement Option 3's
relation-typing and Pattern-entity work now is intentional and must not
be read as a rejection of these concepts. They remain deferred until a
concrete consumer (Cross-Claim Matching or the Living User Model)
requires them.

## 13. Pattern

**[DEFERRED QUESTION]** No first-class Pattern entity is created by this
record. Pattern remains a conceptual interpretation only. Any future
promotion of Pattern into a first-class entity requires its own,
separate Founder-approved design decision.

## 14. Extensibility

**[FOUNDER-APPROVED ARCHITECTURE]**

- **Domain/Category:** OPEN / EXTENSIBLE — new legitimate human-domain
  categories may be added in the future through the appropriate
  governance process.
- **Epistemic mechanics:** CLOSED once formally ratified.
- **Lifecycle mechanics:** CLOSED once formally ratified.
- **Temporal semantics:** CLOSED once formally ratified.
- **Confidence semantics:** the confidence algorithm **[DEFERRED
  QUESTION]** remains deferred; this record establishes only that
  confidence is an independent dimension (§5) and does not design or
  authorize a confidence-scoring algorithm.

## 15. Living User Model — Prerequisites Only

**[FOUNDER-APPROVED ARCHITECTURE, scope-limiting]** This record
establishes ontology prerequisites for a future Living User Model. **It
does not authorize Living User Model implementation.** The dependency
chain `Ontology → Cross-Claim Matching → Living User Model` remains in
effect and is not bypassed.

## 16. Cross-Claim Matching — Prerequisites Only

**[FOUNDER-APPROVED ARCHITECTURE, scope-limiting]** This record authorizes
only the conceptual prerequisites named in §9 (Subject, Attribute/Domain,
Value) plus Temporal Validity (§10) and Context. **It does not authorize**
matching algorithms, similarity scoring, ranking, automatic
reconciliation, automatic merging, conflict resolution, or contradiction
scoring. Those require a future, dedicated Design Track and separate
Founder authorization.

## 17. AI Safety / Epistemic Integrity

**[FOUNDER-APPROVED ARCHITECTURE, restated as binding]** The following
must remain architecturally protected, unless a future explicit,
Founder-approved architectural mechanism defines exactly what the
transition means: `inferred → observed`; `inferred → declared`; `high
confidence → fact`; `AI-generated → user-confirmed`. User confirmation
must never erase the provenance or epistemic history of AI-generated
information. Evidence grounding remains mandatory for D3 Inferences. **D3
Invariants remain fully authoritative and unaltered by this record.**

## 18. Relation to D1 / D2 / D3 / D4-01 / TD Documents / Governance Reconciliation / Architecture Freeze

**[FOUNDER-APPROVED ARCHITECTURE — explicit non-modification statement]**
This record does **not** modify D1, D2, D3, D4-01, any existing TD
document, `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, or
`docs/ARCHITECTURE_FREEZE_BASELINE.md`. D3's established Inference
architecture, evidence-grounding requirement, and immutability/append-only
history principles remain fully intact. This ontology is a refinement
built around those existing decisions, not a replacement for any of them.

## 19. Relationship Between Governing Documents and Existing Implementation

**[FACT, cross-referenced for traceability, not re-decided here]**

| Document/entity | Relationship to this ontology decision |
|---|---|
| `docs/architecture/TD-04-human-os-personal-intelligence-core.md` §3 | Source of the top-level Human Model category layer (§4) |
| `docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §10 (Evidence Contract) | Conceptual source for the broader `evidence_type` range (user-stated, observed, measured, imported, system-generated observation) informing §6/§8, not itself implemented |
| `docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §12 (Human Model Contract) | Conceptual source for the epistemic_type range and Subject/contradiction_refs concepts informing §6/§9/§12 |
| D1 (`PERSONAL-INTELLIGENCE-TD-04-APPROVAL...` record) | Architecture authority for TD-04(Human-OS); unaffected (§18) |
| D2 (same record) | Ownership boundary and the `observed`/`inferred` non-collapse rule; unaffected, reaffirmed (§6, §18) |
| D3 (+ §21) | Inference/Claim structural separation, evidence grounding, immutability; unaffected, reaffirmed (§6, §17, §18) |
| PIC Claim (`personal-intelligence-claim.model.ts`) | Existing `claimType`/`provenance`/`lifecycle`/`confidence` fields are the starting point for §4–§5, not modified |
| PIC Inference (`personal-intelligence-inference.model.ts`) | Existing evidence-grounded, append-only lifecycle-event design is the precedent for §7/§12's event-based confirmation framing; not modified |
| Evidence (`evidence.model.ts`) | Existing three-value `provenance`, shared `lifecycle` vocabulary with PIC; cited in §6/§11, not modified |
| Memory (`memory-record.model.ts`) | Existing independent `provenance`/`lifecycle`/`valueKind`/`userConfirmed` precedent; cited throughout (§7 especially), not modified |

## 20. Deferred Questions — Consolidated

Explicitly preserved as deferred, not resolved by this record:

1. Final semantic placement of `strength`/`weakness` (§4).
2. Evidence-linkage-state representation mechanism (§8).
3. Contradiction/refinement/temporal-change/contextual-variation/
   source-disagreement representation mechanism, and whether as typed
   relations or otherwise (§12).
4. Whether Pattern becomes a first-class entity (§13).
5. Confidence algorithm (§14).
6. Stale/re-evaluation trigger mechanism.
7. Prediction architecture.
8. Contextual interpretation / FIS-057.
9. Personal State temporal-model correction (§10).
10. Cross-Claim Matching algorithm itself (§16).
11. Living User Model implementation (§15).
12. Lifecycle vocabulary unification across PIC/Evidence/Memory, if any
    (§11).
13. User-confirmation representation mechanism for Claims (§7).

## 21. Implementation Gate

**IMPLEMENTATION IS NOT AUTHORIZED.**

A future, separate Implementation Increment Contract and TD-09 Build
Authorization are required before any of the following may occur: schema
changes; enum changes; migrations; model changes; API changes; service
changes; repository changes; database changes; AI Gateway changes; prompt
changes; UI changes; runtime changes. **This record does not authorize,
and does not substitute for, any of those.**

## 22. Change Control

Any material change to this approved ontology architecture requires
Founder review. In particular, the following must not be changed
silently: the Option 2 selection itself; the seven-axis separation
invariant (§5); the AI safety non-promotion rules (§17); D3's
unaltered authority (§18); the explicit non-authorization of Cross-Claim
Matching, Living User Model, Pattern-entity promotion, and lifecycle
vocabulary unification (§§12–13, 15–16).
