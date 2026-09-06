# DECIVEXA Prototype V1 — Refinement Pass 02 Interaction Contracts V1

**Status:** DESIGN CANONICAL — REFINEMENT PASS 02 — IMPLEMENTATION NOT AUTHORIZED  
**Owner:** Parsa Kiamanesh — Founder, Originator & Owner of DECIVEXA  
**Parent Prototype:** `docs/architecture/DECIVEXA_PROTOTYPE_V1_STRUCTURAL_INTERACTION_BLUEPRINT.md`  
**Previous Contracts:** `docs/architecture/DECIVEXA_PROTOTYPE_V1_INTERACTION_CONTRACTS_V1.md`  
**Validation Record:** `docs/architecture/DECIVEXA_PROTOTYPE_V1_REVALIDATION_PASS_02_FINDINGS_V1.md`

## 0. Purpose

This document converts the remaining Re-Validation Pass 02 findings into explicit, testable design contracts before Re-Validation Pass 03.

This is a refinement of experience behavior only. It does **not** authorize production UI, application code, schema/API changes, infrastructure changes, AI activation, provider selection, or autonomous behavior.

The governing lifecycle remains:

```text
Finding
→ Contract
→ Prototype Representation
→ Re-Validation
→ Evidence
→ Controlled Decision
```

---

# 1. RC-01 — Proposal Lifecycle Contract

**Addresses:** RV2-001

A proposal has a lifecycle distinct from the resulting domain state.

```text
PROPOSED
→ ACCEPTED / MODIFIED / REJECTED
→ APPLICATION RESULT
→ CURRENT DOMAIN STATE
```

## Required semantics

### Proposed
The system recommends a change. Nothing has changed in the governed domain state merely because the proposal is visible.

### Accepted
The human has explicitly accepted the proposal. Acceptance is a human decision, not proof that the domain state has already changed.

### Modified
The human has changed the proposal before accepting it. The modified proposal becomes the object of acceptance.

### Rejected
The human has declined the proposal. The proposal is no longer pending.

### Applied
The governed domain state has successfully changed.

### Application failed / incomplete
The acceptance decision remains historically true, but the domain state did not successfully reach the intended result. The interface must show the actual application outcome.

## Non-negotiable invariant

```text
ACCEPTED ≠ APPLIED
```

## Resurfacing rule

A rejected or completed proposal must not reappear as pending unless a new evidence/context condition creates a materially new proposal.

---

# 2. RC-02 — Correction Consequence Contract

**Addresses:** RV2-003

Correction review must distinguish three levels of downstream effect:

```text
ESTABLISHED EFFECT
POTENTIAL RE-EVALUATION
NO KNOWN DOWNSTREAM EFFECT
```

### Established effect
The domain rules already establish that the correction changes a known representation or dependent state.

### Potential re-evaluation
The correction may cause related understanding, planning, or recommendations to be reconsidered, but the final result is not predetermined.

### No known downstream effect
No material dependent change is currently identified.

## Prohibited pattern

Never present a possible re-evaluation as a guaranteed chain reaction.

## User-facing rule

“What may change” must answer:

> What should I expect DECIVEXA to reconsider?

not:

> What will definitely happen everywhere in the system?

---

# 3. RC-03 — Decision-to-Action Commitment Contract

**Addresses:** RV2-004

Decision and execution remain distinct state domains.

```text
DECISION
→ RELATED ACTION PROPOSAL
→ ACTION ACCEPTED / CREATED
→ ACTION COMMITTED
→ ACTION EXECUTED
```

A committed decision does not automatically mean every related action is committed.

## Required display distinction

The interface must distinguish:

- Decision committed
- Action proposed
- Action accepted/created
- Action committed
- Action completed

## Consequence rule

If the domain intentionally creates an action as a direct consequence of a decision, that transition must still be explicit and understandable to the human.

---

# 4. RC-04 — Dynamic State Perception Contract

**Addresses:** RV2-011

A consequential interaction has two accessibility obligations:

```text
FOCUS CONTINUITY
+
STATE CHANGE PERCEPTION
```

After an interaction such as confirmation, correction, adaptation, save, error recovery, or dismissal:

1. focus must return to a logical continuation point;
2. the resulting state must be perceivable without requiring visual rediscovery;
3. the user must be able to determine what happened and what is now available.

WCAG 2.2 includes requirements around focus visibility and predictable interaction, while status-message semantics support communicating dynamic updates to assistive technologies. citeturn0search2turn0search6

## Design requirement

The prototype must specify, for each consequential interaction:

```text
Invoking control
→ Focus destination
→ State transition
→ Perceivable result
→ Continuation point
```

---

# 5. RC-05 — Evidence Provenance Consistency Contract

**Addresses:** RV2-002

The minimum evidence presentation must be stable.

## Required minimum

When the information exists and is meaningful:

```text
WHAT
WHEN
SOURCE / ORIGIN
CONTEXT
CURRENT STATUS
RELEVANCE
```

