# Governance Record — Increment 013: Zone-3 Gateway Founder Decision Gate — Transport Defaults, Rate/Concurrency Policy & Migration Cutover Criteria

## A. Decision Identity

- **Title:** Governance Record — Increment 013: Zone-3 Gateway Founder Decision Gate — Transport Defaults, Rate/Concurrency Policy & Migration Cutover Criteria
- **Decision ID:** `FD-INCREMENT-013-ZONE-3-GATEWAY-FOUNDER-DECISION-GATE-001`
- **Status:** FOUNDER-APPROVED DECISION RECORD
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Nature:** Records four explicit Founder decisions resolving the remaining open questions identified by the completed "Increment 012: Zone-3 Gateway Implementation Scope & Readiness Gate" and framed by the "Increment 013: Founder Decision Gate" report. This record does not itself authorize Gateway implementation, credential introduction, provider endpoint configuration, GCP provisioning, GitHub Environment configuration, migration, or any modification to Gate 1–7 or Increment 009/010/011.

## B. Baseline

`HEAD` = `origin/main` = `0c379ff0a134b2a8b47fbddd83c3bc16dc17c302` at the time of this decision — unchanged across the entire Increment 012/013 sequence. 0/0 divergence, nothing staged, GOVREC MD5 `972ad36e523aa42e540f2c28a3aac801` unchanged.

## C. Preserved Prior Determinations

Nothing in this record reopens or amends any prior decision. In force, unchanged, and preserved in full:

- **Increment 010, all five decisions:** Gateway-only production provider routing; Zone-3-only provider credential custody; conservative Gateway request-limit posture; separate Gateway/`apps/api` audit records correlated by `correlationId`; Gate-7 direct-provider controls retained until migration is complete and independently verified, retirement deferred to a separate future authorization.
- **Increment 011, all decisions:** conservative rate limiting and concurrency posture, per Zone-2 workload identity, numeric values deferred; audit-write failure fails closed; no capability-authorization-result field in the envelope; no request-origin/user field; `correlationId` remains traceability-only; no separate message/item-count control; no token-based input limit.
- **Option C — Dual-layer / defense-in-depth** architecture remains authoritative.
- Gate 1–7 `apps/api` AI Runtime remains unchanged and authoritative in full.
- `authorizePolicy()` remains the sole application capability-authorization authority. No second `CapabilityRegistry`, policy engine, or `ModelRouter` may be introduced.
- The Zone-2→Zone-3 envelope remains `{capability, input, correlationId}` — no provider/model/endpoint/credential/raw-HTTP field supplied by the caller, no fallback routing.

## D. Founder Decision 1 — Transport Defaults

**Selected: Locked as initial implementation defaults.**

The Zone-3 Gateway shall use, as locked initial implementation defaults:

- Maximum request body: **16 KiB**
- Maximum provider response: **64 KiB**
- Provider timeout: **30 seconds**

These values remain technically configurable where implementation requires it, but are not to be re-litigated as a Founder decision. They are derived from, and mirror, the existing Founder-approved (FD-5) Gate-7 direct-provider defaults (`DEFAULT_MAX_REQUEST_BYTES`, `DEFAULT_MAX_RESPONSE_BYTES`, `DEFAULT_TIMEOUT_MS`).

## E. Founder Decision 2 — Rate Limiting

**Selected: Conservative posture, numeric threshold deferred.**

Rate limiting is **CONSERVATIVE**, enforced **per authenticated Zone-2 workload identity**, and **FAIL-CLOSED**. No numeric per-workload threshold is authorized or locked by this record — it requires a dedicated future technical sizing pass using real workload/traffic evidence and provider constraints. **No burst allowance is authorized** — no token-bucket, leaky-bucket, burst size, or refill-rate behavior is introduced or implied. **No global Gateway-wide ceiling is authorized** — its necessity, dimension, and numeric value remain deferred to the same future sizing pass. The only Founder-approved rate-limit policy as of this record is: conservative + per-Zone-2-workload-identity + fail-closed, with numeric threshold, burst behavior, and global-ceiling policy all explicitly open.

## F. Founder Decision 3 — Concurrency

**Selected: Fail-closed/reject confirmed; numeric ceiling deferred.**

Concurrency enforcement is **CONSERVATIVE**, per authenticated Zone-2 workload identity. Exhaustion behavior is explicitly **CONFIRMED as REJECT / FAIL-CLOSED**: when a workload's per-workload concurrency ceiling is exhausted, the Gateway must reject the new request. **No queueing, no automatic retry, no fallback path, and no silent degradation or bypass is authorized.** The numeric concurrency ceiling remains deferred to the same future technical sizing pass as rate limiting (§E) — no burst/concurrency-sharing model or global concurrency ceiling is introduced or implied.

## G. Founder Decision 4 — Migration Cutover Gate

**Selected: Adopted as-is, as the standing rule for any future migration gate.**

```
CUTOVER MAY PROCEED only if every mandatory criterion (A–H) is
independently evidenced at E4/E5.
  FAIL         → HALT
  NOT VERIFIED → HALT
  UNKNOWN      → HALT
No best-effort cutover. No silently inferred risk acceptance.
No automatic fallback to the direct-provider path after Gateway-only
production routing becomes active.
```

