# DECIVEXA Responsive Design Specification V1

**Status:** DESIGN CANONICAL — IMPLEMENTATION NOT AUTHORIZED  
**Owner:** Parsa Kiamanesh — Founder, Originator & Owner of DECIVEXA  
**Parent specification:** `docs/architecture/DECIVEXA_EXPERIENCE_DESIGN_MASTER_SPEC_V1.md`  
**Related specifications:** `DECIVEXA_VISUAL_LANGUAGE_V1.md`, Page & Experience Blueprint V1, Design System Architecture V1  
**Scope:** Responsive layout, hierarchy transformation, navigation adaptation, density, typography, interaction targets, RTL/LTR, Mother Screen responsive behavior, accessibility, validation  
**Implementation state:** No implementation, schema, API, repository code, infrastructure, AI activation, or product behavior is authorized by this document.

---

# 1. Purpose

This specification defines how DECIVEXA's experience architecture transforms across viewport sizes without losing meaning, context, hierarchy, user control, or accessibility.

Responsive behavior is not defined as shrinking desktop screens.

The canonical principle is:

> **Responsive design is hierarchy transformation, not size transformation.**

The system must preserve the same underlying experience while changing presentation, density, parallelism, navigation, and interaction patterns according to available space and input conditions.

The responsive system must therefore answer five questions:

1. What must remain visible?
2. What may move below the fold?
3. What may become sequential?
4. What may collapse or become contextual?
5. What must never disappear because of viewport size?

The answer is determined by human intent and information hierarchy, not by device labels alone.

---

# 2. Responsive North Star

DECIVEXA must feel like the same product across desktop, tablet, and mobile while behaving appropriately for each environment.

The experience should preserve:

- identity,
- context,
- meaning,
- user control,
- state,
- evidence relationships,
- navigation predictability,
- accessibility,
- and the user's current cognitive task.

It may change:

- parallelism,
- density,
- layout direction,
- navigation presentation,
- amount of supporting context shown at once,
- control grouping,
- disclosure depth,
- and interaction modality.

The user should never feel that mobile is a reduced or inferior product.

---

# 3. Responsive Design Principles

## 3.1 Content determines the breakpoint

Breakpoints are implementation boundaries for validated layout behavior, not representations of specific device brands.

A layout must change when the current hierarchy can no longer remain clear, usable, accessible, or calm—not merely because a device category changed.

## 3.2 Preserve hierarchy before geometry

When space becomes constrained, preserve:

1. page identity,
2. primary question,
3. primary content,
4. primary action,
5. critical state/context,
6. supporting context,
7. deep context,
8. decoration.

Decoration is removed first.

## 3.3 Sequentialization before compression

When content cannot remain comfortably parallel, DECIVEXA should prefer sequential presentation over making every element smaller.

## 3.4 Context before convenience

A compact layout must not hide the context necessary to understand an action.

## 3.5 One experience, multiple compositions

Desktop, tablet, and mobile are compositions of the same experience architecture, not separate products.

## 3.6 No horizontal rescue

Horizontal scrolling must not become the default solution for ordinary product content. Structured exceptions such as genuinely wide analytical tables require explicit responsive treatment.

## 3.7 Accessibility survives transformation

Responsive changes must preserve keyboard access, focus visibility, readable text, target sizing, semantics, and predictable navigation. WCAG 2.2 explicitly applies to mobile and responsive experiences and includes requirements such as Focus Not Obscured and Target Size Minimum. citeturn0search0turn0search1

---

# 4. Canonical Viewport Model

DECIVEXA uses four responsive composition bands.

| Band | Width | Primary behavior |
|---|---:|---|
| Compact Mobile | `< 640px` | Sequential, focused, single-column |
| Expanded Mobile / Tablet | `640–1023px` | Single-column with selective two-column composition |
| Desktop | `1024–1439px` | Multi-column, stable navigation, contextual parallelism |
| Wide Desktop | `≥ 1440px` | Increased breathing room and controlled information parallelism |

These values are **design reference boundaries**, not hard device assumptions.

A future implementation may introduce additional content-driven breakpoints only when a validated layout requirement exists.

## 4.1 Breakpoint rule

No component may introduce a breakpoint merely because a framework offers one.

Every breakpoint must answer:

> **What meaningful layout or interaction problem does this breakpoint solve?**

## 4.2 Wide-screen restraint

Wide screens must not cause uncontrolled stretching.

Additional width should primarily become:

- breathing room,
- controlled parallel context,
- wider analytical content where justified,
- or improved reading/working width.

It should not automatically create larger typography, oversized cards, or excessive empty canvas.

---

# 5. Global Layout Transformation

## 5.1 Desktop

Desktop is the highest-parallelism composition.

Preferred structure:

```text
┌──────────────┬─────────────────────────────────────┐
│ Stable Nav   │ Context / Page Header               │
│              ├─────────────────────────────────────┤
│              │ Primary Experience                   │
│              │                                      │
│              │ Supporting Context                   │
│              │                                      │
│              │ Deep Context                         │
└──────────────┴─────────────────────────────────────┘
```

Desktop may expose supporting context beside primary content when doing so improves understanding.

## 5.2 Tablet

Tablet reduces parallelism.

Typical transformation:

```text
Desktop parallel columns
        ↓
Primary column
        ↓
Secondary context below or selectively beside
```

Navigation becomes more compact while remaining predictable.

## 5.3 Mobile

Mobile becomes intentionally sequential:

```text
Context
↓
Page Identity
↓
Primary Focus
↓
Primary Action
↓
Supporting Context
↓
Deep Context
```

Mobile is not permitted to become a compressed desktop grid.

---

# 6. Container Architecture

DECIVEXA uses three semantic content widths inherited from the Visual Language V1:

### Reading

Optimized for:

- understanding,
- explanation,
- reflection,
- narrative,
- decision reasoning.

### Working

Optimized for:

- Today,
- Goals,
- planning,
- actions,
- active work.

### Data

Optimized for:

- evidence,
- history,
- comparison,
- analytical views,
- structured records.

## 6.1 Container behavior

The container must:

- grow fluidly within its semantic maximum,
- maintain comfortable side margins,
- avoid unnecessary full-width content,
- preserve readable line length,
- support RTL and LTR symmetrically.

## 6.2 Mobile container

Mobile uses near-full-width content with deliberate edge insets.

The visual goal is not maximum content width; it is maximum useful comprehension.

## 6.3 Wide desktop container

Wide desktop may use additional contextual columns only when the experience benefits from parallel visibility.

No page may become a three-column dashboard merely because space exists.

---

# 7. Navigation Transformation

Primary navigation remains conceptually:

1. Home
2. Today
3. Goals
4. Understand
5. Decisions

Global utility:

- Search

System area:

- Settings / Profile

## 7.1 Desktop navigation

Desktop uses a stable navigation rail/sidebar.

Characteristics:

- persistent,
- quiet,
- predictable,
- clearly active,
- visually subordinate to content.

## 7.2 Tablet navigation

Tablet may use a compact rail or compact sidebar.

Labels may become secondary to icons only when the active state and accessible naming remain unambiguous.

A hidden navigation control must remain easy to discover and operate.

## 7.3 Mobile navigation

Mobile uses a compact navigation model appropriate to the primary destinations.

The five primary destinations must not be forced into a visually overloaded navigation surface if doing so harms recognition or target spacing.

A mobile navigation design may use:

- bottom navigation for primary destinations,
- a compact top context control,
- or a hybrid pattern.

The exact control geometry remains a prototype-validation decision.

## 7.4 Deep navigation

Deep contexts use:

- contextual header,
- back navigation,
- related-context controls,
- and progressive disclosure.

The user's context must not be lost merely because navigation presentation changes across breakpoints.

---

# 8. Header Transformation

## Desktop

The header may include:

- page identity,
- context,
- primary action,
- supporting utility.

## Tablet

Secondary controls should collapse before primary identity/action.

## Mobile

The header prioritizes:

```text
Back / Context
↓
Page Identity
↓
Essential Utility
```

Primary action should remain reachable without requiring the user to scan a dense toolbar.

Sticky headers are allowed only when they preserve focus visibility and do not obscure content or keyboard focus.

WCAG 2.2 includes a specific requirement that focused components not be entirely hidden by author-created content. citeturn0search1

---

# 9. Content Density Architecture

Density is adaptive, not uniform.

## Desktop density

Highest useful density, while maintaining breathing room.

## Tablet density

