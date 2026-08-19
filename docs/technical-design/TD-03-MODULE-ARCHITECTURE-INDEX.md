# TD-03 — Module Architecture Index & Sequencing

**Status:** Founder-approved architectural planning baseline  
**Mode:** Architecture / Design — no implementation authorization

## Purpose

Define the canonical module architecture sequence after the system-level baseline. This document prevents premature coding and prevents modules from being designed as isolated applications.

## 1. Canonical module families

### A. Human & Intelligence Foundation
1. Human OS / Personal Intelligence Core
2. Memory System
3. Evidence & Integration Platform
4. Decision Intelligence
5. Personal Development Model
6. Context Fusion Engine
7. DECIVEXA AI / AI Gateway

### B. Life Domain OS
8. Goal OS
9. Daily OS
10. Discipline OS
11. Health OS
12. Money OS
13. Learning OS
14. Business / Work OS
15. Relationship / Family OS
16. Review OS

### C. Navigation & Adaptive Intelligence
17. Growth Navigation Engine
18. Progress Intelligence
19. Adaptive Path / Multi-Option Path Intelligence
20. Obstacle / Risk / Drift Intelligence
21. Opportunity Intelligence
22. Knowledge-to-Action / Learning Intelligence

### D. Platform Foundations
23. Security & Privacy Architecture
24. Fluid Experience & Performance Architecture
25. Autonomous Continuity / Offline Architecture
26. Agent Architecture & Governance

These are architecture families, not necessarily 26 separate deployable services or UI sections.

## 2. Required design order

The next work proceeds in dependency order:

```text
1. Human OS / Personal Intelligence Core
        ↓
2. Memory + Evidence Foundations
        ↓
3. Goal OS
        ↓
4. Personal Development Model + Growth Navigation
        ↓
5. Daily OS + Discipline OS
        ↓
6. Review OS + Progress Intelligence
        ↓
7. Health / Money / Learning / Work / Relationship domains
        ↓
8. Decision Intelligence + Context Fusion
        ↓
9. DECIVEXA AI / AI Gateway
        ↓
10. Agents + advanced intelligence
```

Security, privacy, performance, and continuity are cross-cutting constraints from the beginning and are not postponed to the end.

## 3. Design contract for every module

Before a module can enter implementation, its architecture specification must answer:

- Mission / purpose.
- What problem it owns.
- What it explicitly does not own.
- Authoritative data/state.
- Core entities/concepts.
- State transitions.
- Inputs.
- Outputs.
- Events emitted.
- Events consumed.
- Domain dependencies.
- Intelligence dependencies.
- Privacy classification.
- Permission model.
- AI dependency classification.
- Deterministic behavior when AI is unavailable.
- Offline/continuity behavior.
- Performance requirements.
- Failure modes.
- Evidence/provenance requirements.
- User correction / override behavior.
- Audit requirements.
- FIS relationships.
- Acceptance criteria.
- Open architectural questions.
- Founder decisions required.

## 4. Non-negotiable module rules

### Rule 1 — One owner
Every authoritative mutable state has exactly one owner.

### Rule 2 — No hidden coupling
A module cannot depend on another module's internal schema or perform direct cross-domain writes.

### Rule 3 — Intelligence is not truth
AI output, prediction, inference, recommendation, or generated path does not automatically become authoritative state.

### Rule 4 — Living Model
Personal understanding is continuously revised using evidence. Observed behavior is not automatically a permanent trait.

### Rule 5 — Goal ≠ Path
Goal OS defines the desired outcome; individualized path intelligence determines feasible routes using the human model and context.

### Rule 6 — Build + Protect
A meaningful goal must consider both required development and obstacles/risks/friction.

### Rule 7 — User agency
The system can explain, simulate, recommend, warn, and guide; consequential choices remain under user control unless the user has explicitly delegated a bounded, reversible action.

### Rule 8 — AI independence
Essential operation must remain useful without continuous AI availability.

### Rule 9 — Fluidity
Intelligence work must not block essential user interaction.

### Rule 10 — Least privilege
Modules receive only the context necessary for their purpose.

### Rule 11 — Evidence before opinion
Personal inferences require provenance and appropriate confidence.

### Rule 12 — Founder gate
Material changes to architecture, scope, ownership, schemas, security, technology, UX direction, or implementation require explicit Founder approval.

## 5. First architecture specification to produce

The immediate next document is:

`TD-04-HUMAN-OS-PERSONAL-INTELLIGENCE-CORE.md`

It will define the foundation on which the other modules depend:

```text
Human OS
   ├── Living Human Model
   ├── Personal State
   ├── Capability Model
   ├── Values / Preferences
   ├── Capacity / Energy
   ├── Constraints / Environment
   ├── Behavioral Evidence
   ├── Decision Patterns
   ├── Failure Patterns
   ├── Personal Risk Profile
   └── Model Confidence / Provenance
```

It will explicitly separate:

- observed facts;
- user-stated facts;
- derived observations;
- hypotheses;
- predictions;
- recommendations;
- authoritative domain state.

This separation is foundational for FIS-036, FIS-046, FIS-049, FIS-056, and FIS-057.

## 6. Current gate

No code, schema, API, migration, UI implementation, or cloud deployment is authorized merely by this index.

The next step is architecture specification and review of Human OS / Personal Intelligence Core, followed by Founder approval before moving to the next module.
