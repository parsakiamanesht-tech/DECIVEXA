# Deliberately NO backend block — this root's own state is local,
# by design (see README.md "Why this is a SEPARATE Terraform root"). A
# root that creates the GCS buckets a remote backend would use cannot
# itself depend on that same backend without an unresolvable bootstrap
# cycle. Version constraints mirror infra/gcp's own (same overall
# toolchain discipline, independently maintained per-root).

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
}
