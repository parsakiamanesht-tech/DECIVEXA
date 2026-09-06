# DECIVEXA Authentication Visual Calibration Refinement V1

**Date:** 2026-09-06  
**Status:** REFINEMENT PROPOSAL — NOT FROZEN  
**Implementation:** NOT AUTHORIZED  
**Claude Implementation Prompt:** NOT CREATED  
**Parent visual calibration:** `docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_V1.md`  
**Parent QA:** `docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_QA_V1.md`  
**Accessibility authority:** `docs/architecture/DECIVEXA_ACCESSIBILITY_SPECIFICATION_V1.md`

## 1. Purpose

This record captures the next refinement pass after the first pre-freeze QA. It does not replace the parent calibration or QA records and does not authorize implementation.

The objective is to resolve material open findings before a future Visual Design Freeze.

## 2. Critical Refinement Finding — Typography / RTL

### Finding

The previous **Inter-only** typography candidate is no longer accepted as the preferred system candidate.

The repository's canonical accessibility specification explicitly treats **Persian and English as first-class languages** and requires support for Persian readability, mixed RTL/LTR content, long labels, and text enlargement. Therefore a typography candidate must be evaluated as a bilingual/RTL product system, not only as an English authentication system.

This is a substantive refinement of D27, not a Founder-level product-direction change.

### Refined candidate

**Vazirmatn** is now the leading primary UI typeface candidate for Authentication, subject to rendering and language QA.

Vazirmatn is specifically designed as a Persian/Arabic typeface for web pages and applications, and its project documentation describes Latin support as part of the family/build system. citeturn0search0turn0search2

### Why this is stronger for DECIVEXA

- Persian is a first-class DECIVEXA language requirement.
- RTL/LTR coexistence is a product requirement, not an edge case.
- Authentication is a high-frequency, trust-critical surface where fallback-font switching is undesirable.
- A single coherent UI family reduces visual fragmentation between Persian and English authentication.
- The neutral contemporary character remains compatible with the approved restrained visual philosophy.

### Rejected for primary system role

**Inter as the sole primary family** is rejected for the next calibration pass because its suitability cannot be judged only from Latin rendering while DECIVEXA requires first-class Persian/RTL support.

Inter may remain useful as a comparison/reference candidate during visual QA, but it is no longer the preferred primary direction.

**Status:** Leading candidate — NOT FROZEN.

## 3. Refined Typography Candidate Scale

The following values are narrower calibration targets rather than implementation tokens:

| Role | Refinement target | Weight direction |
|---|---:|---|
| Brand identity | 17–19px | 500–600 |
| Authentication title | 30–34px | 600 |
| Supporting text | 15–16px | 400 |
| Field label | 14px | 500 |
| Input value | 16px | 400–500 |
| Helper / state | 13–14px | 400–500 |
| Primary action | 15px | 600 |
| Secondary action | 14px | 500 |

### Typography rules

- No arbitrary letter-spacing for Persian text.
- Line-height must be validated independently for Persian and Latin scripts.
- No fixed-height text containers for critical authentication copy.
- Mixed email/URL/identifier strings must preserve correct LTR treatment inside RTL layouts.
- Font fallback must be deliberate rather than accidental.

**Status:** Candidate refinement — NOT FROZEN.

## 4. Refined Geometry

The geometry system remains based on an 8px rhythm with 4px subdivisions, but the calibration is narrowed:

- Authentication surface radius: **16px candidate**.
- Field/control radius: **10px candidate**.
- Primary control height: **50px candidate**.
- Minimum practical touch target: **44px candidate**, with WCAG target-size requirements treated as the formal baseline.
- Form reading width: **400px nominal candidate**, allowed to expand/contract according to content and localization.
- Horizontal internal padding: **32px candidate** on comfortable desktop form surfaces.
- Vertical internal padding: **32px candidate**, subject to viewport height and state density.
- Field-to-field spacing: **16px candidate**.
- Major group spacing: **24px candidate**.
- Primary action separation: **24px candidate** where hierarchy requires it.

These values remain calibration targets, not frozen tokens.

## 5. Refined Authentication Surface

The surface direction is now more specifically defined as:

**Contained Form Surface / Near-flat Material**

It should read as a stable material plane inside the authentication territory rather than a card floating above it.

Preferred hierarchy:

`surface contrast → spatial containment → subtle structural edge → optional minimal elevation`

Not preferred:

`shadow → card → glass → decoration`

The surface must remain visually stable when errors, helper text, password guidance, or verification states appear.

## 6. Refined Color Roles

The existing candidate semantic palette remains provisionally acceptable for the light Authentication surface because the first QA pass found strong representative contrast values. fileciteturn69file0

The following roles remain candidates:

- Brand accent: `#6E5FE0`
- Brand deep: `#30276F`
- Auth surface: `#FFFFFF`
- Auth background: `#F7F7FA`
- Primary text: `#17171C`
- Secondary text: `#5F606B`
- Structural boundary: `#DCDDE5`
- Focus: `#5B4BD6`
- Error: `#B42318`
- Success: `#18794E`

### Refinement rule

No palette value is frozen until it is tested in its **actual component context**, including focus, disabled, error, success, and Brand Environment relationships.

The low-contrast boundary remains structural only and must never be promoted to text/status use.

## 7. Refined Brand Environment Grammar

The main open Brand risk identified by QA is genericity. The environment therefore must not depend on a generic purple gradient alone.

