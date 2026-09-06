# DECIVEXA Authentication Runtime Evidence Harness Specification V1

**Status:** SPECIFICATION ONLY — NO IMPLEMENTATION AUTHORIZED
**Scope:** Authentication visual-design verification
**Owner:** Founder-controlled DECIVEXA governance
**Purpose:** Define the minimum runtime evidence required before Authentication Visual Design can be considered ready for Founder Visual Design Freeze.

---

## 1. Executive Decision

The Authentication visual work has reached the point where specification-level review is no longer sufficient. The remaining uncertainty is primarily runtime/rendered evidence.

This document therefore defines a controlled evidence harness. It does **not** authorize implementation, Playwright configuration changes, new dependencies, localization implementation, visual-token changes, or UI changes.

The harness must prove what the user actually sees and experiences across language direction, state, viewport, accessibility, and browser interaction conditions.

**Critical rule:** absence of evidence is `UNVERIFIED`, not `PASS`.

---

## 2. Current Runtime Baseline

The web package already exposes `test:e2e` as `playwright test`, and the current Playwright configuration runs a single `Desktop Chrome` project against the local production server. fileciteturn8file0L1-L6

The web verification workflow already installs Chromium, performs typecheck/build, and runs E2E tests. Therefore the proposed harness should extend the existing evidence model rather than create a parallel testing architecture.

The web package currently uses Playwright Test `^1.55.0`. fileciteturn10file0L1-L6

---

## 3. Evidence Objective

The harness must establish five separate evidence classes:

1. **Rendered Visual Evidence** — screenshots and deterministic state capture.
2. **Interaction Evidence** — keyboard, focus, validation, submission and recovery behavior.
3. **Localization Evidence** — English/Persian content and LTR/RTL direction.
4. **Responsive Evidence** — all four approved responsive states from D44.
5. **Accessibility Evidence** — observable conformance against the approved accessibility specification, without claiming WCAG conformance unless every applicable criterion is actually evidenced.

A single green functional E2E run is not sufficient evidence for any of these classes by itself.

---

## 4. Governance Boundary

### Authorized now

- Documentation of the evidence model.
- Definition of test states and acceptance criteria.
- Definition of screenshot/evidence naming conventions.
- Definition of required runtime matrix.
- Definition of pass/fail/unverified semantics.

### Not authorized by this document

- Editing UI implementation.
- Adding Persian translations.
- Adding RTL behavior.
- Changing typography tokens.
- Changing responsive breakpoints.
- Changing Playwright configuration.
- Adding test dependencies.
- Adding visual-regression infrastructure.
- Changing CI workflows.
- Declaring Founder Visual Design Freeze.

Any implementation required to execute this specification remains subject to the existing Founder approval gate.

---

## 5. Test Matrix

### 5.1 Language × Direction

Every applicable authentication surface must be tested in:

| Locale | Direction | Requirement |
|---|---|---|
| English | LTR | Full authentication flow |
| Persian | RTL | Full authentication flow |
| English | RTL stress | Direction robustness / mixed-direction safety |
| Persian | LTR stress | Direction robustness / mixed-direction safety |

The two stress combinations are not product locales; they are diagnostic tests intended to reveal hidden direction assumptions.

### 5.2 Responsive States

Use **exactly the four responsive states approved by D44**. Their canonical viewport dimensions must be retrieved from the governing D44 record before implementation of the harness.

No new viewport values may be invented during implementation merely for convenience.

For each state, capture at minimum:

- Login — pristine
- Login — validation/error
- Login — loading/submission
- Register — pristine
- Register — validation/error
- Register — loading/submission

### 5.3 Browser Baseline

The existing Chromium/Desktop Chrome baseline must remain the reference environment.

Where CI/browser capacity permits, additional browser evidence may be proposed separately, but additional browsers must not silently redefine the canonical visual baseline.

---

## 6. Twenty-State Authentication Visual Matrix

The following 20 states are the minimum required visual-state matrix. Each state must be evaluated in the applicable locale/direction and responsive contexts.

