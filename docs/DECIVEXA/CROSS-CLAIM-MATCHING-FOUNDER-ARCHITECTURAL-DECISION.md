# Cross-Claim Matching — Founder Architectural Decision

- **Title:** Cross-Claim Matching Founder Architectural Decision
- **Artifact ID:** `CROSS-CLAIM-MATCHING-ARCH-001`
- **Status:** **FOUNDER-APPROVED ARCHITECTURE (Decisions 1–6) — DESIGN
  ONLY. IMPLEMENTATION NOT AUTHORIZED (Decision 7: NOT APPROVED).**
- **Date:** 2026-08-28
- **Authority:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA
- **Repository context at recording time:** branch `main`,
  `HEAD = origin/main = 70bfd73ba4a09b9a6dcb69cfb843039af6bd6a90`,
  divergence `0/0`. Protected file
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` present, unstaged,
  untouched (MD5 `972ad36e523aa42e540f2c28a3aac801`) — this record does
  not amend, replace, or touch that file.
- **No pre-existing authoritative document for this topic was found**
  (searched `docs/gates/`, `docs/DECIVEXA/`, `docs/architecture/`,
  `docs/technical-design/` for any prior Cross-Claim-Matching decision
  record before creating this one).
- **Basis:** `docs/DECIVEXA/CROSS-CLAIM-MATCHING-DESIGN-TRACK-DRAFT.md`,
  `docs/DECIVEXA/CROSS-CLAIM-MATCHING-DESIGN-DECISION-PROPOSAL.md`, and
  `docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-DECISION-AUDIT.md` — all
  three remain in the repository unmodified, unmerged, and undeleted;
  this record does not supersede them as working material, only records
  the Founder's decisions made on their basis.

This document changes no code, no schema, no migration, no test, no API,
and no runtime behavior. It records six approved architectural decisions
and one explicit non-authorization, establishing the conceptual
foundation for a future Cross-Claim Matching capability without building
any part of it.

---

## 1. Decision 1 — Claim-Level Context

**[FOUNDER-APPROVED ARCHITECTURE]** Claim-level Context is established as
a **Value Object owned by PIC**, attached to a ClaimVersion, kept
**completely separate** from the vision-level Context Fusion Engine
(`docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md` §19).

**Minimum approved semantic scope:** situation/setting; time-of-day.

**[DEFERRED QUESTION]** The following remain OPEN and must not be added
without a separate Founder approval: role; task; goal; emotional state;
location; environment; any other Context dimension not named above.

**[FOUNDER-APPROVED ARCHITECTURE]** Context is not, at this time, a
first-class entity.

No implementation, schema, or code change is authorized by this
decision.

## 2. Decision 2 — Temporal Validity

**[FOUNDER-APPROVED ARCHITECTURE]** Temporal Validity is established as
an axis independent of existing temporal metadata. Two conceptual
primitives are approved: `effectiveFrom`; `effectiveTo`.

**[FOUNDER-APPROVED ARCHITECTURE]** These remain independent, distinct
concepts, none collapsible into another: `recordedAt`; `observedAt`;
`acceptedAt`; `lifecycle`; supersession.

**[FOUNDER DECISION, explicit]** This decision makes **no** change to
Personal State. The Personal State `observedAt`/`acceptedAt` asymmetry
remains **explicitly out of scope and Deferred**, unaffected by this
record in any way.

No migration or schema change is authorized by this decision.

## 3. Decision 3 — Relationship Model

**[FOUNDER-APPROVED ARCHITECTURE]** A future Relationship is established
as a **First-Class External Artifact**, with these properties held
non-negotiable:

- immutable identity;
- evidence-grounded;
- external to Claim;
- external to ClaimVersion;
- never mutates a ClaimVersion;
- never merges Claims;
- never becomes a Claim;
- never becomes Evidence;
- remains separate from D3 Inference;
- remains separate from C3 Claim Confirmation.

**[FOUNDER-APPROVED ARCHITECTURE, future]** When eventually built,
Relationship is intended to be a persisted record.

**[EXPLICITLY NOT AUTHORIZED]** Persistence implementation is not
authorized by this decision.

## 4. Decision 4 — Relationship Taxonomy

**[FOUNDER-APPROVED ARCHITECTURE]** The prior flat 12-value enum is
**rejected** and must not be used as architecture going forward.
Relationship classification is established as **three independent axes**:

1. **Relationship Type** — describes only the semantic relationship
   between two ClaimVersions.
2. **Certainty**.
3. **Confirmation State**.

**[FOUNDER-APPROVED ARCHITECTURE]** `same_subject` and `same_attribute`
are **not** Relationship Type values — they remain structural/pipeline
predicates, checked before a relationship is considered, never stored as
a relationship's type. `uncertain`/`unknown` belong to Certainty
semantics, not Relationship Type. `requires_confirmation` belongs to
Confirmation State semantics, not Relationship Type.

**[PROPOSED vocabulary, not yet formalized]** `same_claim`,
`successive_state`, `refinement`, `contradiction`, `contextual_variation`,
`related_fact`, `unrelated` remain **proposed** Relationship Type
candidates, to be formalized only by a future Implementation Increment
Contract.

No enum, database type, or schema is created by this decision.

## 5. Decision 5 — Relationship Evidence

**[FOUNDER-APPROVED ARCHITECTURE]** Relationship Evidence is established
as its own **independent abstraction**. Three concepts remain always
distinct: evidence for Claim A; evidence for Claim B; evidence for
Relationship A↔B.

**[NON-NEGOTIABLE]** Candidate-generation signals are never Evidence.
`Candidate Signal ≠ Evidence`.

**[FOUNDER-APPROVED ARCHITECTURE]** A Relationship without sufficient
evidence must not be treated as an established fact.

No Relationship Evidence schema or implementation is authorized by this
decision.

## 6. Decision 6 — Matching-Hypothesis Confirmation

**[FOUNDER-APPROVED ARCHITECTURE]** Cross-Claim Matching will have an
independent Confirmation Mechanism, fully separate from C3 Claim
Confirmation and D3 Inference Confirmation. It confirms the **Relationship
Type classification**.

**[NON-NEGOTIABLE — this mechanism must never]**: mutate a Claim; mutate
a ClaimVersion; merge Claims; change provenance; change epistemic type;
change lifecycle; implicitly change confidence; create Evidence; change
Inference lifecycle.

No API, workflow, or persistence mechanism for this is authorized by
this decision.

## 7. Decision 7 — Implementation Authorization

**[NOT APPROVED.]** The Founder does not authorize Cross-Claim Matching
implementation by this record. Therefore, until a separate, explicit
Founder authorization is given, the following remain prohibited: matching
algorithm; candidate generation; similarity calculation; ranking;
contradiction-detection implementation; confidence algorithm; relationship
persistence implementation; relationship evidence persistence;
confirmation API; confirmation workflow; schema; migration; repository;
service; controller; AI integration; Living User Model.

---

## 8. Approved Dependency Order

**[FOUNDER-APPROVED ARCHITECTURAL SEQUENCE]**

```text
Temporal Validity
      ↓
