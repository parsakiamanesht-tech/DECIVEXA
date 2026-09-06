# DECIVEXA — Goal Growth Intelligence Architecture Hardening v2

**Status:** Pre-Freeze Architecture Candidate — Founder Approval Required  
**Implementation:** NOT AUTHORIZED

## 1. Objective

This document hardens the first GGI architecture set by resolving conceptual ambiguities, strengthening domain boundaries, defining canonical state ownership, and identifying the minimum technical contracts required before implementation.

The central product idea remains:

> Every goal gets a goal-specific living structure that evolves as the person advances and the system learns what the real path requires.

The hardened architecture is:

```text
Goal Intent
   ↓
Goal Contract / Desired State
   ↓
Goal Growth Model
   ├── State
   ├── Graph
   ├── Evidence / Claims
   ├── Capabilities
   ├── Strategies
   ├── Risks / Constraints
   └── Lineage / History
   ↓
Tree Projection + Navigation Projection
   ↓
Intervention Proposal
   ↓
Execution Layer
   ↓
Real-World Outcome
   ↓
Evidence
   ↓
Model Update
```

---

# 2. Canonical Ownership Rules

| Concern | Canonical owner | GGI role |
|---|---|---|
| Person identity/model | Human Understanding | consume/emit governed learning |
| Goal lifecycle/contract | Goal OS | own transformation intelligence |
| Evidence provenance | Evidence Platform | contextualize for goal |
| Durable memory | Memory | emit goal-learning candidates |
| Day scheduling | Daily OS | provide next transformation focus |
| General decision reasoning | Decision Intelligence | provide goal decision context |
| General risk capability | Risk Intelligence | consume/provide goal risk context |
| AI routing/providers | AI Architecture | consume capability contract |
| Goal transformation model | GGI | canonical owner |
| Goal Tree projection | GGI | canonical owner |
| Goal-specific navigation | GGI / Growth Navigation integration | canonical owner for goal context |

No module may silently acquire ownership of another module's canonical state.

---

# 3. Aggregate Boundary

The Goal is the business aggregate root for goal lifecycle and authorization.

The versioned GoalModel is the canonical structural snapshot for the transformation model.

A material structural change creates a new GoalModel version.

```text
Goal Aggregate
 ├── identity
 ├── intent
 ├── desired state
 ├── lifecycle
 ├── current phase
 └── references to current GoalModel

GoalModel Version
 ├── nodes
 ├── edges
 ├── strategies
 ├── capability links
 └── structural assumptions
```

Evidence, claims, forecasts, and reviews retain their own identity and history and are referenced rather than embedded as mutable blobs in every model version.

---

# 4. Tree Is a Projection

The canonical domain model must never require the UI tree to be the persistence hierarchy.

The Tree Projection should be generated from:

- current GoalModel
- active state
- selected navigation focus
- relevant evidence
- permissions
- presentation preferences

The projection may support multiple views without changing domain truth.

Possible projections:

- Growth Tree
- Focus Tree
- Capability Tree
- Outcome Tree
- Evidence Tree
- Timeline
- Navigation Map

---

# 5. Goal State vs Goal Model

These must remain distinct.

**GoalModel:** what the system currently believes the transformation structure is.

**GoalState:** what is currently happening with that goal.

Example:

```text
Model v7:
  validation → foundation → customer acquisition

State:
  phase = validation
  activity = high
  outcome = low
  model confidence = medium
```

State changes do not automatically require a new structural model version.

Structural model changes do.

---

# 6. State Transition Architecture

Three levels must be distinguished:

### A. Lifecycle transition

DRAFT → ACTIVE → PAUSED → COMPLETED etc.

### B. Phase transition

EXPLORATION → VALIDATION → FOUNDATION etc.

### C. Model mutation

Add/remove/change/merge/split/reframe structural elements.

These transitions have different evidence requirements and governance thresholds.

---

# 7. Goal Tree Growth Semantics

Tree growth must be event/evidence-driven.

Valid growth triggers include:

1. newly discovered dependency;
2. newly required capability;
3. validated new pathway;
4. new meaningful milestone;
5. outcome exposing a new branch;
6. experiment revealing an alternative strategy;
7. cross-goal capability reuse;
8. constraint requiring a new pathway;
9. phase transition exposing new structure;
10. user-defined material change.

Invalid growth triggers include:

- arbitrary AI creativity;
- cosmetic expansion;
- node-count targets;
- daily activity volume alone;
- repetitive task generation.

---

# 8. Tree Pruning Semantics

Pruning is a first-class growth operation.

A branch may be pruned when:

- disproven;
- obsolete;
- redundant;
- superseded;
- no longer relevant;
- too costly relative to value;
- absorbed into another branch.

Pruning must preserve historical lineage.

---

# 9. Grafting / Reuse

