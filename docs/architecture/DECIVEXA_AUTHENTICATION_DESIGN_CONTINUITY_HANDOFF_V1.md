# DECIVEXA Authentication — Design & Engineering Continuity Handoff V1

**Date:** 2026-09-06  
**Status:** ACTIVE CHECKPOINT / CONTINUATION SOURCE OF TRUTH  
**Scope:** Founder-approved Option A — full Authentication 20-state program  
**Purpose:** Preserve the complete design, QA, architecture, implementation, and governance state reached before Claude continuation.  
**Visual Freeze:** NOT REACHED  
**Claude Implementation Prompt:** NOT CREATED / NOT AUTHORIZED  

---

## 1. Continuity Rule

This document is a handoff artifact for the next engineering/design agent, including Claude Code when it becomes available again.

The next agent MUST read this document first, then inspect the linked canonical documents and the current repository state before making changes.

This document does not override Founder governance, existing ADRs, or canonical specifications. It records the current checkpoint so work can resume without reconstructing decisions from conversation history.

**Founder governance remains binding:** material product, architecture, security, scope, schema, UX, visual, or implementation-direction changes require explicit Founder approval before execution.

---

## 2. Founder Decision — Option A

The Authentication visual/QA program is governed by the Founder-approved **Option A: Full 20-State Matrix**.

The 20 states are current scope. They must not be reduced merely because some states are not yet implemented.

However, an unimplemented state must NEVER be represented by a fake UI state, hard-coded demo route, screenshot-only mock, or other evidence fabrication.

A state becomes evidenceable only when its real product lifecycle exists and has a deterministic entry/reset path.

---

## 3. Canonical Visual Governance

The Founder-approved visual foundation is:

### F-GATE-01 — Composition Architecture

- Split composition.
- Brand-led relationship.
- Strong Brand Dominance on sufficiently wide desktop layouts.

### F-GATE-02 — Brand Character

The Brand Environment communicates calm intelligence, depth, possibility, continuity, intentionality, and human growth.

It must NOT rely on:

- humans or human silhouettes as the primary metaphor;
- robots/humanoid AI;
- brains/artificial-consciousness metaphors;
- dashboards/product UI previews;
- circuitry/holograms;
- generic futuristic technology spectacle;
- manipulative emotional cues.

### F-GATE-03 — Authentication Character

Authentication is restrained, contained, calm, and high-clarity.

It must NOT become:

- a conventional floating SaaS card;
- glass/frosted UI;
- a decorative centerpiece;
- a visually detached modal.

### F-GATE-04 — Interaction Priority

> **Brand dominates the first impression; usability dominates the interaction.**

Once credential entry begins, usability, clarity, accessibility, security comprehension, and task completion override non-essential Brand decoration.

### F-GATE-05 — Visual Philosophy

Premium quality comes from restraint, precision, hierarchy, whitespace, material quality, and coherence — not spectacle, neon, glassmorphism, excessive animation, or decorative complexity.

Canonical governance companion:
`docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_FOUNDER_GATE_V1.md`

---

## 4. Visual Calibration — Current State

The first calibration established candidate values, not frozen tokens.

Canonical parent:
`docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_V1.md`

First QA:
`docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_QA_V1.md`

### Original candidate direction

Inter was initially the primary typography candidate.

### Critical refinement

The canonical accessibility requirements make **Persian and English first-class languages**, with RTL/LTR and mixed-direction content treated as product requirements rather than edge cases.

Therefore the Inter-only direction was not retained as the preferred primary candidate.

**Vazirmatn is now the leading Authentication typography candidate, subject to actual bilingual rendering QA. It is NOT frozen.**

This refinement is recorded in:
`docs/architecture/DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_REFINEMENT_V1.md`

### D38–D45

- **D38:** Primary typography refined from Inter-only to Vazirmatn candidate.
- **D39:** Bilingual typography scale narrowed.
- **D40:** Geometry calibration narrowed.
- **D41:** Authentication surface refined to Near-flat Contained Material.
- **D42:** Brand Environment grammar refined around spatial depth + controlled directional light.
- **D43:** Fixed 60/40 composition rule rejected in favor of usable Authentication reading-column authority.
- **D44:** Responsive behavior formalized into four compositional modes.
- **D45:** RTL/LTR and localization stress testing elevated to mandatory Freeze evidence.

