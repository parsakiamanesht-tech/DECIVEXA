# DECIVEXA — Goal Growth Intelligence Master Specification v1

**Status:** Architecture Draft — Founder Review Required  
**Branch:** `architecture/goal-growth-intelligence-v1`  
**Scope:** Goal OS / Growth Navigation / Progress Intelligence / Adaptive Goal Journey  
**Implementation:** NOT AUTHORIZED by this document  

## 1. Purpose

Goal Growth Intelligence (GGI) is the domain capability that understands, models, monitors, navigates, learns from, and adaptively evolves a person's pursuit of a desired real-world state.

The originating product idea is the **living Goal Tree**: every goal receives a structure appropriate to its nature, and that structure changes as the person learns, acts, encounters constraints, develops capabilities, and produces evidence. The architecture deliberately preserves this idea while preventing the tree metaphor from becoming a rigid technical model.

**Core principle:**

> The Goal Tree is a human-facing projection of a deeper, versioned, evidence-aware Goal Growth Model. It is not the canonical source of truth.

## 2. Relationship to DECIVEXA

GGI is not a standalone productivity feature. It is a core capability within the broader DECIVEXA Personal Intelligence architecture and must remain compatible with:

- Goal OS
- Human Understanding System / Personal Intelligence Core maturity layers
- Personal Development Model
- Growth Navigation Engine
- Progress Intelligence
- Daily OS
- Decision Intelligence
- Memory
- Evidence Platform
- Risk Intelligence
- Adaptive Recovery
- future Digital Twin and agent architecture

GGI owns the modeling and navigation of goal transformation. Daily OS owns day-level execution. Human Understanding owns the evolving model of the person. Memory owns durable personal learning and retrieval boundaries.

## 3. Problem Definition

Conventional goal systems usually model goals as a title, deadline, status, and task list. This loses the actual structure of transformation:

`Current State -> capabilities/dependencies/strategies -> actions/experiments -> evidence -> outcomes -> learning -> Desired State`

GGI must instead answer:

1. What is the person trying to change?
2. Why does the change matter?
3. What is the desired state?
4. What is known about the current state?
5. What is unknown?
6. What transformation is required?
7. Which capabilities, resources, dependencies, assumptions, and constraints matter?
8. What evidence indicates progress or failure?
9. What is the current bottleneck?
10. What is the smallest useful next intervention?
11. When should the model persist, adapt, test, reframe, pause, or stop?
12. What did the journey teach DECIVEXA about the person?

## 4. The Goal Tree Concept — Formalized

The living-tree metaphor is retained as a product language and visualization model:

| Tree metaphor | Domain meaning |
|---|---|
| Seed | Intent / initial aspiration |
| Root | Why, values, desired change, success definition |
| Trunk | Core transformation model |
| Branches | Capabilities, pathways, strategies, major dependencies |
| Leaves | Actions, experiments, evidence-producing work |
| Fruit | Outcomes / achieved state |
| New seeds | Learning, reusable capabilities, future opportunities/goals |
| Pruning | Removing obsolete, redundant, disproven, or unnecessary structure |
| Grafting | Reusing a capability/pathway between goals |
| Seasonal change | Phase/state/context changes |

The metaphor is not a schema requirement. The canonical model is graph + state + evidence + version history.

## 5. Fundamental Architectural Distinction

GGI contains four related but distinct representations:

```text
                    Goal Growth Model
                    /       |       \
                   /        |        \
               Graph       State    Evidence
                  \          |        /
                   \         |       /
                    -> Tree Projection
```

### 5.1 Graph

Canonical relationships among goal nodes, capabilities, dependencies, strategies, constraints, risks, and outcomes.

### 5.2 State

Current state of the goal and relevant transformation dimensions.

### 5.3 Evidence

Observed facts, measurements, user reports, experiments, outcomes, and external evidence that support or contradict claims.

### 5.4 Tree Projection

A stable, understandable, human-facing hierarchy generated from the graph and current state.

