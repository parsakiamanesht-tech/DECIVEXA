# PHASE 10Q-C — MEMORY FOUNDER BOUNDARY DECISION GATE

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

Statements below describing Memory as unimplemented, absent, or not
authorized are historical-at-the-time statements about this document's
own gate sequence — not the current repository state. BND-01-A, recorded
at §14 below, is preserved as the historical decision this document
recorded; it is consistent with, though not independently proven as the
cause of, the PI-Core-disjoint boundary Memory was ultimately built
with. This reconciliation does not fabricate or reconstruct the missing
authorization record, does not upgrade this document's own decision
language into independently corroborated repository authority, and does
not authorize any new implementation. The current shipped Memory
implementation must be established from the actual committed source and
commit history, not inferred from this document.

## 1. Baseline

- Branch: `main`
- HEAD at preparation time: `3cacf777c7a88c02624462a43ff822cff4cbda28`
- origin/main at preparation time: `3cacf777c7a88c02624462a43ff822cff4cbda28`
- HEAD == origin/main: confirmed
- `git diff --stat`, `git diff --cached --stat`, `git diff --check`: all
  empty/clean prior to this document's creation.
- Working tree contained only routine build/dependency noise
  (`apps/api/dist/`, `apps/api/node_modules/`, `apps/api/package-lock.json`)
  plus the two prior untracked Phase 10Q / 10Q-B governance artifacts. No
  discrepancy found; no STOP condition triggered.

## 2. Founder Authority

`docs/gates/PHASE_10Q_PERSONAL_INTELLIGENCE_MEMORY_BOUNDARY_FOUNDER_DECISION_GATE.md`
§18 re-read directly from disk and reconfirmed verbatim:
**Selected option: `OPTION B — MEMORY AS A DISTINCT SYSTEM`.** Not
altered, replaced, or reinterpreted here. Option A vs. Option B is not
reopened anywhere in this document.

## 3. Prior Phase Results

`docs/gates/PHASE_10Q_B_MEMORY_DISTINCT_SYSTEM_BOUNDARY_RESOLUTION.md`
re-read directly from disk and reconfirmed verbatim: final determination
**"NOT READY FOR CONTRACT DRAFTING."** Six-question matrix carried
forward unchanged (Q1 partially resolved; Q2 undefined; Q3 partially
resolved; Q4 partially resolved; Q5 undefined; Q6 undefined). No
contradiction found between the two prior artifacts.

Restated, unchanged: Goal OS = DEFERRED; Goal Readiness = UNDEFINED;
Actor≠Owner = DEFERRED; Memory implementation = NOT AUTHORIZED; Memory
Contract = NOT AUTHORIZED.

## 4. Authority Hierarchy

Tier 1 (Founder-approved governance/authorization records): Phase 10P,
Phase 10Q §18 (Option B), the closed Increment 004 record,
`ARCHITECTURE_FREEZE_BASELINE.md`, `TD-09`. Tier 2 (approved technical
decisions): `TD-08` and related gates. Tier 3 (conceptual): `TD-02`,
`DECIVEXA-CANONICAL-SYSTEM-MAP.md`, `TD-04-human-os`,
`TD-07-MEMORY-PROVENANCE.md`, master vision, `FOUNDATION.md`,
`FIS-REGISTRY.md`. Tier 4 (existing implementation evidence): PI Core
and Evidence code. Tier 5 (interpretation): used only to label residual
gaps, never as authorization. No Tier 3/4 source is elevated to Founder
authorization anywhere below.

## 5. Six-Question Reassessment

For each question: (A) resolved by evidence? (B) genuinely unresolved?
(C) actual blocker to Contract drafting? (D) safe to remain UNKNOWN
until Contract/implementation? (E) requires explicit Founder decision?

