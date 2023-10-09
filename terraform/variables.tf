variable "project_name" {
  description = "Value of project lambda/api name"
  type        = string
  default     = "Template_BE"
}

variable "project_tag" {
  description = "Value of project Tag"
  type        = string
  default     = "template"
}

variable "project_url" {
  description = "Value of project url"
  type        = string
  default     = "https://kevinpsites.com"
}

variable "project_dynamo_table_name" {
  description = "Value of project's main dynamo table"
  type        = string
  default     = "main.table"
}

variable "project_s3_name" {
  description = "Value of project s3 bucket"
  type        = string
  default     = "project-lambda"
}

variable "project_auth0_jwks" {
  description = "Value of project auth0 jwks"
  type        = string
  default     = "https://dev-cdy4xvtqdlpi2327.us.auth0.com/.well-known/jwks.json"
}


variable "project_auth0_audience" {
  description = "Value of project auth0 audience"
  type        = string
  default     = "https://571cp2h4ef.execute-api.us-east-1.amazonaws.com/prod"
}


# variable "secret_var_example" {
#   description = "Value of secret"
#   type        = string
#   default     = "...."
#   sensitive   = true
# }
