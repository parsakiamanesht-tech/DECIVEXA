# Claim Correction (C4) — Implementation Increment Contract

> **IMPLEMENTATION CONTRACT — NOT IMPLEMENTATION.**
> **IMPLEMENTATION AUTHORIZATION: NOT GRANTED.**
> Documentation only. No code, schema, migration, test, API, repository,
> UI, or service file was modified in producing this document.

**Status: FOUNDER-APPROVED CONTRACT — IMPLEMENTATION NOT AUTHORIZED.**

This Contract formalizes Founder decisions already made across four
prior read-only audits performed in this governance track: the C4 Claim
Correction Contract & Implementation Readiness Audit; the C4-A Option 2
Reconciliation; the C4-A2 Founder Domain Clarification Audit; and the
C4 Founder Decision Reconciliation (FD-C4-1, FD-C4-2, FD-C4-4, FD-C4-5).
It writes down what those audits established and what the Founder
approved. It does not reopen, weaken, or reinterpret any of them, and it
does not, by itself, authorize any implementation step.

---

## 1. Purpose and Non-Purpose

**Purpose.** C4 exists to expose a deterministic, user-authored Claim
Correction capability: allow a user to correct the content represented
by the Current `ClaimVersion` without mutating historical data, while
preserving provenance, temporal validity, context, evidence linkage,
inference linkage, and version history according to the explicit
application-layer rules this Contract defines.

**C4 is NOT**: AI interpretation; AI generation; AI training; inference;
the Decision Engine; Decision 7; Relationship; the Living User Model;
Goal OS; Guidance; recommendation; automatic semantic correction; or
automatic lifecycle transition of historical rows. None of these is
introduced, extended, or made reachable by this Contract.

---

## 2. Founder-Approved Decisions Incorporated

The following are final and authoritative. This Contract does not
reopen, reinterpret, weaken, or replace any of them — it restates them
precisely so the rest of this document has a single, unambiguous
foundation.

### 2.1 Canonical Version Model — Option 2

For each `(userId, claimId)`:

> **Current ClaimVersion = the ClaimVersion with the highest `version`.**

Therefore:
- `ClaimVersion` rows are immutable after insertion.
- `lifecycle` does not define currentness.
- `active` does not mean current.
- Non-active does not mean historical.
- Multiple versions with `lifecycle = active` are legal.
- `corrected`, `superseded`, `revoked`, and `disputed` are lifecycle
  attributes independent of currentness.
- No existing `ClaimVersion.lifecycle` is automatically mutated when a
  correction is created.
- `(claimId, version)` remains uniquely addressable.

### 2.2 D1 — Current Claims Read Semantics

`GET /personal-intelligence/claims` must return the Current
`ClaimVersion` for each claim, where Current = highest `version`
number. It must not use `lifecycle = active` as its definition of
currentness. History remains separately accessible and contains all
versions. No silent fallback to an older active version is permitted.

### 2.3 D2 — Deferred Lifecycle Vocabulary

`corrected` and `superseded` remain semantically deferred. This
Contract does not define new meanings for them, does not introduce
automatic transitions to them, does not revive the obsolete "old
version becomes superseded" mechanism, does not use them as currentness
indicators, and does not infer domain semantics for them from arbitrary
existing test fixtures. They remain members of the existing lifecycle
vocabulary with their Claim-domain semantics undefined.

### 2.4 D3 — Current-but-Non-Active Product State

When Current is non-active — `Current = highest version` **and**
`Current.lifecycle != active` — the product state is **"No Active
Claim."** The UI must not silently display an older active version as
the current claim, must not represent the non-active Current version as
a normal Active ClaimCard, and must not offer confirmation or
unconfirmation. The Current non-active version remains visible/readable,
remains part of History, and remains eligible for Correction under D4.

### 2.5 D4 — Uniform Correction Eligibility

Correction is permitted against the Current `ClaimVersion` regardless
of lifecycle. `Current+active`, `Current+revoked`, `Current+disputed`,
`Current+corrected`, and `Current+superseded` are all
correction-eligible, uniformly, with no special-casing among them.
Correction creates a new `ClaimVersion`; never mutates the previous
`ClaimVersion`; does not transfer confirmation; does not automatically
confirm the new version; does not automatically transition the old
version; and does not assign semantic meaning to `corrected` or
`superseded`.

