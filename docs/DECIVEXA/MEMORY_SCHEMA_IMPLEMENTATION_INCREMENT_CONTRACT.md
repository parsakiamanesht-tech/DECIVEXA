# DECIVEXA — Memory Schema Implementation Increment Contract (Preparation)

**Document type:** Implementation Increment Contract preparation (not an
ADR, not a migration, not an implementation plan disguised as a
contract).
**Naming status:** Non-numbered, unambiguous name — same GOV-04-pending
reasoning as its predecessors in this arc.
**Status:** CONTRACT PREPARED — **NOT FOUNDER-APPROVED — NOT
BUILD-AUTHORIZED.**
**Date:** 2026-08-24.
**Authorizing instruction:** Founder Authorization — "MEMORY SCHEMA
IMPLEMENTATION INCREMENT CONTRACT GATE" — prepare the Implementation
Increment Contract for the already-approved and already-decided Memory
conceptual schema direction. Contract preparation only; not
implementation authorization.

---

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record. This document was not
named in the directive's own enumerated document list and was added back
under the closure's Preservation Rule rather than omitted.*

This document is preserved as a historical architectural/planning
record. At the time it was written, Memory's schema had not yet been
extended with a content/value representation. This document's §5/§17
mark the value-encoding-kind enum, the internal value/content-reference
representation, the `user_confirmed` type/default, and the copy-forward
semantics on a lifecycle-only transition as "UNDECIDED — REQUIRES
EXPLICIT FOUNDER/SCHEMA AUTHORIZATION." All four were subsequently
resolved and shipped (commits `11e8d0d`, `217170e`, `2b5157a`,
`15627e5`): `valueKind: "content" | "reference"`, a single nullable
`value: string` column, `userConfirmed: boolean` defaulting `false`, and
an explicit copy-forward-unchanged rule on lifecycle-only transitions
(diverging only for genuine deletion, which nulls the value). The real,
shipped code's own comments cite a "Memory Schema Implementation Blocker
Resolution" authorization that resolved these items, but that
authorization's own record is not present anywhere in this repository's
surviving documentation — this is, among the thirteen documents in this
closure, the one most directly superseded by real, later, unrecorded
authorization. This reconciliation does not fabricate or reconstruct
that missing authorization record and does not authorize any new
implementation. The current shipped Memory implementation must be
established from the actual committed source and commit history, not
inferred from this document.

---

## §1. Purpose

This increment's purpose is to extend Memory's existing, implemented
schema (`memory_records` / `memory_record_versions`, confirmed unchanged
this task) with the Founder-decided **value representation** (a
value-encoding-kind discriminator plus a unified content/reference slot)
and an independent **user-confirmation dimension** — translating
`MEMORY_SCHEMA_CONTRACT_PREPARATION.md`'s contract-level description into
a concrete, boundable implementation increment. It does **not** execute
that increment. Existing `provenance`, `lifecycle`, `confidence`, and
envelope fields are preserved unchanged throughout.

---

## §2. Authority and Preconditions

- **Founder-approved Model C direction:** common envelope + typed value,
  informed by but architecturally independent from PI Core's
  `PersonalIntelligenceClaimVersion`.
- **`MEMORY_SCHEMA_CONCEPTUAL_DECISION.md`** (Decisions A–D): value-encoding
  kind decided as an independent dimension; content/reference decided as
  unified (C3); Evidence linkage deferred; user-confirmation decided as
  intrinsic; sensitivity deferred; subject taxonomy deferred.
- **`MEMORY_SCHEMA_CONTRACT_PREPARATION.md`**: translated those decisions
  into contract-level field semantics, explicitly leaving exact
  enums/types/nullability undecided.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md`**: the operative,
  Founder-approved (not build-authorized) Contract governing this module.
  Its §8 PI Core Boundary Invariant, §7/§17 Non-Goals/Deferred Decisions,
  and §12 Contract Invariants remain fully binding and are not reopened.
- **`docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §17**, **`docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md`
  §3/§13**, **`docs/architecture/TD-04-human-os-personal-intelligence-core.md`
  §4**, **`docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md` §24** (path
  corrected from the governing instruction's listed
  `docs/DECIVEXA/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`, which does
  not exist — the file is at the top-level `docs/` path; a
  non-material, informational correction, not a discrepancy requiring a
  stop) — all re-confirmed present, unmodified, and consistent with the
  prior documents' citations.
