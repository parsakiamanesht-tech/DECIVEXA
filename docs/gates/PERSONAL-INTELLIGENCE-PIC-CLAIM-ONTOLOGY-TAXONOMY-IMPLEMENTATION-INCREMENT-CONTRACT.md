# PIC Claim Ontology / Taxonomy — Implementation Increment Contract

## 1. Contract Identity

- **Title:** PIC Claim Ontology / Taxonomy (Option 2) — Implementation
  Increment Contract
- **Artifact ID:** `PIC-ONTOLOGY-CONTRACT-001`
- **Status:** **FOUNDER-REVIEWED — REPRESENTATION DECISIONS APPROVED.
  STILL NOT AN IMPLEMENTATION AUTHORIZATION.** All three representation
  designs below (§3.1–§3.3) carry explicit Founder approval, recorded
  under "FOUNDER DECISION — PIC CLAIM ONTOLOGY OPTION 2 CONTRACT REVIEW"
  (this session). Per that same message's §9, this approval is of the
  *design*, not of *writing the code* — no schema, migration, model,
  service, repository, controller, API, or test change is authorized
  until this finalized Contract is separately presented and a distinct
  implementation-authorization message is given.
- **Date:** 2026-08-28
- **Governing architecture record:**
  `docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-DECISION-RECORD.md`
  (uncommitted, unchanged, Founder-approved Option 2 — Layered Domain
  Taxonomy + Explicit Axis Set).
- **Repository baseline at authoring time:** branch `main`,
  `HEAD = origin/main = 232f786c20bda062c4bd5b3646c28889496c6015`,
  divergence `0/0`. The protected file
  `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` carries a pre-existing,
  untouched, unstaged working-tree modification that predates this task
  and remains exactly as found. This Contract file itself is uncommitted
  and unstaged, as is the sibling Decision Record.

## 2. Purpose and Scope of This Document

Option 2 (Layered Domain Taxonomy + Explicit Axis Set) remains the sole
approved architecture and is not reopened by this Contract. This document
resolves, with Founder approval now recorded, the three representation
questions the Decision Record left as **[DEFERRED QUESTION]**:

- Evidence-Linkage State (Decision Record §8) — **APPROVED**
- Subject (Decision Record §9) — **APPROVED**
- Claim User Confirmation (Decision Record §7) — **APPROVED (C3)**

Founder approval of these representations is not, by itself, an
implementation authorization (§9 of the Founder's review message,
restated in §1 above).

## 3. Design Resolution — Option 2 Representation Decisions (Finalized)

### 3.1 Evidence-Linkage State — APPROVED

**Approved model.** Three states on
`personal_intelligence_claim_versions`:

1. `linked` — an `EvidenceVersion` is actually linked
   (`evidenceVersionId` non-null and refers to a real, owned
   `EvidenceVersion`).
2. `self_reported_no_evidence_required` — the claim is intentionally
   self-reported and is not expected to receive external evidence.
3. `linkage_pending` — evidence linkage is expected/required but has not
   yet been established.

These three states must never be conflated with each other, and the
representation must not weaken Evidence Before Opinion — i.e., the
absence of evidence must always be a positive, legible statement of
*why* (exempt vs. pending), never a bare, ambiguous null.

**Approved representation.** Additive `evidence_linkage_state` text enum
column on `personal_intelligence_claim_versions`, following this schema's
existing enum-column pattern (matching `provenance`, `lifecycle`,
`valueKind`, `claimType`):

```ts
export const PERSONAL_INTELLIGENCE_EVIDENCE_LINKAGE_STATES = [
  "linked",
  "self_reported_no_evidence_required",
  "linkage_pending",
] as const;
export type PersonalIntelligenceEvidenceLinkageState =
  (typeof PERSONAL_INTELLIGENCE_EVIDENCE_LINKAGE_STATES)[number];

// on personalIntelligenceClaimVersions:
evidenceLinkageState: text("evidence_linkage_state")
  .$type<PersonalIntelligenceEvidenceLinkageState>()
  .notNull(),
```
```sql
check(
  "personal_intelligence_claim_versions_evidence_linkage_state_check",
  evidence_linkage_state in ('linked','self_reported_no_evidence_required','linkage_pending')
),
check(
  "personal_intelligence_claim_versions_evidence_linkage_coupling_check",
  (evidence_linkage_state = 'linked' and evidence_version_id is not null)
  or (evidence_linkage_state <> 'linked' and evidence_version_id is null)
)
```

