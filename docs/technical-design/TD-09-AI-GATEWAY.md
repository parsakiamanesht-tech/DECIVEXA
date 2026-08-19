# TD-09 — AI Gateway Contract

**Status:** Proposed technical contract

## Objective

Make AI provider use privacy-controlled, capability-based, replaceable and auditable.

## Required boundary

All external model access MUST pass through a DECIVEXA-controlled AI Gateway. Product/domain code MUST NOT directly call a provider with unrestricted user context.

## Gateway responsibilities

- capability routing;
- provider abstraction;
- health/failover policy;
- consent and data-boundary checks;
- minimum-necessary context selection;
- provider-specific restrictions;
- safety/policy enforcement;
- timeout/retry/circuit-breaker behavior;
- audit metadata without sensitive payload leakage;
- deterministic fallback when AI is unavailable.

## Provider independence

Provider choice MUST be an implementation detail behind the gateway. A provider outage, pricing change or model replacement MUST NOT require rewriting the Personal OS domain architecture.

## Privacy rule

Sensitive Personal Intelligence MUST NOT leave DECIVEXA unless an explicit policy/consent path permits it. Even when permitted, only minimum necessary context may be sent.

## Capability routing

Each AI-dependent capability MUST declare its minimum model requirements, data scope, latency tolerance, failure behavior and whether AI is required, helpful or optional.

## Acceptance criteria

- No feature can silently bypass the gateway.
- Provider replacement does not change domain ownership.
- Consent and sensitivity checks occur before external transmission.
- Provider failures have deterministic behavior.
- Logs do not become a secondary sensitive-data store.
