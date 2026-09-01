# DECIVEXA — Memory Content Model Investigation

**Document type:** Narrow investigation/design document (not an ADR, not an
Implementation Contract, not an Architecture Freeze artifact).
**Status:** EVIDENCE-BACKED — INVESTIGATION ONLY — NOT FOUNDER-APPROVED —
NOT IMPLEMENTATION-AUTHORIZED.
**Date:** 2026-08-24.
**Authorizing instruction:** Founder-authorized "DECIVEXA — Memory Content
Model Investigation Gate" (Option B of the prior "MEMORY WEB/PRODUCT
INTEGRATION — FOUNDER GATE REPORT").
**Why an investigation document rather than an ADR:** an ADR in this
repository's own established pattern (ADR-002, ADR-003) records a
*decision already reached and Founder-approved*, with a selected option.
This document does not select a model on the Founder's behalf — it
narrows the evidence and options so a subsequent ADR can do so efficiently.
Drafting an ADR before that selection would risk exactly the "Recommendation
converted to Founder-approved decision" failure this repository's own
governance discipline (`ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` §7) forbids.

---

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record.*

This document is preserved as a historical architectural/planning
record. At the time it was written, Memory's schema had not yet been
extended with a content/value representation — this document's §2.1
statement that Memory has "no content/value field of any kind" was
accurate when written and describes the pre-increment schema, not the
current one. Subsequent shipped implementation (commits `11e8d0d`,
`217170e`, `2b5157a`, `15627e5`) introduced the unified content/reference
value slot (`valueKind: "content" | "reference"`, `value: string |
null`), matching this document's Model C recommendation, and an
intrinsic `userConfirmed: boolean` field. The resolving authorization
for that implementation is not present in the surviving repository
documentation, and this reconciliation does not claim this document
authorized those specific implementation choices — it recommended a
direction only (§7), never a final schema. This reconciliation does not
fabricate or reconstruct that missing authorization record and does not
authorize any new implementation. The current shipped Memory
implementation must be established from the actual committed source and
commit history, not inferred from this document.

---

## 1. Question

*What should Memory actually contain / value-represent?* — investigated
without assuming a `content: string` field is correct, and without
implementing anything.

---

## 2. Evidence

All items below are direct repository evidence, read in full or in the
cited section this session.

### 2.1 Current Memory implementation (read in full)

- `apps/api/src/core/memory/memory-record.model.ts`: `MemoryRecord {id,
  userId, createdAt, updatedAt}`; `MemoryRecordVersion {id, recordId,
  version, userId, provenance, lifecycle, observedAt, acceptedAt,
  confidence, createdAt}`. **No content/value field of any kind.**
- `apps/api/src/persistence/schema/memory.schema.ts`: matches the model
  exactly at the database level — `memory_records` and
  `memory_record_versions` tables, no content column.
- `apps/api/src/application/memory/memory.use-case.ts`: `get`,
  `getVersion`, `create`, `appendLifecycleVersion` — all metadata
  operations; none accepts or returns a content payload.

### 2.2 Evidence model (read in full, for comparison)

- `apps/api/src/core/evidence/evidence.model.ts`: `Evidence {id, userId,
  createdAt, updatedAt}`; `EvidenceVersion {id, evidenceId, version,
  userId, provenance, lifecycle, observedAt, acceptedAt, confidence,
  createdAt}`. **Structurally near-identical to Memory's current shape**
  — same field set, same absence of content.

### 2.3 Personal Intelligence Core claim model — a directly relevant,
already-implemented, Founder-governed precedent (read in full)

`apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts`:

```text
PersonalIntelligenceClaimType =
  "identity_attribute" | "value" | "preference" | "capability" |
  "constraint" | "environment_context" | "strength" | "weakness" |
  "behavior_pattern"

PersonalIntelligenceValueKind = "text" | "boolean" | "enum"

PersonalIntelligenceClaim { id, userId, claimType, createdAt, updatedAt }

PersonalIntelligenceClaimVersion {
  id, claimId, version, userId,
  valueKind, valueText,
  provenance, confidence, lifecycle,
  evidenceVersionId,
  observedAt, acceptedAt, createdAt
}
```

