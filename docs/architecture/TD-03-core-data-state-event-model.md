# TD-03 — Core Data, State & Event Model

**Status:** FOUNDER-APPROVED DESIGN / IMPLEMENTATION NOT AUTHORIZED
**Gate:** Technical Design Gate
**Priority:** 🔴 Core Architecture / Non-Negotiable
**Product:** DECIVEXA
**Owner:** Founder / Owner — Parsa Kiamanesh

## 1. Purpose

TD-03 defines the canonical conceptual contract for how DECIVEXA represents authoritative state, immutable history, events, derived state, evidence, memory, confidence, temporal validity, synchronization, and cross-domain changes.

It exists to prevent implementation from inventing persistence semantics while coding.

The central rule is:

> **History is evidence. State is the current authoritative interpretation of that history. Intelligence may interpret history and state, but it must not silently rewrite authoritative history.**

This document is intentionally architecture-level. It does not select a final database, ORM, event-store product, message broker, serialization format, or deployment topology.

## 2. Architectural Context

TD-03 must remain consistent with:

- Architecture Constitution
- Canonical Architecture & Product Baseline
- Canonical System Map
- TD-01 — Architecture Constitution & Document Authority
- TD-02 — Domain Boundaries & Ownership
- TD-04 — Human OS & Personal Intelligence Core
- TD-05 — Goal → Path → Multi-Option Decision Architecture
- FIS-036 — Individualized Path Intelligence
- FIS-055 — Personal Operating Constitution
- FIS-057 — Personal Obstacle & Self-Sabotage Intelligence
- FIS-058 — Personal Data Sovereignty & Zero-Trust Privacy
- FIS-059 — Fluid Experience & Performance Architecture
- FIS-060 — Autonomous Continuity & AI-Independent Operation

The Canonical System Map establishes a deterministic Core alongside an Intelligence Layer. TD-03 provides the state/history contract that allows both layers to coexist without making AI the owner of the system. fileciteturn67file0

## 3. Core Invariants

1. Every authoritative state has one clear owner.
2. Historical domain events are append-oriented and auditable.
3. Events are facts about something that happened; commands are requests to cause something to happen; state is the current authoritative representation.
4. Derived intelligence is never silently promoted to authoritative fact.
5. User-confirmed facts remain distinguishable from system inference.
6. AI interpretation cannot rewrite historical events.
7. Reprocessing intelligence must not fabricate or mutate historical user activity.
8. Event processing must be idempotent.
9. Duplicate delivery must not create duplicate logical outcomes.
10. Current state must be reconstructible from authoritative history plus explicitly versioned deterministic rules where reconstruction is required by the chosen implementation.
11. Offline events are first-class events and retain their original event time and provenance.
12. Synchronization conflicts must be resolved by explicit policy, never by accidental last-write-wins semantics.
13. Temporal validity is distinct from record creation time.
14. Evidence provenance must survive transformation into derived intelligence.
15. Sensitive data classification and access policy travel with relevant data objects.
16. Domain boundaries remain enforced even when multiple domains participate in one user journey.
17. No module receives unrestricted access to the user's entire state.
18. Core state remains usable when AI is unavailable.
19. Deletion, correction, consent withdrawal, and privacy operations must have explicit lifecycle semantics.
20. User agency remains above inferred system preference or recommendation.

## 4. The Fundamental Distinction: Command, Event, State, Evidence, Intelligence

DECIVEXA must not collapse these concepts into one generic database record.

```text
COMMAND
  "Complete today's action"
        ↓
VALIDATION / AUTHORIZATION
        ↓
EVENT
  ActionCompleted
        ↓
STATE TRANSITION
  action.status = completed
        ↓
EVIDENCE
  observed execution evidence
        ↓
INTELLIGENCE
  possible pattern / insight / recommendation
```

### Command
A request to change the system.

Examples:
- CreateGoal
- ConfirmPath
- CompleteAction
- RecordExpense
- UpdateRoutine
- CorrectPersonalModelAttribute

A command is not proof that the requested change actually happened.

### Event
A durable fact that the system accepted as having occurred.

Examples:
- GoalCreated
- PathConfirmed
- ActionCompleted
- ExpenseRecorded
- RoutineUpdated
- PersonalModelFactConfirmed

