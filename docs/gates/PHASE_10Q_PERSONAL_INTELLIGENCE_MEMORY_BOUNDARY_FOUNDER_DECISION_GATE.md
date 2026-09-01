# PHASE 10Q — Personal Intelligence / Memory Architectural Boundary
# Founder Decision Gate

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
own gate sequence — not the current repository state. Option B (Memory
as a distinct system), selected at §18 below, is preserved as the
historical decision this document recorded; it is consistent with,
though not independently proven as the cause of, the distinct-system
shape Memory was ultimately built with. This reconciliation does not
fabricate or reconstruct the missing authorization record, does not
upgrade this document's own decision language into independently
corroborated repository authority, and does not authorize any new
implementation. The current shipped Memory implementation must be
established from the actual committed source and commit history, not
inferred from this document.

## 1. Baseline

- Branch: `main`
- HEAD at preparation time: `3cacf777c7a88c02624462a43ff822cff4cbda28`
- origin/main at preparation time: `3cacf777c7a88c02624462a43ff822cff4cbda28`
- HEAD == origin/main: confirmed
- No tracked or staged modifications existed prior to this document's
  creation. Only routine build/dependency noise
  (`apps/api/dist/`, `apps/api/node_modules/`, `apps/api/package-lock.json`)
  was present.

## 2. Purpose

This document exists solely to prepare a Founder decision on one narrow
architectural question: what is the relationship between the
already-implemented Personal Intelligence Core and the unimplemented
"Memory Architecture" concept named across DECIVEXA's conceptual
documents. It does not select a model, does not implement Memory, does
not authorize a Contract, and does not modify existing Personal
Intelligence implementation. It consolidates the evidence and boundary
options developed across the two prior read-only boundary gates in this
governance sequence into a single, stable artifact the Founder can
decide against.

## 3. Authority Classification

**Tier 1/2 (authoritative/approved):** `ARCHITECTURE_FREEZE_BASELINE.md`,
`FOUNDER_APPROVAL_RECORD_ARCH_TD08.md`,
`TD-09_IMPLEMENTATION_READINESS_BUILD_AUTHORIZATION.md`,
`TD-07_RE_REVIEW.md`, closed `IMPLEMENTATION_INCREMENT_004_CONTRACT.md`
and its Closure Record, `PHASE_10P_GOAL_READINESS_FOUNDER_DECISION_GATE.md`.
None of these sources defines the PI Core / Memory relationship; they
name "Personal Intelligence Core" and "Memory Architecture" as separate
line items in the Architecture Freeze Baseline Scope list only.