- **Current implementation, freshly re-read this task:**
  `memory-record.model.ts`, `memory.schema.ts`, `memory-record.repository.ts`,
  `memory.use-case.ts`, `apps/api/src/infrastructure/persistence/memory.repository.ts`,
  `apps/api/src/application/memory/memory.module.ts` — confirmed unchanged
  from all prior citations in this arc.

**This document itself does NOT authorize implementation.** It is a
preparation for Founder review of the next increment's boundary — see §18.

---

## §3. Scope

This increment, **if separately authorized**, would cover:

- **Conceptual obligations:** preserve Decisions A–D exactly as recorded;
  no re-derivation of architectural direction.
- **Schema obligations:** add columns to `memory_record_versions`
  representing (a) a value-encoding-kind discriminator, (b) a unified
  content/reference value, and (c) a user-confirmation flag — exact
  column definitions **UNDECIDED**, per §5, §9.
- **Model obligations:** extend `MemoryRecordVersion` (and its
  `NewMemoryRecordVersionRow`/`MemoryRecordVersionRow` Drizzle-inferred
  counterparts) with the corresponding TypeScript fields — exact shape
  **UNDECIDED**, per §10.
- **Repository/use-case obligations:** thread the new fields through
  `CreateMemoryRecordInput`, `AppendMemoryLifecycleVersionInput`,
  `MemoryUseCase.create`, and `DrizzleMemoryRecordRepository`'s
  `create`/`appendLifecycleVersion` — including the copy-forward
  `INSERT ... SELECT` mechanism `appendLifecycleVersion` already uses to
  carry `provenance`/`confidence` forward from the prior version (§10
  identifies an open, evidence-grounded question about whether new
  fields should copy-forward the same way).
- **Validation obligations:** automated tests for value-kind/value
  validity, user-confirmation independence and the anti-poisoning
  invariant, and preservation of all existing behavior — per §13.

**Not written, not designed beyond contract level, in this document:**
TypeScript code, Drizzle schema, SQL, or migrations.

---

## §4. Non-Scope

The following remain explicitly outside this increment, unless a
separate, later Founder gate authorizes them:

1. Subject-matter Memory taxonomy.
2. Sensitivity/access-control classification mechanism.
3. Memory ↔ Evidence data-model integration.
4. An explicit "corrects"/"supersedes" relation beyond the existing
   implicit version sequence.
5. Reference-target typing beyond the general, untyped reference concept
   already established.
6. Any new provenance taxonomy or widening of `provenance` beyond
   `declared`/`observed`.
7. Any new lifecycle value beyond the existing, implemented
   `active`/`corrected`/`deleted`.
8. AI/Web exposure of any kind.
9. API contract changes (no controller, route, or DTO).
10. Migration execution.
11. Data backfill.
12. PI Core integration of any kind.
13. Evidence integration of any kind.
14. ADR creation.
15. Architecture Freeze modification.
16. Master Architecture modification.
17. Roadmap modification.

None of these were found necessary to complete this preparation (§20
confirms no Absolute Stop Condition was triggered) — they are recorded
here as a fixed boundary, not because evidence forced a stop.

---

## §5. Proposed Data Contract