Events should carry enough provenance to understand what happened, when, by whom/what actor, under which authorization context, and from which source.

### State
The current authoritative representation owned by a domain.

Examples:
- active goal
- active path
- today's actions
- routine state
- budget state
- learning progress
- relationship state

State is optimized for current operation. It is not a substitute for historical evidence.

### Evidence
Information used to establish or challenge a fact, pattern, inference, or decision.

Evidence may originate from:
- explicit user input
- user confirmation/correction
- observed application behavior
- authorized integrations
- system events
- external sources
- validated measurements

### Derived Intelligence
An interpretation, pattern, prediction, recommendation, or model attribute derived from evidence.

Examples:
- "Morning appears to be a high-focus period."
- "This path may exceed sustainable weekly capacity."
- "The current obstacle is likely schedule friction rather than lack of motivation."

Derived intelligence is not automatically authoritative.

## 5. Canonical Event Envelope

Every persisted event should conceptually support a common envelope.

```text
EventEnvelope
├── event_id
├── event_type
├── aggregate_type
├── aggregate_id
├── domain
├── actor
├── source
├── occurred_at
├── recorded_at
├── correlation_id
├── causation_id
├── schema_version
├── idempotency_key
├── sensitivity_class
├── authorization_context
├── payload
└── provenance
```

This is a conceptual contract, not a final persistence schema.

### Important time fields

`occurred_at` = when the real-world action/event occurred.

`recorded_at` = when DECIVEXA accepted/recorded it.

These must not be silently treated as the same value, especially during offline operation or delayed synchronization.

## 6. Aggregate & Ownership Model

An aggregate is a bounded unit of authoritative state with one owning domain.

Examples:

```text
Goal OS
 └── Goal

Path Intelligence / Navigation
 └── Active Path

Daily OS
 └── Daily Plan / Daily Action State

Discipline OS
 └── Discipline / Routine State

Money OS
 └── Budget / Financial State

Learning OS
 └── Learning Progress

Relationship OS
 └── Relationship State

Human OS / PIC
 └── Living Human Model
```

Ownership does not mean isolation. Domains may consume authorized projections, events, or contracts from other domains.

A domain must not silently mutate another domain's authoritative aggregate.

## 7. Source of Truth Rules

For every important field, architecture must be able to answer:

> **Who owns this value?**

Examples:

| Information | Authoritative owner | Consumers |
|---|---|---|
| Goal status | Goal OS | Path, Daily, Progress, AI |
| Active path status | Path/Navigation layer | Daily, Learning, Progress, AI |
| Daily action completion | Daily OS | Progress, PIC, Review |
| User-authored principle | Personal Constitution | Decision/Runtime layers |
| Financial transaction | Money OS | Goal Ecology, Planning, AI |
| Health measurement | Health OS / authorized integration boundary | authorized intelligence |
| Human-model inference | Personal Intelligence Core | authorized intelligence |
| AI recommendation | Intelligence layer | user-facing consumers; never authoritative by default |

If an attribute has no clear owner, it is an architecture defect.

## 8. State vs Event vs Projection

DECIVEXA should conceptually distinguish three representations:

```text
Authoritative Event History
        ↓
Deterministic State
        ↓
Read Projections / Views
```

### Authoritative state
The domain-owned current truth used for operational behavior.

### Projection
A derived read model optimized for a specific experience.

Examples:
- Today dashboard
- Goal summary
- Progress timeline
- Morning guidance view

A projection may be rebuilt. It must not become the only copy of authoritative state.

### Intelligence projection
A derived representation optimized for reasoning, retrieval, recommendation, or model updates.

It must retain provenance and version context and must be invalidatable/recomputable where appropriate.

## 9. Deterministic Core vs Intelligence State

The architecture must separate:

### Deterministic / Authoritative
- goals
- confirmed paths
- daily actions
- routines
- progress records
- user controls
- explicit user-authored rules
- accepted domain transactions
- immutable historical events

### Intelligence / Derived
- hypotheses
- inferred patterns
- predictions
- recommendations
- similarity matches
- risk scores
- confidence estimates
- generated summaries
- candidate path alternatives

```text
Authoritative Core
       │
       ├── provides facts/state
       ↓
Intelligence Layer
       │
       ├── interprets
       ├── predicts
       └── recommends
       ↓
User / Authorized Runtime
       │
       └── explicit command / confirmation where required
       ↓
Authoritative Core
```

