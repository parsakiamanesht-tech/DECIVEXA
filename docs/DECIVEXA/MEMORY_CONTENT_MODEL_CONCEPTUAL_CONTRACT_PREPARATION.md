# DECIVEXA — Memory Content Model: Conceptual Contract Preparation

**Document type:** Decision-preparation artifact (not an ADR, not a
Technical Design document, not an Implementation Contract, not a schema).
**Naming status:** Non-numbered, unambiguous name — deliberately not an
"ADR-00N" or "TD-0N" filename, for the same reason recorded in
`docs/DECIVEXA/MEMORY_CONTENT_MODEL_DECISION_PROPOSAL.md`'s header (GOV-04
has not yet resolved the future ADR/TD naming convention; a bare numeric
identifier here would risk a further collision).
**Status:** PREPARATION ONLY — NOT FOUNDER-APPROVED. Builds on, but is
distinct from, the Founder-approved Model C **direction** (see §0).
**Date:** 2026-08-24.
**Authorizing instruction:** Founder Decision approving Model C's
direction, followed by an explicit instruction to prepare "the minimum
viable conceptual contract required to turn the approved Model C
direction into an implementation-ready schema decision" — preparation
only, not implementation.

---

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record.*

This document is preserved as a historical architectural/planning
record. At the time it was written, Memory's schema had not yet been
extended with a content/value representation. This document's C3-vs-C4
(unified vs. split content/reference) question, left genuinely open at
§2.2/§3/§5, was subsequently resolved as C3 (unified) in shipped code
(commits `11e8d0d`, `217170e`, `2b5157a`, `15627e5`) — a resolution this
document itself does not make and does not claim credit for. Shipped
implementation also introduced an intrinsic `userConfirmed: boolean`
field, consistent with this document's §2.3 gap analysis. The resolving
authorization for that implementation is not present in the surviving
repository documentation. This reconciliation does not fabricate or
reconstruct that missing authorization record and does not authorize
any new implementation. The current shipped Memory implementation must
be established from the actual committed source and commit history, not
inferred from this document.

---

## 0. What Is Already Founder-Approved vs. What This Document Proposes

