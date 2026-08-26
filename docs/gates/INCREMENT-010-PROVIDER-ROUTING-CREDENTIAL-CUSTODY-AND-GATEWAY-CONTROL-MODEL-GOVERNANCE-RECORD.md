# Governance Record — Increment 010: Provider Routing, Credential Custody & Gateway Control Model

## A. Decision Identity

- **Title:** Governance Record — Increment 010: Provider Routing, Credential Custody & Gateway Control Model
- **Decision ID:** `FD-INCREMENT-010-PROVIDER-ROUTING-CREDENTIAL-CUSTODY-001`
- **Status:** FOUNDER-APPROVED DECISION RECORD
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Nature:** Records five explicit Founder decisions resolving the responsibility/trust-boundary questions left open by the completed Increment 010 lineage — the "AI Runtime Lineage Reconciliation & Founder-Controlled Gap Audit," the "Founder Architecture Decision & Gate 1–7 / Zone-3 Gateway Reconciliation" (Option C selected), the "Responsibility & Trust-Boundary Reconciliation," and the "Provider Routing, Credential Custody & Gateway Control Model" Founder Decision Gate. This record does not itself authorize Gateway implementation, credential introduction, provider endpoint configuration, GCP provisioning, GitHub Environment configuration, migration, or any modification to Gate 1–7 or Increment 009.

## B. Baseline

`HEAD` = `origin/main` = `ae861ed564217b47a6430661cd7519f23d18e17c` at the time of this decision — unchanged across the entire preceding Increment 010 reconciliation sequence. 0/0 divergence, nothing staged, GOVREC MD5 `972ad36e523aa42e540f2c28a3aac801` unchanged.

## C. Preserved Prior Determination

**Option C — Dual-layer / defense-in-depth** (Founder-selected in the preceding "Founder Architecture Decision & Gate 1–7 / Zone-3 Gateway Reconciliation" gate) **remains authoritative and is not reopened by this record.** Gate 1–7 `apps/api` AI Runtime remains the application-level authentication/capability/policy/output-policy/audit boundary. The Increment 009 Zone-3 GCP AI Gateway remains the intended future infrastructure/provider-isolation boundary. Neither layer supersedes or duplicates the other.

## D. Founder Decision 1 — Provider Routing

**Selected: Option A — Gateway-only production provider routing.**

Once Zone-3 exists and is operational, all production AI provider calls must route exclusively through `apps/api → Zone-3 Gateway → AI Provider`. `apps/api` must not make direct production provider calls. The existing Gate 1–7 direct-provider implementation (`OpenAiCompatibleProviderAdapter`, `gate7-provider-security.ts`, and the surrounding Gate-7 lineage) remains in the repository as historically valid and is **not** deleted, modified, or retired by this decision — its future retirement or archival is its own, separate, explicitly Founder-authorized governance decision (see §H, Decision 5). No production fallback to a direct-provider path is authorized unless a future Founder decision explicitly authorizes and defines one.

## E. Founder Decision 2 — Provider Credential Custody

**Selected: Option A — Zone-3-only credential custody.**

The real AI provider credential must ultimately live exclusively within the Zone-3 Gateway boundary. `apps/api` must never receive, store, persist, log, expose, or directly handle the provider credential. No third, separate credential boundary is authorized. This decision is intentionally aligned with Decision 1 (§D): production provider traffic is Gateway-only, and Zone-3 is the provider-isolation and credential-custody boundary.

## F. Founder Decision 3 — Gateway Request Limits

**Selected: Conservative posture.** Exact numeric limits are explicitly **not** set by this record.

The Zone-3 Gateway's request/response/timeout/concurrency/rate-limit design must target a conservative posture: small, explicitly bounded request and response sizes; short, explicitly bounded execution timeouts; conservative concurrency limits; strict per-workload rate limiting; fail-closed behavior when a limit is exceeded or cannot be determined. This decision establishes the security posture only — it does not authorize inventing or implementing specific numeric values. Exact values and enforcement mechanisms require a dedicated future technical sizing pass (informed by the Gateway's actual request/response contract, real DECIVEXA capability payload shapes, registered model/provider constraints, provider API limits, expected legitimate workload, and timeout/latency characteristics) and a separate Founder authorization before implementation.

## G. Founder Decision 4 — Gateway Audit Model

**Selected: Option A — separate records, correlated.**

The Zone-3 Gateway shall maintain its own Gateway-side audit record; `apps/api` retains its existing `Gate7ExecutionAuditRecord` (FD-4) unchanged. Both records are correlated using the same `correlationId` for end-to-end traceability across the Zone-2→Zone-3 boundary. No unified shared audit schema, shared audit database, or new cross-layer audit architecture is authorized by this decision. Each layer retains strict ownership of its own audit evidence.

## H. Founder Decision 5 — Gate-7 Direct-Provider Controls After Migration

**Selected: Option B — retain until migration complete, then reconsider.**

