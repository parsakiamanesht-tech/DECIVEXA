# DECIVEXA Authentication Visual Calibration V1

**Date:** 2026-09-06  
**Status:** CALIBRATION PROPOSAL — NOT FROZEN  
**Implementation:** NOT AUTHORIZED  
**Claude Implementation Prompt:** NOT CREATED  
**Parent specification:** `docs/architecture/DECIVEXA_AUTHENTICATION_UX_SPEC_V1.md`  
**Governance companion:** `docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_FOUNDER_GATE_V1.md`

## 1. Purpose

This document records the next-stage exact visual calibration for DECIVEXA Authentication. It converts the approved visual philosophy into a coherent candidate system while explicitly preventing candidate values from becoming implementation requirements before final visual QA and Founder-controlled design freeze.

The governing rule remains:

> **Founder controls WHAT / WHY → Design Lead controls HOW → Implementation executes approved HOW.**

## 2. Calibration Decision

The calibration is intentionally treated as a system rather than independent styling choices. Typography, color, geometry, composition, states, responsive behavior, and motion must be evaluated together.

A candidate value may be changed when another value produces materially better:

- readability;
- trust;
- brand distinctiveness;
- accessibility;
- responsive resilience;
- state clarity;
- localization resilience;
- browser behavior;
- cross-screen consistency.

## 3. Typography Calibration — AUTH-V1-D27

### Candidate

**Inter** as the primary neutral-modern sans-serif candidate.

### Rationale

Inter provides strong screen legibility, restrained contemporary character, clear credential-entry letterforms, and broad Latin-language support. It avoids making authentication feel editorial, decorative, or overly technical.

### Alternatives considered

- **Manrope:** stronger personality; risk of making the authentication surface feel more styled than functional.
- **Plus Jakarta Sans:** polished but more personality-forward than necessary for credential entry.
- **IBM Plex Sans:** highly credible but introduces a more technical/enterprise character than desired.

### Candidate typographic ranges

| Role | Candidate size | Candidate weight | Purpose |
|---|---:|---|---|
| Brand identity | 16–20px | Medium/Semibold | Orientation |
| Authentication title | 28–36px | Semibold | Primary page hierarchy |
| Supporting text | 14–16px | Regular | Explanation |
| Field label | 13–14px | Medium | Persistent identification |
| Input value | 15–16px | Regular/Medium | Credential entry |
| Helper/state | 12–14px | Regular/Medium | Supporting feedback |
| Primary action | 14–16px | Medium/Semibold | Main action |
| Secondary action | 13–15px | Medium | Supporting navigation |

**Status:** Candidate; not frozen.

## 4. Color Calibration — AUTH-V1-D29

### Candidate semantic palette

| Semantic role | Candidate value | Purpose |
|---|---|---|
| Brand accent | `#6E5FE0` | Recognition / controlled interaction accent |
| Brand deep | `#30276F` | Deep Brand Environment tone |
| Authentication surface | `#FFFFFF` | High-clarity form environment |
| Authentication background | `#F7F7FA` | Quiet neutral surrounding surface |
| Primary text | `#17171C` | High-legibility content |
| Secondary text | `#5F606B` | Supporting information |
| Structural boundary | `#DCDDE5` | Restrained separation |
| Focus indicator | `#5B4BD6` | Keyboard/focus clarity |
| Error | `#B42318` | Semantic error communication |
| Success | `#18794E` | Semantic success communication |

### Calibration rule

The semantic palette is deliberately not a single-brand-color system. Brand color provides recognition; semantic colors provide meaning.

The earlier exploratory purple `#7464DE` is **not canonical** and must not be treated as a locked DECIVEXA Authentication value.

Exact contrast must be verified for every relevant foreground/background/state pairing before freeze.

**Status:** Candidate; not frozen.

## 5. Geometry Calibration — AUTH-V1-D30

### Candidate system

- Base spacing rhythm: **8px**, with **4px subdivisions** where necessary.
- Authentication surface radius: approximately **16px**.
- Field/control radius: approximately **10–12px**.
- Primary control height: approximately **48–52px**.
- Practical touch target: **44px minimum**, with preference for larger where composition permits.
- Form width: approximately **360–440px**, calibrated against content and localization.
- Major vertical form gaps: approximately **20–32px**, depending on grouping.