This enforces FIS-060: AI failure must not become data failure.

## 10. Evidence & Provenance Model

Every meaningful intelligence item should be traceable to its supporting evidence where technically feasible.

Conceptually:

```text
IntelligenceItem
├── intelligence_id
├── type
├── value
├── source_evidence[]
├── source_events[]
├── source_documents[]
├── confidence
├── inference_status
├── created_at
├── observed_period
├── last_verified_at
├── sensitivity_class
├── user_confirmed
├── supersedes / superseded_by
└── validity
```

At minimum, the architecture must preserve the distinction between:

- user explicitly said it;
- system observed it;
- system inferred it;
- system predicted it;
- user confirmed/corrected it.

This directly supports the evidence model already defined for Human OS / Personal Intelligence Core. fileciteturn64file0

## 11. Confidence Model

Confidence is metadata about a claim, not proof that the claim is true.

Conceptually:

```text
Confidence
├── level: Low | Medium | High
├── evidence_count
├── evidence_quality
├── recency
├── consistency
├── contradiction_level
├── source_reliability
└── user_confirmation
```

The final algorithm is intentionally deferred.

A single observation must not produce a high-confidence permanent human trait.

## 12. Temporal Validity

DECIVEXA must model time explicitly because human state changes.

For meaningful facts and intelligence, distinguish:

- `created_at`
- `effective_from`
- `effective_until` where known
- `observed_at`
- `last_verified_at`
- `superseded_at`

Example:

```text
User capacity = 2h/day
valid: Jan 1 → Mar 15

New evidence

User capacity = 45–60m/day
valid: Mar 16 → current
```

The historical value is not erased. The current model changes.

This supports the Living Personal Model principle in TD-04. fileciteturn64file0

## 13. Corrections and Invalidations

DECIVEXA needs explicit semantics for being wrong.

A correction should normally create new authoritative history rather than silently editing the past.

Conceptually:

```text
Original Claim
   ↓
User Correction / New Evidence
   ↓
Correction Event
   ↓
Current State Updated
   ↓
Previous Claim Retained as Historical / Superseded
```

For derived intelligence:

```text
Inference v1
   ↓
Contradicting Evidence
   ↓
Invalidate / Supersede
   ↓
Inference v2
```

This prevents memory poisoning and preserves auditability.

## 14. Idempotency

Every externally retryable state-changing operation must have an idempotency strategy.

Example:

```text
CompleteAction(command, idempotency_key=K)
        ↓
Event A accepted

Retry same command with K
        ↓
No second logical completion
```

Idempotency must cover relevant:
- API retries
- mobile retries
- offline synchronization
- integration callbacks
- background jobs
- agent retries

Exactly-once delivery should not be assumed as an infrastructure property. Logical idempotency must be designed explicitly.

## 15. Ordering & Causality

Events may arrive out of order because of offline operation, distributed processing, retries, or integration delays.

The architecture must distinguish:

- event occurrence time
- processing time
- causation
- correlation
- domain ordering requirements

Not every event requires global ordering.

Ordering must be defined at the smallest scope necessary to preserve domain correctness.

Example:

```text
GoalCreated
   ↓
GoalActivated
   ↓
PathConfirmed
   ↓
ActionCompleted
```

A delayed health measurement should not require the entire system to stop processing unrelated goal events.

## 16. Concurrency & Conflict Resolution

Conflicts are expected in:
- offline mobile actions
- multiple devices
- integrations
- background intelligence
- simultaneous user edits

Conflict policy must be domain-specific.

Possible conceptual policies include:

- deterministic merge
- version check / optimistic concurrency
- explicit user resolution
- event reconciliation
- authoritative-source precedence
- safe rejection with retry

**Forbidden default:** silently applying last-write-wins to every domain.

High-impact conflicts should fail safely and remain visible for resolution.

## 17. Offline & Synchronization Model

FIS-060 requires core continuity when connectivity or AI is unavailable.

Conceptually:

```text
User Action
   ↓
Local Validated State
   ↓
Local Event Queue
   ↓
Secure Sync
   ↓
Server Acceptance
   ↓
Authoritative Event History
   ↓
Projection / Intelligence Update
```

