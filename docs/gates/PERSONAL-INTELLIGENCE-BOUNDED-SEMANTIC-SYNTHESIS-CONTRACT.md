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

## 12. Evaluation Standard — Semantic Recognition (Amendment, 2026-09-05)

This section fulfills the reservation recorded in §11: it formally
recognizes Evaluation Standard as a semantic input, as separately
Founder-authorized. It is a conceptual clarification of this contract
only. **It does not authorize implementation.**

**12.1 Founder-Approved Recognition.** Evaluation Standard is a
semantic input to Sufficiency evaluation, not merely metadata. It
determines the evaluative bar against which evidence is assessed for
Sufficiency. Its semantic role is distinct from: Confidence; Evidential
Weight; Evidence itself; Derivation Trace; Provenance; existing
ClaimVersion Context (`situationSetting`, `timeOfDay`, etc.); Goal;
Decision; and Question as an independent persisted object.

The distinction is:

```
Evidence + Claim + Evaluation Standard → Evaluation → Sufficiency Result
```

rather than the collapsed form `Evidence → Result`.

**12.2 Minimal Conceptual Model.** The evaluative flow may be described
conceptually as:

```
Raw Evidence → relevance/admissibility under Evaluation Standard →
Evidence Set considered → Weight → Claim + relevant evidence/derived
state + Evaluation Standard → Sufficiency Evaluation → Result
```

This is a semantic model only. It does not prescribe a database
structure, schema, table, column, JSON shape, entity, service, API,
evaluation engine, or persistence mechanism. None of these is created,
implied, or authorized by this section.

**12.3 Not a First-Class Entity.** Evaluation Standard has a semantic
role as an evaluation input, but this does not establish it as an
independent first-class persisted entity, lifecycle-bearing object, or
standalone architectural component. It may be represented conceptually
as a parameter/bundle of evaluative criteria. No entity identity or
lifecycle is authorized.

**Narrowed by FD-EVAL-STANDARD-01 (§13, 2026-09-08).** This
prohibition is narrowed — not removed — to permit bounded persistence
and independent versioning of Evaluation Standard solely for
evaluation provenance, historical recoverability, reproducibility,
auditability, and exact reconstruction of the standard applied to a
given Evaluation. This narrowing does not authorize Evaluation
Standard as an epistemic axis, a Semantic Conclusion, a BSS output, an
independent semantic-synthesis artifact, or an automatic runtime
engine — see §13 for the full, controlling statement of this
narrowing.

**12.4 Not Derivation Trace Metadata.** Evaluation Standard must not be
described as merely descriptive metadata. Derivation Trace records and
reconstructs how an evaluation was produced; Evaluation Standard is one
of the semantic inputs that determines whether the evaluation result is
justified. The derivation trace/provenance records the relevant
production lineage — including the Evaluation Standard actually applied
— where the resulting evaluation output is stored, but recording it
there does not reduce Evaluation Standard's semantic role to metadata.

**12.5 Sufficiency Remains Relational.** Sufficiency is a derived
relational evaluation, not a persisted eighth epistemic axis. Its
evaluation depends on at least `Claim + Evidence Set + Evaluation
Standard`, and may additionally depend on relevant contextual
parameters. No persisted "Sufficiency" axis, "Evidential Sufficiency"
column, or eighth epistemic dimension is created or authorized.

**12.6 Weight vs. Confidence Preserved.** Confidence (directional
strength of belief in the proposition) and Evidential Weight
(amount/strength of evidential backing brought to bear) remain
distinct; Weight is not collapsed into Confidence. The evidence set
considered for Weight may depend on relevance/admissibility under the
applicable Evaluation Standard — this dependency does not make Weight
identical to Confidence or to Sufficiency.

**12.7 Evaluation Standard Components (Illustrative Only).** Evaluation
Standard may conceptually include criteria such as: purpose of the
evaluation; decision stakes where relevant; relevance criteria;
admissibility criteria; temporal evaluation scope; situational/
population scope where relevant; required threshold or evidential bar;
risk tolerance or consequence sensitivity where relevant. These are
illustrative semantic components, not a prescribed schema, and must not
be treated as database fields or a formal entity.

**12.8 Question / Purpose / Decision / Evaluation Context / Goal
Boundaries.** Question (the inquiry shape being evaluated) does not
require an independent persisted entity. Purpose (why the evaluation is
performed) may form part of Evaluation Standard. Decision (a
choice-point) is not required for every evaluation and remains outside
this amendment. Evaluation Context (circumstances under which the
evaluation is performed) must not be conflated with existing
per-ClaimVersion Context fields (`situationSetting`, `timeOfDay`). Goal
remains separately governed and deferred; this section does not
authorize Goal OS implementation.