Moderate density with stronger grouping.

## Mobile density

Lower simultaneous density and higher sequential focus.

The system must not solve mobile density by:

- reducing body text below comfortable reading size,
- removing meaningful labels,
- shrinking controls excessively,
- or hiding critical context.

W3C guidance explicitly recommends designing for different viewport sizes and changing presentation of major elements such as navigation when necessary. citeturn0search7turn0search8

---

# 10. Typography Transformation

Typography follows the Visual Language V1 hierarchy:

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

## 10.1 Desktop

Display and heading sizes may use the full type scale.

## 10.2 Tablet

Display sizes reduce selectively where necessary to preserve hierarchy.

## 10.3 Mobile

Mobile typography must preserve:

- hierarchy,
- readable line length,
- adequate line-height,
- Persian readability,
- mixed RTL/LTR correctness.

Mobile does not mean tiny typography.

## 10.4 Fluid type

Fluid typography may be used for selected display roles, but body and critical control text must remain predictable and accessible.

## 10.5 Text expansion

Layouts must tolerate text expansion caused by:

- Persian,
- English,
- localization,
- user text,
- browser zoom,
- accessibility settings.

No important meaning may depend on a label fitting one line.

---

# 11. RTL / LTR Responsive Architecture

RTL is a first-class composition direction, not a mirrored afterthought.

## 11.1 Logical properties

The responsive system should conceptually use logical relationships:

- inline-start / inline-end
- block-start / block-end

rather than assuming left/right semantics.

## 11.2 Navigation

In RTL layouts, primary navigation naturally occupies the right side where the composition calls for a side rail.

In LTR layouts, the corresponding navigation occupies the left side.

The information hierarchy does not change.

## 11.3 Directional icons

Directional icons must communicate direction according to locale where their meaning is directional.

Examples:

- back,
- forward,
- next,
- previous,
- progression arrows.

Non-directional icons should not be arbitrarily mirrored.

## 11.4 Mixed-direction content

The system must support mixed:

- Persian + English,
- Persian + Latin URLs,
- Persian + numbers,
- dates,
- times,
- currencies,
- identifiers,
- technical values.

The visual system must prevent directionality from changing meaning.

## 11.5 Data and numbers

Numeral strategy remains globally consistent while respecting the user's language context.

Tables and charts require explicit RTL/LTR validation rather than automatic mirroring assumptions.

---

# 12. Interaction Target Architecture

Responsive transformation must not make controls harder to operate.

WCAG 2.2 includes Target Size Minimum at AA, requiring pointer targets to meet a 24×24 CSS pixel minimum or satisfy defined exceptions. DECIVEXA's design target should generally exceed the minimum where practical, especially for primary touch controls. citeturn0search1

## Mobile

Prefer larger touch areas and clear separation between adjacent actions.

## Tablet

Maintain comfortable touch interaction even when a pointer may also be used.

## Desktop

Pointer precision allows denser arrangements, but important controls should remain visually and spatially distinguishable.

## Important rule

Do not reduce target size merely to preserve a desktop-like density on small screens.

---

# 13. Responsive Component Transformation

Components transform by semantic role.

## Buttons

Desktop:
- horizontal grouping where appropriate.

Tablet:
- grouped controls may wrap or collapse secondary actions.

Mobile:
- primary action remains prominent;
- secondary actions may become a vertical group;
- destructive actions remain clearly separated.

## Forms

Desktop may use controlled two-column layouts where fields are logically related.

Mobile defaults to one field group per vertical sequence unless side-by-side presentation materially improves comprehension.

## Cards

Desktop may place related cards side-by-side.

Tablet reduces parallel cards.

Mobile generally becomes a vertical sequence or a controlled horizontal carousel only when the content genuinely benefits from lateral comparison.

Horizontal carousels must not be the only way to access important information.

## Tables

Tables require explicit strategy:

1. reduce nonessential columns,
2. prioritize critical columns,
3. transform rows into structured records where appropriate,
4. allow controlled horizontal scrolling only for genuinely tabular analytical content.

Critical meaning must not be hidden inside an inaccessible scroll region.

## Drawers

Desktop may use side drawers for supporting context.

Mobile drawers should become focused sheets or full-height contextual surfaces when necessary for readability and touch operation.

## Modal dialogs

