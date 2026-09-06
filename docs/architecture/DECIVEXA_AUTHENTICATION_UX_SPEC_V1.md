# DECIVEXA Authentication UX Specification V1

**Status:** UX FINALIZED / VISUAL DESIGN IN PROGRESS — IMPLEMENTATION NOT AUTHORIZED  
**Owner:** Founder / DECIVEXA  
**Scope:** Web authentication experience  

## 1. Purpose

Define the final product-level UX specification for DECIVEXA authentication without authorizing implementation. Authentication must feel quiet, precise, trustworthy, fast, and human-centered rather than like a generic SaaS or AI product.

## 2. Authentication Surface

Canonical flows:

- Login
- Registration
- Email verification
- Forgot password
- Password reset
- Logout
- Session expiration / re-authentication
- Unauthorized access
- Loading, validation, network, server, and rate-limit states

## 3. Global UX

Use a shared authentication shell with DECIVEXA branding, a focused form/card, restrained supporting navigation, and responsive desktop/mobile behavior. Avoid futuristic AI clichés, decorative dashboards, robots, circuitry, holograms, neon-heavy treatments, and stock photography.

Design principle: **Less interface. More confidence.**

## 4. Login

Provide email and password fields, password show/hide control, primary `Log in` action, and `Forgot password?` navigation. Loading state must disable duplicate submission and communicate progress.

Authentication failures must use neutral user-facing language and must not reveal whether an email account exists or expose technical status codes, token details, JWT errors, or backend exceptions.

## 5. Registration

Provide only the minimum authentication information required for account creation, such as name where required, email, password, and password confirmation. Do not turn registration into a personal-profile questionnaire. Goals, values, priorities, personality, habits, or broad life-history questions belong outside authentication.

## 6. Email Verification

After registration, clearly identify the destination email, provide instructions, support resend with an appropriate cooldown, and define explicit success, expired-link, and invalid-link states. Technical verification details remain hidden from the user.

## 7. Password Recovery

Forgot-password submission must use privacy-preserving language that does not disclose whether an account exists. Reset-password flow must provide new-password and confirmation fields, clear requirements, success confirmation, and a route back to login.

## 8. Session and Route Behavior

Authentication state must distinguish unresolved/loading, authenticated, unauthenticated, session-expired, and error conditions. Protected routes must not render sensitive content before authentication state is resolved. When safe and appropriate, a successful login should return the user to the originally requested protected destination.

Session expiration must explain why re-authentication is required instead of silently redirecting.

## 9. Logout

Logout must deterministically terminate the applicable authenticated session and must not leave sensitive authenticated content exposed in the post-logout UI.

## 10. Validation and Errors

Client validation exists for UX; server validation remains authoritative. Errors should appear near the relevant field where possible, use concise human language, and manage focus accessibly. Network and server failures must provide retry-oriented, non-technical messaging. Rate limiting must avoid exposing security-sensitive implementation thresholds.

## 11. Accessibility

All authentication surfaces must support semantic HTML, keyboard navigation, visible focus, correct labels, accessible error association, logical tab order, adequate contrast, responsive touch interaction, and screen-reader compatibility. Placeholders never replace labels.

## 12. Mobile and Browser Compatibility

Authentication must be responsive and usable on small screens, accommodate virtual keyboards, avoid overflow, support touch interaction without hover dependence, and remain compatible with browser autofill and password managers through appropriate semantic field metadata.

## 13. Security UX Principles

The UI must not expose passwords by default, authentication tokens, backend exceptions, provider/API details, account-existence information through recovery flows, or other sensitive implementation details. Authentication must remain deterministic and must not depend on AI availability.

## 14. Architectural Boundary

Authentication identity is distinct from DECIVEXA personal understanding:

`Authentication / Account Identity != Personal Intelligence != Memory != Claims != Evidence`

Authentication must not become an implicit ingestion point for personal-intelligence data.

## 15. Reusable UI Boundary

The final implementation should use reusable authentication components and keep presentation concerns separate from authentication/domain logic. Suggested conceptual components include `AuthShell`, `AuthHeader`, `AuthCard`, `FormField`, `PasswordField`, `PrimaryButton`, `InlineError`, `SuccessMessage`, `LoadingButton`, `VerificationState`, `PasswordStrength`, and `AuthFooter`.

These are design-level component boundaries, not an authorization to create them now.

## 16. Future-Compatible Security Capabilities

