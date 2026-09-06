# DECIVEXA — AI Architecture V1

**Status:** Architecture reference only — no implementation authorization
**Purpose:** Durable design contract for future implementation agents, including Claude Code.
**Brand:** DECIVEXA
**Underlying philosophy:** Decision OS
**Date:** 2026-08-23

> **Execution rule:** This document describes WHAT DECIVEXA AI/Memory must become. It does not authorize implementation now. When implementation is later authorized, the implementation agent must consult this document, preserve its invariants, and stop for an architecture decision where the specification is ambiguous.

## 1. Foundational Identity

DECIVEXA V1 AI is **not a foundation model** and is **not a chat wrapper around Claude**.

It is a Personal Intelligence System combining:

- DECIVEXA-owned durable knowledge and memory;
- Personal State History;
- Evidence and provenance;
- a Living Human Model;
- retrieval and context fusion;
- deterministic domain logic and policy;
- an AI provider gateway;
- model-based language understanding and reasoning;
- governed tools/actions;
- outcome and feedback loops.

The foundation model supplies general language/reasoning capability. DECIVEXA supplies the persistent personal intelligence, context, rules, memory, evidence, and decision architecture that make the result personal and longitudinal.

### Non-negotiable invariants

1. DECIVEXA owns durable personal intelligence.
2. Provider conversation memory is never the canonical source of truth.
3. AI failure must not become data failure.
4. Provider replacement must not require rebuilding personal history.
5. A model inference must never silently become an authoritative personal fact.
6. Canonical documents must survive independently of indexes, embeddings, summaries, or model providers.
7. Important AI-derived information must retain provenance, lifecycle, and uncertainty.
8. Models cannot bypass deterministic authorization or domain invariants.
9. Human agency remains the boundary for consequential personal decisions.
10. When evidence is insufficient, DECIVEXA must prefer uncertainty over fabricated certainty.

## 2. What “AI” Means Inside DECIVEXA

AI means the entire intelligence pipeline, not merely the LLM:

```text
Perception → Intent Understanding → Context Retrieval → Personal Context Fusion
→ Reasoning → Decision Analysis → Recommendation / Action Proposal
→ Policy + Domain Validation → User Interaction / Governed Action
→ Outcome + Feedback → Evidence / Memory / Model Update
```

An LLM is one component. This distinction prevents DECIVEXA from becoming a chatbot with a database.

## 3. V1 Intelligence Capabilities

### Understand
Infer request/task type, explicit constraints, justified implicit context, and missing information. Distinguish question, instruction, decision request, planning, reflection, personal-data update, correction, action request, and remember/forget request.

### Retrieve
Find relevant information from DECIVEXA-owned data rather than sending the whole database to the model.

### Contextualize
Build a bounded context package preserving source identity, time, confidence, conflicts, permissions, and relevance.

### Reason
Use an appropriate provider/model to reason over the current request and bounded context.

### Connect
Relate values, priorities, goals, decisions, behavior, evidence, environment, constraints, and outcomes.

### Recommend
Produce personalized, evidence-grounded, constraint-aware and explainable recommendations.

### Explain
Separate evidence, retrieved memory, inference, uncertainty, recommendation, and action.

### Remember
Identify candidate durable information; Memory Admission determines whether it becomes durable.

### Learn
Update DECIVEXA's user model, evidence, memory, and decision/outcome history. Per-user foundation-model retraining is not a prerequisite.

### Act
Request governed tools; never receive unrestricted database writes.

### Reflect
Use outcomes and feedback to revise confidence, hypotheses, and future recommendations.

## 4. Canonical System Architecture

