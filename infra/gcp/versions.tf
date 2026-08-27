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

  # Backend intentionally left unconfigured here. The operator applying this
  # configuration must supply a backend (e.g. a GCS bucket with versioning
  # and access controls of its own) via `-backend-config` or a separate
  # backend.tf that is NOT part of this credential-free authoring task.
}