**Invariant (mandatory, Founder-restated).** `evidence_linkage_state =
'linked'` if and only if `evidence_version_id is not null`, enforced by a
database check constraint, not application code alone. The two non-linked
states are distinguished purely by caller-declared intent at write time
— there is no other column from which either can be derived (consistent
with Decision Record §5, Orthogonal Axes).

**Lifecycle/transition semantics.** `personal_intelligence_claim_versions`
rows remain immutable. A change in linkage state (e.g.
`linkage_pending` → `linked` once evidence arrives) requires a new claim
version, exactly like any other value/provenance/confidence change. No
in-place mutation is introduced.

**Interaction with `evidenceVersionId`.** 1:1 coupling, database-enforced
(above).

**Interaction with `provenance`.** None — fully orthogonal, per Decision
Record §5/§6; no cross-field inference is introduced.

**Interaction with Evidence Before Opinion.** This field is the concrete
mechanism operationalizing the principle for Claims going forward.

**Migration implications.** Additive column requires a backfill before
`NOT NULL`/checks apply: existing rows with `evidence_version_id is not
null` → `'linked'`; existing rows with `evidence_version_id is null` →
`'linkage_pending'` (the conservative default — it never retroactively
asserts an evidence-exemption that was never actually declared).

**Backward compatibility.** Additive at the schema level. Not silently
compatible at the write path: every existing claim-version create/
append-correction caller must be updated to supply this field (mandatory
given the coupling constraint) — an in-scope, required code change once
implementation is authorized.

**Test requirements.** Coupling-invariant tests (both directions);
allowed-value-set tests; repository create()/appendCorrection() tests
covering all three states; migration-backfill correctness test.

**Interaction with D1/D2/D3.** None. Operates entirely within the
existing Claim↔Evidence relationship D1 already governs at coarser
granularity; does not touch D2's observed≠inferred rule or D3's
Inference/Claim separation.

### 3.2 Subject — APPROVED MINIMAL REPRESENTATION

**Approved representation.** No new column, table, entity, or registry.
`PersonalIntelligenceClaimVersion.userId` (mirrored from
`personal_intelligence_claims.userId`) **is** the current Subject
identity for PIC Claims, because the current DECIVEXA product invariant
is: **every PIC Claim is about its owning user, with no exception.**
Subject, Attribute/Domain (`claimType`), and Value (`valueText`) are
already structurally distinct axes on the existing schema — Subject
simply has not previously been *named* as such in code.