### 2.6 FD-C4-1 — New-Version Lifecycle Default

For the user-facing C4 correction flow: **the newly-created correction
version defaults to `lifecycle = active`.** This is an
application-layer correction-flow rule. The repository contract
(`AppendClaimCorrectionInput.lifecycle`) remains caller-supplied, and
repository-level flexibility remains fully intact — this Contract does
not modify the repository contract to enforce the default. C4 therefore
normally produces:

```
Current Vn (any lifecycle)
        ↓ correction
Current Vn+1
lifecycle = active
```

### 2.7 FD-C4-2 — Minimal Client DTO

The client-facing C4 correction DTO is intentionally minimal. The
client supplies only `valueText` and `confidence`. The correction
target is identified by `claimId` and `version`/`expectedVersion`, using
the established route/concurrency mechanism. The application layer is
responsible for resolving the Current `ClaimVersion` and explicitly
reconstructing the repository input, preserving/re-supplying the
unchanged substantive fields from Current — `provenance`,
`evidenceVersionId`, `evidenceLinkageState`, `inferenceId`,
`effectiveFrom`, `effectiveTo`, `situationSetting`, `timeOfDay` — unless
this Contract states otherwise. The repository itself does not
implicitly copy values from a previous row; the application layer reads
the Current version and explicitly passes those values into
`AppendClaimCorrectionInput`, preserving the Always-Explicit repository
principle. For C4, `lifecycle = "active"` is supplied by the
application layer (§2.6). `observedAt` and `acceptedAt` represent the
new correction write event and default to the current write time
("now") — no new temporal semantic is introduced.

### 2.8 FD-C4-4 — Non-Active UI Interaction Model

When Current is non-active, the UI uses a single primary claim surface:
display **"No Active Claim,"** then the Current non-active version's
relevant content, then a direct **"Correct this claim"** action — not
buried behind an additional expansion step. Confirmation/unconfirmation
is not shown. An older active version is never silently substituted.
The UI makes clear that the displayed version is Current, that it is
non-active, that correcting it creates a new version, and that the
previous version remains immutable. After a successful correction: the
new version becomes Current; its lifecycle is `active`; the UI returns
to the normal Active ClaimCard representation; the new version starts
unconfirmed. Historical versions remain non-editable.

### 2.9 FD-C4-5 — Error Status Semantics

`404 Not Found` is used when the claim/version does not exist or
ownership cannot be established — the response remains indistinguishable
from another user's resource. `409 Conflict` is used when the
referenced version exists and belongs to the requesting user, but is no
longer Current — either because it was superseded by a prior correction
before this request, or because a concurrent correction advanced the
claim during this request. The repository may continue returning
`null`; the application/use-case layer distinguishes (1)
existence/ownership from (2) currentness/staleness, without any
repository rewrite, and without exposing IDOR information. Malformed or
invalid client input remains a normal `400 Bad Request`.

---

## 3. Identity and Ownership

The acting user's identity (`userId`) originates exclusively from the
authenticated request context established by `AuthenticationGuard`
(`apps/api/src/infrastructure/auth/authentication.guard.ts:15-26`),
which verifies the request's Bearer token and sets
`request.context = createRequestContext(randomUUID(), claims.userId)`.
`userId` is never accepted from a request body, path parameter, or
query string, for any C4 route.

`claimId` and `version` (serving as `expectedVersion`) are supplied by
the client via the request path, exactly as every existing route in
this controller already does for `evidence`/`diff`/`confirmation`
(`apps/api/src/infrastructure/personal-intelligence/personal-intelligence.controller.ts:176-226`).
Both are treated as untrusted client input.

**Claim ownership** and **version ownership** are the same fact,
enforced identically to every other write path in this domain: a
`ClaimVersion` row belongs to the requesting user if and only if its
`userId` column equals the authenticated `userId`. C4 introduces no new
ownership mechanism — it reuses the existing, already-proven
`userId`-scoped `WHERE`/`EXISTS` pattern already present in
`appendCorrection`
(`apps/api/src/infrastructure/persistence/personal-intelligence-claim.repository.ts:483-524`)
and in `findClaimVersionForUser` (`:158-176`).

