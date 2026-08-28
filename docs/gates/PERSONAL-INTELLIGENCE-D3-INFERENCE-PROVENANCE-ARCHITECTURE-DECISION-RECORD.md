# Personal Intelligence — D3 Inference Provenance Architecture Decision Record

## 1. Decision Identity

- **Title:** Personal Intelligence — D3 Inference Provenance Architecture
  Decision Record
- **Artifact ID:** `PI-D3-INFERENCE-ARCHITECTURE-001`
- **Status:** **FOUNDER-APPROVED ARCHITECTURE — IMPLEMENTATION NOT
  AUTHORIZED**
- **Date:** 2026-08-27
- **Authority:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA
- **Repository context at recording time:** branch `main`,
  `HEAD = origin/main = ceefd5ff7dd49d60942ea36acf937f9b0820378b`,
  divergence `0/0`. `PIC-D4-01` already committed and pushed. The
  pre-existing protected local modification,
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, was present and untouched
  at the time this record was created and remains untouched by it.

This document records architecture. **It is not an Implementation
Contract. It is not implementation authorization. It does not authorize
schema changes. It does not authorize AI execution. It does not authorize
persistence of AI-generated inference.** A separate, future
Founder-approved Implementation Contract is required before any of that
work may begin.

## 2. D3 Architecture — Canonical Decision

**`OPTION B — SEPARATE IMMUTABLE INFERENCE RECORD` is the approved
architecture for D3 Inference Provenance.**

A future persisted Inference is a distinct, Personal-Intelligence-owned
record — not a `provenance` value inline on `PersonalIntelligenceClaimVersion`.
A future `PersonalIntelligenceClaimVersion` may optionally reference that
inference through a nullable `inferenceId`, mirroring the existing
`evidenceVersionId` reference shape. The inference exists independently of
whether it is ever promoted into a claim. The inference record is
immutable; re-evaluation creates a new inference record, never a mutation
of the original. The original inference remains permanently auditable.

## 3. Seven Non-Negotiable Invariants

**Invariant 1 — Permanent Semantic Distinction.** An inference must never
become indistinguishable from an observed or declared fact at any point in
its lifecycle.

**Invariant 2 — No Silent Truth Promotion.** No automatic transition:
inference → fact, AI output → truth, high confidence → truth, repeated
inference → truth. Any promotion or status change requires an explicit,
separately governed act.

**Invariant 3 — Immutable Inference.** Once persisted, an inference must
not be mutated. Re-evaluation creates a new inference record.

**Invariant 4 — Direct Evidence Requirement (Founder-resolved grounding
rule).** Every persisted inference must reference at least one valid
`EvidenceVersion`. An inference with zero direct `EvidenceVersion`
references must be rejected before persistence. Existing `ClaimVersion`
references may provide additional contextual grounding, but a
`ClaimVersion` reference alone can never satisfy the Evidence Before
Opinion requirement — it cannot substitute for the required direct
`EvidenceVersion` reference. This is the Founder's explicit resolution of
the grounding ambiguity identified by the prior consistency audit.

**Invariant 5 — Original Record Preservation.** Rejecting, correcting,
disputing, or superseding an inference must not delete or mutate the
original inference record.

**Invariant 6 — User-Scoped Authorization.** Every inference-related read,
write, evidence-resolution operation, and export must be scoped by
`userId`. No exception.

**Invariant 7 — AI Does Not Own Provenance.** AI Gateway and `AIProvider`
are producers/executors only. They must not own inference provenance,
Personal Intelligence persistence, Personal Model ownership, or claim
lifecycle. Inference provenance is owned by Personal Intelligence.

## 4. Provenance Semantic Model

| Class | Meaning | Architectural treatment |
|---|---|---|
| Source | Raw external fact | `Evidence` / `EvidenceVersion` |
| Observation | Directly recorded representation | Existing claim `provenance: "observed"` |
| Derived Pattern | Deterministic, non-AI aggregation | Existing claim representation where deterministic |
| Inference | AI-generated conclusion over evidence/patterns | New, immutable Inference Record |
| Prediction | Forward-looking estimate | **Not designed by this document** |
| User Confirmation | User response to an inference | Governed inference status/event; future implementation detail |

**Prediction is not approved by this document.**

## 5. Evidence Relationship

