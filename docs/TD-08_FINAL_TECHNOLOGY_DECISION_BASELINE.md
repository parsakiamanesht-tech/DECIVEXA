# TD-08 — Final Technology Decision Baseline

## Status
APPROVAL-READY — FOUNDER APPROVAL REQUIRED

## Governing Architecture
- Architecture Baseline: `DECIVEXA-ARCH-FREEZE-001`
- Architecture Version: `1.0.0`
- Technology Gate: `TD-08`
- This baseline does not grant implementation authorization until Founder approval is explicitly recorded.

## Purpose
This document consolidates the technology decisions that are sufficiently justified by the TD-08 evidence review and revision cycle. Technology remains subordinate to the frozen DECIVEXA architecture.

## Final Decision Set

### 1. Web Application
**Decision:** Next.js 16.x + TypeScript.

**Status:** APPROVAL-READY.

**Rule:** Framework-specific UI/application concerns must not own domain truth. Production patch versions are pinned by the implementation lockfile and changed only through compatibility review.

### 2. Mobile Application
**Decision:** Flutter as the future mobile client, using platform-independent domain/API contracts.

**Status:** APPROVAL-READY / IMPLEMENTATION DEFERRED.

Mobile implementation begins only after web/core contracts are executable and mobile offline/resource requirements are verified.

### 3. Backend
**Decision:** NestJS 11.x + TypeScript on Node.js.

**Status:** APPROVAL-READY.

NestJS is an application/runtime mechanism and must not redefine the frozen domain architecture. Production patch versions are lockfile-pinned.

### 4. Authoritative Database
**Decision:** PostgreSQL 18.x stable production line.

**Status:** APPROVAL-READY.

PostgreSQL is authoritative for persistent domain state. Current supported minor release should be used during implementation; the PostgreSQL project currently lists 18.4 as the supported 18.x minor release. PostgreSQL major versions receive five years of support. Evidence: official PostgreSQL versioning policy.

### 5. Cache / Ephemeral Infrastructure
**Decision:** Redis, strictly non-authoritative.

**Status:** APPROVAL-READY.

Permitted uses include cache, rate limiting, transient coordination and queue infrastructure. Loss of Redis must never imply loss of authoritative user data.

### 6. Background Jobs / Queue
**Decision:** Redis-backed queue infrastructure such as BullMQ, behind an internal job abstraction.

**Status:** APPROVAL-READY.

Mandatory semantics:
- at-least-once assumption under failure/redelivery;
- durable domain idempotency keys;
- idempotent handlers;
- database-side deduplication/invariants for critical mutations;
- retry budgets;
- dead-letter handling;
- cancellation;
- observability;
- resource-aware scheduling.

### 7. Search / Retrieval
**Decision:** PostgreSQL-first retrieval foundation, including full-text capabilities and vector-extension capability where justified.

**Status:** APPROVAL-READY / EXPANSION DEFERRED.

A dedicated search/vector platform requires measured evidence that PostgreSQL cannot satisfy latency, relevance, scale, indexing workload, authorization filtering, reliability or cost requirements. Such expansion requires a new TDR and Founder approval when material.

### 8. DECIVEXA AI
**Decision:** Provider-neutral `DECIVEXA AI Gateway`.

**Status:** APPROVAL-READY.

External AI providers are subordinate providers, not DECIVEXA's system of record or authoritative decision authority.

Gateway requirements:
- provider-neutral contract;
- consent and policy evaluation;
- data-classification-aware routing;
- minimization/redaction;
- provider allowlists;
- timeout/cancellation;
- retry and budget controls;
- provenance/model/version recording;
- safe degradation;
- no silent sensitive-data provider switching;
- no direct authoritative domain mutation by providers.

### 9. Agent Runtime
**Decision:** Application-controlled Agent Runtime contract.

**Status:** APPROVAL-READY / ADVANCED DURABLE ORCHESTRATION DEFERRED.

Every agent execution requires scope, permissions, authorization, resource/time budget, cancellation, audit/provenance, deterministic validation and safe failure behavior.

### 10. Secrets / Key Management
**Decision:** Managed cloud secret and KMS infrastructure in production.