**IDOR behavior**: a request naming a `claimId`/`version` pair that
exists but belongs to a different user is indistinguishable, at the
wire level, from a request naming a `claimId`/`version` pair that does
not exist at all. Both resolve to `404 Not Found` (§13). No C4 route,
use-case, or DTO may introduce a code path that reveals whether a given
`claimId` exists for a user other than the requester.

---

## 4. Current-Version Invariant

**Formal definition:**

> **Current(claimId, userId) = the `ClaimVersion` row, scoped to
> `(claimId, userId)`, with the maximum `version` value.**

This is well-defined and unique for every claim that has at least one
version, because `unique(claimId, version)`
(`apps/api/src/persistence/schema/personal-intelligence.schema.ts:215-218`)
guarantees no two rows of one claim share a version number, and
`version` is produced only by `create()`'s hardcoded `1` or
`appendCorrection()`'s `version + 1` projection
(`personal-intelligence-claim.repository.ts:268,446`), with no
decrementing or gap-producing path anywhere in the repository.

**Currentness != lifecycle.** Current is a fact about `version`
recency alone. `lifecycle` is a fact about a row's own recorded
state, set once at insertion and never mutated (no `UPDATE` targets
`personal_intelligence_claim_versions` anywhere in this repository,
confirmed by direct search). The two are independent dimensions of the
same row, and no C4 mechanism may conflate them.

**Multiple active versions are legal.** Nothing in the schema, the
repository, or this Contract limits how many rows of one claim may
carry `lifecycle = active` simultaneously. `findActiveClaimVersionsForUser`'s
own docstring already anticipates this
(`personal-intelligence-claim.repository.ts:178-182`).

---

## 5. Correction Target

**Correction must target Current.** A historical (non-current) version
cannot be corrected: a newer version already exists for the claim, and
the existing optimistic-concurrency guard —
`WHERE version = expectedVersion AND notExists(newer version)`
(`personal-intelligence-claim.repository.ts:483-498`) — rejects the
attempt unconditionally, returning `null`. This guard contains no
reference to `lifecycle` anywhere in its clause; it was designed to
prevent branching/gaps in version history, and "targets Current only"
is a true, mechanically-guaranteed consequence of that design, restated
here as an explicit, named invariant of this Contract rather than left
implicit.

Three states are explicitly distinguished:

| State | Definition | Correction-eligible? |
|---|---|---|
| **Current active** | `version = MAX(version)` and `lifecycle = active` | Yes |
| **Current non-active** | `version = MAX(version)` and `lifecycle != active` | Yes (D4) |
| **Non-current historical** | `version < MAX(version)`, any `lifecycle` | No — rejected by the guard described above |

---

## 6. Correction Input Contract

### 6.1 Client Request Shape

The client-facing C4 correction request supplies exactly two
substantive values:

```
valueText: string
confidence: number
```

plus the two structural identifiers already carried by every other
route in this controller: `claimId` (path parameter) and `version`
(path parameter, serving as `expectedVersion`).

The full repository input
(`AppendClaimCorrectionInput`, `apps/api/src/core/personal-intelligence/personal-intelligence-claim.repository.ts:63-107`)
is **not** exposed as the client contract. Reason: that type requires
fifteen non-optional fields, several of which carry ownership/coupling
invariants (`evidenceVersionId`↔`evidenceLinkageState`, `inferenceId`
ownership) that a raw client-supplied value could violate in ways only
caught late, by the database check constraint or the repository's
`EXISTS` clauses, rather than rejected early with a clear validation
message; and several others (Context, Temporal Validity) have no
evidenced need for per-correction client editing in this increment.
Exposing the minimal shape keeps the C4 v1 surface small, auditable,
and consistent with the "reduce user input" product principle already
evidenced elsewhere in this codebase's design comments.

### 6.2 Field Classification

