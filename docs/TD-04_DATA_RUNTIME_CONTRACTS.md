# TD-04 — Data & Runtime Contracts

**Status:** DESIGN DEFINED / GATE NOT YET PASSED  
**Priority:** Foundational Technical Design  
**Authority:** Founder-controlled; this document does not authorize implementation.  
**Depends on:** TD-02 — Domain Boundaries & Module Ownership; TD-03 — State, Event & Consistency Model  
**Feeds:** TD-05 — Goal → Path → Multi-Option Decision Architecture and later implementation gates

> **Purpose:** Define the canonical contracts between DECIVEXA's authoritative domains, deterministic runtime, evidence/memory systems, intelligence layers, AI, projections, offline synchronization, and cross-cutting security/performance boundaries before physical schemas or production implementation are authorized.

---

## 1. Scope

TD-04 translates the architectural rules established by TD-02 and TD-03 into implementation-independent contracts.

It defines:

- canonical data ownership boundaries;
- command and transition contracts;
- event envelopes and versioning;
- evidence and provenance contracts;
- projection contracts;
- intelligence-artifact contracts;
- memory contracts;
- runtime and job contracts;
- idempotency and concurrency requirements;
- offline/sync contracts;
- failure and recovery semantics;
- authorization and privacy context;
- observability/correlation requirements;
- lifecycle and retention expectations;
- contract validation and compatibility rules.

It intentionally does **not** choose a database engine, ORM, message broker, cloud provider, AI provider, serialization technology, or deployment topology.

---

# 2. Contract Hierarchy

Every implementation contract must remain subordinate to the Founder-approved architecture.

```text
Founder Decision
      ↓
Architecture Constitution / Non-Negotiables
      ↓
Canonical Product + Philosophy Baseline
      ↓
FIS Registry
      ↓
Phase Architecture Specifications
      ↓
TD-02 Domain Ownership
      ↓
TD-03 State / Event / Consistency
      ↓
TD-04 Data / Runtime Contracts
      ↓
Implementation Details
```

A lower-level contract must not silently weaken a higher-level invariant.

Material changes to these contracts require explicit Founder approval.

---

# 3. Canonical Data Categories

DECIVEXA must preserve explicit semantic separation between the following categories.

| Category | Meaning | Authority |
|---|---|---|
| User Statement | Explicit information supplied by the user | Source evidence until accepted into a domain model |
| Observation | Observed signal from user/device/integration/system | Evidence source |
| Measurement | Quantified observation with measurement metadata | Evidence source |
| Command | Request/intention to change authoritative state | Not state by itself |
| Authoritative State | Accepted current truth owned by a domain | Domain owner |
| Domain Event | Durable fact that a meaningful state transition occurred | Historical record |
| Projection | Governed read representation for another consumer | Never source of truth |
| Intelligence Artifact | Inference, hypothesis, score, prediction, recommendation, model output | Intelligence layer |
| Memory | Governed retained representation of relevant information | Memory System |
| Runtime State | Queue, lock, job, retry, synchronization and processing state | Runtime infrastructure |
| Audit Record | Security/authorization/access trace | Audit subsystem |

No generic `data` object may erase these semantic distinctions.

---

# 4. Canonical Identity Requirements

Every durable entity that participates in cross-boundary behavior should have a stable identity appropriate to its ownership scope.

Conceptually:

```text
Entity ID
Owner / Aggregate
Version
Lifecycle Status
Created At
Updated At
```

Where relevant, records must also carry:

- tenant/user scope;
- sensitivity classification;
- provenance;
- correlation identifiers;
- temporal validity;
- deletion/retention state.

Identifiers must not encode sensitive personal information merely for convenience.

---

# 5. Aggregate / Ownership Contract

An authoritative aggregate is the smallest governed unit whose invariants must be protected together.

Examples include:

- Goal aggregate → Goal OS;
- Daily execution aggregate → Daily OS;
- Discipline commitment aggregate → Discipline OS;
- Review aggregate → Review OS;
- Health record aggregate → Health OS;
- Money transaction/budget aggregate → Money OS;
- Learning state/mastery aggregate → Learning OS;
- Human Model claim/model aggregate → Personal Intelligence Core;
- Memory object aggregate → Memory System;
- Decision record aggregate → Decision Intelligence.

