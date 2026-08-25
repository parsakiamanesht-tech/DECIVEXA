# DECIVEXA — Architecture Decisions

**Purpose:** authoritative, repository-resident record of DECIVEXA
architectural decisions, per `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`
§4 ("Required Authoritative Documentation") and §15 ("Decision Source of
Truth: Why did we choose this? What is currently authoritative? What
changed?"). This is the first entry in this document; the file did not
exist prior to this record.

---

## ADR-001 — Personal State History (Phase 4) Scope, and the Human
Understanding System / Personal Intelligence Core Relationship

### 1. Decision ID

`ADR-001`

### 2. Date

2026-08-23

### 3. Founder Decision

The Founder explicitly resolved four previously unresolved architectural
questions (F.1–F.4), presented and captured across this session's prior
Founder Decision Capture turns, with no answer inferred or assumed.

### 4. F.1 Decision — Personal State History, Phase 4

**Selected: Option 1 — Narrow History Exposure.**

`"Personal State History — Phase 4"` is narrowly defined as exposing the
already-existing, already-tested Personal State revision-history
capability through the appropriate application/use-case and API layers.
The existing repository capability
`PersonalStateRepository.findRevisionsForUser(userId)` (implemented at
`apps/api/src/infrastructure/persistence/personal-state.repository.ts`,
declared in `apps/api/src/core/personal-state/personal-state.repository.ts`)
is the foundation for this scope.

This decision does **not** authorize or include: temporal "state as of
T" queries; interpretation; pattern detection; aggregation; synthesis;
AI; cross-domain understanding; PI Core integration; Memory integration;
Living User Model; Context model; any new Personal State data model.
Those remain outside this decision unless separately authorized later.

### 5. F.2 Decision — Human Understanding System vs. Personal
Intelligence Core

**Selected: Option B — Two Maturity Layers.**

Human Understanding System (Roadmap Phase 4) is the foundational/
domain-level layer of the user's evolving understanding. The
"Personal Intelligence Core" entry in the Architecture Backlog
(`docs/DECIVEXA_MASTER_ROADMAP.md` §1.10) represents a later, more
advanced interpretive/AI/synthesis layer built above the foundational
Human Understanding capabilities. The existing
`apps/api/src/core/personal-intelligence/` claim/version model is
therefore recognized as partial foundational progress toward the Human
Understanding System, while remaining a closed, independently governed
implementation.

This decision does **not** authorize modification, extension,
reinterpretation, or reopening of the existing PI Core.

### 6. F.3 Decision — Status of Existing PI Core

**Selected: Option A.**

The existing PI Core is recognized as partial foundational progress
toward Human Understanding. Its existing claim/version model remains
closed, unchanged, independently governed, and protected from
opportunistic extension. No new `claimType`, no schema change, no
use-case expansion, no controller/API exposure, no AI interpretation,
and no cross-domain orchestration is authorized by this decision.

### 7. F.4 Decision — Sequencing

**Selected: Option B — Parallel.**

Technical Foundation Maturation, Governance Hardening, and Verification
may proceed in parallel with Personal State History work, but must
remain independently scoped and governed. Parallel priority does not
mean unrelated hardening work may be silently added to the Personal
State History Contract; each capability boundary retains its own
evidence, scope, acceptance criteria, governance, and authorization.

### 8. Architectural Rationale

The narrow F.1 scope was selected because it is the only candidate
grounded directly in an already-implemented, already-tested repository
capability (`findRevisionsForUser`) that is currently unconsumed above
the persistence layer — the same "prepared primitive awaiting a future
evidenced consumer boundary" pattern this repository has already used
successfully (Increment 004's PI access predicate). It requires no
resolution of the harder F.2 question before it can be scoped.

The F.2/F.3 decision (Two Maturity Layers) resolves the textual tension
in `docs/DECIVEXA_MASTER_ROADMAP.md` between Phase 4 ("Human
Understanding System," marked "⚪ NEXT MAJOR DOMAIN") and the
Architecture Backlog's "Personal Intelligence Core" entry (listed as
deferred, kept outside Core) by treating them as two maturity levels of
one lineage rather than either the same concept or fully unrelated
systems — consistent with how the same Roadmap document already
distinguishes basic "Memory Readiness" (§1.8, established) from
"Advanced Memory" (§1.10, deferred).

The F.4 parallel-but-independently-governed sequencing matches
`docs/DECIVEXA_MASTER_ROADMAP.md` §9's literal listing of Personal
State History, Technical Foundation Maturation, Governance Hardening,
and Verification as co-priorities, without implying they merge into one
undifferentiated scope.

### 9. Evidence Used

- `docs/DECIVEXA_MASTER_ROADMAP.md` §3.9 (Personal State History
  sub-phases, "Phase 4 ← CURRENT," "should prepare the Foundation for
  Human Understanding"), §8–§9 (current project position and priority),
  Phase 4 full text (lines 1029–1219), §1.10 (Architecture Backlog).
- `apps/api/src/core/personal-state/personal-state.repository.ts`,
  `personal-state-revision.model.ts`, `personal-state.model.ts`
  (existing, unmodified implementation).
- `apps/api/src/infrastructure/persistence/personal-state.repository.ts`
  (confirmed real, non-stub `findRevisionsForUser` implementation).
- `apps/api/src/application/personal-state/personal-state.use-case.ts`
  and `apps/api/src/infrastructure/personal-state/personal-state.controller.ts`
  (confirmed neither currently calls/exposes `findRevisionsForUser`).
- `apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts`
  (existing `claimType` enum, cross-referenced against Roadmap Phase 4's
  ten sub-items).
- `docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` and Increment
  004's governance history (precedent for "prepared, tested, unconsumed
  primitive" scoping pattern).

### 10. Explicit Rejected Alternatives

- **F.1 Option 2** (Human Understanding Scope) — rejected as the
  immediate decision because it would require F.2 to be resolved first
  and risks the same undefined-boundary problem previously found with
  Goal Readiness.
- **F.1 Option 3** (Foundation/Maturation combined phase) — rejected as
  the immediate decision in favor of keeping Personal State History
  independently scoped per the F.4 decision.
- **F.1 Option 4** (Insufficient Definition) — rejected; the Founder
  determined sufficient definition exists via Option 1's narrow scope.
- **F.2 Option A** (Same Concept) — rejected; the Architecture
  Backlog's explicit deferral of "Personal Intelligence Core" while
  Phase 4 is marked next is inconsistent with full identity.
- **F.2 Option C** (Distinct Systems) — rejected; not selected by the
  Founder.
- **F.2 Option D** (Insufficient Evidence) — rejected; the Founder
  determined Option B is sufficiently supported to decide now.
- **F.3 Option B** (PI Core independent, not part of Human
  Understanding) — rejected; superseded by the F.2 Option B decision.
- **F.4 Option A** (hardening before Personal State History) and
  **Option C** (Personal State History before hardening) — rejected in
  favor of parallel, independently-governed sequencing.

### 11. Consequences

- A future Scope Contract may be drafted for Personal State History
  exposure (F.1 Option 1 scope) without first resolving the Human
  Understanding System's full definition.
- The existing PI Core implementation's governance status is
  clarified — it is foundational-but-closed — without reopening or
  modifying it.
- Technical Foundation Maturation / Governance Hardening / Verification
  work may be pursued independently, on its own governance track,
  without being folded into the Personal State History scope.

### 12. Explicit Non-Goals (preserved from the Founder's instruction)

The next possible Scope Contract must not silently expand into: Human
Understanding sub-items 4.1–4.10; Living User Model; Context model; PI
Core modification; Memory integration; Evidence integration beyond what
is already explicitly supported; AI; agents; predictive intelligence;
Digital Twin; Goal OS; Daily OS; Advanced Memory; Advanced Personal
Intelligence.

### 13. Scope Implications

The explicit boundary for any future Scope Contract arising from this
decision is: **Personal State History → the existing revision history
exposed through the appropriate application/use-case/API boundary** —
nothing broader, per §2 of the Founder's decision instruction.

### 14. Deferred Questions

- The exact application/use-case method signatures and API shape for
  exposing `findRevisionsForUser` are not decided here — that belongs
  to a future Scope Contract.
- Whether temporal "state as of T" queries, interpretation, pattern
  detection, aggregation, or synthesis will ever be authorized, and
  under what future decision, remains open.
- The exact boundary of the "advanced/interpretive" Personal
  Intelligence Core layer (F.2/F.3) is not defined here — only its
  relationship to the foundational layer is.
- The exact scope of "Technical Foundation Maturation" and "Governance
  Hardening" (F.4) is not defined here.

### 15. Implementation Authorization Statement

**This decision does NOT itself authorize implementation, Build
Authorization, Contract authorization, or migration authorization, and
does not permit any modification of source code.** A separate Scope
Contract must subsequently be created and reviewed; a separate
Implementation Readiness review must subsequently occur; a separate,
explicit Build Authorization must subsequently be issued. Only then may
implementation begin.

---

## ADR-002 — Web/Product Integration of Existing Read-Only Foundation
Capabilities

### 1. Title

Web/Product Integration Boundary: Read-Only Presentation of Existing,
Authenticated, Owner-Scoped Foundation Data (Personal State and Personal
State History)

### 2. Status

**ARCHITECTURALLY DECIDED — NOT IMPLEMENTATION-AUTHORIZED.**

This status is deliberately distinct from `FOUNDER-APPROVED` (used for
Increment Contracts, e.g. `docs/IMPLEMENTATION_INCREMENT_005_CONTRACT.md`
§A) and from `BUILD-AUTHORIZED`. Neither is claimed here. This ADR
resolves an architectural boundary question only; it grants no
implementation, Contract, Readiness, or Build authorization.

### 3. Date

2026-08-23

### 4. Context

Following Implementation Increment 005 (`docs/IMPLEMENTATION_INCREMENT_005_CONTRACT.md`,
committed at `43d24cfb9c65c093444f44c7cbf24b8dae2cf449`), a Post-Increment
005 Next-Step Architectural Determination (read-only, this session)
established, via direct repository inspection, that:

- `apps/web/lib/auth-context.tsx` calls exactly three backend endpoints:
  `/auth/me`, `/auth/login`, `/auth/register`. No other file under
  `apps/web/` calls any backend endpoint.
- `apps/web/app/dashboard/page.tsx` is a static placeholder
  (`<h1>Dashboard</h1><p>DECIVEXA Web Foundation</p>`) with zero data
  binding.
- `apps/web/e2e/auth.spec.ts` covers authentication flows only.
- Five backend domain capabilities (Evidence, Personal State, Personal
  State History, PI Core, Memory) are implemented and tested, and **all
  five have zero product-surface consumer.**
- `docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md` classifies
  the existing Web work as an "Auth Foundation, not a complete
  authentication system," explicitly lists what is "Not included" (all
  authentication-specific), and states: *"Future authentication
  capabilities must be introduced through separate architecture
  decisions and implementation gates."*

### 5. Problem

`docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md` is textually
silent on whether Web may consume non-authentication, domain-data
read endpoints (e.g. `GET /personal-state`, `GET /personal-state/history`).
Its "Not included" list is scoped specifically to authentication concepts
("Backend authentication service," "Token security architecture," "Full
identity platform," etc.) and does not mention domain-data display one
way or the other. Silence is not authorization: per
`docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` §5–§8 (Decision
Challenge Protocol, Anti-Yes-Man Rule, Conflict Detection Rule) and
per this repository's standing rule that a conceptual or prior document
must never be silently promoted into authorization it does not
explicitly grant, this ambiguity must be resolved by an explicit
decision, not by inference from the existence of already-working code
(`GET /personal-state/history` already exists and is already
authenticated) or from Roadmap language about Web "maturing."

### 6. Decision

**Option B is selected: a new, explicit architecture decision is
required, and this document is that decision.**

Web/Product consumption of existing, authenticated, owner-scoped,
read-only Foundation data is hereby **architecturally authorized as a
distinct, bounded capability**, separate from — and not automatically
implied by — the existing Web Auth Foundation boundary
(`docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md`).

**Why Option A (existing Web scope is already sufficient) was rejected:**
`docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md`'s own stated
rationale is "controlled architectural evolution" and preventing
"premature expansion of ... scope," and its explicit consequence clause
requires "separate architecture decisions" for future capability
expansion. Nothing in that document's Context, Decision, or Consequences
sections affirmatively states that Web may already read and display
backend domain data. Proceeding as if it did would treat a document's
silence as authorization — exactly what
`docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` §5/§6/§14
("No Silent Architectural Drift") forbid. The mere existence of a
working, tested backend endpoint (Increment 005) does not itself
authorize a specific consumer of it — evidenced directly by PI Core's
and Memory's access predicates/use-cases, which exist, are tested, and
are still correctly treated by this repository as having no
authorization for any specific consumer until one is separately decided.

### 7. Rationale

1. **Evidence-based problem identification**: the single largest,
   most concrete, evidence-confirmed gap in the current repository is
   the absence of any product-surface consumer for any domain capability
   (Post-Increment 005 Determination, this session).
2. **Roadmap alignment**: `docs/DECIVEXA_MASTER_ROADMAP.md` §9 ("Current
   Priority") lists "Technical Foundation Maturation" as a current
   priority; Web is explicitly Phase 2 item 2.3, and Phase 2 is marked
   "🟡 FOUNDATION MATURATION" (not yet 🟢 ESTABLISHED) — Web/Product
   integration of already-existing data is squarely within that
   still-open maturation scope, not a new Roadmap phase.
3. **No deferred-domain coupling**: this decision touches only the
   boundary between Web and already-existing, already-authenticated read
   endpoints. It does not reopen, extend, or reinterpret PI Core, Memory,
   Evidence, or any Human Understanding sub-item.
4. **Governance discipline over velocity**: this ADR resolves only the
   boundary question explicitly raised by the prior read-only
   determination; it does not select an implementation approach, UI
   design, or component structure, all of which remain for a future,
   separately governed Scope Contract.

### 8. Scope

**Architecturally authorized by this decision (boundary only, not
implementation):**
- Web may consume already-existing, already-authenticated, read-only,
  owner-scoped backend endpoints, beginning with Personal State
  (`GET /personal-state`) and Personal State History
  (`GET /personal-state/history`).
- A future Scope Contract may define how (not whether) Web presents this
  data.

**NOT authorized by this decision:**
- Any specific UI, page, component, or route in `apps/web`.
- Any DTO or API response-shape change.
- Any Evidence consumption by Web (see §9 — deferred pending separate
  analysis).
- Any write/mutation capability from Web beyond what already exists
  (login/register/`PATCH /personal-state`, which pre-date this decision
  and are unaffected by it).
- Implementation of any kind (§15, §23).

### 9. Explicit Non-Goals

This decision does not authorize, and explicitly excludes:
- Evidence consumption by Web (Evidence was named as a candidate in the
  governing instruction "potentially ... only if the architectural
  analysis proves it belongs in the same initial boundary" — this
  analysis does **not** find that proof: no evidence in this session's
  inspection establishes an immediate Web consumer need for Evidence
  specifically, unlike Personal State/History, which were the explicit
  trigger for this ADR. Evidence inclusion is deferred to a future,
  separately justified decision, not silently bundled in here.)
- PI Core, Memory, Human Understanding (4.1–4.10), Living User Model,
  Context Model, AI, agents, recommendations, analytics, predictive
  intelligence, Digital Twin, Goal OS, Daily OS, Relationship OS,
  Learning OS, Business OS, Growth Navigation, Progress Intelligence,
  Adaptive Recovery, Risk Intelligence, Trustworthy Navigation
  Architecture — all remain fully out of scope and unaffected.
- Any interpretation, inference, pattern detection, or synthesis of
  Personal State/History data within Web (§10 below).
- UI/UX design, component structure, page routes, or DTO shapes (belong
  to a future Scope Contract, if authorized).

### 10. Architectural Boundaries

Per the governing instruction's required hierarchy (Architecture →
Foundation → Product Integration → Human Understanding → Intelligence),
this decision authorizes only the **Product Integration** layer's
boundary, and explicitly states: **Web presentation ≠ Human
Understanding**, and **reading Personal State History ≠ interpreting
Personal State History.** Any future Web code that computes a diff,
trend, pattern, or narrative summary over history data would cross out
of this decision's boundary and into Human Understanding/Intelligence,
requiring separate authorization.

### 11. Security / Auth Boundaries

- Web must consume backend application/API contracts only — it must
  never access persistence directly.
- Web must not bypass the existing `AuthenticationGuard` mechanism.
- Web must not accept, construct, or transmit an arbitrary/caller-chosen
  user id for any owner-scoped resource — identity must continue to
  flow exclusively from the existing authenticated session (mirroring
  the backend's own verified pattern:
  `apps/api/src/infrastructure/auth/authentication.guard.ts`, where
  `userId` originates only from verified token claims).
- Web must rely on the authenticated identity/context already
  established by the backend; it must not reproduce or duplicate
  ownership-checking logic client-side as a substitute for the
  backend's own enforcement.

### 12. Ownership Boundaries

Ownership remains defined and enforced exclusively by the backend
(`context.userId`, per `docs/IMPLEMENTATION_INCREMENT_005_CONTRACT.md`
§I). Web's role is limited to holding and transmitting the
already-issued access token; it introduces no new ownership concept and
performs no ownership decision of its own.

### 13. Relationship to Personal State

Personal State (`GET /personal-state`) is explicitly included as an
initial candidate data source for Web consumption — it is the resource
already exposed for the currently authenticated user, at the domain
Increment 005 extended.

### 14. Relationship to Personal State History

Personal State History (`GET /personal-state/history`, Increment 005) is
the specific trigger for this decision and is explicitly included as an
initial candidate data source — its consumption by Web is exactly the
gap this decision resolves the governance boundary for. This decision
does **not** select a specific view, page, or presentation for it (§10
of the governing instruction: "Do NOT design detailed UI/UX in this
ADR").

### 15. Relationship to Evidence

Deferred (§9). Not included in this decision's initial boundary; would
require its own justification in a future decision or Scope Contract.

### 16. Explicit Protection of PI Core

Unaffected. PI Core's claim/version model, use-case, and access
predicate remain closed, unchanged, and independently governed per
ADR-001 §6 (F.3) of this same document. This decision does not create,
imply, or authorize any PI Core controller, API exposure, or Web
consumption of PI Core data.

### 17. Explicit Protection of Memory

Unaffected. Memory's record/version model, repository, use-case, and
module remain unchanged, uncontrolled by any HTTP layer, and outside
this decision's scope entirely. No Memory consumption by Web is
authorized.

### 18. Explicit Protection of Human Understanding

Unaffected. Human Understanding System (Roadmap Phase 4, sub-items
4.1–4.10) has no Technical Design anywhere in the repository (confirmed
by direct inspection this session) and is not designed, implemented, or
advanced by this decision in any way. §10 above makes the boundary
explicit: reading history is not interpreting it.

### 19. Relationship to Roadmap

`docs/DECIVEXA_MASTER_ROADMAP.md` §9 lists "Technical Foundation
Maturation" as a current priority (alongside Personal State History,
Governance Hardening, Verification); Web is Phase 2 item 2.3, marked
🟡 MATURING. This decision treats Web/Product integration of
already-existing read data as a continuation of that still-open Phase 2
maturation — a **current actionable priority**, distinct from Phase 4
Human Understanding, which remains "⚪ NEXT MAJOR DOMAIN" and is
unaffected and unaccelerated by this decision. The existence of the
Roadmap item is not, by itself, treated as proof of authorization here —
it is corroborating evidence for a decision made primarily on the
Problem/Decision/Rationale grounds above (§5–§7).

### 20. Six-Criteria DECIVEXA Evaluation

| Criterion | Evaluation |
|---|---|
| 1. Vision alignment | Strong — moves DECIVEXA from backend infrastructure toward an actual Personal OS product experience, without implementing any intelligence prematurely (§10 boundary). |
| 2. Long-term architecture strength | Good — no coupling to PI Core/Memory/Human Understanding; fully reversible (a Web page can be removed without any backend impact); preserves API/UI separation (§11); does not create a premature presentation architecture, since no UI is designed here. |
| 3. Improvement opportunities | Immediate: closes the zero-consumer gap for Personal State/History. Future: Evidence consumption, richer views (Backlog, §9 above — not decided here). Explicitly out of scope: anything interpretive. |
| 4. User input burden vs. system value | The integration requires zero new user input (data already exists from prior use) and would, once implemented, produce the first actual user-visible value beyond authentication — but this ADR itself produces no user-visible value; it only authorizes the boundary. |
| 5. AI capability | Neutral by design — explicitly forbids interpretation/inference/pattern-detection/recommendations from living in Web (§10); preserves all future AI-layer options undiminished. |
| 6. Trusted reference platform | Good — allowing a user to see their own stored state/history is a direct, concrete strengthening of transparency, ownership, and auditability in practice, not just in architecture. |

### 21. Consequences

- A future Scope Contract may be drafted to define exactly how Web
  presents Personal State and Personal State History — that Contract
  must operate within this decision's boundary (§8, §9, §10) and is not
  itself authorized by this ADR.
- Evidence's inclusion in Web remains an open question for a future,
  separately justified decision.
- `docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md` remains
  valid and unmodified; this ADR supplements it for the specific
  domain-data-consumption question that document left silent, and does
  not contradict or reopen anything it actually decided about
  authentication scope.

### 22. Reversibility

Fully reversible. This decision authorizes a boundary, not code; no
implementation exists yet as a result of it. Even after a future Web
integration is built under this boundary, it would remain removable
without backend impact (§20, Criterion 2).

### 23. Future Evolution Conditions

- Evidence consumption by Web: requires a separately justified decision
  or an amendment to this ADR with its own evidence.
- Any interpretive/derived presentation (trends, summaries, comparisons
  across revisions): requires crossing into Human Understanding/
  Intelligence territory and its own, separate, future architectural
  decision — not authorized by any future Scope Contract operating
  merely under this ADR.
- Expansion to PI Core or Memory consumption by Web: requires its own
  future decision; remains blocked here exactly as it was before this
  ADR.

### 24. Required Next Governed Stage

Per the standing sequence (also required by the governing instruction
§G):

```
ADR-002 (this document)
  → Founder approval of this architectural decision
  → Scope Contract (Web/Product Integration Increment)
  → Implementation Readiness
  → explicit Build Authorization
  → Build
  → Validation
  → Founder Review
  → explicit Commit/Push Authorization
```

**This ADR does not itself constitute Founder approval.** It is the
architectural decision record; a separate, explicit Founder approval of
this exact decision is the next required governance event, before any
Scope Contract may be drafted.

### 25. Implementation Authorization Statement

**This decision does NOT authorize implementation, a Scope Contract,
Implementation Readiness, Build Authorization, or any modification of
`apps/web` or backend source.** It resolves the architectural boundary
question only. No code, test, configuration, schema, or migration change
is authorized by this document.

---

## ADR-003 — Web/Product Integration Boundary, Phase 2 (Personal State
Write Exposure and Evidence Read Exposure)

### 1. Title

Web/Product Integration Boundary, Phase 2: Resolving Personal State
Write Exposure and Evidence Read Exposure

### 2. Status

**FOUNDER-APPROVED — ARCHITECTURALLY DECIDED — NOT IMPLEMENTATION-AUTHORIZED.**

- **Approval date:** 2026-08-23.
- **Approval reference:** Explicit Founder approval recorded in project
  governance conversation ("FOUNDER AUTHORIZATION — ADR-003 APPROVAL
  REVIEW"), following an independent Founder-level architectural review
  that re-verified this ADR's evidence directly against the actual
  backend source (`personal-state.controller.ts`, `personal-state.use-case.ts`,
  `authentication.guard.ts`, `evidence.model.ts`) and found no
  inconsistency, no Stop Condition, and no missing prerequisite decision.
- **This approval applies specifically to ADR-003.**
- **The approved decision is:** Personal State Web write only (§19–§20).
  Evidence read exposure remains explicitly deferred (§11, §21).
- **No implementation is authorized by this approval.** A future Scope
  Contract, a future Implementation Readiness review, and a separate,
  explicit future Founder Build Authorization are all still required —
  in that order — before any implementation may begin (§23, §27).

This mirrors the two-step pattern already established this session
(draft → independent Founder Review → approval), applied here to an ADR
rather than an Implementation Contract for the first time in this
document.

### 3. Date

2026-08-23

### 4. Decision Owner

Founder (pending explicit approval of this drafted decision).

### 5. Context

Implementation Increment 006 (`docs/IMPLEMENTATION_INCREMENT_006_CONTRACT.md`,
committed at `43984f84324d46b76d7a62278c755de7556835a9`) implemented
exactly the read-only boundary ADR-002 authorized: `GET /personal-state`
and `GET /personal-state/history`, consumed by the Web dashboard. The
Post-Increment 006 Founder Determination (this session) established, via
direct repository inspection, that: (a) a genuine, previously-unnoticed
zero-consumer gap exists for Personal State **write** operations — the
backend has supported `POST /personal-state` and `PATCH /personal-state`
since before this session, but Web has never consumed either; (b)
Evidence remains fully implemented at the backend and fully deferred
from Web (ADR-002 §9/§15/§23); and (c) ADR-002 is explicitly and
repeatedly scoped to **read-only** presentation, so neither boundary is
authorized merely because Increment 006 succeeded or because the
backend capability already exists.

### 6. Current State (Repository Evidence, Verified Fresh This Session)

**Personal State write:**
- `PersonalStateController` (`infrastructure/personal-state/personal-state.controller.ts`)
  exposes `POST /personal-state` (`initialize`, `@HttpCode(201)`) and
  `PATCH /personal-state` (`update`), both behind the same class-level
  `@UseGuards(AuthenticationGuard)` as the already-consumed `GET` routes.
- `PersonalStateUseCase.initialize` (`application/personal-state/personal-state.use-case.ts`):
  idempotent — if a state already exists for `context.userId`, returns
  it unchanged rather than erroring; otherwise validates
  (`timezone`/`locale` length checks) and creates via
  `repository.create(...)`, with `provenance: "declared"` fixed by the
  use-case itself, not caller-supplied.
- `PersonalStateUseCase.update`: requires `revision` (optimistic
  concurrency) and validated `timezone`/`locale`/`availability`; calls
  `repository.updateForUser(context.userId, input.revision, patch, now)`;
  returns `PersonalStateConflictError` (mapped to HTTP 409) on revision
  mismatch or missing state.
- Ownership: both methods derive the acting user exclusively from
  `context.userId` — identical mechanism to `get`/`getHistory`, already
  verified safe in Increment 006's Readiness Review and Build. No method
  accepts a caller-supplied identity anywhere.
- History/revision creation: the `PersonalStateRepository` interface
  documents `findRevisionsForUser` as returning revisions that "are only
  ever produced as a side effect of create/updateForUser succeeding" —
  i.e., mutation already automatically and correctly produces history
  rows; this is existing, backend-owned, already-tested behavior, not
  something a Web write boundary would need to reimplement or trigger
  specially.
- Web currently has **zero** mutation code: `apps/web/lib/personal-state.ts`
  contains only `getPersonalState`/`getPersonalStateHistory`; no form, no
  create/update UI, no client-side mutation helper exists anywhere in
  `apps/web`.
- Tests: `personal-state.use-case.spec.ts` already covers `initialize`
  idempotency and `update` conflict/success paths at the backend.

**Evidence:**
- `core/evidence/evidence.model.ts` (re-read in full this session):
  `Evidence = { id, userId, createdAt, updatedAt }`;
  `EvidenceVersion = { id, evidenceId, version, userId, provenance,
  lifecycle, observedAt, acceptedAt, confidence, createdAt }`.
  **Neither type has any content, claim, value, or description field.**
  Evidence in this repository is a pure provenance/lifecycle envelope —
  by design, per this repository's own established pattern (Memory and
  Personal State Revision both deliberately avoid inventing a broader
  taxonomy; Evidence is the same kind of "record without a value field,"
  confirmed directly from source, not assumed).
- `EvidenceController`/`EvidenceUseCase` (re-read this session and
  earlier): `GET /evidence/:id`, `GET /evidence/:id/versions/:version`,
  `POST /evidence`, `POST /evidence/:id/versions` — ownership via
  `context.userId`, identical mechanism to Personal State.
- Web currently has zero Evidence code anywhere (confirmed by direct
  grep of `apps/web`, this session — the only "evidence" substring match
  in the committed Web code is the pre-existing, already-authorized
  `evidenceVersionId` field name on `PersonalStateRevision`, not any
  Evidence API call).

### 7. Architectural Problem

Two candidate Web/Product boundary expansions exist, neither currently
authorized: (A) Personal State write, (B) Evidence read. ADR-002's
explicit scoping to read-only presentation, and its own §23 naming both
Evidence inclusion and any capability beyond the exact F.1 boundary as
requiring separate decisions, means neither can be inferred from
existing authorization or from the mere technical existence of the
backend capability (`docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`
§5/§6/§14 — silence and prior-document existence are never automatic
authorization).

### 8. Evidence (Summary — see §6 for full detail)

- Personal State write endpoints exist, are tested, are ownership-safe,
  and already produce correct history side effects — no backend gap.
- Web has no mutation code of any kind today.
- Evidence exists, is tested, is ownership-safe — but **has no content
  field of any kind** at the domain-model level. A raw Evidence display
  today would show only `provenance`, `lifecycle`, `confidence`,
  `observedAt`/`acceptedAt`/`createdAt` — no substantive "what is this
  evidence about" content exists anywhere in the data to show a user.
  This is a structural, not merely a policy, reason Evidence display
  would currently be close to meaningless as a product capability —
  independent of any privacy consideration.

### 9. Options Considered

### 10. Option A — Personal State Write

**Benefits:** closes the read/write asymmetry Increment 006 created;
lets Web become the user's actual interface to their own Personal State
rather than an API-only concept; directly improves the user-input-vs-
system-value ratio (the user already has a reason to visit the
dashboard, per Increment 006; adding write closes the loop without
requiring any new user behavior pattern); builds directly on an already
fully-tested, already-safe backend surface.

**Risks:** Web becomes a mutation-capable domain consumer for the first
time (new category of trust, though not new trust *mechanism* — ownership
enforcement is unchanged); a mutation UI could accidentally encode
product semantics (e.g., implying meaning behind why a field changed) if
not kept strictly to raw field editing; validation must stay backend-
owned (it already is — `validate()` lives in `PersonalStateUseCase`, not
proposed to move); revision/history semantics must stay backend-owned
(already true, per §6).

**Containment:** all identified risks are containable by a narrow
boundary (§20) that reuses the existing endpoints unmodified, forbids
any new backend capability, and forbids any UI element that implies
interpretation of *why* a value changed — matching this repository's
existing, proven pattern from Increment 006.

### 11. Option B — Evidence Read

**Benefits:** would make Evidence's existence visible to users; could,
in principle, improve transparency once Evidence carries meaningful
content.

**Risks:** because Evidence has no content field (§6, §8), a Web view of
it today would present only metadata with nothing substantive behind it
— risking the opposite of the "show what the system knows" philosophy
(ADR-002 §H precedent, Contract 006 §H): it would show a metadata shell
with no knowable content, which could confuse rather than inform. This
is a structural product-readiness problem, not a security one — Evidence
`observedAt`/`provenance`/`confidence` alone do not constitute
meaningful user-facing information without whatever content Evidence is
evidence *of*, and that content does not exist in this domain model.

**Determination:** Evidence exposure is premature **for a reason
independent of privacy or technical safety** — the domain model itself
does not yet carry content worth presenting. This is a genuine
architectural finding, not a deferral of convenience.

### 12. Option C — Both

Rejected as the selected option: while technically containable
independently, bundling an evidence-thin Evidence view into the same
decision as a substantive Personal State write capability would dilute
the ADR's clarity and mix a ready capability with a structurally
not-yet-meaningful one. Not selected.

### 13. Option D — Neither

Rejected: would leave the concretely evidenced, safely-containable
Personal State write gap (§8's strongest single finding) undecided
without a countervailing reason — the anti-drift standard applied in the
Post-Increment 006 Determination (§17 of that report) found this gap
genuinely important, not merely convenient to close.

### 14. Six-Criteria Evaluation

**Applied to Option 1 (the selected decision, §19):**

| Criterion | Personal State Write | Evidence Read (deferred) |
|---|---|---|
| 1. Vision alignment | Good — closes a real product asymmetry | Weak today — no content to show |
| 2. Long-term architecture strength | Good — reuses existing, tested, unmodified endpoints | N/A (deferred) |
| 3. Improvement opportunities | Immediate: closes zero-consumer gap (Post-006 Determination §8) | Future: revisit once Evidence carries content or a concrete need emerges |
| 4. User input burden vs. system value | Good — no new user behavior required, closes an existing loop | N/A (deferred) |
| 5. AI capability | Preserved, not implemented — pure field editing, no interpretation | Preserved — nothing to interpret yet either way |
| 6. Trusted reference platform | Good — user can now both see and correct their own recorded state | N/A (deferred) |

### 15. Security / Ownership Analysis

Unchanged from Increment 006's already-verified model: `context.userId`
derived exclusively from the verified access token
(`infrastructure/auth/authentication.guard.ts`); no caller-supplied
identity path exists anywhere in `initialize`/`update`; Web would
continue to perform zero authorization logic of its own, exactly as
Increment 006 established. No new trust boundary is created — the same
boundary already proven safe is merely exercised for writes instead of
only reads.

### 16. Privacy Analysis

Personal State write introduces no new data category — the same fields
already readable since Increment 006 (`timezone`, `locale`,
`availability`) become writable by their own owner only, which is a
strictly narrower privacy surface than most consumer applications'
default "user edits own profile" capability. No new field, no new
retention, no new third-party exposure. Evidence's privacy status is not
reached by this decision, since Evidence remains deferred (§11).

### 17. Long-Term Architecture Analysis

Authorizing Personal State write does not foreclose or complicate any
future layer: Human Understanding, PI Core, Memory, AI Coach, Decision
Intelligence, Digital Twin, and all other Backlog items remain equally
buildable whether or not Web can edit Personal State — none of them
depend on, or are blocked by, this boundary. Deferring Evidence read
keeps that decision fully open for whenever Evidence's content model
matures or a concrete need emerges — nothing about this ADR narrows that
future decision's options.

### 18. Deferred Architecture Protection

This decision does **not** authorize, and explicitly reaffirms as
out of scope: Human Understanding (4.1–4.10), Living User Model, Context
Model, PI Core advancement, Memory advancement, AI, agents, prediction,
Decision Intelligence, Personal AI Coach, Growth Navigation Engine,
Progress Intelligence, Digital Twin, Goal OS, Daily OS, Learning OS,
Business OS, Relationship OS, Adaptive Recovery, Risk Intelligence,
Trustworthy Navigation Architecture, Actor≠Owner, or any other
Architecture Backlog item. Nothing in the evidence gathered for this ADR
proves any of these must be opened — none is silently expanded.

### 19. Decision

**Option 1 is selected: Authorize Personal State Web write only.**
Evidence read exposure (Option B) is explicitly **not** authorized by
this decision and remains deferred, for the structural reason in §11
(no content field exists on Evidence to present) — not merely "later."

### 20. Exact Boundary Authorized

- Web may mutate **only** the authenticated user's own Personal State,
  via the existing, unmodified `POST /personal-state` (create/initialize)
  and `PATCH /personal-state` (update, optimistic concurrency via
  `revision`) endpoints.
- No caller-supplied `userId`, under any form (URL, query, body).
- Backend remains the sole authority on identity, ownership, and
  validation — Web implements no authorization or domain-validation
  logic of its own.
- Web does not directly manipulate database state; it consumes the
  existing HTTP contract only.
- No new backend endpoint is assumed or authorized by this ADR — if a
  future Scope Contract discovers one is genuinely required, that is a
  Stop Condition for that Contract, not something this ADR pre-approves.
- History/revision creation remains entirely backend-owned, automatic,
  and unmodified (§6).
- No interpretation, inference, aggregation, prediction, or AI/agent
  behavior of any kind.
- No Human Understanding behavior.
- No PI Core or Memory advancement.
- No Evidence integration (explicitly not authorized by this decision).

### 21. Explicitly Not Authorized

Evidence read exposure; any write capability beyond `POST`/`PATCH
/personal-state` as they exist today; any new backend endpoint, DTO, or
schema/migration change; any UI beyond raw field editing (no derived
fields, no computed summaries, no "why this changed" narrative); all
items listed in §18; implementation of any kind (§26); commit or push of
any implementation.

### 22. Consequences

- A future Scope Contract (an "Implementation Increment 007"-shaped
  document, by this repository's established numbering) may be drafted
  to define exactly how Web exposes Personal State editing, within §20's
  boundary — not authorized by this ADR itself.
- Evidence's Web-exposure question remains open for a future decision,
  to be revisited if/when Evidence gains a content model or a concrete
  product need is evidenced — not scheduled or implied by this ADR.
- ADR-002 remains valid and is not corrected — see §24.

### 23. Implementation Prerequisites

Before any implementation may begin: a dedicated Scope Contract (mirroring
Increment 006's structure) must be drafted and Founder-approved; an
Implementation Readiness review must occur; a separate, explicit Founder
Build Authorization must be issued. This ADR satisfies none of those on
its own — it only removes the architectural-boundary blocker that
previously made drafting such a Contract premature.

### 24. Relationship to ADR-002

**ADR-002 remains valid, intact, and unmodified.** ADR-002's read-only
Personal State/History boundary was correct at the time it was made, and
Increment 006 correctly implemented exactly that boundary — nothing here
corrects, contradicts, or retroactively reinterprets that decision.
ADR-003 is a **new, additional** boundary decision, not an amendment to
any specific ADR-002 clause — it exercises exactly the escape hatch
ADR-002 §23 itself named ("Expansion to PI Core or Memory consumption by
Web: requires its own future decision" and, by the same logic applied
here to write-capability, "Evidence consumption by Web: requires a
separately justified decision"). No ADR-002 clause is superseded, and no
implementation should be inferred from this ADR until a separate Scope
Contract and Build Authorization exist (§23).

### 25. Relationship to Increment 006

Increment 006 remains complete, correct, and unmodified by this ADR.
This decision does not reopen, redesign, or reinterpret anything
Increment 006 built — it only authorizes a *new*, additional boundary
(Personal State write) that Increment 006 itself never touched and was
never scoped to touch (its own Contract §K explicitly listed "any
write/mutation capability from Web beyond what already exists" as
out of scope).

### 26. Future Review Conditions

- Evidence read exposure should be revisited if: Evidence gains a
  content/value field at the domain-model level, or a concrete
  user-facing need is evidenced elsewhere in the repository (e.g., a
  future Human Understanding design that depends on showing Evidence to
  the user).
- The exact UI/UX shape of Personal State write exposure is not decided
  here and belongs to the future Scope Contract (§23).

### 27. Governance Rule / Implementation Authorization Statement

**This ADR does NOT authorize implementation, a Scope Contract,
Implementation Readiness, Build Authorization, or any modification of
`apps/web` or backend source.** Per `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`
§13 (Founder Authority) and this document's own established two-step
pattern (ADR-002 was drafted, then separately Founder-reviewed and
approved before any Contract followed), a separate, explicit Founder
approval of this exact decision (§19–§21) is the next required
governance event before any Scope Contract may be drafted for Personal
State write exposure.

---

## ADR-004 — Formal Governance Reconciliation: Layer γ Position Within
the Architecture Freeze / Technical Design Hierarchy

### 1. Title

Formal Governance Reconciliation Between Layer γ (Master Roadmap /
Architecture Decision Source of Truth / ADR-001–003) and the Pre-Existing
Architecture Freeze / Technical Design ("TD") Governance Track.

### 2. Status

**DRAFTED — EVIDENCE-BACKED — NOT FOUNDER-APPROVED.** This ADR records a
reconciliation, not a new architectural authorization. It changes no
authority status, reopens no closed domain, and expands no implementation
scope.

### 3. Date

2026-08-24.

### 4. Decision Owner

Founder (pending explicit approval of this drafted reconciliation).

### 5. Context

Two prior read-only investigations this session ("DEEP GOVERNANCE
RECONCILIATION PASS" and "FORMAL DECIVEXA GOVERNANCE DETERMINATION")
established that the repository contains two governance layers — the
pre-existing Architecture Freeze / TD-01…TD-12 chain (dated, Founder-
approved, `docs/ARCHITECTURE_FREEZE_BASELINE.md`) and this document's own
Layer γ track (`docs/DECIVEXA_MASTER_ROADMAP.md`,
`docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`, this file) — that
had never been formally cross-referenced against each other, despite both
being drawn on by the same real Implementation Increment Contracts
(004–007). A Founder-authorized "FORMAL GOVERNANCE RECONCILIATION"
execution prompt (2026-08-24) directed a governance-only reconciliation
task to formalize the relationship without superseding, deleting,
rewriting, or weakening any Founder-approved architecture.

### 6. Decision

**Layer γ is formally positioned as a complementary current-decision and
reconciliation layer operating within the existing Founder-approved
architecture/governance hierarchy — it does not supersede the Architecture
Freeze, TD-01, or TD-02.** The full reconciliation record, including the
Authority-Hierarchy-vs-Evidence-Hierarchy distinction, the TD-02 authority
determination, the third TD-02 variant's disclosure, the Increment 007
governance-drift finding, the Personal State taxonomy gap, the ADR naming
collision, and five governance backlog items (GOV-01–GOV-05), is recorded
in full in `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, which this ADR
adopts by reference rather than duplicating in full here.

### 7. Evidence Used

- `docs/ARCHITECTURE_FREEZE_BASELINE.md` (full read) — explicit dated
  Founder Approval Record; "Frozen Source Gate" naming "TD-02 through
  TD-06: approved gates."
- `docs/technical-design/TD-01_ARCHITECTURE_CONSTITUTION_AND_DOCUMENT_AUTHORITY.md`
  (full read) — Document Authority Hierarchy (§4); Canonical Baseline
  pointer (§5).
- Both TD-02 variants (full read) — `docs/TD-02_DOMAIN_BOUNDARIES_AND_MODULE_OWNERSHIP.md`
  and `docs/technical-design/TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md`.
- `docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md` (full read, 1588
  lines) — confirmed zero references to Layer γ or "Personal State."
- `docs/DECIVEXA_MASTER_ROADMAP.md`, this file's own ADR-001–003, and
  `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` (full re-reads)
  — confirmed zero references to TD-01, TD-02, or Architecture Freeze in
  either direction.
- `docs/IMPLEMENTATION_INCREMENT_004/005/006/007_CONTRACT.md` (Architecture
  Baseline field citations, grepped directly) — confirmed 004–006 cite
  `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`; confirmed 007 omits it.
- `docs/gates/PHASE_10P_GOAL_READINESS_FOUNDER_DECISION_GATE.md` and
  `docs/gates/PHASE_10Q_PERSONAL_INTELLIGENCE_MEMORY_BOUNDARY_FOUNDER_DECISION_GATE.md`
  — the latter's "Tier 3 (conceptual, self-declared non-authorizing)"
  classification of artifact (2), noted as supporting/contextual evidence
  only: the same gate applies "Tier 3" broadly to multiple conceptual
  documents (including Master Architecture, Canonical System Map,
  Canonical Baseline, and Foundation), not uniquely to artifact (2); it is
  not the basis of the determination, which rests on the Architecture
  Freeze Baseline incorporation and Increment Contract citation evidence
  (see `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §7).

### 8. Explicit Non-Goals

This ADR does **not**: rewrite, merge, delete, or rename any TD-02
variant; alter any Founder-approval claim in any existing document;
correct Increment 007's Contract; reopen PI Core, Memory, Evidence, or
Human Understanding; expand implementation scope; or authorize any code
change.

### 9. Consequences

- `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` becomes the repository's
  single reference point for the Layer γ / TD-chain relationship,
  reducing the need to re-derive this analysis in future sessions.
- Five governance backlog items (GOV-01–GOV-05) are recorded for future,
  separately authorized action.
- Future ADRs are expected to follow the ADR Governance Rules and No
  Silent Architectural Drift rule formalized in
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §10, §16.
- Future Implementation Increment Contracts are expected to include the
  Architecture Baseline field and relevant ADR/TD/Gate citations per
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §12.

### 10. Implementation Authorization Statement

**This decision does NOT authorize implementation, a Scope Contract,
Implementation Readiness, Build Authorization, or any modification of
`apps/web` or backend source, and does NOT itself constitute Founder
approval.** It is a drafted reconciliation record. A separate, explicit
Founder review and approval of this exact decision — and of
`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` in full — is the next
required governance event.

---

## ADR-005 — AI Architecture Documentation Track: Governance Ratification as Planning/Reference Baseline, Implementation Not Authorized

**Authoritative identity:** `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`
§ADR-005. This repository contains other ADR namespaces that reuse the
same numeric identifier (see §14 below); this record must always be
cited by its full qualified path, never as a bare "ADR-005."

### 1. Title

AI Architecture Documentation Track: Governance Ratification as
Planning/Reference Baseline, Implementation Not Authorized

### 2. Status

FOUNDER-APPROVED — ARCHITECTURALLY DECIDED — NOT IMPLEMENTATION-AUTHORIZED.

This status is deliberately distinct from `BUILD-AUTHORIZED`.

Neither implementation authorization nor schema-migration authorization
is claimed here.

### 3. Date

2026-08-24

### 4. Founder

Parsa Kiamanesh

### 5. Decision

The seven documents listed in §6 (Scope) are formally recognized as
DECIVEXA's canonical AI architecture planning/reference baseline.

This ratification establishes architectural reference authority only.

It does not authorize implementation.

### 6. Scope

The canonical AI architecture planning/reference set consists of:

1. `docs/architecture/ADR-001-AI-PROVIDER-INDEPENDENCE-AND-RESILIENCE.md`
2. `docs/architecture/DECIVEXA_AI_FAILURE_AND_RESILIENCE_MATRIX_V1.md`
3. `docs/architecture/DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md`
4. `docs/architecture/DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md`
5. `docs/architecture/DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md`
6. `docs/architecture/DECIVEXA_AI_V1_TRACEABILITY_AND_ACCEPTANCE.md`
7. `docs/architecture/DECIVEXA_AI_ARCHITECTURE_CONFORMANCE_AUDIT_V1.md`

These documents are canonical for architectural planning/reference
purposes only.

### 7. Evidence

Two independent read-only governance audits conducted during the
2026-08-24 governance review found:

- no independent Tier-1/Tier-2 governance record predating this decision
  that ratified this AI architecture track;
- no content-level contradiction between the seven documents and the
  shipped implementation;
- no AI implementation code corresponding to this architecture in the
  repository;
- the documents' own text self-limits the architecture to
  planning/phase-controlled use and repeatedly requires separate Founder
  approval before implementation.

The prior absence of independent ratification is therefore not
retroactively reclassified as evidence of prior authorization.

This ADR is the explicit governance decision that establishes the
present canonical planning/reference status.

### 8. Approval Reference

Explicit Founder approval was given in the project governance
conversation:

"FOUNDER DECISION GATE — AI ARCHITECTURE GOVERNANCE RATIFICATION"

dated 2026-08-24.

This decision followed two independent read-only governance audits that
classified the seven documents' internal "Founder-approved" claims as
document self-assertion (Tier 3) and found no independent Tier-1/Tier-2
governance record predating this decision.

This ADR is the durable repository record of that Founder decision.

It does not retroactively promote the documents' own internal claims to
independent evidence.

### 9. Architectural Effect

The seven documents may now be cited as DECIVEXA's canonical AI
architecture planning/reference baseline for:

- future architectural planning;
- future design review;
- future implementation planning;
- future Founder authorization gates;
- future readiness/conformance evaluation.

Canonical reference status does not constitute implementation
authorization.

### 10. Non-Effects

This decision does NOT:

- authorize any AI implementation;
- authorize AI Gateway construction;
- authorize provider adapters;
- authorize model routing;
- authorize LLM integration;
- modify the Memory schema;
- modify the Memory model;
- modify Memory repositories;
- modify Memory use cases;
- widen `provenance`;
- adopt the truth-status taxonomy;
- introduce `sensitivity`;
- introduce contradiction infrastructure;
- introduce AI-generated Memory;
- introduce AI validation;
- expose Memory through HTTP/API;
- create database migrations;
- modify database schemas;
- modify current Memory semantics;
- amend GOV-04;
- rename or renumber ADRs;
- authorize any material architectural implementation activity.

### 11. Implementation Boundary

Any material implementation derived from this architecture requires
separate, explicit Founder authorization and an applicable
implementation/readiness gate.

This ADR grants none of that authorization.

In particular, this ADR does not authorize:

- AI Gateway implementation;
- provider adapter implementation;
- model router implementation;
- LLM/provider integration;
- AI Memory write paths;
- truth-status persistence;
- Memory validation infrastructure;
- schema changes;
- migrations;
- API exposure.

Any such work must be separately gated.

### 12. Memory Boundary

The current shipped Memory model remains authoritative and unchanged.

Its current implementation includes:

- `provenance: declared | observed`;
- `confidence`;
- `userConfirmed: boolean`;
- lifecycle;
- `valueKind`/`value`;
- envelope-only `get`;
- exact-version `getVersion`;
- no latest/current retrieval;
- no HTTP exposure.

Nothing in this ADR modifies, supersedes, or widens that implementation.

### 13. Truth-Status Boundary

The proposed ten-state truth-status taxonomy:

- User-stated
- Observed
- Measured
- Inferred
- Hypothesis
- AI-generated
- System-derived
- Validated
- Contradicted
- Deprecated

is classified as:

PROPOSED / ARCHITECTURAL / NOT ADOPTED.

It is not represented in the shipped schema.

It is not part of the current Memory implementation.

It must not be treated as adopted without a separate explicit Founder
decision.

The rule that AI-generated information must never silently become
Validated remains a proposed architectural principle only until
separately adopted and implemented through an authorized gate.

### 14. GOV-04 Namespace Treatment

`docs/architecture/ADR-001-AI-PROVIDER-INDEPENDENCE-AND-RESILIENCE.md` is
recorded as a further, non-substantive instance of the identifier reuse
/ namespace ambiguity already documented by GOV-04.

No colliding `ADR-001` document addresses the same architectural topic
as another colliding `ADR-001` document.

This is treated as a naming/namespace note only.

No renaming, renumbering, migration, or architectural change is
authorized by this ADR.

GOV-04 is not superseded by this ADR.

### 15. Follow-Up Gate Requirements

Any future gate proposing to:

(a) implement any material part of this AI architecture; or

(b) adopt the truth-status taxonomy into the Memory model/schema

must open as a separate, explicitly authorized Founder gate.

No future implementation or schema gate may treat this ADR as
implementation authorization.

---

## ADR-006 — Founder Directive: Complete AI Architecture Is a V1 Requirement, Not a V2 Deferral

**Authoritative identity:** `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`
§ADR-006.

### 1. Title

Founder Directive: Mandatory Complete AI Architecture in DECIVEXA V1 —
Essential AI Capabilities Must Not Be Deferred to V2 Without Explicit
Founder Approval.

### 2. Status

FOUNDER-APPROVED — DIRECTIVE OF RECORD — NOT IMPLEMENTATION-AUTHORIZED.

This directive establishes a permanent V1 scope requirement. It does not
itself authorize any implementation, and does not remove, replace, or
bypass any existing Founder Gate. Every implementation step this
directive touches still requires its own separate, explicit Founder
Implementation Authorization Gate, exactly as ADR-005 §11 and the
existing gate sequence already require.

### 3. Date

2026-08-24

### 4. Founder

Parsa Kiamanesh

### 5. Decision (verbatim Founder requirement, undiminished)

> "DECIVEXA Version 1 MUST contain the complete, end-to-end, fully
> architected and implemented AI system required by the DECIVEXA Vision
> and canonical architecture. Essential AI capabilities must not be
> deferred to Version 2 or future versions without explicit Founder
> approval."

This is NON-NEGOTIABLE for V1. DECIVEXA is an AI-native system; the AI
architecture is a first-class foundation of V1, not an optional layer
added on top of a non-AI system. Complete AI architecture is a V1
requirement, not a V2 roadmap item.

### 6. What "Complete AI" Means

Not merely a Provider Adapter, an AI Gateway, a Model Router, or a
single LLM integration. "Complete AI in V1" means the AI architecture is
designed and implemented end-to-end, as one coherent system, across all
layers, contracts, boundaries, data flows, orchestration, intelligence,
safety, privacy, memory interaction, observability, and resilience
required to realize the DECIVEXA Vision. The following interpretations
are explicitly rejected as contrary to this directive: that a Provider
Adapter alone is sufficient; that an AI Gateway alone is sufficient;
that a Model Router alone is sufficient; that a single LLM integration
is sufficient; that more complex AI pieces may simply move to V2; that
Personal AI Coach, Context Engine, Memory AI, or Intelligence
Orchestration may simply be added "later."

Three distinct levels must all be reached, not just the first:
(1) architecture defined; (2) architecture implemented; (3) architecture
integrated and operational — with required test coverage, tested failure
modes, tested security/privacy, enforced AI boundaries, and operational
core AI capabilities.

### 7. Scope (representative, non-exhaustive — governed by DECIVEXA's
canonical Vision and architecture, not limited to this list)

AI Provider Abstraction; Provider Adapters; Provider Independence; AI
Gateway; AI Runtime; Model Router; Capability Registry; Capability
Orchestration; Context Engine; Context Assembly; Personal Context
Intelligence; Personal Intelligence integration; Memory ↔ AI
architecture; Memory intelligence pipeline; AI-generated memory
handling; truth/confidence/provenance handling where architecturally
required; Policy Engine; Risk Engine; Privacy/Data Router; Intelligence
Firewall; AI security boundaries; prompt/context construction
architecture; structured-output architecture; tool/function-calling
architecture; AI error normalization; AI resilience; timeout handling;
retry policies; rate limiting; circuit breaking where required;
failover; provider switching; model selection; capability-aware model
selection; AI observability; AI telemetry; AI request/correlation
tracing; AI evaluation architecture; AI quality measurement; AI safety
controls; AI privacy controls; AI data minimization; AI cost/resource
awareness; AI governance; AI policy enforcement; Personal AI Coach
architecture; Decision AI architecture; Growth Navigation intelligence;
Progress Intelligence; Learning Intelligence; Human Understanding
integration; Personal Development Model integration; AI interaction
with Goals; AI interaction with Daily execution; AI interaction with
Health/Money/Learning/Business/Relationship systems where
architecturally required; Agent architecture where required by DECIVEXA
Vision; Voice architecture where required by the V1 AI architecture;
Predictive Intelligence where required by the V1 architecture;
AI-assisted recommendations; AI personalization; AI learning from user
context; AI feedback loops; AI evaluation and validation; AI
failure/recovery behavior; AI auditability; AI trust architecture. Where
a canonical architecture document identifies a further AI capability or
layer necessary to realize V1, that capability is in scope even if not
named above.

### 8. No Future Deferral Without Founder Approval

From this point forward, whenever an AI capability the canonical
architecture requires for V1 is encountered, it must not be
unilaterally deferred to V2, "future," "later," or a backlog item. If a
capability is judged V1-required but its scope is large, its
architecture is incomplete, a dependency is missing, implementation is
difficult, or a Founder decision is required, this must be reported
explicitly and execution must STOP for that Founder decision — it must
never be silently pushed to V2 merely to reduce complexity.

### 9. Relationship to the Existing "v1 Scope Guard" and "Explicitly
Deferred" Architecture Text — Explicit Supersession, Not Silent Override

[EVIDENCE] `docs/architecture/DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md`
§17 "v1 Scope Guard" currently reads: *"Do not implement full autonomous
agents, Digital Twin, broad self-hosted frontier inference, advanced
predictive intelligence, or autonomous architectural self-modification
merely because this architecture enables them. Implement only the
interfaces and safe extension points required by v1. Deferred
capabilities require their own Founder-controlled gate before material
implementation."* [EVIDENCE] `docs/architecture/DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md`
§37 "v1 Implementation Boundary" similarly separates "Required in v1"
from "Explicitly deferred but architecturally enabled," and explicitly
lists Agents, Voice, and Predictive Intelligence among items historically
treated as deferred-but-enabled rather than V1-required.

This ADR does **not** silently contradict that text and does not
pretend the tension does not exist. This ADR is the explicit,
independently-authorized Founder decision that **expands V1 scope**
relative to those two sections specifically for the capabilities named
in §7 above (including Agent architecture, Voice architecture, and
Predictive Intelligence, each qualified "where required by DECIVEXA
Vision/the V1 architecture"). Those two sections' general v1-scope-guard
discipline — do not build a capability merely because the architecture
makes it possible, and any deferred capability still needs its own
Founder-controlled implementation gate — **remains fully in force** for
everything this ADR does not name, and every capability named in §7
still requires its own separate Founder Implementation Authorization
Gate before any code is written, exactly per §2 above and ADR-005 §11.
Nothing here is a blanket implementation authorization; it is a scope
mandate that later, gate-by-gate implementation authorizations must
honor rather than narrow back to V2 on their own initiative.

Per CLAUDE.md's Authority Hierarchy: preserve Founder decisions;
preserve Architecture Freeze constraints; treat conceptual documents as
evidence, not automatic authorization; if a conflict affects an
architectural boundary that cannot safely be deferred, stop and request
the Founder decision rather than guessing. Here, the Founder decision
has already been given, explicitly, in the interactive governance
conversation that produced this ADR — it is recorded, not guessed.

### 10. AI Architecture Completeness Gate (required before V1 closes)

Before V1 is considered complete, an independent AI Architecture
Completeness Audit must verify, at minimum, whether: every AI layer the
Vision requires has been built; AI Runtime, Gateway, Model Router, and
Capability architecture are complete; Context architecture is complete;
Memory/AI integration is complete; Policy/Risk/Privacy architecture and
the Intelligence Firewall are complete; provider independence is
genuinely operational (not merely documented); Personal AI Coach and
Decision AI are operational; Growth/Progress/Learning Intelligence
architecture is operational; AI observability and resilience exist;
security/privacy requirements are operational; AI testing is
sufficient; AI failure handling is complete; AI evaluation exists; and
no essential AI capability has been moved to V2 without a recorded,
explicit Founder approval. Any "no" answer must be recorded with its
reason and current status — not silently omitted.

### 11. Founder Intent (verbatim)

> "DECIVEXA V1 is not a non-AI system with an AI layer added later."
> "DECIVEXA V1 is an AI-native system."
> "The AI architecture is a first-class foundation of V1."
> "Complete AI architecture is a V1 requirement, not a V2 roadmap item."
> "No essential AI architectural capability may be deferred to V2
> without explicit Founder approval."

### 12. Relationship to Governance

This directive does not remove or bypass any existing Founder Gate.
The AI Architecture Planning Gate, AI Implementation Authorization Gate,
AI Audit Gate, AI Commit Authorization Gate, and AI Integration Gate
must each treat this directive as a governing requirement going forward.
This directive alone is not implementation authorization; every
implementation still requires its own Founder Authorization Gate.

No ADR, architecture document, backlog item, implementation note, or
future roadmap document may reduce, limit, remove, or defer this
requirement to V2 without explicit Founder approval. If another
document conflicts with this directive, the conflict must be surfaced
as a governance conflict and a Founder decision requested — it must not
be silently resolved by Claude Code.

### 13. Traceability

```
Founder Directive (this ADR)
  → Canonical DECIVEXA Architecture
      (docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md,
       docs/DECIVEXA-CANONICAL-SYSTEM-MAP.md)
  → AI Architecture
      (the 7 documents ratified by ADR-005:
       docs/architecture/ADR-001-AI-PROVIDER-INDEPENDENCE-AND-RESILIENCE.md,
       docs/architecture/DECIVEXA_AI_FAILURE_AND_RESILIENCE_MATRIX_V1.md,
       docs/architecture/DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md,
       docs/architecture/DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md,
       docs/architecture/DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md,
       docs/architecture/DECIVEXA_AI_V1_TRACEABILITY_AND_ACCEPTANCE.md,
       docs/architecture/DECIVEXA_AI_ARCHITECTURE_CONFORMANCE_AUDIT_V1.md)
  → V1 AI Implementation
      (each increment under its own separate Founder Implementation
       Authorization Gate — e.g. the AI Provider Adapter Foundation,
       apps/api/src/infrastructure/ai/)
  → AI Tests
  → AI Completeness Audit (§10 above)
```

### 14. Required Reading for Future Sessions

Any Claude Code session working on AI, Intelligence, LLM, Provider,
Memory-AI, Personal Intelligence, Decision AI, Coach, Agents, Context,
Model Routing, AI Gateway, or any related AI capability must: (1) find
and read this ADR first; (2) read the canonical AI architecture
documents (§13 above); (3) check current AI implementation status;
(4) align its work with the V1 AI completeness requirement in §5-§8;
(5) never unilaterally defer an essential AI capability to V2; (6) STOP
and request a Founder decision whenever one is genuinely required, per
§8.

### 15. Non-Authorization Statement

This ADR records a permanent V1 scope requirement. It does not itself
authorize any implementation, schema change, migration, AI Gateway
construction, provider integration, Memory change, or any other
material implementation activity. Each capability named in §7 still
requires its own separate, explicit Founder Implementation Authorization
Gate — following the same gate sequence already established for the AI
Provider Adapter Foundation — before any code is written.

---

## ADR-007 — Agent V1 Architecture

**Authoritative identity:** `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`
§ADR-007.

### 1. Title

Agent V1 Architecture — Bounded, Governed Agent Capability Required in
V1; Unbounded Autonomy Explicitly Prohibited.

### 2. Status

FOUNDER-APPROVED — ARCHITECTURALLY DECIDED — NOT IMPLEMENTATION-AUTHORIZED.

ADR-007 records architecture and governance decisions only. It does not
authorize implementation.

### 3. Date

2026-08-24

### 4. Founder

Parsa Kiamanesh

### 5. Decision Context

ADR-006 conditionally reopened "Agent architecture where required by
DECIVEXA Vision." A dedicated read-only readiness gate found no
canonical document affirmatively required Agents for V1 and recommended
treating them as NOT CURRENTLY REQUIRED absent a Founder decision. The
Founder subsequently and explicitly overrode that recommendation: Agent
capability **is** required in DECIVEXA V1. A dedicated read-only
architecture-specification gate then produced the full specification
this ADR now formally registers. This ADR is the durable governance
record of both the override and the resulting specification.

### 6. Agent Definition

**Agent Capability:** Understand → Plan → Act → Observe → Evaluate →
Adapt. The Agent performs bounded multi-step work and may use an
observed action result to determine its next step — more than a
single-shot Capability.

**Autonomous Agent (V1 meaning):** multiple consecutive steps may
execute under an explicitly bounded, session-level authorization when
the applicable Permission Model (§9) permits it — never unrestricted
autonomy. This is allowed only within declared tool scope, declared risk
scope, policy boundaries, execution limits, cost limits, time limits,
tool-call limits, failure limits, user revocation capability, and full
auditability. The Agent never defines its own authorization scope.

**Unbounded Autonomy (explicitly prohibited):** unlimited execution;
self-authorized actions; bypassing Policy, Risk Engine, Context Engine,
Privacy/Data Router, Intelligence Firewall, or Action Boundary; bypassing
approval; inventing tools; modifying its own permissions or risk
classification; ignoring a policy denial; silently continuing after an
approval timeout; silently resuming after interruption; autonomous
architectural self-modification.

### 7. Non-Negotiable Governance Invariant

**"AI cannot grant itself permission."**

No Agent implementation, model, prompt, tool, planner, or runtime
component may weaken this invariant. The authorization chain is:

```
Agent → Action Proposal → Risk Classification → Policy Evaluation
  → Permission / Approval → Execution → Verification → Audit
```

The Agent operates inside this chain; it never controls the
authorization boundary.

### 8. Risk Model

- **Informational / Read-only** — no side effect; normal Context/Policy
  controls remain mandatory.
- **Reversible Low-Risk** — a side effect exists but is trivially
  reversible; session-level authorization may be permitted.
- **User-Confirmation-Required** — a real, non-trivially-reversible side
  effect; per-action user approval required.
- **High-Risk** — financial, irreversible, external-side-effect, or
  affecting-other-people actions; per-action explicit approval plus risk
  disclosure to the user required.
- **Prohibited** — violates security, privacy, authorization, or
  governance invariants; no approval can ever make it executable.

### 9. Permission Model

- **Approval timeout = DENIED.** No response, an unavailable user, a
  disconnected client, a missing response, or an expired approval must
  never be interpreted as implicit approval. The Agent may terminate,
  pause, replan where safe, or explicitly re-request approval — it may
  never silently continue the denied action. The exact UX belongs to a
  future implementation gate and must not weaken this invariant.
- **Session-level pre-authorization** is permitted only for
  Informational/Read-only and Reversible Low-Risk actions. It is **not**
  permitted for User-Confirmation-Required, High-Risk, irreversible,
  external-side-effect, financial, other-people-affecting, or Prohibited
  actions. It must be explicitly granted, scoped, limited to the current
  session, revocable by the user, non-transferable, non-persistent
  beyond the session, and incapable of expanding itself. The Agent
  cannot convert a low-risk authorization into a higher-risk one — risk
  escalation must pause execution and require the appropriate new
  approval.
- The Agent may request permission; **it can never grant itself
  permission.**

### 10. Execution Bounds — Mandatory Concepts, Numeric Values Deferred

The architecture establishes bounded execution as a hard invariant.
Mandatory architectural concepts (maximum execution steps, maximum
wall-clock execution time, maximum tool-call count, maximum consecutive-
failure count, maximum cost/budget) are recorded here; **exact numeric
values are intentionally not fixed by this ADR** and must be proposed
and finalized during the dedicated Agent V1 Implementation Gate. The
absence of numbers here is never permission for unbounded execution.
Agent V1 must never operate with unlimited steps, unlimited tool calls,
unlimited execution time, unlimited retries, unlimited cost, or
self-modifiable limits. Any configured limit must be enforced
deterministically by infrastructure outside the Agent's own authority.

### 11. Tool Governance

Agent tools must eventually be governed through a Tool Registry
requiring: registered tool identity; versioned tool identity; declared
capability, input schema, output schema, and risk classification; policy
evaluation; permission evaluation; verification; audit. **The Agent may
never invent a tool** — only registered tools may be proposed. Tool
registration alone does not grant execution permission; every action
still passes through the full authorization pipeline (§7).

### 12. Context and Memory Boundaries

Three distinct concepts, never merged: **Execution state** (the Agent's
current plan, steps, observations, verification, evaluation, and audit
chain — session-scoped); **Conversational context** (the user's current
interaction, passed through the governed Context Engine only); **User
Memory** (the canonical DECIVEXA Memory subsystem). The Agent must not
bypass Memory governance, must not directly access arbitrary domain
data, and must not automatically write execution state into Memory. Any
future Agent ↔ Memory integration requires its own separate Founder
gate.

### 13. Observability

Agent execution must eventually support reconstruction of: request →
context decision → plan → action proposal → risk classification →
policy decision → permission decision → execution → verification →
evaluation → adaptation → final outcome. Audit records must avoid
secrets, raw sensitive payloads, raw prompts where unnecessary, raw
audio, and unnecessary personal data, while remaining sufficient to
reconstruct the authorization chain without unsafe raw logs.

### 14. Security Invariants

Prompt injection, indirect prompt injection (via tool output), malicious
tool output, tool abuse, privilege escalation, unauthorized context
access, secret leakage, confused-deputy behavior, runaway loops,
excessive cost, unauthorized external side effects, malicious user
input, and malicious provider output must each be mapped to an existing
or required control (Intelligence Firewall, Output Boundary
verification, Tool Registry authorization, Context Engine exclusivity,
Permission Model, execution bounds) before Agent V1 implementation may
proceed.

### 15. Relationship to Prior Architecture Text

`docs/architecture/DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md` §17's
prohibition on "full autonomous agents... merely because this
architecture enables them" remains fully in force for unbounded
autonomy (§6 above); it does not prohibit the bounded Agent capability
this ADR requires. `docs/architecture/DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md`
§24 "Agent Readiness" and `docs/architecture/DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md`
§8 "Action Boundary" are adopted unchanged as the governing pipeline
shape for this ADR's §7 authorization chain.

### 16. Non-Effects

This ADR does NOT authorize: Agent code; Tool Registry implementation;
Permission Model implementation; Policy Engine implementation; Risk
Engine implementation; Intelligence Firewall implementation; Context
Engine implementation; Runtime implementation; or any other
infrastructure. It does not create a new FIS item, does not change FIS
numbering, and does not modify Memory, schema, HTTP/API, or frontend
code.

### 17. Implementation Gate Requirement

Agent V1 implementation remains separately gated. Exact numeric
execution limits (§10) remain an Implementation Gate decision. No
implementation may begin under authority of this ADR alone.

---

## ADR-008 — Voice Input V1 Architecture

**Authoritative identity:** `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`
§ADR-008.

### 1. Title

Voice Input V1 Architecture — Governed User Voice Input Required in V1;
Voice Output Deferred; Provider-Agnostic Speech-to-Text.

### 2. Status

FOUNDER-APPROVED — ARCHITECTURALLY DECIDED — NOT IMPLEMENTATION-AUTHORIZED.

ADR-008 records architecture and governance decisions only. It does not
authorize implementation.

### 3. Date

2026-08-24

### 4. Founder

Parsa Kiamanesh

### 5. Decision Context

ADR-006 conditionally reopened "Voice architecture where required by the
V1 AI architecture." A dedicated read-only readiness gate found the
canonical corpus contained zero affirmative case for Voice in V1 and
recommended NOT CURRENTLY REQUIRED absent a Founder decision. The
Founder subsequently required user voice input specifically — not
bidirectional voice — for V1. A dedicated read-only architecture-
specification gate then produced the full specification this ADR now
formally registers.

### 6. V1 Boundary

```
User Speech
  → Frontend / Mobile Audio Capture
  → Speech-to-Text Adapter
  → Normalized Text
  → Context Engine
  → Privacy / Data Router
  → Policy
  → Risk
  → AI Runtime
  → Capability / Agent
  → Normal DECIVEXA Response
```

V1 supports **User → DECIVEXA voice input**. V1 does **not** support
DECIVEXA → spoken output.

### 7. Critical Invariant — No Second Security Path

Voice-transcribed text must enter the same governed pipeline as typed
text. There must not be a "Voice → special Agent path," "Voice → direct
execution," or "Voice → bypass Context/Policy/Risk." Voice is an input
modality, not a separate authorization system. This is enforced by
design: no parallel path exists for it to bypass.

### 8. Provider-Agnostic Speech-to-Text Architecture

The architecture must remain provider-agnostic; no specific STT vendor,
model, or implementation may be hard-coded into the canonical
architecture. The eventual adapter follows the same normalized-provider
pattern already established for `AIProvider`:

```ts
interface SpeechToTextProvider {
  transcribe(request: TranscriptionRequest): Promise<TranscriptionResult>;
  healthCheck(): Promise<ProviderHealth>;
  getCapabilities(): TranscriptionCapabilities;
}
```

This is an architectural contract only — not implemented by this ADR,
and no concrete provider is selected by this ADR. Commercial STT
providers may be supported later without redesigning AI Runtime, Context
Engine, Policy Engine, Risk Engine, Capability Registry, or Agent
architecture. Provider selection must never create architectural
lock-in.

### 9. V1 Direction — Self-Hosted / Open-Weight Preference

DECIVEXA V1 should prefer a self-hosted / open-weight Speech-to-Text
architecture where technically and operationally appropriate,
consistent with the provider-independence rationale already established
for the generation-provider adapter (ADR-001). This is a direction, not
an implementation authorization; concrete provider/model selection
remains an implementation-stage decision within this approved
provider-agnostic architecture.

### 10. Audio Privacy — Raw Audio Never Persisted (V1 Invariant)

```
Microphone → Temporary Audio Buffer → Speech-to-Text Adapter
  → Normalized Text → Governed AI Pipeline → Raw Audio Deleted
```

Raw audio must not be stored in the database, stored in Memory, written
to audit logs, written to application logs, retained for analytics,
persisted for model training, or silently retained by DECIVEXA
infrastructure. Raw audio exists only transiently, for the minimum time
necessary to perform transcription. A future requirement proposing
persistent audio storage requires a separate explicit Founder
authorization and governance gate — it is not authorized by this ADR.

### 11. UX Security Requirement

V1 must eventually provide microphone permission request, recording
start/stop, recording cancellation, transcription-in-progress state,
transcription failure state, and **editable transcription before it can
trigger an action-class request** — protecting against transcription
errors causing unintended actions. Not implemented by this ADR.

### 12. Future Bidirectional Voice — Extensibility Preserved, Not Built

The architecture must remain extensible toward text-to-speech,
bidirectional voice, streaming audio, real-time voice interaction,
barge-in, spoken confirmation, and real-time voice agents. None of these
are V1 requirements, and none are authorized for implementation by this
ADR.

### 13. Non-Effects

This ADR does NOT authorize: voice capture implementation; microphone UI;
STT adapter implementation; installation or selection of a concrete STT
provider or model; any dependency addition; any frontend modification;
any backend runtime modification; any database schema for audio or
Agent execution. It does not create a new FIS item and does not modify
Memory, schema, HTTP/API, or frontend code.

### 14. Implementation Gate Requirement

Voice Input V1 implementation remains separately gated. Concrete STT
provider/model selection remains an implementation-stage decision within
the approved provider-agnostic architecture. No implementation may begin
under authority of this ADR alone.

## ADR-009 — Context Engine Boundary Ownership and Runtime Context Resolution Wiring

**Authoritative identity:** `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`
§ADR-009.

### 1. Title

Context Engine Boundary Ownership and Runtime Context Resolution Wiring —
Application-Owned Context Boundary; Narrow, Deterministic AIRuntime ↔
AIContext Dependency-Inversion Seam.

### 2. Status

FOUNDER-APPROVED — ARCHITECTURALLY DECIDED — GOVERNANCE REGISTRATION OF
AN ALREADY-IMPLEMENTED, ALREADY-ACCEPTED INCREMENT.

Unlike ADR-005 through ADR-008, this ADR is registered after the
corresponding implementation (commits `aff8882`, `5126e32`, `ee1aae6`)
was already Founder-authorized, implemented, tested, committed, pushed,
and formally accepted. It records decisions already made and already
executed; it does not itself authorize any further implementation.

### 3. Date

2026-08-25

### 4. Founder

Parsa Kiamanesh

### 5. Decision Context

Following the Increment 4 (Policy/Risk/Context/Firewall/Evaluation)
read-only readiness audit, a dedicated Context Engine Boundary readiness
audit found that AIRuntime had no sanctioned mechanism to obtain context
from Memory/Evidence/Personal Intelligence/Personal State without
violating infrastructure/ai's established isolation invariant.

The Founder resolved this in two decisions: first, that the Context
boundary is application-owned (this section, §6); second, following an
architecture-options analysis, six binding sub-decisions governing
exactly how AIRuntime connects to that boundary (§7).

### 6. Foundational Decision — Context Boundary Ownership

The DECIVEXA Context boundary is application-owned, implemented as the
dedicated `apps/api/src/application/ai-context/` module.

Intended dependency direction:

```
AIRuntime
    ↓
Application-owned Context Boundary
    ↓
Existing Application Use-Cases
    ↓
Core Repository Ports
    ↓
Infrastructure Persistence
```

Explicitly not authorized as:

- a direct `infrastructure/ai → core` dependency;
- a direct `infrastructure/ai → infrastructure/persistence` dependency;
- a new independent architectural layer;
- a domain-owned Context port;
- direct repository access from AI infrastructure.

**Zero-import rule:** `infrastructure/ai/` must not directly import:

- `core/`
- `application/`
- `domain/`
- `infrastructure/persistence/`
- `MemoryModule`
- `EvidenceModule`
- `PersonalIntelligenceModule`
- `PersonalStateModule`

### 7. Six Binding Sub-Decisions

**1. Context Declaration Model.** `requiredContext: readonly string[]`
(`AICapabilityRegistrationInput`) remains unchanged. The existing
`core/resource/` reference→resolver→discriminated-result pattern is
reused structurally only — never imported, modified, or extended. AI
context resolution remains semantically distinct from workspace-resource
resolution. `ResourceType` is never extended with an AI-context member.

**2. Record Selection.** Resolver-owned selection consuming a
task-derived, invocation-specific selector. Capability declarations must
never contain hard-coded, user-specific, or invocation-specific record
identifiers. The resolver owns mapping a semantic requirement to a
concrete reference.

**3. Runtime Identity.** The existing `RequestContext` remains the sole
identity mechanism. `AITaskRequest` may carry it (added as `context:
RequestContext`). No second identity/session/runtime-principal
abstraction is authorized.

**4. Dependency Boundary.** Application-owned implementation behind an
infrastructure-owned port. Direct `AIRuntime → AIContextService` is
never authorized. `infrastructure/ai/` isolation remains intact except
for the two narrowly-sanctioned type imports represented by the
implementation record: `context/request-context`, and the Context
Resolution port itself as the dependency-inversion seam.

**5. Multi-context Semantics.** Zero `requiredContext` → no acquisition
attempted, deterministic. Exactly one → the only cardinality authorized
for the first increment. A missing/unresolvable required context must
produce a deterministic typed failure — never silently disappear, never
fabricate an empty or substitute context. Authorization failure must
remain distinguishable from ordinary absence wherever the existing
architecture already supports that distinction. Provenance must remain
preserved end-to-end.

**6. Deferred Systems.** Explicitly out of scope, not to be inferred or
invented under this ADR:

- multi-context ordering;
- parallel/sequential acquisition;
- aggregation;
- partial availability;
- advanced duplicate handling;
- context budgets;
- relevance scoring;
- temporal filtering;
- minimization policy;
- redaction policy;
- privacy classification;
- PolicyEngine;
- RiskEngine;
- provider eligibility;
- trust classification;
- the full canonical Context Engine.

### 8. Relationship to Prior Architecture

Operationalizes a narrow, honest subset of Implementation Contract V1
§3's `ContextProvider/ContextEngine` and `AIRuntime` "obtain authorized
context" responsibility — not the full canonical contract. Consistent
with, and does not reopen, ADR-007 §7 ("AI cannot grant itself
permission"): the resolver introduced under §7.2 above selects, it never
authorizes, and every context acquisition still terminates in the
pre-existing, unmodified, user-scoped source use-case/repository
authorization path.

### 9. Implementation Record

Already executed, not authorized by this ADR:

- `aff8882` — Context Boundary Compatibility Remediation (§6 foundational
  decision, initial `application/ai-context/` module).
- `5126e32` — App Module wiring of `AIContextModule`.
- `ee1aae6` — Runtime Context Resolution (§7's six sub-decisions):
  `ContextResolutionPort`/`ContextResolutionAdapter`, `AITaskRequest`
  extended with `context: RequestContext`, `AIRuntime.route()`'s
  zero/one/more-than-one context-acquisition behavior, deterministic
  failure taxonomy (`unsupported_label`/`missing_selector`/`not_found`/
  `unauthorized`/`resolution_failure`).
- Independently reviewed and formally ACCEPTED (Runtime Context
  Resolution Acceptance Report, this session).

### 10. Non-Effects

This ADR does NOT authorize: a real selector/record-identifier data
channel (still absent — every current call site supplies `selector:
null`); wiring `AIRuntime` into any production consumer, module, or HTTP
surface; any of the §7.6 deferred systems; any change to
`core/resource/*`; any change to `AIContextService`; any change to
`ai-context.types.ts`; any change to `ai-context.errors.ts`; any schema,
migration, or dependency change. It registers governance history; it
grants no new implementation authority.

### 11. Implementation Gate Requirement

Any further work in this area — the selector data channel, Policy/Risk
Engine, or completion of the full Context Engine (§7.6) — remains
separately gated and requires its own explicit Founder decision and
Implementation Authorization. No implementation may begin under
authority of this ADR alone.
