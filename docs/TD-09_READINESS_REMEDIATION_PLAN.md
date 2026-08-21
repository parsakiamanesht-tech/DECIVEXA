# TD-09 — Readiness Remediation Plan

**Status:** OPEN — NO BUILD AUTHORIZATION  
**Governing Architecture:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`  
**Technology Baseline:** `TD-08`  
**Purpose:** Close evidence gaps identified during the TD-09 criterion-by-criterion readiness review before any new implementation increment is authorized.

## 1. Governance Position

This plan is a remediation/evidence plan only. It does **not** authorize implementation, architecture changes, technology changes, cloud selection, or production deployment.

The only previously implemented and verified foundation relevant to this review is the authentication foundation. Its CI/runtime evidence is historical evidence for that increment and is not blanket authorization for future scope.

## 2. Blocking Findings

### R1 — Define the First Implementation Increment
**Priority:** BLOCKING

A new implementation increment must be explicitly defined before TD-09 can reach Build Authorized status.

Required record:
- exact scope;
- explicit non-goals;
- affected architecture boundaries;
- acceptance criteria;
- required CI and runtime evidence;
- security/privacy impact;
- data/migration impact;
- rollback/recovery expectations;
- any material Founder decision required.

The increment must not be allowed to expand its own scope during execution.

### R2 — Reconcile PostgreSQL CI Version With TD-08
**Priority:** BLOCKING

TD-08 establishes PostgreSQL 18.x as the approved authoritative database line, while the current API verification workflow uses `postgres:16`.

Required resolution before Build Authorization:
1. update verification infrastructure to the approved PostgreSQL 18.x line, **or**
2. produce a documented compatibility exception and obtain the required Founder approval if the exception is material.

Preferred resolution: align CI with the approved PostgreSQL 18.x baseline and verify migrations/runtime behavior against it.

### R3 — Migration Recovery / Rollback Evidence
**Priority:** BLOCKING FOR DB-AFFECTING INCREMENTS

Current CI demonstrates migration generation/application, but does not by itself establish a verified recovery/rollback path.

Before any database-affecting increment is Build Authorized, provide:
- migration forward-path verification;
- recovery/rollback strategy;
- destructive-change policy;
- failure/retry behavior;
- evidence that the documented recovery path is executable or otherwise verified at the appropriate level.

If the approved increment is proven to be non-database-affecting, this item may be marked not-applicable for that increment with explicit evidence.

### R4 — Backup / Restore Evidence
**Priority:** CONDITIONAL / BLOCKING FOR PERSISTENCE-CRITICAL INCREMENTS

TD-09 currently lacks repository/runtime evidence for backup and restore.

Before a persistence-critical increment is authorized, define and verify the applicable backup/restore and data-recovery path. If the first increment does not require operational backup/restore yet, record the reason, scope boundary and deferred gate explicitly rather than treating the capability as silently complete.

## 3. Required Evidence Review Matrix

| ID | Evidence to obtain | Acceptance condition | Status |
|---|---|---|---|
| E1 | First increment contract | Scope/non-goals/acceptance/rollback explicitly recorded | BLOCKED until R1 |
| E2 | PostgreSQL CI alignment | CI uses approved PostgreSQL 18.x line or approved exception | BLOCKED until R2 |
| E3 | Migration recovery evidence | Recovery/rollback path verified for applicable DB scope | BLOCKED/CONDITIONAL |
| E4 | Backup/restore decision | Applicable backup/restore evidence or explicit scoped deferral | BLOCKED/CONDITIONAL |
| E5 | Security/privacy matrix | Increment-specific controls mapped to acceptance evidence | OPEN |
| E6 | CI/security matrix | Required checks execute and are not silently skipped | OPEN |
| E7 | Runtime/E2E matrix | Increment-specific runtime evidence defined | OPEN |
| E8 | Architecture compliance | No unresolved contradiction with ARCH-FREEZE-001 or TD-08 | OPEN |

## 4. PostgreSQL CI Remediation Requirement

The API verification workflow currently provisions PostgreSQL 16. This must not remain the default verification database if TD-08's PostgreSQL 18.x decision is authoritative.

The remediation should preserve the existing verification sequence:
- dependency installation;
- typecheck;
- architecture/workspace tests;
- migration generation;
- migration application;
- database connectivity;
- build;
- application startup;
- applicable runtime verification;
- evidence upload;
- cleanup.

Changing the database image is a verification-environment alignment change, not permission to expand application scope.

## 5. Scope Discipline

No implementation of AI Gateway, Agent Runtime, Memory persistence, Personal Intelligence, dedicated search/vector infrastructure, cloud vendor selection, mobile infrastructure or other deferred TD-08 capabilities is authorized by this plan.

Existing authentication functionality remains closed/verified and should not be reopened unless new evidence identifies a regression.

## 6. Exit Criteria For Re-Review

TD-09 may be re-evaluated only after:

1. R1 has an explicit first-increment contract;
2. R2 is resolved with evidence;
3. R3 is resolved or explicitly proven not applicable to the scoped increment;
4. R4 is resolved or explicitly proven not applicable/deferred by scope;
5. all mandatory increment-specific security/test/runtime evidence is defined;
6. no architecture or TD-08 contradiction remains; and
7. the completed evidence package is ready for Founder review.

## 7. Gate Decision

**Current result:** `TD-09 — BLOCKED / NOT AUTHORIZED`

This remediation plan does not change that result.

**Next decision:** complete the remediation/evidence work, re-run the TD-09 review, and only then present a specific Build Authorization decision to the Founder.

## 8. Audit Rule

A plan, checklist or statement is not execution evidence. Evidence must come from repository artifacts, executable tests, CI results, migration/build output, security verification, reviewed decision records, or explicit Founder approval as applicable.
