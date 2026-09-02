# Relationship + Relationship Evidence — Implementation Increment Contract

> **IMPLEMENTATION CONTRACT — NOT IMPLEMENTATION.**
> **IMPLEMENTATION AUTHORIZATION: NOT GRANTED.**
> This document is documentation only. No code, schema, migration, test,
> API, repository, or service file was created or modified in producing
> it. Writing, reviewing, approving, or committing this Contract does
> **not** constitute Implementation Authorization. Cross-Claim Matching
> Decision 7 (`docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md`
> §7) remains **NOT APPROVED**. A separate, explicit Founder Execution
> Directive is required before any implementation work described here may
> begin.

## 1. Status / Non-Authorization Banner

Restated for emphasis, because this increment introduces two **new**
persisted artifacts rather than fields on an existing one — a category
where the risk of a future session misreading "the Contract exists" as
"the tables exist" is higher than for a field-addition increment:

**At the moment this Contract is approved:**
- no `personal_intelligence_relationships` table is authorized to be
  created yet;
- no `personal_intelligence_relationship_evidence` table is authorized
  to be created yet;
- no Relationship repository, token, or infrastructure implementation is
  authorized to be created yet;
- no migration is authorized;
- no service, controller, or API is authorized;
- no matching algorithm, candidate generation, or classification logic
  is authorized;
- no Matching-Hypothesis Confirmation workflow is authorized.

This Contract describes what a future, separately authorized
implementation increment would build. It does not cause that
implementation to exist.

## 2. Purpose

Translate Cross-Claim Matching Decisions 3 (Relationship Model), 4
(Relationship Taxonomy — structure only), and 5 (Relationship Evidence)
into a precise, implementable specification for the Relationship +
Relationship Evidence increment — the third stage in the approved
dependency order (§18) — without inventing new architecture, without
silently promoting proposed vocabulary into historical Founder approval,
and without authorizing implementation.

## 3. Authority

This Contract is produced under "Founder Authorization — Draft the
Relationship + Relationship Evidence Implementation Increment Contract."
Its authoritative architectural input is
`docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md`
(commit `ef82697`, pushed to `origin/main`) — specifically Decisions 3,
4, 5, and 7, and the sixteen invariants in its §9. Its Implementation
Readiness Inventory is the "Relationship + Relationship Evidence
Contract Pre-Drafting Audit" produced immediately prior in this same
session. Neither the three uncommitted Cross-Claim Matching working
documents (Design Track Draft, Design Decision Proposal, Founder
Decision Audit) nor this Contract itself carry independent Founder
approval for anything beyond what §4 below states — they are read as
evidence and precedent, not as authority.

This Contract was subsequently reviewed under "FOUNDER DIRECTIVE —
RELATIONSHIP + RELATIONSHIP EVIDENCE CONTRACT FINAL REVIEW," which
returned a PASS WITH REQUIRED CLARIFICATIONS verdict and two findings.
Both were resolved by "FOUNDER DECISION — RESOLVE RELATIONSHIP TYPE
VOCABULARY AMBIGUITY": (1) `same_claim` and `unrelated` are excluded
from the formalized Relationship Type vocabulary (§11.1); (2) the
ClaimVersion-granularity citation is corrected to its actual precedent
(§10). This correction is document-only and does not reopen or modify
the approved three-axis architecture (Decision 4) and does not
authorize implementation (§9, §23 unchanged).

## 4. Baseline