A capability learned in one goal can support another goal without copying the original node tree.

```text
Capability C
 ├── Goal A
 ├── Goal B
 └── Goal C
```

The capability entity remains shared; each GoalCapabilityLink stores goal-specific role and target maturity.

---

# 10. Model Stability / Hysteresis

Without stability controls, an LLM-driven living tree will oscillate.

The architecture therefore requires:

- materiality threshold;
- evidence threshold;
- minimum confidence threshold where applicable;
- cooldown/hysteresis for repeated equivalent mutations;
- version conflict detection;
- duplicate mutation suppression;
- rollback/rejection behavior.

The system must prefer no structural change over a low-value structural change.

---

# 11. Concurrency

A proposal generated against model version N must not blindly apply to N+1.

Required behavior:

```text
Proposal(version=N)
        ↓
Current(version=N+1)
        ↓
Reject / Rebase / Re-evaluate
```

Automatic rebasing is permitted only for mutation types explicitly proven safe.

High-impact mutations must be regenerated against the current model.

---

# 12. Idempotency

Evidence ingestion, review submission, mutation application, and event processing must support idempotency where duplicate delivery is possible.

Every material command should have a command/request identity suitable for deduplication.

---

# 13. Transaction Rules

A material model mutation should be atomic with:

1. authorization validation;
2. policy validation;
3. version check;
4. mutation application;
5. new model version creation;
6. audit record;
7. domain event publication/outbox record.

No partial mutation should leave the canonical model structurally inconsistent.

---

# 14. Event / Outbox Boundary

Full Event Sourcing is not required for V1.

However, important domain events should be durably recorded and published through an outbox-compatible pattern so downstream Memory, analytics, notifications, and future agents do not depend on synchronous cross-module database writes.

---

# 15. Read Model Rule

The frontend should not reconstruct domain intelligence from raw tables.

Backend read models should expose:

- goal overview;
- tree projection;
- state;
- focus;
- evidence;
- insights;
- history;
- review;
- mutation status.

Read models are disposable projections; canonical state is not.

---

# 16. Scoring Architecture

Scoring formulas such as leverage, health, risk, momentum, or intervention ranking are **replaceable policies**, not domain invariants.

Bad:

```text
Domain Entity → hard-coded formula
```

Preferred:

```text
Domain State
   ↓
Policy / Evaluator
   ↓
Score / Classification
```

This permits calibration and experimentation without schema redesign.

---

# 17. Progress Architecture

Canonical progress must remain vectorized.

Minimum:

```text
activity
capability
outcome
model-confidence
```

Additional dimensions may be derived:

```text
momentum
health
evidence-quality
resilience
```

A single composite score may exist only as a presentation aid and must never replace the underlying vector.

---

# 18. Goal Health Architecture

Health should be computed from independently observable dimensions where possible.

It must not become a hidden psychological judgment.

Examples:

- capacity pressure;
- sustainability;
- risk load;
- dependency integrity;
- evidence quality;
- alignment.

Personal health/medical conclusions are outside GGI unless provided through an authorized health domain.

---

# 19. Outcome Architecture

Outcome is not Action completion.

The system should model:

```text
Action
 ↓
Observation
 ↓
Evidence
 ↓
Outcome State
```

A task marked done is merely an execution fact.

---

# 20. Completion Gate

Completion requires:

1. success criteria evaluated;
2. outcome evidence sufficient;
3. unresolved critical conditions absent or explicitly accepted;
4. final state recorded;
5. outcome harvest created;
6. lineage/learning recorded.

Partial completion is a valid result.

---

# 21. Question Architecture

The Question Engine must distinguish:

- required user decision;
- missing factual input;
- useful but non-essential information;
- information that can be inferred safely.

The system must not ask questions merely because a field is empty.

---

# 22. Information-Gain Principle

For consequential uncertainty:

```text
Expected Decision Value
× Information Gain
× Urgency
────────────────────────
User Burden + Cost + Risk
```

is a conceptual ranking model.

The exact formula remains replaceable.

---

# 23. Evidence Provenance

Every important claim should be traceable to evidence references.

For externally sourced evidence, provenance must include the source reference and retrieval metadata where permitted.

The system must distinguish:

- user statement;
- system observation;
- measured value;
- external evidence;
- model inference;
- AI recommendation.

---

# 24. AI Safety Boundary

AI receives a least-context authorized package.

AI returns a typed proposal.

Deterministic application code decides whether the proposal is valid.

```text
AI
 ↓
Proposal
 ↓
Schema
 ↓
Evidence
 ↓
Authorization
 ↓
Policy
 ↓
Mutation
```

AI never writes canonical state directly.

---

# 25. Human Agency

The system must never silently:

- redefine the user's core values;
- permanently label the user;
- change high-impact life goals;
- erase failed history;
- fabricate commitment;
- treat a recommendation as a decision.

