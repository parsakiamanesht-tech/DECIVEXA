# Personal Intelligence — Derivation Trace / Provenance Architecture Contract (Single-Claim Evaluation Scope)

## 1. Document Identity

- **Title:** Derivation Trace / Provenance Architecture Contract —
  Single-Claim Evaluation Scope
- **Document type:** Dedicated, independent normative Architecture
  Contract (Founder Decision FD-DT-06, Option D) — separate from, and
  not a substitute for, any ADR or Founder Decision record.
- **Version/identity:** v1, consistent with this repository's existing
  contract-versioning convention (e.g. the Bounded Semantic Synthesis
  Contract, which carries no internal semantic-version number beyond
  its own Decision ID and canonicalization date). No semantic-versioning
  scheme beyond a plain version label is introduced here, since none is
  established elsewhere for architecture contracts of this kind.
- **Governance status:** FOUNDER-APPROVED ARCHITECTURAL CONTENT —
  PENDING REPOSITORY GOVERNANCE REGISTRATION. The architectural
  decisions this document records (FD-DT-01 through FD-DT-07) are
  Founder-approved. This document itself is not yet committed to the
  repository; it becomes repository-registered only upon a separate,
  future commit action. **Neither Founder approval of this content nor
  its eventual repository registration authorizes implementation.**
- **Founder approval reference:** FD-DT-01 through FD-DT-07 (all
  established and approved in prior session record; FD-DT-06 is the
  governance-vehicle decision that authorizes this document's
  creation; FD-DT-07 is the Inference/Semantic Conclusion boundary
  clarification recorded at §7).
- **Explicit statement:** this document is normative architecture
  governance. It states what DECIVEXA's architecture must be able to
  guarantee going forward within its scope. It is not a historical
  decision record, not an implementation specification, not a schema
  design, and not an authorization to build anything.

## 2. Authority and Scope

**This Contract governs:**

- provenance (origin of an artifact or result);
- derivation lineage (how an artifact/result was transformed from
  prior artifacts);
- Evaluation lineage (where an Evaluation exists);
- Evaluation Standard recoverability;
- Semantic Conclusion lineage, where applicable;
- versioning semantics for the objects named in §10;
- correction/supersession semantics;
- relevant AI provenance, where AI participates in a future,
  separately authorized operation;
- the recoverability guarantee stated in §4.

**This Contract does NOT govern:**

- implementation technology choices;
- database schema details;
- API implementation;
- AI generation authorization;
- cross-Claim Evaluation;
- Decision 7;
- Gate 7 reopening;
- production infrastructure.

## 3. Core Semantic Distinctions

- **Provenance** — where an artifact or result came from: its source
  identity and the actor/process that produced it.
- **Derivation** — how an artifact or result was transformed or
  produced from one or more prior artifacts.
- **Evaluation** — a semantic judgment act, performed against an
  applicable Evaluation Standard, over a specific Claim/ClaimVersion
  and Evidence Set, producing a result about evidential sufficiency or
  another explicitly defined evaluative property.
- **Evaluation Standard** — the criteria/bar against which an
  Evaluation is performed.
- **Semantic Conclusion** — a bounded semantic output that may or may
  not depend materially on an Evaluation (see §6).
- **Correction / Supersession** — a later human or system action that
  changes, supersedes, or invalidates a prior semantic result, without
  erasing its historical existence.

**Explicitly preserved throughout this Contract:**

- **Derivation ≠ Evaluation.** A deterministic or descriptive
  transformation does not become an Evaluation merely because it
  produces a Semantic Conclusion.
- **Semantic Conclusion ≠ automatically Evaluated Conclusion.** The
  existence of a Semantic Conclusion does not, by itself, imply that
  an Evaluation occurred.

## 4. Approved Recoverability Guarantee — FD-DT-01

For any persisted Semantic Conclusion whose meaning materially depends
on an Evaluation, DECIVEXA must eventually be able to reconstruct:

1. the Claim / ClaimVersion evaluated;
2. the exact EvidenceVersion set considered;
3. the Evaluation identity/version;
4. the Evaluation Standard identity/version applied;
5. the material criteria of that Standard version;
6. the AI capability/version, when AI participated;
7. the provider/model/version, when applicable;
8. relevant context references, when applicable;
9. correction/supersession history, when applicable.

**This is an architectural recoverability requirement. It is not a
statement that these capabilities are currently implemented.** See §15
for the current implementation reality.

## 5. Lineage Contract