**Status:** APPROVAL-READY / VENDOR DEFERRED.

Requirements: no secrets in Git, environment separation, least privilege, rotation, auditable access, encryption at rest/in transit, recovery procedures and practical portability.

### 11. Observability / RUM
**Decision:** OpenTelemetry-compatible telemetry contract with backend selected through cloud evaluation.

**Status:** APPROVAL-READY / BACKEND VENDOR DEFERRED.

Required measurements include UI responsiveness, API latency, AI latency, queue latency, errors/crashes, resource consumption, network quality, continuity/degradation events and privacy-safe RUM. Sensitive user content must not enter telemetry by default.

### 12. Cloud / Deployment
**Decision:** No final cloud vendor is selected in TD-08.

**Status:** DEFERRED BY DESIGN.

Cloud selection is a separate scorecard decision based on data residency, privacy/data ownership, managed PostgreSQL, cache/queue, KMS, backup/DR, observability, reliability, portability/exit strategy, operational burden, total cost, AI connectivity, continuity and security verification.

No cloud may be selected merely because it offers convenient AI services.

## Consolidated Baseline

```text
Web:        Next.js 16.x + TypeScript
Backend:    NestJS 11.x + TypeScript / Node.js
Database:   PostgreSQL 18.x
Cache:      Redis (non-authoritative)
Jobs:       Redis-backed queue / BullMQ behind abstraction
Retrieval:  PostgreSQL-first
AI:         Provider-neutral DECIVEXA AI Gateway
Agents:     Application-controlled Agent Runtime
Secrets:    Managed Secret/KMS infrastructure
Telemetry:  OpenTelemetry-compatible
Cloud:      Deferred to dedicated selection decision
Mobile:     Flutter, implementation deferred
```

## Non-Negotiable Technology Constraints

1. Technology cannot redefine the frozen architecture.
2. PostgreSQL owns authoritative persistent domain state.
3. Redis never owns irreplaceable user truth.
4. Queue delivery is assumed to be at least once under failure.
5. Critical domain mutations must be idempotent and durably deduplicated.
6. AI providers never become authoritative system-of-record components.
7. DECIVEXA AI remains provider-neutral.
8. Sensitive data routing is governed by consent, policy and classification.
9. Agents cannot bypass authorization, validation or audit controls.
10. Infrastructure failure must degrade dependent capabilities without unnecessarily destroying essential Core operations.
11. Observability must obey the same privacy/data-classification discipline as application data.
12. Material technology changes after approval require a new decision record and Founder approval.

## Security Baseline

DECIVEXA technology implementation must preserve the application's data-classification model and documented protection requirements. Sensitive data must have defined controls for encryption, integrity, retention, logging, access control and privacy-enhancing measures. This is consistent with OWASP ASVS 5.0 V14 requirements for identifying/classifying sensitive data and documenting protection requirements.

## Explicit Deferrals

- final cloud vendor;
- exact production AI provider/model routing;
- dedicated search/vector cluster;
- durable multi-day agent orchestration platform;
- production mobile infrastructure details;
- exact performance budgets and capacity sizing.

These are deliberate deferrals, not omissions.

## Gate Result

**TD-08: APPROVAL-READY — FOUNDER APPROVAL REQUIRED.**

No implementation authorization is granted by this document.

## Next Gate

After explicit Founder approval, proceed to **TD-09 — Implementation Readiness & Build Authorization**. TD-09 must verify that the selected technology baseline can be translated into executable contracts, repository structure, CI/CD, environment strategy, migrations, testing, security verification and Cloud deployment planning without altering `DECIVEXA-ARCH-FREEZE-001`.

## Evidence References

- PostgreSQL official versioning policy: supported major/minor release policy and five-year major-version support.
- OWASP ASVS 5.0 V14: sensitive-data classification and documented protection requirements.
- Detailed evidence and prior decisions: `docs/TD-08_TECHNOLOGY_DECISION_RECORDS.md`, `docs/TD-08_TECHNICAL_EVIDENCE_REVIEW.md`, `docs/TD-08_REVISION_PACK_R1-R10.md`.