## 6. Goal Ontology

Primary domain entities:

- Goal
- GoalIntent
- DesiredState
- CurrentStateSnapshot
- GoalModel
- GoalNode
- GoalEdge
- GoalPhase
- GoalState
- Capability
- GoalCapabilityLink
- Strategy
- Milestone
- Action
- Experiment
- Evidence
- Claim
- Observation
- Outcome
- Decision
- Constraint
- Risk
- ResourceRequirement
- Forecast
- Review
- GoalMutation
- GoalLearning
- GoalLineage

A concept is not automatically a persistence entity. Persistence must follow domain necessity, identity, lifecycle, and audit requirements.

## 7. Goal Identity and Intent

A Goal has stable identity independent of title changes. Goal identity must survive ordinary reframing where the underlying intent lineage remains materially continuous.

`Intent -> Desired Change -> Goal -> Growth Model`

Intent records why the desired transformation exists. Goal records the committed formulation of that desired transformation.

## 8. Desired State

Desired State is the explicit representation of the state that would constitute meaningful success.

It may contain:

- qualitative conditions
- quantitative conditions
- measurable success criteria
- target time window
- acceptable bounds
- evidence requirements
- confidence

Goal completion is outcome/evidence based, not task-count based.

## 9. Current State

Current State is an evidence-aware snapshot of what is believed to be true now. It must distinguish observed facts from inferred assumptions.

Current State may include:

- capabilities
- resources
- constraints
- environmental conditions
- dependencies
- behavior patterns relevant to the goal
- evidence quality
- uncertainty

## 10. Gap Model

The gap between Current and Desired State is multidimensional:

- Capability Gap
- Knowledge Gap
- Experience Gap
- Resource Gap
- Behavior Gap
- Environment Gap
- Evidence Gap
- Dependency Gap
- Strategy Gap

A single percentage is insufficient as the canonical representation.

## 11. Transformation Model

Every active goal should have an evolving transformation hypothesis:

`Current State -> Transformation Mechanisms -> Desired State`

Transformation mechanisms can include:

- Learn
- Practice
- Build
- Acquire
- Change behavior
- Create
- Validate
- Remove
- Adapt
- Recover
- Reallocate

The model is allowed to contain UNKNOWN nodes. DECIVEXA must not invent certainty to make the tree look complete.

## 12. Goal Types and Archetypes

Goal Type is classification, not structure. Initial classifications may include:

- learning
- career
- business
- financial
- project
- creative
- personal development
- relationship
- health
- life
- other

Archetypes are prior hypotheses that accelerate initial modeling. They must never force a universal tree.

**Invariant: Same Goal != Same Path.**

Two people pursuing the same nominal goal may receive materially different models because their Current State, capabilities, resources, constraints, context, values, and evidence differ.

## 13. Goal Node Types

Recommended initial node types:

- ROOT
- CAPABILITY
- SUB_CAPABILITY
- STRATEGY
- MILESTONE
- ACTION
- EXPERIMENT
- OUTCOME
- DECISION
- EVIDENCE
- CONSTRAINT
- RISK
- UNKNOWN

Node type must express domain meaning, not merely UI appearance.

## 14. Goal Graph

Minimum edge semantics:

- DEPENDS_ON
- ENABLES
- SUPPORTS
- BLOCKS
- CONFLICTS_WITH
- CONTRIBUTES_TO
- DERIVED_FROM
- REPLACES
- SHARED_WITH

Edges should support strength and confidence where uncertainty exists. Graph relationships must remain explicit rather than being hidden in free text.

## 15. Capability Backbone

Capability is a first-class domain concept because meaningful goal progress often changes what a person can reliably do.

A capability may be shared by multiple goals:

```text
Communication Capability
   -> Career Goal
   -> Business Goal
   -> Relationship Goal
```

This enables cross-goal learning and Personal Development integration.

Capability maturity should be domain-sensitive. Initial generic levels may be:

