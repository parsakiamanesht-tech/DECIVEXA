# DECIVEXA — Implementation Increment 007 Contract

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"FOUNDER-AUTHORIZED INCREMENT 007 DOCUMENTARY CLOSURE — EXECUTION
DIRECTIVE." This section is a present-day addition; the document below
it is preserved unmodified as the historical record.*

This document is a historical Scope Contract. The historical
authorization statements contained in it — "DRAFT — AWAITING FOUNDER
REVIEW," "Not Founder-approved," "Not Build-authorized," and §U's "This
Scope Contract does not authorize implementation" — remain historical
statements of the document itself, describing its own authority state
at the time it was written. They are not upgraded here into
independently corroborated authorization, and this reconciliation does
not claim they were false when written or that this reconciliation
retrospectively changes their historical meaning.

Independently of that historical status, surviving repository evidence
demonstrates that the Personal State Web Write Exposure this document
describes was subsequently implemented:

- **Personal State web client:** `apps/web/lib/personal-state.ts`
  defines `initializePersonalState` and `updatePersonalState`.
- **Dashboard UI:** `apps/web/app/dashboard/page.tsx` defines
  `InitializeForm` and `UpdateForm`, implementing initialize/update
  behavior for the authenticated user's own Personal State.
- **End-to-end tests:** `apps/web/e2e/personal-state.spec.ts` includes
  coverage for initialize, update, optimistic-concurrency (409)
  conflict handling, revision behavior, and history refresh after an
  update — incorporated into the existing Personal State spec file,
  following this Contract's own permitted alternative to a separate
  sibling file (§K).
- All of the above are found in commit `daad820` (`feat(web): enable
  Personal State editing on the dashboard`), confirmed an ancestor of
  the current HEAD.
- **Pre-existing backend dependency, not created or modified by this
  work:** `apps/api/src/infrastructure/personal-state/personal-state.controller.ts`
  already exposed `@Post()` and `@Patch()` handlers for
  `/personal-state` before this implementation; the shipped web code
  consumes those existing endpoints unmodified.

The implementation described above is independently verifiable in the
repository and is associated with commit `daad820`. The surviving
repository evidence establishes the shipped implementation, but this
reconciliation does not reconstruct or fabricate the separate
authorization path that permitted that implementation.

**ADR-003 distinction:** the prior audit established that
`docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`'s ADR-003 is a tracked,
committed, independently corroborated Founder-approved architectural
decision. That fact does not retroactively establish that this
Contract itself received Founder Review approval or Build
Authorization — ADR-003's approval and this Contract's own
authorization state (as recorded in its historical §A/§U) remain
distinct governance events, and this reconciliation does not use one to
manufacture the other.

The evidence above shows the shipped implementation touched exactly the
web files this Contract's own §K identified as its intended boundary
(`apps/web/app/dashboard/page.tsx`, `apps/web/lib/personal-state.ts`,
`apps/web/e2e/personal-state.spec.ts`); this reconciliation does not
claim that every individual requirement in §E–§M was independently
re-verified — for example, the minimal "successful save feedback"
requirement (§E.7) was not individually re-checked and is not asserted
as confirmed here.

This reconciliation does not authorize any new implementation and does
not alter Decision 7 (remains NOT APPROVED) or Cross-Claim Matching
(remains NOT AUTHORIZED). It does not authorize any Evidence, Memory,
Personal Intelligence, AI, Context Engine, Relationship, GCP, backend,
schema, or authentication work, and does not authorize any further
Personal State feature, API, or UI expansion beyond what is described
as already shipped above.

## A. Status

**DRAFT — AWAITING FOUNDER REVIEW.**

Not Founder-approved. Not Build-authorized. This Contract does not
authorize implementation (§U).

- **Title:** Implementation Increment 007 — Web Personal State Write
  Exposure
