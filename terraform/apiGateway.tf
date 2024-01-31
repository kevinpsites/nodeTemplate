resource "aws_apigatewayv2_api" "lambda" {
  name          = var.project_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["http://localhost:3000", var.project_url, replace(var.project_url, "https://", "https://www.")]
    allow_methods = ["POST", "GET", "PUT", "DELETE"]
    allow_headers = ["content-type", "Authorization", "authorization"]
    max_age       = 300
  }

  tags = {
    project = var.project_tag
  }

}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "prod" // STAGE VARIABLE
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }

  tags = {
    project = var.project_tag
  }
}

resource "aws_apigatewayv2_integration" "main_lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.main_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "route_status" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /status"
  target    = "integrations/${aws_apigatewayv2_integration.main_lambda.id}"
}

resource "aws_apigatewayv2_route" "route_error" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /error"
  target    = "integrations/${aws_apigatewayv2_integration.main_lambda.id}"
}

locals {
  routes = [
    "GET /account",
    "POST /account",
  ]
}

// All ROUTES
resource "aws_apigatewayv2_route" "api_routes" {
  for_each = toset(local.routes)

  api_id = aws_apigatewayv2_api.lambda.id

  route_key = each.value
  target    = "integrations/${aws_apigatewayv2_integration.main_lambda.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 1
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.main_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

resource "aws_apigatewayv2_domain_name" "api_gw_domain" {
  domain_name = replace(var.project_api_url, "https://", "")
  domain_name_configuration {
    certificate_arn = data.aws_acm_certificate.cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = {
    project = var.project_tag
  }
}

resource "aws_apigatewayv2_api_mapping" "api_gw_domain_mapping" {
  api_id      = aws_apigatewayv2_api.lambda.id
  domain_name = aws_apigatewayv2_domain_name.api_gw_domain.domain_name
  stage       = aws_apigatewayv2_stage.lambda.name
}
