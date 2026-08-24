# DECIVEXA

DECIVEXA is an AI-powered Personal Operating System for human growth, life navigation, decision quality, and the transformation of human goals into real-world outcomes.

> **For the user: simple. Behind the scenes: deeply intelligent.**

## Canonical Architecture Baseline

The canonical Founder-approved synthesis of DECIVEXA's philosophy, purpose, vision, core architecture intent, Intelligence layers, formally defined FIS capabilities, benchmark-derived ideas, and architecture backlog is:

**[DECIVEXA — Master Philosophy, Vision & Intelligence Architecture](./docs/DECIVEXA_MASTER_ARCHITECTURE_AND_VISION.md)**

## Living Goal Tree / Goal Growth — Corrected Unified Architecture v3

The Living Goal Tree / Goal Growth concept has been re-reconciled under the correct interpretation of the previously discussed **85 + 70 conceptual developments for the Goal Growth idea itself**. They are not FIS-001..FIS-085 plus a separate 70-item catalog.

**[DECIVEXA Living Goal Tree 85+70 Unified Architecture v3](./docs/architecture/DECIVEXA_LIVING_GOAL_TREE_85_70_UNIFIED_ARCHITECTURE_V3.md)** — the corrected pre-freeze synthesis covering the Goal Growth Model, graph-first/tree-projection architecture, dynamic growth and pruning, capability intelligence, evidence, progress, health, bottlenecks, leverage, experimentation, adaptation, goal ecology, capacity, navigation, AI boundaries, privacy, persistence, versioning, lineage, evaluation, Digital Twin/agent compatibility, and architectural invariants.

### Core specification set

1. **[Goal Growth Intelligence Master Specification v1](./docs/architecture/DECIVEXA_GOAL_GROWTH_INTELLIGENCE_MASTER_SPEC_V1.md)** — product/domain architecture, principles, lifecycle, graph/tree model, intelligence, adaptation, governance, V1 scope and invariants.
2. **[Goal Growth Domain Model v1](./docs/architecture/DECIVEXA_GOAL_GROWTH_DOMAIN_MODEL_V1.md)** — canonical entities, relationships, state machines, events, domain services, application use cases and invariants.
3. **[Goal Growth AI & Intelligence Contract v1](./docs/architecture/DECIVEXA_GOAL_GROWTH_AI_AND_INTELLIGENCE_CONTRACT_V1.md)** — AI boundary, evidence discipline, structured proposals, validation, governance, failure behavior and evaluation.
4. **[Goal Growth Persistence & API Specification v1](./docs/architecture/DECIVEXA_GOAL_GROWTH_PERSISTENCE_AND_API_SPEC_V1.md)** — PostgreSQL direction, conceptual tables, transaction/concurrency rules, API resources, authorization, audit and read models.
5. **[Goal Growth Implementation Handoff to Claude Code v1](./docs/architecture/DECIVEXA_GOAL_GROWTH_IMPLEMENTATION_HANDOFF_TO_CLAUDE_CODE_V1.md)** — execution boundary, implementation sequence, tests, stop conditions and definition of done.
6. **[Goal Growth Traceability & Acceptance Matrix v1](./docs/architecture/DECIVEXA_GOAL_GROWTH_TRACEABILITY_AND_ACCEPTANCE_V1.md)** — integration and acceptance baseline.
7. **[ADR-GGI-001](./docs/DECIVEXA/ADR-GGI-001-LIVING-GOAL-TREE-AND-GOAL-GROWTH-MODEL.md)** — canonical architectural decision: Tree is a projection of the Goal Growth Model.

### Second-pass hardening and audit

8. **[Goal Growth Architecture Hardening v2](./docs/architecture/DECIVEXA_GOAL_GROWTH_ARCHITECTURE_HARDENING_V2.md)** — canonical ownership, aggregate/version boundaries, concurrency, idempotency, outbox, tree stability, privacy, degraded mode and implementation invariants.
9. **[Goal Growth Strict Document Audit v2](./docs/architecture/DECIVEXA_GOAL_GROWTH_DOCUMENT_AUDIT_V2.md)** — adversarial review of the first document set and identified gaps.
10. **[Goal Growth Freeze Readiness v2](./docs/architecture/DECIVEXA_GOAL_GROWTH_FREEZE_READINESS_V2.md)** — formal gate record and remaining blockers before Architecture Freeze.