**Tier 3 (conceptual, self-declared non-authorizing for implementation):**
`docs/technical-design/TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md` §3.1,
§3.16, §4, §9; `docs/DECIVEXA-CANONICAL-SYSTEM-MAP.md` §4, §9;
`docs/DECIVEXA-CANONICAL-BASELINE.md`;
`docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md` §10.10, §24, §30;
`docs/FOUNDATION.md`; `docs/FIS-REGISTRY.md` (FIS-045);
`docs/architecture/TD-04-human-os-personal-intelligence-core.md`
(self-declared "DESIGN / FOUNDER GATE REQUIRED... Scope: Architecture
definition only — no implementation authorization");
`docs/technical-design/TD-07-MEMORY-PROVENANCE.md` (self-declared
"Proposed technical contract").

No document in this list is promoted in authority by this record. This
hierarchy is carried forward unchanged from the two prior boundary gates
in this sequence.

## 4. Existing PI Implementation Evidence

[EVIDENCE] `apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts`
defines `PersonalIntelligenceClaim` (`id, userId, claimType, createdAt,
updatedAt`) and `PersonalIntelligenceClaimVersion` (`id, claimId,
version, userId, valueKind, valueText, provenance, confidence,
lifecycle, evidenceVersionId, observedAt, acceptedAt, createdAt`).
`claimType` is one of `identity_attribute | value | preference |
capability | constraint | environment_context | strength | weakness |
behavior_pattern`. `provenance` is `declared | observed`. `lifecycle`
is `active | superseded | corrected | revoked | disputed`.

[EVIDENCE] The use-case (`personal-intelligence-claim.use-case.ts`)
exposes `create`, `appendCorrection`, `findClaimForUser`,
`findClaimVersionForUser`, `findActiveClaimVersionsForUser` — all
ownership-scoped lookups.

[EVIDENCE] A repository-wide search for `memory|retriev|recall` inside
`core/personal-intelligence/` and `application/personal-intelligence/`
returns zero matches.

[INTERPRETATION] Already implemented: a versioned lifecycle with
provenance, confidence, and correction/supersession/revocation/dispute
states — for claims about who the user is (identity/values/preferences/
capabilities/behavior patterns), scoped to the `claimType` enum above.

[EVIDENCE] Explicitly not implemented: any navigation/event/decision
history concept — the `claimType` enum contains no such category.

[INTERPRETATION] The existing implementation does not use the word
"memory" anywhere and does not describe itself as a memory system. It
was built, tested, and closed (Increment 004 Closure Record) as a
Personal Intelligence claim model only. This record does not rename or
reinterpret that existing functionality.

[INTERPRETATION] The existing retrieval capability is narrow
(ownership-scoped ID/user lookups only); it does not constitute the
general "memory retrieval" capability TD-02 §3.16 describes.

## 5. Memory Evidence

| Source | Authority | Statement |
|---|---|---|
| TD-02 §3.16 | Tier 3 | "Ownership: Durable personal memory lifecycle and provenance." Responsibilities: memory storage abstraction, memory retrieval, provenance, source/date/confidence metadata, user-confirmed vs inferred status, sensitivity, verification/review status, expiration, correction and deletion. |
| TD-02 §3.1 (same document) | Tier 3 | Personal Intelligence Core's own responsibilities include "maintain confidence and provenance" — the same term §3.16 assigns to Memory, unreconciled. |
| `DECIVEXA-CANONICAL-SYSTEM-MAP.md` §4 | Tier 3 | "Memory System" is its own peer entry, separate from "Human OS / Personal Intelligence Core." |
| `DECIVEXA-CANONICAL-SYSTEM-MAP.md` §9 | Tier 3 | Two separate Data Ownership rows: "Human / Personal Model" owns "living human model state and evidence-backed personal hypotheses"; "Memory" owns "memory objects/provenance/lifecycle." |
| `TD-04-human-os-personal-intelligence-core.md` §21 | Tier 3, no implementation authorization | Lists "Memory Architecture" as a primary **dependency of** PIC, alongside Goal OS, Daily OS, Evidence Platform, Growth Navigation, Progress Intelligence, DECIVEXA AI/AI Gateway — something PIC depends on, not a part of PIC. |
| `TD-07-MEMORY-PROVENANCE.md` | Tier 3, "Proposed technical contract" | Defines a generic provenance/poisoning-protection contract for "memory/intelligence records," using the two terms interchangeably. |
| `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md` §24, §30, §10.10 | Tier 3 | "Memory Architecture" listed as a "supporting cross-cutting layer" alongside Security & Privacy (FIS-058), Fluid Performance (FIS-059), AI Independence (FIS-060), Evidence & Auditability, Resource/Constraint Intelligence, Agent Governance — the same structural level as Evidence, which is already implemented separately from PI Core. |
| `FIS-REGISTRY.md` / `DECIVEXA-CANONICAL-BASELINE.md` FIS-045 | Tier 3 | "Personal Navigation Memory — remember the user's historical navigation patterns and surface relevant lessons." Subject matter: navigation/decision history, distinct from PI Core's identity/trait/preference claim types. |

## 6. Responsibility Ownership Matrix

| Responsibility | Source | Already implemented? | Current owner | Evidence strength |
|---|---|---|---|---|
| Provenance (declared/observed) | TD-02 §3.1 AND §3.16 | YES (`provenance` field) | PI Core (built); Memory (conceived) | MEDIUM — contested, same term two owners |
| Confidence | TD-02 §3.1 AND §3.16; TD-04 §7; master vision §24 | YES (`confidence` field) | PI Core (built); Memory (conceived) | MEDIUM — contested |
| User-confirmed vs inferred | TD-04 §4; TD-07-MEMORY-PROVENANCE; master vision §10.10 | PARTIAL — `provenance: declared\|observed` approximates it | PI Core (approximate, built); Memory (conceived) | MEDIUM |
| Verification/review status | TD-04 §4; TD-07-MEMORY-PROVENANCE | NO | neither | LOW |
| Correction/deletion | TD-02 §3.16; existing `appendCorrection`/`lifecycle` | YES | PI Core (built) | HIGH |
| Historical/navigation state | FIS-045; TD-02 §4 navigation loop | NO | Memory (conceived only) — no PI `claimType` covers it | MEDIUM (subject-matter distinct) |
| General/semantic retrieval | TD-02 §3.16 | NO (only narrow ID-scoped lookups exist) | neither | LOW |
| Sensitivity classification | TD-04 §4; master vision §10.10 | NO | neither | LOW |
| Digital Twin support | FIS-056 | NO | undetermined — depends on this boundary | UNKNOWN |

## 7. Boundary Comparison — Seven-Question Test

1. **Subject matter.** PI Core's `claimType` enum concerns identity/value/
   preference/capability/constraint/environment/strength/weakness/
   behavior-pattern claims. FIS-045 ("Personal Navigation Memory")
   concerns navigation/decision history. These are different subject
   matters on their face; no source unifies them under one claim
   taxonomy.
2. **Ownership.** Provenance, confidence, and lifecycle/correction are
   explicitly assigned to PI Core (§3.1, built) and separately, in the
   same document, to Memory (§3.16, unbuilt) — unreconciled. Historical/
   navigation state and general retrieval are assigned to Memory only,
   with no PI Core claim.
3. **Duplication.** If Memory is built independently reusing its own
   provenance/confidence/lifecycle mechanism, it would substantially
   re-derive a pattern already closed and tested in PI Core. No source
   defines a shared mechanism between the two.
4. **Interface.** No source — Tier 1/2 or Tier 3 — defines a PI Core ↔
   Memory interface, call contract, or data-exchange shape. This absence
   is recorded, not filled.
5. **Persistence.** No source defines separate storage, shared storage,
   an extension of PI's existing tables, or a wrapper/facade
   relationship. None is invented here.
6. **Retrieval.** PI Core's existing retrieval is ownership-scoped
   entity lookup only (`findClaimForUser`, `findClaimVersionForUser`,
   `findActiveClaimVersionsForUser`). TD-02 §3.16 describes a more
   general "memory retrieval" capability. These are not the same
   capability; PI Core does not already provide what Memory is
   described as owning.
7. **Long-term architecture.** Personal AI Coach, Digital Twin (FIS-056),
   Context Fusion, Growth Navigation, Progress Intelligence, future
   Agent Architecture, and Evidence/Auditability are each named in
   conceptual documents as consumers of Memory and/or PI Core, but no
   source states a dependency strong enough to prefer one boundary model
   over the other. All rated **UNKNOWN**, not inferred.

## 8. Model A — Memory as Extension of Personal Intelligence Core

- Supporting evidence: TD-02 §3.1 already assigns "maintain confidence
  and provenance" to PI Core; the mechanism (provenance/confidence/
  lifecycle) is already built there; TD-04 §4–§5's Evidence/Temporal
  Model describes PI Core itself preserving change over time with
  source/confidence/verification metadata — largely the same shape
  TD-02 §3.16 describes for Memory.