| Field | Classification | Source for C4 |
|---|---|---|
| `claimId` | Client-owned (structural) | Request path |
| `expectedVersion` | Client-owned (structural) | Request path (`version`) |
| `valueText` | Client-owned (substantive) | Request body |
| `confidence` | Client-owned (substantive) | Request body |
| `valueKind` | Application-derived/preserved | Read from Current — see §6.3 |
| `provenance` | Application-derived/preserved | Read from Current, re-supplied unchanged (§2.7) |
| `lifecycle` | System-controlled | Fixed to `"active"` by the application layer (§2.6) |
| `evidenceVersionId` | Application-derived/preserved | Read from Current, re-supplied unchanged (§19) |
| `evidenceLinkageState` | Application-derived/preserved | Read from Current, re-supplied unchanged (§19) |
| `inferenceId` | Application-derived/preserved | Read from Current, re-supplied unchanged (§20) |
| `effectiveFrom` | Application-derived/preserved | Read from Current, re-supplied unchanged (§17) |
| `effectiveTo` | Application-derived/preserved | Read from Current, re-supplied unchanged (§17) |
| `situationSetting` | Application-derived/preserved | Read from Current, re-supplied unchanged (§16) |
| `timeOfDay` | Application-derived/preserved | Read from Current, re-supplied unchanged (§16) |
| `observedAt` | System-controlled | Set to the correction write event's "now" (§2.7) |
| `acceptedAt` | System-controlled | Set to the correction write event's "now" (§2.7) |
| `now` | System-controlled | The correction write event's own timestamp |

No field's meaning is invented or altered from what §2.1–§2.9 and the
existing domain model already define.

### 6.3 `valueKind` Disposition

`valueKind` (`"text" | "boolean" | "enum"`) is not part of the client
DTO (§6.1) and is not addressed by any prior Founder decision as an
editable field for C4 v1. The safest, existing-architecture-consistent
behavior is: **preserve `valueKind` from Current**, exactly like
`provenance` and every other application-derived field in §6.2. This
avoids two failure modes that would otherwise be possible if `valueKind`
were left unresolved: (a) a correction silently changing a claim's
represented value type (e.g., `boolean` → `text`) as an unintended side
effect of only editing `valueText`, which no Founder decision
authorizes; and (b) requiring the client to understand and resupply a
domain-internal classification it was never asked to reason about,
contradicting the minimal-DTO rationale in §6.1. If a future increment
needs to let a user change a claim's `valueKind`, that is new,
separately-scoped product surface, not implied or authorized here.

---

## 7. Application-Layer Assembly

Conceptual sequence (not implemented by this Contract):

```
Authenticated request
        ↓
Resolve target claim/version (claimId, expectedVersion)
        ↓
Verify ownership (userId scoping — §3)
        ↓
Resolve Current (§4 — the D1 current-version capability, §22)
        ↓
Verify expectedVersion == Current.version
   (mismatch → 409, §9/§13)
        ↓
Build complete AppendClaimCorrectionInput
        ↓
Preserve explicit unchanged fields, read from Current (§6.2)
        ↓
Set lifecycle = "active" (§2.6)
        ↓
Set observedAt / acceptedAt / now to the correction write event's time (§2.7)
        ↓
Call existing appendCorrection (unmodified)
        ↓
Return the newly-created ClaimVersion
```

The repository does not inherit or copy fields implicitly at any step
of this sequence — every field passed to `appendCorrection` is an
explicit value the application layer holds, whether freshly supplied by
the client (`valueText`, `confidence`), read from the Current version
and re-supplied verbatim (§6.2's "application-derived/preserved" row),
or fixed by C4's own rule (`lifecycle`, `observedAt`, `acceptedAt`,
`now`).

---

## 8. Version Creation

`newVersion = Current.version + 1`, produced by the existing,
unmodified `appendCorrection` projection
(`personal-intelligence-claim.repository.ts:446`). The following hold,
restated as explicit, testable invariants:

- The old (Current-at-request-time) version remains immutable: no
  column of that row changes as a result of the correction.
- The old version's `lifecycle` remains exactly what it was before the
  correction — including if it was `revoked`, `disputed`, `corrected`,
  or `superseded`. No automatic transition of any kind is applied to it.
- The new version becomes Current (by virtue of holding the highest
  `version` number for the claim — §4).
- The new version's `lifecycle` is `"active"` for every C4-originated
  correction (§2.6).
- No automatic `"superseded"` assignment occurs, to either row.
- No automatic `"corrected"` assignment occurs, to either row.
- No confirmation event is copied, transferred, or created as a side
  effect of the correction.
- The new version starts with zero confirmation events of its own —
  `getEffectiveConfirmation` for the new version's `claimVersionId`
  returns `not_confirmed` until a separate, explicit confirmation call
  is made
  (`apps/api/src/application/personal-intelligence/personal-intelligence-claim-confirmation.use-case.ts:97-108`,
  unmodified).