**Removed correction:** the previously created `DECIVEXA_GOAL_GROWTH_85_FIS_AND_70_EXTENSION_RECONCILIATION_V2.md` was based on an incorrect interpretation of “85 + 70” and has been deleted from this branch. It must not be used as a project reference.

**Important:** These documents are architecture proposals and implementation guidance. They do **not** constitute Build Authorization. Founder-controlled gates remain mandatory.

## Canonical AI Architecture

The **master AI specification** consolidates the complete AI architecture, resilience model, privacy/security boundaries, memory integrity, context architecture, routing, model/provider independence, evaluation, observability, offline continuity, agent-readiness, v1 scope, and implementation invariants:

**[DECIVEXA AI Architecture — Master Specification v1](./docs/architecture/DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md)**

The conceptual architecture is defined in:

**[DECIVEXA Intelligence Architecture v1](./docs/architecture/DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md)**

Its execution boundary for Claude Code and implementation agents is:

**[DECIVEXA AI Implementation Contract v1](./docs/architecture/DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md)**

Its failure and resilience requirements are defined in:

**[DECIVEXA AI Failure & Resilience Matrix v1](./docs/architecture/DECIVEXA_AI_FAILURE_AND_RESILIENCE_MATRIX_V1.md)**

Its completeness and implementation acceptance criteria are defined in:

**[DECIVEXA AI v1 Traceability & Acceptance Matrix](./docs/architecture/DECIVEXA_AI_V1_TRACEABILITY_AND_ACCEPTANCE.md)**

These documents establish the AI foundation as a **Provider-agnostic, capability-centric, intelligence-owned** subsystem. DECIVEXA must not become dependent on a single AI provider, model, cloud region, or network path.

The governing V1 scope requirement for all of the above — that DECIVEXA's AI architecture must be complete, end-to-end, and production-grade in Version 1, with no essential capability deferred to V2 without explicit Founder approval — is recorded in **[ADR-006](./docs/DECIVEXA/ARCHITECTURE_DECISIONS.md)**.

## Core non-negotiables

- **Same Goal ≠ Same Path.** The path belongs to the person, not merely to the goal.
- **Living Human Model.** DECIVEXA continuously learns from evidence and updates its understanding of the person.
- **Evidence Before Opinion.** Observations, inferences, hypotheses, and recommendations must remain distinguishable.
- **Growth + Protection.** Every meaningful goal should consider both what must be built and what may obstruct the journey.
- **User-Owned Intelligence.** Personal data and derived personal intelligence remain under user control.
- **Zero-Trust Privacy.** Modules and AI receive only the minimum necessary context for an authorized purpose.
- **Fluid Experience.** Backend intelligence must not make the product feel slow, heavy, or blocked.
- **AI Independence.** AI enhances DECIVEXA but essential system functionality must remain useful without continuous AI availability.
- **No Intelligence Single Point of Failure.** Model/provider/network failure must not become product failure.
- **Provider-Agnostic, Capability-Centric, Intelligence-Owned.** DECIVEXA owns its intelligence state; models and providers are replaceable execution infrastructure.
- **Human Agency.** DECIVEXA augments human capability; it must not replace user agency or permanently label the user.

## Project Governance

Material changes to product direction, architecture, scope, implementation, technology, schemas, security, branding, or other significant project decisions require explicit Founder approval before execution.

The Master Architecture & Vision document and Intelligence Architecture documents are reference and implementation baselines, not authorization to implement every future capability immediately. Implementation remains phase- and gate-controlled.

## Architectural Direction

DECIVEXA is not intended to become a collection of disconnected productivity applications. Its differentiation comes from a unified Personal Intelligence architecture that connects:

- Goals and paths
- Human understanding
- Personal Development Model
- Growth Navigation
- Daily execution
- Learning
- Health
- Money
- Work and business
- Relationships and life context
- Memory
- Decision intelligence
- Risk and obstacle intelligence
- Progress intelligence
- Adaptive journeys
- AI and agents

The intended system behavior is:

```text
Understand → Generate → Compare → Guide → Observe → Learn → Adapt
                                      ↑              │
                                      └──────────────┘
```

## Repository Status

Architecture and implementation proceed through explicit Founder-controlled gates. The project should preserve an auditable decision trail and should not autonomously change its core direction.
