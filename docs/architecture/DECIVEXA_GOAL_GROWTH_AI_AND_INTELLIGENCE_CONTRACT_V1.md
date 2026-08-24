# DECIVEXA — Goal Growth AI & Intelligence Contract v1

**Status:** Architecture Draft — Founder Review Required  
**Implementation:** NOT AUTHORIZED

## 1. Purpose

Defines the intelligence boundary for Goal Growth Intelligence. It prevents the LLM from becoming the owner of goal state and establishes a deterministic, evidence-aware orchestration layer around model inference.

## 2. Core Rule

> LLMs propose interpretations and actions; DECIVEXA validates, governs, and owns canonical state.

## 3. Intelligence Pipeline

```text
User / System Context
        ↓
Context Assembly
        ↓
Evidence Selection
        ↓
State Assembly
        ↓
Graph Analysis
        ↓
LLM / Algorithmic Reasoning
        ↓
Structured Proposal
        ↓
Schema Validation
        ↓
Evidence & Consistency Validation
        ↓
Policy / Governance
        ↓
Mutation or Recommendation
        ↓
Audit
```

## 4. Context Assembly

The AI receives minimum necessary context only. Context should include, as authorized:

- goal intent
- desired state
- relevant current state
- active model version
- relevant graph neighborhood
- relevant evidence
- relevant claims
- current phase
- relevant constraints
- capacity signals
- recent review/learning
- relevant cross-goal relationships

Do not send the entire personal memory store to every goal prompt.

## 5. Proposal Types

Initial structured proposal types:

- ASK_CLARIFICATION
- IDENTIFY_UNKNOWN
- IDENTIFY_BOTTLENECK
- PROPOSE_ACTION
- PROPOSE_EXPERIMENT
- PROPOSE_STRATEGY_CHANGE
- PROPOSE_NODE_CHANGE
- PROPOSE_PHASE_CHANGE
- PROPOSE_GOAL_REFRAME
- PROPOSE_PAUSE
- PROPOSE_RESUME
- PROPOSE_COMPLETION
- PROPOSE_RESOURCE_REALLOCATION

## 6. Proposal Contract

Conceptual shape:

```json
{
  "proposalId": "...",
  "goalId": "...",
  "type": "PROPOSE_EXPERIMENT",
  "target": "node-or-goal-id",
  "reason": "...",
  "evidenceRefs": ["..."],
  "assumptions": ["..."],
  "confidence": 0.0,
  "expectedImpact": "...",
  "risk": "...",
  "userBurden": "...",
  "requiresApproval": true
}
```

This is a conceptual contract, not a final runtime schema.

## 7. Evidence Discipline

The AI must classify reasoning as:

- observed
- supported
- inferred
- hypothesized
- recommended
- unknown

If evidence is absent, the output must explicitly say so.

## 8. Recommendation vs Decision

Recommendation:

> A candidate action or interpretation produced by intelligence.

Decision:

> A governed selection that has been accepted and recorded.

The AI may recommend. It does not silently decide for the user where governance requires user control.

## 9. Mutation Safety

AI output must never directly mutate:

- goals
- goal models
- nodes
- edges
- lifecycle state
- success criteria
- goal priority
- goal lineage

Instead it produces a proposal that is validated and passed through the Mutation Engine.

## 10. Deterministic Validation

Before application, the system validates:

- schema correctness
- target existence
- owner authorization
- model version consistency
- edge validity
- lifecycle validity
- phase validity
- evidence references
- policy threshold
- conflict constraints
- capacity implications
- governance requirements

## 11. Confidence

Confidence is not truth. Confidence must be treated as model uncertainty metadata.

A high-confidence recommendation can still be wrong. A low-confidence hypothesis can still be valuable if it motivates a cheap, informative experiment.

## 12. Question Engine

Questions are selected by expected information value.

Conceptual ranking:

`Decision Impact × Information Gain × Urgency / User Burden`

The engine should prefer one high-value question over many low-value questions.

## 13. Bottleneck Engine

Bottleneck candidates may come from:

- graph centrality
- dependency blocking
- capability gaps
- resource constraints
- repeated failure patterns
- evidence contradictions
- strategy mismatch
- phase-readiness gaps

