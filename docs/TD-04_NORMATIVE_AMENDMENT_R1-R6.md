# TD-04 — Normative Amendment R1–R6

**Status:** ACCEPTED NORMATIVE AMENDMENT
**Parent:** `docs/TD-04_DATA_RUNTIME_CONTRACTS.md`
**Revision Pack:** `docs/TD-04_REVISION_PACK_R1-R6.md`
**Authority:** Founder-controlled
**Effect:** These clauses are normative extensions of TD-04 and must be treated as part of the TD-04 contract baseline for all subsequent technical design and implementation gates.

> This amendment closes the six gaps identified in the original TD-04 Gate Review. It does not authorize implementation by itself.

## R1 — Canonical Consent & Permission Contract

Consent is authoritative security state, not UI configuration.

A consent grant must conceptually identify: subject/user, data scope, capability/purpose, recipient/consumer scope, decision (`granted | denied | revoked`), source, grant time, optional expiry, version, visibility, audit reference and propagation status.

### Invariants

1. Consent is purpose- and scope-specific.
2. Granting one purpose does not grant unrelated purposes.
3. Revocation prevents future unauthorized use and propagates to governed downstream consumers.
4. Expired consent is unavailable until renewed.
5. Denial cannot be bypassed by AI, agents, projections or integrations.
6. Privacy Lock/emergency policy may restrict access without creating broader consent.
7. Consequential consent transitions are auditable.
8. User-visible access review reflects effective permissions.

## R2 — Canonical Data Classification & Sensitivity Propagation

The canonical classification vocabulary is:

- **Public** — intentionally public information.
- **Personal** — ordinary user-specific information.
- **Sensitive** — information whose disclosure can materially affect privacy or safety.
- **Highly Sensitive** — health, intimate relationships, sensitive financial/behavioral information and similar data.
- **Critical Personal Intelligence** — Personal Constitution, Digital Twin, high-value model claims, sensitive predictions and derived intelligence.

Derived artifacts inherit the highest applicable sensitivity from source sensitivity, derivation risk and contextual sensitivity. Derived intelligence may therefore be more sensitive than every individual source record.

No consumer may downgrade sensitivity merely for transport or access convenience.

## R3 — User Data Sovereignty Contract

The user is the primary owner/controller of personal data subject to applicable legal and security retention requirements.

The architecture must support: export, correction, deletion, memory correction/deletion, access review, consent review/revocation, external integration disconnect, visibility into important model claims, evidence/provenance inspection where authorized, and lifecycle/retention visibility.

Correction follows:

```text
User correction
      ↓
Model / Memory revision
      ↓
Historical evidence preserved
```

Correction must not silently rewrite historical events. Deletion semantics must distinguish active data, derived artifacts, caches/projections and records that must be retained for legal/security reasons.

## R4 — FIS-059 Performance Contract

Performance is an architectural property.

Core requirements:

- interaction receives immediate acknowledgement;
- core navigation does not wait for deep intelligence;
- stale-but-valid read state may be shown with explicit freshness semantics;
- progressive intelligence enriches an already usable experience;
- heavy intelligence/indexing/model refresh/prediction/agent workloads are isolated from critical UI and deterministic-core operations;
- resource pressure degrades nonessential intelligence before core functionality;
- every affected implementation scope declares measurable performance budgets.

Performance budgets must eventually cover interaction response, navigation, first meaningful UI, progressive update, background-job latency, memory, CPU, battery, network/API latency, AI latency where relevant, crashes and frame drops.

Numeric thresholds are deferred to the Technical Performance Specification. Validation must include Real User Monitoring and representative lower-resource devices and network conditions.

## R5 — Safe Mode / Continuity Contract

`SAFE_MODE` is an explicit runtime state, distinct from ordinary offline or AI-unavailable conditions.

### Activation triggers

AI unavailability, severe network degradation, database degradation, security incident, severe resource pressure, integrity/recovery conditions, or applicable user Privacy Lock.

### Preserved capabilities

Where underlying storage remains available: goal viewing, active-path viewing, daily actions, routine/habit execution, progress recording, user controls, security enforcement and durable local/offline operations.

### Restricted capabilities

Nonessential deep analysis, new high-risk autonomous actions, unauthorized external processing, stale intelligence presented as fresh intelligence, and resource-intensive background workloads.

### Recovery

```text
Safe Mode
  ↓
Dependency / health checks
  ↓
Recovery validation
  ↓
Reconciliation
  ↓
Normal operation
```

Entry, restricted operations and recovery are auditable. Recovery must not fabricate missing intelligence or rewrite history.

## R6 — Context Fusion Governance Contract

Context Fusion combines only **minimum sufficient authorized context** for a declared purpose.

```text
Candidate Context
   ↓
Authorization
   ↓
Purpose Filter
   ↓
Relevance Filter
   ↓
Freshness Filter
   ↓
Sensitivity Propagation
   ↓
Conflict / Confidence Analysis
   ↓
Minimum Sufficient Context
   ↓
Fusion
```

Required rules:

1. Fusion declares its purpose/capability.
2. Only necessary data is requested.
3. Relevance is assessed before broad aggregation.
4. Freshness requirements are capability-specific.
5. Conflicting signals remain representable; disagreement is not silently converted into false certainty.
6. Confidence reflects evidence quality, recency, contradiction and derivation uncertainty.
7. Insufficient context produces explicit uncertainty/refusal rather than invented certainty.
8. Sensitivity propagates to the fused artifact.
9. Fusion cannot bypass domain ownership, consent, least privilege or AI Gateway policy.
10. DECIVEXA must not construct a hidden whole-life context package merely because the data exists.

## Cross-Revision Invariants

R1–R6 establish that:

- security policy is authoritative runtime state;
- sensitivity follows data and derived intelligence;
- user sovereignty survives correction, deletion and model evolution;
- performance cannot be traded away by adding intelligence;
- Safe Mode is deterministic and continuity-oriented;
- Context Fusion is purpose-bound and minimum-sufficient;
- AI and agents remain downstream consumers/proposers and cannot bypass policy;
- none of these clauses authorizes implementation by itself.

## Canonical Interpretation

For all subsequent technical design work, TD-04 must be read as the combination of the original TD-04 contract and this normative amendment. If a later artifact conflicts with either, the conflict is an architectural issue requiring explicit Founder-controlled resolution.

**TD-04 Re-review basis: COMPLETE — R1–R6 accepted as normative extensions.**