`UNKNOWN -> EMERGING -> BASIC -> FUNCTIONAL -> PROFICIENT -> ADVANCED -> MASTERED`

These are descriptive states, not objective universal measurements.

## 16. Goal Lifecycle

```text
DRAFT
  -> DISCOVERING
  -> CLARIFYING
  -> VALIDATING
  -> READY
  -> ACTIVE
  -> PAUSED <-> ACTIVE
  -> COMPLETED

Terminal alternatives:
  ABANDONED
  RETIRED
```

Lifecycle and phase are different concepts.

## 17. Goal Phases

Initial phase vocabulary:

- EXPLORATION
- VALIDATION
- FOUNDATION
- DEVELOPMENT
- EXPANSION
- OPTIMIZATION
- STABILIZATION
- HARVEST
- TRANSITION

A goal can be ACTIVE while its phase changes.

Phase transition should be evidence/state driven, not merely date driven.

## 18. Progress Model

Progress is a vector, not a scalar:

- activity progress
- capability progress
- outcome progress
- model maturity/confidence

Later dimensions may include health, momentum, resilience, and evidence quality.

A system must be able to represent:

`Activity 90%, Capability 55%, Outcome 20%`

without collapsing it to a misleading single percentage.

## 19. Goal Health

Health is independent from progress. A goal can progress quickly while being unsustainable.

Health dimensions may include:

- alignment
- sustainability
- capacity fit
- resource fit
- dependency integrity
- evidence quality
- risk load

DECIVEXA must not optimize goal completion by systematically damaging the human capacity needed to sustain the goal or broader life system.

## 20. Momentum

Momentum measures meaningful state change over time, not task count.

Possible signals:

- outcome movement
- capability movement
- evidence accumulation
- bottleneck removal
- forecast improvement

A goal with high activity but negligible meaningful state change may have false-progress risk or stagnation.

## 21. Evidence Model

Evidence is first-class.

Evidence types may include:

- USER_REPORTED
- OBSERVED_BEHAVIOR
- MEASURED
- SYSTEM_DERIVED
- EXTERNAL_SOURCE
- EXPERIMENTAL
- OUTCOME
- THIRD_PARTY

Evidence quality dimensions:

- reliability
- relevance
- directness
- freshness
- consistency

## 22. Claim Model

A Claim is an interpretation that may be supported or contradicted by evidence.

Required conceptual distinction:

`FACT / OBSERVATION / INFERENCE / HYPOTHESIS / RECOMMENDATION`

The AI must never silently promote a hypothesis into a fact.

## 23. Evidence-to-Decision Chain

```text
Observation
  -> Evidence
  -> Claim / Interpretation
  -> Candidate Decision or Recommendation
  -> Policy / Human Approval
  -> Action / Mutation
```

Every important recommendation must have a traceable reasoning path back to evidence, state, assumptions, or explicitly declared uncertainty.

## 24. Experiment Model

When uncertainty is consequential, the system should prefer testing over pretending to know.

```text
Hypothesis
  -> Test
  -> Observation
  -> Evidence
  -> Model Update
```

Experiment prioritization should consider information gain, cost, risk, and feasibility.

## 25. Bottleneck Intelligence

A bottleneck is any node, capability, dependency, resource, assumption, or constraint whose limitation materially restricts expected meaningful goal progress.

Bottleneck detection must not assume that the bottleneck is a task.

## 26. Leverage Intelligence

Potential intervention leverage may consider:

`Expected Impact × Dependency Reach × Confidence ÷ Cost`

This is an initial conceptual model, not a frozen mathematical formula. Implementation must preserve the ability to evolve the scoring model without rewriting domain entities.

## 27. Risk Intelligence

Risk dimensions:

- probability
- impact
- detectability
- proximity
- reversibility
- mitigation readiness

Risk should influence navigation, not simply appear in a dashboard.

## 28. Forecasting

Forecasts are explicitly probabilistic and versioned. They may include:

- expected time
- expected outcome
- probability
- resource requirement
- risk
- confidence

Important state changes must be able to invalidate or trigger recalculation of forecasts.

## 29. Adaptation Engine

Adaptation hierarchy:

`Action -> Tactic -> Strategy -> Model -> Goal`

The system should prefer the smallest sufficient adaptation. Higher-level changes require stronger evidence and higher governance thresholds.

Primary adaptation modes:

- PERSIST
- MODIFY
- DISENGAGE
- REENGAGE
- TEST
- RECOVER
- REALLOCATE
- REFRAME
- WAIT

## 30. Goal Mutation

Structural changes are represented as explicit mutations:

- ADD_NODE
- REMOVE_NODE
- MOVE_NODE
- MERGE_NODE
- SPLIT_NODE
- CHANGE_TYPE
- CHANGE_PRIORITY
- CHANGE_STRATEGY
- CHANGE_PHASE
- CHANGE_TARGET
- REFRAME_GOAL
- PAUSE_GOAL
- RESUME_GOAL
- RETIRE_GOAL

Every material mutation must preserve before/after state, reason, evidence, expected impact, risk, confidence, actor, and approval status.

## 31. Mutation Governance

Conceptual severity:

- LOW — may be automatically applied if policy allows
- MEDIUM — AI proposes; bounded application may be allowed
- HIGH — explicit user confirmation
- CRITICAL — explicit Founder/user authorization according to domain governance

AI never bypasses policy by writing directly to the canonical state.

## 32. Tree Stability

The tree must not churn continuously. Structural changes require thresholds based on evidence, expected value, and materiality.

A future diagnostic metric may be:

`Tree Churn = structural mutations / time`

High churn should trigger model-stability review rather than further automatic restructuring.

## 33. Tree Growth and Pruning

Growth means meaningful structural improvement, not node-count increase.

The tree may:

- grow when new transformation structure is learned
- branch when independent pathways emerge
- merge when pathways are equivalent
- prune when a path is obsolete or disproven
- simplify when understanding improves
- graft shared capabilities from other goals

**Invariant:** A mature tree may be smaller than its initial tree.

## 34. Goal Ecology

Goals interact through:

- synergy
- conflict
- dependency
- resource competition
- shared capabilities

Activation and planning should consider the existing goal portfolio rather than treating each goal as isolated.

## 35. Capacity Model

Capacity includes more than time:

- time
- energy
- money
- attention
- social capital
- knowledge
- environment

Required capacity may be compared with available capacity. If capacity is insufficient, candidate responses include reducing load, extending timeline, adding resources, changing strategy, splitting scope, or reprioritizing.

## 36. Human Input Minimization

Core principle:

> Infer before asking.

A question is justified when uncertainty has material decision impact and the expected information gain exceeds user burden.

Question metadata should include:

- unknown being resolved
- decision affected
- expected information gain
- urgency
- user burden

## 37. Next Best Intervention

The system's navigation output is not limited to tasks. Candidate intervention types include:

- EXECUTE
- LEARN
- TEST
- DECIDE
- REMOVE
- PROTECT
- RECOVER
- REALLOCATE
- WAIT
- REFRAME

Ranking should consider value, relevance, leverage, confidence, feasibility, cost, risk, opportunity cost, and user burden.

## 38. Daily OS Boundary

GGI determines what transformation is currently needed. Daily OS determines what concrete action should be scheduled/executed.

`GGI: What matters next?`  
`Daily OS: What should happen today/now?`

This boundary is mandatory.

## 39. Review Loop

Reviews are model-centric:

- what changed?
- what worked?
- what failed?
- what was learned?
- which assumptions changed?
- what should change in the model?

Review may generate learning and proposed mutations.

## 40. Completion and Harvest

Completion requires sufficient evidence that the Desired State / success criteria have been met.

Completion harvest captures:

- outcomes
- capabilities gained
- lessons
- evidence
- decisions
- failed strategies
- reusable assets
- future opportunities

Partial completion must be representable.

