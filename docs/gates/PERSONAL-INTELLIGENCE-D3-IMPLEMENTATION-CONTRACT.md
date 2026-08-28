# Personal Intelligence — D3 Inference Provenance Implementation Contract

## A. Contract Identity

- **Title:** Personal Intelligence — D3 Inference Provenance Implementation
  Contract
- **Artifact ID:** `PI-D3-IMPLEMENTATION-CONTRACT-001`
- **Status:** **CONTRACT PREPARED — NOT FOUNDER-APPROVED — NOT
  BUILD-AUTHORIZED**
- **Date:** 2026-08-27
- **Repository context at preparation time:** branch `main`,
  `HEAD = origin/main = 0ccfbe4465e39a7103fcea09d45074b3901103fa`,
  divergence `0/0`. The protected pre-existing modification,
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`, is present and untouched.

**Three separate governance states, not to be conflated:**

```
D3 ARCHITECTURE: APPROVED
        (docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md,
         commit 0ccfbe4465e39a7103fcea09d45074b3901103fa)
D3 IMPLEMENTATION CONTRACT: PREPARED
        (this document)
D3 IMPLEMENTATION: NOT YET AUTHORIZED
        (requires a separate, future, explicit Founder act)
```

This document is an implementation specification and governance boundary.
**It is not implementation.** No code, schema, migration, API, UI, AI
capability, or test file is created or modified by this document's
creation.

## B. Governance Authority

Authoritative sources, not reinterpreted by this Contract: `docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md`
(Option B, seven invariants, DIRECT EVIDENCE REQUIRED); TD-04; TD-02
Ownership Matrix; `PERSONAL-INTELLIGENCE-TD-04-APPROVAL-AND-CURRENT-STATE-OWNERSHIP-DECISION-RECORD.md`
(D1/D2); `PERSONAL-INTELLIGENCE-GOVERNANCE-REMEDIATION-RECORD.md`;
`PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md`.

## C. Fresh Repository Audit (this task)

Confirmed by direct inspection, not assumed from prior reports:

- `personalIntelligenceClaims`/`personalIntelligenceClaimVersions`
  (`apps/api/src/persistence/schema/personal-intelligence.schema.ts`):
  `evidenceVersionId` is a plain nullable FK to `evidence_versions.id`
  (`onDelete: "restrict"`) — ownership matching (same `userId`) is
  enforced at the **application/query layer** (an `INSERT ... SELECT ...
  WHERE` pattern), not by a composite DB constraint. The same shape is
  the correct precedent for inference-evidence references.
- `apps/api/src/persistence/schema.ts`'s `persistenceSchema` registry
  (passed to `drizzle(pool, { schema: persistenceSchema })`) currently
  contains only `users`, `workspaces`, `personalStates` — Memory,
  Evidence, and Personal Intelligence tables are **not** registered
  there (they're queried via the plain `.from(table)` builder, not
  Drizzle's relational query API). **Therefore no change to
  `schema.ts`'s barrel registry is required by this Contract.**
- `apps/api/src/application/personal-intelligence/personal-intelligence.module.ts`:
  a minimal NestJS module (imports `PersistenceModule`, provides/exports
  `PersonalIntelligenceClaimUseCase` only). A new use-case would need an
  additive provider/export entry here.
- Migrations: `apps/api/src/persistence/migrations/0000` through `0009`,
  Drizzle-kit generated (`npm run db:generate`), never hand-authored.
  The next migration would be `0010_*.sql`, auto-generated from a
  schema-file diff — this Contract does not author literal SQL.
- Transaction primitive: `this.db.transaction(async (tx) => {...})`,
  already used identically by `DrizzlePersonalIntelligenceClaimRepository.create()`
  and by Memory's repository — this is the existing, sole atomicity
  mechanism in this codebase; no new transaction abstraction exists or
  is needed.

No discrepancy was found between the approved architecture record and
the actual repository state.

## D. Scope — What Will Be Implemented (when separately authorized)

A new, independent, immutable Inference entity and its minimal
supporting read/write surface, wired into Personal Intelligence's
existing module, following every existing pattern in this codebase
(append-only versioning is not needed here since Inference records are
never mutated at all — no version column, unlike claims/evidence).

## E. Out of Scope (explicit)

AI capability implementation or invocation; the confidence algorithm;
the stale/re-evaluation trigger; Prediction; cross-claim conflict
matching; contextual interpretation / FIS-057; any HTTP/API or UI
surface; Goal OS/Daily OS/Decision Engine integration; automatic status
transitions of any kind; deletion/export *implementation* (the
*architecture* for both is specified, per §K/§L, but not built here).

## F. Data Model — Inference Record

New table `personal_intelligence_inferences`, one row per immutable
inference:

| Field | Type | Justification (traced to architecture) |
|---|---|---|
| `id` | text PK | Identity — required for any entity |
| `userId` | text, FK `users.id`, restrict | Invariant 6 (user isolation) |
| `claimType` | text, same enum as `personal_intelligence_claims.claim_type` | An inference proposes a value for some PIC attribute category — reuses the existing, approved 9-value enum rather than inventing a parallel taxonomy |
| `valueKind` / `valueText` | same shape as `PersonalIntelligenceClaimVersion` | The proposed content — reuses the existing shape so promotion to a claim version requires no field translation |
| `generatedAt` | timestamp | §7 requirement: "when was the inference generated" — the AI-reported/attributed generation time |
| `createdAt` | timestamp | Row-insertion time (system clock) — kept distinct from `generatedAt` per this codebase's universal convention of separating business timestamps from row-creation timestamps (Evidence, Memory, PIC claims all do this) |
| `producerCapabilityId` | text | §7 "which capability generated it" — mirrors `Gate7ExecutionAuditRecord.capabilityId` |
| `producerCapabilityVersion` | text | §7 "which prompt/instruction version" — reuses the capability's own existing `version` field (e.g. `"1.0"` on `personal-state.interpret`), **not** raw prompt text (§Privacy) |
| `producerProviderId` | text | §7 "who/what produced it" — mirrors `Gate7ExecutionAuditRecord.providerId` |
| `producerModelId` | text | §7 "which model" — mirrors `Gate7ExecutionAuditRecord.modelId` |
| `modelReportedConfidence` | real, nullable, 0–1 check | §8 structural requirement: distinguishable from system adjustment |
| `systemAdjustedConfidence` | real, nullable, 0–1 check | §8 — kept separate, never merged into one opaque number; **no formula defined here** |
| `status` | text, check `in ('proposed','confirmed','rejected','disputed','stale')` | §11, matching the architecture record's approved lifecycle values exactly |
| `statusChangedAt` | timestamp, nullable | §7 "confirmation/rejection/dispute timestamps" |

**Explicitly not added:** a reverse pointer from Inference to any
resulting `ClaimVersion`. The promotion relationship is single-sourced
on the `ClaimVersion` side only (`inferenceId`, §G) — a bidirectional
link would create two sources of truth for the same fact and is
rejected as unjustified duplication, consistent with the Minimalism
Test.

**Join table** `personal_intelligence_inference_evidence_references`:
`inferenceId` (FK), `evidenceVersionId` (FK), `userId`, composite PK
`(inferenceId, evidenceVersionId)`. Chosen over an array column because:
(a) it mirrors this codebase's only existing precedent for a
many-relationship involving these exact entities (none currently
exists, but the composite-key, FK-backed join-table pattern is how
every other multi-row ownership relationship in this schema is
expressed — e.g. the composite `claimId+userId` FK already on
`personal_intelligence_claim_versions`); (b) it allows a real FK
constraint on each reference (an array column cannot be FK-constrained
in Postgres); (c) "at least one row" is enforced at the application
layer inside the same transaction as the insert (§I), matching how
`evidenceVersionId` ownership is already verified today — a
database-level "minimum row count" constraint would require a trigger,
a mechanism with no precedent anywhere in this codebase, and is
rejected as an unjustified new mechanism.

**Optional join table** `personal_intelligence_inference_claim_context`:
`inferenceId` (FK), `claimId` (FK), `userId` — zero or more rows, no
minimum. Represents optional `ClaimVersion` contextual grounding (§10 of
the architecture record) without conflating it with the mandatory
Evidence grounding.

**One additive column on the existing claim-version table:**
`personal_intelligence_claim_versions.inference_id`, nullable, FK →
`personal_intelligence_inferences.id`, `onDelete: "restrict"`. This is
the one modification to an existing table, and it is explicitly
required by the approved architecture itself (D3 record §2: "A future
`ClaimVersion` may optionally reference that inference through a
nullable `inferenceId`") — not an unrelated schema change.

## G. Evidence Grounding Enforcement (Invariant 4)

At persistence time, inside one transaction: (1) verify every supplied
`evidenceVersionId` exists and belongs to the requesting `userId`
(mirrors the existing `evidenceVersionId` ownership-check pattern,
generalized to a set); (2) reject if the verified count is zero — **a
`ClaimVersion`-only-grounded inference must be rejected before
persistence**, per the Founder's explicit resolution; (3) only then
insert the inference row and its evidence-reference join rows. Optional
`ClaimVersion` context references (if any) are verified for the same
`userId` and inserted into the separate, non-mandatory join table —
never counted toward the minimum-evidence requirement.

## H. ClaimVersion Relationship

An inference exists independently of any claim and may never itself
become a claim by implicit conversion. Promotion is an explicit act:
creating a new `PersonalIntelligenceClaimVersion` (via the existing
`create`/`appendCorrection` repository methods, additively extended to
accept an optional `inferenceId`) that sets `inference_id` to the
originating inference's id. Rejecting an inference does not touch any
claim. Correcting a promoted claim's value uses the existing
`appendCorrection` mechanism unchanged — the resulting new claim version
may itself carry the same or a null `inference_id`, but the *original*
inference record is never mutated either way (Invariant 5). No
cross-claim conflict matching is introduced by any of this.

## I. Transactional / Atomicity Requirement

Creation of an inference is one atomic unit: (1) inside a single
`db.transaction()`, verify evidence ownership and count (§G); (2) insert
the inference row; (3) insert the evidence-reference join rows; (4)
insert any optional claim-context join rows. A failure at any step rolls
back the entire transaction — no partial inference (an inference row
with zero evidence references, or evidence references with no parent
inference row) can ever exist. This mirrors, at a slightly larger scale,
the exact transactional shape already proven in
`DrizzlePersonalIntelligenceClaimRepository.create()`.

## J. Status Lifecycle

`proposed → confirmed | rejected | disputed`, plus `stale` as a
non-destructive marker (§ of the architecture record, unchanged here).
**No automatic transition is implemented.** Every transition other than
the initial `proposed` insert is an explicit, separately-authorized
write, not defined by this Contract's initial scope (confirmation/
rejection/dispute write-paths are themselves a distinct, bounded piece
of future work — this Contract specifies their target shape, per §D,
without pre-authorizing their implementation timeline). The `stale`
representation, if implemented, is a passive marker only — **the trigger
that sets it is explicitly out of scope and undefined; if implementation
reaches a point requiring that trigger to proceed, implementation must
stop and escalate (§P), not invent one.**

## K. Privacy

Prohibited from persistence, absolutely: raw prompts, raw model
responses, copied evidence content. Permitted: `producerProviderId`,
`producerModelId`, `producerCapabilityId`, `producerCapabilityVersion`,
`generatedAt`, and evidence/claim references by ID — mirrors
`Gate7ExecutionAuditRecord`'s already-audited shape exactly. Export:
inference records must eventually be exportable under the same
principles as claims and evidence — **not implemented by this
Contract's initial scope**; flagged as a dependency, not invented.
Deletion: must follow the Memory genuine-deletion precedent (content
nulled, envelope preserved as a tombstone) when eventually
implemented — **not implemented by this Contract's initial scope**;
if a future increment cannot yet extend that mechanism to Inference,
it must mark deletion as an explicit dependency rather than inventing a
different policy.

## L. Authorization

Every repository method (create, read, list, evidence-lookup,
claim-context-lookup, and any future confirm/reject/dispute/export
operation) takes and enforces `userId` in its `WHERE` clause, with no
exception — identical to every existing PIC/Evidence/Memory repository
method. Cross-user evidence references and cross-user claim-context
references both fail at §G/§I's ownership-verification step, before any
row is written. Authorization is enforced at the repository/domain
layer, never assumed to be handled solely by a future controller layer
(none exists yet).

## M. Failure Semantics

| Case | Required behavior |
|---|---|
| AI generation fails | Nothing persisted |
| Malformed AI output | Nothing persisted (rejected before reaching the repository) |
| Missing evidence (zero references) | Reject before persistence |
| Cross-user evidence reference | Reject before persistence |
| Invalid/nonexistent evidence reference | Reject before persistence |
| Duplicate generation | Separate, independent inference records — no deduplication (none is approved) |
| Database failure mid-write | No partially-accepted inference (§I's transaction) |
| Claim-promotion failure | Original inference record remains intact and auditable — promotion failure never touches the inference row |

## N. File Boundary

**Authorized files (new, when implementation is separately authorized):**
`apps/api/src/persistence/schema/personal-intelligence-inference.schema.ts`;
`apps/api/src/core/personal-intelligence/personal-intelligence-inference.model.ts`;
`apps/api/src/core/personal-intelligence/personal-intelligence-inference.repository.ts`;
`apps/api/src/core/personal-intelligence/personal-intelligence-inference.repository.token.ts`;
`apps/api/src/infrastructure/persistence/personal-intelligence-inference.repository.ts`;
`apps/api/src/application/personal-intelligence/personal-intelligence-inference.use-case.ts`;
matching `.spec.ts` for each of the above; one new Drizzle-generated
migration file (`apps/api/src/persistence/migrations/0010_*.sql`, name
assigned by `drizzle-kit generate`, not chosen here).

**Potentially affected (additive only):**
`apps/api/src/core/personal-intelligence/personal-intelligence-claim.model.ts`
(add nullable `inferenceId` field); `apps/api/src/persistence/schema/personal-intelligence.schema.ts`
(add the one nullable column + FK, §F); `apps/api/src/infrastructure/persistence/personal-intelligence-claim.repository.ts`
(`toDomainVersion` mapper needs the new field); `apps/api/src/application/personal-intelligence/personal-intelligence.module.ts`
and the `PersistenceModule` repository-token binding (new provider
registration, mirroring the existing claim-repository binding);
`apps/api/package.json` (register new spec files, mirroring the D4-01
precedent). **Not required, explicitly out of this Contract's initial
scope:** `personal-intelligence-claim-diff.ts` (D4-01's diff function) —
extending it to report `inferenceId` changes is a legitimate future
enhancement but is not required by any D3 invariant.

**Protected — must not change:**
`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`; every Memory file
(`core/memory/**`, `application/memory/**`, `infrastructure/persistence/memory.repository.ts`,
`persistence/schema/memory.schema.ts`); every Personal State file;
`persistence/schema/evidence.schema.ts` and all Evidence core/
application/infrastructure files (Evidence ownership unchanged, PIC only
references/reads); every file under `apps/api/src/infrastructure/ai/**`
and `apps/ai-gateway/**`; the existing `detectChange`/`explainModelChange`/
`inspectEvidence` method signatures. No wildcard authorization is given
anywhere in this Contract.

## O. Migration Boundary

Additive only: one new table, one new join table, one new optional join
table, one new nullable column with an FK on an existing table. No
destructive migration. No Evidence, Memory, or Personal State schema
touched. Migration content itself is Drizzle-kit-generated from the
schema-file diff, per existing convention — not hand-authored SQL.
Verification requirement: `npm run db:generate` produces a migration
containing only additive `CREATE TABLE`/`ALTER TABLE ... ADD COLUMN`
statements for exactly the entities in §F, and the generated SQL is
reviewed against this Contract before being applied.

## P. Reversibility

Reverting the code (removing the new files, reverting the additive
diffs) does not require deleting any already-persisted inference row —
the schema addition (nullable column, new tables) can remain in place
harmlessly, or be dropped in a separate, explicit, additive-reverse
migration; neither path requires destroying historical inference
provenance. No destructive rollback behavior is defined or implied.

## Q. Implementation Stop Conditions

Implementation must stop and escalate to the Founder, not invent a
solution, if: the confidence algorithm becomes required to proceed; the
stale-trigger policy becomes required to proceed; Prediction semantics
become necessary; cross-claim matching becomes necessary; contextual
interpretation becomes necessary; API/UI becomes necessary; an ownership
boundary becomes ambiguous; Evidence ownership would need to change; the
AI Gateway would need to become PIC-aware; raw prompts/responses appear
necessary for correctness; any of the seven invariants cannot be
enforced as specified; or the actual schema design contradicts this
Contract.

## R. Tests Required (for the separately-authorized implementation)

1. Inference creation with ≥1 valid direct evidence reference succeeds.
2. Zero-evidence creation is rejected.
3. Invalid (nonexistent) evidence reference is rejected.
4. Cross-user evidence reference is rejected.
5. Multiple evidence references persist correctly.
6. Optional `ClaimVersion` contextual grounding persists correctly.
7. `ClaimVersion`-only grounding (zero direct evidence) is rejected — the core Invariant-4 test.
8. Inference record is immutable (no update path exists at all).
9. Re-evaluation creates a new, separate inference record.
10. A rejected inference remains fully readable.
11. A disputed inference remains fully readable.
12. Correcting a promoted claim does not mutate the original inference.
13. Claim-promotion preserves and does not alter the original inference.
14. User isolation for every inference read.
15. User isolation for evidence resolution.
16. Malformed AI output path — nothing persisted (once an AI capability exists; may be a use-case-layer test with a fake producer).
17. AI failure path — nothing persisted.
18. No raw prompt is ever persisted (structural/type-level test, mirroring `Gate7ExecutionAuditRecord`'s own test).
19. No raw model response is ever persisted (same).
20. No automatic promotion occurs anywhere in the code path.
21. No automatic confidence-to-truth behavior exists.
22. Provider/model/capability metadata is preserved exactly as supplied.
23. Duplicate generation produces two separate, independent inference records.
24. Claim-promotion failure leaves the inference row intact and unchanged.
25. Transaction/atomicity: a forced failure mid-write leaves zero rows in either the inference table or its evidence-reference join table.
26. Export behavior — only if export is included in the eventually-authorized scope; otherwise explicitly marked not-yet-applicable.

## S. Contract Quality Review (second, independent pass)

Re-checked against every named risk: no accidental implementation
authorization (§A's three-state banner appears at the top, restated at
the end); no hidden schema scope beyond §F/§O; no hidden API/UI scope
(§E, §N both explicit); no hidden AI scope (§Q, §K); no automatic
inference promotion anywhere (§H, §J, Invariant 2); no confidence
algorithm invented (§F, §Q); no stale-trigger invented (§J, §Q); no
conflict matching (§E); no Prediction (§E); no Goal/Daily/Decision
integration (§E, §N); no ownership leakage (§L, §N); no cross-user
access path (§G, §L); no destructive lifecycle behavior anywhere (§M,
§P). No contradiction found against the D3 architecture record, TD-04,
TD-02, D1, D2, D3, or PIC-D4-01.

## T. Required Governance Gates Before Implementation

1. Founder approval of this Contract itself (separate from architecture approval).
2. TD-09 Implementation Readiness / Build Authorization gate, evaluated against this exact Contract.
3. Explicit Founder implementation authorization act.

None of these has occurred. This document does not substitute for any of them.

---

**D3 ARCHITECTURE: APPROVED**
**D3 IMPLEMENTATION CONTRACT: PREPARED**
**D3 IMPLEMENTATION: NOT YET AUTHORIZED**
