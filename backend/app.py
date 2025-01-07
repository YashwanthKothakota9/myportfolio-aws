import boto3
import json


def lambda_handler(event, context):
    # boto3.setup_default_session(profile_name='iamadmin-general')
    dynamo_db = boto3.resource("dynamodb")
    table = dynamo_db.Table("visitor-count-table")

    table.update_item(
        Key={"id": "visitor_stats"},
        UpdateExpression="SET visitor_count = if_not_exists(visitor_count, :start) + :inc",
        ExpressionAttributeValues={":inc": 1, ":start": 0}
    )

    response = table.get_item(Key={"id": "visitor_stats"})
    count = response["Item"].get("visitor_count", 0)

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type",
            'Access-Control-Allow-Origin': "https://d129pu071hahh1.cloudfront.net",
            'Access-Control-Allow-Methods': "GET, POST, OPTIONS",
        },
        'body': json.dumps({'visitor_count': str(count)})
    }
