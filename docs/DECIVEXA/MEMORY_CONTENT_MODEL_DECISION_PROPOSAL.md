# DECIVEXA — Memory Content Model Decision (PROPOSED)

**Document type:** Proposed architectural decision record.
**Naming status:** **NOT an "ADR-00N"-numbered file.** GOV-04
(`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §10) explicitly recorded
that the repository's future ADR naming convention remains an open,
Founder-controlled decision, and that a new ADR must not rely on a bare
numeric identifier where that number could be ambiguous across
namespaces. `docs/architecture/ADR-005-ownership-resource-boundary.md`
already exists — naming this document "ADR-005" anywhere would
immediately recreate the exact collision pattern GOV-04 catalogued and
deferred resolving. This document is therefore named unambiguously and
descriptively, with no numeric ADR identifier, pending that future
naming-convention decision. If and when the Founder resolves the naming
convention, this document (if approved) can be assigned a proper
identifier at that time without needing to be rewritten.
**Status:** **PROPOSED — NOT FOUNDER-APPROVED.**
**Date:** 2026-08-24.
**Authorizing instruction:** Founder-authorized "prepare the NEXT FOUNDER
DECISION RECORD" task, following the completed
`docs/DECIVEXA/MEMORY_CONTENT_MODEL_INVESTIGATION.md`.

---

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"MEMORY DOCUMENTARY CLOSURE / OPTION E — SPLIT HISTORICAL PRESERVATION."
This section is a present-day addition; the document below it is
preserved unmodified as the historical record.*

This document is preserved as a historical architectural/planning
record. At the time it was written, Memory's schema had not yet been
extended with a content/value representation. This document's §5
selection of "Model C's direction" is preserved as the historical
decision it recorded; it is consistent with, though not independently
proven as the cause of, the content/value model Memory was ultimately
built with. Subsequent shipped implementation (commits `11e8d0d`,
`217170e`, `2b5157a`, `15627e5`) introduced the unified content/reference
value slot (`valueKind: "content" | "reference"`, `value: string |
null`) and an intrinsic `userConfirmed: boolean` field. This document's
own §10 status — "PROPOSED — AWAITING FOUNDER REVIEW AND EXPLICIT
APPROVAL" — is a claim contained in this historical document only, and
must not be upgraded into independently corroborated repository
authority; the resolving authorization for the later implementation is
not present in the surviving repository documentation. This
reconciliation does not fabricate or reconstruct that missing
authorization record and does not authorize any new implementation. The
current shipped Memory implementation must be established from the
actual committed source and commit history, not inferred from this
document.

---

## 1. Decision Question

*What architectural content representation should a Memory record use so
that Memory can represent what is actually remembered, rather than
functioning as a content-less provenance envelope?*

---

## 2. Evidence

Independently re-verified this task, directly against the repository
(not merely trusted from the prior investigation document):

- **Current Memory model** (`apps/api/src/core/memory/memory-record.model.ts`,
  re-read in full): `MemoryRecord {id, userId, createdAt, updatedAt}`;
  `MemoryRecordVersion {id, recordId, version, userId, provenance,
  lifecycle, observedAt, acceptedAt, confidence, createdAt}`. **Confirmed:
  no content/value field of any kind.**
- **PI Core precedent** (`apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts`,
  re-read in full): `PersonalIntelligenceClaim {id, userId, claimType,
  createdAt, updatedAt}`; `PersonalIntelligenceClaimVersion {id, claimId,
  version, userId, valueKind, valueText, provenance, confidence,
  lifecycle, evidenceVersionId, observedAt, acceptedAt, createdAt}`.
  **Confirmed:** a `claimType` on the parent record, a `valueKind`/
  `valueText` pair and an optional `evidenceVersionId` on each version —
  exactly as the investigation document described.
- **TD-04 §4 "Evidence Model"** (`docs/architecture/TD-04-human-os-personal-intelligence-core.md`):
  six distinguishable evidence/fact types (Explicit Fact, Observed
  Behavior, Derived Pattern, Inference, Prediction, User Correction) and
  a conceptual "Model Attribute" shape including a `value` field
  alongside the same metadata Memory already has.
- **FIS-045 — Personal Navigation Memory** (`docs/FIS-REGISTRY.md`):
  *"Remember the user's historical navigation patterns and surface
  relevant lessons when current circumstances resemble prior
  situations."* Dependencies named elsewhere as "Evidence, outcomes,
  paths" — Memory is informed by Evidence, not equivalent to it.
  Confirms this document itself is not a content model — it's the design
  question Memory's absent content field must eventually answer.
- **Memory Increment Contract Non-Goals**
  (`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §7/§17,
  re-verified): explicitly excludes "PI Core ↔ Memory interface of any
  kind," "Evidence Platform linkage of any kind," "HTTP/API surface,"
  "UI of any kind," "Future AI consumption of Memory records." Confirms
  this decision touches only previously-deferred, not previously-decided,
  ground, and that none of those surfaces is authorized by anything
  decided here.
