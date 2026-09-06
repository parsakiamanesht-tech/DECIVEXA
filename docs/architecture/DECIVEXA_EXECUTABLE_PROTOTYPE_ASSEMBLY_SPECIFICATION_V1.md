# DECIVEXA Executable Prototype Assembly Specification V1

**Status:** DESIGN CANONICAL — EXECUTABLE PROTOTYPE ASSEMBLY SPECIFICATION — IMPLEMENTATION NOT AUTHORIZED  
**Owner:** Parsa Kiamanesh — Founder, Originator & Owner of DECIVEXA  
**Parent:** `DECIVEXA_USER_VALIDATION_PROTOTYPE_SPECIFICATION_V1.md`  
**Representation Blueprint:** `DECIVEXA_USER_VALIDATION_PROTOTYPE_REPRESENTATION_BLUEPRINT_V1.md`  
**Structural Blueprint:** `DECIVEXA_PROTOTYPE_V1_STRUCTURAL_INTERACTION_BLUEPRINT.md`  
**Validation Plan:** `DECIVEXA_STRUCTURAL_PROTOTYPE_VALIDATION_EXECUTION_PLAN_V1.md`

## 0. Purpose

This specification defines the exact assembly contract for the controlled, executable DECIVEXA Prototype V1 used for internal structural checking and subsequent controlled user validation.

The prototype is a validation instrument. It is not a production application, a production frontend, a backend implementation, or an AI product.

Human-centred design is inherently iterative; ISO 9241-210 identifies iteration and user-centred evaluation as mechanisms for progressively reducing uncertainty and refining interactive-system solutions. citehttps://www.iso.org/standard/77520.html

## 1. Hard Boundary

### The prototype MAY include

- executable screen-to-screen navigation;
- deterministic fictional data;
- simulated state transitions;
- realistic interaction feedback;
- responsive layout variants;
- RTL/LTR variants;
- keyboard and focus behavior;
- accessibility-oriented state announcements;
- controlled error/recovery simulation;
- proposal, correction, decision, and outcome lifecycle simulation.

### The prototype MUST NOT include

- production database access;
- production API contracts;
- production authentication;
- real personal data;
- real AI/provider calls;
- AI Runtime activation;
- provider selection;
- autonomous actions;
- production analytics instrumentation;
- production telemetry;
- infrastructure changes;
- release/deployment configuration;
- irreversible domain mutations.

## 2. Assembly Principle

```text
REPRESENT MEANING
→ SIMULATE STATE
→ OBSERVE BEHAVIOR
→ RECORD FINDINGS
→ REFINE DESIGN
```

The prototype must never compensate for a semantic design problem with visual polish.

## 3. Prototype Runtime Model

The executable prototype shall use four controlled layers:

```text
Presentation
    ↓
Interaction State
    ↓
Deterministic Scenario State
    ↓
Fixture Dataset
```

No production domain service is required.

The scenario state is resettable so every validation session can begin from a known baseline.

## 4. Deterministic Scenario State

Every validation scenario must be reproducible.

Required state dimensions:

- navigation/context stack;
- current surface;
- current object identity;
- object lifecycle state;
- proposal disposition;
- correction state;
- evidence epistemic state;
- decision commitment state;
- application result;
- preservation/recovery state;
- responsive mode;
- language/direction mode;
- focus state;
- announcement/status state.

A scenario must never depend on randomness, network availability, model output, or external services.

## 5. Canonical Lifecycle State Machines

### 5.1 Proposal

```text
PROPOSED
   ↓
REVIEWING
   ├── ACCEPTED
   ├── MODIFIED
   └── REJECTED
          ↓
      DISPOSITION RECORDED

ACCEPTED / MODIFIED
   ↓
APPLYING
   ├── APPLIED
   └── FAILED-INCOMPLETE
```

Invariant:

```text
PROPOSED ≠ ACCEPTED ≠ APPLIED
```

A visible proposal must never visually imply that domain state has already changed.

### 5.2 Correction

```text
CURRENT UNDERSTANDING
   ↓
CORRECTION INITIATED
   ↓
USER INPUT
   ↓
CONSEQUENCE PREVIEW
   ↓
REVIEW
   ↓
CONFIRMED
   ├── UPDATED
   └── REQUIRES RE-EVALUATION
```

Potential downstream effects must remain explicitly potential until independently established.

### 5.3 Decision and Action

```text
OPTIONS
   ↓
COMPARISON
   ↓
HUMAN JUDGMENT
   ↓
DECISION COMMITTED
   ↓
RELATED ACTIONS
```

Invariant:

```text
DECISION COMMITTED ≠ ACTION COMMITTED
```

### 5.4 Recovery

```text
ATTEMPT
   ↓
PARTIAL PRESERVATION
   ↓
ERROR / NOT SYNCED
   ↓
RETURN
   ↓
STATE DISCLOSED
   ├── RETRY
   └── REVIEW
```

The prototype must always disclose what survived and what did not.

## 6. Surface Assembly Matrix

Each surface must exist in at least the required semantic states.

| Surface | Required States |
|---|---|
| Home | default, attention, updated |
| Today | active, blocked, adapted |
| Goals | active, needs attention |
| Goal Detail | normal, evidence-linked, dependency warning |
| Action Context | actionable, completed, blocked |
| Evidence Detail | recorded, provenance-expanded |
| Understand | current, stale, contradiction |
| Understanding Detail | inferred, confirmed, outdated |
| Correction Review | proposed correction, consequence preview, confirmed |
| Decisions | active, recently decided, follow-up |
| Decision Detail | comparison, judgment, committed |
| Proposal Review | proposed, reviewing, accepted, modified, rejected |
| Consequence Preview | pending, accepted, consequence disclosed |
| Error / Recovery | failed, partially preserved, recoverable |
| Search Results | contextual result, mixed-domain results |
| Contextual Search Result | result identity, context preserved |

## 7. Journey-to-Screen Assembly

### J01

```text
Home
→ Goal Detail
→ Back / Context Return
```

### J02

```text
Today
→ Action Context
→ Outcome
→ Today
```

### J03

```text
Today
→ Blocked Action Context
→ Proposal Review
→ Consequence Preview
→ Accept / Modify / Reject
→ Application Result
→ Today
```

### J04

```text
Goal Detail
→ Evidence Detail
→ Provenance Expansion
→ Goal Detail
```

### J05

```text
Understand
→ Understanding Detail
→ Correction Review
→ Consequence Preview
→ Confirm
→ Updated Understanding
```

### J06

```text
Decisions
→ Decision Detail
→ Comparison
→ Human Judgment
→ Decision Committed
→ Related Actions
```

### J07

```text
Search
→ Search Result
→ Contextual Result Detail
→ Source Context
→ Return
```

### J08

```text
Action / Proposal
→ Save Attempt
→ Partial Preservation
→ Error / Recovery
→ Return
→ State Disclosure
→ Retry / Review
```

## 8. Fixture Dataset Contract

All prototype data is fictional and deterministic.

Minimum fixture set:

- Goal G-01: active;
- Goal G-02: unresolved dependency;
- Action A-01: executable;
- Action A-02: blocked;
- Evidence E-01/E-02/E-03: distinct provenance;
- Understanding U-01: inferred;
- Understanding U-02: confirmed;
- Understanding U-03: stale;
- Contradiction C-01;
- Decision D-01;
- Options O-01/O-02/O-03;
- Proposal P-01: proposed;
- Proposal P-02: accepted but not applied;
- Proposal P-03: failed/incomplete;
- Proposal P-04: rejected;
- Proposal P-05: superseded;
- Action A-03: related but uncommitted;
- Recovery R-01: partially preserved.

Fixtures must contain sufficient Persian/English mixed-direction values for RTL/LTR validation.

## 9. Responsive Assembly

The same semantic scenario must be executable in:

```text
Desktop
Tablet
Mobile
```

Responsive transformation may change:

- parallelism;
- panel arrangement;
- density;
- navigation presentation;
- disclosure depth.

It may not remove the minimum semantic contract:

```text
IDENTITY
STATUS
WHY
PRIMARY ACTION
```

WCAG 2.2 explicitly covers web content across device types and includes keyboard access, focus order, visible focus, and focus-not-obscured requirements. citehttps://www.w3.org/TR/WCAG22/

## 10. RTL / LTR Assembly

The prototype must support two deterministic presentation modes:

- Persian — RTL;
- English — LTR.

Direction must affect presentation without changing semantic order.

Mixed-direction fixtures must include:

- names;
- dates;
- times;
- currency;
- numeric values;
- identifiers;
- timestamps;
- evidence sources;
- comparison values.

## 11. Accessibility Assembly Contract

The prototype must provide an executable test path for:

- keyboard-only navigation;
- visible focus;
- logical focus order;
- focus return after modal/overlay dismissal;
- focus not obscured by sticky UI;
- predictable context changes;
- accessible names for controls;
- meaningful status changes;
- error perception;
- confirmation perception.

