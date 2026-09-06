# DECIVEXA — PIP-003 Production Preflight & Repository Acceptance Specification

**Document ID:** PIP-003  
**Version:** 1.0  
**Status:** FOUNDER-APPROVED — ARCHITECTURALLY REGISTERED — EXECUTION NOT AUTHORIZED  
**Date:** 2026-09-06  
**Founder:** Parsa Kiamanesh  
**Executor:** Claude Code, only under the applicable Founder-approved execution gate  
**Purpose:** Determine whether the current DECIVEXA repository can be accepted as a Production Candidate before Production infrastructure execution.

---

## 1. Purpose

PIP-003 is a read-only-first, evidence-based preflight and acceptance specification.

Its purpose is not to deploy DECIVEXA and not to repair the repository. Its purpose is to establish the factual state of the current approved repository and determine whether a specific commit can become a valid Production Candidate.

The primary sequence is:

```text
DISCOVER
  -> VERIFY
  -> CLASSIFY
  -> REPORT
```

PIP-003 must not silently become:

```text
DISCOVER
  -> REFRACTOR
  -> REDESIGN
  -> MIGRATE
  -> DEPLOY
```

---

## 2. Non-Authorization

PIP-003 does not authorize:

- Production provisioning;
- Production deployment;
- DNS cutover;
- database mutation;
- schema changes;
- migration generation or modification;
- architecture changes;
- product changes;
- AI implementation;
- Context Engine changes;
- Observation/Event implementation;
- FIS implementation;
- dependency upgrades that materially alter the system;
- framework migration;
- security architecture redesign.

PIP-003 is an acceptance/preflight activity only.

---

## 3. Founder Governance

DECIVEXA material changes require explicit Founder approval.

If a finding can only be resolved through a material change to product, architecture, schema, security architecture, scope, technology, or another governed area, Claude Code must:

1. stop;
2. record the finding;
3. explain the evidence and impact;
4. identify the decision required;
5. wait for explicit Founder authorization.

Silence, convenience, or inferred necessity is not authorization.

---

## 4. Official Status Vocabulary

Every check must use exactly one of:

### PASS
The check was executed and evidence demonstrates that the acceptance condition is satisfied.

### FAIL
The check was executed and the acceptance condition was not satisfied.

### BLOCKED
The check could not be executed because a required dependency, environment, permission, runtime, or other real prerequisite was unavailable.

### NOT TESTED
The check has not been performed.

Rules:

- `BLOCKED` is never `PASS`.
- `NOT TESTED` is never `PASS`.
- assumptions are not evidence.
- old CI success does not automatically establish current-commit runtime correctness.

---

## 5. Severity Classification

### P0 — Critical
A critical security, data-integrity, runtime, deployment, or recovery problem that blocks Production Candidate acceptance.

Examples:

- production secret exposure;
- unknown production database state before mutation;
- irrecoverable/malformed migration state;
- critical authentication failure;
- inability to produce the required production build.

### P1 — High
A serious issue that normally blocks Production progression until resolved or explicitly accepted by the Founder.

### P2 — Medium
Important issue or limitation that may not block launch but must be recorded and dispositioned.

### P3 — Low
Non-critical improvement or known limitation.

---

## 6. Phase 0 — Governance Preflight

Verify and record:

- applicable Founder approvals;
- scope of PIP-003;
- prohibited changes;
- current known project status;
- relevant ADRs and gates.

Acceptance condition:

Claude Code demonstrates that it understands PIP-003 as an inspection/acceptance activity rather than an implementation task.

---

## 7. Phase 1 — Repository Identity

Record:

- repository identity;
- remote URL;
- default branch;
- current branch;
- HEAD commit SHA;
- relevant recent commits;
- working tree state;
- untracked files;
- local-only commits;
- divergence from the intended remote state.

A Production Candidate must be tied to an exact commit SHA.

---

## 8. Git Integrity

Verify:

- no unexpected detached HEAD;
- no unexplained uncommitted changes;
- no unexplained untracked files;
- candidate commit is identifiable;
- branch/remote relationship is understood.

A dirty or ambiguous repository state is `BLOCKED` unless explicitly explained and approved.

PIP-003 must not clean, reset, stash, rebase, merge, or rewrite history.

---

## 9. GitHub / Remote State

Where access permits, compare local candidate state with the relevant remote state and recent accepted changes.

Record:

