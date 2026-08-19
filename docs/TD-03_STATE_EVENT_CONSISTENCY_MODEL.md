# TD-03 — State, Event & Consistency Model

**Status:** DESIGN DEFINED / GATE NOT YET PASSED  
**Priority:** Foundational Technical Design  
**Authority:** Founder-controlled; this document does not authorize implementation.  
**Depends on:** TD-02 — Domain Boundaries & Module Ownership  
**Next dependency:** TD-04 — Data / Runtime Contracts

> **Purpose:** Define what constitutes authoritative state, what constitutes an event, how state changes are produced, how derived intelligence is separated from source truth, and how DECIVEXA preserves consistency across domains, intelligence, offline operation, AI recovery, and asynchronous processing.

## 1. Core Principle

DECIVEXA must distinguish clearly between:

1. **Authoritative State** — the current accepted truth owned by a domain.
2. **Events** — immutable records that something happened or a meaningful state transition occurred.
3. **Observations / Evidence** — facts or signals received from the user, device, integrations, or system execution.
4. **Derived Intelligence** — interpretations, hypotheses, predictions, recommendations, scores, and models generated from evidence.
5. **Projections / Read Models** — governed views assembled for another domain or the UX without transferring ownership.
6. **Commands / Intent** — an explicit request to change authoritative state.

These categories must never be silently collapsed into one generic data structure.

```text
Evidence / User Intent
        ↓
     Command
        ↓
Authoritative Domain State
        ↓
   Domain Event
        ↓
Projection / Intelligence Processing
        ↓
Derived Intelligence / Guidance
        ↓
User Decision or Governed Action
        ↓
New Evidence / Command
        ↺
```

## 2. State Is Not History

Current state answers **“What is true now?”** while history answers **“What happened, when, and in what order?”** DECIVEXA must preserve both concepts.

A current Goal may be `ACTIVE`, while its history contains creation, validation, activation, pause, adjustment, and completion events. Later intelligence may reinterpret historical evidence, but must not silently rewrite the historical record.

### Non-Negotiable: Never Rewrite History

Corrections should be represented through governed correction/supersession relationships or events. Interpretation can change; historical evidence must remain auditable.

## 3. Authoritative State Ownership

TD-02 establishes one authoritative owner per domain truth. TD-03 makes that ownership operational at the state-transition level.

| State / Truth | Authoritative Owner |
|---|---|
| Living Human Model | Personal Intelligence Core |
| Goals | Goal OS |
| Daily execution | Daily OS |
| Discipline commitments/adherence | Discipline OS |
| Review records/outcomes | Review OS |
| Health records | Health OS |
| Financial records | Money OS |
| Learning state/mastery | Learning OS |
| Business/work state | Business/Work OS |
| Relationship/family records | Relationship/Family OS |
| Memory objects | Memory System |
| Imported evidence | Evidence & Integration |
| Decision records | Decision Intelligence |
| AI reasoning/output | DECIVEXA AI |
| Agent permissions/actions | Agent Governance |

No intelligence layer may become an accidental second owner of domain truth.

## 4. Command → Transition → Event

Every authoritative state change follows an explicit conceptual transition:

```text
Command
  ↓
Authorization / Policy Check
  ↓
Validation
  ↓
Domain Transition
  ↓
State Change
  ↓
Immutable Event
  ↓
Projection / Async Consumers
```

Examples include `ActivateGoal → GoalActivated`, `CompleteDailyAction → DailyActionCompleted`, and `UpdatePersonalRule → PersonalRuleUpdated`.

AI may propose a command, but proposal is not execution. Consequential state changes remain subject to domain ownership, authorization, policy, and human-agency requirements.

## 5. Events Are Facts, Not Opinions

An event describes something that occurred, not an unsupported interpretation.

Good: `DailyActionCompleted`  
Bad: `UserIsUndisciplined`

Good: `SleepObservationRecorded`  
Bad: `UserWillFailTomorrow`

Interpretations, predictions, and hypotheses belong to derived intelligence with evidence and confidence—not authoritative event history.

## 6. Evidence → Observation → Pattern → Hypothesis

The Living Human Model evolves through a governed evidence chain:

```text
Raw Evidence
    ↓
Observation
    ↓
Repeated / Contextual Evidence
    ↓
Pattern Candidate
    ↓
Hypothesis
    ↓
Confidence + Provenance
    ↓
Review / Validation where required
    ↓
Human Model Update
```

A single event must never silently become a permanent user characteristic. This is mandatory for FIS-036, FIS-057, Personal Intelligence Core, Decision Pattern Intelligence, and Failure Pattern Intelligence.

