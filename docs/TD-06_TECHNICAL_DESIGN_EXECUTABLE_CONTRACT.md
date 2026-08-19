# DECIVEXA — TD-06 Technical Design / Executable Contract

**Status:** DESIGN DRAFT / IMPLEMENTATION NOT AUTHORIZED  
**Phase:** Pre-Implementation Technical Design  
**Authority:** Founder-controlled  
**Depends on:** TD-02, TD-03, TD-04, TD-05  
**Purpose:** Translate the approved architecture into implementation-independent technical contracts without selecting infrastructure prematurely.

> **TD-06 defines what implementation must satisfy. It does not grant permission to implement.**

---

## 1. Technical Design Principles

1. Domain ownership remains authoritative.
2. Deterministic Core remains functional without AI.
3. AI is an intelligence layer, never the system of record.
4. Every cross-domain read is purpose-bound and permission-aware.
5. Minimum-sufficient context applies to every intelligence request.
6. Evidence, observation, inference, recommendation and authoritative state remain distinguishable.
7. No silent history rewriting.
8. All consequential mutations are governed commands.
9. Idempotency, versioning and concurrency are explicit.
10. Performance and continuity are architecture constraints, not post-build optimization.

---

# 2. Logical Runtime Topology

```text
Client / Mobile / Web
        |
        v
API / Application Boundary
        |
        +--------------------+
        |                    |
        v                    v
Deterministic Core      Intelligence Gateway
        |                    |
        |              +-----+-----+
        |              |           |
        |             AI        Intelligence Jobs
        |              |           |
        |              +-----+-----+
        |                    |
        +----------+---------+
                   |
          Domain Application Services
                   |
      +------------+-------------+
      |            |             |
 Domain State   Evidence      Memory
      |            |             |
      +------------+-------------+
                   |
          Events / Projections
                   |
          Audit / Observability
```

This is a logical boundary, not a mandated deployment topology.

---

# 3. Canonical Technical Objects

Every implementation must preserve these semantic object classes:

### Command
Requests a state transition.

Required conceptual fields:
```text
command_id
command_type
actor
subject_id
expected_version?
purpose
authorization_context
requested_at
correlation_id
causation_id?
payload
contract_version
```

### Domain Event
Records a completed meaningful transition.

```text
event_id
event_type
aggregate_id
aggregate_type
aggregate_version
occurred_at
actor
correlation_id
causation_id
payload
schema_version
provenance
```

### Intelligence Artifact
Represents non-authoritative reasoning.

```text
artifact_id
artifact_type
subject_id
input_references
context_scope
model/provider reference
created_at
confidence
uncertainty
assumptions
reasoning_basis summary
sensitivity
valid_until/review_at
status
```

### Projection
A governed read model for a consumer.

```text
projection_id
source_owner
projection_type
consumer
purpose
fields
sensitivity
version
valid_at
expires_at?
```

### Memory
A governed retained representation.

```text
memory_id
content/reference
source
source_type
created_at
confidence
user_confirmed
system_inferred
last_verified
sensitivity
review_status
expiration?
provenance
```

---

# 4. Goal → Path Technical Contract

The path pipeline MUST remain:

```text
Goal
 ↓
Goal Understanding
 ↓
Minimum-Sufficient Context
 ↓
Requirement Model
 ↓
Growth Map + Obstacle Map
 ↓
Candidate Paths
 ↓
Feasibility Evaluation
 ↓
Sensitivity / Assumption Analysis
 ↓
Multi-Option Comparison
 ↓
Recommendation
 ↓
User Selection / Confirmation
 ↓
Versioned Path Decision Record
 ↓
Adaptive Journey
```

A path candidate MUST NOT mutate Goal OS state merely because it was generated.

Only explicit governed commands may activate or modify authoritative state.

---

# 5. Path Option Contract

Each option MUST expose:

```text
path_id
path_version
goal_id
summary
expected_outcome
estimated_duration
estimated_effort
required_resources
required_capabilities
dependencies
constraints
risks
uncertainties
assumptions
reversibility
tradeoffs
user_fit_rationale
feasibility_status
confidence
source/evidence references
```

