# Personal Intelligence — D3 Inference Provenance Implementation Contract

## A. Contract Identity

- **Title:** Personal Intelligence — D3 Inference Provenance Implementation
  Contract
- **Artifact ID:** `PI-D3-IMPLEMENTATION-CONTRACT-001`
- **Status:** **CONTRACT REVISED — PENDING FINAL READINESS AUDIT — NOT
  FOUNDER-APPROVED AS REVISED — NOT BUILD-AUTHORIZED**
- **Original preparation date:** 2026-08-27. Repository context at original
  preparation: branch `main`, `HEAD = origin/main =
  0ccfbe4465e39a7103fcea09d45074b3901103fa`, divergence `0/0`.
- **Revision date:** 2026-08-28. **Revision authority:** Parsa Kiamanesh —
  Originator, Founder & Owner of DECIVEXA, via the "D3 IMPLEMENTATION
  CONTRACT REVISION AFTER §21" directive. **Revision baseline:** branch
  `main`, `HEAD = origin/main = a0ed537f9fded12821891a3b3de18ab27dc536a0`,
  divergence `0/0`. This revision incorporates the D3 Architecture
  Decision Record's §21 Founder Addendum (Status-Lifecycle Physical
  Realization), committed and pushed at that same commit. The protected
  pre-existing modification, `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`,
  is present and untouched, both at original preparation and at this
  revision.
- **Nature of this revision:** This revision resolves exactly one thing —
  the blocking ambiguity identified by the D3 Pre-Implementation
  Readiness Audit between the original §F/§J wording (`status`/
  `statusChangedAt` stored on the immutable Inference row) and Invariants
  3 and 5. It does so exactly as the Founder's §21 addendum requires: by
  introducing a separate, append-only lifecycle-history mechanism. It
  does not reopen, weaken, or expand any other part of this Contract, and
  it does not resolve any of the five (now six, per §21.9) deferred D3
  questions.

**Three separate governance states, not to be conflated:**

```
D3 ARCHITECTURE: APPROVED
        (docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md,
         commit a0ed537f9fded12821891a3b3de18ab27dc536a0, including §21)
D3 IMPLEMENTATION CONTRACT: REVISED — PENDING FINAL READINESS AUDIT
        (this document, as revised)
D3 IMPLEMENTATION: NOT YET AUTHORIZED
        (requires a separate, future, explicit Founder act)
```

This document is an implementation specification and governance boundary.
**It is not implementation.** No code, schema, migration, API, UI, AI
capability, or test file is created or modified by this document's
revision.

## B. Governance Authority

Authoritative sources, not reinterpreted by this Contract:
`docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md`
(Option B, seven invariants, DIRECT EVIDENCE REQUIRED, and — as of this
revision — §21's Founder-approved status-immutability/append-only-
lifecycle addendum, which this Contract must conform to and does not
reinterpret); TD-04; TD-02 Ownership Matrix;
`PERSONAL-INTELLIGENCE-TD-04-APPROVAL-AND-CURRENT-STATE-OWNERSHIP-DECISION-RECORD.md`
(D1/D2); `PERSONAL-INTELLIGENCE-GOVERNANCE-REMEDIATION-RECORD.md`;
`PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md`.

## C. Fresh Repository Audit

Confirmed by direct inspection at original preparation, re-confirmed
unchanged at this revision (no relevant repository file has changed since
the original Contract was written):

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
- **New, added by this revision:** the codebase's existing pattern for
  historical integrity is not a separate event/log table — it is "one
  immutable row per version, added via `INSERT ... SELECT ... WHERE`,
  never `UPDATE`" (`DrizzlePersonalIntelligenceClaimRepository.appendCorrection`,
  and the identical pattern already proven for Evidence's
  `appendLifecycleVersion`). The append-only lifecycle-history mechanism
  required by §21 reuses this exact, already-proven technique — one
  append-only row per lifecycle event, with a per-inference monotonically
  increasing `sequence` column computed via the same `INSERT ... SELECT`
  next-value technique already used for `version`, and the same
  correlated concurrency guard already used by `appendCorrection` —
  rather than inventing a new mechanism (a Postgres identity/serial
  column, a message queue, or a general event bus, none of which has any
  precedent in this codebase).

No discrepancy was found between the approved architecture record
(including §21) and the actual repository state.

## D. Scope — What Will Be Implemented (when separately authorized)

