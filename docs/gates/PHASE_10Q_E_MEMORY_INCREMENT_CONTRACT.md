# PHASE 10Q-E — Memory Architecture Increment Contract

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record.*

This document is preserved as a historical architectural/planning
record. At the time it was written, no Memory implementation existed in
this repository. Memory has since been implemented and committed to
`main` through a separate, real implementation path (commits `3fd57c9`,
`11e8d0d`, `217170e`, `2b5157a`, `15627e5`) whose original conversational
Founder authorization is not present anywhere in this repository's
surviving documentation.

This document's §20 "FOUNDER APPROVED" status is a claim contained in
this historical document only, and must not be upgraded into
independently corroborated repository authority. Its §18
"IMPLEMENTATION AUTHORIZATION: NOT GRANTED" and its "NOT BUILD-
AUTHORIZED" status remain accurate for this document's own gate
sequence — no implementation was ever built from this specific gate
sequence reaching Build Authorization. This Contract's §6 in-scope items
(a record+version model, provenance/lifecycle/confidence, correction/
deletion, ID-scoped retrieval) are consistent with, though not proven as
the direct cause of, what was ultimately shipped. This reconciliation
does not fabricate or reconstruct the missing authorization record and
does not authorize any new implementation. The current shipped Memory
implementation must be established from the actual committed source and
commit history, not inferred from this document.

## §1. Contract Identity

- **Contract ID:** `MEMORY-INCREMENT-CONTRACT-001` (draft)
- **Phase / Increment identity:** Phase 10Q-E; not yet assigned a
  numbered Implementation Increment (the repository's numbered sequence
  currently ends at Implementation Increment 004, closed).
- **Status:** **FOUNDER APPROVED — NOT BUILD-AUTHORIZED.**
- **Authorizing Founder decision references:**
  `docs/gates/PHASE_10Q_PERSONAL_INTELLIGENCE_MEMORY_BOUNDARY_FOUNDER_DECISION_GATE.md`
  §18 (Option B); `docs/gates/PHASE_10Q_C_MEMORY_FOUNDER_BOUNDARY_DECISION_GATE.md`
  §14 (BND-01-A); `docs/gates/PHASE_10Q_D_MEMORY_CONTRACT_READINESS_GATE.md`
  §10 (READY FOR CONTRACT DRAFTING). This Contract's own drafting is
  authorized by the Founder's Phase 10Q-E instruction ("DRAFT THE
  MEMORY ARCHITECTURE INCREMENT CONTRACT"), which is explicitly scoped
  to drafting only.

## §2. Baseline / Repository State

- Branch: `main`
- HEAD at drafting time: `3cacf777c7a88c02624462a43ff822cff4cbda28`
- origin/main at drafting time: `3cacf777c7a88c02624462a43ff822cff4cbda28`
- HEAD == origin/main: confirmed
- `git diff --stat`, `git diff --cached --stat`: empty prior to this
  document's creation. Working tree contained only routine
  build/dependency noise plus the four prior Phase 10Q artifacts,
  confirmed present. No discrepancy found.

## §3. Authority Chain

