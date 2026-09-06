# DECIVEXA Authentication — 20-State Implementation Plan V1

**Date:** 2026-09-06  
**Status:** FOUNDER-SCOPE APPROVED / IMPLEMENTATION PLAN — EXECUTION GATE CONTROLLED  
**Scope:** Founder-approved Option A — all 20 canonical Authentication states are current scope  
**Implementation authorization:** Not implied by this document

## 1. Purpose

This document converts the approved 20-state Authentication scope into a dependency-safe implementation sequence. It is intentionally narrower than a general Authentication roadmap: every proposed unit exists to make one or more canonical states real, deterministic, accessible, localizable, and evidenceable.

The plan does not freeze visual tokens and does not authorize unrelated product work.

## 2. Current Baseline

The current API Authentication surface exposes `POST /auth/register`, `POST /auth/login`, and authenticated `GET /auth/me`. Registration validates email/password, rejects duplicate email through an application error, creates credentials, and issues an access token. Login validates credentials and issues an access token on success. fileciteturn5file0L2-L2 fileciteturn6file0L2-L2 fileciteturn7file0L2-L2

The current authentication contract contains only credential input and authenticated identity output; it has no verification, password-recovery, reset, rate-limit, or session-lifecycle contract yet. fileciteturn8file0L2-L2

The access-token service currently uses a one-hour expiry and rejects expired tokens during verification. fileciteturn11file0L2-L2

## 3. Non-Negotiable Principles

1. Do not create visual-only state flags to satisfy QA.
2. Do not weaken or split the Founder-approved 20-state scope.
3. Preserve the existing application/domain/infrastructure boundaries.
4. Keep authentication state transitions explicit and deterministic.
5. Keep security-sensitive behavior server-authoritative.
6. Make failure classes distinguishable where the user experience requires distinction.
7. Keep all state transitions testable without dependence on uncontrolled external services.
8. Treat English/LTR and Persian/RTL as first-class overlays, not separate products.
9. Reuse the global responsive authority; do not invent Authentication-only breakpoints.
10. Do not freeze visual tokens until runtime evidence is complete.

## 4. Dependency-Safe Execution Slices

### Slice A — Authentication Error and Result Taxonomy

**Goal:** establish stable application-level outcomes required by the remaining states.

Required outcomes include, at minimum:

- invalid credentials;
- invalid registration input;
- duplicate registration;
- verification required;
- verification invalid/expired;
- recovery request accepted;
- reset invalid/expired;
- session expired/invalid;
- rate limited;
- network/server failure representation where appropriate.

**Exit evidence:** each outcome has a stable application contract and does not rely on UI text parsing.

### Slice B — Registration Lifecycle

**Goal:** make registration capable of entering a real verification-required lifecycle.

Required behavior:

- registration creates an unverified identity when verification is required;
- successful registration produces the canonical next state;
- duplicate/conflict behavior is deterministic;
- loading and failure outcomes remain observable;
- no account-existence leakage beyond the approved security contract.

**Unlocks:** states 9–13 and part of 20-state evidence.

### Slice C — Verification Lifecycle

**Goal:** establish a real verification model and deterministic test path.

Required behavior:

- waiting state;
- resend action;
- resend cooldown;
- valid verification success;
- expired/invalid verification;
- safe recovery path.

Testability requirement: verification credentials/tokens must have controlled fixtures or an application-owned test seam; no external inbox dependency for CI evidence.

**Unlocks:** states 8–11.

### Slice D — Password Recovery and Reset

**Goal:** establish the complete recovery lifecycle.

Required behavior:

- recovery entry;
- safe confirmation response;
- deterministic reset token lifecycle;
- reset entry;
- invalid/expired reset;
- successful reset;
- post-reset authentication path.

Security requirement: recovery confirmation must not disclose whether an account exists unless explicitly authorized by the security contract.

**Unlocks:** states 12–16.

### Slice E — Session Lifecycle

**Goal:** make session expiry a reproducible product state.

Required behavior:

- authenticated boundary recognizes invalid/expired session;
- user-visible session-expired state is explicit;
- re-authentication path is recoverable;
- no data-loss implication is introduced by the visual state unless it is real.

The existing token verifier already rejects expired tokens; the missing work is the complete application/UI lifecycle around that condition. fileciteturn11file0L2-L2

**Unlocks:** state 17.

### Slice F — Rate Limiting

**Goal:** establish deterministic 429 behavior and recovery semantics.

Required behavior:

- server-authoritative rate-limit response;
- stable error contract;
- retry timing semantics when supplied;
- safe UI communication;
- deterministic test fixture without waiting for a real attack threshold.

**Unlocks:** state 19.

### Slice G — Network / Server Failure Recovery

**Goal:** distinguish uncontrolled network failure from deterministic HTTP server failure where the UX requires it.

Required behavior:

- network failure representation;
- 5xx server failure representation;
- retry/recovery action where appropriate;
- no false success state;
- deterministic E2E entry for both classes.

**Unlocks:** state 18.

### Slice H — Runtime Evidence Harness

Only after the product surfaces above exist:

- canonical state fixtures;
- clean baseline/reset;
- locale control;
- direction control;
- viewport control;
- deterministic API responses;
- screenshot naming/traceability;
- accessibility inspection hooks;
- state-to-evidence mapping.

The harness must exercise the real product surfaces rather than render test-only replicas.

## 5. 20-State Unlock Map

| State | Required slice | Status |
|---|---|---|
| 1 Login empty | Existing surface + harness | Ready for evidence after harness |
| 2 Login focus | Existing surface + harness | Ready for evidence after harness |
| 3 Login error | A + existing surface | Partial |
| 4 Login loading | Existing surface + deterministic delay | Partial |
| 5 Registration empty | Existing surface + harness | Ready for evidence after harness |
| 6 Registration password guidance | B | Blocked |
| 7 Registration error | A/B | Partial |
| 8 Verification waiting | B/C | Blocked |
| 9 Verification resend cooldown | C | Blocked |
| 10 Verification success | C | Blocked |
| 11 Verification expired | C | Blocked |
| 12 Forgot password initial | D | Blocked |
| 13 Forgot password confirmation | D | Blocked |
| 14 Reset entry | D | Blocked |
| 15 Reset error | D | Blocked |
| 16 Reset success | D | Blocked |
| 17 Session expired | E | Blocked |
| 18 Network/server failure | G | Partial/Blocked for full taxonomy |
| 19 Rate limit | F | Blocked |
| 20 Mobile collapsed | H + responsive implementation | Evidence blocked until responsive surface exists |

## 6. Testability Architecture Requirements

The implementation must provide deterministic seams without creating production-only behavior.

Preferred mechanisms:

- dependency injection for time/token generation where needed;
- application-owned test fixtures;
- controlled API responses in E2E where appropriate;
- deterministic token factories for test environments;
- injectable clock for expiry/cooldown behavior;
- explicit test data reset/isolation.

Avoid:

- arbitrary sleeps;
- wall-clock waiting for expiry;
- external email providers in CI;
- hidden query parameters that alter production semantics;
- permanent QA-only UI routes;
- browser-storage mutation used as a substitute for proving product behavior.

## 7. Security and Privacy Guardrails

The implementation must not introduce:

- plaintext password persistence;
- recoverable password storage;
- account enumeration through recovery UX;
- client-authoritative verification;
- client-authoritative session validity;
- reusable reset credentials beyond their intended lifecycle;
- sensitive token exposure in user-facing error messages.

Existing password hashing and access-token services remain the foundation unless a separately approved architecture decision changes them. fileciteturn6file0L2-L2 fileciteturn11file0L2-L2

## 8. Localization and Responsive Acceptance

No slice is considered visually evidence-ready until it can be exercised under:

- English / LTR;
- Persian / RTL;
- mixed-direction identifiers such as email addresses and codes;
- long localized error/help content;
- global canonical responsive bands:
  - `<640px`;
  - `640–1023px`;
  - `1024–1439px`;
  - `≥1440px`.

D44's Authentication composition modes remain the visual behavior model; they do not replace the global viewport authority.

## 9. Exit Criteria for Implementation Phase

Implementation is complete for the 20-state program only when:

1. all 20 states have real product surfaces;
2. every state has deterministic entry and reset;
3. all applicable states work in English/LTR and Persian/RTL;
4. all canonical responsive bands are covered;
5. accessibility evidence is collected;
6. browser credential behavior is tested;
7. screenshots are traceable to state, locale, direction, viewport, and commit;
8. no P0/P1 blocking issue remains;
9. visual invariants hold across the complete matrix;
10. final token consolidation is performed only after evidence review.

## 10. Governance Gate

This plan is the next controlled engineering artifact. It does **not** itself authorize unrestricted implementation.

Execution of each implementation slice must remain within the Founder-approved scope and the existing DECIVEXA governance model. Any material architecture, schema, security, scope, or product-direction change discovered during implementation must stop at the relevant Founder gate rather than being silently absorbed.

## 11. Current Decision

**Founder scope:** Option A — FULL 20 STATE MATRIX  
**Implementation plan:** ESTABLISHED  
**Product implementation:** INCOMPLETE  
**Runtime evidence:** BLOCKED UNTIL SURFACES ARE COMPLETE  
**Visual Freeze:** NOT REACHED  
**Claude Implementation Prompt:** NOT YET AUTHORIZED/CREATED

## 12. Immediate Next Unit

The first implementation slice should be **Slice A — Authentication Error and Result Taxonomy**, because the later lifecycle slices depend on stable, explicit outcomes. It should be implemented as a narrow, reviewable change and must preserve the existing login/register behavior.
