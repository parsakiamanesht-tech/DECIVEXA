# PHASE 10Q-B — MEMORY DISTINCT SYSTEM BOUNDARY RESOLUTION

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
own gate sequence — not the current repository state. This document's
six-question resolution matrix (§15) and its "NOT READY FOR CONTRACT
DRAFTING" conclusion (§18) describe the state of evidence available at
that time; both were superseded by subsequent gates in this sequence
and, ultimately, by real shipped implementation. This reconciliation
does not fabricate or reconstruct the missing authorization record and
does not authorize any new implementation. The current shipped Memory
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
  plus the untracked Phase 10Q gate document. No discrepancy found; no
  STOP condition triggered.

## 2. Founder Authority

`docs/gates/PHASE_10Q_PERSONAL_INTELLIGENCE_MEMORY_BOUNDARY_FOUNDER_DECISION_GATE.md`
§18 was read directly from disk and confirmed to record, verbatim:

> **Selected option:** `OPTION B — MEMORY AS A DISTINCT SYSTEM`

This decision is treated as authoritative for direction only — Memory
Architecture is a distinct system from Personal Intelligence Core — and
is not altered, replaced, or reinterpreted here. The following remain
exactly as recorded there and are restated, not modified, throughout
this document: Goal OS = DEFERRED; Goal Readiness = UNDEFINED; Goal
Contract = NOT AUTHORIZED; Actor≠Owner = DEFERRED; Memory implementation
= NOT AUTHORIZED.

## 3. Authority Hierarchy

