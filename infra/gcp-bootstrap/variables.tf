# All values here are environment-specific inputs. None of them is a
# secret. Real values belong only in an operator-held, untracked .tfvars
# file — never in the .tfvars.example files under environments/, and never
# committed to this repository. Mirrors infra/gcp/variables.tf's own
# discipline.

# FOUNDER DECISION (Founder Backend Decision Closure, B1): the Terraform
# state bucket belongs to a DEDICATED state-management GCP project,
# separate from infra/gcp's own var.project_id. This variable has NO
# default — the exact project ID is OPERATOR INPUT / a DEPLOYMENT-TIME
# FACT, never invented here, mirroring infra/gcp/variables.tf's own
# project_id convention exactly.
variable "state_project_id" {
  description = "Dedicated GCP project ID that owns Terraform state resources (Founder Decision B1: DEDICATED STATE PROJECT). Must already exist; not created by this configuration. Never the same as infra/gcp's own project_id."
  type        = string
}

# DEPLOYMENT-TIME FACT / IMPLEMENTATION CONVENTION: reuses infra/gcp's own
# default (europe-west3, grounded in the Increment 008 cloud scorecard's
# EU/Germany residency evaluation) for consistency, not as a new decision.
# Override per environment if required.
variable "region" {
  description = "GCP region for the state buckets and any regional resources this root creates."
  type        = string
  default     = "europe-west3"
}

# IMPLEMENTATION CONVENTION — NOT A FOUNDER DECISION. Mirrors the existing
# short-ID + "${var...}" pattern already established in infra/gcp/variables.tf
# (runtime_service_account_id, deploy_service_account_id,
# zone2_api_runtime_service_account_id). No "-${environment}" suffix here:
# per Founder Decision D1 ("a dedicated Terraform State Service Account",
# singular) and the architecture diagram in Increment 025's authorizing
# instruction, ONE shared state identity is scoped to BOTH buckets via two
# separate, bucket-scoped IAM bindings (iam.tf) — not two separate
# identities.
variable "terraform_state_service_account_id" {
  description = "Short ID (not full email) for the dedicated Terraform State Service Account (Founder Decision D1). Implementation convention, not itself a Founder-specified name."
  type        = string
  default     = "decivexa-tf-state"
}

# IMPLEMENTATION CONVENTION — NOT A FOUNDER DECISION. GCS bucket names are
# GLOBALLY unique across all of GCP, not merely within a project — a
# purely static name like "decivexa-tfstate-staging" could collide with
# an unrelated bucket owned by anyone else. Rather than inventing a random
# suffix (explicitly discouraged unless genuinely required), this
# configuration derives a deterministic, collision-resistant name from
# var.state_project_id itself, which GCP already guarantees is globally
# unique. No bucket name is invented independently of that real,
# operator-supplied project ID.
variable "staging_bucket_suffix" {
  description = "Suffix appended to state_project_id to form the staging state bucket name (implementation convention, not a Founder-specified name)."
  type        = string
  default     = "tfstate-staging"
}

variable "production_bucket_suffix" {
  description = "Suffix appended to state_project_id to form the production state bucket name (implementation convention, not a Founder-specified name)."
  type        = string
  default     = "tfstate-production"
}

variable "labels" {
  description = "Common resource labels — mirrors infra/gcp/variables.tf's own labels convention."
  type        = map(string)
  default = {
    "managed-by" = "terraform"
    "increment"  = "025"
    "component"  = "terraform-state-bootstrap"
  }
}