```text
USER
  ↓
DECIVEXA EXPERIENCE
  ↓
AI ORCHESTRATOR
  ├─ Intent / task classification
  ├─ Policy / permission checks
  ├─ Retrieval planning
  ├─ Context budget
  ├─ Tool planning
  └─ Model routing
  ↓
CONTEXT FUSION ENGINE
  ├─ Memory
  ├─ Evidence
  ├─ Documents
  ├─ State History
  ├─ Goals / Decisions
  └─ Living Human Model
  ↓
BOUNDED CONTEXT PACKAGE
  ↓
AI PROVIDER GATEWAY
  ├─ Claude (initial candidate)
  ├─ future providers
  └─ future local models
  ↓
STRUCTURED AI RESULT
  ├─ evidence
  ├─ inference
  ├─ uncertainty
  ├─ recommendation
  └─ proposed action
  ↓
POLICY / DOMAIN VALIDATION
  ↓
RESPONSE OR GOVERNED ACTION
  ↓
OUTCOME / FEEDBACK
  ↓
EVIDENCE + MEMORY + HUMAN MODEL UPDATE
```

## 5. Component Contracts

### AI Orchestrator

Coordinates intent, retrieval, policy, provider selection, structured output, tool proposals and outcome metadata. It must not own canonical personal state.

### Context Fusion Engine

Bridges “everything DECIVEXA knows” and “what the model needs now.” Inputs include request, current state, goals, memory, evidence, documents, decisions, permissions, privacy constraints, contradictions and task type. Output is an ephemeral bounded Context Package.

Conceptual package:

```text
ContextPackage
├─ task
├─ user_context
├─ relevant_goals
├─ relevant_decisions
├─ evidence
├─ memories
├─ documents
├─ constraints
├─ conflicts
├─ uncertainty
├─ provenance
└─ context_policy_metadata
```

### AI Provider Gateway

The application communicates with providers through a DECIVEXA abstraction. Conceptual capabilities: generate, structured generation, streaming, tool-call request, provider metadata. Provider SDK types should not leak into core domain contracts.

### Tool Layer

Tools have input/output schemas, authorization, risk classification, audit metadata, deterministic validation, and idempotency where appropriate. The model proposes; DECIVEXA decides whether execution is permitted.

## 6. Memory Architecture

Memory is a system, not a single table and not provider chat history.

### Memory principles

Memory must be durable, provider-independent, source-linked, time-aware, lifecycle-aware, confidence-aware, correction-capable, contradiction-aware, exportable, searchable, reconstructable and privacy-governed.

### Memory classes

**Canonical facts:** explicitly established authoritative information.

**Claims:** statements believed to be true with source/provenance and lifecycle.

**Observations:** what happened/was observed, separated from interpretation.

**Decisions:** what was decided, why, when, alternatives, and status.

**Preferences:** explicit or evidence-backed preferences with confidence and change history.

**Patterns:** repeated signals suggesting a behavior/relationship; patterns are hypotheses, not immutable truth.

**Goals:** Goal OS owns goal state; Memory/Intelligence maintains relevant historical/contextual projections.

**Outcomes:** what happened after a recommendation or decision.

**Relationships:** links such as Decision→Goal, Goal→Value, Observation→Pattern, Pattern→Evidence, Claim→Document, Outcome→Decision.

## 7. Memory Admission System

The most dangerous memory bug is “everything the AI hears becomes a fact.” That is forbidden.

```text
Conversation / Event
→ Candidate Extraction
→ Classification
→ Source Identification
→ Explicitness Check
→ Sensitivity Check
→ Durability / Future-Value Check
→ Evidence + Confidence
→ Conflict Detection
→ Memory Policy
→ Persist / Temporary / Reject
```

Examples:

- “Remember that I prefer concise explanations.” → strong explicit preference candidate.
- “The user is lazy.” → never an authoritative fact merely because the model inferred it.
- “I hate mornings.” → candidate preference, but context must be considered before durable admission.

## 8. Memory Lifecycle

```text
Candidate → Proposed → Validated → Active
                                  ├→ Reinforced
                                  ├→ Corrected
                                  ├→ Superseded
                                  ├→ Contradicted
                                  ├→ Revoked
                                  └→ Archived
```

Definitions:

- **Correction:** previous record was inaccurate/incomplete.
- **Supersession:** newer information replaces previous applicable information.
- **Contradiction:** two currently relevant claims conflict.
- **Revocation:** user/policy withdraws validity.
- **Archive:** retained historically but excluded from ordinary active reasoning.

Corrections should preserve enough lineage to understand what changed and why.

## 9. Temporal Memory and State History