| ID | State | Core question |
|---|---|---|
| V01 | Login / pristine | Is the baseline composition correct? |
| V02 | Login / focused email | Is focus visible and visually coherent? |
| V03 | Login / focused password | Is focus treatment consistent? |
| V04 | Login / invalid email | Is validation understandable without visual ambiguity? |
| V05 | Login / invalid password | Is error presentation localized and contained? |
| V06 | Login / authentication error | Is server/authentication failure clear without destabilizing layout? |
| V07 | Login / loading | Is progress communicated without layout jump? |
| V08 | Login / keyboard navigation | Is focus order logical and complete? |
| V09 | Login / long-content stress | Does text expansion preserve composition? |
| V10 | Login / mixed-direction stress | Are directional boundaries robust? |
| V11 | Register / pristine | Is the baseline registration composition correct? |
| V12 | Register / focused field | Is focus treatment consistent across fields? |
| V13 | Register / invalid required field | Is required-field feedback clear? |
| V14 | Register / password validation | Is password feedback understandable and contained? |
| V15 | Register / duplicate-account error | Does error content preserve layout and hierarchy? |
| V16 | Register / loading | Is progress communicated without layout jump? |
| V17 | Register / keyboard navigation | Is focus order logical and complete? |
| V18 | Register / long-content stress | Does localization/content expansion preserve composition? |
| V19 | Register / mixed-direction stress | Are directional boundaries robust? |
| V20 | Auth transition / recovery | Does successful/error recovery preserve continuity and orientation? |

**Important:** a state is not `PASS` merely because the application remains functional. Visual hierarchy, spacing, typography, focus, error containment, and directional behavior must also be judged.

---

## 7. Screenshot Evidence Standard

Every evidence screenshot must be:

- Captured from the real running application.
- Deterministically named.
- Tied to locale, direction, viewport, route and state.
- Taken after the UI reaches a stable state.
- Stored as CI evidence/artifact or another auditable project-approved evidence location.
- Reproducible from the same test command and environment.

### Canonical naming

`AUTH_<locale>_<dir>_<viewport>_<state>_<sequence>.png`

Example:

`AUTH_fa_rtl_D44S2_V14_01.png`

The exact D44 viewport identifiers must be defined by the governing D44 record before execution.

Screenshots are evidence, not decoration. A screenshot that cannot be traced back to a deterministic test condition has reduced evidentiary value.

---

## 8. Accessibility Evidence

The harness must verify observable behavior for at least:

- Keyboard-only navigation.
- Visible focus indication.
- Logical focus order.
- Label/control association.
- Required-field semantics.
- Error announcement/association where applicable.
- Password-field semantics.
- Appropriate autocomplete semantics.
- No keyboard trap.
- Text/content expansion without destructive overlap.
- Reflow at the approved responsive states.
- Non-text contrast for required focus/interactive indicators.
- Target-size behavior where applicable.

Automated accessibility tooling may be used as supporting evidence, but automated scans are not sufficient to prove complete accessibility conformance.

The existing authentication implementation already contains several semantic foundations, including labels, appropriate input types, required attributes, autocomplete values, alert semantics for errors, and disabled submission during loading. These are implementation evidence, not a substitute for runtime verification.

---

## 9. Browser / Autofill / Password-Manager Evidence

The harness must distinguish what can be deterministically tested in CI from what requires controlled manual/browser-profile validation.

### Deterministic CI evidence

- `autocomplete` attributes.
- Input types.
- Focus order.
- Keyboard interaction.
- Form submission behavior.
- Validation behavior.

### Controlled browser evidence

- Browser autofill presentation.
- Saved-password UI interaction.
- Password-manager overlay interference.
- Autofill-induced layout changes.
- Directionality of autofilled Persian/English content.

Third-party password-manager behavior must never be represented as fully deterministic product behavior. Such evidence should be labeled by browser, extension/profile, and test date.

---

## 10. Visual Acceptance Criteria

A state may be marked `PASS` only when all applicable criteria below are satisfied:

### Composition
- Primary authentication task remains visually dominant.
- Geometry remains intentional and balanced.
- No accidental clipping, overflow or unexpected layout shift.
- The authentication surface retains the approved near-flat contained-material direction.

### Typography
- Approved bilingual typography candidate is actually rendered in the target locale.
- Persian and Latin glyphs remain visually coherent.
- No fallback-font surprise materially changes metrics or hierarchy.
- Scale remains within the approved bilingual typography system.

### Direction
- RTL/LTR is semantic, not merely visually mirrored.
- Text alignment, icon direction, field order, spacing and error placement behave correctly.
- Mixed-direction strings do not corrupt surrounding layout.

