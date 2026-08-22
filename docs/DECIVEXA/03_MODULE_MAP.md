# DECIVEXA Module Map

## Core Modules

| Module | Primary responsibility | Boundary |
|---|---|---|
| Human OS | identity, self-understanding, personal context | owns human model; does not own daily execution |
| Core / Vision OS | vision, mission, values, strategic direction | defines direction; does not execute tasks |
| Goal OS | discover, create, validate, prepare, contract, activate goals | daily execution belongs to Daily OS |
| Daily OS | daily planning and execution | consumes activated goals |
| Discipline OS | commitments, consistency, recovery, behavioral reinforcement | supports execution without replacing Goal OS |
| Health OS | health-related planning and tracking | domain-specific; feeds broader human model |
| Money OS | personal financial planning and decisions | domain-specific; must respect privacy |
| Learning OS | learning plans, skill development, evidence of learning | feeds skill model and Growth Intelligence |
| Business OS | business goals, execution, decisions, progress | integrates with global goals and identity |
| Relationship OS | relationship goals, context, reflection | privacy-sensitive and user-controlled |
| Review OS | reflection, outcomes, lessons, system improvement | closes learning loops |

## Intelligence Modules

### Personal Intelligence Core

Cross-domain understanding and the living user model.

### Memory

Durable, contextual, evidence-aware memory used by the intelligence layer.

### Decision AI

Decision support grounded in user context, evidence, values, constraints, and history.

### Growth Navigation Engine

Converts the current personal state plus desired direction into personalized navigation.

### Progress Intelligence

Interprets progress and detects momentum, stagnation, risk, and patterns.

### PDM

Personal Development Model underlying growth dimensions and development planning.

### Personal AI Coach

Persistent personalized guidance interface over the intelligence and memory layers.

### Research Assistant

Contextual research and synthesis for user-specific decisions and growth.

## Cross-Cutting Systems

- Integration & Evidence Platform
- Security and Privacy Architecture
- Auditability and Governance
- Recovery and Observability
- AI/agent orchestration

## Boundary Principles

1. A module owns a coherent domain, not a screen.
2. Cross-domain intelligence belongs in shared intelligence layers, not duplicated inside modules.
3. Goal discovery/design belongs to Goal OS; daily execution belongs to Daily OS.
4. Review OS closes the outcome-learning loop.
5. AI should consume structured context rather than bypassing domain boundaries with arbitrary direct writes.
6. Sensitive domains require explicit privacy controls and minimum necessary data access.
