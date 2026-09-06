# DECIVEXA Prototype V1 — Interaction Contracts V1

**Status:** DESIGN CANONICAL — STRUCTURAL REFINEMENT — IMPLEMENTATION NOT AUTHORIZED  
**Owner:** Parsa Kiamanesh — Founder, Originator & Owner of DECIVEXA  
**Parent:** `docs/architecture/DECIVEXA_PROTOTYPE_V1_STRUCTURAL_INTERACTION_BLUEPRINT.md`  
**Validation Record:** `docs/architecture/DECIVEXA_STRUCTURAL_PROTOTYPE_WALKTHROUGH_FINDINGS_V1.md`  
**Purpose:** Convert the first structural walkthrough findings into explicit, testable interaction contracts before the next prototype validation pass.

---

# 0. Governing Principle

An interaction contract defines what a human must be able to understand, what the system may communicate, what remains proposed versus applied, and what control the human retains.

These contracts refine the existing experience architecture. They do not replace it.

They authorize design clarification only. They do not authorize production UI, code, schema/API, infrastructure, AI activation, or autonomous behavior.

The governing lifecycle remains:

```text
Current Design
→ Finding
→ Interaction Contract
→ Prototype Revision
→ Re-validation
→ Evidence
→ Controlled Decision
```

---

# 1. Contract Model

Every consequential interaction should be expressible as:

```text
INTENT
→ CONTEXT
→ CURRENT STATE
→ PROPOSED / AVAILABLE ACTION
→ CONSEQUENCE
→ HUMAN CONTROL
→ RESULTING STATE
→ CONTINUITY
```

If one of these is materially absent, the interaction requires additional scrutiny.

---

# 2. IC-01 — Home Priority Contract

**Addresses:** SWF-001

## Purpose

Home must answer "What matters now?" without presenting several competing primary answers.

## Priority hierarchy

```text
PRIMARY FOCUS
↓
ATTENTION
↓
NEXT
↓
MEANINGFUL CHANGE
↓
SUPPORTING CONTEXT
```

### Primary Focus
Exactly one dominant orientation may occupy the primary position at a given moment unless the human has multiple equally consequential unresolved situations. In that case, the system must explicitly frame the plurality rather than visually pretending one is primary.

### Attention
Items that require consideration but are not necessarily the next action.

### Next
The most relevant immediate continuation after orientation, not a generic task list.

### Meaningful Change
Explains what changed and why the current orientation differs from the previous state.

### Validation condition
A new user should be able to answer:

1. What matters most right now?
2. What needs my attention?
3. What can I do next?

without being taught the section hierarchy.

---

# 3. IC-02 — Contextual Why-Now Contract

**Addresses:** SWF-002

When an item is surfaced because of current context, the system may expose a concise explanation:

```text
WHY THIS IS HERE NOW
```

The explanation may reference:

- a recent change,
- a relevant commitment,
- a current constraint,
- a goal state,
- evidence,
- timing,
- capacity,
- or another established contextual reason.

It must not fabricate causal certainty.

### Disclosure levels

```text
Short reason
→ optional deeper explanation
→ evidence / history on demand
```

### Prohibited pattern

A long AI-generated explanation must not replace concise orientation.

### Validation condition

The human can explain why the system surfaced the item now, or explicitly say that the reason is unclear.

---

# 4. IC-03 — Outcome Continuation Contract

**Addresses:** SWF-003

Action outcome remains:

```text
YES
PARTIALLY
NO
```

The semantic meaning is:

### YES
The intended outcome was achieved to the degree defined by the action.

Next state may continue, close, or surface the next meaningful action.

### PARTIALLY
Some intended outcome was achieved, but a meaningful remainder exists.

The system may ask for the remaining gap only when useful.

### NO
The intended outcome was not achieved.

The system may ask for the reason/blocker when this information can meaningfully affect adaptation or learning.

### Important rule

Recording an outcome must not automatically trigger a long reflection workflow.

The system asks only what is necessary to determine the next useful state.

---

# 5. IC-04 — Adaptation Proposal Contract

**Addresses:** SWF-004

