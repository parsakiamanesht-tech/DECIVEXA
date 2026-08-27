# Two separate GCS buckets (Founder Decision C1: SEPARATE BUCKETS) —
# staging and production Terraform state NEVER share a bucket. This is a
# structural invariant, not a naming convention: staging_state and
# production_state are two distinct google_storage_bucket resources, so
# "staging state != production state" and "staging bucket != production
# bucket" both hold by construction, not merely by prefix discipline.
#
# Security posture for BOTH buckets (Increment 025 §7):
#   - uniform_bucket_level_access: IAM-only access control, no legacy ACLs.
#   - public_access_prevention = "enforced": structurally blocks any
#     future public/allUsers/allAuthenticatedUsers grant, regardless of
#     what IAM bindings might otherwise be added later.
#   - versioning enabled: every historical state version is retained.
#   - NO lifecycle_rule: retention/deletion policy is explicitly OPEN
#     (README.md "Open items") — inventing a destructive deletion rule
#     with no governance decision behind it would risk silently discarding
#     historical Terraform state, which this configuration will not do.
#   - Google-managed encryption (the GCS default) — no CMEK, since no
#     Founder decision requires customer-managed keys.

resource "google_storage_bucket" "staging_state" {
  project  = var.state_project_id
  name     = "${var.state_project_id}-${var.staging_bucket_suffix}"
  location = var.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  labels = var.labels

  depends_on = [google_project_service.required]
}

resource "google_storage_bucket" "production_state" {
  project  = var.state_project_id
  name     = "${var.state_project_id}-${var.production_bucket_suffix}"
  location = var.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  labels = var.labels

  depends_on = [google_project_service.required]
}