## 7. Raw Data ≠ Derived Intelligence

Source evidence and system interpretation must remain explicitly distinguishable.

```text
Raw:
User completed 3 of 7 planned actions.

Derived:
Execution adherence is lower than baseline.

Hypothesis:
Current plan load may exceed sustainable capacity.

Recommendation:
Reduce tomorrow's non-critical actions.
```

Derived intelligence can be replaced by a newer interpretation without changing the underlying evidence.

## 8. State Categories

DECIVEXA should distinguish at least:

- **Authoritative Domain State** — accepted operational truth of a domain.
- **Runtime State** — queues, locks, scheduling, processing, and synchronization runtime information.
- **Projection State** — derived read models optimized for another consumer or UI.
- **Intelligence State** — models, scores, hypotheses, confidence, recommendations, and predictions.
- **Sync State** — pending, acknowledged, conflicted, retried, or reconciled synchronization state.
- **Continuity State** — Last Known Good State and minimum Safe Mode/offline information.

These state classes have different consistency, retention, and recovery requirements.

## 9. Consistency Model

DECIVEXA must not force one global consistency mechanism across the entire system.

### Strong consistency where correctness is critical

Authorization, ownership changes, financial mutations, security/privacy controls, consent, critical user controls, sensitive lifecycle transitions, and agent permissions require strong correctness guarantees.

### Transactional consistency within a domain

A domain's authoritative state transition and corresponding domain event must be committed atomically or through an equivalent durable mechanism that prevents silent state/event divergence.

### Eventual consistency where appropriate

Analytics, dashboards, recommendation projections, non-critical intelligence refreshes, search indexes, background summaries, and cross-domain read models may be eventually consistent. Freshness must be explicit where it affects guidance.

## 10. Cross-Domain Communication

Cross-domain state must not be changed through direct database writes.

```text
Domain A
  ↓
Domain A Event / Explicit Contract
  ↓
Permission / Policy Boundary
  ↓
Domain B Projection / Consumer
```

Example: Health OS may expose an authorized current-capacity signal; Daily Intelligence may consume it. Daily OS does not write into Health OS.

This preserves TD-02 ownership boundaries.

## 11. Projections Must Be Explicit

A projection is not a new source of truth.

```text
Health OS authoritative data
        ↓
Permissioned projection
        ↓
Current Capacity Signal
        ↓
Daily Intelligence
```

Projections should identify source, timestamp, freshness, confidence where applicable, sensitivity, permission scope, and intended purpose. A stale projection must not corrupt the source domain.

## 12. Idempotency

Distributed and asynchronous operations must be retry-safe so retries do not create duplicate semantic effects.

Appropriate mechanisms may include command/request identifiers, event identifiers, aggregate/entity versions, and consumer checkpoints or equivalent deduplication. The exact technical mechanism belongs to TD-04.

```text
CompleteAction(command-123)
        ↓
Action completed

Retry command-123
        ↓
No second semantic effect
```

## 13. Ordering and Causality

DECIVEXA must preserve causality wherever ordering changes meaning.

```text
GoalCreated
   ↓
GoalValidated
   ↓
GoalActivated
   ↓
GoalPaused
   ↓
GoalResumed
```

Delayed or duplicated events must not cause older state to overwrite newer authoritative state. Global ordering should not be imposed where scoped ordering is sufficient.

## 14. Version Safety / Concurrency

Authoritative mutable state should have a version or equivalent concurrency mechanism.

```text
State v10
   ↓
Command expects v10
   ↓
Transition
   ↓
State v11
```

A stale command must not silently overwrite a newer valid state. Exact optimistic-locking or transactional implementation belongs to TD-04.

## 15. Offline and Continuity Consistency

FIS-060 requires essential operation without continuous AI/cloud availability. Offline actions are legitimate pending facts, not temporary UI illusions.

```text
User Action
   ↓
Local Durable Event / Pending Mutation
   ↓
Immediate Local State Update
   ↓
Sync Queue
   ↓
Server Reconciliation
   ↓
Authoritative Acceptance / Conflict Handling
```

The system must never silently discard an action because connectivity was unavailable. Conflicts must be preserved and resolved by explicit policy.

## 16. Conflict Resolution

Conflict resolution must be domain-specific and policy-driven. Possible strategies include last-write-wins only where semantically safe, explicit user resolution, merging independent events, append-only history with recomputed projections, or deterministic domain-specific reconciliation.