WCAG 2.2 defines keyboard operation, focus order, visible focus, focus-not-obscured, and status-message requirements as testable accessibility criteria. citehttps://www.w3.org/TR/WCAG22/

## 12. State Announcement Contract

Every consequential state change must have a defined perception path.

```text
STATE CHANGE
→ VISUAL PERCEPTION
→ FOCUS CONTINUITY
→ STATUS PERCEPTION
→ USER CONTINUATION
```

Not every change requires an interruptive announcement. The prototype must deliberately distinguish:

- inline state update;
- non-interruptive status;
- focused feedback;
- modal confirmation;
- error feedback.

## 13. Context Stack Contract

Every deep interaction must preserve:

```text
WHERE AM I?
WHY AM I HERE?
WHAT OBJECT AM I ACTING ON?
WHAT CAN I DO NEXT?
HOW DO I RETURN?
```

Context stack examples:

```text
Home
→ Goal
→ Evidence

Today
→ Action
→ Proposal
→ Result

Understand
→ Understanding
→ Correction
→ Updated Understanding
```

Back navigation returns to semantic context, not merely browser history.

## 14. Prototype Instrumentation Boundary

No production analytics are permitted.

Internal validation may record only the minimum structured observation data required by the User Validation Prototype Specification:

- scenario;
- screen/state;
- action;
- transition;
- completion state;
- error state;
- focus/state-perception checkpoint;
- observer note.

This instrumentation is validation-only and must not become a production analytics contract.

## 15. Internal Prototype Check

Before any participant sees the prototype, the prototype must pass an internal structural check.

### Gate A — Navigation

- all 16 surfaces reachable;
- no dead-end core journey;
- context-preserving Back works;
- Search preserves context.

### Gate B — State

- every required state can be reproduced;
- proposal lifecycle is deterministic;
- correction lifecycle is deterministic;
- recovery lifecycle is deterministic;
- decision/action distinction is visible.

### Gate C — Epistemic Clarity

- Evidence ≠ Interpretation;
- Suggestion ≠ Decision;
- Stale ≠ False;
- Contradiction ≠ Automatic Resolution;
- Correction ≠ Automatic Downstream Rewrite.

### Gate D — Responsive

- desktop;
- tablet;
- mobile;
- no semantic loss under compression.

### Gate E — Accessibility

- keyboard journey;
- visible focus;
- focus return;
- focus not obscured;
- consequential state perception.

### Gate F — RTL/LTR

- full J01 journey in Persian;
- full J01 journey in English;
- at least one dense mixed-direction scenario.

## 16. Pilot Readiness Gate

The prototype is ready for a controlled pilot only when:

1. no P0 structural issue exists;
2. no unresolved P1 from previous structural validation remains unexplained;
3. all J01–J08 can be executed deterministically;
4. E01–E05 can be reproduced;
5. recovery state is observable;
6. accessibility checkpoints are executable;
7. RTL/LTR checks are executable;
8. observation records can be completed without changing the design during the session;
9. task wording has been separated from UI instructions;
10. prototype reset to baseline is reliable.

## 17. Visual Polish Boundary

The following remain deliberately non-final until structural validation demonstrates that the semantics work:

- final font selection;
- pixel-perfect spacing;
- final component dimensions;
- decorative illustration;
- final motion curves;
- production micro-interactions;
- final marketing visual language.

Visual refinement may proceed after semantic validation, not instead of it.

## 18. Governance

This document does not authorize production implementation.

A separate Founder-controlled authorization is required before any executable prototype is actually assembled in a product repository or development environment.

Any finding that changes:

- Experience Architecture;
- IA;
- Interaction Architecture;
- epistemic model;
- domain authority;
- navigation model;
- state lifecycle;
- accessibility contract;
- responsive semantic contract;

must be recorded and, where material, explicitly approved by the Founder before becoming canonical.

## 19. Definition of Done

This specification is complete when:

- prototype runtime boundary is explicit;
- deterministic state model is explicit;
- lifecycle state machines are explicit;
- all 16 surfaces have state requirements;
- J01–J08 are mapped to executable screen sequences;
- fixtures are defined;
- responsive requirements are defined;
- RTL/LTR requirements are defined;
- accessibility requirements are executable;
- state-perception contract is explicit;
- internal prototype gates are defined;
- pilot readiness is defined;
- production implementation remains explicitly unauthorized.

## 20. Stage Status

**EXECUTABLE PROTOTYPE ASSEMBLY SPECIFICATION V1 COMPLETE — READY FOR SEPARATE PROTOTYPE ASSEMBLY AUTHORIZATION — PRODUCTION IMPLEMENTATION NOT AUTHORIZED**
