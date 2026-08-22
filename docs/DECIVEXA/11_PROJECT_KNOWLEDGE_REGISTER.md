# DECIVEXA Project Knowledge Register

This document consolidates important product, architecture, philosophy, governance, and historical context that can otherwise be lost across conversations. It is a durable reference, not a substitute for verified repository state.

## 1. Product Identity

- Product brand: **DECIVEXA**.
- Architecture/philosophy name: **Decision OS**.
- Founder/Owner: **Parsa Kiamanesh — Originator, Founder & Owner**.
- Product ambition: become a trusted personal operating, decision, growth, and navigation system.
- Core metaphor: a **lighthouse for human goals and growth**.

## 2. Strategic Product Pivot

The project evolved from a personal decision assistant concept into a broader personal operating platform. The expansion must not erase the original decision-intelligence identity.

The system is intended to coordinate a person's:

- identity
- values
- vision
- mission
- priorities
- goals
- daily execution
- discipline
- health
- money
- learning
- business
- relationships
- reviews
- decisions
- evidence
- memory

## 3. Central Product Loop

The long-term loop is:

**Understand → Discover → Decide → Activate → Execute → Observe → Learn → Navigate again.**

The loop should become more personalized as the system accumulates trustworthy evidence and memory.

## 4. Human Understanding

The Human Understanding System / Personal Intelligence Core is intended to maintain a living model rather than a static profile.

Dimensions include:

- identity
- values
- preferences
- behavior
- habits and patterns
- strengths
- weaknesses
- skills
- skill gaps
- environment
- constraints
- goals
- priorities
- decisions
- outcomes
- history
- memory

The model should distinguish observed facts from inferred patterns and preserve provenance and confidence.

## 5. Goal Philosophy

Goal Discovery must precede Goal Creation when the user has not yet clarified what should matter.

Goals should connect to:

**Vision → Mission → Identity → Priorities → Goal → Execution.**

Goal OS includes:

- Goal Discovery
- Goal Creation
- Goal Validation
- Goal Readiness
- Goal Ecology
- Goal Contract
- Goal Activation

Goal Ecology accounts for conflicts, dependencies, resources, timing, sustainability, and interactions among goals.

Boundary: Goal OS owns discovery/design/validation/activation; Daily OS owns daily execution.

## 6. Goal Guardian / Discipline Philosophy

A previously established Goal Guardian concept should be preserved as a behavioral principle:

- the daily goal is a **ceiling, not a minimum**
- Stage 1: Contract with self — define today's goal and commit not to continue the prohibited behavior after reaching the intended goal
- Stage 2: Penalty — if the commitment is broken, the next-day consequence is applied
- Stage 3: Points system — reinforce consistent behavior

The exact implementation should be treated as a product/behavior design that must fit the final Discipline OS and should not be hard-coded into unrelated modules.

## 7. Core OS Family

The planned Decision OS family includes:

- Core / Vision OS
- Human OS
- Goal OS
- Daily OS
- Discipline OS
- Health OS
- Money OS
- Learning OS
- Business OS
- Relationship OS
- Review OS

The modules are not independent applications. They form a connected personal operating system around the shared human model.

## 8. Intelligence Portfolio

Long-term capabilities include:

### Personal AI Coach

Persistent, personalized guidance using memory, context, evidence, goals, constraints, and history.

### Decision AI

Decision support based on values, context, evidence, goals, constraints, and previous outcomes.

### Research Assistant

Context-aware research that understands the user's objective and converts research into personalized decision support.

### Growth Navigation Engine

Determines where the person is, where they want to go, what blocks them, which routes are plausible, and what next actions have high value.

### Progress Intelligence

Interprets progress instead of merely counting it; detects momentum, stagnation, risk, inconsistency, dependencies, and meaningful improvement.

### PDM — Personal Development Model

A structured model of personal development and growth dimensions.

### Learning Intelligence

A cross-cutting intelligence capability for learning progress, skill acquisition, skill gaps, evidence of competence, and personalized learning navigation.

### Risk Intelligence

Identifies threats to goals, execution, consistency, sustainability, and decision quality.

### Adaptive Recovery Engine

Helps the system recover intelligently from setbacks, disruptions, inconsistency, or goal failure rather than treating failure as a terminal state.

### Dynamic Goal Completion Estimation

Future capability for estimating completion time from actual personal performance and changing constraints rather than static generic estimates.

## 9. Advanced Intelligence Roadmap

The architecture should preserve future support for:

- specialized agents
- agent orchestration
- agent permissions
- voice interaction
- predictive recommendations
- Digital Twin
- AI-guided environment optimization
- AI-driven skill-gap analysis
- Growth Communities
- founder-level analytics

These are long-term capabilities, not permission to bypass the current development freeze.

## 10. Trustworthy Navigation

Trustworthy Navigation is a core strategic capability.

A trustworthy recommendation should account for:

- user's actual context
- goals
- values
- constraints
- evidence
- uncertainty
- provenance
- previous outcomes
- likely consequences

The system should be able to explain why a recommendation was made and distinguish fact from inference.

## 11. Evidence and Memory

Memory is not merely conversation history. It should eventually support typed and provenance-aware information such as:

- durable facts
- preferences
- goals
- decisions
- experiences
- evidence
- observations
- inferred patterns
- recommendations
- outcomes
- confidence
- source/provenance

The system should learn from outcomes and update its understanding without silently converting inference into fact.

## 12. Integration & Evidence Platform

A future integration layer should allow DECIVEXA to consume external evidence while preserving source provenance, reliability, context, and privacy.

Potential capabilities:

- evidence ingestion
- external data connectors
- source reliability modeling
- provenance tracking
- audit trails for important AI recommendations

## 13. Privacy and Security

Security is part of the product architecture, not a later add-on.

Direction includes:

- Privacy by Design
- Data Ownership
- export/delete controls
- least privilege
- selective end-to-end encryption where appropriate
- secure secret handling
- privacy-aware agent permissions
- auditability
- separation of personal data from operational infrastructure where practical

## 14. User Input Principle

The system should maximize **system value per unit of user input**.

Repeatedly asking the user to manually provide information that DECIVEXA can safely remember, infer, derive, or obtain from authorized integrations is considered an architectural weakness.

However, inferred information must remain distinguishable from confirmed user information.

## 15. Founder-Level Evaluation Framework

Every significant DECIVEXA architecture or product decision should be reviewed against six criteria:

1. **Vision alignment** — does it strengthen DECIVEXA as a Decision OS rather than a productivity app?
2. **Long-term architecture** — does it preserve future AI, memory, Digital Twin, agents, voice, and predictive capabilities?
3. **Improvement opportunities** — what debt, weakness, or future limitation does it create?
4. **Input burden vs value** — how much does it ask from the user versus the value it creates?
5. **AI capability** — does it improve understanding, memory, personalization, reasoning, Personal AI Coach, Research Assistant, or Growth Navigation?
6. **Trust potential** — does it make DECIVEXA more capable of becoming a trusted reference?

## 16. Governance

Founder approval is required for material changes to:

- philosophy
- constitution
- architecture
- module boundaries
- security/privacy principles
- data ownership
- major technology direction
- recovery baselines
- frozen scope

The Architecture Backlog exists to preserve good ideas without prematurely implementing them.

## 17. Development Governance

Development should be evidence-driven and iterative:

1. inspect
2. establish evidence
3. reason
4. record decision
5. implement approved scope
6. verify
7. preserve recovery
8. update source-of-truth documentation

Static evidence must not be represented as runtime evidence.

## 18. Current Technology Direction

Recorded direction:

- Backend: NestJS
- Web: Next.js
- Mobile: Flutter later
- Earlier Express and React/Vite directions are historical
- Monorepo direction where appropriate

The exact implementation must always be checked against the actual repository before treating this register as current runtime truth.

## 19. Recovery / Lifecycle Knowledge

Known recovery state:

- L2.1
- STATIC VERIFIED / RUNTIME BLOCKED
- 46-file recovery snapshot externally preserved
- original recovery commit: `7d8b561`
- latest recorded recovery anchor: `5133626acff35aa8aaaf3c72614f40bc79ce679b`
- final bundle: `DECIVEXA-L2.1-FINAL-RECOVERY-BUNDLE.zip`

Known static remediation areas included TypeORM shared DataSource wiring, transactional context bootstrap, repository DI structure, and Throttler wiring.

## 20. Drizzle Investigation Knowledge

Recorded environment/version facts:

- `drizzle-kit`: **0.31.10**
- `drizzle-orm`: **0.44.7**
- PostgreSQL validator path expects snapshot version **7**

Known evidence path:

`Drizzle Kit → PostgreSQL → backwardCompatiblePgSchema → version 7 → safeParse(raw snapshot) → malformed snapshot result`

Known errors:

- `0002_snapshot.json data is malformed`
- `0003_snapshot.json data is malformed`

**PROVEN:** the affected snapshots fail the relevant parser/schema validation as malformed.

**NOT PROVEN:** the exact field/value/structural incompatibility causing the failure.

Diagnostic rule: migration/snapshot/schema artifacts must not be altered merely to make the error disappear. Root cause must first be isolated with evidence.

## 21. Runtime Boundary

The earlier sandbox could not install npm dependencies because registry egress was blocked and did not provide PostgreSQL/container runtime capability.

Therefore runtime-sensitive conclusions require an external capable runtime.

## 22. Source-of-Truth Boundary

This register consolidates project knowledge, but actual source code, configuration, migration artifacts, git history, tests, CI, and runtime results outrank this document when they conflict.

When a durable decision is made, update the relevant architecture/decision document so the register does not become the only record.
