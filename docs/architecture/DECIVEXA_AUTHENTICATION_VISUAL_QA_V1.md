# DECIVEXA Authentication Visual QA V1

**Date:** 2026-09-06  
**Status:** PRE-FREEZE QA — CALIBRATION STILL OPEN  
**Implementation:** NOT AUTHORIZED  
**Parent visual calibration:** `docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_V1.md`  
**Parent UX specification:** `docs/architecture/DECIVEXA_AUTHENTICATION_UX_SPEC_V1.md`

## 1. Purpose

This document records the first formal quality-assurance pass over the Authentication visual calibration candidates. It is an evidence layer, not an implementation specification and not a visual freeze.

The objective is to identify whether the current candidate system is internally coherent before any exact values are promoted to final design tokens.

## 2. QA Governance

The current order remains:

`Founder-approved direction → Design calibration → Evidence/QA → Revision if required → Founder design freeze → Separate implementation prompt → Authorized implementation`

A passing individual value does not automatically make the whole visual system final.

## 3. Candidate Contrast Check

The current candidate semantic palette was checked mathematically using relative luminance contrast ratios for representative foreground/background pairs.

| Pair | Candidate contrast | Preliminary reading |
|---|---:|---|
| Primary text `#17171C` on white | 17.86:1 | Strong |
| Secondary text `#5F606B` on white | 6.23:1 | Strong |
| Brand accent `#6E5FE0` on white | 4.80:1 | Suitable for normal-size text/action use subject to final context QA |
| Focus `#5B4BD6` on white | 6.14:1 | Strong |
| Error `#B42318` on white | 6.57:1 | Strong |
| Success `#18794E` on white | 5.41:1 | Strong |
| Brand deep `#30276F` on white | 12.76:1 | Strong |
| Boundary `#DCDDE5` on white | 1.35:1 | Appropriate only as a low-contrast structural boundary; not valid as a text color |

### QA interpretation

The candidate palette is promising for a light authentication surface. However, these pair checks do **not** prove the complete design passes accessibility. Final QA must additionally test:

- text at every actual size and weight;
- interactive components and their states;
- focus indicators against their surrounding context;
- error/success messaging;
- disabled states;
- Brand Environment gradients/tonal transitions;
- non-text graphical elements where applicable;
- browser rendering and anti-aliasing;
- increased text size and zoom.

**Result:** PRELIMINARY PASS WITH CONTEXTUAL QA REQUIRED.

## 4. Typography QA

### Candidate

Inter remains the strongest current candidate for the authentication system.

### QA criteria

- Credential-entry legibility: PASS candidate.
- Neutral contemporary character: PASS candidate.
- Excessive technical/enterprise character: NOT OBSERVED.
- Decorative/display character: NOT OBSERVED.
- International support: REQUIRES final language-set verification.
- Small-size readability: REQUIRES browser/device rendering verification.

**Result:** CANDIDATE ACCEPTED FOR NEXT CALIBRATION PASS; NOT FROZEN.

## 5. Geometry QA

The proposed 8px rhythm with 4px subdivisions is internally coherent with the proposed control and spacing ranges.

Potential risk areas requiring visual testing:

- 360–440px form width against long labels and localized strings;
- 48–52px controls at compact heights;
- 10–12px field radius against approximately 16px surface radius;
- 20–32px major vertical gaps across all auth states;
- password-manager/autofill rendering;
- browser zoom and increased text size;
- mobile keyboard-induced viewport changes.

**Result:** COHERENT CANDIDATE; EMPIRICAL RESPONSIVE QA REQUIRED.

## 6. Composition QA

The 60–65% Brand / 35–40% Authentication starting range is structurally compatible with the Founder-approved Strong Brand Dominance direction.

The critical QA rule is not the ratio itself. It is whether the Authentication area remains professionally usable.

The composition therefore fails if any of the following occur:

- form becomes cramped;
- title or labels wrap unnaturally;
- focus becomes difficult to perceive;
- primary action becomes visually or physically constrained;
- mobile transition is delayed beyond the point where content fit requires it;
- Brand visual intensity competes with active credential entry.

**Result:** CANDIDATE ACCEPTED; MULTI-WIDTH VISUAL TEST REQUIRED.

## 7. Brand Environment QA

The controlled-depth + distant-light direction is coherent with the approved DECIVEXA visual philosophy because it can communicate possibility without using literal humans, roads, robots, AI consciousness, dashboards, circuitry, or holographic technology.

### Main risk

