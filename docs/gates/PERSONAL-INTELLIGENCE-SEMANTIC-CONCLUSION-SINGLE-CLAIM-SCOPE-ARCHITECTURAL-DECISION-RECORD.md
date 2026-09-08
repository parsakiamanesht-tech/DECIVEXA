# Personal Intelligence — Semantic Conclusion Single-Claim Scope — Founder Architectural Decision Record

## 1. Baseline Verification

```
branch:       main
HEAD:         f9f2091a3306478b28586f936bfe2b7432e060b2
origin/main:  f9f2091a3306478b28586f936bfe2b7432e060b2
divergence:   0/0
```

Protected file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`: MD5
`972ad36e523aa42e540f2c28a3aac801`, unstaged, unmodified — untouched by
producing this record.

## 2. Decision Identity

- **Title:** Semantic Conclusion Single-Claim Scope Architectural Decision
- **Decision ID:** `FD-SC-03`
- **Decision family:** Semantic Conclusion (`FD-SC-01`, `FD-SC-02`, `FD-SC-03`)
- **Decision status:** **FOUNDER-APPROVED**
- **Decision type:** Architectural / Governance
- **Scope:** initial Semantic Conclusion Claim cardinality only
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Date:** 2026-09-08

This is a documentation-only registration of a Founder decision reached
directly in this conversation, following a dedicated read-only
FD-SC-CANDIDATE-03 Decision Analysis Gate. It introduces no source,
schema, migration, API, test, or configuration change of its own, and
does not move the repository baseline recorded above.

## 3. Founder Decision (Option A — approved verbatim)

**[FOUNDER-APPROVED ARCHITECTURE — OPTION A]**

> The initial Semantic Conclusion architecture is bounded to exactly one
> Claim / ClaimVersion per Semantic Conclusion: **Single-Claim /
> Single-ClaimVersion.**

## 4. Rationale (approved architectural rationale, not a new rule)

This decision was reached on the following grounds, established by the
preceding FD-SC-CANDIDATE-03 analysis and not extended here:

- the current canonical architecture (Evaluation, Evaluation Standard,
  every existing pipeline diagram in the Derivation Trace Contract and
  the BSS Contract) is predominantly singular-Claim-shaped;
- Single-Claim scope provides the smallest, most bounded initial
  architecture;
- provenance and recoverability (FD-DT-01) remain straightforward —
  directly extensible from Evaluation's already-proven pattern, with no
  new design work;
- it avoids premature Claim-set identity/lifecycle complexity that a
  Multi-Claim model would otherwise require;
- it avoids accidental expansion into Cross-Claim architecture, which
  Decision 7 has not approved;
- it leaves Multi-Claim as a future, separately extensible capability,
  not foreclosed by this decision.

## 5. Deferred Cross-Claim Scope

**Cross-Claim Semantic Conclusion is explicitly deferred.**

Any future capability in which a Semantic Conclusion materially depends
on multiple Claims / ClaimVersions requires, before any such capability
may be designed or implemented:

1. a separate, explicit Founder Decision;
2. any necessary architectural clarification;
3. any required Contract amendment or new Contract decision;
4. separate implementation authorization.

**Future Multi-Claim capability is not implicitly authorized by this
decision.**

## 6. Boundary with Evaluation (FD-DT-03)

`FD-DT-03` — Single-Claim Evaluation — applies to **Evaluation**. It
governs that an Evaluation is associated with exactly one ClaimVersion
(confirmed by direct repository inspection: every citation of
`FD-DT-03` in this codebase — in the Evaluation schema, use-case, and
domain model — scopes it explicitly and only to Evaluation).

**`FD-DT-03` must not be silently reinterpreted as the historical
authorization for Single-Claim Semantic Conclusion.** `FD-SC-03` (this
record) is the explicit, separate Founder decision that establishes the
initial Single-Claim scope of Semantic Conclusion. The two decisions
govern two distinct artifacts and are not interchangeable, even though
they reach the same Single-Claim conclusion for each artifact
independently.

## 7. Boundary with Decision 7

Decision 7 (`docs/DECIVEXA/CROSS-CLAIM-MATCHING-DECISION-7-ARCHITECTURAL-DECISION.md`)
remains **unchanged**. This decision does **not**:

- modify Decision 7;
- authorize Cross-Claim Matching;
- authorize relationship discovery;
- authorize content-driven Claim matching;
- authorize automatic grouping of Claims;
- authorize any Decision 7 implementation.

Consistent with the FD-SC-CANDIDATE-03 analysis's own architectural
distinction: a future Semantic Conclusion receiving an explicitly,
externally supplied set of multiple Claims would not automatically be
identical to Decision 7's own subject matter (content-driven discovery
of relationships between Claims). However, **any mechanism that
discovers, selects, matches, or groups Claims for the purpose of
producing a Cross-Claim Semantic Conclusion requires its own separate
architectural/governance treatment and cannot be inferred from this
decision.**

## 8. Boundary with FD-SC-02

`FD-SC-03` builds on, and does not modify or reopen, the terminology
boundary established by `FD-SC-02`
(`docs/gates/PERSONAL-INTELLIGENCE-SEMANTIC-CONCLUSION-BSS-BOUNDARY-ARCHITECTURAL-DECISION-RECORD.md`):
Semantic Conclusion is the broader architectural category/layer, and
Bounded Semantic Synthesis (BSS) is a specific Level-3 form/instance
within that Semantic Conclusion layer. This Single-Claim scope
decision applies to the Semantic Conclusion category as a whole, and
therefore to BSS as one of its instances, without altering `FD-SC-02`'s
own boundary statement in any way.

## 9. What This Decision Explicitly Does NOT Authorize

This decision is governance/architecture only. It does **not**
authorize, and no future work may treat it as having authorized:

- Semantic Conclusion Architecture Contract drafting;
- Semantic Conclusion Architecture Contract registration;
- Semantic Conclusion implementation of any kind;
- any database, schema, or migration change;
- any persistence design;
- any repository, use-case, module, API, DTO, or service change;
- any runtime change;
- AI generation or AI Runtime activation/execution;
- any Context Runtime change;
- Cross-Claim architecture or implementation;
- reopening Decision 7, or any other previously closed gate;
- Inference redesign;
- any change to Bounded Semantic Synthesis implementation (none
  exists; none is created here);
- Multi-Claim Semantic Conclusion of any kind (explicitly deferred,
  §5 above);
- any downstream implementation increment.

A separate, explicit Founder decision and its own implementation gate
are required before any of the above may be designed or implemented —
the same discipline already applied to every prior decision in this
family and its predecessors (Founder Decision A, Founder Decision B,
`FD-DT-01` through `FD-DT-07`, `FD-EVAL-STANDARD-01`, `FD-SC-01`,
`FD-SC-02`).

## 10. Explicitly Not Resolved by This Decision

Consistent with this record's narrow scope, the following remain
undecided and are **not** addressed, resolved, or implied here: Semantic
Conclusion's identity model; lifecycle; input model beyond Claim
cardinality; confidence-field placement; the Evaluation-dependency
question beyond what `FD-DT-05` already establishes; the
Inference-dependency question beyond what `FD-DT-07` already
establishes; persistence; versioning; correction/supersession; the
Semantic Conclusion Contract's eventual structure; BSS implementation;
runtime wiring; AI generation; Context resolution. Each remains its own
separate, future Founder Decision.

## 11. Governance Integrity

This record does not itself authorize implementation, and does not
alter any existing Contract, ADR, schema, runtime behavior, or gate.
The Bounded Semantic Synthesis Contract, the Derivation Trace /
Provenance Architecture Contract, ADR-009, ADR-010, Decision 7, Gate 7,
`FD-DT-01` through `FD-DT-07`, `FD-EVAL-STANDARD-01`, `FD-SC-01`, and
`FD-SC-02` all remain exactly as previously and separately registered.

## 12. Change Discipline

This record is created as a new, standalone governance artifact,
consistent with this repository's established convention of giving
each major architectural decision its own dedicated record — the same
convention already followed by `FD-SC-02`'s own record, Founder
Decision B's record, the Decision 7 record, and the D3 Inference
Provenance record. No existing governance document was amended to
register this decision or to cross-reference it.

## 13. Final Determination

**FOUNDER DECISION `FD-SC-03` — REGISTERED. OPTION A APPROVED: SEMANTIC
CONCLUSION IS INITIALLY SCOPED TO SINGLE-CLAIM / SINGLE-CLAIMVERSION.
CROSS-CLAIM SEMANTIC CONCLUSION IS EXPLICITLY DEFERRED, REQUIRING A
SEPARATE FUTURE FOUNDER DECISION. IMPLEMENTATION NOT AUTHORIZED.** No
schema, migration, code, test, API, AI capability, Semantic Conclusion
entity, or Cross-Claim mechanism is created, modified, or implied as
approved by this record. Founder Decision A, Founder Decision B,
`FD-DT-01` through `FD-DT-07`, `FD-EVAL-STANDARD-01`, `FD-SC-01`,
`FD-SC-02`, Decision 7, and Gate 7 all remain exactly as previously and
separately registered.