**Tier 1/2:** `ARCHITECTURE_FREEZE_BASELINE.md`,
`FOUNDER_APPROVAL_RECORD_ARCH_TD08.md`,
`TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md` (repo-wide
status remains `NOT AUTHORIZED`), `TD-07_RE_REVIEW.md`, closed
Increment 004 record, Phase 10P, Phase 10Q §18, Phase 10Q-C §14, Phase
10Q-D §10. **Founder decisions (fixed, not reopened):** Option B
(Memory = distinct system); BND-01-A (Memory strictly outside PI Core's
nine claim categories). **Tier 3 (conceptual, non-authorizing):**
`TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md` §3.16, `TD-04-human-os` §4,
`TD-07-MEMORY-PROVENANCE.md`, `DECIVEXA-CANONICAL-SYSTEM-MAP.md`,
`DECIVEXA-CANONICAL-BASELINE.md` (FIS-045), `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
§10.10/§24, `FOUNDATION.md`, `FIS-REGISTRY.md`. **Implementation
evidence:** existing PI Core code (`core/personal-intelligence/`),
inspected only as evidence, not modified.

## §4. Architectural Position

- Memory Architecture = **DISTINCT SYSTEM** from Personal Intelligence
  Core (Option B, fixed).
- PI Core boundary: PI Core retains exclusive, unmodified ownership of
  its existing nine `claimType` categories (`identity_attribute`,
  `value`, `preference`, `capability`, `constraint`,
  `environment_context`, `strength`, `weakness`, `behavior_pattern`).
- **BND-01-A (fixed):** Memory's subject matter is strictly outside
  those nine categories.
- Subject-matter boundary: historical/event/decision/navigation
  records, anchored by FIS-045 ("Personal Navigation Memory") as the
  only concretely-evidenced instance.

## §5. Increment Objective

Establish, as a first and minimal increment, a Memory Architecture
domain model and storage/retrieval boundary — structurally analogous to
how Increment 004 established a first, minimal PI access-authorization
primitive — that can hold historical/event/decision/navigation records
with provenance/confidence/lifecycle metadata, without touching,
extending, or reinterpreting the closed PI Core claim model, and
without any external consumer (HTTP, AI, agent) attached in this
increment.

## §6. In-Scope Responsibilities

Only responsibilities directly evidenced in Phase 10Q-D §6/§11 are
in-scope:

1. A Memory record type representing a historical/event/decision/
   navigation occurrence (subject matter per §4/§9 below), distinct
   from and non-overlapping with PI Core's `claimType` categories.
2. Provenance/confidence/lifecycle metadata on each Memory record,
   independently declared (not shared with, imported from, or derived
   from PI Core's or Evidence's existing types), per Phase 10Q-D
   Dimension E.
3. Ownership-scoped storage and retrieval (ID/user-scoped lookup only,
   mirroring the only retrieval pattern evidenced anywhere in this
   repository — PI Core's and Evidence's existing use-cases).
4. Correction/deletion of a Memory record, per `TD-07-MEMORY-PROVENANCE.md`'s
   explicit requirement ("Users MUST be able to correct or delete
   eligible memories... while preserving necessary audit/history
   semantics").

Nothing beyond these four items is in scope.

## §7. Explicit Non-Goals

This increment does **not** authorize, and explicitly excludes:

- AI provider/model selection (blocked at Tier 1/2 by `TD-09`).
- Semantic/vector retrieval, embeddings, ranking, contextual recall.
- Agent Architecture, durable multi-day orchestration (blocked at
  Tier 1/2 by `TD-09`).
- UI of any kind.
- HTTP/API surface, controllers, transport modules,
  `AuthenticationGuard` wiring.
- Persistence technology selection beyond what is strictly required to
  state that Memory owns its own logical storage boundary (no table
  names, columns, or ORM models are specified by this Contract).
- Database schema details.
- Digital Twin (FIS-056) implementation.
- Context Fusion Engine implementation.
- Growth Navigation Engine implementation.
- Goal OS (remains DEFERRED — not reopened).
- Daily OS.
- Progress Intelligence.
- Security architecture redesign or Actor≠Owner resolution (remains
  DEFERRED — not reopened; no access-control/delegation/admin
  semantics introduced).
- General-purpose knowledge management or an unrestricted event-sourcing
  platform.
- Unrestricted user profile storage.
- PI Core ↔ Memory interface of any kind (deferred, per §17).
- Evidence Platform linkage of any kind (deferred, per §17).
- Sensitivity/privacy classification scheme (deferred, per §17).
- Verification/review/expiration mechanism beyond the bare
  correction/deletion capability in §6 item 4 (deferred, per §17).

Any discovery that implementation requires one of these triggers the
Stop Conditions in §15.

## §8. PI Core Boundary Invariants

**Non-negotiable invariant: MEMORY MUST NOT CREATE, MODIFY, EXTEND, OR
REINTERPRET THE PI CORE CLAIM MODEL.**

Specifically:

- No new PI Core `claimType` may be added.
- No modification of existing `claimType` semantics.
- No migration of PI Core claims into Memory.
- No duplicate ownership of PI Core claim subject matter.
- No reinterpretation of existing `PersonalIntelligenceClaimVersion` as
  a Memory implementation.
- No modification to the closed PI Core implementation
  (`apps/api/src/core/personal-intelligence/`,
  `apps/api/src/application/personal-intelligence/`).

If any proposed Memory record would fall inside one of the nine PI Core
claim categories, implementation must **STOP and escalate** to Founder
governance rather than inventing a resolution (§15).

## §9. Memory Subject-Matter Rules

Conservatively bounded, per BND-01-A and FIS-045:

- **In scope (evidenced):** records of historical navigation patterns,
  events, decisions, or experiences that occurred at a point in time
  and are not, themselves, an assertion about the user's current
  identity/value/preference/capability/constraint/environment/strength/
  weakness/behavior-pattern.
- **Out of scope (fixed by BND-01-A):** anything falling within PI
  Core's nine `claimType` categories, regardless of framing.
- **UNKNOWN / CONTRACT-DEFERRED:** the full enumerated set of Memory
  record subtypes beyond navigation history (e.g., whether "decision
  history" and "event history" are the same record type or distinct
  ones) is not evidenced with enough precision to enumerate here. This
  increment may implement a single, general Memory record type
  sufficient to hold FIS-045-aligned navigation history without
  inventing a broader taxonomy; if implementation discovers a need for
  additional record subtypes, that need must be escalated (§15), not
  invented.

## §10. Provenance / Confidence / Lifecycle Boundary

Per Phase 10Q-D Dimension E (evidenced) and Dimension F (UNKNOWN):

- **MUST (evidenced):** each Memory record version carries independent
  provenance and confidence metadata, structurally modeled on — but a
  separately-declared type from — the existing precedent
  (`EvidenceProvenance`/`EvidenceLifecycle` and
  `PersonalIntelligenceProvenance`/`PersonalIntelligenceLifecycle`),
  per `TD-02` §3.16, `TD-04-human-os` §4, and `TD-07-MEMORY-PROVENANCE.md`'s
  converging metadata contract (source, timestamp, confidence,
  user-confirmed vs. system-inferred).
- **MUST NOT (invariant, §8):** share a type, interface, or table with
  PI Core's or Evidence's existing provenance/confidence/lifecycle
  declarations.
- **UNKNOWN / CONTRACT-DEFERRED:** the exact lifecycle enum values are
  not evidenced for Memory specifically (Phase 10Q-D Dimension F
  explicitly declines to assume PI Core's `active|superseded|corrected|
  revoked|disputed` set transfers automatically). Implementation may
  select a minimal lifecycle sufficient to support §6 item 4
  (correction/deletion) — at minimum an active/corrected-or-deleted
  distinction — without inventing a full parallel set unless evidence
  or a future Founder decision requires more.
- **UNKNOWN / CONTRACT-DEFERRED:** synchronization protocol, shared
  tables, and shared services are not authorized and not designed here
  (§8 invariant forecloses sharing with PI Core in any case).

## §11. Evidence Requirements

A future implementation must be able to demonstrate:

1. **Ownership isolation:** Memory records are scoped to their owning
   user, with no cross-user access (mirroring the existing PI
   Core/Evidence pattern), verified by automated tests.
2. **Boundary enforcement:** no Memory record type or field
   corresponds to any of PI Core's nine `claimType` categories,
   verified by code/schema inspection at implementation review time.
3. **Provenance preservation:** every Memory record version carries
   its own, independently-declared provenance/confidence metadata,
   verified by automated tests.
4. **Lifecycle integrity:** correction/deletion of a Memory record does
   not silently erase prior history (per `TD-07-MEMORY-PROVENANCE.md`'s
   "preserving necessary audit/history semantics"), verified by
   automated tests.
5. **No PI Core mutation:** `git diff` of the implementation commit(s)
   touches no file under `apps/api/src/core/personal-intelligence/` or
   `apps/api/src/application/personal-intelligence/`, verified directly
   at publication time (mirroring how Increment 004's publication was
   verified via `git show --stat`).
6. **No cross-domain leakage:** no HTTP/API, UI, AI, or agent consumer
   is introduced (§7), verified by repository inspection at
   implementation review time.

No requirement beyond these six is imposed; none is invented beyond
what §6–§10 already establish.

## §12. Contract Invariants

**MUST:**
- Memory is a distinct system from PI Core (Option B).
- Memory's subject matter excludes PI Core's nine `claimType`
  categories (BND-01-A).
- Memory records carry independent provenance/confidence metadata
  (§10).
- Correction/deletion capability exists and preserves history (§6
  item 4, §11 item 4).
- Retrieval is ownership-scoped, ID-based only (§6 item 3).

**MUST NOT:**
- Create, modify, extend, or reinterpret the PI Core claim model (§8).
- Add a new PI Core `claimType`.
- Modify existing, closed PI Core or Evidence code.
- Share a provenance/confidence/lifecycle type or table with PI Core
  or Evidence.
- Introduce HTTP/API, UI, AI, agent, or any external consumer (§7).
- Introduce a Purpose/Consent taxonomy, sensitivity classification
  scheme, or access-control mechanism (§7, §17).
- Reopen Goal OS, Goal Readiness, or Actor≠Owner.

**MAY:**
- Implement a single, general Memory record type sufficient for
  FIS-045-aligned navigation history (§9).
- Select a minimal lifecycle distinction sufficient for
  correction/deletion (§10).

**UNKNOWN / DEFERRED:**
- Full Memory record subtype taxonomy beyond navigation history (§9).
- Exact lifecycle enum values beyond the minimal set (§10).
- PI Core ↔ Memory interface, Evidence Platform linkage,
  sensitivity/privacy scheme, verification/review/expiration mechanism,
  persistence technology, retrieval technology (§17).

## §13. Acceptance Criteria

1. A Memory record type exists whose fields represent only
   historical/event/decision/navigation subject matter, containing no
   field or semantic overlap with any of PI Core's nine `claimType`
   values.
2. Each Memory record version carries its own, independently-declared
   `provenance` and `confidence` fields (not imported from or aliased
   to PI Core's or Evidence's existing types).
3. A correction/deletion operation exists and is exercised by an
   automated test showing prior history is preserved, not erased.
4. Retrieval methods are ownership-scoped (require a `userId` or
   equivalent identity parameter) and return only records owned by the
   requesting identity; verified by an automated test asserting
   cross-user isolation (mirroring the existing PI Core/Evidence test
   pattern).
5. `apps/api/src/core/personal-intelligence/` and
   `apps/api/src/application/personal-intelligence/` are byte-identical
   to their state at this Contract's baseline commit
   (`3cacf777c7a88c02624462a43ff822cff4cbda28`), verified via `git diff`
   against that commit showing zero changes in those paths.
6. No HTTP route, controller, UI component, AI/agent consumer, or
   external network exposure exists anywhere in the implementation
   commit(s), verified via repository inspection (`grep`/`git show
   --stat`) at review time.
7. No schema/migration/table is shared with, or foreign-keyed into, PI
   Core's or Evidence's existing tables, verified via schema
   inspection.
8. All new code has automated test coverage following the existing
   `node:test` + `node:assert/strict` pattern already used throughout
   this repository (e.g. `personal-intelligence-claim.model.spec.ts`,
   `workspace.access.spec.ts`), and the full existing test suite
   continues to pass (currently 69/69, per the closed Increment 004
   record) with the new tests added.

No vague criterion ("works correctly," "is scalable") is used; each
criterion above is directly checkable via `git diff`, `grep`, schema
inspection, or an automated test result.

## §14. Evidence / Verification Plan

| Acceptance criterion | Evidence that proves it |
|---|---|
| 1 (subject-matter isolation) | Manual/code review diff of the new Memory type against PI Core's `claimType` enum; automated test asserting no shared enum values. |
| 2 (independent provenance) | Type-level inspection (TypeScript type identity check) confirming Memory's provenance/confidence types are separately declared, not reused. |
| 3 (correction/deletion + history preservation) | Automated test creating a record, correcting/deleting it, and asserting the prior version remains queryable/auditable. |
| 4 (ownership isolation) | Automated cross-user isolation test, mirroring `personal-intelligence-claim.use-case.spec.ts`'s existing pattern. |
| 5 (PI Core untouched) | `git diff 3cacf777c7a88c02624462a43ff822cff4cbda28..<implementation-commit> -- apps/api/src/core/personal-intelligence/ apps/api/src/application/personal-intelligence/` showing empty output. |
| 6 (no external exposure) | `grep` for controller/route/UI/AI-client code touching the new Memory module; expected zero matches. |
| 7 (no shared schema) | Schema/migration file review confirming no foreign key or shared table with PI Core/Evidence. |
| 8 (test coverage, full suite green) | `npm run typecheck` and `npm test` output at implementation-verification time. |

## §15. Stop Conditions

Implementation must stop and return to Founder governance immediately
if discovery reveals that:

- Memory scope overlaps any of PI Core's nine claim categories.
- A new PI Core `claimType` is proposed or appears necessary.
- Existing PI Core (or Evidence) code must be changed to satisfy this
  Contract.
- A previously unresolved architectural boundary (interface,
  persistence technology, retrieval technology, sensitivity scheme) is
  about to be silently invented rather than left deferred per §17.
- Implementation requires reopening Goal OS or defining Goal Readiness.
- Implementation requires reopening Actor≠Owner or introducing any
  access-control/delegation/admin semantics.
- Implementation requires violating `TD-09`'s restrictions (e.g., AI
  provider selection, agent orchestration).
- Source evidence discovered during implementation contradicts this
  Contract's stated scope or invariants.
- The Contract, as implementation proceeds, would require an
  unauthorized architectural decision beyond what §4–§12 already
  establish.

## §16. Dependencies

**Confirmed dependencies:**
- Existing `userId`-based ownership-scoping pattern (PI Core, Evidence
  precedent) — already present, no change required.
- The repository's existing `node:test` + Drizzle + NestJS module
  conventions — already present.

**Non-blocking future dependencies (not required for this increment):**
- PI Core ↔ Memory interface (§17).
- Evidence Platform linkage (§17).
- AI Gateway, Agent Architecture, Digital Twin — all explicitly
  Non-Goals (§7).

**Unknown dependencies:** none identified beyond what is already listed
as deferred in §17; no dependency is assumed where evidence does not
establish one.

## §17. Deferred Decisions

Explicitly preserved as unresolved, not required for this Contract's
validity, and not decided by this document:

- PI Core ↔ Memory interface details (Phase 10Q-D Dimension D).
- Persistence technology selection (Phase 10Q-D Dimension G, physical).
- Retrieval technology beyond ID-scoped lookup (Phase 10Q-D
  Dimension H, technical).
- Semantic/vector retrieval (explicit Non-Goal, §7).
- Sensitivity/access-control classification mechanism (Phase 10Q-D
  Dimension J; does not reopen Actor≠Owner).
- Verification/review/expiration mechanism beyond bare
  correction/deletion (Phase 10Q-D Dimension K).
- Evidence Platform integration details (Phase 10Q-D Dimension I).
- Digital Twin relationship (Phase 10Q-D Dimension L; explicit
  Non-Goal, §7).
- Future AI consumption of Memory records (explicit Non-Goal, §7).

## §18. Implementation Authorization Boundary

**THIS CONTRACT DOES NOT BY ITSELF AUTHORIZE IMPLEMENTATION.**

Per the pattern established by every prior increment in this
repository (002/003/004), implementation requires, in order: (1)
explicit Founder approval of this exact Contract; (2) a criterion-by-
criterion TD-09 readiness review; (3) explicit Founder Build
Authorization, satisfying TD-09 checklist item B15 for this Contract's
scope only. `docs/TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md`
is not modified by this Contract and remains, at the repository-wide
level, `NOT AUTHORIZED`. None of these three steps has occurred.

## §19. Contract Readiness / Gate Result

This Contract is internally coherent and ready for Founder review: its
scope (§6) traces to Phase 10Q-D's evidence inventory without
invention, its invariants (§8, §12) directly enforce the fixed Founder
decisions (Option B, BND-01-A), its acceptance criteria (§13) are each
objectively checkable, and every open question identified in prior
gates is either resolved (§4, §10 provenance-ownership) or explicitly
deferred (§17) rather than silently invented.

**This determination is Contract-coherence readiness only. It is not,
and must not be read as, implementation readiness — that requires the
separate TD-09 review and Build Authorization described in §18.**

## §20. Founder Approval Record

**Contract approval status:** `FOUNDER APPROVED`

**Founder approval statement:**

> The Founder approves the Memory Architecture Increment Contract as
> drafted in Phase 10Q-E (Phase 10Q-F, explicit Founder authorization).
>
> This approval confirms:
>
> 1. Memory Architecture remains a distinct system from PI Core.
> 2. BND-01-A remains fixed.
> 3. Memory remains outside PI Core's nine claim categories.
> 4. The Contract's stated scope (§6) and non-goals (§7) are approved
>    as written.
> 5. The Contract's UNKNOWN / deferred decisions (§9, §10, §12, §17)
>    remain deferred — not resolved, not converted into requirements
>    by this approval.
> 6. No new PI Core `claimType` is authorized.
> 7. This approval does NOT authorize implementation.
> 8. This approval does NOT authorize schema or migration changes.
> 9. This approval does NOT authorize API or UI changes.
> 10. This approval does NOT authorize persistence or retrieval
>     implementation.
> 11. TD-09 Build Authorization remains a separate required gate,
>     unaffected by this approval.
> 12. Commit and push remain unauthorized unless separately
>     instructed.

**Build Authorization status:** `[FOUNDER APPROVAL PENDING]` (a
separate, later governance event from Contract approval, per §18 and
the pattern established by every prior increment in this repository —
not granted by this record).

Contract approval is recorded above exactly as explicitly authorized in
Phase 10Q-F. Build Authorization is not recorded, inferred, or
fabricated by this document.

## §21. Self-Audit

**A. Preserves Option B?** Yes — §4 restates it unchanged, not
reopened. **B. Preserves BND-01-A?** Yes — §4, §8, §9, §12 all restate
it unchanged. **C. Protects closed PI Core?** Yes — §8 invariant, §11
item 5, §13 criterion 5, §15 all enforce it explicitly. **D. Avoids a
second PI claim system?** Yes — §8, §9, §12 explicitly forbid any
overlap with PI Core's `claimType` categories. **E. Avoids reopening
Goal OS?** Yes — §7, §12, §15 explicitly exclude it. **F. Avoids
reopening Actor≠Owner?** Yes — §7, §12, §15, §17 explicitly exclude
any access-control/delegation mechanism. **G. Compatible with TD-09?**
Yes — §7 excludes every item TD-09 itself lists as a non-goal (AI
provider selection, agent orchestration); §18 explicitly requires a
separate TD-09 review before implementation. **H. Every MUST has
evidence or Founder decision?** Yes — §12's MUST list traces each item
to §4–§11's cited evidence or fixed Founder decision. **I. UNKNOWNs
preserved?** Yes — §9, §10, §12, §17 each explicitly mark unresolved
items UNKNOWN/DEFERRED rather than resolving them. **J. Implementation
details kept out?** Yes — no table name, column, API shape, or
algorithm is specified anywhere in this Contract. **K. Acceptance
criteria testable?** Yes — §13's eight criteria are each tied to a
concrete verification method in §14. **L. Stop conditions explicit?**
Yes — §15 lists nine explicit conditions. **M. Founder approval still
blank?** Yes — §20 contains no fabricated approval. **N. Implementation
authorization still NOT AUTHORIZED?** Yes — §18 states this explicitly.

**Read-only compliance:** no source code, schema, migration, API, UI,
or Architecture Freeze file was modified during this drafting session;
only this single new Contract document was created. Verified via
`git status --short` / `git diff --stat` below.

## §22. Files Created / Modified / Commit / Push Status

- **Files created:** exactly one — this document.
- **Files modified:** none. The four prior Phase 10Q artifacts were
  read only, not edited.
- **Commit status:** not committed.
- **Push status:** not pushed.

## §23. Hard Stop

This Contract is a draft only. **Implementation authorization: NOT
AUTHORIZED. TD-09 Build Authorization: NOT OBTAINED. Founder approval:
PENDING.** No implementation, schema, migration, API, UI, PI Core
modification, Architecture Freeze modification, commit, or push
follows from this document's creation. A separate, explicit Founder
approval of this exact Contract is required before any further step.
