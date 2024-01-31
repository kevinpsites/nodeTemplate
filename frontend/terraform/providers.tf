terraform {
  backend "s3" {
    bucket  = "projects-tf-state"
    key     = "${vars.project_s3_name}-tf-state"
    region  = "us-east-1"
    profile = "portfolio"
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
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region  = "us-east-1"
  profile = "portfolio"
}

provider "aws" {
  alias   = "acm_provider"
  region  = "us-east-1"
  profile = "portfolio"
}
