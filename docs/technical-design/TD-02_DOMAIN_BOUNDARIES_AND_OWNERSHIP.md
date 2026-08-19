# DECIVEXA — TD-02 Domain Boundaries & Ownership

**Status:** Founder-approved technical design artifact
**Phase:** Technical Design Gate
**Priority:** Foundational / Core Architecture
**Owner:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA
**Depends on:** TD-01 — Architecture Constitution & Document Authority
**Implementation status:** NOT AUTHORIZED by this document

---

## 1. Purpose

TD-02 defines the conceptual domain boundaries and ownership model for DECIVEXA.

Its purpose is to prevent the system from becoming either:

1. a collection of disconnected applications, or
2. a single unrestricted intelligence layer in which every module can access every part of a person's life.

DECIVEXA must instead behave as a **coherent Personal Operating System composed of bounded domains connected through explicit contracts and governed context access**.

TD-02 defines responsibilities and dependency direction. Detailed database schemas, APIs, event schemas, infrastructure topology, and implementation contracts are deferred to later Technical Design documents.

---

## 2. Architectural Model

DECIVEXA is organized around three conceptual strata:

```text
                    DECIVEXA EXPERIENCE
                           │
          ┌────────────────┴────────────────┐
          ↓                                 ↓
   Operating Domains                Intelligence Layer
          │                                 │
          │                         Understand / Predict
          │                         Compare / Recommend
          │                         Learn / Adapt
          │                                 │
          └───────────────┬─────────────────┘
                          ↓
                 Shared Core Contracts
                          │
          ┌───────────────┼────────────────┐
          ↓               ↓                ↓
       Identity         Context          Evidence
       / Access          / State          / Memory
```

The key rule is:

> **Domains own capabilities and state; Intelligence reasons over authorized context; shared contracts control how information crosses boundaries.**

---

# 3. Domain Map

## 3.1 Personal Intelligence Core

**Ownership:** Human understanding and the Living Human Model.

Responsibilities:

- maintain the evolving human model
- distinguish explicit facts, observations, inferences, hypotheses, and recommendations
- maintain confidence and provenance
- model capabilities, preferences, values, behavior patterns, constraints, and changing state
- expose minimum-necessary human context to authorized consumers
- identify model uncertainty and stale assumptions
- coordinate model updates from evidence

It does **not** own every piece of raw domain data.

It owns the **interpreted human model**, while source domains remain authoritative for their own raw/state data.

---

## 3.2 Goal OS

**Ownership:** Goal lifecycle and goal semantics.

Responsibilities:

- goal discovery
- goal clarification
- goal definition
- goal validation
- goal readiness
- goal ecology
- goal relationships and dependencies
- goal activation
- goal-level success criteria
- goal-level constraints

Goal OS does not own daily execution. Daily execution belongs to Daily OS.

Goal OS is a destination authority, not a universal path authority.

---

## 3.3 Growth Navigation Engine

**Ownership:** Translation from destination and human state into viable development journeys.

Responsibilities:

- required capability analysis
- Personal Development Model coordination
- path generation
- path adaptation
- milestone and stage reasoning
- development sequencing
- timeline reasoning
- route alternatives
- path fit evaluation
- integration of Growth Map and Obstacle Map

It operationalizes FIS-036 but must not create a universal default human path.

---

## 3.4 Personal Development Model

**Ownership:** The developmental representation connecting who the user is now with who they need to become for a desired future.

Responsibilities:

- capability gaps
- skill development
- knowledge development
- behavioral development
- habit development
- identity/capability evolution
- developmental prerequisites
- development trajectory

The PDM is not a standalone productivity module. It is a cross-domain model consumed by Growth Navigation, Learning, Discipline, Progress, and relevant Intelligence capabilities.

---

## 3.5 Decision Intelligence / DECIVEXA AI

**Ownership:** Reasoning, synthesis, comparison, explanation, and intelligent guidance.

Responsibilities:

- understand user intent
- synthesize authorized context
- generate hypotheses
- compare options
- explain trade-offs
- provide recommendations
- support contextual decision-making
- coordinate AI model/provider usage through an abstraction boundary
- maintain truthfulness about confidence and freshness

DECIVEXA AI does **not** become the owner of user data.

It is a consumer/producer of governed intelligence, not the system of record.

AI availability must not be required for essential deterministic system operation under FIS-060.

---

## 3.6 Daily OS

**Ownership:** Daily execution and immediate action state.

Responsibilities:

- today's actionable commitments
- next meaningful action
- daily prioritization
- execution state
- daily capacity adaptation
- routine execution coordination
- action completion
- daily-level scheduling inputs