An implementation must not split an aggregate merely for technical convenience if doing so breaks its domain invariants.

Conversely, one giant user aggregate must not be created merely because DECIVEXA represents one human life.

> **One human does not imply one transactional aggregate.**

---

# 6. Command Contract

A command requests an authoritative state transition.

Conceptual envelope:

```text
Command
├── command_id
├── command_type
├── actor
├── subject / aggregate_id
├── expected_version (when applicable)
├── requested_at
├── correlation_id
├── causation_id (optional)
├── purpose / authorization context
├── payload
└── contract_version
```

### Command invariants

1. A command is not evidence that the requested transition succeeded.
2. A command is not an event.
3. Commands must be authorized before state mutation.
4. Commands must be validated by the owning domain.
5. Consequential AI-generated commands remain subject to policy and human-agency requirements.
6. Important commands must be retry-safe.
7. A rejected command must not create a false domain event.

### Example

```text
CompleteDailyAction(command-123)
        ↓
Authorization
        ↓
Daily OS validation
        ↓
State transition
        ↓
DailyActionCompleted(event-456)
```

---

# 7. Authoritative State Contract

A state record represents the accepted current truth of its owning domain.

Minimum conceptual requirements:

```text
aggregate_id
aggregate_type
version
status
state_payload
created_at
updated_at
```

Where appropriate:

- effective time;
- expiration;
- sensitivity;
- policy version;
- source references;
- integrity metadata.

State must be changed only through governed transitions.

A projection or AI output must never mutate authoritative state directly.

---

# 8. Domain Transition Contract

A domain transition must be deterministic with respect to its validated inputs and current state, except where an explicitly governed external dependency is part of the transition.

Conceptual contract:

```text
Current State vN
+
Validated Command
+
Domain Policy
        ↓
Transition
        ↓
New State vN+1
+
Domain Event
```

The transition must preserve domain invariants and reject stale or invalid mutations.

Where state and event persistence require a transaction, they must commit atomically or through an equivalent durable mechanism that prevents silent divergence.

---

# 9. Event Contract

Events are historical facts, not opinions.

Canonical envelope:

```text
Event
├── event_id
├── event_type
├── event_version
├── aggregate_type
├── aggregate_id
├── aggregate_version
├── occurred_at
├── recorded_at
├── producer
├── correlation_id
├── causation_id
├── payload
├── provenance
├── sensitivity
└── contract_version
```

### Event classes

- Domain Events
- Evidence Events
- Intelligence Events
- Integration Events
- Security / Consent Events
- Continuity Events

### Event rules

- accepted historical events are append-only;
- event names describe facts;
- an event must not contain an unsupported personality judgment;
- event versioning must be explicit;
- consumers must tolerate supported schema evolution;
- duplicate delivery must not produce duplicate semantic effects;
- causation/correlation must be preserved where meaningful.

Good:

`DailyActionCompleted`

Bad:

`UserIsUndisciplined`

---

# 10. Evidence Contract

Evidence is the foundation of the Living Human Model and intelligence layers.

Conceptual evidence envelope:

```text
Evidence
├── evidence_id
├── evidence_type
├── source_type
├── source_id / source_reference
├── subject
├── observed_at
├── received_at
├── payload
├── provenance
├── reliability / quality
├── sensitivity
├── user_confirmed?
└── contract_version
```

Evidence must distinguish at minimum:

- user-stated;
- observed;
- measured;
- imported;
- system-generated observation.

Evidence may later support an observation, pattern, hypothesis, or model update, but it does not become a permanent trait merely by existing.

---

# 11. Provenance Contract

Any important derived claim must be traceable to its supporting evidence or explicitly marked as an assumption.

Conceptual chain:

```text
Evidence IDs
    ↓
Observation / Pattern
    ↓
Hypothesis / Model Claim
    ↓
Recommendation / Decision Support
```

A provenance reference should identify:

- source evidence;
- source type;
- time range;
- transformation/derivation type;
- confidence where applicable;
- model/provider when AI was involved;
- policy context where relevant.