- Contradicting evidence: TD-02 §4/§9, TD-04 §21, and master vision
  §24/§30 all consistently list Memory as a **separate** peer system/
  dependency, never as a PI Core sub-component; FIS-045's subject
  matter (navigation history) falls outside PI Core's stated
  `claimType` scope.
- What would remain inside PI Core: identity/value/preference/
  capability claims (as today).
- What Memory would add: navigation/event/decision history, and
  possibly a shared retrieval interface.
- Reconciliation without invention: possible for the *provenance/
  confidence pattern* (already built), not clearly possible for the
  *navigation/history subject matter* (not represented by any existing
  `claimType`) without inventing a new claim category — which this
  document does not do.
- Preserves continuity: yes — no new module boundary, reuses closed
  work directly.
- Avoids duplicate claim/version semantics: yes, by construction.
- Preserves future Digital Twin/AI capabilities: UNKNOWN.

## 9. Model B — Memory as Distinct System

- Supporting evidence: consistent, repeated, independent listing as a
  peer/dependency across TD-02 (§4, §9), TD-04-human-os §21, master
  vision (§24, §30), FOUNDATION.md — four independent conceptual
  sources agree Memory is not nested under PI Core.
- Contradicting evidence: TD-02 §3.1's "maintain confidence and
  provenance" assignment to PI Core is not reconciled against §3.16;
  no interface is defined anywhere.