The design must leave clean room for future, separately governed capabilities such as session revocation, logout-all-sessions, optional two-factor authentication, security notifications, and suspicious-login handling. Their future implementation requires its own authorization where material.

## 17. Final UX Principle

DECIVEXA authentication should be simple enough that users barely notice the interface while everything behind that simplicity remains precise, secure, deterministic, and governed.

## 18. Governance

This document is a **design specification only**. It does not authorize schema changes, migrations, API redesign, backend implementation, frontend implementation, authentication-provider changes, session-architecture changes, infrastructure changes, deployment, or other material implementation work.

Any material deviation from this specification requires Founder review and approval.

---

# 19. Authentication Visual Design V1 — Controlled Design Extension

**Visual-design status:** IN PROGRESS  
**Implementation status:** NOT AUTHORIZED  
**Design authority:** Founder-controlled  
**Implementation authority:** Separate future Claude Implementation Prompt / approved implementation gate

This section is the canonical visual-design record for the authentication surface. It extends the UX specification above; it does not replace the UX, security, accessibility, or architectural constraints already defined in Sections 1–18.

## 19.1 Design Objective

The authentication experience must establish DECIVEXA as a serious, distinctive human-growth product at the first meaningful interaction, while preserving the functional simplicity expected from authentication.

The visual system must therefore balance two priorities:

1. **DECIVEXA identity and meaning** must be immediately recognizable.
2. **Authentication usability and trust** must remain the dominant functional requirement inside the authentication area.

The design must not use visual complexity as a substitute for product identity.

## 19.2 Design Principles

The visual design follows these principles:

- Calm Intelligence
- Human First
- Minimal Cognitive Load
- Less interface, more confidence
- Brand with purpose, not decoration
- Clear hierarchy before visual effects
- Distinctive without being theatrical
- Premium without being ornamental
- Responsive by design, not by shrinkage
- Accessibility is part of the design itself
- No futuristic AI visual clichés
- No visual treatment that implies artificial consciousness or emotional dependency

These principles align with the existing product-experience baseline, which defines DECIVEXA as a Personal Operating System for Human Growth and explicitly requires calm confidence, continuity, low cognitive overhead, accessibility, and avoidance of manipulative engagement. The authentication surface must remain a coherent part of that system.

## 19.3 Decision Register

| Decision ID | Design Area | Decision | Status | Authority |
|---|---|---|---|---|
| AUTH-V1-D01 | Canvas + Overall Composition | Split Composition | LOCKED | Founder |
| AUTH-V1-D02 | Relationship Between Areas | Brand-led | LOCKED | Founder |
| AUTH-V1-D03 | Spatial Proportion | Strong Brand Dominance | LOCKED | Founder |
| AUTH-V1-D04 | Boundary Treatment | Soft Division | DESIGN-APPROVED BY DESIGN LEAD / NOT A FOUNDER OVERRIDE | Design Direction |

**Governance clarification:** D01–D03 were explicitly selected/approved by the Founder during the design session. D04 is recorded as the current professional design direction derived from those approved constraints. It must not be represented as a separate Founder decision unless explicitly approved later.

## 19.4 AUTH-V1-D01 — Canvas + Overall Composition

**Decision:** Split Composition.

The authentication experience is organized into two coordinated visual territories:

- **DECIVEXA Brand / World** — the dominant identity-bearing territory.
- **Authentication Experience** — the focused entry territory.

The two territories form one page-level experience rather than two unrelated panels.

### Rationale

A single-form composition would make DECIVEXA too easily resemble a generic SaaS authentication page. A fully immersive composition would risk making the authentication task subordinate to the visual environment. Split Composition provides a deliberate middle architecture: brand establishes context; authentication enables entry.

### Rejected alternative

`Immersive Environment + Focused Auth` was considered but rejected for this V1 direction after Founder selection of Split Composition.

## 19.5 AUTH-V1-D02 — Relationship Between Areas

**Decision:** Brand-led.

The Brand / World territory is the visual lead. Authentication remains clearly discoverable and functionally self-contained but does not visually compete with the DECIVEXA identity surface.

### Core relationship

> **The brand creates the context; authentication provides the entry.**

This relationship must remain evident without requiring explanatory copy.

## 19.6 AUTH-V1-D03 — Spatial Proportion

**Decision:** Strong Brand Dominance.

The Brand / World territory receives substantially more visual and spatial weight than the Authentication territory on sufficiently wide desktop layouts.

The exact numerical ratio is intentionally **not yet frozen**. It must be derived from the final content density, form usability, typography, accessibility requirements, and responsive behavior rather than chosen as an arbitrary percentage.