Where a value cannot be reliably known, the system MUST expose uncertainty rather than invent a value.

---

# 6. Recommendation Contract

Recommendation output MUST contain:

```text
recommended_option_id
alternative_option_ids
dominant_factors
tradeoffs
uncertainties
critical_assumptions
why_this_fits_user
what_would_change_recommendation
confidence
```

A recommendation is not an authoritative decision.

The user remains the authority for consequential path selection unless an explicit future governance rule states otherwise and receives Founder approval.

---

# 7. Path Decision Record

Once a user explicitly selects/confirms a path:

```text
path_decision_id
path_id
path_version
goal_id
selected_by
selected_at
selection_context
relevant_constraints
critical_assumptions
recommendation_snapshot
confirmation_state
supersedes_decision_id?
```

Any later material change creates a new version/revision event. Existing decisions remain historically intact.

---

# 8. Adaptive Replanning Contract

Material replanning triggers include:

- goal change;
- constraint change;
- meaningful capacity/energy change;
- dependency failure;
- resource change;
- new evidence;
- major execution drift;
- material risk change;
- user-requested replanning.

Replanning MUST:

1. preserve historical events;
2. identify the trigger;
3. explain material changes;
4. preserve lineage;
5. avoid unnecessary plan churn;
6. respect FIS-058 privacy boundaries;
7. remain usable under FIS-059 performance constraints;
8. remain safe under FIS-060 continuity constraints.

---

# 9. Context Selection Contract

Every intelligence request MUST be reducible to:

```text
WHO → wants WHAT → for WHAT PURPOSE → using WHICH CONTEXT → for HOW LONG
```

The context broker/gateway must return only the minimum authorized fields required for the purpose.

Sensitive context requires explicit policy authorization. Availability of data never implies permission to use it.

---

# 10. Security Boundary

All external and internal access to sensitive data must pass through centralized authorization/policy enforcement.

Conceptual request:

```text
Requester
 ↓
Identity
 ↓
Purpose
 ↓
Policy / Consent
 ↓
Sensitivity Check
 ↓
Minimum Context Selection
 ↓
Authorized Projection
```

The client UI must never be the authoritative security boundary.

AI providers receive only data permitted by the Privacy Gateway and only the minimum necessary context.

---

# 11. Deterministic Core Contract

The following must remain functional without AI:

- goal viewing;
- active path viewing;
- daily actions;
- routine execution;
- habit/progress recording;
- user data viewing;
- review recording;
- deterministic personal rules;
- local/offline essential operations where supported.

AI outage MUST NOT imply data loss.

AI outage MUST NOT cause fabricated intelligence.

---

# 12. AI Gateway Contract

All AI/model-provider calls MUST pass through an abstraction/gateway boundary.

Conceptual interface:

```text
IntelligenceRequest
├── capability
├── purpose
├── authorized_context
├── sensitivity_policy
├── latency_class
├── continuity_policy
├── model_policy
└── contract_version
```

The gateway MUST be able to reject an external-processing request when privacy, consent, policy, provider capability or continuity requirements are not satisfied.

Provider choice remains an implementation decision and is not fixed by TD-06.

---

# 13. Memory Contract

Memory retrieval MUST be governed by:

- purpose;
- sensitivity;
- provenance;
- confidence;
- user confirmation state;
- recency/validity;
- access policy.

An inferred memory must never be silently represented as a user-confirmed fact.

Memory poisoning protections must support provenance inspection, correction, verification and removal.

---

# 14. Living Human Model Contract

The Personal Intelligence Core must represent evolving claims rather than immutable labels.

Conceptually:

```text
Evidence
 ↓
Observation
 ↓
Pattern / Hypothesis
 ↓
Confidence + Provenance
 ↓
Model Claim
 ↓
Validation / Contradictory Evidence
 ↓
Revision / Retraction
```

Observed behavior MUST NOT automatically become a permanent personality trait.

A model claim must be revisable when evidence changes.

---

# 15. Event / State Consistency

Authoritative state changes MUST follow:

```text
Command
 ↓
Authorization
 ↓
Validation
 ↓
Transactional state transition
 ↓
Durable event
 ↓
Projection / downstream processing
```