**Founder-approved (prior decision, not reopened or altered here):**
Memory's content model should follow **Model C's direction** — a common
envelope (Memory's existing metadata fields, unchanged) plus a typed
value representation, informed by but architecturally independent from
PI Core's `PersonalIntelligenceClaimVersion` precedent.

**Not yet Founder-approved (this document's own content, and everything
in §6 "Explicit Unresolved Decisions"):** every specific conceptual
question analyzed below. This document narrows those questions with
evidence and interpretation; it does not resolve them on the Founder's
behalf, and its own creation is not an approval of anything it discusses.

---

## 1. Evidence (independently re-verified this task)

- **Current Memory model** (`apps/api/src/core/memory/memory-record.model.ts`):
  `MemoryRecord {id, userId, createdAt, updatedAt}`; `MemoryRecordVersion
  {id, recordId, version, userId, provenance, lifecycle, observedAt,
  acceptedAt, confidence, createdAt}`. `provenance` is currently binary
  (`"declared"|"observed"`); `lifecycle` is currently `"active"|
  "corrected"|"deleted"`. **No `sensitivity` field. No `user_confirmed`
  field. No content field.**
- **PI Core precedent** (`personal-intelligence-claim.model.ts`):
  `claimType` (9 variants, all **attribute-oriented**: identity_attribute,
  value, preference, capability, constraint, environment_context,
  strength, weakness, behavior_pattern); `valueKind` (`"text"|"boolean"|
  "enum"`); `valueText`; `evidenceVersionId: string | null`.
- **TD-04 §17 "Memory Contract"** (`docs/TD-04_DATA_RUNTIME_CONTRACTS.md`,
  Freeze-incorporated per the approved proposal's evidence chain):
  conceptual object with `memory_id`, `memory_type`, `content/reference`,
  `source`, `created_at`/`valid_time`, provenance/confidence/
  `user_confirmed?`, `sensitivity`/`last_verified`/review-policy,
  correction/supersession refs, lifecycle status.
- **TD-04 §4 "Evidence Model"** (`docs/architecture/TD-04-human-os-personal-intelligence-core.md`):
  six **epistemic-status** fact types (Explicit Fact, Observed Behavior,
  Derived Pattern, Inference, Prediction, User Correction) — a richer
  axis than Memory's current two-value `provenance`.
- **FIS-045 — Personal Navigation Memory** (`docs/FIS-REGISTRY.md`):
  Memory's named purpose is **situational/navigational** ("remember...
  navigation patterns and surface relevant lessons when current
  circumstances resemble prior situations") — a **subject-matter**
  axis, distinct from PI Core's attribute axis.
- **TD-07-MEMORY-PROVENANCE** (`docs/technical-design/TD-07-MEMORY-PROVENANCE.md`,
  status "Proposed technical contract"): requires source distinction,
  poisoning controls, and that *"Correction... MUST stop the incorrect
  memory from being treated as current truth while preserving necessary
  audit/history semantics."*
- **`docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md`** (top-level,
  Freeze-incorporated per `docs/ARCHITECTURE_FREEZE_BASELINE.md`'s
  "Frozen Source Gate: TD-02 through TD-06: approved gates" — a source
  not cited in this document's original version, added in this revision
  pass): lists Memory-relevant fields *"purpose; sensitivity; provenance;
  confidence; user confirmation state; recency/validity; access policy"*
  and states explicitly that *"An inferred memory must never be silently
  represented as a user-confirmed fact. Memory poisoning protections must
  support provenance inspection, correction, verification and removal."*
  This is a **higher-authority, more directly on-point source** than
  TD-04 §17 for the sensitivity/user-confirmation/provenance-separation
  findings in §2.3–§2.4 below, because it is (a) within the Freeze's
  named TD-02–TD-06 gate range and (b) states the epistemic-integrity
  rule explicitly rather than only listing field names. Status header:
  "DESIGN DRAFT / IMPLEMENTATION NOT AUTHORIZED... Depends on: TD-02,
  TD-03, TD-04, TD-05." Cited here as evidence only — no field or rule
  from this source is adopted into Memory's schema by this document.
- **`docs/technical-design/TD-06-AI-TRUTHFULNESS.md`** (distinct
  document, same "TD-06" numeric identifier as the executable-contract
  source above, different subject matter — AI truthfulness, not the
  Memory/Data/Runtime executable contract): a namespace collision,
  disclosed for governance completeness in §9 below. Not cited as
  Memory-content evidence; not modified; not resolved by this document.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §8** "PI Core
  Boundary Invariants": non-negotiable — Memory must not create, modify,
  extend, or reinterpret the PI Core claim model.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §17** "Deferred
  Decisions" (added in this revision pass): already lists **"Sensitivity/
  access-control classification mechanism"** as a previously deferred
  item for this exact module — i.e., the sensitivity gap identified in
  §2.3 below is not a newly discovered requirement; it was already known
  and already deferred before this document existed. This document does
  not resolve that deferral; it only re-surfaces it as relevant context.
- **Personal State precedent** (`personal-state-revision.model.ts`):
  `evidenceVersionId: string | null` — a second, independent instance of
  the optional-Evidence-reference pattern.
- **Memory's existing use-case** (`memory.use-case.ts`): `get`,
  `getVersion`, `create`, `appendLifecycleVersion` — correction/deletion
  is already implemented as a **lifecycle-state transition on a new
  version row**, not as a separate mechanism.

---

## 2. Architectural Interpretation

### 2.1 Two distinct taxonomic axes, not one

The evidence supports **two separate conceptual dimensions**, not a
single "type" field:

- **Subject-matter type** ("what kind of thing is remembered") — per
  FIS-045's situational/navigational framing and TD-04 §17's
  `memory_type`. This axis is **not** PI Core's `claimType` (which
  classifies personal *attributes*, not situations/events/lessons) —
  Memory's subject matter appears to need its **own** taxonomy, distinct
  from and not reusing PI Core's.
- **Value-encoding kind** ("how the value is technically represented") —
  per PI Core's `valueKind` (`text`/`boolean`/`enum`). This axis *can*
  plausibly be borrowed as a *pattern* (per the already-approved
  direction) without being PI Core's actual type.

Whether these two axes should be **one field or two** is not settled by
current evidence — see §6.

**Revision-pass correction (orthogonality is not established):** this
framing should not be read as claiming the two axes are cleanly
independent of every other dimension. TD-04 §4's six fact types
(Explicit Fact, Observed Behavior, Derived Pattern, Inference,
Prediction, User Correction) were cited above as evidence for a richer
"subject-matter" or classification axis, but several of them do not
describe subject matter at all — they describe **epistemic origin,
epistemic status, or correction state**, which is exactly what Memory's
*existing* `provenance` and `lifecycle` fields already partially encode
(e.g., "Observed Behavior"/"Inference" shade into `provenance:
"observed"` plus a confidence gradient; "User Correction" shades into
`lifecycle: "corrected"`). TD-04 §4's six types are therefore **not**
cleanly separable into a single new "subject-matter" axis distinct from
provenance/lifecycle/confidence — some of them look like refinements of
fields Memory already has. The correct, honest statement is: **the
relationship between subject-matter type, epistemic status/origin,
`provenance`, `lifecycle`, `confidence`, and user-confirmation requires
further schema-level analysis; the two-axis model above is
architecturally plausible, but its orthogonality from Memory's existing
fields is not yet established.** This document does not attempt that
analysis and does not select a final taxonomy; TD-04 §4's six types must
not be read as an implicit recommendation to adopt them as Memory's
taxonomy.

### 2.2 "content/reference" — a genuine, disclosed tension, not a settled lean

TD-04 §17 names the field `content/reference` (slash-joined), which
reads as one conceptual field whose value is *either* inline content
*or* a structured reference (e.g., to a Goal, an Evidence version, or
another record) — not two parallel fields. This is **evidence supporting
unification** (C3).

**Revision-pass correction (the original version of this document
presented C3 with more confidence than the full evidence base
supports):** the repository also contains a concrete, already-approved
precedent this document elsewhere leans on for the "informed by PI
Core" reasoning in §2.1 — `PersonalIntelligenceClaimVersion` — and that
precedent does **not** unify content and reference. It keeps them
structurally **separate**: `valueKind`/`valueText` (the content) is one
set of fields, `evidenceVersionId` (the reference) is a distinct,
independently-nullable field. This is **evidence supporting separation**
(C4), directly from the same precedent this document treats as
authoritative elsewhere.

**Architectural implication:** neither source alone authorizes a final
schema. TD-04 §17's conceptual sketch is a legitimate, independent,
Freeze-incorporated source that can reasonably favor unification even
against a PI Core stylistic precedent — but the precedent is real and
concrete, not merely stylistic noise, and the tension between the two
sources should not be silently resolved in either direction by this
document. **C3 vs. C4 remains a genuine open schema-level decision**, not
a near-settled lean toward C3. See §3–§5 for how this changes the
candidate evaluation and recommendation, and §6 item 3.

### 2.3 A concrete gap independent of the content question

**TD-04 §17 already specifies `sensitivity` and `user_confirmed?` as
part of Memory's conceptual object — Memory's current implementation has
**neither**.** This is a gap the content-model decision will need to
address regardless of which content representation is ultimately chosen
— i.e., "implementation-ready" per TD-04 §17 requires *more* than adding
content; it also requires eventually adding these two metadata fields.

**Revision-pass strengthening:** this gap is not resting on TD-04 §17
alone. `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` (§1,
evidence, added in this revision pass) independently requires
`sensitivity` and "user confirmation state" as distinct Memory-relevant
fields, and states explicitly that *"An inferred memory must never be
silently represented as a user-confirmed fact."* Because TD-06 sits
within the Freeze's named TD-02–TD-06 gate range and states the rule
directly (not just as a field-name list), this is **stronger, more
directly on-point corroboration** of the sensitivity/user-confirmation
gap than TD-04 §17 alone provided. The underlying architectural claim —
that provenance and user-confirmation are distinct, both real, both
required dimensions — is accordingly better supported after this
revision than the document's original version showed.

**Not a new requirement:** `docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md`
§17 "Deferred Decisions" already lists **"Sensitivity/access-control
classification mechanism"** as a previously deferred item for this exact
module (see §1, evidence, added in this revision pass). This gap is
therefore already known and already deferred — this document does not
discover a new requirement and does not un-defer it; it only re-surfaces
existing, already-recorded context as relevant background for the future
schema decision. See also §6 item 7.

This is analysis only; no field is added by this document, and the prior
PHASE_10Q_E §17 deferral remains unresolved and is not resolved here.

### 2.4 Provenance richness gap

TD-04 §4's six epistemic-status types (Explicit Fact / Observed Behavior
/ Derived Pattern / Inference / Prediction / User Correction) are richer
than Memory's current binary `provenance` (`declared`/`observed`).
Whether Memory's `provenance` should eventually be widened to match is a
genuinely open question — flagged, not resolved. Per the §2.1
revision-pass correction, several of these six types already overlap
conceptually with Memory's existing `provenance`/`lifecycle`/`confidence`
fields rather than describing a wholly independent new dimension; this
weakens the case for treating "provenance richness" as a clean,
free-standing gap and strengthens the case for treating it as one
symptom of the broader, unresolved taxonomy-overlap question raised in
§2.1.

