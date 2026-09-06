# DECIVEXA Authentication Visual Design V1 — Founder Review Gate

**Date:** 2026-09-06  
**Status:** FOUNDER-APPROVED DESIGN DIRECTION / VISUAL CALIBRATION STILL IN PROGRESS  
**Implementation:** NOT AUTHORIZED  
**Claude Implementation Prompt:** NOT CREATED  
**Canonical parent specification:** `docs/architecture/DECIVEXA_AUTHENTICATION_UX_SPEC_V1.md`

## 1. Purpose

This record consolidates the Founder-level visual decisions required to govern the next stage of DECIVEXA Authentication visual design. It does not replace the canonical UX specification and does not authorize implementation.

The purpose is to prevent implementation agents from interpreting individual calibration values as product decisions and to establish a clean boundary between Founder intent, Design Lead execution, and future implementation.

## 2. Governing Principle

> **Founder controls WHAT / WHY → Design Lead controls HOW → Implementation executes approved HOW.**

Implementation agents must not make material product-identity or experience decisions merely because a visual value is technically unspecified.

## 3. Consolidated Founder Gates

### F-GATE-01 — Composition Architecture

**Decision:** Founder-approved and locked.

- Split Composition
- Brand-led relationship
- Strong Brand Dominance on sufficiently wide desktop layouts

**Interpretation:** DECIVEXA Brand / World establishes the dominant first visual context; Authentication remains a clear, stable, self-contained entry experience.

**Source decisions:** AUTH-V1-D01, D02, D03.

### F-GATE-02 — Brand Character

**Decision:** Founder-approved as the governing direction for continuation.

The Brand Environment must communicate calm intelligence, depth, possibility, continuity, intentionality, and human growth without becoming a marketing page or visual spectacle.

It must not rely on:

- humans or human silhouettes as the primary metaphor;
- robots or humanoid AI;
- brains or artificial-consciousness metaphors;
- dashboards or product UI previews;
- circuitry or holograms;
- generic futuristic technology spectacle;
- manipulative emotional cues.

The Brand Environment is an authentic DECIVEXA environment, not an advertisement embedded in authentication.

**Related decisions:** D06, D07, D09, D11, D12, D26.

### F-GATE-03 — Authentication Character

**Decision:** Founder-approved as the governing direction for continuation.

Authentication must be restrained, contained, calm, and high-clarity. It must not become a conventional floating SaaS card, glass/frosted panel, decorative centerpiece, or visually detached modal.

The preferred direction is a **Restrained Form Surface** whose containment comes primarily from composition, tonal separation, spacing, and subtle structural treatment.

**Related decisions:** D04, D05, D15, D16, D17, D18, D20.

### F-GATE-04 — Interaction Priority

**Decision:** Founder-approved as the governing interaction rule.

> **Brand dominates the first impression; usability dominates the interaction.**

Brand dominance must never be interpreted as interaction dominance. Once the user begins credential entry, authentication owns attention. Usability, clarity, accessibility, security comprehension, and task completion override non-essential Brand decoration.

**Related decisions:** D02, D03, D08, D11, D17, D21, D23.

### F-GATE-05 — Visual Philosophy

**Decision:** Founder-approved as the governing visual philosophy.

DECIVEXA should feel premium through restraint, precision, hierarchy, whitespace, material quality, and coherence—not through visual effects, technology spectacle, excessive animation, glassmorphism, neon, or decorative complexity.

**Related decisions:** D04–D26, with the anti-pattern register remaining binding.

## 4. Design Lead Authority After Founder Gates

Within the approved boundaries, the Design Lead may determine execution details without requesting Founder approval for every pixel-level choice.

This includes:

- final typeface selection;
- typographic scale and weights;
- semantic color values / HEX values;
- spacing and radius values;
- control dimensions;
- form width;
- desktop composition calibration;
- responsive content-fit thresholds;
- icon details;
- motion timing and easing;
- semantic token values;
- state calibration.

These choices remain subordinate to accessibility, usability, localization, browser rendering, multi-state consistency, and the Founder-approved gates.

## 5. Calibration Governance

AUTH-V1-D27 through AUTH-V1-D37 remain **calibration candidates** until final visual QA is complete.

In particular, the current proposals for Inter, typography ranges, candidate HEX values, 8px spacing rhythm, 16px surface radius, 48–52px control height, approximately 360–440px form width, approximately 60–65% Brand / 35–40% Authentication composition, content-fit responsive thresholds, and approximately 150–250ms motion are not automatically implementation requirements.

They may be adjusted during calibration when evidence shows that another value better satisfies the approved design intent.

## 6. Required Final Calibration Tests

Before Visual Design Freeze, the design must be evaluated across:

1. brand distinctiveness;
2. first-time comprehension;
3. authentication trust and clarity;
4. semantic color contrast;
5. keyboard focus and non-color state communication;
6. mobile and constrained layouts;
7. touch interaction;
8. browser rendering and autofill/password-manager behavior;
9. localization resilience;
10. all canonical authentication states;
11. consistency with the future DECIVEXA product shell;
12. absence of prohibited AI/futuristic visual clichés.

## 7. Multi-State Requirement

The final design must survive at least the 20-state QA matrix already defined in Section 24 of the parent specification, including login, registration, verification, recovery, reset, session-expired, failure/rate-limit, and mobile states.

A design that looks excellent only in the empty Login state is not considered complete.

## 8. Visual Design Freeze Conditions

Visual Design may be frozen only when:

- Founder-controlled material decisions have explicit approval;
- typography is final;
- palette is final and contrast-validated;
- geometry and spacing are calibrated;
- Brand and Authentication operate as one composition;
- the form remains contained without becoming generic SaaS;
- all states share one visual grammar;
- mobile is a true responsive transformation;
- accessibility QA passes;
- semantic tokens can represent the final design coherently;
- implementation no longer requires invention of missing visual decisions.

Until then:

**VISUAL DESIGN IN PROGRESS — IMPLEMENTATION NOT AUTHORIZED.**

## 9. Current State

- F-GATE-01: **LOCKED / FOUNDER APPROVED**
- F-GATE-02: **APPROVED GOVERNING DIRECTION**
- F-GATE-03: **APPROVED GOVERNING DIRECTION**
- F-GATE-04: **APPROVED GOVERNING DIRECTION**
- F-GATE-05: **APPROVED GOVERNING DIRECTION**
- D27–D37: **CALIBRATION CANDIDATES / NOT FROZEN**
- Multi-state QA: **DEFINED / NOT YET EXECUTED**
- Visual Design Freeze: **NOT REACHED**
- Implementation: **NOT AUTHORIZED**
- Claude Implementation Prompt: **NOT CREATED**

## 10. Audit Rule

This Founder Gate record is an explicit governance companion to the canonical authentication UX/visual specification. The parent specification remains the detailed source for the individual decisions and design rules. No historical decision may be silently rewritten.

Any material change to the Founder-approved composition architecture, Brand character, Authentication character, interaction priority, or visual philosophy requires a new explicit Founder decision and an auditable amendment.