An event cannot be emitted to claim a state transition that did not succeed.

Consumers must tolerate duplicate delivery and use idempotency mechanisms.

Concurrent writes must use explicit version/concurrency control.

---

# 16. Idempotency Contract

Retryable commands and synchronization operations MUST support stable idempotency keys.

A repeated delivery of the same accepted command must not create duplicate semantic effects.

Idempotency scope and retention must be defined in the implementation specification before production deployment.

---

# 17. Offline / Continuity Contract

Essential client operations should follow:

```text
User Action
 ↓
Local Validation
 ↓
Immediate UI State
 ↓
Secure Local Event / Queue
 ↓
Sync
 ↓
Server Validation
 ↓
Authoritative Acceptance / Rejection
```

Conflict handling must be explicit; client state must not silently overwrite authoritative server truth.

FIS-060 defines continuity behavior; TD-06 defines the technical contract boundary only.

---

# 18. Performance Contract

No intelligence operation may synchronously block essential UI interaction unless explicitly justified and approved.

Heavy work should be classified as:

- immediate deterministic;
- cached;
- background;
- asynchronous;
- progressive;
- precomputed.

Each implementation feature must later receive measurable performance budgets covering responsiveness, latency, memory, CPU/battery where relevant, network behavior and degraded conditions.

The exact numerical thresholds belong in the Technical Performance Specification, not this architecture gate.

---

# 19. Error / Failure Contract

Failures must be typed and observable without leaking sensitive information.

Minimum conceptual classes:

```text
VALIDATION_ERROR
AUTHORIZATION_DENIED
CONSENT_REQUIRED
CONTEXT_NOT_ALLOWED
NOT_FOUND
VERSION_CONFLICT
IDEMPOTENCY_REPLAY
DEPENDENCY_UNAVAILABLE
AI_UNAVAILABLE
SYNC_CONFLICT
RATE_LIMITED
TEMPORARY_FAILURE
INTERNAL_FAILURE
SAFE_MODE_REQUIRED
```

User-facing errors should be calm and actionable. Internal diagnostics may contain correlation identifiers but must not expose sensitive payloads.

---

# 20. Audit & Observability Contract

Security-sensitive access must record enough metadata to answer:

```text
Who / What service
→ accessed what
→ for what purpose
→ under which policy
→ when
→ outcome
→ correlation ID
```

Sensitive content itself must not be copied into logs merely to make the event auditable.

---

# 21. API Boundary Requirements

Future API contracts must define:

- authentication context;
- authorization/purpose context;
- request ID/correlation ID;
- idempotency behavior where needed;
- versioning;
- input validation;
- output sensitivity classification;
- error contract;
- pagination/limits where relevant;
- timeout/degradation behavior;
- audit requirements.

No API should expose an unrestricted "entire user" object.

---

# 22. Implementation Independence

TD-06 intentionally does NOT select:

- PostgreSQL or another database;
- ORM;
- Redis/cache technology;
- queue/broker;
- cloud provider;
- AI vendor/model;
- frontend framework;
- mobile framework;
- deployment topology;
- encryption implementation/library;
- secret manager.

Those decisions require a separate technical decision process and must remain subordinate to this contract.

---

# 23. Required Verification Before Implementation Authorization

The next review must verify:

1. Every TD-05 contract maps to a technical contract.
2. No technical contract weakens TD-05.
3. TD-04 ownership/event semantics remain intact.
4. FIS-058 privacy and data sovereignty are enforceable.
5. FIS-059 performance constraints are represented.
6. FIS-060 continuity is represented.
7. Living Human Model remains revisable and evidence-based.
8. AI remains non-authoritative.
9. No unrestricted cross-domain access exists.
10. Offline synchronization cannot silently overwrite authoritative state.
11. History cannot be silently rewritten.
12. Implementation technology choices are not being smuggled into the architecture gate.

## Gate Rule

**TD-06 is not FULL PASS until the Founder-controlled review explicitly approves the technical contract.**

No coding, schema migration, production infrastructure, provider commitment or material implementation change is authorized by this document alone.
