# DECIVEXA Prototype V1 — Re-validation Pass 04 Specification

**Status:** FOUNDER-APPROVED — READY FOR EXECUTION

**Prototype:** `prototype/decivexa-v1-refinement-03/index.html`

**Test baseline:** `303c2446cfcdda4ce101f9c2c3216be311080a7a`

**Production implementation:** NOT AUTHORIZED

**Controlled User Validation:** NOT CLEARED

## 1. Purpose

Pass 04 is an adversarial verification gate, not a confirmation of the Refinement Pass 03 claims. It must determine whether the executable candidate actually satisfies the interaction, epistemic, recovery, context, accessibility, responsive, and directionality contracts.

Core rule:

> Addressed ≠ Passed. Represented ≠ Executable. Executable ≠ Validated.

## 2. Boundary

This pass is prototype-only.

Allowed: browser execution, interaction testing, keyboard testing, responsive testing, RTL/LTR testing, mixed-direction fixtures, state-transition verification, context verification, accessibility verification, defect recording, and prototype-only refinement if required.

Not allowed: backend, database/schema, API, authentication, AI Runtime, provider, infrastructure, analytics, deployment, production implementation, or autonomous changes to canonical architecture.

Any discovery that changes a canonical decision must be separately recorded and routed through Founder governance.

## 3. Verification Layers

1. Behavioral Integrity
2. Epistemic Integrity
3. Accessibility Integrity
4. Responsive / Directionality Resilience
5. Context Integrity

A journey passes only when the complete interaction sequence, state persistence, user-control boundary, and recovery behavior pass—not merely when the destination screen is reachable.

## 4. Evidence Protocol

Every executed test records:

- Test ID
- Starting state
- Exact interaction sequence
- Expected result
- Actual result
- Persistence result
- User-control result
- Accessibility result where applicable
- Evidence reference
- Outcome: PASS / FAIL / BLOCKED / N/A

No PASS may be awarded from source-code presence alone.

## 5. Hard Gates

PASS 04 automatically fails if:

- P0 > 0
- P1 > 0
- a canonical journey fails
- decision integrity fails
- J08 recovery fails
- critical modal focus containment fails
- critical exact focus return fails
- mobile semantic minimum fails on a critical journey
- evidence/inference boundary fails
- suggestion/decision/action boundary fails

P2 findings require explicit impact assessment and disposition.

## 6. Behavioral Tests

### B01 — Proposal Lifecycle

Required:

`PROPOSED → ACCEPTED → APPLYING → APPLIED / FAILED-INCOMPLETE`

Verify each state is observable, distinct, persistent across navigation, and never falsely collapsed. Re-enter the proposal after every meaningful transition.

### B02 — Correction Lifecycle

Required conceptual flow:

`CURRENT → CORRECTION REVIEW → CONFIRMED → REVIEW REQUIRED`

The executable state machine must match the documented model. Corrected understanding must persist. Dependent interpretations must be marked `REVIEW REQUIRED`, never silently rewritten.

### B03 — Decision Integrity

Verify:

- no selection → Commit unavailable
- select A → preview names A
- select B → preview names B and clears stale A
- Commit binds to B
- committed Decision remains distinct from Action

Invariant:

`SUGGESTION ≠ DECISION ≠ ACTION`

`DECISION COMMITTED ≠ ACTION COMMITTED`

### B04 — Action Outcome

Execute all:

`YES / PARTIAL / NO`

PARTIAL and NO must produce an adaptation path without forcing an adaptation decision.

### B05 — Error / Recovery

Required:

`ATTEMPT → APPLYING → FAILED-INCOMPLETE → RECOVERY`

Verify what happened, what was preserved, what remains incomplete, return with preserved state, and retry. Retry must be a distinct recovery attempt, not a cosmetic jump to success. Failed history must not be erased.

## 7. Epistemic Tests

### E01 — Evidence vs Inference

Verify recorded/observed evidence remains distinct from inferred/interpreted understanding after navigation.

`RECORDED / OBSERVED ≠ INFERRED / INTERPRETED`

### E02 — Suggestion vs Decision

A system suggestion must not become a user decision without explicit selection and commitment.

### E03 — Contradiction

Use a controlled contradiction fixture. Contradiction remains visibly unresolved when unresolved; evidence remains inspectable; no forced binary truth claim.

### E04 — Outdated Understanding

Verify:

`STALE ≠ FALSE`

Staleness must permit review/revalidation without asserting falsity.

### E05 — Correction

Repeat B02 independently and verify no invisible cascade of dependent changes occurs.

## 8. Accessibility Tests

### A01 — Keyboard-only

Execute J01–J08 without pointer input using Tab, Shift+Tab, Enter, Space where applicable, and Escape where applicable.

### A02 — Focus Visibility

Every sequentially focused control must have a visible focus indication.

### A03 — Modal Entry

Opening a modal must move focus into it deterministically.

### A04 — Modal Containment

While open, Tab and Shift+Tab must not escape the modal. Escape must dismiss where permitted.

