# Cross-Claim Matching — Decision 7 Architectural Decision

## 1. Artifact Identity

- **Title:** Decision 7 — Cross-Claim Matching Implementation Architecture
  (standalone process record)
- **Artifact ID:** `CROSS-CLAIM-MATCHING-DECISION-7-001`
- **Relationship to prior artifacts:** this is a new, standalone artifact,
  not a revision of `docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md`
  (`CROSS-CLAIM-MATCHING-ARCH-001`). That document remains unmodified,
  untouched by this artifact, and continues to be the sole authority for
  its own Decisions 1–6 and for its own explicit non-approval of Decision
  7 (its §7, §12). This artifact exists because that document's own §12
  Change Control states that "any future change to Decisions 1–7...
  requires its own explicit Founder decision and its own governance
  record" — i.e., a separate record, not an edit to the existing one.
- **Date opened:** 2026-09-02
- **Authority for opening this process:** "FOUNDER AUTHORIZED
  ARCHITECTURAL DECISION INITIATION — DECISION 7 — CROSS-CLAIM MATCHING,"
  itself following a read-only "FOUNDER ARCHITECTURE-READINESS
  DETERMINATION — DECISION 7 / CROSS-CLAIM MATCHING" (concluded READY TO
  OPEN, 2026-09-02), itself following a "DECIVEXA — NEXT-STEP
  DETERMINATION AUDIT" (2026-09-02).