### Interaction
- Focus is visible.
- Focus is not obscured.
- Keyboard path is predictable.
- Loading/error states do not cause destructive movement.

### Responsive behavior
- Each approved D44 state preserves usability and hierarchy.
- No state depends on a fixed desktop geometry.
- Narrow states remain usable without horizontal scrolling where the approved design requires reflow.

### Accessibility
- No known critical accessibility defect remains in an evidenced state.
- Automated results, where used, are retained with the corresponding evidence.
- Manual checks cover behaviors automation cannot reliably establish.

---

## 11. Evidence Status Semantics

Use only these statuses:

- **PASS** — runtime evidence exists and acceptance criteria are satisfied.
- **FAIL** — runtime evidence exists and a criterion is violated.
- **UNVERIFIED** — evidence is absent, incomplete, non-deterministic, or insufficient to make a conformance decision.
- **BLOCKED** — execution could not proceed because of an environmental or governance dependency.

Never convert `UNVERIFIED` into `PASS` by inference.

Never convert a missing runtime test into `FAIL` unless there is direct evidence of failure.

---

## 12. Defect Severity

### P0 — Freeze blocker
Examples:
- Authentication cannot be completed.
- Critical content is inaccessible.
- Keyboard user cannot complete the flow.
- RTL/LTR causes destructive corruption.
- A required responsive state is unusable.

### P1 — Strong freeze blocker
Examples:
- Major visual hierarchy breaks.
- Error/loading state causes significant layout instability.
- Typography fallback materially damages bilingual design.
- Focus treatment is absent or effectively invisible.

### P2 — Refinement issue
Examples:
- Minor spacing inconsistency.
- Non-critical alignment drift.
- Small visual polish issue without usability impact.

P0/P1 defects block visual freeze. P2 items require Founder/design disposition before final freeze if they affect the intended visual language.

---

## 13. Evidence Package

A complete execution package should contain:

1. Test-run identifier.
2. Commit SHA under test.
3. Browser/runtime versions.
4. Locale/direction matrix.
5. D44 viewport matrix.
6. 20-state results.
7. Accessibility results.
8. Screenshot manifest.
9. Failed-state traces/videos where applicable.
10. Defect register.
11. Final PASS/FAIL/UNVERIFIED/BLOCKED summary.

The package must be sufficient for an independent reviewer to understand exactly what was tested without relying on undocumented assumptions.

---

## 14. CI Integration Principle

The existing web verification workflow already provides a viable runtime foundation: dependency installation, Chromium installation, typecheck, build and E2E execution are already part of the verification path.

The future harness should be integrated into that evidence path rather than creating a separate unofficial verification pipeline.

However, CI integration is an implementation change and is therefore **not authorized by this specification**.

---

## 15. Required Execution Order

Once implementation is explicitly authorized, execute in this order:

1. Recover canonical D44 viewport definitions.
2. Confirm the current authentication routes and state hooks.
3. Implement the smallest possible evidence harness.
4. Execute English/LTR baseline.
5. Execute Persian/RTL.
6. Execute direction stress cases.
7. Execute all four D44 responsive states.
8. Execute the 20-state matrix.
9. Execute accessibility evidence.
10. Execute controlled browser/autofill evidence.
11. Capture and retain evidence.
12. Perform independent evidence review.
13. Resolve P0/P1 blockers.
14. Re-run affected evidence.
15. Only then perform final token consolidation and prepare the Founder Visual Design Freeze decision package.

---

## 16. Freeze Gate

This specification does **not** grant Visual Design Freeze.

The Authentication Visual Design Freeze remains blocked until the required evidence is complete and reviewed.

The final decision package must explicitly state:

- what is proven,
- what failed,
- what remains unverified,
- what is blocked by environment,
- and what, if anything, requires Founder decision.

No implementation agent may interpret this document as permission to make material design or architecture decisions autonomously.

---

## 17. Definition of Done for the Harness

The harness specification is considered execution-ready when:

- D44 canonical viewport values are available.
- Authentication routes/states are mapped.
- The 20-state matrix is executable without ambiguity.
- Every evidence artifact has deterministic traceability.
- PASS/FAIL/UNVERIFIED/BLOCKED semantics are enforced.
- CI and local execution paths are explicitly identified.
- Accessibility and browser-profile limitations are documented.
- No governance gate is bypassed.

**Current status: DOCUMENTED / IMPLEMENTATION NOT AUTHORIZED.**
