# DECIVEXA — Memory Schema Contract Preparation

**Document type:** Schema Contract Preparation (not an ADR, not a
Technical Design document, not an Implementation Contract, not a physical
schema, not a migration).
**Naming status:** Non-numbered, unambiguous name — same GOV-04-pending
reasoning as its predecessors
(`MEMORY_CONTENT_MODEL_DECISION_PROPOSAL.md`,
`MEMORY_CONTENT_MODEL_CONCEPTUAL_CONTRACT_PREPARATION.md`,
`MEMORY_SCHEMA_CONCEPTUAL_DECISION.md`).
**Date:** 2026-08-24.
**Authorizing instruction:** Founder Authorization — "MEMORY SCHEMA
CONTRACT PREPARATION GATE" — determining whether the approved conceptual
model can be translated into a precise, implementation-independent
Schema Contract specification.

---

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record.*

This document is preserved as a historical architectural/planning
record. At the time it was written, Memory's schema had not yet been
extended with a content/value representation. This document's §13
Contract Completeness Matrix marks every row "Implementation
Authorization: Not authorized" and leaves the exact value-kind enum, the
internal value representation, and the `user_confirmed` type/default
explicitly undecided (§14) — these were subsequently resolved and
shipped (commits `11e8d0d`, `217170e`, `2b5157a`, `15627e5`), superseding
this document's central "not yet implementation-ready" conclusion (§18).
The resolving authorization for that implementation is not present in
the surviving repository documentation, and this reconciliation does not
claim this document authorized those specific implementation choices.
This reconciliation does not fabricate or reconstruct that missing
authorization record and does not authorize any new implementation. The
current shipped Memory implementation must be established from the
actual committed source and commit history, not inferred from this
document.

---

## 1. Status and Authority

- This is a **Schema Contract Preparation**, one level more precise than
  `MEMORY_SCHEMA_CONCEPTUAL_DECISION.md`'s conceptual decisions, and one
  level less precise than an Implementation Contract or physical schema.
- The starting point is the **already-decided conceptual baseline**
  (Decisions A–D of `MEMORY_SCHEMA_CONCEPTUAL_DECISION.md`, restated in
  §2 below). This document does not reopen those decisions; it makes them
  precise enough to see what a future schema would need to satisfy.
- **This document itself does not authorize implementation.** No
  TypeScript, no Drizzle schema, no SQL, no migration is written anywhere
  below. Where a structural shape is described, it uses labelled,
  illustrative pseudo-fields only (§3), explicitly not adopted as a
  physical or code-level schema.
- Exact implementation — field names as code identifiers, exact scalar/
  union types, migrations, validation logic — remains separately gated,
  per §17.

---

## 2. Conceptual Contract

**Memory = common envelope + typed value + unified content/reference +
provenance/lifecycle/confidence semantics + distinct user-confirmation
state.**

- **Common envelope** — Memory's existing, unchanged metadata shape: a
  parent record (`MemoryRecord`: id, owner, timestamps) and an
  append-only version sequence (`MemoryRecordVersion`), confirmed
  unmodified this task against `memory-record.model.ts` and
  `memory.schema.ts`. This is not renegotiated here.
- **Typed value** — Model C's Founder-approved core addition: each
  version carries a value, discriminated by a value-encoding kind
  (Decision A, §4 below), independently declared from PI Core's
  `valueKind` (never shared, per `PHASE_10Q_E` §8/§10).
- **Unified content/reference** — the value itself is represented as one
  conceptual slot capable of holding either inline content or a
  structured reference (Decision B, §5 below), not two parallel fields.
- **Provenance/lifecycle/confidence semantics** — Memory's three
  existing metadata fields remain the epistemic backbone; TD-04 §4's six
  fact-types are not adopted as a new axis (Decision A) — they decompose
  across these three fields plus user-confirmation.
- **Distinct user-confirmation state** — a required, independent
  dimension (Decision D.2, §7 below), preventing the specific
  poisoning failure TD-06 §13 names: an inferred memory silently read as
  user-confirmed.