Provenance must not require exposing sensitive raw data to consumers that are not authorized to see it.

---

# 12. Human Model Contract

The Living Human Model is not a flat profile table.

A model claim should conceptually contain:

```text
Model Claim
├── claim_id
├── subject
├── claim_type
├── value
├── epistemic_type: stated | observed | measured | inferred
├── evidence_refs
├── confidence
├── valid_from / valid_to
├── observed_at
├── last_verified
├── sensitivity
├── user_confirmed?
├── contradiction_refs
├── supersedes / superseded_by
└── model_version
```

### Required invariants

- one weak observation cannot establish a permanent trait;
- contradictory evidence remains representable;
- stale evidence reduces confidence when appropriate;
- user correction can revise or invalidate a claim;
- previous model versions remain auditable;
- model updates do not rewrite historical events.

This contract directly protects FIS-036, FIS-057 and Personal Intelligence Core.

---

# 13. Path Contract

The active path is a governed strategy object, not a task list.

Conceptually:

```text
Path
├── path_id
├── goal_id
├── path_version
├── status
├── starting_state_reference
├── assumptions
├── stages
├── dependencies
├── resource_model
├── constraint_model
├── risk_model
├── trade_offs
├── confidence
├── adaptation_rules
├── selected_by / confirmation
├── created_at
└── supersedes / superseded_by
```

A path must preserve the distinction between:

- generated option;
- compared option;
- recommended option;
- user-selected option;
- active path;
- superseded path.

A path revision creates a new version where material change affects strategy, assumptions, sequence, constraints, or destination-relevant behavior.

Previous execution history remains unchanged.

---

# 14. Projection Contract

A projection is a permissioned read representation derived from authoritative state/events.

Conceptual envelope:

```text
Projection
├── projection_id
├── source_owner
├── source_version
├── generated_at
├── freshness / expires_at
├── purpose
├── consumer
├── sensitivity
├── permission_scope
└── projected_payload
```

Examples:

```text
Health OS
 ↓
Authorized projection
 ↓
Current Capacity Signal
 ↓
Daily Intelligence
```

A projection must not become a hidden source of truth.

A consumer must be able to recognize stale or unavailable projections.

---

# 15. Intelligence Artifact Contract

AI/ML/intelligence outputs are derived artifacts.

Conceptual envelope:

```text
Intelligence Artifact
├── artifact_id
├── artifact_type
├── subject / scope
├── source_evidence_refs
├── input_context_scope
├── generated_at
├── valid_until / freshness
├── confidence
├── assumptions
├── model / provider metadata
├── policy context
├── sensitivity
├── status
└── supersedes / superseded_by
```

Artifact types may include:

- pattern hypothesis;
- risk assessment;
- obstacle assessment;
- path recommendation;
- prediction;
- coaching guidance;
- learning recommendation;
- context interpretation;
- model update proposal.

AI output is never authoritative merely because it exists.

---

# 16. Recommendation Contract

A recommendation presented to the user should, where relevant, expose:

1. recommendation;
2. why it fits;
3. evidence basis;
4. important assumptions;
5. major trade-offs;
6. risks;
7. confidence/uncertainty;
8. what could change it;
9. meaningful alternatives;
10. next action.

The exact UI is outside TD-04, but the semantic contract must preserve these distinctions.

---

# 17. Memory Contract

Memory is a governed retained representation, not an unrestricted database.

Conceptual memory object:

```text
Memory
├── memory_id
├── memory_type
├── content/reference
├── source
├── created_at
├── valid_time
├── provenance
├── confidence
├── user_confirmed?
├── sensitivity
├── last_verified
├── review/expiration policy
├── correction/supersession refs
└── lifecycle status
```

Memory must preserve whether information was:

- explicitly stated;
- observed;
- inferred;
- imported.

A memory correction must not erase the provenance of the original claim.

Memory retrieval is always subject to FIS-058 authorization and purpose limitation.

---

# 18. Personal Constitution Runtime Contract

FIS-055 is not merely stored text.

User-authored rules that are explicitly activated for runtime behavior must have:

