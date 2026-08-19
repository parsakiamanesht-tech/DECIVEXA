# TD-05 — Performance Budget Contract

**Status:** Proposed technical contract

## Objective

Make fluidity measurable rather than aspirational while preserving the product principle that deep intelligence must remain invisible to the user.

## Budget categories

The final numeric budgets MUST be baselined per supported device class and network tier. The contract covers:

- tap/input response;
- navigation/readiness;
- first meaningful UI;
- scrolling and animation/frame stability;
- API latency;
- AI response latency;
- background job impact;
- memory/CPU;
- battery impact;
- offline and degraded-network behavior.

No universal numeric threshold is invented here before device/user baselines are measured. The first implementation task is to establish evidence-backed budgets.

## Architectural rules

- interaction MUST receive immediate local/cached response where feasible;
- heavy intelligence MUST be asynchronous and non-blocking;
- independent feature failures MUST NOT create global loading/freeze states;
- precomputation/caching SHOULD be used where predictable;
- resource-aware scheduling MUST constrain concurrent intelligence/agents;
- mobile CPU/RAM/battery are release considerations, not post-release cleanup.

## Monitoring

Real User Monitoring MUST capture meaningful performance signals across representative device classes, network conditions and app states. Developer-machine performance is insufficient evidence.

## Performance gate

A feature is not complete when it materially violates its approved budget without an approved exception/ADR.

## Acceptance criteria

- Numeric budgets exist before performance-critical implementation is declared complete.
- Performance is tested on representative weaker devices.
- Background intelligence does not block core interaction.
- Degraded network does not unnecessarily freeze the product.
- Monitoring can detect regressions after release.
