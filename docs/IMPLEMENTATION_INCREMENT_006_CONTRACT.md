# DECIVEXA — Implementation Increment 006 Contract

## A. Identity

- **Title:** IMPLEMENTATION INCREMENT 006 — WEB/PRODUCT INTEGRATION
  (Personal State & Personal State History)
- **Increment ID:** Implementation Increment 006
- **Status:** FOUNDER-APPROVED — BUILD-AUTHORIZED
- **Date drafted:** 2026-08-23
- **Contract approval date:** 2026-08-23
- **Contract approval reference:** Explicit Founder approval recorded in
  project governance conversation ("FOUNDER AUTHORIZATION — INCREMENT
  006", §1 "FORMAL CONTRACT APPROVAL"), resolving the procedural status
  gap identified in the Implementation Readiness Review.
- **Build Authorization date:** 2026-08-23
- **Build Authorization reference:** Explicit Founder Build Authorization
  recorded in the same message, §2 "BUILD AUTHORIZATION", strictly
  within the Allowed Files (§L) and API Boundary (§J) of this Contract.
- **Architecture Baseline:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`
- **Base:** `main` at `43d24cfb9c65c093444f44c7cbf24b8dae2cf449`

## B. Architectural Authority

This Contract is the direct, required continuation of
**ADR-002 — Web/Product Integration Boundary**
(`docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`), which is **Founder-approved**
(Founder ADR-002 Review, this session). ADR-002 §24 states the governing
sequence explicitly:

```
ADR-002 (architectural decision)
  → Founder approval of this architectural decision   ✅ SATISFIED
  → Scope Contract (this document)                     ← HERE
  → Implementation Readiness
  → explicit Build Authorization
  → Build
  → Validation
  → Founder Review
  → explicit Commit/Push Authorization
```

**Architectural approval does not equal Build Authorization.** ADR-002's
own §25 states it "does NOT authorize implementation, a Scope Contract,
Implementation Readiness, Build Authorization, or any modification of
`apps/web` or backend source." This Contract exercises the *permission*
ADR-002's Founder approval created (to define a Contract at all) — it
does not itself skip forward past Implementation Readiness or Build
Authorization, both of which remain fully outstanding after this
document is created.

## C. Purpose

Make the already-existing, already-implemented, already-tested Personal
State and Personal State History backend capabilities visible in the
authenticated DECIVEXA Web product, through a minimal, read-only product
integration — establishing the first genuine DECIVEXA product experience
beyond authentication.

**Existing Foundation (unmodified by this Contract):**
- Backend authentication (`/auth/register`, `/auth/login`, `/auth/me`).
- Backend Personal State (`GET /personal-state`, `POST /personal-state`,
  `PATCH /personal-state`).
- Backend Personal State History (`GET /personal-state/history`,
  Increment 005).
- Authenticated ownership enforcement (`AuthenticationGuard`,
  `context.userId`).

**New Product Capability (what this Contract scopes):** the Web
application consuming those already-existing read endpoints and
presenting them to the authenticated owner.

**Not being built:** no new domain capability, no new intelligence
layer, no new backend domain behavior. Increment 006 is a **Web consumer
increment**, not a backend redesign (Section K).

## D. Core Product Goal

Through the Web application, an authenticated user should be able to
answer:

1. *"What does DECIVEXA currently know about my Personal State?"*
2. *"What Personal State revisions does DECIVEXA have recorded for me?"*

The implementation must remain informational and transparent. It must
not introduce interpretation (Section I).

## E. Existing-State Baseline (Direct Repository Inspection)

Inspected directly, this session:

- `apps/web/app/page.tsx` — static home placeholder.
- `apps/web/app/login/page.tsx`, `apps/web/app/register/page.tsx` — real
  forms calling `useAuth().login`/`register`.
- `apps/web/app/dashboard/page.tsx` — wrapped in `RequireAuth`, currently
  a static placeholder (`<h1>Dashboard</h1><p>DECIVEXA Web
  Foundation</p>`), zero data binding.
- `apps/web/app/layout.tsx` — wraps the app in `AuthProvider`.
- `apps/web/lib/api.ts` — generic `apiFetch<T>(path, init)`, already
  attaches the stored bearer token and base URL to any path; no
  domain-specific calls exist anywhere yet.
- `apps/web/lib/auth-context.tsx` — calls exactly `/auth/me`,
  `/auth/login`, `/auth/register`; no other endpoint is called anywhere
  in `apps/web`.
- `apps/web/lib/require-auth.tsx` — client-side redirect-to-`/login` on
  `unauthenticated` status; not itself an authorization mechanism (the
  backend remains authoritative).
- `apps/web/e2e/auth.spec.ts` — Playwright e2e, auth flows only, using
  `page.route()` to mock backend responses against a built app
  (`playwright.config.ts`: `webServer: npm run start`).
- `apps/web/package.json` — dependencies: `next`, `react`, `react-dom`;
  devDependencies: `@playwright/test`, TypeScript. **No component-level
  test framework (e.g. Jest/React Testing Library) exists in `apps/web`
  — Playwright e2e is the only existing Web test convention.**
- `apps/web/` directory structure: flat — `app/`, `lib/`, `e2e/`; no
  `components/` directory exists.
- Backend: `apps/api/src/infrastructure/personal-state/personal-state.controller.ts`
  exposes `GET /personal-state`, `GET /personal-state/history`,
  `POST /personal-state`, `PATCH /personal-state`, all behind
  `AuthenticationGuard`. `GET /personal-state/history` returns a bare
  `PersonalStateRevision[]` (Increment 005, unmodified).

## F. Exact Functional Scope

**F.1 — Personal State View.** Web consumes `GET /personal-state` for the
authenticated user. The response is displayed using the existing backend
response contract (the `PersonalState` shape already returned). No new
backend response format, no new backend endpoint, no backend DTO created
merely for frontend convenience.

**F.2 — Personal State History View.** Web consumes
`GET /personal-state/history` for the authenticated user. The response is
the existing bare `PersonalStateRevision[]`. The Web layer may render
this data in human-readable form; it must **not** reinterpret it
(Section I).

**F.3 — Authentication Boundary.** Only authenticated users may access
these product views, via the existing `AuthProvider`/`RequireAuth`
infrastructure. No second authentication mechanism, no frontend token
verification duplication. Backend authentication remains authoritative.

**F.4 — Ownership Boundary.** The Web client must never supply an
arbitrary user id to retrieve another user's data. Explicitly forbidden:
`/personal-state/:userId`, `?userId=...`, body-level user ids,
client-controlled ownership, or any alternate ownership lookup. The
backend alone determines the authenticated owner (unchanged,
`context.userId` derived only from the verified access token — Increment
005 Contract §I).

## G. Product Surface

The minimal product surface required is: a way for an authenticated user
to reach a view showing current Personal State (F.1) and its history
(F.2). The existing authenticated `apps/web/app/dashboard/page.tsx` is
the most direct existing entry point, since it already sits behind
`RequireAuth` and is currently an unused placeholder — but this Contract
does **not** fix the exact file layout (e.g. whether History renders
inline on the dashboard, as a dashboard sub-section, or as a separate
route under `apps/web/app/dashboard/`) as a binding decision; that
granularity of choice belongs to Implementation Readiness/Build, within
the boundary this Contract sets (Section L, Allowed Files). This Contract
explicitly does **not** authorize: an unnecessary navigation
architecture, a full dashboard redesign, or a new design system (none is
required by the existing Web architecture, which currently uses no
component library).

## H. UI Philosophy

*"Show the user what the system knows before claiming to understand the
user."*

**Allowed to display:** current Personal State fields (`timezone`,
`locale`, `availability`, `provenance`, `revision`, `createdAt`,
`updatedAt`); revision history fields (`revision`, `timezone`, `locale`,
`availability`, `provenance`, `evidenceVersionId`, `createdAt`) — all
already present in the existing API responses, nothing invented.

**Must NOT claim or compute:** why the user changed; what pattern
exists; what the user should do; what the user is likely to do;
psychological interpretation; behavioral inference; AI-generated
conclusions.

## I. History Presentation Boundary

**Allowed presentation:** displaying revisions in the order the backend
already returns them (ascending by `revision` — unchanged,
`findRevisionsForUser`'s existing ordering, Increment 005); showing
`revision`, `createdAt`, `provenance`, `evidenceVersionId`, and the
Personal State field values contained in each revision, as-is.

**Not allowed, under any circumstance in this increment:** calculating
behavioral trends; inferring personality, preferences, strengths, or
weaknesses; generating an interpreted timeline; calculating change
scores; semantically summarizing changes; detecting patterns; generating
recommendations; invoking AI; creating an "insight" layer. **The Web
layer is a presentation consumer, not an Understanding engine.**

## J. API Boundary

**Increment 006 consumes existing API capabilities; it does not expand
backend API scope.** No new backend route is authorized by this
Contract. No backend controller modification is authorized, unless
Implementation Readiness discovers an actual, concrete existing-contract
incompatibility — in which case: **STOP and report it; do not silently
expand scope** (Section O, Stop Conditions).

Exact existing endpoints this Contract authorizes Web to consume:
- `GET /personal-state` (pre-existing, unmodified).
- `GET /personal-state/history` (Increment 005, unmodified).

No other backend endpoint (Evidence, PI Core, Memory, or any other) is
authorized for consumption (Section K).

## K. Backend Preservation / Explicit Non-Goals

The following **must remain unchanged**: Personal State repository;
Personal State/History persistence; database schema; migrations;
Personal State ownership model; `AuthenticationGuard`; Personal State
use-case semantics (`getHistory` and all existing methods); the
`GET /personal-state/history` route itself.

This Contract explicitly excludes, and does not authorize under any
interpretation:
- **Evidence** — deliberately deferred by ADR-002 §9/§15/§23. No
  Evidence pages, widgets, API calls, navigation, or visualization.
- **PI Core** — protected by ADR-001 F.3 and ADR-002 §16. No PI Core
  claims, claim versions, access predicates, or repositories consumed by
  Web.
- **Memory** — protected by ADR-002 §17. No Memory records, versions,
  APIs, or repositories consumed by Web.
- **Human Understanding** — completely out of scope (ADR-002 §18). No
  Identity, Values, Preferences, Capabilities, Strengths, Weaknesses,
  Behavioral Patterns, Environment, Context, or Living User Model design
  or implementation. This Increment does **not** constitute Phase 4
  implementation.
- **Intelligence** — AI, agents, recommendations, prediction, pattern
  detection, interpretation, inference, personalization logic, Growth
  Navigation, Progress Intelligence, Digital Twin, AI Coach, Adaptive
  Recovery, Risk Intelligence — all explicitly out of scope.
- **Product over-expansion** — no full DECIVEXA dashboard redesign, no
  Personal OS home screen, no Goal OS, Daily OS, Life Modules,
  notification system, analytics platform, productivity system, task
  manager, generalized profile system, or full identity platform. Only
  the minimum surface needed to expose Personal State and its History is
  in scope.
- Any schema, migration, or backend behavior change (Section M).
- Any new backend route, DTO, or response-shape change (Section J).

## L. File-Level Boundary

**Allowed Files** (evidence-backed candidates; exact final file layout
within this boundary is an Implementation Readiness/Build-time decision,
not fixed here):
- `apps/web/app/dashboard/**` — the existing authenticated entry point,
  and/or new sub-route(s) under it, for rendering Personal State and
  History.
- `apps/web/lib/**` — the existing `apiFetch` helper is already generic
  and reusable as-is; a new, narrowly-scoped Personal State/History
  client helper file may be added here if Implementation Readiness
  determines it is warranted, but must not alter `apiFetch`'s existing
  contract.
- `apps/web/e2e/**` — new Playwright spec file(s) for the new product
  views, following the existing `auth.spec.ts` convention
  (`page.route()` mocking).
- `apps/web/app/layout.tsx` — only if navigation to the new view requires
  a minimal, non-redesigning addition (e.g. a link); no redesign.

**Forbidden Files / Areas** (unless a concrete contradiction is
discovered and separately approved, per Section O):
- `apps/api/**` — the entire backend. Any apparent need to touch it
  triggers a Stop Condition (Section O).
- Database schema, migrations.
- PI Core, Memory, Evidence source (backend or, per Section K, any Web
  file consuming them).
- Human Understanding, AI/agent systems (none exist to touch, and none
  may be created).
- `docs/DECIVEXA_MASTER_ROADMAP.md`, `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`,
  `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`, any ADR,
  `CLAUDE.md` — this and future governance stages document decisions
  about this Increment; they are not modified *by* it.
- Any unrelated Web module (`apps/web/app/login/**`,
  `apps/web/app/register/**`, `apps/web/lib/auth-context.tsx`,
  `apps/web/lib/require-auth.tsx`) beyond what is strictly required to
  wire navigation to the new view — no redesign of existing auth flows.

## M. Database

**Database impact: NONE.** No schema change, no migration, no seed
change, no persistence change of any kind. This Increment consumes only
already-existing, already-tested read endpoints.

## N. Security / Ownership

Explicitly preserved, unchanged: backend authentication; backend
ownership (`context.userId`, token-derived only); no caller-supplied
user id anywhere in the Web client; no direct database access from Web;
no authorization logic based solely on frontend state. Web may
hide/show UI based on authentication *status* (existing `RequireAuth`
pattern), but the backend remains the final, sole authority on both
authentication and ownership.

## O. Stop Conditions

The future Build must stop immediately and return to Founder governance
if it discovers:
- a missing backend capability;
- a need for a new API endpoint or backend controller change;
- a need for schema or migration change;
- a need to modify `AuthenticationGuard` or the Personal State ownership
  model;
- a need to consume PI Core, Memory, Evidence, or any Human
  Understanding capability;
- a need for AI or agent behavior;
- a need for a new architecture decision beyond ADR-002's boundary;
- a need to expand beyond the Allowed Files boundary (Section L);
- an ambiguity in the existing `GET /personal-state` or
  `GET /personal-state/history` response contract that cannot be
  resolved by reading the existing, already-tested backend code;
- a requirement for a new dependency that materially changes the Web
  architecture (e.g. a new UI framework, state-management library, or
  component system).

**A Stop Condition means: STOP → document evidence → return to
Founder.** Do not improvise past it.

## P. Rollback

Rollback is the removal of the Web integration changes (Allowed Files,
Section L) only, leaving all existing backend Foundation capabilities
fully intact. No database rollback, no backend rollback, no migration
rollback is expected or authorized, because none is permitted by this
Contract in the first place (Section M).

## Q. Test Scope

Existing Web test convention, confirmed by direct inspection (Section
E): **Playwright e2e only** (`apps/web/e2e/*.spec.ts`, run against a
built app via `page.route()` backend mocking, per `auth.spec.ts`'s
existing pattern). **No component-level test framework exists in
`apps/web`.** Introducing one (Jest, React Testing Library, etc.) is
classified as a **non-blocking repository-wide gap**, not a requirement
of this Increment — mirroring how the equivalent absence of
controller-level HTTP tests was classified as non-blocking during
Increment 005's Implementation Readiness review. This Contract requires
only the existing Playwright convention to be extended, not a new
framework introduced (Section R, dependency scope).

At minimum, future tests must cover:
1. Authenticated access to the Personal State/History product view(s).
2. Personal State loads and renders using the existing `GET /personal-state`
   contract.
3. Personal State History loads and renders using the existing
   `GET /personal-state/history` contract, preserving repository-provided
   order.
4. Empty history is handled without error (empty state, not a crash).
5. Backend/API failure is handled without crashing the application
   (error state).
6. Unauthenticated users cannot reach the product view (redirected, per
   existing `RequireAuth` behavior — mirrors the already-existing
   dashboard redirect test in `auth.spec.ts`).
7. No arbitrary-user-id lookup exists anywhere in the new code (a
   negative/structural check, verifiable by code inspection during
   Readiness/Build rather than necessarily a runtime test).
8. No accidental calls to Evidence, PI Core, Memory, or any deferred
   domain endpoint exist anywhere in the new code (same, structural).
9. Full existing Web e2e suite (`auth.spec.ts`) continues to pass
   unmodified.

This Contract **defines** these tests; it does not implement them.

## R. Dependency Scope

**No new dependency is assumed or required.** Inspected directly:
`apps/web/package.json` (Next.js, React, Playwright, TypeScript only);
the existing `apiFetch` client already generalizes to any path;
`AuthProvider`/`RequireAuth` already generalize to any protected route.
Zero dependency changes is the preferred and expected outcome; if
Implementation Readiness or Build discovers a genuine need for one, that
is itself a Stop Condition (Section O) requiring separate justification,
not a silent `package.json` change.

## S. Six-Criteria DECIVEXA Evaluation

| Criterion | Evaluation |
|---|---|
| 1. Vision alignment | Strong — the first user-visible DECIVEXA product capability beyond authentication, without any intelligence claim. |
| 2. Long-term architecture strength | Good — pure Web-side consumption of already-stable, already-tested backend contracts; no backend coupling; fully reversible (Section P). |
| 3. Improvement opportunities | Immediate: closes the confirmed zero-consumer gap for Personal State/History. Future/backlog: Evidence integration, richer presentation (not decided here, per ADR-002 §23). |
| 4. User input burden vs. system value | Zero new user input required — all displayed data already exists from prior use. Creates the first actual user-visible value in the product, honestly scoped as *presentation* value, not *intelligence* value. |
| 5. AI capability | Preserved, not implemented — Section I's boundary keeps Web a pure presentation consumer, so future AI/Understanding layers remain free to build on the same backend data without any Web redesign. |
| 6. Trusted reference platform | Good — for the first time, a real user could verify "this is what DECIVEXA has recorded about me," directly strengthening transparency and trust in practice. |

**Honesty note:** Increment 006's principal value is turning existing
Foundation capability into the first user-visible DECIVEXA product
capability. It does **not** create intelligence, understanding, or
insight of any kind.

## T. Acceptance Criteria

1. An authenticated user can access the Personal State product view.
2. Personal State is retrieved through the existing `GET /personal-state`
   API, unmodified.
3. The Web client does not request an arbitrary user id anywhere.
4. Personal State History is retrieved through the existing
   `GET /personal-state/history` API, unmodified.
5. History is rendered using existing revision data only.
6. Repository/API ordering is not silently changed; any presentation-only
   reordering, if ever proposed, would require its own explicit
   Contract amendment — none is authorized here.
7. Empty history is handled correctly (empty state, not an error).
8. API failures are handled without crashing the application.
9. Unauthenticated users cannot access the protected Personal State
   views (existing `RequireAuth` behavior, verified for the new route).
10. No Evidence, PI Core, Memory, Human Understanding, or AI calls are
    introduced anywhere.
11. No backend, API, schema, or migration changes are introduced.
12. Existing authentication functionality (login/register/`/auth/me`)
    continues to work unmodified.
13. Existing Web e2e tests (`auth.spec.ts`) continue to pass unmodified.
14. New tests (Section Q) cover the newly introduced product behavior.
15. No unrelated Web functionality is changed.
16. `git diff --check` is clean.
17. Build/typecheck/e2e-test validation passes according to the
    repository's existing conventions for `apps/web`.
18. No deferred architecture item (Section K) is consumed.

## U. Governance Sequence

```
ADR-002 Founder Approval                    ✅ SATISFIED
  → Increment 006 Scope Contract (this document)   ← HERE
  → Implementation Readiness Review           NOT STARTED
  → Founder Build Authorization               NOT AUTHORIZED
  → Build                                     NOT STARTED
  → Validation                                NOT STARTED
  → Founder Post-Implementation Review        NOT STARTED
  → Commit/Push Authorization                 NOT AUTHORIZED
```

No stage transitions automatically. Each requires its own separate,
explicit Founder action, per every prior Increment's established
pattern (004, 005).

## V. Implementation Status

**IMPLEMENTATION STATUS: NOT IMPLEMENTED.**

**BUILD AUTHORIZATION: NOT AUTHORIZED.**

The creation of this Contract must not be interpreted as Build
Authorization, Implementation Readiness, or permission to modify any
source file, test, package file, schema, or migration. A separate,
explicit Founder approval of this Contract is required next, followed by
a separate Implementation Readiness review, followed by a separate,
explicit Founder Build Authorization — in that order — before any file
named in Section L (Allowed Files) may be created or modified.
