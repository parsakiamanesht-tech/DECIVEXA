# DECIVEXA User-Validation Prototype Specification V1

**Status:** DESIGN CANONICAL — USER-VALIDATION PROTOTYPE PREPARATION — IMPLEMENTATION NOT AUTHORIZED  
**Owner:** Parsa Kiamanesh — Founder, Originator & Owner of DECIVEXA  
**Parent:** `DECIVEXA_PROTOTYPE_V1_STRUCTURAL_INTERACTION_BLUEPRINT.md`  
**Validation Plan:** `DECIVEXA_STRUCTURAL_PROTOTYPE_VALIDATION_EXECUTION_PLAN_V1.md`  
**Pass 03:** `DECIVEXA_PROTOTYPE_V1_REVALIDATION_PASS_03_FINDINGS_V1.md`

## 0. Purpose

This document defines the controlled prototype representation required before real user-validation of DECIVEXA Prototype V1.

It is deliberately narrower than a production UI specification. Its purpose is to make the remaining structural uncertainties observable through realistic user interaction while preserving the canonical Experience Architecture, Interaction Contracts, epistemic boundaries, accessibility requirements, and Founder governance.

Human-centred design standards emphasize explicit understanding of users, user involvement, evaluation-driven refinement, whole-experience consideration, and iteration. ISO 9241-210:2019 explicitly describes user-centred evaluation as a source of feedback for progressively refined solutions and treats iteration as a means of reducing uncertainty. citeturn1search3turn1search5

### This document does NOT authorize

- production UI implementation;
- production application code;
- schema/API changes;
- infrastructure changes;
- AI Runtime activation;
- provider selection;
- autonomous actions;
- analytics instrumentation in production;
- release or deployment.

The prototype is a validation instrument, not the product implementation.

---

# 1. Validation Objective

The prototype must answer one primary question:

> **Can a realistic user understand what DECIVEXA is showing, why it is showing it, what authority the user has, what will happen next, and what state actually resulted?**

Secondary questions:

1. Can users maintain context while moving across experiences?
2. Can users distinguish evidence from interpretation and suggestion?
3. Can users recognize when something is stale or unresolved without interpreting it as false?
4. Can users understand proposals without confusing acceptance with application?
5. Can users distinguish a committed decision from a committed action?
6. Can users recover from errors without losing trust or semantic continuity?
7. Can users operate the core journeys on mobile without losing essential meaning?
8. Can users navigate Persian RTL and English LTR mixed-direction content without semantic confusion?
9. Can keyboard and assistive-technology users perceive consequential state changes?

---

# 2. Prototype Fidelity Boundary

The prototype must be high enough fidelity to validate:

- information hierarchy;
- navigation;
- context preservation;
- interaction transitions;
- state semantics;
- epistemic distinctions;
- proposal lifecycle;
- consequence communication;
- error/recovery behavior;
- mobile compression;
- RTL/LTR behavior;
- accessibility interaction behavior.

The prototype does NOT need production-level:

- backend persistence;
- real authentication;
- real AI calls;
- real provider integration;
- production database;
- real-time synchronization;
- production analytics;
- final micro-animation;
- final visual polish.

### Fidelity principle

```text
VALIDATE MEANING BEFORE POLISH
```

A visually impressive prototype that hides semantic failures is considered unsuccessful.

---

# 3. Canonical Prototype Surfaces

The validation prototype must represent the following surfaces:

1. Home
2. Today
3. Goals
4. Goal Detail
5. Action Context
6. Evidence Detail
7. Understand
8. Understanding Detail
9. Correction Review
10. Decisions
11. Decision Detail
12. Proposal Review
13. Confirmation / Consequence Preview
14. Error / Recovery
15. Search Results
16. Contextual Search Result Detail

### Required global elements

- Primary navigation;
- global Search;
- contextual header where required;
- context-preserving Back;
- primary action behavior;
- state communication;
- responsive behavior;
- RTL/LTR directionality.

---

# 4. Canonical Prototype Data States

The prototype must use controlled fictional data rather than production personal data.