The eight mandatory criteria this gate structure governs (as defined in the Increment 013 readiness analysis, not modified by this record): (A) workload authentication, (B) Gateway authorization (INV-007), (C) credential isolation, (D) provider routing, (E) non-bypass verification, (F) audit integrity, (G) failure behavior, (H) observability. Evidence at design/static level (E0–E2) does **not** satisfy any mandatory criterion — only deployed-runtime or operational evidence (E4/E5) does. **The rollback-mechanism design gap (item I — how service availability is handled during a post-cutover Gateway failure without recreating a forbidden dual production path) remains explicitly OPEN.** No rollback mechanism is invented, implemented, or inferred by this record; its design and authorization remain a separate, future Founder decision.

## H. Preserved Constraints (Unchanged By This Record)

- Dual-layer architecture remains authoritative.
- Gateway-only production provider routing (Increment 010 Decision 1).
- Zone-3-only provider credential custody (Increment 010 Decision 2).
- Gate-7 direct-provider controls remain fully active until migration is complete and independently verified (per the standing rule in §G); retirement requires its own separate future Founder authorization.
- Gate 1–7 remains authoritative and unchanged in full.
- `apps/api`'s `authorizePolicy()` remains the sole application capability-authorization authority.
- No second `CapabilityRegistry`, policy engine, or `ModelRouter`.
- No capability-authorization-result field in the Zone-2→Zone-3 envelope (Increment 011 Decision 4).
- No request-origin/user field in that envelope (Increment 011 Decision 5).
- `correlationId` remains the sole cross-layer correlation mechanism, traceability-only, with no authentication/authorization weight.
- No provider/model/endpoint/credential/raw-HTTP field supplied by the caller.
- No fallback routing of any kind, pre- or post-cutover.
- **State D remains CLOSED.**
- **FD-6 remains non-operational.**
- No credential, endpoint, GCP resource, IAM configuration, deployment, migration, or implementation is authorized by this record's creation.

## I. Governance Status

- **Transport defaults:** RESOLVED and LOCKED (§D).
- **Rate-limit dimension/posture/fail-closed behavior:** RESOLVED (§E). **Numeric threshold, burst policy, global ceiling:** explicitly deferred, not resolved.
- **Concurrency dimension/posture/exhaustion behavior:** RESOLVED (§F). **Numeric ceiling:** explicitly deferred, not resolved.
- **Migration cutover gate structure:** RESOLVED and ADOPTED as a standing rule (§G). **Rollback mechanism (item I):** explicitly open, unresolved.
- **Zone-3 Gateway implementation authorization: NOT GRANTED.** This record resolves four decision questions only. It does not authorize writing Gateway source code, Terraform changes, credential creation, credential access, provider contact, GCP resource creation, GitHub Environment configuration, or any migration of existing traffic.
- **Increment 009/010/011 implementation status:** unchanged — remains source-only/decision-only, unprovisioned.

## J. Explicit Non-Authorizations

This record does **not** authorize: creating `apps/ai-gateway/`; writing Gateway source code or tests; modifying `apps/api`; modifying Terraform or `infra/gcp`; creating or configuring IAM; creating credentials or endpoints; contacting GCP, GitHub, or any AI provider; deployment; migration; routing changes; Gate-7 retirement; modifying, weakening, retiring, or deleting any Gate 1–7 component (`AuthenticationGuard`, `AIRuntimeController`, `AIRuntime`, `authorizePolicy()`, `CapabilityRegistry`, `ModelRouter`, `ModelRegistry`, `ProviderRegistry`, `AIProvider`, `OpenAiCompatibleProviderAdapter`, `gate7-provider-security.ts`, output-policy validation, or execution-audit files); modifying any prior Gate 1–7, Increment 008, Increment 009, Increment 010, or Increment 011 governance record; modifying GOVREC; staging, committing, or pushing any change.

## K. Historical Boundary

This record does not rewrite or reinterpret any prior gate, Founder decision, or governance record in the Gate 1–7 lineage, the Increment 008 lineage, the Increment 009 contract, or the Increment 010/011 records. It persists exactly the four decisions reached in the completed Increment 013 Founder Decision Gate, on top of every decision already recorded — nothing more.

## L. Final Determination

**FOUR FOUNDER DECISIONS PERSISTED: (1) TRANSPORT DEFAULTS LOCKED — 16 KiB REQUEST / 64 KiB RESPONSE / 30s TIMEOUT, (2) RATE LIMITING CONSERVATIVE/PER-WORKLOAD/FAIL-CLOSED WITH NUMERIC VALUE DEFERRED, (3) CONCURRENCY CONSERVATIVE/PER-WORKLOAD/REJECT-ON-EXHAUSTION WITH NUMERIC CEILING DEFERRED, (4) MIGRATION CUTOVER GATE STRUCTURE (CRITERIA A–H, E4/E5 EVIDENCE REQUIRED, FAIL-CLOSED) ADOPTED AS STANDING RULE, ROLLBACK MECHANISM EXPLICITLY OPEN — ALL INCREMENT 010/011 DECISIONS AND CONSTRAINTS PRESERVED — GATE 1–7 REMAINS UNCHANGED AND AUTHORITATIVE — STATE D REMAINS CLOSED — FD-6 REMAINS NON-OPERATIONAL — NO CREDENTIAL, ENDPOINT, GCP RESOURCE, TERRAFORM, MIGRATION, OR IMPLEMENTATION AUTHORIZATION IS GRANTED BY THIS RECORD**