- **Date drafted:** 2026-08-23
- **Base:** `main` at `43984f84324d46b76d7a62278c755de7556835a9`
- **Contract approval date:** not yet occurred
- **Build Authorization date:** not yet occurred

## B. Purpose

Convert the already Founder-approved ADR-003 architectural boundary
("Web is authorized architecturally to expose Personal State write
operations for the authenticated user's own Personal State, using the
already-existing backend endpoints `POST /personal-state` and
`PATCH /personal-state`") into a precise, implementation-ready scope, so
an authenticated user can view **and update** their own Personal State
from the existing dashboard — completing the read/write symmetry that
Increment 006 (read-only) deliberately left open.

## C. Architectural Authority

This Contract is the direct, required continuation of **ADR-003 —
Web/Product Integration Boundary, Phase 2**
(`docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`), **Founder-approved**
2026-08-23. ADR-003 §19–§20 authorizes exactly: Web mutation of the
authenticated user's own Personal State, via the existing, unmodified
`POST`/`PATCH /personal-state` endpoints only; no new backend endpoint;
no caller-supplied identity; backend remains sole authority on identity/
ownership/validation; history/revision creation stays backend-owned.
ADR-003 §27 states explicitly: *"This ADR does NOT authorize
implementation... a separate Scope Contract and Build Authorization"*
are required — this document is that Scope Contract. It does **not**
itself authorize implementation (§U); it must, like Increment 006's
Contract, receive its own separate Founder Review/approval and,
subsequently, a separate Founder Build Authorization before any file may
be created or modified.

Evidence exposure remains explicitly **not** part of this Contract
(ADR-003 §11/§21 — deferred for a structural reason: Evidence has no
content field). PI Core, Memory, Human Understanding, and every other
Architecture Backlog item remain untouched and unauthorized by this
Contract (§T).

## D. Existing Backend Contract (Verified Directly From Source, This Session)

**`POST /personal-state`** (`PersonalStateController.initialize` →
`PersonalStateUseCase.initialize`):
- Request body: `PersonalStateInput = { timezone?: string | null;
  locale?: string | null; availability?: "available"|"limited"|
  "unavailable" | null }` — all fields optional.
- **Idempotent**: if a Personal State already exists for
  `context.userId`, returns the existing state unchanged (HTTP 200 body,
  though the route itself is decorated `@HttpCode(201)` for the
  first-creation case) — it does **not** error or overwrite.
- Validation (in `PersonalStateUseCase`, unmodified): `timezone` — if
  provided and non-null, must be 1–100 chars after trim; `locale` — if
  provided and non-null, must be 2–20 chars after trim. Violations throw
  `PersonalStateValidationError`, mapped by the controller to
  `400 BadRequestException` (or `401` if the message contains
  "required").
- Response shape: the full `PersonalState` object (`id`, `userId`,
  `timezone`, `locale`, `availability`, `provenance: "declared"`
  (fixed by the use-case, not caller-supplied), `revision: 1` on first
  creation, `createdAt`, `updatedAt`).
- Ownership: `context.userId` only (from `contextOf(request)`,
  `AuthenticationGuard`) — no caller-supplied identity anywhere.
- History: `repository.create(...)` is documented to produce the first
  history revision as an automatic, backend-owned side effect
  (`PersonalStateRepository` interface, unmodified).
- Error/status codes observed: `201 Created` (first init) / implicit
  `200`-shaped body on idempotent no-op / `400 Bad Request` (validation)
  / `401 Unauthorized` (no `context.userId`).

**`PATCH /personal-state`** (`PersonalStateController.update` →
`PersonalStateUseCase.update`):
- Request body: `PersonalStateInput & { revision?: number }` — the
  controller defaults a missing `revision` to `0`
  (`body?.revision ?? 0`), which **always** fails validation
  (`revision < 1` → `PersonalStateValidationError` → `400`), so the Web
  client **must** always send the caller's current, real `revision`
  explicitly; there is no working default.
- **Optimistic concurrency**: `expectedRevision` (the submitted
  `revision`) must exactly match the state's current stored revision;
  on mismatch, or if no state exists yet, `updateForUser` returns
  `undefined`, mapped to `PersonalStateConflictError` → `409 Conflict`.
- Same field validation as `initialize`.
- Response shape on success: the updated full `PersonalState` object,
  with `revision` incremented by 1 and `updatedAt` refreshed.
- Ownership: identical mechanism to `initialize`/`get`/`getHistory` —
  `context.userId` only.
- History: `updateForUser`'s success is documented to produce a new
  history revision automatically, backend-owned, unmodified.
- Error/status codes observed: `200 OK` (success, implicit — no
  `@HttpCode` override) / `409 Conflict` (revision mismatch or no
  existing state) / `400 Bad Request` (validation).

No aspect of either endpoint was guessed — both were re-read directly
from `apps/api/src/infrastructure/personal-state/personal-state.controller.ts`
and `apps/api/src/application/personal-state/personal-state.use-case.ts`
this session, cross-checked against the existing, unmodified
`personal-state.use-case.spec.ts` coverage.

## E. Product Scope

The dashboard (already displaying Personal State + History since
Increment 006) gains the ability to **create** an initial Personal State
(for a user in the `not-initialized` view state) and to **edit** an
existing one, using exactly the two endpoints in §D. Explicit scope
decisions (per the governing instruction §6), all **included**:

1. **Initialization UI** — included. A user currently shown "No Personal
   State recorded yet." (Increment 006's existing `not-initialized`
   state) needs a way to create one; without this, the write boundary
   would be unreachable for that user.
