# TD-08 — Technology Decision Records

## Status
DECISION RECORD DRAFT — FOUNDER APPROVAL REQUIRED

## Governing Baseline
- Architecture Baseline: `DECIVEXA-ARCH-FREEZE-001`
- Architecture Version: `1.0.0`
- Technology Gate: `TD-08`
- No implementation authorization is granted by this document.

## Decision Method
Technology is selected against the frozen architecture, not used to redefine it. Each recommendation is provisional until evidence review and explicit Founder approval. Version pins are intentionally expressed as production-safe ranges rather than unstable future versions.

## Evidence snapshot
- Next.js 16.2.9 is the current latest release surfaced by the official repository; the official App Router documentation emphasizes Server Components, Suspense, Server Functions, prefetching, prerendering and client-side navigation. [Official sources: nextjs.org/docs/app; github.com/vercel/next.js]
- NestJS 11.1.24 is the current latest release surfaced by the official repository and remains a TypeScript/Node.js framework designed for scalable server-side applications. [Official source: github.com/nestjs/nest]
- PostgreSQL 18 is the current major stable release; PostgreSQL 19 is still beta as of July 2026 and should not be selected for production baseline. PostgreSQL 18.4 was released May 14, 2026. [Official source: postgresql.org]
- OpenAI provides the Responses API with tool use and streaming capabilities. [Official source: platform.openai.com/docs]
- Anthropic provides the Claude API and managed-agent infrastructure through its API platform. [Official source: platform.claude.com/docs]

## TDR-01 — Web Application
**Provisional decision:** Next.js 16 + TypeScript.

**Why:** Aligns with the approved web architecture, supports progressive rendering and client/server boundaries, and provides mature navigation optimization. App Router is particularly aligned with FIS-059 because navigation and rendering can be designed without global blocking.

**Alternatives:** React + Vite, Remix/React Router, other React meta-frameworks.

**Risks:** Framework coupling and rapid major releases.

**Mitigation:** Keep domain logic outside framework-specific UI code; use framework only as presentation/application shell.

**Version policy:** Next.js 16.x; Node.js >=20.9 according to current Next.js requirements. Upgrade only through a compatibility review.

**Founder approval:** PENDING

## TDR-02 — Mobile
**Provisional decision:** Flutter for the future mobile client, with a platform-independent domain contract.

**Why:** Cross-platform delivery, strong client rendering model, and a practical path to offline-first essential operations.

**Alternatives:** React Native, native iOS/Android.

**Deferral:** Mobile implementation remains deferred until web/core contracts are executable and mobile-specific offline/resource requirements are verified.

**Founder approval:** PENDING

## TDR-03 — Backend Runtime / Framework
**Provisional decision:** NestJS 11 + TypeScript on Node.js.

**Why:** Strong module boundaries, dependency injection, guards/interceptors, testing conventions and alignment with the existing approved architectural direction.

**Alternatives:** Express, Fastify directly, Go, .NET, Python/FastAPI.

**Constraint:** NestJS is an implementation mechanism; it must not become the owner of domain architecture.

**Founder approval:** PENDING

## TDR-04 — Primary Data Store
**Provisional decision:** PostgreSQL 18.x stable production line.

**Why:** Authoritative transactional state requires ACID transactions, concurrency control, mature indexing, JSON support, backup/recovery ecosystem and portability. PostgreSQL 19 beta is explicitly excluded from production baseline until GA and verification.

**Alternatives:** MySQL, SQL Server, managed distributed SQL, document databases.

**Additional direction:** Vector/retrieval needs should first be evaluated as PostgreSQL extensions/capabilities before introducing a separate vector database.

**Founder approval:** PENDING

## TDR-05 — Cache / Ephemeral State
**Provisional decision:** Redis, used strictly as non-authoritative ephemeral infrastructure.

**Why:** Suitable for caching, rate limiting, short-lived coordination and selected ephemeral state.

**Hard rule:** Redis loss must never equal loss of authoritative user data.

**Alternatives:** In-process cache, Memcached, database-backed cache.

**Founder approval:** PENDING

## TDR-06 — Background Jobs / Queue
**Provisional decision:** Redis-backed queue infrastructure (BullMQ or equivalent) behind an internal job abstraction.

**Why:** Practical fit with NestJS/Node ecosystem and supports retries, delayed jobs, concurrency and background intelligence.

**Required controls:** idempotency keys, retry budgets, dead-letter handling, cancellation, resource-aware scheduling and observability.

