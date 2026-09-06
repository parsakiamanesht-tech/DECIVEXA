# DECIVEXA Visual Language V1

**Status:** DESIGN DRAFT — FOUNDER REVIEW REQUIRED — IMPLEMENTATION NOT AUTHORIZED  
**Parent specification:** `docs/architecture/DECIVEXA_EXPERIENCE_DESIGN_MASTER_SPEC_V1.md`  
**Purpose:** Establish DECIVEXA's visual language before implementation, while preserving the distinction between validated design direction and values that still require screen-level validation.

---

# 1. Visual North Star

## Quiet Intelligence × Human Depth × Precise Clarity

DECIVEXA should feel calm, intelligent, mature, premium, human, and precise.

It should not visually resemble:

- a generic SaaS dashboard,
- a productivity tracker,
- an AI chatbot,
- an enterprise ERP,
- a wellness/gamification app,
- or a futuristic sci-fi interface.

The visual system should communicate intelligence through hierarchy, context, explanation, and restraint—not through technological spectacle.

---

# 2. Visual Character

The target character is:

- Calm
- Precise
- Human
- Deep
- Premium
- Editorial
- Quietly distinctive
- Trustworthy
- Contemporary

The visual identity must remain recognizable even when the DECIVEXA logo is removed.

**North-star test:** If the logo disappears, the experience should still feel like DECIVEXA.

---

# 3. Visual Composition Principle

The visual hierarchy follows cognitive hierarchy.

```text
Human meaning
    ↓
Context
    ↓
Primary focus
    ↓
Action / decision
    ↓
Supporting context
    ↓
Evidence / history
    ↓
Decoration
```

Decoration is always subordinate to comprehension.

If visual impressiveness makes understanding harder, the design has failed.

---

# 4. Overall Visual Environment

DECIVEXA should use a neutral editorial environment rather than a highly branded application canvas.

## Light mode direction

- Soft neutral/off-white canvas
- Quiet neutral surfaces
- Deep neutral primary text
- Controlled borders
- Purple used as identity/accent
- No pure-white-everywhere appearance

## Dark mode direction

- Deep near-black neutral canvas
- Neutral dark surfaces
- High-legibility text
- Restrained purple accents
- No pure-black + saturated-purple cyber aesthetic

The exact production values remain subject to screen validation.

---

# 5. Color Architecture

## 5.1 Foundation palette

The visual system is organized around semantic roles rather than direct color values.

### Canvas

Primary page environment.

### Surface

Primary content surface.

### Surface Subtle

Low-emphasis grouping and secondary structure.

### Surface Elevated

Content requiring controlled elevation.

### Overlay

Dialogs, drawers, popovers, and temporary focused layers.

---

## 5.2 Text hierarchy

```text
Text Primary
Text Secondary
Text Tertiary
Text Disabled
Text Inverse
```

Primary text must carry the strongest readable contrast. Secondary and tertiary text should remain clearly readable without competing with primary information.

---

## 5.3 Border hierarchy

```text
Border Subtle
Border Default
Border Strong
Border Focus
```

Borders are functional separators, not decorative frames.

---

# 6. DECIVEXA Purple Architecture

Purple is a core part of DECIVEXA's identity, but it must be controlled.

The purple family is conceptually divided into:

```text
Purple Soft
Purple Core
Purple Strong
Purple Contrast
```

### Purple Core

Primary brand identity and selected high-value actions.

### Purple Soft

Subtle contextual emphasis and selected surfaces.

### Purple Strong

High-emphasis states where stronger brand presence is necessary.

### Purple Contrast

Text/icon/background pairings requiring accessible contrast.

## Critical rule

**Purple is an accent and identity system, not a flood color.**

Large areas of saturated purple should be exceptional rather than the default product canvas.

This protects DECIVEXA from drifting toward generic AI-startup aesthetics.

---

# 7. Semantic Color

Semantic roles:

```text
Success
Warning
Danger
Information
Focus
Possibility
```

Semantic colors must never be the sole carrier of meaning.

Meaning should be reinforced through:

- label,
- icon where useful,
- typography,
- structure,
- placement,
- and state.

Accessibility validation must be performed against actual final color pairings. WCAG 2.2 is the current international accessibility baseline and includes requirements around focus visibility, focus not being obscured, and minimum target size. citeturn0search0turn0search5

---

# 8. Epistemic Visual Language

This is a defining visual capability of DECIVEXA.