Each component is elaborated with its contract semantics in §4–§11.

---

## 3. Proposed Structural Shape (illustrative, contract-level only)

**These are labelled contract fields for precision, not a schema.** No
field below is a TypeScript type, a Drizzle column, or a SQL definition.
Existing fields are restated as-is (confirmed against `memory-record.model.ts`
and `memory.schema.ts` this task); new fields are conceptual additions
whose exact code-level shape remains undecided.

### 3.1 Envelope (parent record) — unchanged

| # | Conceptual name | Semantic meaning | Required/optional | Nullability | Owns meaning | Relates to | Status |
|---|---|---|---|---|---|---|---|
| 1 | `record_id` | Stable identity of a Memory | Required | Not null | Memory itself | Parent of all versions | Decided (existing) |
| 2 | `owner` | Owning user (existing `userId`) | Required | Not null | Identity/ownership boundary | Scopes retrieval | Decided (existing) |
| 3 | `created_at` / `updated_at` | Envelope timestamps | Required | Not null | Envelope | — | Decided (existing) |

### 3.2 Version (per-version record) — existing + new

| # | Conceptual name | Semantic meaning | Required/optional | Nullability | Owns meaning | Relates to | Status |
|---|---|---|---|---|---|---|---|
| 4 | `version` | Monotonic version number | Required | Not null | Envelope/version sequence | Ordering, `appendLifecycleVersion` | Decided (existing) |
| 5 | **`value_kind`** *(new)* | Structural/value-encoding discriminator (§4) | Required if a value exists | Not null once present | The value itself | Governs how `value` (6) is interpreted | **Decided as a concept; exact enum DEFERRED** |
| 6 | **`value`** *(new)* | The unified content-or-reference slot (§5) | Optional at the envelope level; if Model C's value addition is adopted, required per version | Nullable only if a version can legitimately carry no value (open, §14) | The Memory's substance | Discriminated by `value_kind` (5); orthogonal to (8)–(11) | **Decided as unified; internal representation DEFERRED** |
| 7 | `provenance` | Existing `declared`/`observed` origin | Required | Not null | Origin-of-record semantics | Independent of (10) user-confirmation | Decided (existing, unwidened) |
| 8 | `confidence` | Existing graded certainty score | Optional | Nullable (existing) | Certainty magnitude | Independent of (7) and (10) | Decided (existing, unchanged) |
| 9 | `lifecycle` | Existing structural standing | Required | Not null (has default) | Record's current standing | Independent of epistemic dimensions | Decided (existing `active`/`corrected`/`deleted`; extensions open, §8) |
| 10 | **`user_confirmed`** *(new)* | Distinct trust flag (§7) | Conceptually required as a dimension; default value open | Nullability/tri-state open | Human-validated trust | Independent of (7), (8), (9) | **Decided as a concept; exact type/default DEFERRED** |
| 11 | `observed_at` / `accepted_at` | Existing temporal fields | Required | Not null | Temporal provenance | — | Decided (existing, unchanged) |

**Deliberately absent from this table** (per Decisions C/D and the
governing instruction not to smuggle deferred items into a schema
requirement): a subject-matter/`memory_type` field, a `sensitivity`
field, and an `evidenceVersionId`-style field. Their conceptual status is
addressed in §9–§11 and the completeness matrix (§13); no pseudo-field is
proposed for any of them.

---

## 4. Value-Encoding Kind Contract

- **What it discriminates:** the *structural shape* of `value` (6) — e.g.
  whether it holds a text-like scalar, a boolean-like scalar, an
  enum-like scalar, or a reference-like pointer. It is a type-system
  concern only.
- **What it does NOT discriminate:** subject matter (what the memory is
  *about* — deferred, §14 item 3); epistemic status/origin (that is
  `provenance`); correction state (`lifecycle`); trust (`user_confirmed`).
- **Why independent from provenance:** a `text`-shaped value can be
  either `declared` or `observed`; the shape does not change based on how
  the information entered the system.
