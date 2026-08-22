# DECIVEXA Source of Truth Index

This directory is the repository-level context layer for DECIVEXA.

## Reading Order for Humans and AI Agents

1. `00_PROJECT_CONSTITUTION.md` — identity, principles, governance, truth hierarchy.
2. `01_ARCHITECTURE.md` — target architecture and boundaries.
3. `02_PRODUCT_VISION.md` — product purpose, differentiation, and experience.
4. `03_MODULE_MAP.md` — module responsibilities and boundaries.
5. `04_ARCHITECTURAL_DECISIONS.md` — durable architecture decisions and rationale.
6. `05_CURRENT_STATE.md` — current lifecycle, repository state, and active technical risks.
7. `06_RECOVERY_BASELINE.md` — recovery anchors and safety rules.
8. `07_ARCHITECTURE_BACKLOG.md` — deferred strategic capabilities.
9. `08_DEVELOPMENT_RULES.md` — implementation and engineering rules.
10. `09_EVIDENCE_PROTOCOL.md` — evidence classification and diagnostic discipline.
11. `10_HANDOFF.md` — onboarding contract for engineers and AI agents.
12. `11_PROJECT_KNOWLEDGE_REGISTER.md` — consolidated project knowledge and historical context.

## Authority Model

The documents are context and governance artifacts. They do not override actual repository/runtime evidence.

For implementation truth, inspect the repository.

For runtime truth, execute the relevant system in a capable environment.

For architecture truth, use the constitution and approved architectural decisions.

For deferred ideas, use the Architecture Backlog.

For historical context, use the Knowledge Register and git history.

## Required Agent Behavior

Before material work, an AI agent should read this index and then the relevant documents in order. It must inspect the actual repository before modifying code.

## Maintenance Rule

When a durable product or architecture decision is made, update the relevant source-of-truth document. When a decision is deferred, update the backlog. When the verified state changes, update the current-state document. When a recovery anchor changes, update the recovery document.

## Important Boundary

This directory is designed to prevent loss of project knowledge. It is not permission for an AI agent to treat every documented aspiration as an implemented feature. Each capability must be explicitly classified as implemented, verified, planned, backlog, or unknown.
