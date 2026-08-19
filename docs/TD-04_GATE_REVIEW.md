# TD-04 Gate Review — Data & Runtime Contracts

**Repository:** `parsakiamanesht-tech/DECIVEXA`  
**Review Date:** 2026-08-19  
**Status:** **PASS WITH REQUIRED REVISIONS**  
**Authority:** Founder-controlled  
**Reviewed Artifact:** `docs/TD-04_DATA_RUNTIME_CONTRACTS.md`  
**Next Architectural Artifact:** TD-05 — Goal → Path → Multi-Option Decision Architecture

---

## 1. Executive Decision

TD-04 is architecturally strong enough to serve as the canonical contract foundation for the next design stage, but it should **not yet be marked fully passed**.

The contract already establishes the critical separation between authoritative state, events, evidence, intelligence artifacts, memory, projections and runtime state; it also defines the Deterministic Core / Intelligence boundary, AI Gateway, Agent Runtime, Context Fusion, offline continuity, provenance, freshness and versioning. These are the correct foundations for DECIVEXA's philosophy and FIS architecture.

However, several cross-cutting contracts need to be made more explicit before the document is treated as a complete implementation-facing contract baseline.

**Gate recommendation:** PASS WITH REQUIRED REVISIONS.

This decision does **not** authorize production implementation.

---

## 2. Evidence Reviewed

TD-04 explicitly defines itself as implementation-independent and Founder-controlled, and states that it does not authorize physical schemas or production implementation.

It defines canonical ownership, commands, state transitions, events, evidence/provenance, Human Model claims, paths, projections, intelligence artifacts, memory, Personal Constitution runtime rules, jobs, idempotency, concurrency, offline/sync, failure semantics, AI Gateway, agents, observability, freshness, lifecycle, compatibility and architectural invariants.

The contract hierarchy places TD-04 below Founder decisions, the Architecture Constitution, the product/philosophy baseline, FIS Registry, phase specifications, TD-02 and TD-03. This preserves architectural authority ordering.

---

## 3. Gate Criteria

### 3.1 Domain Ownership — PASS

TD-04 correctly identifies authoritative aggregates and explicitly rejects both accidental aggregate splitting and a single giant user aggregate.

This is consistent with DECIVEXA's modular Personal OS architecture.

### 3.2 State / Event Separation — PASS

Commands, authoritative state and historical events are clearly separated. Events are defined as facts rather than opinions, and AI output cannot directly become authoritative state.

This is a strong foundation for auditability and deterministic runtime behavior.

### 3.3 Evidence & Provenance — PASS

Evidence distinguishes user-stated, observed, measured, imported and system-generated observations. Derived claims require provenance and confidence.

This directly supports Evidence Before Opinion.

### 3.4 Living Human Model — PASS

The Human Model contract is one of the strongest sections. It explicitly supports epistemic type, evidence references, confidence, validity, verification, contradiction, supersession and model versioning.

It also explicitly prevents a weak observation from becoming a permanent trait and preserves historical model versions.

This is sufficient to structurally support FIS-036, FIS-057 and the Living Personal Model principle.

### 3.5 Individualized Path Architecture — PASS

The Path Contract supports versioning, assumptions, stages, dependencies, resources, constraints, risks, trade-offs, confidence, adaptation rules, selection and supersession.

This is compatible with TD-05's principle that a goal does not prescribe a universal route.

### 3.6 Intelligence / AI Boundary — PASS

The AI Gateway, Intelligence Artifact Contract and Intelligence-to-Core Boundary correctly establish:

`Evidence → Intelligence → Proposal → Policy/Validation → Command → Deterministic Core → Authoritative State/Event`

This prevents AI from becoming an implicit source of truth.

### 3.7 AI-Independent Continuity — PASS

The Deterministic Core, offline/sync contract and failure semantics explicitly support FIS-060.

AI failure is separated from data failure, and unavailable/stale intelligence must not be represented as fresh intelligence.

### 3.8 Security & Privacy Foundation — CONDITIONAL PASS

Least-privilege access, sensitivity, authorization context, purpose limitation, permission-aware projections, auditability and AI context gating are present.

However, the contract should explicitly define the canonical consent/permission lifecycle and the full data-classification policy rather than leaving these concepts distributed across higher-level architecture.

### 3.9 Performance / Resource Governance — CONDITIONAL PASS

Runtime jobs have priority and resource class, and resource pressure is required to degrade nonessential intelligence before core operation.

However, FIS-059 requires more explicit performance-contract semantics: performance budgets, client responsiveness requirements, cache/readiness expectations and measurable SLO/RUM boundaries.

These should be added before implementation gates.

### 3.10 Offline / Recovery — PASS

Offline actions are durable, pending state is explicit, synchronization is retry-safe and recovery must not rewrite history.

This is aligned with FIS-060.

### 3.11 Versioning / Compatibility — PASS

