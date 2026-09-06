# DECIVEXA Prototype V1 — Re-validation Pass 04 Record

**Status:** FAIL — TARGETED REFINEMENT REQUIRED

**Date:** 2026-09-06

**Prototype baseline:** `303c2446cfcdda4ce101f9c2c3216be311080a7a`

**Refinement scope:** Prototype V1 Refinement Pass 03

**Production implementation:** NOT AUTHORIZED

**Controlled User Validation:** NOT CLEARED

## 1. Purpose

Pass 04 is an adversarial re-validation of the Refinement Pass 03 executable candidate. It is not a confirmation of the previous refinement claims.

Core rule:

> Addressed ≠ Passed. Represented ≠ Executable. Executable ≠ Validated.

## 2. Evidence Boundary

The repository artifact was inspected as executable HTML/JavaScript and its state-transition logic was traced against the approved Pass 04 specification. This record does **not** claim successful browser execution, screen-reader execution, or human-user validation because those forms of evidence were not available in this run.

Accordingly, any criterion requiring actual browser/runtime observation is marked **BLOCKED**, not PASS.

## 3. Executive Result

| Area | Result |
|---|---|
| Behavioral integrity | FAIL |
| Epistemic integrity | CONDITIONAL |
| Accessibility integrity | BLOCKED / FAIL-PRONE |
| Responsive integrity | BLOCKED |
| RTL/LTR integrity | BLOCKED |
| Context integrity | CONDITIONAL |
| Canonical journeys | FAIL / BLOCKED |
| P0 | 0 confirmed |
| P1 | 4 confirmed |
| P2 | 3 confirmed |
| User validation clearance | NO |

**Gate:** FAIL

The prototype must not advance to Pilot or Controlled User Validation yet.

## 4. Confirmed P1 Findings

### P1-01 — Decision Commit Is Not Persisted

`commitDecision()` opens the consequence preview, but the final Commit action only closes the modal and announces that the decision was committed. No committed decision state is written to the prototype state model.

Therefore the required invariant is not fully executable:

`SELECTED OPTION → COMMITTED DECISION`

The UI can claim commitment without creating a persistent committed state.

**Required refinement:** introduce an explicit decision lifecycle, at minimum:

`UNSELECTED → SELECTED → COMMIT REVIEW → COMMITTED`

and preserve the committed option across navigation/re-entry.

### P1-02 — Correction Lifecycle Does Not Match the Contract

The documented lifecycle requires:

`CURRENT → CORRECTION REVIEW → CONFIRMED → REVIEW REQUIRED`

The executable implementation currently changes `S.correction` directly to `REVIEW REQUIRED` after confirmation. The intermediate confirmed state is not represented.

**Required refinement:** represent the transition explicitly and preserve the corrected understanding independently from downstream review state.

### P1-03 — Retry Bypasses the Required Recovery Transition

The recovery UI correctly exposes `FAILED-INCOMPLETE`, preservation, and Retry. However `retryApply()` directly sets `S.proposal='APPLIED'` without representing a distinct retry/application attempt or verifying the retry result.

This violates the requirement that retry be a genuine recovery attempt rather than a cosmetic jump to success.

**Required refinement:** model:

`FAILED-INCOMPLETE → RETRYING/APPLYING → APPLIED | FAILED-INCOMPLETE`

with observable result state and retained failure history.

### P1-04 — State Persistence Is Session-Local and Not Re-entry Durable

The state model is held in an in-memory object `S`. Navigation within the page preserves it, but reload/re-entry durability is not provided.

For the validation specification, persistence across meaningful navigation is required; for the broader recovery contract, the prototype must also distinguish navigation persistence from reload durability.

**Required refinement:** explicitly define and implement prototype-level persistence semantics, without implying production persistence or database behavior.

## 5. Confirmed P2 Findings

### P2-01 — Context Breadcrumbs Use Internal View Keys

The context stack stores view identifiers such as `goaldetail` and `evidence`, then renders those identifiers directly as breadcrumb content. This is not an acceptable user-facing context representation.

**Required refinement:** map internal route/state keys to localized semantic labels and preserve parent identity.

### P2-02 — Context Stack Does Not Encode Entity Identity

`Home → Goal → Evidence` preserves page-level navigation but not a durable identity for the specific Goal/Evidence entity.

**Required refinement:** prototype context entries should contain semantic identity, not only view names.

### P2-03 — Accessibility Assertions Cannot Be Passed from Source Inspection Alone

