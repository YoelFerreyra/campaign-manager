import boto3
import os
from utils.response import cors_response

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["CAMPAIGNS_TABLE"])

def lambda_handler(event, context):
    res = table.scan()
    return cors_response(200, res.get("Items", []))