**Revision-pass strengthening:** `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md`
(§1, added in this revision pass) independently requires `provenance` and
`confidence` as distinct Memory-relevant fields and states that Memory
poisoning protections must support "provenance inspection, correction,
verification and removal" — corroborating, from a higher-authority
source than TD-04 §4's architecture-track variant, that provenance must
remain a distinguishable, inspectable dimension regardless of how the
subject-matter/epistemic-status overlap above is eventually resolved.

### 2.5 Correction/supersession is already structurally present

Memory's existing `appendLifecycleVersion` mechanism (new version row +
lifecycle state) already satisfies TD-07's audit-preserving correction
requirement structurally. TD-04 §17's "correction/supersession refs" may
call for an *additional*, explicit "this version corrects version N"
reference beyond the implicit version sequence — a refinement question,
not a structural gap.

### 2.6 Boundaries (restated, not re-derived)

Memory, Evidence, and PI Core remain sibling primitives. No containment
in either direction. Any Evidence reference would be optional and
by-ID (per the twice-established repository pattern), never a merge of
models. PI Core's claim model is never extended, modified, or
reinterpreted by Memory (§8 invariant, restated from the approved
proposal, not reopened here).

---

## 3. Candidate Conceptual Models (content-representation level)

| Candidate | Description | Fits FIS-045/TD-04 §17 | Fits PI Core precedent | Complexity |
|---|---|---|---|---|
| **C1 — Single discriminator** | One `memory_type`-like field serves both subject-matter classification *and* value-encoding discrimination | Directly matches TD-04 §17's single `memory_type` field | Diverges from PI Core's two-field split | Lowest |
| **C2 — Two discriminators** | Separate `memory_type` (subject matter) and `valueKind`-style (encoding) fields | Requires reading TD-04 §17's single field as a simplification of two real concerns | Directly matches PI Core's two-field pattern | Moderate |
| **C3 — Unified content/reference field** | One field holding either inline value or a structured reference, discriminated by C1 or C2 | Directly matches TD-04 §17's `content/reference` naming | **Diverges** from PI Core's precedent, which keeps `valueKind`/`valueText` structurally separate from `evidenceVersionId` (see §2.2) | Low-moderate |
| **C4 — Split content vs. reference fields** | Separate fields for inline content and for a reference | Diverges from TD-04 §17's joined naming | **Matches** PI Core's precedent of separate value fields and a separate `evidenceVersionId` reference field (see §2.2) | Moderate |