- **TIER 1** (authoritative): `ARCHITECTURE_FREEZE_BASELINE.md`,
  `FOUNDER_APPROVAL_RECORD_ARCH_TD08.md`,
  `TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md`,
  `TD-07_RE_REVIEW.md`, the closed Increment 004 record, Phase 10P, and
  Phase 10Q §18 itself (as the Founder's direction decision).
- **TIER 2** (approved technical constraints): `TD-08` and related gates.
- **TIER 3** (conceptual, self-declared non-authorizing):
  `TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md`,
  `DECIVEXA-CANONICAL-SYSTEM-MAP.md`, `DECIVEXA-CANONICAL-BASELINE.md`,
  `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`, `FOUNDATION.md`,
  `FIS-REGISTRY.md`, `TD-04-human-os-personal-intelligence-core.md`,
  `TD-07-MEMORY-PROVENANCE.md`, `TD-03-STATE-EVENT-CONSISTENCY.md`.
- **TIER 4** (existing implementation evidence): PI Core code
  (`core/personal-intelligence/`, `application/personal-intelligence/`),
  Evidence code (`core/evidence/`, `application/evidence/`).
- **TIER 5** (inference): not used as architecture authority anywhere in
  this document; used only to label the residual gaps as UNKNOWN.

## 4. Existing PI Core Evidence

[EVIDENCE] `PersonalIntelligenceClaim { id, userId, claimType,
createdAt, updatedAt }`; `PersonalIntelligenceClaimVersion { id,
claimId, version, userId, valueKind, valueText, provenance, confidence,
lifecycle, evidenceVersionId, observedAt, acceptedAt, createdAt }`.
`claimType` ∈ `identity_attribute | value | preference | capability |
constraint | environment_context | strength | weakness |
behavior_pattern`. `provenance` ∈ `declared | observed`. `lifecycle` ∈
`active | superseded | corrected | revoked | disputed`.

[EVIDENCE] Use-case methods: `create`, `appendCorrection`,
`findClaimForUser`, `findClaimVersionForUser`,
`findActiveClaimVersionsForUser` — all raw-`userId`-scoped, no
`RequestContext`.

[EVIDENCE] `evidenceVersionId: string | null` exists on
`PersonalIntelligenceClaimVersion` but is a bare, optional, unvalidated
reference — no code anywhere joins, dereferences, or enforces it against
the Evidence repository. It is declared and tested as an allowed-null
field only (`personal-intelligence-claim.model.spec.ts`: "allows a
missing EvidenceVersion reference without manufacturing a value").

[EVIDENCE] The Evidence domain (`core/evidence/evidence.model.ts`,
`application/evidence/evidence.use-case.ts`, closed, implemented)
independently declares its own, separately-named provenance/lifecycle
shape: `EvidenceProvenance` (`declared | observed | measured`),
`EvidenceLifecycle` (`active | superseded | corrected | revoked |
disputed`), plus `confidence: number | null`, `observedAt`, `acceptedAt`
on `EvidenceVersion`. This is structurally near-identical to
`PersonalIntelligenceClaimVersion`'s shape but is a **separate,
independently-declared type** — no shared base type, interface, or
common mechanism connects `EvidenceProvenance`/`EvidenceLifecycle` to
`PersonalIntelligenceProvenance`/`PersonalIntelligenceLifecycle`
anywhere in the codebase.

[EVIDENCE] Evidence's use-case methods (`get`, `getVersion`, `create`,
`appendLifecycleVersion`) are ID-scoped lookups, using `RequestContext`
(unlike PI Core, which still uses raw `userId`) — confirming the
established live pattern for identity but not changing the retrieval
shape: still ID-scoped, not general/semantic.

[INTERPRETATION] The repository's actual precedent for "a
provenance/confidence/lifecycle mechanism used in two places" is
**independent, parallel re-declaration of the same shape**, not a
shared, reusable, cross-cutting interface or base type. This is direct
code-level evidence bearing on Question 4 below.

## 5. Memory Architecture Evidence

Carried forward unchanged from the Phase 10Q boundary gate (re-verified,
no new source found this phase):

| Source | Authority | Statement |
|---|---|---|
| TD-02 §3.16 | Tier 3 | Memory owns "durable personal memory lifecycle and provenance": memory storage abstraction, memory retrieval, provenance, source/date/confidence metadata, user-confirmed vs inferred status, sensitivity, verification/review status, expiration, correction and deletion. |
| TD-02 §3.1 | Tier 3 | PI Core's own responsibilities include "maintain confidence and provenance" — the same term §3.16 assigns to Memory, unreconciled. |
| `DECIVEXA-CANONICAL-SYSTEM-MAP.md` §4/§9 | Tier 3 | "Memory System" is a peer entry to "Human OS / Personal Intelligence Core," with its own Data Ownership row: "memory objects/provenance/lifecycle." |
| `TD-04-human-os` §21 | Tier 3, no implementation authorization | Lists "Memory Architecture" as a primary dependency of PIC — external to it. |
| `TD-07-MEMORY-PROVENANCE.md` | Tier 3, "Proposed technical contract" | Generic provenance/poisoning-protection contract for "memory/intelligence records," terms used interchangeably. |
| Master vision §24/§30/§10.10 | Tier 3 | Memory listed as a cross-cutting layer alongside Security & Privacy, Evidence & Auditability, Agent Governance. |
| FIS-045 | Tier 3 | "Personal Navigation Memory — remember historical navigation patterns and surface relevant lessons." Subject matter: navigation/decision history. |
| `TD-03-STATE-EVENT-CONSISTENCY.md` | Tier 3 | "Accepted domain events MUST be immutable... history is never overwritten"; "AI cannot rewrite history" — general event/history principles, not specific to Memory or PI Core, and not naming either as the owner. |

No new Memory category is added beyond what these sources already
state.

## 6. Ownership Boundary Analysis (Question 1)

[EVIDENCE] PI Core owns, per TD-02 §3.1 and the implemented
`claimType` enum: identity_attribute, value, preference, capability,
constraint, environment_context, strength, weakness, behavior_pattern —
i.e., claims about **who the user is**.

[EVIDENCE] Memory is described (TD-02 §3.16, FIS-045) as owning
durable memory objects generally, and specifically "historical
navigation patterns" — i.e., **what happened / what was navigated /
decided**, a different subject matter on its face.

[UNKNOWN] Whether Memory's scope is limited to navigation/decision
history (the only concretely-named subject matter, via FIS-045), or
extends to a broader class of "memory objects" as TD-02 §3.16's generic
wording could imply. No source enumerates a bounded set of Memory
object types analogous to PI Core's `claimType` enum.

[UNKNOWN] Whether "provenance" and "confidence," which TD-02 assigns to
both PI Core (§3.1) and Memory (§3.16), are two independently-owned
instances of the same concept (mirroring the actual PI Core / Evidence
precedent found in §4 above) or a single concept one of the two systems
should own and the other consume.

**Resolved boundary (subject matter only):** identity/trait/preference/
capability claims → PI Core. Navigation/decision history → Memory. This
narrow slice is evidence-supported. Anything broader is UNKNOWN.

## 7. PI Core ↔ Memory Interface Analysis (Question 2)

[EVIDENCE] A repository-wide search for any specification of PI Core →
Memory, Memory → PI Core, memory ingestion, memory retrieval,
claim-to-memory, memory-to-claim, or shared-context interfaces returns
no result in any document or code file.

[EVIDENCE] The one existing cross-domain reference in this area
(`PersonalIntelligenceClaimVersion.evidenceVersionId`, linking PI Core
to Evidence) is a bare, optional, unvalidated ID field with no
dereferencing code anywhere — the closest existing precedent for a
cross-domain reference in this repository, and it is minimal.

**INTERFACE = UNDEFINED / NOT YET SPECIFIED.** No interface is proposed
here. The `evidenceVersionId` pattern is reported only as existing
precedent evidence, not as a design recommendation.

## 8. Provenance / Confidence Analysis (Question 3)

Testing the four analytical alternatives against evidence only:

- **A. PI Core owns provenance/confidence for PI claims; Memory owns it
  for memory objects (independent, parallel).** [EVIDENCE] This is
  exactly the pattern already used between PI Core and Evidence today —
  two independently-declared provenance/lifecycle shapes, no shared
  mechanism. This is the only alternative with a direct implementation
  precedent in the repository.
- **B. A shared cross-cutting provenance/confidence mechanism exists.**
  [EVIDENCE] No shared type, interface, or base class exists anywhere
  in the codebase for provenance/confidence/lifecycle; `EvidenceProvenance`
  and `PersonalIntelligenceProvenance` are separately declared. No
  document defines such a mechanism either. Not supported by evidence.
- **C. One system owns the mechanism while the other consumes it.** No
  document or code states this, and no direction of ownership
  (PI-owns/Memory-consumes vs. Memory-owns/PI-consumes) is evidenced
  either way.
- **D. Evidence insufficient.** Partially true at the level of Memory
  specifically (TD-02 §3.1/§3.16 remain textually unreconciled), but the
  Evidence/PI Core precedent (Alternative A) is the only alternative
  with actual repository support.

**Result:** No document resolves the TD-02 §3.1/§3.16 conflict directly.
However, existing implementation evidence (§4, §8-A) makes Alternative
A — independent, parallel ownership, mirroring the Evidence/PI Core
precedent — the only evidence-grounded reading; this is reported as the
strongest available interpretation, not as a resolved architectural
decision, since no document explicitly commits to it for Memory.

## 9. Shared vs Independent Mechanism Analysis (Question 4)

[EVIDENCE] The repository's only actual precedent for two
domains each needing provenance/confidence/lifecycle (PI Core and
Evidence) is independent, parallel re-declaration — not a shared
mechanism, not reuse of a common interface, and not PI Core consuming
Evidence's types or vice versa.

[INTERPRETATION] If Memory follows the same precedent, it would
independently declare its own provenance/confidence/lifecycle shape
rather than sharing PI Core's. This is reported as the pattern already
established twice in this repository, not as a decision for Memory.

[UNKNOWN] Whether Memory *should* deviate from this precedent and
instead reuse PI Core's (or Evidence's) existing lifecycle/version
pattern directly. No document evaluates or decides this question for
Memory specifically. Not decided here.