Contracts, events, model versions and path revisions have explicit versioning concepts and breaking changes require explicit versioning.

### 3.12 Agent Governance — PASS

Agents require explicit capability, purpose, scope, allowed action, resource budget, authorization and policy. Agents cannot bypass domain ownership, security, consent or deterministic transitions.

---

## 4. Required Revisions Before Full PASS

### R1 — Canonical Consent Contract

Add a dedicated consent/permission contract covering:

- grant;
- deny;
- revoke;
- expiration;
- purpose limitation;
- scope;
- source;
- user visibility;
- audit record;
- downstream propagation;
- emergency/privacy-lock behavior.

Consent must be represented as authoritative security state, not merely UI configuration.

### R2 — Canonical Data Classification Contract

Define the canonical classification vocabulary and handling rules for at least:

- Public;
- Personal;
- Sensitive;
- Highly Sensitive;
- Critical Personal Intelligence.

Also define how derived intelligence can receive a higher sensitivity classification than its source data.

### R3 — User Data Sovereignty Contract

Make explicit contracts for:

- export;
- correction;
- deletion;
- memory deletion/correction;
- access review;
- integration disconnect;
- visibility into model claims and evidence;
- retention/expiration.

### R4 — FIS-059 Performance Contract

Add implementation-independent performance semantics for:

- perceived readiness;
- interaction latency;
- navigation responsiveness;
- progressive intelligence;
- cache/read-model expectations;
- background workload isolation;
- device/resource constraints;
- RUM telemetry;
- performance budgets/SLO placeholders.

Exact numeric thresholds may remain deferred to the Technical Performance Specification.

### R5 — Safe Mode / Continuity Contract

TD-04 covers AI failure and offline continuity well, but Safe Mode should become an explicit runtime state with:

- activation triggers;
- preserved capabilities;
- restricted capabilities;
- user visibility;
- exit/recovery rules;
- audit semantics.

### R6 — Context Fusion Governance Detail

The Context Fusion Contract should explicitly define:

- minimum sufficient context;
- relevance scoring/selection policy;
- sensitivity propagation;
- freshness requirements;
- conflicting signals;
- confidence aggregation;
- refusal when context is insufficient.

Context Fusion must never become a hidden mechanism for collecting the user's entire life context.

---

## 5. Architectural Risk Review

### High Risk — none identified

No fundamental contradiction was found between TD-04 and the established DECIVEXA architecture.

### Medium Risk

1. Consent semantics could remain underspecified if not promoted into a canonical contract.
2. Performance could become implementation-dependent if FIS-059 budgets remain outside TD-04.
3. Context Fusion could become over-broad if minimum-sufficient-context rules are not formalized.
4. Safe Mode could be implemented inconsistently across modules if it remains implicit.

### Low Risk

The remaining gaps are mostly specification-depth gaps rather than architectural-direction problems.

---

## 6. Non-Negotiable Invariants Confirmed

The review confirms the following principles as compatible with TD-04:

- One authoritative owner per domain truth.
- Commands request change; events record accepted facts.
- Raw evidence is not derived intelligence.
- AI output is never authoritative merely because AI produced it.
- Projections are not sources of truth.
- Cross-domain access is permission-aware.
- No direct cross-domain writes.
- Consequential operations are retry-safe.
- Stale writes cannot silently overwrite newer consequential state.
- Offline actions are durable.
- AI failure does not equal data failure.
- Stale intelligence is never represented as fresh intelligence.
- Historical events are not silently rewritten.
- Human Model revisions preserve evidence and history.
- Memory corrections preserve provenance.
- Sensitive access is least-privileged and auditable.
- Agents cannot bypass governance.
- Context Fusion cannot bypass privacy boundaries.
- Deterministic Core remains functional without continuous AI.
- Material architectural changes remain Founder-controlled.

---

## 7. Relationship to TD-05

TD-05 can proceed as the next architectural design artifact **in parallel with completion of the required TD-04 revisions**, but no physical schema or production implementation should be authorized on the assumption that TD-04 is already fully passed.

TD-05 depends on the contracts for:

`Goal + Living Human Model + Evidence + Constraints + Resources + Risk + Path Versioning + Intelligence Artifacts + User Confirmation + Adaptive Runtime`

TD-04 provides these primitives at the conceptual contract level.

---

## 8. Gate Result

**TD-04: PASS WITH REQUIRED REVISIONS**

### Conditions for FULL PASS

R1–R6 must be incorporated into TD-04 or explicitly delegated to a higher-authority technical specification with a clear normative reference.

After those revisions, TD-04 can be re-reviewed for **FULL PASS**.

Until then:

**No physical database schema authorization.**  
**No production implementation authorization.**  
**No silent architectural changes.**

---

## 9. Next Step

The next controlled action is:

**TD-04 Revision Pack → Re-review → FULL PASS Gate → TD-05 Deep Design.**

The architecture remains Founder-controlled throughout.
