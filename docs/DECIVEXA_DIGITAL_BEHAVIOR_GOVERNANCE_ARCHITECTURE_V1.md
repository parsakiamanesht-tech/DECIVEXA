# DECIVEXA — Digital Behavior Governance & Focus Control Architecture V1

**Status:** Architecture reference only — no implementation authorization
**Purpose:** Durable design contract for future implementation by Claude Code or another explicitly authorized implementation agent.
**Date:** 2026-08-23

> **Scope rule:** This document defines the intended architecture, invariants, behavior, boundaries, and implementation handoff for DECIVEXA's user-authorized digital-behavior governance capability. It does not authorize implementation now.

---

## 1. Executive Definition

DECIVEXA should help the user control their digital environment according to rules the user explicitly chooses.

This capability is **not** a generic screen-time tracker and must not become an autonomous phone-control system.

The architectural concept is:

> **Digital Behavior Governance & Focus Control:** a user-authorized system that observes permitted device-behavior metadata, compares it against explicit behavioral contracts, and applies user-approved interventions to reduce distraction and protect goals.

The system exists to reduce the gap between:

```text
User intention
     ↓
Goal / priority
     ↓
Actual digital behavior
     ↓
Distraction / friction
     ↓
Environment intervention
     ↓
Higher probability of desired behavior
```

The system must never silently redefine what is good behavior for the user.

---

# 2. Twenty Design Commitments

The approved concept contains the following twenty commitments. All twenty are architectural requirements and must be considered together during future implementation.

1. **Digital Behavior Governance rather than simple phone locking.**
2. **User-owned behavioral contracts.**
3. **Goal-aware protection without autonomous goal enforcement.**
4. **Behavior must not be judged from time alone.**
5. **Strict separation of Intelligence, Policy, and Device Enforcement.**
6. **AI recommends; deterministic policy enforces.**
7. **Graduated interventions from low friction to strong restriction.**
8. **Prefer app/category/session restrictions over device-wide locking.**
9. **User override / escape hatch is mandatory.**
10. **The system learns from outcomes without silently changing user rules.**
11. **Intervention friction is itself a managed resource.**
12. **Voice is a low-friction intervention channel.**
13. **Voice is optional; visual/haptic/silent channels remain available.**
14. **Privacy-first behavior telemetry; screen-content access is not the default.**
15. **Behavior is compared against user-defined rules, not moral judgments.**
16. **Explicit consent and ownership of control.**
17. **Provider-independent, OS-adapter-based device integration.**
18. **Failure-safe, auditable, reversible enforcement.**
19. **V1 remains intentionally simple; adaptive intelligence is staged.**
20. **Long-term evolution toward Personal Environment Optimization without creating a controlling autonomous agent.**

---

# 3. Architectural Position in DECIVEXA

This capability is not a separate intelligence system.

```text
                         DECIVEXA
                            │
                 Personal Intelligence Core
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
           Goals         Decisions      Behavior
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                        AI Coach
                            │
                            ▼
                    Recommendation Layer
                            │
                    User Explicit Consent
                            │
                            ▼
                 Behavioral Contract Store
                            │
                            ▼
                    Policy Engine
                            │
                            ▼
                Device Governance Interface
                     /                 \
                 Android              iOS
                            │
                            ▼
                     Behavior Signals
                            │
                            ▼
                         Evidence
                            │
                            ▼
                    Personal Intelligence
```

Voice architecture, Memory architecture, Evidence, Goal OS, Personal State History, and AI Architecture remain canonical dependencies.

There must be no second parallel memory or intelligence system for device behavior.

---

# 4. Commitment 1 — Digital Behavior Governance, Not Phone Locking

The capability must be modeled as a broader environment-governance system.

Phone locking is only one possible intervention.

The primary objective is:

> **Help the user shape the digital environment they have chosen for themselves.**

Possible intervention targets include:

- a single application;
- an application category;
- a distracting session;
- a time window;
- a focus period;
- eventually, broader device access.

Device-wide lock is a last-resort capability, not the architectural center.

---

# 5. Commitment 2 — User-Owned Behavioral Contracts

The system should represent user-authorized rules as **Behavioral Contracts**.

A conceptual contract:

```text
BehavioralContract
├── contract_id
├── owner
├── status
├── target
│   ├── apps
│   ├── categories
│   └── device scope
├── time_window
├── trigger
├── threshold
├── warning policy
├── grace period
├── intervention policy
├── override policy
├── consent record
├── created_at
├── effective_at
├── expires_at (optional)
├── revision
└── provenance
```

The contract belongs to the user.

