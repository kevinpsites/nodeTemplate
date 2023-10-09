resource "aws_apigatewayv2_api" "lambda" {
  name          = var.project_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [var.project_url, "http://localhost:3000"]
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

# resource "aws_apigatewayv2_route" "route_vars" {
#   api_id = aws_apigatewayv2_api.lambda.id

#   route_key = "GET /route/{myVar}"
#   target    = "integrations/${aws_apigatewayv2_integration.main_lambda.id}"
# }

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
