# DECIVEXA Development Rules

## 1. General

- Read the constitution and current-state documents before material work.
- Inspect the actual repository before proposing fixes.
- Do not assume a previous chat statement is current repository truth.
- Prefer the smallest change that solves the proven problem.
- Do not mix unrelated refactors into a diagnostic or recovery change.

## 2. Evidence

Use explicit labels:

- **PROVEN** — directly supported by repository/runtime/CI evidence.
- **OBSERVED** — directly seen but not yet fully explained.
- **INFERRED** — plausible explanation requiring verification.
- **UNKNOWN** — insufficient evidence.

Never promote INFERRED to PROVEN without a test or direct evidence.

## 3. AI Implementation Agents

When Claude Code is used:

1. Start with repository inspection.
2. For sensitive problems, use Plan/diagnostic mode first.
3. Do not modify files until the diagnosis and intended scope are explicit.
4. Work on an isolated branch for material changes.
5. Run relevant tests and checks.
6. Push changes and use CI as an independent verification layer.
7. Create a PR for review when the change is material.
8. Never let an AI agent silently redefine architecture.

## 4. Git Rules

- Protect known recovery anchors.
- Avoid force-pushing protected/history-critical branches.
- Use descriptive commits.
- Separate diagnosis from implementation where practical.
- Do not merge a fix solely because CI turns green if the underlying evidence contradicts the architectural diagnosis.

## 5. Migration Rules

Migration work requires additional discipline:

- verify configuration inputs
- inspect generated migration artifacts
- verify migration history ordering
- validate snapshot format
- reproduce parser errors when possible
- identify exact root cause before structural remediation
- run migration checks in a capable runtime

## 6. Runtime Rule

Static analysis, TypeScript compilation, source inspection, and configuration inspection cannot be described as runtime verification.

A runtime claim requires execution in an environment that actually provides the required dependencies, database, services, and configuration.

## 7. Development Freeze

During a Development Freeze:

- no speculative feature expansion
- no opportunistic architecture changes
- no dependency upgrades without explicit need
- backlog ideas are recorded, not silently implemented
- recovery state must remain protected

## 8. Documentation Rule

When a material architecture or state decision changes, update the relevant source-of-truth document in the same change set whenever practical.

## 9. Completion Rule

A task is complete only when its requested evidence exists. Code existence alone is not completion.