Adaptation must preserve an explicit distinction between:

```text
CURRENT PLAN
≠
SYSTEM PROPOSAL
≠
HUMAN ACCEPTANCE
≠
APPLIED STATE
```

## Required structure

```text
WHAT CHANGED
WHY IT MATTERS
CURRENT PLAN
PROPOSED CHANGE
EXPECTED CONSEQUENCES
WHAT REMAINS UNCHANGED

[Accept]
[Modify]
[Reject / Keep Current]
```

### State rule

Before acceptance, the proposal is not the new plan.

After acceptance but before successful application, the interface must not imply that the domain state has already changed.

After successful application, the resulting state must be distinguishable from the proposal.

### Validation question

> Who decided this change?

The user must be able to distinguish system recommendation from human decision.

---

# 6. IC-05 — Evidence Minimum Provenance Contract

**Addresses:** SWF-005

Every evidence presentation must provide, at minimum, when applicable:

```text
WHAT WAS RECORDED
WHEN
SOURCE / ORIGIN
CONTEXT
STATUS
RELATION TO CURRENT UNDERSTANDING
```

Deep metadata remains progressive disclosure.

### Rule

Evidence presentation must not require the user to trust an unexplained assertion.

### Validation question

> What exactly is this, where did it come from, and why is it relevant here?

---

# 7. IC-06 — Epistemic Display Contract

**Addresses:** SWF-006

DECIVEXA must communicate epistemic status in plain language rather than requiring users to learn internal architecture terminology.

## Canonical conceptual states

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

## User-facing semantic pattern

```text
What happened / was recorded
↓
What DECIVEXA currently understands
↓
Why it currently believes this
↓
What remains uncertain
↓
What the human can change
```

### Rules

- Evidence must not visually read as inference.
- Inference must not visually read as confirmed truth.
- Suggestion must not visually read as decision.
- Confirmation must remain attributable to the human.
- Uncertainty must remain expressible.
- Status must not rely on color alone.

### Prohibited pattern

Do not expose raw internal terms such as `ClaimVersion`, `EvidenceVersion`, or provider/model identifiers as the default user-facing explanation.

---

# 8. IC-07 — Correction Before/After Contract

**Addresses:** SWF-007

Correction is not ordinary editing.

The review sequence is:

```text
CURRENT UNDERSTANDING
↓
WHAT YOU CORRECTED
↓
PROPOSED UPDATED UNDERSTANDING
↓
WHAT MAY CHANGE
↓
CONFIRM / GO BACK
```

### Consequence rule

Only established consequences may be presented as consequences.

Potential or uncertain downstream effects must be labelled as such.

### Confirmation rule

Confirmation must communicate what is being accepted, not merely ask "Are you sure?"

### Post-confirmation

The system must communicate the resulting state and preserve the previous state in history where the underlying domain model requires it.

---

# 9. IC-08 — Contradiction / Outdated Contract

**Addresses:** SWF-008

## Outdated

Meaning:

> This understanding may have been valid before but may no longer represent the current situation.

Available actions may include:

```text
Review Current Evidence
Revalidate
Keep for Now
Correct
```

## Contradicted

Meaning:

> Relevant information currently conflicts.

Available actions may include:

```text
Inspect Conflicting Evidence
Compare Context / Time
Leave Unresolved
Correct
Confirm an interpretation when justified
```

### Critical rule

Contradiction does not automatically produce a winner.

Unresolved uncertainty is a valid state.

---

# 10. IC-09 — Decision Consequence Preview Contract

**Addresses:** SWF-009

Before final commitment:

```text
YOUR DECISION
WHAT IT COMMITS YOU TO
WHAT IT CHANGES
WHAT IT DOES NOT CHANGE
RELATED NEXT ACTIONS
OPEN RISKS / UNCERTAINTIES

[Commit Decision]
[Go Back]
```

### Rules

- The system organizes consequences; it does not claim ownership of the decision.
- Future outcomes must not be presented as guaranteed.
- Related actions may be proposed but must not silently become commitments unless the domain rule explicitly permits and the human understands the transition.

### Validation question