## 41. Goal Lineage

Goal history must survive reframing, splitting, merging, retirement, and replacement.

Example:

```text
Goal A
  -> REFRAME -> Goal B
  -> SPLIT -> Goal C + Goal D
```

Lineage is essential for longitudinal learning and future Human Model updates.

## 42. Learning Loop

```text
PLAN
 -> ACT
 -> OBSERVE
 -> INTERPRET
 -> LEARN
 -> UPDATE MODEL
 -> ADAPT
 -> PLAN
```

This loop is the core dynamic behavior of GGI.

## 43. Human Growth Loop

```text
Goal
 -> Experience
 -> Capability
 -> Behavior / Evidence
 -> Human Model
 -> Better Future Goal Design
```

GGI therefore contributes to the Personal Development Model rather than remaining a closed goal feature.

## 44. Memory Compatibility

Goal events, decisions, evidence, learning, outcomes, and reusable patterns must be representable for future Memory integration without requiring GGI to own the entire memory system.

Memory integration is a boundary concern, not permission to expand V1 into Advanced Memory.

## 45. AI Architecture Boundary

LLMs generate proposals, interpretations, questions, candidate plans, and explanations. They do not own canonical domain truth.

```text
LLM
 -> Structured Proposal
 -> Schema Validation
 -> Evidence/Context Validation
 -> Policy Engine
 -> Mutation Engine
 -> Canonical State
```

AI must be provider/model independent.

## 46. Unknown-First Rule

When consequential uncertainty is unresolved, GGI must prefer:

- ask
- research
- experiment
- explicitly mark unknown

over invented certainty.

## 47. Anti-Over-Adaptation Rule

Model change has a cost. The system must not restructure a goal merely because a new interpretation is possible.

A mutation should be preferred when:

`Expected benefit of adaptation > cost of change + instability introduced`

This is conceptual and must remain replaceable as scoring evolves.

## 48. Trustworthy Navigation

GGI is a foundation for DECIVEXA's Trustworthy Navigation Architecture.

A trustworthy recommendation should expose, at an appropriate level:

- what is observed
- what is inferred
- what is uncertain
- why the intervention is suggested
- expected benefit
- meaningful risk
- alternatives where material

## 49. Security and Privacy

Goal data may be deeply personal. GGI must follow DECIVEXA's existing privacy architecture:

- least-context access
- user ownership
- authorization boundaries
- auditability
- export/delete compatibility
- encryption where required
- no unnecessary data collection

## 50. Technical Architecture Direction

V1 should be implemented as a modular monolith inside the existing DECIVEXA architecture unless a separately approved decision establishes otherwise.

Suggested module boundaries:

```text
goal/
goal-model/
goal-graph/
goal-evidence/
goal-intelligence/
goal-adaptation/
goal-review/
goal-memory/
```

These are logical module boundaries, not immediate microservices.

## 51. Persistence Direction

PostgreSQL is the default V1 persistence direction. A relational representation is preferred over introducing a graph database prematurely.

The graph is represented through explicit node and edge relations. Graph projection/query capabilities may evolve independently.

## 52. Event Direction

V1 should not adopt full Event Sourcing merely for this capability. Important domain events and mutations must nevertheless be immutable/auditable enough to reconstruct material history.

## 53. Canonical Domain Tables — Conceptual

Likely persistence entities:

- goals
- goal_models
- goal_nodes
- goal_edges
- goal_states
- goal_phases
- goal_evidence
- goal_claims
- goal_decisions
- goal_mutations
- goal_reviews
- goal_outcomes
- goal_experiments
- goal_constraints
- goal_risks
- goal_forecasts
- capabilities
- goal_capabilities
- goal_lineage

Exact schema belongs to the separate Domain Model Specification and must not be inferred from this list alone.

## 54. API Principle

Do not make the tree the primary API resource.

Prefer:

`Goal -> Model / State / Graph / Tree Projection / Evidence / Intelligence`

