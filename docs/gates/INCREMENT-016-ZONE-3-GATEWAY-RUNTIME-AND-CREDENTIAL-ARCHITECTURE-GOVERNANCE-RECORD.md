# Governance Record — Increment 016: Zone-3 Gateway Runtime & Credential Architecture Resolution

## A. Decision Identity

- **Title:** Governance Record — Increment 016: Zone-3 Gateway Runtime & Credential Architecture Resolution
- **Decision ID:** `FD-INCREMENT-016-ZONE-3-RUNTIME-CREDENTIAL-ARCHITECTURE-001`
- **Status:** ARCHITECTURE DECISION RECORD — evidence-derived decisions only; no Founder judgment call was silently made
- **Authority:** Derived from already Founder-approved principles (Minimum Necessary Architecture, Increment 009/010/011/013/014 decisions, TD-01 authority hierarchy) — not itself a new Founder preference decision. Where evidence was insufficient, the item is marked FOUNDER DECISION REQUIRED, not resolved.
- **Nature:** Documentation-only. No source code, Terraform, credential, endpoint, or infrastructure was created or modified. `apps/ai-gateway/**` and `infra/gcp/**` remain byte-identical to their state after the Increment 014/015 commits.

## B. Baseline

`HEAD` = `origin/main` = `4e05678bcd7a0539061f92673112cd12a025f38e` at the time of this decision — unchanged. 0/0 divergence, nothing staged, GOVREC MD5 `972ad36e523aa42e540f2c28a3aac801` unchanged. `apps/ai-gateway` re-verified: 102/102 tests passing, 0 typecheck errors.

## C. Decision A — HTTP Runtime / Entrypoint

**Selected: Option C — native `node:http`, no framework.**

**Evidence:** `apps/ai-gateway/package.json` already declares zero runtime dependencies (a deliberate posture from Increment 014, reconfirmed in its own Dependency Findings). The Gateway's actual workload is a single JSON POST endpoint wrapping the already-implemented, already-tested `handleGatewayRequest(rawBody, credential, deps): Promise<GatewayResponse>` pure function — no routing, templating, sessions, or multi-endpoint complexity exists or is evidenced anywhere in the approved design. NestJS (Option A) was explicitly rejected per this increment's own governing instruction: matching `apps/api`'s framework choice merely for consistency is not evidence, and would coupling two independently-deployable trust boundaries (Increment 010 Option C, dual-layer) to one framework decision for no functional reason. Express/Fastify (Option B) would add a maintained but unnecessary dependency and attack-surface increment with no capability `node:http` cannot already provide for this exact workload. No Option D candidate is evidenced anywhere in this repository.

**Why this satisfies the evaluation criteria:** minimal dependency footprint (zero) and attack surface; Cloud Run compatibility is native (any process listening on `$PORT`/`0.0.0.0` qualifies); request parsing/response handling is already fully implemented in `handleGatewayRequest` — the HTTP layer's only job is byte-stream-in, byte-stream-out; testability is unaffected (the pure function is already unit-tested independent of any transport); zero coupling to `apps/api`'s framework; maximally consistent with Minimum Necessary Architecture and the Gateway's status as an independent trust boundary.

## D. Runtime Contract

(Design only — no `server.ts` or equivalent file is created by this record; §2 of the authorizing prompt permits documentation only.)

