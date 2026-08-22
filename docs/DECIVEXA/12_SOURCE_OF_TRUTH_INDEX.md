# DECIVEXA Source of Truth Index

This directory is the repository-level context layer for DECIVEXA.

## Reading Order for Humans and AI Agents

1. `12_SOURCE_OF_TRUTH_INDEX.md` — entry point and authority model.
2. `00_PROJECT_CONSTITUTION.md` — identity, principles, governance, truth hierarchy.
3. `01_ARCHITECTURE.md` — target architecture and boundaries.
4. `02_PRODUCT_VISION.md` — product purpose, differentiation, and experience.
5. `03_MODULE_MAP.md` — module responsibilities and boundaries.
6. `04_ARCHITECTURAL_DECISIONS.md` — durable architecture decisions and rationale.
7. `05_CURRENT_STATE.md` — current lifecycle, repository state, and active technical risks.
8. `06_RECOVERY_BASELINE.md` — recovery anchors and safety rules.
9. `07_ARCHITECTURE_BACKLOG.md` — deferred strategic capabilities.
10. `08_DEVELOPMENT_RULES.md` — implementation and engineering rules.
11. `09_EVIDENCE_PROTOCOL.md` — evidence classification and diagnostic discipline.
12. `10_HANDOFF.md` — onboarding contract for engineers and AI agents.
13. `11_PROJECT_KNOWLEDGE_REGISTER.md` — consolidated project knowledge and historical context.
14. `13_KNOWLEDGE_BASE_AND_FUTURE_MEMORY.md` — durable knowledge, future memory, research, and knowledge-base direction.
15. `14_COMPLETENESS_AUDIT.md` — coverage audit and explicit deferred capabilities.
16. `15_HISTORICAL_DECISIONS_AND_ARTIFACTS.md` — historical decisions, evolution, superseded approaches, experiments, and preserved artifacts.

## Authority Model

The documents are context and governance artifacts. They do not override actual repository/runtime evidence.

For implementation truth, inspect the repository.

For runtime truth, execute the relevant system in a capable environment.

For architecture truth, use the constitution and approved architectural decisions.

For deferred ideas, use the Architecture Backlog.

For historical context, use `15_HISTORICAL_DECISIONS_AND_ARTIFACTS.md`, the Knowledge Register, and git history.

For durable knowledge and future memory direction, use `13_KNOWLEDGE_BASE_AND_FUTURE_MEMORY.md`.

## Required Agent Behavior

Before material work, an AI agent should read this index and then the relevant documents in order. It must inspect the actual repository before modifying code.

## Maintenance Rule

When a durable product or architecture decision is made, update the relevant source-of-truth document. When a decision is deferred, update the backlog. When the verified state changes, update the current-state document. When a recovery anchor changes, update the recovery document. When durable knowledge or memory architecture evolves, update the knowledge-base document. When historical context is clarified, corrected, superseded, or expanded, update the historical register.

## Important Boundary

This directory is designed to prevent loss of project knowledge. It is not permission for an AI agent to treat every documented aspiration as an implemented feature. Each capability must be explicitly classified as implemented, verified, planned, backlog, or unknown.

Historical records are context, not current implementation authority. A historical decision marked superseded, deferred, experimental, rejected, recovery artifact, or unknown must not be silently promoted into current architecture.
