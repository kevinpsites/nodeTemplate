variable "auth0_domain" {}
variable "auth0_client_id" {}
variable "auth0_client_secret" {}

terraform {
  backend "s3" {
    bucket = "projects-tf-state"
    key    = "${vars.project_s3_name}-tf-state"
    region = "us-east-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }

    auth0 = {
      source  = "auth0/auth0"
      version = "1.1.1"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region  = "us-east-1"
  profile = "portfolio"
}

provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}
