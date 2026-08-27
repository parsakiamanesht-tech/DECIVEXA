# Required APIs for the state-management project. Enabling an API is a
# declarative, credential-free-to-author (though not credential-free-to-
# apply) prerequisite — it grants no permissions by itself. Mirrors
# infra/gcp/main.tf's own google_project_service pattern.
resource "google_project_service" "required" {
  for_each = toset([
    "storage.googleapis.com",
    "iam.googleapis.com",
  ])

  project            = var.state_project_id
  service            = each.value
  disable_on_destroy = false
}