The system may identify conflict, risk, or alternative paths and ask for explicit decisions.

---

# 26. Privacy

GGI should request only context necessary for a particular reasoning task.

Example:

A career goal should not receive unrelated private relationship history merely because it exists in Memory.

This supports DECIVEXA's zero-trust privacy principle.

---

# 27. Failure Modes and Required Behavior

| Failure | Required behavior |
|---|---|
| AI unavailable | canonical goal remains usable |
| stale proposal | reject/re-evaluate |
| missing evidence | label unknown/inference |
| conflicting evidence | preserve conflict; do not force false resolution |
| model oscillation | stability guard |
| capacity collapse | adapt load/timeline/strategy |
| repeated failure | diagnose before escalating |
| goal value collapse | propose disengagement/reframe, do not silently abandon |
| database failure during mutation | atomic rollback |
| duplicate command | idempotent handling |
| unauthorized mutation | reject and audit |
| provider failure | route/fallback according to central AI architecture |

---

# 28. Security Boundary

Minimum requirements:

- owner scoping;
- authorization checks on every command;
- audit for material mutations;
- least-context AI calls;
- encrypted sensitive storage according to platform security policy;
- export/delete compatibility;
- no cross-user graph leakage;
- no capability leakage across users through shared catalog data.

---

# 29. Performance Boundary

The user-facing tree must not require a full AI generation on every render.

Preferred pattern:

```text
Canonical state
 ↓
Cached/read projection
 ↓
Fast UI render

AI recomputation
 ↓
Async update
 ↓
Projection refresh
```

AI latency must not block ordinary navigation unless the user explicitly requests fresh intelligence.

---

# 30. Offline / Degraded Mode

At minimum, users should be able to inspect:

- goal;
- current tree projection;
- current state;
- history;
- saved evidence;
- previous recommendations.

Intelligence generation may degrade without destroying access to canonical information.

---

# 31. Technical Shape for V1

Recommended:

```text
Next.js
   ↓
Application API
   ↓
NestJS Modular Monolith
   ├── Goal OS integration
   ├── GGI domain
   ├── Evidence integration
   ├── Human Understanding integration
   ├── Memory integration boundary
   ├── AI capability boundary
   └── Daily OS integration boundary
   ↓
PostgreSQL
```

No microservice split is required merely because the domain is conceptually rich.

No graph database is required for V1.

---

# 32. V1 Domain Module Boundary

Proposed internal modules:

```text
ggi-domain/
  goal/
  model/
  graph/
  capability/
  evidence/
  progress/
  health/
  risk/
  navigation/
  mutation/
  review/
  lineage/

application/
  create-goal/
  activate-goal/
  record-evidence/
  review-goal/
  generate-insights/
  propose-mutation/
  approve-mutation/
  apply-mutation/
  complete-goal/
```

Names may be adapted to existing repository conventions after codebase inspection.

---

# 33. Required Tests Before Implementation Acceptance

### Domain

- lifecycle transitions;
- phase transitions;
- model version immutability;
- graph validity;
- lineage;
- mutation policy;
- completion criteria.

### Intelligence

- goal-specific model generation;
- evidence attribution;
- unknown detection;
- bottleneck detection;
- false progress;
- stagnation;
- smallest sufficient adaptation.

### Safety

- stale proposal;
- unauthorized mutation;
- hallucinated evidence;
- cross-user leakage;
- duplicate mutation;
- provider outage.

### UX

- tree comprehension;
- focus clarity;
- user effort;
- explanation usefulness.

---

# 34. Non-Goals

GGI V1 is not:

- a task manager;
- a universal project-management template library;
- a graph visualization product;
- an autonomous life decision-maker;
- a replacement for Daily OS;
- a replacement for Memory;
- a replacement for Human Understanding;
- a provider-specific AI feature.

---

# 35. Final Architectural Invariants

1. Goal Tree is projection, not truth.
2. Goal Growth Model is versioned.
3. Same Goal ≠ Same Path.
4. Unknown is valid.
5. Activity ≠ Outcome.
6. Progress ≠ Health.
7. Evidence ≠ Claim.
8. Claim ≠ Decision.
9. Recommendation ≠ Decision.
10. AI proposal ≠ domain truth.
11. Material mutation is auditable.
12. Historical models are immutable.
13. Failed paths remain learnable.
14. Tree growth is not node-count growth.
15. Tree simplification is valid growth.
16. Shared capabilities are reusable, not duplicated.
17. Smallest sufficient adaptation is preferred.
18. Human capacity constrains navigation.
19. User agency is preserved.
20. Goal completion is evidence/outcome based.
21. Cross-module ownership is explicit.
22. Provider failure cannot destroy canonical goal data.
23. Scoring formulas remain replaceable.
24. Least-context reasoning is mandatory.
25. Architecture changes require Founder approval.