- **Why independent from lifecycle:** the shape of a value does not
  change when its lifecycle transitions from `active` to `corrected`; a
  correction creates a new version, which may reuse or change the shape,
  but the two concepts vary independently.
- **Why independent from user confirmation:** a value's shape is fixed at
  creation regardless of whether a human later confirms or disputes its
  truth.
- **Why not PI Core's taxonomy:** PI Core's `valueKind`
  (`"text"|"boolean"|"enum"`) is used only as an architectural *pattern*
  reference (Founder-approved: "informed by, not identical to"). Memory
  must declare its own, independently-typed discriminator, sharing no
  type, interface, or table with PI Core's (`PHASE_10Q_E` §8, §10).
- **Minimum conceptual variants actually supported by evidence:** the
  repository evidence base supports, at minimum, a distinction between
  **inline scalar content** and **reference** (this much is required by
  Decision B's unification — something must tell a consumer which case
  applies). Beyond that binary, no source enumerates specific scalar
  sub-kinds (text vs. boolean vs. enum vs. other) for Memory specifically
  — PI Core's three-way split is a *pattern*, not evidence of Memory's
  own required variants.
- **Exact enum: DEFERRED.** Per the governing instruction not to invent
  an exhaustive enum for completeness, this document defines the
  discriminator's *contract* (it must exist, must be independent, must at
  minimum distinguish inline-content from reference) without fixing its
  values. See §14 item 3.

---

## 5. Content / Reference Contract

Answering the ten required questions directly:

1. **Can Memory contain inline content?** Yes — this is the "content"
   half of the unified slot (Decision B), required by Model C's core
   addition.
2. **Can Memory represent a reference?** Yes — the "reference" half,
   equally supported by TD-04 §17 and TD-06 §3's identical
   `content/reference` naming.
3. **Can the representation evolve between those forms?** Not decided at
   this contract level. A correction (new version, per `lifecycle`)
   could plausibly change a memory from content-bearing to
   reference-bearing or vice versa, but whether that is permitted,
   forbidden, or requires a distinct mechanism is unresolved — flagged in
   §14 item 6, not invented here.
4. **Does the representation itself imply Evidence?** **No.** The unified
   slot is general-purpose. Neither TD-04 §17 nor TD-06 §3 names Evidence
   specifically as the reference target. This document does **not**
   create an Evidence-linkage field (per Decision C, restated in §11).
5. **Can a Memory reference non-Evidence material?** Yes, conceptually —
   a Goal, another Memory, or external/derived material are all
   evidence-consistent candidate targets (carried forward from the
   conceptual decision's §6.1 reasoning); which targets are actually
   supported is schema-level and undecided.
6. **How does provenance interact with the reference?** Orthogonal.
   `provenance` describes how the record entered the system regardless of
   whether its value is inline content or a reference; a reference can be
   `declared` (a user explicitly points at something) or `observed`
   (the system infers a relevant pointer) exactly as content can.
7. **How does lifecycle/correction interact with the reference?**
   Structurally handled the same as content: per the existing
   `appendLifecycleVersion` mechanism, a correction creates a new version
   row; whether a corrected reference must point to the same target class
   as the version it corrects is unresolved (§14 item 6).
8. **What happens if a reference becomes unavailable?** Not decided.
   No source in the evidence base specifies dangling-reference behavior
   for Memory. This is explicitly deferred as an open question (§14 item
   6) rather than invented — inventing availability/error semantics here
   would exceed this gate's evidence-bound scope.
9. **Does the unified representation require a second internal
   discriminator?** Plausibly yes at the schema level (something must
   distinguish "this instance is content" from "this instance is a
   reference," and — if references are eventually typed by target — a
   further discriminator for target type), but per §4, the exact
   discriminator values are deferred; whether the value-encoding-kind
   discriminator (§4) fully serves this purpose or a second, narrower
   discriminator is needed is left open (§14 item 3).
10. **Minimum necessary deferral:** the *existence and unification* of
    content/reference is decided (Decision B); everything about *how*
    the reference case is typed, targeted, validated, or resolved when
    unavailable is deferred to the future Implementation Contract.

**No Evidence linkage field is created by this contract.**

---

## 6. Provenance Contract

Explicitly distinguishing the five concepts, per the governing
instruction:

- **Provenance** — how the record's information *entered* the system:
  currently `declared` (user-supplied) or `observed` (system-observed).
  Confirmed unchanged in `memory.schema.ts`'s check constraint
  (`provenance in ('declared','observed')`).
- **Epistemic status** — TD-04 §4's richer six-type framing (Explicit
  Fact / Observed Behavior / Derived Pattern / Inference / Prediction /
  User Correction). Per the conceptual decision (Decision A), this is
  **not** adopted as Memory's provenance vocabulary or as any new field —
  it decomposes across provenance, lifecycle, confidence, and
  user-confirmation. This contract does not silently expand `provenance`'s
  existing two-value vocabulary.
