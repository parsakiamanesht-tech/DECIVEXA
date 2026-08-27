# Network boundary foundation (Increment 009 §D.11 / §10 of the
# authorizing prompt). See README.md "Network boundary — honest limitation
# disclosure" for the exact scope of what this file can and cannot enforce.

resource "google_compute_network" "gateway_vpc" {
  project                 = var.project_id
  name                    = "${local.resource_prefix}-gw-vpc"
  auto_create_subnetworks = false

  depends_on = [google_project_service.required]
}

resource "google_compute_subnetwork" "gateway_subnet" {
  project       = var.project_id
  name          = "${local.resource_prefix}-gw-subnet"
  network       = google_compute_network.gateway_vpc.id
  region        = var.region
  ip_cidr_range = "10.20.0.0/24"

  # Private Google Access lets the Gateway reach Google APIs (Logging,
  # Artifact Registry pulls, future WIF token exchange) without public
  # internet egress for those calls specifically.
  private_ip_google_access = true
}

resource "google_vpc_access_connector" "gateway_egress" {
  project       = var.project_id
  name          = "${local.resource_prefix}-gw-egress"
  region        = var.region
  ip_cidr_range = "10.20.1.0/28"
  network       = google_compute_network.gateway_vpc.name

  depends_on = [google_project_service.required]
}

# Static-IP NAT egress path. This is the defense-in-depth mechanism this
# configuration can actually provide: a small, fixed set of public IPs the
# Gateway's outbound traffic originates from — useful for a *future*
# provider-side IP allowlist (if the eventually-approved provider supports
# one), but NOT a hostname-based restriction. GCP firewall/NAT rules cannot
# natively restrict egress to "api.anthropic.com" by name; DNS-based egress
# filtering would require an additional, not-yet-justified component
# (e.g. a forward proxy performing SNI/hostname inspection), which is not
# built here per the Minimum Necessary Architecture principle — the
# existing, tested application-layer checks
# (assertHttpsScheme/assertNotPrivateOrInternalDestination/trusted-endpoint
# allow-list, unmodified by this configuration) remain the authoritative
# destination-integrity control.
resource "google_compute_router" "gateway_router" {
  project = var.project_id
  name    = "${local.resource_prefix}-gw-router"
  region  = var.region
  network = google_compute_network.gateway_vpc.id
}

resource "google_compute_router_nat" "gateway_nat" {
  project                            = var.project_id
  name                                = "${local.resource_prefix}-gw-nat"
  router                              = google_compute_router.gateway_router.name
  region                              = var.region
  nat_ip_allocate_option              = "MANUAL_ONLY"
  nat_ips                             = [google_compute_address.gateway_nat_ip.self_link]
  source_subnetwork_ip_ranges_to_nat  = "LIST_OF_SUBNETWORKS"

  subnetwork {
    name                    = google_compute_subnetwork.gateway_subnet.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }
}

resource "google_compute_address" "gateway_nat_ip" {
  project = var.project_id
  name    = "${local.resource_prefix}-gw-nat-ip"
  region  = var.region
}

# Fail-closed default: deny all egress from the Gateway subnet except what
# is explicitly allowed below. If var.allowed_provider_egress_hosts is
# empty (the default — no provider approved yet), the only permitted
# egress is to Google APIs via Private Google Access; nothing reaches the
# public internet.
resource "google_compute_firewall" "deny_all_egress" {
  project   = var.project_id
  name      = "${local.resource_prefix}-gw-deny-all-egress"
  network   = google_compute_network.gateway_vpc.name
  direction = "EGRESS"
  priority  = 65534

  deny {
    protocol = "all"
  }

  destination_ranges = ["0.0.0.0/0"]
}

# Explicit HTTPS-only allow, evaluated before the deny-all rule above,
# activated only when the Founder has approved at least one provider
# destination (var.allowed_provider_egress_hosts is non-empty in a future
# increment). Restricted to port 443; still cannot restrict by hostname at
# this layer — see the limitation disclosure above and in
# variables.tf's allowed_provider_egress_cidrs documentation.
#
# IaC-5 remediation (Increment 009 IaC Review, HIGH finding): this rule
# previously activated (count = 1) whenever allowed_provider_egress_hosts
# was non-empty, but hardcoded destination_ranges = [] regardless — an
# invalid, non-functional state that risked being "fixed" in the future by
# someone hardcoding "0.0.0.0/0" to make it apply. destination_ranges now
# consumes var.allowed_provider_egress_cidrs directly (the dedicated,
# separately-validated CIDR input — never hostnames), and this resource's
# own count condition and lifecycle precondition together guarantee: (a)
# the rule stays inert while no provider is approved (both lists empty);
# (b) if hostnames are ever configured, matching resolved CIDRs MUST also
# be configured, or Terraform refuses to plan/apply rather than silently
# falling back to no restriction or to a broad one.
resource "google_compute_firewall" "allow_provider_https_egress" {
  count = length(var.allowed_provider_egress_hosts) > 0 ? 1 : 0

  project   = var.project_id
  name      = "${local.resource_prefix}-gw-allow-provider-https"
  network   = google_compute_network.gateway_vpc.name
  direction = "EGRESS"
  priority  = 1000

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  destination_ranges = var.allowed_provider_egress_cidrs

  lifecycle {
    precondition {
      condition     = length(var.allowed_provider_egress_hosts) == 0 || length(var.allowed_provider_egress_cidrs) > 0
      error_message = "allowed_provider_egress_hosts is non-empty but allowed_provider_egress_cidrs is empty. Resolved IP/CIDR ranges must be supplied for every approved provider hostname before this firewall rule can apply — it must never fall back to unrestricted egress. See variables.tf."
    }
    precondition {
      condition     = !contains(var.allowed_provider_egress_cidrs, "0.0.0.0/0")
      error_message = "allowed_provider_egress_cidrs must never contain \"0.0.0.0/0\"."
    }
  }
}