**Revision-pass correction:** the "Fits PI Core precedent" column for C3
and C4 was reassessed — the original version of this document understated
C4's fit and overstated C3's. Per §2.2, PI Core's own precedent is a
**split-field** design, which favors C4 on that criterion, while TD-04
§17's naming favors C3 on the other criterion. **No candidate is
selected.** These are the concrete alternatives a future schema-level
decision would choose among, and C3 vs. C4 is a genuinely open question
between two real, conflicting pieces of evidence — see §2.2.

---

## 4. Trade-offs

- **C1 vs. C2:** C1 is simpler and matches TD-04 §17's literal wording;
  C2 matches the proven PI Core pattern more closely and separates two
  genuinely different concerns (what is remembered vs. how the value is
  encoded), which may age better as Memory's subject-matter taxonomy
  grows independently of any encoding concerns.
- **C3 vs. C4 (revision-pass correction — this is a genuine open
  tension, not a lean toward C3):** C3 matches TD-04 §17's naming and
  avoids a field that is usually null (a reference-only memory would
  leave a content field empty, and vice versa); C4 matches PI Core's own
  concrete precedent (§2.2) — separate value and reference fields — is
  more explicit, and may be easier to validate/type-check per-case, at
  the cost of two fields where one often suffices. Both sources are real
  and neither is subordinate to the other by default; this document does
  not weigh one source as decisive over the other.