### Current visual candidate principles

- 8px spacing rhythm with 4px subdivisions.
- Approximately 16px Authentication surface radius candidate.
- Approximately 10px field/control radius candidate.
- Approximately 50px primary control height candidate.
- Approximately 400px nominal form reading width, content/localization dependent.
- Approximately 32px internal padding candidate where space permits.
- Candidate semantic palette remains provisional.
- Brand Environment grammar: deep field → controlled spatial depth → restrained directional structure → single distant possibility cue.
- No literal humans, roads, robots, AI faces, brains, circuitry, holograms, or generic futuristic objects.
- Four responsive composition modes: Wide → Constrained → Auth-priority → Mobile.
- Motion, where useful, remains restrained; reduced-motion preference is authoritative.

**None of these candidate values are frozen.**

---

## 5. Mandatory Visual QA Before Freeze

The design must pass evidence-driven review across:

1. bilingual typography;
2. English / LTR;
3. Persian / RTL;
4. mixed Persian + email/URL/code identifiers;
5. long localized messages;
6. enlarged text;
7. four global responsive bands;
8. all 20 Authentication states;
9. contextual contrast;
10. focus visibility;
11. keyboard operation;
12. error association;
13. non-color-only state meaning;
14. browser autofill/password-manager behavior;
15. mobile keyboard behavior;
16. Brand distinctiveness;
17. cross-state visual invariants;
18. reduced motion.

The order remains:

`Founder direction → Calibration → Evidence/QA → Refinement → Founder Visual Freeze → Separate Claude Implementation Prompt → Authorized implementation`

Visual Freeze has NOT occurred.

---

## 6. Canonical 20-State Matrix

| ID | State | Current readiness |
|---|---|---|
| 1 | Login empty | Existing surface; evidence later |
| 2 | Login focus | Existing surface; evidence later |
| 3 | Login error | Error contract implemented on branch; verification pending |
| 4 | Login loading | Existing surface; deterministic evidence still required |
| 5 | Registration empty | Existing surface; evidence later |
| 6 | Registration password guidance | Lifecycle/UI work required |
| 7 | Registration error | Error contract implemented on branch; verification pending |
| 8 | Verification waiting | Blocked — lifecycle not implemented |
| 9 | Verification resend cooldown | Blocked — lifecycle not implemented |
| 10 | Verification success | Blocked — lifecycle not implemented |
| 11 | Verification expired/invalid | Blocked — lifecycle not implemented |
| 12 | Forgot password initial | Blocked — recovery lifecycle not implemented |
| 13 | Forgot password confirmation | Blocked — recovery lifecycle not implemented |
| 14 | Reset entry | Blocked — reset lifecycle not implemented |
| 15 | Reset error | Blocked — reset lifecycle not implemented |
| 16 | Reset success | Blocked — reset lifecycle not implemented |
| 17 | Session expired | Blocked — full UI lifecycle not implemented |
| 18 | Network/server failure | Partial taxonomy; full runtime entry pending |
| 19 | Rate limit | Blocked — rate-limit implementation not complete |
| 20 | Mobile collapsed | Responsive evidence blocked until real surface/harness exists |

This matrix is a scope and readiness record, not permission to fabricate states.

---

## 7. Canonical Authentication Architecture

The real current Authentication boundary was verified in repository source.

### Application boundary

`apps/api/src/application/auth/`

Current conceptual structure includes:

- `authentication.contract.ts`
- `authenticate-user.use-case.ts`
- `register-user.use-case.ts`
- `user-credentials.repository.ts`
- `password.service.port.ts`
- `access-token.service.port.ts`

### HTTP/infrastructure boundary

`apps/api/src/infrastructure/auth/`

The current HTTP adapter is `AuthController`, wired through the Authentication module.

### Current runtime foundation

Current API Authentication surface includes:

- `POST /auth/register`
- `POST /auth/login`
- authenticated `GET /auth/me`

Registration currently validates credentials, handles duplicate registration, persists credentials, and issues an access token.

Login currently validates credentials and issues an access token on success.

The existing token verifier rejects expired tokens; the complete user-facing session-expiry lifecycle is still incomplete.

---

## 8. Result/Error Architecture Decision

