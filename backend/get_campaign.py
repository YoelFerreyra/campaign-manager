import boto3
import os
from utils.response import cors_response

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["CAMPAIGNS_TABLE"])

def lambda_handler(event, context):
    cid = event["pathParameters"]["id"]

    res = table.get_item(Key={"campaignId": cid})
    if "Item" not in res:
        return cors_response(404, {"message": "Campaign not found"})

    return cors_response(200, res["Item"])