**12.9 Reproducibility / Auditability Requirement.** Where an evaluation
output is stored and its meaning depends on an Evaluation Standard, the
Evaluation Standard actually applied must be recoverable from the
stored derivation-trace/provenance. Without this, a later reader cannot
reliably determine why a result was sufficient/insufficient, which
evidential bar applied, whether the result reflects a different purpose
or stakes, whether two apparently different evaluations were produced
under different standards, or how the result should be interpreted
historically. This is a semantic/auditability requirement; it does not
prescribe the persistence mechanism.

**12.10 Revision Semantics.** A change in Evaluation Standard does not
automatically mean an original evaluation was "corrected." If the same
Claim and the same Evidence produce one evaluation under Standard S1
and a different evaluation under Standard S2, the two may represent
distinct evaluation instances under different standards. This section
does not authorize an evaluation lifecycle or persistence model — it is
a semantic distinction only.

**12.11 Preserved Governance Boundaries.** This section does not
authorize: Decision 7 (cross-claim semantic derivation remains
closed/not implemented, per
`docs/DECIVEXA/CROSS-CLAIM-MATCHING-DECISION-7-ARCHITECTURAL-DECISION.md`);
Gate 7 (AI-generation/productization remains closed, per
`docs/gates/AI-RUNTIME-GATE-7-FOUNDER-DECISIONS-GOVERNANCE-RECORD.md`);
Living Human Model implementation; Pattern as a first-class entity
(remains deferred per
`docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-DECISION-RECORD.md`
§13); or any change to the Occurrence/Observation model (per
`docs/gates/PERSONAL-INTELLIGENCE-OCCURRENCE-OBSERVATION-DISTINCTION-ARCHITECTURAL-DECISION-RECORD.md`,
including its §20 narrowing), which remains exactly: Occurrence =
real-world event/state anchor; Evidence = grounding artifact optionally
linked to Occurrence; Observation = descriptive role of
occurrence-linked Evidence; Claim = proposition; ClaimVersion = revision
of proposition. Also not authorized: Goal OS implementation, Decision
Engine implementation, Memory expansion, inference generation, a
general Understanding Engine, a semantic synthesis engine, a
Sufficiency engine, an Evaluation engine, new epistemic infrastructure,
or any schema/API/service implementation, **except to the narrow
extent FD-EVAL-STANDARD-01 (§13) separately and explicitly permits
bounded Evaluation Standard persistence/versioning for provenance and
recoverability — no other schema/API/service implementation is
authorized by that narrowing.**

**12.12 Critical Boundary.** This section preserves, explicitly:
semantic recognition ≠ implementation authorization; Evaluation
Standard as semantic input ≠ Evaluation Standard as first-class entity
**except as narrowly permitted by FD-EVAL-STANDARD-01, §13, for
provenance/recoverability persistence only**; Sufficiency as
relational evaluation ≠ persisted epistemic axis; Derivation Trace
records the evaluation lineage — it does not thereby make Evaluation
Standard mere metadata.

## 13. FD-EVAL-STANDARD-01 — Evaluation Standard Persistence & Governance Boundary (Amendment, 2026-09-08)

### 13.1 Governance History (Historical Transparency)

This section records a governance evolution, not a rewrite of history.
The sequence of Founder-approved decisions concerning Evaluation
Standard is, in order:

1. This Contract's base canonicalization (2026-09-04) did not discuss
   Evaluation Standard at all.
2. §12 (Amendment, 2026-09-05) formally recognized Evaluation Standard
   as a semantic input to Sufficiency evaluation, while explicitly
   stating, in §12.3/§12.11/§12.12 and the (then-)§13 Final
   Determination, that no independent entity identity or lifecycle for
   Evaluation Standard was authorized.
3. Separately, the Personal Intelligence Derivation Trace / Provenance
   Architecture Contract (FD-DT-01 through FD-DT-07,
   `docs/gates/PERSONAL-INTELLIGENCE-DERIVATION-TRACE-PROVENANCE-ARCHITECTURE-CONTRACT.md`)
   was registered (2026-09-08), describing the identity/version/
   recoverability properties Evaluation Standard would need **if and
   when** such persistence were separately authorized — itself taking
   no position on, and not overriding, §12.3's prohibition.
