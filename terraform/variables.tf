variable "project_id" {
  description = "The ID of the Google Cloud project."
}

variable "app_location_id" {
  description = "The region where the resources will be deployed."
  default     = "us-central"
}

# If you change bucket name here, make sure to change it in python code as well
variable "signedurl_bucket_name" {
  description = "The name of the storage bucket used for signed url uploads"
  default     = "signedurl-bucket"
}

variable "bucket_location" {
  description = "Location of the bucket used for signed url uploads"
  default     = "EU"
}