Daily OS consumes approved path/goal intent but does not redefine the user's goals or silently change long-term strategy.

---

## 3.7 Discipline OS

**Ownership:** Behavioral consistency and execution-support mechanisms.

Responsibilities:

- personal discipline rules
- commitment mechanisms
- consistency tracking
- friction-aware execution support
- recovery after missed actions
- behavior-support interventions
- Personal Constitution runtime rules where applicable

Discipline OS must not become a punitive judgment engine.

Its role is to help the user execute according to their chosen values, commitments, and context.

---

## 3.8 Review OS

**Ownership:** Structured reflection, evaluation, and learning from experience.

Responsibilities:

- daily/weekly/monthly review flows
- compare intention vs execution
- surface meaningful changes
- capture user feedback
- identify lessons
- feed evidence into Personal Intelligence Core
- initiate model/path review signals

Review OS records reflection; it does not itself own the Human Model or rewrite history.

---

## 3.9 Progress Intelligence

**Ownership:** Measurement and interpretation of progress toward defined outcomes.

Responsibilities:

- progress state
- trajectory
- milestone status
- performance trends
- meaningful deviations
- evidence of advancement or stagnation
- progress-related signals for model/path adaptation

Progress Intelligence must distinguish measured progress from inferred explanations for that progress.

---

## 3.10 Obstacle / Risk Intelligence

**Ownership:** FIS-057 Personal Obstacle & Self-Sabotage Intelligence and related risk reasoning.

Responsibilities:

- Growth Map / Obstacle Map pairing
- personal risk factors
- environmental friction
- repeated behavior patterns
- early warning signals
- root-cause hypotheses
- prevention strategies
- low-friction interventions
- Personal Risk Profile

It must never label a user as self-sabotaging from a single behavior.

> **Risk identification preserves user agency.**

---

## 3.11 Health OS

**Ownership:** Health-domain state and health-related user interactions.

Responsibilities:

- health goals
- health observations and records supplied/authorized by the user
- routines and health actions
- health-specific trends
- health-specific constraints
- health-domain guidance boundaries

Health OS is the authority for health-domain state. Other domains receive only authorized summaries or signals needed for a specific purpose.

---

## 3.12 Money OS

**Ownership:** Personal financial domain state and financial planning.

Responsibilities:

- income/expense information supplied or connected with authorization
- budgets
- financial goals
- allocations
- financial constraints
- financial progress

Money OS is not a general-purpose source of financial data for other modules.

Cross-domain consumers should receive purpose-limited financial signals rather than unrestricted financial records.

---

## 3.13 Learning OS

**Ownership:** Learning journey and skill/knowledge acquisition.

Responsibilities:

- learning goals
- skill gaps received from PDM/Growth Navigation
- learning plans
- adaptive difficulty
- practice
- feedback
- mastery evidence
- contextual knowledge application
- knowledge resurfacing requests

Learning OS must connect learning to real goals rather than become an isolated content catalog.

---

## 3.14 Business / Work OS

**Ownership:** Work, career, business, and professional context.

Responsibilities:

- work objectives
- business objectives
- professional projects
- professional constraints
- business resources
- work execution context

Business/Work OS must not implicitly gain access to unrelated family, health, or private relationship data.

---

## 3.15 Relationship / Family OS

**Ownership:** Relationship and family-life context explicitly managed by the user.

Responsibilities:

- relationship goals
- commitments
- relevant relationship context
- family responsibilities
- relationship reflections
- support/resource context

This domain is particularly sensitive and must follow FIS-058 access controls.

---

## 3.16 Memory Architecture

**Ownership:** Durable personal memory lifecycle and provenance.

Responsibilities:

- memory storage abstraction
- memory retrieval
- provenance
- source/date/confidence metadata
- user-confirmed vs inferred status
- sensitivity
- verification/review status
- expiration where applicable
- correction and deletion

Memory Architecture is not allowed to silently convert an inference into a confirmed fact.

Memory must preserve the distinction between:

```text
User explicitly stated
Observed
System inferred
User confirmed inference
Superseded / corrected
```

---

## 3.17 Context Fusion Engine

**Ownership:** Controlled synthesis of authorized cross-domain context.

Responsibilities:

- collect purpose-approved context signals
- normalize context
- identify relevant relationships across domains
- produce a bounded context package for intelligence consumers
- minimize unnecessary data exposure
- enforce context scope and freshness

Context Fusion is **not** a data lake with unrestricted access.

Its governing rule is:

> **Context fusion increases intelligence; it does not remove privacy boundaries.**

---

## 3.18 Security & Privacy Architecture

**Ownership:** Enforcement of security/privacy policy across the system.

Responsibilities:

- identity and authorization
- purpose-bound access
- least privilege
- consent enforcement
- data classification
- encryption/key-management boundaries
- privacy modes
- audit controls
- AI data boundary
- third-party integration boundaries
- breach containment

Security controls must be enforced centrally and server-side where applicable, not merely trusted to UI behavior.

---

## 3.19 Performance & Continuity Infrastructure

**Ownership:** Runtime responsiveness, resilience, graceful degradation, and resource-aware execution.

Responsibilities:

- caching
- background jobs
- asynchronous execution
- resource-aware scheduling
- local/offline core
- synchronization
- failure boundaries
- Last Known Good State
- AI/provider outage handling
- performance telemetry

It protects FIS-059 and FIS-060 across the runtime.

---

## 3.20 Agent Architecture

**Ownership:** Autonomous task execution within explicit scopes.

Responsibilities:

- agent identity
- capability scopes
- authorization
- tool permissions
- execution boundaries
- scheduling
- observability
- auditability
- safe failure
- human approval where required

Agents do not own domain truth. They operate through domain contracts.

---

# 4. Ownership Rule

Every important piece of state must have one authoritative owner.

Examples:

| State | Authoritative owner |
|---|---|
| Goal definition | Goal OS |
| Daily action execution state | Daily OS |
| Health-domain state | Health OS |
| Financial-domain state | Money OS |
| Learning mastery | Learning OS |
| Relationship-domain state | Relationship / Family OS |
| Human interpreted model | Personal Intelligence Core |
| Developmental capability model | Personal Development Model |
| Durable memory lifecycle | Memory Architecture |
| Progress measurements | Progress Intelligence |
| Obstacle/risk analysis | Obstacle / Risk Intelligence |
| User permissions/consent | Security & Privacy Architecture |
| Runtime continuity state | Performance & Continuity Infrastructure |
| AI reasoning output | DECIVEXA AI / Intelligence Layer |

No secondary module may silently become a competing system of record.

---

# 5. Dependency Direction

The preferred dependency direction is:

```text
Foundation / Policy
        ↓
Domain State & Contracts
        ↓
Intelligence / Coordination
        ↓
Experience / Guidance
```

More specifically:

```text
Security / Identity / Consent
            ↓
Core Contracts + Domain State
            ↓
Human Model + PDM + Goal State
            ↓
Growth / Risk / Progress / Learning Intelligence
            ↓
Daily / Discipline / Review Execution
            ↓
User Experience
```

This is conceptual. Exact package/module dependency rules belong to later implementation design.

Circular ownership is prohibited.

A module may depend on another module's **contract** without taking ownership of its internal state.

---

# 6. Cross-Domain Access Model

All cross-domain requests must be evaluated as:

```text
WHO
  ↓
WANTS WHAT
  ↓
FOR WHICH PURPOSE
  ↓
FROM WHICH DOMAIN
  ↓
WITH WHAT SENSITIVITY
  ↓
FOR HOW LONG
  ↓
UNDER WHICH CONSENT / POLICY
  ↓
MINIMUM NECESSARY CONTEXT
```

Example:

Goal OS may request:

> "Current weekly energy capacity signal"

It should not automatically receive:

> complete health history.

Similarly, Business OS may request:

> "available work capacity for this week"

without receiving:

> unrelated family or medical records.

---

# 7. Contract Types

Future implementation should use explicit contracts for at least these categories:

### Domain State Contract
Defines the minimum state another domain may consume.

### Context Signal Contract
Defines a summarized, purpose-limited signal such as capacity, risk, or availability.

### Intelligence Request Contract
Defines the question, purpose, context scope, confidence requirements, and freshness requirements for reasoning.

### Recommendation Contract
Defines recommendation, rationale, evidence, confidence, assumptions, risks, and expiry/review conditions.

### Event Contract
Defines durable facts about things that happened without allowing downstream systems to rewrite the original event.

### Consent / Authorization Contract
Defines whether a request is permitted.

### Agent Execution Contract
Defines an agent's scope, permitted actions, required approvals, and audit requirements.

Detailed schemas are deferred to later TD documents.

---

# 8. Event vs State Rule

DECIVEXA must distinguish:

**State:** what is currently believed to be true.

**Event:** something that happened.

Example:

```text
Event:
User completed Action A at time T.

State:
Action A = completed.
```

AI recovery, model updates, and later interpretations must not rewrite historical events.

