# DECIVEXA Evidence Protocol

## Purpose

DECIVEXA uses **Evidence Before Opinion** as an engineering and product-governance rule.

## Evidence Classes

### E0 — Conversation / Proposal

A statement discussed by humans or agents. Useful context, not repository truth.

### E1 — Static Repository Evidence

Files, configuration, source code, dependency manifests, git history, and generated artifacts that can be directly inspected.

### E2 — Automated Verification

Tests, linters, type checks, build checks, migration checks, or CI outputs with reproducible commands.

### E3 — Runtime Evidence

Observed behavior in an environment with the real dependencies/services required by the claim.

### E4 — Independent Verification

Evidence produced by an independent verification path, such as GitHub Actions or a separate runtime environment, confirming a material claim.

## Claim Rules

Every material technical diagnosis should answer:

1. What is observed?
2. What is proven?
3. What is inferred?
4. What remains unknown?
5. What experiment would distinguish the hypotheses?
6. What evidence is required before changing architecture?

## Example: Drizzle Snapshot Investigation

Observed error:

`0002_snapshot.json data is malformed`

`0003_snapshot.json data is malformed`

Proven conclusion:

The affected snapshot data is rejected as malformed by the relevant Drizzle parsing/validation path.

Not yet proven:

The exact field, value, or structural incompatibility causing the rejection.

Therefore an agent must not claim an exact root cause until it isolates the responsible field/structure through direct inspection, controlled reproduction, parser/schema evidence, or another reproducible experiment.

## CI Evidence

A green CI run proves only what that workflow actually executes and asserts. A green workflow must not be generalized into proof of runtime behavior it never tests.

Likewise, a red workflow is evidence of a failing condition, not automatically proof of the underlying architectural cause.

## Evidence Preservation

For important investigations preserve:

- command or workflow used
- commit SHA
- branch
- environment assumptions
- relevant logs
- artifacts
- exact observed error
- conclusion and confidence

## Decision Threshold

Architecture changes require stronger evidence than ordinary implementation changes. If two hypotheses remain plausible, prefer a diagnostic experiment over a speculative fix.
