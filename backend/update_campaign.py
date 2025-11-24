import json
import os
import decimal
from datetime import datetime
import boto3
from utils.response import cors_response
from utils.validators import validate_campaign_body
from utils.calculations import calculate_margin

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["CAMPAIGNS_TABLE"])

def lambda_handler(event, context):
    cid = event["pathParameters"]["id"]
    body = json.loads(event.get("body", "{}"))

    ok, msg = validate_campaign_body(body)
    if not ok:
        return cors_response(400, {"message": msg})

    budget = float(body["budget"])
    units = float(body["units"])
    margin = calculate_margin(budget, units)

    now = datetime.utcnow().isoformat()

    res = table.update_item(
        Key={"campaignId": cid},
        UpdateExpression="""
            SET #n = :n, client = :c, platform = :p,
                budget = :b, units = :u, margin = :m, updatedAt = :uAt
        """,
        ExpressionAttributeNames={"#n": "name"},
        ExpressionAttributeValues={
            ":n": body["name"],
            ":c": body["client"],
            ":p": body["platform"],
            ":b": decimal.Decimal(str(budget)),
            ":u": decimal.Decimal(str(units)),
            ":m": decimal.Decimal(str(margin)),
            ":uAt": now,
        },
        ReturnValues="ALL_NEW",
    )

    return cors_response(200, res["Attributes"])