---

## 9. Lifecycle Semantics

**Currentness** is determined by `version` number alone (§4).
**Lifecycle** is an independent attribute of each row, set once at
insertion. A C4 correction always creates a version whose `lifecycle`
is `"active"` (§2.6, application-layer rule; the repository contract
itself remains caller-discretionary, §2.6). Historical `lifecycle`
values are never automatically modified by a correction, by C4, or by
any mechanism this Contract authorizes. `corrected` and `superseded`
remain semantically deferred (§2.3) — this Contract does not state, and
must not be read to imply, that a correction causes the old version to
become `"superseded"`, or that the new version represents `"corrected"`
in any domain sense. The only lifecycle assignment C4 performs is the
new version's `"active"` default.

---

## 10. Confirmation Interaction

Confirmation eligibility (existing C3 rule, restated per D3):

| State | Confirmation |
|---|---|
| Current + active | Allowed |
| Current + non-active | Forbidden |
| Non-current + active | Forbidden |
| Non-current + non-active | Forbidden |

Correction eligibility (D4, restated):

| State | Correction |
|---|---|
| Current + active | Allowed |
| Current + non-active | Allowed |
| Non-current | Forbidden |

These two tables are independent — a state can be correction-eligible
without being confirmation-eligible (e.g., Current + revoked), and this
Contract does not conflate them. Confirmation events remain
version-specific, scoped by `claimVersionId`
(`apps/api/src/core/personal-intelligence/personal-intelligence-claim-confirmation.model.ts:15-24`).
A correction never transfers a prior version's confirmation events to
the new version, and never creates a confirmation event for the new
version (§8).

---

## 11. Context

`situationSetting` and `timeOfDay` remain part of `ClaimVersion` data,
governed by the existing Context axis
(`docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md`).
For C4: the existing Current version's `situationSetting`/`timeOfDay`
values are explicitly read and re-supplied by the application layer
(§6.2/§7) — not silently inherited by the repository, and not exposed
as client-editable fields in the C4 v1 DTO (§6.1). C4 introduces no
Context Capture mechanism, no new context semantics, and no AI
inference of context. Historical context values remain immutable
(§2.1). Context-B's present-day status is unaffected and unchanged by
this Contract.

---

## 12. Temporal Validity

`effectiveFrom` and `effectiveTo` are explicitly preserved from Current
by the application layer for C4 v1 (§6.2/§7) — not silently inherited
by the repository (Always-Explicit remains satisfied exactly as
described in §2.7). This Contract does not redefine Temporal Validity,
does not introduce interval-overlap validation (none exists in the
current architecture, and none is added here), and does not change how
`effectiveFrom`/`effectiveTo` relate to `lifecycle` or `version`
recency — the three axes (currentness, lifecycle, temporal validity)
remain independent, per the existing Temporal Validity contract's own
§14 ("D1/D2/D3 Integrity"). Historical temporal data remains immutable.

---

## 13. Provenance

`provenance` is explicitly preserved from Current by the application
layer for C4 v1 (§6.2/§7) — the C4 DTO does not expose it as a
client-editable field. No new provenance semantics are introduced. A
correction never automatically converts `declared` ↔ `observed` merely
because it occurred; the value carried forward is exactly what the
Current version already recorded, re-supplied explicitly rather than
inherited.

---

## 14. Evidence Linkage

`evidenceVersionId` and `evidenceLinkageState` are explicitly preserved
from Current in the C4 v1 application-layer reconstruction (§6.2/§7),
satisfying the existing 1:1 coupling check constraint
(`personal_intelligence_claim_versions_evidence_linkage_coupling_check`,
`apps/api/src/persistence/schema/personal-intelligence.schema.ts:255-261`)
automatically, since both values are copied together from a row that
already satisfies it. C4 does not create, modify, or delete any
`Evidence`/`EvidenceVersion` row, does not infer evidence linkage, and
introduces no new Evidence UI.

---

## 15. Inference / D3

`inferenceId` is explicitly preserved from Current in the C4 v1
application-layer reconstruction (§6.2/§7), subject to the same
ownership re-verification `appendCorrection` already performs via its
correlated `EXISTS` against `personal_intelligence_inferences`
(`personal-intelligence-claim.repository.ts:512-524`, unmodified). C4
does not create an Inference, does not mutate an Inference, does not
execute any D3 capability, does not expose D3 to the client beyond this
existing passive pointer, and does not invoke Decision 7.

