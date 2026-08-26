# Governance Record — Increment 011: Zone-3 Gateway Technical Sizing & Control Model

## A. Decision Identity

- **Title:** Governance Record — Increment 011: Zone-3 Gateway Technical Sizing & Control Model
- **Decision ID:** `FD-INCREMENT-011-ZONE-3-GATEWAY-TECHNICAL-SIZING-001`
- **Status:** FOUNDER-APPROVED DECISION RECORD
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Nature:** Records five explicit Founder decisions resolving the technical-sizing and contract-shape questions left open by the completed "Increment 011: Zone-3 Gateway Technical Sizing & Implementation Readiness Gate" report. This record does not itself authorize Gateway implementation, credential introduction, provider endpoint configuration, GCP provisioning, GitHub Environment configuration, migration, or any modification to Gate 1–7 or Increment 009/010.

## B. Baseline

`HEAD` = `origin/main` = `52931244412ef9460f515c92835efb2ccac2dabb` at the time of this decision — unchanged across the entire Increment 011 sizing sequence. 0/0 divergence, nothing staged, GOVREC MD5 `972ad36e523aa42e540f2c28a3aac801` unchanged.

## C. Preserved Prior Determinations

Nothing in this record reopens or amends any prior decision. In force, unchanged, and preserved in full:

- **Increment 010, all five decisions:** (1) Gateway-only production provider routing; (2) Zone-3-only provider credential custody; (3) Conservative Gateway request-limit posture; (4) Separate Gateway/`apps/api` audit records correlated by `correlationId`; (5) Gate-7 direct-provider controls retained until migration is complete and independently verified, retirement deferred to a separate future authorization.
- **Option C — Dual-layer / defense-in-depth** architecture remains authoritative.
- Gate 1–7 `apps/api` AI Runtime remains unchanged and authoritative in full — `AuthenticationGuard`, `AIRuntimeController`, `AIRuntime`, `authorizePolicy()`, `CapabilityRegistry`, `ModelRouter`, `ModelRegistry`, `ProviderRegistry`, `AIProvider`, `OpenAiCompatibleProviderAdapter`, Gate-7 provider-security controls, output policy, and execution audit are all untouched.
- `authorizePolicy()` remains the sole application capability-authorization authority.

## D. Founder Decision 1 — Rate Limiting

**Conservative posture, enforced per authenticated Zone-2 workload identity.** No numeric threshold is set or hard-coded by this record. The exact numeric value requires a dedicated future technical sizing pass, informed by real workload and provider constraints, and a separate Founder authorization before implementation.

## E. Founder Decision 2 — Concurrency

**Conservative posture, enforced per authenticated Zone-2 workload identity.** No numeric value is set or hard-coded by this record. The exact sizing requires the same dedicated future technical sizing pass referenced in §D.

## F. Founder Decision 3 — Gateway Audit-Write Failure Behavior

**FAIL CLOSED.** If a required Gateway-side audit record cannot be durably recorded per the eventual audit mechanism, the Gateway must not proceed with, or release, the provider execution result. No silent audit bypass behavior is authorized under any circumstance.

## G. Founder Decision 4 — Capability-Authorization-Result Field

**Not added to the Zone-2→Zone-3 envelope.** `apps/api`'s `authorizePolicy()` remains the sole capability-authorization authority; Zone-3 must not recreate or duplicate that authorization engine. The Gateway trusts the authenticated Zone-2 workload within its own explicitly defined Gateway contract and independently enforces its own workload/provider/request controls (INV-006/INV-007/INV-024) — it does not re-derive `apps/api`'s capability-authorization decision.

## H. Founder Decision 5 — Request-Origin Reference

**Not added to the Zone-2→Zone-3 envelope.** `correlationId` remains the sole cross-layer correlation mechanism. It carries traceability meaning only — no authentication or authorization authority is attached to it under any circumstance.

## I. Technical Sizing Proposals Preserved (Not Re-Decided, Status Unchanged)

The following remain **technical sizing proposals**, evidence-derived in the Increment 011 report, not Founder-mandated numeric requirements and not implementation authorization:

- Request body limit: **16 KiB** — mirrors the existing Founder-approved (FD-5) Gate-7 direct-provider default.
- Output size cap: **64 KiB** — same basis.
- Timeout: **30 seconds** — same basis, the only evidenced value in this repository for this class of provider-call boundary.
- No separate message/item-count control is justified at this stage (every existing capability produces exactly one message).
- No token-based input limiting is introduced — no tokenizer or token-counting mechanism exists anywhere in this repository; byte/character-based limiting remains the only architecturally supported approach.