- rule identity;
- version;
- scope;
- conditions;
- priority;
- action/effect;
- activation state;
- conflict behavior;
- user ownership;
- revision history.

Rules must not silently override higher-priority security, safety, legal, or system-integrity controls.

A Personal Constitution rule may constrain or guide deterministic execution without requiring AI availability.

---

# 19. Decision Contract

Decision Intelligence may maintain a structured decision record containing:

```text
Decision
├── decision_id
├── decision_question
├── context_snapshot/reference
├── options
├── evidence_refs
├── assumptions
├── trade_offs
├── recommendation (if any)
├── user_choice
├── outcome
├── decision_at
└── review status
```

The system may improve decision quality, but the user remains the authority for consequential personal choices unless an explicitly user-authorized deterministic rule governs a low-risk operation.

---

# 20. Runtime Job Contract

Background intelligence and asynchronous processing must be represented as durable runtime work, not hidden promises.

Conceptual job envelope:

```text
Job
├── job_id
├── job_type
├── subject / scope
├── priority
├── requested_at
├── scheduled_at
├── attempt
├── max_attempts / retry policy
├── timeout policy
├── idempotency key
├── dependency refs
├── resource class
├── sensitivity class
├── status
└── result reference
```

Examples:

- Human Model refresh;
- Path analysis;
- Daily intelligence refresh;
- Memory retrieval/index update;
- Progress aggregation;
- AI recovery analysis;
- external synchronization.

Jobs must be cancellable or safely supersedable where semantics permit.

---

# 21. Idempotency Contract

Any command or asynchronous operation that may be retried must carry an idempotency identity appropriate to its semantic scope.

```text
Request(command_id)
      ↓
First execution → semantic effect
      ↓
Retry same command_id
      ↓
No duplicate semantic effect
```

Idempotency does not mean returning an identical response forever; it means retries do not create unintended additional state changes.

The exact persistence mechanism is implementation-specific.

---

# 22. Concurrency Contract

Mutable authoritative state must protect against stale writes.

Minimum conceptual requirement:

```text
Read State v10
      ↓
Command expects v10
      ↓
Transition succeeds
      ↓
State v11
```

If current state is v11 when a command expecting v10 arrives, the system must reject, re-evaluate, or explicitly reconcile according to domain policy.

Generic silent last-write-wins is prohibited for consequential state.

Particular care is required for:

- Money;
- Health;
- Consent/privacy;
- Personal Constitution;
- Goal Contracts;
- Relationship records;
- Memory corrections;
- Security controls.

---

# 23. Offline / Sync Contract

FIS-060 requires essential continuity.

```text
User Action
   ↓
Local Durable Mutation / Event
   ↓
Immediate Local State
   ↓
Pending Sync Record
   ↓
Connectivity Restored
   ↓
Server Validation / Reconciliation
   ↓
Accepted / Rejected / Conflict
```

### Invariants

- an offline action must not disappear silently;
- local state must clearly distinguish pending from server-authoritative state;
- synchronization must be retry-safe;
- conflicts must follow domain-specific policy;
- AI is not required to record or synchronize essential actions;
- recovery must not rewrite historical events.

The exact local storage and transport technology is deferred.

---

# 24. Failure Contract

Every cross-boundary operation must define its failure semantics.

| Failure | Required behavior |
|---|---|
| Domain validation fails | No authoritative mutation |
| Transaction fails | No partial semantic state |
| Event consumer fails | Source truth remains; consumer retries |
| Projection delayed | Mark projection stale; source remains authoritative |
| Intelligence job fails | No false fresh intelligence; retry/fallback policy |
| AI provider fails | FIS-060 continuity behavior |
| Integration fails | Preserve imported/source evidence and sync failure state |
| Network fails after local action | Keep durable pending mutation |
| Security policy denies | No access; auditable denial where appropriate |
| Resource pressure | Degrade nonessential intelligence before core operation |

---

# 25. AI Gateway Contract

DECIVEXA AI must interact with runtime/data through an explicit policy boundary.

```text
Intelligence Request
        ↓
Context Selection
        ↓
Sensitivity / Consent Check
        ↓
Minimum Necessary Context
        ↓
Provider Policy
        ↓
AI Provider Adapter
        ↓
Validated Intelligence Artifact
```

