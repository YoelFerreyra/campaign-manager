import json
import os
import decimal
import uuid
import boto3
from datetime import datetime
from utils.response import cors_response
from utils.validators import validate_campaign_body
from utils.calculations import calculate_margin

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('CAMPAIGNS_TABLE', 'Campaigns')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    method = event.get('httpMethod')
    path = event.get('path', '')
    path_params = event.get('pathParameters') or {}
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except json.JSONDecodeError:
            return cors_response(400, {"message": "Invalid JSON body"})

    # --- Preflight OPTIONS ---
    if method == 'OPTIONS':
        return cors_response(200, {"message": "OK"})

    # --- POST /campaigns ---
    if method == 'POST' and path.endswith('/campaigns'):
        ok, msg = validate_campaign_body(body)
        if not ok:
            return cors_response(400, {"message": msg})
        cid = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        budget = float(body['budget'])
        units = float(body['units'])
        margin = calculate_margin(budget, units)
        item = {
            "campaignId": cid,
            "name": body['name'],
            "client": body['client'],
            "platform": body['platform'],
            "budget": decimal.Decimal(str(budget)),
            "units": decimal.Decimal(str(units)),
            "margin": decimal.Decimal(str(margin)),
            "createdAt": now,
            "updatedAt": now
        }
        table.put_item(Item=item)
        return cors_response(201, item)

    # --- GET /campaigns ---
    if method == 'GET' and path.endswith('/campaigns'):
        res = table.scan()
        items = res.get('Items', [])
        return cors_response(200, items)

    # --- GET /campaigns/{id} ---
    if method == 'GET' and path.startswith('/campaigns/') and path_params.get('id'):
        cid = path_params['id']
        res = table.get_item(Key={"campaignId": cid})
        item = res.get('Item')
        if not item:
            return cors_response(404, {"message": "Campaign not found"})
        return cors_response(200, item)

    # --- PUT /campaigns/{id} ---
    if method == 'PUT' and path.startswith('/campaigns/') and path_params.get('id'):
        cid = path_params['id']
        ok, msg = validate_campaign_body(body)
        if not ok:
            return cors_response(400, {"message": msg})
        budget = float(body['budget'])
        units = float(body['units'])
        margin = calculate_margin(budget, units)
        now = datetime.utcnow().isoformat()
        update_expr = "SET #n = :n, client = :c, platform = :p, budget = :b, units = :u, margin = :m, updatedAt = :uAt"
        attr_names = {"#n": "name"}
        attr_values = {
            ":n": body['name'],
            ":c": body['client'],
            ":p": body['platform'],
            ":b": decimal.Decimal(str(budget)),
            ":u": decimal.Decimal(str(units)),
            ":m": decimal.Decimal(str(margin)),
            ":uAt": now
        }
        res = table.update_item(
            Key={"campaignId": cid},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=attr_names,
            ExpressionAttributeValues=attr_values,
            ReturnValues="ALL_NEW"
        )
        return cors_response(200, res.get('Attributes'))

    # --- DELETE /campaigns/{id} ---
    if method == 'DELETE' and path.startswith('/campaigns/') and path_params.get('id'):
        cid = path_params['id']
        res = table.get_item(Key={"campaignId": cid})
        if 'Item' not in res:
            return cors_response(404, {"message": "Campaign not found"})
        table.delete_item(Key={"campaignId": cid})
        return cors_response(204, {})

    return cors_response(404, {"message": "Not Found"})
