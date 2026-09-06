# DECIVEXA Authentication Design Handoff Checkpoint V1

**Date:** 2026-09-06  
**Status:** OFFICIAL HANDOFF CHECKPOINT — NOT FROZEN  
**Founder:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA  
**Implementation Authorization:** NOT GRANTED BY THIS DOCUMENT  
**Visual Design Freeze:** NOT REACHED  
**Claude Implementation Prompt:** NOT CREATED  

## 1. Purpose

This document is the canonical handoff record for the DECIVEXA Authentication design and pre-implementation work completed through 2026-09-06.

It exists so work can resume without reconstructing decisions from chat history. Future implementation work must treat the repository documents referenced here as the source of truth and must not infer missing decisions from this handoff.

This document records decisions, refinements, verified repository findings, open gates, and the exact continuation sequence. It does not itself authorize production implementation.

## 2. Founder Governance

Material changes to DECIVEXA product direction, architecture, scope, implementation, schemas, security, branding, UX, or other significant decisions remain subject to explicit Founder approval.

No candidate in this handoff may be silently promoted to a frozen token, architecture rule, or implementation requirement unless the governing document and required Founder gate authorize it.

## 3. Authentication Visual Direction — Current Canonical State

### 3.1 Locked / Approved foundation

- D01–D03: LOCKED / FOUNDER APPROVED.
- F-GATE-01 through F-GATE-05: APPROVED governing directions.
- Authentication remains a restrained, trust-oriented product surface rather than a generic AI/futuristic showcase.
- The Brand Environment and Authentication surface are distinct but visually coherent.

### 3.2 Refinement D38–D45

The latest official refinement records:

- **D38:** primary typography refined from Inter-only to **Vazirmatn as leading candidate**, because Persian and English are first-class requirements and RTL/LTR must be validated from the beginning.
- **D39:** bilingual typography scale narrowed.
- **D40:** geometry narrowed around an 8px rhythm with 4px subdivisions and candidate 16px surface / 10px control radii / 50px primary control height.
- **D41:** Authentication surface refined to **Near-flat Contained Material** rather than a visually floating card.
- **D42:** Brand Environment grammar refined to controlled spatial depth, restrained directional structure, and a single distant possibility cue.
- **D43:** desktop composition is governed by the largest Brand territory that preserves a calm, fully usable authentication reading column; fixed 60/40 ratios are not a law.
- **D44:** responsive behavior is formalized into four compositional modes: Wide, Constrained, Auth-priority, Mobile.
- **D45:** bilingual/RTL/LTR localization stress testing is mandatory freeze evidence.

Canonical visual refinement source:
`docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_REFINEMENT_V1.md`

## 4. Typography Decision State

Vazirmatn is the **leading candidate**, not a frozen token.

The reasoning is architectural/product-level: DECIVEXA requires Persian and English as first-class languages, mixed RTL/LTR content, long labels, and text enlargement. Typography must therefore be evaluated as a bilingual system rather than as an English-only Latin choice.

Required validation cases include:

- English Login
- Persian Login
- English Registration
- Persian Registration
- Persian text containing email/URL identifiers
- long translated errors
- enlarged text
- mixed RTL/LTR content

Inter remains usable as a comparison/reference candidate during QA but is no longer the preferred sole primary direction.

## 5. Visual Calibration Candidate Values — NOT TOKENS

The following are calibration targets only:

- Brand identity: 17–19px, weight 500–600
- Authentication title: 30–34px, weight 600
- Supporting text: 15–16px, weight 400
- Field label: 14px, weight 500
- Input value: 16px, weight 400–500
- Helper/state: 13–14px, weight 400–500
- Primary action: 15px, weight 600
- Secondary action: 14px, weight 500
- Authentication surface radius: 16px
- Field/control radius: 10px
- Primary control height: 50px
- Practical touch target: 44px minimum candidate
- Nominal form reading width: 400px, localization-adjustable
- Comfortable desktop internal padding: 32px
- Field spacing: 16px
- Major group spacing: 24px

None of these values are frozen until evidence review is complete.

