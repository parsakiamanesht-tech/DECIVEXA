# Personal Intelligence — Bounded Semantic Synthesis Contract (State B / Founder Decision A)

## 1. Decision Identity

- **Title:** Bounded Semantic Synthesis Contract — Authoritative
  Governance / Product Contract
- **Decision ID:** `FD-PIC-BOUNDED-SEMANTIC-SYNTHESIS-CONTRACT-001`
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Date established (in conversation):** 2026-09-04
- **Date canonicalized (this record):** 2026-09-04
- **Status:** **FOUNDER-APPROVED CONCEPTUAL / PRODUCT / GOVERNANCE
  CONTRACT — NOT IMPLEMENTATION AUTHORIZATION.**

This document canonicalizes a Founder-approved conceptual contract
already established in prior conversation (referred to as "Round 12"
in that discussion) into a dedicated, authoritative repository record.
It records existing, already-approved conceptual content. It does not
introduce, invent, or expand any architecture beyond what was already
established at the time it was approved.

## 2. Purpose

Prior to this record, this contract existed only in conversational
form, with no canonical repository location. This document exists
solely to give it one, so that future work referencing "the Bounded
Semantic Synthesis Contract" or "State B" has a stable, authoritative
source of truth distinct from conversational history.

## 3. Founder Decision A — The Product Principle

**[FOUNDER-APPROVED PRODUCT PRINCIPLE]** DECIVEXA may, in principle,
eventually produce:

> bounded, evidence-grounded, conditional, revisable semantic
> syntheses about the user, while never escalating them into
> unqualified or permanent human-trait claims.

This is a product/vision decision in principle. **It is not
implementation authorization.**

## 4. Core Pipeline (Conceptual)

```
Evidence → Derived State → Bounded Semantic Synthesis → Epistemic Qualification → Revision
```

This pipeline is conceptual. No stage of it is implemented, designed
as a schema, or authorized for construction by this record.

## 5. Maximum Justified Confidence

**Maximum Justified Confidence** means: the system must not express
greater confidence than the evidence and reasoning actually support,
and must not artificially weaken a conclusion beyond what the evidence
justifies. Confidence tracks actual evidential and reasoning strength
— no more, no less. This principle governs how any future Bounded
Semantic Synthesis output must be expressed; it does not itself define
a scoring mechanism.

## 6. Assertion Ladder

| Level | Name | Status |
|---|---|---|
| 0 | Evidence | May be legitimate |
| 1 | Derived State | May be legitimate |
| 2 | Evidence Pattern | May be legitimate, within constraints |
| 3 | Bounded Semantic Synthesis | May be legitimate, within constraints |
| 4 | Strong Human Characterization | **NOT authorized** |
| 5 | Permanent / Unqualified Claim | **NOT authorized** |

Levels 0–3 may be legitimate within the constraints this contract
establishes. **Levels 4 and 5 are not authorized under any
circumstance by this record.**

## 7. Bounded Semantic Synthesis — Required Properties

A legitimate Bounded Semantic Synthesis (Level 3) must be:

- evidence-grounded;
- bounded in scope;
- conditional where appropriate;
- revisable;
- epistemically qualified;
- contestable/falsifiable where applicable;
- traceable to its evidence/input lineage;
- distinguishable from the provenance of the underlying input evidence
  (the synthesis's own derivation provenance is distinct from the
  provenance of the evidence it draws on);
- subject to a correction/revision path;
- time/context scoped where relevant;
- explicit about uncertainty;
- relevant to the question or use case being evaluated.

## 8. Critical Epistemic Distinction

DECIVEXA must distinguish, and never silently collapse:

- Evidence
- Derived State
- Evidence Pattern
- Bounded Semantic Synthesis
- Strong Human Characterization
- Permanent/Unqualified Claim

**The system must not silently convert a lower-level representation
into a stronger human-level characterization.** An escalation from any
of the first four categories into Level 4 or Level 5 is never
authorized by this contract, regardless of how the intermediate
representations were produced.

## 9. Status of This Contract

This document is:

- a Founder-approved conceptual/product/governance contract;
- an architectural/product constraint and semantic boundary.

This document is **not**:

- implementation authorization;
- authorization to create a general Understanding Engine;
- authorization for AI-generated Bounded Semantic Synthesis;
- authorization for cross-claim semantic derivation;
- a reopening of Decision 7;
- a reopening of Gate 7;
- authorization for Living Human Model implementation;
- authorization for Pattern as a first-class entity;
- authorization for a new Observation/Event architecture;
- authorization for any new persistence, schema, API, service,
  inference-generation, or evaluation-engine implementation.

**Product/semantic contract ≠ implementation authorization.** This
distinction is preserved absolutely throughout this document.

## 10. Preserved Governance Boundaries

**Decision 7.** Cross-claim semantic derivation remains governed by
`docs/DECIVEXA/CROSS-CLAIM-MATCHING-DECISION-7-ARCHITECTURAL-DECISION.md`
exactly as recorded there (architecture approved, implementation not
authorized). This record does not authorize, expand, or touch that
status in any way.

**Gate 7.** AI-generation/productization remains closed per
`docs/gates/AI-RUNTIME-GATE-7-FOUNDER-DECISIONS-GOVERNANCE-RECORD.md`,
unless separately and explicitly authorized by the Founder in the
future. This record grants no such authorization.

**Pattern.** Pattern remains conceptual/deferred per
`docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-DECISION-RECORD.md`
§13. This record does not promote Pattern to a first-class entity.

**Occurrence / Observation.** The previously Founder-approved
distinction, per
`docs/gates/PERSONAL-INTELLIGENCE-OCCURRENCE-OBSERVATION-DISTINCTION-ARCHITECTURAL-DECISION-RECORD.md`
(including its §20 narrowing), remains unchanged:

- Occurrence = distinct real-world event/state identity/anchor;
- Evidence = grounding/information artifact that may optionally
  reference an Occurrence;
- Observation = descriptive role of occurrence-linked Evidence, not a
  separate top-level entity;
- Claim = proposition;
- ClaimVersion = revision of a proposition.

**This record does not modify that architecture in any way.**

## 11. Explicit Non-Inclusion

**This record does not incorporate the subsequently Founder-discussed
"Evaluation Standard" recognition.** That recognition — that Evaluation
Standard is a semantic input to Sufficiency evaluation, distinct from
metadata, and must be recoverable within the derivation trace of any
stored output that depends on it — was reached in later conversation
and is a **separate, distinct Founder-authorized governance action**,
to be canonicalized (if and when authorized) in its own subsequent
amendment. It is deliberately **not** anticipated, pre-applied, or
silently folded into this document.

## 12. Final Determination

**ROUND-12 BOUNDED SEMANTIC SYNTHESIS CONTRACT — CANONICALIZED.
CONCEPTUAL/PRODUCT/GOVERNANCE CONTRACT ONLY. IMPLEMENTATION NOT
AUTHORIZED.** No schema, migration, code, test, API, AI capability,
Pattern entity, Observation/Event entity, or evaluation engine is
created, modified, or implied as approved by this record. Decision 7,
Gate 7, and the Occurrence/Observation distinction remain exactly as
previously and separately registered.