These proposals are not elevated to Founder decisions by this record and must not be represented as authorization to implement the Gateway.

## J. Preserved Constraints (Unchanged By This Record)

- Gate 1–7 remains unchanged and authoritative.
- `authorizePolicy()` remains the sole application capability-authorization authority.
- No second `CapabilityRegistry`, policy engine, `ModelRouter`, or competing authorization mechanism may be introduced.
- Production provider routing remains Gateway-only once Zone-3 is implemented (Increment 010 Decision 1).
- Provider credential custody remains Zone-3-only (Increment 010 Decision 2).
- Gate-7 direct-provider controls (`gate7-provider-security.ts` and the surrounding lineage) remain fully active until migration is complete and independently verified; retirement requires a separate, explicit, future Founder authorization.
- Gateway limits remain conservative; exact numeric sizing for rate limiting and concurrency remains explicitly deferred (§D, §E).
- No fallback provider path is authorized.
- **State D remains CLOSED.**
- **FD-6 remains non-operational.**
- No credential, endpoint, GCP resource, Terraform change, migration code, Gateway implementation, schema, or runtime infrastructure is authorized by this record.

## K. Governance Status

- **Rate-limit dimension:** RESOLVED (§D) — per Zone-2 workload identity. **Numeric value:** explicitly deferred, not resolved.
- **Concurrency dimension:** RESOLVED (§E) — per Zone-2 workload identity. **Numeric value:** explicitly deferred, not resolved.
- **Audit-write failure behavior:** RESOLVED (§F) — fail closed.
- **Envelope shape:** RESOLVED (§G, §H) — no capability-authorization-result field, no request-origin/user field; three-field envelope (`capability`, `input`, `correlationId`) stands as previously specified.
- **Zone-3 Gateway implementation authorization: NOT GRANTED.** This record resolves five technical/architectural questions only. It does not authorize writing Gateway source code, Terraform changes, credential creation, credential access, provider contact, GCP resource creation, GitHub Environment configuration, or any migration of existing traffic.
- **Increment 009/010 implementation status:** unchanged — remains source-only/decision-only, unprovisioned.

## L. Explicit Non-Authorizations

This record does **not** authorize: writing or modifying any Zone-3 Gateway source code; modifying Terraform (`infra/gcp/`); modifying any schema, migration, or configuration; creating, reading, storing, or configuring any credential; configuring any provider endpoint; creating any GCP resource; contacting any AI provider; contacting GCP or GitHub; configuring any GitHub Environment; performing any migration of production traffic; modifying, weakening, retiring, or deleting any Gate 1–7 component (`AuthenticationGuard`, `AIRuntimeController`, `AIRuntime`, `authorizePolicy()`, `CapabilityRegistry`, `ModelRouter`, `ModelRegistry`, `ProviderRegistry`, `AIProvider`, `OpenAiCompatibleProviderAdapter`, `gate7-provider-security.ts`, output-policy validation, or execution-audit files); modifying any prior Gate 1–7, Increment 008, Increment 009, or Increment 010 governance record; modifying GOVREC; staging, committing, or pushing any change.

## M. Historical Boundary

This record does not rewrite or reinterpret any prior gate, Founder decision, or governance record in the Gate 1–7 lineage, the Increment 008 lineage, the Increment 009 contract, or the Increment 010 record. It persists exactly the five decisions reached following the Increment 011 technical sizing report, on top of every decision already recorded — nothing more.

## N. Final Determination

**FIVE FOUNDER DECISIONS PERSISTED: (1) CONSERVATIVE RATE LIMITING PER ZONE-2 WORKLOAD IDENTITY, NUMERIC VALUE DEFERRED, (2) CONSERVATIVE CONCURRENCY PER ZONE-2 WORKLOAD IDENTITY, NUMERIC VALUE DEFERRED, (3) GATEWAY AUDIT-WRITE FAILURE FAILS CLOSED, (4) NO CAPABILITY-AUTHORIZATION-RESULT FIELD IN THE ENVELOPE, (5) NO REQUEST-ORIGIN/USER FIELD IN THE ENVELOPE — ALL INCREMENT 010 DECISIONS AND CONSTRAINTS PRESERVED — GATE 1–7 REMAINS UNCHANGED AND AUTHORITATIVE — STATE D REMAINS CLOSED — FD-6 REMAINS NON-OPERATIONAL — NO CREDENTIAL, ENDPOINT, GCP RESOURCE, TERRAFORM, MIGRATION, OR IMPLEMENTATION AUTHORIZATION IS GRANTED BY THIS RECORD**