**Scope of implementation.** Limited strictly to a documentation/code
annotation making this existing semantic mapping explicit (e.g., a code
comment on `personal-intelligence-claim.model.ts` recording "Subject =
`userId`, per Decision Record §9 and this Contract's §3.2"). No new
abstraction is introduced to represent a fact `userId` already
structurally guarantees.

**Explicitly excluded, per Founder decision:** a Subject entity, a
Subject registry, a Subject table, a generalized multi-subject model,
Cross-Claim Matching infrastructure, a similarity mechanism, a matching
algorithm, and automatic merge. None of these is designed, proposed, or
implied by this section.

**Boundary condition (Founder-stated, preserved verbatim in scope).**
This approval is explicitly limited to the current invariant that every
PIC Claim is about its owning user. If a future DECIVEXA requirement
introduces claims about another person, organization, object,
relationship, or external subject, that is a separate, future Founder
decision — not authorized, implied, or foreclosed by this Contract.

**Migration/compatibility/test implications.** None — no schema change.

**Interaction with D1/D2/D3.** None.

### 3.3 User Confirmation — APPROVED (C3: Append-Only Confirmation Event)

**Founder Decision: C3 — append-only confirmation-event representation
for Claim confirmation.** C1 (a mutable/settable boolean on the immutable
`ClaimVersion` row, mirroring Memory's `userConfirmed`) is rejected by
explicit Founder instruction. This is no longer an open fork.

**For Inferences — no change, no new mechanism.** D3 §21's existing,
already-committed append-only lifecycle-event table
(`personal_intelligence_inference_lifecycle_events`, in
`personal-intelligence-inference.schema.ts`, committed `b05fb17`) already
represents `confirmed`, `rejected`, and `disputed` as valid `toStatus`
values. **This Contract documents, per explicit Founder instruction, that
these existing D3 lifecycle-event statuses remain the sole, authoritative
mechanism for Inference disposition — including Inference confirmation.**
No second, competing confirmation mechanism is created for Inferences.
D3 is not redesigned, reopened, or touched by this section.

#### 3.3.1 Claim vs. ClaimVersion Reference Resolution

**The question.** Does a confirmation event reference (1) the immutable
`ClaimVersion` (the exact confirmed content), or (2) the logical `Claim`
identity spanning all versions?

**Resolution: the event references the specific `ClaimVersion` that was
confirmed, in addition to carrying the parent `claimId` for audit-trail
querying.** This is answerable from existing repository architecture
without inventing a new concept — it directly reuses the same
single-column-FK-plus-app-layer-ownership-check pattern already
established for `evidenceVersionId` and `inferenceId` on
`personal_intelligence_claim_versions` itself. No STOP is required.

**Why `ClaimVersion`, not `Claim`, is the correct confirmation target.**
"The user confirmed this claim" must mean *the user confirmed this
specific, exact content* — not an abstract, ever-changing identity that
could later hold entirely different content:

- **Corrections.** A correction creates a new `ClaimVersion` with
  different `valueText`/`provenance`/`confidence`. If confirmation
  referenced `claimId` alone, a confirmation given for "I like coffee"
  would silently appear to still apply after a correction changes the
  value to "I like tea" — exactly the kind of accidental confirmation-
  carry-forward the Founder's review flagged as the risk to avoid. By
  referencing the specific `ClaimVersion`, the old confirmation remains
  historically true (the user did confirm that version, at that time)
  but does **not** apply to the new version — the new version starts
  unconfirmed until independently confirmed.
- **Supersession.** Identical reasoning: a new version is created,
  `lifecycle` transitions on the prior version, and confirmation does not
  transfer. The "is the Claim currently confirmed" question is answered
  by checking whether the Claim's *current* (latest, active) version has
  its own confirmation event — never by inheritance from an older
  version's confirmation.
- **Revocation.** A revoked version's confirmation history remains as an
  immutable historical record (it happened), but a revoked version is not
  the "current" version for display/derivation purposes — the derivation
  logic (out of scope for this Contract's schema-only proposal, but
  documented here for the future use-case) must combine `lifecycle` state
  with confirmation-event lookup, not confirmation alone.
- **Version history/audit.** Because every event still carries `claimId`,
  a full cross-version confirmation history for a Claim remains queryable
  in one place, even though each individual event is scoped to one exact
  version's content.

This is the representation that answers the Founder's framing directly:
it "preserves the intended meaning of 'the user confirmed this claim'
without accidentally confirming a different later version," because a
later version is, by construction, a different row with no confirmation
events of its own until one is explicitly written for it.

#### 3.3.2 Exact Proposed Representation

```ts
export const PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_ACTIONS = [
  "confirmed",
  "unconfirmed",
] as const;
export type PersonalIntelligenceClaimConfirmationAction =
  (typeof PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_ACTIONS)[number];
```
```sql
create table personal_intelligence_claim_confirmation_events (
  id text primary key,
  claim_id text not null,             -- audit-trail scope; composite FK -> (personal_intelligence_claims.id, .user_id)
  claim_version_id text not null,     -- the exact confirmed content; single-column FK -> personal_intelligence_claim_versions.id,
                                       -- ownership verified at the application/repository layer inside the same
                                       -- transaction, mirroring the established evidenceVersionId/inferenceId pattern
  user_id text not null references users(id),
  sequence integer not null,          -- per claim_id, current-max-plus-one (INSERT...SELECT), mirrors D3 exactly
  action text not null check (action in ('confirmed','unconfirmed')),
  occurred_at timestamptz not null,
  created_at timestamptz not null,
  unique (claim_id, sequence)
);
```

**Event ownership.** `user_id` on every event, plus a composite ownership
FK on `claim_id` (`(claim_id, user_id) -> personal_intelligence_claims(id,
user_id)`), matching the pattern already used throughout D3's schema.

**Claim vs. ClaimVersion reference semantics.** Both are stored — see
§3.3.1. `claim_id` for cross-version audit queries; `claim_version_id` for
determining exactly what content each event confirms/unconfirms.

**Event identity.** `id`, a standalone primary key, exactly matching the
`id` pattern on every other row in this schema (not a composite key).

**Timestamp.** `occurred_at` (when the confirmation action logically
happened) and `created_at` (when the row was written), mirroring the
`transitionedAt`/`createdAt` split already used on
`personal_intelligence_inference_lifecycle_events`.

**Actor/user identity.** `user_id`, required on every event — no event
may be written without an attributed acting user. No system/AI process
may be the `user_id` of a `'confirmed'` event (see AI-safety invariants
below).

**Confirmation semantics.** `action = 'confirmed'` records the user
affirming the referenced `claim_version_id`'s content is accurate.
`action = 'unconfirmed'` records the user explicitly retracting a prior
confirmation. Effective confirmed-state of a given `ClaimVersion` is a
pure derivation — directly analogous to D3's `deriveEffectiveStatus()` —
computed from the event with the greatest `sequence` among events
referencing that `claim_version_id`; absent any such event, the version
is unconfirmed by default (never confirmed by default, matching Memory's
`userConfirmed` defaulting to `false`).

**Append-only invariant.** Rows are inserted only, never updated or
deleted, mirroring D3 §21 exactly.

**Duplicate-event handling.** Concurrency is guarded the same way D3's
`transitionLifecycle()` guards it: `INSERT ... SELECT (max(sequence)+1)
... WHERE`, with `unique(claim_id, sequence)` as the database backstop
against a race between two concurrent writes. A semantically redundant
event (e.g. confirming an already-confirmed version again) is not
rejected by the schema — it is a harmless, valid append. Whether the
future confirmation use-case treats a redundant confirm as a no-op or a
real write is an implementation-time decision for that (currently
out-of-scope) use-case, not a schema-level concern.

**Interaction with corrections / supersession / revocation.** Covered in
full in §3.3.1 — confirmation never transfers across versions;
`lifecycle` state on the referenced version is consulted independently by
any future display/derivation logic, not conflated with confirmation
state.

**Interaction with evidence.** None. Fully orthogonal to
`evidence_linkage_state`/`evidenceVersionId`.

**Interaction with confidence.** None. Confirming a version never
modifies its (immutable) `confidence` value. Confirmation is not evidence
and is not proof.

**Interaction with epistemic type (`provenance`).** None. Confirming a
`declared` or `observed` claim version never changes its `provenance`.
Confirmation must never promote `inferred → observed` or
`inferred → declared` — restated here even though Inferences use a
separate mechanism (§3.3), because the same invariant applies
conceptually to any future interaction between the two mechanisms.

**AI-safety invariants (mandatory, restated verbatim from the Founder's
review).** The confirmation mechanism must never: modify historical
`ClaimVersion` content; modify epistemic type; convert `inferred` into
`observed`; convert `inferred` into `declared`; treat confirmation as
Evidence; treat confirmation as proof; modify confidence merely because
confirmation occurred; allow any AI process to manufacture user
confirmation. No AI-generation code path may write a `'confirmed'` event
— confirmation events may only be written by an explicit, separately-
scoped future confirmation use-case triggered by direct, attributable
user action (that use-case's design/API is out of scope for this
Contract; only the storage/derivation shape is proposed here).

**Audit/history behavior.** Full confirmation history is preserved,
queryable per `claim_id` (all versions, chronological by `sequence`) or
per `claim_version_id` (confirmation history of one exact content
snapshot).

**Migration implications.** New, additive table only; starts empty; zero
impact on any existing row in any existing table.

**Test requirements.** Derivation-function unit tests (no events → false;
single `confirmed` → true; `confirmed` then `unconfirmed` → false;
out-of-order `sequence` handled correctly); the corrections/supersession
non-carry-forward test (confirming version N must not cause version N+1
to read as confirmed); concurrency test for the `INSERT...SELECT...
unique(claim_id, sequence)` guard, mirroring D3's existing concurrency
tests; an architectural invariant test asserting no code path other than
an explicit, human-triggered confirmation call can insert a `'confirmed'`
event.

**Interaction with D1/D2/D3.** Structurally reuses D3 §21's own
append-only event-log pattern by direct analogy; does not modify any D3
table. Fully consistent with D2's observed≠inferred rule — confirmation
is neither an epistemic type nor a confidence signal, kept fully
orthogonal to both.

## 4. D1/D2/D3 Compatibility Verification (Final Consistency Audit)

- **D1** (Personal Intelligence / TD-04 Human-OS ownership and current-
  state model): unaffected. No column, table, or relationship governed by
  D1 is modified; §3.1–§3.3 are additive extensions within the existing
  Claim/ClaimVersion/Evidence relationships D1 already recognizes.
- **D2** (observed≠inferred rule): unaffected and actively preserved.
  Neither `evidence_linkage_state` nor the confirmation-event mechanism
  can promote or imply an epistemic-type change; both are explicitly
  documented as orthogonal to `provenance` in §3.1 and §3.3.
- **D3** (Inference Provenance, Option B + §21 append-only lifecycle):
  unaffected. No D3 table, model, or repository method is modified.
  §3.3 explicitly reuses D3 §21's pattern by structural analogy for a
  new, separate table — it does not touch, extend, or redesign D3's own
  Inference lifecycle-event table, and Inference confirmation continues
  to use D3's existing mechanism exclusively, per Founder instruction.
- **No hidden architectural decision was introduced.** The only design
  choice made without an explicit prior Founder instruction is the
  `ClaimVersion`-vs-`Claim` reference resolution in §3.3.1 — resolved
  directly from existing, precedented repository patterns (the
  single-column-FK-plus-app-layer-ownership-check already used for
  `evidenceVersionId`/`inferenceId`), not by inventing a new mechanism
  class, and presented here for Founder visibility rather than silently
  assumed.
- **No deferred item was reopened.** Cross-Claim Matching, Living User
  Model, Pattern Entity, Typed Contradiction Relations, the confidence
  algorithm, stale/re-evaluation triggers, prediction architecture,
  Personal State temporal correction, FIS-057, broader Event Sourcing,
  AI Gateway redesign, and LLM architecture changes are untouched by
  every section above.

## 5. Exact Implementation Boundary (once separately authorized)

**In scope, once implementation is separately authorized:**
- Additive `evidence_linkage_state` column + two check constraints on
  `personal_intelligence_claim_versions` (§3.1), plus the required
  repository/use-case write-path update to populate it on every create/
  append-correction call.
- A documentation-only code comment recording the Subject↔`userId`
  mapping (§3.2) — no schema change.
- New `personal_intelligence_claim_confirmation_events` table, its
  `PersonalIntelligenceClaimConfirmationAction` type, and a pure
  derivation function analogous to `deriveEffectiveStatus()` (§3.3) —
  storage and derivation only, **not** the confirmation-triggering
  use-case/API/workflow itself, which remains a separate, future,
  explicitly out-of-scope increment.
- Required Drizzle migration(s), generated the same way migration
  `0010_large_wolfsbane.sql` was generated for D3.
- Tests per the requirement lists in §3.1 and §3.3.2.

**Not in scope even after implementation authorization:**
- Any confirmation-triggering API, controller, or workflow.
- Any Subject entity, registry, or multi-subject support.
- Any Cross-Claim Matching, similarity, ranking, merge, or conflict
  resolution.
- Any Living User Model work.
- Any change to D1, D2, D3, D4-01, Memory, Evidence, or any TD document.
- Any change to `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`.
- Any general Event Sourcing architecture — the confirmation-event table
  is a narrow, single-purpose append-only log, not a generalized
  event-sourcing mechanism.

**Not authorized by this document at all:** no schema file, migration,
model, service, repository, controller, API contract, or test has been
created, modified, staged, committed, or pushed as part of producing or
finalizing this Contract.

## 6. Exact Protected Files

- `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` — absolute protection,
  untouched, not staged, not committed, not reverted, not reset, not
  included in any broad staging command.

## 7. Exact Deferred Items (unaffected)

From the directive: Cross-Claim Matching algorithm; Living User Model;
Pattern Entity; Typed Contradiction Relations; Confidence Algorithm;
Stale/Re-evaluation Trigger; Prediction Architecture; Personal State
temporal correction; FIS-057; broader Event Sourcing; AI/LLM architecture
redesign; AI Gateway redesign.

From the Decision Record §20: final placement of `strength`/`weakness`;
PIC/Evidence/Memory lifecycle-vocabulary unification; Personal State
`observedAt`/`acceptedAt` asymmetry; any future Subject multi-entity
capability (§3.2 above).

## 8. Remaining Founder Decisions

None identified. All three representation questions (§3.1, §3.2, §3.3
including the §3.3.1 Claim-vs-ClaimVersion reference question) are
resolved with explicit Founder approval or, for §3.3.1, resolved directly
from existing precedented architecture and presented for visibility per
§4. No unresolved fork remains in this Contract.

The only decision still required before any code is written is a
separate, explicit **implementation authorization** message — this
Contract's approval is a design approval, not that authorization (§1).

## 9. Change Control

This finalized Contract is superseded only by a further Founder decision
amending it, or by a future, separately-scoped governance record. It does
not itself authorize implementation.
