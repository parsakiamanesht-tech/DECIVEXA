# Non-secret identifiers only. Nothing here is a credential — these values
# are needed to configure the GitHub Actions deployment workflow's
# `google-github-actions/auth` step (workload_identity_provider +
# service_account inputs), which itself receives no static secret either.

output "deploy_service_account_email" {
  description = "Email of the deploy identity. Pass as the `service_account` input to google-github-actions/auth in the deployment workflow."
  value       = google_service_account.deploy.email
}

output "runtime_service_account_email" {
  description = "Email of the runtime identity. Never referenced directly by any GitHub Actions workflow — informational only, for audit/verification purposes."
  value       = google_service_account.runtime.email
}

output "workload_identity_provider" {
  description = "Full resource name of the Workload Identity Federation provider. Pass as the `workload_identity_provider` input to google-github-actions/auth."
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "gateway_service_name" {
  description = "Name of the Cloud Run Gateway service."
  value       = google_cloud_run_v2_service.gateway.name
}

output "gateway_artifact_registry_repository" {
  description = "Full Artifact Registry repository path for Gateway images."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.gateway_images.repository_id}"
}

output "provider_egress_status" {
  description = "Human-readable statement of the current provider-egress posture, so `terraform output` itself documents the fail-closed default."
  value = length(var.allowed_provider_egress_hosts) == 0 ? "FAIL-CLOSED: no provider egress destinations approved — all external HTTPS egress from the Gateway is denied." : "WARNING: provider egress destinations configured — verify this matches an explicit Founder-approved decision before applying."
}

output "zone2_api_runtime_service_account_email" {
  description = "Email of the apps/api (Zone-2) Runtime Service Account (Increment 019 Decision A). Its only Gateway-specific permission is roles/run.invoker, scoped to this Gateway resource — see iam.tf."
  value       = google_service_account.zone2_api_runtime.email
}

output "provider_credential_secret_id" {
  description = "Secret Manager secret ID for the Zone-3 OpenAI provider credential (Increment 019 Decision B / Increment 020 Workstream B). Non-secret identifier only — no secret version exists in this configuration."
  value       = google_secret_manager_secret.provider_credential.secret_id
}