The source contains focus-visible styling, modal focus entry, focus trapping, and exact invoking-element restoration logic. These are positive implementation signals, but they are not runtime evidence.

Actual keyboard traversal, focus visibility, focus-not-obscured, mobile overlay behavior, and dynamic status perception remain unverified.

**Disposition:** BLOCKED pending browser-level execution.

## 6. Epistemic Verification

### E01 — Evidence vs Inference

**Conditional pass.** The prototype visibly distinguishes `RECORDED` evidence from `INFERRED` understanding and explicitly communicates that recorded information is not the same as inference.

Runtime persistence still requires execution evidence.

### E02 — Suggestion vs Decision

**Conditional fail.** Selection is required before the Commit button becomes available, which is correct. However the final commit does not persist a committed decision state.

### E03 — Contradiction

**Conditional pass.** The prototype preserves an unresolved contradiction state and does not force a binary truth resolution.

### E04 — Stale Understanding

**Conditional pass.** The prototype explicitly represents `STALE ≠ FALSE` and offers revalidation rather than declaring falsity.

### E05 — Correction

**Fail at lifecycle fidelity.** The correction concept and downstream `REVIEW REQUIRED` behavior are represented, but the explicit confirmed transition is missing.

## 7. Canonical Journey Matrix

| Journey | Result | Reason |
|---|---|---|
| J01 Orientation → Goal | CONDITIONAL | Structural path exists; runtime execution not evidenced |
| J02 Today → Action → Outcome | CONDITIONAL | YES/PARTIAL/NO exists; runtime evidence unavailable |
| J03 Blocked → Adapt | FAIL | Proposal lifecycle reaches APPLYING/FAILED but retry semantics are incomplete |
| J04 Goal → Evidence | CONDITIONAL | Evidence boundary is represented; runtime provenance continuity not proven |
| J05 Understand → Correct | FAIL | Correction lifecycle skips explicit CONFIRMED state |
| J06 Decision → Compare → Commit | FAIL | Commit is announced but not persisted as a decision state |
| J07 Search → Context | CONDITIONAL | Context exists but lacks entity-level identity |
| J08 Error → Recovery | FAIL | Retry can jump directly to APPLIED and does not retain attempt history |

## 8. Accessibility Matrix

| Test | Result |
|---|---|
| A01 Keyboard-only | BLOCKED — no browser execution evidence |
| A02 Focus visibility | BLOCKED — source signal present, runtime not tested |
| A03 Modal entry | CONDITIONAL — focus assignment exists |
| A04 Modal containment | CONDITIONAL — trap logic exists; runtime not tested |
| A05 Exact focus return | CONDITIONAL — invoking-element restoration exists; runtime not tested |
| A06 Focus not obscured | BLOCKED |
| A07 Dynamic status | BLOCKED — announcements exist; perceptual/runtime verification absent |
| A08 Target size | BLOCKED — requires rendered viewport measurement |

## 9. Responsive / Directionality

Responsive CSS and RTL/LTR switching are represented in the artifact, including mobile navigation and document direction changes. However desktop/tablet/mobile rendering, mixed-direction fixtures, visual order, focus order, and fixed-navigation obstruction were not executable in this evidence run.

**Disposition:** BLOCKED, not PASS.

## 10. Governance Check

No canonical architecture decision was reopened.

No backend, database, API, authentication, AI Runtime, provider, infrastructure, production analytics, or deployment change was made.

No production implementation authorization is implied by this record.

## 11. Required Next Step

**Prototype Refinement Pass 04** is required, targeted specifically at P1-01 through P1-04 and the P2 context defects.

After refinement, execute a new browser-level Internal Prototype Check with captured evidence. Only after P0/P1 are zero and all hard gates pass should the project advance to Pilot Readiness Review.

## 12. Gate Decision

**RE-VALIDATION PASS 04: FAIL**

**P0:** 0 confirmed

**P1:** 4

**P2:** 3

**Controlled User Validation:** NOT CLEARED

**Pilot:** NOT CLEARED

**Production Implementation:** NOT AUTHORIZED

## 13. Traceability

- Pass 04 specification: `docs/architecture/DECIVEXA_PROTOTYPE_V1_REVALIDATION_PASS_04_SPEC.md`
- Refinement 03 candidate: `prototype/decivexa-v1-refinement-03/index.html`
- Refinement 03 commit: `303c2446cfcdda4ce101f9c2c3216be311080a7a`

## 14. Closing Principle

The prototype is not being advanced because it looks complete. It advances only when the underlying interaction contracts are demonstrably executable, persistent, understandable, and recoverable.