Every AI operation should conceptually declare:

- capability;
- data required;
- sensitivity;
- whether external processing is allowed;
- deterministic fallback;
- acceptable staleness;
- timeout/failure behavior;
- output validation requirements.

AI must never receive unrestricted access to the Personal Model merely because it is DECIVEXA AI.

---

# 26. Agent Runtime Contract

Agents operate through explicit capabilities, not implicit database access.

Conceptual agent request:

```text
Agent
+ Capability
+ Purpose
+ Scope
+ Allowed Action
+ Resource Budget
+ Authorization
+ Policy
        ↓
Governed Action
```

Agent actions must produce auditable commands/events.

An agent cannot bypass:

- domain ownership;
- authorization;
- consent/privacy policy;
- deterministic state transitions;
- resource controls;
- user-agency requirements.

Agent execution should be cancellable and bounded where technically appropriate.

---

# 27. Observability Contract

A meaningful operation should be traceable without leaking personal payloads.

```text
Correlation ID
   ↓
Command
   ↓
Transition
   ↓
Event
   ↓
Projection / Job
   ↓
Intelligence Artifact
   ↓
Guidance
```

Technical telemetry should prefer identifiers, statuses, timings, error classes and policy outcomes over raw sensitive content.

Sensitive payload logging is prohibited by default.

Audit records should answer:

- who/what acted;
- what was requested/accessed;
- why/purpose;
- when;
- authorization/policy context;
- result;
- correlation/causation identifiers.

---

# 28. Freshness and Expiration Contract

Information used for guidance has a freshness dimension.

At minimum, the architecture must distinguish:

- current authoritative state;
- stale projection;
- active intelligence;
- expired intelligence;
- last known good intelligence;
- unavailable intelligence.

An expired recommendation must not be presented as a new analysis.

This is required by FIS-059/FIS-060 and especially important for Health, Money, capacity, risk and path guidance.

---

# 29. Data Lifecycle Contract

Every persistent data category must eventually define:

- creation;
- active use;
- update/correction;
- archival where appropriate;
- expiration/review;
- export;
- deletion;
- legal/security retention constraints where applicable.

Deletion of a current representation must not necessarily imply deletion of every audit record when retention is required; the implementation must define privacy-preserving separation of those concerns.

The user's control rights established by FIS-058 remain architectural requirements.

---

# 30. Contract Versioning & Compatibility

Contracts are versioned independently from application releases where necessary.

Conceptually:

```text
Contract v1
   ↓
Compatible evolution
   ↓
Contract v2
```

Rules:

1. Breaking changes require explicit versioning.
2. Consumers must declare supported contract versions.
3. Events already accepted must remain interpretable under supported history policy.
4. Schema evolution must preserve semantic meaning.
5. A technical refactor must not silently change domain semantics.
6. Deprecated contracts require a documented migration path.

No physical schema is approved merely because it can represent the contract.

---

# 31. Cross-Domain Contract Pattern

The canonical cross-domain interaction is:

```text
Domain A Authoritative State
        ↓
Domain A Event / Explicit Read Contract
        ↓
Security / Permission Boundary
        ↓
Purpose-Specific Projection
        ↓
Domain B / Intelligence Consumer
```

Example:

```text
Health OS
  ↓
Health-derived authorized signal
  ↓
Privacy / purpose check
  ↓
Current Capacity Projection
  ↓
Daily Intelligence
```

Daily Intelligence cannot query private Health storage directly.

---

# 32. Context Fusion Contract

Context Fusion is a consumer of governed contracts, never a bypass around them.

```text
Authorized Domain Projections
        ↓
Relevance Filtering
        ↓
Confidence / Freshness Filtering
        ↓
Context Fusion
        ↓
Decision / Navigation Interpretation
```

The system should prefer the minimum sufficient context rather than aggregating all available data.

Potential context such as Goal, Health/Energy, Time, Learning, Money, Work, Habits, Behavior, Environment, History and Constraints is conditional on authorization, relevance and necessity.

---

# 33. Deterministic Core Contract