4. "Derivation Trace / Provenance — Increment 1: Evaluation &
   Evaluation Standard Foundation" was then implemented and registered
   (commit `ef0004a`, 2026-09-08), building Evaluation Standard as a
   persisted, identity/version-bearing entity
   (`personal_intelligence_evaluation_standards` /
   `personal_intelligence_evaluation_standard_versions`) under a
   Founder authorization given in that implementation gate — without,
   at that time, an explicit amendment reconciling it against §12.3.
5. A subsequent read-only Post-Increment 1 Semantic Impact Audit
   identified this as an unreconciled governance conflict ("Finding
   2"). The Founder reviewed the resulting Governance Decision Brief
   and approved **Option C** — reconciliation via a narrowed boundary,
   rather than reversing Increment 1 or leaving §12.3 unqualified.
6. This section, **FD-EVAL-STANDARD-01**, canonicalizes that Option C
   decision. It does not conceal, erase, or retroactively deny that
   §12.3's original, broader prohibition existed and governed the
   period between 2026-09-05 and this amendment.

### 13.2 Canonical Decision

**Decision ID:** `FD-EVAL-STANDARD-01`
**Title:** Evaluation Standard Persistence & Governance Boundary
**Status:** FOUNDER-APPROVED ARCHITECTURAL DECISION

> Evaluation Standard may be persisted and versioned when required to
> preserve evaluation provenance, historical recoverability,
> reproducibility, auditability, and the exact standard applied to an
> Evaluation. Such persistence is a provenance/recoverability
> mechanism and does not elevate Evaluation Standard into an
> epistemic axis, a Semantic Conclusion, a BSS output, an independent
> semantic-synthesis artifact, or an automatic runtime engine.
> Evaluation Standard remains an input/criterion to Evaluation.

This decision narrows §12.3's (and, correspondingly, §12.11's and
§12.12's) prohibition on Evaluation Standard entity identity/lifecycle
**only to the extent necessary** to permit the bounded persistence and
versioning described above. Every other boundary those sections
establish — and every other boundary preserved elsewhere in this
Contract (§10, §12.11) — remains in force, undiminished.

### 13.3 Architectural Consequence

The existing, already-implemented Evaluation Standard persistence
(`personal_intelligence_evaluation_standards` and
`personal_intelligence_evaluation_standard_versions`, per Increment 1)
is recognized as valid under this decision, provided it remains
bounded by §13.4 below. **No rollback or restructuring of that
implementation is required, authorized, or implied as a consequence of
this decision.**

### 13.4 Non-Authorization

FD-EVAL-STANDARD-01 does not authorize, and must never be read to
authorize:

1. promoting Evaluation Standard into an epistemic axis;
2. treating Evaluation Standard as a Semantic Conclusion;
3. making Evaluation Standard a BSS output;
4. a separate Evaluation Standard semantic-synthesis layer;
5. an automatic Evaluation Standard runtime engine;
6. reopening or expanding any previously closed AI, Context, BSS,
   Cross-Claim, or Decision 7 boundary;
7. Semantic Conclusion implementation;
8. BSS implementation;
9. AI generation or execution;
10. Context Runtime changes;
11. Cross-Claim evaluation;
12. Decision 7 implementation;
13. Inference redesign;
14. Increment 2, or any implementation beyond what Increment 1 and its
    Finding 1 ownership correction already registered.

Those remain separately governed and require their own explicit,
future Founder authorization.

### 13.5 Recoverability

This decision preserves the Derivation Trace Recoverability Guarantee
(FD-DT-01). A historical Evaluation must remain capable of
reconstructing: the ClaimVersion evaluated; the exact EvidenceVersion
set considered; the EvaluationStandardVersion applied; the material
criteria of that Standard version; the Evaluation result; relevant
correction/supersession history; and any other provenance required by
the applicable Derivation Trace contract.

## 14. Final Determination

**ROUND-12 BOUNDED SEMANTIC SYNTHESIS CONTRACT — CANONICALIZED, WITH
EVALUATION STANDARD SEMANTIC RECOGNITION PER §12, AS NARROWED BY
FD-EVAL-STANDARD-01 (§13). CONCEPTUAL/PRODUCT/GOVERNANCE CONTRACT
ONLY, EXCEPT FOR THE BOUNDED EVALUATION STANDARD PERSISTENCE
EXPLICITLY PERMITTED BY §13. IMPLEMENTATION IS NOT OTHERWISE
AUTHORIZED.** No schema, migration, code, test, API, AI capability,
Pattern entity, Observation/Event entity, or evaluation engine is
created, modified, or implied as approved by this record, beyond the
Evaluation Standard persistence §13 explicitly and narrowly permits.
Decision 7, Gate 7, and the Occurrence/Observation distinction remain
exactly as previously and separately registered.