2. **Update/edit UI** — included (the core purpose).
3. **Revision/conflict handling** — included, required by §D's
   optimistic-concurrency contract; see §I.
4. **Loading states** — included, mirrors Increment 006's existing
   pattern.
5. **Validation errors** — included, surfaces the backend's existing
   `400` messages.
6. **API errors** — included, mirrors Increment 006's existing pattern.
7. **Successful save feedback** — included, minimal (e.g. a transient
   confirmation state) — not a toast/notification system, no new UI
   primitive.
8. **Preservation of existing Personal State History display** —
   included: after a successful initialize/update, since §D confirms a
   new history revision was just created backend-side, the History
   section must be refreshed (re-calling the already-authorized
   `getPersonalStateHistory()`) so the display does not go stale — this
   reuses an existing, already-authorized read call, not a new
   capability.

## F. API Boundary

**Exactly** `POST /personal-state` and `PATCH /personal-state`, as
documented in §D, unmodified. No new backend route, DTO, or
response-shape change. No pagination, filtering, or batch operation. No
other domain's write endpoint (Evidence's `POST /evidence`, etc.) is in
scope.

## G. Identity / Ownership Boundary

- No user ID may be accepted from the UI as an authoritative identity.
- No user ID may be sent as a caller-controlled identity parameter, in
  any form (body, query, header beyond the existing `Authorization`
  bearer token already attached by `apiFetch`).
- The backend remains the sole authority for identity and ownership —
  unchanged, unmodified.
- Authentication remains unchanged. Authorization remains unchanged.
- `context.userId` remains derived exclusively from the verified
  authentication token (`AuthenticationGuard`, unmodified).
- Web must never implement its own ownership check, and must never
  allow editing another user's state — structurally impossible under
  the existing mechanism (§D), and this Contract introduces nothing
  that would create such a path.