Mobile dialogs should avoid tiny centered boxes with dense content.

Use a focused full-width or near-full-height composition when the task requires substantial content.

## Tabs

Tabs are permitted only where users genuinely switch between sibling views.

On narrow screens, tabs may:

- become horizontally scrollable when all options remain discoverable,
- become a select/control,
- or become sequential sections.

Automatic hidden-tab behavior is not permitted for critical content.

---

# 14. Mother Screen Responsive Blueprints

## 14.1 Home

### Desktop

```text
Context
────────────────────────────
Primary Focus        Supporting Context

Meaningful Change    Attention

Next                 Supporting Context
```

The Primary Focus receives the strongest visual weight.

### Tablet

```text
Context
↓
Primary Focus
↓
Next + Attention
↓
Meaningful Change
↓
Supporting Context
```

Parallelism is reduced.

### Mobile

```text
Context
↓
Primary Focus
↓
Next
↓
Meaningful Change
↓
Attention
↓
More / Supporting Context
```

The Home experience remains orientation-first.

---

## 14.2 Today

### Desktop

Primary working content may sit beside:

- capacity,
- commitments,
- contextual change.

### Tablet

Priority Actions remain primary; capacity and secondary context move closer to the primary sequence.

### Mobile

```text
Current Context
↓
Today's Direction
↓
Commitments
↓
Priority Actions
↓
Capacity
↓
Adaptation
↓
Changes
↓
Close / Review
```

The daily experience remains sequential and action-oriented.

---

## 14.3 Goals

### Desktop

Goal workspace may use:

```text
Goal Context / Direction
        │
        ├── Primary Goal State
        │
        └── Supporting Context
             Readiness / Ecology / Evidence
```

### Tablet

Goal direction and current state remain first; ecology, evidence, and deeper detail become sequential.

### Mobile

```text
Goal
↓
Why
↓
Current State
↓
Readiness
↓
Path
↓
Next Meaningful Step
↓
Milestones
↓
Progress
↓
Evidence / Review
```

The user must never need to inspect every section merely to understand the current direction.

---

## 14.4 Understand

Understand requires the strongest responsive discipline because it represents system understanding and uncertainty.

### Desktop

Possible parallel structure:

```text
Statement / Understanding
        │
        ├── Why
        ├── Evidence
        └── History / Context
```

### Tablet

Statement and status remain primary; supporting rationale becomes secondary.

### Mobile

```text
What DECIVEXA currently understands
↓
Status
↓
Why
↓
Evidence
↓
History
↓
Confirm / Correct / Reject
```

The user must not lose the ability to correct understanding because of limited screen width.

---

## 14.5 Decisions

### Desktop

Decision may support parallel option comparison.

```text
Decision Question
        ↓
Context / Constraints
        ↓
Options A | B | C
        ↓
Trade-offs / Risks
        ↓
Human Judgment
```

### Tablet

Options become fewer simultaneous columns.

Comparison remains dimension-based.

### Mobile

Options become sequential comparison sections.

A mobile decision view may use:

```text
Question
↓
Desired Outcome
↓
Constraints
↓
Option A
↓
Option B
↓
Option C
↓
Compare by Dimension
↓
Human Judgment
↓
Decision
```

No universal score should appear merely because mobile comparison is harder.

---

# 15. Progressive Disclosure Across Viewports

The three disclosure levels remain canonical:

### Level 1 — Now

Immediate need.

### Level 2 — Context

Meaning and surrounding information.

### Level 3 — Evidence

Supporting proof, history, provenance, deeper detail.

Responsive behavior may change where these levels appear, but it must not change their semantic priority.

Desktop may expose Level 2 beside Level 1.

Mobile generally places Level 2 after Level 1.

Level 3 may be opened through focused expansion, drawer, sheet, or dedicated page depending on depth.

---

# 16. State Preservation Across Responsive Changes

Changing viewport width must never silently alter meaningful user state.

Preserve:

- current route,
- current context stack,
- scroll position where appropriate,
- expanded/collapsed state when semantically safe,
- selected option,
- form input,
- unsaved user work,
- current decision stage,
- current correction state,
- filters and search context where practical.

A breakpoint transition must not:

- reset a form,
- lose a correction,
- change a decision selection,
- silently submit an action,
- move the user to another route,
- or discard unsaved work.

