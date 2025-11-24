import os
import boto3
from utils.response import cors_response

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["CAMPAIGNS_TABLE"])

def lambda_handler(event, context):
    cid = event["pathParameters"]["id"]

    res = table.get_item(Key={"campaignId": cid})
    if "Item" not in res:
        return cors_response(404, {"message": "Not found"})

    table.delete_item(Key={"campaignId": cid})

    return cors_response(204, {})