### Non-negotiable consequence

The Authentication territory must never become cramped merely to preserve Brand dominance. If the available viewport cannot sustain both priorities at acceptable usability, the composition must transition responsively rather than compressing the form below a professional interaction threshold.

## 19.7 AUTH-V1-D04 — Boundary Treatment

**Current professional design direction:** Soft Division.

The Brand / World and Authentication territories should feel like parts of one coherent environment rather than two independent applications. Their separation should be perceptible through composition, hierarchy, tonal structure, spacing, and/or restrained structural cues rather than relying on a visually heavy divider.

### Why this direction is preferred

A hard divider risks producing a conventional split-screen SaaS pattern. A completely undefined boundary risks weakening orientation. Soft Division preserves both separation and continuity.

### Governance status

This is a **design-lead direction**, not a new Founder decision. If later evidence shows that Soft Division harms accessibility, clarity, or responsive behavior, it may be revised during the design process and the revision must be logged here.

## 19.8 Desktop Composition Contract

For sufficiently wide viewports, the canonical composition is:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                  DECIVEXA BRAND / WORLD                      │
│                                                              │
│                                                              │
│                                      AUTHENTICATION           │
│                                      EXPERIENCE               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

This diagram is conceptual. It does **not** define final pixel dimensions, colors, typography, spacing, borders, cards, or component geometry.

The Brand territory must remain the dominant visual field. The Authentication territory must remain a clear, stable interaction zone.

## 19.9 Responsive Composition Contract

Responsive behavior is part of the visual architecture, not a post-design implementation detail.

### Wide desktop

- Preserve the two-territory composition.
- Preserve strong Brand dominance.
- Maintain a clear authentication interaction zone.
- Do not allow decorative Brand content to compete with form completion.

### Medium desktop / tablet landscape

- Reduce Brand visual complexity before reducing authentication usability.
- Preserve the conceptual split while allowing the spatial relationship to become more compact.
- Do not force a fixed desktop ratio when viewport constraints make it harmful.

### Narrow tablet / mobile

The split composition may collapse into a single vertical flow while preserving the same hierarchy:

`DECIVEXA identity → authentication entry`

The mobile experience is therefore a **responsive transformation of the same design intent**, not a separate visual identity.

### Mobile priority rule

When space becomes constrained:

1. Preserve authentication usability.
2. Preserve DECIVEXA identity.
3. Remove/reduce non-essential Brand visual content.
4. Never solve the constraint by making essential controls unusually small.

## 19.10 Visual Hierarchy Contract

The page hierarchy must communicate, in order:

1. **Where the user is:** DECIVEXA.
2. **What this area enables:** authentication.
3. **What the user should do now:** complete the current authentication action.
4. **What secondary paths exist:** registration, recovery, verification, or return navigation as applicable.

Secondary navigation must never visually overpower the primary authentication action.

## 19.11 Brand / World Territory — Design Direction

The Brand / World territory should communicate the following qualities:

- identity
- possibility
- continuity
- calm confidence
- human growth
- intentionality
- depth

It should **not** become:

- a dashboard preview
- an AI showcase
- a marketing landing page embedded inside login
- a collection of feature cards
- a decorative technology illustration
- a generic stock-photo hero

The Brand territory should feel like an authentic part of DECIVEXA's visual language and remain compatible with the future application shell.

## 19.12 Authentication Territory — Design Direction

The Authentication territory should communicate:

- trust
- clarity
- focus
- stability
- ease
- control

The form should visually read as a purposeful entry point, not as a modal floating over an unrelated background.

The authentication territory must retain sufficient visual separation from the Brand territory to support orientation, error comprehension, keyboard navigation, and accessibility.

## 19.13 Card / Container Policy

No final decision has yet been made about whether the authentication interaction will use:

- a conventional card,
- a frameless form surface,
- a restrained container,
- or another structural treatment.

This remains intentionally open until the composition, visual language, typography, contrast, and information density are designed together.

No assumption from previous mockups or generated concepts is authoritative unless explicitly registered here.

## 19.14 Color Policy

No final authentication color palette is locked by this document yet.

In particular, the following are **not frozen**:

- background HEX values
- surface HEX values
- text colors
- accent colors
- button colors
- border colors
- gradients
- opacity values

Any earlier visual proposal that supplied exact color values is treated as exploratory material, not as a canonical design decision.

## 19.15 Typography Policy

No final font family, font-size scale, weight system, line-height scale, or letter-spacing values are locked yet.