The tree is a read model/view model.

## 55. Product Experience

The user should not be asked to manually maintain the tree.

The system should do as much modeling as possible automatically. The user primarily:

- states intent
- clarifies consequential ambiguity
- provides/authorizes evidence when needed
- executes or confirms meaningful actions
- confirms material decisions
- reviews outcomes

## 56. V1 Core Capabilities

V1 should establish the complete minimum loop:

1. goal creation
2. intent and desired state
3. readiness/clarification
4. initial growth model
5. typed goal tree projection
6. capability and dependency representation
7. evidence capture
8. multidimensional progress
9. review
10. bounded mutation
11. basic bottleneck detection
12. next best intervention
13. explainability
14. version/history/audit

Advanced causal inference, digital twin, full multi-agent orchestration, complex simulation, and advanced predictive behavioral modeling remain future capabilities unless separately authorized.

## 57. V1 Golden Tests

At minimum:

1. Natural-language goal becomes intent + desired state + unknowns, not a blind task list.
2. Same nominal goal produces different models for different Current States.
3. Activity increases without outcome movement -> false-progress/stagnation signal.
4. Evidence invalidates strategy -> adaptation proposal.
5. Shared capability links to multiple goals.
6. Reframing preserves lineage/history.
7. High-impact AI mutation requires approval.
8. Missing evidence produces uncertainty, not invented facts.
9. Goal can become simpler after learning.
10. Capacity conflict changes navigation rather than merely adding tasks.

## 58. Non-Goals for V1

- universal fixed goal templates
- task-count optimization
- graph database requirement
- full event sourcing
- autonomous major goal replacement
- autonomous life reprioritization without governance
- Digital Twin implementation
- Advanced Memory implementation
- unrestricted multi-agent autonomy
- collection of every possible personal signal

## 59. Constitutional Invariants

GGI-I01 — Goal Tree is a projection, not source of truth.  
GGI-I02 — No universal goal tree exists.  
GGI-I03 — Evidence and inference remain distinguishable.  
GGI-I04 — UNKNOWN is a valid state.  
GGI-I05 — Activity is not outcome.  
GGI-I06 — Complexity is not success.  
GGI-I07 — AI cannot directly mutate canonical truth.  
GGI-I08 — Material changes require appropriate human governance.  
GGI-I09 — Health is independent from progress.  
GGI-I10 — Human capacity constrains execution planning.  
GGI-I11 — Failed paths remain learnable.  
GGI-I12 — Goal changes preserve history.  
GGI-I13 — Prefer the smallest sufficient adaptation.  
GGI-I14 — Minimize user input through justified inference.  
GGI-I15 — Fact/observation/inference/hypothesis/recommendation remain distinct.  
GGI-I16 — Completion requires outcome evidence, not task completion.  
GGI-I17 — Do not optimize goals by sacrificing sustainable human functioning.  
GGI-I18 — Goal models are versioned.  
GGI-I19 — Material mutations are auditable.  
GGI-I20 — Future Memory, Digital Twin, Agents, and Personal AI Coach remain compatible.  
GGI-I21 — Consequential uncertainty should trigger information reduction, not false certainty.  
GGI-I22 — Optimize meaningful state transformation, not activity volume.  
GGI-I23 — Adaptation must justify its instability/change cost.  
GGI-I24 — Important recommendations have traceable reasoning.  
GGI-I25 — Better understanding may simplify the tree.

## 60. Governance

This document is an architectural proposal. It does not authorize implementation, schema migration, API changes, UI work, AI integration, or changes to existing DECIVEXA capabilities.

Implementation requires:

`Founder Review -> Scope Contract -> Implementation Readiness -> Build Authorization -> Implementation -> Verification -> Gate`

No future implementation agent, including Claude Code, may interpret this document alone as authorization to exceed the approved scope.

## 61. Decision Principle

The final product should feel simple while the model behind it is deep:

> **For the user: a living path. Behind the scenes: a continuously learning transformation model.**
