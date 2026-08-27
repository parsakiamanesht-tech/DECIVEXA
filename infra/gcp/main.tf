# Increment 009 foundation only. No provider (Anthropic or otherwise)
# resource, credential, or federation rule is defined anywhere in this
# configuration — see README.md.

locals {
  resource_prefix = "decivexa-${var.environment}"
}

# Required APIs for the Increment 009 foundation. Enabling an API is a
# declarative, credential-free-to-author (though not credential-free-to-
# apply) prerequisite — it grants no permissions by itself.
resource "google_project_service" "required" {
  for_each = toset([
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com", # required for Workload Identity Federation token exchange
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "logging.googleapis.com",
    "cloudaudit.googleapis.com",
    "compute.googleapis.com",       # required for the VPC/NAT egress path in network.tf
    "secretmanager.googleapis.com", # Increment 020 Workstream B: required for secret_manager.tf's secret container (no version/value created)
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "gateway_images" {
  provider = google-beta

  project       = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_repository_id
  format        = "DOCKER"
  description   = "Immutable container images for the DECIVEXA AI Gateway (Increment 009 foundation). Deployment must always reference an image by digest (see var.gateway_image_digest) — mutable tags are never the authoritative production reference."

  # Deliberately no cleanup policy that would delete a digest a production
  # deployment still references — rollback (Increment 009 §D.10) depends on
  # a previous digest remaining resolvable.

  labels = var.labels

  depends_on = [google_project_service.required]
}

# Gateway runtime resource foundation (Increment 009 §D.2 item 2 / §3.3).
# This declares the deployable slot the Gateway container runs in — it does
# NOT declare or authorize any Gateway application/business logic; the
# image itself is a separate, future deliverable, referenced here only by
# its required-explicit digest.
resource "google_cloud_run_v2_service" "gateway" {
  provider = google-beta

  project  = var.project_id
  name     = "${local.resource_prefix}-ai-gateway"
  location = var.region

  # IaC-1 remediation (Increment 009 IaC Review, HIGH finding): the
  # approved architecture is direct, authenticated Cloud-Run-to-Cloud-Run
  # service invocation (INV-006: Google-signed OIDC ID token + IAM
  # invoker authorization) — it requires no Load Balancer. The previous
  # value, INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER, assumed an LB resource
  # this configuration never defined, leaving the service unreachable by
  # design intent. INGRESS_TRAFFIC_INTERNAL_ONLY accepts traffic only from
  # resources inside this VPC / connected via Serverless VPC Access /
  # other internal Google Cloud sources — never the public internet, and
  # never Zone 1 (this Claude Code session, or any developer machine),
  # which has no network path into this project at all. This remains
  # fail-closed: Cloud Run v2's own default additionally requires IAM
  # `roles/run.invoker` authorization for any caller regardless of
  # ingress setting (see iam.tf's "Zone-2 invoker boundary" note — no such
  # binding exists yet, so the service accepts no caller at all today).
  ingress = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  template {
    service_account = google_service_account.runtime.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.gateway_images.repository_id}/ai-gateway@${var.gateway_image_digest}"
    }

    vpc_access {
      connector = google_vpc_access_connector.gateway_egress.id
      egress    = "ALL_TRAFFIC" # forces all egress through the restrictive NAT path in network.tf — see that file's limitation disclosure
    }
  }

  labels = var.labels

  depends_on = [
    google_project_service.required,
    google_artifact_registry_repository.gateway_images,
  ]
}