- **Provenance widening (§2.4):** widening now would align fully with
  TD-04 §4 but expands scope beyond "adding content"; leaving it as-is
  keeps the change minimal but leaves a known gap against TD-04 §17's own
  fuller framework.
- **Sensitivity/user_confirmed (§2.3):** these are not part of the
  content-model question at all, but any future schema-level Contract
  that claims TD-04 §17 compatibility will need to address them
  eventually, regardless of which content candidate (C1-C4) is chosen.

---

## 5. Recommended Direction (where evidence supports one)

**Revision-pass correction:** the original version of this section
recommended "C2 + C3" as a combined direction with more confidence than
the evidence supports. The C2 half and the C3 half do not carry equal
evidentiary weight, and they should not be presented together as one
settled recommendation.

- **C2 (two discriminators)** remains evidence-consistent as an
  *investigation input*: separating subject-matter type from
  value-encoding kind matches the proven PI Core precedent pattern and
  allows Memory's own subject taxonomy to evolve independently — though
  per §2.1's revision-pass correction, whether "subject-matter type"
  is itself cleanly separable from provenance/lifecycle/confidence is
  not yet established, which qualifies how much weight C2 alone can
  bear.
- **C3 (unified content/reference field)** is **not** recommended with
  the confidence the original version implied. Per §2.2 and §3, C3 is
  matched by TD-04 §17's naming but directly **contradicted** by PI
  Core's own concrete precedent, which favors C4 (split fields). **C3
  vs. C4 remains a genuine open schema-level decision**, not a
  near-settled lean toward C3.

Taken together, this document offers **C2** as an evidence-consistent
input to the future schema decision, while explicitly declining to
recommend either C3 or C4 as more supported than the other. Neither is
selected as final, and both the C2 question and the C3-vs-C4 question
remain subject to the future Founder-controlled schema decision (§6,
§11).

---

## 6. Explicit Unresolved Decisions

1. Whether Memory needs its own subject-matter taxonomy, and — if so —
   its exact values (§2.1; only the *existence* of the need is
   evidence-supported here, not the taxonomy itself).
2. Whether subject-matter type and value-encoding kind should be one
   field (C1) or two (C2).
