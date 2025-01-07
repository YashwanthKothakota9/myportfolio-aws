provider "aws" {
  region  = "us-east-1"
  # profile = "iamadmin-general"
}

terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket-93a441a1"
    key            = "terraform/state.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
    # profile        = "iamadmin-general"
  }
}


resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "frontend-s3-bucket-${random_id.s3_bucket_id.hex}"


  tags = {
    Name = "Frontend S3 Bucket"
  }
}

data "aws_caller_identity" "current" {}


resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "s3:GetObject",
        Effect   = "Allow",
        Resource = "${aws_s3_bucket.frontend_bucket.arn}/*",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${aws_cloudfront_distribution.frontend_distribution.id}"
          }
        }
      }
    ]
  })
}


resource "random_id" "s3_bucket_id" {
  byte_length = 8
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "frontend-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend_distribution" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend_bucket.id}"

    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend_bucket.id}"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "Frontend CloudFront Distribution"
  }
}


resource "aws_dynamodb_table" "visitor_count" {
  name         = "visitor-count-table"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }


  hash_key = "id"

  tags = {
    Name = "Visitor Count DynamoDB Table"
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda-execution-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "lambda_policy_attachment" {
  name       = "lambda-access-policy"
  roles      = [aws_iam_role.lambda_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "visitor-count-api"
  protocol_type = "HTTP"
}

resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.backend_lambda.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /visitor-count"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

data "archive_file" "lambda"{
  type = "zip"
  source_dir = "${path.module}/backend"
  output_path = "${path.module}/lambda_function_payload.zip"
}

resource "aws_lambda_function" "backend_lambda" {
  filename = "${path.module}/lambda_function_payload.zip"
  function_name = "backend-function"
  runtime       = "python3.9"
  handler       = "app.lambda_handler"

  role      = aws_iam_role.lambda_role.arn
  source_code_hash = data.archive_file.lambda.output_base64sha256

  publish = true

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.visitor_count.name
    }
  }
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.visitor_count.name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend_distribution.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.bucket
}

output "lambda_function_name" {
  value = aws_lambda_function.backend_lambda.function_name
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}