Per **FD-DT-02** (Hybrid Architecture Direction / Option C), this
Contract's lineage is expressed through domain-native, foreign-key
relationships for stable, known domain relationships (Evidence →
EvidenceVersion → ClaimVersion, as already implemented), together with
narrow, purpose-built Evaluation-specific lineage only where a
genuinely new relationship (Evaluation → Standard version, Evaluation
→ Evidence set, Semantic Conclusion → Evaluation) requires one. **A
generic or polymorphic provenance table was explicitly considered and
was not selected as the architecture direction.**

Approved conceptual lineage direction:

```
Evidence → EvidenceVersion → ClaimVersion → Evaluation → Semantic Conclusion
```

**The Evaluation link in this chain is conditional** (per FD-DT-05, §6
below). This diagram must not be read as implying that every Semantic
Conclusion passes through an Evaluation.

Also preserved, as already established at the conceptual/schema level:

```
Inference → EvidenceVersion(s)
```

together with the producer/model provenance fields already present on
the Inference record (capability identity/version, provider, model,
model-reported confidence, system-adjusted confidence). **Inference is
not itself a Semantic Conclusion under this Contract — see §7
(FD-DT-07) for the Founder-approved boundary between the two
concepts.** This Contract does not claim that any Evaluation-specific
persistence implementing this lineage currently exists — see §15.

## 6. Conditional Evaluation — FD-DT-05

**Approved rule:**

> Not every Semantic Conclusion requires Evaluation lineage. A Semantic
> Conclusion MUST carry Evaluation lineage only when its meaning
> materially depends on an Evaluation. Semantic Conclusions that do not
> materially depend on Evaluation may legitimately exist without
> Evaluation lineage. Therefore, Evaluation is conditional rather than
> universal within the Semantic Conclusion layer.

**Material Dependence Test:**

A Semantic Conclusion materially depends on Evaluation when removing or
changing that Evaluation would materially change the conclusion's
meaning, epistemic status, or validity. If the conclusion remains
semantically valid as a deterministic/descriptive derivation without an
evaluative act having occurred, Evaluation lineage is not inherently
required.

**This is a semantic architectural test, not an implementation
algorithm.** No database field, classifier, runtime mechanism, or
automatic evaluator is implied or authorized by this section.

## 7. Inference / Semantic Conclusion Boundary — FD-DT-07

**Approved rule:**

> Inference and Semantic Conclusion are distinct concepts. An Inference
> is not itself a Semantic Conclusion under this Contract, but an
> Inference may serve as input/grounding material to a future
> Evaluation without itself requiring Evaluation lineage.

This clarifies, and does not alter, FD-DT-05 (§6): the Material
Dependence Test continues to govern only genuine Semantic Conclusions.
An Inference does not automatically become a Semantic Conclusion, and
does not automatically require Evaluation lineage, merely by existing
or by being cited as grounding material.

The corrected conceptual relationship is:

```
Inference → may serve as input/grounding material → (a future) Evaluation
```

held separately from:

```
Evaluation → may materially determine → Semantic Conclusion
```

An Inference can exist, and remains fully governed by its own D3
architecture
(`docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md`),
independently of whether any Evaluation ever cites it. This Contract
does not redefine, weaken, or reinterpret D3's Inference provenance,
producer identity, Evidence-grounding, lifecycle, immutability, or
no-silent-truth-promotion invariants — they remain fully authoritative
and unchanged.

This section is an additive clarification only. It does not introduce
an Evaluation entity, an Evaluation Standard entity, Evaluation
persistence, or any Evaluation-runtime mechanism — none of which is
authorized by this Contract regardless (§10, §15).

## 8. Evaluation Contract

An Evaluation, where one exists, is conceptually associated with:

- one Claim / ClaimVersion (single-Claim scope only — see §14);
- the relevant EvidenceVersion set considered;
- the applicable Evaluation Standard version;
- evaluation time;
- evaluator type (human, system-deterministic, or AI-participated);
- AI participation, where applicable (see §11);
- a result;
- its own provenance;
- correction/supersession lineage, where applicable.

**Single-Claim Evaluation only. Cross-Claim Evaluation remains
deferred** (see §14).

## 9. Evaluation Standard Contract

- **Identity:** a stable identifier for a given kind of Standard.
- **Version:** a Standard's material criteria may be revised over
  time; each revision is a distinct, historically addressable version.
- **Material criteria:** purpose, stakes, relevance/admissibility
  rules, threshold — attached to the specific version, not to a
  mutable "current" pointer.
- **Recoverability:** a Standard version's material criteria, as they
  existed at evaluation time, must remain readable indefinitely.
- **Historical stability (explicit rule):** a historical Evaluation
  MUST NOT silently resolve against a later Evaluation Standard
  version.

No schema is defined by this section.

## 10. Versioning and Immutability