- Explicit ownership separation: partial — §9's Data Ownership table
  gives Memory its own row, but the §3.1/§3.16 provenance overlap
  remains unresolved.
- Responsibilities not reasonably owned by PI Core: navigation/history
  (FIS-045) — plausibly outside PI Core's stated identity/trait scope.
- Reconciliation without invention: **not possible** — an explicit PI
  Core ↔ Memory interface would have to be invented, which this
  document does not do.
- Risk: a second, independently-built provenance/confidence/lifecycle
  mechanism, with no reconciling contract to the one already closed in
  PI Core.

## 10. Model C — Insufficient Evidence

Tested directly against the Decision Rule (Section 7 of the governing
instruction for this phase): ownership is stated as separate in four
documents, **but the same document (TD-02) assigns the specific
responsibility "provenance"/"confidence" to both sections without
reconciling them.** No document anywhere defines an interface between
PI Core and Memory. No document defines the persistence relationship.
Existing implementation does not resolve this — it was built and closed
under the name "Personal Intelligence Core," never described as, and
not reinterpreted here as, a Memory implementation.

Per the governing decision rule: Model A requires reconciling the
separate-system framing without invention (not possible — the
navigation/history subject matter has no home in PI Core today without
inventing one). Model B requires defining the PI Core ↔ Memory
interface without invention (not possible — no source defines it).
**Both conditions fail, so Model C is the only rule-compliant
selection.**

## 11. Duplication Analysis

| Capability | PI Core | Memory | Overlap |
|---|---|---|---|
| Provenance | Owns (built) | Claims to own (conceptual) | YES, contested |
| Confidence | Owns (built) | Claims to own (conceptual) | YES, contested |
| Correction/lifecycle | Owns (built) | Claims to own (conceptual) | YES, contested |
| Identity/trait/preference claims | Owns (built) | Not claimed | NO overlap |
| Navigation/decision history | Not owned (no `claimType` covers it) | Claimed (FIS-045) | NO overlap — distinct subject matter |
| General retrieval/recall interface | Narrow, ID-scoped only | Claimed, general | Partial — different maturity |

Duplication risk if Memory is built as a wholly independent system
reusing its own provenance/confidence/lifecycle mechanism: **MEDIUM-HIGH**
(pattern re-invention risk). Duplication risk on subject matter
(identity claims vs. navigation history) specifically: **LOW** (these
appear to be genuinely different data).

## 12. Interface Analysis

No source — Tier 1, Tier 2, or Tier 3 — defines a PI Core ↔ Memory
interface, call contract, event shape, or data-exchange mechanism. This
absence is total across every document inspected in this and the prior
boundary gate. No interface is invented by this record.

## 13. Persistence Analysis

No source defines whether Memory would use separate storage, shared
storage, an extension of PI's existing `personal_intelligence_claim`/
`personal_intelligence_claim_version` tables, or a wrapper/facade over
them. No persistence relationship is invented by this record.

## 14. Retrieval Analysis

PI Core's existing retrieval (`findClaimForUser`,
`findClaimVersionForUser`, `findActiveClaimVersionsForUser`) is strictly
ownership-scoped entity lookup by ID. TD-02 §3.16 describes a broader
"memory retrieval" responsibility with no further specification. These
are not the same capability, and PI Core's existing retrieval does not
already satisfy what Memory is conceptually described as owning.

