terraform {
  required_version = ">= 1.7.0, < 2.0.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.40"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.40"
    }
  }

  # Increment 025: backend TYPE is now Founder-decided (GCS — Founder
  # Backend Decision Closure, A1). This is a deliberately EMPTY, partial
  # backend block — Terraform's own supported mechanism for supplying the
  # concrete bucket/prefix values separately, per environment, via
  # `-backend-config=...` flags or a `-backend-config=<file>.hcl` file
  # (see environments/*.backend.hcl.example). No bucket name, project, or
  # prefix is hardcoded here — those remain deployment-time facts until an
  # operator supplies them, exactly as gateway_image_digest and project_id
  # already do for this same configuration (variables.tf). The two state
  # buckets referenced by that future -backend-config are themselves
  # created by the separate infra/gcp-bootstrap root (see its README.md),
  # never by this configuration.
  backend "gcs" {}
}
