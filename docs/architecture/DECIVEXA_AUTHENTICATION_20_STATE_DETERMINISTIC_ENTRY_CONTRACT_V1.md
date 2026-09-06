# DECIVEXA Authentication 20-State Deterministic Entry Contract V1

**Date:** 2026-09-06  
**Status:** SCOPE-APPROVED / EXECUTION CONTRACT — NO VISUAL PASS IMPLIED  
**Scope:** Deterministic entry requirements for the Founder-approved full Authentication visual QA matrix  
**Repository:** `parsakiamanesht-tech/DECIVEXA`  
**Base:** `main`

## 1. Authority

The Founder has explicitly approved **Option A**: all 20 canonical Authentication visual states are current scope and must become deterministic, renderable product states before final Visual Design Freeze evidence can be accepted.

This document converts that scope decision into an evidence-oriented state-entry contract. It does not define visual styling, frozen tokens, or final product copy.

## 2. Non-Negotiable Evidence Rule

A state is considered **deterministically enterable** only when:

1. the real product surface contains the state;
2. a documented trigger or controlled test condition can enter it;
3. the trigger can be repeated without relying on timing luck or external manual intervention;
4. the resulting UI state is stable enough to inspect/capture;
5. the state can be reset to a known baseline;
6. the test does not require falsifying product behavior merely to obtain a screenshot.

A QA-only component that does not represent a real product state is not sufficient evidence for the final matrix.

## 3. State Contract Matrix

| # | Canonical state | Required deterministic entry condition | Evidence requirement | Current readiness |
|---|---|---|---|---|
| 1 | Login empty | Navigate to `/login` with no prefilled credentials and unauthenticated session | Stable initial render | IMPLEMENTED SURFACE / RUNTIME EVIDENCE PENDING |
| 2 | Login focus | Navigate to `/login`, establish a known keyboard-focus target, and capture focused control without pointer-only dependence | Visible focus + stable layout | IMPLEMENTED SURFACE / RUNTIME EVIDENCE PENDING |
| 3 | Login error | Submit validly shaped credentials against a deterministic authentication failure response | Error presentation, association, wrapping, and recovery path | PARTIAL |
| 4 | Login loading | Submit through a deterministic delayed authentication response or equivalent controlled runtime condition | Disabled action, progress/loading presentation, focus behavior | PARTIAL |
| 5 | Registration empty | Navigate to `/register` with clean unauthenticated state | Stable initial render | IMPLEMENTED SURFACE / RUNTIME EVIDENCE PENDING |
| 6 | Registration password guidance | Enter registration password field under the canonical guidance condition | Guidance visibility, relationship to field, validation/reflow | IMPLEMENTATION GAP |
| 7 | Registration error | Submit validly shaped registration data against a deterministic registration failure response | Error presentation and recovery | PARTIAL / VISUAL EVIDENCE PENDING |
| 8 | Verification waiting | Complete registration into a verification-required state and land on the verification waiting surface | Stable waiting state and resend affordance | IMPLEMENTATION GAP |
| 9 | Verification resend cooldown | Trigger resend successfully, then enter the deterministic cooldown period | Countdown/cooldown presentation and disabled/re-enabled transition | IMPLEMENTATION GAP |
| 10 | Verification success | Enter a deterministic valid verification credential/token | Success state and next-step transition | IMPLEMENTATION GAP |
| 11 | Verification expired | Enter a deterministic expired verification credential/token | Expiry explanation and recovery action | IMPLEMENTATION GAP |
| 12 | Forgot password initial | Navigate to password-recovery entry surface in a clean state | Stable form and recovery affordance | IMPLEMENTATION GAP |
| 13 | Forgot password confirmation | Submit a validly shaped recovery request under a deterministic confirmation response | Confirmation state without leaking account existence | IMPLEMENTATION GAP |
| 14 | Reset entry | Open a deterministic valid reset link/token | Reset form and token-entry context | IMPLEMENTATION GAP |
| 15 | Reset error | Submit reset data with a deterministic invalid/expired/failed reset condition | Error state and safe recovery path | IMPLEMENTATION GAP |
| 16 | Reset success | Submit a valid reset credential under deterministic success response | Success state and safe next step | IMPLEMENTATION GAP |
| 17 | Session expired | Start authenticated, then deterministically force an expired/invalid session response on a protected operation | Session-expiry communication and re-authentication path | IMPLEMENTATION GAP |
| 18 | Network/server failure | Force network failure or deterministic 5xx response during an authentication operation | Distinct failure treatment, retry/recovery, no misleading success | PARTIAL / VISUAL EVIDENCE PENDING |
| 19 | Rate-limit | Force deterministic 429 response from authentication operation | Rate-limit communication, retry timing, no ambiguous generic error | IMPLEMENTATION GAP |
| 20 | Mobile collapsed | Enter the applicable Authentication state at canonical Compact Mobile dimensions and exercise the same state transition | Responsive composition, overflow/reflow, touch/focus behavior | RUNTIME EVIDENCE PENDING |

## 4. Determinism Requirements by Failure Class

### 4.1 Authentication errors

Error-state tests must control the response class explicitly. The suite must not depend on a live third-party service or an accidentally invalid credential.