The existing DECIVEXA `Result<T>` abstraction remains authoritative.

Do NOT create a parallel Result framework.

The existing shared error primitives include:

- `ApplicationError`
- `AuthorizationError`
- `InfrastructureError`
- `ValidationError`

`ApplicationError` already supports a stable `code`.

### Boundary rule

Application layer:

`Result<T> + typed/stable semantic error`

HTTP layer:

`application outcome → safe HTTP representation`

Web layer:

`stable public code → localized presentation`

The Web client must never branch on English error message strings.

---

## 9. Canonical Error Code Registry

Canonical design registry:
`docs/architecture/DECIVEXA_AUTHENTICATION_20_STATE_ERROR_CODE_REGISTRY_V1.md`

Important design rule:

> **State ≠ Error**

Idle, loading, success, recovery, and other neutral/in-progress states are not errors merely to force a uniform API shape.

Current canonical error-code direction includes:

- `AUTH_INVALID_INPUT`
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_EMAIL_ALREADY_REGISTERED`
- `AUTH_VERIFICATION_REQUIRED`
- `AUTH_INVALID_VERIFICATION`
- `AUTH_VERIFICATION_EXPIRED`
- `AUTH_RECOVERY_UNAVAILABLE`
- `AUTH_INVALID_RESET_TOKEN`
- `AUTH_SESSION_EXPIRED`
- `AUTH_RATE_LIMITED`
- `AUTH_NETWORK_FAILURE`
- `AUTH_SERVER_FAILURE`

Some HTTP mappings remain provisional until the relevant lifecycle/security contract exists.

---

## 10. API Error Serialization & Security Contract

Canonical document:
`docs/architecture/DECIVEXA_AUTHENTICATION_API_ERROR_SERIALIZATION_SECURITY_CONTRACT_V1.md`

Core contract:

```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid credentials",
    "requestId": "..."
  }
}
```

Rules:

- `code` is the machine-readable semantic contract.
- `message` is not the UI branching contract.
- request correlation must use a real safe identifier when available.
- raw internal messages must not be exposed.
- stack traces must not be exposed.
- password/token/verification/reset secrets must never be exposed.
- infrastructure details must be redacted at the public boundary.
- recovery behavior must not create an unnecessary account-enumeration oracle.
- localization belongs to the Web/presentation layer.

### Important current-state finding

The former AuthController behavior collapsed application semantics:

- registration failures were broadly mapped to HTTP 409;
- login discarded the application error semantics and emitted a fixed 401 message.

That mismatch motivated Slice A.

---

## 11. Slice A Implementation Checkpoint

A narrow implementation branch was created:

**Branch:** `implementation/auth-slice-a-error-boundary`

**PR:** #29  
**PR status:** OPEN / DRAFT / NOT MERGED  
**Head commit:** `87fdf266888344429e6e31ea53bd6daa91bae2a3`

PR:
`https://github.com/parsakiamanesht-tech/DECIVEXA/pull/29`

Scope of Slice A:

- Auth-specific application-error → HTTP mapper.
- Stable authentication semantics at HTTP boundary.
- Safe public messages.
- No raw internal error-message exposure.
- Current validation, credential, and duplicate-registration mappings.
- Generic authentication 500 for unknown thrown/application failures.
- Deterministic mapper unit coverage.
- Existing API test-script integration.

Explicit non-scope:

- no database/schema changes;
- no Verification implementation;
- no Recovery implementation;
- no Reset implementation;
- no global exception filter;
- no visual/UI changes;
- no successful Login/Register payload redesign;
- no manufactured 20-state runtime behavior.

### Verification status

At this checkpoint, **GitHub Actions has not produced a workflow run for the PR head commit**. Therefore CI/runtime success is NOT claimed.

Do not mark Slice A verified until actual CI and, where required, external runtime evidence exists.

---

## 12. Implementation Plan After Slice A

Canonical plan:
`docs/architecture/DECIVEXA_AUTHENTICATION_20_STATE_IMPLEMENTATION_PLAN_V1.md`

Dependency-safe sequence:

### Slice A — Error/Result Taxonomy

Stable outcomes + HTTP boundary mapping.

### Slice B — Registration Lifecycle

Real verification-required registration lifecycle.

### Slice C — Verification Lifecycle