- **Confidence** — a separate, graded certainty score (§9).
- **User confirmation** — a separate, discrete human-trust flag (§7),
  never inferable from provenance alone.
- **Lifecycle** — the record's structural standing (§8), independent of
  all of the above.

**If widening `provenance` beyond `declared`/`observed` is ever
necessary, it is marked here as a separate future decision** — not
addressed, not scoped, not implied by this document (carried forward
unchanged from the conceptual decision's §5.2/§11 item 2).

---

## 7. User-Confirmation Contract

- **Distinct semantic dimension**, confirmed as required by Decision D.2:
  whether a human has explicitly validated a specific value, independent
  of how that value entered the system.
- **Anti-poisoning invariant preserved exactly as TD-06 §13 states it:**
  *"An inferred memory must never be silently represented as a
  user-confirmed fact."* This contract requires that whatever mechanism
  eventually represents user-confirmation must not default to "confirmed"
  merely because a value exists, and must not be derivable by inference
  from `provenance` or `confidence` alone.
- **Explicit distinctions required by this contract:**
  - *System inference* — a value the system produced or derived without
    direct user assertion (structurally closest to `provenance: "observed"`
    at low-to-moderate `confidence`, but not identical to either).
  - *Observed information* — a value captured from an observed signal,
    not necessarily inferred (`provenance: "observed"`).
  - *Declared information* — a value the user directly stated
    (`provenance: "declared"`).
  - *User confirmation* — a **separate, subsequent** act: the user
    validating a specific value's truth, regardless of whether it was
    originally declared, observed, or inferred. These four are not
    collapsed into one another anywhere in this contract.
- **No AI implementation is introduced.** This contract states the
  epistemic-integrity requirement that any future AI consumption would
  need to respect; it does not wire, design, or authorize AI consumption.
- **Not decided here:** the exact type (boolean vs. tri-state
  unconfirmed/confirmed/disputed), default value, or storage shape of
  `user_confirmed` — see §14 item 4.

---

## 8. Lifecycle Contract

- **Conceptually required, evidenced today:** `active`, `corrected`,
  `deleted` — confirmed as the exact current implementation and database
  check-constraint values (`memory.schema.ts`:
  `lifecycle in ('active','corrected','deleted')`). This contract does
  not alter them.
- **Evaluated, not adopted:**
  - `superseded` — conceptually plausible (PI Core's own lifecycle
    includes it), but not evidenced as required for Memory specifically
    by any Memory-scoped source (`TD-04` §17, `TD-06` §3, `PHASE_10Q_E`);
    `PHASE_10Q_E` §10 explicitly declines to assume PI Core's lifecycle
    set transfers automatically. **Not adopted.**
  - `invalidated` — no source names this concept for Memory. **Not
    adopted.**
  - `expired` — TD-04 §17 lists a "review/expiration policy" and TD-06
    §3 lists `review_status`/`expiration?` as *separate* concerns from
    `lifecycle` itself (they sit alongside `lifecycle`, not as an
    additional lifecycle value in either source's field list).
    **Conceptually distinct from `lifecycle`, not folded into it here;**
    whether Memory needs an expiration mechanism at all remains
    unaddressed by this contract (out of both this gate's and
    `PHASE_10Q_E`'s current scope).
- **Conceptually required vs. implementation-level enum choice:**
  the *requirement* that lifecycle distinguish at minimum
  active-vs-corrected-vs-deleted is decided (matches current
  implementation exactly); whether additional values are ever added is an
  implementation-level enum choice requiring its own future evidence,
  not decided here.

---

## 9. Confidence Contract

- **What confidence means:** a graded, typically system-computed
  certainty score describing how strongly the system believes a value is
  accurate — confirmed as the existing `confidence: number | null` field,
  unchanged.
- **What confidence does not mean:** it is not a substitute for
  user-confirmation (§7) — a high-confidence value can be entirely
  unconfirmed by a human, and a user-confirmed value's confidence is not
  automatically maximal. It is not provenance (§6) — origin and certainty
  are independent. It is not a security/sensitivity signal (§10).
- **Required or optional:** optional — confirmed nullable in both the
  current model (`confidence: number | null`) and schema (`real("confidence")`,
  no `.notNull()`). This contract does not change that.
- **Applies to all Memory content?** Structurally yes (it is a
  version-level field, present regardless of `value_kind`), but whether
  every value *kind* meaningfully supports a confidence score (e.g., a
  pure reference vs. inline content) is not evaluated here — left as an
  implementation-level question.
- **Does user confirmation change confidence?** Not decided. Plausible
  that confirmation could influence a future confidence-computation
  process, but this contract does not specify any such interaction — no
  scoring system or numerical semantics are introduced, per the governing
  instruction.
- **Does provenance change confidence?** Not decided; no source specifies
  a formula linking the two. Both remain independently-set fields.

---

## 10. Sensitivity Contract

- **Importance acknowledged:** every Memory-scoped source that lists
  fields at all (`TD-04` §17, `TD-06` §3, `TD-06` §13) includes
  `sensitivity` — its conceptual importance is not in question.
- **TD-06 and TD-04 requirements preserved:** TD-06 §13 governs Memory
  retrieval partly by "sensitivity"; TD-04 §17 lists `sensitivity` in its
  conceptual Memory object. Both are restated as unresolved requirements,
  not implemented.
- **`PHASE_10Q_E` §17 deferral preserved:** "Sensitivity/access-control
  classification mechanism" remains an explicit Deferred Decision, and §7
  lists "Sensitivity/privacy classification scheme" as a Non-Goal — this
  contract does not reopen either.
- **This document does NOT select a sensitivity taxonomy.** No levels, no
  values, no classification scheme are proposed anywhere above (§3's
  structural table deliberately contains no `sensitivity` pseudo-field).
- **No access-control implementation is defined.** This contract
  acknowledges sensitivity as a real, deferred dimension and stops there.

---

## 11. Evidence Linkage Contract

- **Memory may conceptually have references** (§5) — the unified
  content/reference slot can, in principle, hold a pointer to many kinds
  of target.
- **A reference does not automatically mean Evidence.** Neither TD-04
  §17 nor TD-06 §3 names Evidence as the reference target; treating
  "reference" as inherently Evidence-specific would silently resolve
  Decision C through Decision B's field, which this contract explicitly
  refuses to do (carried forward from the conceptual decision, §7.1/§6.2).
- **No `evidenceVersionId` field is adopted.** Confirmed absent from
  §3's structural table by deliberate design, not omission.
- **The Memory ↔ Evidence relationship requires a separate future gate.**
  This contract does not implement, specify, or partially design that
  relationship — consistent with `PHASE_10Q_E` §7/§17's existing Non-Goal.

---

## 12. Required Invariants

Non-negotiable conceptual invariants this contract preserves (verified
against §3–§11 above):

1. Memory must carry meaningful content/value semantics — satisfied by
   `value`/`value_kind` (§3, §4, §5).
2. Memory must not be an undifferentiated AI context bucket — no AI
   wiring is introduced anywhere in this document; typed value and
   epistemic separation (§4, §6, §7) are prerequisites, not
   implementations, of future trustworthy AI consumption.
3. Value-encoding kind must not become a subject-matter taxonomy — §4
   explicitly excludes subject matter from what `value_kind` discriminates.
4. Provenance must not be silently conflated with user confirmation — §6,
   §7 keep them explicitly distinct with worked examples.
5. Inferred memory must never silently become user-confirmed — §7 states
   TD-06 §13's rule verbatim as a binding contract requirement.
6. Lifecycle must remain distinct from epistemic status — §8 keeps
   `lifecycle` scoped to structural standing only; TD-04 §4's six types
   are not folded into it (§6).
7. Confidence must remain distinct from user confirmation — §9 states
   this explicitly with a worked example (high-confidence-unconfirmed;
   low-confidence-confirmed).
8. Memory must not reuse or reinterpret the PI Core claim model — §4, §11
   restate `PHASE_10Q_E` §8's non-negotiable invariant; no PI Core type,
   table, or module is referenced except as an architectural pattern.
9. Memory must not create PI Core coupling — no field in §3 references
   PI Core; `value_kind` is independently declared (§4).
10. Memory references must not automatically become Evidence linkage —
    §5 (question 4), §11 state this directly; no `evidenceVersionId`-style
    field exists in §3.
11. Deferred sensitivity must remain deferred — §10; no taxonomy or
    mechanism proposed.
12. Deferred subject taxonomy must remain deferred — §3 (deliberate
    absence of a `memory_type` pseudo-field), consistent with
    `PHASE_10Q_E` §9's single-general-type position.
13. No implementation may be inferred from this document — §1, §17 state
    this explicitly; no code, schema, or migration appears anywhere above.

---

## 13. Contract Completeness Matrix

| Concept | Decision | Contract Definition | Evidence | Open Question | Implementation Authorization |
|---|---|---|---|---|---|
| Envelope | Decided (existing) | §3.1 | `memory-record.model.ts`, `memory.schema.ts` | None | Not authorized (unchanged, no new work needed) |
| Value (existence) | Decided (Model C, Founder-approved) | §2, §3.2 | Founder approval of Model C direction | None at direction level | Not authorized |
| Value-encoding kind | Decided (as a concept) | §4 | PI Core `valueKind` pattern; Model C direction | Exact enum values | Not authorized |
| Content/reference | Decided (unified, C3) | §5 | `TD-04` §17, `TD-06` §3 | Internal typing, evolution, dangling-reference behavior | Not authorized |
| Provenance | Decided (existing, unwidened) | §6 | `memory.schema.ts` check constraint | Whether/how to widen (separate future decision) | Not authorized |
| User confirmation | Decided (as intrinsic dimension) | §7 | `TD-06` §3, §13 | Exact type, default value | Not authorized |
| Lifecycle | Decided (existing 3-value minimum) | §8 | `memory.schema.ts` check constraint | Additional values (`superseded` etc.) | Not authorized |
| Confidence | Decided (existing, unchanged) | §9 | `memory-record.model.ts`, `memory.schema.ts` | Interaction with confirmation/provenance (none specified) | Not authorized |
| Sensitivity | **Deferred** | §10 (existence acknowledged only) | `TD-04` §17, `TD-06` §3/§13, `PHASE_10Q_E` §17 | Entire taxonomy/mechanism | Not authorized; requires separate gate |
| Evidence linkage | **Deferred** | §11 (existence-of-boundary acknowledged only) | `PHASE_10Q_E` §7/§17 | Entire relationship | Not authorized; requires separate gate |
| Subject taxonomy | **Deferred** | §3 (deliberately absent) | `PHASE_10Q_E` §9; TD-06 §3 (no `memory_type` field) | Whether/when to introduce; taxonomy values | Not authorized; requires separate gate |

This matrix is structured so that every row marked "Decided" still carries
an "Implementation Authorization: Not authorized" — decided concept and
implemented schema are never conflated anywhere in this document.

---

## 14. Open Questions

Classified exactly as required — nothing solved merely for completeness:

1. **Exact field names** (code-level identifiers) — IMPLEMENTATION-LEVEL.
2. **Exact scalar/union types** for `value` and `value_kind` —
   IMPLEMENTATION-LEVEL, contingent on item 3.
3. **Exact value-kind enum** — DEFERRED (§4); its minimum required
   structure (inline-vs-reference) is DECIDED, its full variant set is
   not evidenced.
4. **Nullability** of `user_confirmed` and whether `value` can be absent
   on some version — DEFERRED (§3.2, §7).
5. **Validation constraints** (e.g., mutual exclusivity rules, allowed
   value-kind/reference-target combinations) — IMPLEMENTATION-LEVEL.
6. **Reference representation** (typed per-target vs. generic; evolution
   between content and reference; dangling-reference behavior) —
   DEFERRED (§5, questions 3, 6, 8, 9).
7. **Serialization** — IMPLEMENTATION-LEVEL.
8. **Sensitivity taxonomy** — REQUIRES SEPARATE GATE (§10; already
   deferred by `PHASE_10Q_E` §17, not reopened).
9. **Evidence linkage** — REQUIRES SEPARATE GATE (§11; already deferred
   by `PHASE_10Q_E` §7/§17).
10. **Subject taxonomy** — REQUIRES SEPARATE GATE (§3, §13; already
    deferred by `PHASE_10Q_E` §9).
11. **Correction/supersession mechanics** beyond the existing implicit
    version sequence (e.g., an explicit "corrects version N" reference) —
    DEFERRED (carried forward unchanged from the conceptual decision's
    §11 item 7).
12. **Indexing** — IMPLEMENTATION-LEVEL.
13. **Uniqueness** (beyond the existing `(record_id, version)` unique
    index, confirmed unchanged in `memory.schema.ts`) — IMPLEMENTATION-LEVEL.
14. **Database constraints** (check constraints, foreign keys, beyond
    what already exists) — IMPLEMENTATION-LEVEL.

**Conclusion:** items 3, 4, 6 (DEFERRED) and 8, 9, 10, 11 (REQUIRES
SEPARATE GATE) are the reasons this contract is **not yet
implementation-ready**; items 1, 2, 5, 7, 12–14 are ordinary
implementation-level detail that would be resolved during an actual
Implementation Contract, not a blocker to this preparation's own
completeness as a *contract-level* document.

---

## 15. Six-Criteria DECIVEXA Review

1. **Vision Alignment** — *Evidence:* Master Architecture §24 requires
   Memory to "distinguish explicit memory, observed evidence, inferred
   memory, confidence, source, recency, verification, sensitivity" and
   defend against memory poisoning. *Interpretation:* this contract's
   provenance/confidence/user-confirmation separation (§6, §7, §9)
   directly serves that requirement; sensitivity remains a named,
   acknowledged gap (§10), not silently dropped. *Risk:* none from
   producing a contract preparation; a future implementation that
   collapses user-confirmation into provenance would violate Vision
   Alignment. *Recommendation:* the Implementation Contract must preserve
   §7's distinctions verbatim.
2. **Long-Term Architecture Strength** — *Evidence:* this contract adds
   exactly two new conceptual fields (`value_kind`, `value`) plus one new
   dimension (`user_confirmed`) to an otherwise-unchanged envelope, rather
   than restructuring existing fields. *Interpretation:* minimal-surface
   change lowers migration risk. *Risk:* deferring the value-kind enum
   and reference typing (§14 items 3, 6) means a future schema decision
   could still choose a shape that requires later revision. *Recommendation:*
   the future schema-level gate should resolve items 3 and 6 together,
   since they are coupled (§5, question 9).
3. **Improvement Opportunities** — *Evidence:* TD-06 §3's `source_type`
   and `system_inferred` fields (noted in the conceptual decision, §11
   item 2/8) remain uncited-elsewhere candidates. §8 additionally
   surfaces that `review_status`/`expiration` (TD-06 §3) are conceptually
   separate from `lifecycle`, not previously distinguished this
   precisely. *Interpretation:* worth flagging for the future schema
   gate. *Risk:* none — opportunities only. *Recommendation:* not
   executed here.
4. **User Input Burden vs. System Value** — *Evidence:* no product
   surface exists; this document adds no user-facing change.
   *Interpretation:* no burden impact. *Recommendation:* none needed.
5. **AI Capability** — *Evidence:* TD-06 §13's anti-poisoning rule (§7)
   is a direct prerequisite for trustworthy future AI consumption of
   Memory. *Interpretation:* this contract moves the concept one step
   closer to implementation-ready without authorizing AI consumption.
   *Risk:* **not zero** — if the future Implementation Contract resolves
   `value_kind` or `user_confirmed`'s exact type in a way that loses the
   independence this document establishes (e.g., by deriving
   `user_confirmed` from `provenance` for convenience), the anti-poisoning
   invariant (§12 item 5) would be violated at implementation time, not
   here. *Recommendation:* the future schema/Implementation gate must
   explicitly re-verify §12's invariants before implementation, not
   merely inherit this document's intent.
6. **Trusted Reference Platform** — *Evidence:* every field, decision,
   and deferral above traces to a specific, freshly re-read source
   (§3–§11), including the database-level check constraints confirmed
   this task. *Interpretation:* the completeness matrix (§13) makes the
   decided/deferred boundary auditable at a glance. *Risk:* none.
   *Recommendation:* none needed.

**No criterion is claimed zero-risk merely because implementation is
deferred** — criterion 2 and criterion 5 above explicitly name residual
risk that a future gate must still manage.

---

## 16. Governance / Freeze Check

- **Architecture Freeze:** not modified — `docs/ARCHITECTURE_FREEZE_BASELINE.md`
  was not edited; TD-04 and TD-06 remain within its existing "Frozen
  Source Gate" range, unmodified.
- **Master Architecture:** not modified — `docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
  §24 was read (re-verified this task) and cited, not edited.
- **Roadmap:** not modified.
- **GOV-02:** not reopened.
- **GOV-04:** not reopened — the ADR/TD naming-convention question remains
  open; this document's non-numbered naming follows the same established
  workaround as its predecessors.
- **TD-02/TD-04/TD-06 namespace collisions:** not resolved. The TD-06
  collision specifically: both
  `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` (cited extensively
  above as evidence) and `docs/technical-design/TD-06-AI-TRUTHFULNESS.md`
  (a distinct subject, not cited anywhere in this document) remain
  unchanged, unrenamed, unmerged, unnormalized.
- **No ADR created.**
- **No Increment Contract created.**
- No Memory, Evidence, PI Core, or Personal State implementation file was
  modified — all were read for evidence only (§3, §8, §9 cite exact
  current field/constraint values, confirmed by fresh reads this task).

---

## 17. Founder Authority Boundary

**This Schema Contract Preparation does not authorize implementation.**

It does not authorize:

- Memory model changes.
- Schema changes.
- Migrations.
- Database changes.
- API changes.
- Controllers.
- Repositories.
- Web/UI.
- AI consumption.
- PI Core integration.
- Evidence integration.
- Sensitivity implementation.
- An Increment Contract.
- An ADR.
- Commit.
- Push.

A future Founder-controlled gate must explicitly authorize implementation,
following the same sequence established for every prior increment in this
repository (Contract → TD-09 readiness review → Build Authorization).

---

## 18. Status

**SCHEMA CONTRACT PREPARATION COMPLETE.** Four concepts remain blocking
an implementation-ready schema (sensitivity taxonomy, Evidence linkage,
subject taxonomy — each requiring a separate gate — and the value-kind/
reference-typing pair, which is deferred pending further evidence). No
implementation is authorized by this document's creation.