- candidate commit;
- relevant merged PRs;
- relevant open PRs;
- known branch divergence;
- whether current local state contains unexpected changes.

Historical CI evidence must be tied to the exact commit it tested.

---

## 10. Phase 2 — Repository Component Inventory

Inventory actual repository components rather than assuming a structure.

At minimum identify, where present:

- Web application;
- API/backend;
- shared packages;
- database/schema layer;
- migrations;
- tests;
- CI workflows;
- Docker configuration;
- operational scripts;
- AI/intelligence components;
- documentation/governance records.

For each component record:

```text
Exists
Buildable
Testable
Production-relevant
Runtime dependency
Known limitation
```

---

## 11. Phase 3 — Dependency Audit

Inspect:

- package manager;
- lockfile;
- Node/runtime version declarations;
- workspace configuration;
- package scripts;
- native dependencies;
- install/postinstall behavior;
- dependency version consistency.

Do not upgrade dependencies merely because newer versions exist.

---

## 12. Lockfile Integrity

Verify consistency between package manifests and lockfiles.

A missing, stale, or inconsistent lockfile must be classified with evidence.

PIP-003 must not silently regenerate a lockfile and treat that mutation as verification.

---

## 13. Runtime Version Consistency

Compare repository-declared runtime requirements across relevant sources, such as:

- package `engines`;
- `.nvmrc` or equivalent;
- Dockerfiles;
- CI configuration;
- documented runtime requirements.

Do not change versions without separate authorization.

---

## 14. Phase 4 — Build Verification

Verify production buildability of all Production-relevant components.

At minimum:

### Web

- production build;
- production start/runtime command identified.

### API

- production build;
- production start/runtime command identified.

### Shared components

Build/typecheck as applicable.

A build failure is a direct Production Candidate blocker unless a later approved decision explicitly changes the acceptance criteria.

---

## 15. Test Inventory and Execution

Inventory:

- unit tests;
- integration tests;
- end-to-end tests;
- architecture tests;
- database tests;
- security-related tests;
- CI tests.

For executed tests record:

- command;
- commit;
- result;
- skipped tests;
- unavailable tests;
- environment limitation.

Do not hide skipped or unavailable tests.

---

## 16. CI Evidence

CI results must be correlated to the exact commit under consideration.

Record:

```text
Workflow
Run
Commit SHA
Date/time
Result
Relevant artifacts
```

A green historical run on a different commit is historical evidence, not current Production Candidate acceptance.

---

## 17. Phase 5 — Environment Audit

Inventory configuration requirements without exposing secret values.

Classify each variable as applicable:

- required/optional;
- build-time/runtime;
- public/client-visible/server-only;
- secret/non-secret.

For secret values, report only states such as:

```text
PRESENT
MISSING
REDACTED
INVALID FORMAT
UNKNOWN
```

Never print production secret values into logs or reports.

---

## 18. Secret Exposure Audit

Inspect repository history/current files for accidental exposure of:

- passwords;
- API keys;
- database credentials;
- JWT/auth secrets;
- private keys;
- cloud credentials;
- AI/provider credentials;
- other privileged secrets.

A confirmed real production secret committed to Git is P0 and blocks Production.

If historical exposure exists, record whether rotation/revocation is required; do not rotate credentials automatically unless separately authorized.

---

## 19. Environment Completeness

For every production-required variable:

```text
Required -> Present / Missing / Unknown
```

A missing production-critical value is a blocker for the relevant runtime phase.

PIP-003 does not create production credentials.

---

## 20. Next.js Client/Server Secret Boundary

Verify that server-only secrets are not accidentally exposed through client/public configuration or browser bundles.

Any material security flaw must be reported rather than silently redesigned during preflight.

---

## 21. Phase 6 — Docker Readiness

If Docker configuration exists, inspect:

- base image;
- runtime version;
- build stages;
- runtime stage;
- exposed ports;
- startup commands;
- environment assumptions;
- user/privilege model;
- filesystem behavior;
- network mode;
- mounts;
- health checks.

PIP-003 must not create a new production Docker architecture merely because current Docker support is incomplete.

---

## 22. Container Security Audit

Identify:

- privileged containers;
- root runtime;
- host networking;
- broad host filesystem mounts;
- Docker socket access;
- unnecessary capabilities;
- unnecessary public ports.

Classify each finding by actual risk.

Do not weaken security merely to make a container start.