The candidate grammar is:

`deep field → controlled spatial depth → restrained directional structure → single distant possibility cue`

The visual identity should emerge from the relationship between space, depth, restraint, and controlled light rather than from a recognizable stock metaphor.

### Prohibited escalation

Do not add particles, stars, holograms, circuitry, floating interfaces, AI faces, humans, roads, or sci-fi objects merely to increase distinctiveness.

### Interaction attenuation

When the user focuses the authentication form, Brand visual intensity should remain perceptible but visually retreat enough to preserve task focus.

## 8. Refined Desktop Composition

The earlier 60–65% Brand / 35–40% Authentication range remains a starting point only.

Refinement rule:

> **Use the largest Brand territory that preserves a calm, fully usable authentication reading column.**

The form should feel optically centered within its usable authentication territory, not mechanically centered inside the whole viewport.

The Brand focal cue should be offset from the form's strongest visual axis so the two areas do not create competing centers of gravity.

## 9. Refined Responsive Transformation

Responsive behavior is now treated as four compositional modes:

1. **Wide:** Brand-led split.
2. **Constrained:** split preserved, Brand density reduced.
3. **Auth-priority:** authentication receives more visual territory while Brand identity remains present.
4. **Mobile:** vertical identity → authentication → supporting paths.

The transition must occur when content-fit or interaction quality requires it, not at arbitrary device labels.

## 10. State Calibration Refinement

The state system must preserve one geometry across ordinary field states wherever possible.

### Error

Error should increase informational clarity, not visual drama.

Structure:

`field identification → concise problem → correction guidance`

### Success

Success should communicate completion without celebration.

### Loading

Loading should preserve button geometry and wording hierarchy. A progress indicator may appear, but it must not imply AI activity or autonomous thought.

### Session expired

The state should visually explain:

`why re-authentication is needed → what is preserved → what the user can do now`

without turning the page into a security warning spectacle.

## 11. Localization Stress Cases

Before freeze, visual QA must include at minimum:

- English Login
- Persian Login
- English Registration
- Persian Registration
- mixed Persian + email address
- mixed Persian + password guidance
- long translated error
- enlarged text
- RTL layout with LTR email/URL identifier

A candidate that succeeds only in English is not accepted.

## 12. Accessibility Refinement

The repository's accessibility specification establishes WCAG 2.2 AA as the formal baseline and explicitly requires Persian/English, RTL/LTR, text enlargement, focus visibility, target-size compliance, and accessible authentication. fileciteturn74file0

Therefore the Authentication visual freeze requires evidence for:

- WCAG 2.2 AA-oriented contrast;
- visible focus;
- focus not obscured;
- keyboard-only operation;
- target-size practicality;
- no color-only state meaning;
- reflow/text enlargement;
- Persian/RTL rendering;
- error association;
- reduced motion.

## 13. Updated Decision Register

| ID | Refinement | Status |
|---|---|---|
| D38 | Primary typography direction refined from Inter-only to Vazirmatn candidate | Leading candidate / Not Frozen |
| D39 | Bilingual typography scale narrowed | Candidate / Not Frozen |
| D40 | Geometry narrowed around 16/10/50px surface/control system | Candidate / Not Frozen |
| D41 | Authentication surface refined to Near-flat Contained Material | Candidate / Not Frozen |
| D42 | Brand Environment grammar refined around spatial depth + controlled directional light | Candidate / Not Frozen |
| D43 | Desktop composition governed by usable auth reading column, not fixed ratio | Candidate / Not Frozen |
| D44 | Responsive system formalized into four compositional modes | Candidate / Not Frozen |
| D45 | Localization stress testing promoted to mandatory freeze evidence | Candidate / Not Frozen |

## 14. Important Governance Finding

This refinement demonstrates why the calibration stage exists: the initial Inter candidate looked strong under an English-first evaluation, but the canonical DECIVEXA accessibility requirements make Persian/RTL a first-class constraint. The design system must therefore optimize for the real product, not for an English-only mockup.

This is a **design refinement**, not a change to Founder-approved composition, Brand character, Authentication character, interaction priority, or visual philosophy.

## 15. Current State

- D01–D03: **LOCKED / FOUNDER APPROVED**.
- F-GATE-01 through F-GATE-05: **APPROVED GOVERNING DIRECTIONS**.
- D27–D37: **SUPERSEDED/REFINED WHERE NECESSARY; HISTORICAL RECORD RETAINED**.
- D38–D45: **CALIBRATION CANDIDATES / NOT FROZEN**.
- Multi-state QA: **DEFINED / NOT FULLY EXECUTED**.
- RTL/LTR QA: **NEWLY ELEVATED AS A REQUIRED FREEZE TEST**.
- Accessibility: **OPEN / FINAL EVIDENCE REQUIRED**.
- Visual Design Freeze: **NOT REACHED**.
- Implementation: **NOT AUTHORIZED**.
- Claude Implementation Prompt: **NOT CREATED**.

## 16. Next Gate

The next gate is not another speculative styling pass. It is **evidence-driven Visual Freeze QA**:

1. bilingual/RTL typography review;
2. multi-state matrix;
3. responsive composition review;
4. contextual contrast review;
5. accessibility evidence review;
6. Brand Environment distinctiveness review;
7. final token consolidation;
8. Founder Visual Design Freeze.

Only after that sequence can a separate Claude Implementation Prompt be created.