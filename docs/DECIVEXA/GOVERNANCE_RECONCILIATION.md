# DECIVEXA — Formal Governance Reconciliation

**Document type:** Governance reconciliation record (not an Architecture
Freeze, not a Technical Design document, not an Implementation Contract).
**Status:** DRAFTED — EVIDENCE-BACKED — NOT FOUNDER-APPROVED.
**Date:** 2026-08-24.
**Author role:** Repository governance investigation, per the Founder-
authorized "DECIVEXA — FORMAL GOVERNANCE RECONCILIATION" execution prompt.
**Supersedes:** Nothing. This document creates no new architecture, resolves
no closed domain, and changes no Founder-approved artifact's authority
status. It formalizes, in one place, relationships already established by
repository evidence during the preceding two read-only investigations this
session ("DEEP GOVERNANCE RECONCILIATION PASS" and "FORMAL DECIVEXA
GOVERNANCE DETERMINATION").
**Cross-referenced by:** `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md` (ADR-004)
and `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` (§18 addendum).

---

## 1. Purpose

This document formally reconciles the repository's two governance layers —
the pre-existing Architecture Freeze / Technical Design ("TD") chain and the
newer Master Roadmap / Architecture Decision Source of Truth / ADR track
("Layer γ") — without superseding, deleting, rewriting, or weakening any
Founder-approved architecture. It records, as evidence-backed conclusions,
findings that were previously scattered across two read-only investigation
reports in this session's conversation history, so that future work has one
authoritative reconciliation record to consult instead of re-deriving the
same analysis.

This document is **evidence-derived, not Founder-approved**. It records
relationships that repository evidence supports; it does not itself
authorize, forbid, or change any architecture. Where a genuine architectural
change would be implied, this document stops short and records the item as
a governance backlog entry or an open question instead (§19).

---

## 2. Governance Authority Model

The following model is formalized as the current, evidence-supported
picture of DECIVEXA's governance layering. It does not invent new layers —
it names layers already visible in repository documents and orders them
consistently with `docs/technical-design/TD-01_ARCHITECTURE_CONSTITUTION_AND_DOCUMENT_AUTHORITY.md`
§4 ("Document Authority Hierarchy").

```text
Layer 0 — Founder Authority
  Founder Decision / Explicit Approval.
  No document overrides an explicit Founder decision.
        ↓
Layer 1 — Architecture Freeze / Approved Architecture Baseline
  DECIVEXA-ARCH-FREEZE-001 / v1.0.0
  docs/ARCHITECTURE_FREEZE_BASELINE.md
  (FROZEN — FOUNDER APPROVED, dated 2026-08-21, explicit Founder
  Approval Record.)
        ↓
Layer 2 — Canonical Architecture / Philosophy / Vision
  docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md (primary reference)
  docs/FOUNDATION.md, docs/DECIVEXA-CANONICAL-BASELINE.md,
  docs/DECIVEXA-CANONICAL-SYSTEM-MAP.md (supporting historical lineage)
        ↓
Layer 3 — Technical Design
  TD-01 … TD-12 (the operational top-level docs/TD-0X_*.md chain,
  already incorporated into the Architecture Freeze — see §7).
        ↓
Layer 4 — Current Decision / Reconciliation Track ("Layer γ")
  docs/DECIVEXA_MASTER_ROADMAP.md
  docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md
  docs/DECIVEXA/ARCHITECTURE_DECISIONS.md
  This document (GOVERNANCE_RECONCILIATION.md).
        ↓
Layer 5 — Implementation Contracts
  docs/IMPLEMENTATION_INCREMENT_00N_CONTRACT.md
        ↓
Layer 6 — Code
```

**[EVIDENCE]** This ordering matches TD-01 §4's own hierarchy
(`Founder Decision → Constitution/Governance Rules → Architecture Freeze +
Approved Architecture Baseline → Master Philosophy... → FIS Registry →
Technical Design Documents → Approved Implementation Contracts → Phase
Plans/Gate Decisions → Implementation/Code → Operational Notes`), with Layer
γ inserted at the point TD-01 itself reserves for "current decisions,"
consistent with TD-01 §17 ("Repository as Audit Trail") and never in
conflict with any explicit TD-01 clause (TD-01 was read in full during the
preceding investigation and contains no rule that a Layer-γ-shaped artifact
would violate by existing at this position).

---

## 3. Authority Hierarchy vs. Evidence Hierarchy

These are formally distinguished, per the Founder-authorized instruction
that they must not be collapsed into one hierarchy.

**Authority Hierarchy** (`docs/technical-design/TD-01...` §4) answers:
*"When two project artifacts conflict, which one governs?"* It ranks
**document types** by governance power (Founder Decision outranks
Architecture Freeze outranks Technical Design outranks Implementation
Contract outranks Code, etc.).

**Evidence Hierarchy** (`docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`
§3) answers a different question: *"When determining what is currently
true about the project, which source should be trusted more?"* It ranks
**evidentiary reliability** (Authoritative Repository Documents → Accepted
Architecture/Governance Decisions → Verified Repository State → Current
Implementation Evidence → Conversation Context/Model Memory → Assumption).

```text
Authority Hierarchy (governs)          Evidence Hierarchy (informs)
────────────────────────────           ──────────────────────────────
Founder Decision                       Authoritative Repository Documents
Architecture Freeze                    Accepted Architecture/Gov. Decisions
Canonical Architecture                 Verified Repository State
Technical Design                       Current Implementation Evidence
Implementation Contracts               Conversation Context / Model Memory
Code                                   Assumption
Operational Notes
```

A document can rank low on the Authority Hierarchy (e.g. an Implementation
Contract) while still being high on the Evidence Hierarchy (a verified,
already-merged Contract is stronger evidence of *what actually happened*
than an unverified higher-authority document's silence on the same
question). The two hierarchies are complementary, not substitutable: the
Authority Hierarchy resolves *whose decision wins*; the Evidence Hierarchy
resolves *how much to trust a claim about current state*. **[EVIDENCE]**
Confirmed by direct full-text read this session: neither
`docs/technical-design/TD-01_ARCHITECTURE_CONSTITUTION_AND_DOCUMENT_AUTHORITY.md`
nor `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` references the
other, and neither hierarchy contradicts the other's stated purpose.

---

## 4. Relationship Between Architecture Freeze and Layer γ

**[EVIDENCE]** Full-text review of all three Layer γ documents
(`DECIVEXA_MASTER_ROADMAP.md`, `ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`,
`ARCHITECTURE_DECISIONS.md`) found **zero** occurrences of the words
"supersede," "replace," or "override" applied to
`docs/ARCHITECTURE_FREEZE_BASELINE.md`, TD-01, or TD-02 — and zero
references to those documents at all, in either direction.

**[EVIDENCE]** Implementation Increment Contracts 004, 005, and 006 each
cite `Architecture Baseline: DECIVEXA-ARCH-FREEZE-001 / v1.0.0` **while
simultaneously** grounding their specific scope decisions in Layer γ's
ADR-001 (Increment 005) — i.e. both layers were drawn on together, without
conflict, in the same real, executed Contracts.

**[EVIDENCE]** Implementation Increment Contract 007 is the first Contract
in the sequence that does **not** cite the Architecture Baseline field —
confirmed by direct grep this session. This is recorded as a governance-
drift finding (§13), not evidence of an intentional decision either way.

**[FOUNDER DECISION REQUIRED — NOT MADE HERE]** Whether Layer γ should be
formally required to cite the Architecture Freeze Baseline in every future
Contract is a governance-rule question; this document proposes the rule
(§12) but does not itself mandate retroactive correction of Increment 007
(§13, §15).

**Conclusion:** *"Layer γ is a complementary current-decision and
reconciliation layer operating within the existing Founder-approved
architecture/governance hierarchy."* Layer γ has never claimed
supersession; the evidence does not support one; and this document does
not create one.

### Layer γ may:
- record current decisions;
- document rationale;
- reconcile historical architecture;
- define current implementation boundaries;
- track roadmap sequencing;
- identify conflicts;
- identify deferred decisions;
- point implementation toward approved architecture.

### Layer γ may NOT:
- silently override Architecture Freeze;
- silently reopen closed domains (PI Core, Memory, Evidence, Human
  Understanding);
- override Founder-approved Technical Design;
- create implementation authority merely by recording an ADR;
- declare supersession without explicit Founder approval.

---

## 5. Master Architecture Position

`docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md` is formally positioned,
per direct evidence from both its own text and TD-01 §5 (which names it
explicitly as "the canonical architecture-intent baseline... the current
Founder-approved synthesis"), as:

- the canonical architecture-intent / consolidation baseline referenced by
  TD-01;
- **above** implementation, **below** Founder authority and Architecture
  Freeze (per its own §34 "Implementation Boundary": "the existence of a
  capability in this document does not authorize... code implementation...
  architecture changes... Those require their own explicit decision and
  gate");
- not an implementation authorization;
- not a replacement for Architecture Freeze;
- not a replacement for Technical Design;
- a reference baseline against which future architecture phases, FIS
  proposals, implementation plans, and product decisions are evaluated
  (its own §35 "Document Status").

**[EVIDENCE]** Confirmed by full-text read this session: the Master
Architecture document contains **zero** references to Layer γ
(`MASTER_ROADMAP`, `ARCHITECTURE_DECISION_SOURCE_OF_TRUTH`,
`ARCHITECTURE_DECISIONS.md`, `ADR-001/002/003`) or to the term "Personal
State." Its substantive architecture is not altered by this document.

---

## 6. Technical Design Position

The TD-01 … TD-12 sequence remains part of the technical governance chain,
subordinate to Founder Decision, Architecture Freeze, and Canonical
Architecture, and superior to Implementation Contracts and Code, per TD-01
§4 (unchanged, unmodified by this document).

**[EVIDENCE]** `docs/ARCHITECTURE_FREEZE_BASELINE.md`'s "Frozen Source
Gate" section states: *"TD-02 through TD-06: approved gates"* and *"TD-07
Architecture Freeze & Implementation Contract: freeze candidate"* — i.e.
the Architecture Freeze already incorporates the operational top-level TD
chain (§7 below identifies exactly which TD-02 artifact this refers to).

---

## 7. TD-02 Authority Determination

Three TD-02 artifacts exist in the repository:

1. `docs/TD-02_DOMAIN_BOUNDARIES_AND_MODULE_OWNERSHIP.md`
2. `docs/technical-design/TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md`
3. `docs/technical-design/TD-02-DOMAIN-BOUNDARIES.md`

### Determination

**The currently evidenced operationally authoritative TD-02 is
(1) `docs/TD-02_DOMAIN_BOUNDARIES_AND_MODULE_OWNERSHIP.md`.**

### Why

- **[EVIDENCE]** `docs/ARCHITECTURE_FREEZE_BASELINE.md` (self-declared
  "FROZEN — FOUNDER APPROVED," with an explicit dated Founder Approval
  Record, 2026-08-21) states in its Frozen Source Gate: *"TD-02 through
  TD-06: approved gates"* and *"TD-07 Revision Pack R1–R14: accepted at
  design level."* The filenames `docs/TD-07_REVISION_PACK_R1-R14.md` and
  `docs/TD-07_RE_REVIEW.md` exist **only** in the top-level `docs/`
  directory — the same directory as artifact (1) — establishing that the
  Frozen Source Gate's "TD-02" refers to artifact (1)'s family, not
  artifact (2)'s.
- **[EVIDENCE]** Implementation Increment Contracts 004, 005, and 006 cite
  `Architecture Baseline: DECIVEXA-ARCH-FREEZE-001 / v1.0.0` verbatim — the
  real, executed Contracts are governed by the chain artifact (1) belongs
  to.
- **[EVIDENCE]** `docs/TD-03_STATE_EVENT_CONSISTENCY_MODEL.md` (top-level)
  contains artifact (1)'s distinctive term "Evidence & Integration
  Platform," confirming artifact (1)'s conceptual vocabulary — not
  artifact (2)'s — was carried forward into the rest of the top-level TD
  chain.
- **[EVIDENCE, supporting/contextual only — not decisive]** Artifact (2) is
  independently cited by exact path in two prior Founder Decision Gate
  documents (`docs/gates/PHASE_10P_GOAL_READINESS_FOUNDER_DECISION_GATE.md`,
  `docs/gates/PHASE_10Q_PERSONAL_INTELLIGENCE_MEMORY_BOUNDARY_FOUNDER_DECISION_GATE.md`).
  The latter document classifies artifact (2) as **"Tier 3 (conceptual,
  self-declared non-authorizing for implementation)."** This label is
  **not, by itself, decisive evidence for this determination**: the same
  Phase 10Q gate applies the identical "Tier 3" classification to several
  other conceptual documents, including
  `docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`,
  `docs/DECIVEXA-CANONICAL-SYSTEM-MAP.md`,
  `docs/DECIVEXA-CANONICAL-BASELINE.md`, and `docs/FOUNDATION.md` — i.e. it
  is a broad classification that gate applies to conceptual/non-authorizing
  artifacts generally, not evidence unique to artifact (2). It is recorded
  here only as supporting/contextual color — confirming that a prior
  governance track already treated artifact (2) as non-authorizing for
  implementation on its own terms — and not as the basis for this
  determination. The determination itself rests on the independent,
  stronger evidence in the bullets above: the Architecture Freeze
  Baseline's explicit inclusion of "TD-02 through TD-06" as approved gates,
  the TD-07 revision-pack/re-review lineage existing only alongside
  artifact (1), Increment Contracts 004–006's citation of that same Freeze
  Baseline, and the shared TD vocabulary continuity. Artifact (2)'s own
  header still claims "Founder-approved technical design artifact" — a
  claim this document neither adopts nor disputes; see the
  documentation-hygiene discrepancy note below.

### Which files are historical / proposed / reference artifacts

- Artifact (1) — **operationally authoritative** (this determination).
- Artifact (2) — **historical / Tier-3 conceptual reference artifact.**
  Not deleted, not renamed, not downgraded in its own text by this
  document. Its citation history (Phase 10P/10Q gates) is preserved as
  legitimate prior evidence use at the tier those gates themselves
  assigned it.
- Artifact (3) — **unresolved**, see §8.

### Documentation-hygiene discrepancy

Artifact (2)'s self-declared header ("Founder-approved technical design
artifact," "ACCEPTED AS THE DOMAIN BOUNDARY AND OWNERSHIP BASELINE") is
**stronger than its evidenced operational tier**. This is recorded as a
documentation-hygiene discrepancy (§19, GOV-02) — not evidence that
artifact (2) is actually authoritative, and not itself corrected by this
document (correcting a Founder-approved-labeled document's header requires
its own explicit authorization, per §7 of the execution prompt governing
this task).

### No implementation authority inferred from self-declared status alone

Per the Founder-authorized instruction governing this reconciliation: no
document's self-declared status (in either direction) is treated as proof
of implementation authority by itself. This determination rests on
cross-document citation evidence (above), not on artifact (1)'s own
(weaker) self-declared "DESIGN DEFINED / GATE NOT YET PASSED" header
either — that header appears to be equally stale, **left stale by** the
later Architecture Freeze process's explicit incorporation of TD-02–TD-06
as "approved gates," without artifact (1)'s own header text ever being
updated to reflect that. This is not a claim that artifact (1) was
formally superseded — no document in this repository declares that, and
this document does not either — only that its self-declared header text
was never revised to match the later operational positioning described
above.

**[FOUNDER DECISION REQUIRED — NOT MADE HERE]** Whether to formally correct
either TD-02 file's header text to reflect this determination.

---

## 8. Third TD-02 Variant

`docs/technical-design/TD-02-DOMAIN-BOUNDARIES.md` — self-declared
**"Proposed technical contract."**

**Status relationship to operational TD-02, as originally recorded in this
reconciliation: UNRESOLVED / HISTORICAL-PROPOSED ARTIFACT** (this
reconciliation-record line, not Artifact C itself, has since been carried
forward by the Founder Decision below — the line is preserved here as an
accurate record of the state at the time this reconciliation was first
drafted, and is no longer the current classification).

This document was not part of the two-file comparison scope of the prior
investigation and had not been read in full at the time this reconciliation
was first drafted. It was disclosed, preserved unmodified, and left
classified as historical/proposed pending a future dedicated review (§19,
backlog item carried from the prior investigation). That dedicated review
has since been performed (a full read-only investigation, 2026-08-24,
covering the file's full content, a repository-wide reference search,
Git creation-history evidence, a three-way structural comparison against
Artifacts A and B, and content- and authority-conflict analysis), and its
findings are recorded in the Founder Decision immediately below. Artifact
C itself was not deleted, renamed, merged, or modified by that
investigation or by this record.

### Founder Decision — Classification Recorded (2026-08-24)

**FOUNDER DECISION — CLASSIFICATION RECORDED:** The Founder has determined
that `docs/technical-design/TD-02-DOMAIN-BOUNDARIES.md` is classified as:

**HISTORICAL-PROPOSED EARLY DRAFT — NON-OPERATIONAL — NO CURRENT
AUTHORITY.**

This classification rests on the completed read-only investigation's
findings:

- Artifact C's self-declared status is "Proposed technical contract,"
  with no Founder-approval declaration anywhere in its text.
- Artifact C has no Architecture Freeze incorporation — it is named
  nowhere in `docs/ARCHITECTURE_FREEZE_BASELINE.md`'s Frozen Source Gate,
  unlike Artifact A.
- Artifact C has no downstream operational citations anywhere in the
  repository, other than this reconciliation's own disclosure of it.
- No content-level contradiction was found between Artifact C and either
  Artifact A or Artifact B — every checked dimension (domain ownership,
  cross-domain access, Evidence, Memory, Human OS/PI Core, AI authority,
  Context Fusion, change control) was classified SAME or a
  COMPATIBLE/STRUCTURAL DIFFERENCE, never a MATERIAL DIVERGENCE or DIRECT
  CONTRADICTION.
- The three-way coexistence of Artifacts A, B, and C — each carrying a
  different self-declared status over the same conceptual "TD-02 — Domain
  Boundaries" identity, with no document stating a relationship between
  them — constituted a genuine **authority ambiguity** that required this
  Founder determination rather than an inferred resolution.
- Git evidence (each artifact's own dedicated creation commit, read-only)
  shows creation timestamps in the order **C → B → A, all on 2026-08-19,
  within an approximately 89-minute window**, each by the same author, in
  three separate commits.

**Historical-lineage treatment — evidence-consistent interpretation, not
proven formal lineage:** The available Git and repository evidence is
consistent with Artifact C being an earlier proposed draft in an apparent
**C → B → A** draft-development sequence — but **no explicit historical
document or commit establishes that lineage as a formal fact.** No commit
message, diff, or document text anywhere states that any of the three was
created from, based on, or replacing another. This determination
accordingly does **not** state that C was formally superseded by B or A,
does **not** claim the repository contains a formal supersession record,
and does **not** claim the C → B → A sequence is historically proven —
only that it is the interpretation the timestamp evidence is consistent
with.

**This determination does NOT constitute a formal supersession record**
and does **not** authorize: renaming, deleting, or merging Artifact C or
any other TD-02 file; implementation of any kind; any architecture
change; or any domain expansion. Artifact C does not gain authority from
this classification, does not become part of the Architecture Freeze,
and does not become a canonical technical-design source.

**Artifact A and Artifact B are unaffected by this determination.**
Artifact A (`docs/TD-02_DOMAIN_BOUNDARIES_AND_MODULE_OWNERSHIP.md`)
remains the operationally authoritative TD-02, on the same evidence chain
already established in §7 above (Architecture Freeze Baseline
incorporation, Increment Contract citations, TD-03 vocabulary
continuity) — not on chronology or document detail. Artifact B
(`docs/technical-design/TD-02_DOMAIN_BOUNDARIES_AND_OWNERSHIP.md`) remains
classified exactly as previously recorded in §7 above (historical /
Tier-3 conceptual reference artifact) and is not reclassified by this
decision.

The third variant's **classification ambiguity** is resolved by this
Founder Decision. The separate **physical document-hygiene question** —
three TD-02 files coexisting in the repository — remains open; see GOV-02
(§19 below), which this decision updates accordingly but does not close.

---

## 9. Canonical Baseline Lineage

`docs/FOUNDATION.md` → `docs/DECIVEXA-CANONICAL-BASELINE.md` →
`docs/DECIVEXA-CANONICAL-SYSTEM-MAP.md` → `docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
are treated as a **sequential-draft lineage**, not four competing
authorities — consistent with the prior session's "PARTIALLY RECONCILED"
finding (no confirmed content-level conflict found between them in any
document actually checked). `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
is the most current and most complete member of this lineage and is the
one TD-01 §5 names as canonical. The earlier three remain preserved as
historical evidence of the lineage's development, per this document's
non-deletion, non-rewriting constraint (§0 of the governing execution
prompt).

---

## 10. ADR Governance Rules

Formalized, effective for future ADRs (not retroactively applied to
ADR-001/002/003, which are not rewritten by this document — see §11):

Before accepting any new ADR that changes an architecture boundary, the
author MUST inspect:

- Founder decisions;
- Architecture Freeze (`docs/ARCHITECTURE_FREEZE_BASELINE.md`);
- Master Architecture (`docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`);
- the relevant Technical Design document(s);
- the relevant gate document(s), if any;
- current ADR/Source-of-Truth records;
- the current implementation contract, if applicable.

If a relevant Technical Design document exists, the ADR **must** reference
it, or explicitly record: *"No applicable TD rule found."* An ADR must
never silently omit a relevant higher-authority architecture source.

### No Silent Architectural Drift Rule (formalized)

*"An ADR may refine or operationalize an existing architectural decision,
but cannot silently supersede a Founder-approved Freeze or Technical
Design."*

If an ADR intentionally proposes a change to a higher-authority decision,
the required sequence is:

```text
Existing authority
        ↓
Conflict/change identified
        ↓
Founder decision / explicit approval
        ↓
Updated governance artifact
        ↓
Implementation contract
        ↓
Implementation
```

No shortcut is permitted at any step.

### ADR Naming Collision

**[EVIDENCE, as originally recorded here]** Two documents both use the
identifier "ADR-001" in this repository:
`docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md` and the
"ADR-001" section inside `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`. This
is a naming collision, not a silent conflation — every citation of the
former by ADR-002/ADR-003 uses its full path, so no confusion has occurred
in practice to date. Neither file is renamed by this document.

**This original framing understated the collision's true scope.** A
dedicated GOV-04 read-only investigation (2026-08-24) built a complete
repository-wide ADR inventory and found identifier reuse across **three**
separate namespaces, not two, and at four identifiers, not one:

- **ADR-001** (2 documents): `docs/adr/ADR-001-WEB-RESTORE-AUTH-FOUNDATION-BOUNDARY.md`; `ARCHITECTURE_DECISIONS.md` §ADR-001.
- **ADR-002** (3 documents): `docs/adr/ADR-002-IDENTITY-BOUNDARY.md`; `docs/adr/ADR-002-CORE-FOUNDATION-APPLICATION-DOMAIN-BOUNDARY.md` (an internal duplicate within `docs/adr/` itself); `ARCHITECTURE_DECISIONS.md` §ADR-002.
- **ADR-003** (3 documents): `docs/architecture/ADR-003-persistence-stack.md`; `docs/adr/ADR-003-RESOURCE-ACCESS-BOUNDARY.md`; `ARCHITECTURE_DECISIONS.md` §ADR-003.
- **ADR-004** (3 documents): `docs/architecture/ADR-004-domain-identity-modeling.md`; `docs/adr/ADR-004-MIGRATION-GOVERNANCE.md`; `ARCHITECTURE_DECISIONS.md` §ADR-004.
- **ADR-005, ADR-006** (`docs/architecture/` only): unique, no collision.

The investigation found this is **identifier reuse / namespace ambiguity,
not a substantive architectural conflict**: every colliding set represents
materially different decisions (e.g. ADR-002-IDENTITY-BOUNDARY defines the
Core identity primitive; ADR-002-CORE-FOUNDATION-APPLICATION-DOMAIN-BOUNDARY
defines application/domain layering — unrelated topics that happen to
share a number). No content-level contradiction was found in any
collision. No pair of colliding documents was found to represent the same
decision. No document explicitly claims authority over, or supersedes,
any other colliding document.

### Founder Decision — GOV-04 Scope Expansion & Historical Namespace
Treatment (2026-08-24)

**A. GOV-04 scope, expanded:** GOV-04's recorded scope is formally
expanded from the previously recorded ADR-001-only collision to the
complete repository-wide identifier collision above (ADR-001 through
ADR-004, across `docs/architecture/`, `docs/adr/`, and
`docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`, including the internal ADR-002
duplicate inside `docs/adr/`). This is recorded as identifier reuse /
namespace ambiguity, not a substantive architectural conflict.

**B. Historical namespace treatment:** For the purpose of current
governance interpretation, `docs/architecture/` and `docs/adr/` are
treated as **historical / closed ADR tracks**. Their files remain
physically untouched; their identifiers are preserved as historical
identities; their content is not rewritten; they are not renumbered,
renamed, merged, deleted, or moved by this decision. **This is a
governance-interpretation treatment, not a factual claim.** It must not
be read as proof that any individual ADR was formally superseded by
another, must not be read as proof that one historical ADR was replaced
by another, and does not infer authority merely from chronology. "Closed
track" describes the absence of an active governance program adding new
ADRs to those directories going forward — it does not mean the documents
are invalid, incorrect, or without historical value.

**C. Current DECIVEXA ADR track:** This decision does **not** declare that
the ADRs in `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md` automatically
outrank, replace, or supersede the historical ADR files, and it creates no
new authority hierarchy. The existing Founder-approval status of
individual `ARCHITECTURE_DECISIONS.md` entries (ADR-001 through ADR-004)
remains governed exactly by their own existing evidence and records,
unaffected by this decision.

**D. Future ADR naming discipline (principle only):** From this point
forward, new ADR creation should use an explicitly identifiable repository
governance namespace; a future ADR must not rely on a bare numeric
identifier alone as its sole identity where that number could be
ambiguous across repository namespaces. **The exact naming convention is
not chosen here** — not global sequential numbering, not directory- or
domain-qualified identifiers, not a namespace-prefix scheme, nor any
other specific convention. That remains a separate, future,
Founder-controlled ADR Namespace Design decision.

**E. Explicitly left open:** the exact future ADR naming convention;
retroactive renumbering or renaming of any existing ADR; migration or
deletion of historical ADRs; merging any of the three namespaces;
individual reclassification of any of the 8 orphaned standalone ADRs;
any claim that a historical ADR was formally superseded; and any change
to Architecture Freeze. None of these is decided here.

---

## 11. Roadmap Governance Rules

`docs/DECIVEXA_MASTER_ROADMAP.md` is formally positioned as: **strategic
execution roadmap + current sequencing authority + phase navigation** —
**not** a replacement architecture authority.

The Roadmap may point to Architecture Freeze, Master Architecture, TD
documents, ADRs, Implementation Contracts, gates, and evidence. It must not
silently redefine any of them. This positioning is recorded here and
additionally noted, non-destructively, as an appended addendum inside the
Roadmap document itself (see the companion edit to
`docs/DECIVEXA_MASTER_ROADMAP.md`, appended strictly after its two
Founder-supplied verbatim parts, which remain untouched).

---

## 12. Increment Contract Governance Rules

Formalized, effective for future Increment Contracts:

All future Increment Contracts must include, where applicable:

- `Architecture Baseline: DECIVEXA-ARCH-FREEZE-001 / v1.0.0`;
- relevant ADR(s);
- relevant TD(s);
- relevant Gate(s).

---

## 13. Increment 007 Reconciliation Finding

**[EVIDENCE]** `docs/IMPLEMENTATION_INCREMENT_007_CONTRACT.md` omits the
`Architecture Baseline` field present in Increment Contracts 004–006. This
is recorded as a **governance-drift finding**, not retroactively corrected.
Increment 007's own Contract document is not modified by this
reconciliation (out of scope per §0 and §19 of the governing execution
prompt; correcting it would itself require separate explicit
authorization).

### Increment 007 architectural validity — reaffirmed

**Increment 007 is architecturally valid.** Reasons (unchanged from the
preceding investigation, reaffirmed here):

- backend owns Personal State;
- identity is derived exclusively from verified token claims;
- the client cannot select an arbitrary user identity;
- revision-based optimistic concurrency is enforced;
- a revision conflict returns `409`;
- no client-side merge authority exists;
- no cross-domain write occurs;
- no AI authority is exercised;
- no closed domain (PI Core, Memory, Evidence) is reopened.

No newly discovered document in this reconciliation contradicts this
finding. Increment 007's implementation is not changed by this document.

---

## 14. Personal State Taxonomy Gap

**[EVIDENCE]** "Personal State" — as actually implemented (timezone,
locale, availability, revision) and as governed by ADR-003 — does not
appear as a named canonical domain anywhere in TD-02 (either artifact (1)
or artifact (2)), nor in `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
(confirmed by direct full-text checks across all three documents this
session and the prior one).

**Classification: Taxonomy / documentation gap — NOT an implementation
conflict.** No document forbids or contradicts Personal State's existing
implementation; the domain simply has no explicit named slot in the
existing TD-02 domain maps. No new TD domain is invented by this document.
TD-02 is not reopened. No code is changed.

Recorded as a governance backlog item (§19, GOV-03) for a future,
separately authorized reconciliation.

---

## 15. ADR Naming Collision

See §10 above (ADR Naming Collision) — recorded there to keep the ADR
governance material in one place. Cross-referenced here per the required
section list.

---

## 16. No Silent Architectural Drift Rule

Formalized in §10 above (ADR Governance Rules) and restated here as a
repository-wide principle, applicable beyond ADRs specifically: **no
governance artifact at any layer (Roadmap, Source of Truth, ADR,
Implementation Contract) may silently change the authority status of a
higher-layer document.** Any such change requires an explicit Founder
decision, recorded as such, before the change takes effect. This document
observes, and does not violate, that rule: it changes no authority status
and creates no new authorization.

---

## 17. Future Domain-Expansion Gate

Formalized: before any future increment involving Evidence exposure, Human
Understanding, PI Core reopening, Memory reopening, a new domain,
cross-domain ownership, new persistent state, a new authority boundary, or
AI authority, the implementation **must** first perform a governance
compatibility check against:

- Architecture Freeze;
- TD-02 (artifact (1), per §7's determination);
- TD-03, TD-04, and other relevant TDs;
- relevant ADRs;
- Master Architecture;
- Roadmap;
- Source of Truth.

No implementation may begin if a genuine, unresolved authority conflict is
identified during that check.

---

## 18. Founder Approval Requirements

The following remain explicitly Founder-controlled and are **not** decided
or changed by this document:

- changing Architecture Freeze;
- superseding a Founder-approved TD;
- reopening PI Core;
- reopening Memory;
- exposing Evidence;
- introducing Human Understanding implementation;
- changing domain ownership;
- changing architectural constitution;
- changing security/privacy authority;
- changing AI authority;
- deleting or renaming historical governance artifacts.

No such change appeared necessary during this reconciliation. None is
proposed for execution here.

---

## 19. Governance Backlog Items

Recorded here because no existing dedicated Architecture Backlog file was
found in the repository (`docs/FIS-REGISTRY.md` exists but is scoped to
FIS capability registration, not general governance backlog items). Not
implemented; recorded only.

- **GOV-01 — Layer γ / Freeze cross-reference.** Formalize bidirectional
  navigation between Layer γ, Architecture Freeze, the TD chain, and Master
  Architecture (this document is a first step; a future action could add
  reciprocal pointers inside the TD chain itself, which this document does
  not modify).
- **GOV-02 — TD-02 duplicate artifact hygiene.** *Classification of the
  third variant is now resolved* — per the Founder Decision in §8 above,
  `docs/technical-design/TD-02-DOMAIN-BOUNDARIES.md` is classified
  Historical-Proposed Early Draft — Non-Operational — No Current
  Authority. The **physical document-hygiene question remains open**: all
  three TD-02 files still coexist in the repository, unrenamed, undeleted,
  unmerged; no such action has been authorized. Resolving that physical
  coexistence — and potentially correcting artifact (2)'s header to
  reflect its Tier-3 status — remains a future, separately authorized
  governance action.
- **GOV-03 — Personal State taxonomy.** Determine whether Personal State
  should eventually receive an explicit canonical-domain classification in
  TD-02 or a successor document.
- **GOV-04 — ADR namespace collision.** *Scope expanded and historical
  namespace treatment recorded* — per the Founder Decision in §10 above,
  the collision spans ADR-001 through ADR-004 across three namespaces
  (`docs/architecture/`, `docs/adr/`, `ARCHITECTURE_DECISIONS.md`), and
  `docs/architecture/`/`docs/adr/` are treated as historical/closed ADR
  tracks for governance interpretation (not formally superseded, not
  renamed/merged/deleted). **Still open:** the exact future ADR naming
  convention; any retroactive renumbering, renaming, or migration; and
  individual reclassification of the 8 orphaned standalone ADRs. No such
  action has been authorized.
- **GOV-05 — Evidence/HU pre-expansion reconciliation.** Before expanding
  Evidence or Human Understanding, perform a TD-04-and-later compatibility
  verification (§17, Future Domain-Expansion Gate).

---

## 20. Final Reconciliation Status

**PARTIALLY FORMALIZED — EVIDENCE-BACKED — NOT FOUNDER-APPROVED.**

- Layer γ is formally positioned as complementary to, not superseding,
  the Architecture Freeze / TD chain (§4).
- The Authority Hierarchy and Evidence Hierarchy are explicitly
  distinguished (§3).
- TD-02 operational authority is documented, with its evidentiary basis
  made explicit and its limits disclosed (§7).
- The third TD-02 variant's classification is now Founder-decided
  (Historical-Proposed Early Draft — Non-Operational — No Current
  Authority, §8); its physical document-hygiene coexistence with
  Artifacts A and B remains open (§19, GOV-02).
- Master Architecture's and the Roadmap's roles are documented (§5, §11).
- ADR governance rules, the No-Silent-Drift rule, and the ADR naming
  collision are formalized/recorded (§10, §16).
- Increment Contract citation discipline is documented, and Increment
  007's omission is recorded as a finding, not corrected (§12, §13).
- The Personal State taxonomy gap is recorded as a backlog item, not
  resolved (§14, GOV-03).
- No architecture is weakened, no closed domain is reopened, no new domain
  is introduced, no implementation scope is expanded, and Increment 007
  remains valid (§13, §18).

Open items requiring a future, separately authorized action: GOV-01,
GOV-02's remaining physical document-hygiene question, GOV-03, GOV-04,
and GOV-05 (§19); and any decision to correct either TD-02 file's
self-declared header text (§7). The third TD-02 variant's classification
question (§8) is resolved and is no longer an open item.
