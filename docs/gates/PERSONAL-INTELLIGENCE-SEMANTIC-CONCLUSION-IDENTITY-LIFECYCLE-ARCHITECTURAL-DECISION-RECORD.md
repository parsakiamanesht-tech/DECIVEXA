# Personal Intelligence — Semantic Conclusion Identity & Lifecycle — Founder Architectural Decision Record

## 1. Baseline Verification

```
branch:       main
HEAD:         fcd171dd6999b358c35ab618e0a051e591b8d7db
origin/main:  fcd171dd6999b358c35ab618e0a051e591b8d7db
divergence:   0/0
```

Protected file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`: MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, unmodified — untouched by
producing this record.

## 2. Decision Identity

- **Title:** Semantic Conclusion Identity & Lifecycle Architectural Decision
- **Decision ID:** `FD-SC-04`
- **Decision family:** Semantic Conclusion (`FD-SC-01`, `FD-SC-02`,
  `FD-SC-03`, `FD-SC-04`)
- **Working/candidate identifier used during discovery:** `FD-SC-CANDIDATE-04`
  (used throughout the read-only Discovery and Decision Analysis Gate that
  preceded this registration; finalized here as `FD-SC-04`)
- **Decision status:** **FOUNDER-APPROVED**
- **Decision type:** Architectural / Governance
- **Scope:** Semantic Conclusion identity model and lifecycle model only
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Date:** 2026-09-08

This is a documentation-only registration of a Founder decision reached
directly in this conversation, following a dedicated read-only
FD-SC-CANDIDATE-04 Discovery and Decision Analysis Gate that presented four
candidate models (A: Identity + Revisions; B: Immutable + New Identity +
Optional Supersession; C: Input-Fingerprint Identity; D: Mutable
Current-State). It introduces no source, schema, migration, API, test, or
configuration change of its own, and does not move the repository baseline
recorded above.

## 3. Founder Decision (Option B — approved verbatim)

**[FOUNDER-APPROVED ARCHITECTURE — OPTION B]**

> Immutable Conclusions, New Identity Per Conclusion, Optional Supersession.

## 4. Decision — Exact Architectural Meaning

Semantic Conclusion is initially governed as follows:

1. Each Semantic Conclusion is an independent immutable artifact.
2. Each newly created Semantic Conclusion receives a new identity / new
   identifier.
3. Semantic Conclusion does **not** use an in-place mutable lifecycle.
4. Semantic Conclusion does **not** use a revision/version-number
   lifecycle.
5. If a later Semantic Conclusion corrects, replaces, or supersedes an
   earlier Semantic Conclusion, the later conclusion is a **new** Semantic
   Conclusion with a **new identity**.
6. A later Semantic Conclusion may **optionally** carry an explicit
   supersession relationship/pointer to the earlier Semantic Conclusion.
7. The earlier Semantic Conclusion remains historically intact and is
   **not** overwritten.
8. This model is intended to preserve historical integrity, auditability,
   recoverability, and a clear distinction between a new conclusion and a
   correction/replacement of an earlier conclusion.

### 4.1 Interpretation Boundary (binding)

The approved decision means:

```
Semantic Conclusion A  →  remains immutable
Semantic Conclusion B  →  new identity  →  optionally references A as superseded
```

It does **not** mean:

```
Semantic Conclusion A  →  edited in place
```

It does **not** mean:

```
Semantic Conclusion A v1  →  Semantic Conclusion A v2  →  Semantic Conclusion A v3
```

The architecture deliberately chooses **new identity per conclusion**
rather than **revision/version identity**. This mirrors the shape of
Evaluation's own already-shipped pattern (immutable write-once row +
self-referencing `supersedesEvaluationId` pointer to a prior row, with no
version number), not the shape of Evidence/Claim/EvaluationStandard's
identity+version-row pattern, and not Inference's append-only
lifecycle-event-log pattern. This decision does not itself declare that
mirroring a binding implementation requirement — the mechanism by which
this model would eventually be persisted, if persistence is later
separately authorized, remains an open question (§7).

## 5. Rationale (approved architectural rationale, not a new rule)

This decision was reached on the following grounds, established by the
preceding FD-SC-CANDIDATE-04 analysis and not extended here:

- strong historical integrity — an earlier Semantic Conclusion is never
  overwritten or reinterpreted by a later one;
- auditability — every Semantic Conclusion that ever existed remains
  inspectable exactly as it was produced;
- recoverability — consistent with `FD-DT-01`'s recoverability concern
  where a Semantic Conclusion materially depends on Evaluation;
- an explicit, unambiguous distinction between the creation of a *new*
  conclusion and a *correction/replacement* of an earlier one — the
  optional supersession pointer carries that distinction explicitly,
  rather than leaving it implicit in mutation or in a revision counter;
- consistency with the existing immutable Evaluation precedent (immutable
  row + optional self-referencing supersession pointer), which is already
  Founder-approved, implemented, and runtime-verified;
- it avoids mutable current-state semantics, which would erase prior
  history each time a conclusion changes;
- it avoids unnecessary revision/version bookkeeping (version numbers,
  "latest version" resolution logic) that the Evidence/Claim/
  EvaluationStandard identity+version pattern requires but that this
  decision determines is not the right shape for Semantic Conclusion.

This decision is not a claim that Option B is universally optimal for
every future artifact in this repository, and does not imply any other
DECIVEXA module should be redesigned to match it. No additional benefit
beyond those enumerated above is claimed.

## 6. Lifecycle Semantics

- **Immutability:** once created, a Semantic Conclusion row/artifact is
  never mutated.
- **New identity per conclusion:** every Semantic Conclusion — whether it
  is the first of its kind or a correction/replacement of an earlier one —
  receives its own new, distinct identifier. There is no shared "identity
  row" spanning multiple conclusions, and no version-number field
  distinguishing them.
- **No revision/version-number lifecycle:** the Evidence/Claim/
  EvaluationStandard pattern (stable identity + numbered version rows) is
  explicitly **not** the model adopted for Semantic Conclusion.
- **Optional supersession relationship:** a later Semantic Conclusion
  *may* carry an explicit pointer identifying an earlier Semantic
  Conclusion that it supersedes. This relationship is optional, not
  mandatory, on every Semantic Conclusion.
- **Historical intactness:** a superseded Semantic Conclusion is not
  deleted, archived-in-place, or altered. It remains exactly as it was
  originally produced.

No additional lifecycle states, statuses, transitions, version semantics,
or persistence mechanics are introduced by this decision (see §9, §10).

## 7. Explicitly Unresolved — Not Decided by This Record

Consistent with this record's narrow scope, this decision does **not**
resolve, and no future work may treat it as having resolved:

- what exact event/condition triggers creation of a Semantic Conclusion;
- whether Semantic Conclusion persistence is authorized;
- Semantic Conclusion database schema;
- the Semantic Conclusion Architecture Contract (not yet drafted);
- the complete Semantic Conclusion input model;
- the complete provenance model;
- ownership-enforcement mechanics;
- the producer/origin model;
- temporal semantics;
- purpose/stakes semantics;
- confidence-field placement;
- BSS-specific lifecycle (whether BSS shares this exact mechanism or
  extends it);
- BSS persistence;
- BSS implementation;
- the Semantic Conclusion API;
- AI generation/execution;
- Context Runtime behavior;
- Decision 7;
- Cross-Claim Semantic Conclusion;
- multi-Claim architecture;
- Inference redesign;
- any future lifecycle state beyond the approved supersession concept
  itself (e.g., no "proposed/confirmed/rejected/disputed/stale" states of
  the kind Inference uses are introduced or implied here).

Each of the above remains its own separate, future Founder Decision. This
record does not solve them, and does not imply a direction for how they
will eventually be resolved.

## 8. Relationship to Existing Decisions

### 8.1 `FD-SC-02` — Semantic Conclusion / BSS Boundary

Preserved exactly, unmodified, not reopened.
`docs/gates/PERSONAL-INTELLIGENCE-SEMANTIC-CONCLUSION-BSS-BOUNDARY-ARCHITECTURAL-DECISION-RECORD.md`
remains exactly as previously registered: Semantic Conclusion is the
broader architectural category/layer; Bounded Semantic Synthesis (BSS) is
a specific Level-3 form/instance within that layer. Semantic Conclusion
and BSS are **not** synonymous. This record's identity/lifecycle model
applies to the Semantic Conclusion category as a whole and therefore, by
extension, to BSS as one of its instances — it does not redefine, narrow,
or restate `FD-SC-02`'s own boundary in any way. Whether BSS specifically
adopts this exact mechanism unmodified, or requires its own extension of
it, is left open (§7).

### 8.2 `FD-SC-03` — Single-Claim Scope

Preserved exactly, unmodified, not reopened.
`docs/gates/PERSONAL-INTELLIGENCE-SEMANTIC-CONCLUSION-SINGLE-CLAIM-SCOPE-ARCHITECTURAL-DECISION-RECORD.md`
remains exactly as previously registered: Semantic Conclusion is initially
scoped to exactly one Claim / ClaimVersion (Single-Claim /
Single-ClaimVersion). Cross-Claim Semantic Conclusion remains explicitly
deferred, requiring its own separate Founder Decision. This record
introduces no Claim Sets, multi-Claim conclusions, relationship matching,
or cross-Claim semantics of any kind, and does not alter the Single-Claim
scope in any way — it only addresses how a (single-Claim-scoped) Semantic
Conclusion is identified and how it relates to earlier ones over time.

### 8.3 `FD-DT-05` — Conditional Evaluation Lineage

Preserved exactly, unweakened. Evaluation lineage remains conditional: only
a Semantic Conclusion whose meaning materially depends on an Evaluation
requires Evaluation lineage. This record does not make Evaluation
mandatory for every Semantic Conclusion, and does not alter the
conditionality test itself. The immutability/new-identity/optional-
supersession model applies uniformly to Semantic Conclusions regardless of
whether a given instance carries Evaluation lineage or not.

### 8.4 `FD-DT-07` — Inference / Semantic Conclusion Boundary

Preserved exactly, unweakened. Inference and Semantic Conclusion remain
distinct concepts. Inference is not automatically a Semantic Conclusion,
and this record does not collapse Inference into Semantic Conclusion or
create any new relationship between them. Inference may serve as
input/grounding material for a future Evaluation, exactly as already
established — this record neither expands nor narrows that role.

### 8.5 `FD-DT-01` — Recoverability

Preserved exactly, unweakened. Recoverability requirements apply where a
persisted Semantic Conclusion materially depends on Evaluation. This
record does not expand `FD-DT-01` into a general persistence
authorization, and does not itself authorize persisting anything (§9).

### 8.6 `FD-EVAL-STANDARD-01` — Evaluation Standard Persistence Boundary

Preserved exactly, unweakened. Evaluation Standard may be persisted/
versioned where required for evaluation provenance, historical
recoverability, reproducibility, auditability, or exact-standard
recoverability. This record does not make Evaluation Standard a Semantic
Conclusion, a BSS output, an epistemic axis, or a universal runtime
engine, and does not alter `FD-EVAL-STANDARD-01`'s own boundary in any
way.

## 9. What This Decision Explicitly Does NOT Authorize

This decision is governance/architecture only. It does **not** authorize,
and no future work may treat it as having authorized:

- creating a `SemanticConclusion` entity or domain model;
- any database, schema, or migration change;
- any persistence design or persistence implementation;
- any repository, use-case, module, DTO, controller, or API change;
- any runtime change;
- AI generation or AI Runtime activation/execution;
- any Context Runtime change;
- modifying Evaluation, Inference, or any existing implementation;
- Semantic Conclusion Architecture Contract drafting;
- Semantic Conclusion Architecture Contract registration;
- BSS-specific lifecycle design;
- BSS persistence or implementation;
- Cross-Claim architecture, Decision 7 implementation, or reopening
  Decision 7;
- adding tests for implementation;
- adding any downstream implementation increment.

A separate, explicit Founder decision and its own implementation gate are
required before any of the above may be designed or implemented — the
same discipline already applied to every prior decision in this family
and its predecessors (Founder Decision A, Founder Decision B, `FD-DT-01`
through `FD-DT-07`, `FD-EVAL-STANDARD-01`, `FD-SC-01`, `FD-SC-02`,
`FD-SC-03`).

## 10. No Silent Extension of the Decision

Consistent with §7 and §9, this record does not introduce, and must not be
read as implying:

- version IDs or revision numbers for Semantic Conclusion;
- lifecycle status enums (e.g. draft/published/archived, or
  proposed/confirmed/rejected/disputed/stale of the kind Inference uses);
- validity intervals or temporal state machines;
- automatic supersession, automatic correction, automatic deletion, or
  automatic replacement — supersession, where it occurs, is an explicit,
  optional pointer only, never an automatic or implicit mechanism;
- persistence requirements, database relationships, or schema names;
- API contracts;
- runtime creation rules or producer/origin rules;
- AI generation rules.

Any of the above, if later judged architecturally useful, is recorded here
only as an open question (§7) — not as part of this decision.

## 11. Governance Integrity

This record does not itself authorize implementation, and does not alter
any existing Contract, ADR, schema, runtime behavior, or gate. The
Bounded Semantic Synthesis Contract, the Derivation Trace / Provenance
Architecture Contract, ADR-009, ADR-010, Decision 7, Gate 7, `FD-DT-01`
through `FD-DT-07`, `FD-EVAL-STANDARD-01`, `FD-SC-01`, `FD-SC-02`, and
`FD-SC-03` all remain exactly as previously and separately registered.

## 12. Change Discipline

This record is created as a new, standalone governance artifact,
consistent with this repository's established convention of giving each
major architectural decision its own dedicated record — the same
convention already followed by `FD-SC-02`'s own record, `FD-SC-03`'s own
record, Founder Decision B's record, the Decision 7 record, and the D3
Inference Provenance record. No existing governance document was amended
to register this decision or to cross-reference it.

## 13. Final Determination

**FOUNDER DECISION `FD-SC-04` — REGISTERED. OPTION B APPROVED: SEMANTIC
CONCLUSION IS GOVERNED AS AN IMMUTABLE ARTIFACT, WITH A NEW IDENTITY
ASSIGNED TO EVERY NEWLY CREATED CONCLUSION, NO REVISION/VERSION-NUMBER
LIFECYCLE, AND AN OPTIONAL EXPLICIT SUPERSESSION POINTER FROM A LATER
CONCLUSION TO AN EARLIER ONE IT CORRECTS OR REPLACES. THE EARLIER
CONCLUSION IS NEVER OVERWRITTEN. IMPLEMENTATION NOT AUTHORIZED.** No
schema, migration, code, test, API, AI capability, Semantic Conclusion
entity, or persistence mechanism is created, modified, or implied as
approved by this record. Every substantive question beyond identity and
lifecycle shape remains `AWAITING FOUNDER DECISION` per §7. Founder
Decision A, Founder Decision B, `FD-DT-01` through `FD-DT-07`,
`FD-EVAL-STANDARD-01`, `FD-SC-01`, `FD-SC-02`, `FD-SC-03`, Decision 7, and
Gate 7 all remain exactly as previously and separately registered.
