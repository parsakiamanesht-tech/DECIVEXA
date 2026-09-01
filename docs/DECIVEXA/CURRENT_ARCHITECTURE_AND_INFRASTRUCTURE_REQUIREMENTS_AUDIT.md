# DECIVEXA — CURRENT ARCHITECTURE & INFRASTRUCTURE REQUIREMENTS AUDIT

**Document type:** Read-only infrastructure/architecture audit record, prepared
in support of a GCP → Biznet infrastructure-provider evaluation.
**Status:** FOUNDER-REVIEWED — DOCUMENTATION ONLY. Does not authorize
deployment, credential creation, GCP modification/deletion, Terraform
migration, Biznet provisioning, or any application/architecture change.
**Date:** 2026-09-01.
**Baseline:** `main` at commit `5e520e23b295b4c918f324cf4524ae4cb302f762`.
**Authorizing instruction:** Founder-authorized "GCP INFRASTRUCTURE TRACK —
READINESS AUDIT DIRECTIVE" (read-only discovery) followed by "FOUNDER
DIRECTIVE — DOCUMENT CREATION ONLY" (this document's creation).

**Evidence discipline used throughout:** every claim below is marked
**[FACT]** (directly verified against repository content), **[DESIGNED
ONLY]** (documented intent, not yet implemented), **[PRESENT AS CODE — NOT
DEPLOYED]** (infrastructure-as-code exists with no evidence of actual
deployment), or **[UNKNOWN / NOT YET DETERMINABLE]** (no repository
evidence exists either way). No UNKNOWN is silently converted into an
assumption anywhere in this document.

---

## 1. Executive Summary

DECIVEXA is a three-application TypeScript monorepo — `apps/web` (Next.js),
`apps/api` (NestJS, "Zone-2"), and `apps/ai-gateway` (a standalone "Zone-3"
AI Gateway service) — backed by a single PostgreSQL database. GCP
infrastructure exists in this repository **[FACT]** as committed Terraform
source under `infra/gcp/` and `infra/gcp-bootstrap/`, but **no evidence of
an actual deployed GCP environment, populated credential, or production
traffic was found** **[PRESENT AS CODE — NOT DEPLOYED]**: no Terraform
state file exists anywhere in the repository, and no deploy/apply workflow
exists in `.github/workflows/` (only build/test verification workflows).
This means an infrastructure-provider decision can be made now, before any
GCP deployment has occurred, at very low switching cost — there is
currently no running production workload on GCP to migrate away from.

GCP is not being declared technically deficient anywhere in this document.
The finding is narrower and evidence-based: the GCP work done so far is
design and infrastructure-as-code, not a live deployment, so evaluating an
alternative provider (Biznet) now does not require tearing anything real
down.

## 2. Repository Baseline

Audited at commit `5e520e23b295b4c918f324cf4524ae4cb302f762` on branch
`main`, `origin/main` synchronized, `0/0` divergence, protected file
`docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` MD5 `972ad36e523aa42e540f2c28a3aac801`
unchanged throughout the audit that produced this document.

## 3. Current System Architecture

Three applications **[FACT]**:

1. `apps/web` — Next.js `14.2.5`, React `18.3.1`. Public-facing.
2. `apps/api` — NestJS `^11.1.28`, Drizzle ORM `^0.44.5` over `pg`
   `^8.16.3`. Public-facing. Referred to elsewhere in this repository's
   governance history as "Zone-2."
3. `apps/ai-gateway` — a standalone Node/TypeScript HTTP service with zero
   runtime npm dependencies (only `typescript`/`@types/node` as dev
   dependencies), containerized via a multi-stage `Dockerfile`
   (`node:22-slim`). Referred to elsewhere as "Zone-3." Architecturally
   required to remain internal-only, never publicly reachable, and never
   directly called by `apps/web`.

## 4. Implemented vs Designed State

- **[FACT / IMPLEMENTED — SHIPPED]:** Web authentication, dashboard,
  Personal State read/write UI; API authentication, health endpoint,
  Personal State HTTP surface (`GET`/`POST`/`PATCH /personal-state`,
  `GET /personal-state/history`) — all tested (Playwright e2e on the web
  side, `node:test` on the API side) and present on `main`.