---

## 23. Docker Reproducibility

Determine whether the current application can be built from the declared dependency state in a clean environment.

If external network access, package registry access, or other infrastructure is unavailable, mark the check `BLOCKED` and record the exact limitation.

Do not treat sandbox restrictions as evidence that the application itself is correct or incorrect.

---

## 24. Phase 7 — PostgreSQL Audit

Determine actual database architecture and configuration:

- PostgreSQL version;
- database configuration;
- connection configuration;
- persistence model;
- migrations;
- schema source;
- connection pooling behavior if configured;
- backup assumptions;
- production data state if a real database exists.

Do not mutate the database during PIP-003.

---

## 25. Drizzle / Migration Integrity

Given DECIVEXA's prior Drizzle snapshot/migration issues, this is a critical verification area.

Compare:

```text
Schema source
   -> migration files
   -> snapshot/metadata state
   -> expected database state
   -> actual database state, if safely available
```

Look for:

- malformed snapshots;
- broken migration sequence;
- duplicate/conflicting definitions;
- missing migration state;
- schema drift;
- migration/application incompatibility.

No migration generation or modification is permitted by PIP-003.

---

## 26. Clean Database Migration Test

Where an isolated disposable PostgreSQL environment is available, verify:

```text
Empty database
   -> complete migration chain
   -> expected final schema
```

The test must not use or mutate production data.

If the required database runtime is unavailable, status is `BLOCKED`.

---

## 27. Existing Database State

If a real Production database exists, determine its state before any future mutation:

- empty/non-empty;
- migration level;
- schema identity;
- seed status;
- known data provenance.

Unknown production database state is P0.

---

## 28. Seed Data Audit

Distinguish:

- development seed;
- test seed;
- Production seed.

Verify that development/test seed logic cannot accidentally populate Production with inappropriate data.

Do not modify seed behavior during PIP-003.

---

## 29. Phase 8 — Authentication Preflight

Review the current approved authentication implementation and its Production assumptions.

Where runtime is available, verify at least:

- registration;
- login;
- valid credential behavior;
- invalid credential behavior;
- token issuance;
- protected route behavior;
- invalid/expired token behavior where applicable.

Do not redesign authentication during this phase.

---

## 30. Authentication Security Review

Inspect:

- password handling;
- token secret configuration;
- token transport;
- cookie/header behavior;
- CORS;
- CSRF implications where applicable;
- rate-limiting assumptions;
- error leakage.

Critical flaws are blockers and require controlled corrective work.

---

## 31. Phase 9 — Web/API Contract

Verify configuration and interfaces between:

```text
Next.js Web
   -> NestJS API
      -> PostgreSQL
```

Check:

- API base URL configuration;
- environment separation;
- CORS origins;
- credentials behavior;
- expected API paths;
- production hostname assumptions.

---

## 32. CORS / Public Surface Audit

Identify:

- allowed origins;
- allowed methods;
- allowed headers;
- credential behavior;
- wildcard configuration.

Unexpectedly broad public access must be classified according to risk.

---

## 33. Phase 10 — External Dependency Inventory

Inventory all external dependencies actually used by the current candidate, such as:

- database;
- AI providers;
- email;
- storage;
- OAuth;
- payments;
- external APIs;
- telemetry/monitoring.

For each record:

```text
Required?
Configured?
Reachable?
Verified?
Production blocker?
```

Do not add new services merely to eliminate a documentation gap.

---

## 34. AI / Intelligence Scope Boundary

The current AI architecture must be audited only to the extent necessary to determine Production dependencies.

PIP-003 does not authorize:

- AI Runtime completion;
- provider selection;
- provider integration;
- capability registration;
- Model Router implementation;
- Context Engine redesign;
- memory/schema changes;
- agent implementation;
- predictive intelligence implementation.

ADR-009 and other applicable AI architecture decisions remain authoritative.

---

## 35. AIRuntime / Context Dependency Classification

If `AIRuntime.execute()` or Context resolution is unavailable in the current candidate, determine whether the actual Production-relevant application path depends on it.

If the unavailable path is required for the intended Production behavior:

```text
Production Candidate = BLOCKED
```

If it is not required for the intended current Production behavior:

- record it as a known limitation;
- preserve the existing architectural boundary;
- do not implement it during PIP-003.

---

## 36. Phase 11 — Security Preflight

Review:

### Repository

- secret exposure;
- dangerous scripts;
- dependency risk.

### Runtime assumptions

- debug mode;
- verbose errors;
- unsafe defaults.

### Application

- authentication;
- authorization assumptions;
- CORS;
- public surfaces;
- error leakage.

### Database

- public exposure;
- credential handling;
- persistence assumptions.

### Infrastructure readiness

- firewall requirements;
- SSH requirements;
- TLS requirements.

---

## 37. Dependency Security

Where vulnerability scanning is available, record:

- package;
- advisory/severity;
- affected status;
- available remediation;
- whether remediation is breaking/material.

Do not silently upgrade dependencies if the upgrade may change architecture, APIs, runtime behavior, or security posture materially.

---

## 38. Production Debug / Error Behavior

Verify whether the candidate would expose:

- stack traces;
- SQL errors;
- internal filesystem paths;
- credentials;
- unnecessary implementation details.

Unsafe behavior is a finding and may block Production depending on severity.

---

## 39. Phase 12 — Operational Readiness Preflight

Determine whether the candidate has identified operational mechanisms for:

- startup;
- shutdown;
- health checking;
- logs;
- database backup;
- restore;
- rollback;
- deployment version identification.

PIP-003 does not execute the final Production operations; it determines whether their prerequisites are understood.

---

## 40. Backup Readiness

Record whether the planned Production design has identified:

- backup mechanism;
- backup schedule;
- retention;
- destination;
- encryption approach;
- verification method;
- restore procedure.

If actual backup/restore has not yet been tested, it must remain `NOT TESTED` or `BLOCKED` as appropriate.

---

## 41. Recovery Readiness

The planned recovery sequence must be understandable for:

```text
Server loss
   -> replacement infrastructure
   -> security baseline
   -> deployment
   -> secrets
   -> database restore
   -> DNS/TLS
   -> runtime verification
```

PIP-003 does not claim that this sequence has been operationally proven; later gates must establish that.

---

## 42. Rollback Readiness

Identify:

- current candidate version;
- previous known version;
- deployment mechanism;
- application rollback path;
- database recovery implications.

Application rollback must not be confused with database rollback.

---

## 43. Phase 13 — Production Candidate Assessment

At the end of inspection, produce a single assessment report.

Required sections:

1. Executive Summary
2. Repository Identity
3. Git State
4. Candidate Commit
5. Component Inventory
6. Dependency State
7. Build Verification
8. Test Verification
9. Environment Audit
10. Secret Audit
11. Docker Audit
12. PostgreSQL Audit
13. Drizzle/Migration Audit
14. Authentication Audit
15. Web/API Contract
16. External Dependencies
17. AI/Intelligence Dependency Classification
18. Security Audit
19. Operational Readiness
20. Runtime Status
21. Known Limitations
22. Blockers
23. Required Founder Decisions
24. Evidence Index
25. Final PIP-003 Status

---

## 44. Finding Record Format

Every material finding must include:

```text
Finding ID:
Category:
Severity:
Status:
Description:
Evidence:
Impact:
Production relevance:
Can be resolved without material change?:
Founder decision required?:
Recommended next action:
```

---

## 45. Founder Decision Register

Any unresolved decision requiring Founder authority must be recorded separately with:

```text
Decision ID
Question
Context
Evidence
Options
Recommendation
Risks
Founder Decision
Decision Date
```

Claude Code must not fill a Founder decision by inference.

---

## 46. Evidence Standard

Evidence should be machine-verifiable whenever possible:

- command output;
- test result;
- build result;
- CI run;
- commit SHA;
- migration result;
- configuration inspection;
- runtime result.

Screenshots alone are insufficient where a reproducible command/result is available.

Each material evidence item should identify its environment and commit where relevant.

---

## 47. Runtime Evidence Identity

For runtime evidence record, where applicable:

```text
Environment
OS
Node/runtime
Docker
PostgreSQL
Commit SHA
Timestamp
Command/test
Result
```

This prevents stale evidence from being mistaken for current verification.

---

## 48. Sandbox Limitation Rule

If the available execution environment cannot install dependencies, run Docker, start PostgreSQL, access required external services, or otherwise perform a required runtime check:

**Do not convert the limitation into PASS.**

Use:

```text
BLOCKED — environment limitation
```

and identify the required external runtime verification.

This preserves the known DECIVEXA distinction between static verification and runtime verification.

