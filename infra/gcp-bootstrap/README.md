# DECIVEXA — Terraform Remote-State Bootstrap (Increment 025)

## Status

**AUTHORED, NOT APPLIED.** No resource described in this directory has been
created. No `terraform init` against a real backend, no `terraform plan`,
and no `terraform apply` has been run. This is declarative source only,
produced under Increment 025's explicit Founder authorization (design,
naming-convention proposal, and static-validation-only scope).

## Why this is a SEPARATE Terraform root from `infra/gcp`

`infra/gcp` is designed to use a GCS remote backend (Founder Decision A1,
Increment 024 closure). But the resources that backend depends on — the
state-management GCP project, the two state buckets, and the dedicated
Terraform State Service Account — must themselves be created by *some*
Terraform run, and that run cannot use the backend it is itself creating
(the standard remote-state bootstrap chicken-and-egg problem).

This directory resolves that by being **the one part of DECIVEXA's
Terraform surface that intentionally uses LOCAL state**, run once by an
authorized human operator, to stand up the handful of resources
`infra/gcp` will later reference via its own GCS backend configuration.

**This is a genuinely separate lifecycle from `infra/gcp`'s own state:**
- `infra/gcp-bootstrap` is applied rarely (ideally once) — only when the
  state-management project, buckets, or the state service account
  themselves need to change.
- `infra/gcp` is applied routinely, using the GCS backend this bootstrap
  creates.
- `infra/gcp-bootstrap`'s own local state file is itself sensitive
  (it describes the resources that protect all other Terraform state) and
  must never be committed to this repository or left in a shared,
  unprotected location — see "Operator responsibility" below.

## What this represents

```
Dedicated State GCP Project (state_project_id — OPERATOR INPUT, no default)
        │
        ├── Staging State Bucket   (google_storage_bucket.staging_state)
        ├── Production State Bucket (google_storage_bucket.production_state)
        └── Terraform State Service Account (google_service_account.terraform_state)
              │
              ├── roles/storage.objectAdmin on the staging bucket only
              └── roles/storage.objectAdmin on the production bucket only
```

This exactly preserves the four Founder decisions closed in the "Founder
Backend Decision Closure" record:
- **Backend = GCS**
- **State ownership = a dedicated GCP state-management project**, separate
  from the project that will host DECIVEXA's AI Gateway infrastructure
  (`infra/gcp`'s own `var.project_id`).
- **Environment isolation = SEPARATE BUCKETS** — staging and production
  never share a bucket; each has its own, so `staging state != production
  state` and `staging bucket != production bucket` both hold structurally,
  not merely by convention.
- **State identity = a dedicated Terraform State Service Account** —
  never the Gateway Runtime SA, never the Gateway Deploy SA, never the
  Zone-2 `apps/api` Runtime SA (`infra/gcp/iam.tf`'s three identities plus
  Zone-2's own). No identity is merged or reused across concerns.

## What this explicitly does NOT do

- Does not create the state-management GCP project itself — `project_id`
  (renamed `state_project_id` here to avoid confusion with `infra/gcp`'s
  own `project_id`) has no default and must already exist, exactly
  mirroring `infra/gcp/variables.tf`'s own `project_id` convention.
- Does not grant the Terraform State Service Account any role beyond
  `roles/storage.objectAdmin`, each grant scoped to exactly one bucket —
  never `roles/owner`, `roles/editor`, `roles/storage.admin`, or any
  project-wide role.
- Does not configure `infra/gcp`'s own backend block for you — that still
  requires supplying this bootstrap's resulting bucket names via
  `-backend-config` (see `infra/gcp/environments/*.backend.hcl.example`).
- Does not decide a bucket lifecycle/retention policy — deliberately left
  **OPEN** (see "Open items" below) rather than inventing a destructive
  deletion rule with no governance backing it.
- Does not use CMEK — Google-managed encryption is the default and
  sufficient absent an explicit Founder decision requiring customer-managed
  keys; none exists, so none is introduced here.

## Operator responsibility (external to this Terraform source)

Because this root deliberately has no remote backend of its own:
1. Whoever runs `terraform init`/`apply` here must do so from a
   controlled, non-shared location.
2. The resulting `terraform.tfstate` (and `.terraform/`) must **never** be
   committed to this repository, and must be protected at least as
   carefully as the resources it describes (it will contain the state
   service account's resource identifiers, though never a private key —
   this configuration never creates a service-account key file, matching
   `infra/gcp/providers.tf`'s own "no long-lived cloud access keys"
   discipline).
3. A future, separate, explicitly authorized decision should determine
   whether this bootstrap state is later migrated to its own protected
   remote location (e.g., a small, manually-created bucket, itself outside
   Terraform's own management to avoid an infinite regress) — **OPEN**,
   not decided here.

## Open items (explicitly deferred, not invented)

- **Bucket lifecycle/retention/deletion policy** — undecided. No
  `lifecycle_rule` block exists in `storage.tf`; historical state versions
  are retained indefinitely by default (versioning is enabled, nothing
  deletes old versions) until a future, explicit governance decision sets
  a retention policy.
- **Bootstrap state's own long-term storage location** — undecided, see
  "Operator responsibility" above.
- **Exact concrete names** (state project ID, bucket names, region) — see
  `environments/*.tfvars.example`; all remain placeholders.

## File layout

| File | Purpose |
|---|---|
| `versions.tf` | Terraform + provider version pins (mirrors `infra/gcp`) — **local state, deliberately no backend block** |
| `providers.tf` | `google`/`google-beta` provider configuration (ADC, no embedded credential) |
| `variables.tf` | All environment-specific inputs — naming convention documented per-variable |
| `main.tf` | Required API enablement in the state-management project |
| `storage.tf` | The two state buckets — security posture documented inline |
| `iam.tf` | The Terraform State Service Account + its two bucket-scoped bindings |
| `outputs.tf` | Non-secret identifiers needed to construct `infra/gcp`'s own `-backend-config` |
| `environments/*.tfvars.example` | Safe placeholder values only |