- **[FACT / IMPLEMENTED, repository-layer only — not exposed over HTTP]:**
  Memory (append-only record/version model with provenance, lifecycle,
  confidence, a typed content/reference value, and an independent
  user-confirmation flag), Personal Intelligence (Claims, Relationships,
  Relationship Evidence, Matching-Hypothesis Confirmation, Temporal
  Validity, Context), and Evidence.
- **[FACT / IMPLEMENTED, tested]:** the AI Gateway's HTTP contract types,
  authorization policy, transport limits, an OpenAI provider adapter (on
  both the API side and the Gateway side), rate limiting, concurrency
  guarding, and audit recording.
- **[DESIGNED ONLY]:** real GCP-based caller authentication for the
  Gateway (Google-signed OIDC ID-token verification, "INV-006"). Only an
  interface/seam (`workload-authentication.ts`) exists; its own source
  comment states explicitly that no real GCP audience, service account,
  IAM binding, or OIDC/JWT verification library is introduced by it.
- **[DESIGNED ONLY]:** a GitHub protected `production` Environment with a
  required human reviewer — no such configuration exists in `.github/`.
- **Decision 7 / Cross-Claim Matching: [FACT] NOT APPROVED** — zero
  implementation footprint anywhere in the repository, confirmed by
  repeated dedicated scans this session.

## 5. Application Components

- `apps/api/src/`: `application/` (ai-context, auth, evidence, memory,
  personal-intelligence, personal-state, workspace), `core/` (evidence,
  memory, personal-intelligence, personal-state, resource),
  `infrastructure/` (ai, ai-runtime, auth, evidence, persistence,
  personal-state), plus `context/`, `domain/`, `foundation/`, `health/`,
  `observability/`, `persistence/`, `shared/`. **[FACT, directory
  listing.]**
- `apps/web/`: flat App Router structure (`app/page.tsx`, `login`,
  `register`, `dashboard`, `layout.tsx`), `lib/api.ts`, `lib/auth-context.tsx`,
  `lib/require-auth.tsx`, `lib/personal-state.ts`. **[FACT.]**
- `apps/ai-gateway/src/`: errors, correlation IDs, contract types,
  authorization policy, workload authentication (seam only), transport
  limits, provider adapter interface + OpenAI implementation, rate-limit,
  concurrency, audit, orchestration, and `server.ts`. **[FACT.]**

## 6. Database

PostgreSQL — CI workflows pin `image: postgres:18` **[FACT]**. Accessed via
Drizzle ORM; 16 migration files exist under
`apps/api/src/persistence/migrations/` **[FACT]**, covering identity,
evidence, memory, personal-intelligence, and personal-state schemas within
one logical `decivexa` Postgres schema namespace. **No managed-database
Terraform resource (e.g. Cloud SQL) exists anywhere in `infra/gcp/`**
**[FACT — absence verified]** — database hosting model is currently
entirely undecided at the infrastructure level.

## 7. AI Architecture

A provider-agnostic `AIProvider` interface (API side) and a matching
`ProviderAdapter` interface (Gateway side), each with a working OpenAI
adapter, and explicitly **no retry/fallback logic** (confirmed via source
inspection — the no-fallback rule, "Increment 010 Decision 1," is enforced
structurally, not merely documented) **[FACT]**. Model routing and a
capability registry exist and are tested **[FACT]**. Memory, Personal
Intelligence, and Evidence never reference the AI infrastructure and vice
versa — a deliberate, structurally-enforced boundary, not a gap **[FACT]**.
Real GCP-based Gateway authentication remains **[DESIGNED ONLY]** (§4).

## 8. Memory

**[FACT / IMPLEMENTED]** at the domain/repository layer — two tables
(`memory_records`, `memory_record_versions`) in the shared PostgreSQL
database. No external consumer (HTTP or AI) is wired to it. No separate
infrastructure requirement beyond the one shared database.

## 9. Personal Intelligence

**[FACT / IMPLEMENTED]** — the largest implemented subsystem by file and
table count, entirely repository-layer, sharing the same single
PostgreSQL database. No separate infrastructure requirement.

