# DECIVEXA Authentication Evidence Acquisition Plan V1

## Status

PRE-FREEZE / DESIGN VALIDATION ONLY

Founder Visual Design Freeze: NOT GRANTED
Implementation authorization: NOT GRANTED

## Purpose

Close the evidence gaps identified by the Authentication Visual Freeze QA without silently changing approved design decisions or implementing new UI.

## Evidence Gates

### E1 — Bilingual / RTL-LTR
- Persian-only strings
- English-only strings
- mixed Persian/English strings
- email/password fields
- validation and error messages
- direction-aware icons and controls
- document/page direction
- input direction

Result vocabulary: PASS / CONDITIONAL PASS / FAIL / UNVERIFIED.

### E2 — 20-State Authentication Matrix
Each state requires a rendered artifact or reproducible runtime evidence.

Minimum state families:
- idle
- focus
- populated
- invalid
- validation error
- authentication error
- loading
- disabled
- success
- network failure
- long Persian
- long English
- mixed-direction
- narrow viewport
- wide viewport
- keyboard/focus stress
- zoom/reflow stress
- contrast stress
- localization expansion
- recovery/transition state

No PASS from specification alone.

### E3 — Responsive Evidence
Validate all four approved responsive modes using actual rendered output. Record viewport dimensions, state, language/direction, and result.

### E4 — Accessibility Evidence
Validate, where applicable:
- keyboard navigation
- visible focus
- focus not obscured
- text/non-text contrast
- text resizing
- reflow
- target size
- error identification and association
- accessible names
- autocomplete/purpose
- accessible authentication
- screen-reader semantics where applicable

WCAG 2.2 AA is the governing external benchmark referenced by the project.

### E5 — Browser / Platform Authentication Behavior
Evidence required for:
- autofill
- password manager compatibility
- keyboard behavior
- validation behavior
- browser zoom
- mobile viewport behavior

### E6 — Brand Distinctiveness
Verify that Authentication expresses DECIVEXA's established visual grammar without generic AI/SaaS visual clichés.

## Governance

1. No production implementation may be created or modified as part of this evidence phase.
2. No candidate may become APPROVED without evidence and Founder authorization where required.
3. Missing runtime/render evidence must remain UNVERIFIED.
4. Existing Founder-approved decisions must not be silently reopened.
5. Final token consolidation remains blocked until evidence gates are closed.
6. Founder Visual Design Freeze remains a Founder-only decision.

## Exit Criteria

The phase may recommend `READY FOR FOUNDER FREEZE REVIEW` only when E1–E6 have sufficient evidence and no blocking failure remains.

Until then:

`NOT READY FOR FREEZE`

## Next Evidence Order

E1 → E2 → E3 → E4 → E5 → E6 → Final Token Consolidation → Founder Review