- **Container process / entrypoint:** a future, small `apps/ai-gateway/src/server.ts` — a thin `node:http` wrapper constructing `GatewayRequestHandlerDeps` from server-owned configuration and calling the existing `handleGatewayRequest()` per request. Not created by this record.
- **Port / binding:** `process.env.PORT` (Cloud Run's required convention), bound to `0.0.0.0`. No hardcoded default — an unset `PORT` must fail startup (fail-closed, consistent with the existing `AI_PROVIDER_ENDPOINT`-must-not-silently-default precedent).
- **Startup behavior:** fail fast if required configuration (workload authenticator, capability table, credential source, allowlist) cannot be constructed — no permissive fallback, consistent with every existing fail-closed control in this lineage.
- **Shutdown / SIGTERM:** stop accepting new connections, allow in-flight requests to complete within Cloud Run's grace period, then exit. No queue, no request draining beyond what's already in flight.
- **Health/readiness endpoint:** **none required by evidence.** Cloud Run's default startup/liveness behavior only requires the container to accept TCP/HTTP connections on `$PORT` — it does not require a dedicated health path unless a custom probe is later configured, which no evidence here justifies. Adding one now would violate Minimum Necessary Architecture.
- **Request-size boundary — a genuine design consequence surfaced by this review:** `handleGatewayRequest(rawBody: string, ...)` currently accepts an already-fully-read string. The future HTTP layer MUST itself cap bytes read from the incoming request stream at `MAX_REQUEST_BYTES` (16 KiB) **before** buffering completes — reading an unbounded stream into memory before calling the existing string-level check would defeat the locked 16 KiB limit at the transport layer. This is a required property of any future `server.ts`, not a new numeric decision (the 16 KiB value itself is unchanged).
- **Response-size boundary:** no additional HTTP-layer control needed — `handleGatewayRequest`'s internal 64 KiB provider-response cap already bounds the only variable-size content in any response; the Gateway's own JSON responses are always small and fixed-shape.
- **Provider timeout / stream-timeout coverage:** unchanged, entirely internal to `handleGatewayRequest` (Increment 014's corrective pass). The HTTP layer additionally needs its own, separate request/headers timeout (Node's `http.Server` `requestTimeout`/`headersTimeout` options) to bound a slow/hanging **client** connection — a distinct concern from the provider-side 30s value, not to be conflated with or substituted for it.
- **Concurrency interaction:** no new HTTP-layer concurrency control is needed — Node's `http.Server` natively handles concurrent connections; the existing per-workload `WorkloadConcurrencyGuard` remains the sole application-level concurrency boundary, unchanged.
- **Malformed request / malformed provider response / error normalization:** entirely handled inside `handleGatewayRequest`, unchanged. The HTTP layer's only remaining job is mapping `GatewayResponse.status` to an HTTP status code and serializing the body — no logic duplication.
- **Audit/logging boundary — a genuine new requirement surfaced by this review:** the future HTTP layer MUST NOT log raw request bodies, raw headers (which would include the OIDC token), or any field not already part of the existing `GatewayAuditRecord` shape. No access-log middleware may be added without this constraint being verified against it.
- **Environment variables — configuration vs. secrets:** Configuration (non-secret): `PORT`; rate-limit/concurrency numeric values (still deferred, §K); the capability→provider/model table; the workload invoker allowlist (service-account email identifiers — not secret material). **Secrets: none may ever be read via a plain environment variable in production** — see Decision B (§E). This deliberately departs from Gate-7's own `AI_PROVIDER_API_KEY` env-var convention, which is acceptable only for Gate-7's narrow, currently credential-free, non-production test-only scope, not for Zone-3's production credential custody (Increment 010 Decision 2).
- **Caller-input exclusions:** unchanged — providerId/modelId/endpoint/credential remain structurally impossible to supply via the request contract (Increment 014, untouched).

## E. Decision B — Production Credential Backend

**Selected: Google Secret Manager.**

**Evidence-based comparison:**
- **Environment-injected secret:** rejected. Visible to anyone with `run.services.get`/describe permission on the Cloud Run service — broader exposure than the Runtime identity alone; no built-in rotation/versioning; no secret-specific audit trail (only "who read the service config," not "who accessed the credential"). This is exactly the pattern Gate-7's own `apps/api` config uses, acceptable there only because Gate-7 has never held a real credential in this repository's current state — not an appropriate precedent for Zone-3's actual production custody boundary (Increment 010 Decision 2).
- **Secret Manager:** native rotation/versioning; IAM access scopable to exactly one secret resource (never project-wide); full Cloud Audit Log trail specific to secret access (extends the audit-config pattern `infra/gcp/logging.tf` already establishes for `iam.googleapis.com`/`run.googleapis.com` — extending it to `secretmanager.googleapis.com` is a concrete, narrow, future Terraform addition, not made by this record); async retrieval fits `CredentialSource.resolve(): Promise<string | null>`'s existing interface shape exactly, requiring no interface change; blast radius limited to exactly the Runtime SA plus exactly one secret resource.

This satisfies every principle named in §8 of the authorizing prompt (custody, least privilege, zero trust, no credential in source/request/response/audit/logs, rotation, revocation, versioning, runtime retrieval, blast radius, IAM scoping, auditability) more directly than any alternative evidenced in this repository.

## F. Required Credential Architecture Candidate — Compatibility Confirmed

`Cloud Run Runtime Service Account → Secret Manager → CredentialSource → Provider Adapter → Provider`, checked against:

- `credential-source.port.ts`: compatible — the interface's async `resolve()` shape matches Secret Manager's own client-library access pattern exactly; no change required.
- Gateway trust boundary / Zone-3: compatible — retrieval happens entirely inside the Cloud Run process using its own Runtime SA's ambient identity; never crosses to Zone-2 or `apps/api`.
- Existing Terraform IAM model: compatible and additive-only — `google_service_account.runtime` (`iam.tf`) already exists; a future `roles/secretmanager.secretAccessor` binding scoped to one specific, not-yet-created secret resource would be a narrow addition, not a conflict. **Not created by this record** — the secret resource itself doesn't exist yet, and §2/§17 of the authorizing prompt forbid any GCP-resource-creating Terraform change in this increment.
- Least privilege / zero trust / no credential exposure: satisfied, per §E's analysis and Increment 014's already-tested non-exposure guarantees (response/error/audit shapes structurally cannot carry a credential value).

**Formally recorded as the confirmed target credential architecture. No secret, no IAM binding, no Terraform change was created.**

## G. Decision C — Production OIDC Audience

**Mechanism resolved by evidence; exact value not yet determinable — these are explicitly distinguished, not conflated.**

**Mechanism (evidence-based, recorded now):** Google's own documented convention for Cloud-Run-to-Cloud-Run IAM-invoker authentication — the same mechanism Increment 009 §G already specifies (Google-signed OIDC ID token, issuer/signature/audience validated by the receiver) — sets the token audience to the **target Cloud Run service's own URL**. No custom/alternative audience scheme is introduced; doing so would add configuration complexity with no evidenced requirement, violating Minimum Necessary Architecture.

**Exact value: not yet determinable — not a Founder preference decision, an unavailable deployment-time fact.** Cloud Run assigns a service's URL only once actually deployed to a real project; no project exists (standing, unchanged this session). This is categorically different from Decision D below: it requires no judgment call, only deployment to exist.

## H. Decision D — Zone-2 Invoker Identity

**FOUNDER DECISION REQUIRED — genuinely not determinable from repository evidence, not invented.**

No GCP-native service-account identity for `apps/api` (the eventual Zone-2 caller) exists anywhere in this repository, in Terraform, or in any prior governance record — `apps/api` itself has never been deployed to GCP. Per §12's own instruction, this identity is not invented. It is contingent on a future, separate decision about whether/how `apps/api` is ever deployed to GCP at all — itself out of scope for every phase authorized so far (Phase G, `apps/api` integration, remains unauthorized).

## I. Security Threat Model (re-evaluated with the runtime/credential architecture layer added)

| # | Threat | Possible? | Control | Evidence | Remaining gap |
|---|---|---|---|---|---|
| 1 | Public invocation | No | `INGRESS_TRAFFIC_INTERNAL_ONLY` + Cloud Run v2 default-closed IAM | E2 (source) | Unverifiable at E4 until deployed |
| 2 | Forged OIDC token | No, once implemented | Signature/issuer/audience validation (INV-006 design) | E1; seam exists E2/E3 | Real verifier not yet implemented (Phase D was seam-only) |
| 3 | Wrong audience | No, once implemented | Target-service-URL audience convention (§G) | E1 | Real value doesn't exist until deployed |
| 4 | Wrong issuer | No, once implemented | Fixed Google issuer (`https://accounts.google.com` / Cloud Run's token issuer), never caller-configurable | E1 | Same |
| 5 | Unauthorized Zone-2 workload | No, once implemented | Invoker allowlist (`authorizeGatewayInvocation`, tested) | E3 | Which identity is allowlisted = Decision D, open |
| 6 | Arbitrary workload invocation | No | Same as #5 | E3 | Same |
| 7–10 | Caller-selected provider/model/endpoint/credential | No | Structural envelope rejection | E2/E3, tested | None found |
| 11 | Credential leakage (general) | No | `CredentialSource` never wired to request/response/audit; Secret Manager scoping (§E/§F) | E1 (Secret Manager)/E2/E3 (existing non-exposure tests) | Real secret doesn't exist yet |
| 12 | Raw provider response leakage | No | Response normalization (Increment 014, tested) | E3 | None found |
| 13 | Provider endpoint bypass | No | Server-owned mapping only | E2/E3 | None found |
| 14 | Unrestricted egress | No | Deny-all default, dual-precondition-guarded conditional rule | E2 | Not verifiable at E3/E4 — `terraform validate` unavailable |
| 15 | Runtime SA overprivilege | No | Only `roles/logging.logWriter` today; future `secretAccessor` would be resource-scoped, not project-wide (§F) | E2/E1 | None found |
| 16 | Secret access by deploy identity | No, by design (§F) | Secret Manager IAM would grant only the Runtime SA, never Deploy | E1 | Not provisioned to verify at E4 |
| 17 | Secret access by Zone-2 | No, by design | Zone-2 has no path to Secret Manager in this architecture | E1 | Same |
| 18 | Credential leakage through logs | No | New explicit requirement recorded in §D (audit/logging boundary) | E1/E2 (existing non-logging discipline) | Enforced only once `server.ts` exists — flagged, not built |
| 19 | Credential leakage through audit | No | `GatewayAuditRecord`'s field shape structurally excludes it (Increment 014, tested) | E3 | None found |
| 20 | Indefinite provider execution | No | Combined-operation 30s timeout (Increment 014 corrective pass) | E3 | None found |
| 21 | Concurrency exhaustion | No (bounded, fail-closed) | `WorkloadConcurrencyGuard` (Increment 014, tested) | E3 | Numeric ceiling still deferred (Increment 013) |
| 22 | Rate-limit bypass | No (dimension), partially open (value) | Per-workload, before authorization (Increment 014 corrective pass) | E3 | Numeric threshold still deferred |
| 23 | Retry/fallback bypass | No | Structurally absent anywhere in the Gateway (tested) | E3 | See §L, item on TD-09 language tension |

## J. Architecture Decision Matrix

| Decision | Options considered | Evidence | Selected | Confidence | Founder approval required? |
|---|---|---|---|---|---|
| HTTP runtime | NestJS / Express-Fastify / native `node:http` / other | §C | native `node:http` | High — directly evidenced | No (derived from existing MNA posture) |
| Entrypoint | — | §D | future `src/server.ts`, thin wrapper | High | No |
| Container model | — | §D/§H (report) | Cloud Run, existing `main.tf` shape preserved | High | No — no Terraform change made |
| Health model | dedicated `/healthz` vs. none | §D | none required | High | No |
| Secret backend | Secret Manager / env-injected / other GCP-native | §E | Secret Manager | High | No |
| Secret access model | Runtime-SA-scoped vs. broader | §F | Runtime SA only, resource-scoped | High | No |
| OIDC audience (mechanism) | target-service-URL vs. custom | §G | target-service-URL (Google default) | High | No |
| OIDC audience (value) | — | §G | not yet determinable | N/A | No — deployment-time fact, not a decision |
| Zone-2 invoker identity | — | §H | unresolved | N/A | **Yes — FOUNDER DECISION REQUIRED** |

## K. Documentation Tensions Discovered (flagged, not resolved)

1. **`docs/technical-design/TD-09-AI-GATEWAY.md`** (status: "Proposed technical contract") lists "timeout/retry/circuit-breaker behavior" and "deterministic fallback when AI is unavailable" among Gateway responsibilities — language that could be read as conflicting with Increment 010 Decision 1's explicit "no fallback routing" / "no automatic retry." [INTERPRETATION, not resolved here]: TD-09's language most plausibly describes end-user-facing graceful degradation (a deterministic error/unavailable state), not a second live provider path — consistent with, not contradictory to, the Increment decisions. TD-01's own authority hierarchy and conflict-resolution procedure (§ "Conflict resolution": stop, identify both artifacts, determine if an ADR resolves it, otherwise propose one, obtain Founder approval) applies here; this record does not perform that resolution — it only surfaces the tension for a future, explicit reconciliation.
2. **Two independent `ADR-NNN` numbering sequences already exist** in this repository: `docs/adr/ADR-001` through `ADR-004`, and a separately-numbered `docs/architecture/ADR-001`/`ADR-003`–`ADR-006`. Because of this pre-existing ambiguity, this record was deliberately placed under the unambiguous, already-proven `docs/gates/` Increment-governance-record convention rather than as a new `ADR-NNN`, to avoid deepening an already-unresolved documentation-structure question. This choice is disclosed, not silently made.

## L. Explicit Non-Authorizations

This record does **not** authorize: any GCP resource creation; `terraform apply`; any `gcloud` infrastructure change; any real credential, endpoint, or GitHub secret; any deployment; any migration; any `apps/api` modification; any Gate 1–7 modification; any GOVREC modification; any Terraform file change (`infra/gcp/**` remains byte-identical); creation of `server.ts`, `Dockerfile`, or any other source file; staging, committing, or pushing this or any other file.

## M. Final Determination

**DECISIONS A, B, AND THE OIDC-AUDIENCE MECHANISM (PART OF C) RESOLVED BY EVIDENCE AND RECORDED — THE OIDC-AUDIENCE VALUE (REMAINDER OF C) AND ZONE-2 INVOKER IDENTITY (D) REMAIN UNRESOLVED, THE LATTER EXPLICITLY FOUNDER-DECISION-REQUIRED — NO SOURCE CODE, TERRAFORM, CREDENTIAL, ENDPOINT, OR INFRASTRUCTURE WAS CREATED OR MODIFIED — GATE 1–7 AND `apps/api` REMAIN UNTOUCHED — PHASE F REMAINS NOT AUTHORIZED BY THIS RECORD**