AI may help create or refine it, but it cannot claim ownership of the rule.

Example:

> "From 22:00 to 07:00, if Instagram usage exceeds 20 minutes, warn me and, after a five-minute grace period, temporarily restrict Instagram for 30 minutes."

The implementation must preserve the difference between:

```text
User rule
≠
AI suggestion
≠
System inference
```

---

# 6. Commitment 3 — Goal-Aware Protection

DECIVEXA can use Goal OS and Personal Intelligence to make useful rule suggestions.

Example:

```text
Active goal:
Study 90 minutes today

Observed context:
Focus session is active

AI suggestion:
"Would you like me to protect this focus session by restricting selected distracting apps?"

User:
Yes

Result:
Create user-approved temporary Behavioral Contract
```

The system must not infer permanent permission from a goal.

Goal existence alone does not authorize device control.

Goal-aware protection is therefore:

```text
Goal
 ↓
AI recommendation
 ↓
User choice
 ↓
Explicit authorization
 ↓
Policy
```

not:

```text
Goal
 ↓
Automatic lock
```

---

# 7. Commitment 4 — Time Alone Is Not a Judgment

Screen time is a signal, not a moral classification.

Incorrect architecture:

```text
YouTube = 60 minutes
→ waste
→ lock
```

Correct architecture:

```text
Behavior signal
+
Active user-defined contract
+
Relevant time window
+
Target app/category
+
Policy conditions
→
contract evaluation
```

DECIVEXA should say:

> "Your user-defined limit has been exceeded."

not:

> "You wasted your time."

Future contextual intelligence may distinguish learning, work, entertainment, or distraction, but even then the system should use evidence and user policy rather than moralize.

---

# 8. Commitment 5 — Three-Layer Separation

The system must have three conceptual layers.

## 8.1 Intelligence Layer

Responsible for understanding and recommendation:

- Personal Intelligence;
- Goals;
- Decisions;
- behavior patterns;
- AI Coach;
- contextual reasoning.

## 8.2 Policy Layer

Responsible for deterministic interpretation of approved contracts:

```text
IF conditions
AND user authorization is active
THEN intervention policy
```

## 8.3 Enforcement Layer

Responsible for translating an approved policy decision into OS-supported behavior.

This separation is mandatory because intelligence and enforcement have different trust requirements.

---

# 9. Commitment 6 — AI Recommends; Deterministic Policy Enforces

Claude or another model must never directly control the device.

Unsafe:

```text
LLM
 ↓
"User used phone too much"
 ↓
LOCK DEVICE
```

Required architecture:

```text
AI
 ↓
Recommendation
 ↓
User approval / existing explicit contract
 ↓
Policy Engine
 ↓
Validated policy decision
 ↓
Device Adapter
 ↓
Enforcement
```

The Policy Engine must evaluate:

- contract validity;
- target;
- threshold;
- time window;
- consent;
- current status;
- override state;
- safety constraints;
- OS capability.

The AI cannot bypass these checks.

---

# 10. Commitment 7 — Graduated Intervention Ladder

Intervention must be proportional.

Conceptual levels:

```text
L0  Observe only
 ↓
L1  Silent record
 ↓
L2  Visual notification
 ↓
L3  Voice reminder
 ↓
L4  Gentle interruption
 ↓
L5  Countdown / grace period
 ↓
L6  Temporary app restriction
 ↓
L7  Category restriction
 ↓
L8  Device-level restriction
```

V1 does not have to implement every level. The architecture preserves the ladder for future evolution.

A higher level must not be activated merely because the AI believes it would be useful.

---

# 11. Commitment 8 — Prefer Narrow Restrictions

Intervention scope should follow least disruption:

```text
Single app
   >
App category
   >
Session
   >
Focus mode
   >
Device-wide restriction
```

The system should minimize collateral damage.

Example:

If Instagram violates a contract, restricting emergency calls would be unjustified.

Device-wide restriction should only be possible when:

- the user explicitly enabled that intervention;
- the contract permits it;
- the OS supports it safely;
- critical system functions remain protected where required.

---

# 12. Commitment 9 — Override / Escape Hatch

A user must be able to override a restriction through an explicit mechanism.

Conceptual flow:

```text
Rule triggered
 ↓
Intervention
 ↓
User requests override
 ↓
Policy checks override rules
 ↓
Temporary permission
 ↓
Record outcome
```

Override is not a failure of the system.

It is valuable behavioral evidence.

Possible metadata:

- contract id;
- intervention level;
- timestamp;
- duration;
- optional user reason;
- whether the override was repeated.

The system must not shame or punish the user for overriding.

---