If a field is unavailable, the UI must not invent it. If a field is genuinely irrelevant, it may be omitted according to the evidence presentation rule.

## Rule

Two evidence items of the same meaningful type should not expose materially different provenance structures merely because they originate from different UI entry points.

Deep technical provenance remains progressive disclosure.

---

# 6. RC-06 — Epistemic Language Simplification Contract

**Addresses:** RV2-006 and RV2-012

The eight epistemic states remain canonical semantic controls:

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

But they are **not a user-facing vocabulary requirement**.

## Rule

The interface should normally communicate meaning through:

- plain language,
- context,
- provenance,
- temporal cues,
- consequences,
- available actions.

The underlying epistemic state may be exposed when it materially improves understanding.

## Design test

A user should be able to understand the epistemic distinction without memorizing the eight-state taxonomy.

---

# 7. RC-07 — Consequentiality Confirmation Contract

**Addresses:** RV2-007 and RV2-014

Human control must not become confirmation fatigue.

Confirmation is required when an interaction crosses a meaningful boundary such as:

- changing a governed understanding,
- committing a decision,
- changing a plan materially,
- creating a meaningful commitment,
- applying a consequential system proposal,
- performing an irreversible or difficult-to-reverse operation.

Confirmation is not required merely because a system suggestion exists.

## Decision rule

```text
LOW CONSEQUENCE
→ INFORM / SUGGEST

MEANINGFUL CONSEQUENCE
→ REVIEW / CONFIRM

IRREVERSIBLE OR HIGH-RISK CONSEQUENCE
→ EXPLICIT CONFIRMATION + CONSEQUENCE PREVIEW
```

The exact threshold remains capability-specific and must not be generalized into one universal autonomy rule.

---

# 8. RC-08 — Contradiction Continuation Contract

**Addresses:** RV2-003 / RV2-008 class of unresolved uncertainty

When evidence conflicts, the system must permit continued operation without manufacturing certainty.

Available states may include:

```text
UNDER REVIEW
UNRESOLVED
REVALIDATION NEEDED
CONFIRMED INTERPRETATION
```

## Rule

“Leave unresolved” is a valid epistemic outcome, not a user failure.

The system should explain what remains uncertain and what, if anything, is blocked by the uncertainty.

The user must not be forced to select a winner simply to clear a notification.

---

# 9. RC-09 — Staleness Propagation Contract

**Addresses:** RV2-008

Staleness is not isolated to the original understanding.

If a downstream experience materially depends on stale information, the downstream surface must be capable of communicating that dependency.

Example:

```text
STALE UNDERSTANDING
↓
PLAN DEPENDS ON IT
↓
PLAN MAY NEED REVALIDATION
```

## Rule

The system must not silently present downstream recommendations as fully current when a material dependency is known to be stale.

## Important distinction

```text
STALE INPUT
≠
INVALID OUTPUT
```

It means the output may warrant revalidation, not that it is automatically wrong.

---

# 10. RC-10 — Mobile Semantic Compression Contract

**Addresses:** RV2-009

When vertical space is constrained, semantic priority is:

```text
IDENTITY
↓
STATUS
↓
WHY IT MATTERS
↓
PRIMARY ACTION
↓
DEEP PROVENANCE
```

Secondary metadata may collapse before epistemic meaning is removed.

## Rule

A mobile user must not lose the ability to answer:

- What is this?
- What is its current state?
- Why does it matter here?
- What can I do now?

---

# 11. RC-11 — Mixed-Direction Metadata Contract

**Addresses:** RV2-010

RTL/LTR correctness includes semantic reading order and mixed-direction data handling.

The prototype must explicitly test:

- Persian text containing English identifiers;
- English text containing Persian names;
- dates;
- numbers;
- currency values;
- timestamps;
- IDs and codes;
- evidence source metadata;
- decision comparison values.

## Rule

Directionality must be assigned according to semantic content, not assumed from the page's primary language.

The conceptual sequence must remain stable across Persian RTL and English LTR:

```text
CURRENT
→ PROPOSED
→ CONSEQUENCE
→ CONFIRM
```

---

# 12. RC-12 — Partial Preservation Continuity Contract

**Addresses:** RV2-005

Partial preservation states must survive navigation and retry without semantic drift.

Example:

```text
SAVE ATTEMPT
↓
SAVED LOCALLY / NOT SYNCED
↓
LEAVE SURFACE
↓
RETURN
↓
STATE STILL DISCLOSED
↓
SYNC / RETRY / REVIEW
```

## Rule

A preservation claim remains valid only while the system can still establish it.

The UI must never convert “saved locally but not synced” into “saved” merely because the user navigated away.

---

# 13. RC-13 — Explanation Layering Contract

**Addresses:** RV2-013

Four explanations answer different questions:

| Explanation | Question |
|---|---|
| Why Now | Why was this surfaced now? |
| Why Believed | Why does DECIVEXA currently understand this this way? |
| What Changed | What changed from the previous state? |
| What May Change | What may be reconsidered if I accept this? |

They must not all appear simultaneously unless the context genuinely requires them.

## Rule

Progressive disclosure prevents semantic duplication and preserves cognitive economy.

---

# 14. RC-14 — Proposal Disposition Contract

**Addresses:** RV2-015

Every proposal must have a disposition:

```text
PENDING
ACCEPTED
MODIFIED
REJECTED
APPLIED
FAILED / INCOMPLETE
SUPERSEDED
```

A rejected or superseded proposal may resurface only when a new material condition justifies a new proposal instance.

A new proposal must not visually masquerade as the old proposal continuing indefinitely.

---

# 15. Cross-Contract Invariants — Refinement Pass 02

The following invariants remain mandatory:

### Authority
```text
SYSTEM MAY PROPOSE
HUMAN MAY ACCEPT / MODIFY / REJECT
DOMAIN STATE CHANGES ONLY THROUGH GOVERNED TRANSITION
```

### Epistemic boundary
```text
EVIDENCE
≠
INTERPRETATION
≠
SUGGESTION
≠
DECISION
```

### Lifecycle boundary
```text
PROPOSED
≠
ACCEPTED
≠
APPLIED
```

### Temporal boundary
```text
STALE
≠
FALSE
```

### Uncertainty boundary
```text
UNRESOLVED
IS A VALID STATE
```

### Accessibility boundary
```text
FOCUS RETURN
+
STATE PERCEPTION
=
CONSEQUENTIAL ACCESSIBILITY CONTINUITY
```

---

# 16. Re-Validation Pass 03 Matrix

| Test | Contracts |
|---|---|
| J02 Outcome | RC-02, RC-05 |
| J03 Adaptation | RC-01, RC-07, RC-14 |
| J04 Evidence | RC-05, RC-06, RC-09 |
| J05 Correction | RC-02, RC-06, RC-07 |
| J06 Decision | RC-03, RC-07 |
| J08 Error/Recovery | RC-04, RC-12 |
| E01 Evidence/Inference | RC-05, RC-06 |
| E02 Suggestion/Decision | RC-01, RC-03, RC-07 |
| E03 Contradiction | RC-06, RC-08 |
| E04 Outdated | RC-08, RC-09 |
| E05 Correction | RC-02, RC-06 |
| Mobile | RC-06, RC-10 |
| RTL/LTR | RC-11 |
| Keyboard/AT | RC-04 |
| Proposal lifecycle | RC-01, RC-14 |
| Confirmation threshold | RC-07 |
| Explanation layering | RC-13 |

---

# 17. Refinement Exit Criteria

Refinement Pass 02 is complete when:

- [x] Every identified P1 risk has an explicit contract.
- [x] Evidence provenance has a stable minimum.
- [x] Proposal lifecycle is explicit.
- [x] Decision-to-action commitment boundary is explicit.
- [x] Correction consequences distinguish established effects from possible re-evaluation.
- [x] Dynamic state perception is included in accessibility behavior.
- [x] Confirmation has a consequentiality threshold.
- [x] Staleness propagation is defined.
- [x] Mobile semantic compression priority is defined.
- [x] Mixed-direction metadata is explicitly covered.
- [x] Partial preservation continuity is defined.
- [x] Epistemic taxonomy remains an internal semantic control rather than mandatory user vocabulary.
- [x] Explanation duplication is governed.
- [x] Proposal resurfacing has explicit lifecycle rules.

This is a **design refinement completion criterion**, not an implementation gate.

---

# 18. Next Controlled Stage

The next stage is:

**RE-VALIDATION PASS 03**

It must test the revised contracts against the structural prototype and attempt to falsify them rather than merely confirm them.

Priority order:

1. Proposal lifecycle and application boundary.
2. Decision-to-action commitment boundary.
3. Correction consequences.
4. Dynamic accessibility state perception.
5. Evidence provenance consistency.
6. Staleness propagation.
7. Mobile semantic compression.
8. RTL/LTR mixed-direction metadata.
9. Confirmation threshold.
10. Proposal resurfacing.
11. Explanation layering.

No implementation should begin merely because this refinement is complete.

---

# 19. Governance

This document records design decisions only.

It does not authorize:

- production implementation,
- application code,
- schema/API changes,
- infrastructure changes,
- AI runtime activation,
- provider selection,
- autonomous actions.

If Re-Validation Pass 03 produces evidence that an existing canonical architectural decision must change, the Founder governance chain remains mandatory:

```text
Existing Decision
→ Evidence
→ Reconsideration Reason
→ Proposed Change
→ Impact Analysis
→ Founder Approval
→ Canonical Update
```

**Stage status:** `REFINEMENT PASS 02 COMPLETE — READY FOR RE-VALIDATION PASS 03 — IMPLEMENTATION NOT AUTHORIZED`
