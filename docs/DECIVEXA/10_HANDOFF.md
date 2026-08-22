# DECIVEXA Engineering Handoff

## Purpose

This is the entry point for a new engineer or AI implementation agent joining DECIVEXA.

## Read First

1. `12_SOURCE_OF_TRUTH_INDEX.md`
2. `00_PROJECT_CONSTITUTION.md`
3. `01_ARCHITECTURE.md`
4. `02_PRODUCT_VISION.md`
5. `03_MODULE_MAP.md`
6. `04_ARCHITECTURAL_DECISIONS.md`
7. `05_CURRENT_STATE.md`
8. `06_RECOVERY_BASELINE.md`
9. `07_ARCHITECTURE_BACKLOG.md`
10. `08_DEVELOPMENT_RULES.md`
11. `09_EVIDENCE_PROTOCOL.md`
12. `11_PROJECT_KNOWLEDGE_REGISTER.md`

## Current Mission

Build DECIVEXA as a coherent Decision OS rather than a generic productivity product. Preserve the long-term ability to support a living personal model, memory, evidence, decision intelligence, growth navigation, personalized coaching, research assistance, agents, voice, predictive recommendations, and a future Digital Twin.

## Before Touching Code

A new agent must:

- inspect the current branch and repository tree
- inspect relevant source/configuration files
- inspect git history when history matters
- read the architecture and current-state documents
- read the consolidated project knowledge register
- identify whether the requested work is implementation, diagnosis, recovery, or architecture
- establish what is proven versus inferred
- check for an existing recovery anchor before risky work
- distinguish implemented capabilities from planned or backlog capabilities

## Current Known State

L2.1 is recorded as **STATIC VERIFIED / RUNTIME BLOCKED**.

Recovery anchor:

`5133626acff35aa8aaaf3c72614f40bc79ce679b`

Recovery baseline:

`7d8b561`

The previous environment could not provide npm registry installation or PostgreSQL/container runtime capability. Runtime claims therefore require an external capable environment.

## Current Drizzle Investigation

The known evidence establishes malformed snapshot failures for `0002_snapshot.json` and `0003_snapshot.json` through the Drizzle parsing/validation path.

Known versions recorded for the investigation:

- `drizzle-kit` 0.31.10
- `drizzle-orm` 0.44.7
- PostgreSQL validator snapshot version 7

Do not assume the exact malformed field is known. The next diagnostic goal is to isolate the precise structural/value cause before implementing a remediation.

Migration, snapshot, and schema artifacts must not be changed merely to hide the diagnostic failure.

## Preferred Engineering Workflow

`GitHub repository → Claude Code implementation → isolated branch → tests/verification → GitHub Actions → review → merge`

Termux remains available for runtime verification, GitHub CLI operations, recovery, and emergency work.

## Agent Contract

The implementation agent must not:

- silently change DECIVEXA philosophy
- bypass founder governance for material architecture decisions
- confuse static evidence with runtime evidence
- erase recovery history to make a change easier
- invent test results
- claim a root cause that has not been isolated
- treat aspirations as implemented features
- expand scope during a freeze

The agent should:

- preserve architectural boundaries
- minimize user input burden
- preserve future AI capability
- document material decisions
- leave reproducible evidence
- stop and report when evidence is insufficient
- update source-of-truth documentation when durable decisions or verified state change

## Handoff Completion Condition

A future agent should be able to enter this repository, read this directory, reconstruct the intended product, philosophy, architecture, module boundaries, strategic roadmap, current lifecycle/recovery state, active technical risks, and engineering governance, then continue work without requiring a private chat transcript as its primary source of truth.