### A05 — Exact Focus Return

Closing a modal returns focus to the exact invoking control if it still exists. Otherwise use a deterministic documented fallback.

### A06 — Focus Not Obscured

At desktop and mobile widths, focused controls must not be entirely hidden by author-created content, including fixed navigation and overlays. WCAG 2.2 defines Focus Not Obscured (Minimum) as SC 2.4.11. Reference: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

### A07 — Dynamic Status

Verify meaningful announcements for consequential state changes; generic announcements are insufficient evidence.

### A08 — Target Size

Review critical pointer targets against the WCAG 2.2 target-size baseline and record applicable exceptions.

## 9. Context Tests

### C01 — Context Entry

`Home → Goal → Evidence` must preserve meaningful parent context.

### C02 — Contextual Back

Evidence → Back returns to the relevant Goal context, not an arbitrary root.

### C03 — Search Context

`Search → Result → Detail` preserves enough context to explain the detail surface and supports deterministic return.

### C04 — Boundary

The prototype context stack is a validation-level navigation mechanism, not production domain architecture.

## 10. Mobile / Responsive Tests

Required: desktop, tablet, mobile.

Execute J01–J08 on mobile. Verify the semantic minimum remains intact:

`IDENTITY → STATUS → WHY → PRIMARY ACTION`

Explicitly test decision comparison, proposal state, correction/review, recovery, evidence/provenance, modal behavior, and fixed mobile navigation.

Responsive CSS existence is not evidence of PASS.

## 11. RTL / LTR Tests

Execute critical journeys in Persian RTL and English LTR. Verify reading order, navigation order, breadcrumb/context order, modal order, button order, focus order, numeric/date presentation, and directional affordances.

## 12. Mixed-Direction Stress Fixture

At least one fixture must combine Persian text, English labels, DECIVEXA identifiers, timestamps, dates, currency/numeric values, source metadata, evidence, and interpretation.

Example:

`نام فارسی + DECIVEXA-PR-042 + 2026-09-06 + €1,250.50 + English source + Persian interpretation`

Verify visual order, semantic order, selection/copy behavior, and focus behavior.

## 13. Canonical Journeys

- **J01 Orientation → Goal:** orientation and goal context preserved
- **J02 Today → Action → Outcome:** YES/PARTIAL/NO supported
- **J03 Today → Blocked → Adapt:** proposal lifecycle and user control preserved
- **J04 Goal → Evidence:** provenance boundary preserved
- **J05 Understand → Correct:** correction and dependent review preserved
- **J06 Decision → Compare → Commit:** commitment bound to selected option
- **J07 Search → Context:** search continuity and contextual return preserved
- **J08 Error → Recovery:** genuine preserved-state recovery

## 14. Adversarial Scenarios

Intentionally attempt to break the prototype with:

1. navigation immediately after a state transition
2. reopening after state change
3. selecting A then B before commit
4. repeated modal open/close
5. repeated Escape
6. repeated Tab/Shift+Tab cycles
7. mobile modal interaction near viewport edges
8. fixed-navigation/focus overlap
9. language switch inside deep context
10. mixed Persian/English search
11. stale → correction
12. contradiction → navigation → return
13. failed application → retry
14. rapid repeated consequential activation
15. reopening a completed proposal

## 15. Severity

**P0 — Critical Trust / Control:** unauthorized, misleading, irreversible, or epistemically unsafe behavior.

**P1 — Core Validation:** canonical lifecycle, persistence, decision binding, recovery, or critical accessibility failure.

**P2 — Major Validation Friction:** material but non-gating validation weakness.

**P3 — Minor:** non-critical defect.

**P4 — Cosmetic:** presentation-only defect.

## 16. Gate Decision

### PASS

All of the following:

- P0 = 0
- P1 = 0
- J01–J08 pass
- E01–E05 pass
- critical keyboard/modal behavior passes
- mobile semantic minimum passes
- RTL/LTR passes
- context preservation passes
- no unresolved trust/control defect remains

### FAIL

Any P0/P1, canonical journey failure, J08 failure, decision-integrity failure, epistemic-boundary failure, critical focus failure, or critical mobile semantic failure.

## 17. Execution Record

The execution result must be recorded separately as:

`docs/architecture/DECIVEXA_PROTOTYPE_V1_REVALIDATION_PASS_04_RECORD.md`

It must contain the exact tested commit, environment, evidence, matrix outcomes, defects, severity counts, gate decision, and explicit Controlled User Validation status.

## 18. Stage Position

```text
Prototype V1
  ↓
Internal Prototype Check — CONDITIONAL FAIL
  ↓
Refinement Pass 03 — COMPLETE
  ↓
Re-validation Pass 04 — CURRENT
  ↓
PASS → Pilot Readiness Review
FAIL → Targeted Prototype Refinement
```

**Current status:** READY TO EXECUTE PASS 04

**Controlled User Validation:** NOT CLEARED

**Production Implementation:** NOT AUTHORIZED
