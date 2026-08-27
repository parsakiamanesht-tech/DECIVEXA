# No credentials are embedded here. At apply time, the `google` and
# `google-beta` providers resolve credentials from the applying operator's
# own environment (Application Default Credentials) — this file never
# references a service-account key file or inline credential of any kind,
# consistent with the "no long-lived cloud access keys" requirement
# (TD-08 §10) and the Increment 009 contract's prohibition on static
# credential fallbacks.

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}