- **Explicit adversarial security requirement:** a malicious
  authenticated user manipulating request payloads, query parameters,
  route parameters, or browser state must not be able to select another
  user's Personal State. This is already guaranteed by the existing,
  unmodified backend mechanism (verified in ADR-003 §15 and the ADR-003
  Approval Review's own adversarial test) and must remain true after
  Increment 007 — nothing in this Contract's scope touches that
  mechanism.

## H. UI Behavior

- Initialization: a form (fields: `timezone`, `locale`, `availability`
  — all optional, matching `PersonalStateInput`) submitted via
  `POST /personal-state`; on success, the dashboard's existing Personal
  State section switches from `not-initialized` to `ready` and displays
  the created state; the History section is refreshed (§E.8).
- Update: a form pre-filled with the currently displayed state's
  values, plus the currently displayed `revision` (read, not editable by
  the user) submitted via `PATCH /personal-state`; on success, the
  displayed state and History both refresh (§E.8, §J).
- The UI performs **no** client-side validation beyond basic form
  ergonomics (e.g. not blocking submission) — validation is presented
  from the backend's actual response (§I), not duplicated client-side
  business logic, consistent with Increment 006's precedent of never
  reimplementing backend rules in Web.

## I. Error / Conflict Handling

- **Validation error (`400`):** display the backend's returned message
  (mirroring Increment 006's existing `errorMessage()` helper pattern);
  form remains editable, no data loss.
- **API/network failure:** display a generic error state, matching
  Increment 006's existing pattern; form remains editable.
- **Optimistic-concurrency conflict (`409`):** this Contract does **not**
  invent a new conflict-resolution protocol. On `409`, the UI must:
  (1) inform the user their view is out of date, and (2) re-fetch the
  current `GET /personal-state` (and, per §E.8, history) so the
  displayed `revision` and values are current — the user then decides
  whether to reapply their intended change against the fresh state. No
  automatic retry, no silent merge, no last-write-wins override — the
  existing backend semantics (reject on mismatch) are honored exactly as
  they exist.
- **Unauthenticated:** unreachable in practice — the dashboard already
  sits behind `RequireAuth` (Increment 006, unmodified); if a token
  expires mid-session, the existing `401` → `apiFetch` error path
  applies, handled the same as any other API error above (no new
  session-management behavior is in scope).

## J. History Behavior

Every successful `initialize`/`update` triggers a refresh of the
existing, already-authorized `getPersonalStateHistory()` call (§E.8),
so the History section (Increment 006, unmodified in its own rendering
logic) reflects the new revision the backend just created automatically.
No new history endpoint, no client-side history construction, no
reordering — the existing ascending-by-revision order (unmodified
backend behavior) continues to govern display.

## K. Allowed Files

Smallest possible boundary, based on direct inspection of the existing
Web structure (flat: `app/`, `lib/`, `e2e/`; no `components/` directory;
Increment 006 kept all presentation as local functions inside
`dashboard/page.tsx` rather than separate component files):

- `apps/web/app/dashboard/page.tsx` — modify, to add initialize/update
  form UI as local functions, following Increment 006's existing
  in-file-component convention (no new component file is expected to be
  necessary; if Implementation Readiness/Build finds one genuinely
  warranted for size/clarity, it must be narrowly scoped to Personal
  State presentation only, e.g. `apps/web/app/dashboard/personal-state-*.tsx`,
  not a general component library).
- `apps/web/lib/personal-state.ts` — modify, to add
  `initializePersonalState(input)` and `updatePersonalState(input)`
  client functions alongside the existing `getPersonalState`/
  `getPersonalStateHistory`, reusing the existing `apiFetch` helper
  unmodified.
- `apps/web/e2e/personal-state.spec.ts` — modify, and/or one new sibling
  file `apps/web/e2e/personal-state-write.spec.ts` — bounded strictly to
  Personal State write test coverage (§M), not a general e2e expansion.

No other file. Explicitly **not** authorized: any broader grant of
`apps/web/**`.

## L. Forbidden Files

Unless a concrete contradiction is discovered and separately reported
(§P, Stop Conditions):

- `apps/api/**` in its entirety.
- Database schema, migrations.
- Authentication implementation, authorization implementation.
- `apps/web/lib/api.ts` (the existing `apiFetch` helper — reused
  unmodified).
- `apps/web/lib/auth-context.tsx`, `apps/web/lib/require-auth.tsx`.
- `apps/web/app/login/**`, `apps/web/app/register/**`.
- Any ADR, the Roadmap, the Architecture Backlog, `CLAUDE.md`.
- Human Understanding, PI Core, Memory, Evidence, AI/agents (none exist
  to touch, and none may be created).
- Goal OS, Daily OS, Learning OS, Business OS, Relationship OS, Digital
  Twin, Growth Navigation, Progress Intelligence, Risk Intelligence,
  Adaptive Recovery, Trustworthy Navigation Architecture.
- Security architecture beyond the existing, unmodified boundary.
- `apps/web/playwright.config.ts` and any package file (§N).

## M. Tests Required (Defined, Not Implemented)

Using the existing Playwright `page.route()` mocking convention
(Increment 006's established pattern) exclusively — no new test
infrastructure:

1. Authenticated user can initialize Personal State (mock
   `POST /personal-state` success; assert the UI transitions from
   `not-initialized` to displaying the new state).
2. Authenticated user can update Personal State (mock `PATCH` success
   with the correct `revision` in the request; assert updated values
   render).
3. The update request sends the correct current `revision` (assert on
   the mocked route's received request body).
4. A successful update refreshes both the displayed state and the
   displayed History (mock `GET /personal-state/history` returning an
   additional revision after the `PATCH`; assert it appears).
5. Validation errors are handled (mock `400`; assert the message
   displays, form remains usable).
6. Backend/API errors are handled (mock `500`; assert no crash, error
   state shown).
7. Optimistic-concurrency conflict is handled per §I (mock `409`; assert
   a conflict message and that `GET /personal-state` is re-fetched).
8. Unauthenticated users remain blocked (already covered by the
   existing, unmodified `auth.spec.ts` — not duplicated).
9. No caller-supplied user id exists anywhere in the new code
   (structural/code-review check, not a runtime test — same
   classification Increment 006 used for its equivalent item).
10. No unrelated domain (Evidence, PI Core, Memory) is touched
    (structural/code-review check, same classification).

## N. Validation Requirements

From `apps/web`: `npm run typecheck`, `npm run build`,
`npm run test:e2e` (Playwright — subject to the same pre-existing
browser/toolchain limitation noted in §O.13 below, not to be repaired as
part of this Contract). From `apps/api`: `npm run typecheck` and
`npm test`, to positively confirm zero backend regression (identical
verification discipline to Increment 006, even though no backend file
is expected to change).

## O. Six-Criteria DECIVEXA Review (Pre-Implementation)

| Criterion | Assessment |
|---|---|
| 1. Vision alignment | Good — completes the read/write symmetry Increment 006 deliberately left open; the product becomes the user's actual interface to their own state, not merely a viewer. |
| 2. Long-term architecture strength | Good — reuses existing, tested, unmodified endpoints and the existing ownership mechanism exactly; no new abstraction, no new trust boundary. |
| 3. Improvement opportunities | Immediate: closes the write-side zero-consumer gap identified in the Post-Increment 006 Determination. Future/Backlog: none pulled forward by this Contract. |
| 4. User input burden vs. system value | Good — the user already visits the dashboard to *see* their state (Increment 006); this Contract lets that same visit also *set* it, without introducing any new required user behavior pattern. |
| 5. AI capability | **Not applicable / correctly absent.** This is a product data-interaction boundary, not an intelligence increment — no score is claimed here beyond "preserved, not touched." |
| 6. Trusted reference platform | Good — a user who can both see and correct their own recorded state has stronger, more concrete control over what the system holds about them than a read-only view alone. |

## P. Stop Conditions

Implementation must stop and return to Founder governance immediately if
discovery reveals:
- a backend change is required;
- a new API endpoint is required;
- a schema or migration is required;
- authentication or authorization must change;
- caller-supplied identity becomes necessary in any form;
- ownership behavior differs from what ADR-003 §15/§20 and this
  Contract's §G describe;
- existing `POST`/`PATCH` semantics (§D) are insufficient for the
  scoped UI behavior (§H);
- revision/concurrency semantics (§I) cannot be preserved exactly as
  the backend already implements them;
- an Evidence, PI Core, Memory, or Human Understanding dependency
  appears anywhere;
- AI/agent behavior becomes necessary;
- more files than §K's boundary are required;
- a new dependency is required;
- the actual API response/request shapes are found to differ materially
  from §D at implementation time;
- implementation would require changing ADR-003 in any way;
- any genuine ambiguity exists about whether a file falls inside §K.

**A Stop Condition means: STOP → document evidence → return to
Founder.** Do not improvise past it.

## Q. Non-Goals

Evidence integration (explicitly deferred, ADR-003 §11/§21); PI Core,
Memory, Human Understanding, Living User Model, Context Model
advancement; AI, agents, prediction, interpretation, inference,
aggregation, or any "why this changed" narrative; Personal AI Coach,
Decision Intelligence, Growth Navigation, Progress Intelligence,
Learning Intelligence, Adaptive Recovery, Risk Intelligence, Digital
Twin; Goal OS, Daily OS, Learning OS, Business OS, Relationship OS,
Trustworthy Navigation Architecture; voice; any new backend capability;
any schema/migration; any authentication/authorization change; any
repair of the pre-existing Playwright/toolchain limitation (§O.13 of the
governing instruction).

## R. Rollback / Reversibility

Rollback is the removal of the newly introduced initialize/update UI,
client functions, and their test files only (§K), leaving Increment
006's read-only presentation and all backend Foundation capabilities
fully intact. No database rollback, no backend rollback, no migration
rollback is required or authorized, because none is permitted by this
Contract (§L). Fully reversible.

## S. Security / Privacy

No new data category is introduced — the same fields already readable
since Increment 006 (`timezone`, `locale`, `availability`) become
writable by their own owner only (ADR-003 §16). No new trust boundary;
the existing, already-proven ownership mechanism is exercised for writes
instead of only reads, unchanged. No consent, audit, or purpose-binding
mechanism is introduced or required — editing one's own already-visible
data is not a new category of access beyond what Increment 006 already
established as acceptable for this same data.

## T. Future Architecture Compatibility

This Contract does not block or couple any future layer: Human
Understanding, Living User Model, Context Model, PI Core advancement,
Memory advancement, Evidence, Personal AI Coach, Decision Intelligence,
Growth Navigation, Progress Intelligence, Learning Intelligence, Human
Growth/Behavioral Intelligence, Adaptive Recovery, Risk Intelligence,
Digital Twin, Goal OS, Daily OS, Learning OS, Business OS, Relationship
OS, Trustworthy Navigation Architecture, voice, or agents — none of them
depend on, or are constrained by, Web being able to write Personal
State. The write boundary remains a thin product consumer of the
existing domain API, exactly as ADR-003 §17 established.

## U. Founder Authorization Requirements

1. **Contract approval:** explicit Founder approval of this Contract as
   a whole, in the form already used for Increments 004/005/006.
2. **Implementation Readiness review**, following this Contract's
   approval.
3. **Explicit Founder Build Authorization**, following that review.

**This Scope Contract does not authorize implementation.** No `.ts`
source file, test file, or configuration file described in §K may be
created or modified until all three of the above occur, in order —
exactly mirroring the governance sequence already used for Increment
006:

```
ADR-003 APPROVED                              ✅ SATISFIED
  → Scope Contract (this document)             ← HERE, DRAFT
  → Founder Review of Scope Contract            NOT STARTED
  → Scope Contract approval / Build Authorization   NOT AUTHORIZED
  → Implementation                              NOT STARTED
  → Validation                                  NOT STARTED
  → separate Commit/Push Authorization          NOT AUTHORIZED
```
