# DECIVEXA Authentication — 20-State Surface Readiness Audit V1

**Status:** PRE-IMPLEMENTATION AUDIT
**Scope decision:** Founder-approved Option A — all 20 Authentication states are current scope.
**Branch:** `audit/auth-20-state-surface-readiness`
**Date:** 2026-09-06

## Purpose

This audit determines the minimum product/runtime surface required to make the Founder-approved 20-state Authentication matrix genuinely executable and evidenceable. It does not implement UI, routes, backend behavior, or test harness changes.

## Governing rule

A state is not considered implemented merely because it appears in a specification. A state becomes evidenceable only when there is a real, deterministic product trigger, observable resulting state, reset/re-entry path, and an appropriate runtime assertion.

No synthetic UI state, test-only screen, screenshot-only fabrication, or permanent mock may be used to manufacture a PASS.

## State surface readiness

| # | State family | Current surface | Evidence readiness | Required real surface |
|---|---|---|---|---|
| 01 | Login idle | Login route exists | PARTIAL | visual runtime capture |
| 02 | Login focused | Browser focus only | UNVERIFIED | deterministic focus evidence |
| 03 | Login populated | Existing controls | UNVERIFIED | deterministic populated fixture |
| 04 | Login validation error | Client/browser validation path | UNVERIFIED | explicit validation assertion |
| 05 | Login authentication error | Backend error path exists | PARTIAL | deterministic server response fixture |
| 06 | Login loading | Submit loading state exists | PARTIAL | deterministic delayed response |
| 07 | Login disabled | Button disabled during loading | PARTIAL | assertion + visual evidence |
| 08 | Login success | Navigation to dashboard exists | PARTIAL | successful auth runtime evidence |
| 09 | Registration idle | Register route exists | PARTIAL | visual runtime capture |
| 10 | Registration validation | Required fields exist | UNVERIFIED | explicit validation scenario |
| 11 | Registration duplicate/conflict | Backend surface not established as full UX state | BLOCKED | deterministic conflict contract |
| 12 | Registration loading | Not fully evidenced | UNVERIFIED | deterministic delayed response |
| 13 | Registration success | Route exists; full evidence incomplete | UNVERIFIED | successful registration runtime evidence |
| 14 | Verification required | No complete product lifecycle established | BLOCKED | verification lifecycle |
| 15 | Verification success/failure | No complete product lifecycle established | BLOCKED | deterministic verification outcomes |
| 16 | Password recovery request | No complete product lifecycle established | BLOCKED | recovery route/API contract |
| 17 | Password reset | No complete product lifecycle established | BLOCKED | reset lifecycle and token contract |
| 18 | Session expired | No deterministic runtime surface established | BLOCKED | session-expiry contract + UX |
| 19 | Rate limited | No deterministic runtime surface established | BLOCKED | rate-limit contract + UX |
| 20 | Network/server failure recovery | No complete deterministic UX contract | BLOCKED | failure taxonomy + recovery behavior |

## Critical finding

The current implementation can support only a subset of the 20-state evidence program. The remaining states require real product surface before visual QA can honestly begin.

This is not a reason to weaken the 20-state scope. Option A remains authoritative. It means implementation must now be planned against the complete state model rather than treating unsupported states as visual-only mocks.

## Dependency order

1. Authentication domain contracts and error taxonomy.
2. Registration lifecycle completion.
3. Verification lifecycle.
4. Password recovery/reset lifecycle.
5. Session lifecycle and expiry behavior.
6. Rate-limit behavior and user-facing recovery.
7. Network/server failure taxonomy and recovery.
8. Deterministic test fixtures/seams for the above.
9. Runtime Evidence Harness.
10. 20-state visual/accessibility execution.

## Non-goals of this audit

- No production code changes.
- No schema changes.
- No new authentication features are implemented here.
- No visual tokens are frozen.
- No responsive breakpoints are invented.
- No Founder Visual Freeze is declared.

## Gate result

**20-State Surface Readiness: NOT READY FOR RUNTIME EXECUTION**

The correct next engineering artifact is a Founder-controlled implementation plan for the missing Authentication lifecycle surfaces, followed by implementation and runtime evidence in controlled increments.
