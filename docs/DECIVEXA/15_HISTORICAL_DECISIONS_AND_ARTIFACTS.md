# DECIVEXA Historical Decisions & Artifacts Register

## Purpose

This document preserves important historical context that explains how DECIVEXA reached its current direction.

It is intentionally separate from the current architecture. Historical decisions are evidence of the project's evolution; they are **not automatically current requirements**.

## 1. Historical Authority Rule

Historical information answers:

- What did we previously believe?
- What did we previously build?
- What changed?
- Why did the direction change?
- Which ideas were deferred rather than rejected?
- Which technical paths are obsolete?

Current repository code, approved architecture documents, and verified runtime evidence determine what is true today.

## 2. Product Evolution

### Phase A — Personal Decision Assistant

The project originally centered on helping a person make better decisions and stay aligned with personal goals.

### Phase B — Decision OS

The concept expanded into a personal operating system organized around a coherent model of the human, goals, decisions, execution, learning, and review.

### Phase C — Full Life Management Platform

The scope expanded further to coordinate major life domains while retaining Decision OS as the underlying philosophy and architecture.

### Phase D — DECIVEXA Brand

**DECIVEXA** became the product brand. **Decision OS** remained the architecture/philosophy name.

The technical rename was intentionally deferred until an Architecture Freeze / controlled rename point.

## 3. Historical Technology Direction

### Backend

- Earlier direction: Express
- Current direction: NestJS

The change reflects the need for stronger structure as the system grows into a modular, long-lived platform.

### Web

- Earlier direction: React + Vite
- Current direction: Next.js

### Mobile

Flutter was selected as the later mobile direction rather than making mobile the foundation before the core/web architecture stabilized.

## 4. Historical Architecture Concepts Preserved

The following concepts emerged over the project's evolution and remain strategically relevant even where implementation is deferred:

- Human Understanding System
- Personal Intelligence Core
- Personal Development Model (PDM)
- Growth Navigation Engine
- Progress Intelligence
- Personal AI Coach
- Research Assistant
- Decision AI
- Memory
- Digital Twin
- Agent architecture
- Voice interface
- Growth Communities
- AI-guided environment optimization
- AI-driven skill-gap analysis
- Risk Intelligence
- Adaptive Recovery Engine
- Dynamic goal completion estimation
- Trustworthy Navigation Architecture
- Integration & Evidence Platform

These concepts are preserved because they explain the intended long-term capability of DECIVEXA. Their presence here does not mean they are currently implemented.

## 5. Goal OS Evolution

Goal design became intentionally more sophisticated than a conventional task manager.

The preserved direction includes:

- Goal Discovery before Goal Creation when clarification is needed
- Goal Readiness
- Goal Ecology
- Goal Contract
- Goal Activation
- connections to Vision, Mission, Identity, and Priorities

A key architectural boundary was established:

**Goal OS designs and activates goals; Daily OS handles daily execution.**

This boundary should not be casually collapsed in future implementations.

## 6. Goal Guardian Historical Concept

A Goal Guardian / self-contract concept was developed around the principle:

**Daily goal is a ceiling, not a minimum.**

The historical model included:

1. Contract with self
2. A consequence for breaking the contract
3. A points/reinforcement system

This is preserved as behavioral/product-design knowledge. It should not be copied mechanically into unrelated architecture.

## 7. Human Development Philosophy

The project repeatedly emphasized that DECIVEXA should not become merely a productivity tracker.

The intended system should understand:

- who the person is
- what they value
- where they want to go
- why the goal matters
- what constraints exist
- what behavior is actually occurring
- what is working
- what is failing
- what evidence exists
- what should change next

This distinction is foundational to the evolution from productivity tooling to Decision OS.

## 8. Architecture Governance Evolution

The project established several governance principles during its evolution:

- Evidence Before Opinion
- Architecture Before Accumulation
- Development Freeze when the foundation must stabilize
- Architecture Backlog for deferred ideas
- Founder approval for material changes
- recovery anchors before risky work
- independent verification for important claims

These principles became more important as the project accumulated complexity.

## 9. Recovery History

A formal recovery baseline was established for L2.1.

