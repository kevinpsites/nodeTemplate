resource "aws_lambda_function" "main_lambda" {
  function_name = var.project_name

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_index_function.key

  runtime = "nodejs18.x"
  handler = "index.handler"

  source_code_hash = data.archive_file.lambda_index_function.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  layers = [
    aws_lambda_layer_version.lambda_basics_layer.arn,
  ]

  environment {
    variables = {
      DYNAMO_TABLE   = aws_dynamodb_table.main_dynamo.name,
      S3_BUCKET_NAME = aws_s3_bucket.lambda_bucket.bucket,

      AUTH0_JWKS         = var.project_auth0_jwks
      AUTH0_API_AUDIENCE = var.project_auth0_audience
    }
  }

  timeout = 30

  tags = {
    project = var.project_tag
  }
}

resource "aws_cloudwatch_log_group" "main_lambda" {
  name = "/aws/lambda/${aws_lambda_function.main_lambda.function_name}"

  retention_in_days = 1

  tags = {
    project = var.project_tag
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy" "policy" {
  name = "policy"

  role = aws_iam_role.lambda_exec.id

  policy = data.aws_iam_policy_document.s3_policy_doc.json
}

data "aws_iam_policy_document" "s3_policy_doc" {
  statement {
    actions = [
      "s3:*",
      "s3:PutObject",
      "s3:GetObject",
      "dynamodb:*", // TO-DO - restrict to table
      "dynamodb:Query"
    ]

    resources = [
      aws_s3_bucket.lambda_bucket.arn,
      "${aws_s3_bucket.lambda_bucket.arn}/*",
      aws_dynamodb_table.main_dynamo.arn,
      "${aws_dynamodb_table.main_dynamo.arn}/*"
    ]
  }
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

// LAYERS
resource "aws_lambda_layer_version" "lambda_basics_layer" {
  filename   = "${path.module}/../layers/lambdaBasics.zip"
  layer_name = "lambda_basics"

  compatible_runtimes = ["nodejs18.x"]
}
