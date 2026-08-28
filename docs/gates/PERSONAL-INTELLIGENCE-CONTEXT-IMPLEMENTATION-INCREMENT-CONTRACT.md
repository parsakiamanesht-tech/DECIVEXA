# Claim-Level Context — Implementation Increment Contract

> **IMPLEMENTATION CONTRACT — NOT IMPLEMENTATION.**
> **IMPLEMENTATION AUTHORIZATION: NOT GRANTED.**
> Documentation only. No code, schema, migration, test, API, repository,
> or service file was modified in producing this document.

## 1. Authority

Produced under "FOUNDER DIRECTIVE — CLAIM-LEVEL CONTEXT DESIGN &
IMPLEMENTATION CONTRACT PREPARATION" (design-only). Treats as
Founder-approved, per that directive §4, unless repository evidence
proves a contradiction (none found, §4 below): Claim-Level Context is a
Value Object, ClaimVersion-granularity, minimal scope, owned by PIC,
separate from the vision-level Context Fusion Engine, evidence-gradeable,
sovereignty-aware, no entity unless demonstrated. Minimal approved
dimensions: `situation/setting`, `time-of-day`. OPEN, not promoted: role,
task/goal, emotional state, location.

## 2. Baseline

```
branch:       main
HEAD:         587a854351dc734dd7b84ae817ff1e10d140d95f
origin/main:  587a854351dc734dd7b84ae817ff1e10d140d95f
divergence:   0/0
```
Commit `587a854` (Temporal Validity) confirmed present at `HEAD` and on
`main`; `effectiveFrom`/`effectiveTo` confirmed live in
`personal-intelligence.schema.ts`. Protected file MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, untouched.

## 3. Sources Reviewed

