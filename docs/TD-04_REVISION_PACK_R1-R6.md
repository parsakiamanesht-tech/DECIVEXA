# TD-04 Revision Pack — R1–R6

**Status:** PROPOSED NORMATIVE AMENDMENT / RE-REVIEW REQUIRED  
**Authority:** Founder-controlled  
**Parent Contract:** `docs/TD-04_DATA_RUNTIME_CONTRACTS.md`  
**Related Gate Review:** `docs/TD-04_GATE_REVIEW.md`  
**Purpose:** Close the six explicit gaps identified by the TD-04 Gate Review without choosing implementation technology.

> This revision pack is normative for TD-04 once accepted by the Founder and incorporated into the next TD-04 revision. It does not authorize physical schema creation or production implementation.

---

## R1 — Canonical Consent & Permission Contract

Consent/permission is authoritative security state, not UI configuration.

```text
Consent Grant
├── consent_id
├── subject / user_id
├── data_scope
├── capability / purpose
├── recipient / consumer scope
├── decision: granted | denied | revoked
├── source: user | authorized policy | emergency policy
├── granted_at
├── expires_at (optional)
├── version
├── visibility
├── audit_reference
└── propagation_status
```

### Invariants

1. Consent is purpose- and scope-specific.
2. Granting one purpose does not grant unrelated purposes.
3. Revocation prevents future unauthorized use and propagates to governed downstream consumers.
4. Expired consent is treated as unavailable unless a new valid grant exists.
5. Denial is an authoritative decision and must not be bypassed by AI, agents, projections or integrations.
6. Emergency/privacy-lock policies may restrict access without silently creating broader consent.
7. Every consequential consent transition is auditable.
8. User-visible access review must reflect effective permissions, not merely stored UI preferences.

---

## R2 — Canonical Data Classification & Sensitivity Propagation

Canonical classes:

| Class | Meaning | Default handling |
|---|---|---|
| Public | Intentionally public information | Standard protection |
| Personal | Ordinary user-specific information | User-scoped access |
| Sensitive | Information whose disclosure can materially affect privacy or safety | Least privilege + encryption + audit |
| Highly Sensitive | Health, intimate relationships, sensitive financial/behavioral information and similar data | Strong isolation + explicit purpose authorization |
| Critical Personal Intelligence | Personal Constitution, Digital Twin, high-value model claims, sensitive predictions and derived intelligence | Highest compartmentalization + explicit purpose authorization + enhanced audit |

### Sensitivity propagation

```text
Input Data
   ↓
Derived Artifact
   ↓
Sensitivity = max(source sensitivity, derivation risk, contextual sensitivity)
```

Derived intelligence may be more sensitive than every individual source record. A low-sensitivity observation can become Highly Sensitive or Critical Personal Intelligence when combined into a consequential inference.

No consumer may downgrade sensitivity merely to simplify transport or access.

---

## R3 — User Data Sovereignty Contract

The user is the primary owner/controller of their personal data subject to applicable legal/security retention constraints.

The contract must support:

- data export;
- correction;
- deletion;
- memory correction/deletion;
- access review;
- consent review/revocation;
- external integration disconnect;
- visibility into important model claims;
- evidence/provenance inspection where safe;
- lifecycle/retention visibility.

### Required distinction

```text
User correction
      ↓
Model / Memory revision
      ↓
Historical evidence preserved
```

Correction must not silently rewrite historical events. Deletion semantics must distinguish active user data, derived artifacts, caches/projections and legally/security-required audit records.

The system should expose *why DECIVEXA believes something about the user* without exposing data outside the user's authorization scope.

---

## R4 — FIS-059 Performance Contract

Performance is an architectural property, not a late optimization.

TD-04 therefore treats the following as contract-level requirements:

### Perceived readiness

- user interaction receives immediate acknowledgement;
- core navigation must not wait for deep intelligence;
- stale-but-valid read state may be shown with freshness semantics;
- progressive intelligence may enrich an already usable screen.

### Workload isolation

Heavy intelligence, indexing, model refresh, prediction and agent work must be isolated from critical UI and deterministic-core operations.

Resource pressure must degrade nonessential intelligence before core functionality.

### Performance budget placeholders

Each implementation scope must eventually define measurable budgets for:

- interaction response;
- navigation;
- first meaningful UI;
- progressive update;
- background job latency;
- memory;
- CPU;
- battery impact on mobile;
- network/API latency;
- AI latency where applicable;
- crash/frame-drop behavior.

Numeric thresholds remain deferred to the Technical Performance Specification, but every affected phase must declare and test its budget.

### RUM

Performance validation must include Real User Monitoring and representative lower-resource devices/network conditions, not only developer hardware.

---

## R5 — Safe Mode / Continuity Contract

`SAFE_MODE` is an explicit runtime state, distinct from ordinary offline or AI-unavailable conditions.

### Activation triggers

Safe Mode may be activated by:

- AI unavailability;
- severe network degradation;
- database degradation;
- security incident;
- severe resource pressure;
- integrity/recovery conditions;
- explicit user Privacy Lock where applicable.

### Preserved capabilities

At minimum, where underlying storage remains available:

- goal viewing;
- active-path viewing;
- daily actions;
- routine/habit execution;
- progress recording;
- user controls;
- security enforcement;
- durable local/offline operations.

### Restricted capabilities

- nonessential deep analysis;
- new high-risk autonomous actions;
- external processing not explicitly authorized;
- stale intelligence presented as fresh intelligence;
- resource-intensive background workloads.

### Recovery

```text
Safe Mode
  ↓
Health / dependency checks
  ↓
Recovery validation
  ↓
Reconciliation
  ↓
Normal operation
```

Exit must not fabricate missing intelligence or rewrite history. Entry, restricted operations and recovery are auditable.

---

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

### Required rules

1. Context Fusion must declare its purpose/capability.
2. It must request only data necessary for that purpose.
3. Relevance is assessed before broad aggregation.
4. Freshness requirements are capability-specific.
5. Conflicting signals must remain representable; disagreement must not be silently averaged into false certainty.
6. Confidence must reflect evidence quality, recency, contradiction and derivation uncertainty.
7. Insufficient context must result in an explicit uncertainty/refusal state rather than invented certainty.
8. Sensitivity must propagate to the fused artifact.
9. Context Fusion may not bypass domain ownership, consent, least privilege or AI Gateway policy.
10. The system must not construct a hidden whole-life context package merely because the data exists.

### Example

```text
Goal + authorized capacity signal + current deadline
        ↓
Sufficient context
        ↓
Daily guidance
```

Full Health records, Money details or Family records are not required unless the declared purpose demonstrably needs them and authorization permits them.

---

# Cross-Revision Invariants

R1–R6 collectively establish:

1. Security policy is authoritative runtime state.
2. Sensitivity follows data and derived intelligence.
3. User sovereignty survives correction, deletion and model evolution.
4. Performance cannot be traded away by adding intelligence.
5. Safe Mode is deterministic and continuity-oriented.
6. Context Fusion is purpose-bound and minimum-sufficient.
7. AI and agents remain downstream consumers/proposers, never policy bypasses.
8. None of these revisions authorizes implementation.

# Re-Review Gate

**Current status:** `REVISION PACK READY FOR RE-REVIEW`  
**Required next action:** Update/reconcile TD-04, then perform a fresh TD-04 Gate Review.  
**Target:** `FULL PASS` only if all six revisions are accepted and no contradictory architecture is found.

Until that gate is passed:

- no physical database schema authorization;
- no production implementation authorization;
- no silent architecture changes.

**Evidence before opinion. Founder-controlled architecture.**
