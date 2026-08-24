# DECIVEXA AI Implementation Contract v1

**Audience:** Claude Code and implementation agents
**Status:** Founder-approved execution contract
**Purpose:** Translate the Intelligence Architecture into enforceable implementation boundaries.

## 1. Implementation Intent

Implement the AI foundation as a provider-independent subsystem. Do not build direct provider calls into domain modules, Goal OS, Memory, User Model, Daily OS, or other product modules.

## 2. Required Dependency Direction

```text
Domain Modules
    ↓
DECIVEXA AI Interfaces / Capabilities
    ↓
AI Runtime
    ↓
Provider Adapters
    ↓
External or Self-hosted Model
```

Domain modules must never depend upward on a specific provider SDK.

## 3. Required Core Interfaces

Names may adapt to the existing codebase conventions, but equivalent boundaries must exist.

### AIProvider

Responsibilities:

- normalized generation
- streaming where supported
- structured output
- embeddings where supported
- health/capability metadata

Must not expose provider-specific types to the domain layer.

### AICapability

Defines:

- capability ID/version
- input/output contract
- context requirements
- risk/privacy classification
- quality threshold
- execution policy

### AIRuntime

Responsibilities:

- normalize task
- resolve capability
- obtain context
- enforce policy
- route model
- execute
- validate output
- retry/fallback
- emit telemetry

### ContextProvider

Retrieves only the minimum authorized context required by the capability.

### PolicyEngine

Determines whether a capability, context, model, provider, or action is allowed.

### ModelRegistry

Stores approved models, capabilities, versions, eligibility, health, and lifecycle status.

### ProviderRegistry

Stores provider metadata, eligibility, privacy/data policy, operational status, and capabilities.

### EvaluationService

Runs capability/model quality checks and regression tests.

## 4. Domain Independence Rule

Forbidden pattern:

```text
GoalService → OpenAI SDK
MemoryService → Gemini SDK
DailyService → Anthropic SDK
```

Required pattern:

```text
GoalService → Capability Interface → AI Runtime → Provider Adapter
```

## 5. Data Boundary

External model requests must be created through a controlled context pipeline:

```text
Domain Data
 ↓
Context Retrieval
 ↓
Sensitivity Classification
 ↓
Minimization/Redaction
 ↓
Provider Eligibility Check
 ↓
Model Request
```

No module may bypass this pipeline for convenience.

## 6. Output Boundary

AI output must be treated as untrusted probabilistic output until validated.

```text
Model Output
 ↓
Schema Validation
 ↓
Policy Validation
 ↓
Evidence/Consistency Validation where required
 ↓
Accepted Result / Retry / Fallback / Human Review
```

## 7. Memory Write Boundary

AI must not directly mutate authoritative Personal Intelligence state.

Preferred flow:

```text
AI Observation / Candidate Insight
 ↓
Memory Candidate
 ↓
Provenance + Confidence + Sensitivity
 ↓
Validation/Policy
 ↓
Persisted Memory or User-Model Update
```

## 8. Action Boundary

AI-generated actions must pass through authorization.

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

## 9. Provider Adapter Rules

Adapters must:

- contain provider-specific SDK/API code
- normalize provider errors
- expose capability metadata
- support health checks
- avoid leaking provider-specific objects
- support versioned models
- be independently replaceable

Adapters must not contain DECIVEXA domain business rules.

## 10. Routing Rules

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

The router must be deterministic/reproducible enough to audit for a given policy/configuration version.

## 11. Fallback Rules

Fallback order must be policy-driven, not hard-coded to one vendor.

Example conceptual route:

```text
Preferred Frontier
 → approved secondary
 → DECIVEXA-hosted model
 → local/edge capability
 → deterministic continuity
```

A fallback must re-evaluate privacy and capability requirements.

## 12. Cost Rules

Every AI invocation should be attributable to:

- user/tenant context where appropriate
- capability
- model
- provider
- token/usage estimate
- cost estimate

A capability must define a quality floor so cost optimization cannot silently select an unacceptable model.

## 13. Observability Rules

AI telemetry must include enough information to diagnose routing and reliability without unnecessarily storing sensitive prompts or personal payloads.

At minimum capture:

- request/correlation ID
- capability/version
- model/provider
- route decision
- latency
- usage/cost
- fallback
- validation outcome
- policy outcome
- runtime version

## 14. Security Rules

Never:

- expose provider API keys to clients
- store secrets in source code
- place secrets in prompts
- log raw sensitive prompts by default
- treat external content as trusted instructions
- allow AI to bypass authorization
- allow provider failure to corrupt domain state

## 15. Prompt Rules

Prompts must be versioned artifacts.

Prompt content must not become the only location of business logic. Critical constraints must be enforced by deterministic code/policy.

## 16. Testing Contract

The implementation must include tests for:

### Unit
- provider adapter normalization
- routing decisions
- policy decisions
- context minimization
- output validation

### Integration
- provider timeout
- rate limit
- invalid response
- fallback
- policy rejection
- sensitive-data filtering

### Resilience
- all external providers unavailable
- AI Runtime unavailable
- network interruption
- model retirement/route disablement

### Security
- prompt injection boundary
- tool authorization
- secret leakage
- unauthorized context access
- memory poisoning scenarios

### Evaluation
- representative DECIVEXA capability benchmarks
- regression tests for approved models

## 17. v1 Scope Guard

Do not implement full autonomous agents, Digital Twin, broad self-hosted inference, or advanced predictive intelligence merely because this architecture enables them.

Implement the interfaces and safe extension points required by v1. Deferred capabilities belong in the architecture backlog and require their own Founder-controlled gate before material implementation.

## 18. Definition of Done

Claude Code should consider the AI foundation complete only when:

- no domain module directly imports a provider SDK
- provider adapters are isolated
- AI capabilities are versioned and schema-bound
- Context Engine is the only normal path to external model context
- policy/authorization cannot be bypassed by AI
- memory writes are controlled
- output validation exists
- provider failover exists
- deterministic continuity exists
- AI telemetry exists
- model/provider registries exist
- evaluation hooks exist
- tests cover major failure modes
- architecture documentation matches implementation

## 19. Change Control

Any material change to this contract, AI boundaries, privacy model, data ownership, security architecture, or core architecture requires explicit Founder approval before implementation.