`CROSS-CLAIM-MATCHING-DESIGN-TRACK-DRAFT.md`,
`-DESIGN-DECISION-PROPOSAL.md`, `-FOUNDER-DECISION-AUDIT.md`,
`-FOUNDER-ARCHITECTURAL-DECISION.md`; `TEMPORAL-VALIDITY-DESIGN-PROPOSAL.md`
+ its Implementation Contract + the live implementation on `main`;
`personal-intelligence-claim.model.ts`/`.repository.ts` (core + infra),
`personal-intelligence.schema.ts`; PIC Ontology Decision Record (§5, §7,
§9, §16) + Implementation Contract; `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
§19 (Context Fusion Engine), §28 (Constitution); TD-04(Human-OS) §8-§9;
`FIS-REGISTRY.md` (FIS-047); `PHASE_10Q_B` (Memory boundary);
`personal-state.schema.ts`; D1-D3 records + D3 Promotion Write Path
Contract.

## 4. Existing Architecture — Cross-Check Result

**No conflict found.** Confirmed: no `situationSetting`/`timeOfDay`/
`context*` field exists anywhere in `apps/api/src` (grep). The two-concept
disambiguation (Claim-level Context vs. Context Fusion Engine) from
`CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md` Decision 1 is
reaffirmed, not reopened. Every design choice below either directly
extends an already-approved pattern (effectiveFrom/effectiveTo's
additive-column shape; Subject's no-new-entity precedent; the
"Always Explicit" correction convention now established twice) or is
explicitly marked OPEN/PROPOSED where no such precedent exists.

## 5. Semantic Purpose and Boundary

**Context represents:** the situational qualifier under which a specific
ClaimVersion's asserted fact holds — "under what situation/setting."
**Context does NOT represent, and must never be confused with:**

| Not this | Because |
|---|---|
| Claim content | `valueKind`/`valueText` — what is asserted, not the circumstances of the assertion |
| Evidence | `evidenceVersionId`/`evidenceLinkageState` — what grounds the claim, not what situation it describes |
| Provenance | `provenance` — how the claim is known (declared/observed), orthogonal to under what circumstances |
| Temporal Validity | `effectiveFrom`/`effectiveTo` — when true, not under what situation |
| Lifecycle | `lifecycle` — epistemic/workflow state of the version, unrelated to situational content |
| User confirmation | C3 event log — a later user act, not a claim attribute |
| Personal State | a single, current, live, mutable-by-replacement user snapshot — Context is a per-assertion, immutable, potentially-many-per-user qualifier (§17) |
| Memory | a distinct system (§16) |
| Goal | a Goal OS concept, not represented anywhere in PIC |
| "Environment" as a Context Fusion Engine input | that concept operates at a cross-domain, product-synthesis granularity (§19 of the Vision document), not at claim granularity (§1 disambiguation, unchanged) |

## 6. Context Dimensions

| Dimension | Evidence | Necessity | Primitive shape | Verdict |
|---|---|---|---|---|
| `situation`/`setting` | TD-04(Human-OS) §8's worked example ("quiet conditions"/"social pressure") | Directly evidenced | Plain text — no enumerated vocabulary is evidenced, so none is invented | **Include** |
| `time-of-day` | FIS-047 (Personal Energy Map), weaker | Weakly evidenced but present | Plain text, same reasoning — no evidenced fixed vocabulary (e.g. no repository text defines "morning/afternoon/evening" as the canonical set) | **Include, lower confidence than situation** |
| role | None found | — | — | **OPEN — not included** |
| task/goal | None found at claim-qualifier granularity (only exists at the separate Context Fusion Engine macro level) | — | — | **OPEN — not included** |
| emotional state | None found | — | — | **OPEN — not included** |
| location | None found as distinct from situation/setting | — | — | **OPEN — not included** |

No dimension is included without direct repository evidence; none of the
OPEN four is silently promoted.

## 7. Sovereignty Model

**Directive's three options evaluated:** (A) one marker for the whole
Context object, (B) an independent marker per dimension, (C) reuse of an
existing mechanism.

**Finding:** no repository entity anywhere (Claim, Evidence, Personal
State, Memory) has ever implemented sub-row/per-field provenance — every
existing `provenance` value governs an entire version/row, never one
field within it. Introducing per-dimension provenance for Context alone
(Option B) would be the *first* instance of sub-row epistemic granularity
in this codebase — a genuinely new architectural pattern, not a reuse,
directly contradicting the directive's own "do not invent a new epistemic
model without evidence."

**Recommended: Option C.** Context introduces **no new sovereignty
field at all**. It reuses the ClaimVersion's existing, already-approved
apparatus in full: `provenance` (declared/observed) governs the whole
row including its Context fields; `inferenceId`, if set, means the whole
row — Context included — originated from a D3 Inference via the existing
Promotion Write Path; C3 confirmation events, if any, confirm the whole
row's content, Context included. This is not a weaker guarantee than a
dedicated marker — it is the same guarantee already relied on for
`valueText` itself, extended for free to two more fields on the same
immutable row, because Context is architecturally just more content on
that row, not a distinct sub-object with its own epistemic lifecycle.

**How this prevents AI-inference silently becoming user-declared fact
(directive's explicit requirement):** the existing architecture already
prevents exactly this at the whole-row level — a row cannot be both
`provenance: "declared"` and secretly sourced from an Inference; if
Context data originates from an AI-generated Inference, the containing
ClaimVersion must go through the existing, evidence-grounded D3
Promotion Write Path (`inferenceId` set, ownership-verified, never
lifecycle-gated) to land at all. Context inherits this protection without
new machinery.

**Flagged, not decided:** whether Context will ever need finer-grained,
sub-row provenance is an **[OPEN QUESTION]**, not foreclosed by this
recommendation — deferred, no evidence currently requires it.

## 8. Unknown / Absence Semantics

Both fields, independently nullable text: `situationSetting: string |
null`, `timeOfDay: string | null`. `null` means, uniformly and only,
**"not established"** — never "always," "not applicable," or "absent by
design" — directly reusing the exact rule already established for
`effectiveFrom`/`effectiveTo` (Temporal Validity Contract §5) rather than
inventing a second null-semantics convention in the same table. No
tri-state, no separate "not applicable" enum value is proposed —
unevidenced, would violate minimal-viable-object discipline.

## 9. Context ⟷ Temporal Validity (orthogonality, not redesigned)

Temporal Validity is not modified. The two axes are independent, both
already representable as of commit `587a854`, and now +2 more nullable
fields on the same row — zero interaction required.

| Context | Temporal Validity | Meaning |
|---|---|---|
| Known | Known | e.g. "worked night shifts" (situation), effective March-June (period) — fully independent facts |
| Known | Unknown | Situation described, but no temporal window established |
| Unknown | Known | Temporal window known, but no situational qualifier supplied |
| Unknown | Unknown | Neither axis established — both legitimately null, not an error state |

No axis is derived from, or gates, the other — same discipline already
applied between Temporal Validity and `lifecycle` (Temporal Validity
Contract §12).

## 10. Context ⟷ Evidence / Provenance

- Context can be user-declared without external evidence — **yes**,
  exactly as the whole ClaimVersion already can
  (`evidenceLinkageState: "self_reported_no_evidence_required"`);
  Context introduces no additional requirement.
- Evidence for Context is the **same** evidence as for the Claim — there
  is no separate "Context evidence" concept (consistent with §7's "no new
  sub-row apparatus" finding); the row's single `evidenceVersionId`/
  `evidenceLinkageState` covers the whole row.
- Context does not require independent evidence.
- AI-inferred Context cannot become established without going through the
  same D3 Promotion Write Path as any other AI-inferred content (§7).
- Provenance and Context sovereignty are **the same field** — not two
  separate concepts (§7).
- **Preserved, unchanged:** candidate signal ≠ evidence — not applicable
  to this increment (no matching/candidate-generation exists yet), stated
  for completeness only.

## 11. Context ⟷ D3 Inference

| Question | Answer |
|---|---|
| May an Inference contain/contextualize Context? | **OPEN, NOT AUTHORIZED** — would require modifying the D3 Inference schema, explicitly forbidden by this directive; no repository evidence establishes this need |
| May Claim promotion carry Context? | **Yes, trivially** — Context is two more explicit fields on `CreateClaimInput`/`AppendClaimCorrectionInput`, exactly like `effectiveFrom`/`effectiveTo` are now; requires no D3-side change |
| Can Context be inferred from an Inference? | Not without the above OPEN item being resolved first — not proposed here |
| Does Context promotion require confirmation? | No additional mechanism beyond whole-row C3 confirmation (§7) |
| Does Context change Inference lifecycle? | **Never** — structurally guaranteed, no code path proposed touches Inference tables at all |
| Can Context mutate D3 state? | **Never** — same guarantee |

**Default safety rule enforced:** this Contract's proposed implementation
touches zero D3 files.

## 12. Correction Semantics (Always Explicit, extended by precedent)

The Founder has now established "Always Explicit / no inheritance" twice
in direct succession for this exact input type (`inferenceId`, then
`effectiveFrom`/`effectiveTo`). Extending the same, now-uniform
convention to Context is **resolved by existing evidence**, not a fresh
fork requiring a new Founder decision (unlike Temporal Validity's §6
fork, which had no precedent to draw on at the time). Every new
ClaimVersion — create or correction — receives `situationSetting`/
`timeOfDay` as explicit, required, non-optional `string | null` inputs;
`appendCorrection()`'s projection sources them only from `input.*`, never
from the matched prior row's own Context columns.

**Seven conceptual cases (directive §12), all resolved by full-replacement semantics:**

| # | Case | Outcome |
|---|---|---|
| 1 | Prior has Context, new omits (passes `null`) | New version's Context is `null` — not inherited |
| 2 | Prior has none, new supplies | New version reflects the supplied value |
| 3 | Only Context changes | Caller resupplies unchanged claim content alongside new Context — a full-row correction, same as any other single-field-intent correction today |
| 4 | Claim changes, Context resupplied identically | Both explicit, no interaction |
| 5 | Context changes, Claim resupplied identically | Both explicit, no interaction |
| 6 | One dimension changes, other unchanged | Both fields independently, explicitly restated |
| 7 | Context becomes unknown | Explicit `null`/`null` — the honest "wholly unknown" state (§8), not an error |

No case produces hidden inheritance — structurally impossible, per the
same reasoning already proven for `inferenceId` and
`effectiveFrom`/`effectiveTo`.

## 13. Claim Identity Boundary

Context belongs to **ClaimVersion**, not `PersonalIntelligenceClaim`
(identity row — holds only `id`/`userId`/`claimType`, no content field of
any kind), not Evidence, not a future Relationship. Reasoning: every
content-bearing field on this schema (`valueText`, `confidence`,
`evidenceLinkageState`, `effectiveFrom`/`effectiveTo`) already lives on
ClaimVersion because content can change per version while identity stays
stable — Context follows this exact, already-four-times-applied
precedent, inventing nothing new.

**Explicitly does not imply:** a new Claim identity (same `claimId`,
next `version`, exactly like any other correction); contradiction,
refinement, or any Relationship (undefined, unauthorized concepts —
Context is inert with respect to them until a future, separately
authorized Cross-Claim Matching mechanism reads it); a `lifecycle`
transition (lifecycle is set independently, by the correction's own
`lifecycle` input field, never derived from Context).

## 14. Cross-Claim Matching — Future Interface Only (not implemented)

Per `CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md` Decision 1,
Context is a named prerequisite. This Contract documents only the
*interface*, not any algorithm:

- Context could later participate in matching as a **compatibility-check
  dimension** (the "Context Compatibility" pipeline stage already named,
  conceptually, in the Cross-Claim Matching design documents) — i.e., a
  future matcher would *read* `situationSetting`/`timeOfDay` as one input
  among several, never compute anything from them here.
- Context could later serve as a **disambiguation signal** or a
  **contextual-variation discriminator** — again, only as future *input*
  to a classification process this Contract does not define.
- **Two invariants preserved explicitly:** different Context values
  **never** by themselves imply `contradiction` (a future Relationship
  Classification stage, using additional signals, would make that
  determination — Context alone cannot); identical Context values
  **never** imply `same_claim` (Context is not an identity key — two
  claims about entirely different attributes could coincidentally share
  identical situational text).

No similarity algorithm, scoring, ranking, or candidate generation is
defined, implied, or authorized here.

## 15. Living User Model — Future Boundary Only

```text
Context (this Contract, if approved)
        ↓
