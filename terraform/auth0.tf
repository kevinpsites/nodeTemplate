// API Permission List
locals {
  permissionArray = [
    "create:account",
    "read:account",
  ]
}


// API Definition
resource "auth0_resource_server" "auth0_api" {
  name        = "${var.project_display_name} API"
  identifier  = var.project_api_url
  signing_alg = "RS256"

  allow_offline_access                            = true
  token_lifetime                                  = 8600
  skip_consent_for_verifiable_first_party_clients = true

  # enable RBAC authorization
  enforce_policies = true

  # enable RBAC permissions claim
  token_dialect = "access_token_authz"
}

// API Scopes/Permissions
resource "auth0_resource_server_scope" "my_api_scopes" {
  for_each = toset(local.permissionArray)

  resource_server_identifier = auth0_resource_server.auth0_api.identifier
  scope                      = each.value
  description                = "Ability to ${each.value}"

}


// Roles
resource "auth0_role" "basic_user_role" {
  name        = "${var.project_tag} - Basic User"
  description = "Basic User Role for ${var.project_display_name} App"
}

resource "auth0_role_permission" "basic_user_role_permissions" {
  for_each = toset(local.permissionArray)

  resource_server_identifier = auth0_resource_server.auth0_api.identifier
  role_id                    = auth0_role.basic_user_role.id
  permission                 = each.value
}


// Backend APP
resource "auth0_client" "blc_app_backend" {
  name            = "${var.project_display_name} Backend"
  description     = "${var.project_display_name} Backend"
  app_type        = "non_interactive"
  callbacks       = ["http://localhost:3000", "http://localhost:3000/callback", "${var.project_url}/callback", replace(var.project_url, "https://", "https://www.")]
  oidc_conformant = true

  jwt_configuration {
    alg = "RS256"
  }

  native_social_login {
    apple {
      enabled = false
    }
    facebook {
      enabled = false
    }
  }
}


// Frontend Web App
resource "auth0_client" "app_web" {
  name                = "${var.project_display_name} Web App"
  description         = "${var.project_display_name} website"
  app_type            = "spa"
  callbacks           = ["http://localhost:3000", "http://localhost:3000/callback", "https://localhost:3003", "${var.project_url}/callback", replace(var.project_url, "https://", "https://www.")]
  web_origins         = ["http://localhost:3000", "https://localhost:3003", "${var.project_url}/", replace(var.project_url, "https://", "https://www.")]
  allowed_logout_urls = ["http://localhost:3000", "https://localhost:3003", "${var.project_url}/", replace(var.project_url, "https://", "https://www.")]

  oidc_conformant = true
  is_first_party  = true

  jwt_configuration {
    alg = "RS256"
  }

  native_social_login {
    apple {
      enabled = false
    }
    facebook {
      enabled = false
    }
  }
}