**Generic last-write-wins must never be used for sensitive or semantically consequential state merely for technical convenience.** Particular caution applies to Money, Health, Consent, Personal Constitution, Goal Contracts, Relationship records, Memory corrections, and Security/Privacy controls.

## 17. AI and Intelligence State

DECIVEXA AI produces derived intelligence, proposals, explanations, and reasoning artifacts. Relevant metadata should include execution source/model/provider, timestamp, context scope, evidence references, confidence where meaningful, generated-vs-observed status, freshness/expiration, and policy/permission context.

AI output does not become authoritative state merely because AI generated it.

```text
AI Proposal
    ↓
Validation / Policy
    ↓
User or Authorized System Decision
    ↓
Domain Command
    ↓
Authoritative State
```

Governed low-risk automation may execute without interactive approval where policy explicitly permits it, while ownership and auditability remain intact.

## 18. AI Failure and Stale Intelligence

FIS-060 requires **AI failure ≠ data failure**, no false intelligence during outage, and no history rewriting during recovery.

Every intelligence artifact affecting guidance should therefore have freshness semantics.

During outage:

```text
Last Known Good Intelligence
        ↓
Clearly marked as last valid analysis
        ↓
Core deterministic operation continues
```

After recovery:

```text
Outage / offline events
        ↓
Analyze accumulated evidence
        ↓
Generate new intelligence
        ↓
Version new model/recommendations
```

Recovery may reinterpret history but cannot rewrite it.

## 19. Living Human Model Versioning

The Personal Intelligence Core treats the Human Model as living and revisable.

```text
Human Model v1
     ↓
New Evidence
     ↓
Model Update Proposal
     ↓
Validation / Confidence Update
     ↓
Human Model v2
```

An earlier hypothesis must remain traceable. Example: an initial capacity hypothesis may later be revised when evidence shows capacity depends on sleep or environmental context.

This directly protects:

> **Observed behavior ≠ permanent personality trait.**

## 20. Path and Personalization Consistency

FIS-036 requires continuous individualization. A path derives from the current Human Model, goal, environment, resources, constraints, and evidence.

```text
Goal
+
Current Human Model
+
Current Context
+
Constraints
+
Evidence
        ↓
Path Version N
```

When material inputs change:

```text
New Evidence
   ↓
Human Model / State Update
   ↓
Path Reassessment
   ↓
Path Version N+1 if warranted
```

A path adjustment must not retroactively rewrite what the user actually did under the previous path.

## 21. Review and Model Update Boundary

Review OS is a validation boundary for accumulated evidence:

```text
Execution Evidence
       ↓
Review OS
       ↓
Reflection / Lessons / Change Proposal
       ↓
Governed Model or Path Update
```

Review outcomes do not automatically become authoritative Human Model truth. The owning system must accept the appropriate transition.

## 22. Discipline and Behavioral Evidence

Discipline OS records execution-support state and adherence evidence. It must not convert isolated failures into permanent character claims.

```text
Action Missed
   ↓
Execution Evidence
   ↓
Adherence Observation
   ↓
Repeated Pattern
   ↓
Potential Hypothesis
   ↓
Governed Intelligence Update
```

This preserves the FIS-057 principle that DECIVEXA identifies obstacles and risks without blaming or permanently labeling the user.

## 23. Memory Consistency

Memory is a governed system, not an unrestricted event store. Memory objects should preserve conceptual metadata for source, creation date, confidence, user-confirmed/inferred status, last verification, sensitivity, lifecycle/review state, and provenance.

Memory corrections should create explicit correction/revision relationships rather than silently mutating historical provenance.

## 24. Event Taxonomy

The initial canonical taxonomy distinguishes:

### Domain Events
Meaningful changes to authoritative domain state, such as `GoalCreated`, `GoalActivated`, `GoalPaused`, `DailyActionCompleted`, `RoutineUpdated`, `DisciplineCommitmentRecorded`, `ReviewCompleted`, `HealthObservationRecorded`, `FinancialTransactionRecorded`, and `LearningMilestoneRecorded`.

### Evidence Events
Signals or observations from user, device, or external sources.

### Intelligence Events
Creation/revision of derived intelligence, such as `PatternHypothesisCreated`, `RiskAssessmentUpdated`, `PathRecommendationGenerated`, and `HumanModelRevisionProposed`.

### Integration Events
Synchronization/import/export lifecycle events.

### Security / Consent Events
Permission, consent, access, lock, or security-state transitions.

### Continuity Events
Offline, queue, sync, reconciliation, and recovery events.

Exact schemas and naming conventions are deferred to TD-04.