### Geometry principle

The system should feel controlled and contemporary, not rounded for decoration. Primary actions should not become pills by default. Radius must remain coherent across surface, fields, buttons, and supporting controls.

**Status:** Candidate; not frozen.

## 6. Desktop Composition Calibration — AUTH-V1-D31

### Candidate composition

For sufficiently wide desktop layouts, begin visual calibration around:

**60–65% Brand Environment / 35–40% Authentication area**

This is a calibration starting point, **not a permanent 60/40 rule**.

The final composition must be judged at multiple widths and content states. The Authentication area must retain a stable reading column and adequate negative space. Brand focal intensity must not compete with credential entry once interaction begins.

### Acceptance rule

If preserving the candidate proportion causes form compression, excessive wrapping, poor focus visibility, or touch/accessibility degradation, the proportion must yield.

## 7. Brand Environment Calibration — AUTH-V1-D32

The Brand Environment should use:

- controlled depth;
- deep tonal transitions;
- a restrained focal light or structured distant point;
- spatial continuity rather than literal narrative illustration.

The intended emotional reading is:

**depth → possibility → direction → entry**

The environment must not depict a person, road, robot, brain, artificial consciousness, dashboard, circuitry, hologram, or generic futuristic technology.

It must remain sufficiently quiet during active form interaction.

**Status:** Candidate; not frozen.

## 8. Authentication Surface Calibration — AUTH-V1-D33

The Authentication surface should be:

- contained;
- high-clarity;
- low-noise;
- visually stable;
- clearly separated from Brand content without appearing detached.

Candidate treatment:

- white/near-white semantic surface;
- low-contrast structural edge where useful;
- no shadow or only extremely restrained elevation;
- moderate radius;
- generous but disciplined internal padding.

The visual objective is **contained, not floating**.

Rejected as default directions:

- heavy SaaS card;
- frosted/glass panel;
- highly elevated floating card;
- decorative framed centerpiece.

**Status:** Candidate; not frozen.

## 9. Control-State Calibration — AUTH-V1-D34

Canonical state progression:

`DEFAULT → FOCUS → FILLED → INVALID / VALID-AS-RELEVANT → DISABLED / LOADING`

### Default

Neutral surface, quiet structural boundary, clear label.

### Focus

Unmistakable focus ring/outline without layout shift. Focus must not depend on color alone.

### Filled

Same geometry as default. No decorative reward or unnecessary success treatment merely because text was entered.

### Invalid

Semantic error treatment plus concise explanatory text and structural emphasis. Error must not be communicated by color alone.

### Valid-as-relevant

Use only where confirmation has genuine user value. Do not turn ordinary input completion into gamified feedback.

### Disabled / Loading

Preserve layout and action identity. Communicate unavailable/progress state without visual theatrics.

## 10. Responsive Calibration — AUTH-V1-D35

Responsive thresholds should be based on **content fit**, not device labels.

### Wide

Full split composition with Brand dominance.

### Constrained

Split composition remains, but Brand visual density is reduced before Authentication usability is reduced.

### Compact

Authentication receives increasing spatial priority while Brand identity remains recognizable.

### Mobile

Vertical transformation:

`DECIVEXA identity → authentication task → supporting paths`

The Brand Environment becomes reduced rather than deleted unless removal is required for usability.

No hover-dependent interaction may be required.

The layout must survive:

- virtual keyboards;
- browser zoom;
- increased text size;
- autofill;
- password managers;
- long localized strings;
- narrow widths;
- portrait orientation.

## 11. Motion Calibration — AUTH-V1-D36

Candidate transition range:

**150–250ms** for short state/continuity transitions where motion materially improves comprehension.

Motion must never delay a user action.

Allowed purposes:

- loading feedback;
- state appearance;
- successful completion;
- responsive continuity.

Prohibited patterns:

- perpetual motion;
- pulsing primary status;
- glow as status communication;
- attention-grabbing entrance choreography;
- artificial urgency;
- motion suggesting consciousness or emotional presence.

Reduced-motion preferences remain authoritative.

**Status:** Candidate; not frozen.

## 12. Multi-State Visual Matrix

Final calibration must be reviewed across at least:

1. Login — empty
2. Login — focused
3. Login — validation/authentication error
4. Login — loading
5. Registration — empty
6. Registration — password guidance
7. Registration — error
8. Verification — waiting
9. Verification — resend cooldown
10. Verification — success
11. Verification — expired/invalid
12. Forgot password — initial
13. Forgot password — confirmation
14. Reset password — entry
15. Reset password — error
16. Reset password — success
17. Session expired
18. Network/server failure
19. Rate-limit state
20. Mobile collapsed composition

The design is not considered successful if it only looks strong in the empty Login state.

## 13. Cross-State Invariants

Across all states, preserve:

- DECIVEXA identity;
- typographic hierarchy;
- geometry;
- spacing rhythm;
- semantic color architecture;
- focus visibility;
- error/success language;
- primary-action hierarchy;
- responsive behavior;
- restrained Brand Environment behavior.

State content may change; the visual grammar must not fragment.

## 14. Accessibility Calibration Gate

Before freeze, verify:

- text and interactive contrast;
- focus visibility;
- non-color-only error/success communication;
- logical focus movement;
- readable text at enlarged sizes;
- reflow without loss of functionality;
- touch-safe targets;
- keyboard-only operation;
- error association;
- reduced motion;
- localization expansion.

Target modern WCAG AA expectations, with stricter judgment for trust-critical controls where appropriate.

## 15. Localization Resilience Gate

The visual system must not assume English-only content. Calibration must tolerate:

- longer labels;
- longer error messages;
- translated action text;
- different word lengths;
- increased text size.

No fixed height may cause critical content to clip when text expands.

## 16. Browser / Credential UX Gate

The final design must remain visually stable with:

- browser autofill;
- password-manager overlays or icons;
- native focus behavior;
- mobile keyboards;
- semantic input metadata.

Browser credential behavior must not be “fixed” through visual hacks that damage accessibility or security UX.

## 17. Exact Calibration Decision Register

| ID | Area | Candidate | Status |
|---|---|---|---|
| D27 | Typeface | Inter | Candidate / Not Frozen |
| D28 | Type scale | 12–36px role-based range | Candidate / Not Frozen |
| D29 | Color | Semantic palette above | Candidate / Not Frozen |
| D30 | Geometry | 8px rhythm / moderate radius / 48–52px controls | Candidate / Not Frozen |
| D31 | Composition | 60–65 / 35–40 starting calibration | Candidate / Not Frozen |
| D32 | Brand Environment | Controlled depth + distant light/structure | Candidate / Not Frozen |
| D33 | Auth Surface | Restrained contained surface | Candidate / Not Frozen |
| D34 | Control States | Clear semantic state progression | Candidate / Not Frozen |
| D35 | Responsive | Content-fit thresholds | Candidate / Not Frozen |
| D36 | Motion | 150–250ms restrained transitions | Candidate / Not Frozen |
| D37 | Governance | QA before freeze; values remain revisable | LOCKING RULE |

## 18. Final Calibration Acceptance Criteria

A candidate system can advance toward Visual Design Freeze only if it demonstrates all of the following:

- unmistakable DECIVEXA identity without cliché;
- immediate authentication comprehension;
- premium restraint rather than visual spectacle;
- clear trust/security cues without fear-based design;
- coherent first impression and interaction priority;
- stable visual grammar across all authentication states;
- true mobile transformation;
- sufficient contrast and focus visibility;
- localization resilience;
- compatibility with browser credential behavior;
- no unnecessary decorative complexity;
- no AI-consciousness or futuristic-tech visual metaphors;
- clean semantic-token representation;
- no need for implementation agents to invent missing material design decisions.

## 19. Governance Status

This document is a **calibration record, not an implementation specification**.

No value in Sections 3–18 authorizes code changes.

The final design remains subject to:

1. visual QA;
2. multi-state QA;
3. accessibility QA;
4. responsive QA;
5. localization QA;
6. Founder-controlled Visual Design Freeze;
7. a separate Claude Implementation Prompt;
8. the applicable implementation authorization gate.

**Current status:** `VISUAL DESIGN IN PROGRESS — CALIBRATION CANDIDATES NOT FROZEN — IMPLEMENTATION NOT AUTHORIZED`.
