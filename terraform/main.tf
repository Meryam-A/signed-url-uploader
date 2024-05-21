provider "google" {
  project = var.project_id
}

# Create App Engine Application
resource "google_app_engine_application" "app" {
  project = var.project_id
  location_id = var.app_location_id
}

# Retrieve default service account
data "google_app_engine_default_service_account" "default" {
    depends_on = [google_app_engine_application.app]
}

# Grant App Engine's default SA token creator role
resource "google_project_iam_member" "app_engine_token_creator" {
  project = var.project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${data.google_app_engine_default_service_account.default.email}"
  depends_on = [data.google_app_engine_default_service_account.default]
}

# Create storage bucket and set up cors configuration
resource "google_storage_bucket" "signedurl-bucket" {
  name          = var.signedurl_bucket_name
  location      = var.bucket_location

  cors {
    origin          = ["*"]
    method          = ["*"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}