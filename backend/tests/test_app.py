import pytest
from moto import mock_aws
import boto3
import json
from app import lambda_handler  # Make sure this matches your lambda file name


@pytest.fixture
def aws_credentials():
    """Mocked AWS Credentials for moto"""
    import os
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"
    os.environ["AWS_DEFAULT_REGION"] = "us-east-1"


@pytest.fixture
def dynamodb_table(aws_credentials):
    with mock_aws():
        # Create the mock DynamoDB resource
        dynamodb = boto3.resource('dynamodb')

        # Create the table with the same schema as your actual table
        table = dynamodb.create_table(
            TableName='visitor-count-table',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 1,
                'WriteCapacityUnits': 1
            }
        )

        # Wait for the table to be created
        table.meta.client.get_waiter('table_exists').wait(
            TableName='visitor-count-table'
        )

        yield table


def test_first_visitor(dynamodb_table):
    """Test the first visitor case where counter starts at 0"""
    # Call the Lambda handler
    response = lambda_handler({}, None)

    # Verify the response structure and status code
    assert response['statusCode'] == 200
    assert 'headers' in response
    assert 'body' in response

    # Verify CORS headers
    headers = response['headers']
    assert headers['Access-Control-Allow-Headers'] == 'Content-Type'
    assert headers['Access-Control-Allow-Origin'] == 'https://d129pu071hahh1.cloudfront.net'
    assert headers['Access-Control-Allow-Methods'] == 'GET, POST, OPTIONS'

    # Verify the visitor count is 1 (first visitor)
    body = json.loads(response['body'])
    assert body['visitor_count'] == '1'


def test_subsequent_visitors(dynamodb_table):
    """Test multiple subsequent visitors increment the counter correctly"""
    # Call the Lambda handler multiple times
    first_response = lambda_handler({}, None)
    second_response = lambda_handler({}, None)
    third_response = lambda_handler({}, None)

    # Verify the counter increments properly
    first_count = json.loads(first_response['body'])['visitor_count']
    second_count = json.loads(second_response['body'])['visitor_count']
    third_count = json.loads(third_response['body'])['visitor_count']

    assert first_count == '1'
    assert second_count == '2'
    assert third_count == '3'


def test_existing_counter(dynamodb_table):
    """Test when there's an existing counter value"""
    # Manually set an initial counter value
    dynamodb_table.put_item(
        Item={
            'id': 'visitor_stats',
            'visitor_count': 42
        }
    )

    # Call the Lambda handler
    response = lambda_handler({}, None)

    # Verify the counter incremented from the existing value
    body = json.loads(response['body'])
    assert body['visitor_count'] == '43'


def test_error_handling(dynamodb_table):
    """Test error handling when DynamoDB operations fail"""
    # Delete the table to simulate a DynamoDB error
    dynamodb_table.delete()

    with pytest.raises(Exception):
        lambda_handler({}, None)


def test_response_format(dynamodb_table):
    """Test the detailed structure of the response"""
    response = lambda_handler({}, None)

    # Verify response structure
    assert isinstance(response, dict)
    assert set(response.keys()) == {'statusCode', 'headers', 'body'}

    # Verify headers
    assert isinstance(response['headers'], dict)
    expected_headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'https://d129pu071hahh1.cloudfront.net',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }
    assert response['headers'] == expected_headers

    # Verify body format
    body = json.loads(response['body'])
    assert isinstance(body, dict)
    assert 'visitor_count' in body
    assert body['visitor_count'].isdigit()
