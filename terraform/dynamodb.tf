resource "aws_dynamodb_table" "main_dynamo" {
  name         = var.project_dynamo_table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "hashID"
  range_key = "rangeID"

  server_side_encryption {
    enabled = true
  }

  attribute {
    name = "hashID"
    type = "S"
  }

  attribute {
    name = "rangeID"
    type = "S"
  }


  // secondary index fields/definition
  attribute {
    name = "userID"
    type = "S"
  }

  attribute {
    name = "createdOn"
    type = "N"
  }

  global_secondary_index {
    name            = "userID_idx"
    hash_key        = "userID"
    range_key       = "rangeID"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "createdOn_idx"
    hash_key        = "userID"
    range_key       = "createdOn"
    projection_type = "ALL"
  }

  tags = {
    project = var.project_tag
  }
}
