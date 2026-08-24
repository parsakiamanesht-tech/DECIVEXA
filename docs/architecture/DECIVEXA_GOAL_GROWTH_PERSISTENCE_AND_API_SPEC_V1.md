# DECIVEXA — Goal Growth Persistence & API Specification v1

**Status:** Architecture Draft — Founder Review Required  
**Implementation:** NOT AUTHORIZED

## 1. Technical Direction

V1 should use the existing DECIVEXA modular-monolith direction with PostgreSQL unless a separate Founder-approved ADR changes that choice.

Do not introduce a graph database, microservice split, or full event sourcing merely because GGI contains graph relationships and history.

## 2. Persistence Principles

1. Canonical state is relational and strongly constrained.
2. Goal models are versioned.
3. Historical model versions are immutable.
4. Material mutations are auditable.
5. Graph relationships use explicit edges.
6. JSON/JSONB is used only where domain shape is intentionally flexible, not to hide relational semantics.
7. Owner scoping is mandatory.
8. Read models may be denormalized for performance.

## 3. Conceptual Tables

### goals

- id UUID
- owner_id UUID
- title TEXT
- description TEXT
- lifecycle_state ENUM
- created_at
- updated_at
- completed_at nullable
- version INTEGER

Indexes:

- owner_id
- owner_id + lifecycle_state
- updated_at

### goal_intents

- id UUID
- goal_id UUID
- statement TEXT
- origin ENUM
- importance NUMERIC
- alignment NUMERIC
- confidence NUMERIC
- stability NUMERIC
- created_at
- superseded_at nullable

### desired_states

- id UUID
- goal_id UUID
- version INTEGER
- description TEXT
- qualitative_conditions JSONB
- quantitative_conditions JSONB
- success_criteria JSONB
- target_window JSONB
- evidence_requirements JSONB
- confidence NUMERIC
- created_at
- superseded_at

### goal_models

- id UUID
- goal_id UUID
- version INTEGER
- status ENUM
- model_confidence NUMERIC
- rationale TEXT
- generated_by ENUM
- created_at
- superseded_at

Unique constraint: one current model version per goal.

### goal_nodes

- id UUID
- model_id UUID
- stable_key TEXT
- node_type ENUM
- title TEXT
- description TEXT
- status ENUM
- position JSONB
- confidence NUMERIC
- source ENUM
- created_at
- retired_at

Unique: model_id + stable_key.

### goal_edges

- id UUID
- model_id UUID
- from_node_id UUID
- to_node_id UUID
- edge_type ENUM
- strength NUMERIC nullable
- confidence NUMERIC nullable
- rationale TEXT
- created_at
- retired_at

Constraints:

- both nodes belong to model_id
- no self-edge unless explicitly permitted by edge type
- duplicate active semantic edge prevented

### goal_state_snapshots

- id UUID
- goal_id UUID
- captured_at TIMESTAMPTZ
- state JSONB
- confidence NUMERIC
- source ENUM

### capabilities

- id UUID
- owner_id UUID nullable
- catalog_key TEXT nullable
- name TEXT
- domain TEXT
- maturity_level ENUM
- reusable BOOLEAN
- created_at
- updated_at

### goal_capabilities

- goal_id UUID
- capability_id UUID
- role ENUM
- current_level ENUM
- target_level ENUM
- importance NUMERIC
- confidence NUMERIC
- evidence_refs JSONB

Unique: goal_id + capability_id + role.

### goal_evidence

- id UUID
- goal_id UUID
- evidence_type ENUM
- source_type ENUM
- source_ref TEXT nullable
- content JSONB / secure content reference
- captured_at
- reliability NUMERIC
- relevance NUMERIC
- directness NUMERIC
- freshness NUMERIC
- consistency NUMERIC
- privacy_class ENUM

### goal_claims

- id UUID
- goal_id UUID
- kind ENUM
- statement TEXT
- confidence NUMERIC
- status ENUM
- created_at
- superseded_at

### goal_claim_evidence

- claim_id UUID
- evidence_id UUID
- relationship ENUM SUPPORTS / CONTRADICTS / CONTEXTUAL

### goal_decisions

- id UUID
- goal_id UUID
- context TEXT
- question TEXT
- options JSONB
- selected_option JSONB
- rationale TEXT
- confidence NUMERIC
- risks JSONB
- expected_outcome JSONB
- review_trigger JSONB
- approval_state ENUM
- decided_at

### goal_experiments

- id UUID
- goal_id UUID
- hypothesis TEXT
- test JSONB
- expected_information_gain NUMERIC
- cost JSONB
- risk JSONB
- status ENUM
- observation JSONB
- conclusion TEXT
- created_at
- completed_at

### goal_mutations