This preserves the FIS-060 rule:

> **Never Rewrite History.**

---

# 9. Intelligence Access Rule

Intelligence may be broad in reasoning but narrow in data access.

The system should prefer:

```text
Raw Domain Data
      ↓
Purpose-Limited Signal
      ↓
Context Fusion
      ↓
Authorized Intelligence
```

rather than:

```text
All User Data
      ↓
AI
```

The second pattern is prohibited as an architectural default.

---

# 10. Personal Intelligence Core Boundary

The Personal Intelligence Core is the central understanding layer, but it must not become an unrestricted database mirror.

It may maintain derived models such as:

- capability profile
- preference profile
- behavioral patterns
- decision patterns
- failure patterns
- risk profile
- energy/capacity patterns
- learning profile
- environmental patterns
- evolving personal model

Each derived item must retain evidence/provenance and confidence metadata.

Source-domain ownership remains intact.

---

# 11. Goal-to-Life Integration

Goal OS is intentionally not the center of all life data.

Instead:

```text
Goal
 ↓
Relevant Life Context
 ↓
Authorized Domain Signals
 ↓
Personal Development Model
 ↓
Growth + Protection
 ↓
Individual Path
 ↓
Daily Execution
```

This preserves the distinction between:

- goal as destination
- human as the owner of the path
- life domains as contextual systems

---

# 12. Daily / Discipline / Review Relationship

These three domains form an execution learning loop:

```text
Goal / Path
    ↓
Daily OS
    ↓
Discipline OS
    ↓
Real Behavior
    ↓
Review OS
    ↓
Evidence
    ↓
Personal Intelligence Core
    ↓
Path / Guidance Adaptation
```

Daily OS executes.
Discipline OS supports consistency.
Review OS learns from experience.
Personal Intelligence Core updates the human model.

None of the three may independently redefine the constitutional architecture.

---

# 13. AI / Agent Boundary

DECIVEXA AI and Agents are capability layers, not sovereign owners of the system.

AI may:

- reason
- synthesize
- compare
- explain
- propose
- detect patterns
- adapt recommendations

Agents may:

- execute explicitly authorized actions
- coordinate workflows
- perform bounded background work

Neither may:

- silently change Founder-approved architecture
- bypass security controls
- acquire unrestricted cross-domain access
- rewrite historical facts
- fabricate evidence
- permanently redefine the user model without evidence

---

# 14. Failure Boundaries

Each domain must have an independent failure boundary wherever technically appropriate.

Failure of:

- Health intelligence must not freeze Goal OS.
- AI provider must not erase Daily OS.
- Learning analysis must not block Money OS.
- External integration must not disable core local functionality.
- One agent must not compromise unrelated domain execution.

This is required by FIS-059 and FIS-060.

---

# 15. Architectural Anti-Patterns

The following are prohibited defaults:

### God Module
One module owns goals, health, money, memory, users, and AI state.

### God AI
Every operation must pass through an LLM.

### Shared Database Without Ownership
Every module reads and writes every table freely.

### Universal Human Path
One standardized route is used for all users with the same goal.

### Silent Cross-Domain Access
A module accesses another domain because the data happens to be technically available.

### Memory as Truth Without Provenance
An AI inference becomes a permanent user fact without source/confidence metadata.

### UI-Only Security
The frontend hides data while backend services remain unrestricted.

### Agent Privilege Creep
Agents receive broad permissions because future capabilities might need them.

---

# 16. Acceptance Criteria

TD-02 is satisfied when:

- major DECIVEXA domains have explicit responsibilities
- each important state has one authoritative owner
- Goal OS is separated from Daily execution
- Discipline OS and Review OS have explicit roles
- DECIVEXA AI is defined as an intelligence layer rather than the system of record
- Personal Intelligence Core is defined as a Living Human Model owner, not a raw-data dump
- Context Fusion is bounded by privacy and purpose
- cross-domain access is minimum-necessary
- dependency direction is explicit
- event/state distinction is explicit
- AI and agent authority is bounded
- failure boundaries are defined
- implementation details remain deferred to later TD artifacts

---

# 17. Current Decision

**TD-02 — ACCEPTED AS THE DOMAIN BOUNDARY AND OWNERSHIP BASELINE.**

This document does not constitute Architecture Freeze and does not authorize implementation.

Next technical-design artifact:

> **TD-03 — Core Data Model & State Ownership**

TD-03 should define the canonical conceptual entities, ownership of state, provenance, confidence, temporal validity, event/state semantics, and the minimum data contracts required for the architecture to remain coherent.