future Relationship / Intelligence layer (unauthorized, undefined)
        ↓
future Living User Model (unauthorized, undefined)
```
Context never directly mutates or feeds a "user model" — the approved
dependency chain (`Ontology → Cross-Claim Matching → ... → Living User
Model`, Ontology Decision Record §15) is preserved unbypassed; no
shortcut path is proposed.

## 16. Memory Boundary

Untouched. `PHASE_10Q_B`'s documented boundary immaturity is preserved,
not resolved. No Claim→Memory or Context→Memory write path, schema
change, or synchronization mechanism is proposed.

## 17. Personal State Boundary

Untouched, not modified, not redefined. **Why Claim-level Context is not
Personal State:** Personal State represents one current, live, singular,
mutable-by-replacement snapshot per user (`timezone`/`locale`/
`availability`) — there is exactly one active row per user at any time.
Claim-level Context is a per-assertion, immutable, potentially-many-
per-user qualifier describing the circumstances of one specific claim,
living on an append-only version history. These serve structurally and
purposively different questions ("what is the user's state right now"
vs. "under what situation was this particular claim true") — no overlap,
no proposed integration. Personal State's own temporal asymmetry remains
separately unresolved, unaffected by this Contract.

## 18. Value Object Design

**[PROPOSED]** Two independently nullable text fields on
`PersonalIntelligenceClaimVersion`:
```ts
situationSetting: string | null;
timeOfDay: string | null;
```
- **Primitive fields:** plain text, no nested object, no enum — no
  evidenced fixed vocabulary exists for either dimension (unlike
  `claimType`/`provenance`/`lifecycle`, all of which have evidenced,
  closed sets).
- **Optionality:** both required, non-optional inputs whose value may be
  `null` — identical shape discipline to every prior axis this session.
- **Normalization:** none proposed (no case-folding/trimming) — not
  evidenced as necessary; would be inventing validation for its own sake.
- **Canonical representation:** caller-supplied text, stored verbatim.
- **Serialization:** plain scalar columns, matching this schema's
  universal convention (no JSON-blob precedent exists anywhere in this
  codebase — confirmed by inspection of every schema file).
- **Equality:** ordinary value comparison — no custom equality method;
  `personal-intelligence-claim-diff.ts` is **not** extended by this
  Contract (same standing exclusion already documented in the Ontology
  and Promotion increments).
- **Immutability:** set once at version-creation time, never mutated
  afterward — identical to every other field on this row.
- **Validation:** none beyond TypeScript structural typing (§19).
- **Future extensibility:** additional OPEN dimensions, if ever
  evidenced, would be added the same way — more independently-nullable
  text columns — no redesign required.

## 19. Validation Rules

| Kind | Proposed rule | Evidence | Reason | Risk if omitted | Founder approval required? |
|---|---|---|---|---|---|
| Structural | `string \| null`, required (non-optional) at every input site | Existing universal input-shape convention on this table | Consistency with `inferenceId`/`effectiveFrom`/`effectiveTo` | None (this is the established minimum, not an invented addition) | No — already-approved convention |
| Semantic | *(none proposed)* | None found | — | — | N/A — not proposed |
| Epistemic | *(none proposed — reuses §7's whole-row apparatus)* | None found requiring Context-specific epistemic validation | — | — | N/A — not proposed |

No semantic or epistemic validation rule is invented "because it seems
technically convenient," per the directive's explicit instruction.

## 20. Persistence Design (design only — no schema/migration created)

| Option | Verdict |
|---|---|
| A) Embedded nullable columns on `ClaimVersion` | **Recommended** — mirrors the `effectiveFrom`/`effectiveTo` precedent exactly: additive, nullable, zero backfill, zero migration risk |
| B) Serialized JSON/value-object storage | Rejected — zero precedent anywhere in this schema (every column is scalar); would be the first such departure; complicates queryability, and complicates false-merge safety by making the value opaque to this codebase's existing wildcard-`select()`/explicit-column-list read patterns |
| C) Separate table | Rejected — mirrors the reasoning already used to reject a Subject entity (Ontology Decision Record §9/§3.2): no evidenced cross-claim identity or reuse need for Context; a value always 1:1 with its owning ClaimVersion does not justify table+FK+ownership machinery |
| D) Other | None evidenced |

**Recommendation (PROPOSED, not yet schema-authorized):**
```ts
situationSetting: text("situation_setting"),
timeOfDay: text("time_of_day"),
```
Both nullable, no default, no backfill — identical shape and identical
reasoning to `effective_from`/`effective_to`. **No schema file or
migration is created by this Contract.**

## 21. API / Domain / Repository Boundaries (future, not created now)

Identical boundary shape to the Temporal Validity increment:
`PersonalIntelligenceClaimVersion` (domain model), `CreateClaimInput`/
`AppendClaimCorrectionInput` (core repository interface), the Drizzle
repository implementation (`create()`'s three branches +
`appendCorrection()`'s projection), the three existing fixture spec
files (mechanical updates), one new structural spec file. No API/DTO
layer exists to extend (confirmed, same finding as before — no
controller anywhere calls Claim creation/correction). Use-case layer:
pure pass-through, zero logic change.

## 22. Test Matrix (future, not created now)

All 18 directive items, labeled by verification kind:

| # | Item | Kind |
|---|---|---|
| 1 | Context absent (both null) | Unit |
| 2 | Context fully known | Unit |
| 3 | situation known / time-of-day unknown | Unit |
| 4 | time-of-day known / situation unknown | Unit |
| 5 | both unknown | Unit (same as #1) |
| 6 | invalid structural shape | N/A — no runtime validation exists to test (§19); TypeScript enforcement is the only structural check, exercised by every fixture site's compile requirement |
| 7 | sovereignty states | Unit — via existing `provenance`/`inferenceId`/C3 fixtures, no new Context-specific sovereignty test needed (§7) |
| 8 | correction no-inheritance | Unit + Structural (mirrors the Temporal Validity method-body-scoped grep test) |
| 9 | Context-only correction | Unit |
| 10 | Claim + Context correction | Unit |
| 11 | Context does not mutate lifecycle | Structural |
| 12 | Context does not mutate D3 | Structural (mirrors existing `personal-intelligence-claim-promotion.structural.spec.ts` pattern) |
| 13 | Context does not mutate Memory | Structural |
| 14 | Context does not mutate Personal State | Structural |
| 15 | Context independent of Temporal Validity | Unit (field-independence, mirrors existing pattern) |
| 16 | Context does not imply contradiction | N/A at this layer — no contradiction mechanism exists yet to test against; documented as an architectural invariant (§14), not a runtime-testable property in this increment |
| 17 | Context does not imply same-claim | N/A at this layer — same reasoning as #16 |
| 18 | Serialization/equality | Not applicable — plain scalar fields, no custom serialization/equality logic introduced (§18) |

**Live PostgreSQL verification:** not achievable in this environment —
unchanged, carried forward from every prior increment this session.
Unit/structural test success is not claimed as equivalent to it.

## 23. False-Inference / Safety Analysis

| Failure mode | Structural safeguard |
|---|---|
| AI hallucinating Context | Context can only enter a ClaimVersion via the same explicit, caller-supplied input path as every other field — no code path proposed generates Context values autonomously |
| AI-inferred Context represented as user-declared | Prevented by §7's whole-row reuse: an AI-inferred row must go through the existing, evidence-grounded D3 Promotion Write Path (`inferenceId`), which cannot be silently combined with `provenance: "declared"` misrepresenting origin |
| Unknown Context converted into a guessed value | §8 — `null` means only "not established"; no fallback/default value is proposed anywhere |
| Context mistaken for Evidence | §10 — Context shares the row's evidence-linkage state; no separate "Context evidence" concept is introduced to confuse with real Evidence |
| Context mistaken for Temporal Validity | §9 — fully independent fields, independent semantics, no shared code path |
| Context mistaken for Personal State | §17 — explicit purpose distinction, zero integration |
| Context mistaken for Memory | §16 — explicit boundary preservation, zero integration |
| Context differences mistaken for contradiction | §14 — explicit invariant: different Context never alone implies contradiction |
| Context similarity mistaken for identity | §14 — explicit invariant: identical Context never alone implies same-claim |
| Context silently inherited across corrections | §12 — structurally impossible, full-replacement semantics proven by precedent |
| Context causing D3 lifecycle mutation | §11 — zero D3 files touched by this Contract's proposed scope |
| Context causing confirmation side effects | §7/§11 — no code path proposed writes to the C3 confirmation-event table |
| Context contaminating confidence | Not evidenced as a risk — no code path proposed reads Context to compute or adjust `confidence`; the fields are independent columns in the same insert, precisely mirroring how `evidenceLinkageState`/`inferenceId`/`effectiveFrom`/`effectiveTo` already coexist with `confidence` without contaminating it |

## 24. Founder Decision Table

| Item | Already Founder-approved | Resolved by existing evidence | Requires new Founder approval | Explicitly deferred |
|---|---|---|---|---|
| Context = Value Object, ClaimVersion-level, minimal, separate from Context Fusion Engine | ✓ (Founder Architectural Decision, Decision 1) | | | |
| Minimal dimensions: situation/setting, time-of-day | ✓ | | | |
| OPEN dimensions (role, task/goal, emotional state, location) stay OPEN | ✓ (explicit prior instruction) | | | |
| No sovereignty field — reuse whole-row provenance/inferenceId/confirmation (§7) | | ✓ (no sub-row provenance precedent anywhere) | flagged for visibility, not required | |
| `null` = "not established" only (§8) | | ✓ (direct reuse of Temporal Validity's rule) | | |
| Always Explicit correction semantics (§12) | | ✓ (twice-established precedent) | | |
| Persistence: embedded nullable columns (§20) | | ✓ (direct precedent) | | |
| No Context-specific evidence abstraction (§10) | | ✓ | | |
| Whether Context ever needs sub-row provenance | | | | ✓ |
| Whether an Inference may itself carry Context (§11) | | | | ✓ (OPEN, not authorized) |
| Any OPEN dimension's eventual promotion | | | | ✓ |
| Whether/how a future matcher actually reads Context (§14) | | | | ✓ |
| **Whether to authorize implementation of this Contract at all** | | | **✓** | |

## 25. Exact File Boundary (future, once separately authorized)

| File | Action | Reason |
|---|---|---|
| `personal-intelligence-claim.model.ts` | Modify | Add `situationSetting`, `timeOfDay` to `PersonalIntelligenceClaimVersion` |
| `personal-intelligence-claim.repository.ts` (core) | Modify | Add both fields to `CreateClaimInput`/`AppendClaimCorrectionInput` |
| `personal-intelligence-claim.repository.ts` (infra) | Modify | Wire both fields through `create()` (3 branches) and `appendCorrection()`, Always-Explicit, no inheritance |
| `personal-intelligence.schema.ts` | Modify (future) | Two additive nullable `text` columns |
| New migration `00XX_*.sql` + `meta/` | Create (future) | Additive only, no backfill |
| `personal-intelligence-claim.model.spec.ts`, `-claim-diff.spec.ts`, `application/.../-claim.use-case.spec.ts` | Modify | Fixture updates, same mechanical pattern as every prior increment |
| New structural spec (name TBD) | Create | §22 items 8/11-14 |
| `package.json` | Modify | Register new spec file |
| **`personal-intelligence-claim-diff.ts`** | **Must NOT change** | Standing exclusion, same as three prior increments |
| **D3, Evidence, Memory, Personal State, AI Gateway files** | **Must NOT change** | §11/§16/§17, explicit prohibition |
| **`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`** | **Absolutely must NOT change** | Standing protected-file rule |

## 26. Runtime Limitations

No live PostgreSQL instance available in this environment — unchanged.
Once implementation is separately authorized, the same limitation
applies as every prior increment: unit/structural/build/typecheck only,
no live-DB verification of actual constraint/read behavior.

## 27. Exclusions

Cross-Claim Matching implementation (any part); Relationship
implementation; Relationship Evidence; Matching-Hypothesis Confirmation;
a confidence algorithm; a "currently effective" or "same-claim"/
"contradiction" derived computation; any Inference-side Context field;
sub-row provenance for Context; any validation rule beyond structural
typing; any change to Evidence, Memory, Personal State, D1/D2/D3, the
Ontology Decision Record, the Constitution, or AI Gateway; any API/
controller/DTO layer.

## 28. Implementation Sequence (for a future, separately authorized pass)

Identical shape to the Temporal Validity sequence: (1) domain model,
(2) core repository interface, (3) Drizzle schema, (4) generate migration
(no backfill), (5) Drizzle repository implementation (Always Explicit),
(6) fixture updates, (7) new tests per §22, (8) register new spec file,
(9) typecheck/build/test with honest limitation reporting, (10) stop for
Founder commit/push authorization.

## 29. STOP Conditions Encountered

**None.** No conflict with the Founder Architectural Decision, D1/D2/D3,
Memory, Personal State, or AI Gateway was found. Orthogonality with
Temporal Validity holds. All under-evidenced dimensions were safely
marked OPEN. Persistence was resolved by direct precedent. Correction
semantics were resolved by an already-twice-established convention, not
a fresh ambiguity. No schema decision materially changes approved
architecture (purely additive). No protected-file modification was
required.

## 30. Implementation Authorization Status

**IMPLEMENTATION AUTHORIZATION: NOT GRANTED.** This Contract documents
what a future, separately authorized implementation pass must do; it
does not itself authorize any code, schema, or migration change.
