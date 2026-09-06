# DECIVEXA Production Governance

This directory is the canonical home for the Founder-approved Production Foundation and preflight records.

## Current Status

**Production execution: NOT AUTHORIZED**  
**Production Ready: NOT GRANTED**  
**Initial infrastructure decision: Hetzner Cloud CX53 — Germany**

## Canonical Documents

1. `PIP-002_PRODUCTION_FOUNDATION_MASTER_PLAN.md`
   - Initial Production infrastructure architecture and operational foundation.
   - Defines security, networking, Docker, PostgreSQL, backup/recovery, observability, scaling, rollback, and governance principles.

2. `PIP-003_PRODUCTION_PREFLIGHT_REPOSITORY_ACCEPTANCE_SPEC.md`
   - Read-only-first repository and Production Candidate acceptance protocol.
   - Determines whether the current repository commit can proceed to controlled Production execution.

3. `PIP-003_CLAUDE_CODE_PREFLIGHT_HANDOFF_CONTRACT.md`
   - Controlled Claude Code handoff contract for the later, separately authorized PIP-003 execution.

## Required Sequence

```text
PIP-002
Production Foundation Design
        |
        v
PIP-003
Repository / Production Candidate Preflight
        |
        +---- BLOCKED / FAILED -> STOP
        |
        v
Production Candidate
        |
        v
Separate Founder-approved execution gate
        |
        v
PIP-004
Controlled Production Infrastructure Execution
        |
        v
PIP-005
External Runtime Verification
        |
        v
PIP-006
Backup / Restore / Disaster Recovery Verification
        |
        v
PIP-007
Security / Performance / Operational Acceptance
        |
        v
Final Founder Production Acceptance
```

## Governance Rule

No document in this directory, by itself, authorizes implementation, deployment, database mutation, DNS cutover, secret creation, or Production acceptance.

Material changes remain Founder-gated.

## Status Vocabulary

- `PASS` — verified with evidence;
- `FAIL` — tested and failed;
- `BLOCKED` — required verification cannot currently be performed;
- `NOT TESTED` — not yet tested.

`BLOCKED` and `NOT TESTED` are never equivalent to `PASS`.