---

## 16. API Contract (Design-Level — Not Implemented)

**Route**: `POST /personal-intelligence/claims/:claimId/versions/:version/correction`.
This matches the existing route family exactly
(`.../versions/:version/evidence`, `.../versions/:version/confirmation`,
`personal-intelligence.controller.ts:176-226`) and no repository
evidence was found suggesting a materially more consistent alternative.

- **Authentication**: `@UseGuards(AuthenticationGuard)`, already applied
  at the controller class level (`:99`) — reused unchanged.
- **Path parameters**: `claimId` (string), `version` (integer, parsed
  the same way the existing `evidence`/`confirmation` routes already
  parse it via `ParseIntPipe`, `:179,195,214`).
- **Request body**: `{ valueText: string; confidence: number }` (§6.1).
- **Response body**, `201`: the newly-created `PersonalIntelligenceClaimVersion`.
- **`201 Created`**: successful correction — a new resource (a new
  `ClaimVersion` row) was created, mirroring the confirmation route's
  own `@HttpCode(HttpStatus.CREATED)` convention (`:211`).
- **`400 Bad Request`**: malformed/invalid request body (missing
  `valueText`, non-numeric or out-of-range `confidence`, non-integer
  `version` path parameter) — mirrors this controller's existing
  `BadRequestException` usage (`:38,45,56`).
- **`404 Not Found`**: the referenced `claimId`/`version` does not
  exist for the requesting user, or belongs to a different user (§3,
  §24).
- **`409 Conflict`**: the referenced version exists and is owned by the
  requesting user, but is no longer Current (§9 of the FD-C4
  reconciliation; §24 below).
- **Ownership behavior**: identical to every other route in this
  controller — enforced by the `userId`-scoped repository query, never
  by the client-supplied path parameters alone (§3).
- **Stale behavior**: `409`, with the client expected to refresh and
  retrieve the new Current version before retrying, mirroring the
  confirmation route's existing "refreshing the current state" recovery
  pattern (`apps/web/app/dashboard/intelligence/page.tsx:254`).

This section defines the contract only. No route, controller method, or
DTO class is created by this document.

---

## 17. Current Claims Read Contract — D1

`GET /personal-intelligence/claims` must resolve, per claim, the
Current `ClaimVersion` — `MAX(version)` — not `WHERE lifecycle =
'active'`. This is a semantic change to what the endpoint returns, not
merely a renaming: today's implementation
(`findActiveClaimVersionsForUser`, `personal-intelligence-claim.repository.ts:184-225`)
filters by `lifecycle`, which under Option 2 no longer implies
currentness.

**Required read-side capability** (identified, not implemented): a new
repository query resolving, for a given `userId` (optionally scoped by
`claimType`), the single highest-`version` `ClaimVersion` row for each
distinct `claimId` — a `GROUP BY claimId` / window-function-shaped query
against the existing schema. No schema change is required to support
it (§20).

**Behavior when Current is non-active**: the claim still appears in the
response — as its Current, non-active version, per D3 (§2.4). It is
not omitted, and no older active version for the same claim is
substituted in its place. The consuming UI layer, not the read query,
is responsible for rendering this as "No Active Claim" (§18).

---

## 18. UI Contract (Design-Level — Not Implemented)

**Current + active**: normal Active ClaimCard — Current content,
confirmation control (§10), correction control (§16/§8, targeting the
Current version).

**Current + non-active**: "No Active Claim" state (§2.4/§2.8) — Current
non-active content shown, lifecycle visibility where appropriate (e.g.,
a "Revoked"/"Disputed" label, matching the existing
`LIFECYCLE_LABELS` map, `apps/web/app/dashboard/intelligence/page.tsx:69-75`),
a direct "Correct this claim" action (not behind an expansion step, per
§2.8), no confirmation/unconfirmation control, History available
(unchanged, via the existing `ClaimHistoryList`).

**Historical version**: read-only — no correction control, no
confirmation control, exactly as today.

No unrelated UX is introduced by this Contract.

---

## 19. Error Semantics