- EvidenceVersion — immutable (already established).
- ClaimVersion — immutable / append-only (already established).
- Evaluation — where it exists, treated as an identifiable historical
  evaluative act; its identity and lineage must be preserved by any
  future persistence model.
- Evaluation Standard — versioned; historically recoverable.
- Semantic Conclusion — may be revisable/versioned depending on its
  eventual persistence model.
- Correction / Supersession — must never erase the historical
  derivation/evaluation chain; a correction creates a new lineage
  state, it does not rewrite history.

No implementation is authorized by this section.

## 11. AI Provenance Contract

Where AI participates in a future, separately authorized operation,
provenance should eventually be capable of preserving:

- capability identity/version;
- provider;
- model/version;
- execution time;
- input artifact/version references;
- relevant context references;
- AI-produced confidence, where applicable, kept distinct from
  Evidential Sufficiency and Evidential Weight;
- human correction, where applicable.

**This section does not authorize AI generation.** AIRuntime execution
does not currently exist as an authorized, reachable capability, and
nothing here claims otherwise. Raw prompt persistence is not required
by this Contract and is not mandated elsewhere in the repository's
governing documents.

## 12. Context Boundary

Context ownership remains governed by
`docs/DECIVEXA/ARCHITECTURE_DECISIONS.md` ADR-009 ("Context Engine
Boundary Ownership and Runtime Context Resolution Wiring"). This
Contract:

- does not redefine Context Engine ownership;
- governs only the recoverability of relevant context references,
  where applicable, per §4 item 8;
- does not alter the `infrastructure/ai` zero-import boundary
  established by ADR-009;
- does not authorize any Context Runtime change.

## 13. BSS Boundary

Reference: `docs/gates/PERSONAL-INTELLIGENCE-BOUNDED-SEMANTIC-SYNTHESIS-CONTRACT.md`
and ADR-010 ("Canonical AI Architecture Master Specification
Registration"). This Contract preserves:

- an Evaluation may inform a Semantic Conclusion/Bounded Semantic
  Synthesis output where applicable;
- not every Semantic Conclusion is necessarily evaluated (§6);
- Level-3 Bounded Semantic Synthesis remains subject to its own
  established requirements (Bounded Semantic Synthesis Contract §7),
  under which it remains, by its own nature, evaluation-dependent;
- this Contract does not expand scope to Level 4 or Level 5 of the
  Assertion Ladder;
- this Contract does not redefine the Bounded Semantic Synthesis
  Contract.

**Update (2026-09-08): Evaluation Standard persistence governance
reconciled.** §9 of this Contract's description of Evaluation
Standard identity/version/recoverability, and its Increment 1
implementation, were reconciled against Bounded Semantic Synthesis
Contract §12.3's "no first-class entity" prohibition via Founder
Decision **FD-EVAL-STANDARD-01** (Bounded Semantic Synthesis Contract
§13), which narrowly permits Evaluation Standard's bounded persistence
and versioning for provenance/recoverability while preserving every
other BSS boundary — Evaluation Standard remains an input/criterion to
Evaluation, never a Semantic Conclusion, BSS output, or
semantic-synthesis artifact. This Contract still does not redefine the
Bounded Semantic Synthesis Contract; FD-EVAL-STANDARD-01 is registered
there, not here.

## 14. Decision 7 / Cross-Claim Boundary

- Cross-Claim Evaluation is deferred.
- Decision 7 (`docs/DECIVEXA/CROSS-CLAIM-MATCHING-DECISION-7-ARCHITECTURAL-DECISION.md`)
  remains untouched by this Contract.
- Hypothesis persistence is not authorized by this Contract.
- Cross-Claim matching is not authorized by this Contract.
- Relationship-based semantic matching is not authorized by this
  Contract.

**This Contract creates no indirect authorization path around Decision
7.** Any future Evaluation spanning more than one Claim remains
dependent on a separate, future Founder decision within Decision 7's
own governed boundary.

## 15. Current Implementation Reality

**Historical note.** The two lists below originally reflected the
repository state *at the time of this Contract's registration*
(2026-09-08, commit `68b7337`) — before Increment 1 existed. Increment
1 ("Evaluation & Evaluation Standard Foundation," commit `ef0004a`)
and its Finding 1 ownership correction (commit `af2b5d4`) were
implemented afterward, under a separate Founder implementation
authorization, and Evaluation Standard's persistence was subsequently
reconciled against Bounded Semantic Synthesis Contract §12.3 via
Founder Decision FD-EVAL-STANDARD-01 (§13 there). The lists below are
updated accordingly rather than left to silently contradict that
authorization and reconciliation.

**Verified/implemented (as of this update):**

- EvidenceVersion lineage;
- ClaimVersion lineage;
- the EvidenceVersion → ClaimVersion relationship;
- the Claim → ClaimVersion relationship;
- the existing Inference provenance schema-level structures
  (producer capability/provider/model identity, mandatory evidence
  grounding, append-only lifecycle events) previously verified in this
  repository's Personal Intelligence Inference schema;
- **an Evaluation entity** (`personal_intelligence_evaluations`),
  including its EvidenceVersion-set and ClaimVersion lineage, both
  ownership-verified;
- **Evaluation persistence**, write-once with correction/supersession
  via `supersedesEvaluationId`;
- **Evaluation Standard persistence/versioning**
  (`personal_intelligence_evaluation_standards` /
  `personal_intelligence_evaluation_standard_versions`), narrowly
  authorized per FD-EVAL-STANDARD-01;
- **Evaluation → Standard lineage** (`evaluationStandardVersionId`,
  ownership-verified);
- **Evaluation-specific provenance persistence** (passive AI-provenance
  fields; confidence kept distinct from Evidential Sufficiency).

**Not implemented / not authorized:**

- Semantic Conclusion persistence;
- Evaluation → Semantic Conclusion lineage;
- cross-Claim Evaluation;
- Decision 7 implementation.

This Contract does not overstate implementation. Every item in the
first list either already existed at this Contract's original
registration or was implemented and separately Founder-authorized
afterward, as documented above; every item in the second list remains
a future architectural requirement this Contract defines, not a
present capability.

## 16. Governance Authority

Relationship between governance layers, in descending scope of
authority for matters this Contract touches:

1. **Founder Decisions** (e.g., Founder Decision A — Bounded Semantic
   Synthesis; Founder Decision B — Occurrence/Observation) remain
   authoritative over the product/architectural principles they
   establish. This Contract does not override them.
2. **ADRs** (ADR-009, ADR-010, ADR-011, and others) remain
   authoritative within their own decision domains. This Contract does
   not override them.
3. **This Architecture Contract** is normative only within the scope
   defined in §2 — provenance, derivation, Evaluation, Evaluation
   Standard, and Semantic Conclusion lineage/recoverability. It does
   not extend beyond that scope.
4. **Implementation specifications** and **schema/implementation**, if
   and when separately authorized, must conform to this Contract
   within its scope, and to the higher-authority sources above.

**Where a conflict exists between this Contract and a higher-authority
source, the higher-authority source prevails.** No conflict was
identified during this Contract's creation; none is resolved
unilaterally here — see §17 for the specific ADRs cross-checked.

## 17. Relationship to Existing ADRs

- **ADR-009** — "Context Engine Boundary Ownership and Runtime Context
  Resolution Wiring." Governs how AIRuntime obtains context. This
  Contract does not override it; see §12.
- **ADR-010** — "Canonical AI Architecture Master Specification
  Registration." Its own canonical specification
  (`docs/architecture/DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md`) §9
  and §16 already state the Evaluation Standard/Evidential Sufficiency
  model and the conditional ("when applicable") derivation-trace
  language this Contract formalizes in detail. This Contract does not
  override ADR-010; it operationalizes what ADR-010 already
  registered at the architecture level.
- **ADR-011** — "Production Foundation and Preflight Acceptance
  Governance." Unrelated to this Contract's scope; no interaction.

## 18. Governance Status

**Founder-Approved Architectural Content — Pending Repository
Governance Registration.** The architectural decisions recorded in
this document (FD-DT-01 through FD-DT-07) are Founder-approved. This
document becomes repository-registered only upon a separate, future
commit of this file; that commit has not yet occurred.

**Implementation is NOT authorized by Founder approval of this
content, nor will it be authorized merely by this document's eventual
repository registration.** Neither must be interpreted as:

- schema authorization;
- code authorization;
- AI generation authorization;
- Gate reopening;
- Decision 7 reopening.

## 19. Future Change Governance

Future material changes to this Contract require explicit Founder
authorization. No automatic approval mechanism and no automated
governance tooling is created or implied by this Contract.

## 20. Final Determination

**DERIVATION TRACE / PROVENANCE ARCHITECTURE CONTRACT — FOUNDER-
APPROVED (FD-DT-01 THROUGH FD-DT-07), PENDING REPOSITORY GOVERNANCE
REGISTRATION. NORMATIVE ARCHITECTURE GOVERNANCE ONLY. IMPLEMENTATION
NOT AUTHORIZED.** No schema, migration, code, test, API, AI capability,
or persistence mechanism is created, modified, or implied as approved
by this record. Founder Decision A, Founder Decision B, ADR-009,
ADR-010, ADR-011, the Bounded Semantic Synthesis Contract, Decision 7,
and Gate 7 all remain exactly as previously and separately registered.
