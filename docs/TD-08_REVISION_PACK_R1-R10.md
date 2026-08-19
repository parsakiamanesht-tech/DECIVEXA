# TD-08 Revision Pack R1–R10

## Status
REVISION PACK — FOUNDER APPROVAL REQUIRED

## Governing Baseline
- Architecture Baseline: `DECIVEXA-ARCH-FREEZE-001`
- Architecture Version: `1.0.0`
- Technology Gate: `TD-08`
- Source Decision Records: `docs/TD-08_TECHNOLOGY_DECISION_RECORDS.md`
- This document does not grant implementation authorization.

## Revision Objective
Close the material findings from the TD-08 Technical Evidence Review without changing the frozen architecture. Technology decisions remain provisional until explicit Founder approval.

## R1 — Version Evidence Correction
- Correct the NestJS evidence pin from `11.1.24` to the verified current 11.x release at the time of this review.
- Do not freeze patch versions as architecture requirements.
- Record production version policy as: stable supported major/minor line, pinned by lockfile during implementation, upgraded only through compatibility review.
- Next.js remains `16.x` as the provisional major line; PostgreSQL remains `18.x` stable production line.

## R2 — Deterministic Core Technology Boundary
Technology must not own domain truth.
- PostgreSQL is authoritative for persistent domain state.
- NestJS is an application/runtime mechanism.
- Next.js is a presentation/application shell.
- Redis is never authoritative.
- AI providers are never authoritative.
- Queue payloads are commands/work items, not canonical state.

## R3 — Redis Data Classification Contract
Redis may contain only data explicitly classified as ephemeral or reconstructable, including cache entries, rate-limit state, transient coordination state and queue infrastructure metadata.
Redis must not be the sole storage location for Goals, Actions, Progress, Routines, Habits, Personal Constitution, Memory, Audit records, or other authoritative user state.
This rule is mandatory for FIS-060 continuity.

## R4 — Queue Delivery and Idempotency Contract
The queue layer must be designed for redelivery.
- Assume at-least-once execution in failure scenarios.
- Every domain-affecting job requires an idempotency key.
- Domain handlers must be idempotent.
- Critical handlers must use durable database-side deduplication/invariants, not only queue-level job IDs.
- Retry budgets, dead-letter handling, cancellation and observability are mandatory.
- A retry must never duplicate a Progress event, financial mutation, goal state transition or other authoritative side effect.
BullMQ documentation explicitly recommends idempotent jobs for retry-safe execution and supports custom job IDs for duplicate prevention; DECIVEXA therefore requires both queue-level deduplication and domain-level idempotency. [Evidence: docs.bullmq.io]

## R5 — Search/Retrieval Expansion Gate
PostgreSQL-first retrieval remains the provisional decision.
A dedicated search/vector platform may be introduced only when measured evidence demonstrates that PostgreSQL cannot satisfy defined requirements for:
- latency
- relevance
- scale
- indexing workload
- isolation
- operational reliability
- cost
- authorization filtering
Any expansion requires a new Technology Decision Record and Founder approval if material.

## R6 — DECIVEXA AI Gateway Safety Contract
The DECIVEXA AI Gateway is the only approved boundary between Core/Application domains and external AI providers.
Required controls:
- provider-neutral request/response contract
- consent and policy evaluation before routing
- data classification-aware routing
- redaction/minimization
- provider allowlists
- timeout/cancellation
- retry and budget limits
- provenance/model/version recording
- safe degradation when AI is unavailable
- no silent provider switching for sensitive data
- no authoritative domain mutation directly by an AI provider

AI failure must never become data failure, and unavailable intelligence must never be represented as newly generated intelligence.

## R7 — Agent Runtime Safety Contract
Agents remain application-controlled.
Every agent execution must have:
- explicit scope
- permission boundary
- user/policy authorization
- resource/time budget
- cancellation path
- audit/provenance record
- deterministic validation before authoritative mutation
- safe failure behaviour
Provider-managed agent runtimes may be used as subordinate infrastructure only when they can satisfy these contracts; they cannot become the authoritative execution/control layer.

## R8 — Secrets and Key Management Contract
Production secrets and cryptographic keys must use managed secret/KMS infrastructure selected with the cloud decision.
Requirements:
- no secrets in Git
- environment separation
- least privilege
- rotation
- auditable access
- encryption in transit and at rest
- recovery/rotation procedure
- provider portability where practical
Cloud-specific service selection remains deferred to TDR-12.

## R9 — Observability and Privacy Contract
OpenTelemetry-compatible instrumentation remains the neutral telemetry contract.
Observability must measure system health without becoming a new privacy leak.
Required classes include:
- UI responsiveness
- API latency
- AI latency
- queue latency
- errors/crashes
- resource consumption
- network quality
- continuity/degradation events
- security events
Sensitive user content must not be placed in telemetry by default. Logging and telemetry classification must follow the same protection model as application data.
OWASP ASVS 5.0 requires sensitive data to be identified/classified and protection requirements to cover encryption, integrity, retention, logging and access control; it also requires controls against leakage to untrusted parties and inappropriate caching. citeturn0search0turn0search4

## R10 — Cloud Selection Scorecard
Cloud selection remains deferred, but the evaluation contract is now fixed.
Candidate cloud classes must be scored on:
1. data residency and regional availability
2. privacy and data ownership
3. managed PostgreSQL quality
4. Redis/queue capability
5. secrets/KMS
6. backup and disaster recovery
7. observability
8. availability/reliability
9. portability and exit strategy
10. operational burden
11. total cost at projected stages
12. AI/provider connectivity
13. offline/continuity support
14. security verification support
No cloud vendor may be selected merely because it offers convenient AI services. The frozen DECIVEXA architecture and FIS-058/FIS-060 requirements remain authoritative.

## Cross-Cutting Security Rule
Technology choices must preserve the application's data-classification model. Sensitive data must have documented protection requirements covering encryption, integrity, retention, logging, access control and privacy-enhancing controls. citeturn0search0turn0search10

## Cross-Cutting Continuity Rule
No infrastructure component may become a hidden single point of failure for essential user operations.
AI outage, Redis outage, queue outage, search outage or provider outage must degrade only dependent capabilities while preserving authoritative Core operations where architecturally possible.

## Evidence Notes
- BullMQ documents that jobs can be delivered at least once in failure cases and recommends idempotent job design for safe retries. citeturn0search3turn0search2
- BullMQ custom job IDs can prevent duplicate enqueueing while the job remains present, but this alone is insufficient as a domain correctness mechanism because removed jobs no longer provide duplicate protection. citeturn0search1turn0search5
- OWASP ASVS 5.0 identifies data classification as a prerequisite for selecting appropriate protection controls and requires documented controls for sensitive data. citeturn0search0turn0search4

## Explicitly Unchanged
- Architecture Baseline remains `DECIVEXA-ARCH-FREEZE-001`.
- No new architecture layer is introduced.
- PostgreSQL remains the provisional authoritative store.
- Redis remains non-authoritative.
- Provider-neutral DECIVEXA AI Gateway remains mandatory.
- Final cloud selection remains deferred.
- Dedicated search/vector infrastructure remains deferred.
- Durable long-running agent orchestration remains deferred.

## Gate Status
**TD-08 Revision Pack: COMPLETE — pending TD-08 Re-Review and Founder approval.**

## Next Step
Perform TD-08 Re-Review against the source TDRs and this revision pack. If all material findings are closed, produce the final approval-ready Technology Decision baseline. No implementation authorization is granted by this revision pack.