An offline event must retain:
- original event time;
- local origin/device context where appropriate;
- idempotency identity;
- provenance;
- authorization context;
- synchronization status.

AI availability is not a prerequisite for capturing core user activity.

## 18. AI Recovery Contract

During AI outage:

- authoritative events continue where core functionality allows;
- deterministic state continues;
- new AI-dependent intelligence may be deferred;
- no fabricated analysis is presented;
- no historical events are rewritten.

After recovery:

```text
Offline / Unprocessed Evidence
        ↓
Ingest / Validate
        ↓
Update Deterministic State
        ↓
Analyze New Evidence
        ↓
Create New Intelligence Versions
        ↓
Adapt Path / Guidance if justified
```

Recovery is interpretation of newly available evidence, not retroactive rewriting of history.

## 19. Deletion, Privacy & Consent Lifecycle

FIS-058 requires user control over personal data.

TD-03 therefore requires the final implementation to define separate semantics for:

- delete user-authored data;
- delete derived intelligence;
- revoke integration consent;
- stop future collection;
- remove cached/local copies;
- invalidate projections;
- handle backups/retention according to the approved policy;
- preserve only what is legally/architecturally required, with explicit policy.

A privacy operation must not be implemented as a simple UI flag if sensitive data remains accessible elsewhere.

## 20. Event Classification

Events should be classified by their semantic role, for example:

### User Intent
- GoalCreated
- GoalModified
- GoalArchived
- PathSelected
- PreferenceChanged

### Execution
- ActionCreated
- ActionCompleted
- ActionSkipped
- RoutineCompleted
- HabitRecorded

### Domain Transactions
- ExpenseRecorded
- LearningSessionRecorded
- HealthMeasurementRecorded

### Intelligence Lifecycle
- EvidenceObserved
- PatternDetected
- InferenceCreated
- InferenceSuperseded
- RecommendationGenerated
- ModelAttributeConfirmed
- ModelAttributeCorrected

### Governance / Security
- ConsentGranted
- ConsentRevoked
- PermissionChanged
- PrivacyModeChanged

The final event taxonomy remains subject to domain-specific TDs.

## 21. Memory Integration

Memory is not a separate magical source of truth.

A memory item should reference the underlying evidence/provenance needed to understand why it exists.

Conceptually:

```text
Raw / Explicit Evidence
        ↓
Memory Candidate
        ↓
Validation / Classification
        ↓
Memory Item
        ↓
Retrieval
        ↓
Contextual Use
        ↓
Outcome / Feedback
        ↓
Verify / Correct / Supersede
```

Memory metadata should support, as appropriate:

- source
- date
- confidence
- user-confirmed status
- system-inferred status
- last verified
- sensitivity
- review/expiration status
- provenance

This is required to protect against Memory Poisoning.

## 22. Cross-Domain Events

Domains should communicate through explicit contracts rather than direct mutation of another domain's tables/state.

Example:

```text
Health OS
  emits authorized HealthCapacityChanged
        ↓
Personal Intelligence / Context Fusion
        ↓
authorized projection:
"capacity is currently reduced"
        ↓
Daily OS
        ↓
adapts prioritization
```

Daily OS does not need unrestricted access to raw health records.

Similarly:

```text
Money OS
  → authorized BudgetConstraintChanged
  → Goal Ecology / Path Intelligence
  → path feasibility update
```

This supports FIS-058 least privilege and TD-02 ownership boundaries.

## 23. Context Fusion Contract

The future Context Fusion Engine may combine authorized projections across domains, but it must not become a global unrestricted data dump.

Its contract is:

```text
Relevant Goal Context
+
Relevant Current State
+
Relevant Constraints
+
Relevant History
+
Relevant Evidence
        ↓
Minimum Necessary Context
        ↓
Decision / Guidance Intelligence
```

The output should prefer decision-relevant derived context over unnecessary raw-data exposure.

## 24. Personal Development Model Integration

PDM should consume authoritative state plus evidence and authorized intelligence.

It must not become a second source of truth for domain state.

Conceptually:

```text
Authoritative Domain State
        +
Evidence
        +
Living Human Model
        +
Goals / Paths
        +
Constraints / Resources
        ↓
Personal Development Model
        ↓
Growth Navigation / Guidance
```

