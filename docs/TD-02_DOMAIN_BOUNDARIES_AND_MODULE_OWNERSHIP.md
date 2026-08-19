# TD-02 — Domain Boundaries & Module Ownership

**Status:** DESIGN DEFINED / GATE NOT YET PASSED  
**Priority:** Foundational Technical Design  
**Authority:** Founder-controlled; this document does not authorize implementation.

## 1. Purpose

Define canonical ownership, boundaries, and dependency rules so DECIVEXA remains one coherent Personal Operating System without becoming a tightly coupled collection of applications or an unrestricted shared-data system.

> **One authoritative owner per domain truth; shared intelligence through explicit, permission-aware contracts.**

## 2. System Boundary

```text
DECIVEXA
├── Governance / Constitution
├── Deterministic Core
├── Domain OS
├── Shared Intelligence / FIS capabilities
├── DECIVEXA AI
├── Memory
├── Evidence & Integration
├── Agent Governance
├── Security & Privacy
├── Performance / Fluid Experience
└── Continuity / Offline
```

The user experiences one DECIVEXA; internal boundaries remain explicit.

## 3. Canonical Domain Modules

### Human OS / Personal Intelligence Core
**Purpose:** Maintain the Living Human Model and personal state required for individualized navigation.

**Owns:** identity-related state, values/preferences, capabilities/experience, evidence-backed behavioral observations, baselines, energy/capacity, constraints/context, evidence-backed decision/failure patterns, evolving hypotheses, confidence/provenance/recency/revision metadata.

**Does not own:** authoritative Health, Money, Family, Business, or Learning records.

### Goal OS
**Purpose:** Discover, design, validate, and activate goals.

**Owns:** goal lifecycle, readiness, ecology, relationships/dependencies, contracts, desired outcomes, success criteria, activation state.

**Does not own:** daily execution or the entire Personal Development Model.

> Goal OS owns the destination; it does not own the person's daily execution path.

### Daily OS / Daily Intelligence
**Purpose:** Translate active goals/paths, current capacity, constraints, and personal rules into executable daily reality.

**Owns:** daily actions, execution state, routines, current-day prioritization, rescheduling state, completion evidence.

**Does not redefine:** goals, domain truth, long-term path strategy, or the Living Human Model.

### Discipline OS
**Purpose:** Operationalize consistency, commitments, personal rules, adherence, and execution discipline.

**Owns:** discipline commitments, adherence state, discipline patterns, explicitly user-authored reinforcement/penalty rules, execution-support protocols.

**Does not own:** personality diagnosis or permanent labels.

### Review OS
**Purpose:** Turn accumulated evidence into reflection, learning, review outcomes, and controlled change proposals.

**Owns:** review sessions, reflection records, review outcomes, evidence-linked lessons, change proposals.

**Does not own:** the Living Human Model or unrelated authoritative domain state.

### Health OS
Owns health records, health observations, health-specific state, and health interpretations. Other domains receive only minimum-necessary, permission-aware projections.

### Money OS
Owns financial records, budgets, financial goals, resource state, and money-specific constraints. Other modules receive only authorized minimum-necessary financial context.

### Learning OS
Owns learning state, skill gaps, mastery, learning activities, practice, and feedback. Learning is path-driven rather than an isolated content catalog.

### Business / Work OS
Owns work/business state, professional commitments, resources, constraints, and execution relevant to the user's professional life.

### Relationship / Family OS
Owns relationship/family-specific records, commitments, goals, context, and evidence under high privacy boundaries.

## 4. Cross-Cutting Systems

These are not ordinary life-domain owners.

**Personal Development Model (PDM):** connects current human state to required growth and protection; does not own domain truth.

**Growth Navigation Engine:** transforms approved understanding/PDM into individualized paths and adaptive journeys; does not own domain truth.

**Context Fusion Engine:** combines permissioned cross-domain context into current-life interpretation and useful next decisions/actions. It is never a privacy backdoor.

**Decision Intelligence:** owns decision records/intelligence, not Health/Money/Goal/Family truth.

**Memory System:** owns memory objects, provenance, lifecycle, verification, sensitivity, and governed retrieval. It is not an unrestricted shared database.

**Evidence & Integration Platform:** owns imported evidence, connector state, synchronization metadata, provenance, and normalized evidence contracts.

