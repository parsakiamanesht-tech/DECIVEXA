# DECIVEXA — Memory Schema-Level Conceptual Decision

**Document type:** Founder-controlled conceptual schema decision record (not
an ADR, not a Technical Design document, not an Implementation Contract,
not a physical schema, not a migration).
**Naming status:** Non-numbered, unambiguous name — consistent with the
naming pattern established in this document's predecessors
(`MEMORY_CONTENT_MODEL_DECISION_PROPOSAL.md`,
`MEMORY_CONTENT_MODEL_CONCEPTUAL_CONTRACT_PREPARATION.md`). GOV-04 has not
resolved the future ADR/TD naming convention; a bare numeric identifier
here would risk a further namespace collision (see §13).
**Status:** DECIDED WHERE EVIDENCE SUPPORTS DECISION — EXPLICITLY DEFERRED
WHERE IT DOES NOT — NOT AN IMPLEMENTATION AUTHORIZATION.
**Date:** 2026-08-24.
**Authorizing instruction:** Founder Authorization — "MEMORY SCHEMA-LEVEL
DECISION GATE" — resolving the remaining schema-level conceptual
decisions necessary to turn the Founder-approved Model C direction into a
precise future schema contract.

---

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record.*

This document is preserved as a historical architectural/planning
record. At the time it was written, Memory's schema had not yet been
extended with a content/value representation. This document's Decisions
A–D (value-encoding kind as an independent dimension; content/reference
unified as C3; Evidence linkage deferred; user-confirmation decided as
intrinsic) are preserved as the historical decisions this document
recorded; they are consistent with, though not independently proven as
the cause of, what was ultimately shipped. Subsequent shipped
implementation (commits `11e8d0d`, `217170e`, `2b5157a`, `15627e5`)
introduced the unified content/reference value slot (`valueKind:
"content" | "reference"`, `value: string | null`) and an intrinsic
`userConfirmed: boolean` field. The resolving authorization for that
implementation is not present in the surviving repository documentation.
This reconciliation does not fabricate or reconstruct that missing
authorization record and does not authorize any new implementation. The
current shipped Memory implementation must be established from the
actual committed source and commit history, not inferred from this
document.

---

## 1. Status

This document resolves four schema-level conceptual questions (Decisions
A–D) using direct repository evidence, re-derived fresh in this gate
rather than assumed from prior documents. Two questions are decided with
architectural direction. Two are explicitly deferred, with the exact
reason and the exact future decision required stated. **No question is
resolved by inventing certainty the evidence does not support.**

---

## 2. Founder Authorization Boundary