Typography will be selected as part of the complete visual language and must be evaluated for:

- brand character
- readability
- international text support
- accessibility
- form scanning
- responsive behavior
- consistency with the broader DECIVEXA design system

## 19.16 Spacing and Geometry Policy

No final spacing tokens, grid measurements, border radii, control heights, icon sizes, or exact dimensions are locked yet.

These must be derived from the final composition and interaction requirements rather than chosen independently.

## 19.17 Motion Policy — Preliminary

Motion must be subtle, purposeful, and non-essential.

It may support:

- state transitions
- loading feedback
- focus/context changes
- successful completion
- responsive continuity

It must not be used to create artificial urgency, gamification, distraction, or an impression of consciousness.

No final animation timing or easing values are locked yet.

## 19.18 Accessibility Visual Contract

The visual design must remain compatible with the existing accessibility requirements and must not trade accessibility for visual distinctiveness.

The final design must preserve:

- sufficient contrast
- visible focus states
- clear field states
- error-state differentiation that is not color-only
- readable text at responsive sizes
- predictable focus order
- touch-safe interaction areas
- reduced-motion compatibility

Accessibility review is a design gate, not post-launch polish.

## 19.19 Anti-Pattern Register

The authentication design must explicitly avoid:

- generic centered login card on a plain gradient
- excessive glassmorphism
- neon cyber/AI aesthetics
- robot or humanoid AI imagery
- circuitry / hologram / futuristic dashboard clichés
- excessive decorative particles
- stock photography
- oversized marketing copy competing with authentication
- feature-grid disguised as Brand content
- visual noise around the form
- excessive shadows or ornamental borders
- dark-pattern urgency
- manipulative emotional language
- fake personalization

## 19.20 Design Evaluation Framework

Every subsequent visual decision will be evaluated against five dimensions:

1. **Brand distinctiveness** — Does it make DECIVEXA recognizable without relying on cliché?
2. **Human clarity** — Can a first-time user understand what to do immediately?
3. **Trust** — Does the design reinforce security, stability, and control?
4. **System coherence** — Can the visual rule extend naturally into the rest of DECIVEXA?
5. **Responsive resilience** — Does the principle survive different viewport sizes and interaction modes?

A visually attractive decision that fails one of these dimensions must not be accepted merely because it looks impressive.

## 19.21 Decision Recording Protocol

For every material visual decision added to this document, record:

- Decision ID
- Design area
- Problem being solved
- Options considered
- Selected direction
- Rejected direction(s)
- Design rationale
- Evidence / evaluation basis where applicable
- Founder approval status
- Current status
- Downstream effects
- Reversal / amendment conditions

This log is the durable design history. Decisions must not exist only in chat messages or transient mockups.

## 19.22 Current Design State

The authentication visual architecture currently has the following locked foundation:

```text
RESPONSIVE VIEWPORT-NATIVE EXPERIENCE
            │
            ▼
      SPLIT COMPOSITION
            │
            ▼
       BRAND-LED MODEL
            │
            ▼
   STRONG BRAND DOMINANCE
            │
            ▼
      SOFT DIVISION
```

Only the first three nodes are Founder-approved decisions at this point. Soft Division is the current professional design direction and remains revisable until explicitly elevated or superseded.

The following remain intentionally open:

- exact desktop ratio
- precise responsive breakpoints
- exact Brand content structure
- exact Authentication container treatment
- color system
- typography
- spacing/grid
- control geometry
- iconography
- imagery/graphics
- motion details
- final visual tokenization

## 19.23 Implementation Boundary

Nothing in Section 19 authorizes implementation.

Claude, developers, design-to-code systems, or other implementation agents must not infer permission to modify `apps/web`, authentication code, CSS, components, routes, assets, or dependencies from the existence of this design record.

Implementation begins only after:

1. the visual design specification is complete;
2. the relevant Founder-controlled design decisions are finalized;
3. the canonical document is explicitly frozen for implementation;
4. a separate implementation contract / prompt is created;
5. the applicable implementation gate authorizes execution.

## 19.24 Canonicality and Amendment Rule

This document is the canonical design record for the DECIVEXA authentication experience while this visual-design work is underway.

The document must evolve by explicit versioned amendment. Historical decisions must not be silently rewritten to make the record appear cleaner than the actual design process.

Any material change to a locked Founder-approved decision requires explicit Founder approval and a new decision-log entry.

---

# 20. Design Session Checkpoint — 2026-09-06

