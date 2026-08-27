# Dedicated Terraform State Service Account (Founder Decision D1) — the
# ONLY identity ever granted access to either state bucket. Never reused
# as, and never grants any permission to, an application/runtime identity:
# not the Gateway Runtime SA, not the Gateway Deploy SA, not the Zone-2
# apps/api Runtime SA (all defined in infra/gcp/iam.tf, a completely
# separate Terraform root — no resource in this file references any of
# them, and none of them is granted any permission in this file).
resource "google_service_account" "terraform_state" {
  project      = var.state_project_id
  account_id   = var.terraform_state_service_account_id
  display_name = "DECIVEXA Terraform State — Dedicated State Identity"
  description  = "Increment 025: exists ONLY to read/write Terraform state in the two buckets below. Never an application runtime identity. Never granted roles/owner, roles/editor, or any project-wide role."
}

# Bucket-scoped grants only — never roles/storage.admin (which would also
# grant IAM/lifecycle management over the bucket itself), never
# roles/editor or roles/owner, never a project-wide Storage role.
# roles/storage.objectAdmin is the standard, officially recommended
# minimum for a Terraform GCS backend identity: read/write/delete on
# objects within the bucket (state read, state write, and the
# generation-precondition mechanism the GCS backend uses natively for
# locking — no separate lock resource is required).
resource "google_storage_bucket_iam_member" "state_sa_staging_access" {
  bucket = google_storage_bucket.staging_state.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.terraform_state.email}"
}

resource "google_storage_bucket_iam_member" "state_sa_production_access" {
  bucket = google_storage_bucket.production_state.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.terraform_state.email}"
}

# Explicitly NOT granted, documented rather than omitted silently:
#   - roles/owner, roles/editor, roles/storage.admin, or any project-wide
#     role for the Terraform State Service Account;
#   - any permission on either bucket for any Gateway or Zone-2 identity
#     (those identities are defined in the entirely separate infra/gcp
#     Terraform root and are never referenced here);
#   - a service-account key file — this configuration never creates one,
#     matching infra/gcp/providers.tf's "no long-lived cloud access keys"
#     discipline; the operator applying this bootstrap uses their own ADC,
#     and whoever later applies infra/gcp against the resulting backend
#     does the same.