The Deterministic Core must be able to operate without LLM availability.

It must support the essential lifecycle of:

- goals;
- active paths;
- daily actions;
- routines/habits;
- progress;
- user controls;
- Personal Constitution runtime rules;
- history;
- offline mutations;
- synchronization;
- security/permission enforcement.

The Intelligence Layer may propose changes through commands but cannot bypass deterministic validation and ownership.

---

# 34. Intelligence-to-Core Boundary

```text
Evidence
  ↓
Intelligence Processing
  ↓
Hypothesis / Recommendation / Proposal
  ↓
Policy + Validation
  ↓
Command
  ↓
Deterministic Core
  ↓
Authoritative State + Event
```

AI output that is not accepted through this boundary remains derived intelligence.

This prevents an LLM response from becoming hidden system truth.

---

# 35. Minimum Contract Set Before Implementation

No implementation should begin until the following are sufficiently specified for the affected scope:

- aggregate ownership;
- command contract;
- state transition rules;
- event envelope;
- evidence/provenance contract;
- projection contract;
- intelligence artifact contract;
- idempotency strategy;
- concurrency strategy;
- offline/sync semantics;
- failure behavior;
- authorization/privacy context;
- observability/correlation;
- freshness semantics;
- lifecycle rules;
- compatibility/version policy.

A physical schema is an implementation of these semantics, not their definition.

---

# 36. Architectural Invariants

1. **One authoritative owner per domain truth.**
2. **Commands request change; events record accepted facts.**
3. **State and history remain distinct.**
4. **Raw evidence remains distinguishable from derived intelligence.**
5. **AI output is never authoritative merely because AI produced it.**
6. **Projections are not sources of truth.**
7. **Cross-domain access uses explicit, permission-aware contracts.**
8. **No direct cross-domain writes.**
9. **Important operations are retry-safe.**
10. **Stale writes cannot silently overwrite newer consequential state.**
11. **Offline actions are durable and explicitly reconciled.**
12. **AI failure does not cause data failure.**
13. **Unavailable or stale intelligence is never presented as fresh intelligence.**
14. **Historical events are not silently rewritten.**
15. **Human Model revisions preserve evidence and revision history.**
16. **Memory corrections preserve provenance.**
17. **Sensitive access is least-privileged and auditable.**
18. **Agents cannot bypass domain, security, or runtime contracts.**
19. **Context Fusion cannot bypass privacy boundaries.**
20. **Contract changes are versioned and governed.**
21. **The Deterministic Core remains functional without continuous AI.**
22. **Material changes require explicit Founder approval.**

---

# 37. Readiness Checklist for TD-05 / Implementation Gates

Before this contract is considered sufficiently mature for implementation of a concrete subsystem, the responsible design must be able to answer:

- What exact authoritative state does this subsystem own?
- What command changes it?
- What validation protects the transition?
- What event proves the change happened?
- What evidence is produced?
- What projections can other domains consume?
- What data is explicitly prohibited from being exposed?
- How are retries handled?
- How are concurrent writes handled?
- What happens offline?
- What happens when AI is unavailable?
- What happens when an integration fails?
- What is the freshness of derived intelligence?
- How can the user correct the relevant model/memory?
- How is the operation audited without leaking sensitive content?
- How does the contract evolve without breaking existing history?

If these cannot be answered, the subsystem is not implementation-ready.

---

# 38. Gate Decision

**TD-04 DESIGN DEFINED — NOT YET PASSED**

This document establishes the proposed Data & Runtime Contracts for DECIVEXA. It does **not** authorize database schema creation, event-bus implementation, service implementation, AI implementation, infrastructure provisioning, or production code.

The intended sequence remains:

```text
TD-01 — Architecture / System Orientation
        ↓
TD-02 — Domain Boundaries & Module Ownership
        ↓
TD-03 — State, Event & Consistency Model
        ↓
TD-04 — Data / Runtime Contracts
        ↓
TD-05 — Goal → Path → Multi-Option Decision Architecture
        ↓
Further Technical Design / Implementation Gates
```

> **Founder-controlled architecture. Evidence before opinion. No implementation authorization from TD-04 alone.**
