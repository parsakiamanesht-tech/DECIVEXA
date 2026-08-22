# DECIVEXA Architecture

## 1. Architectural Intent

DECIVEXA is a layered personal operating and navigation system. Its architecture must evolve toward a system that can build and maintain a living model of a person, connect that model to goals and decisions, and provide increasingly intelligent navigation without becoming a collection of unrelated CRUD modules.

## 2. Core Architectural Layers

### 2.1 Human Understanding System / Personal Intelligence Core

The long-term intelligence foundation. It maintains living models of:

- identity
- values
- preferences
- behavior
- habits and patterns
- strengths and weaknesses
- skills and skill gaps
- environment and constraints
- goals and priorities
- decisions and outcomes
- relevant history and memory

The model should evolve from evidence rather than static profile fields.

### 2.2 Vision and Direction Layer

Maintains vision, mission, identity-level direction, priorities, and strategic context. Goals should be connected upward to this layer rather than created in isolation.

### 2.3 Goal OS

Goal OS is responsible for **Goal Discovery → Goal Creation → Goal Validation → Goal Readiness → Goal Ecology → Goal Contract → Goal Activation**.

Boundary rule: Goal OS discovers, designs, validates, and activates goals. Daily execution belongs to Daily OS.

Goal Ecology considers interactions, conflicts, dependencies, resources, timing, and sustainability among goals.

### 2.4 Execution and Discipline Layer

Daily OS translates activated goals into execution. Discipline OS supports commitments, consistency, recovery, anti-self-sabotage mechanisms, and behavioral reinforcement.

The existing Goal Guardian philosophy is part of this direction: a daily goal is a ceiling, not a minimum; reaching the goal should close the intended work loop rather than trigger uncontrolled overextension.

### 2.5 Life Domain OS Modules

Planned domain modules include:

- Human OS
- Vision OS
- Core OS
- Goal OS
- Daily OS
- Discipline OS
- Health OS
- Money OS
- Learning OS
- Business OS
- Relationship OS
- Review OS

Modules must remain coherent with the central human model and should not become isolated applications.

### 2.6 Decision Intelligence

Decision AI should use user context, memory, evidence, goals, constraints, values, and historical outcomes to support decisions. It should explain important recommendations and preserve user agency.

### 2.7 Memory

Memory is a first-class architecture concern. It should distinguish durable facts, preferences, goals, decisions, experiences, evidence, inferred patterns, and confidence rather than treating all history as undifferentiated text.

### 2.8 Growth Intelligence

Target capabilities include:

- PDM (Personal Development Model)
- Growth Navigation Engine
- Progress Intelligence
- Personal AI Coach
- Research Assistant
- skill-gap analysis
- adaptive recommendations
- predictive completion-time estimation
- Risk Intelligence
- Adaptive Recovery Engine
- Growth Communities
- AI-guided environment optimization

### 2.9 Future Agent / Digital Twin Layer

The architecture should be able to support specialized agents, voice interaction, predictive recommendations, and eventually a Digital Twin without requiring a disruptive rewrite.

These are architectural capabilities to preserve, not a mandate to implement all of them during the current version.

## 3. Data and Evidence Architecture

Evidence should be traceable to its source and context. The system should distinguish:

- raw user input
- observed behavior
- externally sourced evidence
- system-generated inference
- AI recommendation
- confirmed user decision
- outcome/feedback

Inferences must not silently become facts.

## 4. Security Architecture

Security direction includes:

- Privacy by Design
- Data Ownership
- export/delete controls
- least-privilege access
- selective end-to-end encryption where appropriate
- secure secret handling
- auditable material changes
- separation of personal data from operational infrastructure where practical

## 5. Technology Direction

Current product direction:

- Backend: NestJS
- Web frontend: Next.js
- Earlier Express and React/Vite directions are historical, not current targets.
- Mobile: Flutter later, after the web/core foundation is stable.
- Monorepo architecture is expected where repository structure supports it.

Technology choices are subordinate to architectural principles and must not be changed casually during a development freeze.

## 6. Architecture Governance

Architecture is developed iteratively:

1. inspect current repository state
2. establish evidence
3. review architecture and philosophy
4. identify risks and boundaries
5. record decisions
6. implement only approved scope
7. verify statically and at runtime where required
8. preserve recovery evidence
9. update current-state documentation

## 7. Anti-Patterns

Avoid:

- feature-first development without architectural context
- duplicated sources of truth
- business logic hidden in UI components
- domain modules that cannot exchange meaningful context
- AI features with no memory/evidence model
- requiring users to repeatedly enter information the system can safely derive
- claiming runtime success from static inspection
- changing architecture to make a single failing test disappear