## 10. Persistence Analysis (Question 5)

[EVIDENCE] No document — Tier 1, 2, or 3 — specifies Memory's
persistence: no table name, no entity, no column, no repository
interface, no event store, no vector/embedding store, no search index.

[EVIDENCE] The existing precedent (PI Core, Evidence) is a relational
persistence model (Postgres, per `TD-09`'s "PostgreSQL remains
authoritative for durable domain state") reached through Drizzle schema
+ repository interface + repository implementation, each domain owning
its own tables.

**PERSISTENCE MODEL = UNDEFINED.** No table, entity, column, or storage
technology is invented or proposed here for Memory.

## 11. Retrieval Analysis (Question 6)

[EVIDENCE] Existing PI Core retrieval: `findClaimForUser`,
`findClaimVersionForUser`, `findActiveClaimVersionsForUser` — ID/user-
scoped lookup only.

[EVIDENCE] Existing Evidence retrieval: `get`, `getVersion` — ID-scoped
lookup only, same pattern.

[EVIDENCE] TD-02 §3.16 describes Memory's retrieval responsibility only
as "memory retrieval" — no further specification of ranking, semantic
search, contextual recall, or embeddings anywhere in any document.

**RETRIEVAL CONTRACT = UNDEFINED.** The only concrete precedent in the
repository (ID-scoped lookup) is reported as existing evidence, not
proposed as Memory's retrieval design. No embeddings, vector search, or
LLM-based retrieval is evidenced or introduced.

## 12. Anti-Duplication Analysis

Testing whether the repository currently separates "what is true/known/
inferred about the user" (A) from "what happened / was experienced /
decided / historical context" (B):

[EVIDENCE] PI Core's `claimType` enum (identity/value/preference/
capability/constraint/environment/strength/weakness/behavior_pattern) is
entirely within category A.