- This document does not reopen or reconsider the Founder-approved **Model
  C direction**: a common envelope (Memory's existing metadata fields)
  plus a typed value representation, informed by but architecturally
  independent from PI Core's `PersonalIntelligenceClaimVersion` precedent.
- This document is itself only a **conceptual schema decision record**.
  Even where it selects a direction (Decisions A/B below), it does **not**
  authorize: schema implementation; migration; Memory model modification;
  API; Web; AI; PI Core integration; Evidence integration; an Increment
  Contract. Those require subsequent, separate Founder-controlled gates
  (§14).
- No exact field name, exact data type, or physical schema is selected
  anywhere in this document. Where the text uses a field name (e.g.
  `user_confirmed`, `valueKind`) it is naming a **concept evidenced by a
  cited source**, not adopting that literal identifier as Memory's schema.

---

## 3. Decision Context

The Founder-approved Model C direction established the shape ("common
envelope + typed content") but explicitly left open: the taxonomy/
discriminator architecture; the content-vs-reference structure; the
Evidence-linkage relationship; and the conceptual status of sensitivity
and user-confirmation. `MEMORY_CONTENT_MODEL_CONCEPTUAL_CONTRACT_PREPARATION.md`
(the immediately prior document) investigated these questions but, by its
own design and Founder-authorized scope, declined to select between C3
and C4 and left the taxonomy question open. **This gate's purpose is to
responsibly resolve what evidence supports resolving, and explicitly defer
what it does not** — not to repeat that investigation.

---

## 4. Evidence Base

Re-derived fresh this gate (full files read in full unless noted):

- **Current Memory model** (`apps/api/src/core/memory/memory-record.model.ts`):
  `MemoryRecord {id, userId, createdAt, updatedAt}`; `MemoryRecordVersion
  {id, recordId, version, userId, provenance: "declared"|"observed",
  lifecycle: "active"|"corrected"|"deleted", observedAt, acceptedAt,
  confidence: number|null, createdAt}`. No content field, no
  `sensitivity`, no `user_confirmed`.
- **PI Core precedent** (`personal-intelligence-claim.model.ts`):
  `claimType` (9 attribute-oriented variants) on the parent record;
  `valueKind` (`"text"|"boolean"|"enum"`) + `valueText` +
  `evidenceVersionId: string | null` on each version.
- **Personal State precedent** (`personal-state-revision.model.ts`):
  `evidenceVersionId: string | null` — a second, independent instance of
  the optional-Evidence-reference pattern; notably has **no** type/kind
  discriminator at all (its fields are a fixed, known attribute set:
  `timezone`, `locale`, `availability`) — a different shape than PI Core,
  read as a caution against assuming every content-bearing record needs a
  discriminator.
- **`docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §17 "Memory Contract"**
  (top-level, Freeze-incorporated): conceptual object with `memory_id`,
  `memory_type`, **`content/reference`** (joined, one field), `source`,
  temporal fields, provenance/confidence/`user_confirmed?`,
  `sensitivity`/`last_verified`/review-policy, correction/supersession
  refs, lifecycle status.
- **`docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` §3 "Canonical
  Technical Objects" — Memory** (top-level, Freeze-incorporated; **this
  exact object was not previously cited in the decision chain** — the
  prior documents cited only TD-06 §13's governance-criteria list, not
  this canonical-object list): `memory_id`, **`content/reference`**
  (joined, one field — independently matching TD-04 §17's naming),
  `source`, `source_type`, `created_at`, `confidence`, `user_confirmed`,
  `system_inferred`, `last_verified`, `sensitivity`, `review_status`,
  `expiration?`, `provenance`. **Notably absent: no `memory_type` or
  subject-matter discriminator field of any kind.**
- **`docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` §13 "Memory
  Contract"**: governs Memory retrieval by "purpose; sensitivity;
  provenance; confidence; user confirmation state; recency/validity;
  access policy," and states explicitly: *"An inferred memory must never
  be silently represented as a user-confirmed fact. Memory poisoning
  protections must support provenance inspection, correction,
  verification and removal."*
- **`docs/architecture/TD-04-human-os-personal-intelligence-core.md`
  §4 "Evidence Model"**: six epistemic-status fact types (Explicit Fact,
  Observed Behavior, Derived Pattern, Inference, Prediction, User
  Correction) and a conceptual "Model Attribute" shape including `value`,
  `source`, `evidence references`, `confidence`, `user_confirmed`,
  `inference_status`, `sensitivity`, review/expiration status — for PIC,
  used here only as a structurally analogous precedent, not as Memory's
  own contract.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §8** "PI Core
  Boundary Invariants": non-negotiable — Memory must not create, modify,
  extend, or reinterpret the PI Core claim model; BND-01-A (Memory
  strictly outside PI Core's nine claim categories) is fixed, not
  reopened here.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §9** "Memory
  Subject-Matter Rules" (**directly decisive for Decision A**): explicitly
  states the full enumerated set of Memory record subtypes beyond
  navigation history is **UNKNOWN / CONTRACT-DEFERRED**, and that the
  increment "**may implement a single, general Memory record type
  sufficient to hold FIS-045-aligned navigation history without inventing
  a broader taxonomy**"; any discovered need for additional subtypes must
  be escalated, not invented.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §10**
  "Provenance / Confidence / Lifecycle Boundary": provenance/confidence
  must be an **independently-declared type** (never shared with PI
  Core's or Evidence's); exact lifecycle enum values beyond a minimal
  active/corrected-or-deleted distinction are **UNKNOWN / CONTRACT-
  DEFERRED**.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §7 / §17**:
  explicit Non-Goals/Deferred Decisions — "Evidence Platform linkage of
  any kind," "Sensitivity/privacy classification scheme," "PI Core ↔
  Memory interface of any kind" — all already deferred at the Increment
  Contract level, prior to and independent of this gate.
- **FIS-045 — Personal Navigation Memory** (`docs/FIS-REGISTRY.md`,
  re-verified verbatim this gate): *"Remember the user's historical
  navigation patterns and surface relevant lessons when current
  circumstances resemble prior situations."*
- **TD-07-MEMORY-PROVENANCE**: correction must stop an incorrect memory
  from being treated as current truth while preserving audit/history —
  already structurally satisfied by Memory's existing
  `appendLifecycleVersion` mechanism.

---

## 5. Decision A — Taxonomy / Discriminator Architecture

**Question:** one discriminator axis, or two? How do subject-matter type,
value-encoding kind, provenance, epistemic status, lifecycle, confidence,
and user-confirmation relate?

### 5.1 What is decided

**Value-encoding kind is a real, necessary, decidable dimension, distinct
from every other concept above.** It represents *how the value is
structurally represented* (e.g., text-like vs. boolean-like vs.
enum-like vs. reference-like) — a purely structural/type-system concern.
It exists because Model C requires a typed value (§0, Founder-approved),
and a typed value requires *some* discriminator to know which shape it
holds. This is informed by PI Core's `valueKind` **pattern** only (per
the Founder-approved direction: "informed by, not identical to") — Memory
must declare its own, independent value-encoding type, sharing no type,
interface, or table with PI Core's (`PHASE_10Q_E` §8, §10).

- **What it represents:** the structural/technical shape of the value.
- **Why it exists:** a typed envelope needs to know how to interpret its
  value; this is a prerequisite for Decision B (content/reference), not a
  duplicate of it.
- **What it must NOT represent:** subject matter, epistemic status,
  correction state, or trust — those are different questions (below).
- **Differs from provenance:** provenance describes *how the record's
  information entered the system* (declared vs. observed); value-encoding
  kind describes *what shape the value has*, independent of how it got
  there.
- **Differs from lifecycle:** lifecycle describes the record's *current
  standing* (active/corrected/deleted); value-encoding kind is static
  once a version is created.
- **Differs from confidence:** confidence is a graded certainty score;
  value-encoding kind is a discrete structural tag.
- **Differs from user-confirmation state:** user-confirmation describes
  *trust in the value's truth*; value-encoding kind describes *the value's
  shape*, independent of whether anyone trusts it.
- **Why this separation is architecturally necessary:** conflating "what
  shape is this value" with any of the epistemic concepts above would
  make each concept unable to vary independently — e.g., a `text`-shaped
  value can be declared or observed, confirmed or not, high- or
  low-confidence, all independently of its shape.

**TD-04 §4's six epistemic-status fact types (Explicit Fact / Observed
Behavior / Derived Pattern / Inference / Prediction / User Correction) are
decided NOT to become a new, independent discriminator field.** Tested
explicitly against Memory's existing fields: "Observed Behavior" and
"Inference" shade into `provenance: "observed"` plus a confidence
gradient; "User Correction" shades into `lifecycle: "corrected"`;
"Explicit Fact" shades into `provenance: "declared"` at high confidence.
These six types **decompose across Memory's existing `provenance`,
`lifecycle`, and `confidence` fields** rather than forming one clean,
orthogonal new axis — adopting them wholesale as a new field would
duplicate information those fields already carry. The genuinely novel
concept the six types point toward — a user having explicitly validated a
*specific* inference — is not "provenance richness" at all; it is
**user-confirmation state**, addressed as its own dimension in Decision D.

### 5.2 What is deferred

**Subject-matter type (what kind of thing is remembered — situations,
lessons, events) is explicitly DEFERRED, not decided.** Its *existence* as
a plausible future dimension is evidence-consistent (FIS-045's
situational framing; TD-04 §17's `memory_type`), but:

1. `PHASE_10Q_E` §9 — the operative, Founder-approved Increment Contract
   governing this exact module — explicitly states the full subtype
   taxonomy is UNKNOWN/CONTRACT-DEFERRED and that a **single, general
   Memory record type is sufficient** for the only concretely evidenced
   subject matter (FIS-045 navigation history) without inventing a
   broader taxonomy.
2. `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` §3's canonical
   Memory object — a top-level, Freeze-incorporated, more executable-
   leaning source than TD-04 §17 — **has no `memory_type` field at all**,
   independently corroborating that a subject-matter discriminator is not
   universally treated as required.
3. No source anywhere in the evidence base enumerates candidate
   subject-matter values. Inventing a taxonomy here would fabricate
   certainty the evidence does not support — explicitly prohibited by
   this gate's own governing instructions.

**If and when a subject-matter axis is introduced, its structural
principle is decided:** it must be a **separate field from
value-encoding kind** (matching PI Core's precedent of `claimType`
separate from `valueKind`), never collapsed into one discriminator — this
resolves the abstract "one field or two" question conditionally, without
deciding *whether* or *when* to introduce the axis itself.

**Provenance widening** (whether `declared`/`observed` should grow toward
a richer set) remains **DEFERRED** — no source specifies target values,
and TD-06 §3's `source_type` field (distinct from `provenance`) suggests
the richer-origin question may resolve as an additional field rather than
as a widened `provenance` enum; not decided here.

---

## 6. Decision B — Content vs. Reference

**Question:** unified (C3) or structurally distinct (C4)?

### 6.1 Decision: C3 — unified content/reference representation

**This gate selects C3.** The immediately prior preparation document left
this genuinely open, weighing TD-04 §17's `content/reference` naming
against PI Core's split-field precedent (`valueKind`/`valueText` separate
from `evidenceVersionId`). **This gate's fresh, full re-read of
`docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` §3 found a second,
independent, top-level, Freeze-incorporated source using the identical
joined `content/reference` naming** — a citation not previously present in
this decision chain (the prior documents cited only TD-06 §13's governance
list, not §3's canonical object). This changes the evidentiary balance:

- **Evidence for C3 (unification):** two independent, top-level,
  Freeze-incorporated sources — `TD-04_DATA_RUNTIME_CONTRACTS.md` §17 and
  `TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` §3 — both converge on a
  single, joined `content/reference` field for Memory specifically.
- **Evidence for C4 (separation):** one precedent —
  `PersonalIntelligenceClaimVersion` — from a *different* domain object
  (PI Core), which the Founder-approved direction requires to be used
  only as "informed by, not identical to." PI Core's split design solves
  a different problem: distinguishing a typed personal-attribute *value*
  from an optional citation of *supporting Evidence* — not distinguishing
  inline content from a general reference to something else. PI Core has
  no "reference-only" case at all (every claim version has a `valueText`);
  Memory's `content/reference` concept, by contrast, is explicitly framed
  by both TD-04 §17 and TD-06 §3 as a single slot that may hold *either*.

**Why C4 is weaker here:** C4's only support is a cross-domain stylistic
analogy explicitly scoped by the Founder's own approval to inform, not
dictate, Memory's design; it is outweighed by two independent, on-point,
Freeze-incorporated sources naming the exact concept for Memory itself.
Choosing C4 would also introduce a field that is routinely null (whichever
of content/reference does not apply to a given memory), a shape neither
Freeze source describes for Memory.

**Evaluated against the required criteria:**
- *Semantic clarity:* C3 matches how both authoritative sources describe
  the concept — a memory's "value" is either its own content or a
  pointer, not both.
- *Extensibility / storage evolution:* a unified slot with an internal
  discriminator (the value-encoding kind from Decision A) can add new
  reference *targets* (Goal, Evidence, another Memory, external/derived
  material) without a schema-level field addition each time.
- *Provenance / evidence linkage / AI consumption / lifecycle / user
  confirmation:* orthogonal to this decision — all attach to the version
  row regardless of whether the value slot is unified or split (Decisions
  A, C, D).
- *Privacy:* orthogonal — sensitivity (Decision D) governs access
  regardless of value shape.
- *Ability to represent memories without Evidence:* preserved — a
  content-holding memory needs no reference at all under C3, same as C4.
- *Ability to reference external/derived material, avoidance of
  accidental coupling to PI Core:* preserved — the "reference" case is
  general-purpose (§6.2), not PI-Core- or Evidence-specific, and no PI
  Core type is reused (`PHASE_10Q_E` §8).

### 6.2 What remains unresolved even after this decision

This decision is direction-level, not schema-level: it does **not** fix
the field name, the exact type/discriminated-union shape, whether the
"reference" case is typed generically or per-target, or how it interacts
with the still-deferred subject-matter axis (§5.2). It does **not** decide
whether the reference case specifically supports Evidence (Decision C,
below, remains separately deferred).

---

## 7. Decision C — Evidence Linkage

**Question:** is `evidenceVersionId`-style linkage (1) intrinsic to
Memory's core model, (2) an optional provenance/reference capability, or
(3) deferred to a separate Evidence-boundary decision?

### 7.1 Decision: (3) — DEFERRED to a separate Evidence-boundary decision

This is not decided at this gate, for concrete, evidence-grounded reasons
rather than by default:

1. `PHASE_10Q_E` §7 and §17 **already, explicitly** list "Evidence
   Platform linkage of any kind" as a Non-Goal / Deferred Decision for
   this exact module — a fixed governance position that predates and is
   not reopened by this gate.
2. Neither top-level source (`TD-04` §17, `TD-06` §3) names an
   Evidence-specific reference field — both describe a general
   `content/reference` slot (Decision B) whose reference case could point
   to a Goal, another Memory, external/derived material, or an Evidence
   version, without specifying which. Treating "reference" as
   *necessarily* meaning "reference to Evidence" would silently narrow a
   deliberately general concept and would smuggle a Decision-C answer
   into a Decision-B field.
3. PI Core's and Personal State's `evidenceVersionId: string | null`
   precedent answers a **different** question — "does this specific
   personal-attribute/state claim cite supporting Evidence?" — for
   objects whose entire purpose is asserting a current personal fact.
   Memory's purpose (FIS-045: situational/navigational recollection) does
   not establish the same need with the same directness; extending the
   precedent to Memory without evidence specific to Memory would risk
   exactly the "recommendation converted into decision" pattern this
   repository's governance discipline forbids.

**The semantic relationship between a Memory value and Evidence therefore
remains: Evidence may *inform* a Memory's creation at the application
layer (a process question), but no data-modeling relationship between the
two is decided here.** The reference case established by Decision B is
general-purpose, not Evidence-specific, until a future, separate
Evidence-boundary decision (consistent with `PHASE_10Q_E` §17's own
framing of this as a distinct, later gate) says otherwise.

---

## 8. Decision D — Sensitivity and User Confirmation

**Question:** are these intrinsic Memory metadata, separate governance/
security dimensions, or deferred decisions?

### 8.1 Sensitivity — DEFERRED

Every source that mentions Memory (`TD-04` §17, `TD-06` §3/§13) lists
`sensitivity` as a conceptual field, so its **existence** as a concern is
not in question. But:

- `PHASE_10Q_E` §17 **already, explicitly** defers "Sensitivity/access-
  control classification mechanism" as a Deferred Decision, and §7 lists
  "Sensitivity/privacy classification scheme" as a Non-Goal — a fixed
  governance position predating this gate.
- No source anywhere in the evidence base enumerates sensitivity *levels*
  or an access-control mechanism (Master Architecture §10.1 is referenced
  elsewhere in this decision chain as having "classification levels" but
  was not re-read this gate and is not treated as authorizing a specific
  scheme here).

**Decision:** sensitivity is confirmed as a conceptually real, required
future dimension of Memory (not invented, not dismissed), but its
classification mechanism, levels, and access-control semantics remain
**DEFERRED**, consistent with and not reopening `PHASE_10Q_E` §17. This
gate does not design access-control implementation or security
infrastructure, per its own governing scope.

### 8.2 User-confirmation state — DECIDED: intrinsic Memory metadata

Unlike sensitivity, user-confirmation state is decided as an **intrinsic,
required conceptual dimension of Memory**, not merely a deferred
governance concern, because:

1. `TD-06` §13 states directly and non-conditionally: *"An inferred
   memory must never be silently represented as a user-confirmed fact."*
   This is a content-trust/epistemic-integrity rule central to Memory's
   own stated purpose (poisoning resistance, per Master Architecture §24
   and TD-07), not an access-control or privacy concern like sensitivity.
2. `TD-06` §3's canonical Memory object independently lists **two
   separate** fields — `user_confirmed` and `system_inferred` — for
   Memory specifically (not merely for PIC), corroborating that this is
   a real, decided-relevant dimension at the top-level, Freeze-
   incorporated tier.
3. It is **not deferred** at the Increment Contract level the way
   sensitivity is — `PHASE_10Q_E` §7/§17 defer "sensitivity/privacy
   classification scheme" explicitly, but do not list user-confirmation
   or epistemic-integrity tracking as a Non-Goal.

**How it differs from the other dimensions (per the governing
instructions' required test):**
- *Differs from provenance:* provenance describes how the record's
  information **entered** the system (declared vs. observed); user-
  confirmation describes whether a human has **subsequently validated**
  a specific value — these vary independently (a system-observed memory
  the user later confirms; a user-declared memory never re-confirmed
  after a correction).
- *Differs from lifecycle:* lifecycle is the record's structural standing
  (active/corrected/deleted); user-confirmation is a trust flag on the
  content itself, orthogonal to whether the record is currently active.
- *Differs from confidence:* confidence is a graded, typically
  system-computed certainty score; user-confirmation is a discrete
  human-sourced trust signal — a value can be high-confidence and
  unconfirmed, or low-confidence and user-confirmed.
- *What it must NOT represent:* it must not be inferred from `provenance`
  alone (`declared` does not imply confirmed; `observed` does not imply
  unconfirmed) — conflating the two is exactly the failure TD-06's rule
  prohibits.

**This decision does not select a field name, type, or default value** —
only the conceptual necessity and independence of this dimension.

---

## 9. Final Conceptual Memory Model

**Memory = common envelope (existing, unchanged: `id`, `userId`,
`recordId`/`version`, `createdAt`, `observedAt`, `acceptedAt`) + a typed
value (Decision A: a value-encoding-kind-discriminated value; Decision B:
unified content-or-reference) + existing epistemic/provenance semantics
(`provenance`, `confidence` — Decision A: not widened by a new taxonomy;
provenance-widening itself deferred) + existing lifecycle semantics
(`lifecycle` — unchanged mechanism) + a required, distinct
user-confirmation dimension (Decision D.2: decided necessary, not yet
schematized) + a deferred Evidence-reference relationship (Decision C) +
a deferred sensitivity/access-control dimension (Decision D.1) + a
deferred, optional future subject-matter classification (Decision A,
§5.2).**

| Concept | Status | What it is |
|---|---|---|
| Common envelope | Unchanged | Memory's existing metadata fields |
| Value (what the Memory *is*) | Decided (direction) | A typed value; typing informed by, not identical to, PI Core's pattern |
| Value-encoding kind | Decided | A structural discriminator, independently declared |
| Content vs. reference | **Decided: unified (C3)** | One slot, either inline content or a pointer |
| Epistemic status / provenance | Decided: not a new axis | Decomposes into existing `provenance`/`lifecycle`/`confidence` + user-confirmation |
| User confirmation | **Decided: intrinsic, required** | A distinct trust dimension, not derivable from provenance |
| Lifecycle | Unchanged | Existing `appendLifecycleVersion` mechanism suffices structurally |
| Evidence reference | **Deferred** | General reference case (Decision B) is not Evidence-specific; separate future gate |
| Sensitivity / access control | **Deferred** | Existing `PHASE_10Q_E` §17 deferral, not reopened |
| Subject-matter classification | **Deferred** | Single general type sufficient per `PHASE_10Q_E` §9; no taxonomy evidenced |

---

## 10. Rejected Alternatives

- **C1 (single discriminator collapsing subject-matter and
  value-encoding into one field):** rejected as a structural default —
  if/when a subject-matter axis is introduced, it must be a field
  separate from value-encoding kind (§5.1–5.2), matching PI Core's
  two-field pattern. Not fully moot, because it still answers *how* a
  future subject-matter axis should relate to value-encoding kind.
- **C4 (split content and reference fields):** rejected in favor of C3
  (§6.1) — outweighed by two independent, top-level, Freeze-incorporated
  sources naming a unified `content/reference` concept specifically for
  Memory, versus one cross-domain, explicitly-analogical precedent.
- **Adopting TD-04 §4's six epistemic-status fact types as Memory's new
  discriminator field:** rejected (§5.1) — they decompose across
  Memory's existing `provenance`/`lifecycle`/`confidence` fields and the
  newly-decided user-confirmation dimension, rather than forming an
  orthogonal new axis.
- **Model A/B (flat text field; rigid single structured payload)** from
  the original investigation: remain rejected, not reopened — the
  Founder-approved Model C direction (§0) already supersedes them.
- **Treating `content/reference`'s reference case as necessarily
  Evidence-specific:** rejected (§7.1) — would silently narrow a general
  concept and smuggle a Decision-C answer into Decision B.
- **Inferring user-confirmation from `provenance` alone:** rejected
  (§8.2) — directly contradicted by TD-06's explicit anti-poisoning rule
  and by TD-06 §3's listing of `user_confirmed` and `system_inferred` as
  two distinct fields.

---

## 11. Unresolved Questions (explicitly preserved, not decided here)

1. Whether/when to introduce a subject-matter classification axis, and
   its taxonomy, if introduced (§5.2) — deferred; `PHASE_10Q_E` §9's
   single-general-type position stands unless a future Founder decision
   or new evidence requires more.
2. Whether/how `provenance` should be widened beyond `declared`/
   `observed`, and whether TD-06's `source_type` should become a
   separate field instead (§5.2) — deferred.
3. Sensitivity classification levels and access-control mechanism
   (§8.1) — deferred; not reopened from `PHASE_10Q_E` §17.
4. The semantic relationship between Memory and Evidence, including
   whether an `evidenceVersionId`-style field is ever added (§7.1) —
   deferred to a separate Evidence-boundary gate.
5. Exact field names, exact types, the precise discriminated-union shape
   of the unified content/reference field, and default values for
   user-confirmation — all schema-level, deferred to the future
   Implementation Contract.
6. Exact lifecycle enum values beyond the existing minimal set (already
   deferred per `PHASE_10Q_E` §10; not reopened).
7. Whether an explicit "corrects/supersedes version N" reference field
   should supplement the existing implicit version sequence — deferred
   (carried forward from the preparation document, not newly resolved
   here).
8. `system_inferred` (newly surfaced by TD-06 §3) as a candidate distinct
   field alongside `user_confirmed` — noted as input evidence only; not
   adopted, not decided.
9. Every item already listed as unresolved in the approved proposal and
   preparation documents that this document does not explicitly revisit:
   migration; PI Core/Evidence/Web/AI consumption; privacy/sensitivity
   *implementation*; any Increment Contract content.

---

## 12. Six-Criteria DECIVEXA Review

1. **Vision Alignment** — *Evidence:* Master Architecture §24 and TD-06
   §13 both require distinguishing inferred from user-confirmed content
   before Memory can be trustworthy. *Interpretation:* Decision D.2
   directly serves this; deferring sensitivity (D.1) does not weaken it,
   since sensitivity is a different (privacy) concern. *Risk:* none from
   deciding a direction only. *Recommendation:* preserve the
   user-confirmation/provenance distinction through the eventual schema.
2. **Long-Term Architecture Strength** — *Evidence:* Decision B reuses a
   pattern independently corroborated by two Freeze-incorporated sources
   rather than one cross-domain analogy; Decision A avoids inventing an
   unevidenced taxonomy. *Interpretation:* lower long-term rework risk
   than committing to either C4 or a fabricated subject-matter taxonomy.
   *Risk:* none identified. *Recommendation:* the future Implementation
   Contract should preserve both decisions.
3. **Improvement Opportunities** — *Evidence:* TD-06 §3's `source_type`
   and `system_inferred` fields (§11 items 2, 8) are newly surfaced,
   uncited-elsewhere candidates for future refinement. *Interpretation:*
   worth flagging for the future schema gate. *Risk:* none — opportunity
   only. *Recommendation:* not executed here.
4. **User Input Burden vs. System Value** — *Evidence:* no product
   surface exists; this document adds no user-facing change.
   *Interpretation:* no burden impact. *Recommendation:* none needed.
5. **AI Capability** — *Evidence:* TD-06 §13's anti-poisoning rule depends
   directly on user-confirmation being a distinguishable, non-inferred
   dimension (Decision D.2). *Interpretation:* this decision is a direct
   prerequisite for any future AI consumption to be trustworthy, without
   authorizing AI consumption. *Risk:* none — no AI wiring proposed.
   *Recommendation:* preserve the distinction through the eventual schema
   and any future AI Gateway policy.
6. **Trusted Reference Platform** — *Evidence:* every decision above
   traces to specific, freshly re-verified sources, including two newly
   surfaced citations (TD-06 §3's Memory object; `PHASE_10Q_E` §9's
   single-type position) not previously present in this decision chain.
   *Interpretation:* deciding only where evidence supports it, and
   explicitly deferring the rest, keeps the record honest.
   *Recommendation:* none needed.

---

## 13. Governance / Architecture Freeze Check

- No Freeze modification is required, implied, or made. TD-04 and TD-06
  (top-level) are both within the Freeze's "Frozen Source Gate" range;
  this document only analyzes their existing content further.
- **GOV-02 and GOV-04 are not reopened.** The known TD-02, TD-04, and
  TD-06 namespace collisions are not resolved by this document.
- **TD-06 collision, restated:** `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md`
  (cited extensively above, as evidence) and
  `docs/technical-design/TD-06-AI-TRUTHFULNESS.md` (a distinct subject,
  not cited as evidence anywhere in this document) share the "TD-06"
  numeric identifier. Neither file was renamed, merged, deleted, or
  normalized. This disclosure does not reopen or resolve GOV-04.
- No Memory, Evidence, PI Core, or Personal State implementation file was
  modified — all were read for evidence only.
- No existing ADR, Architecture Freeze, Master Architecture, or Roadmap
  file was modified.
- No numbered ADR or TD filename was created; this document retains its
  descriptive, non-numbered name for the same GOV-04-pending reason as its
  predecessors.

---

## 14. Explicit Non-Authorization

**Even where this document selects a direction (Decisions A §5.1, B §6),
it does NOT authorize:**

- Memory schema implementation or migration.
- Any modification to `memory-record.model.ts`, `memory.use-case.ts`, or
  any Memory implementation file.
- Any modification to Evidence, Personal State, or PI Core files (read
  for comparison only).
- Any controller, API route, or Web/UI work.
- Any PI Core ↔ Memory or Evidence ↔ Memory integration (Decision C
  remains deferred specifically to prevent this).
- Any AI consumption of Memory.
- Any Increment Contract (a future, separate document would need to
  incorporate these decisions).
- Any modification to existing ADRs, Architecture Freeze, Master
  Architecture, Roadmap, or GOV-02/GOV-04.
- Selection of exact field names, exact types, a finalized taxonomy, or
  any physical/persistence schema.
- Resolution of any of the explicitly deferred items in §5.2, §7, §8.1,
  or §11.

Those require subsequent, separate Founder-controlled gates, in the same
sequence this repository has established for every prior increment
(Contract → TD-09 readiness review → Build Authorization).

---

## 15. Final Decision Summary

| Decision | Outcome |
|---|---|
| A — Taxonomy/discriminator architecture | Value-encoding kind: **decided**, required, independent dimension. Subject-matter classification: **deferred**, not required now (single general type suffices per `PHASE_10Q_E` §9). TD-04 §4's six epistemic types: **decided NOT** to become a new axis — they decompose into existing fields + user-confirmation. |
| B — Content vs. reference | **Decided: C3 (unified content/reference field)**, on the strength of two independent, top-level, Freeze-incorporated sources (TD-04 §17, TD-06 §3) — a reversal of the prior document's "genuinely open" finding, based on newly re-derived evidence (TD-06 §3's canonical Memory object). |
| C — Evidence linkage | **Deferred** to a separate, future Evidence-boundary decision — consistent with `PHASE_10Q_E` §7/§17's existing Non-Goal, and because the general reference case (Decision B) is not Evidence-specific. |
| D — Sensitivity / user confirmation | Sensitivity: **deferred** (existing `PHASE_10Q_E` §17 deferral, not reopened). User-confirmation state: **decided** as intrinsic, required Memory metadata, distinct from provenance/lifecycle/confidence — not schematized. |

---

**STOP — CONCEPTUAL SCHEMA DECISION COMPLETE. NO IMPLEMENTATION
AUTHORIZED.**
