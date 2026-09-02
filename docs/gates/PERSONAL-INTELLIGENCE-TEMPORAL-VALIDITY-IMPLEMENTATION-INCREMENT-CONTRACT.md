# Temporal Validity — Implementation Increment Contract

> **IMPLEMENTATION CONTRACT — NOT IMPLEMENTATION.**
> **IMPLEMENTATION AUTHORIZATION: NOT GRANTED.**
> This document is documentation only. No code, schema, migration, test,
> API, repository, or service file was modified in producing it.

---

## Present-Day Repository Reconciliation

**Added by Founder-authorized documentation/governance reconciliation
("FOUNDER EXECUTION DIRECTIVE — TEMPORAL VALIDITY GOVERNANCE
RECONCILIATION"). This section is purely additive. Every word of the
historical Contract below — including the banner above
("IMPLEMENTATION AUTHORIZATION: NOT GRANTED"), §23's restatement of that
status, and every other historical statement in §1–§23 — is preserved
byte-for-byte and remains the historical record of what this Contract
specified and what it did and did not authorize at drafting time.
Nothing below rewrites, deletes, softens, or reinterprets that historical
record.**

### Present-Day Status

**MAINLINE-SHIPPED / UNIT & STRUCTURAL VERIFIED / LIVE POSTGRESQL
VERIFICATION OUTSTANDING.**

### Implementation Evidence

The Temporal Validity implementation this Contract specifies exists on
current `main`, introduced entirely by one commit:

- **`587a854`** — "feat(pic): implement temporal validity for claim
  versions." This commit contains **both** the Temporal Validity
  implementation **and** the Temporal Validity Contract document itself
  (this file), committed together. The implementation is present on
  current `main`. No later commit was found that reverts or supersedes
  the `effectiveFrom`/`effectiveTo` fields.

**The existence of this commit is not treated here as independent
Founder authorization evidence** — see "Authorization" below.

### Implementation Scope Present Today

Present-day repository reality includes the Contract-defined
implementation surface: `effectiveFrom`/`effectiveTo` on
`PersonalIntelligenceClaimVersion`
(`apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts`);
both fields on `CreateClaimInput`/`AppendClaimCorrectionInput` (core
repository interface); the Drizzle persistence implementation
(`infrastructure/persistence/personal-intelligence-claim.repository.ts`);
the schema addition
(`persistence/schema/personal-intelligence.schema.ts`); the additive
migration
`apps/api/src/persistence/migrations/0012_temporal_validity_effective_from_to.sql`
(two nullable `ADD COLUMN` statements, no default, no backfill — matching
§9's specification exactly); unit tests
(`personal-intelligence-claim.model.spec.ts`,
`personal-intelligence-claim.use-case.spec.ts`); and a dedicated
structural test file
(`infrastructure/persistence/personal-intelligence-claim-temporal-validity.structural.spec.ts`).
The implementation matches this Contract's Option-A semantics (§6): the
dedicated structural test verifies that `appendCorrection`'s projection
sources `effectiveFrom`/`effectiveTo` only from the correction input,
never from the matched prior row — the required non-inheritance
behavior.

### Exclusions Confirmed Still Absent

Consistent with this Contract's own scope (§7, §20), present-day
repository evidence confirms the implementation did **not** introduce or
authorize: Cross-Claim Matching (any part), candidate generation,
similarity matching, or ranking; Relationship; Relationship Evidence;
Matching-Hypothesis Confirmation; Context; a confidence algorithm; a
"currently effective" derivation; any ordering-validation rule for
`effectiveFrom`/`effectiveTo`; any change to Inference, Evidence, Memory,
Personal State, or the AI Gateway; any API/controller/DTO layer; any web
change. **Decision 7 — Cross-Claim Matching Implementation — remains NOT
APPROVED**, untouched and unaffected by this reconciliation.

### Test Status

Unit and structural verification exists and matches this Contract's test
intent (§17 items 1–8, 11–20 at the unit/structural level; the
non-inheritance requirement of item 7 directly proven). **Live
PostgreSQL verification was not performed. No dedicated live-database
verification evidence was found for migration `0012` or these fields.**
This limitation was explicitly disclosed by this Contract itself, in
§§18–19, **before** implementation occurred ("No live PostgreSQL
instance is available in this environment"). It is therefore a known,
pre-declared environmental limitation, not a silently omitted
requirement, and this reconciliation does not convert it into a claim
that runtime verification occurred.

### Authorization

The historical Contract records Implementation Authorization as **NOT
GRANTED** (banner; §23) and describes itself as documenting what a
future, separately authorized implementation pass must do. Present-day
repository evidence confirms the implementation nevertheless exists on
`main`, matching this Contract's specification. However: **no
independently verifiable separate Founder Execution Directive artifact
was recovered.** What can be recorded is strong circumstantial
alignment — this Contract's own recorded baseline (`HEAD =
70bfd73ba4a09b9a6dcb69cfb843039af6bd6a90`) is the exact parent commit of
the implementation commit (`587a854`), and the Contract and the
implementation were committed together, atomically, in that same commit.
**These facts are not converted into a claim that Founder authorization
is proven.** Implementation existence is not authorization evidence.
Passing tests are not authorization evidence. The commit's existence is
not authorization evidence. This Contract's internal consistency with
the shipped code is not authorization evidence. Authorization for the
historical implementation remains an unresolved historical evidence
question.

### No Retroactive Authorization

This reconciliation does not retroactively grant, establish, or infer
authorization for the historical implementation. It records present-day
repository reality only. The Founder directive that authorized producing
this section authorized only this documentary reconciliation — it does
not rewrite the historical authorization record, and does not authorize
any further implementation, runtime verification, schema change, API/web
exposure, or Cross-Claim Matching / Decision 7 work of any kind. Any
future work on this capability — including the outstanding live
PostgreSQL verification — requires its own separate, explicit Founder
authorization.

---

## 1. Authority

This Contract is produced under "FOUNDER DIRECTIVE — TEMPORAL VALIDITY
IMPLEMENTATION INCREMENT CONTRACT," which records that the Founder has
reviewed and approved `TEMPORAL-VALIDITY-DESIGN-PROPOSAL.md` and has
explicitly selected **Option A — Always Explicit** for correction
semantics (§6 below), superseding that design document's §6.2, which had
flagged the choice as an open judgment call. Every other architectural
element of the Design Proposal is treated as Founder-approved and is not
reopened here, per this directive's own instruction, unless repository
evidence proves a direct contradiction — **none was found** (§4).

## 2. Baseline

```
branch:       main
HEAD:         70bfd73ba4a09b9a6dcb69cfb843039af6bd6a90
origin/main:  70bfd73ba4a09b9a6dcb69cfb843039af6bd6a90
divergence:   0/0
```
Protected file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`: MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, untouched by producing this
Contract.

## 3. Sources Reviewed

D1/D2/D3 (+ §21 Addendum, Implementation Contract, Promotion Write Path
Contract, commit `70bfd73`); `CROSS-CLAIM-MATCHING-FOUNDER-ARCHITECTURAL-DECISION.md`;
`TEMPORAL-VALIDITY-DESIGN-PROPOSAL.md`; PIC Ontology Decision Record
(§5 Orthogonal Axes, §10 Temporal Validity, §14 Extensibility) +
Implementation Contract; `DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
§28 (Constitution); TD-04(Human-OS); current
`personal-intelligence-claim.model.ts`, `.repository.ts` (core + infra),
`personal-intelligence.schema.ts`, migrations directory (confirmed:
`effectiveFrom`/`effectiveTo`/`effective_from`/`effective_to` do not
appear anywhere in `apps/api/src` — genuinely unimplemented, matching the
Design Proposal's claim); existing spec files and their fixture/factory
conventions (`personal-intelligence-claim.model.spec.ts`,
`-claim-diff.spec.ts`, `application/.../-claim.use-case.spec.ts`).

## 4. Existing Architecture — Cross-Check Result

**No conflict, contradiction, or previously-unidentified consequence was
found** between the Design Proposal and current authoritative
architecture or code. Specifically verified:
- The Design Proposal's claim that `effectiveFrom`/`effectiveTo` do not
  exist anywhere in the schema is confirmed by direct grep (§3).
- The Design Proposal's claim that Temporal Validity was already
  FOUNDER-APPROVED ARCHITECTURE (conceptual) in Ontology Decision Record
  §10 is confirmed by re-reading that section.
- The orthogonal-axes reasoning in Design Proposal §2.2 correctly
  extends, and does not contradict, Ontology Decision Record §5.
- No field name collision exists with any existing column on
  `personal_intelligence_claim_versions`.

## 5. Temporal Validity Decision (restated, Founder-approved, not reopened)

Temporal Validity is an independent axis answering "when was the
underlying Claim actually true/effective," distinct from evidence
acquisition time, Claim creation time, ClaimVersion recording time,
lifecycle time, confirmation time, provenance, confidence, and evidence
linkage. Fields: `effectiveFrom`, `effectiveTo` — both independently
nullable. `null` means only "the temporal boundary is not established" —
never always/forever/now/current/immediately-effective/
unknown-but-assumed-current. Three representable states: bounded
interval, open-ended interval, wholly unknown — none invented, none
requiring a guess.

## 6. Option-A Correction Semantics (Founder-mandated, non-negotiable)

For every `create()`: `effectiveFrom`/`effectiveTo` = explicit caller
input, always. For every `appendCorrection()`: the new version's
`effectiveFrom`/`effectiveTo` = explicit caller input, **always** —
**never** copied from the prior version, regardless of what the prior
version held. If either boundary is unknown to the caller, the caller
must explicitly pass `null` for it. This is enforced identically in:

- **Create semantics:** `CreateClaimInput.effectiveFrom`/`.effectiveTo`
  are required (non-optional) fields of type `Date | null` — the same
  shape already used for `evidenceVersionId`/`inferenceId` — so a caller
  cannot omit them; a `null` is always an explicit choice, never a
  default.
- **Correction semantics:** `AppendClaimCorrectionInput.effectiveFrom`/
  `.effectiveTo` are the same required, non-optional `Date | null` shape.
  The repository implementation's `appendCorrection()` `INSERT...SELECT`
  projection must source these two columns from `sql`${input.effectiveFrom}``/
  `sql`${input.effectiveTo}`` (literal caller input), **never** from
  `personalIntelligenceClaimVersions.effectiveFrom`/`.effectiveTo` of the
  matched prior row — structurally identical to how `inferenceId` was
  proven non-inheriting in the D3 Promotion Write Path Contract §5.G/§8.
- **Repository semantics:** no code path reads the prior version's
  `effectiveFrom`/`effectiveTo` for any purpose related to populating the
  new version's values.
- **Use-case semantics:** `PersonalIntelligenceClaimUseCase.create()`/
  `.appendCorrection()` remain pure pass-through delegations (unchanged
  shape) — the use-case layer performs no inheritance logic, so there is
  no location in the call chain where inheritance could be silently
  introduced.
- **Test semantics:** §17's matrix includes an explicit
  no-inheritance regression test mirroring the Promotion Contract's own
  precedent test pattern.

**This makes inheritance structurally impossible**, not merely
discouraged by convention: there is no code path, at any layer, that
reads a prior version's temporal fields when constructing a new one.

## 7. Scope

Analyzed against every named candidate:

| Candidate | In scope? | Reasoning |
|---|---|---|
| ClaimVersion domain model | **Yes** | Add two fields — mechanical extension of the existing per-version field pattern (§5 of the Design Proposal) |
| `CreateClaimInput` | **Yes** | Must accept the two new required fields |
| `AppendClaimCorrectionInput` | **Yes** | Same |
| Application use-cases | **Yes, but zero logic change** | Pure pass-through already; only the delegated type signature changes transitively |
| Repository interface (core) | **Yes** | Interface types must reflect the new input fields |
| Drizzle repository implementation | **Yes** | Both `create()` branches and `appendCorrection()`'s projection must populate/read the two new columns |
| Database schema | **Yes** | Two new nullable columns — see §9 |
| Migration | **Yes, future** | Additive only — see §9; **not created in this phase** |
| Fixtures/spec files | **Yes** | Same 3 files this session's prior two increments already touched for the same mechanical reason (new required field) |
| Serialization/API DTOs | **No** | No HTTP/API surface exists for Claim creation/correction anywhere in this codebase today (confirmed: no controller references `PersonalIntelligenceClaimUseCase.create`/`.appendCorrection` in `apps/api/src`) — there is no DTO boundary to extend; inventing one would be scope expansion beyond what exists |
| `PersonalIntelligenceClaim` (identity row, not version) | **No** | Holds no temporal fields today and should continue to hold none — Temporal Validity is a per-assertion (per-version) concept, per Design Proposal §5 |
| `personal-intelligence-claim-diff.ts` | **No** | Same exclusion already made and documented in both prior increments this session (Ontology, Promotion) — not part of this Contract's authorized boundary; not modified here either |
| D3 Inference, Evidence, Memory, Personal State, AI Gateway | **No** | Explicitly out of scope — §11 |

## 8. Exact File Boundary

| File | Action | Authorized reason |
|---|---|---|
| `apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts` | Modify | §7 — add `effectiveFrom: Date \| null`, `effectiveTo: Date \| null` to `PersonalIntelligenceClaimVersion` |
| `apps/api/src/core/personal-intelligence/personal-intelligence-claim.repository.ts` | Modify | §7 — add both fields to `CreateClaimInput`, `AppendClaimCorrectionInput` |
| `apps/api/src/infrastructure/persistence/personal-intelligence-claim.repository.ts` | Modify | §6 — activate read/write of both columns in `create()` (both branches) and `appendCorrection()`, per Option-A non-inheritance |
| `apps/api/src/persistence/schema/personal-intelligence.schema.ts` | Modify (future, not this phase) | §9 — two additive nullable `timestamp` columns on `personalIntelligenceClaimVersions` |
| `apps/api/src/persistence/migrations/00XX_*.sql` + `meta/` | Create (future, not this phase) | §9 — additive-only migration, no backfill required |
| `apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.spec.ts` | Modify | Fixture updates for the two new required fields (mechanical, same pattern as this session's two prior increments) |
| `apps/api/src/core/personal-intelligence/personal-intelligence-claim-diff.spec.ts` | Modify | Same — `makeVersion()`'s literal needs the two new fields for the type to compile |
| `apps/api/src/application/personal-intelligence/personal-intelligence-claim.use-case.spec.ts` | Modify | Fixture updates + new tests per §17 |
| New structural/no-inheritance test spec (name TBD at implementation time, e.g. `personal-intelligence-claim-temporal-validity.spec.ts` or folded into the use-case spec) | Create | §17 test matrix |
| `apps/api/package.json` | Modify | Register any newly created spec file |
| **`personal-intelligence-claim-diff.ts`** | **Must NOT change** | Same standing exclusion as both prior increments — diffing these fields is not authorized by this Contract |
| **`personal-intelligence-inference.*`, D3 files** | **Must NOT change** | §11 |
| **`evidence.*`, `memory.*`, `personal-state.*`** | **Must NOT change** | §11 |
| **`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`** | **Absolutely must NOT change** | Standing protected-file rule |
| Any AI Gateway / `infrastructure/ai*` file | **Must NOT change** | §11 |

## 9. Schema/Migration Determination

**Confirmed absent:** neither `effective_from` nor `effective_to` exists
on `personal_intelligence_claim_versions` today (§3/§4). **A future
migration is therefore authorized in principle, but is explicitly NOT
created in this phase** (§17 of the authorizing directive).

**Minimum additive schema, specified for a future implementation pass to
execute verbatim (not created now):**
```ts
effectiveFrom: timestamp("effective_from", { withTimezone: true }),
effectiveTo: timestamp("effective_to", { withTimezone: true }),
```
Both nullable — no `.notNull()`, no `.default(...)`.

- **Nullability:** both columns nullable, no exceptions.
- **Timestamp representation:** `timestamp with time zone`, matching
  every existing temporal column in this schema (`observedAt`,
  `acceptedAt`, `createdAt`, etc.) — no new representation convention.
- **Database defaults:** **forbidden** — a database-level default would
  silently manufacture a value the application never explicitly chose,
  directly violating §5's null-semantics rule.
- **Application-generated "now" values:** **forbidden** as a default —
  no code path may substitute the current timestamp for an omitted
  `effectiveFrom`/`effectiveTo`; every value must trace to explicit
  caller intent.
- **Backfill:** **not required and not authorized.** Unlike
  `evidence_linkage_state` (which was `NOT NULL` and needed a
  three-step backfill migration), both new columns are nullable — a
  plain `ADD COLUMN` with no `UPDATE` statement is sufficient and
  correct.
- **Existing ClaimVersions remain semantically valid:** **yes,
  explicitly** — every existing row receiving `null`/`null` is not a
  degraded or incomplete state; per §5's semantics, `null` means "not
  established," which is the honest, correct value for every row written
  before this axis existed. No historical row's meaning changes.

## 10. Data Semantics

No historical date may be inferred from `createdAt`, `updatedAt`,
evidence timestamps, lifecycle timestamps, or confirmation timestamps for
any existing row — **not authorized by any source reviewed**. Existing
rows receive `null`/`null` and nothing else, full stop.

## 11. Temporal Consistency Rules

| Rule | Status |
|---|---|
| `effectiveFrom > effectiveTo` (start after end) | **NOT AUTHORIZED / OPEN** — no existing authoritative document specifies whether this should be rejected, and inventing a validation rule now would exceed this Contract's evidence base; a future implementation must **not** add a check constraint for this without a separate Founder decision |
| `effectiveFrom == effectiveTo` (instantaneous) | **NOT AUTHORIZED / OPEN** — same reasoning; representable but unvalidated |
| Only `effectiveFrom` set | **Representable, no validation needed** — this is exactly the "open-ended" state (Design Proposal §2.3), a legitimate, meaningful combination |
| Only `effectiveTo` set | **Representable, no validation needed** — no rule found that requires `effectiveFrom` to be known before `effectiveTo` can be; e.g., a user might know a fact ended on a specific date without knowing exactly when it started |
| Both `null` | **Representable, the "wholly unknown" state** — explicitly a first-class, valid, honest state per §5 |

**Explicit distinction maintained, per directive §8:** this section
governs **representation** (what shapes the two columns can hold — all
five rows above are representable, since both are plain nullable
timestamp columns with no proposed constraint) and **validation** (what
the database or application actively rejects — nothing is proposed to be
rejected; the two NOT-AUTHORIZED rows above are flagged precisely because
this Contract declines to invent a validation rule, not because the
values are somehow unrepresentable). **Interpretation** (what a
`effectiveFrom > effectiveTo` row would *mean* to a future consumer) is
untouched and explicitly out of scope — no consumer of these fields is
authorized by this Contract at all (Cross-Claim Matching remains
unauthorized per the Founder Architectural Decision Decision 7).

## 12. Lifecycle Orthogonality

Temporal Validity does not replace, modify, or derive `lifecycle`, and
`lifecycle` does not derive Temporal Validity. **No implementation may
compute `lifecycle = "active"` from `effectiveTo = null`**, and no
implementation may compute a "currently effective" boolean from temporal
fields alone. **A "currently effective" concept is discussed only as an
illustration in the Design Proposal (§2.2) and is explicitly OUT OF
SCOPE for this Contract** — no such computation, function, derived field,
or query helper is authorized by this Contract. If a future consumer
needs "currently effective," combining `effectiveTo`/`lifecycle` is a
design question for that future consumer's own Contract, not something
this increment builds.

## 13. Evidence / Provenance / Confidence Boundaries

Confirmed, and enforced by construction (no code path proposed touches
any of these): evidence timestamps (`evidence_versions.observedAt`/
`.acceptedAt`) describe evidence, not Claim truth time — untouched;
`provenance` describes how information is known — untouched, no
derivation from or to Temporal Validity; `confidence` remains fully
independent — no write path proposed sets or reads `confidence` based on
`effectiveFrom`/`effectiveTo`; Temporal Validity does not upgrade
confidence, does not alter `evidenceVersionId`/`evidenceLinkageState`,
does not create a C3 confirmation event, and does not create a `lifecycle`
transition. **No cross-axis contamination exists anywhere in this
Contract's proposed changes** — verified by the fact that the two new
columns appear only in the `create()`/`appendCorrection()` projections
where they were added, touching no other field's assignment logic.

## 14. D1/D2/D3 Integrity

This Contract explicitly prohibits, and its proposed file boundary (§8)
structurally excludes: any change to Inference records; Inference
lifecycle mutation; Claim confirmation (C3) mutation; evidence mutation;
provenance mutation; confidence mutation; Memory integration; Personal
State integration; Cross-Claim Matching implementation; Relationship
implementation; Matching-Hypothesis Confirmation; AI Gateway changes.
Temporal Validity is confirmed as an **additive ClaimVersion concern
only**.

## 15. Backward Compatibility

Existing rows receive `null`/`null` (§9). No existing behavior changes:
every existing repository method's read path (`findClaimVersionForUser`,
`findActiveClaimVersionsForUser`, `findVersionsForUser`) already uses
either `select()` (wildcard, automatically includes new columns) or an
explicit column list that must be updated to include the two new columns
for read-completeness — this is a mechanical, additive change with no
behavioral consequence for any existing caller (new fields simply appear
as `null` on every version read today). No existing test's assertions
about any other field change.

## 16. API/Input Boundary

**No API/DTO layer exists for Claim creation/correction in this codebase
today** (confirmed, §7) — there is nothing to extend, and this Contract
does not invent one. At the existing repository-input boundary
(`CreateClaimInput`/`AppendClaimCorrectionInput`), both fields are
**required, non-optional inputs whose value may be `null`** — `Date |
null`, never `Date | null | undefined`. This exactly matches the
Founder's explicit instruction ("do not use optional omission semantics
to recreate inheritance") and the existing codebase convention
(`evidenceVersionId`, `inferenceId` are both `string | null`, never
optional) — no new input-shape convention is introduced.

## 17. Test Matrix

All 18 directive-required items, plus 2 additions:

1. Create with both `effectiveFrom`/`effectiveTo` set (bounded interval).
2. Create with both `null` (wholly unknown).
3. Create with only `effectiveFrom` set (open-ended).
4. Create with only `effectiveTo` set.
5. Correction with new explicit values, prior version had different values.
6. Correction with explicit `null`/`null`, prior version had known values — **proves the new version does not silently retain the prior known values**.
7. Correction proving no inheritance generally — dedicated test asserting the use-case/repository call site's `effectiveFrom`/`effectiveTo` are taken solely from the correction input object, independent of any "prior version" concept, mirroring the D3 Promotion Contract's own no-carry-forward test pattern.
8. Correction changing only one boundary (e.g., new `effectiveTo`, `effectiveFrom` re-supplied unchanged) — confirms partial-looking changes still require full explicit restatement of both fields.
9. Existing rows (pre-increment) remain valid and readable with `null`/`null`.
10. Type-level/input-boundary enforcement: `CreateClaimInput`/`AppendClaimCorrectionInput` require both fields at the TypeScript level (a compile-time test/assertion, mirroring how this session's prior two increments caught every call site via `tsc`).
11. `lifecycle` remains independent — a test asserting no code path derives or mutates `lifecycle` from the two new fields.
12. `evidenceVersionId`/`evidenceLinkageState` remain independent — no interaction in either `create()` branch.
13. `provenance` remains independent.
14. `confidence` remains independent.
15. No Inference mutation — structural test, mirroring the exact pattern already proven in `personal-intelligence-claim-promotion.structural.spec.ts` (grep-based, asserting the file does not newly reference Inference lifecycle machinery in connection with these fields).
16. No C3 confirmation side effect — structural: no code path writes to `personal_intelligence_claim_confirmation_events` in connection with these fields.
17. No Personal State mutation — structural: no import of `personal-state.*` is introduced by this increment's files.
18. No Memory mutation — structural: no import of `memory.*` is introduced.
19. *(Added)* `effectiveFrom > effectiveTo` and `effectiveFrom == effectiveTo` are accepted (not rejected) at both the type and (once implemented) database level, confirming §11's "representable but unvalidated" determination is actually honored, not accidentally over-constrained.
20. *(Added)* A read of an existing (pre-increment, or post-increment-but-not-supplied-at-creation) ClaimVersion returns `effectiveFrom: null, effectiveTo: null` — never a fabricated value.

**Verification-kind labeling (mandatory, per directive §14/§15):**

| Kind | What it covers here |
|---|---|
| **Unit verification** | Items 1–8, 11–14, 19–20 — pure TypeScript/model-level and Fake-repository use-case-level tests, runnable without a database |
| **Structural verification** | Items 15–18 — source-file grep-based tests, mirroring the established `*.structural.spec.ts` convention |
| **Integration verification** | None proposed in this Contract — this codebase has no integration-test tier today |
| **Live PostgreSQL verification** | Item 9 (existing-row backward compatibility) and the atomic/ownership aspects of items 5–8 (does the actual `INSERT...SELECT` SQL behave as specified) — **not achievable in this environment** (§18) |

**Structural/unit test success is explicitly not claimed as equivalent to
live database verification anywhere in this Contract.**

## 18. Runtime Verification Plan

No live PostgreSQL instance is available in this environment — confirmed
unchanged from every prior increment this session (D3, Ontology,
Promotion Write Path). Once implementation is separately authorized,
verification is limited to: `npm run typecheck`, `npm run build`, `npm
run test` (unit/model/use-case/structural tiers only, per §17's
labeling), and static inspection of the generated migration SQL. **This
would not verify**: that the database actually accepts/rejects the
representable-but-unvalidated combinations in §11 as expected; that
existing production rows genuinely read back as `null`/`null` under real
Postgres semantics (though this is a low-risk, standard nullable-column
guarantee); any real concurrency behavior of the modified `create()`/
`appendCorrection()` statements under actual load.

## 19. Known Limitations

1. No live PostgreSQL runtime verification available in this environment
   — carried forward, unchanged, from every prior increment this
   session.
2. `effectiveFrom > effectiveTo` validation is left explicitly
   unresolved (§11) — a future Founder decision, not silently decided
   here.
3. No "currently effective" derived concept is built — explicitly
   deferred (§12) to whatever future Contract needs it.
4. `personal-intelligence-claim-diff.ts` will not diff these two new
   fields — same standing, previously-acknowledged limitation pattern as
   this session's prior two increments; not corrected here, per this
   Contract's minimal-boundary discipline.

## 20. Exclusions

Cross-Claim Matching implementation (any part); Relationship
implementation; Relationship Evidence; Matching-Hypothesis Confirmation;
Context (Claim-level or otherwise); a confidence algorithm; a
"currently effective" derived computation; any validation rule for
`effectiveFrom`/`effectiveTo` ordering; any change to Inference, Evidence,
Memory, Personal State, or AI Gateway; any API/controller/DTO layer;
Personal State's own `observedAt`/`acceptedAt` correction.

## 21. Implementation Sequence (for a future, separately authorized pass)

1. Domain model (`personal-intelligence-claim.model.ts`) — add the two
   fields.
2. Core repository interface — add the two fields to both input types.
3. Drizzle schema — add the two nullable columns (§9).
4. Generate migration via `drizzle-kit generate` (no manual backfill
   needed, unlike the Ontology increment's `evidence_linkage_state`).
5. Drizzle repository implementation — wire `create()` (both branches)
   and `appendCorrection()` per §6's exact non-inheritance requirement.
6. Update the three existing fixture/spec files for the new required
   fields (compile-driven, same mechanical process as this session's
   prior two increments).
7. Add the new tests per §17.
8. Register any new spec file in `package.json`.
9. Run `typecheck`/`build`/`test`; produce the same kind of honest,
   limitation-transparent verification report as the prior two
   increments.
10. Stop for Founder commit/push authorization — not implied by this
    Contract.

## 22. STOP Conditions Encountered

**None.** No contradiction with the Constitution, D1/D2/D3, or the
Founder Architectural Decision was found. Option-A semantics were
unambiguous as stated by the Founder and required no reinterpretation.
No Memory, Personal State, or AI Gateway change was found necessary. No
unexpected schema semantics were discovered — the absence of
`effectiveFrom`/`effectiveTo` was exactly as the Design Proposal
described. No need to reinterpret historical data arose. No need to
touch the protected governance file arose.

## 23. Implementation Authorization Status

**IMPLEMENTATION AUTHORIZATION: NOT GRANTED.** This Contract documents
what a future, separately authorized implementation pass must do; it
does not itself authorize any code, schema, or migration change.
