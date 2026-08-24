# DECIVEXA AI Implementation Contract v1

**Audience:** Claude Code and implementation agents
**Status:** Founder-approved execution contract
**Canonical companion:** `DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md`
**Purpose:** Translate the Intelligence Architecture into enforceable implementation boundaries.

## 0. Read Before Implementation

Claude Code MUST read, in this order:

1. `DECIVEXA_AI_ARCHITECTURE_MASTER_SPEC_V1.md`
2. `DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md`
3. `DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md`
4. `DECIVEXA_AI_FAILURE_AND_RESILIENCE_MATRIX_V1.md`
5. `ADR-001-AI-PROVIDER-INDEPENDENCE-AND-RESILIENCE.md`
6. applicable architecture gates and governance documents.

If implementation code conflicts with these documents, stop and resolve the conflict; do not silently reinterpret the architecture.

## 1. Implementation Intent

Implement the AI foundation as a provider-independent subsystem. Do not build direct provider calls into domain modules, Goal OS, Memory, User Model, Daily OS, or other product modules.

## 2. Required Dependency Direction

```text
Domain Modules
    ↓
DECIVEXA AI Interfaces / Capabilities
    ↓
Context + Policy + Risk Boundaries
    ↓
AI Runtime
    ↓
Model Router / Registries
    ↓
Provider Adapters
    ↓
External / Self-hosted / Local Model
```

Domain modules must never depend upward on a specific provider SDK.

## 3. Required Core Interfaces

Equivalent interfaces must exist even if implementation names differ.

### AIProvider

- normalized generation
- streaming where supported
- structured output
- embeddings where supported
- health/capability metadata
- normalized errors

Must not expose provider-specific types to the domain layer.

### AICapability

Defines:

- capability ID/version
- input/output contract
- context requirements
- risk/privacy classification
- quality threshold
- execution policy
- evaluation suite

### AIRuntime

- normalize task
- resolve capability
- obtain authorized context
- enforce policy
- classify risk
- route model
- execute
- validate output
- evaluate quality
- retry/repair/fallback
- emit telemetry/audit

### ContextProvider / ContextEngine

Retrieves only the minimum authorized context required by the capability. No domain module may directly construct an external-provider prompt.

### PolicyEngine

Determines whether a capability, context, model, provider, tool, or action is allowed.

### RiskEngine

Assigns risk class and required controls. Higher-risk tasks require stronger validation and, where applicable, human approval.

### ModelRegistry

Stores approved models, capabilities, versions, eligibility, health, benchmarks, and lifecycle status.

### ProviderRegistry

Stores provider metadata, eligibility, privacy/data policy, operational status, capabilities, and limits.

### EvaluationService

Runs capability/model quality checks, regression tests, and promotion gates.

### ValidationService

Validates schemas, evidence/consistency, policy requirements, and quality signals before authoritative state changes.

## 4. Domain Independence Rule

Forbidden:

```text
GoalService → OpenAI SDK
MemoryService → Gemini SDK
DailyService → Anthropic SDK
UI → provider SDK
```

Required:

```text
GoalService → Capability Interface → AI Runtime → Provider Adapter
```

## 5. Data Boundary

External model requests must be created through:

```text
Domain Data
 ↓
Context Retrieval
 ↓
Sensitivity / Provenance Classification
 ↓
Minimization / Redaction
 ↓
Provider Eligibility Check
 ↓
Policy Authorization
 ↓
Model Request
```

No module may bypass this pipeline.

A fallback route MUST repeat privacy and provider-eligibility checks.

## 6. Output Boundary

AI output is untrusted probabilistic output until validated:

```text
Model Output
 ↓
Schema Validation
 ↓
Policy Validation
 ↓
Evidence / Consistency Validation
 ↓
Quality Evaluation
 ↓
Accepted Result / Repair / Retry / Fallback / Human Review
```

## 7. Memory Write Boundary

AI must not directly mutate authoritative Personal Intelligence state.

```text
AI Observation / Candidate Insight
 ↓
Memory Candidate
 ↓
Provenance + Confidence + Sensitivity + Truth Status
 ↓
Contradiction Check
 ↓
Validation / Policy
 ↓
Persisted Memory or User-Model Update
```

At minimum, memory truth status must distinguish user-stated, observed/measured, inferred, hypothesis, AI-generated, system-derived, validated, contradicted, and deprecated states.

## 8. Action Boundary

```text
AI Plan
 ↓
Action Proposal
 ↓
Risk Classification
 ↓
Policy
 ↓
Approval if required
 ↓
Execution
 ↓
Verification
 ↓
Audit
```

AI cannot grant itself permission.

## 9. Provider Adapter Rules

Adapters must:

- contain provider-specific SDK/API code;
- normalize provider errors;
- expose capability metadata;
- support health checks;
- avoid leaking provider-specific objects;
- support versioned models;
- be independently replaceable;
- remain free of DECIVEXA domain business rules.