The dataset must contain enough variation to exercise the architecture.

### Required semantic objects

- one active Goal;
- one Goal with an unresolved dependency;
- one Today Action;
- one blocked Action;
- at least three Evidence items;
- one inferred Understanding;
- one confirmed Understanding;
- one stale Understanding;
- one contradiction;
- one active Decision;
- at least three Decision Options;
- one proposed adaptation;
- one accepted-but-not-applied proposal;
- one failed/incomplete application;
- one rejected proposal;
- one superseded proposal;
- one related but uncommitted Action;
- one partially preserved unsynced state.

No data state may imply real user facts.

---

# 5. Canonical User Journeys

## J01 — Orientation → Goal

### Scenario
The participant wants to understand what currently matters and inspect the relevant goal.

### Observe
- first interpretation of Home;
- whether Primary Focus is understood;
- whether “Why now?” is understandable;
- whether Goal context is preserved after entry;
- whether the user knows how to return.

### Pass condition
The participant can explain, without facilitator correction:

- what currently matters;
- why it matters now;
- what the Goal is;
- how the Goal relates to the current context.

---

## J02 — Today → Action → Outcome

### Scenario
The participant acts on a meaningful item during the day and records what actually happened.

### Observe
- whether the Action is understood as an execution unit rather than an isolated task;
- whether intended outcome is understood;
- whether completion and outcome are distinguished;
- whether follow-up burden feels proportionate.

### Pass condition
The participant can complete the action and correctly interpret the resulting outcome state.

---

## J03 — Today → Blocked → Adapt

### Scenario
The participant cannot continue with the planned action because reality changed.

### Required states

```text
CURRENT PLAN
→ BLOCKED
→ ADAPTATION PROPOSAL
→ REVIEW
→ ACCEPT / MODIFY / REJECT
→ APPLICATION RESULT
```

### Observe
- whether the participant understands that adaptation is a proposal;
- whether acceptance is confused with application;
- whether consequence is understood;
- whether failure is recoverable.

### Pass condition
The participant can correctly describe what changed, what DECIVEXA proposed, what they accepted, and what actually happened afterward.

---

## J04 — Goal → Evidence

### Scenario
The participant wants to understand why a Goal-related interpretation is present.

### Required evidence fields

Where meaningful:

```text
WHAT
WHEN
SOURCE / ORIGIN
CONTEXT
CURRENT STATUS
RELEVANCE
```

### Observe
- provenance comprehension;
- evidence vs interpretation distinction;
- consistency across Goal, Search, and Evidence Detail;
- whether deeper provenance can be found without cluttering the primary surface.

### Pass condition
The participant can answer:

> “What is this based on, and how do I know what kind of information this is?”

without facilitator explanation.

---

## J05 — Understand → Correct

### Scenario
The participant notices that DECIVEXA's current understanding is inaccurate.

### Required flow

```text
CURRENT UNDERSTANDING
→ WHAT IS INACCURATE?
→ USER CORRECTION
→ WHAT MAY CHANGE?
→ REVIEW
→ CONFIRM
→ UPDATED UNDERSTANDING
```

### Observe
- whether the participant feels authorized to correct the system;
- whether correction differs from ordinary editing;
- whether downstream consequences are understood as established vs potential;
- whether the user can leave something unresolved.

### Pass condition
The participant can correct the understanding without believing that every downstream state will automatically change.

---

## J06 — Decision → Compare → Commit

### Scenario
The participant must choose among multiple options for a meaningful decision.

### Required distinction

```text
OPTIONS
→ COMPARISON
→ HUMAN JUDGMENT
→ DECISION COMMITTED
→ RELATED ACTIONS
```

### Observe
- whether comparison is understood without universal scoring;
- whether trade-offs are comprehensible;
- whether the user retains judgment authority;
- whether related actions are mistaken for commitments.

### Pass condition
The participant can state the decision and separately identify which related actions are merely proposed versus committed.

---

## J07 — Search → Context

### Scenario
The participant remembers something but does not know where it lives.