**Q1 — Ownership boundary.** (A) Partially — PI Core's `claimType` enum
(identity_attribute, value, preference, capability, constraint,
environment_context, strength, weakness, behavior_pattern) is closed
and unambiguous; FIS-045 concretely names navigation/decision history
as Memory's subject matter. (B) Genuinely unresolved at the outer
boundary — TD-02 §3.16's generic "memory storage abstraction" wording
does not itself exclude identity/trait-like content, and TD-02 §3.1
assigns "provenance"/"confidence" to PI Core in the same document that
assigns them to Memory. (C) **YES — this is a true blocker.** Left
undefined, a future Contract could scope Memory broadly enough to
create authoritative-state overlap with PI Core's already-closed claim
types. (D) No — safe deferral risks exactly the duplicate-authority
outcome the blocker test in Section 6 (below) exists to catch. (E)
**YES.**

**Q2 — PI Core ↔ Memory interface.** (A) No — no source defines one.
(B) Yes, genuinely unresolved. (C) **NO — not a hard blocker.** Every
Contract in this repository's governance history (Increment 002/003/004)
has scoped out unbuilt capability via an explicit Non-Goals section
(Increment 004 excluded HTTP/consent/audit entirely while still being
Contract-ready). A first Memory Contract can equally declare "no PI
Core interface" as an explicit Non-Goal without leaving any ownership
question open. (D) Yes — safe to defer to Contract-level scoping. (E)
No.

**Q3 — Provenance/confidence ownership.** (A) Partially — no document
explicitly commits to independent ownership for Memory, but Tier 4
evidence (Evidence and PI Core already coexist today with two
independently-declared provenance/confidence/lifecycle shapes,
`EvidenceProvenance`/`EvidenceLifecycle` vs.
`PersonalIntelligenceProvenance`/`PersonalIntelligenceLifecycle`, no
shared type) is direct precedent. (C) **NO, contingent on Q1.** Once
Q1 establishes that Memory's subject matter does not overlap PI Core's
claim types, independent provenance ownership per domain creates no
duplicate authoritative state — it is the same non-contradictory
pattern Evidence and PI Core already demonstrate. (D)/(E) Resolves by
following existing precedent once Q1 is settled; no separate Founder
decision required.

**Q4 — Shared vs. independent mechanism.** (A) Yes, resolvable by
combining two facts: (i) the Tier 4 Evidence/PI Core precedent already
shows independent, parallel mechanisms as the established repository
pattern; (ii) this phase's own governance rule (Section 20 of the
governing instruction; carried into Section 10 below) keeps existing PI
Core code **CLOSED — no modification permitted**. A genuinely "shared"
mechanism (a common interface/base type used by both PI Core and
Memory) would require touching PI Core's already-closed code, which is
independently prohibited. (C) **NO — resolved by constraint, not a
Founder blocker.** Independent mechanism is the only option compatible
with PI Core Protection; there is nothing left to decide. (D)/(E) Not
applicable — already resolved.

**Q5 — Persistence ownership.** Split explicitly:
- **Logical ownership**: (A) Yes — Option B itself (Memory = distinct
  system) already establishes that Memory has its own authoritative
  state boundary, separate from PI Core's; "distinct system" would be
  meaningless otherwise. (C) No new blocker; this follows directly from
  the Founder's already-made Option B selection. (E) No.
- **Physical persistence** (storage technology, tables, columns): (A)
  No source defines this. (C) **NO — not a Contract-readiness
  blocker.** This is a downstream implementation detail, same category
  as every prior increment's schema design, which was always decided
  inside the Contract/implementation phase, never as a pre-Contract
  Founder architecture decision. (D) Yes, safe to defer. (E) No.

**Q6 — Retrieval responsibility.** Split explicitly:
- **Logical ownership** ("Memory owns retrieval of its own data"): (A)
  Yes — follows trivially from Option B, the same way PI Core owns
  retrieval of its own claims today. (C) No blocker. (E) No.
- **Technical retrieval mechanism** (ID-scoped lookup vs. semantic
  search vs. ranking vs. embeddings): (A) No source defines or requires
  any specific mechanism. (C) **NO — not a blocker.** Per governance
  rule 29 of the governing instruction, "future AI"/"Digital Twin"/
  "agents" may not be used to justify inventing architecture now; no
  authoritative source requires anything beyond the ID-scoped-lookup
  pattern already established by both PI Core and Evidence. (D) Yes,
  safe to defer entirely to Contract/implementation. (E) No.