**This is the closest existing precedent in the repository for exactly
this problem.** PI Core already solved "how does a metadata-rich,
provenance-tracked personal-intelligence record carry a value?" with two
mechanisms: (a) a **typed classification** on the parent record
(`claimType`), and (b) a **polymorphic value pair** on each version
(`valueKind` + `valueText`), plus (c) an **optional reference to
Evidence** (`evidenceVersionId: string | null`).

### 2.4 Personal State revision — a second confirmed instance of the same
Evidence-reference pattern

`apps/api/src/core/personal-state/personal-state-revision.model.ts` line
11: `evidenceVersionId: string | null`. Confirmed by direct grep this
task across the model, its repository interface, and its spec file — the
same optional-reference-to-Evidence pattern PI Core uses, applied to a
second, independent domain object.

**Together, 2.3 and 2.4 establish an existing, twice-used, Founder-
governed repository convention: a content-bearing record references
Evidence optionally, by ID, rather than containing it, being contained by
it, or copying its (content-less) shape.**

### 2.5 TD-04 — Human OS / Personal Intelligence Core, §4 "Evidence Model"
(`docs/architecture/TD-04-human-os-personal-intelligence-core.md`, read in
full this task)

Lists six evidence/fact **types** PIC must distinguish (Explicit Fact,
Observed Behavior, Derived Pattern, Inference, Prediction, User
Correction) and a conceptual "Model Attribute" shape:

```text
Model Attribute
├── value
├── source
├── evidence references
├── confidence
├── created_at / last_observed_at / last_verified_at
├── user_confirmed
├── inference_status
├── sensitivity
└── review / expiration status
```

This is listed under "§20. Architectural Invariants — proposed... for
Founder approval" — i.e. it is itself not yet Founder-approved, but it is
the closest conceptual-document precedent for a `value` field co-existing
with exactly the metadata Memory already has.

**§19 "What PIC Must NOT Become"** explicitly includes *"an AI-only
memory store"* — PIC and Memory are named as distinct siblings, not one
containing the other; **§21 "Dependencies"** lists "Memory Architecture"
and "Evidence Platform" as two *separate* named dependencies of PIC.

### 2.6 TD-02 §3.16 "Memory Architecture"
(`docs/technical-design/TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md`, already
read in full this session) — memory storage abstraction, retrieval,
provenance, source/date/confidence metadata, user-confirmed vs. inferred
status, sensitivity, verification/review status, expiration, correction
and deletion. **No content field mentioned.**

