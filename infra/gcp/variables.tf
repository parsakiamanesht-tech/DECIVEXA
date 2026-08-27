# All values here are environment-specific inputs. None of them is a
# secret. Real values belong only in an operator-held, untracked .tfvars
# file — never in the .tfvars.example files under environments/, and never
# committed to this repository.

variable "project_id" {
  description = "GCP project ID. Must already exist; not created by this configuration."
  type        = string
}

variable "region" {
  description = "Primary GCP region for the Gateway runtime and supporting resources."
  type        = string
  default     = "europe-west3" # Frankfurt — satisfies the EU/Germany residency evaluation in the Increment 008 cloud scorecard. Override per environment if required.
}

variable "environment" {
  description = "Logical environment name (\"staging\" or \"production\"). Drives resource naming and IAM scoping."
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be exactly \"staging\" or \"production\"."
  }
}

variable "github_repository" {
  description = "GitHub repository in \"owner/repo\" form. Used to scope the Workload Identity Federation trust condition."
  type        = string
  default     = "parsakiamanesht-tech/DECIVEXA"
}

variable "github_deploy_branch" {
  description = "The single protected branch permitted to assume the deploy identity."
  type        = string
  default     = "main"
}

variable "github_production_environment_name" {
  description = "The GitHub Environment name whose approval gate this Terraform assumes exists (configured externally, see README.md). Used only to construct the WIF trust condition's expected `environment` claim — this Terraform does not create or configure the GitHub Environment itself."
  type        = string
  default     = "production"
}

variable "artifact_registry_repository_id" {
  description = "Artifact Registry repository ID that will hold the Gateway's immutable container images."
  type        = string
  default     = "decivexa-ai-gateway"
}

variable "gateway_image_digest" {
  description = "Immutable container image digest (\"sha256:...\") to deploy. No default: the absence of a default is deliberate — production deployment must never silently fall back to a mutable tag (Increment 009 §D.6 / §11 of the authorizing prompt)."
  type        = string

  validation {
    condition     = can(regex("^sha256:[0-9a-f]{64}$", var.gateway_image_digest))
    error_message = "gateway_image_digest must be a full \"sha256:<64 hex chars>\" digest, never a mutable tag such as \"latest\"."
  }
}

variable "allowed_provider_egress_hosts" {
  description = "Explicit allow-list of AI provider hostnames the Gateway may ever reach. Empty by default — fail-closed, matching the existing Gate-7 trusted-endpoint allow-list convention in apps/api/src/infrastructure/ai/gate7/gate7-provider-security.ts. Must remain empty until a Founder-approved provider/endpoint decision exists; this variable does not itself authorize any provider. This list is documentation of INTENT (which hostnames the application-layer allow-list will trust) — it is never itself consumed by the GCP firewall rule, which cannot enforce hostnames (see allowed_provider_egress_cidrs and network.tf's limitation disclosure)."
  type        = list(string)
  default     = []
}

# IaC-5 remediation (Increment 009 IaC Review, HIGH finding): GCP firewall
# rules operate on IP/CIDR ranges, never on hostnames — so
# allowed_provider_egress_hosts (above) cannot itself be consumed by
# network.tf's firewall rule. This variable is the explicit, separate
# input for the *resolved* IP/CIDR ranges that correspond to whatever
# provider hostnames are eventually approved. No default is provided
# (fail-closed: an unset value is a plan-time error if the firewall rule
# is ever activated, never a silent broad allow), and network.tf enforces
# that this list may never contain "0.0.0.0/0" and may never be
# non-empty while allowed_provider_egress_hosts is empty (or vice versa)
# — see the `lifecycle.precondition` on
# google_compute_firewall.allow_provider_https_egress.
variable "allowed_provider_egress_cidrs" {
  description = "Resolved IP/CIDR ranges corresponding to the hostnames in allowed_provider_egress_hosts, for consumption by the GCP firewall rule only. Must never be populated with \"0.0.0.0/0\" or any other unintentionally broad range. Empty by default. A future Founder-approved provider/endpoint decision must supply real, narrowly-scoped ranges here — this variable does not itself authorize any provider or endpoint."
  type        = list(string)
  default     = []

  validation {
    condition     = !contains(var.allowed_provider_egress_cidrs, "0.0.0.0/0")
    error_message = "allowed_provider_egress_cidrs must never contain \"0.0.0.0/0\" — this would silently open unrestricted provider egress. Supply narrowly-scoped, resolved ranges for the specific approved provider destination(s) only."
  }
}

variable "runtime_service_account_id" {
  description = "Short ID (not full email) for the Gateway runtime service account."
  type        = string
  default     = "decivexa-gw-runtime"
}

variable "deploy_service_account_id" {
  description = "Short ID (not full email) for the CI/CD deploy service account."
  type        = string
  default     = "decivexa-gw-deploy"
}

# Increment 019 Founder Decision A3: the exact, Founder-approved naming
# convention for apps/api's own dedicated Zone-2 Runtime Service Account —
# never the Gateway's own runtime/deploy identity.
variable "zone2_api_runtime_service_account_id" {
  description = "Short ID (not full email) for the apps/api (Zone-2) runtime service account. Founder-approved convention (Increment 019 A3): \"decivexa-api-runtime\"."
  type        = string
  default     = "decivexa-api-runtime"
}

# Increment 020 Workstream B: names the Secret Manager container that will
# eventually hold the Zone-3 OpenAI provider credential (Increment 019
# Decision B1). This is a non-secret resource NAME only — no default here
# implies or creates a secret VALUE; no google_secret_manager_secret_version
# exists anywhere in this configuration.
variable "provider_credential_secret_id" {
  description = "Secret Manager secret ID (name only, not a value) that will hold the Zone-3 OpenAI provider API key. No secret version is created by this configuration."
  type        = string
  default     = "openai-provider-credential"
}

variable "labels" {
  description = "Common resource labels."
  type        = map(string)
  default = {
    "managed-by" = "terraform"
    "increment"  = "009"
    "component"  = "ai-gateway-foundation"
  }
}