Waiting, resend, cooldown, success, invalid/expired, deterministic test seam.

### Slice D — Password Recovery/Reset

Recovery request, safe confirmation, reset token lifecycle, reset success/failure.

### Slice E — Session Lifecycle

Real session expiry/re-authentication lifecycle.

### Slice F — Rate Limiting

Server-authoritative 429 behavior + deterministic test fixture.

### Slice G — Network/Server Failure

Real distinction between transport failure and server failure where UX requires it.

### Slice H — Runtime Evidence Harness

Only after real product surfaces exist:

- deterministic state fixtures;
- clean reset;
- locale control;
- direction control;
- viewport control;
- deterministic API responses;
- screenshot traceability;
- accessibility inspection hooks;
- state-to-evidence mapping.

---

## 13. Testability Requirements

Preferred mechanisms:

- dependency injection for time/token generation;
- application-owned test fixtures;
- controlled API responses in E2E where appropriate;
- deterministic token factories in test environments;
- injectable clock for expiry/cooldown behavior;
- explicit data reset/isolation.

Avoid:

- arbitrary sleeps;
- waiting for wall-clock expiry;
- external email providers in CI;
- hidden query parameters that alter production semantics;
- permanent QA-only routes;
- browser-storage mutation as a substitute for real behavior.

---

## 14. Security Guardrails

Never introduce:

- plaintext password persistence;
- recoverable password storage;
- account enumeration through recovery UX;
- client-authoritative verification;
- client-authoritative session validity;
- reusable reset credentials outside intended lifecycle;
- sensitive token exposure in user-facing errors.

Existing password hashing and access-token services remain the foundation unless a separately approved architecture decision changes them.

Any security-model change must stop and enter the appropriate Founder gate.

---

## 15. Localization & Accessibility Contract

English and Persian are first-class product languages.

RTL/LTR is a core layout requirement.

The visual system must survive:

- Persian/RTL;
- English/LTR;
- mixed-direction email/URL/identifier content;
- long localized strings;
- enlarged text;
- browser zoom;
- reflow;
- keyboard-only interaction;
- visible focus;
- non-color-only error/success communication.

Canonical accessibility authority:
`docs/architecture/DECIVEXA_ACCESSIBILITY_SPECIFICATION_V1.md`

---

## 16. What Is Frozen vs What Is Not

### FROZEN / FOUNDER-APPROVED

- Option A — Full 20-State scope.
- Split composition foundation.
- Strong Brand Dominance direction.
- Brand-first first impression.
- Usability-first interaction priority.
- Core Brand character and anti-pattern boundaries.
- Core Authentication character and restrained material direction.
- Core visual philosophy.

### NOT FROZEN

- Typeface final choice.
- Exact typography scale/weights.
- Exact color tokens.
- Exact geometry values.
- Exact composition ratio.
- Exact responsive thresholds.
- Exact motion values.
- Final 20-state visual renderings.
- Accessibility evidence.
- Localization evidence.
- Browser credential evidence.
- Final semantic token consolidation.

---

## 17. Resume Protocol for Claude

When Claude becomes available again, it must NOT restart the Authentication design from scratch.

### Step 1 — Read

Read this document first.

Then read, in order:

1. `DECIVEXA_AUTHENTICATION_VISUAL_FOUNDER_GATE_V1.md`
2. `DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_V1.md`
3. `DECIVEXA_AUTHENTICATION_VISUAL_QA_V1.md`
4. `DECIVEXA_AUTHENTICATION_VISUAL_CALIBRATION_REFINEMENT_V1.md`
5. `DECIVEXA_ACCESSIBILITY_SPECIFICATION_V1.md`
6. `DECIVEXA_AUTHENTICATION_20_STATE_ERROR_CODE_REGISTRY_V1.md`
7. `DECIVEXA_AUTHENTICATION_API_ERROR_SERIALIZATION_SECURITY_CONTRACT_V1.md`
8. `DECIVEXA_AUTHENTICATION_20_STATE_IMPLEMENTATION_PLAN_V1.md`

### Step 2 — Inspect repository state

Inspect:

- `main` HEAD;
- open PR #29;
- `implementation/auth-slice-a-error-boundary`;
- current Authentication source tree;
- CI status;
- current unmerged changes.

### Step 3 — Do not assume

