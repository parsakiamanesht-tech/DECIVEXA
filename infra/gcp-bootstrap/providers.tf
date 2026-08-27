# No credentials are embedded here — same discipline as infra/gcp's own
# providers.tf. At apply time (not performed by this increment), the
# `google`/`google-beta` providers resolve credentials from the applying
# operator's own environment (Application Default Credentials).

provider "google" {
  project = var.state_project_id
  region  = var.region
}

provider "google-beta" {
  project = var.state_project_id
  region  = var.region
}