- **Repository baseline at drafting time:** branch `main`,
  `HEAD = origin/main = c876c0f88d0a37d3afcc95fbf06dd5c9262837c6`,
  divergence `0/0`. Protected file
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` present, unstaged,
  untouched (MD5 `972ad36e523aa42e540f2c28a3aac801`) — this artifact does
  not amend, replace, or touch that file.

## 2. Status

**ARCHITECTURE DECISION IN PROCESS — AWAITING FOUNDER DECISION. DECISION
7 REMAINS NOT APPROVED. NOTHING IN THIS DOCUMENT AUTHORIZES
IMPLEMENTATION, A CONTRACT, A SCHEMA CHANGE, OR ANY CODE.**

This document analyzes candidate architecture for Decision 7. It selects
nothing on the Founder's behalf. Every substantive architectural choice
below is explicitly marked `AWAITING FOUNDER DECISION`. Writing,
reviewing, or committing this document does not constitute approval of
any option it describes.

## 3. Founder Authorization Record

| Act | Authorization | Grants |
|---|---|---|
| Opening this Architectural Decision process | "FOUNDER AUTHORIZED ARCHITECTURAL DECISION INITIATION — DECISION 7," 2026-09-02 | Permission to draft this artifact only |
| Decision 7 itself (Cross-Claim Matching Implementation) | **None exists** | Nothing — remains NOT APPROVED |
| Any option selected below | **None exists** | Nothing — every option remains a candidate only |
| Implementation of anything described below | **None exists** | Nothing |

No Founder approval is inferred, assumed, or backdated anywhere in this
document from the fact that this process was opened.

## 4. Problem Statement

DECIVEXA's Personal Intelligence Core (PIC) now persists a growing body
of individually-scoped Claims, each independently evidenced, versioned,
confirmable, temporally-bounded, and contextualized (per the seven-axis
ontology, §6 below). Nothing in the current architecture relates one
Claim's content to another's. Decision 7 is the still-unapproved question
of whether, and how, DECIVEXA should ever compute or represent that a
relationship *might* exist between two Claims, based on their content —
as distinct from Relationship (already approved, Decisions 3–6), which
lets a human or an external process *record* that a relationship exists,
but never *discovers* one.

**What Decision 7 is not**: it is not a request to build a specific
matching pipeline. It is the prior question of whether DECIVEXA should
have a content-driven discovery mechanism for Relationships at all, and
if so, what its architectural shape and boundaries must be.

## 5. Context — What Already Exists (Founder-Approved, Unaffected)

Restated as input, not reopened by this document, per each source's own
protection language:

- **Claim / ClaimVersion** (D1/D2): immutable, versioned, owned by a
  single user, carrying `valueText`/`claimType`/`provenance`/
  `confidence`/`lifecycle`.
- **Evidence / Evidence Linkage State** (D1, PIC Ontology §3.1):
  `linked`/`self_reported_no_evidence_required`/`linkage_pending`,
  database-enforced 1:1 with `evidenceVersionId`.
- **User Confirmation (C3)** (PIC Ontology §3.3): append-only
  confirmation-event log, `claimVersionId`-scoped, never carrying forward
  across corrections.
- **Temporal Validity**: `effectiveFrom`/`effectiveTo` on ClaimVersion.
- **Personal Intelligence Context**: `situationSetting`/`timeOfDay` at
  ClaimVersion granularity.
- **D3 Inference Provenance**: a structurally separate, immutable,
  evidence-grounded Inference record with its own append-only lifecycle
  (`proposed`/`confirmed`/`rejected`/`disputed`/`stale`), never silently
  promotable to a Claim.
- **D3 Claim Promotion**: an explicit, separately-scoped write path that
  lets a human-triggered action turn an Inference into a Claim; no
  automatic promotion exists anywhere in the codebase.
- **Relationship / Relationship Evidence** (Decisions 3, 5): a
  first-class, immutable, evidence-grounded artifact linking two specific
  ClaimVersions; three orthogonal classification axes (Relationship Type,
  Certainty, Confirmation State); no matching/discovery mechanism
  populates it — every existing Relationship row must be
  externally/manually supplied.
- **Matching-Hypothesis Confirmation** (Decision 6): a third, independent
  confirmation mechanism, structurally proven, that lets a *hypothesized*
  Relationship (one whose `provenance = 'ai_hypothesis'`) be confirmed or
  rejected by a human — but nothing today ever creates such a hypothesis;
  the mechanism exists and is fully built, but stands empty of any
  producer.
- **Memory**: a structurally independent system (own schema, own
  lifecycle vocabulary), not integrated with PIC.
- **AI Gateway / AI Runtime**: exists in-process, with a capability
  registry, model router, and Gate 1–7 controls; no PIC use-case anywhere
  in this codebase is AI-Gateway-coupled (confirmed by direct repository
  search, repeated across multiple audits this session).

**An existing precedent, not a precommitment**: Matching-Hypothesis
Confirmation is recorded here only as an existing architectural
precedent, potentially relevant to a future Decision 7 design — evidence
that DECIVEXA already has a mechanism for user-confirmable hypotheses in
another context (Relationship-classification confirmation). **This
precedent does not constrain the eventual Decision 7 output
representation. It does not prove that Decision 7 must use it. It does
not constitute authorization for Decision 7. Its existence must not be
interpreted as an architectural decision for Decision 7, by this document
or any future reader of it.** Whether a future Decision-7 design uses
this mechanism, a different mechanism, or no persisted mechanism at all
remains entirely open — see §8.A, §8.I, and §20.

## 6. Seven-Axis Ontology as Architectural Input

| Axis | Relevance to Decision 7 | New axis needed? |
|---|---|---|
| Domain/Category (Subject/Attribute/Value) | Directly load-bearing — "what is being matched" (§8.A below) is fundamentally a question about these three sub-concepts | No — existing axis |
| Epistemic Type/Provenance | A discovered candidate relationship's `provenance` would be `ai_hypothesis`, an existing value | No — existing axis |
| Lifecycle | Not directly implicated — Relationship rows are already immutable; Decision 7 would only ever produce new rows, never mutate existing ones | No |
| Confidence | Directly implicated by §8.D — whether/how a candidate carries an uncertainty signal | No new axis — but see §7 (Algorithm Firewall): no scoring mechanism is designed or approved here |
| Temporal Validity | Directly implicated by §8.F | No — existing axis |
| User Confirmation | Directly implicated by §8.E — Matching-Hypothesis Confirmation already exists for exactly this | No — existing mechanism, not a new axis |
| Evidence Linkage State | Directly implicated by §8.C | No — existing axis |

**No new ontology axis is proposed, required, or implied by this
document.** Every dimension Decision 7 would need to reason about maps
onto one of the seven already-approved axes, or onto Relationship's
already-approved three-axis taxonomy (Relationship Type, Certainty,
Confirmation State — Decision 4). Where a concept below does not map
cleanly onto an existing axis, it is flagged explicitly in §15
(Deferred Questions) as **a new architectural concept requiring its own
future Founder decision** — never silently folded into an existing axis
merely for convenience.

## 7. Scope of This Document

**IN SCOPE**: architectural analysis of what Decision 7 could mean;
identification of candidate approaches and their trade-offs; explicit
identification of unresolved questions; explicit identification of risks;
identification of what a future Implementation Increment Contract would
need to specify, if Decision 7 is ever approved.

**OUT OF SCOPE (this document authorizes none of the following, and none
of the following is designed, selected, or implemented here)**:
matching/similarity/ranking algorithms; candidate-generation logic;
automatic Relationship creation; automatic reconciliation, merging, or
conflict resolution; contradiction-detection implementation or scoring;
Living User Model; automatic user profiling; any new database table,
column, or migration; any API/controller/UI; AI Gateway or AI Runtime
integration; background workers or scheduled pipelines; Model Router or
Capability Registry integration; Decision Engine, Goal OS, or Daily OS
integration; **the vision-level Context Fusion Engine** — distinct from
the already-shipped, Claim-Level Personal Intelligence Context this
document treats as input (§5, §8.A framing 2); the Context Fusion Engine
does not currently exist in this repository, is not an approved Decision
7 dependency, is not designed or defined here, and no future Context
Fusion Engine architecture may be inferred from anything in this
document; **Memory** — a structurally independent system (§5), which
Decision 7 does not redesign, integrate, or change the semantics of, and
which must not become an implicit Decision 7 dependency merely because
this document discusses it as context.

## 8. Core Architectural Questions

### A. What is being matched?

Four candidate framings, not mutually exclusive:

1. **Claim-to-claim comparison** — comparing the content of two
   ClaimVersions directly (Subject/Attribute/Value proximity).
2. **Claim-to-context comparison** — using Personal Intelligence Context
   (`situationSetting`/`timeOfDay`) as a filtering or grouping dimension
   rather than a comparison target in its own right.
3. **Claim-to-evidence comparison** — whether two Claims cite overlapping
   or related Evidence.
4. **Claim-to-relationship hypothesis** — treating the *output* as a
   candidate Relationship row (already-approved shape, §5) rather than
   any new entity.

**AWAITING FOUNDER DECISION**: whether Decision 7's scope is (1) alone,
some combination, or something else. This document does not assume an
answer. Framing 4 (the output shape) is the one item here with an
existing, ready-made precedent (Matching-Hypothesis Confirmation) and is
noted as architecturally convenient, not as a Founder-approved answer.

### B. What constitutes a legitimate relationship?

The candidate relationship-semantics vocabulary listed in the authorizing
directive (`supports`, `depends_on`, `enables`, `constrains`,
`conflicts_with`, `refines`, `supersedes`, `temporal_sequence`,
`causal_candidate`, `contextual_relatedness`) is recorded here **as
candidates surfaced for Founder consideration only** — none is approved,
none is rejected. It is also noted that Relationship's own Founder
Decision 4 already approved a *different*, five-value Relationship Type
vocabulary for the *already-shipped* Relationship + Relationship Evidence
increment (`successive_state`, `refinement`, `contradiction`,
`contextual_variation`, `related_fact`, per
`docs/gates/PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md`
§11.1). **AWAITING FOUNDER DECISION**: whether Decision 7 reuses that
existing five-value vocabulary unchanged, extends it, or requires its own
distinct vocabulary for discovered (as opposed to manually-declared)
relationships. This document does not assume the existing vocabulary is
either sufficient or insufficient.

### C. What evidence is required?

Candidate positions, not decided here:

- A discovered candidate relationship could be required to cite
  Relationship Evidence (mirroring Invariant 4's mandatory-evidence
  pattern already enforced for D3 Inferences) before it may be persisted
  at all.
- Alternatively, a discovered candidate could be permitted to exist
  evidence-free until a human supplies evidence during confirmation.

Existing precedent (D3 Inference's Invariant 4: mandatory direct evidence
before persistence) weighs toward the first position, but this document
does not select between them. **AWAITING FOUNDER DECISION.**

### D. What is the role of uncertainty?

Candidate representations for a discovered relationship's epistemic
status: a fact (rejected outright — nothing discovered by inference
alone should ever be recorded as settled truth, consistent with every
existing AI-safety invariant in this codebase); a hypothesis (matches
Relationship's existing `provenance = 'ai_hypothesis'` value and
Matching-Hypothesis Confirmation's existing `confirmationState =
'pending'` state — no new mechanism required); an inference (would
implicate D3's Inference model, which is explicitly scoped to
individual-Claim epistemic status, not relationships between Claims — D3
is not designed to represent this and this document does not propose
extending it to); a candidate (a weaker-than-hypothesis state with no
existing precedent).

**The `confidence` field must not silently become an approved scoring
algorithm** (per the authorizing directive's explicit instruction). No
scoring mechanism, numeric formula, or algorithm is designed, selected,
or approved anywhere in this document. **AWAITING FOUNDER DECISION**:
which of the above framings, if any, Decision 7 should adopt.

### E. Human confirmation

Analysis of existing precedent: C3 (Claim confirmation) and
Matching-Hypothesis Confirmation (Relationship-classification
confirmation) both already establish, as Founder-approved architecture,
that no AI-generation code path may write a `'confirmed'` event or
transition a hypothesis to a confirmed state — confirmation is
exclusively human-triggered in both existing mechanisms. This document
records that precedent as strong existing evidence against ever allowing
a Decision-7-produced relationship to become durable/semantically
meaningful without explicit human confirmation, but **does not itself
extend that rule to Decision 7** — that extension is itself a Founder
decision, even if a well-precedented one. **AWAITING FOUNDER DECISION.**

**Human confirmation as a central governance gate.** A discovered match,
candidate, or hypothesis must not be silently treated as established
user knowledge merely because it was produced by a future Decision 7
mechanism. The conceptual progression — machine-generated possibility →
candidate → hypothesis → potential relationship → user-confirmed
relationship — is one plausible operational flow consistent with §20.1's
taxonomy, **not a flow this document mandates any future architecture to
use**. This subsection elevates the confirmation question's importance
without deciding it: **whether confirmation is mandatory, and at which
stage it would occur, are not decided here** — they are recorded as a
central, unresolved architectural governance gate that must be
explicitly and separately decided by the Founder before any
implementation authorization, not merely a detail among the other open
questions in §23.

### F. Temporal reasoning

Candidate considerations, not resolved: simultaneous claims (same or
overlapping `effectiveFrom`/`effectiveTo`); sequential claims (one's
`effectiveTo` at or before another's `effectiveFrom`); expired claims
(whether a Claim whose validity has lapsed should still be eligible for
matching;); overlapping validity (partial overlap distinct from full
simultaneity); future-dated claims; historical/superseded claims (whether
only the current active ClaimVersion, or any historical version, is
eligible). Temporal Validity's existing `effectiveFrom`/`effectiveTo`
fields are sufficient to *represent* all of these distinctions; no new
temporal field or mechanism is proposed. **AWAITING FOUNDER DECISION**
on which of these temporal relationships, if any, should be architecturally
significant to Decision 7, and none is designed or implemented here.

### G. Contradiction and conflict

Three candidate framings: in scope (Decision 7 directly addresses
detecting when two Claims conflict); out of scope entirely (contradiction
handling deferred indefinitely); a future, separate architectural
capability building on whatever Decision 7 establishes (most consistent
with the PIC Ontology Decision Record's own §12, which already recognized
"Contradiction, refinement, temporal change, contextual variation, and
source disagreement... as distinct future relationship semantics," while
explicitly deferring their implementation — "None is implemented now; no
relation table is created now"). This document does not select among
these. **AWAITING FOUNDER DECISION.** No contradiction-detection logic or
scoring is proposed, designed, or implemented anywhere here.

**Contradiction is not itself matching.** Whichever framing above is
eventually chosen, **matching is not itself contradiction detection, and
a possible match must not silently become a contradiction merely because
two Claims appear incompatible.** If contradiction semantics are ever
defined, they would need their own threading through the §20.1
Match/Candidate/Hypothesis/Relationship/Confirmed-Relationship
progression (e.g., a distinction between a possible conflict, a conflict
candidate, a contradiction hypothesis, and a confirmed contradiction),
exactly as any other discovered relationship semantics would. This
document does not perform that threading, does not define contradiction
algorithm or semantics, and does not select among the framings above —
any future contradiction semantics must be explicitly defined at the
appropriate architectural layer and must respect existing Claim/
ClaimVersion semantics, Temporal Validity, Evidence, provenance,
confirmation, and the existing Relationship semantics (§9), all of which
remain unmodified by this document.

### H. Explainability

If Decision 7 is ever approved and implemented, whatever mechanism it
authorizes would need to be able to state, at minimum, for any candidate
relationship it produces: why the relationship was proposed; which
specific ClaimVersions participate; what Relationship Evidence (if any,
per §8.C) supports it; the temporal context considered; the provenance of
each participating Claim; the confirmation state of the candidate itself;
and its uncertainty framing (per §8.D). This is recorded as a
**requirement any future implementation would need to satisfy**, not as
a system being designed or built here.

### I. Persistence

Candidate representations, not decided: persisted immediately as a
Relationship row with `provenance = 'ai_hypothesis'` (uses 100% existing
schema, zero new tables — the most minimal candidate); persisted through
a new, distinct "candidate" or "hypothesis" abstraction separate from
Relationship (would require new schema, not designed here); ephemeral,
never persisted until a human acts on it (would require a request/response
architecture with no current precedent in this codebase, since every
existing PIC mechanism is repository-only with no API layer, per §5).
**AWAITING FOUNDER DECISION.** No schema or migration is created,
proposed in concrete form, or implemented by this document.

**Ephemeral matching vs. explainability/provenance (unresolved
architectural tension, not decided here).** If intermediate
matching/candidate information is ever made ephemeral (never persisted),
future explainability (§8.H) and provenance retention may become
incomplete or impossible for anything that was never captured in the
first place. Any future persistence decision must reconcile
explainability, provenance, auditability, retention, and
privacy/data-minimization against whatever minimum information is
required to explain why a candidate or hypothesis was produced. **This
document does not choose a persistence approach, does not decide a
retention duration, and does not introduce a storage schema — this
remains an explicitly unresolved architectural question**, alongside
every other item in §8.I and §23.

### J. AI boundary

Candidate postures: AI required (Decision 7 cannot function without an AI
capability); AI optional (a deterministic, rule-based candidate-generation
path could exist independently of any AI capability, with AI as one
possible future producer among others); AI advisory only (an AI-Gateway
capability could *propose* candidates but never itself write a
Relationship row — enforced structurally, the same way D3 Inference
enforces that no AI-generation code path may write a `'confirmed'`
lifecycle event); AI prohibited from persistence entirely. Existing AI
Gateway/Runtime governance (Gate 1–7, capability registry, no PIC
use-case ever AI-Gateway-coupled today) is treated as the controlling
precedent for whichever posture is eventually chosen — this document does
not choose one. **AWAITING FOUNDER DECISION.** No AI integration exists,
is proposed in concrete form, or is implemented anywhere in this
document.

## 9. Relationship Semantics (Candidates Only)

Restated from §8.B for structural completeness: the candidate vocabulary
surfaced in the authorizing directive is recorded verbatim as candidates
for Founder consideration, alongside the already-approved,
already-shipped five-value Relationship Type vocabulary (§8.B). **No
relationship type, existing or candidate, is approved or rejected by this
document for Decision-7 purposes.**

## 10. Evidence / Provenance Requirements (Candidates Only)

See §8.C/§8.D. No mandatory-evidence rule, provenance rule, or
confidence-representation rule is adopted by this document; each is
recorded as an open question for the Founder decision section (§27).

## 11. Temporal Requirements (Candidates Only)

See §8.F. No temporal-matching rule is adopted.

## 12. Confirmation Requirements (Candidates Only)

See §8.E. The existing precedent (C3, Matching-Hypothesis Confirmation:
confirmation is exclusively human-triggered) is recorded as strong
existing evidence, not as an automatically-extended rule.

## 13. Explainability Requirements

See §8.H — a requirements list for any future implementation, not a
system design.

## 14. Persistence Boundary

See §8.I. If Decision 7 is ever approved with the "persist as a
Relationship row" candidate (§8.I), the *existing* Relationship schema
(`personal_intelligence_relationships`, `personal_intelligence_relationship_evidence`)
would require **no new column and no new table** to represent a
discovered candidate — `provenance = 'ai_hypothesis'` and
`confirmationState = 'pending'` already exist as valid values. This is
recorded as an architectural observation about the *cost* of one
candidate option, not as a decision to adopt it.

**Relationship schema-reuse boundary (non-binding future constraint).**
If the existing Relationship representation is ever considered as a
persistence/output option for Decision 7 candidates or hypotheses,
**unconfirmed candidates/hypotheses must not automatically be treated by
consumers as established Relationships.** Any future architecture that
adopts this option would need to explicitly account for the distinction
between candidate/hypothesis state, confirmation state,
provenance/source, and lifecycle/state, before reuse could be considered
safe — this document does not decide whether the existing Relationship
table will be reused, whether a new table will be created instead,
whether candidates will be persisted at all, or what filtering mechanism
(if any) would separate discovered candidates from declared
Relationships for any future consumer. This is recorded only as a future
architectural constraint/decision point, not as a resolution of §8.I.

## 15. AI/Runtime Boundary

See §8.J. Governing precedent restated: Gate 1–7's existing AI Runtime
controls, the Capability Registry, and Model Router all already exist and
are unmodified by this document; whatever posture Decision 7 eventually
adopts must operate within those existing controls, not bypass or extend
them without its own separate Founder decision.

## 16. Governance Boundary

This document, and the process it opens, operates entirely within the
boundary the authorizing directive establishes: architecture analysis
only. No schema, migration, code, test, API, or AI integration is
created, modified, or implied as approved by any section above. Every
substantive architectural choice is marked `AWAITING FOUNDER DECISION`
in §27.

## 17. Living User Model Boundary (Firewall)

**Cross-Claim Matching (Decision 7) and Living User Model are distinct,
non-interchangeable concepts and remain governed by separate Founder
decisions.** The approved dependency chain (`docs/DECIVEXA/CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md`
§8/§16, `docs/DECIVEXA/PROJECT-CONTINUATION-CHECKPOINT.md` §4.G) places
Living User Model *after* Cross-Claim Matching Implementation, but
sequencing is not authorization: nothing in this document treats opening
Decision 7's architecture process as preparation for, or partial
authorization of, Living User Model. **Living User Model remains NOT
AUTHORIZED**, unaffected by anything in this document. Any future
relationship between the two is recorded here only as a sequencing/
dependency observation, never as an implied grant.

## 18. Algorithm Firewall

**No algorithm is approved, selected, designed, or implemented by this
document.** The following are explicitly not decided, designed, or
implied as necessary here: cosine similarity; embeddings; vector search;
semantic similarity; graph algorithms; ranking functions; scoring models;
heuristic matching; LLM-based matching; candidate-generation algorithms;
contradiction algorithms. Where any of these could plausibly become
relevant to a future implementation of whatever Decision 7 eventually
authorizes, they are recorded in §23 (Deferred Questions) as unresolved
future design questions — never as a chosen mechanism.

## 19. Verification Limitation (Carried Forward)

**LIVE POSTGRESQL VERIFICATION OUTSTANDING — NO VERIFICATION ATTEMPT OF
ANY KIND FOUND**, for the great majority of the existing prerequisite
increments this document treats as architectural input (§5) — with the
partial exception of Relationship + Relationship Evidence, which has
direct-but-not-persisted evidence of one temporary verification pass.
This limitation does not block architectural reasoning (consistent with
the preceding Architecture-Readiness Determination's own §10 finding),
but **must be carried forward as an explicit blocker on any future
Decision-7 implementation-authorization act**, independent of whatever
this architecture process eventually concludes. No infrastructure
provisioning or runtime verification is attempted by this document.

## 20. Governing Terminology (for this document only)

### 20.1 Matching ≠ Relationship — Non-Collapse Boundary

**MATCHING is a discovery/comparison activity. RELATIONSHIP is the
already-approved, durable domain declaration artifact (Decisions 3–6).
These are not the same thing, and this document does not assume, imply,
or design any automatic path from one to the other.** Specifically: **a
matching result must not automatically become a Relationship; a
candidate must not automatically become a Hypothesis; a Hypothesis must
not automatically become a confirmed Relationship.** Five distinct
concepts are used in this document's analysis, in increasing order of
formality:

1. **Match / Matching** — a possible correspondence or relevance signal
   discovered between Claims or other eligible objects. A term of art
   used in this document's analysis only, not an approved schema
   concept.
2. **Candidate** — a proposed item for further consideration, arising
   from one or more matches.
3. **Hypothesis** — a semantically framed proposition about a possible
   relationship or connection, arising from one or more candidates.
4. **Relationship** — a durable domain declaration representing a
   relationship, per the already-approved Relationship architecture
   (Decisions 3–6) — the only one of these five concepts with existing,
   shipped schema.
5. **Confirmed Relationship** — a Relationship whose required
   confirmation conditions have been satisfied, where applicable.

**This document does not define the pipeline connecting these five
concepts, does not decide which representation Decision 7 must use, does
not decide whether every match becomes a candidate, does not decide
whether every candidate becomes a hypothesis, and does not decide whether
every hypothesis becomes a Relationship.** The specific purpose of this
subsection is to prevent the document — or any future reader of it — from
silently assuming `MATCHING → CANDIDATE RELATIONSHIP` as a single,
automatic step. **That assumption is not approved anywhere in this
document.**

### 20.2 Other Terms

- **Discovery** — the act of proposing that a relationship might exist
  (encompassing Match/Candidate/Hypothesis, §20.1), as distinct from
  **declaration** (a human or external process directly asserting a
  Relationship, which is already fully authorized and shipped today,
  requiring no Decision 7 approval at all).
- **Decision 7** — a two-stage distinction, not to be collapsed: **in the
  parent historical governance record** (`CROSS-CLAIM-MATCHING-ARCH-001`
  §7/§16), "Decision 7" denotes the later **implementation-authorization**
  gate for a discovery mechanism — distinct from Decisions 1–6 (all
  approved) and distinct from the Matching-Hypothesis Confirmation
  increment (already shipped, which handles confirming a hypothesis, not
  producing one). **This standalone document represents the preceding
  architectural-decision process and does not itself constitute that
  implementation authorization** — see §2, §26, §27. Writing, reviewing,
  or revising this document does not advance Decision 7 past that
  historical implementation-authorization gate; it remains NOT APPROVED
  until and unless the Founder separately says otherwise.

## 21. Candidate Architectural Approaches

Three high-level candidate postures for what Decision 7 could authorize,
presented for comparison only — **none selected**.

**All examples in this section are illustrative and non-binding. They
are included solely to make the architectural decision space concrete.
No approach is selected or recommended by this document.** None of the
three is a recommendation, a selection, an implementation requirement,
implied architecture, default architecture, or an approved mechanism.

| | **Approach 1 — Narrow, deterministic discovery** | **Approach 2 — AI-advisory discovery** | **Approach 3 — Defer discovery indefinitely** |
|---|---|---|---|
| What it means | A rule-based mechanism using illustrative deterministic comparison criteria (not an algorithm or implementation specification — see note below) proposes candidates, no AI involved | An AI-Gateway capability proposes candidates; no AI-generation path ever persists a confirmed relationship (mirrors D3's existing AI-safety pattern) | Decision 7's architecture question is answered "not yet" — Relationship remains declaration-only indefinitely |
| AI boundary | Prohibited | Advisory only, structurally enforced | N/A |
| Algorithm | Would still require selecting a deterministic rule set (not designed here) | Would still require selecting a capability/prompt design (not designed here) | None |
| Relationship to existing precedent | Does not use the AI Gateway; relies on deterministic logic with no direct precedent of this specific kind in this codebase | Uses the AI Gateway in an advisory capacity, structurally analogous to D3's "AI proposes, human confirms" pattern | Introduces no new mechanism; leaves Relationship declaration-only, as it is today |
| What it would newly introduce | A rule-based candidate-proposal mechanism | An AI-Gateway-integrated candidate-proposal mechanism | Nothing |
| Open questions it would still require | Which comparison criteria, thresholds, and rule set (§18 Algorithm Firewall — none selected here) | Which capability design, prompt shape, and AI Gateway integration boundary (not designed here) | None beyond what already exists |

This comparison is provided to inform the Founder decision in §27, not to
recommend, rank, or score any option.

## 22. Comparison — Summary

No approach above is recommended, ranked, or scored by this document.
Approach 1 does not involve the AI Gateway. Approach 2 involves the AI
Gateway in an advisory capacity only. Approach 3 introduces no new
mechanism. Each approach carries its own distinct set of open questions,
listed in §21's table, none of which is resolved here. **This is offered
as descriptive comparison only, per §21's illustrative/non-binding
statement — not a proposal, recommendation, ranking, or selection of any
kind.**

## 23. Deferred Questions

Explicitly not resolved by this document, requiring a future, separate
Founder decision if ever revisited — none of these is silently resolved
anywhere above:

1. What Decision 7 is fundamentally matching (§8.A).
2. Whether the existing five-value Relationship Type vocabulary is
   reused, extended, or replaced for discovered relationships (§8.B, §9).
3. Whether mandatory evidence-before-persistence applies to discovered
   candidates (§8.C).
4. Which epistemic framing (hypothesis vs. inference vs. candidate)
   applies to a discovered relationship, and whether this requires a new
   architectural concept beyond the seven existing axes (§8.D, §6).
5. Whether human confirmation is mandatory before any discovered
   relationship becomes durable (§8.E).
6. Which temporal relationships are architecturally significant (§8.F).
7. Whether contradiction/conflict detection is in scope, out of scope, or
   a separate future decision (§8.G).
8. Which persistence representation (existing Relationship schema vs. a
   new abstraction vs. ephemeral) is adopted (§8.I).
9. Which AI posture (required/optional/advisory/prohibited) governs
   Decision 7 (§8.J).
10. Whether Approach 1, 2, 3 (§21), or an unlisted fourth approach, is
    selected.
11. The `strength`/`weakness` final semantic placement (carried forward,
    unresolved, from the PIC Ontology Decision Record §4/§20 — not
    reopened or resolved here, and not a dependency of any decision
    above).

## 24. Risks

1. **Scope creep into algorithm selection during this process.** Mitigated
   by §18 (Algorithm Firewall) — this document selects no algorithm.
2. **Conflation with Living User Model.** Mitigated by §17 (firewall).
3. **AI Gateway integration attempted prematurely.** Mitigated by §8.J/§15 —
   no integration performed; posture remains open.
4. **Treating Matching-Hypothesis Confirmation's existing schema as
   implicit pre-authorization for Decision 7's output shape.** The
   observation in §5/§14 that the existing schema *could* accommodate a
   discovered candidate at zero schema cost is a factual, structural
   observation — it is explicitly not treated as authorization for
   Decision 7 itself, which remains a separate, unresolved question.
5. **Verification debt (§19) being forgotten by the time any future
   implementation is proposed.** Mitigated by carrying it forward
   explicitly here, independent of this document's own conclusions.
6. **A future reader treating this document's candidate comparisons
   (§21/§22) as a recommendation.** Mitigated by repeated, explicit
   "AWAITING FOUNDER DECISION" labeling throughout.

## 25. Implementation Prerequisites (If Decision 7 Is Ever Approved)

Listed for completeness, not authorized: a dedicated Implementation
Increment Contract (mirroring every prior PIC increment this session);
resolution of the deferred questions in §23 as explicit Founder decisions
within that Contract or a preceding decision record; live-PostgreSQL
verification of the prerequisite increments this document treats as
foundation (§19), carried forward as an outstanding blocker; and a
separate, explicit Founder implementation-authorization act, exactly
mirroring the gate sequence every other increment in this repository has
gone through.

## 26. Implementation Authorization Status

**IMPLEMENTATION AUTHORIZATION: NOT GRANTED, NOT SOUGHT BY THIS
DOCUMENT.** This document is architecture analysis only. No Implementation
Increment Contract exists yet for Decision 7, and none is created by this
document.

## 27. Founder Decision — Decision 7

**Status: AWAITING FOUNDER DECISION.**

Until the Founder separately reviews and decides on the questions in §23
(and any others this process surfaces): **Decision 7 remains NOT
APPROVED**; Cross-Claim Matching implementation remains **NOT
AUTHORIZED**; no option in §21 is selected; no relationship-type
vocabulary is adopted for Decision-7 purposes; no evidence, confirmation,
temporal, contradiction, persistence, or AI-boundary rule is adopted; no
Implementation Increment Contract may be treated as approved; no schema
may be changed; no code may be written.

## 28. Audit Trail / Revision History

| Date | Event | Authority |
|---|---|---|
| 2026-08-28 | `CROSS-CLAIM-MATCHING-ARCH-001` records Decisions 1–6 approved, Decision 7 explicitly NOT APPROVED | `ef82697` |
| 2026-09-02 | Next-Step Determination Audit identifies Decision 7 architecture-readiness as the strongest candidate next governance act | Read-only audit |
| 2026-09-02 | Architecture-Readiness Determination concludes READY TO OPEN (discussion-readiness only, not approval) | Read-only determination |
| 2026-09-02 | This artifact created, opening the standalone Decision 7 architecture process | "FOUNDER AUTHORIZED ARCHITECTURAL DECISION INITIATION — DECISION 7" |
| — | Founder review of this artifact | **Not yet occurred** |
| 2026-09-02 | Question-led Founder Architectural Review (Questions 1–10) conducted and Founder-answered | Conversational, this session |
| 2026-09-02 | Final Architectural Resolution Summary produced and independently re-audited | Read-only second audit, verdict GREEN |
| 2026-09-02 | This section formally registers the Q1–10 resolution into this artifact | "FOUNDER DIRECTIVE — DECISION 7 FORMAL REGISTRATION & GOVERNANCE RECONCILIATION" |

---

## PRESENT-DAY FOUNDER ARCHITECTURAL RESOLUTION — QUESTIONS 1–10 (2026-09-02)

This section is additive. It formally registers the outcome of a
question-led Founder architectural review conducted entirely in
conversation (never previously written to this file), independently
re-audited for internal consistency (verdict: GREEN), and now recorded
here by explicit Founder direction ("FOUNDER DIRECTIVE — DECISION 7
FORMAL REGISTRATION & GOVERNANCE RECONCILIATION"). It does not delete,
rewrite, or reinterpret §1–§28 above, including §2's original "AWAITING
FOUNDER DECISION" status and §27's original historical "AWAITING FOUNDER
DECISION" language — both correctly describe this document's state
before this registration and remain intact as the historical record.

### Status

**DECISION 7 — CROSS-CLAIM MATCHING: FOUNDER-APPROVED ARCHITECTURE —
IMPLEMENTATION NOT AUTHORIZED.**

This is a present-day architectural approval, effective 2026-09-02. It
is explicitly **not** an implementation authorization, not a Contract
authorization, not a commit/push authorization beyond what a separate
Founder directive grants, and does not retroactively imply that this
status existed before this registration.

### Approved Architectural Core

```
Claim A + Claim B  →  mandatory grounding Evidence  →  type-agnostic Hypothesis
  →  explicit Human Confirmation  →  Relationship (existing 5-value vocabulary)
