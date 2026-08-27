# GitHub Actions OIDC → GCP Workload Identity Federation, scoped as
# narrowly as GCP's attribute-condition mechanism allows (Increment 009
# §D.3 / §11 of the authorizing prompt). This file federates the DEPLOY
# identity only. It creates no Anthropic (or other provider) federation
# resource of any kind — that is Increment 011, and would be configured on
# Anthropic's side (Claude Console), not here.

resource "google_iam_workload_identity_pool" "github" {
  provider                  = google-beta
  project                   = var.project_id
  workload_identity_pool_id = "github-actions-${var.environment}"
  display_name              = "GitHub Actions (${var.environment})"
  description               = "Increment 009: federates GitHub Actions OIDC tokens to the deploy identity only. No runtime-identity or provider-credential federation is configured here."
}

resource "google_iam_workload_identity_pool_provider" "github" {
  provider                           = google-beta
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"
  display_name                       = "GitHub OIDC"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
    # GitHub includes an `environment` claim in the OIDC token only when the
    # workflow job specifies `environment: production` — this is the
    # strongest available binding to the human-gated GitHub Environment
    # (configured externally; see README.md) without this Terraform ever
    # touching GitHub's own Environment configuration.
    "attribute.environment" = "assertion.environment"
  }

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  # Narrowest available condition: exact repository, exact branch ref, and
  # (where the calling workflow job declares it) exact GitHub Environment
  # name. A token missing the environment claim, or bearing any other
  # repository/ref, is rejected before it ever reaches IAM.
  attribute_condition = join(" && ", [
    "assertion.repository == \"${var.github_repository}\"",
    "assertion.ref == \"refs/heads/${var.github_deploy_branch}\"",
    "assertion.environment == \"${var.github_production_environment_name}\"",
  ])
}

# Grants the federated identity permission to impersonate the deploy
# service account only when the attribute_condition above is satisfied —
# never unconditionally.
#
# IaC-4 defense-in-depth note (Increment 009 IaC Review, MEDIUM finding):
# this principalSet selector filters on attribute.repository ONLY — it is
# deliberately coarser than the pool provider's own attribute_condition
# above, which additionally requires the exact branch ref AND the exact
# GitHub "production" Environment claim. Branch and Environment
# restriction is enforced entirely by the WIF PROVIDER's
# attribute_condition, not by this IAM principalSet selector — GCP does
# not support expressing ref/environment matching inside a principalSet
# path itself, only inside the provider's own condition. This is
# structurally correct (a token that fails the provider's
# attribute_condition is rejected before any principal/claims are even
# evaluated against this binding), but it means the two enforcement
# points are NOT redundant with each other, and their scopes differ.
#
# REGRESSION-REVIEW REMINDER: if google_iam_workload_identity_pool_provider.github's
# attribute_condition (above) is ever loosened, weakened, or removed in a
# future change, this principalSet binding provides NO independent
# branch/environment restriction of its own — the effective trust
# boundary would silently widen to "any ref, any environment, from this
# repository" without this binding itself changing at all. Any future
# review of workload_identity.tf must re-verify the provider's
# attribute_condition together with this binding, not either in
# isolation.
resource "google_service_account_iam_member" "github_can_impersonate_deploy" {
  service_account_id = google_service_account.deploy.name
  role                = "roles/iam.workloadIdentityUser"
  member              = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repository}"
}

# Explicitly NOT created in this file, documented rather than omitted
# silently:
#   - any Anthropic federation issuer/rule (Increment 011)
#   - any binding granting the deploy identity workloadIdentityPoolAdmin
#     over this pool (it must never be able to widen its own trust
#     condition)
#   - any binding federating the RUNTIME identity to GitHub Actions at all
#     — the runtime identity is reached only by being the Cloud Run
#     service's attached identity (iam.tf), never by federation