### 2.7 TD-07-MEMORY-PROVENANCE
(`docs/technical-design/TD-07-MEMORY-PROVENANCE.md`, status "Proposed
technical contract," read in full this task and the prior task) — full
metadata list (source, timestamp, confidence, sensitivity, user-confirmed
status, system-inferred status, last verification, review/expiration
state, provenance chain, supersession/correction reference). **No content
field anywhere in this document either.**

### 2.8 FIS-045 — Personal Navigation Memory
(`docs/FIS-REGISTRY.md` line 34; `docs/DECIVEXA-CANONICAL-BASELINE.md`
line 412; `docs/PHASE-01-EXECUTABLE-ARCHITECTURE-SPECIFICATION.md` line
842) — the concrete subject-matter anchor named by Phase 10Q-D §11 for
Memory's Contract readiness:

> *"Remember the user's historical navigation patterns and surface
> relevant lessons when current circumstances resemble prior
> situations."*

`PHASE-01-EXECUTABLE-ARCHITECTURE-SPECIFICATION.md`'s own table entry:
`FIS-045 | Personal Navigation Memory | Memory + Intelligence | Evidence,
outcomes, paths` — naming Memory's key **dependencies** as "Evidence,
outcomes, paths," not naming Memory itself as raw evidence storage.

### 2.9 Master Architecture §24 "Memory Architecture"
(`docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`, full text re-verified
this task): *"Memory should be treated as a high-value intelligence
substrate, not merely a storage feature... distinguish explicit memory,
observed evidence, inferred memory, confidence, source, recency,
verification, sensitivity... defend against memory poisoning."* No
content-field specification; consistent with everything above.

### 2.10 Architecture Freeze Baseline
(`docs/ARCHITECTURE_FREEZE_BASELINE.md`, re-verified this task) — lists
"Memory Architecture" and "Integration & Evidence Platform" in its
Baseline Scope as two separate frozen-scope items (not merged), and
Governing Freeze Rule 9: *"Deferred ideas remain in the Architecture
Backlog until formally promoted."* No content-model specification exists
in the Freeze itself; nothing in it prevents this investigation or a
subsequent ADR.

### 2.11 Memory Increment Contract Non-Goals
(`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §7/§17, re-verified
this task) — explicitly defers "PI Core ↔ Memory interface of any kind,"
"Evidence Platform linkage of any kind," "Future AI consumption of Memory
records," and "Sensitivity/privacy classification scheme." Confirms this
investigation touches only previously-deferred, not previously-decided,
ground.

---

## 3. Interpretation

**The current Memory implementation copied Evidence's shape (a pure,
content-less provenance envelope) — but the architecture's own evidence
(FIS-045, TD-04 §4, and the two existing Evidence-reference precedents)
indicates Memory's semantic role is actually closer to PI Core's
`PersonalIntelligenceClaim`/`PersonalState` role: a record that *carries*
a value and *optionally references* Evidence, rather than a record that
*is itself* evidence.**

Evidence's content-lessness is not an oversight — Evidence is
deliberately a provenance/proof envelope about some other fact
(referenced *from* PersonalState/PI Core via `evidenceVersionId`, never
the other way around). Memory, per FIS-045 and TD-04 §4's Model
Attribute concept, is meant to hold something else: a remembered pattern,
lesson, or situation — synthesized from evidence, outcomes, and paths,
not identical to any one of them.

This directly answers §4.E of the governing prompt (Memory ↔ Evidence
relationship): **Memory should reference Evidence optionally, by ID
(mirroring `PersonalIntelligenceClaimVersion.evidenceVersionId` and
`PersonalStateRevision.evidenceVersionId` exactly), not contain it, not
be contained by it, and not be produced by it as a data-modeling
relationship** (Evidence may *inform* a Memory's creation, but Memory is
its own record).

---

## 4. Required Architectural Questions — Answered

**A. Semantic identity of a Memory Record.** Per FIS-045 and TD-02 §3.16:
a Memory is a durable, provenance-tracked, user-scoped record of a
*pattern, lesson, or situation-level recollection* — distinct from
Evidence (a proof/provenance envelope with no independent content),
Personal State (current-value snapshots of specific declared attributes),
Goal data (destination/commitment records, per TD-02 §3.2), an Event
(a bare "this happened" fact, per TD-02 §8's Event/State distinction —
Memory is closer to a *State*-like interpretation *of* events than to
the event itself), and PI Core's Claim (a specific personal-attribute
value) — Memory's distinguishing trait per FIS-045 is its *navigational/
situational* character ("surface relevant lessons when current
circumstances resemble prior situations"), not a general-purpose note or
fact store.

**B. What exactly is "what is remembered"?** Evidence does not support a
single answer definitively, but converges on: **not** plain unstructured
text (no document proposes this), **not** a single fixed schema (TD-04
§4 lists six distinct evidence/fact *types*, implying typed variation is
architecturally expected), and *at minimum* a typed value akin to PI
Core's `valueKind`/`valueText` pair. A fully proposition-oriented or
event-oriented model is *plausible* per FIS-045's "situations/lessons"
framing but is not conclusively required by current evidence — this
remains a genuine open question, not resolved here.

**C. Is one universal content representation appropriate?** No single
document mandates this either way. Given TD-04 §4's six fact-types and
PI Core's precedent of `claimType` (9 variants) + `valueKind` (3
variants), the evidence leans toward **a common envelope plus typed
content**, not one flat universal type.

**D. Content ↔ provenance relationship.** Per every metadata list read
(§2.2, §2.6, §2.7, §2.9): provenance describes **the source of the
memory/observation itself** ("declared" vs. "observed"), not a separate
description of "the source of its content" — content and its provenance
are properties of the same version record, exactly as PI Core's
`PersonalIntelligenceClaimVersion` already structures it (`valueKind`/
`valueText` and `provenance`/`confidence` co-located on one version row).

**E. Memory ↔ Evidence relationship.** Answered in §3 above: **sibling
primitives, connected by an optional reference** (Memory may cite the
Evidence that supports it, via an `evidenceVersionId`-shaped field),
**not** containment in either direction, **not** "Evidence produces
Memory" as a formal data-modeling claim (though evidence and outcomes may
*inform* a memory's creation at the application layer — a process
question, not a schema question).

**F. Memory ↔ future AI relationship.** TD-04 §21 lists "Memory
Architecture," "Evidence Platform," "DECIVEXA AI / AI Gateway" as
separate, siblings-not-contained dependencies of PIC. TD-04 §19
explicitly forbids PIC becoming "an AI-only memory store." Master
Architecture §24 requires memory-poisoning defenses specifically for
AI-influenced content. **A typed, provenance-tagged content model (per
§4.B/C) is a prerequisite for any future AI consumption to be
trustworthy** — an untyped free-text field would make poisoning
detection and source-distinction (TD-07's core requirement) materially
harder. This is interpretation, not an authorized coupling — no PI
Core/AI wiring is proposed or implied.

**G. Lifecycle applies to which component?** Per PI Core's precedent
(the `lifecycle` field lives on the *version* row, alongside `valueKind`/
`valueText`) and TD-07's explicit "Correction... MUST stop the incorrect
memory from being treated as current truth while preserving necessary
audit/history semantics": lifecycle should apply **per-version**, to the
content-bearing version as a whole (matching Memory's *already-
implemented* `appendLifecycleVersion` mechanism) — not as a separate
sub-component lifecycle for content vs. provenance independently. This
requires no schema change to the *lifecycle* mechanism, only an addition
of content fields to the same version row.

**H. What must remain outside Memory (per Contract §7/§17, unaffected by
this investigation).** PI Core interface wiring, Evidence Platform
linkage wiring, sensitivity/access-control classification mechanism,
semantic/vector retrieval, HTTP/API/UI of any kind, AI consumption of any
kind, Digital Twin, Context Fusion, Growth Navigation, Goal OS/Daily OS,
Actor≠Owner resolution.

---

## 5. Privacy and Security — Architectural Only

Not decided or designed here; flagged as **explicitly deferred**,
matching the Contract's own §17:

- **Sensitivity/privacy classification** — Contract §17 already defers
  this; a content field would need one eventually (per Master
  Architecture §10.1's classification levels), but selecting it is out
  of this investigation's scope.
- **Provenance trust / poisoning controls** — TD-07's own §"Poisoning
  controls" already governs this at the metadata level; a content field
  does not change that requirement, it makes it concrete.
- **User-authored vs. system-inferred content** — already representable
  today via the existing `provenance` field ("declared"/"observed");
  adding content does not require a new dimension here.
- **Retention / deletion semantics** — already governed by the existing
  `lifecycle` field ("active"/"corrected"/"deleted") and TD-07's
  correction requirement; unaffected by adding content.
- **Selective access / future encryption boundaries** — not mature
  enough to decide from current evidence; explicitly deferred, not
  designed.

---

## 6. Candidate Content Models

| Model | Description | Semantic correctness | Vision alignment | AI readiness | Extensibility | Evidence compat. | Lifecycle compat. | Privacy evolution | Impl. complexity | Premature-coupling risk | Migration cost | User-input burden | Reference-platform value |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **A — Simple textual content** (`content: string`) | One flat text field | Weak — collapses six TD-04 §4 fact-types into one shape | Weak — vision requires distinguishing fact/inference/prediction (§2.5) | Low — no structure for poisoning/type checks | Poor — hard to extend without breaking | Compatible (independent field) | Compatible | Neutral | Lowest | Low, but wrong-shape risk | Low now, high later if wrong | None | Weak — least defensible under scrutiny |
| **B — Structured typed payload** (a fixed JSON shape per Memory) | One rigid structured schema | Moderate — better than A, still assumes one shape fits all memory types | Moderate | Moderate | Moderate — rigid schema resists new memory types | Compatible | Compatible | Neutral | Moderate | Moderate | Moderate | None | Moderate |
| **C — Common envelope + typed content variants** (mirrors PI Core's `claimType`+`valueKind`/`valueText`) | Parent record carries a type; version carries `valueKind`+`valueText` (or richer typed payload later) | **Strong — directly matches TD-04 §4's six fact-types and existing PI Core precedent (§2.3)** | **Strong — matches "Evidence Before Opinion" distinctions already required elsewhere** | **Strong — typed variants support poisoning/type-aware handling** | **Strong — new memory "types" addable without schema upheaval** | **Strong — `evidenceVersionId` slots in exactly as PI Core's does** | Compatible — version-scoped, matches existing `appendLifecycleVersion` | Neutral now, extensible later | Low-moderate — same shape already proven twice in this repo | **Lowest — reuses proven pattern, no new architecture invented** | **Lowest — this repository already has the pattern; Memory's existing metadata fields need no change, only additions** | None | **Strong — demonstrably consistent with the repository's own established conventions** |
| **D — Proposition/fact-oriented model** (subject–predicate–object or similar) | Memory as atomic structured propositions | Strong for FIS-045's "lessons/patterns" framing specifically, but no document requires this level of formality | Moderate — powerful but more than current evidence demands | Potentially strong for future reasoning engines, but speculative | Strong in theory | Compatible | Compatible | Neutral | **Highest — no precedent anywhere in this repository** | **Highest — invents structure with no evidenced requirement** | High if adopted later after simpler model ships | None | Speculative — not demonstrated by existing repository patterns |

No model is selected as final. **Model C is the strongest evidence-
supported candidate** (see §7) precisely because it is not a new
invention — it is the same pattern this repository has already built,
tested, and had Founder-adjacent governance approve twice (PI Core,
Personal State).

---

## 7. Recommendation

The evidence is strong enough to recommend a **direction**, not a final
schema: **Model C — a common envelope (Memory's existing metadata,
unchanged) plus a typed content addition mirroring
`PersonalIntelligenceClaimVersion`'s `valueKind`/`valueText` pair and
`evidenceVersionId` reference** — is the best-evidenced starting point
for a future ADR to formalize. This is a recommendation for the *shape of
the next decision*, not a decision itself: the exact type taxonomy (would
Memory reuse `PersonalIntelligenceValueKind`, or need its own, given
FIS-045's situational/navigational framing is distinct from PI Core's
attribute framing?) is explicitly **not** resolved here.

---

## 8. Founder Decision Required

The exact decision the Founder would eventually need to make (in a
future, separate ADR):

1. Whether Memory's content model should follow the PI-Core-precedent
   shape (Model C) or a different candidate (§6).
2. If Model C: whether Memory needs its own type taxonomy (distinct from
   `PersonalIntelligenceClaimType`) or could reuse/adapt an existing one.
3. Whether `evidenceVersionId`-style Evidence referencing should be part
   of the initial content-model decision or deferred further.
4. Whether this content-model decision should be scoped narrowly (schema
   only) or bundled with the deferred PI Core/AI-consumption boundary
   questions (Contract §17) — this investigation recommends **narrow
   scoping**, consistent with this repository's established pattern of
   one decision per gate (ADR-002 before ADR-003, Contract before Build
   Authorization, etc.).

---

## 9. Not Authorized

This document does **not** authorize, and none of the following may be
inferred from it:

- Any Memory schema or migration change.
- Any modification to `memory-record.model.ts`, `memory.use-case.ts`,
  `memory.repository.ts`, or any other Memory implementation file.
- Any modification to Evidence, Personal State, or Personal Intelligence
  Core files (read for comparison only).
- Any controller, API route, or Web/UI work.
- Any PI Core ↔ Memory or Evidence ↔ Memory wiring.
- Any AI consumption of Memory.
- Any Increment Contract.
- Any modification to existing ADRs, Architecture Freeze, Master
  Architecture, Roadmap, or GOV-02/GOV-04.
- Selection of Model C (or any model) as final — it is a recommendation
  for a future ADR to formalize or reject, not a Founder-approved choice.

---

## 10. Six-Criteria DECIVEXA Review

1. **Vision Alignment** — *Evidence:* Master Architecture §24 and TD-04
   §4 both require distinguishing fact/inference/observation types.
   *Interpretation:* Model C directly serves this; Model A would not.
   *Risk:* none from investigating; risk would arise from later
   implementing Model A. *Recommendation:* favor Model C's direction in
   the future ADR.
2. **Long-Term Architecture Strength** — *Evidence:* the same
   envelope-plus-typed-value shape already exists twice in this
   repository (§2.3, §2.4). *Interpretation:* reusing it lowers future
   migration risk. *Risk:* none identified. *Recommendation:* prefer
   proven patterns over novel ones (Model D) absent stronger evidence.
3. **Improvement Opportunities** — *Evidence:* TD-07 remains "Proposed,"
   never formally accepted. *Interpretation:* a future content-model ADR
   could also formally accept or supersede TD-07. *Risk:* none — an
   opportunity only. *Recommendation:* not executed here.
4. **User Input Burden vs. System Value** — *Evidence:* no user-facing
   capability exists yet (confirmed in the prior gate report).
   *Interpretation:* this investigation adds no burden; a well-chosen
   content model later reduces the risk of a burdensome redesign.
   *Risk:* none. *Recommendation:* none needed at this stage.
5. **AI Capability** — *Evidence:* TD-04 §21 and Master Architecture §24
   both tie future AI usefulness to typed, poisoning-resistant content.
   *Interpretation:* Model C's typed structure is the more AI-ready
   direction of the four candidates. *Risk:* Model A would under-serve
   future AI capability if adopted later. *Recommendation:* weight this
   criterion toward Model C in the future decision.
6. **Trusted Reference Platform** — *Evidence:* this investigation itself
   traces every claim to a specific file/section, per this session's
   established evidentiary discipline. *Interpretation:* the resulting
   document strengthens the repository's self-consistency by explicitly
   connecting Memory's design gap to existing, proven patterns rather
   than inventing new ones. *Risk:* none. *Recommendation:* none needed.

---

## 11. Relationship to Architecture Freeze

This investigation remained entirely within the frozen architecture. The
Freeze already lists "Memory Architecture" and "Integration & Evidence
Platform" as in-scope items (§2.10) and its own Rule 9 already provides
the authority for narrow content-model design work without reopening the
Freeze. **No conflict was found; the Freeze does not need to be reopened
for a future content-model ADR to proceed.**

---

## 12. Status

**INVESTIGATION COMPLETE. NOT FOUNDER-APPROVED. NOT IMPLEMENTATION-
AUTHORIZED.** The next step, if the Founder wishes to proceed, is a
narrow ADR selecting (or rejecting) a specific content-model direction
from §6/§7 — itself still not an implementation authorization, per this
repository's established two-step ADR pattern.