### 4.2 Loading states

Loading evidence must be created through a controlled delay or equivalent deterministic mechanism. A screenshot taken during an uncontrolled real network race is not acceptable.

### 4.3 Network/server failure

Network failure and HTTP server failure must be independently representable when the canonical state requires the distinction. A generic caught exception is not automatically equivalent to a dedicated network/server state.

### 4.4 Rate limiting

The 429 condition must be deterministic. The evidence must verify that the user is not told to retry immediately when a server-provided retry condition requires otherwise.

### 4.5 Verification and reset states

Verification and password-reset states must be entered through product-recognized state transitions or tokens. Hard-coded visual-only flags are insufficient for final product evidence.

### 4.6 Session expiry

Session expiry must be reproducible without waiting for a real token to expire. The preferred evidence mechanism is a deterministic invalid/expired-session response at the authenticated boundary, while preserving the same user-visible behavior expected in production.

## 5. Language and Direction Overlay

Every applicable state must be testable under:

- English LTR;
- Persian RTL;
- mixed-direction content where the state naturally contains mixed-direction values such as email addresses, codes, or numeric countdowns.

The language/direction overlay is orthogonal to the 20-state identity. It must not create a second state matrix with silently different product behavior.

## 6. Responsive Overlay

The global responsive authority remains:

- Compact Mobile: `< 640px`;
- Expanded Mobile / Tablet: `640–1023px`;
- Desktop: `1024–1439px`;
- Wide Desktop: `≥ 1440px`.

D44 remains the Authentication composition model: Wide → Constrained → Auth-priority → Mobile.

The test system must not introduce a competing set of breakpoint definitions merely for visual QA.

## 7. Accessibility Overlay

For every state where the interaction is applicable, deterministic entry must permit inspection of:

- keyboard focus visibility;
- logical focus order;
- label/control association;
- error association and announcement;
- disabled/loading behavior;
- non-color communication of state;
- text reflow and enlargement;
- target sizing and spacing;
- RTL/LTR navigation behavior.

Source semantics are supporting evidence only; runtime behavior remains required for the freeze gate.

## 8. Reset / Isolation Contract

Each state test must start from a known baseline and finish without contaminating subsequent states.

At minimum, the harness must control:

- local authentication token state;
- relevant cookies/storage;
- mocked/deterministic API responses where appropriate;
- locale and document direction;
- viewport dimensions;
- route entry point;
- test data required to enter the state.

## 9. Prohibited Shortcuts

The following do not satisfy this contract:

- screenshots of static mockups presented as product evidence;
- hidden QA-only state switches that have no production-equivalent state;
- manually editing browser storage to claim a product transition without proving the corresponding user-visible behavior;
- timing-dependent screenshots;
- relying on an external email inbox or external service for deterministic CI evidence;
- marking a state PASS because its component compiles;
- marking a state PASS because a functional E2E assertion succeeds;
- weakening the canonical matrix to fit the current implementation.

## 10. Implementation Inventory — Initial Baseline

### Existing surface

- `/login` exists and contains credential fields, submit behavior, loading state, and caught-error rendering. fileciteturn46file0L2-L2
- `/register` exists and contains credential fields, password minimum, submit behavior, loading state, and caught-error rendering. fileciteturn50file0L2-L2
- The authentication context currently exposes login, register, logout, and authenticated/unauthenticated status. fileciteturn53file0L2-L2
- The web API helper currently provides authenticated JSON requests and HTTP error extraction. fileciteturn54file0L2-L2
- The Playwright setup currently runs a single Chromium/Desktop Chrome project. fileciteturn47file0L2-L2

### Required implementation/evidence surface

- Registration password guidance state;
- verification waiting/cooldown/success/expired states;
- password-recovery initial/confirmation states;
- reset entry/error/success states;
- deterministic session-expiry presentation;
- dedicated rate-limit presentation;
- deterministic network/server failure coverage;
- canonical mobile-collapsed rendering evidence;
- bilingual LTR/RTL runtime support required by D38/D45;
- evidence harness expansion for responsive, state, accessibility, and screenshot conditions.

## 11. Gate Transition Criteria

The project may move from **20-state implementation gap** to **20-state runtime evidence execution** only when all 20 states have deterministic product entry conditions.

The project may move from **runtime evidence execution** to **Visual Freeze consideration** only when the complete evidence matrix is executed and all blocking findings are resolved or explicitly dispositioned under Founder governance.

This document does not declare either transition complete.

## 12. Current Status

**Scope:** FOUNDER APPROVED — OPTION A  
**Deterministic entry contract:** ESTABLISHED  
**20-state product implementation:** INCOMPLETE  
**Runtime evidence harness:** INCOMPLETE  
**Visual evidence:** INSUFFICIENT  
**Visual token freeze:** BLOCKED  
**Founder Visual Design Freeze:** NOT REACHED

## 13. Next Controlled Execution Unit

The next implementation unit is to build the **minimum product state-entry surface required by this contract**, beginning with the smallest dependency-safe Authentication slice and preserving the existing functional foundation.

No unrelated feature work should be introduced under this matrix.
