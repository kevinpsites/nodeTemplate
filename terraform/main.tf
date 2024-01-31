data "archive_file" "lambda_index_function" {
  type = "zip"

  source_dir  = "${path.module}/../lambdaFunction"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_s3_object" "lambda_index_function" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "lambda.zip"
  source = data.archive_file.lambda_index_function.output_path

  etag = filemd5(data.archive_file.lambda_index_function.output_path)
}

// LOOK UP CERTIFICATE
data "aws_acm_certificate" "cert" {
  domain      = replace(var.project_url, "https://", "")
  statuses    = ["ISSUED"]
  most_recent = true

  tags = {
    project = var.project_tag
  }
}