An inference may reference multiple `EvidenceVersion`s. At least one
direct `EvidenceVersion` reference is mandatory (Invariant 4).
`ClaimVersion` references may additionally be used for contextual
grounding. Evidence content itself is never copied into inference
provenance — references are by identifier only. Evidence remains owned by
Evidence and remains unaware of Inference. Whether the multi-evidence
reference is persisted as a join table or an array column is an
implementation-time persistence decision and is **not resolved here**.

## 6. Temporal Model

Inference records are immutable. Evidence references represent historical
grounding and are never rewritten when the referenced evidence's own
lifecycle later changes. A later change to grounding evidence may render
an inference's validity questionable, but this must not be silently
interpreted as invalidation. The architecture permits a future "stale /
needs re-evaluation" state; **the actual trigger for that state is
unresolved and not designed here.**

## 7. Confidence

Confidence belongs to the inference and is immutable for a given inference
record; recalculation creates a new inference record. Model-reported
confidence and any system-level adjustment must remain distinguishable
fields, never merged into one opaque number. Evidence's own `confidence`
field remains conceptually separate from inference confidence.

**The confidence algorithm remains deferred under TD-04 §22. No algorithm
is designed or implied by this document.**

## 8. User Response

Possible future inference states include `proposed`, `confirmed`,
`rejected`, `disputed`, `stale`. **No automatic transition between these
is authorized.** User correction of an inferred value should use the
existing Personal Intelligence correction pattern (`appendCorrection`)
where applicable, without inventing a parallel mechanism. Original
inference provenance remains immutable regardless of any user response.
**None of these states is implemented by this document.**

## 9. Ownership

Per TD-02, preserved and restated, not altered:

- **Evidence** owns `Evidence` and `EvidenceVersion`.
- **Personal State** owns current-state snapshots (D2).
- **Personal Intelligence** owns Inference records and PIC claims.
- **AI Gateway / `AIProvider`** own neither inference provenance nor the
  Personal Model.

## 10. AI Boundary

A future reasoning capability may be implemented as a PIC-specific AI
capability that interacts with the existing, generic AI infrastructure.
`AIProvider` and the AI Gateway remain fully generic and remain unaware of
PIC semantics; PIC-specific logic stays in the capability layer;
persistence remains owned by Personal Intelligence. Raw prompts and raw
model responses must not be persisted as inference provenance. **No AI
capability is authorized or created by this document.**

## 11. Privacy / Security

User-scoped authorization is mandatory throughout. Evidence is referenced
by identifier, never copied. Inference provenance must be exportable under
future export governance. Deletion semantics must follow already
Founder-established precedent (the genuine-deletion mechanism already
approved for Memory) rather than inventing a new policy. Raw prompts and
raw provider responses are excluded from durable inference provenance, by
design, matching the precedent already established by
`Gate7ExecutionAuditRecord`. **Export and deletion are not implemented by
this document.**

## 12. Failure Semantics

| Case | Required future behavior |
|---|---|
| Generation failure | Nothing persisted |
| Malformed AI output | Rejected before persistence |
| No direct evidence reference | Rejected before persistence (Invariant 4) |
| Invalid or non-owned evidence reference | Rejected before persistence |
| Evidence changes later | Historical reference remains; no silent destructive mutation |
| AI provider unavailable | Existing inference records remain readable |
| Duplicate inference generated | Separate inference records; no silent deduplication |

**None of these behaviors is implemented by this document.**

## 13. Rejected Options

**Option A — Inline provenance on `ClaimVersion`.** Rejected: conflates
claim content with generation metadata, cannot represent an inference that
never becomes a claim, creates semantic/table bloat, weakens
auditability.

**Option C — Full event/lineage log.** Rejected as premature: introduces a
new persistence paradigm with no precedent in the current PIC
architecture, and would pre-empt the broader event-sourcing question TD-04
§22 explicitly defers at the whole-system level.

## 14. D3 Consistency Audit Result

The fresh consistency audit found **PASS / PASS** across every checked
dimension: TD-04, TD-02 ownership, D1, D2, D3 governance, PIC-D4-01
compatibility, Evidence architecture, Memory boundary, AI Gateway,
`AIProvider`, capability architecture, security/authorization, and
privacy. The one ambiguity identified — evidence-grounding scope — is
resolved by Invariant 4 above (**DIRECT EVIDENCE REQUIRED**).

## 15. Remaining Unresolved Questions

Explicitly preserved as deferred, not resolved by this document:

1. Confidence algorithm.
2. Stale / re-evaluation trigger.
3. Prediction architecture.
4. Cross-claim conflict matching ("same underlying attribute" policy).
5. Contextual interpretation reasoning policy (TD-04 §9).
6. Exact multi-evidence persistence shape (join table vs. array column).

## 16. Relationship to FIS-057

D3 inference provenance is necessary but not sufficient for FIS-057:
`D3 inference provenance → contextual interpretation policy → FIS-057
obstacle intelligence`. No FIS-057 implementation or policy is authorized
by this document.

## 17. Relationship to Goal OS / Daily OS / Decision Engine

No integration with Goal OS, Daily OS, or the Decision Engine is
authorized or implied. D3 remains isolated within Personal Intelligence.

## 18. Relationship to PIC-D4-01

PIC-D4-01 remains closed and unchanged. Option B is compatible with
D4-01's existing `detectChange`/`explainModelChange`/`inspectEvidence`
methods. Any future visibility of `inferenceId` inside
`explainModelChange`'s diff output is an implementation-time
consideration only, not designed or authorized here. No D4-01 code is
modified by this document.

## 19. Implementation Gate

**IMPLEMENTATION IS NOT AUTHORIZED.**

Implementation requires a separate, future, Founder-approved
Implementation Contract, which must independently define and govern:
schema, persistence structure, repository methods, use-case behavior,
validation, authorization, lifecycle mechanics, evidence-reference
validation, export/delete behavior, and tests. **This document does not
authorize any of those activities.**

## 20. Change Control

Any material change to this approved D3 architecture requires Founder
review. In particular, the following must not be changed silently: the
Option B architecture; the seven invariants; the direct-evidence
requirement (Invariant 4); PIC ownership of inference provenance; AI
non-ownership; immutable-inference semantics; the no-silent-truth-promotion
rule (Invariant 2).

## 21. Founder Addendum — Status-Lifecycle Physical Realization
   (Invariant 3 / Invariant 5 Clarification)

- **Addendum date:** 2026-08-28.
- **Authority:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA.
- **Provenance:** Recorded pursuant to the Founder's "D3 PRE-IMPLEMENTATION
  READINESS AUDIT" directive (which surfaced Ambiguity #1 — a semantic
  tension between the then-current D3 Implementation Contract's placement
  of lifecycle-status fields directly on the Inference row and this
  record's own Invariants 3 and 5) and the immediately following "RESOLVE
  D3 AMBIGUITY #1 WITHOUT IMPLEMENTATION" directive that resolves it.
- **Nature of this addendum:** This section adds clarifying, reaffirming
  architecture. It does not alter, weaken, reinterpret, or supersede any
  text in §§1–20 above. Every existing invariant, decision, and deferral
  in this record remains exactly as originally recorded. Where this
  addendum uses the word "reaffirmed," no change of substance occurred —
  only additional physical-realization precision was added, because the
  physical realization was underspecified, not because the invariant was
  wrong.

### 21.1 Authoritative Decision

**THE INFERENCE RECORD ITSELF IS IMMUTABLE FOREVER.** A persisted
Inference Record must never be updated in place after creation. In
particular, once persisted, the following fields of an Inference Record
must never be mutated: the inference value; its evidence references; its
producer/provider/model/capability metadata; its confidence values; its
creation timestamp; its original lifecycle state as recorded at creation.
Rejection, confirmation, dispute, or staleness must **not** be represented
by updating the original Inference row.

### 21.2 Lifecycle Status Is Append-Only

The semantic lifecycle of an Inference remains `proposed → confirmed |
rejected | disputed | stale`, but lifecycle transitions must **not**
mutate the immutable Inference Record. Lifecycle transitions must instead
be represented by a separate, append-only lifecycle/status record
mechanism, owned by Personal Intelligence. This mechanism is **not**
full system-wide event sourcing — it is a bounded, D3-specific,
append-only lifecycle-history mechanism whose sole purpose is to preserve
the immutability of the Inference Record while retaining its complete
lifecycle history. Its exact physical schema is not specified by this
addendum; it is to be specified by a future revision of the D3
Implementation Contract (see §21.7).

### 21.3 Required Semantic Model

```text
Immutable Inference Record
        |
        | 1-to-many lifecycle history
        v
Append-only Inference Lifecycle Records
```

The original Inference Record represents: "What inference was generated,
from what grounding, by what producer, at what time, with what
confidence." The lifecycle records represent: "What explicitly authorized
lifecycle event subsequently occurred concerning that inference, when,
and by whom/what authorized actor." These are deliberately separate
concepts, and no future implementation may collapse them into one
mutable row.

