# TD-08 — Technical Evidence Review

## Status
CONDITIONAL PASS — EVIDENCE REVIEW COMPLETE; CORRECTIONS REQUIRED BEFORE FINAL TECHNOLOGY APPROVAL

## Scope
This review evaluates the provisional Technology Decision Records against current official-source evidence and the frozen DECIVEXA architecture. It does not authorize implementation or Founder approval.

## Findings

### TDR-01 — Web Application
**Decision:** PASS WITH MINOR REVISION.

Next.js 16.2.9 is confirmed as the latest stable release surfaced by the official Next.js repository at review time. The official App Router documentation confirms Server Components, Suspense, Server Functions, prefetching, prerendering and client-side navigation. The performance rationale for FIS-059 is therefore technically credible. The record should, however, avoid treating framework navigation features as a substitute for DECIVEXA's own performance budgets.

**Required correction:** preserve Next.js 16.x as a provisional range and explicitly require a performance acceptance test before production.

### TDR-02 — Mobile
**Decision:** CONDITIONAL.

Flutter remains a reasonable provisional choice, but this review did not establish enough DECIVEXA-specific evidence to freeze Flutter as the production mobile architecture. Offline-first behavior, secure local storage, background sync, battery/resource constraints and platform-specific security must be validated before mobile implementation.

**Required correction:** keep Flutter provisional and deferred.

### TDR-03 — Backend
**Decision:** PASS WITH REVISION.

NestJS 11 remains aligned with the architecture. However, the TDR evidence snapshot is stale: the official NestJS release page currently surfaces v11.1.28, not v11.1.24.

**Required correction:** replace the exact version statement with a compatibility-tested 11.x range or update the snapshot to 11.1.28; do not pin a version merely because it was previously observed.

### TDR-04 — Primary Database
**Decision:** PASS.

PostgreSQL 18 is the current stable major line and PostgreSQL 18.4 is the current minor release shown by the official PostgreSQL documentation. PostgreSQL 19 remains a development/beta line at the time of review, so excluding it from the production baseline is correct. PostgreSQL 18 also provides features relevant to DECIVEXA, including improved asynchronous I/O and uuidv7 support.

**Required correction:** state `PostgreSQL 18.x, current supported minor` rather than treating 18.4 as a permanent pin.

### TDR-05 — Cache / Ephemeral State
**Decision:** CONDITIONAL PASS.

Redis is technically suitable for cache, rate limiting and ephemeral coordination. The architectural hard rule that Redis is never authoritative is correct.

**Required correction:** define the exact allowed Redis data classes and TTL policy during implementation readiness. No domain state may silently acquire Redis-only durability.

### TDR-06 — Background Jobs / Queue
**Decision:** PASS WITH REVISION.

BullMQ provides retries, backoff, delayed jobs, concurrency and worker scaling, which directly support the proposed job abstraction. Official BullMQ documentation also states that delivery is at-least-once in the worst case, so DECIVEXA must not assume exactly-once execution semantics.

**Required correction:** explicitly require idempotent handlers, deduplication keys and transaction/outbox coordination where a job changes authoritative state.

### TDR-07 — Search / Retrieval
**Decision:** CONDITIONAL PASS.

Starting with PostgreSQL search/retrieval capabilities is architecturally conservative and reduces unnecessary operational complexity. However, the exact vector/search extension and relevance strategy should remain an implementation-readiness decision based on measured corpus size, latency, filtering and authorization requirements.

**Required correction:** do not freeze a specific vector extension yet.

### TDR-08 — DECIVEXA AI / AI Gateway
**Decision:** PASS AS ARCHITECTURAL DIRECTION; PROVIDER DECISION DEFERRED.

The provider-neutral gateway is strongly consistent with FIS-060. The gateway must own policy, consent, routing, provenance, budgets, cancellation, retries and safe degradation. Provider availability must never bypass privacy policy.

**Required correction:** create a separate AI Provider Evaluation Record before selecting a production provider/model. Provider-specific agent infrastructure must remain subordinate to DECIVEXA's Agent Runtime contract.

### TDR-09 — Agent Runtime
**Decision:** CONDITIONAL PASS.

Application-controlled execution is the correct architectural direction. The evidence is insufficient to select a durable orchestration platform now.

**Required correction:** keep durable multi-day orchestration deferred until real workload characteristics are known.

### TDR-10 — Secrets / Key Management
**Decision:** CONDITIONAL PASS.

Cloud-managed secrets/KMS is appropriate for production, but the final service depends on the cloud decision.

**Required correction:** define provider-neutral secret/key-management requirements first; select the concrete service only in TDR-12.

### TDR-11 — Observability / RUM
**Decision:** PASS AS CONTRACT; BACKEND DEFERRED.

OpenTelemetry-compatible instrumentation is a suitable neutral contract. The concrete telemetry backend should remain cloud/vendor independent until deployment requirements are known.

**Required correction:** add explicit privacy constraints for RUM and AI telemetry, including prohibition on capturing sensitive prompt/content payloads by default.

### TDR-12 — Cloud / Deployment
**Decision:** DEFERRED CORRECTLY.

The record correctly avoids prematurely selecting AWS/GCP/Azure. Final selection must evaluate data residency, regional availability, managed PostgreSQL, cache/queue, secrets, observability, backup/recovery, portability, cost and operational burden.

**Required correction:** add a DECIVEXA-specific cloud scorecard before Founder approval.

## Cross-Cutting Findings

1. **Architecture remains stable.** No technology decision requires changing `DECIVEXA-ARCH-FREEZE-001`.
2. **Core remains deterministic.** PostgreSQL is authoritative; Redis is not.
3. **AI remains an intelligence layer.** No provider is allowed to become the system of record.
4. **Continuity remains preserved.** Technology choices must support FIS-060 rather than making AI or cloud availability a prerequisite for core operation.
5. **Provider lock-in is controlled but not eliminated.** Gateway contracts and internal Agent Runtime are mandatory.
6. **Version evidence needs maintenance.** Exact observed versions must not be mistaken for permanent production pins.
7. **Exactly-once assumptions are prohibited.** Queue handlers must be idempotent.
8. **Security and privacy remain architecture constraints, not implementation afterthoughts.**

## Current Provisional Baseline

`Next.js 16.x + TypeScript → NestJS 11.x + TypeScript → PostgreSQL 18.x`

with Redis/BullMQ introduced as non-authoritative infrastructure and a provider-neutral DECIVEXA AI Gateway above the deterministic core.

## Gate Decision
**TD-08 remains CONDITIONAL.**

The technology direction is sufficiently strong to proceed to a final Decision Record revision, but exact production versions, provider selection, cloud selection, vector/search implementation, durable agent orchestration and infrastructure sizing remain intentionally unresolved.

## Required Next Step
Produce **TD-08 Revision Pack** incorporating the evidence corrections above, then perform a final TD-08 re-review. Founder approval remains required before implementation authorization.