The output must identify the reason and supporting evidence.

## 14. False Progress Detection

Detect patterns such as:

```text
activity ↑
outcome →
capability →
```

or:

```text
activity ↑
model confidence ↓
```

The system should surface this as a diagnostic, not as a definitive psychological judgment.

## 15. Stagnation Detection

Potential stagnation:

- sustained effort
- insufficient meaningful state change
- repeated intervention without learning
- unresolved bottleneck

The system should first diagnose rather than automatically recommend abandonment.

## 16. Adaptation Ranking

Candidate adaptations should consider:

- expected value
- leverage
- confidence
- feasibility
- risk
- cost
- user burden
- opportunity cost
- reversibility
- model stability

## 17. Smallest Sufficient Change

Prefer:

`Action adjustment`

before:

`Strategy adjustment`

before:

`Model restructuring`

before:

`Goal reframing`

unless evidence indicates the higher-level object is invalid.

## 18. Tree Stability Guard

The AI should not generate structural tree changes for cosmetic reasons. Structural mutation should be supported by material evidence, a meaningful change in state, or a high-value clarification.

## 19. Forecasting Contract

Forecast outputs must contain:

- forecast timestamp
- model version
- assumptions
- expected range/time
- probability
- uncertainty
- evidence basis

Forecasts must be invalidatable when relevant state changes.

## 20. Experiment Contract

A good experiment should state:

- hypothesis
- why uncertainty matters
- test
- expected observation
- information gain
- cost
- risk
- decision affected
- stopping condition

## 21. Human Governance

Recommended policy levels:

LOW — bounded automatic application may be permitted.  
MEDIUM — proposal and user-visible explanation.  
HIGH — explicit confirmation.  
CRITICAL — explicit authorized human approval.

The exact mapping of mutation types to severity requires a future Scope Contract.

## 22. Explainability

For every material insight, the system should be able to answer:

1. What changed?
2. What evidence supports this?
3. What is inferred?
4. What remains unknown?
5. Why does this matter?
6. What are the candidate responses?
7. What risk exists?
8. What would change the recommendation?

## 23. Provider Independence

GGI intelligence must not depend on one model provider. Model adapters belong below the capability layer.

```text
GGI Intelligence Contract
        ↓
Model/Provider Adapter
        ↓
LLM Provider
```

The domain must not import provider-specific SDKs.

## 24. AI Failure Behavior

If AI is unavailable:

- canonical goal state remains available
- existing tree/state/history remain usable
- deterministic validations continue
- user can record evidence/outcomes
- previously generated recommendations remain clearly marked as historical

No intelligence outage may become a data-integrity outage.

## 25. AI Hallucination Guardrails

- never invent evidence
- never invent user preferences
- never silently rewrite history
- never claim an external source was consulted when it was not
- never claim a mutation was applied when it was not
- never confuse forecast with fact
- never convert inference to observation

## 26. Evaluation

AI evaluation must include:

- goal-model fidelity
- evidence attribution accuracy
- unknown recognition
- bottleneck accuracy
- recommendation usefulness
- mutation safety
- hallucination rate
- calibration
- user-burden reduction
- stability / churn

## 27. Golden AI Cases

### Case A — Same Goal, Different Person

Input users have different Current States. Output structures must differ appropriately.

### Case B — Missing Information

AI should ask or mark UNKNOWN rather than invent.

### Case C — Contradictory Evidence

AI should surface contradiction and reduce confidence.

### Case D — False Progress

Activity is high but meaningful outcome change is low. AI should diagnose.

### Case E — Material Mutation

AI proposes a goal reframe. Policy requires approval.

### Case F — Simpler Tree

New evidence eliminates unnecessary branches. AI may propose pruning rather than growth.

## 28. Output Style

The user-facing AI should not expose internal model complexity unless useful. Internal reasoning can be deep; external communication should be concise, actionable, and evidence-grounded.

## 29. Security Boundary

AI context must be scoped by authorization and purpose. Sensitive information unrelated to the current decision must not be included merely because it might improve model performance.

## 30. Implementation Rule

This contract is an architecture specification only. Before coding, create an implementation-specific Scope Contract, exact schemas, evaluation fixtures, and Build Authorization under DECIVEXA governance.