`gate7-provider-security.ts` and the existing direct-provider path must remain fully active and unchanged while any direct-provider capability exists. After production migration to the Zone-3 Gateway is complete and independently verified, retirement or dormancy of these controls may be considered only through a separate, explicit, future Founder authorization. No retirement, deletion, weakening, or architectural change to these controls is authorized by this decision.

## I. Preserved Constraints (Unchanged By This Record)

- Option C dual-layer architecture (§C) remains authoritative.
- Gate 1–7 `apps/api` architecture remains unchanged and authoritative in full — `AuthenticationGuard`, `AIRuntimeController`, `AIRuntime`, `authorizePolicy()`, `CapabilityRegistry`, `ModelRouter`, `ModelRegistry`, `ProviderRegistry`, `AIProvider`, `OpenAiCompatibleProviderAdapter`, Gate-7 provider-security controls, output policy, and execution audit are all untouched.
- Zone-3 remains the future provider-isolation and credential-custody boundary; it remains unimplemented and unprovisioned.
- No second `CapabilityRegistry`, `policy-authorization.ts`-equivalent, `ModelRouter`, provider abstraction, or competing authorization architecture may be introduced under any of these five decisions.
- **State D remains CLOSED.**
- **FD-6 remains non-operational.**
- No credential is introduced by this record.
- No provider endpoint is configured by this record.
- No GCP resource is provisioned by this record.
- No GitHub Environment is changed by this record.
- No migration is performed by this record.
- No Gate-7 component is deleted, retired, weakened, or modified by this record.
- Decision 3's exact numeric limits require a future dedicated technical sizing pass and a separate Founder authorization before implementation.

## J. Governance Status

- **Provider routing:** RESOLVED (§D).
- **Credential custody:** RESOLVED (§E).
- **Gateway request-limit posture:** RESOLVED at the posture level only (§F); exact values remain a future, separately authorized technical decision.
- **Gateway audit model:** RESOLVED (§G).
- **Gate-7 direct-provider control disposition:** RESOLVED at the "retain until migration + reconsider later" level only (§H); actual retirement remains a future, separate decision.
- **Zone-3 Gateway implementation authorization:** **NOT GRANTED.** This record resolves five architectural/policy questions only. It does not authorize writing Gateway source code, Terraform changes, credential creation, credential access, provider contact, GCP resource creation, GitHub Environment configuration, or any migration of existing traffic.
- **Increment 009 implementation status:** unchanged — remains source-only, unprovisioned, blocked on the same external prerequisites (real GCP project, GitHub production Environment, Terraform/gcloud tooling) established in prior Increment 009 records.

## K. Explicit Non-Authorizations

This record does **not** authorize: writing or modifying any Zone-3 Gateway source code; modifying Terraform (`infra/gcp/`); modifying any schema, migration, or configuration; creating, reading, storing, or configuring any credential; configuring any provider endpoint; creating any GCP resource; contacting any AI provider; contacting GCP or GitHub; configuring any GitHub Environment; performing any migration of production traffic; modifying, weakening, retiring, or deleting any Gate 1–7 component (`AuthenticationGuard`, `AIRuntimeController`, `AIRuntime`, `authorizePolicy()`, `CapabilityRegistry`, `ModelRouter`, `ModelRegistry`, `ProviderRegistry`, `AIProvider`, `OpenAiCompatibleProviderAdapter`, `gate7-provider-security.ts`, output-policy validation, or execution-audit files); modifying any prior Gate 1–7 or Increment 008/009 governance record; modifying GOVREC; committing or pushing any change.

## L. Historical Boundary

This record does not rewrite or reinterpret any prior gate, Founder decision, or governance record in the Gate 1–7 lineage, the Increment 008 lineage, or the Increment 009 contract. It persists exactly the five decisions reached in the completed Increment 010 Founder Decision Gate, on top of the already-recorded Option C selection — nothing more.

## M. Final Determination

**FIVE FOUNDER DECISIONS PERSISTED: (1) GATEWAY-ONLY PRODUCTION PROVIDER ROUTING, (2) ZONE-3-ONLY CREDENTIAL CUSTODY, (3) CONSERVATIVE GATEWAY REQUEST-LIMIT POSTURE (EXACT VALUES DEFERRED), (4) SEPARATE CORRELATED AUDIT RECORDS, (5) GATE-7 DIRECT-PROVIDER CONTROLS RETAINED UNTIL MIGRATION COMPLETE — OPTION C DUAL-LAYER ARCHITECTURE REMAINS AUTHORITATIVE — GATE 1–7 REMAINS UNCHANGED AND AUTHORITATIVE — STATE D REMAINS CLOSED — FD-6 REMAINS NON-OPERATIONAL — NO CREDENTIAL, ENDPOINT, GCP RESOURCE, GITHUB ENVIRONMENT, MIGRATION, OR IMPLEMENTATION AUTHORIZATION IS GRANTED BY THIS RECORD**