A new, independent, immutable Inference Record, together with a bounded,
D3-specific, append-only Inference Lifecycle-History mechanism required
by §21 to keep the Inference Record itself immutable, wired into
Personal Intelligence's existing module, following every existing
pattern in this codebase. Scope is exactly:

1. Creating an Inference Record together with its evidence references
   (and optional claim-context references) and an initial `proposed`
   lifecycle-history entry, atomically (§I).
2. Reading an Inference Record, its evidence/claim-context references,
   and its full lifecycle history.
3. Deriving the Inference's current effective status from its lifecycle
   history (§F "Effective status derivation").
4. Appending exactly one new lifecycle-history entry representing an
   explicit, externally-authorized transition (`proposed → confirmed |
   rejected | disputed | stale`), atomically, without ever mutating the
   Inference Record or any prior lifecycle-history entry.

Item 4 is a bounded write-**capability** only: this Contract specifies
the repository-level mechanism and its concurrency/authorization
guarantees, not any upstream policy, UI, or automated process that
decides *when* to invoke it — that invocation policy remains explicitly
out of scope and undecided (§E).

No version column is needed on the Inference Record itself — it is never
mutated at all, so there is nothing on that row to version. The
lifecycle-history table is what is append-only/versioned, exactly
analogous to how `ClaimVersion`/`EvidenceVersion` are already versioned,
except that here the *parent* row (the Inference Record) never changes at
all, ever — only the child (lifecycle-history) table grows.

## E. Out of Scope (explicit)

AI capability implementation or invocation; the confidence algorithm;
the stale/re-evaluation trigger mechanism; Prediction; cross-claim
conflict matching; contextual interpretation / FIS-057; any broader
event-sourcing architecture beyond the bounded lifecycle-history
mechanism in §F/§I (§21.8); any HTTP/API or UI surface; Goal OS/Daily
OS/Decision Engine integration; automatic status transitions of any
kind; **any upstream trigger, UI flow, user-facing confirmation surface,
or automated/background policy that decides when to invoke a lifecycle
transition — the write mechanism is in scope (§D item 4), its invocation
policy is not**; deletion/export *implementation* (the *architecture*
for both is specified, per §K, but not built here); **any lifecycle
transition beyond `proposed → confirmed | rejected | disputed | stale`**
(§F's "Permitted transition graph" — no transition out of a terminal
state, e.g. `confirmed → disputed`, is authorized by any existing
document, and none is added by this revision); **any cached or
materialized "current status" column or read-model** — effective status
must be derived from lifecycle history at read time (§F, §Q).

## F. Data Model — Inference Record and Lifecycle History

New table `personal_intelligence_inferences`, one row per immutable
inference, written exactly once at creation and never updated or deleted
as part of ordinary lifecycle handling:

| Field | Type | Justification (traced to architecture) |
|---|---|---|
| `id` | text PK | Identity — required for any entity |
| `userId` | text, FK `users.id`, restrict | Invariant 6 (user isolation) |
| `claimType` | text, same enum as `personal_intelligence_claims.claim_type` | An inference proposes a value for some PIC attribute category — reuses the existing, approved 9-value enum rather than inventing a parallel taxonomy |
| `valueKind` / `valueText` | same shape as `PersonalIntelligenceClaimVersion` | The proposed content — reuses the existing shape so promotion to a claim version requires no field translation |
| `generatedAt` | timestamp | The AI-reported/attributed generation time |
| `createdAt` | timestamp | Row-insertion time (system clock) — kept distinct from `generatedAt` per this codebase's universal convention of separating business timestamps from row-creation timestamps |
| `producerCapabilityId` | text | Which capability generated it — mirrors `Gate7ExecutionAuditRecord.capabilityId` |
| `producerCapabilityVersion` | text | Which capability version — reuses the capability's own existing `version` field, **not** raw prompt text (§K) |
| `producerProviderId` | text | Who/what produced it — mirrors `Gate7ExecutionAuditRecord.providerId` |
| `producerModelId` | text | Which model — mirrors `Gate7ExecutionAuditRecord.modelId` |
| `modelReportedConfidence` | real, nullable, 0–1 check | Distinguishable from system adjustment |
| `systemAdjustedConfidence` | real, nullable, 0–1 check | Kept separate, never merged into one opaque number; **no formula defined here** |