Recorded historical anchors:

- original recovery baseline commit: `7d8b561`
- latest recorded Recovery Anchor: `5133626acff35aa8aaaf3c72614f40bc79ce679b`
- externally preserved recovery snapshot: 46 files
- final recovery bundle: `DECIVEXA-L2.1-FINAL-RECOVERY-BUNDLE.zip`

The recorded L2.1 state is:

**STATIC VERIFIED / RUNTIME BLOCKED**

This historical state must not be rewritten merely because later work progresses. New verified states should receive their own explicit record.

## 10. Runtime Limitation History

A previous sandbox environment could not install npm dependencies because registry egress was blocked and did not provide a PostgreSQL/container runtime.

This limitation is historically important because it explains why some static remediation was verified without claiming full runtime verification.

## 11. Drizzle Investigation History

A significant diagnostic investigation established malformed Drizzle snapshot errors.

Recorded path:

`Drizzle Kit → PostgreSQL → backwardCompatiblePgSchema → version 7 → safeParse(raw snapshot) → malformed snapshot result`

Affected snapshots:

- `0002_snapshot.json`
- `0003_snapshot.json`

Recorded errors:

- `0002_snapshot.json data is malformed`
- `0003_snapshot.json data is malformed`

Recorded versions:

- `drizzle-kit` 0.31.10
- `drizzle-orm` 0.44.7
- PostgreSQL snapshot validator version 7

Historical diagnostic conclusion:

**MALFORMED is proven. Exact field causing malformation was not yet proven.**

This distinction must survive into future investigations.

## 12. TypeORM Recovery / Wiring History

The L2.1 recovery work included static remediation/verification around:

- shared TypeORM DataSource through `dataSourceFactory`
- transactional context bootstrap
- repository dependency injection structure
- Throttler wiring

These records describe the recovery history and should be revalidated against the current codebase before being treated as current implementation truth.

## 13. Architecture Backlog Philosophy

Ideas that were valuable but premature were intentionally moved into a backlog instead of being discarded or implemented immediately.

This created a separation between:

**Current scope ↔ Deferred architecture ↔ Historical ideas.**

Future agents must preserve this separation.

## 14. Knowledge Preservation

The project recognized that important architecture knowledge must not remain trapped inside a private chat.

That led to the repository-level DECIVEXA documentation layer, including:

- Constitution
- Architecture
- Product Vision
- Module Map
- Architectural Decisions
- Current State
- Recovery Baseline
- Architecture Backlog
- Development Rules
- Evidence Protocol
- Engineering Handoff
- Project Knowledge Register
- Source of Truth Index
- Knowledge Base / Future Memory
- Completeness Audit
- this Historical Register

## 15. What Historical Records Must Not Do

Historical records must not:

- silently become current requirements
- override current code evidence
- resurrect rejected technical approaches without review
- turn abandoned experiments into architecture
- claim that planned features are implemented
- hide why a previous approach failed

## 16. What Future Agents Should Learn From History

A future implementation agent should use history to avoid repeating mistakes, not to blindly reproduce the past.

Before reviving an old idea, ask:

1. Why was it introduced?
2. Why was it deferred, changed, or abandoned?
3. Does the current architecture still support the original reason?
4. What new evidence exists?
5. Has the founder approved its revival if it is material?

## 17. Historical Status Vocabulary

Use these labels when adding historical records:

- **ADOPTED** — became a durable current decision.
- **SUPERSEDED** — replaced by a later decision.
- **DEFERRED** — intentionally postponed.
- **EXPERIMENTAL** — explored but not adopted.
- **REJECTED** — explicitly rejected.
- **RECOVERY ARTIFACT** — preserved for restoration/audit.
- **UNKNOWN** — historical status is not sufficiently established.

## 18. Final Boundary

This document is a map of DECIVEXA's evolution. It is not the implementation source of truth.

When history conflicts with current verified evidence:

**current verified evidence wins.**

When a current architectural decision needs historical rationale:

**this register provides the context.**

When an old idea is reconsidered:

**it must pass through the current constitution, architecture review, evidence protocol, backlog/governance rules, and founder approval where applicable.**
