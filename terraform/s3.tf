resource "aws_s3_bucket" "lambda_bucket" {
  bucket = var.project_s3_name

  tags = {
    project = var.project_tag
  }
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket_controls" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket_controls]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}
