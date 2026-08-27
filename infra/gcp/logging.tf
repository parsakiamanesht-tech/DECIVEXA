# Auditability foundation (Increment 009 §D.8 / §12 of the authorizing
# prompt). Covers the deployment-identity and runtime-identity legs of the
# provenance chain documented in README.md. Does not log credentials,
# tokens, authorization headers, or request/response payloads — only
# GCP-side Cloud Audit Log data-access entries for the identities and
# services this configuration defines.

resource "google_project_iam_audit_config" "iam_audit" {
  project = var.project_id
  service = "iam.googleapis.com"

  audit_log_config {
    log_type = "ADMIN_READ"
  }
  audit_log_config {
    log_type = "DATA_READ"
  }
  audit_log_config {
    log_type = "DATA_WRITE"
  }
}

resource "google_project_iam_audit_config" "run_audit" {
  project = var.project_id
  service = "run.googleapis.com"

  audit_log_config {
    log_type = "ADMIN_READ"
  }
  audit_log_config {
    log_type = "DATA_WRITE"
  }
}

# Log sink placeholder for future extension of the existing
# ai/observability (FD-4) audit-record pattern into GCP-side long-term
# storage. Not wired to any destination in this credential-free authoring
# task — creating a real destination (e.g. a BigQuery dataset or GCS
# bucket) is left to a future increment once retention/access-control
# requirements for audit data are explicitly decided, consistent with
# Minimum Necessary Architecture.