## 6. Contract-Blocker Test

Applied verbatim per the governing instruction: a question is a
Contract blocker only if leaving it unresolved would let a future
Contract assign contradictory ownership, create duplicate authoritative
state, create two competing lifecycle models, create an undefined
mandatory cross-module dependency, make an irreversible persistence
decision without authority, define incompatible retrieval ownership, or
let PI Core and Memory semantically overlap in a way uncorrectable
without rework.

Only **Q1** (the outer boundary of Memory's subject matter relative to
PI Core's closed `claimType` enum) meets this test: an unresolved outer
boundary is the one condition that could produce genuine, hard-to-reverse
authoritative-state overlap between two systems, one of which (PI Core)
is closed and cannot be modified to fix the overlap after the fact.

Q2, Q5 (physical), and Q6 (technical) fail the test — none of them can
create ownership contradiction or duplicate authority; they are
downstream implementation details that a future Contract's own Non-Goals
section can scope out exactly as every prior increment in this
repository has done. Q3 and Q4 fail the test because they are already
resolved by existing precedent plus the PI Core Protection constraint,
not because they are unimportant.

## 7. Minimum Required Founder Decisions

Exactly **one** genuine Contract-blocking decision was identified.

---

**DECISION ID:** `BND-01`

**QUESTION:**
`Does Memory Architecture's subject matter include any claim category`
`already owned by Personal Intelligence Core's closed `claimType` enum`
`(identity_attribute, value, preference, capability, constraint,`
`environment_context, strength, weakness, behavior_pattern) — or is`
`Memory's scope strictly limited to historical/event/decision/`
`navigation records outside that enum?`

**WHY THIS BLOCKS CONTRACT:**
TD-02 §3.16 describes Memory's ownership in generic terms ("durable
personal memory lifecycle and provenance," "memory storage
abstraction") that do not, on their own, exclude identity/trait-like
content, while TD-02 §3.1 separately assigns PI Core the responsibility
to "maintain confidence and provenance" for its own claims. Left
unresolved, a future Memory Contract could be drafted broadly enough to
claim authority over data PI Core already owns and has closed — creating
duplicate authoritative state that cannot be corrected later without
architectural rework, since PI Core's implementation is closed and
protected from modification.

**EVIDENCE:**
- TD-02 §3.1 ("model capabilities, preferences, values, behavior
  patterns, constraints...") vs. §3.16 ("durable personal memory
  lifecycle and provenance").
- Existing, closed `PersonalIntelligenceClaim.claimType` enum (9 fixed
  categories).
- FIS-045 "Personal Navigation Memory" — the only concretely-named
  Memory subject matter, and it does not overlap the `claimType` enum.
- `DECIVEXA-CANONICAL-SYSTEM-MAP.md` §9 Data Ownership table — separate
  rows for "Human / Personal Model" and "Memory," implying non-
  overlapping authoritative state, but not stating the boundary
  explicitly.

**OPTIONS:**
`A — Memory's scope is strictly limited to historical/event/decision/`
`navigation records, and explicitly excludes every category already`
`in PI Core's claimType enum.`
`B — Memory's scope may overlap PI Core's claimType categories for`
`certain purposes (e.g., historical versions of identity/preference`
`facts), with the exact overlap left to future Contract-level design`
`within that constraint.`
`C — DEFER / insufficient evidence to decide now; Contract drafting`
`remains blocked until this is resolved by other means.`

**FOUNDER DECISION:** `[FOUNDER DECISION PENDING]`

**AUTHORIZATION EFFECT:**
Regardless of choice, this decision does not authorize implementation,
a Contract, an interface, a schema, an API, or a persistence design. It
only removes the single identified blocker to eventual Contract
drafting.

---

## 8. Safe-to-Defer Decisions

These remain unresolved but do not require Founder decision before
Contract drafting; each is deferrable to Contract-level scoping or
implementation, per the Contract-Blocker Test in Section 6:

- **Q2 — PI Core ↔ Memory interface.** A first Memory Contract may
  simply exclude any PI Core interaction as an explicit Non-Goal,
  exactly as Increment 004 excluded HTTP exposure.
- **Q5 (physical) — Persistence technology, tables, columns.**
  Downstream implementation/schema-design detail, decided at
  Contract/implementation time like every prior increment.
- **Q6 (technical) — Retrieval mechanism.** No source requires any
  specific mechanism (ID-scoped lookup, semantic search, ranking,
  embeddings); left entirely to Contract/implementation, with no
  AI/Agent/Digital-Twin justification used to invent one here.

These are explicitly **not** re-classified as resolved — they remain
open — but they are not Contract-readiness blockers and do not require
a Founder decision at this gate.

## 9. Anti-Duplication Protection

Resolving BND-01 in favor of Option A would make the anti-duplication
finding from Phase 10Q-B (§12: "partially separated," category A =
identity/traits fully owned by PI Core, category B = history/navigation
named but unbuilt) into a fully separated boundary, closing the one
open risk identified there. Resolving in favor of Option B would
require the eventual Contract to define the overlap precisely enough to
avoid re-deriving PI Core's already-solved provenance/confidence/
lifecycle mechanism for the same subject matter, per Q3/Q4's finding
that PI Core's code is closed and cannot be refactored into a shared
mechanism. Option C leaves the anti-duplication risk exactly as Phase
10Q-B reported it, unresolved but bounded (nothing exists yet in
category B to actually duplicate).

## 10. PI Core Preservation

`apps/api/src/core/personal-intelligence/`,
`apps/api/src/application/personal-intelligence/`, and
`apps/api/src/infrastructure/personal-intelligence/` (the last does not
currently exist) are untouched by this document. No claim type was
added. No lifecycle, provenance, or confidence semantics were changed.
No existing PI Core code was reinterpreted as Memory.

## 11. Goal OS Safety Verification

Goal OS = DEFERRED. Goal Readiness = UNDEFINED. Goal Contract = NOT
AUTHORIZED. Goal implementation = NOT AUTHORIZED. Nothing in this
document's evidence, blocker test, or proposed decision touches, relies
on, or reopens Goal OS in any way.

## 12. Actor≠Owner Safety Verification

Actor≠Owner = DEFERRED. Not resolved here. No access-control
architecture, shared-user, admin, or delegation semantics were
introduced. BND-01 is scoped strictly to subject-matter/ownership
boundary, not to access control.

## 13. Contract Readiness Determination

**NOT READY FOR CONTRACT DRAFTING** until BND-01 is resolved by the
Founder. This is a narrower and more precise restatement of Phase
10Q-B's "NOT READY" finding: exactly one blocker remains, not six.
Once BND-01 is resolved (any of Options A, B, or C), the readiness
determination must be re-evaluated in a subsequent phase — this
document does not pre-declare the outcome of that re-evaluation.

## 14. Founder Decision Record

**BND-01 — RESOLVED — OPTION BND-01-A.**

**Exact selected option:** `OPTION BND-01-A — MEMORY IS STRICTLY`
`OUTSIDE THE PI CORE CLAIM SUBJECT-MATTER.`

**Founder decision:** The Founder explicitly selected `OPTION BND-01-A`.

**Architectural meaning of this decision:**

- Personal Intelligence Core retains **exclusive** ownership of its
  existing, closed `claimType` subject-matter: `identity_attribute`,
  `value`, `preference`, `capability`, `constraint`,
  `environment_context`, `strength`, `weakness`, `behavior_pattern`.
- Memory Architecture is **strictly outside** those PI Core claim
  categories. Memory's subject matter is historical/event/decision/
  navigation records and other temporal experience records that fall
  outside PI Core claim semantics (consistent with FIS-045 "Personal
  Navigation Memory," the only concretely-named Memory subject matter
  identified in this governance sequence).
- Memory Architecture **must not** become a second owner of PI Core
  claim subject matter. This resolves, for this boundary only, the
  TD-02 §3.1/§3.16 ownership ambiguity identified in the prior Phase
  10Q and 10Q-B gates: PI Core's "maintain confidence and provenance"
  responsibility (§3.1) applies to PI Core's own claim subject matter
  only, and does not extend into or get superseded by Memory's separate
  provenance/confidence responsibility (§3.16) for Memory's own,
  disjoint subject matter.
- **No new PI Core `claimType` is authorized by this decision.**
- Existing PI Core implementation
  (`apps/api/src/core/personal-intelligence/`,
  `apps/api/src/application/personal-intelligence/`) is unaffected —
  not renamed, not reinterpreted, not modified.

**BND-01 status:** `RESOLVED — A`.

**Remaining open questions (unchanged, still deferred, not decided by
this record):** the Q2 (PI Core ↔ Memory interface), Q5-physical
(persistence technology), and Q6-technical (retrieval mechanism)
questions identified in Sections 5 and 8 above remain exactly as
reported there — open, safe-to-defer, and not resolved by this Founder
decision.

**Implementation authorization:** `NOT AUTHORIZED.`

**Contract authorization:** `NOT AUTHORIZED` (not separately granted by
this instruction).

**Goal OS remains DEFERRED. Goal Readiness remains UNDEFINED.
Actor≠Owner remains DEFERRED.** Option B (Memory = distinct system)
remains unchanged and is not reopened by this record.

## 15. Implementation Authorization

**NOT AUTHORIZED.**

## 16. Contract Authorization

**NOT AUTHORIZED.**

Memory: **DISTINCT SYSTEM — FOUNDER SELECTED.**
Memory boundary: **ONE BLOCKER REMAINING (BND-01) — FOUNDER DECISION
PENDING.**
Contract drafting: **NOT READY** (pending BND-01).
Memory Contract: **NOT AUTHORIZED.** Implementation: **NOT
AUTHORIZED.** Schema: **NOT AUTHORIZED.** Migration: **NOT
AUTHORIZED.** API: **NOT AUTHORIZED.** UI: **NOT AUTHORIZED.** PI Core
modification: **NOT AUTHORIZED.** Commit: **NOT AUTHORIZED.** Push:
**NOT AUTHORIZED.**

## 17. Files Modified

None. Only this single new file was created.

## 18. Commit Status

Not committed. File remains untracked.

## 19. Push Status

Not pushed.

## 20. Self-Audit

A. Option B unchanged — confirmed, Phase 10Q §18 not touched. B. No A/B reconsideration — confirmed, not revisited anywhere. C. Goal OS remains DEFERRED — confirmed. D. Goal Readiness remains UNDEFINED — confirmed. E. Actor≠Owner remains DEFERRED — confirmed. F. Existing PI Core untouched — confirmed, read-only. G. No Memory implementation performed — confirmed. H–K. No schema/migration/API/UI created — confirmed. L. No Contract created — confirmed. M. No interface designed — confirmed, Q2 explicitly deferred without design. N. No persistence design created — confirmed, Q5 physical explicitly deferred without design. O. No retrieval implementation designed — confirmed, Q6 technical explicitly deferred without design. P. No Memory semantics invented beyond what prior gates already cited from source documents. Q. No Founder decision inferred — confirmed; §14 records BND-01 as genuinely pending, not filled in. R. Minimum-decision principle followed — confirmed; exactly one decision (BND-01) proposed out of six original questions. S. Every proposed Founder decision is a genuine architectural blocker — confirmed via the explicit Contract-Blocker Test in §6, applied to all six questions individually. T. Safe-to-defer questions separated — §8. U. Tier-3 evidence not promoted to authority — confirmed throughout. V. UNKNOWN preserved where appropriate — Q2/Q5(physical)/Q6(technical) remain open, not resolved. W. Only this one allowlisted governance artifact created. X. Git baseline unchanged except for this new untracked file (verified below). Y. No unrelated file changed.

## 21. Hard Stop

This document is the complete deliverable for Phase 10Q-C. No Founder
decision was recorded. No Contract, interface design, schema,
migration, API, UI, PI Core modification, Goal OS reopening, or
Actor≠Owner reopening follows. This file has not been staged,
committed, or pushed.