### 21.4 Invariant 3 — Reaffirmed Without Modification

Once created, an Inference Record is immutable. Re-evaluation creates a
new Inference Record. No lifecycle operation may update the original
Inference row. No implementation may interpret a "status transition" as
permission to update the original Inference Record.

### 21.5 Invariant 5 — Reaffirmed and Strengthened

Rejecting, confirming, disputing, superseding, or otherwise changing the
lifecycle state of an inference must not mutate or delete the original
Inference Record. The original record remains permanently auditable. Its
lifecycle history is reconstructed from the append-only lifecycle records
associated with it, never from mutation of the record itself.

### 21.6 Invariant 2 — Unaffected, Restated

Invariant 2 remains fully binding and is unaffected by this addendum:
there is still no automatic inference→fact, inference→truth,
confidence→truth, repeated-inference→truth, proposed→confirmed,
proposed→rejected, or proposed→disputed transition. Any lifecycle
transition must originate from an explicitly authorized action under
future governance rules. This addendum does not authorize automated
promotion of any kind.

### 21.7 D3 Implementation Contract Now Requires Revision

The existing D3 Implementation Contract
(`docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md`) is now
known to contain wording inconsistent with §21.1–§21.6 above (it placed
`status`/`statusChangedAt` directly on the Inference row without ruling
out in-place mutation). **This addendum does not itself revise that
Contract.** A future, separately authorized Contract revision must:
(1) remove any wording permitting in-place mutation of the Inference
Record; (2) explicitly state the Inference Record is immutable forever;
(3) explicitly define lifecycle history as append-only; (4) explicitly
prohibit `UPDATE`-style mutation of the original Inference Record;
(5) define how the current effective lifecycle state is determined from
the immutable record plus lifecycle history; (6) preserve complete
historical lifecycle information; (7) preserve `userId` authorization on
every lifecycle operation; (8) preserve the no-silent-transition rule;
(9) preserve the distinction between lifecycle history and the inference
itself; (10) preserve all seven D3 invariants. That revision must not
resolve any of the deferred questions listed in §21.9, and is not
authorized by this addendum.

### 21.8 Explicitly Not Full Event Sourcing

This addendum must not be interpreted as approval of system-wide event
sourcing for DECIVEXA. Option C from §13 above remains rejected. The
approved architecture remains Option B — Separate Immutable Inference
Record. The lifecycle-history mechanism introduced by this addendum is a
bounded implementation realization required to make Option B internally
consistent with Invariants 3 and 5; it must not expand into a general
event-sourcing architecture for DECIVEXA.

### 21.9 Deferred Questions — Unaffected, Still Deferred

This addendum resolves only the status-lifecycle physical-realization
ambiguity. The following remain unresolved, exactly as in §15, and are
not decided by this addendum: (1) confidence algorithm; (2)
stale/re-evaluation trigger mechanism — including whether stale is
computed at read time or materialized through an explicit lifecycle
action, and any scheduling/background-processing policy; (3) prediction
architecture; (4) cross-claim conflict matching; (5) contextual
interpretation reasoning policy / FIS-057. A sixth item is added by this
addendum: (6) any broader event-sourcing architecture beyond the bounded
D3-specific lifecycle-history mechanism in §21.2 remains unresolved and
undecided.

### 21.10 Unaffected Decisions Restated

Unchanged and not reopened by this addendum: Invariant 4 (DIRECT EVIDENCE
REQUIRED — every persisted Inference must reference at least one
`EvidenceVersion`; a `ClaimVersion` may provide additional contextual
grounding only, never a substitute); the `inferenceId` nullable
`ClaimVersion` promotion relationship (§18 above) — an Inference may
exist without ever becoming a `ClaimVersion`; promotion is explicit and
does not mutate the Inference; correction of the resulting claim does not
mutate the Inference; Ambiguity #2 (Inference↔ClaimVersion cardinality)
remains non-blocking and is not addressed by this addendum.

### 21.11 Governance State After This Addendum

```text
D3 ARCHITECTURE: APPROVED
D3 GROUNDING RULE: DIRECT EVIDENCE REQUIRED
D3 STATUS IMMUTABILITY: APPROVED
D3 IMPLEMENTATION CONTRACT: REQUIRES REVISION
D3 IMPLEMENTATION: NOT AUTHORIZED
```