[EVIDENCE] Neither PI Core nor Evidence currently models category B
(navigation/decision/event history) — Evidence's model tracks
provenance/confidence/lifecycle for arbitrary evidence records but has
no navigation/decision-history-specific fields either; it is a generic
fact/observation ledger, not a navigation-history ledger.

[EVIDENCE] FIS-045 is the only source naming category B explicitly
("Personal Navigation Memory"), and nothing implements it.

**Result: PARTIALLY SEPARATED.** Category A (identity/traits) is
clearly and exclusively owned by PI Core today. Category B (history/
navigation/decisions) is named conceptually but owned by nothing —
neither duplicated nor built. The risk of "two competing
user-understanding systems" is therefore currently **low in practice**
(nothing exists yet in category B to compete), but **structurally
unaddressed** (no document defines how category B's future
implementation would avoid re-deriving category A's already-solved
provenance/confidence/lifecycle problem independently, per the
Evidence/PI Core precedent in §4/§9).

## 13. Goal OS Safety Verification

Goal OS = DEFERRED. Goal Readiness = UNDEFINED. No Goal Contract exists.
No Goal lifecycle is designed here. No Goal implementation is
authorized. `TD-04-human-os` §21 lists Goal OS as a PIC dependency, and
`TD-04-human-os` §12 states "Goal OS provides goal intent and goal
context. PIC provides the human context needed to determine whether the
goal is ready..." — both are reported here only as existing conceptual
evidence, consistent with the prior Phase 10P/10Q findings; neither
statement is acted on, and Goal OS's DEFERRED status is unchanged.

## 14. Actor≠Owner Safety Verification

