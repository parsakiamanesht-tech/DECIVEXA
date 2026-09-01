# Increment 019 — Phase-F Decision Closure: Zone-2 Invoker Identity & AI Provider Selection — Governance Record

## Present-Day Repository Reconciliation

*Added 2026-09-01, read-only documentary closure — Founder-authorized
"FOUNDER-AUTHORIZED INCREMENT 019 DOCUMENTARY CLOSURE — EXECUTION
DIRECTIVE." This section is a present-day addition; the document below
it is preserved unmodified as the historical record.*

This document is preserved as a historical decision record. Its §A/§C/§I
approval language ("FOUNDER-APPROVED DECISION RECORD," "FOUNDER
DECISIONS A AND B CLOSED") remains a claim contained in this historical
document only, and must not be upgraded into independently corroborated
repository authority — no independent surviving authorization record for
these decisions was found elsewhere in the repository.

Independently of that claim, surviving repository evidence demonstrates
that the specific decisions this document describes were subsequently
implemented:

- **A2/A3 (Zone-2 Runtime Identity):** `infra/gcp/iam.tf` defines
  `resource "google_service_account" "zone2_api_runtime"`, with
  `account_id = "${var.zone2_api_runtime_service_account_id}-${var.environment}"`
  (default `decivexa-api-runtime`, per `infra/gcp/variables.tf`), a
  single `roles/run.invoker` binding scoped to the Gateway resource, and
  an implementation comment identifying it as the dedicated Zone-2
  Runtime Service Account, "Never reused as, or merged with, the Zone-3
  Gateway's Runtime or Deploy identity."
- **B1 (OpenAI Provider Selection):**
  `apps/ai-gateway/src/provider/openai-gateway-provider.ts` and its
  configuration counterpart exist and implement an OpenAI provider.
- Both are found in commit `f37580a` (`feat(ai-gateway): implement
  OpenAI provider and GCP identity foundation`).

The implementation described above is independently verifiable in the
repository and is associated with commit `f37580a`; however, the
separate authorization record that permitted that implementation is not
reconstructed by this reconciliation. This reconciliation does not
claim that this document itself authorized the implementation merely
because the implementation matches its decisions, and does not create
new Founder authorization.

**B3/B4** (provider abstraction mandatory; no Zone-3 fallback) were
reaffirmed, not newly decided, by this historical document, and remain
applicable where unchanged pre-existing repository evidence supports
that statement; this reconciliation does not newly authorize or
re-decide either.

This document's §H — the explicit list of what this record does not
authorize (Terraform modification, GCP resource creation, credentials,
deployment, staging/commit/push) — remains a true statement about the
authority of this historical document itself: this record, as written,
authorized none of that. That a separate, later, real implementation
occurred through some other authorization path does not retroactively
authorize Terraform, credentials, deployment, or infrastructure work by
this document, and §H is not rewritten or corrected here.

The following items this document lists as open/deferred remain
unresolved and are not addressed, resolved, or converted into
implementation requirements by this reconciliation: exact OIDC
audience; exact GCP project ID; container image digest; resolved
OpenAI egress CIDRs; the TD-01 duplicate-document issue; rollback
operational policy; rate-limit/concurrency numeric values.

This reconciliation does not authorize any new implementation, does not
alter Decision 7 (remains NOT APPROVED) or Cross-Claim Matching (remains
NOT AUTHORIZED), and does not authorize deployment, credentials,
further Terraform changes, or any other backlog item.

## A. Record Identity

- **Increment:** 019
- **Scope:** Founder Decision Closure only — the two remaining open decisions identified by Increment 018's Phase-F Readiness report (Zone-2 invoker identity model, AI provider selection). No implementation, no Terraform, no GCP resource, no credential.
- **Baseline SHA (`HEAD = origin/main` at the time these decisions were requested and recorded):** `8a8419176245131391f7f0acc1034fdae4b02199`
- **Date:** 2026-08-27
- **Status:** FOUNDER-APPROVED DECISION RECORD — UNCOMMITTED (this file exists locally only; commit/push require a separate, explicit Founder authorization per this increment's own instruction)

## B. Founder Decision A — Zone-2 Invoker Identity

**A1 — Hosting decision: YES.** `apps/api` (Zone-2) will be deployed to GCP as a workload capable of using a GCP-native workload identity, consistent with the already-approved Zone-2 → Zone-3 OIDC architecture (Increment 009 §G) and the three-identity separation principle. This decision does not itself select the exact GCP hosting resource, and does not authorize any deployment.

**A2 — Identity model: APPROVE.** A new, dedicated Runtime Service Account for `apps/api` / Zone-2 is approved, with the following binding constraints:
- Must be entirely separate from the Zone-3 Gateway Runtime Service Account (`google_service_account.runtime` in `infra/gcp/iam.tf`).
- Must be entirely separate from the Zone-3 Gateway Deploy Service Account (`google_service_account.deploy` in `infra/gcp/iam.tf`).
- Its only Gateway-specific permission is `roles/run.invoker`, scoped exclusively to the Zone-3 Gateway Cloud Run resource — never project-wide, never `allUsers`, never a wildcard principal.
- Must NOT be granted access to the Gateway's provider credential or Secret Manager secret (that access belongs exclusively to the Gateway Runtime identity, per Decision B below and Increment 016).
- Must NOT be granted broader project-level permissions merely to invoke the Gateway.

**A3 — Naming convention: APPROVED — `decivexa-api-runtime-${environment}`.** Mirrors the existing Gateway identity convention (`decivexa-gw-runtime-${environment}`, `decivexa-gw-deploy-${environment}` in `infra/gcp/variables.tf`'s `runtime_service_account_id`/`deploy_service_account_id` defaults), substituting `api` for `gw` to name the Zone-2 component. Not invented by this record — supplied explicitly by the Founder.

## C. Founder Decision B — AI Provider Selection

**B1 — Provider: OpenAI.** OpenAI API is the concrete Zone-3 provider target for V1.

**Required fields, per this record's mandate:**
1. **Provider identity:** OpenAI.
2. **Provider endpoint class:** vendor SaaS.
3. **Protocol/API:** the existing OpenAI-compatible contract (`apps/api/src/infrastructure/ai/adapters/openai-compatible-provider.adapter.ts`) — this is a natural fit because that adapter's wire shape (`/chat/completions`, `choices[].message.content`, `usage.prompt_tokens`/`completion_tokens`) already mirrors OpenAI's own actual API, unlike Anthropic's native Messages API which would have required a new adapter. This is recorded as an implementation observation, not a re-decision of B1 — reuse remains "subject to the required implementation verification" per the Founder's own answer, not assumed complete by this record.
4. **Credential mechanism:** Secret Manager-backed static credential — unchanged from Increment 016, not reopened by this decision.
5. **Provider-specific egress requirement:** OpenAI's API host(s) — not resolved to CIDRs by this record; remains a deployment-time fact (`infra/gcp/variables.tf`'s `allowed_provider_egress_hosts`/`allowed_provider_egress_cidrs`, both still empty).
6. **Provider abstraction requirement — B3: YES.** Confirmed mandatory, unchanged. `apps/api` must not call OpenAI directly; the `AIProvider` interface and Zone-3 Gateway boundary remain the only path.
7. **Zone-3 fallback rule — B4: YES (forbidden).** Confirmed unchanged from Increment 010 Decision 1 — no automatic retry, failover, or silent provider switching is introduced by this decision.

## D. WIF Terminology Correction (per this increment's explicit instruction)

The historical repository references to "Anthropic WIF" (`infra/gcp/main.tf`, `iam.tf`, `workload_identity.tf`, `README.md`; `docs/gates/INCREMENT-009-...md`) are **not** treated as proof that any provider — Anthropic or otherwise — currently supports the GCP Workload Identity Federation authentication flow those comments describe. This concern is now moot for V1 in the sense that OpenAI, not Anthropic, is the selected provider, but the underlying correction stands generally: the concrete authentication mechanism to whichever provider is used must be technically verified before implementation, never assumed from prior comment language. **Increment 016's already-approved Secret Manager credential architecture remains the current, unchanged credential-backend decision** — this record does not alter it.

## E. Decision Validation Against Existing Architecture

Checked against every constraint named in this increment's directive:

| Constraint | Result |
|---|---|
| Three-identity never-merge rule (`infra/gcp/iam.tf` header) | **No conflict** — Decision A creates a fourth, separate identity; does not merge with Runtime or Deploy SA |
| Zone-2 → Zone-3 Gateway boundary | **No conflict** — `run.invoker` only, scoped to the Gateway resource |
| Least privilege | **No conflict** — single scoped role, no broader grant |
| Provider-agnostic architecture (ADR-001) | **No conflict** — ADR-001 rejected *direct OpenAI integration throughout the codebase* (domain/product code depending on a vendor SDK), not Zone-3 itself selecting OpenAI as its backend behind the Gateway abstraction; B3 explicitly reaffirms the abstraction stands |
| Secret Manager decision (Increment 016) | **No conflict** — reaffirmed unchanged |
| Zone-3 no-fallback decision (Increment 010 Decision 1) | **No conflict** — reaffirmed unchanged via B4 |
| Existing Gateway contract (INV-024 anti-generic-proxy) | **No conflict** — untouched, not implicated by either decision |
| Existing Terraform architecture | **No conflict** — no resource created or implied to exist; only a future name is recorded |

**No conflict requiring Founder override was found.** Both decisions are internally consistent with every prior non-negotiable architectural rule.

## F. Evidence Reviewed

`docs/gates/INCREMENT-009-SECURE-AI-RUNTIME-INFRASTRUCTURE-FOUNDATION-GCP.md`, `INCREMENT-010-...md`, `INCREMENT-011-...md`, `INCREMENT-013-...md`, `INCREMENT-016-...md`, Increment 017 implementation/review evidence (already-reviewed `apps/ai-gateway/**`), Increment 018's final report (this lineage's own prior readiness audit), `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md`, `docs/technical-design/TD-01_ARCHITECTURE_CONSTITUTION_AND_DOCUMENT_AUTHORITY.md` (the authoritative TD-01 per prior governance records' own cross-references — the duplicate `TD-01-ARCHITECTURE-CONSTITUTION.md` documentation-integrity issue is noted, not resolved, per this increment's explicit instruction), `docs/TD-08_TECHNOLOGY_DECISION_RECORDS.md`, `docs/technical-design/TD-09-AI-GATEWAY.md`, `docs/architecture/ADR-001-AI-PROVIDER-INDEPENDENCE-AND-RESILIENCE.md`, `docs/gates/AI-PROVIDER-RESOLUTION-POST-GATE-6-GOVERNANCE-DECISION-RECORD.md`, `apps/api/src/infrastructure/ai/adapters/openai-compatible-provider.adapter.ts`, `apps/api/src/infrastructure/ai/config/openai-compatible-provider.config.ts`, `apps/api/src/infrastructure/ai/provider/ai-provider.interface.ts`, `infra/gcp/iam.tf`, `infra/gcp/main.tf`, `infra/gcp/variables.tf`, `infra/gcp/outputs.tf`.

## G. Classification of Every Finding

- **FOUNDER DECISION (made by this record):** A1 (hosting=YES), A2 (identity model=APPROVE), A3 (naming=`decivexa-api-runtime-${environment}`), B1 (provider=OpenAI), B3 (abstraction mandatory=YES, reaffirmed), B4 (no fallback=YES, reaffirmed).
- **ARCHITECTURE DECISION (pre-existing, not reopened):** apps/api = Zone-2 (Increment 010); three-identity never-merge rule (Increment 009); provider-agnostic abstraction mandatory (ADR-001); Zone-3 no-fallback (Increment 010 Decision 1); Secret Manager as credential backend (Increment 016); INV-006/INV-007 OIDC mechanism (Increment 009).
- **DEPLOYMENT-TIME FACT (still open, not converted into a Founder decision by this record):** exact GCP hosting resource for `apps/api`; OpenAI's resolved egress CIDRs; OIDC audience exact value (Gateway service URL); GCP project ID; container image digest.
- **IMPLEMENTATION DETAIL (deferred to a separate, future, explicitly authorized increment):** creating the `decivexa-api-runtime-${environment}` service account in Terraform; adding the `roles/run.invoker` binding; verifying the existing OpenAI-compatible adapter's protocol sufficiency against OpenAI's real API; adding Secret Manager Terraform resources; populating `allowed_provider_egress_hosts`/`allowed_provider_egress_cidrs` for OpenAI's actual endpoints; any credential creation.
- **OPEN / DEFERRED (unchanged by this record):** which exact GCP hosting resource type `apps/api` will use (Cloud Run vs. other); GCP project selection; TD-01 duplicate-document resolution; rollback operational policy (Increment 018 §O); rate-limit/concurrency numeric values (Increment 011/013).

## H. Explicit List of What This Record Does NOT Authorize

This record does **not** authorize: creating the `decivexa-api-runtime-${environment}` service account or any other GCP resource; modifying `infra/gcp/iam.tf`, `main.tf`, or any other Terraform file; adding a `roles/run.invoker` binding; creating Secret Manager resources; modifying `apps/api`'s provider adapter or configuration; modifying `apps/ai-gateway`; configuring provider endpoints or egress; creating any credential or API key; building or pushing a Docker image; deploying Cloud Run; configuring GitHub Environments or workflows; running `terraform` or `gcloud`; staging, committing, or pushing any file (including this one).

## I. Final Determination

**FOUNDER DECISIONS A AND B CLOSED — ZONE-2 IDENTITY MODEL AND NAMING APPROVED (`decivexa-api-runtime-${environment}`, `roles/run.invoker`-only, never merged with Gateway Runtime/Deploy SA) — AI PROVIDER SELECTED (OPENAI, SaaS, OpenAI-compatible protocol, Secret Manager credential, no fallback) — PROVIDER ABSTRACTION AND NO-FALLBACK CONSTRAINTS REAFFIRMED UNCHANGED — NO CONFLICT WITH EXISTING ARCHITECTURE FOUND — NO IMPLEMENTATION, TERRAFORM, GCP RESOURCE, CREDENTIAL, OR DEPLOYMENT ACTION IS AUTHORIZED BY THIS RECORD — THIS FILE REMAINS UNCOMMITTED UNTIL A SEPARATE, EXPLICIT FOUNDER COMMIT/PUSH AUTHORIZATION**