**Alternatives:** RabbitMQ, Kafka, cloud-native queues, database-backed jobs.

**Founder approval:** PENDING

## TDR-07 — Search / Retrieval
**Provisional decision:** PostgreSQL full-text/search capabilities plus vector extension capability as the initial retrieval foundation; defer a dedicated search cluster until measured requirements justify it.

**Why:** Minimizes operational complexity and data duplication while preserving authorization boundaries. A dedicated engine becomes justified only when scale/latency/relevance requirements exceed the database approach.

**Alternatives:** OpenSearch/Elasticsearch, dedicated vector databases, hosted retrieval services.

**Founder approval:** PENDING

## TDR-08 — DECIVEXA AI / AI Gateway
**Provisional decision:** Build a provider-neutral DECIVEXA AI Gateway before committing to any model provider.

**Provider candidates:** OpenAI, Anthropic, and additional providers evaluated per workload.

**Why:** AI is an intelligence layer, not the system of record. Provider replacement must be possible without changing Core OS contracts.

**Required gateway capabilities:** model routing, structured outputs, policy enforcement, consent checks, redaction, timeout/cancellation, retries, cost budgets, observability, provenance, fallback and safe degradation.

**Security rule:** sensitive data must not be routed to another provider merely because a primary provider is unavailable; policy and consent govern routing.

**Founder approval:** PENDING

## TDR-09 — Agent Runtime
**Provisional decision:** Application-controlled agent execution behind an internal Agent Runtime contract; do not make a provider-managed agent runtime the authoritative execution layer.

**Why:** Preserves scoped permissions, auditability, deterministic guardrails, budgets, cancellation and resource-aware scheduling.

**Alternatives:** provider-managed agents, workflow engines, Temporal-style durable execution, custom workers.

**Deferral:** durable multi-day agent execution engine requires a later measured workload decision.

**Founder approval:** PENDING

## TDR-10 — Secrets / Key Management
**Provisional decision:** Cloud-managed secret/key management in production; local development uses environment injection and non-production credentials only.

**Hard rules:** no secrets in Git; key rotation; least privilege; separate environments; audit access; encryption at rest and in transit.

**Candidates:** cloud-native secret managers, Vault-class systems, managed KMS.

**Cloud-specific selection:** deferred until TDR-12.

**Founder approval:** PENDING

## TDR-11 — Observability / RUM
**Provisional decision:** OpenTelemetry-compatible instrumentation as the neutral telemetry contract, with managed backend selected after cloud evaluation.

**Why:** Avoids hard coupling to one observability vendor and supports traces, metrics and logs across web/backend/AI workers.

**Required measurements:** UI responsiveness, navigation latency, API latency, AI latency, queue latency, error rate, crash rate, memory/CPU, battery where available, network quality, and privacy-safe RUM.

**Founder approval:** PENDING

## TDR-12 — Cloud / Deployment
**Provisional decision:** Defer final cloud provider selection until the preceding technology decisions and regional/privacy requirements are fully evaluated.

**Candidate classes:** AWS, GCP, Azure, and carefully evaluated regional/managed alternatives.

**Required criteria:** data residency, privacy, managed PostgreSQL quality, queue/cache options, secret management, observability, backup/recovery, portability, cost, regional availability and operational burden.

**Hard rule:** cloud choice must not create a new architecture dependency that violates FIS-060 AI-independent continuity or FIS-058 data ownership/privacy.

**Founder approval:** PENDING

## Cross-Cutting Decision
The strongest current baseline is intentionally boring in the deterministic core:

`Next.js + TypeScript → NestJS + TypeScript → PostgreSQL 18`

with Redis/queue and retrieval infrastructure introduced only where justified, and a provider-neutral `DECIVEXA AI Gateway` above the deterministic core.

This is a **provisional technical recommendation**, not an implementation authorization.

## Explicit Deferrals
- Final cloud vendor
- Production AI provider/model routing policy
- Dedicated vector/search cluster
- Durable long-running agent orchestration platform
- Mobile production architecture details
- Exact performance budgets
- Exact infrastructure sizing

## Gate Status
**TD-08: CONDITIONAL — TDRs CREATED; FOUNDER APPROVAL AND FINAL EVIDENCE REVIEW REQUIRED.**

## Next Step
Perform a focused technical evidence review of each provisional decision, then produce final approval-ready Decision Records. Only after material decisions are approved may TD-09 Implementation Readiness & Build Authorization proceed.