# 13. Commitment 10 — Learning Without Silent Rule Mutation

DECIVEXA should learn from behavior and outcomes.

Example:

```text
Contract:
30 min Instagram

Historical triggers:
10

Overrides:
7

Outcome:
Contract may be too restrictive
```

AI may propose:

> "You override this rule frequently. Would you like to change it to 45 minutes?"

Only the user or an explicitly authorized deterministic policy may change the contract.

The AI must never silently rewrite the user's behavioral contract.

Learning loop:

```text
Contract
 ↓
Trigger
 ↓
Intervention
 ↓
User behavior / override
 ↓
Outcome evidence
 ↓
Pattern analysis
 ↓
AI recommendation
 ↓
User decision
 ↓
New contract revision
```

---

# 14. Commitment 11 — Intervention Friction Budget

DECIVEXA itself can become a distraction if it interrupts too often.

Therefore intervention cost must be modeled.

A future user preference may include:

```text
InterventionBudget
├── maximum interventions/day
├── quiet hours
├── preferred channel
├── escalation limits
├── cooldown period
└── emergency bypass
```

The system should prefer:

```text
high-value intervention
>
frequent low-value intervention
```

A repeated non-effective warning should be suppressed or reconsidered rather than repeated indefinitely.

The system should learn the effectiveness of interventions.

---

# 15. Commitment 12 — Voice as Low-Friction Intervention

Voice is an important interface because the user may not want to navigate menus during a focus session.

Example:

> "The limit you set for this app has been reached. Do you want to stop or continue for ten more minutes?"

User:

> "Stop."

The voice interaction can result in a policy operation without requiring manual navigation.

Voice must use the existing Voice Intelligence architecture and must not create a separate policy or memory system.

---

# 16. Commitment 13 — Voice Is Optional

Voice must never be mandatory.

Possible channels:

```text
Visual
Voice
Haptic
Silent
Combined
```

The Behavioral Contract can specify preferred intervention channels subject to platform capability.

The system should avoid spoken interventions in contexts where they may be socially inappropriate or disruptive.

---

# 17. Commitment 14 — Privacy-First Behavior Telemetry

The default telemetry model should prefer behavior metadata over content inspection.

Useful signals may include:

```text
app identifier
category
start time
end time
duration
session count
unlock count
focus session state
```

The system should not need to know:

- what private message was read;
- what photo was viewed;
- what exact content appeared on screen;
- what was typed into another application.

The default principle is:

> **Behavior metadata before screen content.**

Screen-content access, if ever considered, must be a separately governed capability with explicit consent, narrow scope, independent privacy analysis, and a separate architecture gate.

---

# 18. Commitment 15 — No Moral Judgment

DECIVEXA must avoid statements such as:

> "You are wasting your life."

unless the user explicitly uses such language and the system is merely reflecting it appropriately.

The factual system language should remain grounded:

> "Your configured 45-minute limit has been exceeded by 12 minutes."

The AI Coach may provide contextual interpretation, but it must distinguish:

```text
Observed fact
≠
User-defined rule violation
≠
AI hypothesis
≠
Moral judgment
```

---

# 19. Commitment 16 — Explicit Consent and Ownership

Device governance is an opt-in capability.

Activation must require explicit user authorization.

Consent should be:

- specific;
- understandable;
- revocable;
- auditable;
- scoped;
- associated with the relevant capability/contract.

Examples of separate scopes:

```text
Allow usage monitoring
Allow app restriction
Allow voice intervention
Allow device-level restriction
Allow proactive recommendations
```

Permission for one capability must not automatically imply permission for another.

The user must be able to disable the entire governance layer and revoke contracts.

---

# 20. Commitment 17 — Provider-Independent OS Adapters

DECIVEXA core must not be coupled to one mobile OS API.

Conceptual interface:

```text
DeviceGovernancePort
├── getCapabilities()
├── getUsageSignals()
├── evaluateAvailableControls()
├── requestRestriction()
├── releaseRestriction()
├── getCurrentRestrictionState()
└── getPermissionState()
```

Platform adapters:

```text
Device Governance Port
        │
   ┌────┴────┐
   ▼         ▼
Android     iOS
Adapter     Adapter
```

The actual implementation must follow the capabilities and restrictions of each operating system and must not pretend an OS provides a control it does not permit.

The architecture should support graceful degradation when a capability is unavailable.

---

# 21. Commitment 18 — Failure-Safe, Auditable, Reversible Enforcement

The system must fail closed with respect to unauthorized actions and fail safely with respect to user access.

Examples:

### AI unavailable

