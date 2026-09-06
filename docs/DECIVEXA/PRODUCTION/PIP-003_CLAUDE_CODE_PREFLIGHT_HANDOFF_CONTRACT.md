# DECIVEXA — PIP-003 Claude Code Preflight Handoff Contract

**Status:** FOUNDER-APPROVED — REGISTERED — EXECUTION NOT AUTHORIZED  
**Date:** 2026-09-06  
**Purpose:** Controlled handoff contract for the future Claude Code execution of PIP-003.

---

## 1. Mission

When execution is later authorized, Claude Code's mission is to determine the factual Production-readiness state of the current DECIVEXA repository without silently changing the system.

Claude Code is an executor of the approved preflight protocol, not an autonomous architect.

---

## 2. Required Reading Order

Before execution, Claude Code must read:

1. the current DECIVEXA governance corpus;
2. applicable architecture decisions/ADRs;
3. `docs/DECIVEXA/PRODUCTION/PIP-002_PRODUCTION_FOUNDATION_MASTER_PLAN.md`;
4. `docs/DECIVEXA/PRODUCTION/PIP-003_PRODUCTION_PREFLIGHT_REPOSITORY_ACCEPTANCE_SPEC.md`;
5. this handoff contract;
6. any later Founder-approved amendments or execution gate applicable to the current run.

Claude Code must not assume that a document written before the execution date is still current if later governance records supersede it.

---

## 3. Execution Mode

Default mode:

**READ / INSPECT / VERIFY / REPORT**

Not authorized by this contract:

- deployment;
- provisioning;
- DNS changes;
- database writes;
- schema changes;
- migration execution against Production;
- dependency upgrades;
- lockfile regeneration;
- architecture changes;
- product changes;
- secret creation/rotation;
- history rewriting;
- branch rewriting.

---

## 4. No Silent Repair

When a problem is discovered:

```text
FINDING
  -> CLASSIFY
  -> EVIDENCE
  -> IMPACT
  -> RECOMMENDATION
  -> STOP IF AUTHORIZATION IS REQUIRED
```

Do not silently fix the problem and then report the modified state as if it were the preflight state.

---

## 5. Material-Change Stop Rule

Stop immediately when resolution would require a material change to:

- product direction;
- architecture;
- schema/domain model;
- security architecture;
- technology selection;
- scope;
- AI/Intelligence architecture;
- existing Founder-approved decisions.

The report must identify the required Founder decision.

---

## 6. Repository Mutation Rule

PIP-003 is read-only by default.

Do not:

- reset;
- clean;
- stash;
- rebase;
- merge;
- rewrite history;
- modify tracked source;
- modify migrations;
- modify schemas;
- regenerate lockfiles;
- create production infrastructure.

If a command unexpectedly mutates repository state, stop and report it.

---

## 7. Database Rule

Do not mutate any real Production database during PIP-003.

Use an isolated disposable database for migration replay if such a test is authorized and available.

Never use Production data as a disposable test environment.

---

## 8. Secret Rule

Never print, commit, store, or report secret values.

Use redacted states only:

```text
PRESENT
MISSING
INVALID FORMAT
UNKNOWN
REDACTED
```

If a real secret is found in Git, classify it as a critical finding and stop before any automatic rotation or remediation unless separately authorized.

---

## 9. Evidence Rule

Every material acceptance claim must have evidence.

Prefer:

- command output;
- test output;
- build output;
- CI run identifiers;
- commit SHA;
- migration verification result;
- runtime verification result.

Record environment identity and timestamp where relevant.

Do not use vague phrases such as `looks good`, `should work`, or `probably safe` as acceptance evidence.

---

## 10. Runtime Block Rule

If the execution environment cannot provide a required runtime dependency — including package registry access, Docker, PostgreSQL, external APIs, or equivalent infrastructure — mark the relevant verification `BLOCKED`.

Never convert an environment limitation into `PASS`.

---

## 11. Existing DECIVEXA Runtime Status

The known distinction between static verification and real runtime verification must be preserved.

The existence of CI success, TypeScript correctness, or static inspection does not prove end-to-end Production runtime correctness.

Where runtime verification remains unavailable, record the exact limitation and required external verification.

---

## 12. AI Boundary

Do not use PIP-003 to activate or repair AI architecture.

In particular, do not implement or redesign:

- AIRuntime;
- AI Gateway;
- Model Router;
- Provider Adapter;
- capability registration;
- Context Engine;
- Memory schema;
- Evidence/Claim schema;
- Agent behavior;
- predictive intelligence.

If an AI limitation blocks the intended Production behavior, report it and stop for the appropriate decision/work item.

---

## 13. Required Final Report

Produce a report containing:

```text
Executive Summary
Repository Identity
Git State
Candidate Commit
Component Inventory
Dependency State
Build Verification
Test Verification
Environment Audit
Secret Audit
Docker Audit
PostgreSQL Audit
Drizzle/Migration Audit
Authentication Audit
Web/API Contract
External Dependencies
AI/Intelligence Dependency Classification
Security Audit
Operational Readiness
Runtime Status
Known Limitations
Blockers
Required Founder Decisions
Evidence Index
Final PIP-003 Status
```

---

## 14. Finding Format

For each material finding:

```text
Finding ID
Category
Severity
Status
Description
Evidence
Impact
Production relevance
Resolution type
Founder decision required?
Recommended next action
```

---

## 15. Final Status

The final PIP-003 result must be exactly one of:

- `ACCEPTED`
- `BLOCKED`
- `FAILED`

`ACCEPTED` means only that the repository has passed the preflight acceptance needed to proceed to the next separately authorized Production phase.

It does not mean `PRODUCTION READY`.

---

## 16. Mandatory Stop at Completion

After producing the final PIP-003 report, Claude Code must stop.

It must not automatically proceed to:

- server provisioning;
- deployment;
- DNS;
- database migration;
- backup setup;
- Production cutover.

A separate Founder-approved execution instruction is required for the next phase.

---

## 17. Core Commandment

> **Do not improvise around missing authorization, missing evidence, missing runtime, or material architectural decisions. Stop, document, and wait.**