Do not trust an earlier conversational claim if the current repository contradicts it.

Use the actual repository source as the implementation baseline.

### Step 4 — First pending task

The immediate engineering task is:

**Review and verify PR #29 / Slice A.**

Required checks:

- inspect exact diff;
- compile/typecheck;
- unit/regression tests;
- CI result;
- security mapping review;
- successful Login/Register response compatibility;
- validation-vs-conflict correctness;
- invalid-credential normalization.

Do not merge until the verification evidence is real.

### Step 5 — After Slice A verification

Proceed to Slice B only if Slice A is verified and no Founder gate is triggered.

If implementation reveals a material schema/security/architecture/product-direction decision, STOP and open the appropriate Founder gate instead of silently expanding scope.

### Step 6 — Visual work remains separate

Do not treat the current visual calibration candidates as frozen implementation tokens.

The Visual Design Freeze must still occur after the complete evidence chain.

Do not create the Claude Implementation Prompt until the Founder Visual Design Freeze conditions are satisfied.

---

## 18. Current Checkpoint Summary

```text
FOUNDER OPTION A — FULL 20 STATE MATRIX
                │
                ▼
FOUNDER VISUAL GATES F01–F05
                │
                ▼
VISUAL CALIBRATION D27–D37
                │
                ▼
REFINEMENT D38–D45
                │
                ├── Typography → Vazirmatn leading candidate
                ├── Bilingual / RTL-LTR → mandatory
                ├── Geometry → refined candidate
                ├── Near-flat contained auth surface
                ├── Brand environment grammar refined
                ├── 60/40 fixed ratio removed as authority
                └── Four responsive composition modes
                │
                ▼
20-STATE READINESS / LIFECYCLE AUDIT
                │
                ▼
CANONICAL ERROR CODE REGISTRY
                │
                ▼
API ERROR SERIALIZATION + SECURITY CONTRACT
                │
                ▼
SLICE A IMPLEMENTATION
                │
                └── PR #29 OPEN / DRAFT / NOT MERGED
                │
                ▼
CURRENT NEXT GATE

PR #29 VERIFICATION
        ↓
SLICE A ACCEPTANCE
        ↓
SLICE B REGISTRATION LIFECYCLE
        ↓
SLICE C VERIFICATION
        ↓
SLICE D RECOVERY / RESET
        ↓
SLICE E SESSION
        ↓
SLICE F RATE LIMIT
        ↓
SLICE G NETWORK / SERVER FAILURE
        ↓
SLICE H RUNTIME EVIDENCE HARNESS
        ↓
20-STATE VISUAL + ACCESSIBILITY QA
        ↓
FINAL TOKEN CONSOLIDATION
        ↓
FOUNDER VISUAL DESIGN FREEZE
        ↓
CLAUDE IMPLEMENTATION PROMPT
```

---

## 19. Absolute Stop Conditions

The next agent must stop rather than improvise if any of the following occur:

- a material Founder decision is required;
- a schema change appears necessary;
- a security model changes;
- the authentication lifecycle requires a new architectural boundary;
- the current canonical repository structure contradicts this handoff;
- CI/runtime evidence cannot be established;
- a visual decision materially changes F-GATE-01 through F-GATE-05;
- a state cannot be entered deterministically without inventing test-only product behavior.

---

## 20. Final Status at Handoff

**Founder scope:** OPTION A / FULL 20 STATES — APPROVED  
**Founder visual gates:** F-GATE-01 … F-GATE-05 — APPROVED  
**Visual calibration:** COMPLETE TO CURRENT REFINEMENT PASS / NOT FROZEN  
**D38–D45:** CANDIDATES / NOT FROZEN  
**20-state product lifecycle:** INCOMPLETE  
**Canonical error registry:** ESTABLISHED AS DESIGN CONTRACT  
**API error serialization contract:** ESTABLISHED AS DESIGN CONTRACT  
**Slice A implementation:** OPEN DRAFT PR #29  
**CI verification:** NOT CLAIMED  
**Runtime evidence:** BLOCKED  
**Visual Freeze:** NOT REACHED  
**Claude Implementation Prompt:** NOT CREATED / NOT AUTHORIZED  

**This is the official continuation checkpoint for the Authentication program as of 2026-09-06.**