## 16.1 Orientation change

Landscape/portrait transitions follow the same principle.

The composition may transform, but semantic state remains stable.

---

# 17. Loading, Empty, Partial, Stale, and Error States

Responsive states must retain the same meaning as their desktop counterparts.

## Loading

Do not use oversized skeletons that mimic an entire dashboard on mobile.

Load the primary experience first.

## Empty

Explain:

```text
What is missing
↓
Why it matters
↓
What can happen next
```

## Partial

Explicitly identify what is available and what is not.

## Stale

Remain visible but subdued.

## Error

Use:

```text
WHAT HAPPENED
↓
WHAT WAS PRESERVED
↓
WHAT CAN I DO NOW
```

The error architecture must work without requiring a desktop-sized layout.

---

# 18. Accessibility Responsive Requirements

DECIVEXA targets WCAG 2.2 AA as its baseline. WCAG 2.2 is the current W3C Recommendation and is also approved as ISO/IEC 40500:2025. citeturn0search0turn0search9

Responsive validation must cover at minimum:

- keyboard navigation,
- visible focus,
- focus not obscured,
- logical focus order,
- adequate target size,
- sufficient spacing between interactive controls,
- text resizing,
- browser zoom,
- reflow,
- contrast,
- non-color-only meaning,
- semantic headings,
- landmarks,
- form labels,
- predictable navigation,
- reduced motion,
- RTL/LTR behavior.

W3C specifically recommends responsive adaptation across viewport sizes and zoom states, including avoiding clipping or horizontal scrolling when text is significantly enlarged. citeturn0search8

## 18.1 Focus preservation

When a responsive transformation moves an interactive element, focus must remain understandable and visible.

## 18.2 Sticky elements

Sticky headers, bottom navigation, and floating controls must not cover focused content.

## 18.3 Touch + keyboard parity

Important functionality must remain available through more than one interaction modality where appropriate.

## 18.4 Reduced motion

Responsive transitions must respect reduced-motion preferences.

---

# 19. Responsive Motion

Responsive motion belongs to **Calm Continuity**.

Use motion to communicate:

- layout transformation,
- context entry/exit,
- state change,
- expansion/collapse,
- feedback.

Do not use motion to:

- compensate for weak hierarchy,
- delay access to information,
- create artificial excitement,
- imply intelligence.

On mobile, motion should generally be shorter and less spatially expansive because available screen context is smaller.

---

# 20. Responsive Search

Search remains global and context-aware.

Desktop may expose a persistent search affordance.

Tablet may use a compact search control.

Mobile may use a dedicated focused search surface.

Search result opening must preserve:

- query context,
- result identity,
- destination context,
- and return path.

Search must not become a separate disconnected mobile product.

---

# 21. Responsive Notifications / Attention

Attention is not allowed to become more aggressive on mobile simply because screen space is smaller.

The same principle remains:

> **Attention with reason.**

Mobile may prioritize the most relevant attention items, but must not create urgency that does not exist in the underlying experience.

Notifications should remain:

- explainable,
- dismissible where appropriate,
- non-shaming,
- non-addictive,
- context-preserving.

---

# 22. Responsive Data Visualization

Charts must adapt to the question they answer.

Desktop may show:

- broader time ranges,
- multiple dimensions,
- comparative context.

Mobile should prioritize:

- the main trend,
- the key change,
- the relevant comparison,
- and accessible textual explanation.

A chart must never require color alone to communicate meaning.

If a visualization cannot remain interpretable on mobile, the system should provide a structured alternative rather than simply shrinking it.

---

# 23. Responsive Tables

Tables are a high-risk responsive pattern.

The system should use this decision sequence:

```text
Can the table remain readable?
        ↓ yes
Keep structured table
        ↓ no
Can noncritical columns be removed?
        ↓ yes
Prioritize columns
        ↓ no
Can rows become records?
        ↓ yes
Transform into responsive records
        ↓ no
Use controlled horizontal table scrolling
```

Important actions and identifiers must remain discoverable.

---

# 24. Responsive Forms

Forms must become more sequential as width decreases.

The cognitive rule is:

> **One main cognitive decision per step.**

Mobile should not create a long wall of fields merely because desktop fields were stacked automatically.

Where appropriate:

```text
Question
↓
Answer
↓
Relevant context
↓
Next question
```

Error messages must remain adjacent enough to their fields to be understood without losing the user's place.

---

# 25. Responsive Confirmation

Human confirmation remains a first-class state across all viewports.

Confirmation must communicate:

- what will change,
- why it is being proposed,
- important consequences,
- what the user can choose.

Mobile confirmation must not hide consequences below an action button merely to preserve visual compactness.

---

# 26. Responsive Context Preservation Matrix

| Transition | Desktop | Tablet | Mobile | Context must persist |
|---|---|---|---|---|
| Home → Goal | Yes | Yes | Yes | Goal |
| Today → Action | Yes | Yes | Yes | Today |
| Action → Goal | Yes | Yes | Yes | Goal |
| Goal → Evidence | Yes | Yes | Yes | Goal |
| Goal → Decision | Yes | Yes | Yes | Goal |
| Decision → Goal | Yes | Yes | Yes | Decision/Goal relationship |
| Understand → Evidence | Yes | Yes | Yes | Understanding |
| Evidence → Understand | Yes | Yes | Yes | Evidence |
| Search → Result | Yes | Yes | Yes | Search + destination |

Responsive composition must never weaken the context-preservation rule.

---

# 27. Responsive Anti-Patterns

The following are explicitly rejected:

1. Desktop squeezed into mobile.
2. Tiny typography to preserve desktop density.
3. Five-column dashboard layouts on tablet.
4. Horizontal scrolling for ordinary content.
5. Hiding primary actions inside ambiguous menus.
6. Removing context to save vertical space.
7. Making mobile more notification-heavy.
8. Replacing semantic hierarchy with color.
9. Creating separate navigation meanings per breakpoint.
10. Resetting user state during responsive transformation.
11. Using carousels for critical information.
12. Using modal overload on mobile.
13. Making every section collapsible merely because mobile exists.
14. Treating RTL as a final mirroring pass.
15. Using device names as the only breakpoint logic.
16. Reducing touch targets to preserve desktop density.
17. Hiding evidence or correction controls on smaller screens.
18. Turning decision comparison into a simplistic score on mobile.

---

# 28. Responsive Quality Bar

A responsive experience is acceptable only if it remains:

- understandable,
- context-preserving,
- accessible,
- calm,
- predictable,
- recoverable,
- semantically consistent,
- visually coherent,
- and useful at every supported viewport.

The test is not:

> Does the page fit?

The test is:

> **Does the experience still make sense?**

---

# 29. Validation Matrix

Before implementation is considered, every Mother Screen must be validated at minimum against:

| Dimension | Mobile | Tablet | Desktop | Wide Desktop |
|---|---:|---:|---:|---:|
| Page identity clear | ✓ | ✓ | ✓ | ✓ |
| Primary question clear | ✓ | ✓ | ✓ | ✓ |
| Primary action clear | ✓ | ✓ | ✓ | ✓ |
| Context preserved | ✓ | ✓ | ✓ | ✓ |
| No critical horizontal overflow | ✓ | ✓ | ✓ | ✓ |
| Typography readable | ✓ | ✓ | ✓ | ✓ |
| Focus visible | ✓ | ✓ | ✓ | ✓ |
| Focus not obscured | ✓ | ✓ | ✓ | ✓ |
| Touch targets usable | ✓ | ✓ | ✓ | ✓ |
| Keyboard path coherent | ✓ | ✓ | ✓ | ✓ |
| RTL/LTR correct | ✓ | ✓ | ✓ | ✓ |
| State preserved | ✓ | ✓ | ✓ | ✓ |
| Error recovery understandable | ✓ | ✓ | ✓ | ✓ |
| Evidence/context accessible | ✓ | ✓ | ✓ | ✓ |
| Responsive hierarchy coherent | ✓ | ✓ | ✓ | ✓ |

---

# 30. Prototype Validation Scenarios

The future prototype stage must validate at least these scenarios:

### Scenario A — Home orientation

User opens DECIVEXA on a small phone and can identify:

- where they are,
- what matters now,
- what changed,
- what needs attention,
- what is next.

### Scenario B — Goal context

User enters a Goal from Today and later opens Evidence. The Goal context remains understandable on mobile.

### Scenario C — Decision comparison