```

### Mandatory Boundaries (Questions 1–10, Founder-approved exactly as recorded)

1. **Match (Q1).** Match target = same-user ClaimVersion ↔ ClaimVersion
   (Claim-to-Claim). Personal Intelligence Context and Evidence are not
   approved as primary Match targets; they may later be considered as
   filtering/eligibility/support/explainability inputs only, a question
   this registration leaves open.
2. **Hypothesis (Q2).** The epistemic output of a Claim-to-Claim
   comparison is a Hypothesis — never a fact, trusted user knowledge, a
   D3 Inference, a Relationship, or a Confirmed Relationship. It is not
   automatically persisted, confirmed, or elevated.
3. **AI role (Q3).** Advisory only. AI may propose a grounded,
   type-agnostic Hypothesis. AI must never establish a fact, trusted
   knowledge, or a Confirmed Relationship; must never silently convert a
   Hypothesis into a Relationship; must never bypass future governance,
   evidence, temporal, provenance, or confirmation controls.
4. **Human confirmation (Q4).** Mandatory before a Hypothesis may become
   a Relationship at all — not merely before a Relationship becomes
   "confirmed." No unconfirmed Relationship may be created from a
   Hypothesis. AI must never perform or simulate confirmation.
5. **Evidence (Q5).** At least one grounding Evidence reference is
   mandatory at the moment a Hypothesis is proposed, regardless of
   producer. **Evidence is not equivalent to Truth or Proof, and
   Evidence does not replace Human Confirmation** — the mandatory
   Evidence requirement establishes a grounding floor for a Hypothesis;
   it does not establish factual truth and does not by itself authorize
   Relationship creation.
6. **Persistence (Q6).** A Hypothesis must be persisted using a new,
   separate representation, architecturally distinct from Relationship —
   never represented merely as a Relationship row distinguished only by
   `provenance`/`confirmationState`. The existing Relationship schema and
   table (`personal_intelligence_relationships`,
   `personal_intelligence_relationship_evidence`) remain unmodified.
7. **Relationship Type vocabulary (Q7).** Only the existing, unmodified
   five-value vocabulary applies: `successive_state`, `refinement`,
   `contradiction`, `contextual_variation`, `related_fact`. No sixth
   value, no Decision-7-specific parallel ontology. **If a confirmed
   Hypothesis cannot legitimately fit one of these five existing types,
   it must not be force-fit into an existing type** — that case remains
   unresolved pending a separate future architectural decision.
8. **Type assignment (Q8).** A Hypothesis is type-agnostic. The human
   confirmer alone selects the Relationship Type at confirmation time.
   **AI may not propose, classify, recommend, suggest, or assign a
   Relationship Type — in particular, AI may not suggest or determine
   `contradiction`.** No contradiction-detection logic is introduced by
   this registration.
9. **Temporal eligibility (Q9).** Temporal State is an architectural
   eligibility consideration for Decision 7 — not all ClaimVersion pairs
   are automatically eligible for comparison regardless of temporal
   state. **The exact eligibility rule remains deferred** to a separate
   future Founder decision.
10. **Retention (Q10).** Unconfirmed and rejected Hypotheses must not be
    assumed to persist indefinitely; they are subject to a future
    bounded-retention, expiration, or deletion-eligibility policy.
    **The exact duration, mechanism, archive-vs-delete behavior,
    unconfirmed-vs-rejected distinction, audit exceptions, user-deletion
    interaction, and Evidence-reference effects remain deferred.**

### Provenance and Explainability

A Hypothesis's origin must remain traceable; the existing
`provenance='ai_hypothesis'` concept (used elsewhere in this codebase for
Relationship) is precedent only, not adopted. **The exact Hypothesis
provenance representation remains deferred** (a consequence of Q6's
separate-representation decision, not a resolution of it — corrected
here from an earlier internal cross-reference that mislabeled this
deferral against Q10; the deferral's actual source is Q6). Explainability
remains a future implementation requirement (what a future mechanism
would need to be able to state about a proposed relationship), not an
implementation decision made by this registration.

### Explicitly Deferred (not resolved by this registration)

Exact temporal eligibility rule (Q9); exact retention/expiration/deletion
policy (Q10); exact Hypothesis schema, fields, naming, lifecycle states,
migration design (Q6); confirmation UX/API and how confirmation is
recorded (Q4); whether the existing Matching-Hypothesis Confirmation
mechanism is reused, adapted, or replaced (Q4/Q8, precedent-only status
unchanged); Evidence sufficiency, quantity beyond the minimum of one,
quality/strength evaluation, eligible types, and whether Evidence must
support both Claims (Q5); whether existing Relationship Evidence
infrastructure is reused (Q5); Hypothesis provenance model (Q6); the
explainability mechanism design; the case of a confirmed Hypothesis that
cannot legitimately fit an existing Relationship Type (Q7); who
specifically is authorized to confirm, understood to fall under existing,
unmodified user-ownership architecture already governing every comparable
mechanism in this codebase, not itself reopened here (Q4). The
`strength`/`weakness` semantic-placement question from the PIC Ontology
Decision Record is not a Decision 7 dependency and is not addressed by
this registration.

### Explicit Non-Scope (unchanged, restated)

This registration does not authorize, and this document continues to
treat as entirely outside its scope: Living User Model (remains **NOT
AUTHORIZED**); the vision-level Context Fusion Engine (remains outside
scope, does not exist in this repository); Memory (remains outside
scope, unredesigned, unintegrated); Decision Engine, Goal OS, Daily OS
(remain outside scope); any matching/similarity/ranking/scoring/
embedding algorithm; any candidate-generation implementation; any
contradiction-detection implementation; any AI capability implementation
or AI Gateway/Runtime integration; any schema, migration, API,
controller, service, or UI implementation.

### Governance Boundary (restated)

**FOUNDER-APPROVED ARCHITECTURE ≠ IMPLEMENTATION AUTHORIZATION.** No
Implementation Increment Contract exists for Decision 7. No code, schema,
migration, API, or AI capability may be created, modified, or authorized
as a consequence of this registration alone. A separate, explicit
Founder implementation-authorization act — following this repository's
standing gate sequence — is required before any of that work may begin.

---

**PRESENT-DAY STATUS (2026-09-02): DECISION 7 ARCHITECTURE = FOUNDER-APPROVED
(historically recorded above, at §2/§27, as "AWAITING FOUNDER DECISION" at
drafting time — see the present-day resolution section immediately above
for the Founder's explicit answers to Questions 1–10 and their exact
scope). DECISION 7 IMPLEMENTATION: NOT AUTHORIZED. LIVING USER MODEL: NOT
AUTHORIZED. IMPLEMENTATION CONTRACT: DOES NOT EXIST. THIS DOCUMENT GRANTS
NO IMPLEMENTATION AUTHORIZATION OF ANY KIND.**