PDM may maintain derived development assessments, but ownership of underlying domain facts remains with the appropriate domain.

## 25. Review & Auditability

Review OS should consume historical events, current state, evidence, and intelligence versions to explain what happened over time.

It must be possible to answer questions such as:

- What changed?
- When did it change?
- Why did it change?
- Was the change user-driven, system-driven, integration-driven, or AI-inferred?
- Which evidence supported the change?
- Which recommendation existed at that time?
- Was that recommendation later superseded?

Audit logs must not leak sensitive payloads unnecessarily.

## 26. Deterministic Rules

Personal Constitution and core runtime rules must operate on deterministic state/events where possible.

Examples:

```text
ActionCompleted
  → update progress

RoutineCompleted
  → update routine state

Emergency Privacy Mode enabled
  → restrict defined access classes

AI unavailable
  → use Last Known Good intelligence state
```

These rules must not require an LLM merely to remain operational.

## 27. Failure Semantics

The architecture must distinguish:

- command rejected
- event not accepted
- event accepted but projection delayed
- intelligence unavailable
- integration unavailable
- synchronization pending
- partial domain failure
- system-wide degraded mode

A background intelligence failure must not automatically make the deterministic Core unavailable.

This supports FIS-059 and FIS-060.

## 28. Observability Without Data Leakage

Operational telemetry must measure system behavior without indiscriminately logging personal content.

Metrics may include:
- event processing latency
- queue lag
- projection freshness
- sync failures
- conflict rates
- idempotency collisions
- intelligence job status
- AI provider latency
- state consistency checks

Sensitive payloads must not be dumped into logs by default.

## 29. Versioning

The final implementation must version at least:

- event schemas
- commands/contracts where externally consumed
- intelligence schemas
- projections when incompatible
- model interpretation versions where necessary

A schema version change must have an explicit compatibility/migration strategy.

Historical events must remain interpretable under an approved versioning strategy.

## 30. Architectural Acceptance Criteria

TD-03 is considered technically complete at architecture level when the implementation plan can demonstrate that:

1. every major state has an authoritative owner;
2. command, event, state, evidence, projection, and intelligence are distinct concepts;
3. historical events cannot be silently rewritten by AI;
4. derived intelligence has provenance and confidence metadata;
5. temporal validity is represented for changing personal facts;
6. user corrections create traceable state changes;
7. retries are logically idempotent;
8. offline events can synchronize safely;
9. conflicts have explicit domain policies;
10. cross-domain access follows least privilege;
11. projections can be rebuilt without becoming authoritative state;
12. AI outage does not cause core data loss;
13. AI recovery does not fabricate or rewrite history;
14. memory can be corrected/superseded without destroying historical evidence;
15. privacy deletion/consent lifecycle has defined semantics;
16. Review OS can reconstruct meaningful change history;
17. deterministic core behavior does not require an LLM;
18. observability does not become a source of personal-data leakage.

## 31. Explicitly Deferred

TD-03 does **not** decide:

- PostgreSQL vs another database;
- relational vs event-store implementation;
- ORM choice;
- exact table/collection schemas;
- Kafka/NATS/Redis or another messaging product;
- exact event-sourcing implementation;
- graph database adoption;
- vector database adoption;
- exact CRDT/merge mechanism;
- exact encryption implementation;
- cloud topology;
- final mobile storage technology;
- final sync protocol;
- exact confidence algorithm;
- exact retention periods;
- exact API payloads.

These require later technical specifications and Founder approval where material.

## 32. Governance & Gate

This document defines a technical contract, not permission to implement.

No implementation may weaken the invariants in this document without an explicit Founder-approved architectural decision record.

The Technical Design Gate remains **IN PROGRESS** until all required TD contracts are resolved and the Founder grants Architecture Freeze / Implementation authorization. The current gate explicitly identifies TD-03 as the State, Event & Consistency Model blocker. fileciteturn66file0

## 33. Next Technical Design Step

After TD-03, the sequence continues with the already-established architecture work, including the Human OS / Personal Intelligence Core contract and subsequent security, performance, AI truthfulness, memory, gateway, agent, continuity, and governance contracts.

**TD-03 is therefore the persistence/state foundation; it must remain implementation-neutral until the Technical Design Gate is passed.**