User compares two or more options on mobile without losing the decision boundary, constraints, trade-offs, or human judgment.

### Scenario D — Understanding correction

User corrects an Understanding statement on mobile without losing the original statement, explanation, or correction context.

### Scenario E — Responsive transition

User begins an interaction on desktop, changes viewport size, and does not lose meaningful state.

### Scenario F — Accessibility

Keyboard and assistive technology users can navigate the same essential experience without relying on pointer-only interactions.

### Scenario G — Zoom / text expansion

The experience remains usable under significant text enlargement without clipping essential information or creating avoidable horizontal scrolling. citeturn0search8

---

# 31. Design Decisions Locked by This Specification

The following are now the canonical responsive design decisions:

1. Responsive design is hierarchy transformation, not size transformation.
2. Breakpoints are content/layout boundaries, not device definitions.
3. Four reference composition bands are defined: compact mobile, expanded mobile/tablet, desktop, wide desktop.
4. Desktop supports controlled parallelism.
5. Tablet reduces parallelism.
6. Mobile is sequential and focus-oriented.
7. Primary hierarchy survives every breakpoint.
8. Navigation meaning remains stable across breakpoints.
9. Context preservation survives responsive transformation.
10. RTL and LTR are first-class directions.
11. Touch target size and focus visibility are responsive requirements.
12. Mother Screens have explicit responsive hierarchies.
13. Data-heavy experiences receive explicit transformation strategies.
14. Critical evidence, correction, decision, and context controls may not disappear merely because the viewport is small.
15. Responsive state changes must not silently discard user work.
16. Accessibility is validated across viewport, zoom, input modality, and directionality.

---

# 32. Explicitly Not Finalized

The following remain intentionally open for prototype-level validation:

- exact production breakpoint values,
- exact sidebar width,
- exact mobile navigation pattern,
- exact container max-width values,
- exact responsive typography values,
- exact component dimensions,
- exact sticky-header behavior per screen,
- exact table transformation for each future data surface,
- exact motion durations/easing,
- final font family,
- final production color values.

These are not omissions. They are deliberately deferred until real screen prototypes can validate them without prematurely freezing weak assumptions.

---

# 33. Relationship to Previous Design Stages

This specification extends, and does not replace:

- Experience Architecture,
- Experience Map,
- Information Architecture,
- Navigation Model,
- Mother Screen Architecture,
- Interaction Architecture,
- Page & Experience Blueprint V1,
- Design System Architecture V1,
- Visual Language V1.

If a future stage changes a decision in this specification, the change must explicitly document:

1. previous decision,
2. reason for change,
3. new decision,
4. dependent impact,
5. Founder approval status.

---

# 34. Governance Boundary

This specification is design authority only.

It does **not** authorize:

- frontend implementation,
- backend implementation,
- API changes,
- schema changes,
- database changes,
- infrastructure changes,
- AI activation,
- provider selection,
- autonomous behavior,
- repository code changes beyond this documentation registration,
- or product behavior changes.

Implementation requires a separate explicit Founder-controlled authorization.

---

# 35. Design Stage Status

```text
Vision                                  ✓
Experience Principles                  ✓
Experience Architecture                ✓
Experience Map                         ✓
Information Architecture               ✓
Navigation Model                      ✓
Mother Screen Architecture            ✓
Interaction Architecture              ✓
Page & Experience Blueprint V1         ✓
Design System Architecture V1         ✓
Visual Language V1                    ✓
Responsive Design Specification V1    ✓
Accessibility Specification            NEXT
Prototype                              LATER
Implementation                         SEPARATE FOUNDER AUTHORIZATION
```

---

# 36. Canonical Standard

DECIVEXA's responsive design standard is:

> **One human experience. Multiple compositions. Stable meaning. Preserved context. Calm transformation. Accessible by construction.**

Responsive design succeeds when the user experiences continuity rather than adaptation as a technical event.

---

## References

- W3C Web Content Accessibility Guidelines (WCAG) 2 Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- W3C What's New in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C Designing for Web Accessibility: https://www.w3.org/WAI/tips/designing/
- W3C Developing for Web Accessibility: https://www.w3.org/WAI/tips/developing/
- W3C WCAG 2.2 ISO Standard announcement: https://www.w3.org/WAI/news/2025-10-21/wcag22-iso/