## 10. Context

**[FACT / IMPLEMENTED]** — an application-owned Context service
(`ai-context.service.ts`) with a narrow, tested adapter seam to the AI
runtime (ADR-009). No dedicated external infrastructure (no vector
database, no external context store) is required.

## 11. Authentication/Security

Self-built password hashing + signed access-token mechanism, with an
authentication guard on protected routes **[FACT]** — no external identity
provider is used. No TLS-termination logic exists inside the applications
themselves **[FACT — absence verified]**; TLS is expected to be provided
by the hosting/ingress layer. Zone-2 → Zone-3 service authentication is
**[DESIGNED ONLY]** around Google-signed OIDC tokens — this is a
GCP-specific mechanism that would need a provider-agnostic redesign under
a non-GCP host.

## 12. Infrastructure Inventory

**[PRESENT AS CODE — NOT DEPLOYED]:** all 14 files under `infra/gcp/` and
9 files under `infra/gcp-bootstrap/` are committed to `main`. They define:
three/four GCP service accounts (`deploy`, `runtime`, `zone2_api_runtime`)
with least-privilege, resource-scoped IAM bindings; a Cloud Run service
definition for the Gateway (`INGRESS_TRAFFIC_INTERNAL_ONLY`); a Secret
Manager secret **container** for the OpenAI credential (no value); an
Artifact Registry repository; VPC/NAT egress restriction; a separate
Terraform-state-bootstrap configuration. **No `.tfstate` file exists
anywhere in the repository, and no deploy/`terraform apply` workflow
exists in `.github/workflows/`** (only build/test verification workflows)
**[FACT — direct evidence of non-deployment]**. A `Dockerfile` exists for
`apps/ai-gateway` only — not yet for `apps/api` or `apps/web` **[FACT]**.

## 13. GCP Dependency Map

| Dependency | Classification |
|---|---|
| Cloud Run (Gateway hosting definition) | GCP-specific mechanism; managed-container hosting is the provider-agnostic underlying need |
| Service accounts / IAM | GCP-specific mechanism; per-service identity separation is the provider-agnostic underlying need |
| Workload Identity Federation (GitHub→GCP) | GCP-specific mechanism; secure CI-to-infra deploy credentialing is the underlying need |
| OIDC-based Gateway auth (not yet implemented) | GCP-specific mechanism; non-forgeable service-to-service caller identity is the underlying need |
| Secret Manager (container only, no value) | GCP-specific mechanism; secure secret storage is the underlying need |
| Artifact Registry | GCP-specific mechanism; a container image registry is the underlying need |
| VPC/NAT egress restriction | GCP-specific mechanism; restricted outbound networking is the underlying need |
| Cloud Logging | GCP-specific mechanism; log retention/audit is the underlying need |
| Managed PostgreSQL | **No such resource exists in Terraform at all** — this is not a migration item, it is an entirely open decision |

## 14. Provider-Agnostic Requirements