### Observe
- search result identity;
- contextual meaning;
- domain recognition;
- continuity after opening result;
- return path.

### Pass condition
The participant can determine what the result is, why it matters, where it belongs, and continue from that context.

---

## J08 — Error → Recovery

### Scenario
An important save/sync operation fails partially.

### Required state

```text
SAVE ATTEMPT
→ PARTIALLY PRESERVED
→ NOT SYNCED
→ LEAVE
→ RETURN
→ STATE DISCLOSED
→ RETRY / REVIEW
```

### Observe
- whether the user understands what was preserved;
- whether they understand what was not preserved;
- whether they trust the recovery path;
- whether navigation causes semantic drift.

### Pass condition
The participant never has to guess whether their information survived.

---

# 6. Epistemic Stress Scenarios

The prototype must include five explicit stress scenarios.

## E01 — Evidence vs Inference

Participant sees a statement derived from evidence.

Test:

> Can the participant tell what was directly recorded versus what DECIVEXA inferred?

## E02 — Suggestion vs Decision

Participant receives a recommendation.

Test:

> Does the participant understand that nothing has changed merely because the suggestion appeared?

## E03 — Contradiction

Two pieces of information conflict.

Test:

> Can the participant continue without being forced to choose a winner?

## E04 — Outdated Understanding

An understanding is stale.

Test:

> Does the participant interpret stale as “needs revalidation” rather than “false”?

## E05 — Correction

Participant corrects an understanding.

Test:

> Can the participant understand what changes are established and what may merely be reconsidered?

---

# 7. Accessibility Validation Scenarios

WCAG 2.2 requires keyboard operability, meaningful focus order, visible focus, focus not being obscured, and programmatically perceivable status changes. citeturn0search0turn0search3

The prototype must therefore validate at minimum:

### A01 — Keyboard navigation

- complete core journey without pointer;
- logical focus order;
- visible focus;
- no focus trap except intentional modal containment;
- Escape behavior where applicable;
- primary action reachable without excessive traversal.

### A02 — Confirmation

After confirmation:

```text
Invoking Control
→ Focus Destination
→ State Change
→ Status Perception
→ Continuation
```

### A03 — Error

The user must perceive:

- what failed;
- what was preserved;
- what can be done next.

### A04 — Dynamic updates

The prototype must distinguish when a change should be:

- visible inline;
- announced as a status;
- associated with a focused element;
- presented in a dialog;
- treated as an error.

### A05 — Mobile focus

Focused controls must remain visible and usable when mobile overlays, sticky elements, or keyboard behavior are present.

---

# 8. RTL / LTR Validation

At least one full journey must be executed in Persian RTL and English LTR.

### Required mixed-direction data

- Persian sentence + English product name;
- English sentence + Persian proper name;
- date;
- time;
- currency;
- numeric value;
- identifier/code;
- timestamp;
- evidence source;
- decision comparison values.

### Validation rule

The semantic sequence must remain:

```text
CURRENT
→ PROPOSED
→ CONSEQUENCE
→ CONFIRM
```

The visual direction may change; the conceptual order must not.

---

# 9. Mobile Validation

The mobile prototype must validate the semantic compression contract rather than simply shrink desktop screens.

Minimum visible/accessible meaning:

```text
IDENTITY
STATUS
WHY
PRIMARY ACTION
```

Deep provenance remains accessible without competing with the primary interaction.

### Mobile stress cases

1. Dense Evidence Detail.
2. Dense Decision Comparison.
3. Correction Review with consequence information.
4. Error/recovery with preserved state.
5. Proposal review with application result.

### Pass rule

If the only way to fit the content is to remove epistemic meaning, the prototype fails.

The preferred strategy is:

```text
KEEP MEANING
→ REDUCE SIMULTANEITY
→ PRESERVE ACCESS
```

---

# 10. Participant Model

User validation must use realistic target users rather than internal team members whenever possible. Usability-testing guidance recommends representative participants performing realistic activities and warns against facilitator influence. citeturn1search24turn1search4