## 25. Event Immutability and Correction

Accepted historical facts should be append-only. If a record was incorrect, prefer a governed correction/supersession event rather than editing history in place.

```text
Original Event
     ↓
Correction Event
     ↓
Current Interpretation / Projection
```

This preserves auditability while allowing current state to be corrected.

## 26. Auditability Without Sensitive Log Leakage

Important state transitions and access must be auditable without putting raw sensitive personal content into ordinary logs.

Audit records should answer: what occurred, which actor/service initiated it, which domain/aggregate was affected, when, authorization/policy context, result, and correlation/causation identifiers.

Sensitive payloads remain under FIS-058 security/privacy controls.

## 27. Failure Semantics

Partial failure must have explicit semantics:

- **Domain transaction fails:** authoritative state change is not committed.
- **State commits but projection is delayed:** authoritative state remains valid; projection is stale.
- **Intelligence generation fails:** no new intelligence is published; last valid intelligence may remain if clearly marked.
- **AI provider fails:** FIS-060 continuity behavior applies.
- **Integration fails:** imported evidence remains unchanged; sync state records failure for retry.
- **Client loses network after local action:** local durable action remains pending for reconciliation.

## 28. Observability Requirements

The architecture must allow tracing a meaningful operation across:

```text
Command
 ↓
Domain Transition
 ↓
Event
 ↓
Projection
 ↓
Intelligence Job
 ↓
Recommendation / Guidance
```

Correlation and causation identifiers should enable technical diagnosis without copying sensitive content into logs. This is especially important for asynchronous AI, agents, background jobs, and cross-domain intelligence.

## 29. Deterministic Core vs Intelligence Layer

TD-03 reinforces the FIS-060 split:

```text
DETERMINISTIC CORE
- authoritative state
- validated transitions
- domain rules
- user controls
- execution
- continuity

INTELLIGENCE LAYER
- interpretation
- prediction
- personalization
- path generation
- recommendations
- coaching
- hypothesis generation
```

The Intelligence Layer may influence the Core through governed commands, but may not bypass Core state-transition rules.

## 30. Non-Negotiable Invariants

1. One authoritative owner per domain truth.
2. State changes occur through governed transitions.
3. Events represent facts, not unsupported interpretations.
4. Historical events are not silently rewritten.
5. Raw evidence remains distinguishable from derived intelligence.
6. AI output is not authoritative merely because AI produced it.
7. Cross-domain writes are prohibited outside explicit governed contracts.
8. Important operations are idempotent or otherwise retry-safe.
9. Ordering guarantees are scoped to where semantic correctness requires them.
10. Sensitive state cannot be silently overwritten by generic conflict resolution.
11. Offline actions are durable and reconciled explicitly.
12. AI outage cannot cause data loss.
13. AI outage cannot be represented as fresh intelligence.
14. Human Model revisions preserve evidence and revision history.
15. Observed behavior cannot automatically become a permanent personality trait.
16. Path revisions preserve the history of previous execution.
17. Projections cannot become hidden sources of truth.
18. Auditability must not require leaking sensitive data into ordinary logs.
19. Security/privacy policy remains authoritative over every cross-domain and AI operation.
20. Material changes to this model require explicit Founder approval.

## 31. Readiness Checklist for TD-04

Before entering Data / Runtime Contracts, DECIVEXA must be able to specify:

- canonical aggregate/entity boundaries for each authoritative domain;
- transactional state transitions;
- events emitted for each transition;
- event envelope and versioning policy;
- idempotency strategy for each command/event class;
- ordering guarantees;
- concurrency/version strategy;
- required projections and their freshness guarantees;
- offline mutation representation;
- domain-specific conflict resolution;
- partial-failure and recovery policy;
- AI artifact versioning and expiration;
- Human Model revision representation;
- memory correction representation;
- separation of audit records from sensitive payloads;
- synchronous vs asynchronous enforcement of invariants.

If these cannot be specified, implementation must not begin.

## 32. Gate Decision

**TD-03 DESIGN DEFINED — NOT YET PASSED**

This document establishes the proposed State, Event, and Consistency architecture for DECIVEXA. It does **not** authorize database schema creation, event-bus implementation, service implementation, AI implementation, or production code.

```text
TD-01 — Architecture / System Orientation
        ↓
TD-02 — Domain Boundaries & Module Ownership
        ↓
TD-03 — State, Event & Consistency Model
        ↓
TD-04 — Data / Runtime Contracts
        ↓
Implementation Gates
```

**Founder approval remains required for material architectural changes.**
