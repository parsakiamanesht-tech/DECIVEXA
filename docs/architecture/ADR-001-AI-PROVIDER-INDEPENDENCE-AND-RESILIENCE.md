# ADR-001 — AI Provider Independence and Resilience

**Status:** Accepted / Founder-approved
**Date:** 2026-08-24
**Decision scope:** DECIVEXA AI foundation

## Context

DECIVEXA's primary users may include people operating from regions where leading AI APIs are unavailable, restricted, unstable, or contractually ineligible. Iran is a material example. External AI providers also change models, pricing, APIs, availability, capacity, and policies.

A direct dependency such as `DECIVEXA → Provider SDK/API` would create a cognitive single point of failure and would make provider changes expensive and risky.

DECIVEXA also holds high-value Personal Intelligence, so external AI cannot be treated as the system of record for memory, user models, goals, or decisions.

## Decision

DECIVEXA will implement an independent Intelligence Architecture with these boundaries:

```text
Personal Intelligence Core
        ↓
Context + Capability Layer
        ↓
Policy / Privacy / Risk
        ↓
Intelligence Runtime
        ↓
Model Router
        ↓
Provider Adapters
        ↓
Cloud / Self-hosted / Edge Models
```

### Explicit decisions

1. Domain logic must not directly depend on an AI provider SDK.
2. Capabilities, not vendors, are the product-facing AI abstraction.
3. Provider-specific behavior belongs in adapters.
4. User Model, Memory, Goals, Evidence, and Decision State remain DECIVEXA-owned state.
5. External models receive minimum necessary authorized context.
6. Deterministic policy and authorization remain outside probabilistic model control.
7. Provider failover and graceful degradation are architectural requirements, not optional enhancements.
8. Self-hosted/local execution is an extension point from v1 and may become a production tier later.
9. Core data and useful product behavior must survive AI unavailability.
10. Material architectural changes remain Founder-controlled.

## Rejected Alternatives

### A. Direct OpenAI integration throughout the codebase
Rejected because it creates provider lock-in, regional availability risk, migration cost, and domain coupling.

### B. One cloud provider with a second provider added later
Rejected as insufficient because the data/context boundary and domain abstractions would already be coupled to the first provider.

### C. Fully self-hosted frontier AI from v1
Rejected as disproportionate to v1 cost and operational complexity. The architecture must support it later without requiring it now.

### D. Make the product offline-only
Rejected because frontier cloud intelligence is valuable. DECIVEXA should instead degrade gracefully across multiple intelligence tiers.

### E. Put all intelligence in prompts
Rejected because prompts are not a reliable source of business logic, authorization, data integrity, or long-term product behavior.

## Consequences

### Positive

- Provider replacement is feasible.
- Regional restrictions become a routing/eligibility problem rather than a core product dependency.
- Self-hosted/local intelligence can be introduced incrementally.
- Costs can be optimized by capability and task.
- Personal data remains under DECIVEXA control.
- Future models can improve the product without rewriting its Core.

### Negative / Costs

- More abstraction and engineering effort in v1.
- More testing is required.
- Provider adapters require maintenance.
- Evaluation infrastructure is necessary.
- Resilience adds operational complexity.

These costs are accepted because the architecture is foundational to DECIVEXA's intended long-term product and target market.

## Consequence for Claude Code

Claude Code must treat the AI provider boundary as an architectural constraint. It must not shortcut the abstraction by calling a provider directly from product/domain modules. Any implementation proposal that materially weakens provider independence, privacy boundaries, or deterministic authorization must be surfaced for Founder review before execution.