Memory must distinguish at least observed-at, accepted-at, effective-at, corrected/superseded-at, and current validity where applicable.

Personal State History is a foundational temporal layer, not the entire Memory system.

The system must eventually answer both:

- “What is true/current now?”
- “What did DECIVEXA know or record at that earlier point, and what changed?”

## 10. Canonical Document Memory

Documents are first-class knowledge assets and must survive model replacement, embedding replacement, index rebuild, summary regeneration, provider outage, AI hallucination and migration.

Conceptual model:

```text
Document
├─ stable_id
├─ version
├─ canonical_content
├─ checksum
├─ source / author
├─ timestamps
├─ document_type
├─ relationships
├─ lifecycle_status
└─ derived_indexes
   ├─ extracted_text
   ├─ chunks
   ├─ embeddings
   ├─ summaries
   └─ retrieval_metadata
```

**Derived indexes are disposable. Canonical content is not.**

## 11. Provenance

Important durable AI-derived records should be traceable:

```text
AI Claim → Memory Record → Evidence → Source Event / Document → Version → Timestamp
```

The system should answer “Why does DECIVEXA believe this?” and “What source caused this memory to exist?” This operationalizes Evidence Before Opinion.

## 12. Evidence vs Inference

The AI contract must distinguish:

- **Evidence:** directly supported information.
- **Memory:** durable prior records.
- **Inference:** model conclusion from evidence/context.
- **Hypothesis:** uncertain interpretation.
- **Recommendation:** proposed path.
- **Action:** permitted operation actually executed.

These categories must not silently collapse into one another.

## 13. Retrieval Architecture

Retrieval is not merely vector search. It may combine exact lookup, structured filters, temporal filtering, relationship traversal, semantic retrieval, full-text retrieval, relevance ranking, confidence, freshness, source authority and contradiction detection.

Embeddings are a retrieval mechanism, never the source of truth.

### Retrieval objective

> Find the smallest sufficient set of trustworthy context that materially improves the current reasoning task.

This supports minimum user input, maximum system value, while limiting unnecessary disclosure.

## 14. Personal Context Assembly

```text
Current Request
+ Current State
+ Active Goals
+ Relevant History
+ Relevant Memory
+ Relevant Evidence
+ Relevant Decisions
+ Relevant Documents
+ Values / Constraints
+ Uncertainty / Conflicts
→ Personal Context Package
```

The model does not need everything DECIVEXA knows; it needs what is relevant to the task.

## 15. AI Reasoning Contract

Conceptual structured result:

```text
AIResult
├─ answer
├─ evidence_used[]
├─ memories_used[]
├─ assumptions[]
├─ inferences[]
├─ uncertainties[]
├─ recommendations[]
├─ proposed_actions[]
└─ confidence / rationale metadata
```

The exact runtime schema can evolve, but semantic separation is mandatory.

## 16. Learning Architecture

```text
Interaction → Observation → Evidence → Candidate Insight
→ Confidence → Memory / Human Model Update → Future Context
→ Better Reasoning → Outcome → New Evidence
```

DECIVEXA becomes more personalized through its own durable intelligence rather than requiring continual foundation-model retraining.

## 17. Living Human Model

The Living Human Model is continuously revisable and may integrate identity, values, priorities, goals, strengths, weaknesses, skills, habits, behavior patterns, preferences, constraints, environment, decision history, learning history, current state and uncertain future hypotheses.

Critical distinction:

```text
Explicit User Fact ≠ Observed Pattern ≠ AI Hypothesis ≠ Prediction
```

## 18. Decision Intelligence

DECIVEXA should reason about decisions using the person's values, goals, constraints, current state, past decisions, evidence, risks and likely outcomes. The objective is not generic pros/cons but an explanation of why an option fits this person under the known evidence.

## 19. Personal AI Coach V1

Personal AI Coach is a capability on top of Personal Intelligence Core, not a separate personality layer. It should remember relevant history, understand active goals, recognize patterns, detect meaningful deviations, suggest next steps, explain relevance, ask only necessary questions, learn from outcomes and preserve agency.