**DECIVEXA AI:** system-level AI orchestration/reasoning. It may synthesize approved context, generate hypotheses and paths, explain trade-offs, coach/tutor, simulate scenarios, recommend, and coordinate governed agents. It is not the system of record and may not invent evidence, bypass privacy, silently rewrite authoritative state, or replace consequential user decisions.

**Agent Governance:** owns agent identity, scope, permissions, allowed actions, policies, auditability, and resource controls.

## 5. Authoritative Ownership Matrix

| Domain | Authoritative owner | Cross-domain access |
|---|---|---|
| Human Model | Personal Intelligence Core | governed projections/context |
| Goals | Goal OS | goal projections/events |
| Daily execution | Daily OS | required context |
| Discipline | Discipline OS | execution-relevant projections |
| Reviews | Review OS | period evidence/outcomes |
| Health | Health OS | minimum necessary projections |
| Money | Money OS | minimum necessary projections |
| Learning | Learning OS | path/skill projections |
| Business/Work | Business/Work OS | scoped projections |
| Relationship/Family | Relationship/Family OS | highly restricted projections |
| Memory | Memory System | governed retrievals |
| Evidence | Evidence/Integration | connector-scoped evidence |
| Decisions | Decision Intelligence | authorized decision context |
| AI | DECIVEXA AI | approved context only |

## 6. Non-Negotiable Boundary Rules

1. One authoritative owner per domain truth.
2. No direct cross-domain writes.
3. No unrestricted shared database access.
4. No hidden schema coupling.
5. No AI bypass of domain ownership.
6. No Context Fusion bypass of privacy boundaries.
7. No agent implicit access.
8. Raw/domain truth must remain distinguishable from derived intelligence.
9. Domains expose governed projections, not unrestricted internal state.
10. Cross-domain dependencies use explicit contracts.
11. Security/privacy boundaries are enforced centrally, not only in UI.
12. AI failure must never cause authoritative data loss.
13. A module may not silently create a competing source of truth.
14. Material boundary changes require Founder approval.

## 7. Dependency Direction

```text
Domain Truth
    ↓
Domain Events / Explicit Contracts
    ↓
Permissioned Projections
    ↓
Shared Intelligence / Context Fusion
    ↓
DECIVEXA AI / Governed Agents
    ↓
Path / Guidance / Recommendation
    ↓
User Decision / Execution
    ↓
New Domain Evidence
    ↺
```

A domain must never depend on another domain's private implementation.

## 8. Evidence-Based Behavioral Boundary

A missed action belongs first to execution evidence. Discipline may interpret adherence. Repeated evidence may support a pattern hypothesis. Review may validate learning/change proposals. Personal Intelligence Core may update the Living Human Model through a governed process.

```text
Execution Event
↓
Observation
↓
Repeated Evidence
↓
Pattern / Hypothesis
↓
Review / Validation
↓
Governed Model Update
```

A single behavior must never become a permanent personality label.

## 9. FIS Relationship

FIS capabilities are generally cross-cutting intelligence capabilities rather than separate domain owners. In particular:

- FIS-036 → individualized navigation/path intelligence
- FIS-038/FIS-039 → drift/friction intelligence
- FIS-046/FIS-049 → decision/failure pattern intelligence
- FIS-050/FIS-051 → goal ecology/resource intelligence
- FIS-057 → obstacle intelligence + PDM
- FIS-058 → security/privacy foundation
- FIS-059 → performance/fluid experience foundation
- FIS-060 → continuity foundation

An FIS may span domains without becoming their authoritative owner.

## 10. Module Readiness Test

Any future module must answer:

1. What domain does it represent?
2. What authoritative state does it own?
3. What does it explicitly not own?
4. What contracts does it expose/consume?
5. What is its minimum necessary data access?
6. What are its privacy boundaries?
7. What evidence does it produce?
8. Does it duplicate an existing owner?
9. Does it create a competing source of truth?
10. Does it preserve human agency and FIS-036/057/058/059/060 invariants?

If these cannot be answered, the module is not architecture-ready.

## 11. Gate Decision

**TD-02 DESIGN DEFINED — NOT YET PASSED**

This document establishes the proposed canonical ownership and boundary model for subsequent technical design. It does not authorize implementation, schema creation, service creation, or module coding.

**Next dependency:** TD-03 — State, Event & Consistency Model.