**Removed by this revision:** `status`, `statusChangedAt` — these are no
longer fields on this table. Placing lifecycle state directly on the
Inference row was the source of the blocking ambiguity identified by the
Readiness Audit and resolved by §21 of the architecture record; lifecycle
state is now represented exclusively by the lifecycle-history table
below, never by a field on this row.

**Added by this revision:** a unique index
`personal_intelligence_inferences_id_user_id_unique` on `(id, userId)` —
mirrors the identical precedent already established on
`personal_intelligence_claims` and `evidence`. It is required so the new
lifecycle-history table below can enforce ownership with a real
composite FK, exactly as `personal_intelligence_claim_versions_claim_owner_fk`
already does for claim versions.

**Explicitly not added:** a reverse pointer from Inference to any
resulting `ClaimVersion`. The promotion relationship is single-sourced
on the `ClaimVersion` side only (`inferenceId`, §H) — a bidirectional
link would create two sources of truth for the same fact and is
rejected as unjustified duplication, consistent with the Minimalism
Test.

New table `personal_intelligence_inference_lifecycle_events`, append-only,
one row per lifecycle transition, including the initial `proposed` entry
created atomically together with the Inference Record:

| Field | Type | Justification (traced to §21 / the revision directive) |
|---|---|---|
| `id` | text PK | Identity |
| `inferenceId` | text, FK → `personal_intelligence_inferences.id`, restrict | Which inference this event belongs to |
| `userId` | text, FK (composite, → `personal_intelligence_inferences.(id, userId)`), restrict | Ownership **and** the authorized actor for this transition — mirrors this codebase's universal single-actor-is-the-owner pattern; no separate agent/admin-actor concept is introduced, since none exists elsewhere in PIC |
| `sequence` | integer, NOT NULL | Deterministic per-inference ordering, computed exactly the way `personal_intelligence_claim_versions.version` is computed (current-max-plus-one via the same `INSERT ... SELECT` technique already used by `appendCorrection`) — the effective-status derivation rule below requires an unambiguous "latest" entry; this reuses existing precedent rather than introducing a database identity/serial column, which has no precedent anywhere in this schema |
| `fromStatus` | text, nullable, check `in ('proposed','confirmed','rejected','disputed','stale')` or null | Null only for the initial entry (`sequence = 1`); otherwise the effective status the caller observed and is transitioning away from — required by the concurrency guard (§I) |
| `toStatus` | text, NOT NULL, check `in ('proposed','confirmed','rejected','disputed','stale')` | The new effective status this event establishes |
| `transitionedAt` | timestamp | Business time of the transition, distinct from row-insertion time |
| `createdAt` | timestamp | Row-insertion time |

Constraints: `unique(inferenceId, sequence)` — the database-enforced
backstop against a race between two concurrent transition attempts,
mirroring `personal_intelligence_claim_versions_claim_id_version_unique`
exactly; `check` on `fromStatus`; `check` on `toStatus`.

**Permitted transition graph (fixed by this revision, not to be
expanded):** the initial entry is always `fromStatus = null, toStatus =
'proposed', sequence = 1`. Every subsequent entry must have `fromStatus
= 'proposed'` and `toStatus ∈ {'confirmed','rejected','disputed','stale'}`.
No entry may have `fromStatus ∈ {'confirmed','rejected','disputed','stale'}`
— every non-initial transition originates from `proposed`, and each of
the four outcomes is terminal. This is a direct, structurally-necessitated
consequence of the *original* Contract's own data shape (a single
`status` column with exactly these five mutually-exclusive values,
unchanged in kind by §21 — §21 only relocated where that state is
stored, not the enum itself) combined with the Founder's revision
directive §7, which lists only these four transitions as authorized.
Nothing broader (e.g. `confirmed → disputed`, or a `stale` reachable
from an already-terminal state) is introduced here; that remains
explicitly unauthorized and undecided by any existing document.

**Effective status derivation:** an Inference's current effective status
is the `toStatus` of the lifecycle-history row for that `inferenceId`
with the greatest `sequence` value (`ORDER BY sequence DESC LIMIT 1`).
This is computed by a query at read time, **never** stored as a mutable
column anywhere, and no cache or materialized "current status" column is
introduced (§E, §Q).

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
rejected as an unjustified new mechanism. Unaffected by this revision.