It must never manufacture intimacy by pretending to know what it does not know.

## 20. Tool Governance

Conceptual capabilities include `search_memory`, `get_document`, `get_goal`, `get_decision_history`, `get_state_at_time`, `get_evidence`, `propose_memory`, `record_observation`, `create_decision_draft`, `update_goal`, and `create_review`.

These are design concepts, not an instruction to implement them now.

Each tool must have schema, authorization, risk classification, validation, auditability, failure behavior and idempotency where appropriate.

The model must not directly issue arbitrary SQL, filesystem writes, or unrestricted state mutations.

## 21. Human Agency

V1 distinguishes information, recommendation, draft, low-risk reversible action, consequential action and sensitive/high-impact action. The stronger the consequence, the stronger validation and user confirmation must be.

## 22. Provider Independence

```text
DECIVEXA Core
      ↓
AI Provider Gateway
   ┌──┼───────────┐
   ▼  ▼           ▼
Claude  Model B  Local/Future Model
```

Changing the model must not require changing Memory, Evidence, Documents, State History, Goals, Decisions, Personal Model or domain rules.

## 23. Failure Architecture

If AI is unavailable: canonical data, documents, memory and state history remain intact; deterministic functionality continues where possible; export remains possible; no canonical state is corrupted merely because a model failed.

If a model response is malformed: reject invalid structured output, do not partially commit authoritative changes, retain diagnostic metadata, and retry/fallback only through policy.

## 24. Privacy Architecture

Context follows least-necessary disclosure. A task about one domain must not automatically expose unrelated sensitive domains. Context Fusion must respect permissions, domain boundaries, sensitivity, provider disclosure policy and retention policy.

## 25. What V1 Must Not Become

V1 must not accidentally become a generic chatbot, Claude wrapper, giant prompt containing the whole database, vector database pretending to be memory, autonomous agent swarm, uncontrolled profiler, system where every inference becomes truth, provider-dependent system, or task manager with an AI chat box.

## 26. Acceptance Scenarios

Architecture should eventually be validated by scenarios:

1. **Provider replacement:** switch providers without canonical knowledge loss.
2. **Index destruction:** delete derived indexes and rebuild from canonical documents.
3. **Memory correction:** correct a fact while preserving understandable lineage.
4. **Contradiction:** conflicting evidence produces visible uncertainty rather than arbitrary truth.
5. **Hallucination:** unsupported inference is not stored as authoritative fact.
6. **Historical reconstruction:** reconstruct what was known/active at an earlier time.
7. **Tool safety:** unauthorized mutation is blocked by policy.
8. **Provider outage:** canonical data remains intact and exportable.

## 27. Long-Term Evolution

V1 creates the substrate for later capabilities without implementing them prematurely:

```text
Personal Intelligence Core
→ Decision Intelligence
→ Progress Intelligence
→ Growth Navigation Engine
→ Personal AI Coach
→ Learning Intelligence
→ Risk Intelligence
→ Adaptive Recovery
→ Digital Twin
→ Governed Agents
```

Future layers must consume the same canonical intelligence substrate; there must not be disconnected memories for Coach, Goals, Health, Learning, Business or Agents.

## 28. Implementation Handoff Contract

When implementation is later authorized, Claude Code or another implementation agent must:

1. Read this document before changing AI/Memory architecture.
2. Read the Canonical System Map and relevant ADRs.
3. Read Memory and Personal State History specifications.
4. Map each change to an architectural requirement.
5. Preserve all non-negotiable invariants.
6. Avoid provider-specific coupling in core domain contracts.
7. Produce tests/evidence for acceptance scenarios.
8. Update architecture documents when an approved design changes.
9. Stop and request an architecture decision when a required choice is undefined.
10. Never infer implementation authorization merely because an idea appears here.

**This is an implementation reference, not an implementation command.**

## 29. Final Architectural Principle

> **DECIVEXA owns the user's durable intelligence. Models provide reasoning services to DECIVEXA. Memory belongs to DECIVEXA. Evidence belongs to DECIVEXA. The user's history belongs to DECIVEXA. A provider may change; accumulated personal intelligence must remain.**
