# Matching-Hypothesis Confirmation — Implementation Increment Contract

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

---

## Present-Day Repository Reconciliation

**Added by Founder-authorized documentation/governance reconciliation
("FOUNDER EXECUTION DIRECTIVE — MATCHING-HYPOTHESIS CONFIRMATION CONTRACT
RECONCILIATION"). This section is purely additive. Every word of the
historical Contract below — including the banner above ("IMPLEMENTATION
AUTHORIZATION: NOT GRANTED"), every historical statement in §1–§27, and
in particular §20's runtime-verification requirements, §25's acceptance
criteria, and §18's exclusions — is preserved byte-for-byte and remains
the historical record of what this Contract specified and what it did
and did not authorize. Nothing below rewrites, deletes, softens, or
reinterprets that historical record.**

### Present-Day Status

**MAINLINE-SHIPPED / STRUCTURALLY & UNIT VERIFIED / RUNTIME VERIFICATION
OUTSTANDING.**

The capability this Contract specifies — an independent Confirmation
Event mechanism over an existing Relationship (Decision 6) — exists on
current `main` at the domain, repository, and persistence layers,
introduced entirely by one commit:

- **`21caa84`** — "feat(personal-intelligence): add relationship
  confirmation events" — the sole commit that introduced this capability;
  no other commit touches it.

**Implemented and tested (structural/unit level):**
- Domain model + `deriveEffectiveConfirmationState`:
  `apps/api/src/core/personal-intelligence/personal-intelligence-relationship-confirmation.model.ts`
  (10 unit tests in the adjacent `.model.spec.ts`).
- Repository interface/token:
  `apps/api/src/core/personal-intelligence/personal-intelligence-relationship-confirmation.repository.ts`
  / `.repository.token.ts`.
- Drizzle persistence implementation, including the corrected
  `isUniqueViolation` (checking both `error.code` and
  `error.cause.code`, per Contract §14 — **not** C3's defective,
  top-level-only shape):
  `apps/api/src/infrastructure/persistence/personal-intelligence-relationship-confirmation.repository.ts`,
  with 5 dedicated regression tests in the adjacent
  `.repository.unique-violation.spec.ts`.
- Additive migration, matching Contract §11/§23 column-for-column and
  constraint-for-constraint:
  `apps/api/src/persistence/migrations/0015_relationship_confirmation_events.sql`.
- Structural boundary tests (11 tests) proving the applicable §9/§18
  invariants (no mutation of `relationshipType`/`certainty`, no
  UPDATE/DELETE, no Claim/ClaimVersion/Evidence/D3/Memory/Personal
  State/AI Gateway reference, no candidate-generation/similarity/ranking
  code):
  `apps/api/src/infrastructure/persistence/personal-intelligence-relationship-confirmation.structural.spec.ts`.
- Module wiring + DI-resolution proof:
  `apps/api/src/infrastructure/persistence/persistence.module.ts`,
  `apps/api/src/application/personal-intelligence/personal-intelligence-relationship-confirmation.app-composition.spec.ts`.

**Deliberately not created, consistent with this Contract's own scope —
not missing, not a gap:**
- Application/use-case layer (Contract §15: "not required, not created").
- HTTP/API surface (Contract §16: "Not required, not created. No HTTP
  controller... exists for any PIC artifact in this codebase today").
- Web/UI (Contract §18: "UI of any kind").
- Any AI integration (Contract §17).

**No evidence of external production deployment exists anywhere in the
repository.** This reconciliation does not use, and repository evidence
does not support, the word "production" to describe this state. The
capability exists on `main`, in the repository's own test suite — nothing
more is claimed.

### Runtime Verification Gap (Acceptance Criterion 6 — NOT SATISFIED)

Contract §20 ("Runtime Verification Requirements") explicitly requires
real PostgreSQL runtime verification of the new table's schema, ownership
behavior, and concurrency behavior — live `information_schema`/`pg_catalog`
checks, live `CHECK`-constraint accept/reject tests, live concurrency race
tests — as a condition of the implementation being "considered complete"
(§20's own words), and Contract §25 Acceptance Criterion 6 makes this an
explicit condition of the Contract being satisfied ("Every test category
in §19 passes, **including live PostgreSQL runtime verification (§20)**").

**No such runtime verification was performed. No live-PostgreSQL test
exists anywhere in the repository for migration `0015` or this table** —
confirmed by a repository-wide search of `.github/workflows/` and of every
test file referencing this capability: the unique-violation regression
tests and all structural/unit tests run exclusively against a stub
`DatabaseClient` or pure in-memory logic, never a live database
connection. This is unlike the immediately preceding Relationship +
Relationship Evidence increment (migration `0014`), which had two
dedicated commits performing exactly this kind of live-database
verification — no equivalent commit exists for migration `0015`.

**Therefore, Acceptance Criterion 6 is NOT satisfied, and this
reconciliation does not, and cannot honestly, describe this Contract as
fully complete or fully satisfied.** Unit- and stub-database-level tests
do not substitute for, and are not represented here as substituting for,
the live PostgreSQL verification §20 requires. This gap is recorded as an
explicit, outstanding Contract requirement — not as an optional future
enhancement, and not as an action this reconciliation authorizes, performs,
or schedules.

### Acceptance Criteria (§25) — Present-Day Status

1. Table shape matches §11 — **supported by repository evidence** (migration
   diffed against §11's specification).
2. `personal_intelligence_relationships` byte-identical to shipped schema —
   **supported by repository evidence** (no `ALTER` statement present).
3. `create()` implements the exact atomic ownership+eligibility check —
   **structurally verified** (dedicated structural test).
4. Unique-violation handling recognizes both error shapes — **supported by
   repository evidence** (5 dedicated regression tests, against a stub
   database).
5. `deriveEffectiveConfirmationState` implemented exactly as §10.3 —
   **supported by repository evidence** (10 dedicated unit tests).
6. Every test category in §19 passes, **including live PostgreSQL runtime
   verification (§20)** — **NOT SATISFIED.** No live-database verification
   exists.
7. Structural boundary tests proving applicable §9 invariants — **structurally
   verified** (11 dedicated tests).
8. No file outside the §15/§23 boundary modified — **verified** (commit
   `21caa84`'s file list matches the authorized boundary).

### Authorization

The Contract's historical text records Implementation Authorization as
**NOT GRANTED**. Present-day repository evidence confirms that the scoped
implementation nevertheless exists on mainline, but no independently
verifiable surviving implementation-authorization artifact — including
the "FOUNDER DECISION RESOLUTION — MATCHING-HYPOTHESIS CONFIRMATION"
this Contract's own §3/§4 refer to, and the separate Founder Execution
Directive §26 states is required — was identified anywhere in the
repository, tracked or untracked. This reconciliation records the
present-day repository state and does not retroactively establish or
infer authorization. The existence of commit `21caa84`, and the fact that
its tests pass, are not treated here as proof of authorization.

### Decision 7 / Cross-Claim Matching Boundary (unchanged, reaffirmed)

Decision 6 (Matching-Hypothesis Confirmation) remains FOUNDER-APPROVED
ARCHITECTURE. **Decision 7 (Cross-Claim Matching Implementation) remains
NOT APPROVED**, untouched by this reconciliation. The shipped capability
described above contains no candidate generation, no similarity scoring,
no ranking, and no matching algorithm — a dedicated structural test
exists specifically to enforce this boundary (*"the Confirmation
repository contains no candidate-generation, similarity, ranking, or
matching-score code (structural: Decision-7 territory excluded, Contract
§18)"*). This reconciliation does not describe the confirmation-event
primitive as Cross-Claim Matching, and does not authorize, suggest, or
advance Decision 7 implementation in any way.

### What This Reconciliation Does Not Do

This reconciliation is not a retroactive authorization of the existing
implementation. It records repository reality only. It does not grant
authorization for: the existing historical implementation; the
outstanding runtime verification described above; any future
implementation, test, migration, or code change; API or web exposure;
AI integration; or Cross-Claim Matching / Decision 7 in any form. Any
future work on this capability — including the outstanding runtime
verification itself — requires its own separate, explicit Founder
authorization, exactly as the historical Contract's own §26 already
states.

---

## 1. Identity / Increment Name

**Matching-Hypothesis Confirmation** — the fourth stage in the approved
dependency order (§26), immediately following the completed Relationship
+ Relationship Evidence increment (`e311108`, merged to `main`).

## 2. Purpose

Translate Cross-Claim Matching Decision 6 (Matching-Hypothesis
Confirmation) — together with the five Founder Decisions (FD-1 through
FD-5) that resolved this Contract's pre-drafting blockers — into a
precise, implementable specification for an independent confirmation
mechanism over an existing Relationship's confirmation status, without
inventing new architecture, without reopening the completed Relationship
increment, and without authorizing implementation.

## 3. Architectural Authority

This Contract's authoritative architectural input is
`docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md`
(`CROSS-CLAIM-MATCHING-ARCH-001`) — specifically Decision 6 and the
sixteen invariants in its §9 — and the five Founder Decisions (FD-1
through FD-5) issued in "FOUNDER DECISION RESOLUTION — MATCHING-HYPOTHESIS
CONFIRMATION" earlier in this session, which this Contract treats as
binding and does not reinterpret or extend. Its Implementation Readiness
Inventory is the two-stage read-only audit produced immediately prior in
this same session: the "Pre-Drafting Audit" (concluding CONTRACT-DRAFT
NOT READY, identifying five blockers) and the "Contract-Drafting
Readiness Audit" (concluding CONTRACT DRAFTING READY, after the five
Founder Decisions resolved those blockers). Neither audit carries
independent authority beyond what those Founder Decisions and the
operative architectural decision state.

## 4. Founder Decision References

This Contract is built directly on, and does not reinterpret:

- **FD-1 (Matching Hypothesis identity)**: a Matching Hypothesis is *not*
  a separate domain entity — it is an existing Relationship whose
  `provenance = 'ai_hypothesis'`. No new table, identity, lifecycle, or
  promotion mechanism is introduced by this Contract.
- **FD-2 (Confirmation semantics)**: Confirmation does not mutate
  `relationshipType` or `certainty` — both remain exactly as immutable as
  the completed Relationship increment already made them. Confirmation
  concerns the Relationship's confirmation status, represented through
  the existing `confirmationState` concept.
- **FD-3 (Persistence direction)**: an append-only confirmation-event
  model, structurally informed by the C3 precedent, is expected; the
  exact schema and state semantics are decided **by this Contract**
  (§10–§11), not pre-decided by FD-3 itself.
- **FD-4 (Actor model)**: AI is not required to perform Confirmation
  itself, and no AI evaluation of Confirmation is authorized. AI's only
  role remains upstream, at Relationship-creation time.
- **FD-5 (Dependency ordering)**: the approved sequence (§26) is
  preserved; Confirmation must not depend on any Decision-7 (Cross-Claim
  Matching) capability, and must not be restricted to `ai_hypothesis`
  Relationships alone.

## 5. Baseline

```
branch:       main
HEAD:         e3111082e88c1941333bba2e6ad700b9bcde439b
origin/main:  e3111082e88c1941333bba2e6ad700b9bcde439b
divergence:   0/0
```
Protected file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`: MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, untouched by producing this
Contract.

## 6. Scope

**IN SCOPE**
- Confirmation Event core domain model (`.model.ts`).
- Confirmation Event repository interface + token + Drizzle
  implementation, mirroring the C3/Relationship-Evidence precedent
  exactly, **except** for the `isUniqueViolation` shape (§14, §22).
- One new Drizzle schema table + one additive migration.
- A pure `deriveEffectiveConfirmationState()` function, mirroring
  `deriveEffectiveConfirmation`/`deriveEffectiveStatus` exactly.
- Module wiring (`persistence.module.ts`) + an app-composition spec
  proving it.
- Structural boundary tests proving the invariants in §9/§18.
- Unit tests at the model/repository-fake level.
- Real PostgreSQL runtime verification of the new table/constraints
  (§20), with the PG16-vs-PG18 limitation (§21) explicitly carried
  forward, not resolved.

**OUT OF SCOPE** — see §18 for the complete list.

**SEPARATE FOUNDER AUTHORIZATION REQUIRED**
- Implementation of anything in this Contract (§26).
- Any future change to the state-transition graph or event vocabulary
  formalized in §9, once this Contract is approved and, later,
  implemented.
- Cross-Claim Matching Implementation itself (next stage; still governed
  by Decision 7, NOT APPROVED).
- Repairing the known C3 `isUniqueViolation` defect (§14) — that remains
  a separately authorizable repair to already-shipped code, not part of
  this Contract's scope.

## 7. Matching Hypothesis Definition

Per FD-1: a **Matching Hypothesis is an existing Relationship whose
`provenance = 'ai_hypothesis'`**. It has no separate identity, no
separate persistence, no separate lifecycle, and no promotion mechanism.
Any Relationship — regardless of how it was created — already fully
exists as a first-class, persisted `personal_intelligence_relationships`
row before Confirmation ever applies to it. This Contract introduces
**no new entity** to represent "a hypothesis" as distinct from "a
Relationship."

**Naming clarification, stated explicitly per the Contract-Drafting
Readiness Audit's §4 finding**: despite the increment's name, the
Confirmation mechanism defined here is **not restricted to
`ai_hypothesis`-provenance Relationships** — see §8. The name refers to
the mechanism's primary motivating case (confirming an AI-produced
candidate match), not to an eligibility restriction.

## 8. Confirmation Semantics

Confirmation is an independent mechanism, separate from C3 Claim
Confirmation and D3 Inference Confirmation, that records the caller's
confirmation decision about an existing Relationship's classification.

**Confirmation must NOT**, under any circumstance:
- mutate `relationshipType` (remains immutable, exactly as shipped);
- mutate `certainty` (remains immutable, exactly as shipped);
- mutate a Claim;
- mutate a ClaimVersion;
- merge Claims;
- change `provenance` on the Relationship or anything else;
- change any epistemic type;
- change any lifecycle;
- implicitly change confidence;
- create Relationship Evidence or any other Evidence;
- change D3 Inference lifecycle.

**Interpretation of Decision 6's wording** ("confirms the Relationship
Type classification"), per FD-2: this phrase is read as "confirms
[the Relationship's] classification [as represented by its
`confirmationState`]," not as literal permission to mutate the
`relationshipType` column. This Contract states this interpretation
explicitly so that no future implementer adds an `UPDATE` path for
`relationshipType`. `relationshipType` and `certainty` remain
frozen at their Relationship-creation-time values for the entire life of
that Relationship row — Confirmation changes what is *known/decided*
about the Relationship's status, never what the Relationship
*classifies as*.

## 9. State Model / Transition Rules

**Confirmation Event action vocabulary** — deliberately **not** a copy
of C3's `confirmed | unconfirmed`, because Relationship confirmation is
a four-value domain (`not_required`, `pending`, `confirmed`, `rejected`),
not a boolean toggle. Each Confirmation Event carries an `action` field
with exactly one of three values:

```
action: "pending" | "confirmed" | "rejected"
```

`not_required` is **never a valid event action** — it exists only as a
possible Relationship-creation-time `confirmationState` value (§10.1
eligibility) and is never something a Confirmation Event asserts.

**Distinguishing event/action semantics from effective
`confirmationState`** (required explicitly, not conflated): an
individual event's `action` is a historical fact — "at this sequence
number, this actor recorded this action." The Relationship's **effective**
`confirmationState` is a separate, derived concept: a pure function over
the full ordered event history for that `relationshipId`, computed the
same way `deriveEffectiveConfirmation`/`deriveEffectiveStatus` already
compute their own effective values elsewhere in this codebase (§10.3).
In this Contract's design the derivation happens to equal "the latest
event's `action` value by `sequence`" — but the two concepts remain
architecturally separable: a future Contract revision could change the
derivation function without touching the event schema, exactly as D3's
own effective-status derivation is decoupled from its event log's shape.

### 9.1 Legal Transition Graph

Fully symmetric and freely reversible, mirroring C3's own
demonstrated philosophy (C3 permits `confirmed ⇄ unconfirmed` freely,
with no restriction):

```
pending ⇄ confirmed
pending ⇄ rejected
confirmed ⇄ rejected
```

Any of the three action values (`pending`, `confirmed`, `rejected`) may
be recorded from any current effective state, including from itself
(§9.3). There is no "terminal" state — `rejected` is not a dead end and
may later be reconsidered; `confirmed` is not permanently locked and may
later be rejected or returned to pending. This mirrors the operative
decision's own invariant that "a Relationship classification is never
silently re-derived after evidence changes; it becomes a re-evaluation
candidate instead" (operative decision §9, invariant 16) — Confirmation
Events are exactly that re-evaluation mechanism for the confirmation
axis, and nothing in the approved architecture restricts which
transitions a user's re-evaluation may reach — per §10.2's correction,
this Increment authorizes only the `user` actor, so every transition
here is understood as user-initiated.

### 9.2 Invalid Transitions

Because §9.1 permits every transition among the three valid actions,
there is no invalid *transition* to reject at the state-machine level.
The only two ways a Confirmation Event attempt is invalid are:

1. **The `action` value itself is outside `{pending, confirmed,
   rejected}`** — rejected by a `CHECK` constraint at the database level
   (§11), exactly like every other enum-shaped column in this schema.
2. **The target Relationship is ineligible** (§10.1) — ownership mismatch
   or a `not_required`-created Relationship — rejected by the same
   atomic `INSERT ... SELECT ... WHERE` pattern already proven for C3 and
   Relationship Evidence, returning `null`, never throwing, for this
   case (§12).

No other transition-validity logic is authorized. A future
implementation must not invent additional transition restrictions.

### 9.3 Repeated / Identical Consecutive Events

**Allowed, explicitly.** A caller may record the same `action` value
consecutively (e.g., confirming an already-`confirmed` Relationship
again) — this simply appends another event with the next `sequence`
number, exactly mirroring C3's own demonstrated behavior (nothing in C3
prevents re-recording the same `action` twice in a row). This is a
deliberate design choice, not an oversight: restricting it would require
an extra read-before-write check this Contract's own ownership pattern
does not otherwise need, for no architectural benefit — the effective
state is unaffected either way.

## 10. Persistence Model

**Selected: Append-only Confirmation Events + Derived Effective
Confirmation State** (the model the Contract-Drafting Readiness Audit's
§6 comparison found most consistent with the shipped architecture,
requiring no reopening of the completed Relationship increment).

**Explicitly rejected**: a model where `personal_intelligence_relationships.confirmationState`
receives a post-creation `UPDATE`. This would contradict the completed
Relationship increment's own established discipline (every column,
including `confirmationState`, is set exactly once at `INSERT` and never
updated — Relationship Evidence Contract §13) and would require
reopening that already-shipped design. **This Contract does not reopen
it.** `personal_intelligence_relationships.confirmationState` retains its
existing meaning exactly as shipped: the value the Relationship was
*created* with — nothing more.

### 10.1 Eligibility

Per FD-5, restated explicitly (Contract-level decisions, resolved here,
not deferred to implementation):

1. **All three `provenance` values are eligible** for Confirmation:
   `user_declared`, `system_derived`, `ai_hypothesis`. No AI-only
   restriction exists.
2. **A Relationship created with `confirmationState = 'not_required'` is
   NOT eligible** to ever receive a Confirmation Event. `not_required`
   means confirmation does not apply to that Relationship at all — this
   is checked against the Relationship's original, immutable
   `confirmationState` column value (the only cheaply, atomically
   checkable signal available without an extra query) as part of the
   same ownership-verifying statement (§12).
3. Relationships created with `confirmationState` of `pending`,
   `confirmed`, or `rejected` **are all eligible**, and remain eligible
   for the Relationship's entire lifetime — eligibility is fixed at
   Relationship-creation time and does not itself change.
4. **`pending` may become `confirmed` or `rejected`** — yes (§9.1).
5. **`confirmed` may later become `rejected` or return to `pending`** —
   yes (§9.1).
6. **`rejected` may later be reconsidered** (become `pending` or
   `confirmed`) — yes (§9.1).
7. **Repeated events / identical consecutive actions** — allowed (§9.3).

### 10.2 Actor Model

**Decision made by this Contract, with rationale documented as
required, corrected per Final Founder Review finding F-4**: Confirmation
Events **include an explicit `actor` field**, restricted for this
Increment to a single value: `"user"` — **not** relying on ownership
(`userId`) alone, unlike C3, but also **not** including a `"system"`
value.

**Rationale**: this increment's own two immediate predecessors
(Relationship, Relationship Evidence) both already use an explicit
axis (`provenance`) to distinguish who/what produced a record, rather
than relying on ownership alone — a stronger, more directly applicable
precedent for *this* increment's own lineage than C3's older, simpler
design, and the reason `actor` is retained as an explicit, self-labeled
field rather than omitted the way C3 omits it entirely. However, this
Contract's own scope (§15) authorizes **no application use-case class,
no API, and no scheduled/automated caller of any kind** — the only
plausible future source of a genuinely system-triggered confirmation is
Cross-Claim Matching Implementation, which remains Decision 7, **NOT
APPROVED**. Including a `"system"` value now, with no concrete
authorized caller anywhere in this increment's own scope that would
ever set it, would be exactly the "unevidenced, speculative machinery"
the project's Minimum Necessary Architecture principle exists to
prevent (the same principle the Relationship Evidence Contract's own
§13 invoked by name to reject a comparable premature mechanism). This
Increment therefore authorizes and models **only user-initiated
Confirmation**. **No `system` actor, scheduler, worker, automation, or
orchestration layer is created or implied by this Contract.** A future
`system` actor — for a genuine, concretely-authorized automated
confirmation caller, once one exists — would require its own separate,
explicit Founder-approved Contract/increment, not silent inclusion here
in advance of any code path that could use it.

Per FD-4, **`"ai"` is, and remains, never a valid `actor` value** — AI
may have produced the underlying Relationship (`provenance =
'ai_hypothesis'`), but AI never performs the Confirmation act itself;
this is enforced by the `actor` column's own `CHECK` constraint, whose
domain now admits only `user`.

**`actor` remains audit metadata only, never an authorization
mechanism**: it has zero effect on the ownership check in §12, which is
governed exclusively by `userId`. This holds regardless of `actor`'s
domain, and is unchanged by this correction — restricting the domain to
`user` only narrows *what* can be recorded, not *how* ownership is
enforced.

### 10.3 Effective State Derivation

```
deriveEffectiveConfirmationState(events) =
  events.length === 0
    ? the Relationship's own (immutable, creation-time) confirmationState
    : the action of the event with the highest sequence
```

Mirrors `deriveEffectiveConfirmation`/`deriveEffectiveStatus` exactly: a
pure, deterministic function; never a stored, mutable column; callers
supply events already scoped to one `relationshipId`. When no
Confirmation Event exists yet, the Relationship's own original
`confirmationState` (e.g., `pending`, set at creation) is the effective
state — Confirmation Events, once they exist, take over as the sole
source of the effective value.

## 11. Event Model

```
personal_intelligence_relationship_confirmation_events
  id                text PRIMARY KEY NOT NULL
  relationshipId    text NOT NULL
  userId            text NOT NULL
  sequence          integer NOT NULL   CHECK (sequence >= 1)
  action            text NOT NULL   CHECK (action in ('pending','confirmed','rejected'))
  actor             text NOT NULL   CHECK (actor in ('user'))
  occurredAt        timestamp with time zone NOT NULL
  createdAt         timestamp with time zone NOT NULL

  CONSTRAINT ..._user_id_users_id_fk           FK (userId) -> users(id)
  CONSTRAINT ..._relationship_owner_fk         FK (relationshipId, userId)
                                                -> personal_intelligence_relationships(id, userId)
  UNIQUE INDEX ..._relationship_id_sequence_unique ON (relationshipId, sequence)
```

`sequence` carries an explicit database-level `CHECK (sequence >= 1)`,
matching the already-shipped Relationship Evidence precedent
(`personal_intelligence_relationship_evidence_sequence_check`) exactly —
defense-in-depth at the database level, in addition to (not instead of)
the application-level allocation formula in §11's own `sequence` bullet
below, which is unchanged.

- `id`: caller-supplied, exactly like every other artifact in this
  codebase (Always Explicit — no server-generated identity hidden from
  the caller).
- `relationshipId` / `userId`: verified atomically against the parent
  Relationship's ownership and eligibility in the same statement that
  inserts the row (§12) — never a separate pre-check.
- `sequence`: allocated as `coalesce(max(sequence) for this
  relationshipId, 0) + 1`, via the same scalar-subquery technique used by
  every other append-only table in this codebase (D3 lifecycle events,
  C3 confirmation events, Relationship Evidence).
- `action`: §9.
- `actor`: §10.2.
- `occurredAt`: caller-supplied, mirrors C3's own `occurredAt` field
  (the moment the confirming act happened, distinct from `createdAt`,
  the moment the row was written).
- `createdAt`: caller-supplied `now`, Always Explicit, mirrors every
  other artifact in this codebase.

No column on this table is ever `UPDATE`d or `DELETE`d after insertion.
No column on `personal_intelligence_relationships` is touched by this
table's existence in any way.

## 12. Ownership / Security

Mirrors the exact atomic pattern already proven twice
(`DrizzlePersonalIntelligenceClaimConfirmationRepository.recordConfirmationEvent`,
`DrizzlePersonalIntelligenceRelationshipEvidenceRepository.create`): a
single `INSERT ... SELECT ... WHERE` where the `SELECT` only produces a
source row when:

```
personal_intelligence_relationships.id = input.relationshipId
  AND personal_intelligence_relationships.userId = input.userId
  AND personal_intelligence_relationships.confirmationState <> 'not_required'
```

all hold simultaneously. A mismatch on ownership, or an ineligible
(`not_required`) Relationship, yields zero source rows — nothing is
inserted, and the method returns `null`, never throws, for this case.
**No ownership bypass exists.** A cross-user Confirmation Event attempt
can never create a row, by construction, not by application-level
permission-check logic that could be forgotten or bypassed.

## 13. Immutability

- `personal_intelligence_relationships` — completely untouched by this
  increment: no new column, no new constraint, no trigger, no hidden
  state synchronization, no `UPDATE` path introduced anywhere.
- `personal_intelligence_relationship_confirmation_events` — append-only,
  full stop: no `UPDATE`, no `DELETE`, anywhere in the repository
  implementation this Contract authorizes designing (not yet
  implementing).
- ClaimVersions, Claims, Evidence, D3 Inference — untouched; no write
  path from this increment's code reaches any of them (verified
  structurally, §19).

## 14. Concurrency

**Required, explicitly, as a Contract obligation on the future
implementation** (not optional, not left to implementer discretion):

1. `UNIQUE (relationshipId, sequence)` as the database-level concurrency
   backstop — identical mechanism to every other append-only table in
   this codebase.
2. The future repository's `isUniqueViolation`-equivalent helper **must**
   recognize a PostgreSQL unique-violation (`23505`) at **both**:
   - `error.code === "23505"` (the raw `pg` error shape), **and**
   - `error.cause.code === "23505"` (Drizzle's `DrizzleQueryError`
     wrapper shape) — defensively, never assuming `error.cause` exists.
3. All other database errors must continue to propagate (thrown), never
   silently swallowed.

**Explicit precedent warning, required to appear in this Contract**:
`apps/api/src/infrastructure/persistence/personal-intelligence-claim-confirmation.repository.ts`
(C3) — the single closest structural precedent for this exact
mechanism — **currently contains the un-patched, defective version** of
this check (top-level `error.code` only). This was discovered
incidentally during this session's Contract-Drafting Readiness Audit and
is **not repaired by this Contract or by any work in this session** —
repairing it is a separately authorizable task against already-shipped
C3 code, out of scope here. **The future Matching-Hypothesis Confirmation
implementation must NOT copy C3's `isUniqueViolation` as it exists
today.** It must instead copy the corrected shape already proven and
merged in `personal-intelligence-relationship-evidence.repository.ts`
(`hasUniqueViolationCode` / `isUniqueViolation`, checking both `error.code`
and `error.cause.code`).

## 15. Repository Boundary

Per the confirmed C3 precedent (repository-only; no PIC controller
exists anywhere in this codebase):

- **Core repository interface required**:
  `PersonalIntelligenceRelationshipConfirmationRepository`
  (`core/personal-intelligence/personal-intelligence-relationship-confirmation.repository.ts`
  + `.repository.token.ts`), mirroring the exact token-file convention
  already used for Claim Confirmation and Relationship Evidence.
- **Infrastructure implementation required**:
  `infrastructure/persistence/personal-intelligence-relationship-confirmation.repository.ts`
  (Drizzle-backed), with the corrected `isUniqueViolation` shape (§14).
- **Module wiring**: bound in
  `infrastructure/persistence/persistence.module.ts`, exactly like every
  existing PIC repository binding.
- **Application use-case class**: **not required, not created** — no
  precedent for one exists for any PIC artifact at this stage; nothing
  in this increment's scope needs orchestration logic beyond what the
  repository interface itself provides.
- **Verification of this boundary decision**: an
  `*.app-composition.spec.ts` proving the new repository resolves
  correctly through DI, mirroring
  `personal-intelligence-relationship.app-composition.spec.ts` exactly.

## 16. API / Workflow Boundary

**Not required, not created.** No HTTP controller, DTO, or API surface
exists for any PIC artifact in this codebase today (confirmed by the
same direct search the Relationship Contract relied on — repeated,
not merely cited, would be required at implementation time). Inventing
one here would be scope expansion beyond what exists.

## 17. AI Boundary

Per FD-4, restated explicitly:

**Confirmation itself involves no AI.** The future implementation must
NOT introduce:
- `AiGatewayService` integration;
- `AIRuntime` integration;
- Context-Resolution dependency, solely for Confirmation;
- AI confirmation scoring or evaluation;
- AI-generated confirmation decisions;
- an `"ai"` value anywhere in the `actor` field's domain (§10.2, enforced
  structurally by that column's `CHECK` constraint — which, per the
  Final Founder Review's F-4 correction, now admits only `user`, not
  `"system"` either: this Increment authorizes no automated/system
  confirmation caller of any kind).

AI's only involvement with anything this Contract touches is upstream
and already fully implemented: a Relationship may have been *created*
with `provenance = 'ai_hypothesis'` (Relationship increment, already
shipped). Nothing about *that* is reopened, extended, or duplicated by
this Contract.

## 18. Explicit Non-Scope

- **Cross-Claim Matching Implementation** (Decision 7, NOT APPROVED): no
  candidate generation, similarity engine, ranking, matching algorithm,
  contradiction detection, matching-confidence algorithm, or any
  confirmation API/workflow belonging to Decision-7 territory.
- **AI**: no AI evaluation, no LLM calls, no `AiGatewayService`/`AIRuntime`
  integration, no AI-generated confirmation decisions (§17).
- **Claim / ClaimVersion**: no mutation of either, under any
  circumstance (§8).
- **Evidence**: Confirmation must not create Relationship Evidence or any
  other Evidence — Relationship Evidence remains its own, separate,
  already-shipped abstraction, untouched by this increment.
- **D3 Inference**: no lifecycle change of any kind.
- **Living User Model**: excluded, far downstream (§26).
- **Memory, Personal State**: untouched, per the operative decision's own
  invariants 13–14.
- **UI of any kind.**
- **Repairing the C3 `isUniqueViolation` defect** (§14) — documented as a
  precedent limitation and future implementation requirement only, never
  turned into a repair task by this Contract.
- **Production rollout beyond the standard, additive migration.**

## 19. Testing Requirements

**Static verification** (structural, grep-based, mirroring
`*.structural.spec.ts` precedent): prove the Confirmation repository's
source text never references `relationshipType`/`certainty` in a
mutating position, never contains an `UPDATE`/`DELETE` statement, never
references Claim/ClaimVersion write paths, never references Evidence
write paths, never references D3 Inference lifecycle tables, never
references Memory/Personal State/AI Gateway.

**Unit / repository verification** (model/repository-fake level,
mirroring the existing model spec + repository behavioral-test
precedent, including the stub-`DatabaseClient` technique proven for the
concurrency fix): valid ownership; cross-user rejection (`null`, no
partial write); `not_required`-Relationship rejection (`null`, no
partial write); every transition in the legal graph (§9.1) succeeds;
repeated/identical-consecutive events succeed (§9.3); event ordering by
`sequence`; `deriveEffectiveConfirmationState` correctness (empty
history, single event, multiple events, out-of-order-by-id-but-ordered-
by-sequence input); malformed/invalid `action`/`actor` values rejected;
unrelated database errors propagate (not swallowed).

**Sequence-boundary verification, required per Final Founder Review
finding F-3** (covers the `sequence >= 1` `CHECK` constraint added to
§11): the application-layer allocation formula
(`coalesce(max(sequence), 0) + 1`, §11) always produces a value `>= 1`
through the intended write path, and this remains covered by the
ordering/allocation tests above; independently, at the database level
(covered under Runtime verification below, not merely asserted at the
application layer): `sequence = 0` is rejected by PostgreSQL; negative
`sequence` values are rejected by PostgreSQL; positive `sequence` values
are accepted subject to the `UNIQUE (relationshipId, sequence)`
constraint, which remains verified separately and is not weakened or
replaced by this addition.

**Concurrency verification** (real PostgreSQL, mirroring the exact
technique just proven for Relationship Evidence): concurrent
Confirmation Event creation against the same `relationshipId`; confirm
`UNIQUE (relationshipId, sequence)` prevents duplicate sequence values;
confirm the corrected `isUniqueViolation` shape (§14) correctly returns
`null` for the losing race, under both the raw-`error.code` and the
wrapped-`error.cause.code` shapes; confirm no unhandled promise
rejection occurs; confirm unrelated database errors still propagate.

**Runtime verification**: real PostgreSQL runtime verification of the
new table's schema (columns, PK, both FKs, the unique index, and all
three CHECK constraints — `sequence >= 1`, `action`, and `actor`),
ownership behavior, and concurrency behavior is **required** before
implementation can be considered complete — mirroring exactly the
discipline just established for Relationship + Relationship Evidence,
including the same ephemeral-migration-copy technique for isolating the
new migration from any unrelated, pre-existing migration defects. The
`sequence >= 1` `CHECK` constraint specifically must be verified by
issuing a raw SQL insert attempt with `sequence = 0` and one with a
negative `sequence` value against the live database and confirming both
are rejected by PostgreSQL itself (not merely by application-level
validation), mirroring exactly how the Relationship Evidence increment's
own runtime verification tested its identical `sequence >= 1` constraint.

## 20. Runtime Verification Requirements

Identical discipline to the Relationship increment's own runtime
verification: a fresh/isolated PostgreSQL database; the filtered
migration sequence needed to reach the new migration; live
`information_schema`/`pg_catalog` schema checks; live `CHECK`-constraint
accept/reject tests for `sequence` (`>= 1` — required per Final Founder
Review finding F-3: `0` and negative values must be rejected by
PostgreSQL itself, positive values accepted), `action`, and `actor`;
live ownership and eligibility tests via the actual compiled repository
class; live concurrency tests (§19), which separately verify `UNIQUE
(relationshipId, sequence)`; persisted-value-fidelity tests (read-back
equals what was written). Results must be reported honestly with
PASS/FAIL/UNVERIFIED classifications, exactly as the Relationship
increment's own runtime verification reports were required to do.

## 21. PostgreSQL Version Limitation

**Explicitly carried forward, not resolved by this Contract**: all
runtime evidence obtained for the completed Relationship + Relationship
Evidence increment was against **PostgreSQL 16.13**, not the PostgreSQL
18 the repository's real CI (`postgres:18`) targets. This limitation
applies equally to whatever runtime verification a future Matching-
Hypothesis Confirmation implementation performs, unless a genuine
PostgreSQL 18 runtime becomes available to that future session. **PG16.13
runtime evidence must never be represented as PG18 runtime evidence**,
in this Contract or in any future implementation/verification report
built from it.

## 22. Failure / Error Semantics

| Condition | Behavior |
|---|---|
| Ownership mismatch (`userId` does not own `relationshipId`) | `create()` returns `null`, no row inserted, no throw |
| Target Relationship has `confirmationState = 'not_required'` | `create()` returns `null`, no row inserted, no throw |
| `action` outside `{pending, confirmed, rejected}` | rejected by `CHECK` constraint — database error, propagated |
| `actor` outside `{user}` (including `system` or `ai`) | rejected by `CHECK` constraint — database error, propagated |
| Concurrent race on `(relationshipId, sequence)` | losing insert recognized via the corrected `isUniqueViolation` (§14); `create()` returns `null`, no throw |
| Any other database error | propagated (thrown), never swallowed |

## 23. Migration Requirements

**Additive only.** This Contract authorizes, for a future implementation
pass, exactly **one** new table and its supporting constraints/indexes —
no modification to `personal_intelligence_relationships`,
`personal_intelligence_relationship_evidence`, or any other existing
table. Specifically prohibited: removing or weakening any existing
constraint; altering any existing Relationship column; making
`relationshipType` or `certainty` mutable in any way; adding a trigger
that mutates the Relationship row; introducing any hidden
state-synchronization mechanism between the new table and the existing
one.

**Composite FK to the existing Relationship table — no new index
required for it.** The composite unique index this new table's
`..._relationship_owner_fk` constraint depends on —
`personal_intelligence_relationships(id, userId)`, named
`personal_intelligence_relationships_id_user_id_unique` — **already
exists in the live, shipped schema**, created by migration `0014` and
applied to the database long before this future migration would ever
run. The future Confirmation migration **must NOT** recreate that index,
and does not need to sequence anything relative to it — it may simply
reference the already-existing composite unique key exactly as
`personal_intelligence_relationship_evidence`'s own identical FK already
does.

**Mandatory statement-ordering requirement, given this exact repository's
own history — restated precisely to same-migration dependencies only**:
the general lesson from `0008`, `0010`, and originally `0014` itself
(the last one self-corrected during this session) is that **within one
migration file**, any `CREATE UNIQUE INDEX`/constraint a same-file FK
depends on must be executed *before* that FK's `ALTER TABLE ... ADD
CONSTRAINT` statement — PostgreSQL requires the referenced unique
key to already exist at the moment the FK statement runs. This rule
applies to this new migration **only if** it itself creates some other
index or constraint that some other FK *in that same migration* depends
on (for example, this table's own `sequence`/ownership-adjacent
constraints, should any future revision add one) — if such a
same-migration dependency exists, that index/constraint's `CREATE`
statement must appear before the dependent FK's statement in the
generated file. It does **not** apply to, and must not be misapplied to,
the already-existing `personal_intelligence_relationships(id, userId)`
index referenced above. The future implementation's migration must
still be reviewed line-by-line before acceptance, exactly as every prior
increment's verification report has required, confirming (a) no
same-migration index-before-FK violation exists, and (b) no attempt was
made to recreate the already-existing `relationships(id, userId)` index.

Migration numbering: next sequential number after `0014` at the time of
future implementation (exact number TBD at generation time, since other
increments may land first). **Not created by this Contract** — a future,
separately authorized implementation pass generates it.

## 24. Auditability

Full confirmation history is preserved by construction: every
Confirmation Event ever recorded remains readable forever (append-only,
no `DELETE`), ordered by `sequence`, each carrying `action`, `actor`,
`occurredAt`, and `createdAt`. A future caller can always answer "what
was this Relationship's confirmation status at any point in its
history," not merely "what is it now" — mirroring exactly the
auditability guarantee already established for C3 and D3.

## 25. Acceptance Criteria

An implementation satisfies this Contract if and only if:

1. `personal_intelligence_relationship_confirmation_events` exists with
   exactly the shape in §11.
2. `personal_intelligence_relationships` is byte-identical to its
   currently-shipped schema — zero columns, constraints, or indexes
   added, removed, or altered.
3. The repository's `create()` method implements the exact ownership +
   eligibility check in §12, atomically, with no separate pre-check.
4. The repository's unique-violation handling recognizes both error
   shapes in §14 — verified by a targeted regression test analogous to
   `personal-intelligence-relationship-evidence.repository.unique-violation.spec.ts`.
5. `deriveEffectiveConfirmationState` is implemented exactly as specified
   in §10.3, as a pure function, never a stored mutable column.
6. Every test category in §19 passes, including live PostgreSQL runtime
   verification (§20), with the PG16-vs-PG18 limitation (§21) reported
   honestly, not silently resolved.
7. All structural boundary tests in §19 pass, proving every invariant in
   §9 (of the operative decision) that applies to this increment remains
   intact.
8. No file outside the boundary in §15/§23 is modified.

## 26. Governance / Authorization Boundary

```
Temporal Validity → Context → Relationship + Relationship Evidence →
Matching-Hypothesis Confirmation → Cross-Claim Matching Implementation →
Living User Model
```

Temporal Validity, Context, and Relationship + Relationship Evidence are
already implemented, committed, and merged. This Contract addresses the
fourth stage. **This Contract does not reorder, collapse, or bypass any
stage** — it does not build Cross-Claim Matching Implementation or Living
User Model, and it does not reopen any completed increment.

**IMPLEMENTATION AUTHORIZATION: NOT GRANTED.** This Contract documents
what a future, separately authorized implementation pass must build; it
does not itself authorize any code, schema, or migration change. Per
`CLAUDE.md`'s Implementation Gate Sequence, a distinct "FOUNDER EXECUTION
DIRECTIVE" — naming this Contract specifically — is required before
implementation may begin, exactly as was required and separately issued
for D3 Promotion, Temporal Validity, Context, and Relationship +
Relationship Evidence before any of those increments' code was written.

Required sequence after this Contract: **Contract Draft → Founder Review
→ Founder Approval → Separate Implementation Authorization →
Implementation → Runtime Verification → Final Gate.** This document is
only the first of those steps.

## 27. Open Implementation Details (legitimately safe to leave to implementation)

The following are ordinary implementation judgment, not architectural
decisions, and are explicitly left open — resolvable at implementation
time without requiring a further Founder decision, mirroring how the
Relationship Contract's own §24 left comparable items open:

- Exact TypeScript type/interface/file naming beyond what §11/§15
  already fix.
- Exact test file names and internal test organization, provided every
  category in §19 is covered.
- Whether `occurredAt` defaults to `now` when equal to `createdAt` at the
  call site, or is always explicitly supplied by the caller — Always
  Explicit convention requires the latter, but the exact call-site
  ergonomics are an implementation detail.
- Migration file naming (drizzle-kit's generated name suffix).

No item in this list touches domain semantics, persistence truth, state
semantics, ownership, lifecycle, an invariant, or an architecture
boundary — each was checked against that list before being placed here.

---

**Any unresolved issue discovered during future review that is
genuinely architectural — not covered by §1–§26 above — must STOP
implementation and be raised as a new Founder decision, exactly as this
Contract's own five predecessor blockers were.**
