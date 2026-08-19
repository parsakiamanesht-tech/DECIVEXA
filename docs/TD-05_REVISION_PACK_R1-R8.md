# TD-05 Revision Pack — R1–R8

## Status
- Gate: TD-05
- Previous status: CONDITIONAL PASS
- Purpose: close the eight architectural gaps identified in the TD-05 review before re-review.
- Implementation status: DESIGN ONLY — no implementation authorization.

## R1 — Multi-Option Comparison Contract
Every generated path option MUST expose comparable dimensions: expected outcome, duration, effort, required resources, dependencies, constraints, risks, uncertainty, major assumptions, reversibility, and user-fit rationale.

Comparison MUST distinguish evidence-backed facts from estimates and system inferences. Missing information MUST be represented as uncertainty rather than fabricated.

## R2 — Ranking & Recommendation Governance
DECIVEXA MUST NOT treat a single opaque score as the decision itself. Ranking is a decision-support artifact.

Recommendation MUST be explainable and include the dominant factors, trade-offs, uncertainty, and conditions under which another option would become preferable. The user retains final agency.

## R3 — Path Feasibility Gate
A path cannot be presented as realistically executable unless its critical prerequisites, resources, constraints, dependencies, and major risks have been assessed sufficiently for the available evidence.

If feasibility is unresolved, the path MUST be labelled accordingly and the missing evidence identified.

## R4 — Path Sensitivity & Assumption Analysis
For each material path, DECIVEXA SHOULD identify assumptions whose change could materially alter feasibility, duration, cost, risk, or ranking.

High-sensitivity assumptions SHOULD become monitoring points during execution. The system MUST NOT present assumption-dependent estimates as certainty.

## R5 — Adaptive Replanning Contract
Replanning is triggered by material changes in goals, constraints, capacity, dependencies, evidence, or execution state.

Replanning MUST preserve valid history, explain material changes, maintain path/version lineage, and avoid unnecessary churn. FIS-059 fluidity and FIS-060 continuity remain governing constraints.

## R6 — User Confirmation & Path Versioning
A user-selected or explicitly confirmed path becomes a versioned Path Decision Record containing the selected option, rationale/context, relevant assumptions, constraints, timestamp, and confirmation state.

Subsequent changes MUST create a new version or explicit revision event rather than silently rewriting the user's decision history.

## R7 — Constraint Intelligence Contract
Path generation and scheduling MUST treat user constraints as first-class inputs. Constraints may include time, money, health/capacity, skills, resources, location, relationships, obligations, risk tolerance, and other verified limitations.

Constraints MUST have source, confidence, recency/validity, and sensitivity where applicable. Constraint changes may trigger replanning.

## R8 — Minimum-Sufficient Context Selection
DECIVEXA MUST use the minimum context required to produce a useful path decision while respecting FIS-058 privacy/data-sovereignty rules.

Context selection SHOULD be purpose-bound and explainable. Sensitive domains MUST NOT be included merely because they are available.

## Cross-Cutting Rules
1. Evidence Before Opinion.
2. Observed behavior is not automatically a permanent trait.
3. User agency remains authoritative for consequential path selection.
4. AI recommendations must remain distinguishable from deterministic facts and user-confirmed decisions.
5. No silent history rewriting.
6. No implementation begins from this revision pack alone.

## Required Re-Review Evidence
The TD-05 re-review should verify:
- all R1–R8 are explicitly represented;
- contracts do not conflict with FIS-057, FIS-058, FIS-059, FIS-060 or the Personal Intelligence Core;
- path generation remains multi-option rather than single-answer optimization;
- feasibility and uncertainty are visible;
- user confirmation and version lineage are auditable;
- context minimization is enforceable;
- adaptive replanning does not create destructive plan churn.

## Gate Decision
This document closes the identified TD-05 design gaps as a revision pack. It does NOT itself grant implementation permission. TD-05 must receive a separate re-review and explicit Founder approval before any material implementation proceeds.
