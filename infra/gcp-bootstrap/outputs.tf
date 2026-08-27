# Non-secret identifiers only — needed to construct infra/gcp's own
# `-backend-config` values (see infra/gcp/environments/*.backend.hcl.example)
# once this bootstrap has actually been applied (not performed by this
# increment).

output "state_project_id" {
  description = "The dedicated state-management GCP project ID actually used."
  value       = var.state_project_id
}

output "staging_state_bucket" {
  description = "Name of the staging Terraform state bucket. Pass as `bucket` in infra/gcp's staging -backend-config."
  value       = google_storage_bucket.staging_state.name
}

output "production_state_bucket" {
  description = "Name of the production Terraform state bucket. Pass as `bucket` in infra/gcp's production -backend-config."
  value       = google_storage_bucket.production_state.name
}

output "terraform_state_service_account_email" {
  description = "Email of the dedicated Terraform State Service Account. Whoever applies infra/gcp against the resulting GCS backend must be authenticated as (or able to impersonate) this identity, or hold equivalent bucket-scoped access — the exact operator-authentication model is a separate, future decision, not made by this record."
  value       = google_service_account.terraform_state.email
}