```
branch:       main
HEAD:         ef8269764c0f2fe7922208f5ef4beaf2e80283ff
origin/main:  ef8269764c0f2fe7922208f5ef4beaf2e80283ff
divergence:   0/0
```
Protected file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`: MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, untouched by producing
this Contract.

## 5. Architectural Baseline — Category A: Already Founder-Approved Architecture

The following are **ALREADY FOUNDER-APPROVED ARCHITECTURE**, restated
verbatim in substance from the operative decision, and are **not**
reopened, reinterpreted, or extended by this Contract:

- Relationship is a **first-class external artifact**: immutable
  identity, evidence-grounded, external to Claim and ClaimVersion, never
  mutates a ClaimVersion, never merges Claims, never becomes a Claim,
  never becomes Evidence, separate from D3 Inference, separate from C3
  Claim Confirmation (Decision 3).
- When eventually built, Relationship is **intended to be a persisted
  record** (Decision 3) — persistence *implementation* was not itself
  authorized by Decision 3; this Contract is what supplies that
  implementation specification, within the envelope Decision 3 fixes.
- Relationship classification uses **three independent axes**:
  Relationship Type, Certainty, Confirmation State (Decision 4).
- `same_subject` and `same_attribute` are **structural/pipeline
  predicates**, never Relationship Type values (Decision 4).
- The prior flat 12-value enum is **rejected** and must not be
  reintroduced (Decision 4).
- Relationship Evidence is its own **independent abstraction**, distinct
  from evidence for Claim A, evidence for Claim B, and candidate-
  generation signal. `Candidate Signal ≠ Evidence` (Decision 5).
- A Relationship without sufficient evidence must not be treated as an
  established fact (Decision 5).
- Matching-Hypothesis Confirmation will be an **independent third
  confirmation mechanism**, separate from C3 and D3, confirming the
  **Relationship Type classification only** (Decision 6) — its
  workflow/API is not built by this Contract (§9, §16).
- The approved dependency order is `Temporal Validity → Context →
  Relationship + Relationship Evidence → Matching-Hypothesis Confirmation
  → Cross-Claim Matching Implementation → Living User Model` (Decision
  8/§18 below) — not reversed, not collapsed, not reopened.
- **Decision 7 (Implementation Authorization) remains NOT APPROVED.**
- All sixteen non-negotiable invariants in the operative decision's §9
  remain in force, carried forward verbatim in §19 below.

## 6. Decisions Formalized by This Contract

The following are decisions this Contract is now making **within** the
approved architecture above. None of them were independently
Founder-ratified before this Contract; each is explicitly labeled:

> **FORMALIZED BY THIS CONTRACT — NOT RETROACTIVELY CLAIMED AS PRIOR
> FOUNDER APPROVAL.**

1. The exact Relationship Type value list: `successive_state`,
   `refinement`, `contradiction`, `contextual_variation`,
   `related_fact` — see §11. `same_claim` and `unrelated` are
   explicitly excluded from this axis, per Founder decision (§11.1) —
   not formalized as Relationship Type values by this Contract.
2. The exact Certainty value list: `certain`, `uncertain`, `unknown` —
   see §11.
3. The exact Confirmation State value list: `not_required`, `pending`,
   `confirmed`, `rejected` — see §11.
4. The exact Relationship core field contract — see §10.
5. The exact Relationship Evidence field contract — see §12.
6. The selected persistence structure (§13) and the rationale for
   selecting it over two other viable options.
7. The exact repository/module boundary (§14).
8. The exact migration shape (§17).
9. The exact test matrix (§20) and acceptance criteria (§22).

**These formalizations are proposals this Contract makes for Founder
review, exactly as every prior Contract in this dependency chain
(Temporal Validity, Context) formalized their own field shapes without
those shapes having been independently pre-approved by name.** Approving
this Contract approves these formalizations as the specification a
future implementation must follow — it still does not authorize that
implementation to begin (§9, §23).

## 7. Precedents Reviewed

Read in full, directly, from the committed repository (not assumed from
memory):

- `docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-IMPLEMENTATION-INCREMENT-CONTRACT.md`
  and `PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md`
  — source of the "immutable core + append-only lifecycle/state events,
  effective state derived, never cached" pattern Decision 3 analogizes
  to.
- `docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md`
  — source of this Contract's section structure, gate language, Always
  Explicit convention, and honest-limitation reporting style.
- `docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md`
  — confirms the same conventions were applied a second time consistently.
- `apps/api/src/persistence/schema/personal-intelligence-inference.schema.ts` —
  `personalIntelligenceInferenceEvidenceReferences` (evidence-junction
  precedent: composite PK, ownership FK to parent, single-column FK to
  the referenced table, no cross-schema-file FK to avoid circular
  imports) and `personalIntelligenceInferenceLifecycleEvents`
  (append-only event-log precedent: `sequence: integer` via
  `INSERT...SELECT`, `unique(parentId, sequence)`, `check()` constraints
  for enum-shaped text columns).
- `apps/api/src/persistence/schema/personal-intelligence.schema.ts` —
  `personalIntelligenceClaimConfirmationEvents` — the same append-only
  event-log pattern, applied to C3.
- `apps/api/src/core/personal-intelligence/personal-intelligence-claim-confirmation.model.ts`
  — the `deriveEffectiveConfirmation()` pure-function pattern: effective
  state is never a stored mutable column, always derived from the latest
  event by `sequence`. This file's own header comment is also the
  source, cited directly, of the version-vs-claim reasoning applied in
  §10 below: a C3 confirmation event references the specific
  `claimVersionId` confirmed, not only the logical `claimId`, "so a
  confirmation of one ClaimVersion must never silently carry forward to
  a later version created by a correction or supersession" — citing
  `docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-IMPLEMENTATION-INCREMENT-CONTRACT.md`
  §3.3.1. This Contract applies the same reasoning to
  `sourceClaimVersionId`/`targetClaimVersionId` (§10) — this is the
  correct precedent for that choice, not the D3 Promotion Contract
  (which establishes `inferenceId` as a per-version, causal-linkage
  column, but does not itself make the no-silent-carry-forward
  argument).
- Confirmed by direct search: **no controller anywhere in this codebase
  references any Personal Intelligence use-case** (`grep` for
  `PersonalIntelligenceClaimUseCase`/`PersonalIntelligenceClaimConfirmation`
  across `*.controller.ts` returns nothing). C3's own implementation is
  **repository-only**: core model, core repository interface + token,
  Drizzle implementation, and an `*.app-composition.spec.ts` proving DI
  wiring — no application use-case class, no HTTP layer.

## 8. Scope

**IN SCOPE**
- Relationship core domain model (`.model.ts`).
- Relationship Evidence domain model (`.model.ts`).
- Relationship core repository interface + token + Drizzle
  implementation.
- Relationship Evidence repository interface + token + Drizzle
  implementation.
- Two new Drizzle schema tables + one additive migration.
- Module wiring (`persistence.module.ts`) + an app-composition spec
  proving it, mirroring the C3 precedent exactly.
- Structural boundary tests proving the invariants in §19.
- Unit tests at the model/repository-fake level.

**OUT OF SCOPE**
- Any classification logic that computes a Relationship Type, Certainty,
  or Confirmation State value from claim content (candidate generation,
  matching pipeline, similarity, ranking, automatic contradiction
  detection, automatic relationship discovery — all Decision 7
  territory).
- Matching-Hypothesis Confirmation workflow, API, or any mechanism that
  *changes* a Relationship's Confirmation State after creation (Decision
  6 — a separate, later increment; §9).
- Cross-Claim Matching pipeline/implementation.
- Living User Model integration.
- Any AI/runtime integration.
- Any HTTP controller/API surface (no precedent for one exists anywhere
  in PIC today — §7).
- Any change to Claim, ClaimVersion, Context, Temporal Validity,
  Evidence, D3 Inference, Memory, Personal State, or AI Gateway
  semantics.
- Confidence algorithm.
- UI of any kind.
- Production rollout beyond the standard, additive migration.

**SEPARATE FOUNDER AUTHORIZATION REQUIRED**
- Implementation of anything in this Contract (Decision 7; §9, §23).
- Any future change to the value lists formalized in §6/§11, once this
  Contract is approved and, later, implemented.
- The Matching-Hypothesis Confirmation increment itself (next stage,
  §18).

## 9. Explicit Decision-7 Non-Authorization Boundary

**This Contract is a design/specification artifact. It does not itself
authorize implementation. Cross-Claim Matching Decision 7 (Implementation
Authorization) remains NOT APPROVED. Writing, reviewing, approving, or
committing this Contract does not constitute Implementation
Authorization. A separate Founder Execution Directive is required before
any implementation work may begin.**

Three distinct states, not to be confused with one another anywhere in
this document or by any future reader of it:

| State | Meaning | Achieved by this Contract? |
|---|---|---|
| **Contract completed** | This document exists, is internally consistent, and specifies an implementable increment | Yes, once approved |
| **Implementation completed** | The tables, code, and tests described here actually exist and pass verification | **No** |
| **Implementation authorized** | A separate Founder Execution Directive permits work to begin | **No** |

A Relationship Type field existing in this specification does **not**
authorize any logic that computes its value. A persisted Relationship
artifact may exist as a domain/data shape without authorizing the
matching engine that would ever populate it with a real, evidence-backed
classification. Both distinctions are structural properties of this
Contract's scope (§8), not merely stated intentions.

## 10. Domain Model — Relationship

| Field | Meaning | Type | Nullable? | Mutable? | Source of truth | Authorship | Participates in uniqueness? | Requires an append-only event to change? |
|---|---|---|---|---|---|---|---|---|
| `id` | Relationship identity | `string` | No | No | Application-generated at creation | System | Yes (PK) | N/A — never changes |
| `userId` | Owning user (ownership boundary, mirrors every other PIC artifact) | `string` | No | No | Caller-supplied at creation, verified against both referenced ClaimVersions' own `userId` at the repository layer | System | No | N/A |
| `sourceClaimVersionId` | The first of the two specific ClaimVersions related — **a version, not a Claim**; the choice to reference at version-granularity is this Contract's own formalization (§6 item 4), justified by the C3 Claim Confirmation precedent's own version-vs-claim reasoning (§7) | `string` | No | No | Caller-supplied at creation | Caller | No | N/A |
| `targetClaimVersionId` | The second specific ClaimVersion related | `string` | No | No | Caller-supplied at creation | Caller | No | N/A |
| `relationshipType` | One value from the Relationship Type axis (§11.1) | `string` (enum-constrained) | No | No | Caller-supplied at creation, Always Explicit | Caller (may reflect an AI hypothesis, a deterministic check, or a user declaration — see `provenance`) | No | No — immutable once set (§13) |
| `certainty` | One value from the Certainty axis (§11.2) | `string` (enum-constrained) | No | No | Caller-supplied at creation, Always Explicit | Caller | No | No — immutable once set (§13); re-evaluation is out of scope (§8) |
| `confirmationState` | One value from the Confirmation State axis (§11.3) | `string` (enum-constrained) | No | No | Caller-supplied at creation, Always Explicit | Caller | No | No in this increment — a future Matching-Hypothesis Confirmation increment will define its own append-only mechanism to *change* this value, mirroring C3, without altering this table (§9, §13, §18) |
| `provenance` | Who/what established this relationship record | `string` (enum-constrained: `ai_hypothesis` \| `system_derived` \| `user_declared` — §6 item 4, FORMALIZED BY THIS CONTRACT) | No | No | Caller-supplied at creation, Always Explicit | Caller | No | N/A |
| `createdAt` | Row-insertion time | `Date` (timestamp with time zone) | No | No | Application-generated at creation | System | No | N/A |

**Rationale for every field**: `id`/`userId`/`createdAt` mirror the
universal convention already used by every other PIC row in this
codebase. On `sourceClaimVersionId`/`targetClaimVersionId`, two things
must be kept distinct: **(A) what Decision 3 requires** — that a
Relationship links the two relevant ClaimVersions it relates, as part
of its core definition of what a Relationship *is* — versus **(B) what
this Contract formalizes** — the specific field-level choice to
reference by ClaimVersion *id* directly (rather than by Claim id, or by
some other identifier shape), justified by the C3 precedent cited in
§7, not by Decision 3 itself, which does not specify this granularity.
`relationshipType`/
`certainty`/`confirmationState` are required by Decision 4's three-axis
structure. `provenance` is required because Decision 5/6's own reasoning
(an AI-hypothesized relationship must remain distinguishable from a
system-derived or user-declared one, mirroring the Provenance axis
discipline already applied to Claims) has no home on this record without
it, and every other epistemic artifact in this codebase carries a
provenance-shaped field.

**Fields deliberately NOT included, with rationale:**
- `effectiveFrom`/`effectiveTo` on Relationship — proposed in the
  uncommitted working material (§8.3 of the Design Decision Proposal),
  but **not included here**: nothing in this increment's authorized
  scope (§8) ever reads or needs a temporal-relationship-type window,
  and no Founder decision names it as required now. A future Contract
  may add it, additively, if a concrete, evidenced need arises —
  consistent with Minimum Necessary Architecture.
- A uniqueness constraint on `(sourceClaimVersionId, targetClaimVersionId,
  relationshipType)` — considered and **not required**: Decision 3's own
  working-material analysis (§8.4) explicitly states multiple
  simultaneous relationships between the same pair must be allowed; a
  naive uniqueness constraint on the triple would additionally prevent
  two *identical* classifications from coexisting, which no source
  requires preventing either. This is ordinary implementation judgment,
  not a Founder-level question — left unconstrained.
- A canonical ordering rule for `(source, target)` — not resolved here;
  interpreting whether a given Relationship Type is symmetric or
  directional is a classification-logic question, explicitly out of
  scope (§8), deferred to the future Cross-Claim Matching Implementation
  Contract.

## 11. Relationship Taxonomy

The three-axis **structure** is Founder-approved (Decision 4, §5 above)
and is preserved exactly. The specific values below are **FORMALIZED BY
THIS CONTRACT — NOT RETROACTIVELY CLAIMED AS PRIOR FOUNDER APPROVAL**
(§6).

### 11.1 — Axis 1: Relationship Type

| Value | Meaning |
|---|---|
| `successive_state` | Same Subject+Attribute, non-overlapping effective periods; the later claim is an update, not a contradiction |
| `refinement` | The target claim narrows/qualifies the source without contradicting it |
| `contradiction` | Same Subject+Attribute, overlapping effective periods, compatible/absent Context, incompatible Values |
| `contextual_variation` | Same Subject+Attribute, overlapping periods, apparently incompatible Values, but materially different Context |
| `related_fact` | Different Attribute, but evidence or Context links the two claims meaningfully |

`same_subject` and `same_attribute` are **not** values on this axis —
they are structural/pipeline predicates checked before a Relationship is
even considered (Decision 4). They must never be written to the
`relationshipType` column, and no `check()` constraint on this column
may include them.

**`same_claim` and `unrelated` are also excluded from this axis, per
explicit Founder decision** ("FOUNDER DECISION — RESOLVE RELATIONSHIP
TYPE VOCABULARY AMBIGUITY," resolving Finding #1 of the Contract Final
Review): `same_claim` is a structural/trivial-identity condition (two
references resolving to the literal same ClaimVersion row), not a
Relationship Type — it must never be persisted as one, mirroring exactly
why `same_subject`/`same_attribute` are excluded above. `unrelated`
represents the **absence** of a Relationship, not a fact about one — it
must never be persisted as a Relationship record/type; the correct
representation of "evaluated and found not related" is that no
Relationship row is created at all, not a row with `relationshipType =
'unrelated'`. Neither exclusion reopens or modifies the approved
three-axis architecture (Decision 4) — both were already flagged as
`[PROPOSED vocabulary, not yet formalized]` by the operative decision,
and this Contract, per the Founder's explicit resolution, formalizes the
Relationship Type axis to **exactly five values**: `successive_state`,
`refinement`, `contradiction`, `contextual_variation`, `related_fact`.
These five, like the excluded two, were never independently
Founder-approved by name before this Contract (§6) — this section
formalizes them now, it does not retroactively claim they were already
approved by Decision 4.

### 11.2 — Axis 2: Certainty

| Value | Meaning |
|---|---|
| `certain` | The classification is well-supported |
| `uncertain` | Evaluated, but evidence is insufficient to classify with confidence |
| `unknown` | The Certainty of the classification has not been established |

**Orthogonality, verified**: no `certainty` value implies or is implied
by any `relationshipType` value — a `contradiction` may be `certain` or
`uncertain`; an `uncertain` classification may describe any type. This
Contract introduces no code path that derives one from the other.

### 11.3 — Axis 3: Confirmation State

| Value | Meaning |
|---|---|
| `not_required` | This Relationship does not require user confirmation |
| `pending` | Confirmation is required and has not yet occurred |
| `confirmed` | The user has confirmed this Relationship's classification |
| `rejected` | The user has rejected this Relationship's classification |

**Orthogonality, verified**: no `confirmationState` value implies or is
implied by `relationshipType` or `certainty` — a `certain` classification
may still be `pending` (e.g., a policy requiring confirmation regardless
of certainty); an `uncertain` one may be `not_required`. This Contract
defines the axis and its four values as **data only** — it does not
define, and explicitly excludes (§8, §9), any workflow, policy, or
mechanism that decides which value a given Relationship receives or that
transitions a Relationship from one value to another after creation.
Every value here is supplied explicitly by the caller at `create()` time
(Always Explicit, §10), exactly like every other field.

### 11.4 — Forbidden combinations

None are proposed. This Contract does not authorize any check
constraint that couples two axes together (e.g., forbidding
`contradiction` + `not_required`) — doing so would itself be a
classification-policy decision, out of scope (§8).

## 12. Domain Model — Relationship Evidence

| Field | Meaning | Type | Nullable? | Mutable? | Source of truth | Ownership |
|---|---|---|---|---|---|---|
| `id` | Relationship Evidence row identity | `string` | No | No | Application-generated at creation | — |
| `relationshipId` | The Relationship this evidence supports | `string` | No | No | Caller-supplied at creation | Verified via ownership FK to the Relationship row (§13) |
| `userId` | Owning user | `string` | No | No | Caller-supplied at creation | Verified against the referenced Relationship's own `userId` |
| `sequence` | Append-only ordering within one `relationshipId`, computed the same `INSERT...SELECT` way as every other sequence column in this schema | `integer` | No | No | System-computed at creation | — |
| `description` | Free-text description of what this evidence asserts and why it grounds the Relationship's classification (no evidenced fixed vocabulary exists — same reasoning already applied to Claim-level Context's `situationSetting`/`timeOfDay`) | `string` (`text`) | No | No | Caller-supplied at creation | — |
| `evidenceVersionId` | Optional reference to an existing `evidence_versions` row, when this Relationship Evidence happens to cite one | `string \| null` | Yes | No | Caller-supplied at creation | Ownership verified at the repository layer, mirroring the existing `evidenceVersionId` pattern on ClaimVersion |
| `provenance` | `ai_hypothesis` \| `system_derived` \| `user_declared` (§6 item 4, same enum as Relationship's own `provenance`) | `string` (enum-constrained) | No | No | Caller-supplied at creation | — |
| `createdAt` | Row-insertion time | `Date` | No | No | Application-generated | — |

**Rationale**: `id`/`userId`/`createdAt`/`sequence` mirror the
established append-only event-log convention (§7) — Relationship
Evidence's own lifecycle is append-only ("evidence is added as
classification is refined, never overwritten," per the working
material's §11, adopted here as this Contract's own formalized design,
not as inherited prior approval). `relationshipId` is the mandatory
link back to the Relationship it supports. `description` is the minimum
viable content representation — a free-text field, exactly mirroring how
Claim-level Context was kept free-text rather than inventing an
unevidenced structured vocabulary. `evidenceVersionId` is optional
because not all Relationship Evidence cites an existing EvidenceVersion
— the working material's own example ("temporal periods do not overlap")
is a system-derived deterministic-check result with nothing in
`evidence_versions` to point to; making this field mandatory would force
fabricating a reference where none exists. `provenance` mirrors the
Relationship's own provenance discipline, applied one level down.

**Explicitly NOT included:**
- No scoring, weighting, or quality field of any kind (directive §7 —
  "do not implement evidence quality algorithms").
- No separate confirmation state for Relationship Evidence itself — per
  the working material's own reasoning (adopted here), confirming the
  Relationship implicitly covers its cited evidence; a combinatorial
  confirmation-of-confirmations mechanism is not built.
- No repurposing of `evidence`/`evidence_versions` tables' own columns —
  `evidenceVersionId` is a nullable *reference*, not a merge of schemas
  (directive §7's explicit instruction).

## 13. Persistence Design

Three options were compared, per the authorizing directive's explicit
requirement, before selection:

| | **Option A — single mutable core table** | **Option B — immutable core + append-only state-event table(s)** | **Option C — B + independent Relationship Evidence table** |
|---|---|---|---|
| Immutability | **Fails** — a mutable `certainty`/`confirmationState` column would recreate exactly the "cached/materialized current-status column" pattern D3 §21 explicitly forbade for Inference | Satisfied — core facts immutable, state changes as new event rows | Satisfied — same as B |
| Auditability | **Fails** — no history of how certainty/confirmation changed over time | Satisfied — full event history, mirroring D3/C3 | Satisfied — same as B, plus Relationship Evidence has its own append-only trail |
| Consistency with D3/C3 precedent | Low — no existing precedent in this codebase uses a mutable current-state column for an epistemic artifact | High — directly mirrors two proven, already-implemented patterns | High — same, plus mirrors the evidence-junction precedent too |
| Schema complexity | Lowest (1 table) | Medium (2–4 tables, depending on how many axes get their own event table) | Higher (3+ tables) |
| Query complexity | Lowest | Medium — reading "current" certainty/confirmation requires a derive-from-latest-event query, mirroring `deriveEffectiveConfirmation()` | Same as B for Relationship; Relationship Evidence read is a simple ordered scan |
| Future confirmation compatibility | Poor — retrofitting an event log onto an already-mutable column later is messier than building on an immutable one | Good | Good |
| Temporal Validity compatibility | N/A (no temporal field is included at all, §10) | N/A | N/A |
| Migration complexity | Lowest | Medium | Higher |
| Testability | Lower — mutation paths are harder to prove absent structurally | Higher — structural tests can prove "no UPDATE statement touches this table" cleanly | Higher, same |
| Risk of accidental mutation | **High** — a mutable column is one missed code review away from being written to outside the intended path | Low | Low |

**Selected: a variant of Option B/C, deliberately minimized against this
increment's actual authorized scope (§8):**

1. **`personal_intelligence_relationships`** — a single, fully immutable
   core table (§10). Every column, including `relationshipType`,
   `certainty`, and `confirmationState`, is set exactly once at
   `INSERT` time and never updated. **No append-only state-event table
   is created for Certainty or Confirmation State in this increment.**
   Rationale: nothing this Contract authorizes (§8) ever needs to
   *change* a Relationship's Certainty or Confirmation State after
   creation — re-evaluation logic and the Matching-Hypothesis
   Confirmation workflow are both explicitly out of scope and belong to
   later, separately authorized increments (§9, §18). Building an
   event-log mechanism now, with no code path in this increment that
   would ever write a second event to it, would be exactly the kind of
   unevidenced, speculative machinery the project's Minimum Necessary
   Architecture principle exists to prevent. **This is a deliberate
   departure from the uncommitted working material's own proposal**
   (which proposed append-only state events for these two axes) — that
   proposal was never Founder-ratified (§C of the pre-drafting audit),
   and this Contract selects the smaller design the directive's own
   instruction requires ("select the smallest architecture that fully
   satisfies the Founder-approved requirements... do not select a design
   simply because it is more sophisticated").
   Deferred, explicitly: the future Matching-Hypothesis Confirmation
   Contract will define its own mechanism for changing
   `confirmationState` — most plausibly a new, additive, append-only
   `personal_intelligence_relationship_confirmation_events` table
   directly mirroring C3's own shape, referencing `relationshipId`
   exactly as C3's table references `claimId`/`claimVersionId` — without
   ever altering this table's existing columns. Similarly, the future
   Cross-Claim Matching Implementation Contract would define how a
   "re-evaluation candidate" (Invariant 16) actually gets processed,
   which is not decided or built here.
2. **`personal_intelligence_relationship_evidence`** — a separate,
   append-only table (§12), because Decision 5 requires Relationship
   Evidence to be an independent abstraction with its own append-only
   lifecycle, distinct from the Relationship core. This is not "added
   sophistication" beyond what's needed — it is the minimum structure
   Decision 5 itself requires; a design without it would fail to satisfy
   already-approved architecture, not merely be less elegant.

**This selected design is best understood as Option A's *immutability*
combined with Option C's *evidence independence*, deliberately omitting
Option B/C's event-log machinery for axes that nothing in this increment
ever mutates.** It satisfies every invariant in §19, is directly
precedented by existing, working code in this repository (§7), and adds
no mechanism this increment's own scope does not need.

## 14. Repository / Application / API Boundary

Per §7's confirmed precedent (C3 is repository-only; no PIC controller
exists anywhere in this codebase):

- **Core repository interfaces required**: `PersonalIntelligenceRelationshipRepository`
  (`core/personal-intelligence/personal-intelligence-relationship.repository.ts`
  + `.repository.token.ts`) and
  `PersonalIntelligenceRelationshipEvidenceRepository`
  (`core/personal-intelligence/personal-intelligence-relationship-evidence.repository.ts`
  + `.repository.token.ts`) — mirroring the exact token-file convention
  already used for Claim and Claim Confirmation.
- **Infrastructure implementations required**:
  `infrastructure/persistence/personal-intelligence-relationship.repository.ts`
  and `personal-intelligence-relationship-evidence.repository.ts`
  (Drizzle-backed).
- **Module wiring**: both repositories bound in
  `infrastructure/persistence/persistence.module.ts`, exactly like every
  existing PIC repository binding.
- **Application use-case class**: **not required, not created.** No
  precedent for one exists for any PIC artifact at this stage (C3 has
  none); nothing in this increment's scope (§8) needs orchestration logic
  beyond what the repository interface itself provides. If a future
  increment (e.g., Matching-Hypothesis Confirmation) needs one, it will
  define it in its own Contract.
- **API/Controller layer**: **not required, not created.** Confirmed by
  direct search (§7) that no PIC use-case is ever referenced by any
  controller in this codebase — there is no existing DTO/HTTP boundary to
  extend, and inventing one here would be scope expansion beyond what
  exists, exactly as the Temporal Validity Contract concluded for its own
  increment (§16 of that Contract).
- **Verification of this boundary decision**: an
  `*.app-composition.spec.ts` proving the two new repositories resolve
  correctly through DI, mirroring
  `personal-intelligence-claim-confirmation.app-composition.spec.ts`
  exactly.

## 15. Security / Ownership / Privacy Constraints

- Every row in both new tables carries `userId`, verified against the
  referenced parent/related rows' own `userId` at the repository layer,
  inside the same transaction — the exact, already-established pattern
  used for `evidenceVersionId`/`inferenceId` on ClaimVersion and for
  every existing PIC junction/event table (§7).
- `sourceClaimVersionId`/`targetClaimVersionId` ownership (that both
  referenced ClaimVersions belong to the creating `userId`) is verified
  atomically via `INSERT...SELECT...WHERE`, mirroring the exact pattern
  already proven for `evidenceVersionId`/`inferenceId` on `create()`.
- `relationshipId` ownership on `personal_intelligence_relationship_evidence`
  is verified via a composite foreign key to
  `(personal_intelligence_relationships.id, .user_id)`, mirroring
  `personal_intelligence_claim_confirmation_events`'s own FK to
  `(personal_intelligence_claims.id, .user_id)` exactly.
- No cross-user reference is representable: every FK either targets a
  row already scoped to the same `userId` (verified at the app layer
  where no composite unique key exists to FK against directly, per
  precedent) or is itself ownership-checked via a composite FK.
- No new field on either table stores anything beyond what §10/§12
  specify — no free-form JSON blob, no denormalized copy of ClaimVersion
  content, minimizing incidental data exposure.

## 16. Non-Scope (restated as a boundary list)

No unrelated refactoring; no change to `ClaimVersion`, `Evidence`,
`Context` (Claim-level or Fusion-Engine), `Temporal Validity`, `D3
Inference`, `Memory`, `Personal State`, or `AI Gateway` semantics; no
opportunistic cleanup of any existing file; no schema change to any
existing table beyond what Temporal Validity/Context already added.

## 17. Migration Requirements

**Additive only.** The future migration (not created by this Contract)
must:
- Add exactly two new tables:
  `personal_intelligence_relationships` and
  `personal_intelligence_relationship_evidence`, both under the
  `decivexa` schema, matching every existing table's schema-qualification
  convention.
- Add no column to any existing table.
- Add no destructive change of any kind — no `DROP`, no `ALTER ... TYPE`,
  no `ALTER ... NOT NULL` on any existing column.
- Use `text` PKs (`id`) matching the universal convention; `integer`
  `sequence` on the evidence table (not a Postgres identity/serial
  column, matching precedent); `text` enum-constrained columns via
  `check()`, not native Postgres enum types (matching every existing
  enum-shaped column in this schema); `timestamp with time zone` for
  `createdAt` (matching every existing temporal column).
- Foreign keys: `personal_intelligence_relationships.user_id` →
  `users.id` (`onDelete: "restrict"`, matching precedent);
  `personal_intelligence_relationship_evidence.relationship_id` →
  composite `(personal_intelligence_relationships.id, .user_id)`
  (`onDelete: "restrict"`); `personal_intelligence_relationship_evidence.evidence_version_id`
  → `evidence_versions.id`, nullable, single-column (matching the
  existing `evidenceVersionId` precedent — Evidence exposes no
  composite unique key to FK against with ownership).
  `sourceClaimVersionId`/`targetClaimVersionId` → single-column FK to
  `personal_intelligence_claim_versions.id` (matching the existing
  `evidenceVersionId`/`inferenceId` precedent — `claim_versions` exposes
  no composite unique key either).
- Indexes: `unique(relationship_id, sequence)` on the evidence table,
  matching the established append-only-event uniqueness precedent
  exactly.
- Migration numbering: next sequential number after `0013` — i.e.
  `0014_relationship_and_relationship_evidence.sql` (exact name TBD at
  generation time via `npm run db:generate -- --name <name>`, following
  the same drizzle-kit, schema-diff-based process used for every prior
  migration).
- **Generated SQL must be reviewed line-by-line before acceptance**,
  exactly as every prior increment's verification report has done.
- **Not created by this Contract.** A future, separately authorized
  implementation pass generates it.

## 18. Dependency Order

Restated exactly from the operative decision's §8, unmodified:

```
Temporal Validity → Context → Relationship + Relationship Evidence →
Matching-Hypothesis Confirmation → Cross-Claim Matching Implementation →
Living User Model
```

Temporal Validity (`587a854`) and Context (`2464bed`) are already
implemented and committed. This Contract addresses the third stage.
**This Contract does not reorder, collapse, or bypass any stage** — it
does not build Matching-Hypothesis Confirmation, Cross-Claim Matching, or
Living User Model, and explicitly defers the mechanics that those later
stages will need (§13).

## 19. Non-Negotiable Invariants

Carried forward from the operative decision's §9, unweakened, each with
its verification method for this specific increment:

| # | Invariant | Affected boundary | Implementation constraint | Verification method |
|---|---|---|---|---|
| 1 | Claims never merge | Claim/ClaimVersion | No merge operation exists anywhere in the code this increment adds | Structural test: absence of any claim-merge write path |
| 2 | ClaimVersions remain immutable | ClaimVersion | No UPDATE to any ClaimVersion column from Relationship/Relationship-Evidence code | Structural test, mirroring `personal-intelligence-claim-temporal-validity.structural.spec.ts` |
| 3 | Relationship never becomes Claim | Relationship | No write path from `personal_intelligence_relationships` to Claim/ClaimVersion tables | Structural test |
| 4 | Relationship never becomes Evidence | Relationship, Evidence | No write path from Relationship tables to `evidence`/`evidence_versions` | Structural test |
| 5 | Candidate signal never becomes Evidence | Relationship Evidence | Nothing in this increment's code ever writes a "plausibility signal" as if it were `description`/`evidenceVersionId` content — this increment builds no candidate-generation code at all (§8), so the risk is structurally absent by scope, not merely guarded against | Structural test confirming no candidate-generation code path exists in the added files |
| 6 | AI hypothesis never silently becomes fact | Relationship, Confirmation | An `ai_hypothesis`-provenance Relationship persists with whatever `confirmationState` the caller explicitly supplied (§11.3) — no code path defaults it to `confirmed` | Unit test on `create()` default-free behavior |
| 7 | Contradiction never automatically resolved | Relationship lifecycle | No mechanism in this increment transitions any Relationship's state after creation at all (§13) — invariant holds by scope | Forward-looking; not behaviorally testable this increment because no transition mechanism exists yet — stated honestly, not claimed as tested |
| 8 | Context variation is not automatically contradiction | Relationship Type assignment | No classification logic exists in this increment (§8) — both `contradiction` and `contextual_variation` are equally representable, unprivileged values on the same axis | Model-level representability test (both values constructible) |
| 9 | Confidence and uncertainty remain distinct | Relationship, Certainty axis | No `confidence` field exists anywhere on Relationship/Relationship Evidence; `certainty` is never derived from or written to a confidence scalar | Structural/model test |
| 10 | Confirmation is independent from provenance | Relationship, Confirmation | `confirmationState` and `provenance` are set independently by the caller at `create()`; no code path derives one from the other | Unit test |
| 11 | Matching never mutates D1/D2/D3 semantics | Claim, Inference | No write path touches `personal_intelligence_inferences`, its lifecycle-events table, or any Claim epistemic field | Structural test, mirroring existing D3-boundary tests |
| 12 | Living User Model cannot bypass Matching semantics | (N/A this increment) | Nothing to enforce yet — Living User Model does not exist | Not applicable; recorded as a forward constraint only |
| 13 | Memory boundary remains untouched | Memory | No import of `memory-record`/`memory.schema` in any added file | Structural test, mirroring existing pattern |
| 14 | Personal State boundary remains untouched | Personal State | No import of `personal-state.*` in any added file | Structural test, mirroring existing pattern |
| 15 | AI Gateway remains untouched | AI Gateway | No file under `infrastructure/ai*` referenced or modified | Structural test / diff-boundary check |
| 16 | A Relationship classification is never silently re-derived after evidence changes | Relationship, Relationship Evidence | No re-evaluation mechanism exists in this increment (§13) — invariant holds by scope, since there is no code path that could re-derive anything | Forward-looking; not behaviorally testable this increment — stated honestly |

**Invariants 7, 12, and 16 are intentionally forward-looking and cannot
be behaviorally tested in this increment**, because the mechanisms they
guard against (contradiction resolution, Living User Model consumption,
silent re-derivation) do not yet exist in any form this increment builds.
This is stated explicitly here rather than claiming a test proves
something no code path could yet violate.

## 20. Testing Requirements

**Model structure**: Relationship and Relationship Evidence types are
constructible with every field in §10/§12, including every representable
enum value on all three taxonomy axes (§11).

**Persistence structure**: schema columns match §10/§12/§17 exactly;
FKs/indexes/checks match §15/§17.

**Immutability**: structural test proving no `UPDATE` statement exists
anywhere in the added repository files for either new table.

**Ownership**: unit tests proving `create()` rejects (or the atomic
`INSERT...SELECT` returns no row for) a `sourceClaimVersionId`/
`targetClaimVersionId`/`relationshipId`/`evidenceVersionId` belonging to
a different `userId`, mirroring the existing ownership-rejection test
pattern for `evidenceVersionId`/`inferenceId`.

**Relationship ↔ ClaimVersion boundary**: structural test proving no
write path exists from Relationship code into
`personal_intelligence_claim_versions`.

**Relationship ↔ Evidence boundary**: structural test proving no write
path exists from Relationship/Relationship-Evidence code into
`evidence`/`evidence_versions` (only a read-only, nullable reference is
permitted).

**Relationship ↔ Inference boundary**: structural test proving no
reference to `personalIntelligenceInferenceLifecycleEvents` or
`deriveEffectiveStatus` exists in any added file, mirroring the
established D3-boundary structural test pattern.

**Candidate-signal/evidence separation**: structural test confirming no
candidate-generation code exists in any added file (Invariant 5).

**Taxonomy orthogonality**: unit tests constructing every combination of
(Relationship Type × Certainty × Confirmation State) that is
representable per §11, confirming none is rejected by a coupling
constraint that does not exist (§11.4), and confirming `same_subject`/
`same_attribute`/`same_claim`/`unrelated` are never accepted as
`relationshipType` values (a `check()`-constraint rejection test) — the
first two as structural predicates (Decision 4), the latter two per the
Founder's exclusion decision (§11.1).

**Confirmation independence**: unit test proving `confirmationState` and
`provenance` vary independently across `create()` calls with no observed
correlation enforced by code.

**Memory boundary / Personal State boundary / AI Gateway boundary**:
structural tests, mirroring the exact pattern already used in
`personal-intelligence-claim-temporal-validity.structural.spec.ts` and
`personal-intelligence-claim-context.structural.spec.ts`.

**Migration correctness**: the generated SQL is read and compared
statement-by-statement against §17's exact requirements before
acceptance.

**Regression safety**: the full existing suite (currently 435 tests)
passes unmodified in substance; the exact before/after count is reported.

## 21. Verification / Evidence Requirements

| Category | Requirement |
|---|---|
| Static evidence | `npm run typecheck` — 0 errors, reported exactly |
| Build evidence | `npm run build` — success, reported exactly |
| Test evidence | `npm run test` — exact new pass count, exact total, 0 failures |
| Migration evidence | Generated `.sql` quoted in full in the completion report, exactly as done for `0011`–`0013` |
| Static structural evidence | Every structural test in §20 individually named and its result stated |
| Runtime evidence | **No live PostgreSQL instance is available in this environment** — this must be stated explicitly in the future completion report, not silently omitted, exactly as every prior increment this session has done. Runtime evidence is therefore limited to: static inspection of generated migration SQL, and unit/structural test results using a repository fake — not actual database behavior under real Postgres semantics (ownership-check atomicity, FK enforcement, `check()` constraint enforcement) |
| CI evidence | None exists in this repository's current workflow for this path — not fabricated |
| Governance evidence | Protected file MD5 unchanged; exact file boundary matches §8/§14 with nothing extra; explicit confirmation that Decision 7 remains unauthorized and nothing implemented exceeds this Contract's scope |

**A passing test suite alone is not claimed as proof of architectural
correctness** — the structural tests specifically prove the boundary
claims in §19; the unit tests prove behavioral correctness only within
whatever boundary the code actually has.

## 22. Acceptance Criteria

- **Structural correctness**: all files in the future implementation's
  exact file boundary (to be stated in that increment's own execution
  directive, drawn from §14/§17 of this Contract) exist and contain
  exactly the fields/tables specified in §10/§12.
- **Semantic correctness**: all three taxonomy axes are genuinely
  orthogonal in the implemented model — no field's value is derivable
  from another's.
- **Persistence correctness**: migration produces exactly the schema in
  §17, no more, no less.
- **Invariant preservation**: each of the sixteen invariants in §19
  individually verified per its stated method — forward-looking
  invariants (7, 12, 16) explicitly reported as "not applicable this
  increment," never silently marked as tested.
- **Negative constraints**: every "must NOT" in §8/§15/§16/§19 has a
  corresponding structural test proving its absence.
- **Test verification**: exact pass count, 0 failures, reported honestly.
- **Runtime verification**: honestly reported as unavailable (§21).
- **Migration verification**: SQL reviewed and quoted in full.
- **Regression safety**: full existing suite passes unmodified in
  substance.
- **Governance compliance**: protected file untouched; file boundary
  matches this Contract exactly; Decision 7 status unchanged; no
  Relationship confirmation workflow, no matching logic, no AI
  integration present anywhere in the diff.

## 23. Implementation Authorization Status

**IMPLEMENTATION AUTHORIZATION: NOT GRANTED.** This Contract documents
what a future, separately authorized implementation pass must build; it
does not itself authorize any code, schema, or migration change. Per
`CLAUDE.md`'s Implementation Gate Sequence, a distinct "FOUNDER EXECUTION
DIRECTIVE" — naming this Contract specifically — is required before
implementation may begin, exactly as was required and separately issued
for D3 Promotion, Temporal Validity, and Context before any of those
increments' code was written.

## 24. Open Questions

| Question | Why it matters | Blocks implementation authorization? | Requires Founder decision? |
|---|---|---|---|
| Should the Matching-Hypothesis Confirmation increment's future confirmation-event table reference `relationshipId` alone, or also `relationshipType` (to detect if the type changed between hypothesis and confirmation — though types are immutable per §13, so this may be moot)? | Affects that future Contract's design, not this one | No | No — deferred entirely to that future Contract |
| Should a uniqueness or symmetry constraint on `(sourceClaimVersionId, targetClaimVersionId)` ever be added? | Data-integrity question with no current evidence of need (§10) | No | No — ordinary implementation judgment, explicitly left open, resolvable later if a concrete need is evidenced |
| Should `personal_intelligence_relationship_evidence.description` ever gain a structured vocabulary instead of free text? | Same reasoning as Claim-level Context's own OPEN dimensions | No | **REQUIRES SEPARATE FOUNDER DECISION** if ever proposed — no evidence supports it now, so it is not designed here, mirroring how Context's own OPEN dimensions were left OPEN rather than resolved by inference |

No open question here blocks this Contract's own completion or, once
separately authorized, its implementation.

## 25. Self-Audit

- **Authority Audit**: No unapproved concept is claimed as already
  Founder-approved. §5 restates only what the operative decision
  actually says; §6 explicitly labels every new formalization as not
  retroactively claimed as prior approval.
- **Scope Audit**: No matching, discovery, ranking, AI, confirmation
  workflow, or Living User Model work is authorized anywhere in this
  Contract — verified against §8's explicit OUT OF SCOPE list and §9's
  explicit non-authorization statement.
- **Boundary Audit**: No code this Contract specifies writes into
  ClaimVersion, Evidence, Inference, Memory, Personal State, or AI
  Gateway — verified against §15/§16/§19's structural-test requirements,
  each of which has a named verification method.
- **Taxonomy Audit**: The three-axis structure is preserved exactly
  (§11). `same_subject`/`same_attribute` are explicitly excluded from
  `relationshipType`'s value set as structural predicates (Decision 4);
  `same_claim`/`unrelated` are also explicitly excluded, per the
  Founder's decision resolving Finding #1 of the Contract Final Review
  (§11.1). The formalized Relationship Type axis holds exactly five
  values: `successive_state`, `refinement`, `contradiction`,
  `contextual_variation`, `related_fact`. Formalized vocabulary is
  explicitly and repeatedly distinguished from historical approval (§6,
  §11 preamble).
- **Persistence Audit**: The selected design (§13) is justified by
  explicit comparison against two alternatives, with a stated rationale
  for why the smaller of the viable options was chosen and why the
  event-log machinery proposed in uncommitted working material was
  deliberately *not* adopted in this increment.
- **Governance Audit**: A future Claude Code session cannot reasonably
  interpret this Contract as implementation permission — §1's banner,
  §9's explicit boundary statement, and §23's status line all state the
  same thing in different words, at the top, middle, and end of the
  document, matching the pattern already proven correct across three
  prior increments.

**Self-Audit Result: PASS.**

---

## PRESENT-DAY FOUNDER GOVERNANCE RECONCILIATION — 2026-09-02

This section is additive. It records a present-day Founder governance
resolution and a subsequent, separately authorized documentary
reconciliation. It does not delete, rewrite, or backdate any historical
statement made elsewhere in this Contract, including §1, §9, and §23
above, and it does not itself constitute or grant any new implementation
authorization. It was authorized by an explicit "FOUNDER GOVERNANCE
RESOLUTION DIRECTIVE" dated 2026-09-02, itself following a dedicated,
strictly read-only "Relationship + Relationship Evidence forensic
governance and implementation-conformance audit" completed earlier the
same day.

### Historical state (unchanged, restated for clarity only)

At the time this Contract was finalized (`2eb60df`, 2026-08-31) and at
the time the implementation it describes was written (`3146008`,
2026-08-31, and its two corrective follow-ons `165d0e4`/`a67751a`, both
also 2026-08-31):

- this Contract's own banner, §9, and §23 stated, and continue to state
  verbatim, **"IMPLEMENTATION AUTHORIZATION: NOT GRANTED"**;
- no independently verifiable historical Founder Execution Directive
  authorizing implementation commit `3146008` was found, in this audit
  or the forensic audit preceding it;
- the existence of the implementation does not, and did not, retroactively
  change that historical fact.

None of this historical state is altered by what follows.

### Present-day governance state (effective 2026-09-02)

**§1 of this reconciliation — Contract acceptance.** The Founder accepts
the current Relationship + Relationship Evidence Implementation Increment
Contract, as it stands (§1–§25 above, unmodified), as the governing
specification for the already-shipped implementation, subject to its
defined scope (§8), exclusions (§8/§16), invariants (§19), verification
limitations (below), and all remaining governance constraints. This is a
present-day governance decision, effective 2026-09-02, and does not
represent or imply historical approval of the implementation at the time
it was written.

**§2 of this reconciliation — historical authorization status,
reaffirmed.** The repository does not contain an independently verifiable
historical Founder Execution Directive authorizing `3146008`. This is not
fabricated, reconstructed, or claimed otherwise anywhere in this section.

**§3 of this reconciliation — present-day Founder ratification.** Founder
Parsa Kiamanesh, Founder & Owner of DECIVEXA, ratifies and authorizes the
already-shipped Relationship + Relationship Evidence implementation
represented by commit `3146008`, including the directly related
corrective implementation work represented by `165d0e4` (migration
constraint-ordering fix) and `a67751a` (unique-violation error-shape
handling fix). This ratification is effective 2026-09-02. It is not
historical authorization and must not be represented as authorization
existing at or before any of those commits' dates (2026-08-31). The
ratification is subject to the governing Contract, all of its exclusions
and invariants, current scope boundaries, the verification limitations
stated below, Decision 7 remaining NOT APPROVED, Living User Model
remaining NOT AUTHORIZED, and all existing DECIVEXA governance
constraints.

### Technical defect history (preserved factually)

- `165d0e4` corrected a genuine migration-ordering defect in the
  originally shipped `0014_relationship_and_relationship_evidence.sql`:
  the unique index a composite ownership foreign key depended on was
  declared after that foreign key's `ALTER TABLE` statement, which would
  fail against a fresh PostgreSQL database. The fix reordered the
  statements only — no semantic, schema, or naming change.
- `a67751a` corrected real PostgreSQL/Drizzle unique-violation
  error-shape handling: the driver wraps the underlying Postgres error
  such that its `code` lives at `error.cause.code`, not `error.code`,
  which had caused a losing concurrent `RelationshipEvidence.create()`
  call to escape as an unhandled error instead of returning `null` as
  documented. Its own commit message records a concrete real-PostgreSQL
  result for this fix.

Both are implementation defects subsequently corrected, not architectural
disagreements with this Contract's requirements.

### Technical verification (unchanged in substance, stated precisely)

**PARTIAL LIVE-POSTGRESQL VERIFICATION — DIRECT EVIDENCE EXISTS IN COMMIT
HISTORY / TEMPORARY VERIFICATION ARTIFACTS, BUT NO COMPLETE PERSISTED
RESULTS REPORT SURVIVES.**

A temporary live-PostgreSQL verification pass was executed through
temporary verification infrastructure introduced by `e67e60c` (a
`workflow_dispatch`-only GitHub Actions workflow plus a Node verification
script exercising migrations `0000`–`0007`/`0010`–`0014` and the actual
Relationship/Relationship-Evidence repositories against a real
`postgres:18` service) and `5ab3281` (triggering that workflow), and
subsequently removed by `e311108`. `165d0e4` and `a67751a` are direct,
dated evidence that this process caught and led to the correction of two
real defects; `a67751a`'s own commit message quotes a concrete
real-PostgreSQL concurrency result. No complete, persisted
verification-results report or log was ever committed to this repository
before the verification infrastructure was deleted. This status is
neither upgraded to "LIVE POSTGRESQL VERIFICATION COMPLETE" nor
downgraded to "NO LIVE POSTGRESQL VERIFICATION OCCURRED" — both would be
inaccurate. Founder governance approval, recorded above, is a governance
act; it does not constitute, and must not be read as, technical
verification.

### Scope (unchanged, restated)

This reconciliation, and the present-day ratification it records, apply
only to the Relationship + Relationship Evidence implementation as
defined by this Contract (§8/§10/§12 above), i.e. to commit `3146008` and
its two corrective follow-ons `165d0e4`/`a67751a`. They do not authorize
any new implementation, and specifically do not authorize: changes to
source code, tests, schema, migrations, infrastructure, the AI Gateway,
GCP, the Context Fusion Engine, Memory, Personal State, Claim,
ClaimVersion, D3, Matching-Hypothesis Confirmation, the Decision Engine,
Goal OS, or any UI/API/controller surface. Every exclusion in §8/§16 of
this Contract remains in force, unchanged.

**Cross-Claim Matching / Decision 7 remains NOT APPROVED.** **Living User
Model remains NOT AUTHORIZED.** Nothing in this reconciliation
authorizes, implements, activates, or infers authorization for either,
and nothing here modifies any matching/ranking/similarity/candidate-
generation architecture.

### §25 Self-Audit (unaffected)

This reconciliation does not reopen, weaken, or reinterpret the §25
Self-Audit above, or any of the sixteen invariants in §19. It adds no new
architectural claim beyond what §1–§25 already specify.
