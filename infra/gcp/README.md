# DECIVEXA — Increment 009 GCP Infrastructure (IaC Source Only)

## Status

**AUTHORED, NOT APPLIED.** No resource described in this directory has been
created. No `terraform init`, `terraform plan` against a real backend, or
`terraform apply` has been run. This is declarative source only, produced
under a Founder authorization scoped strictly to credential-free IaC
authoring (`docs/gates/INCREMENT-009-SECURE-AI-RUNTIME-INFRASTRUCTURE-FOUNDATION-GCP.md`).

## Remediation history

This source was authored, then independently reviewed
(Increment 009 IaC Security, Architecture & Readiness Review), then
corrected against that review's findings — all credential-free, all
unapplied, at every stage:

- **IaC-1 (HIGH):** `main.tf` Cloud Run ingress corrected from
  `INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER` (no matching LB resource
  existed) to `INGRESS_TRAFFIC_INTERNAL_ONLY`.
- **IaC-2 (MEDIUM):** Deploy identity's `roles/run.developer` grant
  narrowed from project-scoped to Gateway-resource-scoped (`iam.tf`).
- **IaC-3 (MEDIUM):** Documented, not invented — the absent
  `roles/run.invoker` binding is an explicit dependency on a future
  Zone-2 application identity (`iam.tf`).
- **IaC-4 (MEDIUM):** Added defense-in-depth documentation and a
  regression-review reminder distinguishing the WIF provider's
  `attribute_condition` from the IAM principalSet selector's narrower
  scope (`workload_identity.tf`).
- **IaC-5 (HIGH):** Introduced `allowed_provider_egress_cidrs` as a
  separate, validated input; the conditional firewall rule now fails
  to plan/apply rather than silently under- or over-restricting egress
  (`variables.tf`, `network.tf`).
- **IaC-6 (LOW):** Reviewed and retained — documented why project-scoped
  `roles/logging.logWriter` remains the appropriate, already-minimal
  choice (`iam.tf`).

## What this represents

The Increment 009 trust-boundary foundation, and nothing beyond it:

```
Founder Governance → GitHub Repository → Build Identity → Immutable Artifact
  → Human Approval (GitHub "production" Environment, reviewer: Parsa Kiamanesh)
  → Deploy Identity (GitHub OIDC → GCP Workload Identity Federation)
  → GCP Gateway Runtime
  → Runtime Identity (sole future Anthropic WIF-eligible identity — NOT configured here)
```

## What this explicitly does NOT do

- Does not create an Anthropic (or any provider) credential, API key, or WIF
  federation rule. Provider WIF is Increment 011 and is entirely out of
  scope here.
- Does not configure the GitHub `production` Environment or its required
  reviewer. **GitHub repository-level Environment protection with a
  required reviewer must be configured directly by an authorized human
  (Parsa Kiamanesh) through the GitHub UI or an admin-scoped API call —
  this is deliberately not automated through this IaC or through any
  service-account-driven pipeline**, consistent with this increment's own
  principle that production authorization must never be automatable by a
  workload identity. This is documented as an external prerequisite, not
  a limitation to work around.
- Does not implement Gateway application/business logic. That is
  represented only as the deployment target (a container image, referenced
  by digest) this infrastructure runs — the code itself is a separate,
  future deliverable.
- Does not grant `roles/owner`, `roles/editor`, or any broad administrative
  role to any identity defined here.

## External prerequisites (Founder/human action, outside this IaC)

1. A GCP project must exist, with billing enabled, provided/selected by the
   Founder.
2. The GitHub repository must have a `production` Environment configured
   with **Parsa Kiamanesh** as a required reviewer (GitHub UI: Settings →
   Environments → New environment → `production` → Required reviewers).
3. `terraform init`/`plan`/`apply` must be run by an authorized human or a
   separately-authorized, narrowly-scoped bootstrap identity — never by
   this session, and never by a workload identity that this same
   configuration also constrains.
4. The container image the Gateway will run must be built and pushed to an
   Artifact Registry repository (referenced here by digest, per
   `var.gateway_image_digest` — no default, must be supplied explicitly)
   before any `production.tfvars` can be meaningfully applied.

## Network boundary — honest limitation disclosure

GCP VPC firewall rules operate on IP/CIDR ranges, not hostnames. This IaC
therefore cannot enforce "only `api.anthropic.com`" at the network layer by
hostname alone (see `network.tf` for the exact mechanism used: a
restrictive Cloud NAT static-IP egress path as defense-in-depth). The
authoritative destination-integrity enforcement remains the existing,
already-implemented, already-tested application-layer controls in
`apps/api/src/infrastructure/ai/gate7/gate7-provider-security.ts`
(`assertHttpsScheme`, `assertNotPrivateOrInternalDestination`, the
trusted-endpoint allow-list) — this IaC does not modify that file and does
not claim the network layer alone provides stronger enforcement than it
actually does.