The interface must distinguish:

```text
Observed
Recorded
Inferred
Suggested
Confirmed
Questioned
Outdated
Contradicted
```

The distinction should not become a rainbow of eight unrelated colors.

Instead, use a coordinated combination of:

- label,
- typography,
- structural treatment,
- provenance,
- timestamp/context,
- restrained semantic color.

## Example hierarchy

### Confirmed

Strongest visual stability.

### Inferred

Clearly identified as interpretation, not fact.

### Suggested

Clearly identified as a proposal.

### Questioned

Visible uncertainty without alarming styling.

### Outdated

Subdued but still legible; never silently treated as current.

### Contradicted

Clearly surfaced with explanation and context rather than an aggressive error aesthetic.

---

# 9. Typography Direction

Typography is a major part of DECIVEXA's identity.

The desired character is:

- contemporary,
- humanist/editorial,
- precise,
- highly readable,
- calm,
- suitable for both product UI and reflective content.

Final font family selection remains open until candidate fonts are evaluated against real Persian and English Mother Screens.

---

# 10. Persian / English Typography

Persian and English are equal first-class languages.

Typography must be tested for:

- RTL flow
- LTR flow
- mixed-direction content
- Persian numerals
- Latin numerals
- dates
- times
- percentages
- tables
- labels
- navigation
- long-form reading
- dense data

The visual system must never treat Persian as an afterthought or merely mirrored English UI.

---

# 11. Type Hierarchy

Canonical roles:

```text
Display
H1
H2
H3
Body Large
Body
Body Small
Label
Caption
Micro
```

Preferred working weights:

```text
Regular
Medium
Semibold
```

Bold should be used deliberately, not as the default hierarchy mechanism.

---

# 12. Typography Rhythm

Typography should create hierarchy primarily through:

1. size,
2. weight,
3. line-height,
4. spacing,
5. placement,
6. restrained color.

The system should avoid excessive use of font weight as the only method of emphasis.

Persian line-height should prioritize readability over compactness.

---

# 13. Number & Data Typography

Numbers require their own validation because DECIVEXA will represent:

- goals,
- time,
- progress,
- capacity,
- money,
- history,
- comparisons,
- dates,
- and other structured information.

The final numeral strategy must be consistent across Persian and English contexts and must be validated in tables, charts, cards, and mobile layouts.

---

# 14. Spacing Visual Rhythm

The underlying rhythm is 8-oriented with supporting substeps:

```text
4
8
12
16
24
32
40
48
64
80
96
```

The visual principle is more important than the raw values:

**Information → Space → Information → Space → Focus**

DECIVEXA should breathe.

Dense interfaces must remain possible where the information genuinely requires density, but density must be intentional.

---

# 15. Layout Widths

Three primary visual content modes:

## Reading

Narrower, calmer width for:

- Understanding
- reasoning
- reflection
- explanation
- narrative

## Working

Medium/wider width for:

- Goals
- Today
- Planning
- Actions

## Data

Wider structured width for:

- Evidence
- History
- tables
- comparisons
- analytical views

A single global max-width should not be forced onto every experience.

---

# 16. Surface Language

DECIVEXA should feel like an environment, not a stack of cards.

Priority of separation:

```text
Whitespace
↓
Typography
↓
Position / hierarchy
↓
Surface contrast
↓
Border
↓
Shadow
```

The farther down the list, the more exceptional the usage should become.

## Card discipline

Cards are permitted when they create useful containment.

Cards are not the default container for every piece of content.

---

# 17. Radius Language

The product uses moderate, controlled rounding.

Conceptual levels:

```text
Small
Medium
Large
```

Pill treatment is reserved for genuinely compact categorical elements.

The product must avoid:

- every element being rounded,
- giant capsule buttons,
- oversized bubble UI,
- playful fintech-style card geometry.

---

# 18. Shadow Language

Shadows communicate spatial relationship.

They are not decorative effects.

Conceptual levels:

```text
None / Flat
Subtle Raised
Elevated
Overlay
```

Shadows must remain soft and restrained.

No dramatic floating panels.

---

# 19. Border Language

Borders should be:

- subtle,
- purposeful,
- consistent,
- accessible,
- and subordinate to content.

A border should answer:

> What relationship does this boundary clarify?

If there is no useful answer, the border is probably unnecessary.

---

# 20. Iconography

DECIVEXA iconography is:

**Quiet + line-based + precise + optically balanced.**

Requirements:

- consistent stroke language,
- consistent optical weight,
- restrained detail,
- strong recognizability,
- predictable alignment.

Avoid as generic product language:

- AI sparkle,
- robot,
- brain,
- magic wand,
- hologram,
- glowing orb,
- circuit motifs,
- 3D cartoon iconography.

---

# 21. Buttons

Button hierarchy should communicate importance rather than decorate the interface.

Conceptual hierarchy:

### Primary

One dominant action in a local context.

### Secondary

Useful alternative or supporting action.

### Tertiary / Quiet

Low-emphasis action.

### Destructive

Clearly consequential action with calm but unmistakable semantics.

The visual system must avoid making every action look equally important.

---

# 22. Inputs

Inputs should feel calm and trustworthy.

The field should make clear:

- what is expected,
- current value,
- focus state,
- validation state,
- optional/required status,
- and recovery path when invalid.

Error treatment should not be aggressive before an actual error exists.

---

# 23. Navigation Visual Language

Navigation is quiet and stable.

Active state should be communicated through a combination of:

- position,
- typography,
- subtle surface treatment,
- restrained brand accent.

It should not rely on:

- oversized icons,
- neon highlights,
- animated indicators,
- excessive color blocks.

Consistent navigation and predictable help/location patterns are also aligned with WCAG's broader predictable-navigation principles. citeturn0search0turn0search5

---

# 24. Home Visual Language

Home must visually feel like **orientation**, not dashboard analytics.

The hierarchy should read naturally as:

```text
Where am I?
↓
What matters now?
↓
What changed?
↓
What deserves attention?
↓
What is next?
```

The page should have visual breathing room around the Primary Focus.

---

# 25. Today Visual Language

Today should feel active but not hectic.

Visual rhythm:

```text
Context
↓
Direction
↓
Commitments
↓
Priority Actions
↓
Capacity
↓
Adaptation
```

The user should feel oriented rather than managed.

---

# 26. Goal Visual Language

Goals should feel like direction and movement rather than project-management boards.

The primary visual hierarchy should emphasize:

```text
Why
↓
Current reality
↓
Direction
↓
Path
↓
Next meaningful step
```

Progress should not dominate the screen.

---

# 27. Understand Visual Language

Understand is the most sensitive visual surface in DECIVEXA.

It must feel:

- calm,
- transparent,
- non-authoritarian,
- inspectable,
- corrigible.

The user should always be able to see the distinction between:

> what happened

> what was recorded

> what DECIVEXA inferred

> what DECIVEXA suggests

> what the human confirmed

The visual language should communicate confidence through provenance and explanation, not artificial percentages.

---

# 28. Decision Visual Language

Decision should feel deliberate rather than gamified.

The visual hierarchy is:

```text
Question
↓
Desired outcome
↓
Constraints
↓
Evidence
↓
Options
↓
Trade-offs
↓
Risks
↓
Human judgment
↓
Decision
```

Comparison should remain dimension-based rather than collapsing complex decisions into one universal score.

---

# 29. Evidence Visual Language

Evidence should look more grounded than inference.

Useful visual signals include:

- source,
- timestamp,
- context,
- provenance,
- relationship,
- version/history.

Evidence should not visually compete with the derived interpretation, but it should remain easy to inspect.

---

# 30. Progress Visual Language

Progress may be represented through:

- trajectory,
- milestones,
- change over time,
- consistency,
- capability growth,
- commitment,
- outcome.

Progress bars are allowed only where percentage completion genuinely represents the underlying phenomenon.

---

# 31. Data Visualization Visual Language

Data visualization must answer a question.

Preferred:

- restrained line/trajectory representations,
- milestone structures,
- comparison views,
- distribution where meaningful,
- change-over-time views.

Avoid:

- 3D charts,
- rainbow palettes,
- decorative graphs,
- unnecessary axes/gridlines,
- KPI walls,
- false precision.

Color must remain semantically controlled.

---

# 32. Feedback Visual Language

Feedback should preserve calm.

### Success

Clear but understated.

### Warning

Attentive but non-alarming.

### Error

Specific and recoverable.

### Information

Neutral and explanatory.

### Stale

Subdued but visible.

### Partial

Transparent about incompleteness.

---

# 33. Motion Visual Language

Working name:

**Calm Continuity**

Motion should communicate:

- continuity,
- state change,
- hierarchy change,
- transition,
- feedback.

Motion should not be used to:

- impress,
- distract,
- increase engagement artificially,
- imply intelligence that does not exist.

Reduced-motion behavior is mandatory in the final implementation specification.

---

# 34. Responsive Visual Language

## Desktop

More simultaneous context.

## Tablet

Less parallel content and more focused grouping.

## Mobile

Sequential hierarchy.

```text
Context
↓
Focus
↓
Action
↓
Supporting Context
↓
Deep Context
```

Responsive design is therefore a hierarchy transformation, not merely a size transformation.

---

# 35. Accessibility Visual Requirements

The visual language targets WCAG 2.2 AA.

WCAG 2.2 is now an approved ISO/IEC standard (ISO/IEC 40500:2025), making it an appropriate international baseline for the design system. citeturn0search1turn0search4

Minimum visual requirements include:

- readable text contrast,
- non-color-only state communication,
- visible focus,
- focus not obscured,
- adequate target sizing/spacing,
- predictable navigation,
- scalable text,
- reduced motion support,
- RTL/LTR correctness.

WCAG 2.2 specifically includes Focus Not Obscured (AA) and Target Size Minimum (AA). citeturn0search0

---

# 36. Visual Anti-Patterns

Explicitly outside the DECIVEXA visual language:

- neon interfaces,
- excessive gradients,
- glassmorphism as default,
- saturated purple everywhere,
- purple-on-purple overload,
- AI sparkles as intelligence indicators,
- robot/brain/circuit visual clichés,
- card-everything,
- oversized pill UI,
- excessive shadows,
- decorative data visualization,
- fake confidence percentages,
- gamification pressure,
- streak shame,
- artificial urgency,
- excessive notifications,
- decorative motion,
- auto-moving content,
- chatbot-first layouts,
- sci-fi HUD aesthetics,
- visual complexity presented as intelligence.

---

# 37. Validation Gates Before Final Visual Freeze

The following values MUST NOT be treated as permanently frozen until tested on representative Mother Screens:

1. Final Persian font
2. Final English font
3. Font pairing
4. Exact purple values
5. Exact neutral values
6. Exact semantic colors
7. Typography sizes/line-heights
8. Spacing scale values
9. Radius values
10. Shadow values
11. Navigation dimensions
12. Component dimensions
13. Light/dark contrast pairings
14. Persian/English mixed-direction rendering
15. Mobile density

Validation must include at minimum:

- Home
- Today
- Goal Workspace
- Understand detail
- Decision Workspace

The purpose is to validate the system against real cognitive contexts rather than isolated component samples.

---

# 38. Current Decision Status

### Locked at architectural/visual-direction level

- Quiet Intelligence
- Human Depth
- Precise Clarity
- Neutral editorial environment
- Controlled purple identity
- Purple as accent rather than flood color
- Persian/English first-class
- Moderate rounding
- Functional elevation
- Borderless-first hierarchy
- Quiet line iconography
- Calm motion
- Epistemic visual distinction
- No AI visual clichés
- No dashboard-first visual language
- WCAG 2.2 AA target

### Deliberately open for validation

- final font family
- exact color hex values
- exact semantic color values
- exact type scale values
- exact line heights
- exact radius values
- exact shadow values
- exact component dimensions
- final desktop/mobile density

---

# 39. Relationship to Master Specification

This document is a child specification of:

`docs/architecture/DECIVEXA_EXPERIENCE_DESIGN_MASTER_SPEC_V1.md`

It does not replace the Master Specification.

Future validated Visual Language decisions should be consolidated back into the Master Specification's stage ledger and future design history.

---

# 40. Governance Boundary

This document is design-only.

It does NOT authorize:

- implementation,
- frontend code changes,
- component implementation,
- CSS/token implementation,
- schema/API changes,
- infrastructure changes,
- AI runtime activation,
- provider selection,
- production deployment.

Any implementation requires separate Founder authorization.

---

# 41. Next Stage

The next stage after Visual Language V1 is:

## RESPONSIVE DESIGN SPECIFICATION V1

It will formally define:

- breakpoint strategy,
- layout transformation,
- desktop/tablet/mobile behavior,
- navigation transformation,
- content density,
- component adaptation,
- typography adaptation,
- interaction target adaptation,
- and Mother Screen responsive blueprints.

---

**END OF DECIVEXA VISUAL LANGUAGE V1**