| Concept | Required dimension? | Implementation-level field? | Exact type | Default | Nullability | Classification |
|---|---|---|---|---|---|---|
| Value-encoding-kind discriminator | Yes (Decision A) | Yes, if this increment proceeds | **UNDECIDED** | **UNDECIDED** | **UNDECIDED** (nullable only if a value-less version is legitimate — itself undecided, §6) | Authoritatively required *as a dimension*; exact type **UNDECIDED — REQUIRES EXPLICIT FOUNDER/SCHEMA AUTHORIZATION** |
| Unified value/content-reference slot | Yes (Decision B) | Yes, if this increment proceeds | **UNDECIDED** (scalar? JSON? discriminated union at the DB layer?) | **UNDECIDED** | **UNDECIDED** | Authoritatively required *as unified*; exact representation **UNDECIDED — REQUIRES EXPLICIT FOUNDER/SCHEMA AUTHORIZATION** |
| User-confirmation flag | Yes (Decision D.2) | Yes, if this increment proceeds | **UNDECIDED** (boolean vs. tri-state — flagged open in the Contract Preparation) | **UNDECIDED** — must not default to "confirmed" (anti-poisoning invariant, §7) | **UNDECIDED** | Authoritatively required *as a dimension*; exact type **UNDECIDED — REQUIRES EXPLICIT FOUNDER/SCHEMA AUTHORIZATION** |
| `provenance` | Existing | Existing, unchanged | `"declared"\|"observed"` (unchanged) | N/A | Not null (unchanged) | Implementation choice already made; preserved as-is |
| `lifecycle` | Existing | Existing, unchanged | `"active"\|"corrected"\|"deleted"` (unchanged) | `"active"` (unchanged) | Not null (unchanged) | Implementation choice already made; preserved as-is |
| `confidence` | Existing | Existing, unchanged | `number \| null` (unchanged) | N/A | Nullable (unchanged) | Implementation choice already made; preserved as-is |
| Envelope (`id`, `userId`, timestamps) | Existing | Existing, unchanged | Unchanged | N/A | Not null (unchanged) | Implementation choice already made; preserved as-is |
| Sensitivity | Deferred | Not part of this increment | N/A | N/A | N/A | Deferred (§4 item 2) |
| Evidence reference | Deferred | Not part of this increment | N/A | N/A | N/A | Deferred (§4 item 3) |
| Subject-matter type | Deferred | Not part of this increment | N/A | N/A | N/A | Deferred (§4 item 1) |

No field's exact type is guessed. Every "UNDECIDED" row requires a
separate, explicit Founder/schema-level decision before implementation
could proceed on that field.

---

## §6. Value Representation Contract

- **Value-kind discrimination:** must exist as an independent,
  independently-declared discriminator (Decision A/§4 of the Contract
  Preparation). At minimum it must distinguish an inline-content case
  from a reference case — this minimum is authoritatively required; any
  finer-grained enum (text/boolean/enum-like sub-kinds) is **UNDECIDED**.
- **Unified value/content-reference representation:** decided as unified
  (C3) — **not reopened here.** Whether it is represented at the
  persistence layer as a single nullable column, a JSON envelope, or a
  discriminated pair of nullable columns collapsed by convention is
  **UNDECIDED** and is an implementation choice for a future schema
  decision, not this contract.
- **Inline value behavior:** when `value_kind` indicates inline content,
  the slot holds the content itself. Exact scalar type(s) supported —
  **UNDECIDED**.
- **Reference value behavior:** when `value_kind` indicates a reference,
  the slot holds a pointer. **No reference target is invented here** —
  per §4 item 5/item 3, arbitrary reference-target typing and an
  Evidence-specific target both remain out of scope. A reference's target
  type, if ever typed, is a separate future decision.
- **Invalid combinations:** a value marked as a reference must not be
  silently treated as inline content (or vice versa) by any consumer —
  this is a required contract-level invariant; the exact validation
  mechanism enforcing it is implementation-level and undecided.
- **Nullability:** whether every `MemoryRecordVersion` must carry a value,
  or whether a value-less version remains legitimate (mirroring today's
  implementation, which has no value field at all), is **UNDECIDED** —
  flagged as a dependency in §17, not resolved here.
- **Serialization expectations:** no serialization format is assumed
  beyond what Drizzle/Postgres already support for the repository's
  existing columns (`text`, `real`, `timestamp`) — introducing a new
  storage type (e.g., `jsonb`) would itself be an implementation-level
  choice requiring justification against existing architecture
  conventions, not decided here.
