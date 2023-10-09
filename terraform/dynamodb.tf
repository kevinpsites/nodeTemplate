resource "aws_dynamodb_table" "main_dynamo" {
  name         = var.project_dynamo_table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "hashId"
  range_key = "rangeId"

  server_side_encryption {
    enabled = true
  }

  attribute {
    name = "hashId"
    type = "S"
  }

  attribute {
    name = "rangeId"
    type = "S"
  }


  // secondary index fields/definition
  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdOn"
    type = "N"
  }

  global_secondary_index {
    name            = "userId_idx"
    hash_key        = "userId"
    range_key       = "createdOn"
    projection_type = "ALL"
  }

  tags = {
    project = var.project_tag
  }
}
