# DECIVEXA Authentication Runtime State Coverage Audit V1

**Date:** 2026-09-06  
**Status:** EVIDENCE AUDIT — FULL 20-STATE SCOPE APPROVED; IMPLEMENTATION/TEST EXECUTION NOT YET AUTHORIZED BY THIS DOCUMENT  
**Scope:** Authentication visual QA readiness  
**Repository:** `parsakiamanesht-tech/DECIVEXA`  
**Base:** `main`

## 1. Purpose

This audit maps the canonical Authentication 20-state visual QA matrix against the Authentication routes and runtime test coverage that actually exist in the repository.

It is deliberately evidence-first:

- a state defined by specification is not treated as implemented;
- an E2E assertion is not treated as visual evidence;
- a missing test is not automatically treated as a product defect;
- absence of evidence is recorded as **UNVERIFIED** rather than inferred PASS;
- a Founder scope decision is recorded explicitly;
- no visual state is marked PASS until the product state exists, can be entered deterministically, and can be rendered under required runtime conditions.

## 2. Evidence Sources

The current web application contains dedicated `/login` and `/register` routes, plus `/dashboard`. The current Login implementation contains credential entry, loading behavior, and caught-error rendering. fileciteturn46file0L2-L2

The current Registration implementation contains email/password entry, an eight-character minimum, loading behavior, and caught-error rendering. fileciteturn50file0L2-L2

The current root application declares English as the document language and does not yet establish bilingual/RTL runtime behavior. fileciteturn52file0L2-L2

The current Playwright configuration defines only one project, Chromium/Desktop Chrome. It does not currently define the four canonical responsive viewport bands, RTL/LTR projects, localization projects, accessibility tooling, or screenshot-specific projects. fileciteturn47file0L2-L2

The existing Authentication E2E suite contains two tests: unauthenticated dashboard redirect and a successful login UI contract using mocked authentication endpoints. fileciteturn49file0L2-L2

## 3. Canonical Responsive Reference

The global Responsive Design Specification defines four reference bands:

| Band | Width | Canonical intent |
|---|---:|---|
| Compact Mobile | `< 640px` | Sequential, focused, single-column |
| Expanded Mobile / Tablet | `640–1023px` | Single-column with selective two-column composition |
| Desktop | `1024–1439px` | Multi-column, stable navigation, contextual parallelism |
| Wide Desktop | `≥ 1440px` | Increased breathing room and controlled information parallelism |

These are reference boundaries, not permission to invent device-specific breakpoints. fileciteturn39file0L1-L2

Authentication D44 defines the visual transformation modes as Wide → Constrained → Auth-priority → Mobile. This is a composition model, not a second breakpoint authority. fileciteturn40file0L2-L2

## 4. Current Runtime Coverage Matrix

Legend:

- **VERIFIED-FUNCTIONAL:** current code/test provides direct functional evidence.
- **PARTIAL:** some supporting implementation exists, but required visual/runtime evidence is incomplete.
- **UNVERIFIED:** specification requires the state, but current repository evidence does not demonstrate it.
- **NOT PRESENT:** no corresponding product state/route/behavior was found in the audited surface.
- **BLOCKED:** cannot be fairly evaluated without prerequisite implementation or runtime infrastructure.

| # | Canonical visual state | Current repository evidence | Status | Freeze relevance |
|---|---|---|---|---|
| 1 | Login empty | `/login` exists; empty controlled fields are present | PARTIAL | Must render and screenshot |
| 2 | Login focus | Native inputs exist; no visual focus evidence | PARTIAL | Must verify keyboard + visual focus |
| 3 | Login error | `role="alert"` error rendering exists | PARTIAL | Must verify context, wrapping, geometry |
| 4 | Login loading | `loading` state disables button and changes label | PARTIAL | Must verify geometry/contrast/focus behavior |
| 5 | Registration empty | `/register` exists with controlled credential fields | PARTIAL | Must render and screenshot |
| 6 | Registration password guidance | `minLength={8}` exists, but no dedicated visible guidance state is evidenced | UNVERIFIED | Required before freeze |
| 7 | Registration error | Registration route has caught-error rendering; visual evidence not established | UNVERIFIED | Required |
| 8 | Verification waiting | No `/verification` route/state established in audited web tree | NOT PRESENT / BLOCKED | Requires implementation |
| 9 | Verification resend cooldown | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 10 | Verification success | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 11 | Verification expired | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 12 | Forgot password initial | No route/state found in audited app tree | NOT PRESENT / BLOCKED | Requires implementation |
| 13 | Forgot password confirmation | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 14 | Reset entry | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 15 | Reset error | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 16 | Reset success | No evidence | NOT PRESENT / BLOCKED | Requires implementation |
| 17 | Session expired | Current Login code has no dedicated session-expired presentation | UNVERIFIED | Required |
| 18 | Network/server failure | Generic caught login error exists, but no dedicated network/server visual treatment is evidenced | PARTIAL | Must verify distinct behavior and messaging |
| 19 | Rate-limit | No dedicated rate-limit state evidenced | UNVERIFIED | Required |
| 20 | Mobile collapsed | Current page is responsive only by implication; no mobile visual evidence | UNVERIFIED | Must render at canonical mobile bands |

## 5. Founder Scope Decision — OPTION A APPROVED

On 2026-09-06, the Founder explicitly selected **Option A — Full matrix is in current Authentication scope**.

Therefore:

> **All 20 canonical Authentication visual states are current scope and must become deterministic, renderable product states before final Visual Freeze evidence can be accepted.**

This resolves the previous scope ambiguity. It does **not** retroactively convert missing states into implemented states, and it does not permit fabricated screenshots or synthetic PASS results.

The following states remain implementation gaps until real product behavior exists:

- Verification waiting
- Verification resend cooldown
- Verification success
- Verification expired
- Forgot password initial
- Forgot password confirmation
- Reset entry
- Reset error
- Reset success
- Session expired presentation
- Rate-limit presentation
- Registration password-guidance presentation
- Dedicated network/server failure presentation where required by the canonical state definition
- Mobile collapsed runtime presentation

## 6. Evidence-First Rule After Scope Approval

The scope decision increases the required evidence surface; it does not lower the evidence standard.

A state may advance through the gate only when all of the following are true:

1. The state exists as a real product state, not a QA-only fake.
2. The state can be entered deterministically.
3. The state renders consistently in the supported runtime.
4. The state can be exercised under the required language and direction conditions.
5. The state can be captured/verified at the canonical responsive conditions applicable to it.
6. Accessibility-relevant behavior can be inspected under runtime conditions.
7. No visual PASS is inferred solely from source code or a functional E2E assertion.

## 7. Existing E2E Tests Do Not Constitute Visual QA

The current successful-login E2E test proves a narrow UI contract: fields can be filled, the mocked login endpoint returns a token, navigation reaches `/dashboard`, and the token is stored. fileciteturn49file0L2-L2

It does **not** prove:

- visual composition;
- typography;
- Persian rendering;
- RTL layout;
- responsive transformation;
- screenshot stability;
- contextual contrast;
- keyboard focus appearance;
- text enlargement/reflow;
- mobile keyboard behavior;
- password-manager/autofill presentation;
- the complete 20-state matrix.

## 8. RTL / LTR Readiness Finding

The current root application declares `lang="en"`, while no audited evidence establishes Persian locale handling, RTL document direction, bilingual typography runtime, or mixed-direction authentication tests. fileciteturn52file0L2-L2

Therefore:

**Bilingual/RTL visual readiness = UNVERIFIED.**

This remains a mandatory evidence area because D38 made Vazirmatn the leading typography candidate subject to rendering and language QA, and D45 made localization stress testing a mandatory freeze condition. fileciteturn40file0L2-L2

## 9. Responsive Readiness Finding

The current Playwright project is Desktop Chrome only. fileciteturn47file0L2-L2

Therefore there is currently no repository-level evidence for the four canonical responsive reference bands.

Because Option A is now approved, the eventual evidence harness must cover the four canonical bands and the D44 composition model without creating a competing breakpoint authority.

## 10. Accessibility Readiness Finding

The Login implementation contains several positive semantic foundations: native form submission, explicit labels, appropriate input types, autocomplete attributes, required fields, an alert role for errors, and a disabled loading action. fileciteturn46file0L2-L2

The Registration implementation similarly uses explicit labels, appropriate input types, autocomplete, required fields, an eight-character minimum, alert-based errors, and a disabled loading action. fileciteturn50file0L2-L2

However, source semantics alone do not establish the full visual/accessibility gate. Runtime evidence remains required for focus visibility, reflow, text enlargement, target sizing, directionality, non-color state communication, and related contextual behavior.

**Accessibility freeze evidence = NOT ESTABLISHED.**

## 11. Governance Boundary

The Founder decision in this audit authorizes the **scope** of the 20-state matrix. It does not authorize arbitrary architectural changes, redesign, token promotion, or unbounded feature expansion.

Any implementation must remain bounded to making the approved 20 states real, deterministic, testable, and evidence-ready.

The following remain gated until separately evidenced/authorized as applicable:

- final visual token consolidation;
- promotion of calibration candidates to frozen tokens;
- declaration of Founder Visual Design Freeze;
- final Claude implementation prompt;
- unrelated Authentication feature expansion;
- architecture changes not required to satisfy the approved matrix.

## 12. Required Execution Sequence

With Option A resolved, the correct professional sequence is now:

1. **Freeze the scope record** — completed by this decision.
2. **Inventory the canonical 20 states against actual product behavior** — this audit establishes the baseline.
3. **Define the minimum deterministic state-entry contract** for each missing state without inventing behavior beyond the canonical definition.
4. **Implement the missing product states and only the supporting infrastructure required by them.**
5. **Expand the runtime evidence harness** for state, language, RTL/LTR, four responsive bands, accessibility, and screenshot evidence.
6. **Execute the complete 20-state evidence matrix.**
7. **Resolve failures and regressions without silently weakening the matrix.**
8. **Re-run evidence and consolidate findings.**
9. **Only after evidence completion, evaluate token consolidation and Founder Visual Design Freeze.**

## 13. Current Gate Status

| Gate | Status |
|---|---|
| Canonical responsive authority | ESTABLISHED |
| D44 composition model | ESTABLISHED |
| 20-state scope decision | **FOUNDER APPROVED — OPTION A** |
| Existing Login functional contract | PARTIALLY VERIFIED |
| Existing Registration functional contract | PARTIALLY VERIFIED |
| Existing visual evidence | INSUFFICIENT |
| 20-state runtime coverage | INSUFFICIENT — IMPLEMENTATION GAPS REMAIN |
| Bilingual/RTL runtime coverage | UNVERIFIED |
| Four-band responsive evidence | UNVERIFIED |
| Accessibility runtime evidence | INSUFFICIENT |
| Visual token freeze | BLOCKED |
| Founder Visual Design Freeze | NOT REACHED |
| Evidence harness execution | NOT STARTED |

## 14. Conclusion

The scope ambiguity is now resolved in favor of the **full 20-state Authentication matrix**.

The project must therefore not reduce the matrix to match the current implementation. Instead, the implementation and evidence surface must be brought up to the approved scope, while preserving the evidence-first rule and the existing Founder governance boundary.

The next execution unit is the **deterministic 20-state Authentication state-entry contract and implementation inventory**. No state should be visually marked PASS before it is a real, reproducible product state under the required runtime conditions.