## 10. Routing Rules

Hard eligibility constraints are evaluated BEFORE scoring.

The router must consider, at minimum:

- capability fit
- model quality
- availability
- privacy compatibility
- region/compliance eligibility
- latency
- cost
- context capacity
- current provider health
- risk policy

The routing decision must be deterministic/reproducible enough to audit for a given configuration/policy version.

## 11. Fallback Rules

Fallback order is policy-driven, never permanently hard-coded to one vendor.

Conceptual route:

```text
Preferred Frontier
 → approved secondary
 → DECIVEXA-hosted model
 → local/edge capability
 → deterministic continuity
```

Each fallback re-evaluates capability, privacy, policy, quality floor, and risk requirements.

## 12. Cost Rules

Every invocation should be attributable to:

- user/tenant context where appropriate
- capability
- model
- provider
- usage estimate
- cost estimate

A capability must define a quality floor. Cost optimization cannot silently select an unacceptable model.

## 13. Observability Rules

Capture enough information to diagnose routing and reliability without unnecessarily storing sensitive prompts/payloads:

- request/correlation ID
- capability/version
- risk class
- privacy class
- model/provider
- route decision
- latency
- usage/cost
- fallback path
- validation outcome
- policy outcome
- runtime version
- quality signal where available

## 14. Security Rules

Never:

- expose provider API keys to clients;
- store secrets in source code;
- place secrets in prompts;
- log raw sensitive prompts by default;
- treat external content as trusted instructions;
- allow AI to bypass authorization;
- allow provider failure to corrupt domain state;
- allow a model to self-authorize a tool/action.

## 15. Prompt / Policy / Schema Rules

Prompts, capability definitions, policies, routing configuration, and schemas that affect behavior must be versioned artifacts.

Critical business rules must not exist only in prompts.

Production events must be attributable to compatible versions of release, runtime, capability, prompt, policy, model, provider adapter, and relevant memory/schema versions.

## 16. Testing Contract

### Unit
- provider adapter normalization
- routing decisions
- policy decisions
- risk classification
- context minimization
- output validation
- memory candidate validation
- action authorization

### Integration
- provider timeout
- rate limit
- auth failure
- invalid response
- context overflow
- fallback
- policy rejection
- sensitive-data filtering
- model retirement

### Resilience
- all external providers unavailable
- AI Runtime unavailable
- network interruption
- cloud/region failure
- credential compromise/rotation path
- deterministic continuity
- offline event replay/reconciliation

### Security
- prompt injection boundary
- indirect prompt injection
- tool authorization
- secret leakage
- unauthorized context access
- memory poisoning
- external-content trust boundary

### Evaluation
- representative DECIVEXA capability benchmarks
- regression tests for approved models
- evidence grounding
- hallucination resistance
- structured-output correctness
- quality floor enforcement

## 17. v1 Scope Guard

Do not implement full autonomous agents, Digital Twin, broad self-hosted frontier inference, advanced predictive intelligence, or autonomous architectural self-modification merely because this architecture enables them.

Implement only the interfaces and safe extension points required by v1. Deferred capabilities require their own Founder-controlled gate before material implementation.

> Cross-reference: bounded, governed Agent capability and V1 user voice input are approved architectural directions per `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md` §ADR-007 and §ADR-008. This does not change the prohibition above on *unbounded* autonomy, Digital Twin, or standalone Predictive Intelligence, which remain future/deferred unless separately authorized.

## 18. Definition of Done

Claude Code should consider the AI foundation complete only when:

- no domain module directly imports a provider SDK;
- provider adapters are isolated;
- AI capabilities are versioned and schema-bound;
- Context Engine is the only normal path to external model context;
- policy/authorization cannot be bypassed by AI;
- memory writes are controlled;
- output validation exists;
- risk classification exists;
- provider failover exists;
- deterministic continuity exists;
- AI telemetry exists;
- model/provider registries exist;
- evaluation hooks exist;
- major failure modes have tests;
- sensitive context is never sent to an ineligible route;
- model rollback does not require domain-data migration;
- AI runtime failures cannot corrupt authoritative user state;
- architecture documentation matches implementation;
- no undocumented provider lock-in exists.

## 19. Code Review Invariants

Reject an AI-related change if it introduces:

- direct provider SDK imports into domain code;
- provider-specific types in domain interfaces;
- unvalidated AI output written to authoritative state;
- external inference outside the Context/Privacy pipeline;
- AI actions outside authorization/policy;
- fallback without renewed eligibility checks;
- silent model promotion without evaluation;
- sensitive payload logging by default;
- hard-coded provider dependency;
- autonomous architectural changes.

## 20. Change Control

Any material change to this contract, AI boundaries, privacy model, data ownership, security architecture, schemas, routing philosophy, or core architecture requires explicit Founder approval before implementation.

When documentation and implementation disagree, stop and surface the discrepancy rather than silently modifying either side.