The Brand Environment could become visually impressive but conceptually generic if the light/depth treatment is reduced to a common gradient or “AI future” aesthetic.

### Acceptance condition

Distinctiveness must come from composition, spatial rhythm, tonal discipline, and DECIVEXA-specific visual grammar rather than spectacle.

**Result:** DIRECTIONALLY PASSING; DISTINCTIVENESS QA STILL REQUIRED.

## 8. Authentication Surface QA

The restrained contained surface currently avoids the three largest risks:

1. conventional floating SaaS card;
2. glass/frosted UI cliché;
3. frameless form disappearing into the Brand Environment.

The surface must remain visually stable when validation/error states appear. Error messaging must not cause disruptive geometry changes.

**Result:** CANDIDATE ACCEPTED FOR NEXT PASS.

## 9. State-System QA

The state model is coherent with the UX specification:

`DEFAULT → FOCUS → FILLED → INVALID / VALID-AS-RELEVANT → DISABLED / LOADING`

Preliminary acceptance rules:

- Focus is visible without layout shift.
- Error is understandable without color alone.
- Success is calm rather than celebratory.
- Loading preserves action identity.
- Disabled does not resemble an accidental rendering failure.
- No ordinary field completion is treated as a gamified achievement.

**Result:** SYSTEM PASS AS A DESIGN MODEL; ACTUAL VISUAL MATRIX REQUIRED.

## 10. Responsive QA Gate

The responsive strategy is considered valid only if the same identity survives transformation:

`Split → Reduced split → Auth-priority composition → Vertical identity + auth`

The design must not become a shrunken desktop layout on mobile.

The first responsive sacrifice must be non-essential Brand visual density, not authentication usability.

**Result:** PRINCIPLE PASS; REAL VIEWPORT QA REQUIRED.

## 11. Accessibility QA Gate

Before visual freeze, the following must all be explicitly tested:

- WCAG-oriented contrast expectations;
- keyboard focus visibility;
- non-color-only state communication;
- text resizing;
- browser zoom;
- reflow;
- touch target practicality;
- logical focus order;
- error association;
- reduced motion;
- screen-reader-compatible visual/semantic relationships;
- long localized strings.

**Result:** OPEN — NOT YET A FINAL PASS.

## 12. Multi-State Visual Matrix

The final calibration review must inspect at minimum:

1. Login empty
2. Login focus
3. Login error
4. Login loading
5. Registration empty
6. Registration password guidance
7. Registration error
8. Verification waiting
9. Verification resend cooldown
10. Verification success
11. Verification expired
12. Forgot password initial
13. Forgot password confirmation
14. Reset entry
15. Reset error
16. Reset success
17. Session expired
18. Network/server failure
19. Rate-limit
20. Mobile collapsed

The system passes only when these states visibly belong to the same authentication product rather than appearing as independently styled screens.

## 13. Current Findings

### Strong findings

- The candidate semantic palette is numerically promising for the light authentication surface.
- The restrained form surface is consistent with the approved non-generic direction.
- The composition range is compatible with Strong Brand Dominance if usability remains the controlling constraint during interaction.
- The visual language avoids the major prohibited AI/futuristic clichés.
- The candidate typography direction is appropriately neutral and functional.

### Open findings

- Exact typography values remain subject to rendering QA.
- Exact palette values remain subject to contextual contrast and Brand Environment QA.
- Exact geometry remains subject to multi-width and localization QA.
- Brand Environment distinctiveness has not yet been empirically demonstrated.
- The full 20-state visual matrix has not yet been rendered and reviewed.
- Accessibility is not yet a final pass.

## 14. Decision

**Current overall result: PRE-FREEZE / PROMISING BUT NOT FINAL.**

No candidate value is promoted to a frozen implementation token by this QA pass.

The next design activity is a **final calibration refinement pass** focused on resolving the open findings above, especially:

1. typography precision;
2. contextual color relationships;
3. exact geometry coherence;
4. Brand Environment distinctiveness;
5. multi-state visual consistency;
6. responsive transformation;
7. accessibility evidence.

## 15. Governance Checkpoint

- Founder-approved composition foundation: D01–D03.
- Founder-approved governing visual gates: F-GATE-01 through F-GATE-05.
- Calibration candidates D27–D36: NOT FROZEN.
- QA decision D37 governance: active.
- Implementation: NOT AUTHORIZED.
- Claude Implementation Prompt: NOT CREATED.
- Final Design Freeze: NOT REACHED.