**Checkpoint:** AUTH-V1 Visual Foundation / Composition Layer  
**Founder-approved decisions:** AUTH-V1-D01, AUTH-V1-D02, AUTH-V1-D03  
**Current design direction:** AUTH-V1-D04 Soft Division  
**Implementation authorization:** NONE  
**Claude implementation prompt:** NOT CREATED  
**Next design work:** continue visual architecture from the locked composition foundation; no implementation activity permitted.

---

# 21. Authentication Visual Design V1 — Visual Language Layer

## 21.1 AUTH-V1-D05 — Authentication Surface Treatment

**Selected professional design direction:** Restrained Form Surface.

The authentication area should have a perceivable visual boundary, but it should not behave like a conventional SaaS card floating above the page.

The preferred construction is a calm, contained form surface with restrained separation from its surrounding environment. The surface may use tonal contrast, spacing, subtle structural edges, or a very restrained elevation cue, but must not depend on thick borders, strong shadows, glassmorphism, or decorative framing.

### Problem being solved

A conventional card makes the authentication area feel like an interchangeable SaaS template. A completely frameless form can lose orientation when the Brand / World territory is visually rich. Restrained Form Surface provides enough containment for usability without turning the form into the visual centerpiece.

### Rejected directions

- **Heavy SaaS Card:** rejected because it is visually generic and conflicts with the Brand-led architecture.
- **Glass / Frosted Panel:** rejected because it introduces a fashionable effect without adding meaningful trust or usability.
- **Completely Frameless Form:** rejected as the default because sufficient spatial orientation must remain available across different Brand environments.

### Governance status

Design-lead direction pending Founder approval. This decision does not authorize implementation.

## 21.2 AUTH-V1-D06 — Brand Territory Model

**Selected professional design direction:** Brand Environment.

The Brand / World territory is an environment, not a marketing hero.

Its purpose is to establish the emotional and conceptual context of DECIVEXA before the user interacts with the form. It should communicate identity, possibility, depth, and continuity without asking the user to consume a block of marketing information.

### Content rule

The Brand Environment should prefer:

`Identity → atmosphere → meaning → continuity`

over:

`headline → feature list → social proof → CTA → marketing content`.

### Visual rule

The environment may contain a distinctive abstract visual language, but it must not depict humans, robots, brains, artificial consciousness, dashboards, circuitry, or generic futuristic technology as the primary metaphor.

### Governance status

Design-lead direction pending Founder approval.

## 21.3 AUTH-V1-D07 — Visual Narrative

**Selected professional design direction:** Today → Possibility → Entry.

The Brand Environment should imply a quiet progression:

```text
CURRENT HUMAN STATE
        ↓
   POSSIBILITY
        ↓
     ENTRY
```

This is a conceptual narrative, not a requirement to literally depict a person, journey, road, or future scene.

The visual language should communicate that DECIVEXA is a place the user enters in order to become more capable of shaping their life, without claiming that the product itself guarantees transformation.

### Anti-pattern

Do not use motivational poster language, exaggerated promises, artificial “AI companion” imagery, or emotional dependency cues.

### Governance status

Design-lead direction pending Founder approval.

## 21.4 AUTH-V1-D08 — Brand-to-Authentication Hierarchy

The hierarchy is intentionally state-dependent.

### First impression

`DECIVEXA → World / Meaning → Entry → Authentication → Action`

### During interaction

`Authentication → Current Action → Supporting Information → Brand Context`

This prevents the Brand Environment from competing with the task once the user begins entering credentials.

### Principle

> **Brand dominates the first impression; usability dominates the interaction.**

### Governance status

Design-lead direction pending Founder approval.

## 21.5 AUTH-V1-D09 — Visual Foundation: Calm Light, Not Dark-by-Default

**Selected professional design direction:** Light-first adaptive foundation.

Authentication should not be designed around a permanently dark canvas. The default foundation should be capable of expressing DECIVEXA's depth and identity while remaining highly readable and calm in ordinary authentication use.

A dark or deep visual treatment may exist as a deliberate Brand Environment mode where it materially strengthens DECIVEXA identity, but the authentication surface itself must preserve a stable, high-clarity reading environment.

### Rationale

Authentication is a trust-critical interaction. A light-first adaptive foundation provides stronger baseline readability and reduces the risk that brand atmosphere becomes visual fatigue. It also allows a future dark theme without making darkness a prerequisite for DECIVEXA's identity.

### Rejected direction

**Dark-only authentication:** rejected as the canonical foundation because it would make atmospheric styling a requirement for basic account access and could reduce clarity across devices and contexts.