## 15. Long-Term Architecture Analysis

| Downstream capability | Impact of A | Impact of B |
|---|---|---|
| Personal AI Coach | UNKNOWN | UNKNOWN |
| Digital Twin (FIS-056) | UNKNOWN | UNKNOWN |
| Context Fusion | UNKNOWN | UNKNOWN |
| Growth Navigation | UNKNOWN | UNKNOWN |
| Progress Intelligence | UNKNOWN | UNKNOWN |
| Future Agent Architecture | UNKNOWN | UNKNOWN |
| Evidence/Auditability | Evidence is already a separate, implemented module either way | same |

No document specifies a dependency strong enough to break the tie
between A and B; every cell is reported as UNKNOWN rather than inferred.

## 16. Philosophy Analysis

[EVIDENCE] Master vision frames Memory as "a high-value intelligence
substrate" requiring poisoning defense, correction, and confidence
tracking (§24) — consistent with either model, since PI Core already
embodies these same properties for its own data.
[EVIDENCE] The governing instruction for this phase explicitly warns
against "a second user-understanding model" / competing parallel
models; Model B carries the higher risk of that outcome if built
without an explicit PI Core interface.
[INTERPRETATION] Minimum-input/maximum-value favors reusing the
existing Evidence → PI Core flow rather than a second ingestion path,
regardless of which model is eventually chosen — this does not itself
decide A vs. B.
[EVIDENCE] Neither model was found to conflict with Human development
≠ task completion, Digital Twin, or Personal AI Coach/Research
Assistant framing in any source.

## 17. Cross-Reference: Goal OS and Actor≠Owner Status

This record does not touch, reinterpret, or depend on either of the
following. Both are restated here exactly as previously decided,
unchanged:

- **Goal OS remains DEFERRED** (`docs/gates/PHASE_10P_GOAL_READINESS_FOUNDER_DECISION_GATE.md`, Option A, commit `3cacf777c7a88c02624462a43ff822cff4cbda28`).
- **Goal Readiness remains UNDEFINED.**
- **Goal Contract remains NOT AUTHORIZED.**
- **Goal implementation remains NOT AUTHORIZED.**
- **Actor≠Owner remains DEFERRED** (`docs/gates/PHASE_10K_3_FOUNDER_DECISION_ACTOR_OWNER_DEFERMENT.md`, commit `95293b9046d4be29f56ecd646040831b5f622eda`).
- **Memory implementation remains NOT AUTHORIZED.**
- **Memory Contract remains NOT AUTHORIZED.**

"Deferred ≠ Rejected" is preserved for Goal OS exactly as recorded in
Phase 10P; nothing in this record weakens, narrows, or reinterprets that
distinction.

## 18. Founder Decision Required

**FOUNDER DECISION REQUIRED**

Question:
`What is the architectural relationship between Personal Intelligence`
`Core and Memory Architecture?`

**OPTION A**
`Memory is an extension of Personal Intelligence Core.`

For A, the Founder must additionally decide:
- what Memory-specific subject matter belongs inside PI Core (e.g., a
  new `claimType` category for navigation/history, or something else);
- how navigation/history is represented;
- whether the existing PI claim/version provenance/confidence/lifecycle
  mechanism remains the shared mechanism for this new subject matter.

**OPTION B**
`Memory is a distinct system.`

For B, the Founder must additionally decide:
- the exact Memory ownership boundary;
- the PI Core ↔ Memory interface;
- how the provenance/confidence responsibility conflict between TD-02
  §3.1 and §3.16 is resolved;
- whether the provenance/confidence/lifecycle mechanism is shared with
  PI Core or independently owned by Memory.

**OPTION C**
`Boundary remains unresolved; further evidence or Founder clarification`
`required.`

For C: no Contract, no implementation, no schema, no API, no
persistence design, no lifecycle design follows from this record.

