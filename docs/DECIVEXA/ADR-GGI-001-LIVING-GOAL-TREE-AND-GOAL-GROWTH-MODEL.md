# ADR-GGI-001 — Living Goal Tree as Goal Growth Model Projection

**Status:** Architecture Candidate — Founder Approval Required  
**Date:** 2026-08-24  
**Decision class:** Material product/domain architecture  

## Context

DECIVEXA's Goal OS requires a model that can represent different paths toward different goals and can evolve as the user progresses. The Founder proposed a living tree metaphor: every goal has a tree appropriate to its nature, and the tree grows as the user advances.

The architecture analysis established that treating the tree itself as the canonical domain model would create rigidity, encourage task-count thinking, make multi-parent/shared capability relationships difficult, and risk continuous AI-driven structural churn.

## Decision

Adopt **Goal Growth Intelligence** as the canonical capability and represent the living Goal Tree as a human-facing projection of a deeper versioned Goal Growth Model.

The canonical model consists of:

1. Goal identity and intent
2. Desired State
3. Current State
4. transformation/gap model
5. versioned graph of nodes and relationships
6. capabilities and dependencies
7. evidence and claims
8. state/progress/health
9. risks and constraints
10. decisions and experiments
11. outcomes
12. adaptive mutations
13. lineage and learning

The Tree is generated from these structures for comprehension and navigation.

## Rationale

This preserves the original product idea while making it technically robust and future compatible.

The decision explicitly establishes:

- Same Goal ≠ Same Path.
- No universal goal tree.
- Goal trees may grow, branch, merge, prune, simplify, and reframe.
- Tree size is not a success metric.
- Meaningful state transformation is more important than activity volume.
- Goal health is independent from goal progress.
- Evidence must remain distinct from inference.
- AI proposes; deterministic domain/policy layers govern.
- Human capacity is part of goal navigation.
- Goal history and failed paths remain learnable.

## Rejected Alternatives

### A — Fixed goal templates
Rejected because they violate person-specific paths and become brittle across goal types.

### B — Tree as canonical database structure
Rejected because the tree cannot naturally express shared capabilities, conflicts, multiple dependencies, evidence relationships, or non-hierarchical reasoning.

### C — Task tree / checklist model
Rejected because it optimizes activity rather than transformation.

### D — AI-owned dynamic tree
Rejected because it would create instability, hallucination risk, governance problems, and loss of human agency.

### E — Graph database first
Rejected because database technology is not the product capability. PostgreSQL relational modeling is sufficient for V1 and preserves optional future graph projection.

## Consequences

Positive:

- Strong Goal OS foundation
- Better Growth Navigation compatibility
- Better Progress Intelligence
- Shared capabilities across goals
- Evidence-grounded adaptation
- Future Digital Twin compatibility
- Future agent compatibility
- Longitudinal learning

Costs:

- More domain modeling than a task list
- Requires versioning and governance
- Requires deterministic validation around AI proposals
- UI must be built from projections rather than direct task hierarchy

## Implementation Boundary

This ADR does not authorize implementation. A separate Scope Contract and Build Authorization are required.

## Governance

This ADR must not be treated as permission to modify existing Goal OS code or schemas until the Founder explicitly approves the architecture and implementation gate.