- **GOV-04** (`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §10):
  confirms the ADR-naming-namespace situation and the existing collision
  at "ADR-005" specifically (`docs/architecture/ADR-005-ownership-resource-boundary.md`),
  directly informing this document's naming decision (§ header above).
- **`docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §17 "Memory Contract"** — a
  primary and authoritative supporting source, identified during a
  subsequent audit of this proposal and independently re-verified before
  this revision. This document is part of the top-level `docs/TD-0X_*.md`
  chain that `docs/ARCHITECTURE_FREEZE_BASELINE.md`'s "Frozen Source
  Gate" names directly ("TD-02 through TD-06: approved gates") — the same
  Freeze-incorporated family this repository's own governance record
  already established as operationally authoritative for TD-02
  (`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §7). §17 sets out a
  conceptual Memory object already containing `memory_id`, `memory_type`,
  `content/reference`, `source`, temporal fields (`created_at`/
  `valid_time`), provenance/confidence/`user_confirmed?` information,
  sensitivity/`last_verified`/review-policy information,
  correction/supersession references, and lifecycle status. **Evidence:**
  a Freeze-incorporated document already anticipates a typed Memory
  object carrying substantive content/reference information, not a
  content-less envelope. **Interpretation:** this independently and more
  directly supports Model C's direction than the PI Core analogy alone —
  `memory_type` plus `content/reference` is the same conceptual shape as
  "a type indicator plus a typed value." **This does not mean §17 has
  selected a final schema, and its conceptual field list is not adopted
  here as a proposed implementation schema or as implementation
  authorization** — TD-04 (top-level) is itself self-declared "DESIGN
  DEFINED / GATE NOT YET PASSED," and the exact schema remains, as stated
  throughout this document, a future decision.
- **`docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §8 "PI Core
  Boundary Invariants"** — re-verified this revision. Records a
  non-negotiable invariant: *"MEMORY MUST NOT CREATE, MODIFY, EXTEND, OR
  REINTERPRET THE PI CORE CLAIM MODEL"* — specifically no new PI Core
  `claimType`, no modification of existing `claimType` semantics, no
  migration of PI Core claims into Memory, no reinterpretation of
  `PersonalIntelligenceClaimVersion` as a Memory implementation, and no
  modification to the closed PI Core implementation. **This proposal's
  Model C direction complies with this invariant, made explicit rather
  than left implicit:** PI Core's `PersonalIntelligenceClaimVersion` is
  used in §2/§3 only as architectural evidence/precedent for a *pattern*;
  Memory does not reuse the PI Core claim model, does not reuse PI
  Core's actual types, does not reuse PI Core's table, and does not
  reuse PI Core's module; and no PI Core ↔ Memory integration is
  authorized by this proposal (confirmed again in §6, Question 3, and
  §9 below).
- **Disclosed governance finding — a newly identified TD-04 namespace
  collision (not resolved here):** repository inspection performed for
  this revision found **three distinct "TD-04" files**:
  `docs/TD-04_DATA_RUNTIME_CONTRACTS.md` (cited above),
  `docs/architecture/TD-04-human-os-personal-intelligence-core.md`
  (cited elsewhere in §2), and
  `docs/technical-design/TD-04-SECURITY-THREAT-MODEL.md` (a distinct
  subject — security — an incidental numeric collision only). This is a
  newly identified namespace/document collision, parallel to but
  distinct from the already-recorded TD-02 and ADR-namespace collisions
  (`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` §7–§8, §10). **It is not
  resolved by this proposal; it is outside the scope of this Memory
  content-model decision; it does not currently invalidate any evidence
  used for Model C above (both TD-04 files cited in this document remain
  independently accurate as read); it must not be silently renamed,
  merged, deleted, or otherwise normalized here; and it does not reopen
  GOV-02 or GOV-04.** It is recorded solely as a disclosed
  governance/documentation finding for a future, separate investigation.

---

## 3. Options

**Model A — Simple textual content** (`content: string`). One flat field.

**Model B — Rigid structured payload.** One fixed JSON/structured shape
for all Memory content.

**Model C — Common envelope + typed content**, informed by (not
identical to) the existing PI Core `PersonalIntelligenceClaimVersion`
precedent: a type indicator on the parent record, plus a typed
value-kind/value pair (and optionally an `evidenceVersionId`-style
reference) on each version — reusing Memory's existing metadata fields
unchanged.

**Model D — Proposition/fact-oriented representation** (e.g.
subject–predicate–object structures). Atomic structured propositions.

---

## 4. Evaluation

| Option | Evidence support | Vision fit | AI readiness | Extensibility | Repository precedent | Premature-coupling risk | Complexity |
|---|---|---|---|---|---|---|---|
| A | Weak — collapses TD-04 §4's six fact-types into one shape | Weak | Low | Poor | None | Low, but wrong-shape risk later | Lowest |
| B | Moderate — better than A, still assumes one universal shape | Moderate | Moderate | Poor — rigid | None | Moderate | Moderate |
| **C** | **Strong — directly matches TD-04 §4's typed-fact-type framing and an existing, twice-used repository pattern** (PI Core's claim/version pair; Personal State's `evidenceVersionId`) | **Strong** | **Strong** | **Strong** | **Strong — proven, not invented** | **Lowest — reuses an already-governed pattern** | Low-moderate |
| D | Plausible for FIS-045's "lessons/patterns" framing, but no document requires this formality and no repository precedent exists | Moderate | Potentially strong, but speculative | Strong in theory | None | Highest — invents new architecture | Highest |

**Why C succeeds over A/B:** TD-04 §4 explicitly requires distinguishing
multiple fact/evidence types; a single flat or rigid field cannot
represent that distinction without external convention, whereas Model C's
typed-value approach can. **This is independently reinforced by
`docs/TD-04_DATA_RUNTIME_CONTRACTS.md` §17** (see §2 above), whose own
conceptual Memory object already carries a `memory_type` field alongside
`content/reference` — a Freeze-incorporated source, not merely an
analogy. **Why C succeeds over D:** D is not disqualified, but it
requires inventing structure this repository has never used, where C
requires only extending a pattern the repository already has (twice at
implementation level, and once more at the conceptual/Freeze-incorporated
level in TD-04 §17), tested, and has had Founder-adjacent governance
approve. **The evidence-support gap between C and every other option is
large enough to support a direction-level decision**, while the *exact*
type taxonomy remains genuinely undetermined by current evidence (§7
below).

---

## 5. Decision

**Model C's direction is selected: Memory's content model should be a
common envelope (Memory's existing metadata fields, unchanged) plus a
typed value representation — a type indicator and a typed value
pair — informed by, but architecturally independent from, PI Core's
`PersonalIntelligenceClaimVersion` precedent.**

This is an **architectural direction decision only.** It does not
specify field names, exact types, a finalized taxonomy, or any schema.

---

## 6. Required Questions — Answered

1. **Does Memory require a value/content representation?** Yes — this is
   the core finding of both the investigation and this decision: Memory
   currently has none, and TD-04 §4/FIS-045 both presuppose one exists
   for Memory to fulfill its named architectural purpose.
2. **Should Memory use a typed content model rather than a single
   unrestricted text field?** Yes — decided above (Model C over Model A),
   on the strength of TD-04 §4's six-fact-type framing.
3. **Should Memory's content model be independent from PI Core's claim
   model while being informed by its precedent?** Yes — explicitly
   decided: Memory and PI Core remain separate primitives (per TD-02 and
   TD-04 §21's sibling-dependency listing); Memory's content model
   should reuse the *pattern* PI Core demonstrated, not share PI Core's
   actual types, table, or module. No PI Core ↔ Memory coupling is
   created or implied by this decision. **This directly complies with
   the non-negotiable "PI Core Boundary Invariant" in
   `docs/gates/PHASE_10Q_E_MEMORY_INCREMENT_CONTRACT.md` §8** (see §2
   above): no new/modified `claimType`, no migration of PI Core claims
   into Memory, no reinterpretation of `PersonalIntelligenceClaimVersion`
   as a Memory implementation, and no modification to the closed PI Core
   implementation.
4. **Does Memory require its own type taxonomy?** **Not decided here.**
   The evidence supports that Memory needs *a* typed dimension (per
   Question 2), but whether it reuses/adapts `PersonalIntelligenceValueKind`-
   style categories or needs an entirely new, FIS-045-specific taxonomy
   (situations, lessons, patterns) is left open — the evidence does not
   yet distinguish between these with confidence.
5. **Should `evidenceVersionId`-style linkage be part of this decision,
   or remain a future decision?** **Remains a future decision.** The
   precedent exists (§2) and is architecturally compatible with Model C,
   but including or excluding it is a schema-level detail beyond what
   this direction-level decision needs to settle.
6. **What is deliberately NOT decided here?** Exact field names; the
   type taxonomy (Question 4); whether/how `evidenceVersionId`-style
   linkage is included (Question 5); persistence/schema details; any
   sensitivity/privacy classification for content; retrieval mechanisms
   beyond what already exists.
7. **What future decisions are required before Memory can reach Web, PI
   Core, Evidence, or AI consumers?** At minimum: (a) a schema-level
   Implementation Contract turning this direction into an actual field
   set, requiring its own separate Founder Build Authorization; (b) a
   Web/Product Integration boundary ADR (mirroring ADR-002/003's pattern)
   before any HTTP/API/UI work; (c) a separate PI Core ↔ Memory interface
   decision (already named as deferred in the Memory Contract §17); (d) a
   separate Evidence ↔ Memory linkage decision; (e) a separate AI-
   consumption decision. **None of these is bundled into, or authorized
   by, this document.**

---

## 7. What Is Explicitly Not Decided

Reiterated for clarity: the exact taxonomy, the exact fields, whether
`evidenceVersionId`-style linkage is included, any schema or migration,
any sensitivity/privacy mechanism, and every item listed in Question 7
above.

---

## 8. Six-Criteria DECIVEXA Review

1. **Vision Alignment** — *Evidence:* Master Architecture §24 and TD-04
   §4 both require distinguishing evidence/fact types before Memory can
   be trustworthy. *Interpretation:* Model C directly enables this; A/B
   would not. *Risk:* none from deciding a direction only. *Recommendation:*
   proceed with Model C's direction as decided.
2. **Long-Term Architecture Strength** — *Evidence:* the chosen direction
   reuses an already-proven, twice-used repository pattern (§2).
   *Interpretation:* lower long-term migration risk than inventing a new
   shape (Model D) or committing to a rigid one (Model B). *Risk:* none
   identified at the direction level. *Recommendation:* the future
   Implementation Contract should preserve this reuse-over-invention
   principle when it defines exact fields.
3. **Improvement Opportunities** — *Evidence:* TD-07-MEMORY-PROVENANCE
   remains "Proposed," never formally accepted. *Interpretation:* the
   future schema-level Contract could also formally reconcile TD-07.
   *Risk:* none — opportunity only. *Recommendation:* not executed here.
4. **User Input Burden vs. System Value** — *Evidence:* no product
   surface exists yet (confirmed in the prior gate report and this
   task). *Interpretation:* this decision adds no user-facing burden;
   it reduces the risk of a costly redesign later. *Risk:* none.
   *Recommendation:* none needed at this stage.
5. **AI Capability** — *Evidence:* TD-04 §21 and Master Architecture §24
   tie future AI usefulness to typed, poisoning-resistant content.
   *Interpretation:* Model C's typed structure is materially more
   AI-ready than Model A/B. *Risk:* none from deciding direction only;
   risk would arise only if a future schema abandoned typing.
   *Recommendation:* preserve typing through the future schema decision.
6. **Trusted Reference Platform** — *Evidence:* this document traces
   every claim to a specific, independently re-verified file/section.
   *Interpretation:* deciding a direction (not a full schema) keeps the
   record honest about what is and isn't yet known. *Risk:* none.
   *Recommendation:* none needed.

---

## 9. Founder Authority Boundary

- **This document is a proposed architectural decision record.** Its
  creation does **NOT** constitute Founder approval unless separately
  approved by the Founder.
- **Even if this document is later approved, it does NOT authorize
  implementation.** Schema or migration work requires a later
  Implementation Contract and a separate, explicit Founder Build
  Authorization.
- **API/Web/PI Core/Evidence/AI exposure each require their own separate
  future architectural decisions**, none of which is authorized,
  implied, or accelerated by this document.
- No Memory implementation file, schema, migration, repository,
  use-case, controller, or Web/UI file was modified to produce this
  document.
- No existing ADR (in `docs/adr/`, `docs/architecture/`, or
  `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`) was modified, renamed, or
  renumbered.
- No Architecture Freeze, Master Architecture, Roadmap, TD-04 (any
  variant), TD-07, GOV-02, or GOV-04 modification was made — all TD-04
  and TD-07 references above are citations of existing text, not edits
  to those documents.
- This document does not resolve GOV-04's naming-convention question —
  it deliberately avoids it by using an unambiguous, non-numeric name
  (see header) — nor does it resolve the newly disclosed TD-04 namespace
  collision (§2), which remains untouched and unnormalized.

---

## 10. Status

**PROPOSED — AWAITING FOUNDER REVIEW AND EXPLICIT APPROVAL.** No further
action follows from this document's creation.