- id UUID
- goal_id UUID
- model_version_before INTEGER
- model_version_after INTEGER nullable
- mutation_type ENUM
- target_id UUID nullable
- before_state JSONB
- after_state JSONB
- reason TEXT
- evidence_refs JSONB
- confidence NUMERIC
- expected_impact JSONB
- risk JSONB
- severity ENUM
- approval_state ENUM
- actor_type ENUM
- actor_id UUID nullable
- created_at
- applied_at nullable

### goal_reviews

- id UUID
- goal_id UUID
- period JSONB
- observations JSONB
- outcomes JSONB
- failures JSONB
- learning JSONB
- assumption_changes JSONB
- proposed_mutations JSONB
- created_at

### goal_outcomes

- id UUID
- goal_id UUID
- criterion_ref TEXT
- achieved_state JSONB
- evidence_refs JSONB
- achievement_level ENUM
- captured_at

### goal_lineage

- id UUID
- parent_goal_id UUID
- child_goal_id UUID
- relationship_type ENUM
- rationale TEXT
- evidence_refs JSONB
- created_at

## 4. Transaction Rules

A material mutation should execute atomically:

```text
validate
 -> create new model version
 -> persist changed nodes/edges
 -> persist mutation audit record
 -> emit domain events
 -> update read projections
```

If any required step fails, canonical state must remain unchanged.

## 5. Concurrency

GoalModel version must participate in optimistic concurrency control.

A mutation submitted against version N must fail/rebase if the current version is no longer N.

Never silently overwrite a newer model.

## 6. API Resources

### Goals

`POST /goals`  
`GET /goals/:goalId`  
`PATCH /goals/:goalId`

### Goal Model

`GET /goals/:goalId/model`  
`GET /goals/:goalId/state`  
`GET /goals/:goalId/tree`

### Evidence

`POST /goals/:goalId/evidence`  
`GET /goals/:goalId/evidence`

### Intelligence

`GET /goals/:goalId/insights`  
`GET /goals/:goalId/bottlenecks`  
`GET /goals/:goalId/recommendations`  
`GET /goals/:goalId/forecast`

### Review

`POST /goals/:goalId/reviews`  
`GET /goals/:goalId/reviews`

### Mutations

`POST /goals/:goalId/mutations`  
`POST /goals/:goalId/mutations/:mutationId/approve`  
`POST /goals/:goalId/mutations/:mutationId/apply`

Exact route naming may be reconciled with existing DECIVEXA API conventions before implementation.

## 7. API Rules

- every request is authenticated
- owner scope is enforced server-side
- never accept ownerId from an untrusted client as authority
- mutation endpoints require explicit authorization
- response DTOs must not expose private internal fields unnecessarily
- AI-generated content must carry provenance metadata where relevant
- historical versions are read-only

## 8. Tree View Contract

The tree endpoint should return a projection containing:

- root
- nodes
- parent/child relationships
- node type
- state
- progress summary
- confidence
- health indicator
- risk indicator where appropriate
- current focus marker
- mutation/version metadata needed by UI

The endpoint must not require the frontend to reconstruct the canonical graph.

## 9. Intelligence View Contract

Insights should be grouped into:

- progress
- bottleneck
- risk
- health
- next intervention
- learning

Each material insight should include a provenance/reference set and confidence category.

## 10. Pagination

Evidence, reviews, history, mutations, and events must be paginated. Tree projection should be bounded by the model version and may support lazy expansion for large goals.

## 11. Idempotency

Commands that can be retried must support idempotency keys or equivalent domain-level deduplication.

This is particularly important for:

- evidence submission
- mutation application
- review creation
- outcome recording

## 12. Authorization

Authorization checks must occur at the application/domain boundary, not only at the controller.

The goal owner scope must be propagated through every repository query.

## 13. Audit Requirements

Audit records must preserve:

- actor
- timestamp
- operation
- target
- before
- after
- reason
- evidence refs
- approval
- correlation/request ID

## 14. Migration Strategy

No schema migration is authorized by this document. When implementation is approved, migrations must:

1. be additive where possible
2. preserve existing data
3. be reversible where practical
4. include indexes based on actual query patterns
5. include test fixtures
6. be validated against existing repository conventions

## 15. Performance Direction

Initial targets should prioritize responsive product behavior rather than premature optimization.

Potential read-model/cache candidates:

- GoalTreeView
- GoalOverviewView
- GoalInsightsView

Cache invalidation must be tied to domain events/model versions rather than arbitrary timeouts alone.

## 16. API Versioning

The implementation must follow the existing DECIVEXA API versioning convention. GGI must not introduce a second incompatible convention.

## 17. No Direct ORM Leakage

Domain entities and business rules must not depend on ORM-specific persistence models. Repository interfaces belong at the domain/application boundary; infrastructure implements them.

## 18. Future Graph Projection

If future scale requires graph-native processing, the canonical relational graph can be projected to a graph engine. Such a decision requires evidence and a separate ADR. V1 must not make the future graph engine a prerequisite.