Actor≠Owner = DEFERRED, unchanged. Memory's eventual persistence and
access requirements are not used here to reopen it. `TD-04-human-os`
§16 ("Access must follow: Requester → Purpose → Required Context →
Authorization Policy → Minimum Necessary Data → Auditable Access") is
reported as existing conceptual evidence relevant to a *future* Memory
access design, exactly as it was already reported for PI Core in
Increment 004's Contract §E — it is not acted on here, and Actor≠Owner
remains DEFERRED with no new consumer or dependency created.

## 15. Six-Question Resolution Matrix

| Question | Evidence | Authority | Resolved? | Current boundary | What remains UNKNOWN |
|---|---|---|---|---|---|
| 1. Ownership boundary | TD-02 §3.1/§3.16, `claimType` enum, FIS-045 | Tier 3 + Tier 4 | PARTIALLY | Identity/trait claims → PI Core; navigation/decision history → Memory (subject-matter slice only) | Full extent of "memory objects" beyond navigation/decision history; TD-02's provenance/confidence double-assignment |
| 2. PI Core ↔ Memory interface | Full-repo search, `evidenceVersionId` precedent | Tier 3 + Tier 4 | NO | None defined | Entire interface — undefined |
| 3. Provenance/confidence ownership | TD-02 §3.1/§3.16; Evidence/PI Core precedent | Tier 3 + Tier 4 | PARTIALLY | Independent/parallel ownership is the only evidence-grounded reading (Alternative A) | Whether Memory should follow this precedent or something else; no explicit document commitment |
| 4. Shared vs. independent mechanism | Evidence/PI Core precedent | Tier 4 | PARTIALLY | Independent re-declaration is the established repository pattern | Whether Memory should deviate from this precedent |
| 5. Persistence ownership | Full-repo search | Tier 1/2/3 | NO | None defined | Entire persistence model — undefined |
| 6. Retrieval responsibility | TD-02 §3.16; PI Core/Evidence retrieval methods | Tier 3 + Tier 4 | NO | Existing precedent is ID-scoped lookup only; Memory's described "retrieval" is broader and unspecified | Entire retrieval contract — undefined |

## 16. Resolved Boundary

- Memory is distinct from Personal Intelligence Core, per the Founder's
  explicit Phase 10Q Option B selection.
- Personal Intelligence Core retains its existing, unmodified claim/
  version responsibility exactly as implemented and closed.
- Memory's distinct subject matter includes, at minimum, navigation/
  decision history (FIS-045) — the only concretely-evidenced category
  that does not overlap PI Core's `claimType` enum.
- The repository's own precedent (Evidence vs. PI Core) is independent,
  parallel provenance/confidence/lifecycle ownership rather than a
  shared mechanism — reported as existing pattern evidence, not as a
  design decision for Memory.
- The PI Core ↔ Memory interface remains undefined.
- Memory's persistence model remains undefined.
- Memory's retrieval contract remains undefined.

No implementation design is contained in this section.

## 17. Remaining UNKNOWNs

- Ownership granularity: the full boundary of "memory objects" beyond
  navigation/decision history.
- PI Core ↔ Memory interface: entirely undefined.
- Provenance/confidence mechanism ownership: no explicit document
  commitment for Memory (only an inferred-from-precedent reading).
- Lifecycle mechanism relationship: whether Memory's lifecycle states
  mirror PI Core's/Evidence's `active|superseded|corrected|revoked|disputed`
  set or differ.
- Persistence model: entirely undefined.
- Retrieval contract: entirely undefined (ranking, semantic search,
  contextual recall — none evidenced).
- Evidence linkage: whether Memory relates to the existing Evidence
  domain the way PI Core's `evidenceVersionId` loosely does, or
  differently.
- Sensitivity model: named in TD-04 §4 and master vision §10.10 as a
  memory-metadata field, not implemented or specified anywhere.
- Verification/review model: named in TD-04 §4 (`last_verified_at`) and
  TD-07-MEMORY-PROVENANCE, not implemented or specified anywhere.
- Digital Twin (FIS-056) relationship to Memory: no source defines it.

## 18. Governance Consequences

**NOT READY FOR CONTRACT DRAFTING.**

Three of the six questions (interface, persistence, retrieval) are
entirely undefined, and a fourth (ownership granularity) is only
partially resolved. Per the conservative default required by this
phase's governing instruction, and consistent with Increment 004's own
Contract requiring an explicit, evidenced scope before drafting, this
boundary is not yet mature enough to support an Increment Contract.

## 19. Implementation Authorization Status

**NOT AUTHORIZED.**

## 20. Contract Authorization Status

**NOT AUTHORIZED.**

Memory Architecture: **DISTINCT SYSTEM — FOUNDER SELECTED.**
Implementation: **NOT AUTHORIZED.** Contract: **NOT AUTHORIZED.**
Schema: **NOT AUTHORIZED.** Migration: **NOT AUTHORIZED.** API: **NOT
AUTHORIZED.** UI: **NOT AUTHORIZED.** PI Core modification: **NOT
AUTHORIZED.** Goal OS: **DEFERRED.** Goal Readiness: **UNDEFINED.**
Actor≠Owner: **DEFERRED.**

## 21. Files Modified

None. Only this single new file was created.

## 22. Commit Status

Not committed. File remains untracked.

## 23. Push Status

Not pushed.

## 24. Self-Audit

A. Founder Option B preserved exactly — confirmed, Phase 10Q §18 not touched. B. Goal OS not reopened — confirmed. C. Goal Readiness not defined — confirmed. D. Actor≠Owner not reopened — confirmed. E. Existing PI implementation untouched — confirmed, read-only. F–I. No schema/migration/API/UI created — confirmed. J. No Contract created — confirmed. K. No interface invented — confirmed; §7 reports absence only. L. No persistence model invented — confirmed; §10 reports absence only. M. No retrieval model invented — confirmed; §11 reports absence only. N. No Memory semantics invented beyond what §5/§6 cite from source documents. O. Evidence and interpretation kept separated throughout (tagged inline). P. Tier-3 conceptual documents not promoted to authority — confirmed throughout. Q. UNKNOWN preserved wherever evidence was insufficient (§6, §7, §9, §10, §11, §17). R. No implementation authorization implied — confirmed, §19/§20 explicit. S. Only this one allowlisted governance artifact created. T. Git baseline unchanged except for this new untracked file (verified below). U. No unrelated file modified.

## 25. Hard Stop

This document is the complete deliverable for Phase 10Q-B. No Contract,
interface design, schema, migration, API, UI, PI Core modification,
Goal OS reopening, or Actor≠Owner reopening follows. This file has not
been staged, committed, or pushed.
