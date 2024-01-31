variable "project_bucket_name" {
  type        = string
  description = "The name of the bucket without the www. prefix. Normally domain_name."
  default     = "template_frontend"
}

variable "project_name" {
  description = "Value of project lambda/api name"
  type        = string
  default     = "Template_FE"
}

variable "project_display_name" {
  description = "Value of project's display name"
  type        = string
  default     = "My Template App"
}

variable "project_s3_name" {
  description = "Value of project s3 bucket"
  type        = string
  default     = "template-frontend"
}

variable "project_tag" {
  description = "Value of project Tag"
  type        = string
  default     = "template"
}

variable "project_url" {
  description = "Value of project url"
  type        = string
  default     = "template.kevinpsites.com"
}
