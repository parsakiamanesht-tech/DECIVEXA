# Secret Manager representation of the Increment 016 Founder-approved
# credential architecture (Increment 020 Workstream B):
#
#   Cloud Run Gateway Runtime SA -> Secret Manager -> CredentialSource
#     -> Provider Adapter -> OpenAI (Increment 019 Decision B1)
#
# This file creates the SECRET CONTAINER ONLY — a named resource Secret
# Manager can hold versions under. It creates NO google_secret_manager_secret_version
# and therefore holds NO credential value of any kind. Populating a real
# OpenAI API key into this container is a separate, future, explicitly
# authorized deployment-time action (never performed by Terraform source
# authoring, never committed to this repository).
#
# Access is granted to the Gateway RUNTIME identity exclusively —
# consistent with Increment 016 §F/§I and Increment 019/020's own explicit
# constraints:
#   - the Gateway DEPLOY identity receives NO access to this secret;
#   - the Zone-2 (apps/api) identity receives NO access to this secret;
#   - no broader (project-level) Secret Manager role is granted anywhere.
resource "google_secret_manager_secret" "provider_credential" {
  project   = var.project_id
  secret_id = "${local.resource_prefix}-${var.provider_credential_secret_id}"

  replication {
    auto {}
  }

  labels = var.labels

  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret_iam_member" "runtime_can_access_provider_credential" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.provider_credential.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.runtime.email}"
}

# Explicitly NOT granted, documented rather than omitted silently:
#   - google_service_account.deploy — the Gateway Deploy identity must
#     never read the provider credential (Increment 009 §D.3 / Increment
#     019 §D);
#   - google_service_account.zone2_api_runtime — Zone-2 (apps/api) must
#     never receive the Zone-3 provider credential (Increment 010 Decision
#     2 / Increment 016 §F / Increment 019 §D, unchanged);
#   - any project-level roles/secretmanager.* role for any identity.