## 6. Brand Environment Grammar

Canonical candidate grammar:

`deep field → controlled spatial depth → restrained directional structure → single distant possibility cue`

Do not introduce particles, stars, holograms, circuitry, floating interfaces, AI faces, humans, roads, or sci-fi objects merely to manufacture distinctiveness.

Brand visual intensity should retreat sufficiently during form focus so interaction remains primary.

## 7. Authentication Surface Grammar

Preferred hierarchy:

`surface contrast → spatial containment → subtle structural edge → optional minimal elevation`

Avoid:

`shadow → card → glass → decoration`

The surface must remain geometrically stable when validation errors, helper text, password guidance, and verification states appear.

## 8. Responsive Composition

The four canonical candidate modes are:

1. **Wide:** Brand-led split.
2. **Constrained:** split preserved with reduced Brand density.
3. **Auth-priority:** Authentication receives more visual territory while Brand identity remains present.
4. **Mobile:** vertical identity → authentication → supporting paths.

Transitions must be driven by content fit and interaction quality, not arbitrary device labels.

## 9. Accessibility / Localization Baseline

The repository accessibility specification establishes WCAG 2.2 AA as the formal baseline and requires Persian/English, RTL/LTR, text enlargement, visible focus, target-size compliance, accessible authentication, and related evidence.

The Authentication freeze cannot be granted without evidence covering at least:

- contextual contrast;
- visible and unobscured focus;
- keyboard-only operation;
- target-size practicality;
- non-color-only state communication;
- reflow/text enlargement;
- Persian/RTL rendering;
- correct LTR treatment of email/URL/identifier strings inside RTL layouts;
- error association;
- reduced motion behavior.

## 10. 20-State Scope — Founder Decision A

The working scope remains **Option A: all 20 Authentication states are in scope**. No state may be silently downgraded to a future-only concept.

However, a visual state must not be represented as a runtime/product state until the required deterministic product lifecycle exists.

Current implementation foundation supports Registration/Login, while Verification, Password Recovery/Reset, Session Expiry, Rate Limiting, and Network/Server Failure Recovery require additional product/runtime surfaces.

No mock-only state is to be presented as verified product behavior.

## 11. Deterministic Evidence Principle

The intended QA sequence is:

`Bilingual + RTL/LTR QA`
→ `20-State Visual QA`
→ `Responsive QA`
→ `Contextual Contrast QA`
→ `Accessibility Evidence`
→ `Brand Distinctiveness QA`
→ `Final Token Consolidation`
→ `Founder Visual Design Freeze`
→ `Claude Implementation Prompt`

Evidence must come from deterministic, reproducible product/runtime behavior. Screenshot-only approximation is insufficient where the state depends on backend lifecycle behavior.

## 12. Authentication Application Architecture Findings

The verified Application boundary is:

`apps/api/src/application/auth/`

Canonical components include the Authentication contract, Login/Register use cases, credential repository port, password service port, and access-token service port.

The HTTP boundary is:

`apps/api/src/infrastructure/auth/auth.controller.ts`

The module wiring registers the Authentication controller/use cases and infrastructure implementations.

The existing shared abstractions are:

- `shared/result`
- `shared/errors`

No reusable global HTTP error serializer/filter was found in the examined current architecture.

## 13. Existing Authentication Error Semantics

The Application layer already uses typed errors and `Result<T>`.

Current semantics include:

- invalid login credentials represented by `AuthorizationError`;
- invalid registration input represented by `ValidationError`;
- duplicate registration represented by `ApplicationError` with a stable application code.

The pre-existing controller behavior did not preserve these semantics correctly at the HTTP boundary: registration failures were collapsed to a conflict response and login errors were converted to a hard-coded human-readable message.

## 14. Canonical API Error Direction

The approved design direction for Slice A is:

`Application Result/Error`
→ `Auth HTTP Error Mapper`
→ `Canonical Auth API Error Envelope`
→ `Web localization/presentation`

Rules:

- stable `code` is the machine-readable API contract;
- human-readable `message` is safe fallback presentation, not the UI source of truth;
- request correlation must use a real request/correlation identifier when exposed, not static labels such as `login` or `registration`;
- field-level metadata is limited to safe, non-sensitive validation information;
- account enumeration must not be exposed through Verification/Recovery semantics;
- passwords, tokens, stack traces, and internal infrastructure details must never be public error payloads;
- localization belongs at the Web presentation layer rather than in the API contract.

## 15. Slice A Implementation Status

A minimal Auth-specific error-boundary implementation was created on a dedicated branch and proposed through Draft PR #29.

The implementation intent is:

- map validation failures to canonical Authentication validation semantics;
- map authorization failures to canonical invalid-credentials semantics;
- preserve duplicate-registration semantics;
- provide a safe fallback for unknown failures;
- prevent internal messages from being exposed;
- preserve correlation context;
- add deterministic mapper regression coverage.

**Critical status rule:** the implementation is **not considered verified merely because code exists**. CI and runtime evidence must be checked before it can be treated as accepted.

Draft PR:
`https://github.com/parsakiamanesht-tech/DECIVEXA/pull/29`

## 16. Canonical Error Registry

A canonical 20-state error registry was defined before implementation. It distinguishes state from error: Idle, Loading, Success, and Recovery are not automatically errors.

The registry maps relevant failure outcomes to stable Authentication codes and security-aware semantics.

The registry must remain compatible with the existing `Result<T>` and Error primitives rather than introducing a parallel Result system.

## 17. What Is Explicitly NOT Done

The following remain open and must not be claimed as complete:

- Verification lifecycle implementation
- Verification success/failure runtime behavior
- Password Recovery lifecycle
- Password Reset lifecycle
- Session-expiry runtime behavior
- Rate-limit runtime behavior
- Network/server failure recovery runtime behavior
- deterministic 20-state runtime harness
- complete bilingual/RTL/LTR visual QA
- complete responsive QA
- final contextual contrast evidence
- final accessibility evidence
- final Brand distinctiveness evidence
- final token consolidation
- Founder Visual Design Freeze
- Claude implementation prompt

## 18. Continuation Protocol for Claude

When Claude returns, it should first read this handoff and the referenced canonical documents before modifying anything.

Required first actions:

1. Verify current `main` and the status of Draft PR #29.
2. Inspect the actual diff and tests; do not assume the prior implementation is correct.
3. Run/inspect available CI evidence and local/runtime evidence where possible.
4. If Slice A fails, fix only the root cause within its authorized boundary.
5. Do not merge or broaden scope automatically.
6. Before implementing Verification/Recovery/Reset/Session/Rate-limit, identify any schema/security/product decisions that require Founder approval.
7. Continue the 20-state runtime surface work only when deterministic lifecycle support exists.
8. Do not declare Visual Freeze until the full evidence sequence is satisfied.
9. Do not create the final Claude implementation prompt until Founder Visual Design Freeze is explicitly reached.

## 19. Immediate Next Gate

**Immediate next gate:**

`PR #29 Diff + Test + CI + Runtime Verification Review`

Only after that review may Slice A be classified as verified or sent back for correction.

## 20. Source-of-Truth Hierarchy

When documents disagree, use this order:

1. Founder-approved governance decisions and locked gates.
2. Canonical architecture/governance documents in the repository.
3. Latest approved visual calibration/refinement documents.
4. Verified implementation and runtime evidence.
5. This handoff document as the continuation index.
6. Chat history only as supporting context, never as a substitute for repository truth.

## 21. Final Checkpoint

At this checkpoint:

**Design direction:** established, refined, not frozen.  
**Bilingual/RTL requirement:** mandatory.  
**Option A / 20-state scope:** retained.  
**Authentication architecture boundary:** verified.  
**Error contract direction:** established.  
**Slice A implementation:** proposed/implemented on branch, pending verification.  
**Runtime lifecycle completeness:** incomplete.  
**Visual Freeze:** not reached.  
**Implementation prompt:** not created.

This checkpoint is intended to make continuation safe, auditable, and lossless when work resumes with Claude.