No new AI recommendation. Existing contracts may continue only through deterministic policy if the platform can evaluate them safely.

### Policy engine unavailable

Do not invent a restriction decision.

### Device adapter unavailable

Do not falsely report that a restriction was applied.

### Restriction API fails

Record the failure and expose accurate state.

### State disagreement

The canonical system must distinguish:

```text
requested
accepted
applied
verified
failed
released
```

Every consequential enforcement event should be auditable.

Restrictions should be reversible according to the contract and platform rules.

---

# 22. Commitment 19 — Intentionally Simple V1

V1 should not attempt to solve all behavioral intelligence.

Recommended V1 foundation:

```text
Explicit user rules
+
App/category usage metadata
+
Time thresholds
+
Defined time windows
+
Warnings
+
Optional voice warning
+
Optional temporary restriction
+
Override
+
Evidence/outcome capture
```

AI capabilities in V1 should focus on:

- helping create rules;
- explaining rules;
- detecting obvious conflicts;
- recommending adjustments;
- connecting rules to user goals when explicitly permitted;
- summarizing outcomes.

Avoid autonomous predictive enforcement in V1.

---

# 23. Commitment 20 — Long-Term Personal Environment Optimization

The long-term direction is broader than distraction blocking.

```text
Digital Behavior Governance
          ↓
Goal-aware Environment Control
          ↓
Behavior Pattern Intelligence
          ↓
Context-aware Intervention
          ↓
Predictive Distraction Risk
          ↓
Personal Environment Optimization
```

The eventual system may learn which environments help the user perform well and recommend changes before problems occur.

However, the user remains the owner of the environment policy.

The system must not evolve into an autonomous controlling agent.

---

# 24. Behavioral Signal Model

A conceptual event:

```text
BehaviorSignal
├── signal_id
├── timestamp
├── source_device
├── app/category identifier
├── session_start
├── session_end
├── duration
├── signal_type
├── confidence
├── provenance
└── privacy_classification
```

Signals are observations, not judgments.

A signal can become Evidence when accepted according to the Evidence architecture.

---

# 25. Policy Evaluation Model

Conceptual evaluation:

```text
Inputs
├── current_time
├── usage_signal
├── active_contracts
├── consent_state
├── override_state
├── device_capabilities
└── safety constraints

        ↓

Policy Evaluation
        ↓

PolicyDecision
├── no_action
├── notify
├── voice_notify
├── grace_period
├── restrict
├── release
└── unavailable
```

The policy engine must be deterministic for the same canonical inputs and policy version, except where an explicitly modeled external state changes.

Every decision should identify the contract and policy revision responsible for it.

---

# 26. Behavioral Contract Lifecycle

```text
Draft
 ↓
User Review
 ↓
Explicitly Authorized
 ↓
Active
 ↓
Triggered
 ↓
Intervention
 ↓
Override / Compliance
 ↓
Outcome
 ↓
Active / Revised / Suspended / Expired / Revoked
```

Every revision should preserve appropriate history.

A new rule should not erase the fact that a previous rule existed.

---

# 27. Context-Aware Intelligence — Future Layer

Future intelligence can combine:

```text
Usage
+
Goal
+
Time
+
App/category
+
Focus session
+
Recent behavior
+
User-approved context
```

Example:

```text
YouTube 60m
```

could be interpreted differently depending on a user-approved context such as:

```text
Learning session = active
```

or:

```text
Distraction contract = active
```

But the AI must not secretly inspect private content to manufacture context.

---

# 28. Focus Sessions

A useful future construct is a user-authorized **Focus Session**.

```text
FocusSession
├── goal/reference
├── start
├── planned_duration
├── protected_apps/categories
├── allowed_apps/categories
├── intervention policy
├── voice policy
└── completion/outcome
```

Example:

> "Start a 60-minute study session. Protect it from selected distracting apps."

DECIVEXA can create a temporary contract with explicit user authorization.

When the session ends, the temporary contract expires automatically unless the user chooses otherwise.

---

# 29. No Permanent Lock by Accident

Temporary contracts should have explicit expiration semantics.

The system should prevent accidental permanent restrictions caused by:

- application crash;
- clock change;
- device reboot;
- synchronization failure;
- stale policy;
- provider failure.

Persistent contracts require persistent user authorization and must remain visible/manageable.

---

# 30. Emergency and Essential Access

Any device-level governance must preserve platform-required or user-configured essential access where technically possible.

Potentially protected capabilities include:

- emergency calling;
- required accessibility functions;
- critical device recovery;
- other OS-defined essential functions.

The exact list must be platform-specific and implementation-stage validated.

---

# 31. Memory and Evidence Integration