For an initial qualitative round, a practical target is approximately **5–8 participants per relevant user group**, adjusted to the research question and available user diversity. This is a formative qualitative target, not a statistical population claim. citeturn1search24turn1search7

### Participant dimensions to consider

- comfort with digital products;
- planning/goal-management habits;
- frequency of making consequential decisions;
- familiarity with adaptive/personalized software;
- Persian/English usage;
- desktop/mobile usage;
- accessibility needs where intentionally recruited.

Do not recruit only highly technical users.

---

# 11. Task Scenario Rules

Tasks must be realistic, context-rich, open enough to reveal the user's chosen path, and must not disclose the interface solution. NN/g guidance specifically recommends realistic scenarios and avoiding wording that gives away the intended interaction. citeturn1search0turn1search1

### Prohibited task wording

Do not say:

> “Click Understand and correct the claim.”

Instead say:

> “DECIVEXA currently seems to misunderstand something about your situation. Find out what it currently believes and, if needed, correct it.”

The task defines the desired outcome, not the UI route.

### Pilot requirement

Task wording must be piloted before the main qualitative round. citeturn1search1

---

# 12. Moderation Protocol

The moderator must test the design, not the participant.

### Opening

- explain that the interface is being evaluated;
- explain that there are no right or wrong answers;
- obtain consent where required;
- explain recording/observation;
- establish think-aloud expectations where used.

### During tasks

- present one task at a time;
- avoid teaching the interface;
- avoid confirming whether the participant is “right”;
- avoid leading questions;
- allow silence;
- record first interpretation before helping;
- intervene only when the protocol requires it.

Neutral facilitation and realistic tasks are core usability-testing practices. citeturn1search9turn1search24

### Follow-up questions

Use neutral questions such as:

- “What do you think this means?”
- “What would you expect to happen next?”
- “What makes you say that?”
- “What would you do now?”
- “What, if anything, feels unclear?”

Avoid:

- “Did you notice the button?”
- “Was this explanation clear?”
- “Would you use this feature?” before observing behavior.

---

# 13. Observation Record

Each task observation must capture:

```text
Session ID
Participant Profile
Scenario ID
Initial Intent
First Action
Observed Path
Unexpected Action
Hesitation
Misunderstanding
Recovery Attempt
Facilitator Intervention
Completion State
Participant Explanation
Evidence Strength
Potential Finding
```

### Evidence hierarchy

1. Direct observed behavior.
2. Repeated observed pattern.
3. Participant explanation.
4. Single anomaly.
5. Researcher interpretation.
6. Design hypothesis.

Do not treat researcher interpretation as equivalent to observed behavior.

---

# 14. Finding Model

Every significant finding must use:

```text
Finding ID
→ Observed Behavior
→ Evidence
→ User Mental Model
→ Expected Mental Model
→ Mismatch
→ Impact
→ Severity
→ Root-Cause Hypothesis
→ Proposed Design Response
→ Affected Canonical Decision
→ Founder Approval Required?
```

### Severity

- **P0 — Trust / Control Critical**
- **P1 — Core Journey Critical**
- **P2 — Major Friction / Meaningful Risk**
- **P3 — Minor Friction**
- **P4 — Refinement**

### Evidence strength

- OBSERVED_DIRECTLY
- REPEATED_PATTERN
- SINGLE_ANOMALY
- PARTICIPANT_EXPLANATION
- RESEARCHER_INFERENCE
- DESIGN_HYPOTHESIS

---

# 15. Decision Rules After Validation

A finding may result in:

```text
KEEP
REFINE
RETEST
RECONSIDER
ESCALATE_FOR_FOUNDER_DECISION
```

### Critical governance rule

A user finding does not automatically authorize architecture change.

If evidence challenges a canonical decision:

```text
Finding
→ Evidence
→ Reconsideration Reason
→ Proposed Change
→ Impact Analysis
→ Founder Approval
→ Canonical Update
```

No silent architectural drift.

---

# 16. Quantitative Discipline

This stage is primarily formative and qualitative.

The prototype team may record descriptive observations such as:

- number of participants who completed a task;
- number who required intervention;
- number who misunderstood a state;
- number who recovered independently.

These numbers must not be presented as statistically representative population estimates unless a separate quantitative study is designed.

The purpose of this round is uncertainty reduction, not statistical product benchmarking.

---

# 17. Pass / Fail Criteria

## P0 gate

**Any P0 finding blocks progression.**

Examples:

- user believes a consequential action occurred when it did not;
- user cannot determine whether important information survived an error;
- system appears to act without meaningful user control;
- evidence and inference are presented so similarly that users cannot distinguish them in consequential contexts.

## P1 gate

No unresolved P1 may remain in a core journey.

## P2 gate

P2 findings may remain only when:

- the underlying architecture remains coherent;
- the issue is explicitly documented;
- a refinement path exists;
- no trust/control boundary is compromised.

## Accessibility gate

Core journeys must not contain unresolved accessibility failures that prevent equivalent operation or perception of consequential state.

WCAG 2.2 provides testable success criteria rather than technology-specific implementation instructions, so final conformance must ultimately be verified against the actual implemented technology. citeturn0search0

## User-validation gate

The stage passes when:

- core journey mental models are broadly coherent;
- no unresolved P0 exists;
- no unresolved P1 exists in core journeys;
- epistemic boundaries are understood sufficiently for consequential decisions;
- recovery is trusted;
- mobile does not remove essential meaning;
- RTL/LTR does not change semantic interpretation;
- accessibility behavior is demonstrably usable for the tested scenarios;
- findings are traceable;
- architecture changes, if any, are explicitly governed.

---

# 18. Prototype Exit Criteria

Before user sessions begin:

- [ ] All 16 required surfaces are represented at validation fidelity.
- [ ] All J01–J08 journeys are executable.
- [ ] All E01–E05 stress scenarios are executable.
- [ ] Accepted-but-not-applied proposal state exists.
- [ ] Failed/incomplete application state exists.
- [ ] Stale and contradiction states exist.
- [ ] Partial preservation/recovery state exists.
- [ ] Evidence provenance is represented consistently.
- [ ] Mobile semantic compression is represented.
- [ ] Persian RTL and English LTR variants exist.
- [ ] Keyboard path exists for core journeys.
- [ ] Dynamic state perception is represented.
- [ ] Task wording has been piloted.
- [ ] Observation record is ready.
- [ ] Finding classification is ready.
- [ ] Governance escalation path is ready.

---

# 19. What This Stage Must Not Do

Do not use the prototype to:

- validate implementation details that do not exist yet;
- justify provider selection;
- activate AI;
- introduce autonomous behavior;
- create production analytics;
- infer product-market fit;
- declare final usability from a small formative sample;
- silently revise architecture because a participant prefers another visual style.

A participant preference is evidence. It is not automatically a canonical decision.

---

# 20. Next Controlled Stage

The next stage after this specification is:

**PROTOTYPE REPRESENTATION / EXECUTION PREPARATION**

That stage should translate this specification into an executable validation prototype while preserving the existing canonical interaction contracts.

Only after the prototype is represented and internally checked should actual user-validation sessions begin.

The sequence is therefore:

```text
Re-Validation Pass 03
→ User-Validation Prototype Specification
→ Prototype Representation
→ Internal Prototype Check
→ Pilot Task Check
→ Controlled User Validation
→ Findings
→ Refinement / Retest
→ Founder Decision where required
```

This follows the human-centred iterative principle that evaluation should feed refinement and reduce uncertainty rather than be treated as a one-time final inspection. citeturn1search3turn1search25

---

# 21. Governance

This document is a canonical design specification only.

**Implementation remains NOT AUTHORIZED.**

No production code, schema, API, infrastructure, AI Runtime, provider, autonomous behavior, or deployment may be changed under this document.

**Stage status:** `USER-VALIDATION PROTOTYPE SPECIFICATION V1 COMPLETE — READY FOR PROTOTYPE REPRESENTATION — IMPLEMENTATION NOT AUTHORIZED`
