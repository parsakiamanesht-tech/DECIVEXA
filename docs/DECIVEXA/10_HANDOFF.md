# DECIVEXA Engineering Handoff

## Purpose

This is the entry point for a new engineer or AI implementation agent joining DECIVEXA.

## Read First

1. `00_PROJECT_CONSTITUTION.md`
2. `01_ARCHITECTURE.md`
3. `02_PRODUCT_VISION.md`
4. `03_MODULE_MAP.md`
5. `04_ARCHITECTURAL_DECISIONS.md`
6. `05_CURRENT_STATE.md`
7. `06_RECOVERY_BASELINE.md`
8. `07_ARCHITECTURE_BACKLOG.md`
9. `08_DEVELOPMENT_RULES.md`
10. `09_EVIDENCE_PROTOCOL.md`

## Current Mission

Build DECIVEXA as a coherent Decision OS rather than a generic productivity product. Preserve the long-term ability to support a living personal model, memory, evidence, decision intelligence, growth navigation, personalized coaching, research assistance, agents, voice, predictive recommendations, and a future Digital Twin.

## Before Touching Code

A new agent must:

- inspect the current branch and repository tree
- inspect relevant source/configuration files
- inspect git history when history matters
- read the architecture and current-state documents
- identify whether the requested work is implementation, diagnosis, recovery, or architecture
- establish what is proven versus inferred
- check for an existing recovery anchor before risky work

## Current Known State

L2.1 is recorded as **STATIC VERIFIED / RUNTIME BLOCKED**.

Recovery anchor:

`5133626acff35aa8aaaf3c72614f40bc79ce679b`

Recovery baseline commit:

`7d8b561`

The previous environment could not provide npm registry installation or PostgreSQL/container runtime capability. Runtime claims therefore require an external capable environment.

## Current Drizzle Investigation

The known evidence establishes malformed snapshot failures for `0002_snapshot.json` and `0003_snapshot.json` through the Drizzle parsing/validation path.

Do not assume the exact malformed field is known. The next diagnostic goal is to isolate the precise structural/value cause before implementing a remediation.

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
- expand scope during a freeze

The agent should:

- preserve architectural boundaries
- minimize user input burden
- preserve future AI capability
- document material decisions
- leave reproducible evidence
- stop and report when evidence is insufficient

## Handoff Completion Condition

A future agent should be able to enter this repository, read this directory, reconstruct the intended product and architecture, understand the current lifecycle/recovery state, identify active risks, and continue work without requiring a private chat transcript as its primary source of truth.
