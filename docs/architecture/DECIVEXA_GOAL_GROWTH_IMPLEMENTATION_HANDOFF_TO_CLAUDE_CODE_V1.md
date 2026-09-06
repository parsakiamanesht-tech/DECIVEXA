# DECIVEXA — Goal Growth Implementation Handoff to Claude Code v1

**Status:** Handoff specification — implementation remains gated  
**Audience:** Claude Code / future implementation agents  
**Authority:** Must be combined with an explicit Build Authorization and the repository's governing architecture documents.

## 1. Mission

Implement Goal Growth Intelligence without weakening DECIVEXA's existing architecture, governance, privacy, AI independence, or domain boundaries.

The implementation must realize the living Goal Tree idea as a projection of a deeper Goal Growth Model.

## 2. Non-Negotiable Direction

Do not implement a generic task-management tree.

Do not create a universal goal template.

Do not make the frontend the owner of goal structure.

Do not allow LLM output to write canonical state directly.

Do not infer authorization from this document.

## 3. Required Reading Before Coding

Before any code change, the agent must inspect:

1. `README.md`
2. `docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md`
3. existing architecture decisions and source-of-truth governance documents
4. existing AI master specification and implementation contract
5. this GGI master specification
6. GGI domain model
7. GGI AI contract
8. GGI persistence/API specification
9. current repository modules and test conventions

If documents conflict, stop and surface the conflict rather than choosing silently.

## 4. Pre-Implementation Gate

Required sequence:

```text
Architecture Review
 -> Scope Contract
 -> Implementation Readiness
 -> Build Authorization
 -> Coding
```

This handoff is not Build Authorization.

## 5. Repository Inspection Checklist

Inspect before changing:

- backend module structure
- existing Goal OS implementation, if any
- existing personal-state domain patterns
- evidence implementation
- memory implementation
- AI orchestration
- authorization patterns
- repository interfaces
- controller conventions
- DTO conventions
- migration conventions
- testing infrastructure
- event conventions
- web data-access conventions

Reuse existing patterns where they are architecturally compatible.

## 6. Recommended Implementation Order

### Increment 1 — Domain Foundation

Implement/confirm:

- Goal
- GoalIntent
- DesiredState
- GoalModel
- GoalNode
- GoalEdge
- GoalPhase
- GoalState
- Capability links

No AI required.

### Increment 2 — Evidence and History

Implement:

- Evidence references
- Claims
- Reviews
- Goal mutations
- Model versioning
- Audit records

### Increment 3 — Tree Projection

Implement:

- canonical graph -> tree projection
- stable node identity
- current focus representation
- progress/state metadata

### Increment 4 — Deterministic Intelligence

Implement:

- readiness evaluation
- progress vector calculation
- basic bottleneck detection
- health checks
- capacity checks
- completion validation

### Increment 5 — AI Proposal Layer

Implement:

- context assembly
- structured proposal contract
- validation
- evidence attribution
- policy checks
- provider adapter integration through existing AI architecture

### Increment 6 — Adaptation

Implement:

- mutation proposal
- approval
- application
- versioning
- lineage
- smallest-sufficient-change policy

### Increment 7 — Product Surface

Only after domain/API acceptance:

- Goal creation UX
- tree view
- current focus
- insights
- evidence/review experience

The exact UX scope must be separately authorized.

## 7. Domain-Driven Implementation Rules

Domain rules must not live only in controllers or React components.

Use:

```text
Controller
 -> Application Use Case
 -> Domain Service / Aggregate Rule
 -> Repository
```

AI is an application/infrastructure concern, not the canonical domain model.

## 8. Tree Implementation Rule

Do not persist arbitrary parent-child UI state as the canonical goal structure if the domain graph is authoritative.

A tree projection may select a hierarchical view from graph relationships.

If a node has multiple meaningful parents, the graph remains authoritative and the UI must choose an explicit projection rule.

## 9. Model Versioning Rule

Any material structural mutation creates a new model version.

Never mutate historical versions in place.

Minor display-only changes need not create domain model versions.

