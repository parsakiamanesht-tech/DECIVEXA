# Three-identity model (Increment 009 §D.2–D.4 / §9 of the authorizing
# prompt). Build, Deploy, and Runtime are never merged.
#
# BUILD IDENTITY: intentionally has NO representation in this file, and no
# GCP resource of any kind. Build/test/typecheck jobs (the existing
# .github/workflows/*.yml verification workflows) run with GitHub Actions'
# own default, zero-cloud-permission token. Zero production permissions is
# achieved by *absence*, not by a narrowly-scoped grant — there is nothing
# to narrow, because nothing is granted.

# --- DEPLOY IDENTITY ---
# Deployment-only. Explicitly excluded from: provider credentials, WIF
# federation-rule administration, broad IAM administration, service-account
# key creation (which would reintroduce a long-lived-credential fallback).
resource "google_service_account" "deploy" {
  project      = var.project_id
  account_id   = "${var.deploy_service_account_id}-${var.environment}"
  display_name = "DECIVEXA AI Gateway — Deploy Identity (${var.environment})"
  description  = "Increment 009: deployment-only identity, federated via GitHub OIDC (see workload_identity.tf). Must never be granted roles/owner, roles/editor, WIF pool/provider admin, or roles/iam.serviceAccountKeyAdmin."
}

# IaC-2 remediation (Increment 009 IaC Review, MEDIUM finding): the
# original grant used google_project_iam_member with roles/run.developer,
# which would have let the deploy identity deploy/update *any* Cloud Run
# service in the project, not only the Gateway. Scoped instead to the
# specific Gateway resource only — if additional Cloud Run services are
# ever added to this project, this identity gains no authority over them
# without a separate, explicit grant.
resource "google_cloud_run_v2_service_iam_member" "deploy_run_developer" {
  provider = google-beta
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.gateway.name
  role     = "roles/run.developer"
  member   = "serviceAccount:${google_service_account.deploy.email}"
}

resource "google_artifact_registry_repository_iam_member" "deploy_reader" {
  provider   = google-beta
  project    = var.project_id
  location   = var.region
  repository = google_artifact_registry_repository.gateway_images.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.deploy.email}"
}

# Explicitly NOT granted to the deploy identity, documented rather than
# omitted silently, per the Increment 009 contract's requirement that
# absence of a grant be a deliberate, auditable statement:
#   - roles/owner, roles/editor
#   - roles/iam.workloadIdentityPoolAdmin (cannot modify WIF trust rules)
#   - roles/iam.serviceAccountKeyAdmin (cannot mint long-lived keys)
#   - roles/iam.serviceAccountAdmin (cannot create/modify the runtime SA)
#   - any role touching Anthropic or any other provider (no such GCP
#     resource exists — providers are not GCP-native, so this is a
#     structural, not merely policy, exclusion)

# --- RUNTIME IDENTITY ---
# Bound only to the Gateway compute resource itself (see network.tf /
# the Cloud Run service definition). The sole identity ever eligible for
# future Anthropic Workload Identity Federation (Increment 011 — not
# configured here). Never granted to build or deploy jobs.
resource "google_service_account" "runtime" {
  project      = var.project_id
  account_id   = "${var.runtime_service_account_id}-${var.environment}"
  display_name = "DECIVEXA AI Gateway — Runtime Identity (${var.environment})"
  description  = "Increment 009: bound exclusively to the deployed Gateway workload. Increment 011 will be the first (and only) place a future Anthropic WIF federation rule may reference this identity — no such reference exists in this configuration."
}

# The deploy identity may deploy a Cloud Run revision that *runs as* the
# runtime identity, but this binding grants only actAs for that specific
# purpose — it does not let the deploy identity use the runtime identity's
# credentials directly, and does not let it modify the runtime identity's
# own IAM bindings.
resource "google_service_account_iam_member" "deploy_can_actas_runtime" {
  service_account_id = google_service_account.runtime.name
  role                = "roles/iam.serviceAccountUser"
  member              = "serviceAccount:${google_service_account.deploy.email}"
}

# Runtime identity is granted only what the Gateway needs to operate:
# writing its own audit/log records. It is explicitly NOT granted any
# provider-facing role in this increment.
#
# IaC-6 review decision (Increment 009 IaC Review, LOW finding): kept
# project-scoped rather than narrowed to a specific log bucket/view.
# roles/logging.logWriter is already Cloud Logging's least-broad
# predefined write role — it grants only the ability to write new log
# entries, never to read, modify, or delete existing logs (including logs
# written by other identities), and there is no finer-grained predefined
# role for "write your own service's logs" without authoring and
# maintaining a custom IAM role for a permission whose blast radius is
# already low. Per the review's own instruction not to trade operational
# correctness for theoretical least privilege, this grant is preserved
# as-is.
resource "google_project_iam_member" "runtime_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}

# IaC-3 documentation (Increment 009 IaC Review, MEDIUM finding): no
# roles/run.invoker binding existed anywhere in this configuration prior
# to Increment 020, because granting it requires naming a specific Zone-2
# application service account as the member, and no such identity had yet
# been defined by any Founder-approved architecture. See below.

# --- ZONE-2 IDENTITY (apps/api) ---
# Increment 019 Founder Decision A / A2 / A3: a NEW, DEDICATED Runtime
# Service Account for apps/api (Zone-2) — never the Gateway's own Runtime
# or Deploy identity, per the three-identity never-merge principle
# (unchanged, extended rather than collapsed by this fourth, separate
# identity). Its only Gateway-specific permission is roles/run.invoker,
# scoped to this Gateway resource only. It receives no other grant here:
# no Secret Manager access (secret_manager.tf grants that to the Gateway
# Runtime SA exclusively — see that file), no project-level role, no
# access to the Gateway Deploy SA. This resource declares the identity
# only — it is independent of, and does not require, a decision about
# which GCP compute resource eventually hosts apps/api itself (Increment
# 020 §6: that hosting-resource decision remains separately open).
resource "google_service_account" "zone2_api_runtime" {
  project      = var.project_id
  account_id   = "${var.zone2_api_runtime_service_account_id}-${var.environment}"
  display_name = "DECIVEXA apps/api — Zone-2 Runtime Identity (${var.environment})"
  description  = "Increment 019/020: apps/api's own dedicated Runtime Service Account. Never reused as, or merged with, the Zone-3 Gateway's Runtime or Deploy identity. Its only Gateway-specific permission is roles/run.invoker, scoped to the Gateway resource only."
}

resource "google_cloud_run_v2_service_iam_member" "zone2_can_invoke_gateway" {
  provider = google-beta
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.gateway.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.zone2_api_runtime.email}"
}

# Explicitly NOT granted to the Zone-2 identity, documented rather than
# omitted silently (Increment 019 Decision A2's own constraints):
#   - the Gateway Runtime SA's identity or any of its permissions
#   - the Gateway Deploy SA's identity or any of its permissions
#   - roles/secretmanager.secretAccessor on the provider-credential secret
#     (secret_manager.tf grants that to the Gateway Runtime SA only)
#   - any project-level role beyond the single resource-scoped run.invoker
#     grant above