Two deliberately separate variables express this split: `allowed_provider_egress_hosts`
(hostnames — documents intent, never consumed by the firewall) and
`allowed_provider_egress_cidrs` (resolved IP ranges — the only thing the
firewall rule actually reads). Neither has a default beyond an empty list;
`network.tf`'s firewall rule carries an explicit `lifecycle.precondition`
that refuses to plan/apply if hostnames are configured without matching
CIDRs, and separately refuses `"0.0.0.0/0"` outright — see `variables.tf`
and `network.tf` for the exact mechanism (IaC-5 remediation).

## Provenance chain this infrastructure supports

`source commit → build → artifact digest → GitHub Environment human
approval → deployment → runtime identity → Gateway invocation` — the GCP
side (Cloud Audit Logs, `logging.tf`) covers the deployment-identity and
runtime-identity legs. The GitHub side (commit, approval event, workflow
run) is outside this IaC's scope and is provided by GitHub itself.

## Emergency revocation (documented, not executed)

To revoke the runtime identity's standing (independent of GitHub, in an
emergency): an authorized GCP-project human operator disables or deletes
the `google_service_account.runtime` resource, or removes its IAM bindings,
directly in the GCP Console or via `gcloud`/Terraform run by that operator.
Because no Anthropic WIF federation rule exists yet (Increment 011), there
is currently nothing provider-side to revoke — this procedure becomes
materially more important once Increment 011 introduces one, at which point
the federation rule itself must also be revocable independently of GitHub.

## Terraform state (Increment 025)

**Terraform state uses GCS.** **State is owned by a dedicated GCP
state-management project** — never the same project as this
configuration's own `var.project_id`. **Staging and production use
separate GCS buckets** — never one shared bucket. **Terraform state
access uses a dedicated, least-privileged Terraform State Service
Account** — never the Gateway Runtime SA, never the Gateway Deploy SA,
never the Zone-2 `apps/api` Runtime SA, and no application/runtime
identity is ever granted any permission on either state bucket. All four
of these are Founder decisions (Founder Backend Decision Closure,
Increment 024), not this configuration's own choice.

The project, buckets, and state service account that back this
configuration's `backend "gcs" {}` block (`versions.tf`) are created by a
**separate Terraform root**, `infra/gcp-bootstrap/` — see its own
`README.md` for the full bootstrap-lifecycle rationale (a backend cannot
depend on itself, so bootstrap deliberately uses local state, applied
once by an authorized operator, before this configuration's own backend
can be initialized against the result). This configuration does not
create its own backend's resources, and claiming those GCP resources
exist merely because this Terraform source has been authored would be
false — as of Increment 025, none of them exist (see that increment's
report for the explicit resource-by-resource confirmation).

`versions.tf`'s `backend "gcs" {}` block is deliberately empty (a
partial/environment-agnostic configuration) — concrete bucket/prefix
values are supplied per environment via `-backend-config`, using
`environments/staging.backend.hcl.example` /
`production.backend.hcl.example` as templates. Real values (the actual
bucket names) only exist once `infra/gcp-bootstrap` has actually been
applied — a separate, not-yet-authorized action.

## File layout

| File | Purpose |
|---|---|
| `versions.tf` | Terraform + provider version pins, GCS backend type declaration (empty/partial — see "Terraform state" above) |
| `providers.tf` | `google`/`google-beta` provider configuration (no embedded credentials — relies on the operator's own ADC at apply time) |
| `variables.tf` | All environment-specific inputs |
| `main.tf` | Required API enablement |
| `iam.tf` | Build/Deploy/Runtime/Zone-2 identity definitions and least-privilege bindings |
| `workload_identity.tf` | GitHub OIDC → GCP Workload Identity Federation, scoped to this exact repository and the `production` GitHub Environment claim |
| `network.tf` | VPC, restrictive egress path, honest limitation documentation |
| `logging.tf` | Cloud Audit Log configuration for the identities/services defined here |
| `secret_manager.tf` | Zone-3 OpenAI provider credential container (Increment 020) |
| `outputs.tf` | Non-secret identifiers needed to configure the GitHub Actions deployment workflow |
| `environments/*.tfvars.example` | Safe placeholder values only — no real project IDs, no real digests |
| `environments/*.backend.hcl.example` | Safe placeholder `-backend-config` values only — no real bucket names until `infra/gcp-bootstrap` has actually been applied |