The Scope Contract must define exact materiality thresholds before implementation.

## 10. Optimistic Concurrency

All mutation application must verify the expected model version. If stale:

```text
reject -> report stale version -> reload -> re-evaluate proposal
```

Never overwrite silently.

## 11. AI Integration Rule

AI flow:

```text
Context
 -> Provider Adapter
 -> Structured Output
 -> Schema Validation
 -> Evidence Validation
 -> Domain Policy
 -> Proposal
 -> Approval if required
 -> Mutation Engine
```

No direct AI repository writes.

## 12. AI Prompt Rule

Prompts must explicitly instruct the model to distinguish:

- known evidence
- observations
- inference
- hypothesis
- unknown
- recommendation

The prompt must forbid invented evidence and invented user history.

## 13. Deterministic First

Where a rule can be deterministic, implement it deterministically before using an LLM.

Examples:

- lifecycle transition validity
- model version concurrency
- edge integrity
- owner authorization
- completion evidence requirement
- mutation severity policy
- capacity arithmetic

LLM should be used where interpretation or language reasoning adds material value.

## 14. Tests — Domain

At minimum:

- lifecycle transition tests
- model version immutability tests
- graph integrity tests
- owner isolation tests
- mutation audit tests
- concurrency tests
- completion validation tests
- lineage tests
- capability reuse tests

## 15. Tests — Intelligence

At minimum:

- activity != outcome
- false progress
- stagnation
- bottleneck detection
- capacity conflict
- evidence contradiction
- goal simplification
- smallest sufficient adaptation

## 16. Tests — AI

At minimum:

- malformed output rejected
- unknown preserved
- evidence hallucination rejected
- unsupported claim rejected
- high-risk mutation requires approval
- stale model proposal rejected/rebased
- provider failure leaves canonical state intact
- explainability references valid evidence

## 17. Tests — Security

- cross-user goal access denied
- evidence leakage denied
- unauthorized mutation denied
- AI context scope enforced
- private evidence not returned to unauthorized consumers

## 18. Acceptance Criteria

Implementation is not accepted unless:

1. same nominal goal can produce different valid structures based on Current State/context
2. tree is derived from canonical goal model
3. evidence and inference remain distinct
4. meaningful progress is not task count
5. goal structure can grow and shrink
6. history remains auditable
7. material mutations are governed
8. AI cannot directly mutate canonical state
9. Daily OS boundary remains intact
10. user input burden is demonstrably reduced where inference is safe

## 19. Forbidden Shortcuts

Do not:

- hardcode one universal tree
- create a giant JSON goal blob with no domain constraints
- store AI output as truth
- put all intelligence in one service/class
- couple domain entities to an LLM SDK
- add a graph database without an ADR
- create microservices without evidence
- implement full Digital Twin as part of GGI V1
- silently modify existing Goal OS semantics
- bypass Founder gates

## 20. Definition of Done

A GGI increment is complete only when:

- code implemented within approved scope
- migrations applied/tested if authorized
- unit/integration/e2e tests pass
- domain invariants are tested
- AI evaluation fixtures pass where applicable
- security/owner-scope tests pass
- documentation is updated
- architectural decisions are recorded
- deferred items are moved to Architecture Backlog
- no unauthorized scope expansion occurred

## 21. Stop Conditions

Claude Code must stop and request clarification when:

- an existing DECIVEXA document conflicts with this specification
- a schema change affects an existing governed domain
- an AI architecture boundary must change
- a new material dependency is required
- a new external provider is required
- a major UI/product direction is implied but not authorized
- a governance threshold is ambiguous
- implementation would require changing a constitutional invariant

## 22. Required Deliverables per Increment

Each implementation increment should produce:

1. source changes
2. tests
3. migration(s), if approved
4. updated API contract, if changed
5. architecture decision record if a new material decision was necessary
6. acceptance evidence
7. explicit list of deferred work

## 23. Final Principle

Claude Code is the implementation engine, not the architectural authority.

> **Implement the approved architecture. Do not reinterpret the product while implementing it.**
