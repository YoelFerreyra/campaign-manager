import json
import os
import uuid
import decimal
import boto3
from datetime import datetime
from utils.response import cors_response
from utils.validators import validate_campaign_body
from utils.calculations import calculate_margin

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["CAMPAIGNS_TABLE"])

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
    except:
        return cors_response(400, {"message": "Invalid JSON"})

    ok, msg = validate_campaign_body(body)
    if not ok:
        return cors_response(400, {"message": msg})

    cid = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    budget = float(body["budget"])
    units = float(body["units"])
    margin = calculate_margin(budget, units)

    item = {
        "campaignId": cid,
        "name": body["name"],
        "client": body["client"],
        "platform": body["platform"],
        "budget": decimal.Decimal(str(budget)),
        "units": decimal.Decimal(str(units)),
        "margin": decimal.Decimal(str(margin)),
        "createdAt": now,
        "updatedAt": now,
    }

    table.put_item(Item=item)

    return cors_response(201, item)