Context
      ↓
Relationship + Relationship Evidence
      ↓
Matching-Hypothesis Confirmation
      ↓
Cross-Claim Matching Implementation
      ↓
Living User Model
```

**This sequence is not an authorization to execute any stage.** Each
stage requires its own, separate, explicit Founder Implementation
Authorization before any code, schema, or migration work begins on it.

---

## 9. Non-Negotiable Invariants (reaffirmed and fixed by this record)

1. Claims never merge.
2. ClaimVersions remain immutable.
3. Relationship never becomes Claim.
4. Relationship never becomes Evidence.
5. Candidate signal never becomes Evidence.
6. AI hypothesis never silently becomes fact.
7. Contradiction is never automatically resolved.
8. Context variation is not automatically contradiction.
9. Confidence and uncertainty remain distinct.
10. Confirmation is independent from provenance.
11. Matching never mutates D1/D2/D3 semantics.
12. Living User Model cannot bypass Matching semantics.
13. Memory boundary remains untouched.
14. Personal State boundary remains untouched.
15. AI Gateway remains untouched.
16. A Relationship classification is never silently re-derived after
    evidence changes; it becomes a re-evaluation candidate instead.

---

## 10. Relation to D1 / D2 / D3 / Ontology / Governance Reconciliation / Architecture Freeze

**[FOUNDER-APPROVED ARCHITECTURE — explicit non-modification statement]**
This record does not modify D1, D2, D3, D3's Promotion Write Path, the
PIC Claim Ontology/Taxonomy Decision Record or its Implementation
Contract, `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, or
`docs/ARCHITECTURE_FREEZE_BASELINE.md`. All D1–D3 invariants,
Evidence-grounding requirements, and immutability principles remain fully
intact, unaltered, and directly reaffirmed by §9 above. The dependency
chain `Ontology → Cross-Claim Matching → Living User Model`, already
established in the PIC Ontology Decision Record §15, is preserved
unbypassed by §8 above.

## 11. Scope of This Record

This is an **architecture/design decision record only**. It:

- does not change any code, schema, migration, test, or API;
- does not authorize implementation of any kind;
- does not select or authorize a Candidate Generation strategy;
- does not resolve any of the items still marked Deferred/Open in the
  three basis documents (§ above);
- does not modify Personal State, Memory, or the AI Gateway in any way.

## 12. Change Control

Any future change to Decisions 1–7 or the invariants in §9 requires its
own explicit Founder decision and its own governance record; none of
this is superseded, narrowed, or reopened by silent implication from any
future implementation work, Design Audit, or Roadmap edit. Each stage
named in §8 requires a separate, explicit Founder Implementation
Authorization — this record does not grant, and cannot be read as
implicitly granting, any of them.
