# DECIVEXA — Implementation Increment 005 Contract

## Present-Day Repository Reconciliation

**Added by Founder-authorized documentation/governance reconciliation
("FOUNDER EXECUTION DIRECTIVE — IMPLEMENTATION INCREMENT 005
RECONCILIATION"). This section is purely additive. Every word of the
historical Contract below — including its "NOT BUILD-AUTHORIZED" Identity
line (Section A), its "Build Authorization: NOT AUTHORIZED" statement
(Section T), and every other historical statement — is preserved
byte-for-byte and remains the historical record of what was approved and
authorized at drafting time (2026-08-23). Nothing below rewrites, deletes,
or reinterprets that historical record.**

This section exists to reconcile that historical record with present-day
repository reality, which now differs from it.

### What the historical Contract said

As recorded in Section A/T below: Contract **approval** occurred
2026-08-23, but **Build Authorization did not** ("Build Authorization
date: not yet occurred" / "Build Authorization: NOT AUTHORIZED"). No `.ts`
source file, schema, migration, or test file described in Section F was
authorized to be created or modified by this Contract alone, per Section
R/T.

### What exists in the repository today

The capability this Contract scoped — application/API exposure of the
existing `PersonalStateRepository.findRevisionsForUser` read path — is
now implemented, tested, and consumed, matching this Contract's Section F
scope and Section J decisions exactly:

- **API — implemented, matches Section J's resolved decisions exactly:**
  `PersonalStateUseCase.getHistory` (use-case method name, per J.1 Option
  A) in `apps/api/src/application/personal-state/personal-state.use-case.ts`,
  delegating to the existing, unmodified
  `PersonalStateRepository.findRevisionsForUser`; `GET
  /personal-state/history` (route path, per J.2 Option A) in
  `apps/api/src/infrastructure/personal-state/personal-state.controller.ts`,
  whose own in-line comment reads *"Increment 005 / ADR-001 F.1: narrow,
  read-only exposure of the existing revision-history capability. Bare
  array response, no envelope (Contract §J.3)."* — a direct, contemporaneous
  reference to this Contract by number. Shipped in commit `43d24cf`
  ("feat(personal-state): expose authenticated revision history").
- **API tests:** four dedicated `getHistory` tests in
  `apps/api/src/application/personal-state/personal-state.use-case.spec.ts`
  (unmodified-order retrieval, ownership scoping, empty-history, and
  unauthenticated-rejection — matching Acceptance Criteria N.1–N.4 below),
  plus `apps/api/src/application/personal-state/personal-state.app-composition.spec.ts`,
  whose own test name reads *"...including the Increment 005 history
  capability"* — again, a direct, contemporaneous reference to this
  Contract by number, proving the route is wired and reachable through
  the real `AppModule`.
- **Web:** `getPersonalStateHistory`/`usePersonalStateHistory` in
  `apps/web/lib/personal-state.ts` and a `PersonalStateHistorySection` in
  `apps/web/app/dashboard/page.tsx`, shipped in commit `43984f8` ("feat(web):
  display Personal State and its history on the dashboard").
- All of the above is on `main` as of this reconciliation, and continues
  to pass in the current, full API test suite.

### What this reconciliation does and does not do

The current repository/mainline state therefore differs from the
historical authorization state this Contract itself records: the
capability described in Section F is implemented, while this Contract's
own Section T still reads "Build Authorization: NOT AUTHORIZED." This
reconciliation:

- **does** record that difference as present-day fact, evidenced by the
  paths, commits, and tests cited above;
- **does not** claim this Contract's historical approval (Section A,
  Section S) constituted, or is retroactively converted into, Build
  Authorization — Section T's historical statement stands exactly as
  written;
- **does not** invent, reconstruct, or assert the existence of a specific
  separate Build Authorization record for this capability — no such
  record was found in this reconciliation, and none is fabricated here;
  the authorization path between this Contract's approval and the shipped
  commit above is not reconstructed by this section;
- **is** a documentation correction/record update only, not a claim of
  retroactive authorization, and does not itself authorize any further
  implementation, modification, or extension of this or any other
  capability.

---

## A. Identity

- **Title:** Personal State History Exposure
- **Increment ID:** Implementation Increment 005
- **Status:** FOUNDER-APPROVED — NOT BUILD-AUTHORIZED
- **Date drafted:** 2026-08-23
- **Contract approval date:** 2026-08-23
- **Contract approval reference:** Explicit Founder approval recorded in
  project governance conversation ("FOUNDER-AUTHORIZED GOVERNANCE ACTION —
  Increment 005 — Finalize Scope Contract After Explicit Founder
  Approval"), resolving Section J's two remaining open decisions
  (J.1 = Option A — `getHistory`; J.2 = Option A —
  `/personal-state/history`) and approving this Contract as a whole.
  This approval is **not** Build Authorization (see Build Authorization
  date, below, and Section T).
- **Build Authorization date:** not yet occurred
- **Architecture Baseline:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`
- **Technology Baseline:** `TD-08`
- **Governance Gate:** `TD-09` — no checklist item is satisfied by this
  document. This Contract does not update, and is not recorded in,
  `docs/TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md`, which
  remains unmodified.
- **Base:** `main` at `b9ebd17ee27077d3db1ed03d7bc98851850f7cfc`

## B. Authority Boundary

This Contract exists because of an explicit Founder architectural decision,
`docs/DECIVEXA/ARCHITECTURE_DECISIONS.md` — **ADR-001** ("Personal State
History (Phase 4) Scope, and the Human Understanding System / Personal
Intelligence Core Relationship"), specifically its **F.1 = Option 1**
decision ("Narrow History Exposure"). ADR-001 §13 ("Scope Implications")
states the explicit boundary for any future Scope Contract arising from
it: *"Personal State History → the existing revision history exposed
through the appropriate application/use-case/API boundary — nothing
broader."* ADR-001 §15 explicitly states that decision does **not**
itself authorize implementation, Build Authorization, Contract
authorization, or migration authorization — a separate Scope Contract
(this document), a separate Implementation Readiness review, and a
separate, explicit Build Authorization must each subsequently occur
before implementation may begin.

**This document is that Scope Contract's draft. Its creation is itself
governed** — the Founder instruction that authorized drafting it stated
explicitly: *"These decisions authorize progression to the Scope Contract
governance stage only. They do NOT authorize implementation."* This
Contract therefore requires its own separate, explicit Founder approval
(Section S) before it authorizes anything, mirroring the Gate Rule already
established by `docs/IMPLEMENTATION_INCREMENT_002_CONTRACT.md` and
`docs/IMPLEMENTATION_INCREMENT_003_CONTRACT.md`, and the approval →
readiness → Build Authorization sequence most recently used for the
Memory increment (`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md`
through `PHASE_10Q_G_MEMORY_BUILD_AUTHORIZATION_GATE.md`).

## C. Objective

Expose the already-existing, already-implemented, already-tested Personal
State revision-history read capability
(`PersonalStateRepository.findRevisionsForUser`) through the application
(use-case) and HTTP (controller) layers, so an authenticated user can
retrieve their own Personal State revision history — without introducing
any new data model, query semantics, authorization architecture, or
capability beyond exposing what already exists.

## D. Existing-State Baseline (Historical, Not Modified)

The following already exist, are already merged, and are **not** modified,
re-authorized, or reinterpreted by this Contract:

- `PersonalState` domain model (`core/personal-state/personal-state.model.ts`).
- `PersonalStateRevision` domain model
  (`core/personal-state/personal-state-revision.model.ts`) — immutable
  record: `id`, `userId`, `revision` (integer), `timezone`, `locale`,
  `availability`, `provenance`, `evidenceVersionId` (nullable Evidence
  lineage), `createdAt`.
- `PersonalStateRepository` interface
  (`core/personal-state/personal-state.repository.ts`), which already
  declares:
  `findRevisionsForUser(userId: string): Promise<PersonalStateRevision[]>`
  — documented in the interface itself as *"Read-only access to the
  immutable, append-only history of accepted PersonalState revisions for
  a user, ordered ascending by revision. This is not a write path -
  revisions are only ever produced as a side effect of
  create/updateForUser succeeding."*
- The real (non-stub) Drizzle implementation of this method
  (`infrastructure/persistence/personal-state.repository.ts:61-68`):
  selects all rows from `personal_state_revisions` where `userId` matches,
  ordered ascending by `revision`, mapped to the domain type. No
  pagination, filtering, or limit parameters exist on this method today.
- `PersonalStateUseCase`
  (`application/personal-state/personal-state.use-case.ts`) — currently
  exposes exactly three methods: `get`, `initialize`, `update`. **No
  existing use-case method calls `findRevisionsForUser`.**
- `PersonalStateController`
  (`infrastructure/personal-state/personal-state.controller.ts`) —
  currently exposes exactly `GET /personal-state`, `POST /personal-state`,
  `PATCH /personal-state`. **No existing route exposes revision history.**
- A repository-wide search confirms `findRevisionsForUser` has exactly
  three references in the entire codebase: its interface declaration, its
  real implementation, and one unused stub method on the fake repository
  used by `personal-state.use-case.spec.ts:26` (present only to satisfy
  the `PersonalStateRepository` interface shape; no test exercises it,
  no assertion is made against it). This is the same "prepared but
  unconsumed primitive" pattern already used successfully by Increment
  004's PI access predicate (`docs/IMPLEMENTATION_INCREMENT_004_CONTRACT.md`
  §D, §H).

## E. Problem Statement

`findRevisionsForUser` is implemented and already covered by the existing
Drizzle query, but is unreachable by any user of the system: no
application-layer method calls it, and no HTTP route returns its result.
ADR-001 F.1 explicitly authorizes closing exactly this gap — application
and API exposure of an already-existing capability — while explicitly
excluding any broader History/Understanding capability (temporal queries,
interpretation, pattern detection, aggregation, synthesis, AI, or any
capability listed in Section G below).

## F. Scope

This increment may include only:

1. One new `PersonalStateUseCase` method that retrieves the calling
   user's own Personal State revision history, scoped by
   `context.userId` (mirroring the existing `get`/`update` pattern:
   `if (!context.userId) return failure(new PersonalStateValidationError(...))`),
   delegating directly to the existing, unmodified
   `PersonalStateRepository.findRevisionsForUser(userId)`.
2. One new `PersonalStateController` HTTP `GET` route that calls that
   use-case method via the existing `contextOf(request)` /
   `AuthenticationGuard` pattern already used by every route on this
   controller, and returns the resulting `PersonalStateRevision[]`
   directly (matching the existing precedent of returning `result.value`
   as-is, e.g. `PersonalStateController.get`, `EvidenceController.get`).
3. Unit tests for the new use-case method (Section N.1–N.6) and a
   composition/controller-level test for the new route, following
   existing repository test conventions (Section O). Tests are **defined**
   by this Contract; they are not written by it (Section O).

The use-case method name (`getHistory`), HTTP route path segment
(`GET /personal-state/history`), and response shape (bare
`PersonalStateRevision[]` array, no envelope) are all now fixed by this
Contract, per Section J's Founder-approved resolution.

## G. Explicit Non-Goals

This increment does **not** authorize, and explicitly excludes (verbatim
from the governing instruction and consistent with ADR-001 §12):

- temporal "state as of T" queries
- interpretation
- pattern detection
- aggregation
- synthesis
- AI
- agents
- Living User Model
- Human Understanding 4.1–4.10
- Context model
- PI Core modification
- new PI Core claim types
- PI Core reinterpretation
- Memory integration
- Memory modification
- new Evidence integration beyond existing behavior
- Evidence synchronization
- Digital Twin
- Predictive Intelligence
- Advanced Memory
- Advanced Personal Intelligence
- Goal OS
- Daily OS
- Actor≠Owner semantics (only actor-is-owner is in scope, matching every
  existing Personal State/Evidence route)
- pagination, cursors, or date-range filtering on the history read (the
  existing `findRevisionsForUser` has no such parameters; introducing them
  would be new query semantics beyond "expose the existing capability,"
  which ADR-001 F.1 does not authorize — see Section J)
- any schema or migration change (Section L)
- any unrelated Technical Foundation Maturation or Governance Hardening
  work (ADR-001 F.4 — parallel but independently governed)
- unrelated refactoring

Any discovery that implementation requires one of these triggers the Stop
Conditions in Section P.

## H. Architecture

```
Controller
    │  GET /personal-state/history  (this Contract's approved scope)
    ▼
PersonalStateUseCase.getHistory()   (this Contract's approved scope)
   (ownership check via context.userId; no new logic beyond delegation)
    │
    ▼
PersonalStateRepository.findRevisionsForUser(userId)  (existing, Section D, unmodified)
    │
    ▼ (NOT part of this increment)
   temporal queries / interpretation / pattern detection / aggregation /
   synthesis / Human Understanding 4.1–4.10 / Living User Model / Context
   model, each requiring its own separately approved future decision
```

The use-case name (`getHistory`) describes the application capability;
the repository name (`findRevisionsForUser`) describes the persistence
operation. This architectural separation is intentional and unchanged by
this Contract — the repository method is not renamed, modified, or
redesigned, and no additional abstraction layer is introduced between
the two.

This increment adds no new module, no new repository, no new domain
model, and no new persistence boundary. It adds exactly one use-case
method and one controller route, both pure delegations to existing,
already-tested capability.

## I. Authorization Semantics

Identical to every existing Personal State and Evidence route: the actor
is authenticated via `AuthenticationGuard`, and `context.userId` is used
directly as the query scope (`findRevisionsForUser(context.userId)`) —
the same ownership-equality mechanism already used by `PersonalState.get`
(`findByUserId(context.userId)`), `Evidence.get`
(`findByIdForUser(context.userId, id)`), and every other existing route.
No new authorization primitive, policy, or predicate is introduced or
required. Actor-is-owner is the only relationship evaluated; Actor≠Owner
access is explicitly out of scope (Section G), matching the existing,
unresolved-elsewhere Actor≠Owner deferment
(`docs/gates/PHASE_10K_3_FOUNDER_DECISION_ACTOR_OWNER_DEFERMENT.md`).

## J. Contract Decisions — Naming, Route, and Response Shape

Per the governing instruction's Critical Anti-Invention Rule, each item
below was resolved by an explicit, fresh, repository-wide precedent
search rather than assumption. These are Contract-detail-level decisions
within an already-authorized boundary — ADR-001 F.1 already authorizes
that an application/use-case/API exposure exists at all; only its exact
shape was undecided — the same category of decision Increment 004 §J
("Purpose-Binding Decision — DEFERRED") handled by marking undecided
items open for Founder resolution at Contract approval, rather than
treating them as a Section P Stop Condition.

### J.1 — Use-Case Method Naming — RESOLVED, FOUNDER DECISION RECORDED

**Founder Decision: Option A — `getHistory`.**

The application/use-case layer shall expose the Personal State history
capability through `PersonalStateUseCase.getHistory`. The use-case
method shall delegate to the existing repository capability,
`PersonalStateRepository.findRevisionsForUser(userId)`, unchanged — the
repository method is not renamed, modified, or redesigned. The
architectural separation is intentional (Section H): the use-case name
describes the application capability; the repository name describes the
persistence operation. No additional abstraction layer is introduced.

**Repository evidence found (two conflicting, both genuinely
evidence-backed, conventions):**

- **Convention A — module-local short verbs.** `PersonalStateUseCase`
  itself (`application/personal-state/personal-state.use-case.ts`)
  already establishes its own internal naming convention: `get`,
  `initialize`, `update` — none of these mirror their underlying
  repository method names (`findByUserId`, `create`, `updateForUser`).
  This is the same `RequestContext` + `Result<T>` convention family used
  by `EvidenceUseCase` (`get`, `getVersion`, `create`,
  `appendLifecycleVersion` — also short verbs, not repository-mirroring).
- **Convention B — repository-name mirroring.** `PersonalIntelligenceClaimUseCase`
  (`application/personal-intelligence/personal-intelligence-claim.use-case.ts`)
  is a thin pass-through: every one of its methods reuses its underlying
  repository method's exact name unchanged — including the closest direct
  analog to this Contract's need,
  `findActiveClaimVersionsForUser(userId): Promise<PersonalIntelligenceClaimVersion[]>`
  (line 42), which wraps `PersonalIntelligenceClaimRepository.findActiveClaimVersionsForUser`
  (`core/personal-intelligence/personal-intelligence-claim.repository.ts:51-54`)
  with no rename.

**Why this is not resolvable with high confidence from evidence alone:**
`PersonalStateUseCase` and `PersonalIntelligenceClaimUseCase` belong to
two different, already-established, already-diverged use-case
conventions in this repository (documented distinctly in this session's
own prior governance work on the Memory increment). Applying Convention B
inside `PersonalStateUseCase` would be internally inconsistent with that
file's own existing three methods; applying Convention A means inventing
a new short verb with no repository-wide precedent for what that verb
should be.

- **Option A:** `getHistory(context): Promise<Result<PersonalStateRevision[]>>`
  — short verb, consistent with `PersonalStateUseCase`'s own existing
  internal convention (`get`, `initialize`, `update`), `RequestContext`
  + `Result<T>` return shape.
- **Option B:** `findRevisionsForUser(context): Promise<Result<PersonalStateRevision[]>>`
  — reuses the existing repository method's exact name, consistent with
  `PersonalIntelligenceClaimUseCase`'s repository-mirroring convention.
- **Option C:** a different name the Founder specifies.

**Recommendation (advisory only, not Founder authorization):** Option A
(`getHistory`), for intra-file consistency with `PersonalStateUseCase`'s
own three existing methods, which this Contract's new method sits
alongside and must remain stylistically consistent with. Confidence:
moderate — this is a judgment call between two real, valid, but
conflicting repository conventions, not an invented one.

### J.2 — HTTP Route Path Segment — RESOLVED, FOUNDER DECISION RECORDED

**Founder Decision: Option A — `/personal-state/history`.**

The future controller operation shall use `GET /personal-state/history`.
The route must remain authenticated, ownership-scoped, and read-only
(Section I). It must not introduce pagination, cursor parameters,
temporal filters, arbitrary user identifiers, Actor≠Owner semantics,
administrative access, cross-user access, or query-language parameters,
unless separately authorized by a future architectural decision
(Section G).

**Repository evidence found:** an explicit search of every `@Get`/
`@Post`/`@Patch`/`@Put`/`@Delete` decorator in every controller
(`auth.controller.ts`, `evidence.controller.ts`,
`personal-state.controller.ts`, `health.controller.ts`) found no
"history," "revisions," list, or collection-style path segment anywhere
in the repository. The one existing multi-segment route,
`EvidenceController`'s `GET :id/versions/:version`, retrieves one
specific version by number — not a list — and is therefore not a genuine
precedent for a collection/history path.

**Why evidence is insufficient:** no controller in this repository has
ever exposed a sub-resource or history path. This is a first instance,
not a convention-following choice.

- **Option A:** `GET /personal-state/history`
- **Option B:** `GET /personal-state/revisions`
- **Option C:** a different path the Founder specifies.

**Recommendation (advisory only, not Founder authorization):** Option B
(`GET /personal-state/revisions`), because the domain model itself is
already named `PersonalStateRevision` (plural resource name matching the
existing type name exactly), whereas "history" is not a name used
anywhere in the existing domain vocabulary. Confidence: low — this is a
genuinely new pattern with no repository precedent either way.

### J.3 — Response Shape — RESOLVED, EVIDENCE-BACKED

**Repository evidence found:** an explicit search of every controller
file for envelope, wrapper, pagination, cursor, or `data`/`items`/`meta`
patterns found **zero** instances anywhere in the repository. Every
existing controller method, without exception, returns its use-case
result's value directly and unwrapped
(`PersonalStateController.get` → `return result.value;`,
`EvidenceController.get`/`getVersion` → `return result.value;`,
`AuthController.me` → same pattern). No controller in this codebase has
ever constructed a response envelope, wrapper object, or pagination
metadata structure.

**Decision:** the new route returns the bare array
(`PersonalStateRevision[]`) directly, matching this exceptionless,
repository-wide "return the value unwrapped" convention. Introducing a
wrapper (e.g. `{ revisions: [...] }`) would be the first instance of that
pattern anywhere in the repository and is therefore explicitly rejected
as inconsistent with existing evidence, not merely undecided.

HTTP **method** was already evidence-backed prior to this review: every
existing read-only route in this repository uses `GET`
(`PersonalStateController.get`, `EvidenceController.get`,
`EvidenceController.getVersion`) — `GET` is confirmed, not invented, for
the new route.

## K. Security & Privacy Impact

- No new external consumer boundary is created — the new route sits
  behind the same `AuthenticationGuard` already protecting every other
  Personal State and Evidence route.
- No data leaves the process beyond what the authenticated owner already
  has read access to via `GET /personal-state` (the history route
  exposes the same fields already exposed by the current-state route,
  across the user's own revisions only).
- Ownership scoping is enforced by the same mechanism already relied upon
  throughout the repository (`context.userId` equality) — no new trust
  boundary, no cross-user access path.
- No consent, audit, or purpose-binding mechanism is introduced or
  required — history exposure to the record's own owner is not a new
  category of access beyond what `GET /personal-state` already
  establishes as acceptable for this same data.

## L. Data Impact

None. No schema change. No migration. No new persisted field, table, or
index. The new use-case method and controller route operate only on data
already produced by the existing `create`/`updateForUser` revision
lifecycle and already queried by the existing, unmodified
`findRevisionsForUser` implementation.

## M. Dependencies

- Existing `PersonalStateRepository.findRevisionsForUser` (Section D) —
  already merged, no change required.
- Existing `AuthenticationGuard` / `RequestContext` pattern — used as-is,
  not modified.
- No dependency on Memory, PI Core, Evidence (beyond the existing
  `evidenceVersionId` lineage field already present on
  `PersonalStateRevision`), or any capability that does not already exist
  in the repository.

## N. Acceptance Criteria

1. The new use-case method returns the calling user's own revision
   history only, scoped by `context.userId`.
2. An unauthenticated request (`!context.userId`) is rejected, matching
   the existing `get`/`update` validation pattern.
3. Revisions are returned in the same order already produced by
   `findRevisionsForUser` (ascending by `revision`) — the use-case
   introduces no re-ordering, filtering, or transformation.
4. A user with no Personal State revisions receives an empty array, not
   an error.
5. No schema changes are required or introduced.
6. No migration is required or introduced.
7. No AI/agent consumer is introduced.
8. Existing Personal State behavior (`get`, `initialize`, `update`, and
   their existing routes) remains unchanged.
9. Existing governance documents remain untouched.
10. No pagination, temporal filtering, or aggregation is introduced
    (Section G).
11. `findRevisionsForUser` itself (repository interface and
    implementation) is not modified.

## O. Test Strategy

Unit and composition tests only, following the existing conventions
already used throughout Personal State and Evidence:

1. **Use-case history retrieval test** — a fake `PersonalStateRepository`
   (extending the existing pattern in `personal-state.use-case.spec.ts`,
   which already stubs `findRevisionsForUser`) returns a known set of
   revisions; the use-case method returns them unmodified.
2. **Ownership isolation test** — the use-case method is called with
   `context.userId` and the fake asserts it is invoked with exactly that
   id, not an arbitrary or absent one.
3. **Ordering test** — the use-case preserves whatever order the fake
   repository returns (ascending-by-revision ordering itself is already
   covered at the real Drizzle implementation, unmodified by this
   increment).
4. **Empty-history test** — the fake repository returns `[]`; the
   use-case returns `[]`, not an error.
5. **Unauthenticated test** — missing `context.userId` yields a
   validation failure, matching the existing `get`/`update` pattern.
6. **Controller/composition test** — mirroring
   `application/personal-intelligence/personal-intelligence.app-composition.spec.ts`'s
   pattern, asserting the new route is wired and reachable through
   `AppModule` (or `[AppModule, ...]` as appropriate), and that an
   unauthenticated request is rejected by `AuthenticationGuard`.
7. **Regression** — full existing `apps/api` test suite (as currently
   listed in `package.json`'s `test` script) continues to pass unmodified,
   plus the new spec file(s) added to that same hardcoded list, matching
   the mechanism used by every prior increment.

This Contract **defines** these tests; it does not implement them
(consistent with the governing instruction's Section 10 and Increment
004 §O's identical self-restriction).

## P. Stop Conditions

Implementation must stop and return to Founder governance immediately if
discovery reveals that:

- exposing history requires any schema or migration change;
- exposing history requires modifying `findRevisionsForUser` itself
  (interface or implementation);
- exposing history requires a new authorization architecture beyond
  actor-is-owner equality;
- exposing history requires touching Memory, PI Core, or Evidence beyond
  the existing `evidenceVersionId` field already on `PersonalStateRevision`;
- pagination, temporal filtering, or aggregation is discovered to be
  required rather than merely convenient;
- the scope cannot be implemented as two pure delegating layers
  (use-case method → existing repository method; controller route →
  use-case method) without additional logic;
- existing architecture evidence conflicts with the approach in Section F;
- scope expands beyond what Section F and Section G permit.

## Q. Rollback

Rollback is the removal of the newly introduced use-case method,
controller route, and their test files only. No data migration rollback
is required or authorized, because no schema or migration change is
permitted by this Contract (Section G, Section L). No destructive
rollback operation is authorized during the drafting phase — this
Contract does not create anything to roll back.

## R. Governance Gates

- This document is **prospective**. Contract approval (below) does not,
  by itself, authorize implementation.
- ADR-001 (Section B) authorized progression to this Scope Contract
  governance stage only; it did not approve this Contract's specific
  content.
- Explicit Founder approval of this exact Contract, including resolution
  of Section J's decisions, **has now occurred** (Section A, Section S) —
  in the form already used for Increment 002/003/004 and the Memory
  increment.
- A subsequent Implementation Readiness review (TD-09-pattern, per the
  sequence used for Increment 004 and the Memory increment) is required
  next, after Contract approval and before Build Authorization. **This
  Contract's approval does not itself perform, or authorize the start
  of, that review.**
- A subsequent, separate, explicit Founder Build Authorization is
  required before implementation.
- No source code may be changed before Implementation Readiness and
  Build Authorization both occur.

## S. Founder Decisions Required

1. **Contract approval — SATISFIED.** Explicit Founder approval of this
   Contract as a whole was recorded 2026-08-23 (Section A), in the form
   already used for Increment 002/003/004 and the Memory increment.
2. **Resolution of Section J's decisions — SATISFIED.** J.1 (use-case
   method naming) resolved as Option A — `getHistory`; J.2 (HTTP route
   path segment) resolved as Option A — `/personal-state/history`; both
   explicitly recorded by the Founder 2026-08-23 (Section J.1, Section
   J.2). J.3 (response shape) was already resolved, evidence-backed, and
   required no further Founder decision.

No further Founder decision is required to consider this Contract's
content approved. A separate, distinct Implementation Readiness review
and a separate, distinct Founder Build Authorization remain outstanding
(Section R, Section T) before implementation may begin.

## T. Implementation Authorization Statement

**Build Authorization: NOT AUTHORIZED.**

Contract approval (Section A, Section S) is **not** Build Authorization
and does not itself authorize implementation. This Contract defines an
approved, but not yet buildable, implementation scope. Per Section R, an
Implementation Readiness review and a separate, explicit Founder Build
Authorization must each still occur — in that order — before any `.ts`
source file, schema, migration, test file, or `package.json` entry
described in Section F may be created or modified.