- **`400`**: invalid request shape or validation failure (§16).
- **`404`**: the resource is unavailable to this requester, or
  ownership cannot be established — used identically whether the
  `claimId`/`version` does not exist at all, or exists but belongs to a
  different user (§3).
- **`409`**: the referenced version was valid and owned by the
  requester, but is no longer Current — either superseded by an earlier
  correction, or by a concurrent one (§20).

**Why this does not create an IDOR leak**: the `409` code path is only
reachable *after* ownership has already been established via the same
`userId`-scoped lookup that governs the `404` path (§3). A request
against a claim/version the requester does not own terminates at `404`
before any currentness check runs — it never learns whether that
resource exists, is owned by someone else, or is stale. No new
information about another user's data is exposed by distinguishing
`404` from `409`.

---

## 20. Concurrency

The existing optimistic-concurrency model is preserved unmodified. This
Contract requires: `expectedVersion` on every correction request;
Current resolution before the write (§7); the existing
`notExists(newer version)` guard (§5); atomic single-statement append
behavior (`appendCorrection`'s `INSERT ... SELECT`,
`personal-intelligence-claim.repository.ts:438-528`, unmodified); stale
correction rejection (§5/§19); and no mutation of historical versions
(§2.1/§8).

**The race**: Request A targets V2; Request B targets V2, concurrently.
Only one may successfully create V3 — enforced by the database-level
`unique(claimId, version)` constraint as the final backstop, already
proven under real concurrent load
(`apps/api/src/infrastructure/persistence/personal-intelligence-claim.repository.runtime.spec.ts:120-175`,
two genuinely concurrent `appendCorrection` calls, exactly one winner).
The other request's `appendCorrection` call returns `null` (either
because its `notExists` guard already failed, or because it lost the
final unique-constraint race), which the application layer surfaces as
`409 Conflict` (§9/§19) — not as a silently-accepted duplicate, and not
as an unhandled exception.

No existing concurrency guarantee is weakened by this Contract.

---

## 21. Test Requirements (Identified — Not Written)

**Current resolution**: exactly one Current version resolves per claim;
the highest version number always wins; multiple simultaneously-active
versions remain legal without affecting Current resolution; a Current
non-active version remains Current (is never silently replaced by an
older active version in the resolution query).

**Correction**: `Current+active → active`; `Current+non-active →
active` (covering `revoked`, `disputed`, `corrected`, and `superseded`
targets uniformly, per §2.5); a historical-target correction attempt is
rejected; the old version's row is provably unchanged after a
correction (every column, not only `lifecycle`); `version` increments
by exactly one per successful correction.

**Confirmation**: `Current+active` is confirmable; `Current+non-active`
is not confirmable; a historical version is not confirmable; a new
correction version starts unconfirmed.

**Preservation**: explicit verification that `provenance`,
`evidenceVersionId`, `evidenceLinkageState`, `inferenceId`,
`effectiveFrom`, `effectiveTo`, `situationSetting`, and `timeOfDay` on
the new version exactly match the Current version's values at the time
of correction, for a correction that only supplies `valueText`/
`confidence`.

**Ownership**: correcting one's own claim succeeds; attempting to
correct another user's claim/version returns `404` and does not reveal
whether that claim/version exists.

**Concurrency**: exactly one of two simultaneous corrections against
the same Current version succeeds; the other receives `409`.

**API/UI**: `400` on malformed input; `404` on ownership/non-existence;
`409` on staleness; a normal Active ClaimCard renders for
`Current+active`; "No Active Claim" renders for `Current+non-active`
with a direct correction action; History remains complete and immutable
after a correction.

No test file is created or modified by this Contract.

---

## 22. Database / Schema Boundary