Device behavior should not automatically become permanent Personal Memory.

Preferred path:

```text
Device signal
 ↓
Observation
 ↓
Evidence (when policy permits)
 ↓
Pattern candidate
 ↓
AI interpretation
 ↓
User-visible insight / recommendation
```

Example:

```text
Observation:
User exceeded Instagram contract 8 times this month.

Pattern candidate:
Current evening limit may be too difficult to maintain.

Not:
"User lacks discipline."
```

Patterns must remain hypotheses unless sufficiently supported.

---

# 32. Personal State History Integration

Behavioral state changes that affect DECIVEXA-owned domain state should be temporally traceable.

The system should eventually support questions such as:

> "When did I start using this evening restriction?"

> "How often did I override it?"

> "What happened after I changed the limit?"

This should rely on canonical State History rather than transient device logs alone.

---

# 33. AI Coach Integration

AI Coach may use behavioral evidence to provide useful reflection.

Example:

> "Over the last two weeks, you completed more focus sessions on days when your evening app limit was active. Would you like to keep that rule?"

This is preferable to:

> "You need stricter discipline."

The Coach should connect behavior to goals and outcomes without overclaiming causality.

---

# 34. Analytics and Effectiveness

The system should eventually measure whether interventions actually help.

Potential metrics:

```text
trigger rate
intervention rate
override rate
completion rate
focus-session completion
contract retention
rule revision frequency
intervention effectiveness
user annoyance signals
```

A successful intervention is not simply one that blocks an app.

The ultimate metric is whether it improves outcomes with acceptable friction.

---

# 35. Anti-Patterns

The implementation must avoid:

- autonomous phone locking without explicit authorization;
- LLM direct device control;
- treating screen time as inherently bad;
- reading screen contents by default;
- permanent raw surveillance;
- hidden permissions;
- silent rule mutation;
- punitive user experience;
- excessive notifications;
- irreversible restrictions;
- provider-specific core contracts;
- a second memory system for behavior;
- using AI confidence as permission;
- claiming enforcement succeeded when the OS did not confirm it.

---

# 36. V1 Acceptance Scenarios

### A — User opt-in

The feature is inactive until the user explicitly enables the relevant capability.

### B — Rule creation

User creates a time/app threshold rule and can inspect what it will do before authorization.

### C — Trigger

A qualifying behavior signal triggers the correct deterministic policy.

### D — Warning

The user receives the configured warning through the configured channel.

### E — Restriction

A configured restriction is applied only when the contract permits it and the OS confirms capability/state.

### F — Override

User can invoke the defined override path and the system records the event accurately.

### G — AI outage

Existing deterministic contracts remain safe; no AI-derived autonomous enforcement occurs.

### H — Adapter failure

The system accurately reports that enforcement could not be applied.

### I — Privacy

Normal operation does not require screen-content inspection.

### J — Rule revision

AI can recommend a change based on outcomes, but the user's contract changes only through an authorized revision flow.

### K — Expiration

A temporary focus contract expires correctly and does not become an accidental permanent restriction.

### L — Provider replacement

Changing AI providers does not destroy behavioral contracts, evidence, state history, or canonical data.

### M — Historical reconstruction

The system can explain which contract and policy revision governed a past intervention.

---

# 37. Implementation Handoff Contract

When implementation is explicitly authorized:

1. Read this document before designing device-governance code.
2. Read `DECIVEXA_AI_ARCHITECTURE_V1.md`.
3. Read `DECIVEXA_VOICE_INTELLIGENCE_ARCHITECTURE_V1.md`.
4. Read Memory, Evidence, Personal State History, Goal OS, and relevant security/privacy architecture.
5. Treat the twenty commitments in this document as architectural requirements.
6. Do not implement capabilities that the current OS does not actually permit.
7. Keep Intelligence, Policy, and Enforcement separate.
8. Never give the LLM direct unrestricted device control.
9. Never create a parallel behavior-memory system.
10. Preserve user consent, contract history, provenance, and reversibility.
11. Implement V1 scope before future adaptive capabilities.
12. Produce evidence for the acceptance scenarios.
13. Update architecture documentation through normal governance if implementation reveals a required design change.
14. Stop and request an architecture decision when a required behavior is not specified.

---

# 38. Final Architectural Principle

> **DECIVEXA does not control the user. The user chooses how DECIVEXA may help control the user's digital environment. AI provides intelligence and recommendations; explicit user authorization defines the contract; deterministic policy governs enforcement; platform adapters execute only what the operating system safely permits; evidence and outcomes teach the system without silently taking ownership away from the user.**