A place to run 2–3 small containerized Node.js services; a PostgreSQL 18
database reachable privately from `apps/api`; outbound HTTPS restricted to
an explicit allowlist (OpenAI's API host, when populated); inbound HTTPS
for the public web/API surface only — **the AI Gateway must never be
publicly reachable**; secret storage for at least one API key, readable
only by the Gateway's runtime identity; a container image registry; a
CI/CD deploy path with a human production-approval gate; basic log
retention; TLS termination for public endpoints.

## 15. Current Infrastructure Requirements

One small API process, one small web process, one PostgreSQL 18 database.
**[UNKNOWN / NOT YET DETERMINABLE]:** exact compute sizing, since no
production deployment or load measurement has ever occurred.

## 16. Near-Term Infrastructure Requirements

Containerized deployment for `apps/api` (no Dockerfile yet); an actually
network-reachable AI Gateway once its real authentication layer is
implemented; secret storage for the OpenAI key; a CI/CD deploy pipeline
(currently only verification workflows exist, no deploy workflow).

## 17. Future/Unknown Requirements

**[UNKNOWN / NOT YET DETERMINABLE]** in full: any infrastructure implied
by product systems not yet built — Goal OS, Daily OS, Digital Twin, Growth
Navigation, Progress Intelligence, or Cross-Claim Matching (the last
remaining explicitly NOT APPROVED) — because none of these systems exist
in the repository yet.

## 18. Security Requirements

Egress allowlisting; private network isolation between the application
tier and the database; least-privilege secret access (only the Gateway
runtime should read the OpenAI key); TLS on all public endpoints; audit
logging of deployments and secret access; no credentials committed to
source control — **[FACT, confirmed]:** no `.env` or credential files
exist anywhere in the repository.

## 19. Backup/Recovery Requirements

**[UNKNOWN / NOT YET DETERMINABLE / UNRESOLVED]** across the board — no
backup tooling, RPO/RTO policy, or disaster-recovery procedure exists
anywhere in the repository today. This is an evidenced gap, not an
oversight of this document, and should be established as part of any new
infrastructure engagement.

## 20. Networking Requirements

Public HTTPS for web/API; **no public ingress for the AI Gateway**
(architecturally required); restricted outbound HTTPS to OpenAI only, once
populated; DNS for public hostnames. **[UNKNOWN]:** whether a static/stable
egress IP is required — no evidence exists either way.

## 21. Deployment Requirements

Container-based deployment for at least the AI Gateway (`Dockerfile`
exists); a to-be-created deployment path for the API and web applications;
a human-gated production-approval step (architecturally required, not yet
configured on any platform — **[DESIGNED ONLY]**); immutable-artifact
deployment (deploy by digest, never by a mutable tag).

## 22. Observability Requirements

**[FACT / IMPLEMENTED]:** structured audit-event logging (API and
Gateway), a health-check endpoint. **[UNKNOWN / not implemented]:**
metrics export, distributed tracing, alerting.

## 23. Migration-Critical Dependencies

These are architectural invariants that must be preserved under any
infrastructure provider, GCP or otherwise: the three-identity separation
principle (build/deploy/runtime never merged); the AI Gateway's
internal-only network posture; the provider-agnostic AI architecture with
its no-fallback rule. Everything else identified as GCP-specific in §13 is
mechanism, not invariant, and can be redesigned for a different provider.

## 24. Unknowns / Evidence Gaps

Exact GCP project ID / OIDC audience / container image digest; production
compute sizing; production traffic/concurrency; backup/RPO/RTO policy; TLS
certificate management approach; whether `apps/web` will ultimately be
deployed as a Node server or a static export; exact egress-IP/allowlisting
requirements.

## 25. Final Infrastructure Requirement Profile

A small-to-modest managed environment capable of running 2–3 containerized
Node.js services, one PostgreSQL 18 database (the version currently
verified in CI), restricted outbound HTTPS, a secret store, a container
registry, and a CI/CD deploy path with human approval gating — sized
initially for low, currently unmeasured production traffic, with clear
room to grow as additional already-built DECIVEXA subsystems are exposed
over HTTP in the future.

---

## Architectural Position (Explicit)

GCP is **not** declared technically deficient anywhere in this document.
The finding is narrower: GCP infrastructure exists as committed Terraform
source, but no evidence of an actual deployed GCP environment was found —
therefore no production GCP workload currently requires migration, and the
infrastructure-provider decision can be reconsidered before any deployment
occurs. Biznet is being evaluated as a potential target provider. The
final provider decision remains dependent on technical evidence — in
particular, Biznet's own answers regarding PostgreSQL 18 support, private
networking, internal-only service exposure, secure service-to-service
authentication, secret management, backup/recovery, scaling, availability,
networking, and pricing (see the accompanying Biznet Infrastructure
Consultation Request).

## Governance Status

Decision 7 remains **NOT APPROVED**. Cross-Claim Matching remains **NOT
AUTHORIZED**. This document does not authorize, imply, or advance either.
It does not authorize GCP deletion, GCP resource destruction, Terraform
migration, Biznet provisioning or purchase, infrastructure deployment, DNS
changes, credential creation, secret creation, production deployment, or
any application/architecture/schema/CI change. GCP infrastructure remains
the current candidate/reference architecture until the Biznet consultation
produces sufficient evidence for a replacement decision.
