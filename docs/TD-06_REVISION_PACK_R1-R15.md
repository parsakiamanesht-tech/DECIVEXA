# TD-06 Revision Pack — R1–R15

## Gate
TD-06 — Technical Design / Executable Contract

## Status
CONDITIONAL PASS → REVISION REQUIRED

This revision pack closes the fifteen gaps identified during TD-06 Technical Review. It is a design artifact only and does not authorize implementation.

## R1 — Authoritative State Boundary
Define one authoritative source of truth for each mutable domain state. Read models, caches, local replicas, AI artifacts and derived projections MUST NOT silently become authoritative. Every state transition MUST identify its authority and synchronization relationship.

## R2 — Command / Event / Transaction Contract
Separate intent (command), committed state transition (event), and derived projection. State-changing operations MUST execute atomically within the appropriate transaction boundary. Events MUST represent committed facts, not speculative AI output.

## R3 — Concurrency & Versioning
Mutable entities MUST carry version/concurrency metadata sufficient to prevent lost updates. Concurrent writes MUST use optimistic concurrency or an explicitly justified equivalent. Path, Goal and Personal Model changes MUST preserve lineage.

## R4 — Consent & Policy Decision Contract
Sensitive access MUST pass through a central policy decision boundary. A request must be evaluated by actor, capability, purpose, requested data, sensitivity, consent, scope and duration. Denials MUST be enforceable server-side and auditable without leaking sensitive payloads.

## R5 — Data Classification Enforcement
The FIS-058 classification levels are architectural enforcement inputs, not documentation labels. Storage, transport, caching, logging, AI transmission, export and deletion behavior MUST be determined by data classification.

## R6 — Intelligence Artifact Lifecycle
Every derived intelligence artifact MUST have source references, creation time, model/method identity where applicable, confidence, status, sensitivity, validity/review state and lineage. Intelligence may expire, be superseded or be invalidated without rewriting historical facts.

## R7 — AI Gateway Safety
All external AI processing MUST pass through the DECIVEXA AI Gateway/Privacy Gateway. The gateway MUST enforce provider policy, data minimization, consent, classification, redaction/transform rules, timeouts, retry limits and provider isolation. Provider failure MUST NOT corrupt authoritative state.

## R8 — Memory / Personal Model Contradiction Handling
Contradictory memories and model hypotheses MUST coexist as versioned evidence until resolved. The system MUST distinguish user-confirmed facts, observed behavior and system inference. A newer inference MUST NOT silently overwrite a prior user-confirmed fact.

## R9 — Offline Sync Conflict Contract
Offline writes MUST be durable locally, uniquely identifiable and replayable. Synchronization MUST define idempotency, ordering, conflict detection and resolution. Conflicts MUST never silently discard user-created data.

## R10 — Performance Measurement Contract
Performance requirements MUST be measurable. Define budgets and telemetry for interaction latency, navigation, rendering/frame stability, API latency, AI latency, memory, CPU, battery and network degradation. Performance failures MUST have explicit ownership and thresholds in the later Technical Performance Specification.

## R11 — Audit Integrity
Security and consequential decision audit records MUST be append-oriented, integrity-protected and access-controlled. Logs MUST contain enough metadata to establish who/what/when/why/which capability was used without storing sensitive payloads unnecessarily.

## R12 — Delete / Export Semantics
User deletion and export MUST operate across raw data, derived intelligence, memory, projections, caches, local replicas and provider-held data where contractually possible. Deletion MUST define tombstone/propagation semantics so deleted data cannot silently reappear through synchronization or derived artifacts.

## R13 — API Capability Boundaries
APIs MUST expose capabilities rather than unrestricted domain access. Each endpoint/use-case MUST define actor, authorization capability, purpose, input classification, output classification, rate/size limits and side effects. Internal services MUST not bypass these boundaries merely because they are trusted infrastructure.

## R14 — Resource-Aware Intelligence Scheduling
AI/agent/background work MUST be scheduled against available CPU, memory, battery, network, latency and task criticality. Work MUST have priority, budget, cancellation and degradation policies. Intelligence workload MUST never be allowed to starve core user interaction or deterministic operations.

## R15 — Safe Mode Contract
Safe Mode MUST have explicit entry conditions, preserved capabilities, restricted capabilities, data-access rules, user-visible status and recovery behavior. AI outage, degraded infrastructure, security incidents and severe resource constraints MUST degrade intelligence before compromising core user functionality.

## Cross-Cutting Requirements
- Evidence Before Opinion.
- No fabricated certainty.
- AI is not authoritative over committed user data.
- No silent history rewriting.
- User agency remains authoritative for consequential decisions.
- Privacy boundaries apply to derived intelligence, not only raw data.
- Core deterministic operation remains independent of continuous AI availability.
- Performance and security are architectural properties.
- Every consequential derived artifact must remain traceable to evidence and method.

## Required TD-06 Re-Review Checks
The next review MUST verify each R1–R15 against the TD-06 base contract and confirm consistency with TD-02–TD-05, FIS-057, FIS-058, FIS-059, FIS-060, Personal Intelligence Core and Living Personal Model.

The review MUST also determine whether the resulting contract is sufficiently precise to become an Implementation Contract without inventing missing architecture.

## External Security Alignment
Security design should be evaluated against current OWASP ASVS requirements appropriate to DECIVEXA's sensitivity profile, including data classification/protection, cryptographic inventory and key management, secure configuration, access control, logging and API/service boundaries. ASVS 5.0 explicitly emphasizes architectural treatment of sensitive-data classification and protection requirements, and recommends documented key lifecycle and secure key-management controls.

## Gate Boundary
R1–R15 close the identified review gaps at the design-contract level. They do NOT authorize coding, cloud deployment, database migration, provider integration or production infrastructure.

Final authorization requires TD-06 Re-Review → Founder approval → Architecture Freeze → Implementation Contract / Build Gate.