> What did you decide, and what will now be different?

---

# 11. IC-10 — Search Result Context Identity Contract

**Addresses:** SWF-010

Each meaningful result should communicate:

```text
TYPE
TITLE
PARENT / CONTEXT
RELEVANT DATE OR STATE
WHY MATCHED (when useful)
```

Opening a result must preserve:

- result identity,
- original context,
- search continuity,
- meaningful Back behavior.

Search is a utility, not a new context that erases the underlying domain context.

---

# 12. IC-11 — Error Preservation Contract

**Addresses:** SWF-011

Every consequential error must communicate:

```text
WHAT HAPPENED
WHAT WAS PRESERVED
WHAT CAN I DO NOW
```

## Preservation vocabulary

Use only states that the system can actually establish, such as:

```text
Saved successfully
Saved locally but not synced
Nothing was changed
Previous version remains active
Draft remains available
Action was not applied
```

### Prohibited pattern

Never claim broad preservation when only partial preservation is known.

### Recovery rule

The recovery action must return the human to the meaningful task context rather than merely dismissing the error.

---

# 13. IC-12 — Global State Semantic Contract

**Addresses:** SWF-012

Each shared state must have a consistent semantic definition.

| State | Meaning | User may infer | User may not infer |
|---|---|---|---|
| DEFAULT | Normal usable state | Current content is available | Nothing about freshness beyond displayed status |
| LOADING | State is being resolved | System is working | That operation will definitely succeed |
| EMPTY | No applicable content | Nothing currently exists/matches | That the system is broken |
| PARTIAL | Some expected information unavailable | Some context is incomplete | That missing information is irrelevant |
| UPDATED | State changed successfully | A known update occurred | That every related surface is already updated |
| STALE | Information may no longer reflect current reality | Revalidation may be useful | That the information is false |
| ERROR | Requested operation/state failed | The requested transition did not complete | That all prior work was lost |
| SUCCESS | Requested operation completed | The defined operation succeeded | That downstream effects are complete unless stated |
| REVIEW | Human inspection is required | A consequential judgment is pending | That the system has already decided |
| CONFIRMATION | Human acceptance is being requested | A proposal/change is awaiting decision | That the change is already applied |

This contract is global and should not be redefined per page without explicit governance.

---

# 14. IC-13 — Mobile Minimum Semantic Context Contract

**Addresses:** SWF-013

Mobile may compress deep context, but must preserve the minimum semantic header:

```text
WHAT THIS IS
CURRENT STATUS
WHY IT MATTERS
```

Deep provenance, history, and supporting evidence may be expandable.

### Rule

Responsive compression must remove secondary detail before removing epistemic meaning.

### Validation

E01, E03, E04, and J04 must be tested on mobile.

---

# 15. IC-14 — RTL/LTR Semantic Sequence Contract

**Addresses:** SWF-014

RTL/LTR validation must preserve semantic order, not merely mirror geometry.

Critical sequences include:

```text
Current → Proposed → Consequence → Confirm

Evidence → Interpretation → Suggestion

Question → Options → Trade-offs → Judgment → Decision
```

Persian RTL and English LTR must preserve the same conceptual ordering.

Mixed-language numbers, dates, names, identifiers, and metadata require explicit directionality handling.

---

# 16. IC-15 — Accessibility Focus Return Contract

**Addresses:** SWF-015

For consequential surfaces:

```text
Invoke
→ Focus enters surface
→ User completes / cancels
→ Surface closes or transitions
→ Focus returns to logical invoking/continuation point
→ Resulting state is announced or otherwise perceivable
```

Applicable to:

- correction review,
- adaptation proposal,
- decision commitment,
- confirmation,
- error recovery,
- modal/drawer dismissal.

### Rule

Keyboard accessibility is not complete if the user can operate a control but loses task orientation afterward.

This contract complements WCAG 2.2 requirements around keyboard operation, visible focus, predictable interaction, and accessible authentication/interaction patterns.

---

# 17. Cross-Contract Invariant — Proposal / Applied Boundary

This invariant applies across DECIVEXA:

```text
PROPOSED
≠
ACCEPTED
≠
APPLIED
```