---

## 49. No-Modification Rule

Default PIP-003 behavior is read-only.

The following are prohibited during PIP-003 unless separately and explicitly authorized:

- source modification;
- schema modification;
- migration modification;
- dependency upgrades;
- lockfile regeneration;
- branch rewriting;
- history rewriting;
- database writes;
- production deployment;
- DNS changes;
- secret creation/rotation;
- infrastructure provisioning.

If an inspection command itself mutates state unexpectedly, stop and report the mutation.

---

## 50. Database Read-Only Rule

If a real database is inspected during PIP-003, use non-mutating inspection wherever possible.

No:

- INSERT;
- UPDATE;
- DELETE;
- ALTER;
- DROP;
- migration execution;
- seed execution.

Use an isolated disposable database for migration replay tests.

---

## 51. No Silent Fix Rule

If a problem is discovered:

```text
Finding
  -> classify
  -> report
```

not:

```text
Finding
  -> fix
  -> continue
```

A separate corrective work item must be created for implementation work.

---

## 52. Corrective Work Separation

Where remediation is needed:

```text
PIP-003 Finding
      -> Corrective Work Item
      -> Founder approval if required
      -> Implementation
      -> Targeted re-verification
```

This preserves evidence integrity and prevents audit results from being contaminated by untracked changes.

---

## 53. Commit-Bound Acceptance

PIP-003 acceptance applies to an exact commit.

If the repository changes materially after acceptance:

- the candidate identity changes;
- relevant checks must be rerun;
- the old acceptance cannot be silently reused.

---

## 54. Production Candidate Decision

The final PIP-003 status is one of:

### ACCEPTED
The repository is sufficiently understood and no unresolved critical blocker prevents progression to the controlled Production Execution phase.

### BLOCKED
A required verification or prerequisite is unavailable or unresolved.

### FAILED
A required condition was tested and did not pass.

`ACCEPTED` means **accepted as a Production Candidate for the next phase**. It does not mean Production Ready.

---

## 55. PIP-003 Acceptance Criteria

PIP-003 may be accepted only when:

### Repository

- identity known;
- candidate commit known;
- Git state understood;
- remote relationship understood.

### Application

- Production-relevant components identified;
- production builds verified or explicitly blocked with an acceptable external verification plan;
- tests/status understood.

### Dependencies

- dependency state understood;
- lockfile state understood;
- runtime versions understood.

### Database

- migration chain understood;
- Drizzle snapshot/metadata state understood;
- no unresolved critical schema integrity issue;
- existing database state known if applicable.

### Environment

- production-required variables identified;
- secret exposure checked;
- client/server secret boundaries checked.

### Security

- critical secret exposure absent;
- critical unsafe runtime behavior identified;
- major blockers classified.

### Runtime

- runtime-tested items identified;
- blocked runtime items explicitly identified;
- no false PASS claims.

### Governance

- no unauthorized modifications;
- Founder decisions clearly separated from technical findings.

### Evidence

- material claims supported by reproducible evidence.

---

## 56. Handoff to PIP-004

If PIP-003 is accepted, the next authorized design/execution stage is the controlled Production Infrastructure Execution plan.

PIP-003 does not automatically authorize PIP-004.

The intended sequence is:

```text
PIP-003 ACCEPTED
      -> Production Candidate
      -> separate Founder-approved execution gate
      -> PIP-004
```

---

## 57. Required PIP-003 Output Artifact

The execution must produce a repository audit/acceptance report equivalent to:

`PRODUCTION_PREFLIGHT_REPORT.md`

The exact repository path must be determined from the existing documentation structure before writing. Creating or changing repository documentation is itself a repository mutation and therefore requires the applicable execution authorization.

---

## 58. Core Invariants

1. **Inspect before changing.**
2. **Evidence before assertion.**
3. **BLOCKED is not PASS.**
4. **CI success is not runtime success.**
5. **Static verification is not production readiness.**
6. **Backup success is not restore success.**
7. **Application rollback is not database recovery.**
8. **A Production Candidate is tied to a commit.**
9. **Material changes require Founder approval.**
10. **PIP-003 must not silently become implementation.**

---

## 59. Implementation Authorization

**PIP-003 implementation authorization: NOT GRANTED by this document.**

Execution may begin only through a separate Founder-approved execution instruction using the controlled Claude Code handoff protocol.