**Selected option:** `OPTION B — MEMORY AS A DISTINCT SYSTEM`

**Founder decision statement:**

> The Founder explicitly selects Option B. Memory Architecture is an
> independent architectural system from Personal Intelligence Core.
> This decision resolves only the ownership-boundary question left open
> by the prior read-only boundary gates (Model C). It does not by
> itself authorize a Contract, an interface design, a schema, an API,
> or implementation of any kind.

**Architectural meaning of this decision:**

- Personal Intelligence Core remains responsible for its existing,
  already-implemented claim model (`PersonalIntelligenceClaim` /
  `PersonalIntelligenceClaimVersion`, §4 above) exactly as it stands.
  No existing implementation is renamed, reinterpreted, or retroactively
  reclassified as "Memory" by this decision.
- Memory Architecture is established as a distinct architectural
  ownership boundary, separate from Personal Intelligence Core, per the
  evidence in §5, §7, and §9 of this record (TD-02 §4/§9,
  `TD-04-human-os` §21, master vision §24/§30, `FOUNDATION.md`).
- No existing code, schema, table, module, or test is affected by this
  decision.

**Explicit unresolved questions (deliberately left open, not decided
here, and not invented):**

1. The exact Memory ownership boundary (what specifically Memory owns
   beyond the conceptual description already in §5–§7).
2. The Personal Intelligence Core ↔ Memory interface — no interface is
   defined by this decision (§12 found none in any source; none is
   supplied here).
3. How the provenance/confidence responsibility conflict between TD-02
   §3.1 (assigned to PI Core, already built) and §3.16 (assigned to
   Memory, conceptual) is reconciled.
4. Whether the provenance/confidence/lifecycle mechanism is shared with
   PI Core or independently owned and re-implemented by Memory.
5. Persistence ownership (separate storage, shared storage, or another
   relationship) — no persistence model is defined by this decision
   (§13 found none in any source; none is supplied here).
6. Retrieval semantics for Memory — not defined by this decision (§14).

Each of these six questions requires its own subsequent architecture
determination and, where material, its own Founder decision, before any
Contract can be drafted.

**Implementation authorization: NOT AUTHORIZED.**

**Contract authorization: NOT AUTHORIZED.**

**Interface design authorization: NOT AUTHORIZED.**

**Schema/API authorization: NOT AUTHORIZED.**

**Goal OS remains DEFERRED.**

**Goal Readiness remains UNDEFINED.**

**Actor≠Owner remains DEFERRED.**

**Deferred ≠ Rejected.**

## 19. Self-Audit

A. Baseline unchanged — confirmed (`3cacf777c7a88c02624462a43ff822cff4cbda28` throughout). B. HEAD == origin/main — confirmed. C–G. No source/schema/migration/API/UI changed — confirmed. H. No existing PI implementation changed — confirmed; only read. I. No Goal OS change — confirmed. J. No Goal Readiness change — confirmed. K. No Actor≠Owner change — confirmed. L. No conceptual document promoted — confirmed; all Tier-3 sources stayed labeled as such. M. No Memory semantics invented — confirmed; every responsibility cited traces to a specific source, and every gap (interface, persistence, general retrieval) is reported as absent rather than filled. N. Evidence and interpretation separated throughout (tagged inline). O. A/B/C genuinely considered — confirmed; both A and B received a full evidence-for/evidence-against pass before C was selected per the governing decision rule. P. Duplication risk explicitly tested — §11. Q. Interface evidence explicitly tested — §12 (none found). R. Persistence evidence explicitly tested — §13 (none found). S. Retrieval evidence explicitly tested — §14. T. Long-term architecture UNKNOWNs preserved — §15, no cell inferred. U. No Contract authorization — confirmed. V. No implementation authorization — confirmed. W. Only this single, explicitly authorized governance artifact was created.

## 20. Hard Stop

This document is a decision-preparation artifact only. No model has
been selected. No implementation, schema, migration, API, UI,
Architecture Freeze modification, Goal OS reopening, or Actor≠Owner
reopening follows from its creation. This file has not yet been staged,
committed, or pushed.