A UI state must never visually collapse these states into one.

This applies to:

- adaptations,
- recommendations,
- corrections,
- decision consequences,
- planning changes,
- future governed AI proposals.

---

# 18. Cross-Contract Invariant — Evidence / Understanding Boundary

```text
EVIDENCE
≠
INTERPRETATION
≠
DECISION
```

Evidence can support an interpretation.

An interpretation can inform a recommendation.

A recommendation can inform a human decision.

No layer silently inherits the epistemic authority of the layer below it.

---

# 19. Cross-Contract Invariant — Stale / Wrong Boundary

```text
STALE
≠
FALSE
```

Staleness means the system has reason to question current applicability.

It does not establish falsity.

This distinction is especially important for Human Understanding, Goals, Plans, Recommendations, and Context.

---

# 20. Cross-Contract Invariant — Correction Authority

The system may propose an updated understanding.

The human remains the authority to correct their own representation where the governed experience requires human confirmation.

The interface must therefore preserve:

```text
System understanding
→ Human challenge
→ Proposed correction
→ Human confirmation
→ Updated understanding
```

---

# 21. Prototype Re-validation Matrix

After these contracts are represented in the prototype, re-run:

| Test | Required contract |
|---|---|
| J01 | IC-01, IC-02 |
| J02 | IC-03 |
| J03 | IC-04 |
| J04 | IC-05, IC-06, IC-13 |
| J05 | IC-07 |
| J06 | IC-09 |
| J07 | IC-10 |
| J08 | IC-11, IC-12 |
| E01 | IC-05, IC-06, IC-13 |
| E02 | IC-04, IC-09 |
| E03 | IC-08, IC-06 |
| E04 | IC-08, IC-12 |
| E05 | IC-07 |
| Keyboard | IC-15 |
| RTL/LTR | IC-14 |
| Responsive | IC-13, IC-14 |

---

# 22. Exit Criteria for Refinement Pass

The refinement pass may proceed to re-validation when:

1. All 15 contracts are represented in the structural prototype specification.
2. Proposal / accepted / applied states are explicitly distinguishable.
3. Evidence / interpretation / decision boundaries are explicit.
4. Correction has an explicit before/after review.
5. Contradiction and outdated states have actionable but non-forcing paths.
6. Error preservation semantics are state-specific.
7. Shared states have consistent meaning.
8. Mobile preserves minimum epistemic context.
9. RTL/LTR preserves semantic sequence.
10. Consequential keyboard flows define focus entry and return.

This is a **design exit criterion**, not an implementation gate.

---

# 23. Governance

These contracts refine the current canonical design in response to validation findings.

They do not authorize:

- production implementation,
- repository application code,
- schema/API changes,
- infrastructure changes,
- AI runtime activation,
- provider selection,
- autonomous actions.

If re-validation produces evidence that a canonical architectural decision itself should change, the required governance chain remains:

```text
Previous Decision
→ Evidence
→ Reason for Reconsideration
→ Proposed New Decision
→ Impact
→ Founder Approval
→ Canonical Update
```

---

# 24. Definition of Done

- [x] 15 walkthrough findings translated into explicit interaction contracts
- [x] Home hierarchy clarified
- [x] Why-now semantics defined
- [x] Outcome continuation defined
- [x] Adaptation proposal boundary defined
- [x] Evidence provenance minimum defined
- [x] Epistemic display contract defined
- [x] Correction before/after contract defined
- [x] Contradiction/outdated behavior defined
- [x] Decision consequence preview defined
- [x] Search context identity defined
- [x] Error preservation contract defined
- [x] Shared state semantics defined
- [x] Mobile semantic minimum defined
- [x] RTL/LTR semantic sequence defined
- [x] Accessibility focus-return contract defined
- [x] Cross-cutting invariants defined
- [x] Re-validation matrix defined
- [x] Implementation remains explicitly unauthorized

**Stage Status:** STRUCTURAL REFINEMENT PASS 01 COMPLETE — READY FOR RE-VALIDATION — IMPLEMENTATION NOT AUTHORIZED.