**No migration is currently required merely for C4 correctness.** This
Contract does not introduce: a partial unique index on `active`
versions (would contradict §2.1's "multiple active versions are
legal"); a lifecycle trigger; a lifecycle `UPDATE` mechanism (would
contradict §2.1's immutability); a schema redesign of
`personal_intelligence_claim_versions`; or a new `ClaimVersion` table.

A new **read query/repository capability** for Current-per-claim
resolution is expected (§17) — this is a new query against the existing
schema, not a schema change. If a future implementation phase discovers
an unavoidable schema requirement not identified here, that discovery
must become a separate, explicit Founder-controlled decision — it must
not silently expand C4's scope.

---

## 23. AI Boundary

C4 contains zero AI execution. Explicitly excluded from anything this
Contract authorizes: `AIRuntime.execute()`; any model-provider call;
model routing; prompt generation; AI-generated correction content;
AI training; AI interpretation of correction content; and any AI
feedback loop reading or reacting to correction events. C4 is
deterministic and user-authored in its entirety — every value written
by a C4 correction originates from either the requesting user's
explicit input (`valueText`, `confidence`) or an explicit read of the
already-persisted Current version (§6.2), never from any AI
computation.

---

## 24. Infrastructure Boundary

C4 requires no GCP implementation, no Biznet provisioning, no
networking changes, no new secrets, no deployment step, no CI/CD
infrastructure change, and no production configuration change. The
current Biznet GIO provider direction
(`docs/gates/BIZNET-GIO-INFRASTRUCTURE-PROVIDER-SELECTION-AND-GCP-SUPERSESSION-GOVERNANCE-RECORD.md`)
remains untouched by this Contract.

---

## 25. Governance Status

**Founder-approved** (restated, not reopened, by this Contract):
Option 2 (§2.1); D1 (§2.2); D2 (§2.3); D3 (§2.4); D4 (§2.5); FD-C4-1
(§2.6); FD-C4-2 (§2.7); FD-C4-4 (§2.8); FD-C4-5 (§2.9).

**This Contract's own role**: it formalizes the decisions above into a
single, internally-consistent, implementation-testable specification.
It is a documentation act.

**NOT automatically authorized by this Contract**: implementation of
any kind; schema changes; migrations; API route creation; UI
implementation; test implementation; commit; push; deployment. A later,
separate, explicit Founder implementation authorization is required
before any of these may begin.

---

## 26. Obsolete / Conflicting Text

The following pre-existing text assumed semantics Option 2/D1-D4 now
supersede. This Contract does not modify the documents or code
containing this text — it identifies the conflict and states the
authoritative rule that governs any future C4 implementation instead.

- `docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-IMPLEMENTATION-INCREMENT-CONTRACT.md:224`
  — *"the Claim's current (latest, active) version"* — treats
  `current`, `latest`, and `active` as synonyms. **Superseded**: `active`
  is not synonymous with `current`/`latest` under Option 2 (§2.1); only
  `current` and `latest` remain synonyms.
- Same document, `:221-222` — *"a new version is created, `lifecycle`
  transitions on the prior version"* — describes an old-row-mutation
  mechanism. **Superseded**: no `ClaimVersion.lifecycle` is ever
  mutated on any existing row, by correction or otherwise (§2.1/§8);
  this describes behavior that was never implemented and directly
  contradicts Option 2's immutability requirement.
- Same document, `:227-229` — *"a revoked version is not the 'current'
  version for display/derivation purposes"* — asserts
  `revoked ⇒ not current`. **Superseded**: a revoked version can be
  Current (§2.1/§2.4) — this is the entire premise of D3.
- `apps/api/src/infrastructure/personal-intelligence/personal-intelligence.controller.ts:107-108`
  (source comment, not modified by this Contract) — *"One entry per
  active claim (findActiveClaimVersionsForUser already returns at most
  one active version per claim)"* — **Superseded**: this guarantee no
  longer holds once a correction can create a second `active` row for
  the same claim (§2.1); D1's redefinition (§17) removes the underlying
  method from this endpoint's implementation entirely.
- Same file, `:94,206-208,222-223` (source comments and the existing
  409 message) — *"current active version"* language conflating the two
  concepts. **Superseded** by §2.1/§10's independent-axes statement;
  any future revision of this file's own wording is implementation
  work, not authorized by this Contract.

No document was edited to produce this section.

---

## 27. Contract Status

**FOUNDER-APPROVED CONTRACT**
**IMPLEMENTATION NOT AUTHORIZED**

This Contract formalizes Option 2, D1, D2, D3, D4, FD-C4-1, FD-C4-2,
FD-C4-4, and FD-C4-5 into a single implementation-ready specification.
Writing this Contract does not authorize implementation, schema
changes, migrations, API creation, UI implementation, test
implementation, commit, or push. A separate, explicit Founder
implementation authorization is required before any code, schema,
test, or documentation file governed by this Contract may be created or
modified.
