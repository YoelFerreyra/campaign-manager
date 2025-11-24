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

    update_expression = """
        SET #n = :n, client = :c, platform = :p,
            budget = :b, units = :u, margin = :m, updatedAt = :uAt
    """
    expression_attr_values = {
        ":n": body["name"],
        ":c": body["client"],
        ":p": body["platform"],
        ":b": decimal.Decimal(str(budget)),
        ":u": decimal.Decimal(str(units)),
        ":m": decimal.Decimal(str(margin)),
        ":uAt": now,
    }
    expression_attr_names = {"#n": "name"}

    if "image_url" in body and body["image_url"]:
        update_expression += ", image_url = :img"
        expression_attr_values[":img"] = body["image_url"]

    res = table.update_item(
        Key={"campaignId": cid},
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attr_names,
        ExpressionAttributeValues=expression_attr_values,
        ReturnValues="ALL_NEW",
    )

    return cors_response(200, res["Attributes"])