### Governance status

Design-lead direction pending Founder approval.

## 21.6 AUTH-V1-D10 — Color Architecture Before Exact Palette

Color will be designed as a semantic architecture before exact HEX values are frozen.

The system must distinguish at minimum:

1. **Brand atmosphere** — identity-bearing visual field.
2. **Authentication background** — stable reading field.
3. **Primary text** — high-confidence reading hierarchy.
4. **Secondary text** — supporting information.
5. **Interactive accent** — primary action and active states.
6. **Focus indicator** — unmistakable keyboard focus.
7. **Validation/error** — error communication.
8. **Success** — successful completion.
9. **Structural boundary** — restrained separation.

No single “brand color” should be forced into every semantic role.

### Color principle

> **Brand color creates recognition; semantic color creates usability.**

### Constraint

Exact HEX values remain intentionally open until typography, surface treatment, contrast, and Brand Environment composition are evaluated together.

### Governance status

Design-lead direction pending Founder approval.

## 21.7 AUTH-V1-D11 — Visual Density

**Selected professional design direction:** Deliberately low visual density.

The authentication experience should contain only the visual information needed to establish context, support orientation, and complete the current action.

The design should favor:

- generous breathing room,
- clear grouping,
- strong alignment,
- restrained decoration,
- predictable scanning.

It should avoid:

- dense supporting copy,
- multiple competing visual focal points,
- decorative badges,
- unnecessary icons,
- feature lists,
- visual noise around input fields.

### Rationale

Authentication is a gateway, not a product tour. Reducing visual density directly supports the existing principle: **Less interface. More confidence.**

### Governance status

Design-lead direction pending Founder approval.

## 21.8 AUTH-V1-D12 — Logo Presence

**Selected professional design direction:** Quietly persistent identity.

The DECIVEXA logo should be clearly present but should not become an oversized centerpiece inside the authentication form.

The Brand Environment may carry the stronger identity expression. The Authentication territory should use the logo as orientation and reassurance rather than decoration.

### Rule

The logo must remain visually connected to DECIVEXA without forcing the user to interpret a large brand mark before performing a simple authentication action.

### Governance status

Design-lead direction pending Founder approval.

## 21.9 Visual Language Layer — Consolidated Design Test

The current visual language is considered coherent only if all of the following remain true simultaneously:

- The page unmistakably belongs to DECIVEXA.
- The authentication task can be understood immediately.
- The Brand Environment does not become a marketing page.
- The form does not look like a generic SaaS card.
- The interface does not rely on futuristic AI clichés.
- Light and dark contexts can coexist without changing the product's identity.
- Semantic colors remain understandable independent of the brand palette.
- The user can visually separate primary action, secondary navigation, and state feedback.
- The design remains usable when the Brand Environment is reduced on smaller screens.

If a later visual proposal violates one of these conditions, the proposal must be revised rather than rationalized after the fact.

## 21.10 Current Design State — Updated

The authentication visual architecture now extends as follows:

```text
RESPONSIVE VIEWPORT-NATIVE EXPERIENCE
            │
            ▼
      SPLIT COMPOSITION
            │
            ▼
       BRAND-LED MODEL
            │
            ▼
   STRONG BRAND DOMINANCE
            │
            ▼
      SOFT DIVISION
            │
            ▼
   RESTRAINED FORM SURFACE
            │
            ▼
     BRAND ENVIRONMENT
            │
            ▼
 TODAY → POSSIBILITY → ENTRY
            │
            ▼
 STATE-DEPENDENT HIERARCHY
            │
            ▼
 LIGHT-FIRST ADAPTIVE FOUNDATION
            │
            ▼
   SEMANTIC COLOR SYSTEM
            │
            ▼
   DELIBERATELY LOW DENSITY
            │
            ▼
 QUIETLY PERSISTENT IDENTITY
```

D01–D03 remain Founder-approved and locked. D04–D12 are recorded as professional design directions pending Founder approval. No implementation is authorized.

## 21.11 Design Checkpoint — 2026-09-06

**Completed layer:** Composition + Visual Language foundation.  
**New design directions recorded:** AUTH-V1-D05 through AUTH-V1-D12.  
**Founder approval state:** D01–D03 locked; D04–D12 pending explicit Founder approval.  
**Implementation authorization:** NONE.  
**Claude implementation prompt:** NOT CREATED.  
**Next design layer:** typography, geometry, controls, iconography, state language, motion, and responsive visual rules.