3. Whether content/reference should be unified (C3) or split (C4).
4. Whether `evidenceVersionId`-style linkage belongs in the initial
   schema — the precedent exists and is compatible with every candidate
   above, but inclusion is not decided here.
5. Whether Memory's `provenance` should be widened toward TD-04 §4's
   six-type framework.
6. Whether an explicit "corrects/supersedes version N" reference should
   be added alongside the existing implicit version sequence.
7. Whether and how `sensitivity` and `user_confirmed` (named by TD-04
   §17 and independently by TD-06's executable contract — see §1, §2.3 —
   absent from the current implementation) should be added — a question
   independent of the content-model decision but relevant to full TD-04
   §17/TD-06 compatibility. **Not a new question:** `PHASE_10Q_E` §17
   already lists "Sensitivity/access-control classification mechanism"
   as a previously deferred decision for this module; this item remains
   deferred and is not resolved, un-deferred, or reopened by this
   document (§2.3).
8. Every item already listed as unresolved in the approved proposal:
   exact field names, exact types, migration, PI Core/Evidence/Web/AI
   consumption, privacy/sensitivity *implementation*, and any Increment
   Contract.

---

## 7. Six-Criteria DECIVEXA Review

1. **Vision Alignment** — *Evidence:* the C2 input (§5) directly serves
   TD-04 §4's fact-type distinction and FIS-045's situational framing,
   subject to the §2.1 revision-pass caveat that the two-axis
   orthogonality is not yet established. *Interpretation:* the
   two-discriminator direction aligns better than a single collapsed
   field, though its exact boundaries remain open. *Risk:* none from
   further preparation. *Recommendation:* the future schema decision
   should weigh the two-axis distinction while resolving the
   orthogonality question raised in §2.1.
2. **Long-Term Architecture Strength** — *Evidence:* separating
   subject-matter from encoding (C2) avoids conflating two concerns that
   may evolve at different rates. *Interpretation:* lower long-term
   coupling risk than a single collapsed field (C1). *Risk:* C2 is
   marginally more complex now for a benefit realized later.
   *Recommendation:* weigh this trade-off explicitly in the schema
   decision, not silently default to the simpler option.
3. **Improvement Opportunities** — *Evidence:* §2.3/§2.4 identify two
   concrete gaps (sensitivity/user_confirmed; provenance richness)
   independent of the content question. *Interpretation:* worth
   including in scope discussion for the future schema Contract.
   *Risk:* none — opportunities only. *Recommendation:* not executed
   here.
4. **User Input Burden vs. System Value** — *Evidence:* no product
   surface exists; this document adds no user-facing change.
   *Interpretation:* no burden impact. *Recommendation:* none needed.
5. **AI Capability** — *Evidence:* TD-07's poisoning-resistance
   requirement, TD-04 §4's fact-type distinctions, and (added in this
   revision pass) TD-06's explicit rule that *"An inferred memory must
   never be silently represented as a user-confirmed fact"* and its
   requirement that poisoning protections support "provenance
   inspection, correction, verification and removal" all depend on
   typed, provenance-rich, user-confirmation-distinguishable content
   existing before any AI consumption could be trustworthy.
   *Interpretation:* this preparation moves toward that prerequisite
   without authorizing AI consumption; TD-06 is the strongest and most
   direct of the three sources on this point. *Risk:* none — no AI
   wiring proposed. *Recommendation:* preserve typing, provenance
   richness, and the provenance/user-confirmation distinction through the
   eventual schema.
6. **Trusted Reference Platform** — *Evidence:* every claim above traces
   to a specific, re-verified source. *Interpretation:* narrowing options
   with evidence (rather than jumping to a schema) keeps the record
   honest about what remains genuinely open. *Risk:* none.
   *Recommendation:* none needed.

---

## 8. Architecture Freeze Check

