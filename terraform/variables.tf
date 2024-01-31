variable "project_name" {
  description = "Value of project lambda/api name"
  type        = string
  default     = "Template_BE"
}

variable "project_display_name" {
  description = "Value of project's display name"
  type        = string
  default     = "My Template App"
}

variable "project_s3_name" {
  description = "Value of project s3 bucket"
  type        = string
  default     = "template-lambda"
}

variable "project_tag" {
  description = "Value of project Tag"
  type        = string
  default     = "template"
}

variable "project_url" {
  description = "Value of project url"
  type        = string
  default     = "https://template.kevinpsites.com"
}

variable "project_api_url" {
  description = "Value of project API url"
  type        = string
  default     = "https://api.kevinpsites.com"
}

variable "project_dynamo_table_name" {
  description = "Value of project's main dynamo table"
  type        = string
  default     = "template.test"
}

variable "project_auth0_jwks" {
  description = "Value of project auth0 jwks"
  type        = string
  default     = "https://dev-cdy4xvtqdlpi2327.us.auth0.com/.well-known/jwks.json"
}

variable "project_auth0_audience" {
  description = "Value of project auth0 audience"
  type        = string
  default     = "https://api.kevinpsites.com"
}

variable "auth0_management_domain" {
  description = "Value of auth0 management domain"
  type        = string
  default     = "https://dev-cdy4xvtqdlpi2327.us.auth0.com/api/v2"
}


# variable "secret_var_example" {
#   description = "Value of secret"
#   type        = string
#   default     = "...."
#   sensitive   = true
# }
