# DECIVEXA — FIS Registry Baseline

This document records the currently established Feature / Intelligence Specifications (FIS) and their architectural intent. A FIS is not necessarily a standalone UI feature; FIS capabilities should generally compose behind the Personal Intelligence Core.

## Core / Non-Negotiable

### FIS-036 — Individualized Path Intelligence
Same Goal ≠ Same Path. Generate the path from the person, current state, context, constraints, resources, history, capabilities, preferences, environment, and evidence. Path, pace, method, and routine must evolve as the person evolves.

### FIS-037 — Personal Baseline & Change Detection
Learn the user's own normal patterns—focus, energy, pace, sustainable load, drift precursors—and compare the user primarily against their own baseline rather than generic standards.

### FIS-038 — Early Drift Detection
Detect gradual decline before major failure and intervene with minimal friction.

### FIS-039 — Friction Intelligence
Locate where a user gets stuck in the chain from goal to execution and reduce the specific friction instead of merely applying motivational pressure.

### FIS-040 — Decision Debt
Detect unresolved decisions that consume attention or create path friction; prioritize and help resolve them.

### FIS-041 — Opportunity Intelligence
Detect opportunities arising from the combination of goals, capabilities, behavior, environment, learning, and context—not only risks.

### FIS-042 — Strategic No
Protect current priorities by distinguishing Capture from Execute. Preserve valuable ideas without allowing every idea to become an active commitment.

### FIS-043 — Counterfactual Path Simulator
Model alternative paths under different resources, time, constraints, and assumptions, including timeline, effort, risk, opportunity cost, and expected outcomes. Long-term foundation for multi-option comparison and scenario intelligence.

### FIS-044 — Life Season Intelligence
Understand the user's current season of life and dynamically adjust the relative weight of life domains rather than treating all OS domains as permanently equal.

### FIS-045 — Personal Navigation Memory
Remember the user's historical navigation patterns and surface relevant lessons when current circumstances resemble prior situations.

### FIS-046 — Personal Decision Pattern Intelligence
Understand how the person makes decisions: delay, over-analysis, risk tolerance, pressure effects, avoidance, successful patterns, and unsuccessful patterns. Improve decision quality without taking agency away.

### FIS-047 — Personal Energy Map
Model time-of-day and activity-specific energy, focus, learning, social capacity, and energy cost; plan using Time + Energy rather than time alone.

### FIS-048 — Recovery Intelligence
Detect when additional load is counterproductive and adapt pace, workload, recovery, and minimum viable progress while distinguishing recovery from persistent avoidance.

### FIS-049 — Personal Failure Pattern Intelligence
Turn repeated failure points into learning: Failure → Pattern → Learning → Architecture / Path Update.

### FIS-050 — Goal Ecology Intelligence
Evaluate significant goals across health, money, family, time, energy, relationships, learning, work, sleep, and mental capacity; offer alternative configurations rather than treating goals in isolation.

### FIS-051 — Personal Resource Graph
Model available time, energy, money, skills, knowledge, experience, people, tools, environment, reputation, and existing assets so paths can start with what the person actually has.

### FIS-052 — Personal Network Intelligence
With user permission, identify purpose-relevant people, expertise, mentorship, collaboration, and support. Connection with Purpose, not engagement for its own sake.

### FIS-053 — Knowledge-to-Action Engine
Convert knowledge into capability through learning, understanding, practice, application, feedback, improvement, and mastery.

### FIS-054 — Personal Opportunity Window
Assess time-sensitive opportunities using alignment, capacity, risk, timing, and opportunity cost; output Act Now, Monitor, or Strategic No where appropriate.

### FIS-055 — Personal Operating Constitution
Store user-authored principles and make them operational at decision/runtime level, while preserving user control and revisability.

### FIS-056 — Personal Digital Twin
Long-term architecture for scenario modeling under uncertainty using accumulated identity, values, goals, behavior, decisions, energy/capacity, skills, knowledge, relationships, resources, environment, history, preferences, risks, and opportunities. Digital Twin ≠ replacement of the human.

### FIS-057 — Personal Obstacle & Self-Sabotage Intelligence
Build a two-sided Goal map: Growth/Build side and Protect/Obstacle side. Detect contextual harmful patterns and repeated self-sabotage patterns using evidence; never label a user from a single behavior. Identify root causes, forecast risks, provide early warnings, and maintain a living Personal Risk Profile.

Core principles:
- Supportive / Neutral / Harmful classification is contextual.
- Positive traits can become harmful under particular conditions.
- Symptom ≠ Root Cause.
- DECIVEXA identifies risks; the user retains agency.
- Self-sabotage claims require evidence, context, and repeated patterns.

### FIS-058 — Security & Privacy Architecture
Privacy by Design, data ownership, user control, export/delete, selective encryption where appropriate, security/privacy constitution, permission boundaries, and explicit controls for sensitive integrations and agents.

### FIS-059 — Fluid Experience & Performance Architecture
Complexity behind the scenes must not become UI complexity or slowness. Immediate interaction, cached/local state, asynchronous intelligence, progressive intelligence, independent loading/failure boundaries, offline/poor-network resilience, performance budgets, RUM, resource-aware scheduling, and mobile-conscious CPU/RAM/battery behavior are architectural requirements.

Non-negotiable UX principle: No matter how intelligent DECIVEXA becomes, the user experience must remain fluid, immediate, calm and responsive.

### FIS-060 — Autonomous Continuity & AI-Independent Operation
AI is an intelligence layer, not the operating-system dependency. Core functionality remains useful and safe without continuous AI availability.

Principles:
- AI failure ≠ data failure.
- No AI, no data loss.
- No AI, no false intelligence.
- Core deterministic OS remains functional.
- Essential operations support offline/local continuity where appropriate.
- Last Known Good State is explicit.
- AI/provider abstraction prevents single-provider dependency.
- Deterministic rules remain independent of LLMs.
- Recovery analyzes offline-period events without rewriting history.
- Safe Mode protects core operation during degraded conditions.

## Earlier architecture families and capability areas

The project also includes broader established architecture concepts such as Personal Intelligence Core, Personal Development Model, Growth Navigation Engine, Progress Intelligence, Personal AI Coach, Research Assistant, Learning Intelligence, Human/Goal/Daily/Discipline/Health/Money/Learning/Business/Relationship/Review OS layers, Memory, Integration & Evidence Platform, Adaptive Recovery, Risk Intelligence, dynamic goal completion estimation, Founder-level analytics, and future agent/voice/predictive capabilities. These must remain subordinate to the canonical architecture and Founder-controlled gates.

## Benchmark-derived backlog candidates

These are learning-derived architecture backlog candidates, not automatic FIS approvals:

P1 Adaptive Path Scheduler
P2 Calm Daily Planning
P3 Zero-Friction Natural Input
P4 Proactive Life Intelligence
P5 Contextual Learning Engine
P6 Behavioral Coaching & Simulation
P7 Purpose-Driven Money Engine
P8 Passive Life Pattern Detection
P9 Contextual Knowledge Resurrection
P10 Personal Life Memory
P11 Scoped Autonomous Agents
P12 Emotional / Human UX

Cross-cutting candidate: Context Fusion Engine — fuse Goal + Sleep + Time + Learning + Money + Work + Habits + Behavior + Environment + History + Current Constraints to infer the most useful current-life action, rather than exposing raw data volume.

## Status discipline

The FIS registry is a baseline record. Individual implementation must still pass architecture review and Founder approval. Attractive ideas are not automatically Core capabilities.