**Optional join table** `personal_intelligence_inference_claim_context`:
`inferenceId` (FK), `claimId` (FK), `userId` — zero or more rows, no
minimum. Represents optional `ClaimVersion` contextual grounding (§10 of
the architecture record) without conflating it with the mandatory
Evidence grounding. Unaffected by this revision.

**One additive column on the existing claim-version table:**
`personal_intelligence_claim_versions.inference_id`, nullable, FK →
`personal_intelligence_inferences.id`, `onDelete: "restrict"`. This is
the one modification to an existing table, and it is explicitly
required by the approved architecture itself (D3 record §2: "A future
`ClaimVersion` may optionally reference that inference through a
nullable `inferenceId`") — not an unrelated schema change. Unaffected by
this revision.

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
never counted toward the minimum-evidence requirement. Unaffected by
this revision — §21 concerns lifecycle state only, not evidence
grounding.

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
cross-claim conflict matching is introduced by any of this. **Added by
this revision:** promotion, correction, and rejection all continue to
never mutate the Inference Record, and none of them appends a
lifecycle-history entry as a side effect — a lifecycle-history entry is
created only by an explicit call to the transition mechanism in §D
item 4 / §J, never implicitly by a claim-side operation.

## I. Transactional / Atomicity Requirement

Creation of an inference is one atomic unit: (1) inside a single
`db.transaction()`, verify evidence ownership and count (§G); (2) insert
the inference row; (3) insert the evidence-reference join rows; (4)
insert any optional claim-context join rows; (5) **insert the initial
lifecycle-history entry (`sequence = 1, fromStatus = null, toStatus =
'proposed'`)**. A failure at any step rolls back the entire transaction
— no partial inference (an inference row with zero evidence references,
evidence references with no parent inference row, or an inference row
with no initial lifecycle-history entry) can ever exist. This mirrors,
at a slightly larger scale, the exact transactional shape already proven
in `DrizzlePersonalIntelligenceClaimRepository.create()`.

**Lifecycle transition is a second, separate atomic unit**, mirroring
`appendCorrection`'s exact `INSERT ... SELECT ... WHERE` concurrency
pattern rather than a multi-statement transaction: a single atomic
`INSERT ... SELECT` sources its row from the current lifecycle-history
state for that `inferenceId`, filtered to rows where (a) the inference
belongs to the requesting `userId`, (b) the caller-supplied
`expectedFromStatus` matches the `toStatus` of the row currently holding
the greatest `sequence` for that inference, and (c) the requested
`toStatus` is one of the four permitted terminal values. If zero source
rows match — because of a stale `expectedFromStatus` (a concurrent
transition already happened), a nonexistent or foreign inference, or an
invalid `toStatus` — zero rows are inserted and the caller receives an
explicit rejection, never a silent no-op or a fabricated success. This
is the same concurrency-safety shape `appendCorrection` already proves
for `ClaimVersion`, applied to lifecycle-history events instead.

## J. Status Lifecycle

The lifecycle of an Inference is `proposed → confirmed | rejected |
disputed | stale` (§F's "Permitted transition graph"). **No lifecycle
transition mutates the Inference Record.** Every transition — including
the initial `proposed` entry — is represented exclusively as a new row
in `personal_intelligence_inference_lifecycle_events` (§F); none is ever
an `UPDATE` of any existing row, in either table. The Inference Record's
own columns (value, evidence references, producer/provider/model/
capability metadata, confidence, creation timestamp) are set exactly
once, at creation, and are never touched again by any lifecycle
operation.

**No automatic transition is implemented or authorized.** Every
transition beyond the initial `proposed` insert requires an explicit
call to the lifecycle-transition mechanism (§I), supplying the caller's
own observed `expectedFromStatus` and the requested `toStatus`. This
Contract specifies that mechanism's persistence shape and concurrency
guarantee; it does **not** specify, decide, or implement *who or what is
authorized to call it, from which surface, or under what upstream
policy* — that remains explicitly out of scope (§E) and is not resolved
by this revision, exactly as it was not resolved by the original
Contract.

`stale` is one of the four permitted terminal `toStatus` values,
represented identically to `confirmed`/`rejected`/`disputed` — a
lifecycle-history row, never a mutation. **The trigger that would cause
a `stale` transition to be requested remains explicitly out of scope and
undecided** (§21.9 item 2 of the architecture record: whether stale is
computed at read time, materialized through an explicit lifecycle
action, or driven by a scheduling/background policy is unresolved) — if
implementation reaches a point requiring that trigger to proceed,
implementation must stop and escalate (§Q), not invent one.

## K. Privacy

Prohibited from persistence, absolutely: raw prompts, raw model
responses, copied evidence content. Permitted on the Inference Record:
`producerProviderId`, `producerModelId`, `producerCapabilityId`,
`producerCapabilityVersion`, `generatedAt`, and evidence/claim
references by ID — mirrors `Gate7ExecutionAuditRecord`'s already-audited
shape exactly. **Lifecycle-history rows carry only `fromStatus`/
`toStatus`/timestamps/`userId`/`sequence`** — structurally incapable of
carrying raw prompt or provider-response content, by the same
"parameter shape makes it impossible" discipline `Gate7ExecutionAuditRecord`'s
builder already proves. Export: inference records and their lifecycle
history must eventually be exportable under the same principles as
claims and evidence — **not implemented by this Contract's initial
scope**; flagged as a dependency, not invented. Deletion: must follow
the Memory genuine-deletion precedent (content nulled, envelope
preserved as a tombstone) when eventually implemented, covering both the
Inference Record and its lifecycle history under the same policy, not a
separate one — **not implemented by this Contract's initial scope**; if
a future increment cannot yet extend that mechanism to Inference, it
must mark deletion as an explicit dependency rather than inventing a
different policy.

## L. Authorization

Every repository method (create, read, list, evidence-lookup,
claim-context-lookup, lifecycle-history read, **lifecycle-transition
write**, and any future export operation) takes and enforces `userId` in
its `WHERE`/ownership-verification clause, with no exception — identical
to every existing PIC/Evidence/Memory repository method. **An inference
identifier alone is never sufficient authorization for a lifecycle-history
read or write — every lifecycle operation must independently verify the
requesting `userId` owns the referenced Inference**, via the composite
FK/ownership pattern established in §F, exactly mirroring the existing
PIC repository convention. Cross-user evidence references, cross-user
claim-context references, and cross-user lifecycle-transition attempts
all fail at their respective ownership-verification step, before any row
is written. Authorization is enforced at the repository/domain layer,
never assumed to be handled solely by a future controller layer (none
exists yet).

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
| Unauthorized lifecycle transition (caller does not own the inference) | Reject before persistence; no lifecycle-history entry created |
| Invalid lifecycle transition (`expectedFromStatus` does not match the current effective status, or `toStatus` is not one of the four permitted values) | Reject before persistence; no lifecycle-history entry created |
| Concurrent lifecycle transition race | Exactly one attempt wins per §I's `INSERT...SELECT...WHERE` guard; the other receives an explicit rejection, never a silently contradictory history |

## N. File Boundary

**Authorized files (new, when implementation is separately authorized) —
unchanged file list, expanded responsibility:**
`apps/api/src/persistence/schema/personal-intelligence-inference.schema.ts`
(now also defines `personal_intelligence_inference_lifecycle_events` and
the `(id, userId)` unique index on `personal_intelligence_inferences`,
§F); `apps/api/src/core/personal-intelligence/personal-intelligence-inference.model.ts`
(now also defines the lifecycle-history domain type and the derived
effective-status concept); `apps/api/src/core/personal-intelligence/personal-intelligence-inference.repository.ts`
/ `.repository.token.ts` (interface now also declares the
lifecycle-history read and transition-write methods);
`apps/api/src/infrastructure/persistence/personal-intelligence-inference.repository.ts`
(implementation now also includes the lifecycle-history `INSERT...SELECT...WHERE`
method, §I); `apps/api/src/application/personal-intelligence/personal-intelligence-inference.use-case.ts`
(now also exposes the transition capability, §D item 4); matching
`.spec.ts` for each of the above; one new Drizzle-generated migration
file (`apps/api/src/persistence/migrations/0010_*.sql`, name assigned by
`drizzle-kit generate`, not chosen here — still exactly one migration
file, since both new tables are part of the same schema-file diff).
**This revision does not add any new file to the file boundary** — the
lifecycle-history mechanism is realized entirely inside the file set
already authorized by the original Contract.

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
anywhere in this Contract. Unaffected by this revision.

## O. Migration Boundary

Additive only: one new table (`personal_intelligence_inferences`), **one
new lifecycle-history table (`personal_intelligence_inference_lifecycle_events`)**,
one new join table (evidence references), one new optional join table
(claim context), **one new unique index on the base inferences table
(`(id, userId)`)**, one new nullable column with an FK on an existing
table. No destructive migration. No Evidence, Memory, or Personal State
schema touched. Migration content itself is Drizzle-kit-generated from
the schema-file diff, per existing convention — not hand-authored SQL.
Verification requirement: `npm run db:generate` produces a migration
containing only additive `CREATE TABLE`/`ALTER TABLE ... ADD COLUMN`/
`CREATE UNIQUE INDEX` statements for exactly the entities in §F, and the
generated SQL is reviewed against this Contract before being applied.

## P. Reversibility

Reverting the code (removing the new files, reverting the additive
diffs) does not require deleting any already-persisted inference row or
lifecycle-history row — the schema additions (nullable column, new
tables, new unique index) can remain in place harmlessly, or be dropped
in a separate, explicit, additive-reverse migration; neither path
requires destroying historical inference provenance or lifecycle
history. No destructive rollback behavior is defined or implied.

## Q. Implementation Stop Conditions

Implementation must stop and escalate to the Founder, not invent a
solution, if: the confidence algorithm becomes required to proceed; the
stale-trigger policy becomes required to proceed; Prediction semantics
become necessary; cross-claim matching becomes necessary; contextual
interpretation becomes necessary; API/UI becomes necessary; an ownership
boundary becomes ambiguous; Evidence ownership would need to change; the
AI Gateway would need to become PIC-aware; raw prompts/responses appear
necessary for correctness; **the permitted transition graph (§F) would
need to expand beyond `proposed → confirmed | rejected | disputed |
stale`**; **a cached or materialized "current status" column or read
model becomes necessary for correctness or performance** (§E — effective
status must remain derived, never stored, unless a future, separately
authorized architecture decision says otherwise); any of the seven
invariants cannot be enforced as specified; or the actual schema design
contradicts this Contract.

## R. Tests Required (for the separately-authorized implementation)

1. Inference creation with ≥1 valid direct evidence reference succeeds,
   and atomically creates the initial `proposed` lifecycle-history entry
   (`sequence = 1, fromStatus = null`).
2. Zero-evidence creation is rejected — no Inference Record and no
   lifecycle-history entry is created.
3. Invalid (nonexistent) evidence reference is rejected — same.
4. Cross-user evidence reference is rejected — same.
5. Multiple evidence references persist correctly.
6. Optional `ClaimVersion` contextual grounding persists correctly.
7. `ClaimVersion`-only grounding (zero direct evidence) is rejected —
   the core Invariant-4 test.
8. No update operation exists for the original Inference Record —
   structural/type-level test (no repository method performs an
   `UPDATE` against `personal_intelligence_inferences`).
9. No delete operation exists for the original Inference Record as part
   of ordinary lifecycle handling.
10. Re-evaluation creates a new, separate Inference Record (with its own
    new initial lifecycle-history entry) — the original record and its
    lifecycle history are untouched.
11. `proposed → confirmed` appends a new lifecycle-history entry
    (`sequence = 2, fromStatus = 'proposed', toStatus = 'confirmed'`)
    without altering the Inference Record or the initial lifecycle-
    history entry.
12. `proposed → rejected` — same shape as test 11.
13. `proposed → disputed` — same shape as test 11.
14. `proposed → stale` — same shape as test 11; confirms `stale` does
    not mutate the original record.
15. A rejected inference's original Inference Record remains fully
    readable and unchanged.
16. A disputed inference's original Inference Record remains fully
    readable and unchanged.
17. Effective status is correctly derived as the `toStatus` of the
    lifecycle-history row with the greatest `sequence` (tested for the
    no-transition case, and after one transition).
18. Lifecycle-history reads are user-scoped; cross-user lifecycle-history
    access is rejected.
19. Lifecycle-history writes (transitions) are user-scoped; a transition
    attempt against another user's inference is rejected before any row
    is written.
20. A transition whose `expectedFromStatus` does not match the current
    effective status is rejected — no lifecycle-history entry is
    created (stale-caller-observation case).
21. A transition to a `toStatus` outside the four permitted values is
    rejected — no lifecycle-history entry is created.
22. A transition attempted against an already-terminal inference
    (supplied `expectedFromStatus` is not `'proposed'`) is rejected —
    confirms the fixed, non-expanded transition graph.
23. Two concurrent transition attempts against the same inference:
    exactly one succeeds; the other is rejected with no silently
    contradictory lifecycle history (mirrors `appendCorrection`'s
    existing concurrency test pattern).
24. Correcting a promoted claim does not mutate the original inference
    or append a lifecycle-history entry.
25. Claim-promotion failure leaves the Inference Record and its
    lifecycle history intact and unchanged.
26. User isolation for every inference read.
27. User isolation for evidence resolution.
28. No raw prompt is ever persisted (structural/type-level test —
    applies to both the Inference Record and lifecycle-history rows).
29. No raw model response is ever persisted (same).
30. No automatic promotion occurs anywhere in the code path — no code
    path exists that calls the transition mechanism without an explicit
    external caller supplying `expectedFromStatus`/`toStatus`.
31. No automatic confidence-to-truth behavior exists — confidence values
    are never read by any transition logic.
32. Provider/model/capability metadata is preserved exactly as supplied
    on the Inference Record.
33. Duplicate generation produces two separate, independent Inference
    Records, each with its own independent lifecycle history — no
    deduplication.
34. Transaction/atomicity: a forced failure mid-write during creation
    leaves zero rows in the inference table, its evidence-reference
    join table, and its lifecycle-history table.
35. AI/provider unavailability does not destroy or block reads of
    existing Inference Records or their lifecycle history.
36. Export behavior — only if export is included in a future,
    separately-authorized scope; otherwise explicitly marked
    not-yet-applicable, for both the Inference Record and its lifecycle
    history.

## S. Contract Quality Review (second, independent pass)

Re-checked against every named risk, including the risk this revision
exists to close: no accidental implementation authorization (§A's
three-state banner appears at the top and is restated at the end,
updated to "REVISED — PENDING FINAL READINESS AUDIT"); no hidden schema
scope beyond §F/§O (exactly one new table beyond the original design —
the lifecycle-history table — required by §21, not invented); no hidden
API/UI scope (§E, §N both explicit, and §E now explicitly excludes any
upstream trigger/policy for invoking a transition); no hidden AI scope
(§Q, §K unchanged); no automatic inference promotion anywhere (§H, §J,
Invariant 2 — reinforced, not weakened, by the append-only model); no
confidence algorithm invented (§F, §Q); no stale-trigger invented (§J,
§Q — explicitly still undecided); no conflict matching (§E); no
Prediction (§E); no Goal/Daily/Decision integration (§E, §N); no
ownership leakage (§L, §N — the new composite-FK ownership pattern on
the lifecycle-history table strengthens this at the database level); no
cross-user access path (§G, §I, §L); no destructive lifecycle behavior
anywhere (§M, §P — strengthened: the Inference Record now has zero write
paths after creation, full stop); **the original blocking ambiguity
(Invariant 3/5 vs. in-place status mutation) is fully eliminated** — the
Inference Record has no field that any lifecycle operation writes to
after creation, and every lifecycle transition is representable only as
a new, independently-immutable row; **Option C (full event sourcing) was
not introduced** — the lifecycle-history mechanism is scoped to exactly
one entity relationship (an Inference and its own lifecycle events),
reuses an already-existing persistence technique (append-only rows via
`INSERT...SELECT`), and defines no general event bus, no cross-entity
event log, and no system-wide event-sourcing capability; **all five (now
six, per §21.9) deferred questions remain deferred** — confidence
algorithm, stale/re-evaluation trigger, prediction, cross-claim conflict
matching, contextual interpretation/FIS-057, and any broader
event-sourcing architecture. No contradiction found against the D3
architecture record (including §21), TD-04, TD-02, D1, D2, D3, or
PIC-D4-01.

## T. Required Governance Gates Before Implementation

1. Founder approval of this Contract, as revised (separate from
   architecture approval and separate from the §21 addendum's own
   approval).
2. TD-09 Implementation Readiness / Build Authorization gate, evaluated
   against this exact revised Contract.
3. Explicit Founder implementation authorization act.

None of these has occurred. This document does not substitute for any of
them.

---

**D3 ARCHITECTURE: APPROVED**
**D3 STATUS IMMUTABILITY: APPROVED**
**D3 IMPLEMENTATION CONTRACT: REVISED — PENDING FINAL READINESS AUDIT**
**D3 IMPLEMENTATION: NOT YET AUTHORIZED**
