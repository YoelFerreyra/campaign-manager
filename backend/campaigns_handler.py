import json
import os
import decimal
import uuid
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('CAMPAIGNS_TABLE', 'Campaigns')
table = dynamodb.Table(TABLE_NAME)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        return super(DecimalEncoder, self).default(obj)

# --- Wrapper CORS ---
def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": json.dumps(body, cls=DecimalEncoder)
    }

def validate_campaign_body(body):
    required = ['name', 'client', 'platform', 'budget', 'units']
    for field in required:
        if field not in body:
            return False, f"Missing field: {field}"
    try:
        budget = float(body['budget'])
        units = float(body['units'])
    except (ValueError, TypeError):
        return False, "budget and units must be numeric"
    if units <= 0:
        return False, "units must be > 0"
    if budget < 0:
        return False, "budget must be >= 0"
    return True, ""

def calculate_margin(budget, units):
    try:
        return float(budget) / float(units) if float(units) != 0 else 0.0
    except Exception:
        return 0.0

def lambda_handler(event, context):
    method = event.get('httpMethod')
    path = event.get('path', '')
    path_params = event.get('pathParameters') or {}
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except json.JSONDecodeError:
            return response(400, {"message": "Invalid JSON body"})

    # --- Preflight OPTIONS ---
    if method == 'OPTIONS':
        return response(200, {"message": "OK"})

    # --- POST /campaigns ---
    if method == 'POST' and path.endswith('/campaigns'):
        ok, msg = validate_campaign_body(body)
        if not ok:
            return response(400, {"message": msg})
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
        return response(201, item)

    # --- GET /campaigns ---
    if method == 'GET' and path.endswith('/campaigns'):
        res = table.scan()
        items = res.get('Items', [])
        return response(200, items)

    # --- GET /campaigns/{id} ---
    if method == 'GET' and path.startswith('/campaigns/') and path_params.get('id'):
        cid = path_params['id']
        res = table.get_item(Key={"campaignId": cid})
        item = res.get('Item')
        if not item:
            return response(404, {"message": "Campaign not found"})
        return response(200, item)

    # --- PUT /campaigns/{id} ---
    if method == 'PUT' and path.startswith('/campaigns/') and path_params.get('id'):
        cid = path_params['id']
        ok, msg = validate_campaign_body(body)
        if not ok:
            return response(400, {"message": msg})
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
        return response(200, res.get('Attributes'))

    # --- DELETE /campaigns/{id} ---
    if method == 'DELETE' and path.startswith('/campaigns/') and path_params.get('id'):
        cid = path_params['id']
        res = table.get_item(Key={"campaignId": cid})
        if 'Item' not in res:
            return response(404, {"message": "Campaign not found"})
        table.delete_item(Key={"campaignId": cid})
        return response(204, {})

    return response(404, {"message": "Not Found"})
