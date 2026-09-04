# Personal Intelligence — Occurrence / Observation Distinction — Founder Architectural Decision Record

## 1. Baseline Verification

```
branch:       main
HEAD:         c54c12f8252829b25b20001ddf1df41d7f78df6d
origin/main:  c54c12f8252829b25b20001ddf1df41d7f78df6d
divergence:   0/0
```

Protected file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`: MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, unmodified — untouched by
producing this record.

## 2. Decision Identity

- **Title:** Occurrence / Observation Distinction — Founder Architectural
  Decision B
- **Decision ID:** `FD-PIC-OCCURRENCE-OBSERVATION-DISTINCTION-001`
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Date:** 2026-09-04
- **Status:** **FOUNDER-APPROVED ARCHITECTURAL DIRECTION —
  IMPLEMENTATION NOT AUTHORIZED.**

This is a documentation-only registration of a Founder decision reached
directly in this conversation. It introduces no source, schema,
migration, API, test, or configuration change of its own, and does not
move the repository baseline recorded above.

## 3. The Decision

**[FOUNDER-APPROVED ARCHITECTURE]** DECIVEXA's future epistemic
architecture must preserve a meaningful distinction between:

- **A. Claim / ClaimVersion** — a proposition or assertion about the
  person/world as represented by DECIVEXA, including every revision or
  correction to that proposition.
- **B. Real-World Occurrence / Observation** — a representation of
  something that happened, was observed, measured, or otherwise
  corresponds to a distinct occurrence in the real world.

The system must **not** assume:

```
new ClaimVersion = new real-world occurrence
multiple ClaimVersions = repeated behavior
Evidence = occurrence
ClaimVersion sequence = event sequence
```

unless and until a future, separately Founder-approved semantic model
explicitly establishes such a relationship.

## 4. Architectural Rationale

The current `Claim`/`ClaimVersion` architecture distinguishes
propositions and their revisions, but does not inherently establish:
occurrence identity; whether two records refer to two distinct
real-world occurrences; whether multiple observations refer to one
occurrence; whether a later record is a new occurrence or merely a
revision/re-evaluation; whether Evidence describes an occurrence or
merely supports a proposition; or whether temporal separation
represents two occurrences or two epistemic states.

This distinction became material during a read-only architectural
audit process examining the Founder-approved Bounded Semantic Synthesis
(B1) product principle. That process found, and this record now
registers as its evidentiary basis: a systematic six-scenario test
(new occurrence; re-evaluation of an old occurrence; pure belief
revision; evidence duplication; multiple observations of one
occurrence; one occurrence with a later-corrected description) under
which every scenario produced an identical `ClaimVersion`/Correction
representation — none distinguishable from any other under the current
architecture. The authoritative Vision separately includes
future-facing Decision Intelligence signals (decision delay, repeated
choices, avoidance patterns, response to uncertainty) and states that
self-sabotage must be inferred from repeated evidence and context
rather than from a single behavior — commitments that cannot be
honestly realized if proposition-revision history is silently treated
as occurrence history.

## 5. Current-State Finding (evidence, not decision)

- `PersonalIntelligenceClaimVersion`/Correction represent revision of a
  standing proposition — not documented anywhere as, and not
  structurally equivalent to, a real-world occurrence.
- `EvidenceVersion` is a generic grounding artifact (`provenance:
  declared|observed|measured`, `lifecycle`, `confidence`) with no field
  distinguishing an occurrence from a proposition-supporting artifact.
- `Context` (`situationSetting`/`timeOfDay`) is claim-scoped, not
  occurrence-scoped.
- `Relationship` links two `ClaimVersion`s; it is a cross-claim relation,
  not an occurrence representation.
- `PersonalIntelligenceInference` (D3) is a proposition container, not
  an occurrence representation.
- No `Observation`, `Event`, `Activity`, or `Measurement` primitive
  exists anywhere in the current codebase.
- Pattern remains `[DEFERRED QUESTION]` per
  `docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-DECISION-RECORD.md`
  §13, unchanged and unaffected by this record.

## 6. What This Decision Authorizes

Only the architectural **direction**: that the Claim/ClaimVersion-vs-
Occurrence/Observation distinction is recognized as architecturally
important for DECIVEXA's future direction, and that future work must
not silently collapse the two. Nothing else.

## 7. What This Decision Explicitly Does NOT Authorize

This decision does **not** authorize, and no future implementation may
treat it as having authorized:

- a specific `Observation`, `Event`, `Activity`, `Measurement`, or
  `Occurrence` entity, table, or event-sourcing/telemetry/behavioral-
  logging system;
- a choice of name for the concept (Observation, Occurrence, Event,
  Activity, Measurement, or otherwise);
- one primitive vs. multiple primitives;
- any ontology, identity, lifecycle, temporal, provenance, or source
  semantics for the concept;
- any relationship model between occurrence and Evidence, Claim,
  ClaimVersion, or Context;
- correction, deduplication, or aggregation semantics for occurrences;
- Pattern semantics, repeated-behavior semantics, consistency/trend
  semantics, or any threshold;
- a confidence model or epistemic lifecycle for occurrences;
- any persistence model, API surface, or UI surface;
- any AI involvement or semantic-synthesis generation;
- cross-claim or cross-domain reasoning;
- Bounded Semantic Synthesis (B1) implementation of any kind;
- Decision 7 implementation;
- Gate 7 opening, AI runtime execution, provider invocation,
  credentials, network access, or `execute()`/`generate()`/
  `healthCheck()` of any kind;
- Pattern's promotion into a first-class entity.

A separate, explicit Founder decision is required before any of the
above may be designed or implemented.

## 8. Relationship to Claim / ClaimVersion

Unchanged. `Claim → ClaimVersion → Correction/revision history`
continues to represent epistemic/propositional history exactly as
today. It must not be automatically reinterpreted as an occurrence
sequence (`Occurrence 1 → Occurrence 2 → Occurrence 3`) by this or any
future record without its own explicit semantic authorization.

## 9. Relationship to Evidence

Unchanged. Evidence remains a generic grounding artifact for a
proposition. It must not be automatically interpreted as an occurrence
merely because this record exists.

## 10. Relationship to Context

Unchanged. Context (`situationSetting`/`timeOfDay`) remains claim-scoped
and does not, by virtue of this record, acquire occurrence-identity
semantics.

## 11. Relationship to Pattern

Unchanged, and explicitly not advanced by this record. Pattern remains
a conceptual interpretation only, per the PIC Claim Ontology / Taxonomy
Decision Record §13. This record does not create Pattern, does not
define Pattern semantics, does not define repeated-behavior thresholds,
and does not license inferring Pattern from ClaimVersion history. Any
future promotion of Pattern into a first-class entity requires its own,
separate Founder-approved design decision.

## 12. Relationship to Bounded Semantic Synthesis (Founder Decision A)

Founder Decision A — that DECIVEXA may, in principle, eventually
produce bounded, evidence-grounded, conditional, revisable semantic
syntheses about the user — remains unchanged and is not expanded by
this record. This record does not authorize an Understanding Engine,
AI generation, cross-claim reasoning, cross-domain synthesis, or Pattern
implementation. The occurrence/observation distinction is recognized as
an architectural prerequisite for certain *future* forms of
repeated-behavior reasoning; it does not itself authorize those
capabilities.

## 13. Relationship to Decision 7

Unchanged. `docs/DECIVEXA/CROSS-CLAIM-MATCHING-DECISION-7-ARCHITECTURAL-DECISION.md`
remains exactly as recorded there: **FOUNDER-APPROVED ARCHITECTURE —
IMPLEMENTATION NOT AUTHORIZED.** This record must not be read as
implementation authorization for Cross-Claim Matching. Occurrence
distinction ≠ Cross-Claim Matching authorization: a future
occurrence-aware system may still separately require its own Founder
approval to perform cross-claim reasoning.

## 14. Relationship to Gate 7

Unchanged. Gate 7 remains **CLOSED**. This record grants no AI runtime,
provider, credential, network, `execute()`, `generate()`,
`healthCheck()`, or AI-generated-synthesis authorization of any kind.

## 15. Future Architectural Questions (explicitly undecided)

The following remain undecided and require their own, separate Founder
approval before any implementation may proceed: naming of the concept;
number of primitives required; exact ontology, identity, lifecycle,
temporal, provenance, and source semantics; whether observations are
direct records of occurrences or evidence about occurrences; the
relationship between occurrence and each of Evidence, Claim,
ClaimVersion, and Context; correction, deduplication, and aggregation
semantics; Pattern semantics and repeated-behavior/consistency/trend
semantics and any thresholds; a confidence model; epistemic lifecycle;
persistence model; API surface; UI surface; AI involvement; semantic
synthesis generation; cross-claim reasoning; cross-domain reasoning.

## 16. Scope Distinction — Core Identity vs. Narrow Future Capabilities

**Not dependent on occurrence representation by virtue of this
record:** Human Model, Living Human Model, personalization, Same Goal ≠
Same Path, Future Version, evidence-based guidance, claim history,
uncertainty, correction, and basic bounded synthesis over claim-level
information — all remain exactly as currently architected.

**Narrow future capabilities this record is architecturally relevant
to, not authorizing:** repeated choices, repeated behavior, avoidance
patterns, decision delay as repeated real-world behavior, behavioral
trajectories, the behavior-vs-belief-revision distinction, and stronger
evidence-grounded diagnosis/insight involving repeated occurrences.
None of these capabilities is authorized, designed, or implemented by
this record.

## 17. Requirement for Separate Founder Approval Before Implementation

**No implementation of any kind proceeds from this record alone.** Every
item in §7 and §15 requires its own, separate, explicit Founder
decision — following this repository's standing gate sequence — before
any code, schema, migration, API, or test may be written.

## 18. Change Discipline

This record is created as a new, standalone governance artifact —
consistent with this repository's established convention of giving each
major architectural decision its own dedicated record (see, e.g.,
`CROSS-CLAIM-MATCHING-DECISION-7-ARCHITECTURAL-DECISION.md`,
`PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md`,
`PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-DECISION-RECORD.md`).
The existing PIC Claim Ontology / Taxonomy Decision Record governs
Claim-side taxonomy and was not extended, to avoid conflating a
decision about a concept that does not yet exist with the existing
Claim ontology it governs, and to avoid rewriting unrelated material in
that document. No competing source of truth is created: this record
does not restate, alter, or override anything in that document —
Pattern's deferral (§13 there) is cited, not modified.

## 19. Final Determination

**FOUNDER DECISION B — REGISTERED. ARCHITECTURAL DIRECTION APPROVED.
IMPLEMENTATION NOT AUTHORIZED.** No schema, migration, code, test, API,
or AI capability is created, modified, or implied as approved by this
record. Every substantive question beyond the direction itself remains
`AWAITING FOUNDER DECISION` per §15.

---

## 20. Present-Day Founder Narrowing — Concept Boundary (2026-09-04)

**This section is additive.** It records a further, more specific
Founder decision reached in this conversation, narrowing one item of
§15's "Future Architectural Questions" list — specifically the
question of "whether observations are direct records of occurrences or
evidence about occurrences" and "the relationship between occurrence
and each of Evidence, Claim, ClaimVersion, and Context." Nothing above
(§1–§19) is rewritten, deleted, or reinterpreted; every word of the
original registration, including its historical "AWAITING FOUNDER
DECISION" framing of this exact question, remains intact as the
historical record of what was undecided at drafting time.

### Status

**FOUNDER-APPROVED CONCEPTUAL DIRECTION, NARROWED — IMPLEMENTATION
STILL NOT AUTHORIZED.**

### The Narrowed Decision

**[FOUNDER-APPROVED ARCHITECTURE]** The future occurrence/observation
model shall consist of exactly these four semantically distinct
concepts, no more and no fewer at the conceptual level:

1. **Occurrence** — the identity/anchor for a real-world event or
   state.
2. **Evidence** — an information/grounding artifact, which may
   optionally reference an Occurrence. Evidence's existing role
   (grounding a Claim, Correction, or Inference) is unchanged.
3. **Observation** — not a separate top-level concept. Observation is
   the descriptive role played by Evidence when it is linked to an
   Occurrence — it does not receive its own identity, table, or
   entity distinct from Evidence.
4. **Claim** — remains a proposition, unchanged.
5. **ClaimVersion** — remains a revision/version of a proposition,
   unchanged.

Occurrence, Evidence, Claim, and ClaimVersion must remain semantically
distinct from one another; none may be collapsed into another without
its own separate, explicit Founder authorization.

### What This Narrowing Authorizes

Only the conceptual boundary above, as a direction for any future,
separately authorized implementation. Nothing else.

### What This Narrowing Does NOT Authorize

Consistent with, and not expanding, §7's existing non-authorization
list: no schema, migration, entity, model, API, controller, service,
repository, or use case for Occurrence or an Evidence-to-Occurrence
reference; no Observation entity (explicitly rejected as a concept,
not merely deferred); no promotion of Pattern; no modification of
Decision 7 or Gate 7; no AI-generated semantic synthesis; no change to
any existing production behavior. **Concrete representation and
implementation of this four-concept boundary remain deferred, pending
a separate, future Founder-approved implementation decision** —
exactly as §17 of the original registration already required.

### Effect on §15's Open Questions

Narrowed, not closed: the specific "how many concepts / is Observation
separate" question is resolved by this section. Every other item in
§15 — naming stability, identity/lifecycle/temporal/provenance/source
semantics, correction/deduplication/aggregation semantics, Pattern
semantics, confidence model, epistemic lifecycle, persistence model,
API surface, UI surface, AI involvement, cross-claim reasoning,
cross-domain reasoning — **remains exactly as undecided as §15
originally recorded it.**

### Governance Boundary (restated)

**CONCEPTUAL NARROWING ≠ IMPLEMENTATION AUTHORIZATION.** No
Implementation Increment Contract exists for Occurrence, Evidence
extension, or any related concept. No code, schema, migration, API, or
AI capability may be created, modified, or authorized as a consequence
of this section alone. A separate, explicit Founder
implementation-authorization act — following this repository's
standing gate sequence — is required before any of that work may
begin. Decision 7 remains FOUNDER-APPROVED ARCHITECTURE — IMPLEMENTATION
NOT AUTHORIZED, untouched. Gate 7 remains CLOSED, untouched. Pattern
remains deferred per the PIC Claim Ontology / Taxonomy Decision Record
§13, untouched.