- **Deferred reference behavior** (per §4 items 3, 5, and the Contract
  Preparation's §5/§14): the representation's evolution between content
  and reference across corrections, and dangling-reference handling, are
  both explicitly deferred, not invented.

---

## §7. User Confirmation Contract

- **Distinct dimension, preserved:** `user_confirmed` (or whatever its
  eventual name) must remain conceptually and structurally independent
  of `provenance`, `lifecycle`, and `confidence` — restated from Decision
  D.2 and the Contract Preparation §7, not reopened.
- **Distinction from provenance:** a version's `provenance`
  (`declared`/`observed`) must never be read by any future implementation
  as implying its confirmation state.
- **Distinction from confidence:** a high-`confidence` version must not
  be treated as confirmed merely by virtue of its confidence score.
- **Distinction from lifecycle:** confirmation state must not be
  inferred from or conflated with `lifecycle` transitions.
- **Anti-poisoning invariant (binding, verbatim from TD-06 §13):** *"An
  inferred memory must never be silently represented as a user-confirmed
  fact."* Any future implementation of this field must satisfy this
  invariant structurally (e.g., no default value or derivation path that
  could cause a system-inferred version to read as confirmed).
- **Behavior for system-inferred vs. user-confirmed Memory:** a
  system-derived (`provenance: "observed"`) version must be representable
  as unconfirmed by default; only an explicit user act may transition a
  version toward "confirmed." The exact mechanism for that transition
  (a new version? an in-place flag update, which would break the
  append-only invariant confirmed in §10 below? a distinct API surface,
  itself out of scope per §4 item 9?) is **UNDECIDED — REQUIRES EXPLICIT
  FOUNDER/SCHEMA AUTHORIZATION.**
- **Default behavior:** since no authoritative source specifies a default
  value, this contract does **not** guess one. A default of "confirmed"
  would risk violating the anti-poisoning invariant outright and is
  explicitly disfavored, but the exact safe default (e.g., a required
  non-nullable "unconfirmed" default, vs. a nullable/tri-state field with
  no default) remains **UNDECIDED.**

---

## §8. Existing Field Preservation

- `provenance`: unchanged vocabulary (`declared`/`observed`), unchanged
  DB check constraint, unchanged semantics.
- `lifecycle`: unchanged vocabulary (`active`/`corrected`/`deleted`),
  unchanged DB check constraint, unchanged default (`"active"`),
  unchanged `appendLifecycleVersion` mechanism.
- `confidence`: unchanged type (`number | null`), unchanged nullability.
- Timestamps (`observedAt`, `acceptedAt`, `createdAt`, envelope
  `createdAt`/`updatedAt`): unchanged.
- Envelope behavior (ownership scoping via `userId`, the
  `memory_records`/`memory_record_versions` two-table structure, the
  `(recordId, version)` uniqueness invariant, the foreign-key-enforced
  record/version ownership match): unchanged.
- **No silent semantic change** is proposed to any existing field or
  mechanism by this contract preparation.

---

## §9. Database / Persistence Contract

- **Table/column changes:** this increment, if implemented, would add
  new column(s) to `memory_record_versions` only — no new table is
  implied by the current conceptual decision (a single unified value slot
  plus a discriminator plus a confirmation flag, all version-scoped).
  Exact column count/names/types: **UNDECIDED** (§5).
- **Constraints:** any new column would need constraints analogous to the
  existing `provenance`/`lifecycle` CHECK constraints (confirmed present
  in `memory.schema.ts`) once its enum/type is decided — not designed
  here.
- **Nullability:** existing `memory_record_versions` rows have no value
  of any kind. Any new column must therefore be **nullable at the
  database level**, or the increment would require a backfill (explicitly
  out of scope, §4 item 11) — this is an evidence-grounded compatibility
  requirement, not a guess, and is elaborated in §12.
- **Indexes:** no index is justified by any evidence read this task; none
  is proposed.
- **Compatibility expectations:** additive-only column changes are
  expected to be compatible with the existing unique index
  (`memory_record_versions_record_id_version_unique`) and the existing
  foreign key (`memory_record_versions_record_owner_fk`) without
  modification to either.
- **Migration requirements:** a future migration would need to add the
  new nullable column(s) and any new CHECK constraint(s) — **no migration
  is created, drafted, or executed by this document.**

---

## §10. Application Model Contract

- **`MemoryRecordVersion` (model):** would require new optional/typed
  fields corresponding to the decided dimensions — exact shape
  **UNDECIDED** per §5.
- **Validation:** any future implementation must validate value-kind/value
  combination legality (§6) before persistence — exact validation logic
  not designed here.
- **Repository mapping:** `toDomainVersion` (confirmed present in
  `apps/api/src/infrastructure/persistence/memory.repository.ts`) would
  need to map the new column(s) into the extended model — not implemented
  here.
- **Use-case boundary:** `MemoryCreateInput` (in `memory.use-case.ts`)
  would need new optional/required fields corresponding to the decided
  dimensions, threaded into `MemoryUseCase.create`'s call to
  `repository.create` — not implemented here.
- **Copy-forward question (identified this task, evidence-grounded, not
  previously flagged in this decision chain):** `DrizzleMemoryRecordRepository.appendLifecycleVersion`
  (confirmed read in full this task) currently performs an
  `INSERT ... SELECT` that **copies `provenance`, `observedAt`,
  `acceptedAt`, and `confidence` forward unchanged** from the prior
  version, changing only `lifecycle` and `version`. Whether the new
  value/value-kind/user-confirmation fields should be copied forward the
  same way on a lifecycle-only transition (e.g., marking a memory
  `"deleted"` without touching its value), or whether changing a memory's
  *value* must go through a distinct mechanism from changing its
  *lifecycle state*, is **not decided by any source read in this arc.**
  This is recorded as a dependency/blocker per the governing instruction's
  §20, not silently resolved — see §17.
- **No expansion of the application boundary** beyond what §3 already
  scopes (no new use-case methods, no new repository methods) is
  proposed.

---

## §11. API / External Consumer Boundary

**No API/Web/external-consumer contract is authorized by this
increment.** No controller, route, DTO, or UI change is proposed,
designed, or implied anywhere in this document, consistent with
`PHASE_10Q_E` §7's existing Non-Goal (HTTP/API surface, UI of any kind)
and this gate's own governing instruction §4 item 9.

---

## §12. Compatibility and Migration Contract

- **Old-record compatibility:** every existing `memory_record_versions`
  row (created under the current, value-less schema) must remain valid
  after this increment. Since no existing row carries a value, any new
  column must default to `NULL`/absent for those rows — an additive,
  backward-compatible migration shape, not a breaking one.
- **Handling of existing records:** no transformation, reinterpretation,
  or backfill of existing records is proposed. They remain exactly as
  they are, with the new column(s) simply absent/null.
- **Migration requirements:** additive `ALTER TABLE ... ADD COLUMN`
  (nullable) plus any new CHECK constraints, once their exact shape is
  decided — **not executed, drafted, or scripted by this document.**
- **Backward compatibility:** any code path reading a pre-increment
  version row must not fail or misbehave when the new column(s) are
  absent — this is a required compatibility property, not yet verified
  by any test (§13).
- **Null/legacy representation:** a `NULL` value-kind/value/confirmation
  state on a legacy row should conceptually mean "this version predates
  the value model," not "this version has an empty/reference-only value"
  — this distinction matters for future consumers and is recorded here so
  it is not silently lost, though the exact mechanism (a sentinel? mere
  absence?) is **UNDECIDED.**
- **Migration strategy requiring a separate gate:** confirmed — the
  actual migration (§9, §12) requires its own future, separate
  implementation gate; this contract does not authorize or perform it.

---

## §13. Validation Contract

A future implementation must eventually satisfy, at minimum:

1. Valid value-kind/value combinations are accepted (exact combinations
   depend on the still-undecided enum, §5/§6 — test design itself is
   future work).
2. Invalid value-kind/value combinations are rejected.
3. User-confirmation state is independently settable/readable, not
   derivable from `provenance` alone (automated test asserting a
   `provenance: "observed"` version can exist both unconfirmed and, after
   an explicit act, confirmed).
4. Anti-poisoning behavior: no code path defaults an inferred/system-derived
   version to a confirmed state.
5. `provenance` is preserved unchanged in shape and behavior (regression
   test against existing `memory-record.model.spec.ts` /
   `memory.use-case.spec.ts` patterns).
6. `lifecycle` is preserved unchanged (regression test, same pattern).
7. `confidence` is preserved unchanged (regression test, same pattern).
8. Existing Memory behavior (create, get, getVersion, appendLifecycleVersion)
   continues to pass its full existing test suite unmodified in
   observable behavior.
9. Persistence constraints (uniqueness, foreign key, any new CHECK
   constraints) are enforced at the database level, mirroring the
   existing `memory_record_versions_record_id_version_unique` /
   `memory_record_versions_record_owner_fk` pattern confirmed in
   `memory.schema.ts`.
10. Backward compatibility: reading a pre-increment version row (new
    columns absent) does not throw or misbehave.

**No implementation test is executed by this document.** This section
only enumerates what a future implementation must eventually satisfy; the
current, existing test suite was read for pattern reference only
(`memory-record.model.spec.ts`, `memory.use-case.spec.ts` — confirmed
present, not modified, not executed as part of this task).

---

## §14. Security / Privacy Contract

- **No silent promotion of inferred Memory to confirmed** — restated as
  binding from §7; this is the single most safety-critical property this
  increment must eventually satisfy.
- **Provenance inspectability** — `provenance` remains a readable,
  unchanged field; nothing in this increment obscures it.
- **Correction/removal safety** — the existing `appendLifecycleVersion`
  append-only mechanism (confirmed unchanged, §8) continues to preserve
  history; no in-place mutation of a prior version is proposed anywhere
  in this document.
- **No unauthorized exposure** — no API/Web boundary is created (§11); no
  new consumer of Memory data is introduced.
- **Sensitivity remains deferred** — restated from §4 item 2 and the
  Contract Preparation §10; not implemented, not scheduled, not
  reinterpreted as in-scope by this document.
- **No new external consumer boundary** — restated from §11.

---

## §15. Governance Invariants

- **PI Core Boundary Invariant (`PHASE_10Q_E` §8):** restated, absolute,
  not reopened. No new PI Core `claimType`; no modification of
  `PersonalIntelligenceClaimVersion` or any PI Core file; no
  reinterpretation of PI Core's claim model as Memory schema; no PI Core
  ↔ Memory integration.
- **No PI Core schema reuse:** the value-encoding-kind discriminator
  remains independently declared, per §6/§4 of the Contract Preparation,
  restated here.
- **No Evidence integration:** restated, §4 item 3, §11.
- **No subject taxonomy:** restated, §4 item 1.
- **No sensitivity implementation:** restated, §4 item 2, §14.
- **No API/Web exposure:** restated, §4 items 8–9, §11.
- **No architecture changes:** Architecture Freeze, Master Architecture,
  and Roadmap are all confirmed unmodified by this task (verified by this
  task's git validation, reported in the final report below).
- **No silent reopening of deferred decisions:** every item in §4 remains
  exactly as deferred by its originating document; none is resolved,
  narrowed, or implicitly decided by this contract.
- **No namespace collision resolution:** the known TD-02/TD-04/TD-06
  namespace collisions remain disclosed and unresolved. Specifically for
  TD-06: both `docs/TD-06_TECHNICAL_DESIGN_EXECUTABLE_CONTRACT.md` (cited
  extensively above as evidence) and
  `docs/technical-design/TD-06-AI-TRUTHFULNESS.md` (a distinct subject,
  not cited as evidence anywhere in this document) remain unchanged,
  unrenamed, unmerged, unnormalized. GOV-02 and GOV-04 are not reopened.

---

## §16. Six-Criteria DECIVEXA Review

1. **Vision Alignment** — *Evidence:* Master Architecture §24 requires
   distinguishing explicit/observed/inferred memory, confidence, and
   defending against poisoning. *Interpretation:* this increment's
   value/user-confirmation additions directly serve that requirement,
   while sensitivity remains a named, unaddressed gap (§14).
   *Risk:* none from contract preparation; a future implementation that
   loses the anti-poisoning invariant would violate Vision Alignment
   materially. *Recommendation:* the eventual implementation review must
   re-verify §7's invariant before merge, not just at design time.
2. **Long-Term Architecture Strength** — *Evidence:* the proposed change
   is additive-only (§9, §12) — no existing column, constraint, or
   mechanism is altered. *Interpretation:* low structural risk to
   existing Memory behavior. *Risk:* the copy-forward question (§10) is
   unresolved and could, if answered carelessly during implementation,
   couple lifecycle transitions to value semantics in an unintended way.
   *Recommendation:* the copy-forward question should be resolved by an
   explicit future decision before implementation, not left to
   implementation-time improvisation.
3. **Improvement Opportunities** — *Evidence:* `appendLifecycleVersion`'s
   existing copy-forward mechanism (§10) was not previously examined in
   this decision chain; TD-06 §3's `source_type`/`system_inferred`/
   `review_status` fields (noted in the two prior documents) remain
   uncited-elsewhere candidates. *Interpretation:* worth flagging for the
   eventual schema/implementation decision. *Risk:* none — opportunities
   only. *Recommendation:* not executed here.
4. **User Input Burden vs. System Value** — *Evidence:* no product
   surface exists; this document adds no user-facing change.
   *Interpretation:* no burden impact. *Recommendation:* none needed.
5. **AI Capability** — *Evidence:* TD-06 §13's anti-poisoning rule is a
   direct prerequisite for trustworthy future AI consumption.
   *Interpretation:* this contract moves the concept closer to an
   implementable boundary without authorizing AI consumption. *Risk:*
   **not zero** — if the eventual implementation resolves
   `user_confirmed`'s default in a way that violates the anti-poisoning
   invariant (§7), this risk becomes real at implementation time.
   *Recommendation:* the future implementation review must explicitly
   test for this (§13 item 4), not merely inherit this document's intent.
6. **Trusted Reference Platform** — *Evidence:* every field, decision,
   and deferral above traces to a specific, freshly re-read source,
   including the repository/use-case/module files newly read this task.
   *Interpretation:* the decision matrix (§17) keeps the decided/undecided
   boundary auditable. *Risk:* none. *Recommendation:* none needed.

**No criterion claims zero risk merely because implementation is
deferred** — criteria 2 and 5 explicitly name residual risk a future gate
must still manage.

---

## §17. Decision Matrix

| Concern | Current decision | Evidence | Implementation consequence | Authorization status | Dependency | Deferred gate |
|---|---|---|---|---|---|---|
| Value-encoding kind (existence) | Decided | `MEMORY_SCHEMA_CONCEPTUAL_DECISION.md` Decision A | New column required | Not authorized | None | — |
| Value-encoding kind (exact enum) | Undecided | No source enumerates variants for Memory | Blocks column type definition | Not authorized | Founder/schema decision | Future schema gate |
| Content/reference (unification) | Decided (C3) | TD-04 §17, TD-06 §3 | New column(s) required | Not authorized | None | — |
| Content/reference (internal representation) | Undecided | No source specifies storage shape | Blocks column type definition | Not authorized | Founder/schema decision | Future schema gate |
| User confirmation (existence) | Decided | TD-06 §13, TD-06 §3 | New column required | Not authorized | None | — |
| User confirmation (exact type/default) | Undecided | No source specifies | Blocks column definition; anti-poisoning risk if guessed | Not authorized | Founder/schema decision | Future schema gate |
| Copy-forward semantics on lifecycle transition | Undecided — newly identified this task | `appendLifecycleVersion`'s existing `INSERT...SELECT` pattern | Blocks repository implementation | Not authorized | Founder/schema decision | Future schema or implementation gate |
| `provenance` | Preserved unchanged | `memory.schema.ts` check constraint | None | Not authorized (no change) | None | — |
| `lifecycle` | Preserved unchanged | `memory.schema.ts` check constraint | None | Not authorized (no change) | None | — |
| `confidence` | Preserved unchanged | `memory-record.model.ts` | None | Not authorized (no change) | None | — |
| Sensitivity | Deferred | `PHASE_10Q_E` §7/§17 | Excluded from this increment entirely | Not authorized | Separate gate | Sensitivity/access-control gate |
| Evidence linkage | Deferred | `PHASE_10Q_E` §7/§17; `MEMORY_SCHEMA_CONCEPTUAL_DECISION.md` Decision C | Excluded from this increment entirely | Not authorized | Separate gate | Evidence-boundary gate |
| Subject-matter taxonomy | Deferred | `PHASE_10Q_E` §9 | Excluded from this increment entirely | Not authorized | Separate gate | Subject-taxonomy gate |
| Migration execution | Out of scope | This document, §4/§9/§12 | N/A | Not authorized | Separate gate | Implementation/migration gate |
| API/Web exposure | Out of scope | `PHASE_10Q_E` §7; this gate's §4 items 8–9 | N/A | Not authorized | Separate gate | Web/Product Integration gate |

---

## §18. Implementation Authorization Boundary

**This document defines an implementation increment contract only. It
does not authorize implementation.**

Specifically, it does not authorize:

- No code modification.
- No schema migration.
- No database migration.
- No API change.
- No Web change.
- No PI Core change.
- No Evidence integration.
- No ADR.
- No commit.
- No push.

Any future implementation must receive a separate, explicit Founder
authorization, following the same sequence established for every prior
increment in this repository (Contract → TD-09 readiness review → Build
Authorization).

---

## §19. Acceptance Criteria

A future implementation would be considered contract-compliant only if
it can demonstrate:

1. All new columns are additive and nullable at the database level,
   verified via schema/migration inspection.
2. Every existing test (`memory-record.model.spec.ts`,
   `memory.use-case.spec.ts`, and any other Memory-scoped spec) continues
   to pass unmodified in its assertions.
3. `provenance`, `lifecycle`, and `confidence` are unchanged in type,
   constraint, and behavior, verified by diff review against this
   Contract's §8/§9 baseline.
4. A dedicated automated test demonstrates the anti-poisoning invariant
   (§7): no code path causes a system-inferred version to read as
   user-confirmed without an explicit confirming act.
5. Value-kind and value fields, once their exact shape is separately
   decided, reject invalid combinations, verified by automated test.
6. No file under `apps/api/src/core/personal-intelligence/` or
   `apps/api/src/application/personal-intelligence/` is touched,
   verified via `git diff --stat`, mirroring the verification pattern
   `PHASE_10Q_E` §11 item 5 already established.
7. No controller, route, DTO, or UI file is introduced, verified via
   repository inspection.
8. The copy-forward question (§10, §17) has been explicitly resolved by a
   separate, documented Founder/schema decision before any repository
   code implementing it is merged.

---

## §20. Absolute Stop Conditions

A future implementation attempt must stop and return to Founder
governance immediately if:

- Evidence conflicts materially (e.g., a newly found source contradicts
  Decisions A–D).
- A deferred decision (sensitivity, Evidence linkage, subject taxonomy)
  becomes necessary to proceed.
- A new schema dimension beyond value-kind/value/user-confirmation
  appears necessary.
- PI Core integration becomes necessary.
- Evidence integration becomes necessary.
- Sensitivity implementation becomes necessary.
- Subject taxonomy becomes necessary.
- API/Web exposure becomes necessary.
- Architecture modification becomes necessary.
- An existing governance decision (Decisions A–D, `PHASE_10Q_E`'s
  invariants) would need reopening.
- A namespace collision would need resolution to proceed.
- Implementation authorization would be required to continue past
  contract preparation.

**None of these conditions was triggered while preparing this document.**
The one identified open item — the copy-forward semantics question
(§10/§17) — is a genuine implementation dependency, not a contradiction
in existing evidence, and is recorded as a blocker for a future decision
rather than silently resolved.

---

## §21. Final Status

**IMPLEMENTATION INCREMENT CONTRACT PREPARED — IMPLEMENTATION NOT
AUTHORIZED.**
