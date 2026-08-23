# DECIVEXA — Implementation Increment 004 Contract

## A. Identity

- **Title:** PI Access Authorization Boundary
- **Increment ID:** Implementation Increment 004
- **Status:** FOUNDER-APPROVED CONTRACT — BUILD AUTHORIZATION NOT YET GRANTED
- **Date drafted:** 2026-08-23
- **Contract approval date:** 2026-08-23
- **Contract approval reference:** Explicit Founder approval recorded in
  project governance conversation ("Contract Increment 004 را به‌طور
  صریح تأیید می‌کنم"), Phase 10J — Governance Ratification & Build-
  Authorization Gate.
- **Architecture Baseline:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`
- **Technology Baseline:** `TD-08`
- **Governance Gate:** `TD-09` — Build Authorization checklist item B15
  ("Founder Build Authorization explicitly recorded") remains **PENDING**
  per `docs/TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md` as of
  this Contract's approval date. Contract approval is **not** Build
  Authorization; see Section B and Section T.
- **Base:** `main` at `4a363f14b7bea1d4c531d897710263c01fc02be8`

## B. Authority Boundary

This Contract's scope has received explicit Founder approval (Section A,
Phase 10J). **Contract approval is not implementation authorization.**
Nothing in this Contract, the Founder's approval of it, or the Phase 10G
governance remediation artifacts it references, authorizes any code,
test, schema, or migration change. Implementation may begin only after
the applicable TD-09 Build Authorization gate independently records
Build Authorization for this specific increment — mirroring the Gate
Rule already established by `docs/IMPLEMENTATION_INCREMENT_002_CONTRACT.md`
and the approval pattern of `docs/IMPLEMENTATION_INCREMENT_003_CONTRACT.md`.
As of this Contract's approval date, `docs/TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md`
checklist item B15 remains **PENDING** and its Founder Approval Record
section remains unset for this or any increment; no criterion-by-criterion
TD-09 readiness review specific to this increment has been performed or
recorded anywhere in the repository. That review, and its own explicit
Founder Build Authorization decision, remain outstanding and are not
performed by this edit.

This Contract does **not** treat the Phase 10G governance remediation
(`docs/gates/PERSONAL-INTELLIGENCE-GOVERNANCE-REMEDIATION-RECORD.md`,
`docs/gates/PERSONAL-INTELLIGENCE-MATERIALITY-DECISION-RECORD.md`) as
authorization for this or any future increment. Those records classified
and reconciled the governance status of already-existing historical
implementation (Phases 1–9) only; per their own explicit text, they "do
not grant new build authorization for them or for anything else" and
"do not constitute... future Build Authorization." This Contract is the
separate, prospective act those records point to as the required next
step.

## C. Objective

Establish a deterministic, pure, testable Personal Intelligence
access-authorization boundary before any future consumer-facing capability
(HTTP, AI, agent, or otherwise) is attached to Personal Intelligence Core —
without introducing any new external trust boundary in the process.

## D. Existing-State Baseline (Historical, Not Modified)

The following already exist, are already merged, and are **not** modified,
re-authorized, or reinterpreted by this Contract:

- Personal Intelligence claim domain model
  (`core/personal-intelligence/personal-intelligence-claim.model.ts`)
- Personal Intelligence schema
  (`persistence/schema/personal-intelligence.schema.ts`)
- migration `0007`
- repository interface
  (`core/personal-intelligence/personal-intelligence-claim.repository.ts`)
- repository implementation
  (`infrastructure/persistence/personal-intelligence-claim.repository.ts`)
- application use-case
  (`application/personal-intelligence/personal-intelligence-claim.use-case.ts`)
- `PersonalIntelligenceModule`
- `AppModule` registration
- existing Personal Intelligence tests (model, use-case, module,
  app-composition, behavior specs)

The current Personal Intelligence boundary terminates at the
application/use-case layer. There is currently **no** Personal
Intelligence HTTP controller, HTTP transport module, authorization
predicate, consent/purpose persistence mechanism, audit integration, AI
Gateway integration, Agent Runtime integration, or lifecycle/export/
deletion implementation.

## E. Problem Statement

Every domain in this repository that has reached HTTP exposure (Evidence,
Personal State) relies on implicit ownership-scoped repository methods
(e.g., `findByIdForUser`) as its only access control. Personal Intelligence
Core is architecturally required to be held to a stricter standard:
`docs/architecture/TD-04-human-os-personal-intelligence-core.md` §16
states "Access must follow: Requester → Purpose → Required Context →
Authorization Policy → Minimum Necessary Data → Auditable Access. No
module receives unrestricted access to the complete Human Model by
default." No such authorization primitive currently exists for Personal
Intelligence anywhere in the repository. This absence blocks safe
progression toward HTTP exposure or any other future consumer without
first establishing the primitive that would govern it.

## F. Scope

This increment may include only:

1. A new, pure, deterministic Personal Intelligence access-policy
   predicate module in the core layer (e.g.
   `core/personal-intelligence/personal-intelligence-claim.access.ts`),
   structurally modeled on the existing `core/resource/workspace.access.ts`
   pattern (`canAccessWorkspace(actorId, resource, action): boolean` /
   `assertWorkspaceAccess(...)`), adapted to the Personal Intelligence
   claim/version model.
2. Ownership evaluation: the predicate determines whether the requesting
   actor is the owning user of the claim being accessed, using the
   existing `userId` field already present on `PersonalIntelligenceClaim`
   and `PersonalIntelligenceClaimVersion`.
3. Action evaluation limited to the minimum required distinction already
   used by the `workspace.access.ts` precedent: `"read"` and `"write"`.
4. Unit tests covering the authorization matrix (authorized/unauthorized,
   read/write, own/not-own).

The exact function signature is not fixed by this Contract beyond
mirroring `workspace.access.ts`'s existing shape; the implementer must not
invent additional parameters, actions, or return shapes beyond what
Section I permits.

## G. Explicit Non-Goals

This increment does **not** authorize, and explicitly excludes:

- HTTP/API exposure
- controllers
- transport modules
- `AuthenticationGuard` wiring
- authorization middleware
- consent storage
- consent UI
- a new purpose taxonomy, enum, or classification scheme, unless
  separately approved in a future increment
- audit wiring
- lifecycle, export, or deletion implementation
- AI Gateway integration
- Agent Runtime integration
- external AI-provider integration
- autonomous behavior of any kind
- schema changes
- migrations
- new database tables
- new persisted authorization or consent state
- production deployment
- unrelated refactoring
- query hardening unrelated to authorization
- any new Personal Intelligence capability beyond the predicate itself

Any discovery that implementation requires one of these triggers the Stop
Conditions in Section P.

## H. Architecture

```
PI domain/repo/use-case (existing, Section D)
        │
        ▼
PI Access Authorization Boundary  ◄── this Contract's proposed scope
   (pure predicate; no I/O; no network reachability;
    callable only from within the process)
        │
        ▼ (NOT part of this increment)
   future HTTP / audit / lifecycle / AI / agent work,
   each requiring its own separately approved Increment Contract
```

The predicate introduces no new module boundary crossing: it is invoked
by whatever future caller needs it, but this increment does not add any
such caller. It remains, on completion of this increment, an unused
primitive with test coverage only — identical in this respect to how
`workspace.access.ts` exists and is tested independently of any
controller that calls it.

## I. Authorization Semantics

The predicate evaluates exactly:

- **Actor identity** (a `userId` string) against the claim/version's own
  `userId` field (ownership equality — the same mechanism already used
  implicitly by every existing `findClaimForUser`/`findClaimVersionForUser`
  repository method).
- **Action** — `"read"` or `"write"` only, matching the precedent's
  existing vocabulary. No broader action taxonomy is introduced.
- The predicate **fails closed**: any action other than `"read"` or
  `"write"`, or any ownership mismatch, results in denial. No
  unrestricted "allow all" fallback path may exist. This mirrors
  `workspace.access.ts`'s existing behavior exactly (`if (action !== "read"
  && action !== "write") { return false; }`).

The predicate does **not** evaluate purpose. See Section J.

## J. Purpose-Binding Decision — DEFERRED

`docs/architecture/TD-04-human-os-personal-intelligence-core.md` §16
describes the intended access chain as "Requester → Purpose → Required
Context → Authorization Policy → Minimum Necessary Data → Auditable
Access" — i.e., architecturally, a *purpose* is meant to sit alongside
identity and action in the eventual authorization decision. A
repository-wide search found no document that defines an authoritative
purpose taxonomy, enumeration, consent-category scheme, or classification
construct for Personal Intelligence access, anywhere in the repository.
Inventing one here would violate this Contract's explicit prohibition on
fabricating undocumented requirements (governance rule #10).

**Purpose taxonomy is not evidenced as an existing authoritative
construct and is therefore deferred from Increment 004.**

This increment implements ownership + action evaluation only (Section I),
explicitly leaving the "Purpose" step of TD-04 §16's chain unimplemented.
The resulting predicate is therefore a partial implementation of TD-04
§16's full chain, not a complete one, and must not be represented as
fully satisfying TD-04 §16 — only as satisfying the ownership/action
portion of it.

Purpose binding is deferred from Increment 004. No purpose taxonomy,
consent taxonomy, purpose persistence, or purpose-specific data model is
introduced by this increment. A future purpose-binding design requires
separate Founder/architecture determination before implementation — this
Contract does not claim that future design is approved, scheduled, or
even scoped; it only declines to invent it now. No purpose enum, purpose
database table, consent model, consent storage, purpose migration, UI, or
API may be created under this or any future increment without that
separate, explicit approval.

## K. Security & Privacy Impact

- Current Personal Intelligence implementation has no external consumer
  boundary (Phase 10H §6, re-confirmed unchanged as of this Contract's
  drafting).
- This increment does not create network exposure — the predicate is not
  reachable from outside the process.
- This increment does not introduce a new data consumer.
- This increment does not move Personal Intelligence data across any
  trust boundary — no data leaves the process, no new caller is added.
- The intended effect is to establish a least-privilege enforcement
  primitive *before* any future exposure, not to complete Personal
  Intelligence's security posture.
- The implementation must fail closed wherever the policy cannot
  establish authorization (Section I) — no unrestricted "allow all"
  fallback may be introduced.
- **This increment does not fully solve Personal Intelligence
  privacy/security.** It establishes an authorization primitive only,
  and — per Section J — only the ownership/action portion of TD-04 §16's
  intended chain, not the purpose-binding portion, which is explicitly
  deferred to a future, separately determined increment.

## L. Data Impact

None. No schema change. No migration. No new persisted field, table, or
index. The predicate operates only on data already present on the
existing `PersonalIntelligenceClaim`/`PersonalIntelligenceClaimVersion`
types.

## M. Dependencies

- Existing `PersonalIntelligenceClaim`/`PersonalIntelligenceClaimVersion`
  domain types (Section D) — already merged, no change required.
- `core/resource/workspace.access.ts` — used as a structural precedent
  only; not imported or modified.

No dependency on any capability that does not already exist in the
repository.

## N. Acceptance Criteria

1. The authorization policy is deterministic (same inputs always produce
   the same output).
2. The policy is pure and performs no I/O.
3. The policy is Personal-Intelligence-specific (not a generic/shared
   predicate reused across domains).
4. Ownership is explicitly evaluated (actor `userId` vs. claim/version
   `userId`).
5. Read/write behavior is explicitly and separately defined.
6. Unauthorized access (ownership mismatch, or an action outside
   `"read"`/`"write"`) is denied.
7. No unrestricted default-allow path exists.
8. Unit tests cover both authorized and unauthorized cases for both
   actions.
9. No schema changes are required or introduced.
10. No migration is required or introduced.
11. No HTTP layer is introduced.
12. No AI/agent consumer is introduced.
13. Existing Personal Intelligence behavior (Phases 1–9) remains
    unchanged, except for the addition of this new, otherwise-unused
    policy primitive and its tests.
14. Existing governance documents remain untouched.

15. No purpose taxonomy, consent taxonomy, purpose persistence, or
    purpose-specific data model is introduced (purpose binding is
    deferred, per Section J).

## O. Test Strategy

Unit tests only, following the existing `node:test` + `node:assert/strict`
pattern already used throughout the Personal Intelligence domain (e.g.
`personal-intelligence-claim.model.spec.ts`). No database, no NestJS
`TestingModule`, no I/O — consistent with `workspace.access.spec.ts`'s
existing precedent for testing a pure access predicate. If approved, the
new spec file would require exactly one line added to
`apps/api/package.json`'s existing hardcoded test list, in the position
matching the existing core/personal-intelligence grouping — the same
mechanism used for every prior Personal Intelligence phase. **This
Contract does not add that line; it is implementation, not drafting.**

## P. Stop Conditions

Implementation must stop and return to Founder governance immediately if
discovery reveals that:

- purpose binding requires a new persisted model;
- consent storage is required;
- schema modification is required;
- migration is required;
- authorization depends on undocumented identity semantics beyond the
  existing `userId` ownership field;
- an external consumer is required to implement or test the predicate;
- HTTP exposure becomes necessary to complete this increment;
- AI/agent infrastructure is required;
- another domain (Evidence, Personal State, Workspace, etc.) must be
  modified;
- the access model cannot be expressed as a pure, deterministic policy;
- existing architecture evidence conflicts with the approach in Section F;
- scope expands beyond what Section F and Section G permit.

## Q. Rollback

Rollback is the removal of the newly introduced authorization-predicate
module and its test file only. No data migration rollback is required or
authorized, because no schema or migration change is permitted by this
Contract (Section G, Section L). No destructive rollback operation is
authorized during the drafting phase — this Contract does not create
anything to roll back.

## R. Governance Gates

- This document is **prospective**. It does not authorize implementation.
- Historical Personal Intelligence implementation (Section D) remains
  historical implementation, governed by the already-published Phase 10G
  remediation artifacts, unaffected by this Contract.
- Explicit Founder approval of this exact Contract is required before
  implementation.
- Applicable TD-09 Build Authorization is required before implementation,
  per `docs/TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md`'s
  Non-Negotiable Rules ("No new module, major data-domain boundary...
  may be introduced without Founder approval and an architecture/decision
  record when material").
- No source code may be changed before both gates above pass.
- The Phase 10G governance remediation did **not** authorize this
  increment; it only established the historical-governance record that
  made drafting this Contract possible without fabricating prior
  authorization.

## S. Founder Decisions Required

1. **Contract approval:** Explicit Founder approval of this Contract as a
   whole, in the form already used for Increment 002/003 (an approval
   record referencing this exact Contract).

Purpose binding (Section J) is not a decision required to approve this
Contract — it has already been resolved to "deferred" for the purposes of
Increment 004, on the conservative ground that no authoritative taxonomy
is evidenced anywhere in the repository. Designing a future purpose-
binding mechanism remains a separate, later Founder/architecture decision,
out of scope for this Contract's approval.

## T. Implementation Authorization Statement

This Contract defines a prospective implementation scope but does **not**
authorize implementation. Implementation requires explicit Founder
approval of this Contract and satisfaction of the applicable TD-09 Build
Authorization gate. Until those conditions are independently satisfied,
no implementation may begin.

## Current Decision

**Implementation Increment 004 (PI Access Authorization Boundary):
CONTRACT FOUNDER-APPROVED (2026-08-23) / BUILD AUTHORIZATION NOT YET
GRANTED.** Implementation remains prohibited until the TD-09 Build
Authorization gate (Section R, Section T) is independently satisfied and
recorded.
