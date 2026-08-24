# DECIVEXA — Goal Growth Domain Model v1

**Status:** Architecture Draft — Founder Review Required  
**Implementation:** NOT AUTHORIZED

## 1. Domain Boundary

This document defines the canonical domain concepts behind Goal Growth Intelligence. It does not prescribe ORM syntax. It is the semantic contract from which persistence and API contracts must be derived.

## 2. Entity Map

```text
Goal
 ├─ Intent
 ├─ DesiredState
 ├─ CurrentStateSnapshots
 ├─ GoalModelVersions
 │   ├─ Nodes
 │   └─ Edges
 ├─ Phases
 ├─ Evidence
 ├─ Claims
 ├─ Decisions
 ├─ Experiments
 ├─ Reviews
 ├─ Risks
 ├─ Forecasts
 ├─ Mutations
 ├─ Outcomes
 └─ Lineage

Capability
 └─ GoalCapabilityLink -> Goal
```

## 3. Goal

Identity:

- id
- ownerId
- title
- description
- lifecycleState
- createdAt
- updatedAt
- version

Invariants:

- owner scope is mandatory
- title is mutable without changing identity
- lifecycle transitions are validated
- material changes are auditable

## 4. GoalIntent

Fields:

- id
- goalId
- statement
- origin
- importance
- alignment
- confidence
- stability
- createdAt
- supersededAt

Origin vocabulary may include USER_STATED, INFERRED, IMPORTED, DERIVED. Inferred intent must remain distinguishable from user-stated intent.

## 5. DesiredState

Fields:

- id
- goalId
- description
- qualitativeConditions
- quantitativeConditions
- successCriteria
- targetWindow
- evidenceRequirements
- confidence
- version

A DesiredState may evolve through explicit mutation; previous versions remain auditable.

## 6. CurrentStateSnapshot

Fields:

- id
- goalId
- capturedAt
- observedConditions
- capabilityReferences
- resourceReferences
- constraintReferences
- dependencyReferences
- evidenceReferences
- confidence
- sourceSummary

A snapshot is a model of current reality, not reality itself.

## 7. GoalModel

A versioned aggregate describing how the system currently believes the goal can be transformed.

Fields:

- id
- goalId
- version
- status
- modelConfidence
- createdAt
- supersededAt
- generatedBy
- rationale

Only one model version is current at a time.

## 8. GoalNode

Fields:

- id
- modelId
- stableKey
- type
- title
- description
- status
- positionMetadata
- confidence
- source
- createdAt
- retiredAt

A node's stable identity should survive ordinary ordering changes. A replacement should create explicit lineage rather than silently rewriting history.

## 9. GoalEdge

Fields:

- id
- modelId
- fromNodeId
- toNodeId
- type
- strength
- confidence
- rationale
- createdAt
- retiredAt

Edges are directional unless the type explicitly declares otherwise.

## 10. GoalPhase

Fields:

- id
- goalId
- phaseType
- startedAt
- endedAt
- transitionEvidence
- confidence

Only one current phase should exist at a time.

## 11. GoalState

Current aggregate state may include:

- lifecycle
- phase
- activityProgress
- capabilityProgress
- outcomeProgress
- modelConfidence
- momentum
- health
- riskLevel
- capacityFit
- alignment

State is a read-optimized aggregate. It must not replace historical evidence.

## 12. Capability

Fields:

- id
- ownerId or globalCatalogId
- name
- domain
- maturityLevel
- evidenceReferences
- confidence
- reusable

A capability may be user-specific or catalog-derived. User-specific state must never be overwritten by generic catalog data.

## 13. GoalCapabilityLink

Fields:

- goalId
- capabilityId
- role
- currentLevel
- targetLevel
- importance
- confidence
- evidenceReferences

Roles may include REQUIRED, SUPPORTING, LEVERAGE, SHARED.

## 14. Strategy

A strategy is a coherent approach to transforming state. It is distinct from a task and from a goal.

Fields:

- id
- goalId/modelId
- statement
- assumptions
- expectedMechanism
- confidence
- status
- evidenceReferences

## 15. Milestone

A milestone is a meaningful intermediate condition, not simply a date.

Fields:

- id
- goalId/modelId
- condition
- successCriteria
- evidenceRequirements
- status
- targetWindow

## 16. Action

Action is an executable unit handed to execution layers.

Fields:

- id
- goalId
- nodeId
- description
- expectedEffect
- capacityRequirement
- dependencies
- status

Daily OS may schedule an Action; GGI owns its transformation meaning.

## 17. Experiment

Fields:

- id
- goalId
- hypothesis
- test
- expectedInformationGain
- cost
- risk
- status
- observation
- conclusion
- evidenceReferences

## 18. Evidence

Fields:

- id
- ownerId
- goalId
- type
- source
- contentReference
- capturedAt
- reliability
- relevance
- directness
- freshness
- consistency
- privacyClass

Evidence may support multiple claims.

## 19. Claim

Fields:

- id
- goalId
- statement
- kind
- confidence
- status
- supportingEvidence
- contradictingEvidence
- createdAt
- supersededAt

Kinds: FACT, OBSERVATION, INFERENCE, HYPOTHESIS, RECOMMENDATION.

## 20. Decision

Fields:

- id
- goalId
- context
- question
- options
- selectedOption
- rationale
- evidence
- confidence
- risks
- expectedOutcome
- reviewTrigger
- approvalState
- decidedAt

## 21. Constraint

Fields:

- id
- goalId
- type
- description
- severity
- flexibility
- source
- confidence
- activeFrom
- activeTo

## 22. Risk

Fields:

- id
- goalId
- description
- probability
- impact
- detectability
- proximity
- reversibility
- mitigation
- confidence
- status

## 23. Forecast

Fields:

- id
- goalId
- modelVersion
- generatedAt
- expectedTime
- successProbability
- expectedOutcome
- resourceCost
- riskSummary
- confidence
- assumptions

Forecasts are replaceable projections, never facts.

## 24. Review

Fields:

- id
- goalId
- period
- observations
- outcomes
- failures
- learning
- assumptionChanges
- proposedMutations
- createdAt

## 25. GoalMutation

Fields:

- id
- goalId
- modelVersionBefore
- modelVersionAfter
- mutationType
- targetId
- beforeState
- afterState
- reason
- evidenceReferences
- confidence
- expectedImpact
- risk
- severity
- approvalState
- actor
- createdAt

## 26. GoalOutcome

Fields:

- id
- goalId
- desiredCriterion
- achievedState
- evidenceReferences
- achievementLevel
- capturedAt

Achievement level must support PARTIAL, SUBSTANTIAL, COMPLETE, NOT_ACHIEVED.

## 27. GoalLineage

Represents continuity among goals/models:

- parentGoalId
- childGoalId
- relationshipType
- rationale
- evidence
- createdAt

Relationship types: REFRAMED_FROM, SPLIT_FROM, MERGED_FROM, REPLACED_BY, CONTINUED_AS, DERIVED_FROM.

## 28. State Machines

### Lifecycle

```text
DRAFT -> DISCOVERING -> CLARIFYING -> VALIDATING -> READY -> ACTIVE
ACTIVE -> PAUSED
PAUSED -> ACTIVE
ACTIVE -> COMPLETED
ACTIVE -> ABANDONED
ACTIVE -> RETIRED
PAUSED -> ABANDONED
PAUSED -> RETIRED
```

Invalid transitions must fail explicitly.

### Mutation

```text
PROPOSED -> VALIDATING -> APPROVED -> APPLIED
PROPOSED -> REJECTED
VALIDATING -> REJECTED
APPROVED -> FAILED
```

Applied mutations must create a new GoalModel version when structurally material.

## 29. Domain Invariants

1. Goal belongs to exactly one authorized owner scope.
2. Current GoalModel has one active version.
3. Tree nodes belong to a model version.
4. Edges cannot reference retired/nonexistent nodes in the same model.
5. Evidence does not become a Claim automatically.
6. Inference cannot be represented as FACT without an explicit evidence-based transition.
7. Material mutation preserves before/after state.
8. Historical model versions are immutable.
9. Goal completion requires evidence sufficient for success criteria.
10. Shared capabilities cannot be duplicated silently; links express reuse.
11. Current state is not a substitute for history.
12. Forecast is never stored as observed fact.
13. AI proposal is not canonical domain truth.
14. Approval state is mandatory for mutations above the configured governance threshold.
15. Unknown nodes are valid and may persist until resolved.

## 30. Domain Events

Recommended events:

- GoalCreated
- GoalIntentDefined
- DesiredStateDefined
- GoalReadinessChanged
- GoalActivated
- GoalPaused
- GoalResumed
- GoalCompleted
- GoalAbandoned
- GoalRetired
- GoalModelCreated
- GoalModelSuperseded
- GoalNodeAdded
- GoalNodeRetired
- GoalEdgeAdded
- GoalEdgeRetired
- EvidenceAdded
- ClaimCreated
- ClaimUpdated
- ExperimentCreated
- ExperimentCompleted
- DecisionRecorded
- ReviewCompleted
- MutationProposed
- MutationApproved
- MutationApplied
- ForecastUpdated
- BottleneckDetected
- GoalReframed
- GoalLineageCreated

## 31. Domain Service Boundaries

Recommended domain services:

- GoalReadinessEvaluator
- GoalModelBuilder
- GoalGraphValidator
- GoalProgressEvaluator
- GoalHealthEvaluator
- BottleneckDetector
- InterventionRanker
- GoalAdaptationEvaluator
- MutationPolicyEvaluator
- GoalCompletionEvaluator
- GoalLineageManager

These services should contain domain rules, not transport concerns.

## 32. Application Service Boundaries

Recommended use cases:

- CreateGoal
- ClarifyGoal
- ValidateGoalReadiness
- ActivateGoal
- RecordEvidence
- RecordOutcome
- RunGoalReview
- GenerateGoalInsights
- ProposeMutation
- ApproveMutation
- ApplyMutation
- PauseGoal
- ResumeGoal
- CompleteGoal
- ReframeGoal
- GetGoalTree
- GetGoalState
- GetGoalHistory

## 33. Read Models

At minimum:

- GoalOverviewView
- GoalTreeView
- GoalStateView
- GoalEvidenceView
- GoalInsightsView
- GoalHistoryView
- GoalReviewView

Read models may denormalize data for UX performance but must be derived from canonical domain state.

## 34. API Resource Principle

Canonical resources are Goal, Model, State, Evidence, Review, Mutation, and Intelligence. Tree is a projection endpoint/view, not the aggregate root.

## 35. Future Compatibility

This domain model must support future:

- Memory integration
- Human Understanding
- Personal Development Model
- Growth Navigation Engine
- Decision Intelligence
- Risk Intelligence
- Digital Twin
- Agents
- voice interaction

without making any of those features mandatory for V1.