No Freeze modification is required or implied. TD-04 and TD-06
(top-level) are both already within the Freeze's "Frozen Source Gate"
range (added in this revision pass: TD-06's executable-contract fields
and rule, §1/§2.3/§2.4); this document only analyzes their existing
content further — it does not alter TD-04, TD-06, TD-07, Master
Architecture, or the Freeze itself. No conflict was found between
TD-04's and TD-06's requirements, or between either source and this
document's C2 input or its explicitly unresolved C3-vs-C4 question
(§5), and any frozen principle.

---

## 9. Governance Check

- GOV-02 and GOV-04 are not reopened.
- The disclosed TD-04 namespace collision (three "TD-04" files, recorded
  in `docs/DECIVEXA/MEMORY_CONTENT_MODEL_DECISION_PROPOSAL.md` §2) is
  **not** re-resolved or touched here; this document continues to cite
  only `docs/TD-04_DATA_RUNTIME_CONTRACTS.md` (the Freeze-incorporated
  variant) and `docs/architecture/TD-04-human-os-personal-intelligence-core.md`
  (cited for its distinct §4 content), exactly as the approved proposal
  already did.
- **Newly disclosed TD-06 namespace collision (added in this revision
  pass, for governance completeness only — not resolved here):** two
  distinct repository documents share the "TD-06" numeric identifier —
  (1) `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` (top-level,
  Freeze-incorporated, cited as evidence in §1/§2.3/§2.4/§7/§8 of this
  document) and (2) `docs/technical-design/TD-06-AI-TRUTHFULNESS.md`
  (a different subject — AI truthfulness — not cited as evidence
  anywhere in this document). These are distinct files with different
  subject matter that happen to share a numeric identifier — the same
  pattern already recorded for TD-02 and TD-04 elsewhere in this
  governance arc. **This document does not resolve the collision.**
  Neither TD-06 file has been renamed, merged, deleted, or normalized by
  this task. GOV-02 and GOV-04 remain exactly as previously recorded and
  are not reopened or expanded to formally cover this instance by this
  document — the disclosure is informational only, for a future
  governance step (if any) to take up.
- No existing ADR, Architecture Freeze, Master Architecture, Roadmap,
  TD-04, or TD-06/TD-07 file was modified to produce this document.
- No numbered ADR or TD filename was created.

---

## 10. Founder Authority Boundary

- **This document does not constitute Founder approval of anything it
  discusses.** Only Model C's direction (§0) is Founder-approved, from
  the prior, separate decision.
- This document does **not** authorize: a final schema; exact field
  selection; a final taxonomy; `evidenceVersionId` inclusion; Memory ↔
  Evidence or Memory ↔ PI Core integration; Web/API exposure; AI
  consumption; privacy/sensitivity implementation; migration; any
  controller, API route, or Web/UI change; any Increment Contract; or
  any implementation of any kind.
- Architecture Freeze, Master Architecture, and Roadmap remain unchanged
  and are not proposed for change.
- GOV-02 and GOV-04 remain exactly as previously recorded; the TD-04
  collision remains disclosed and unresolved. The newly disclosed TD-06
  collision (§9) is likewise disclosed and unresolved, not formally
  incorporated into GOV-04's scope by this document.
- This document does not select between C3 and C4 (§2.2, §3, §5); that
  choice remains a genuine open schema-level decision for the future
  Founder-controlled schema gate.

---

## 11. Exact Decision Required Next

A future, separate Founder decision (schema-level, likely the actual
Implementation Contract's content-model section) would need to resolve
the eight items in §6 — most centrally: **(a)** one field or two for
subject-matter-type vs. value-encoding-kind (C1 vs. C2), and **(b)**
unified vs. split content/reference (C3 vs. C4) — before any Memory
schema, migration, or implementation work could begin. That decision is
not made here and is not implied by this document's existence.

---

## 12. Status

**PREPARATION COMPLETE. NOT FOUNDER-APPROVED BEYOND THE ALREADY-APPROVED
MODEL C DIRECTION.** No further action follows from this document's
creation.
