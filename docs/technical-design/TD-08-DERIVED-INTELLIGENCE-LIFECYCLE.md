# TD-08 — Derived Intelligence Lifecycle

**Status:** Proposed technical contract

## Objective

Keep derived intelligence traceable, revisable and appropriately protected rather than turning interpretation into permanent fact.

## Lifecycle

`Raw Data → Observation → Interpretation → Derived Intelligence → Recommendation → Outcome Evidence`

Each transition MUST preserve provenance sufficient for the next layer to understand what evidence was used.

## Separation

Raw data is evidence. Derived intelligence is an interpretation of evidence. Recommendations are proposals. None may silently replace authoritative source data.

## Recalculation

Derived intelligence MUST be recalculable when source evidence changes, relevant model versions change, consent changes, or a correction invalidates an assumption.

## Invalidation

When source evidence is deleted, corrected or withdrawn, dependent intelligence MUST be identified and invalidated, recomputed or marked stale according to impact.

## Sensitivity

Derived intelligence inherits the sensitivity of source data when appropriate and MUST escalate classification when the inference itself reveals more sensitive information than its inputs.

## Deletion/export

User data-control operations MUST define how raw evidence and dependent derived intelligence are exported, deleted, retained for legally/operationally necessary audit, or regenerated.

## Acceptance criteria

- Every material derived intelligence item has provenance.
- Source changes can trigger dependent invalidation/recalculation.
- Derived intelligence is not an untraceable permanent fact.
- Sensitivity is evaluated on the inference itself.
- User data controls have defined behavior for derived intelligence.
